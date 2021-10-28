import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import PiecesModel from '../../../../../common/models/PiecesModel';
import PveFsmEventId from '../../../enum/PveFsmEventId';
import PvePiecesHeroSelectViewCtrl from './PvePiecesHeroSelectViewCtrl';
import PvePiecesHeroSellCtrl from './PvePiecesHeroSellCtrl';
import PvePiecesUpStarNoticeViewCtrl from './PvePiecesUpStarNoticeViewCtrl';
import PveSceneCtrl from '../../PveSceneCtrl';
import PveSceneModel from '../../../model/PveSceneModel';
import PveSceneState from '../../../enum/PveSceneState';
import { Pieces_globalCfg, Pieces_refreshCfg } from '../../../../../a/config';
import { PiecesEventId } from '../../../../pieces/enum/PiecesEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-20 11:33:03 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesBotCtrl")
export default class PvePiecesBotCtrl extends cc.Component {
  @property(cc.Node)
  handCardArea: cc.Node = null;

  @property([cc.Node])
  handCards: cc.Node[] = [];

  @property(cc.Node)
  fightBtn: cc.Node = null;

  @property(cc.Node)
  buyBtn: cc.Node = null;

  @property(cc.Node)
  sellNode: cc.Node = null;

  @property(cc.Node)
  shrinkBtn: cc.Node = null;

  @property(cc.Prefab)
  dragPrefab: cc.Prefab = null;

  @property(cc.Node)
  pauseBtn: cc.Node = null;

  @property(cc.Node)
  timeScaleBtn: cc.Node = null;

  get piecesModel(): PiecesModel { return ModelManager.get(PiecesModel); }

