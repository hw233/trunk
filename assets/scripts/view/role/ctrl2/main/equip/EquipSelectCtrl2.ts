import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import EquipUtils from '../../../../../common/utils/EquipUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import { BagItem, BagType } from '../../../../../common/models/BagModel';
import { Item_equipCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';

/** 
 * @Description: 角色界面材料选择通用面板
 * @Author: weiliang.huang  
 * @Date: 2019-04-02 18:00:31 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 11:50:48
 */

export interface SelectCondition {
    0: BagType, // 道具类型
    1?: any,    // 筛选条件,针对配表数据
    2?: Function // 筛选函数,针对物品Server数据
}

export type SelectInfo = {
    title?: string,  // 筛选标题
    items?: Array<BagItem>, // 当前正使用的道具表
    cb?: Function,   // 选中物品后的回调
    conditions?: SelectCondition[],  // 筛选多种条件的物品
    extData?: any, // 额外透传信息,由各类型自己控制
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/equip/EquipSelectCtrl2")
export default class EquipSelectCtrl2 extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.ScrollView)
    dressScrollView: cc.ScrollView = null;

    @property(cc.Node)
    dressContent: cc.Node = null

    @property(cc.Prefab)
    equipItem: cc.Prefab = null

    list: ListView = null;
    dressList: ListView = null;

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel);
    }

    onLoad() {

    }

    onEnable() {
        let args = this.args;
        if (args && args.length > 0) {
            this.updatePanelInfo(args[0]);
        }
    }

    onDestroy() {
        gdk.e.targetOff(this)
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
            gap_y: -3,
            direction: ListViewDir.Vertical,
        })
    }

    _initDressListView() {
        if (this.dressList) {
            return
        }
        this.dressList = new ListView({
            scrollview: this.dressScrollView,
            mask: this.dressScrollView.node,
            content: this.dressContent,
            item_tpl: this.equipItem,
            cb_host: this,
            async: true,
            gap_y: -3,
            direction: ListViewDir.Vertical,
        })
    }

    /**
     * 筛选并刷新选择面板
     * @param info 
     */
    updatePanelInfo(info: SelectInfo) {
        this._initListView()
        let extData = info.extData
        let part = extData.part
        let curEquip: BagItem = extData.curEquip
        let con1: SelectCondition = [BagType.EQUIP, { part: part }]
        let conditions = [con1]
        let bagItems: BagItem[] = []
        if (conditions && conditions.length > 0) {
            for (let index = 0; index < conditions.length; index++) {
                const element = conditions[index];
                bagItems = BagUtils.getItemsByType(element[0], element[1])
            }
        }

        let equipList = []
        for (let index = 0; index < bagItems.length; index++) {
            const element = bagItems[index];
            if (curEquip) {
                if (element.itemId != curEquip.itemId) {
                    equipList.push(element)
                }
            } else {
                equipList.push(element)
            }
        }
        GlobalUtil.sortArray(equipList, this._equipSort)
        // if (curEquip) {
        //     let equipOnItem = EquipUtils.getEquipData(curEquip.itemId)
        //     if (!equipOnItem) {
        //         equipOnItem = curEquip
        //     }
        //     equipList.unshift(equipOnItem)
        // }
        this.list.set_data(equipList)

        if (curEquip) {
            this._initDressListView()
            this.dressScrollView.node.active = true
            let dressData = []
            let equipOnItem = EquipUtils.getEquipData(curEquip.itemId)
            if (!equipOnItem) {
                equipOnItem = curEquip
            }
            dressData.push(equipOnItem)
            this.dressList.set_data(dressData)
            this.scrollView.node.height = 690 - 162
        } else {
            this.dressScrollView.node.active = false
        }
    }

    _equipSort(a: BagItem, b: BagItem) {
        let cfgA = ConfigManager.getItemById(Item_equipCfg, a.itemId)
        let cfgB = ConfigManager.getItemById(Item_equipCfg, b.itemId)
        if (cfgB.color == cfgA.color) {
            if (GlobalUtil.getEquipPower(b) == GlobalUtil.getEquipPower(a)) {
                return b.itemNum - a.itemNum
            }
            return GlobalUtil.getEquipPower(b) - GlobalUtil.getEquipPower(a)
        }
        return cfgB.color - cfgA.color
    }

}
