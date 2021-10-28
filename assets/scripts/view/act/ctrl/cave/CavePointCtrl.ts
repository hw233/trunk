import ActivityModel, { CavePointInfo } from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { Store_pushCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-07 11:15:20 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/cave/CavePointCtrl")
export default class CavePointCtrl extends cc.Component {
  @property(cc.Node)
  mask: cc.Node = null;

  @property(cc.Node)
  slot: cc.Node = null;

  @property(cc.Node)
  door: cc.Node = null;

  @property(sp.Skeleton)
  doorSpine: sp.Skeleton = null;

  get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

  info: CavePointInfo;
  cancelTouch: boolean = false;
  onEnable() {
    gdk.e.on(ActivityEventId.ACTIVITY_CAVE_TRIGGER_PASS_EVENT, this._onTriggerPassEvent, this);
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
  }

  onDisable() {
    GuideUtil.bindGuideNode(21015);
    gdk.e.targetOff(this);
  }

  initInfo(info: CavePointInfo) {
    this.info = info;
    let isPass = this.actModel.caveLayerInfos[this.actModel.caveCurLayer - 1].passMap[info.cfg.plate] == 1;
    this.mask.active = !isPass;
    this.slot.active = (!!this.info.cfg.reward && !isPass);
    if (this.info.cfg.gift_id > 0) {
      this.slot.active = [1, 3].indexOf(ActivityUtils.getCaveGiftStateById(this.info.cfg.gift_id)) == -1;
    }
    if (this.slot.active) {
      let r = (isPass && ActivityUtils.getCaveGiftStateById(this.info.cfg.gift_id) == 2) ? this.info.cfg.gift_icon : this.info.cfg.reward;
      this.slot.getComponent(UiSlotItem).updateItemInfo(r[0], r[1]);
    }
    this.door.active = this.info.cfg.door == 1 && !isPass;
    this.doorSpine.node.active = this.info.cfg.door == 1 && isPass;
    if (this.info.cfg.door == 1 && GuideUtil.getCurGuideId() > 0) {
      GuideUtil.bindGuideNode(21015, this.node);
    }
  }

  _onTouchStart() {
    if (GuideUtil.getCurGuideId() > 0) return;
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    gdk.Timer.once(300, this, () => {
      //长按显示礼包内容
      this.cancelTouch = true;
      this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd);
      if (!!this.info.cfg.reward) {
        let isPass = this.actModel.caveLayerInfos[this.actModel.caveCurLayer - 1].passMap[this.info.cfg.plate] == 1;
        let r = (isPass && ActivityUtils.getCaveGiftStateById(this.info.cfg.gift_id) == 2) ? this.info.cfg.gift_icon : this.info.cfg.reward;
        let itemInfo = {
          series: null,
          itemId: r[0],
          itemNum: r[1],
          type: BagUtils.getItemTypeById(r[0]),
          extInfo: null,
        }
        GlobalUtil.openItemTips(itemInfo, false, false);
      }
    });
  }

  /**点击地块 */
  _onTouchEnd() {
    gdk.Timer.clearAll(this);
    if (this.cancelTouch) {
      this.cancelTouch = false;
      return;
    }
    gdk.e.emit(ActivityEventId.ACTIVITY_CAVE_EMIT_CLICK_PLATE, this.info.cfg.plate);
  }

  /**触发经过事件 */
  _onTriggerPassEvent(e: gdk.Event) {
    if (this.info && this.info.cfg.plate == e.data) {
      this.mask.active = false;
      //todo
      if (!!this.info.cfg.reward) {
        if (!this.info.cfg.gift_id || !ActivityUtils.getCaveGiftDatasById(this.info.cfg.gift_id)) {
          let item = cc.instantiate(this.slot);
          item.parent = this.node;
          item.getComponent(UiSlotItem).updateItemInfo(this.info.cfg.reward[0], this.info.cfg.reward[1]);
          item.setPosition(this.slot.getPosition());
          let finshend = cc.callFunc(function () {
            item.destroy()
          }, this);
          item.stopAllActions()
          let pos = item.getPosition()
          let dsz = cc.view.getVisibleSize();
          let endPos = cc.v2(0, dsz.height)
          let playTime = pos.sub(endPos).mag() / 1000
          item.runAction(cc.sequence(cc.moveTo(playTime, endPos.x, endPos.y), finshend))
          !this.info.cfg.gift_id && (this.slot.active = false);
        }
      }
      if (this.info.cfg.door == 1) {
        this.door.active = false;
        this.doorSpine.node.active = true;
      }
      if (!!this.info.cfg.gift_id) {
        this.slot.getComponent(UiSlotItem).updateItemInfo(this.info.cfg.gift_icon[0], this.info.cfg.gift_icon[1]);
        NetManager.send(new icmsg.StorePushListReq(), () => {
          if (!cc.isValid(this.node)) return;
          if (!this.node.activeInHierarchy) return;
          let data = ActivityUtils.getCaveGiftDatasById(this.info.cfg.gift_id);
          if (data) {
            let cfg = ConfigManager.getItemById(Store_pushCfg, data.giftId);
            PanelId.CaveGiftView.isMask = true;
            PanelId.CaveGiftView.onHide = {
              func: () => {
                if (this.info.cfg.gift_id > 0) {
                  this.slot.active = [1, 3].indexOf(ActivityUtils.getCaveGiftStateById(this.info.cfg.gift_id)) == -1;
                }
                PanelId.CaveGiftView.isMask = false;
              }
            }
            gdk.panel.setArgs(PanelId.CaveGiftView, [cfg, data]);
            gdk.panel.open(PanelId.CaveGiftView);
          }
        }, this);
      }
    }
  }
}