  model: PveSceneModel;
  curShrinkState: number = 1; // 1-展开 -1收缩
  readyForFight: boolean = true;
  atkCountTime: number;
  finalWave: number;
  heroUpStarTask: Function[] = [];
  heroUpStarFlag: boolean = false;
  onEnable() {
    gdk.e.on(PiecesEventId.PIECES_PVP_SHOW_HERO_SELL_ICON, this.showHeroSellIcon, this);
    gdk.e.on(PiecesEventId.PIECES_PVP_HIDE_HERO_SELL_ICON, this.hideHeroSellIcon, this);
    gdk.e.on(PiecesEventId.PIECES_PVP_HERO_UP_STAR, this._onHeroUpStar, this);
    gdk.e.on(PiecesEventId.PIECES_PVP_CAREER_CHANGE, this._onHeroCareerChange, this);
    gdk.e.on(PiecesEventId.PIECES_PVP_ENEMY_DEPLOY_OVER, () => {
      this.readyForFight = true;
    }, this);
    this.sellNode.setPosition(cc.v2(472, 411));
    this.finalWave = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'round1').value[0];


  }

  onDisable() {
    this.unscheduleAllCallbacks();
    gdk.e.targetOff(this);
    gdk.Timer.clearAll(this);
  }

  clear() {
    this.heroUpStarTask = [];
    this.heroUpStarFlag = false;
    this.readyForFight = true;
    this.model = null;
    //收缩--->展开
    this.curShrinkState = 1;
    this.handCardArea.x = 0;
    this.shrinkBtn.scaleY = 1;
  }

  updateState(m: PveSceneModel) {
    if (!this.model) {
      this.model = m;
      this._updateSilver();
    } else {
      this.model = m;
    }
    if (this.model.state == PveSceneState.Loading && this.model.arenaSyncData.fightType == 'PIECES_CHESS') {
      gdk.Timer.once(ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'waiting_time').value[0], this, () => {
        gdk.panel.setArgs(PanelId.PvePiecesHeroSelectView, 1);
        gdk.panel.open(PanelId.PvePiecesHeroSelectView);
      });
    }

    if (m.state == PveSceneState.WaveOver && m.wave !== this.finalWave) {
      let panel = gdk.panel.get(PanelId.PvePiecesHeroSelectView);
      if (panel) {
        panel.getComponent(PvePiecesHeroSelectViewCtrl).wave += 1;
        NetManager.send(new icmsg.PiecesBuyHeroPanelReq());
      }
      else {
        gdk.panel.setArgs(PanelId.PvePiecesHeroSelectView, this.model.wave + 1);
        gdk.panel.open(PanelId.PvePiecesHeroSelectView);
      }
    }
    this.pauseBtn.active = m.state == PveSceneState.Fight;
    this.timeScaleBtn.active = m.state == PveSceneState.Fight;
    if ([PveSceneState.Ready, PveSceneState.WaveOver].indexOf(this.model.state) !== -1) {
      this.atkCountTime = ConfigManager.getItemById(Pieces_refreshCfg, this.model.wave + 1).time;
    }
    this._updateTime(0);
    this.schedule(this._updateTime, 1);
  }

  _dtime: number = 0;
  _updateTime(dt: number) {
    if (!this.model || [PveSceneState.Ready, PveSceneState.WaveOver].indexOf(this.model.state) == -1) {
      this._dtime = 0;
      this.fightBtn.active = false;
      this.unscheduleAllCallbacks();
      return;
    }
    else {
      if (this._dtime >= 1) {
        this.atkCountTime -= 1;
        this._dtime = 0;
      }
      else {
        this._dtime += dt;
      }
      this.fightBtn.active = true;
      this.fightBtn.getChildByName('lab').getComponent(cc.Label).string = `${this.atkCountTime}S`;
    }
    if (this.atkCountTime <= 0) {
      this.onFightBtnClick();
    }
  }

  @gdk.binding('piecesModel.silver')
  _updateSilver() {
    if (this.model && this.node.activeInHierarchy) {
      this.model.ctrl.updatePiecesChessScore();
    }
  }

  @gdk.binding('piecesModel.chessLv')
  _updateChessLv() {
    cc.find('chessLvBtn/num', this.node).getComponent(cc.Label).string = `Lv${this.piecesModel.chessLv}`;
  }

  onReturnBtnClick() {
    if (this.model) {
      GlobalUtil.openAskPanel({
        descText: gdk.i18n.t('i18n:PIECES_TIPS9'),
        sureCb: () => {
          ModelManager.get(PiecesModel).addScore = 0;
          this.model.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_WIN)
        }
      })
    }
  }

  onShrinkBtnClick() {
    if (this.handCardArea.getNumberOfRunningActions() >= 1) return;
    if (this.curShrinkState == 1) {
      //展开--->收缩
      this.curShrinkState = -1;
      this.handCardArea.runAction(cc.moveTo(.2, cc.v2(720, this.handCardArea.y)));
    }
    else {
      //收缩--->展开
      this.curShrinkState = 1;
      this.handCardArea.runAction(cc.moveTo(.2, cc.v2(0, this.handCardArea.y)));
    }
    this.shrinkBtn.scaleY = -1 * this.shrinkBtn.scaleY;
  }

  onBuyBtnClick() {
    let wave = this.model.state == PveSceneState.Fight ? this.model.wave : this.model.wave + 1;
    gdk.panel.setArgs(PanelId.PvePiecesHeroSelectView, wave);
    gdk.panel.open(PanelId.PvePiecesHeroSelectView);
  }

  onFightBtnClick() {
    if (this.heroUpStarTask && this.heroUpStarTask.length > 0 || this.heroUpStarFlag) {
      gdk.gui.showMessage(`我方英雄正在升星,请稍等`);
      return;
    }
    if (!this.readyForFight) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:PIECES_TIPS10'));
    }
    else {
      this.readyForFight = false;
      let m1 = this.model.arenaSyncData.mainModel;
      let m2 = this.model.arenaSyncData.mirrorModel;
      if (m1.wave == 0) {
        m1.ctrl.fsm.sendEvent(PveFsmEventId.PVE_SCENE_FIGHT);
        NetManager.send(new icmsg.PiecesRoundStartReq(), null, this);
      }
      else {
        this.model.arenaSyncData.waveTimeOut = 1;
        m1.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_PIECES_WAVE_START);
        m2.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_PIECES_WAVE_START);
        NetManager.send(new icmsg.PiecesRoundStartReq(), null, this);
      }
    }
  }

  onHeroListBtnClick() {
    gdk.panel.open(PanelId.PvePiecesHeroListView);
  }

  onChessLvBtnClick() {
    gdk.panel.open(PanelId.PvePiecesChessLvView);
  }

  onSellBtnClick() {

  }

  onCloseBtnClick() {

  }

  showHeroSellIcon(e: gdk.Event) {
    let id = e.data;
    let ctrl = this.sellNode.getComponent(PvePiecesHeroSellCtrl);
    ctrl.updateView(id);
    this.sellNode.stopAllActions();
    this.sellNode.setPosition(cc.v2(472, 411));
    this.sellNode.runAction(cc.moveTo(.2, cc.v2(360, 411)));
  }

  hideHeroSellIcon() {
    this.sellNode.stopAllActions();
    this.sellNode.setPosition(cc.v2(360, 411));
    this.sellNode.runAction(cc.moveTo(.2, cc.v2(472, 411)));
  }

  _onHeroCareerChange(e: gdk.Event) {
    let typeId = e.data;
    let v = gdk.gui.getCurrentView();
    let ctrl = v.getComponent(PveSceneCtrl);
    if (ctrl) {
      let m = ctrl.model.arenaSyncData.mainModel;
      let towers = m.towers;
      for (let i = 0; i < towers.length; i++) {
        if (towers[i].hero && towers[i].hero.model.info && towers[i].hero.model.info.heroType == typeId) {
          let req = new icmsg.PiecesFightQueryReq();
          req.heroId = towers[i].hero.model.info.heroId;
          NetManager.send(req, (resp: icmsg.PiecesFightQueryRsp) => {
            if (!cc.isValid(this.node)) return;
            towers[i].setHeroByItem(null);

            let info = resp.hero;
            let item = HeroUtils.createHeroBagItemBy(info);
            item.series = 800000 + info.heroId;
            towers[i].sceneCtrl.model.heroMap[item.series] = info;
            towers[i].setHeroByItem(item);
            towers[i].hero.fsm.start();
            return;
          }, this);
        }
      }
    }
  }

  _onHeroUpStar(e: gdk.Event) {
    let info = e.data[2];
    if (info instanceof icmsg.PiecesHero) {
      //我方
      if (info.pos < 100) {
        //上阵英雄
        if (!this.heroUpStarFlag) {
          this._updateMyUpHeroAttr(info.heroId);
        }
        else {
          this.heroUpStarTask.push(() => {
            this._updateMyUpHeroAttr(info.heroId);
          })
        }
      }
    }
    //追加升星弹幕
    let panel = gdk.panel.get(PanelId.PvePiecesUpStarNoticeView);
    if (!panel) {
      gdk.panel.setArgs(PanelId.PvePiecesUpStarNoticeView, [e.data[0], e.data[1], info]);
      gdk.panel.open(PanelId.PvePiecesUpStarNoticeView, null, this, {
        parent: gdk.gui.layers.guideLayer
      });
    }
    else {
      let ctrl = panel.getComponent(PvePiecesUpStarNoticeViewCtrl);
      ctrl.addBarrage(e.data[0], e.data[1], info);
    }
  }

  _updateMyUpHeroAttr(heroId: number) {
    let info = ModelManager.get(PiecesModel).heroMap[heroId];
    let v = gdk.gui.getCurrentView();
    let ctrl = v.getComponent(PveSceneCtrl);
    if (ctrl) {
      let m = ctrl.model.arenaSyncData.mainModel;
      let towers = m.towers;
      for (let i = 0; i < towers.length; i++) {
        if (towers[i].id == info.pos + 1) {
          this.heroUpStarFlag = true;
          let req = new icmsg.PiecesFightQueryReq();
          req.heroId = heroId;
          NetManager.send(req, (resp: icmsg.PiecesFightQueryRsp) => {
            if (!cc.isValid(this.node)) return;
            towers[i].setHeroByItem(null);

            this.heroUpStarFlag = false;
            let info = resp.hero;
            let item = HeroUtils.createHeroBagItemBy(info);
            item.series = 800000 + info.heroId;
            towers[i].sceneCtrl.model.heroMap[item.series] = info;
            towers[i].setHeroByItem(item);
            towers[i].hero.fsm.start();
            if (this.heroUpStarTask && this.heroUpStarTask.length > 0) {
              let cb = this.heroUpStarTask.shift();
              cb && cb();
            }
          }, this);
          return;
        }
      }
    }
  }
}
