import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import { Item_equipCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { MoneyType } from '../../../../store/ctrl/StoreViewCtrl';
/**
 * @Description: 
 * @Author: chengyou.lin
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 11:40:32
 */
export type mergeResultItem = {
    needCfg: Item_equipCfg,
    cfg: Item_equipCfg,
    num: number,
    preNum?: number,
}


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/equip/merge/EquipMergeCheckPanelCtrl")
export default class EquipMergeCheckPanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    equipItem: cc.Prefab = null;

    @property(cc.Label)
    costLab: cc.Label = null

    _partType: number = 1

    list: ListView = null;

    onEnable() {
        let args = this.args
        this._partType = args[0]
        this.updateViewInfo()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.equipItem,
            cb_host: this,
            async: true,
            column: 5,
            direction: ListViewDir.Vertical,
        })
    }

    updateViewInfo() {
        this._initListView()
        let cost = 0
        let tempCost = 0
        let cfgs = ConfigManager.getItemsByField(Item_equipCfg, "part", this._partType)
        let result: mergeResultItem[] = []
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].target_equip && cfgs[i].target_equip > 0) {
                let equipCfg = ConfigManager.getItemById(Item_equipCfg, cfgs[i].id)
                let targetEquip = ConfigManager.getItemById(Item_equipCfg, equipCfg.target_equip)
                let num = BagUtils.getItemNumById(equipCfg.id)
                let item: mergeResultItem = {
                    needCfg: equipCfg,
                    cfg: targetEquip,
                    num: num,
                }
                result.push(item)
            }
        }
        let showItems = []
        for (let i = 0; i < result.length; i++) {
            let mergeNum = Math.floor(result[i].num / result[i].needCfg.material_number)
            if (mergeNum == 0) {
                result[i].num = 0
                continue
            }
            result[i].num = mergeNum
            result[i].preNum = mergeNum
            if (result[i + 1]) {
                let num = Math.floor((mergeNum + result[i + 1].num) / result[i].cfg.material_number)
                if (num > 0) {
                    let leftNum = (mergeNum + result[i + 1].num) % result[i].cfg.material_number
                    if (leftNum > result[i + 1].num) {
                        result[i].num = leftNum - result[i + 1].num
                    } else {
                        result[i].num = 0
                    }

                }
            }
            if (result[i + 1]) {
                result[i + 1].num += mergeNum
            }
            tempCost += result[i].needCfg.consumption[1] * mergeNum
            if (GlobalUtil.getMoneyNum(MoneyType.Gold) < tempCost) {
                if (showItems[showItems.length - 1]) {
                    showItems[showItems.length - 1].num = showItems[showItems.length - 1].preNum
                }
                break
            }
            cost += result[i].needCfg.consumption[1] * mergeNum

            if (result[i].num > 0) {
                showItems.push(result[i])
            }
        }
        this.list.set_data(showItems)
        this.costLab.string = `${GlobalUtil.numberToStr(cost, true)}`
    }

    _mergeResult(cfg: Item_equipCfg) {
        let num = BagUtils.getItemNumById(cfg.id)
        let mergeNum = Math.floor(num / cfg.material_number)
        return [cfg.target_equip, mergeNum]
    }

    oneKeyMergeFunc() {
        let msg = new icmsg.EquipComposeRecursiveReq()
        msg.partId = this._partType
        NetManager.send(msg, (data: icmsg.EquipComposeRecursiveRsp) => {
            GlobalUtil.openRewadrView(data.goodsList)
            gdk.panel.hide(PanelId.EquipMergeCheck)
        })
    }
}