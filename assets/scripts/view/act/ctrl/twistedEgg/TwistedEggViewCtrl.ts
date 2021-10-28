import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TwistedEggItemCtrl from './TwistedEggItemCtrl';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { GlobalCfg, Operation_eggCfg, Operation_wishCfg } from '../../../../a/config';
import { ListView } from '../../../../common/widgets/UiListview';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-07 11:30:38 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/twistedEgg/TwistedEggViewCtrl")
export default class TwistedEggViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  machine: cc.Node = null;

  @property(cc.Node)
  twistedArea: cc.Node = null;

  @property(cc.Prefab)
  eggPrefab: cc.Prefab = null;

  @property(cc.Node)
  mask: cc.Node = null;

  @property(cc.Label)
  timeLabel: cc.Label = null;

  @property(cc.Node)
  guaranteeLab: cc.Node = null;

  @property(cc.Label)
  diamonTimeLab: cc.Label = null;

  @property(cc.Node)
  rewardsNode: cc.Node = null

  @property(cc.Node)
  spRewardNode: cc.Node = null;

  @property(cc.Node)
  btn1: cc.Node = null;

  @property(cc.Node)
  btn2: cc.Node = null;

  @property(cc.Node)
  costNode: cc.Node = null;

  get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
  get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

  isInAni: boolean = false;
  // curJackPotChild: cc.Node;
  list: ListView;
  curReward: icmsg.GoodsInfo[];
  activityId: number = 47;
  curRewardType: number;
  onEnable() {
    let startTime = new Date(ActUtil.getActStartTime(this.activityId));
    let endTime = new Date(ActUtil.getActEndTime(this.activityId) - 5000); //time为零点,减去5s 返回前一天
    if (!startTime || !endTime) {
      this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
      gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
      return;
    }
    else {
      this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
      ModelManager.get(ActivityModel).firstInTwistView = false;
      this.mask.active = false;
      this.curRewardType = ActUtil.getCfgByActId(this.activityId).reward_type;
      cc.director.getPhysicsManager().enabled = true;
      cc.director.getPhysicsManager().gravity = cc.v2(0, -640)
      this._initEggs();
      this._initBtn();
      this._adjustEggsPos();
      this._initRewards();
      this._updateCost();
      this._updateSpReward();
      gdk.e.on(ActivityEventId.ACTIVITY_TWISTED_ANI_END, this._onTwistedAniEnd, this);
      gdk.gui.onViewChanged.on(this._onViewChanged, this);
      gdk.gui.onPopupChanged.on(this._onPopupChanged, this);
      NetManager.on(icmsg.DrawEggSPRewardRsp.MsgType, this._updateSpReward, this);
    }
  }

  onDisable() {
    cc.director.getPhysicsManager().enabled = false;
    // this.machine.stopAllActions();
    gdk.gui.onViewChanged.off(this._onViewChanged, this);
    gdk.gui.onPopupChanged.off(this._onPopupChanged, this);
    gdk.e.targetOff(this);
    NetManager.targetOff(this);
  }

  checkRewardType() {
    let cfg = ActUtil.getCfgByActId(this.activityId);
    if (!cfg || cfg.reward_type != this.curRewardType) {
      gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_TIME_UPDATE"));
      gdk.panel.hide(PanelId.ActivityMainView);
      return false;
    }
    return true;
  }

  onHelpBtnClcick() {
    gdk.panel.open(PanelId.TwistedHelpView);
  }

  onCostAddBtnClick() {
    JumpUtils.openActivityMain(5);
  }

  onSpRewardSelectClick() {
    if (!this.checkRewardType()) {
      return;
    }
    gdk.panel.open(PanelId.TwistedRewardView);
  }

  onBtn1Click() {
    if (this.isInAni) return;
    if (!ActUtil.ifActOpen(this.activityId)) {
      gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
      return;
    }
    if (!this.checkRewardType()) {
      return;
    }
    let id = this.curRewardType * 100;
    this._checkItem(id);
  }

  onBtn2Click() {
    if (this.isInAni) return;
    if (!ActUtil.ifActOpen(this.activityId)) {
      gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
      return;
    }
    if (!this.checkRewardType()) {
      return;
    }
    let id = this.curRewardType * 100 + 1;
    this._checkItem(id);
    // this._playTwistAni();
  }

  _checkItem(id: number) {
    if (!this.actModel.twistedSpReward) {
      gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_EGG_TIP1"));
      return;
    }
    let cfg = ConfigManager.getItemById(Operation_eggCfg, id);
    let totalTime = id % 2 == 0 ? 1 : 10;
    if (totalTime == 1 && !this.actModel.isFirstDraw) {
      this.actModel.isFirstDraw = true;
      let req = new icmsg.DrawEggAwardReq();
      req.id = id;
      NetManager.send(req, (resp: icmsg.DrawEggAwardRsp) => {
        this.curReward = resp.reward;
        this._playTwistAni();
        if (this.actModel.twistedSpReward) {
          this.actModel.twistedGuaranteeNum -= totalTime;
        }
      });
      return;
    }
    let itemTime = BagUtils.getItemNumById(cfg.cost[0]);
    let diamonTime = totalTime - BagUtils.getItemNumById(cfg.cost[0]);
    if (itemTime >= cfg.cost[1]) {
      let req = new icmsg.DrawEggAwardReq();
      req.id = id;
      NetManager.send(req, (resp: icmsg.DrawEggAwardRsp) => {
        this.curReward = resp.reward;
        this._playTwistAni();
        if (this.actModel.twistedSpReward) {
          this.actModel.twistedGuaranteeNum -= totalTime;
        }
      });
    }
    else {
      if (diamonTime > this.actModel.twistedLeftDiamondTimes) {
        GlobalUtil.openAskPanel({
          descText: gdk.i18n.t("i18n:ACT_EGG_TIP2"),
          sureText: gdk.i18n.t("i18n:ACT_EGG_TIP3"),
          sureCb: () => {
            //todo
            this.onCostAddBtnClick();
          }
        })
      }
      else {
        let singleCfg = ConfigManager.getItemById(Operation_eggCfg, this.curRewardType * 100);
        let str = `${gdk.i18n.t("i18n:ACT_EGG_TIP4")}${itemTime > 0 ? `${itemTime}${gdk.i18n.t("i18n:ACT_EGG_TIP5")}${BagUtils.getConfigById(cfg.cost[0]).name}` : ''}${itemTime > 0 && itemTime < totalTime ? `${gdk.i18n.t("i18n:ACT_EGG_TIP6")}` : ''}${diamonTime > 0 ? `${singleCfg.money[1] * diamonTime}${gdk.i18n.t("i18n:ACT_EGG_TIP7")}` : ''}`
        GlobalUtil.openAskPanel({
          descText: str + StringUtils.format(gdk.i18n.t("i18n:ACT_EGG_TIP8"), totalTime),
          sureText: gdk.i18n.t("i18n:OK"),
          sureCb: () => {
            if (BagUtils.getItemNumById(cfg.money[0]) < singleCfg.money[1] * diamonTime) {
              gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_EGG_TIP9"));
              return;
            }
            //todo
            let req = new icmsg.DrawEggAwardReq();
            req.id = id;
            NetManager.send(req, (resp: icmsg.DrawEggAwardRsp) => {
              this.curReward = resp.reward;
              this._playTwistAni();
              if (this.actModel.twistedSpReward) {
                this.actModel.twistedGuaranteeNum -= totalTime;
              }
              this.actModel.twistedLeftDiamondTimes -= diamonTime;
            });
          }
        })
      }
    }
  }

  /**扭蛋动画 */
  _playTwistAni() {
    this.isInAni = true;
    this.mask.active = true;
    let childs = this.twistedArea.children;
    childs.forEach(child => {
      let ctrl = child.getComponent(TwistedEggItemCtrl);
      ctrl.playAni();
    });
  }

  /**扭蛋动画结束 */
  _onTwistedAniEnd() {
    this._updateCost();
    if (this.curReward) {
      GlobalUtil.openRewadrView(this.curReward);
    }
    gdk.Timer.once(200, this, () => {
      this.isInAni = false;
      this.mask.active = false;
      this.curReward = null;
      this._adjustEggsPos();
      this._updateSpReward();
    });
  }

  _onViewChanged(node: cc.Node) {
    if (!node) return;
    this.mask.active = false;
    this.isInAni = false;
  }

  _onPopupChanged(node: cc.Node) {
    if (!node) return;
    this.mask.active = false;
    this.isInAni = false;
  }

  // @gdk.binding('actModel.twistedSpReward')
  _updateSpReward() {
    let spSlot = this.spRewardNode.getChildByName('UiSlotItem').getComponent(UiSlotItem);
    if (this.actModel.twistedSpReward) {
      let cfg = ConfigManager.getItemById(Operation_wishCfg, this.actModel.twistedSpReward);
      let id = cfg.hero;
      let itemId = parseInt(id.toString().slice(0, 6));
      let star = parseInt(id.toString().slice(6));
      spSlot.node.active = true;
      spSlot.starNum = star;
      spSlot.updateItemInfo(itemId);
      spSlot.updateStar(star);
    }
    else {
      spSlot.node.active = false;
    }
  }

  @gdk.binding('actModel.twistedLeftDiamondTimes')
  @gdk.binding('actModel.twistedGuaranteeNum')
  @gdk.binding('actModel.twistedSpReward')
  _updateCost() {
    let cfg = ConfigManager.getItemById(Operation_eggCfg, this.curRewardType * 100);
    let cost = cfg.cost;
    GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(cost[0]));
    this.costNode.getChildByName('num').getComponent(cc.Label).string = BagUtils.getItemNumById(cost[0]) + '';
    let maxCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'egg_money_max');
    this.diamonTimeLab.string = gdk.i18n.t("i18n:ACT_EGG_TIP10") + `${this.actModel.twistedLeftDiamondTimes}/${maxCfg.value[0]}`;
    this.guaranteeLab.active = !!this.actModel.twistedSpReward;
    if (this.guaranteeLab.active) {
      this.guaranteeLab.getChildByName('time').getComponent(cc.Label).string = this.actModel.twistedGuaranteeNum + gdk.i18n.t("i18n:ACT_EGG_TIP11");
    }
  }

  _initBtn() {
    let cfg = ConfigManager.getItemById(Operation_eggCfg, this.curRewardType * 100);
    let url = GlobalUtil.getIconById(cfg.cost[0]);
    GlobalUtil.setSpriteIcon(this.node, this.btn1.getChildByName('costIcon'), url);
    GlobalUtil.setSpriteIcon(this.node, this.btn2.getChildByName('costIcon'), url);
  }

  @gdk.binding('actModel.isFirstDraw')
  _updateFreeTips() {
    let freeTip = this.btn1.getChildByName('freeLab');
    let normal = this.btn1.getChildByName('normal');
    freeTip.active = !this.actModel.isFirstDraw;
    normal.active = this.actModel.isFirstDraw;
  }

  _initRewards() {
    let nodes = [this.rewardsNode.getChildByName('first'), this.rewardsNode.getChildByName('second'), this.rewardsNode.getChildByName('three')];
    let cfgs = ConfigManager.getItemById(Operation_eggCfg, this.curRewardType * 100);
    nodes.forEach((node, idx) => {
      let rewardItems = [cfgs.present[idx * 2], cfgs.present[idx * 2 + 1]];
      let slot1 = node.getChildByName('slot1').getComponent(UiSlotItem);
      let slot2 = node.getChildByName('slot2').getComponent(UiSlotItem);
      [slot1, slot2].forEach((slot, idx) => {
        slot.updateItemInfo(rewardItems[idx][0], rewardItems[idx][1]);
        slot.itemInfo = {
          series: null,
          itemId: rewardItems[idx][0],
          itemNum: rewardItems[idx][1],
          type: BagUtils.getItemTypeById(rewardItems[idx][0]),
          extInfo: null
        }
      })
    });
  }

  _initEggs() {
    // let cfgs: Activity_awards_showCfg[] = [];
    let types = [9, 1, 1, 2, 2, 2, 3, 3, 3, 3]
    this.twistedArea.removeAllChildren();
    types.forEach(type => {
      let egg = cc.instantiate(this.eggPrefab);
      egg.parent = this.twistedArea;
      let ctrl = egg.getComponent(TwistedEggItemCtrl);
      ctrl.updateView(type);
    });
  }

  /**
   * 位置更新
   */
  _adjustEggsPos() {
    let dw = 50;
    let dh = 50;
    let map = {
      1: { row: 1, col: 1, x: -95 }, 2: { row: 1, col: 2, x: -35 }, 3: { row: 1, col: 3, x: 35 }, 4: { row: 1, col: 4, x: 95 },
      5: { row: 2, col: 1, x: -70 }, 6: { row: 2, col: 2, x: 0 }, 7: { row: 2, col: 3, x: 70 },
      8: { row: 3, col: 1, x: -45 }, 9: { row: 3, col: 2, x: 45 },
      10: { row: 4, col: 1, x: 0 },
    }
    let childs = this.twistedArea.children;
    let len = childs.length;
    childs.forEach((child, idx) => {
      child.setPosition(map[idx + 1].x, 50 + (map[idx + 1].row - 1) * dh);
    });
    for (let i = len; i > 0; i--) {
      childs[i - 1].setSiblingIndex(len - i);
    }
  }
}
