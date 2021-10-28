import GuardianModel from '../../model/GuardianModel';
import GuardianUtils from './GuardianUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import { GuardianItemInfo } from './GuardianListCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { timingSafeEqual } from 'crypto';
/** 
 * @Description:守护者列表
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-22 17:40:48
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianMaterialsSelectViewCtrl")
export default class GuardianMaterialsSelectViewCtrl extends gdk.BasePanel {

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
    _needNum = 0
    _selectIds = []

    get guardianModel(): GuardianModel {
        return ModelManager.get(GuardianModel)
    }

    onEnable() {
        let arg = this.args
        this._needId = arg[0]
        this._needNum = arg[1]

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
        let guardianItems = this.guardianModel.guardianItems
        let datas = []
        let ids = []
        guardianItems.forEach(element => {
            let heroInfo = GuardianUtils.getGuardianHeroInfo(element.series)
            if (!heroInfo && this.guardianModel.curGuardianId != element.series && element.itemId == this._needId) {
                let isSelect = false
                if (this.guardianModel.selectIds.indexOf(element.series) != -1) {
                    isSelect = true
                    ids.push(element.series)
                }
                let info: GuardianItemInfo = {
                    bagItem: element,
                    selected: isSelect
                }
                datas.push(info)
            }
        });
        this._selectIds = ids
        this.list.set_data(datas)
    }

    onOkFunc() {
        this.guardianModel.selectIds = this._selectIds
        gdk.panel.hide(PanelId.GuardianMaterialsSelectView)
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
            if (ids.indexOf(info.bagItem.series) == -1) {
                info.selected = true
                ids.push(info.bagItem.series)
            }
        }
        this.list.refresh_items()
        this._selectIds = ids
        this._updateNum()
    }
}