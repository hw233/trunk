import BagUtils from '../../../../../common/utils/BagUtils';
import GuardianModel from '../../../model/GuardianModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import { BagItem, BagType } from '../../../../../common/models/BagModel';
import { Guardian_equip_starCfg } from '../../../../../a/config';
import { GuardianItemInfo } from '../GuardianListCtrl';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';

/** 
 * @Description:
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-20 12:00:56
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipBreakMaterialsSelectCtrl")
export default class GuardianEquipBreakMaterialsSelectCtrl extends gdk.BasePanel {

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

    _needId = 0
    _replaceId = 0
    _needNum = 0

    _starCfg: Guardian_equip_starCfg

    _selectIds = [] //本地唯一id


    get guardianModel(): GuardianModel {
        return ModelManager.get(GuardianModel)
    }

    onEnable() {
        let arg = this.args
        this._starCfg = arg[0]
        this._needId = this._starCfg.special[0][0]
        this._needNum = this._starCfg.special[0][1]
        this._replaceId = this._starCfg.alternative[0][0]

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

    _selectItem(data: GuardianItemInfo, i) {
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
        let equipItems = this.guardianModel.equipItems
        let datas = []
        let ids = []
        let num = BagUtils.getItemNumById(this._replaceId) || 0;
        for (let i = 0; i < num; i++) {
            let seriesId = parseInt(`${this._replaceId}${i}`); // id+idx 同一道具保证id的唯一性  前6位固定为id
            let item: BagItem = {
                series: seriesId,
                itemId: this._replaceId,//配置里的序号id 
                itemNum: 1,
                type: BagType.ITEM,
                extInfo: null
            }

            let isSelect = false
            if (this.guardianModel.breakSelectIds.indexOf(seriesId) != -1) {
                isSelect = true
                ids.push(seriesId)
            }

            let info: GuardianItemInfo = {
                bagItem: item,
                selected: isSelect
            }
            datas.push(info)
        }

        equipItems.forEach(element => {
            if (element.itemId == this._needId) {
                let isSelect = false
                if (this.guardianModel.breakSelectIds.indexOf(element.series) != -1) {
                    isSelect = true
                    ids.push(element.series)
                }
                let info: GuardianItemInfo = {
                    bagItem: element,
                    selected: isSelect,
                }
                if ((info.bagItem.extInfo as icmsg.GuardianEquip).level == 1 && (info.bagItem.extInfo as icmsg.GuardianEquip).star == 1) {
                    datas.push(info)
                }
            }
        });

        this._selectIds = ids
        this.list.set_data(datas)
        if (datas.length == 0) {
            this.tips.active = true
        }
    }

    onOkFunc() {
        this.guardianModel.breakSelectIds = this._selectIds
        gdk.panel.hide(PanelId.GuardianEquipBreakMaterialsSelect)
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
            let info = this.list.datas[i] as GuardianItemInfo
            if (info) {
                info.selected = true
                ids.push(info.bagItem.series)
            }
        }
        this.list.refresh_items()
        this._selectIds = ids
        this._updateNum()
    }
}