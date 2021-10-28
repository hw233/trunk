import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import StoreModel from '../model/StoreModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Store_giftCfg } from '../../../a/config';

/** 
  * @Description: 购买礼包提示面板
  * @Author: luoyong  
  * @Date: 2019-07-30 10:20:32
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-21 13:46:21
*/


const { ccclass, property, menu } = cc._decorator;

export enum StoreGiftType {
    UnRefresh = 0,//不刷新
    DayRefresh = 1,
    WeekRefresh = 2,
    MonthRefresh = 3,
    TimeRefresh = 4//限时刷新
}

export const STORE_ICON_PATH: string = 'view/store/textrue/icon';

@ccclass
@menu("qszc/view/store/GiftBuyViewCtrl")
export default class GiftBuyViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    itemLayout: cc.Node = null

    @property(cc.Prefab)
    uiSlotItem: cc.Prefab = null

    @property(cc.Label)
    buyLab: cc.Label = null

    @property(cc.Node)
    giftTitle: cc.Node = null

    giftCfg: Store_giftCfg;

    get model(): StoreModel { return ModelManager.get(StoreModel); }

    onLoad() {

    }

    onDestroy() {

    }

    updateViewData(cfg: Store_giftCfg) {
        this.giftCfg = cfg;
        this.buyLab.string = StringUtils.format(gdk.i18n.t("i18n:ACT_STORE_TIP1"), cfg.RMB_cost)//`${cfg.RMB_cost}${gdk.i18n.t('i18n:ACT_STORE_TIP1')}`
        GlobalUtil.setSpriteIcon(this.node, this.giftTitle, `${STORE_ICON_PATH}/text_${this.giftCfg.icon}`);
        let items = [];
        for (let i = 1; i <= 6; i++) {
            if (cfg["item_" + i]) {
                items.push(cfg["item_" + i]);
            }
        }
        for (let index = 0; index < items.length; index++) {
            let item = cc.instantiate(this.uiSlotItem)
            let comp = item.getComponent(UiSlotItem);
            this.itemLayout.addChild(item)

            gdk.rm.loadRes(gdk.Tool.getResIdByNode(this.node), "view/bag/font/bagNumFont", cc.Font, (res) => {
                if (!cc.isValid(this.node)) return;
                comp.UiNumLab.font = res
                comp.updateItemInfo(items[index][0], items[index][1])
                comp.itemInfo = {
                    itemId: items[index][0],
                    series: 0,
                    type: BagUtils.getItemTypeById(items[index][0]),
                    itemNum: items[index][1],
                    extInfo: null,
                }
            }
            )
        }
        let svWidth = items.length * 110 + (items.length - 1) * 30
        this.scrollView.node.x = -Math.min(svWidth, 550) / 2
    }

    buyFunc() {
        let list = this.model.giftBuyList;
        let canBuy = true;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == this.giftCfg.gift_id) {
                if (this.giftCfg.times_limit != 0 && list[i].count >= this.giftCfg.times_limit) {
                    canBuy = false;
                }
                break;
            }
        }
        if (!canBuy) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:STORE_TIP5'))
            return;
        }
        let msg = new icmsg.PayOrderReq()
        msg.paymentId = this.giftCfg.gift_id
        NetManager.send(msg)

        this.close()
    }

}