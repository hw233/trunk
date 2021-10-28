import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HotelTreasureItemCtrl from './HotelTreasureItemCtrl';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagEvent } from '../../../bag/enum/BagEvent';
import { Hotel_globalCfg, Hotel_mapCfg, ItemCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-08 12:42:16
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/hotel/HotelTreasureViewCtrl")
export default class HotelTreasureViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    dailyFree: cc.Node = null;

    @property(cc.RichText)
    tipLab: cc.RichText = null;

    @property(cc.RichText)
    tipLab2: cc.RichText = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    // @property(UiSlotItem)
    // slotItem: UiSlotItem = null;

    @property(cc.Node)
    skipAniFlag: cc.Node = null;

    _layerCtrls: { [layerId: number]: HotelTreasureItemCtrl } = {}

    activityId = 125
    _isSkip: boolean = false

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    get actType() {
        return ActUtil.getActRewardType(this.activityId)
    }


    onEnable() {

        let startTime = new Date(ActUtil.getActStartTime(this.activityId));
        let endTime = new Date(ActUtil.getActEndTime(this.activityId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            this.close();
            return;
        }
        else {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }

        let consumption = ConfigManager.getItemById(Hotel_globalCfg, "consumption").value[0]
        this.tipLab2.string = `活动期间每充值${consumption}元可获得1点打扫值`

        let msg = new icmsg.ActivityHotelStateReq()
        NetManager.send(msg)

        NetManager.on(icmsg.ActivityHotelStateRsp.MsgType, this._onActivityHotelStateRsp, this)
        // gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateItem, this)
        // gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateItem, this)
        this._updateViewInfo()
        // this._updateItem()

        this._isSkip = GlobalUtil.getLocal('hotelTreasureIsSkipAni', true) || false;
        this.skipAniFlag.active = this._isSkip
    }

    onDisable() {
        gdk.e.targetOff(this)
        NetManager.targetOff(this)

        if (this.actModel.hotelReward.length > 0) {
            GlobalUtil.openRewadrView(this.actModel.hotelReward)
            this.actModel.hotelReward = []
            this.actModel.hotelCleaning = false
        }
    }

    _onActivityHotelStateRsp(data: icmsg.ActivityHotelStateRsp) {
        this._updateCleanNum()
    }

    _updateCleanNum() {
        this.tipLab.string = `当前拥有打扫值:<color=#ffc600>${this.actModel.hotelCleanNum}</c>`
    }

    // _updateItem() {
    //     let cfgs = ConfigManager.getItems(Hotel_mapCfg, { type: this.actType })
    //     let itemId = cfgs[0].consumption[0]
    //     let cfg = ConfigManager.getItemById(ItemCfg, itemId)
    //     this.tipLab.string = `剩余${cfg.name}:<color=#ffc600>${BagUtils.getItemNumById(itemId)}</c>`
    //     this.slotItem.updateItemInfo(itemId)
    //     this.slotItem.itemInfo = {
    //         series: 0,
    //         itemId: itemId,
    //         itemNum: 1,
    //         type: BagUtils.getItemTypeById(itemId),
    //         extInfo: null
    //     };
    // }

    _updateViewInfo() {
        let cfgs = ConfigManager.getItems(Hotel_mapCfg, { type: this.actType })
        cfgs.forEach(cfg => {
            let item = cc.instantiate(this.itemPrefab)
            item.parent = this.content
            let ctrl = item.getComponent(HotelTreasureItemCtrl)
            ctrl.updateViewInfo(cfg)

            this._layerCtrls[cfg.layer] = ctrl
        });

        let maxLayer = 1
        let layers = this.actModel.hotelLayers
        for (let num in layers) {
            if (parseInt(num) >= maxLayer) {
                maxLayer = parseInt(num)
            }
        }
        this.scrollView.scrollTo(cc.v2(0, (maxLayer - 1) / cfgs.length))

        this._updateDaily()
    }


    _updateDaily() {
        this.dailyFree.active = !this.actModel.hotelDailyReward
    }

    onGetDailyFunc() {
        let msg = new icmsg.ActivityHotelFreeReq()
        NetManager.send(msg, (data: icmsg.ActivityHotelFreeRsp) => {
            this.actModel.hotelDailyReward = data.freeFlag
            GlobalUtil.openRewadrView(data.goodsList)
            this._updateDaily()
        })
    }

    /**扫地模式 */
    saoDiFunc() {
        if (this.actModel.hotelCleanNum <= 0) {
            let consumption = ConfigManager.getItemById(Hotel_globalCfg, "consumption").value[0]
            gdk.gui.showMessage(`活动期间每充值${consumption}元可获得1点打扫值`)
            return
        }
        if (this.actModel.hotelCleaning) {
            gdk.gui.showMessage(`正在打扫中,请稍后继续`)
            return
        }
        let msg = new icmsg.ActivityHotelCleanReq()
        NetManager.send(msg, (data: icmsg.ActivityHotelCleanRsp) => {

            let cfgs = ConfigManager.getItems(Hotel_mapCfg, { type: this.actType })
            this.scrollView.scrollTo(cc.v2(0.5, (data.clean.layer - 1) / cfgs.length))
            if (this.actModel.hotelLayers[data.clean.layer]) {
                this.actModel.hotelLayers[data.clean.layer] = data.clean
                this._layerCtrls[data.clean.layer].setCleanMode()
            } else {
                this.actModel.hotelLayers[data.clean.layer] = data.clean
                this._layerCtrls[data.clean.layer].unLockLayer()
            }
            this.actModel.hotelCleanNum -= 1
            this.actModel.hotelCleaning = true

            this.actModel.hotelReward = data.goodsList
            this._updateCleanNum()
        })
    }

    onSkipAniBtnClick() {
        this._isSkip = !this._isSkip
        this.skipAniFlag.active = this._isSkip
        GlobalUtil.setLocal('hotelTreasureIsSkipAni', this._isSkip, true);
    }
}