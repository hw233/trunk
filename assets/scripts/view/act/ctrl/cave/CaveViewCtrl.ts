import ActivityModel, { CaveLayerInfo } from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { Cave_adventureCfg, Cave_globalCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-07 10:47:14 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/cave/CaveViewCtrl")
export default class CaveViewCtrl extends gdk.BasePanel {
  @property(cc.Label)
  timeLab: cc.Label = null;

  @property([cc.Node])
  islands: cc.Node[] = [];

  get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

  actId: number = 104;
  rewardType: number;
  onEnable() {
    let startTime = new Date(ActUtil.getActStartTime(this.actId));
    let endTime = new Date(ActUtil.getActEndTime(this.actId) - 5000); //time为零点,减去5s 返回前一天
    if (!startTime || !endTime) {
      this.timeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
      gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
      gdk.panel.hide(PanelId.CaveMain);
      return;
    }
    else {
      this.timeLab.string = `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
      let t = ConfigManager.getItems(Cave_adventureCfg);
      this.rewardType = Math.min(t[t.length - 1].type, ActUtil.getActRewardType(this.actId));
      // this.uitabMenu.setSelectIdx(this.model.linkGameRound - 1, true);
    }
  }

  onDisable() {
    this.islands.forEach(l => {
      cc.find('points/point10', l).stopAllActions();
    });
  }

  @gdk.binding("actModel.caveCurLayer")
  _updateView() {
    this.islands.forEach((n, idx) => {
      this._updateIsland(n, idx);
    });
  }

  onChallengeBtnClick(e, data) {
    let layer = parseInt(data);
    if (layer < this.actModel.caveCurLayer) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:CAVE_TIPS8'));
      return;
    }
    JumpUtils.openPanel({
      panelId: PanelId.CaveMapView,
      currId: PanelId.CaveMain
    })
    gdk.panel.hide(PanelId.CaveMain);
  }

  onBoxClick(e, data) {
    let layer = parseInt(data);
    let info = this.actModel.caveLayerInfos[layer - 1];
    if (info && info.boxState) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:CAVE_TIPS9'));
      return;
    }
    else {
      let cfgs = ConfigManager.getItems(Cave_adventureCfg, (cfg: Cave_adventureCfg) => {
        if (cfg.type == this.rewardType && cfg.layer == layer && cfg.progress == 1) {
          return true;
        }
      });
      let keysLen = info ? Object.keys(info.passMap).length : 0
      if (cfgs.length > keysLen) {
        let rewards = ConfigManager.getItem(Cave_adventureCfg, (cfg: Cave_adventureCfg) => {
          if (cfg.type == this.rewardType && cfg.layer == layer && cfg.plate == 1) {
            return true;
          }
        }).explore_reward;
        let goodsInfo = [];
        rewards.forEach(r => {
          let g = new icmsg.GoodsInfo();
          g.typeId = r[0];
          g.num = r[1];
          goodsInfo.push(g);
        });
        GlobalUtil.openRewardPreview(goodsInfo, gdk.i18n.t('i18n:CAVE_TIPS10'));
        // gdk.gui.showMessage('副本尚未探索结束');
      }
      else {
        let req = new icmsg.ActivityCaveAdventureGainBoxReq();
        req.layer = layer;
        NetManager.send(req, (resp: icmsg.ActivityCaveAdventureGainBoxRsp) => {
          if (!cc.isValid(this.node)) return;
          if (!this.node.activeInHierarchy) return;
          GlobalUtil.openRewadrView(resp.goodsInfo);
          let box = cc.find('points/point10', this.islands[layer - 1]);
          box.stopAllActions();
          box.angle = 0;
          box.getChildByName('mask').active = info && info.boxState;
          box.getChildByName('RedPoint').active = false;
        }, this);
      }
    }
  }

  _updateIsland(node: cc.Node, idx: number) {
    let pliesLab = cc.find('plies/lab', node).getComponent(cc.Label);
    let lines = cc.find('lines', node);
    let points = cc.find('points', node);
    let progresss = cc.find('progress', node);
    let btn = cc.find('btn', node);
    let hero = cc.find('hero', node);
    //plies
    pliesLab.string = StringUtils.format(gdk.i18n.t('i18n:NEW_ADVENTURE_TIP5'), [
      gdk.i18n.t('i18n:ACT_FLIPCARD_NUM1'),
      gdk.i18n.t('i18n:ACT_FLIPCARD_NUM2'),
      gdk.i18n.t('i18n:ACT_FLIPCARD_NUM3')
    ][idx]);
    //others
    let info: CaveLayerInfo = this.actModel.caveLayerInfos[idx];
    let cfgs = ConfigManager.getItems(Cave_adventureCfg, (cfg: Cave_adventureCfg) => {
      if (cfg.type == this.rewardType && cfg.layer == idx + 1 && cfg.progress == 1) {
        return true;
      }
    });
    let passLen = 0;
    let keys = info ? Object.keys(info.passMap) : [];
    cfgs.forEach(c => {
      if (keys.indexOf(`${c.plate}`) !== -1) {
        passLen += 1;
      }
    });
    //progress
    progresss.active = idx == this.actModel.caveCurLayer - 1;
    if (progresss.active) {
      cc.find('lab', progresss).getComponent(cc.Label).string = `${Math.floor((passLen / cfgs.length) * 100)}/`;
    }
    //lines & point & hero
    let curPosIdx = Math.max(1, Math.floor((passLen / cfgs.length) * 10)) - 1;
    hero.active = idx == this.actModel.caveCurLayer - 1 && curPosIdx !== 9;
    lines.children.forEach((n, idx) => { GlobalUtil.setAllNodeGray(n, curPosIdx - 1 >= idx ? 0 : 1) });
    let boxIds = ConfigManager.getItemByField(Cave_globalCfg, 'key', 'explore_reward_icon').value;
    points.children.forEach((n, index) => {
      if (index !== 9) {
        GlobalUtil.setAllNodeGray(n, (idx <= this.actModel.caveCurLayer - 1 && curPosIdx >= index) ? 0 : 1)
        GlobalUtil.setSpriteIcon(this.node, n, `view/act/texture/cave/kddzz_judian0${curPosIdx == index ? 2 : 1}`);
        if (hero.active && curPosIdx == index) {
          hero.setPosition(n.getPosition());
          hero.scaleX = index >= 5 ? 1 : -1;
        }
      }
      else {
        //todo
        GlobalUtil.setSpriteIcon(this.node, n, `icon/item/${boxIds[idx]}`);
        n.getChildByName('mask').active = info && info.boxState;
        if (passLen == cfgs.length && info && !info.boxState) {
          n.getChildByName('RedPoint').active = true;
          n.runAction(cc.repeatForever(
            cc.sequence(
              cc.rotateBy(.05, 10),
              cc.rotateBy(.05, -10),
              cc.rotateBy(.05, -10),
              cc.rotateBy(.05, 10)
            )
          ))
        }
        else {
          n.getChildByName('RedPoint').active = false;
          n.angle = 0;
          n.stopAllActions();
        }
      }
    });
    //btn
    btn.active = idx <= this.actModel.caveCurLayer - 1;
    if (btn.active) {
      if (idx == this.actModel.caveCurLayer - 1) {
        GlobalUtil.setAllNodeGray(btn, 0);
        cc.find('lab', btn).getComponent(cc.Label).string = gdk.i18n.t('i18n:ARENA_TIP6');
        cc.find('RedPoint', btn).active = RedPointUtils.is_cave_can_explore() || RedPointUtils.has_cave_task_rewards();
      }
      else {
        GlobalUtil.setAllNodeGray(btn, 1);
        cc.find('lab', btn).getComponent(cc.Label).string = gdk.i18n.t('i18n:CAVE_TIPS11');
        cc.find('RedPoint', btn).active = false;
      }
    }
  }
}
