import ActUtil from '../../../act/util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { GuardianWishData } from './GuardianCallSelectViewCtrl';

/** 
 * @Description: 英雄守护者许愿池Item
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-21 17:23:01
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianCallSelectItemCtrl")
export default class GuardianCallSelectItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;
    @property(cc.Node)
    selectNode: cc.Node = null
    @property(cc.Node)
    lock: cc.Node = null
    @property(cc.Label)
    nameLb: cc.Label = null

    info: GuardianWishData;
    tipActId: number = 98;

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    onDisable() {
        this.node.targetOff(this);
        gdk.Timer.clearAll(this);
        //this.info = null;
    }

    //触摸开始 
    touchStart() {
        gdk.Timer.once(800, this, this.showTip);
        if (!this.info.cfg) {
            gdk.gui.showMessage(this.nameLb.string + '许愿池')
        }
    }
    //触摸结束
    touchEnd() {
        gdk.Timer.clearAll(this);
    }

    showTip() {
        if (!this.info) return;
        if (!cc.isValid(this.node)) return;
        let itemId = this.info.cfg ? this.info.cfg.award[0] : this.info.guardianID;
        let itemNum = this.info.cfg ? this.info.cfg.award[1] : 1;
        let itemInfo: BagItem = {
            series: 0,
            itemId: itemId,
            itemNum: itemNum,
            type: BagUtils.getItemTypeById(itemId),
            extInfo: null,
        }
        GlobalUtil.openItemTips(itemInfo);
    }

    updateView() {
        this.info = this.data;
        this.slotItem.isEffect = false;
        this.lock.active = false;
        if (this.info.cfg) {
            this.slotItem.updateItemInfo(this.info.cfg.award[0], this.info.cfg.award[1]);
            this.nameLb.string = '';

        } else {
            this.selectNode.active = false;
            this.node.off(cc.Node.EventType.TOUCH_END, this._listItemClick, this);
            this.node.activeInHierarchy
            this.slotItem.updateItemInfo(this.info.guardianID, 1);
            let curTime = GlobalUtil.getServerTime();
            let ct = ActUtil.getActEndTime(this.tipActId);
            let leftTime = ct - curTime;
            this.nameLb.string = TimerUtils.format1(leftTime / 1000) + gdk.i18n.t("i18n:GUARDIANCALL_TIP9")//'后加入';
            this.lock.active = true;
        }
    }

    _itemSelect() {
        if (!this.info || !this.info.cfg) return;
        this.selectNode.active = this.ifSelect;
    }
}
