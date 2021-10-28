import BagUtils from '../../../../common/utils/BagUtils';
import CommonStoreBuyCtrl from '../../../store/ctrl/CommonStoreBuyCtrl';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import SiegeModel from './SiegeModel';
import StoreUtils from '../../../../common/utils/StoreUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Siege_storeCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-11 17:41:12
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/siege/SiegeStoreItemCtrl")
export default class SiegeStoreItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    itemName: cc.Label = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Node)
    limitNode: cc.Node = null;

    @property(cc.Node)
    flag: cc.Node = null;

    @property(cc.Node)
    flag2: cc.Node = null;

    @property(cc.Node)
    lock: cc.Node = null;

    @property(cc.Node)
    sellOut: cc.Node = null;


    cfg: Siege_storeCfg
    _info: icmsg.GoodsInfo
    get siegeModel() { return ModelManager.get(SiegeModel); }

    updateView() {
        this._info = this.data // 物品id 数量
        this.cfg = ConfigManager.getItemById(Siege_storeCfg, this.curIndex + 1)
        let itemCfg = BagUtils.getConfigById(this._info.typeId);
        this.itemName.string = itemCfg.name;
        let type = BagUtils.getItemTypeById(this._info.typeId);
        this.slot.updateItemInfo(this._info.typeId, this._info.num);
        this.slot.itemInfo = {
            series: null,
            itemId: this._info.typeId,
            itemNum: this._info.num,
            type: type,
            extInfo: null,
        }
        GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(this.cfg.money_cost[0]));
        this.costNode.getChildByName('num').getComponent(cc.Label).string = this.cfg.money_cost[1] + '';
        this.flag.active = parseInt(this.cfg.discount) == 1;
        this.flag2.active = parseInt(this.cfg.discount) == 2
        this.lock.active = false;

        // let info: icmsg.SiegeStoreTimes = this.siegeModel.storeTimes[this.curIndex]
        // let buyTimes = info ? info.times : 0
        // this.sellOut.active = this.cfg.times_limit - buyTimes <= 0;
        // this.limitNode.getChildByName('num').getComponent(cc.Label).string = `${this.cfg.times_limit - buyTimes}/${this.cfg.times_limit}`;

        if (this.siegeModel.todayMaxGroup >= this.cfg.unlock_ || !this.cfg.unlock_) {
            this.lock.active = false
        } else {
            this.lock.active = true
            this.lock.getChildByName('richtext').getComponent(cc.RichText).string = `<color=#FBF2D4><outline color=#962e00 width=2>击杀<color=#ffd71a>${this.cfg.unlock_}</c>波丧尸解锁</outline></c>`//`击杀${}`
        }
    }

    onItemClick() {
        if (this.lock.active) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:SIEGE_TIP7"), this.cfg.unlock_));//`当天击杀${this.cfg.unlock_}波丧尸后解锁`
            return
        }

        if (this.sellOut.active) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:SIEGE_TIP8"));
            return
        }

        let itemId = this._info.typeId
        let itemNum = this._info.num
        let moneyType = this.cfg.money_cost[0]
        let price = this.cfg.money_cost[1]
        // let info: icmsg.SiegeStoreTimes = this.siegeModel.storeTimes[this.curIndex]
        // let storeInfo: icmsg.StoreBuyInfo = new icmsg.StoreBuyInfo()
        // storeInfo.id = this.cfg.id
        // storeInfo.count = info ? info.times : 0

        // gdk.panel.open(PanelId.CommonStoreBuy, (node: cc.Node) => {
        //     let comp = node.getComponent(CommonStoreBuyCtrl);
        //     comp.initItemInfo(itemId, itemNum, storeInfo, this.cfg.times_limit, moneyType, price, (buyNum) => {
        //         if (cc.isValid(this.node)) {
        //             let msg = new icmsg.SiegeStoreBuyReq()
        //             msg.index = this.curIndex
        //             msg.num = buyNum
        //             NetManager.send(msg, (data: icmsg.SiegeStoreBuyRsp) => {
        //                 GlobalUtil.openRewadrView(data.list)
        //                 let info = new icmsg.SiegeStoreTimes()
        //                 info.index = data.index
        //                 info.times = data.times
        //                 this.siegeModel.storeTimes[info.index] = info
        //                 this.siegeModel.storeTimes = this.siegeModel.storeTimes
        //             })
        //         }
        //     });
        // }, this)
    }

}