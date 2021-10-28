import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import EquipModel from '../../../../../common/models/EquipModel';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import { BagItem, BagType } from '../../../../../common/models/BagModel';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { Unique_globalCfg, UniqueCfg } from '../../../../../a/config';
import { UniqueEquipInfo } from './UniqueEquipListCtrl';

/** 
 * @Description:
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-13 14:18:11
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/uniqueEquip/UniqueEquipMaterialsSelectViewCtrl")
export default class UniqueEquipMaterialsSelectViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    tips: cc.Node = null;

    list: ListView;

    // _needId = 0
    _needNum = 1
    _selectIds = []
    _uniqueEquip: icmsg.UniqueEquip

    get equipModel(): EquipModel {
        return ModelManager.get(EquipModel)
    }

    onEnable() {
        let arg = this.args
        this._uniqueEquip = arg[0]
        this._updateList()
        this._updateNum()
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 4,
                gap_x: 20,
                gap_y: 20,
                async: true,
                direction: ListViewDir.Vertical,
            })
            this.list.onClick.on(this._selectItem, this);
        }
    }

    _selectItem(data: UniqueEquipInfo, i) {
        let ids = this._selectIds
        let index = ids.indexOf(data.bagItem.series)
        if (ids.length >= this._needNum) {
            if (index == -1) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP10"))
                return
            } else {
                ids.splice(index, 1)
                data.selected = false
                this.list.refresh_item(i, data)
            }
        } else {
            if (index == -1) {
                ids.push(data.bagItem.series)
                data.selected = true
                this.list.refresh_item(i, data)
            } else {
                ids.splice(index, 1)
                data.selected = false
                this.list.refresh_item(i, data)
            }
        }
        this._selectIds = ids
        this._updateNum()
    }

    _updateNum() {
        this.num.string = `${this._selectIds.length}/${this._needNum}`
    }

    _updateList() {
        this._initList();
        let equipItems = this.equipModel.uniqueEquipItems
        let datas = []
        let ids = []
        //本体
        equipItems.forEach(element => {
            if (element.itemId == this._uniqueEquip.itemId && (element.extInfo as icmsg.UniqueEquip).star == 0) {
                let isSelect = false
                if (this.equipModel.uniqueUpStarMaterialId.indexOf(element.series) != -1) {
                    isSelect = true
                    ids.push(element.series)
                }
                let info: UniqueEquipInfo = {
                    bagItem: element,
                    selected: isSelect
                }
                datas.push(info)
            }
        });
        //替代材料
        let uniqueCfg = ConfigManager.getItemById(UniqueCfg, this._uniqueEquip.itemId)
        let color4_item = ConfigManager.getItemById(Unique_globalCfg, "color4_item").value[0]
        let costId = color4_item
        if (uniqueCfg.color == 5) {
            let color5_item = ConfigManager.getItemById(Unique_globalCfg, "color5_item").value[0]
            costId = color5_item
        }
        let costItem = BagUtils.getItemById(costId)
        if (costItem) {
            for (let i = 0; i < costItem.itemNum; i++) {
                let isSelect = false
                let bagItem: BagItem = {
                    series: costItem.itemId + i,
                    itemId: costItem.itemId,
                    itemNum: 1,
                    type: BagType.ITEM,
                    extInfo: null,
                }
                if (this.equipModel.uniqueUpStarMaterialId.indexOf(bagItem.series) != -1) {
                    isSelect = true
                    ids.push(bagItem.series)
                }
                let info: UniqueEquipInfo = {
                    bagItem: bagItem,
                    selected: isSelect,
                }
                datas.push(info)
            }
        }
        this._selectIds = ids
        this.list.set_data(datas)

        this.tips.active = datas.length == 0
    }

    onOkFunc() {
        this.equipModel.uniqueUpStarMaterialId = this._selectIds
        gdk.panel.hide(PanelId.UniqueEquipMaterialsSelectView)
    }

    onOneKeyFunc() {
        if (this.list.datas.length == 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP11"))
            return
        }
        let ids = this._selectIds
        if (ids.length >= this._needNum) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP10"))
            return
        }
        for (let i = 0; i < this._needNum; i++) {
            let info = this.list.datas[i] as UniqueEquipInfo
            if (ids.indexOf(info.bagItem.series) == -1) {
                info.selected = true
                ids.push(info.bagItem.series)
            }
        }
        this.list.refresh_items()
        this._selectIds = ids
        this._updateNum()
    }


    onGotoGetFunc() {
        if (!JumpUtils.ifSysOpen(2955, true)) {
            return
        }
        gdk.panel.hide(PanelId.UniqueEquipStarUpdate)
        gdk.panel.hide(PanelId.UniqueEquipMaterialsSelectView)
        JumpUtils.openGeneEquipView()
    }
}