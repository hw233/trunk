import ConfigManager from '../../../../common/managers/ConfigManager';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PiecesModel from '../../../../common/models/PiecesModel';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PvePiecesUpStarNoticeViewCtrl from '../../ctrl/view/pieces/PvePiecesUpStarNoticeViewCtrl';
import PveSceneBaseAction from '../base/PveSceneBaseAction';
import PveSceneModel from '../../model/PveSceneModel';
import PveSceneState from '../../enum/PveSceneState';
import { Pieces_globalCfg, Pieces_power1Cfg, Pieces_power2Cfg } from '../../../../a/config';
import { PiecesEventId } from '../../../pieces/enum/PiecesEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-22 10:36:10 
  */


@gdk.fsm.action("PveSceneWaveOverAction", "Pve/Scene")
export default class PveSceneWaveOverAction extends PveSceneBaseAction {
  onEnter() {
    super.onEnter();
    if (this.model.arenaSyncData.mainModel.proteges[0].model.hp <= 0 || [PveSceneState.Win, PveSceneState.Exiting, PveSceneState.Over].indexOf(this.model.arenaSyncData.mainModel.state) !== -1) return; //无尽/自走棋最后一波主动结束
    //更新状态
    this.model.state = PveSceneState.WaveOver;
    //最后一波
    if (this._checkIsOver(this.model)) {
      if (!this.model.isMirror) {
        this.model.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_WIN);
      }
      return;
    }

    this.model.waveBeginning = false;

    //指挥官更新天赋技能
    this.model.generals.forEach(g => {
      g.fsm.start();
    });

    this.model.showHeroEffect = true;

    //更新怪物战力系数
    if (this.model.arenaSyncData.fightType == 'PIECES_CHESS') {
      let c = ConfigManager.getItems(Pieces_power1Cfg);
      let rewardType = Math.min(c[c.length - 1].type, ModelManager.get(PiecesModel).curRewardType);
      this.model.arenaSyncData.pwoer = ConfigManager.getItemByField(Pieces_power1Cfg, 'round', this.model.wave + 1, { type: rewardType }).general;
    } else if (this.model.arenaSyncData.fightType == 'PIECES_ENDLESS') {
      let c2 = ConfigManager.getItems(Pieces_power2Cfg);
      let type = Math.min(c2[c2.length - 1].type, ModelManager.get(PiecesModel).curRewardType);
      let pCfg = ConfigManager.getItemByField(Pieces_power2Cfg, 'round', this.model.wave + 1, { type: type });
      this.model.arenaSyncData.pwoer = pCfg.endless * pCfg.monster_power / 100;
    }

    //更新AI方英雄列表
    if (this.model.isMirror) {
      // this.model.heroMap = {};
      let pM = ModelManager.get(PiecesModel);
      let isKillAll = this.model.arenaSyncData.mainModel.arrivalEnemy <= pM.lastWaveArrivalEnemy;
      pM.lastWaveArrivalEnemy = this.model.arenaSyncData.mainModel.arrivalEnemy;
      let req = new icmsg.PiecesRoundEndReq();
      req.type = pM.curModel;
      req.isKillAll = isKillAll;
      req.nowRound = this.model.arenaSyncData.mainModel.wave;
      req.playerHP = this.model.arenaSyncData.mainModel.proteges[0].model.hp;
      NetManager.send(req, (resp: icmsg.PiecesRoundEndRsp) => {
        //更新过关波次
        ModelManager.get(PiecesModel).passWave = this.model.wave;
        //检查升星情况
        this._checkAiHeroStarUp(resp, this.model);
        //清空
        this.model.towers.forEach(t => { t.setHeroByItem(null); })
        //更新
        this.model.towers.forEach(t => {
          let item = HeroUtils.createHeroBagItemBy(resp.p1.heroList[t.id - 1]);
          let info = item.extInfo as icmsg.HeroInfo;
          item.series = 900000 + info.heroId;
          this.model.heroMap[item.series] = resp.p1.heroList[t.id - 1];
          t.setHeroByItem(item, true);
          //还原位置
          // t.hero.fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_BEGIN_CUSTOM);
          // t.hero.fsm.sendEvent(PveFsmEventId.PVE_FIGHT_END_CUSTOM);
          t.hero.fsm.start();
          t.hero.node.setPosition(t.node.getPos());
        });
        gdk.e.emit(PiecesEventId.PIECES_PVP_ENEMY_DEPLOY_OVER);
        if (this.model.arenaSyncData.fightType == 'PIECES_ENDLESS') {
          this.model.arenaSyncData.waveTimeOut = 1;
          this.model.arenaSyncData.mainModel.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_PIECES_WAVE_START);
          this.model.arenaSyncData.mirrorModel.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_PIECES_WAVE_START);
        }
      }, this);
    }
    else {
      this.model.towers.forEach(t => {
        if (t.hero) {
          // t.hero.fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_BEGIN_CUSTOM);
          // t.hero.fsm.sendEvent(PveFsmEventId.PVE_FIGHT_END_CUSTOM);
          let buffWave = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'save').value[0];
          let m = ModelManager.get(PiecesModel);
          let startWave = m.startRound ? m.startRound : 0;
          if (this.model.wave !== startWave && (this.model.wave - startWave) % buffWave == 0) {
            t.hero.fsm.start();
          }
          t.hero.node.setPosition(t.node.getPos());
        }
      })
    }
  }


  onExit() {
    NetManager.targetOff(this);
    super.onExit();
  }

  _checkAiHeroStarUp(resp: icmsg.PiecesRoundEndRsp, model: PveSceneModel) {
    let newHeros: { [id: number]: icmsg.FightHero } = {};
    resp.p1.heroList.forEach(l => { newHeros[l.heroId] = l; });
    model.towers.forEach(t => {
      if (t.hero) {
        let info = t.hero.model.info;
        if (newHeros[info.heroId] && newHeros[info.heroId].heroStar > info.heroStar) {
          if (model.arenaSyncData.fightType == 'PIECES_ENDLESS') {
            //追加升星弹幕
            let panel = gdk.panel.get(PanelId.PvePiecesUpStarNoticeView);
            if (!panel) {
              gdk.panel.setArgs(PanelId.PvePiecesUpStarNoticeView, [2, model.arenaSyncData.defenderName, newHeros[info.heroId]]);
              gdk.panel.open(PanelId.PvePiecesUpStarNoticeView, null, this, {
                parent: gdk.gui.layers.guideLayer
              });
            }
            else {
              let ctrl = panel.getComponent(PvePiecesUpStarNoticeViewCtrl);
              ctrl.addBarrage(2, model.arenaSyncData.defenderName, newHeros[info.heroId]);
            }
          }
          else {
            gdk.e.emit(PiecesEventId.PIECES_PVP_HERO_UP_STAR, [2, model.arenaSyncData.defenderName, newHeros[info.heroId]]);
          }
        }
      }
    });
  }

  _checkIsOver(m: PveSceneModel) {
    let finalWave = 9999;
    if (m.arenaSyncData.fightType == 'PIECES_CHESS') {
      finalWave = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'round1').value[0];
    }
    else if (m.arenaSyncData.fightType == 'PIECES_ENDLESS') {
      finalWave = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'round2').value[0];
    }
    return m.wave >= finalWave;
  }
}
