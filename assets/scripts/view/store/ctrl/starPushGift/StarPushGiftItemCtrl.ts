import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import ServerModel from '../../../../common/models/ServerModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Store_pushCfg } from '../../../../a/config';

/** 
 * @Description: 
 * @Author: weiliang.huang  
 * @Date: 2019-03-25 17:29:13 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-14 20:45:25
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/starPushGift/StarPushGiftItemCtrl")
export default class StarPushGiftItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(UiListItem)
    slots: UiSlotItem[] = []

    @property(cc.Label)
    oldCostLab: cc.Label = null

    @property(cc.Label)
    costLab: cc.Label = null

    @property(cc.Label)
    limitLab: cc.Label = null

    @property(cc.Node)
    buyNode: cc.Node = null

    @property(cc.Node)
    sellout: cc.Node = null

    _info: icmsg.StorePushGift
    _giftCfg: Store_pushCfg

    get serverModel(): ServerModel { return ModelManager.get(ServerModel) }

    updateView() {
        this._info = this.data
        this._giftCfg = ConfigManager.getItemById(Store_pushCfg, this._info.giftId)
        this.nameLab.string = this._giftCfg.name
        this.oldCostLab.string = `${this._giftCfg.value}`
        this.costLab.string = `${this._giftCfg.rmb}`

        for (let i = 0; i < this.slots.length; i++) {
            this.slots[i].updateItemInfo(this._giftCfg.items[i][0], this._giftCfg.items[i][1])
            this.slots[i].itemInfo = {
                series: this._giftCfg.items[i][0],
                itemId: this._giftCfg.items[i][0],
                type: BagUtils.getItemTypeById(this._giftCfg.items[i][0]),
                itemNum: 1,
                extInfo: null,
            }
        }
        this.limitLab.string = `${gdk.i18n.t('i18n:STAR_PUSH_TIP1')}${this._info.remainNum}/${this._info.totalNum}`
        this.buyNode.active = true
        this.sellout.active = false
        if (this._info.remainNum == 0) {
            this.buyNode.active = false
            this.sellout.active = true
        }
    }

    buyFunc() {
        let endTime = this._info.startTime + this._giftCfg.duration
        let curTime = Math.floor(this.serverModel.serverTime / 1000)
        if (endTime - curTime <= 0) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:STAR_PUSH_TIP2'))
            return
        }
        let msg = new icmsg.PayOrderReq()
        msg.paymentId = this._info.giftId
        NetManager.send(msg)
    }
}