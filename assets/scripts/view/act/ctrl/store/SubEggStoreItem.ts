import ActivityModel from '../../model/ActivityModel';
import BagUtils from '../../../../common/utils/BagUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Operation_storeCfg } from '../../../../a/config';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';
/**
 * 活动--扭蛋商城
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-29 19:43:48
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-04-14 17:25:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/store/SubEggStoreItem")
export default class SubEggStoreItem extends UiListItem {
    @property(cc.Label)
    targetLabel: cc.Label = null;

    @property(cc.Label)
    progressLabel: cc.Label = null;

    @property(cc.Node)
    getBtn: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    sellout: cc.Node = null;

    @property(cc.Node)
    buyNode: cc.Node = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    cfg: Operation_storeCfg;

    get model(): ActivityModel { return ModelManager.get(ActivityModel) }

    updateView() {
        this.cfg = this.data;
        this.targetLabel.string = StringUtils.format(gdk.i18n.t("i18n:ACT_STORE_TIP1"), this.cfg.RMB_cost)//`${this.cfg.RMB_cost}${gdk.i18n.t("i18n:ACT_STORE_TIP1")}`;
        this.content.removeAllChildren();
        this.cfg.item.forEach(reward => {
            if (reward && reward.length >= 2) {
                let slot = cc.instantiate(this.slotPrefab);
                slot.parent = this.content;
                let ctrl = slot.getComponent(UiSlotItem);
                ctrl.updateItemInfo(reward[0], reward[1]);
                ctrl.itemInfo = {
                    series: null,
                    itemId: reward[0],
                    itemNum: reward[1],
                    type: BagUtils.getItemTypeById(reward[0]),
                    extInfo: null,
                };
            }
        });
        let buyInfo: icmsg.StoreBuyInfo = this.model.subStoreBuyInfos[this.cfg.id]
        let count = 0
        if (buyInfo) {
            count = buyInfo.count
        }
        let leftTime = this.cfg.buy - count
        let str = this.cfg.page == 4 ? `每日限购: ${leftTime}/${this.cfg.buy}` : `${gdk.i18n.t("i18n:ACT_STORE_TIP2")}${leftTime}`;
        this.progressLabel.string = str;

        this.buyNode.active = leftTime > 0
        this.sellout.active = leftTime <= 0
        if (this.redPoint) {
            this.redPoint.active = this.cfg.RMB_cost == 0 && leftTime > 0;
        }

        this.content.getComponent(cc.Layout).updateLayout();
        this.scrollView.scrollToTopLeft();
        this.scrollView.enabled = this.cfg.item.length > 5;
    }

    buyFunc() {
        let msg = new icmsg.PayOrderReq()
        msg.paymentId = this.cfg.id
        NetManager.send(msg, () => {
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        })
    }
}
