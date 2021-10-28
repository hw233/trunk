import ActivityModel from '../../model/ActivityModel';
import BagUtils from '../../../../common/utils/BagUtils';
import CommonStoreBuyCtrl from '../../../store/ctrl/CommonStoreBuyCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Secretarea_store1Cfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-09-15 10:50:32 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-15 13:45:27
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wonderfulActivity/MidAutumnStoreItemCtrl")
export default class MidAutumnStoreItemCtrl extends UiListItem {
    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    itemName: cc.Label = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Node)
    super: cc.Node = null;

    @property(cc.Label)
    limitLab: cc.Label = null;

    @property(cc.Node)
    sellout: cc.Node = null;

    _storeCfg: Secretarea_store1Cfg
    _leftTime = 0

    get activityModel(): ActivityModel { return ModelManager.get(ActivityModel) }

    updateView() {
        this._storeCfg = this.data
        this.slot.updateItemInfo(this._storeCfg.goods[0], this._storeCfg.goods[1])
        this.slot.itemInfo = {
            series: null,
            itemId: this._storeCfg.goods[0],
            itemNum: this._storeCfg.goods[1],
            type: BagUtils.getItemTypeById(this._storeCfg.goods[0]),
            extInfo: null,
        }
        this.super.active = this._storeCfg.discount
        this.itemName.string = `${this._storeCfg.item_name}`
        GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(this._storeCfg.money_cost[0]));
        this.costNode.getChildByName('num').getComponent(cc.Label).string = this._storeCfg.money_cost[1] + '';
        let buyInfo: icmsg.StoreBuyInfo = this.activityModel.midAutumnStoreBuyInfo[this._storeCfg.id]
        let buyTime = buyInfo ? buyInfo.count : 0
        this._leftTime = this._storeCfg.times_limit - buyTime
        if (this._leftTime < 0) {
            this._leftTime = 0
        }
        this.limitLab.node.active = true
        this.limitLab.string = `${gdk.i18n.t("i18n:MAGIC_EXCHANGE_TIP4")}${this._leftTime}/${this._storeCfg.times_limit}`
        this.sellout.active = false

        if (this._leftTime == 0) {
            this.limitLab.node.active = false
            this.sellout.active = true
        }
    }

    onItemClick() {
        if (this._leftTime == 0) {
            GlobalUtil.showMessageAndSound(`${gdk.i18n.t("i18n:MAGIC_EXCHANGE_TIP5")}`)
            return
        }

        let itemId = this._storeCfg.goods[0]
        let itemNum = this._storeCfg.goods[1]
        let moneyType = this._storeCfg.money_cost[0]
        let price = this._storeCfg.money_cost[1]
        let storeInfo = this.activityModel.midAutumnStoreBuyInfo[this._storeCfg.id]
        storeInfo = storeInfo || { id: this._storeCfg.id, count: 0 }

        gdk.panel.open(PanelId.CommonStoreBuy, (node: cc.Node) => {
            let comp = node.getComponent(CommonStoreBuyCtrl);
            comp.initItemInfo(itemId, itemNum, storeInfo, this._storeCfg.times_limit, moneyType, price, (buyNum) => {
                if (cc.isValid(this.node)) {
                    let msg = new icmsg.ActivityStoreBuyReq()
                    msg.activityId = 135
                    msg.itemId = this._storeCfg.id
                    msg.itemNum = buyNum
                    NetManager.send(msg, (data: icmsg.ActivityStoreBuyRsp) => {
                        GlobalUtil.openRewadrView(data.list)
                        this.activityModel.midAutumnStoreBuyInfo[data.info.id] = data.info
                        this.activityModel.midAutumnStoreBuyInfo = this.activityModel.midAutumnStoreBuyInfo
                    })
                }
            });
        })
    }
}
