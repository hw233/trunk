import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Adventure2_travelCfg, ItemCfg } from '../../../a/config';
import { AskInfoType } from '../../../common/widgets/AskPanel';
/**
 * @Description: 雇佣英雄子项
 * @Author: luoyong
 * @Date: 2019-04-18 13:44:33
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-13 19:34:09
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdvPlateTravelItem2Ctrl")
export default class AdvPlateTravelItem2Ctrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null

    @property(cc.Label)
    discountLab: cc.Label = null

    @property(cc.Label)
    costLab: cc.Label = null

    @property(cc.Node)
    btnBuy: cc.Node = null


    _travelInfo: icmsg.AdventureTrave
    _advCfg: Adventure2_travelCfg

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }
    difficulty: number;
    selectIndex: number;
    plateIndex: number;
    updateView() {
        this._travelInfo = this.data
        this._advCfg = ConfigManager.getItemById(Adventure2_travelCfg, this._travelInfo.id)

        this.slotItem.updateItemInfo(this._advCfg.item, this._advCfg.item_number)
        this.slotItem.itemInfo = {
            series: null,
            itemId: this._advCfg.item,
            itemNum: this._advCfg.item_number,
            type: BagUtils.getItemTypeById(this._advCfg.item),
            extInfo: null,
        }
        this.costLab.string = `${this._advCfg.money_cost[1]}`
        let str = this._advCfg.discount.toString().replace(".", "/")
        this.discountLab.string = `${str}`

        GlobalUtil.setAllNodeGray(this.btnBuy, 0)
        this.btnBuy.getComponent(cc.Button).enabled = true;
        this.plateIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_plateIndex : this.adventureModel.endless_plateIndex;
        this.difficulty = this.adventureModel.copyType == 0 ? this.adventureModel.difficulty : 4;
        this.selectIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_selectIndex : this.adventureModel.endless_selectIndex

        if (this._travelInfo.times >= this._advCfg.times_limit || this.selectIndex != this.plateIndex) {
            GlobalUtil.setAllNodeGray(this.btnBuy, 1)
            this.btnBuy.getComponent(cc.Button).enabled = false
        }
    }

    buyFunc() {

        let panelId = this.adventureModel.copyType == 0 ? PanelId.AdventureMainView2 : PanelId.NewAdventureMainView
        if (!GlobalUtil.checkMoneyEnough(this._advCfg.money_cost[1], this._advCfg.money_cost[0], null, [panelId], null, () => {
            gdk.panel.hide(PanelId.AdvPlateTravelPanel2)
        })) {
            return
        }

        let item = ConfigManager.getItemById(ItemCfg, this._advCfg.item)
        let info: AskInfoType = {
            title: gdk.i18n.t("i18n:ADVENTURE_TIP8"),
            sureCb: () => {
                let msg = new icmsg.Adventure2TravelBuyReq()
                msg.difficulty = this.difficulty
                msg.plateIndex = this.selectIndex
                msg.id = this._travelInfo.id
                NetManager.send(msg, (data: icmsg.Adventure2TravelBuyRsp) => {
                    GlobalUtil.openRewadrView(data.list)
                    let list = this.adventureModel.travelList
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].id == this._travelInfo.id) {
                            list[i].times += 1
                        }
                    }
                    this.adventureModel.travelList = list
                })
            },
            descText: StringUtils.format(gdk.i18n.t("i18n:ADVENTURE_TIP44"), BagUtils.getColorInfo(item.color).color, item.name, BagUtils.getItemNumById(item.id)),//`是否购买<color =${BagUtils.getColorInfo(item.color).color}>${item.name}</color>(拥有：<color=#00ff00>${BagUtils.getItemNumById(item.id)}</color>)?`,
            thisArg: this,
        }
        GlobalUtil.openAskPanel(info)
    }
}