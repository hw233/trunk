import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuardianEquipSuitTypeCtrl from './GuardianEquipSuitTypeCtrl';
import GuardianUtils from '../GuardianUtils';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import PanelId from '../../../../../configs/ids/PanelId';
import { BagItem, BagType } from '../../../../../common/models/BagModel';
import { Guardian_equip_starCfg, Guardian_equipCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { SelectCondition, SelectInfo } from '../../main/equip/EquipSelectCtrl2';


const { ccclass, property, menu } = cc._decorator;
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-22 17:46:05
 */

@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipSelectCtrl")
export default class GuardianEquipSelectCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.ScrollView)
    dressScrollView: cc.ScrollView = null;

    @property(cc.Node)
    dressContent: cc.Node = null

    @property(cc.Prefab)
    selectItem: cc.Prefab = null

    @property(cc.Button)
    suitBtns: cc.Button[] = []

    @property(cc.Node)
    noEquipTips: cc.Node = null;

    list: ListView = null;
    dressList: ListView = null;

    _showDatas: BagItem[] = []
    _selectSuitType: number = 0
    _part = 0
    _suitType = 0

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
            item_tpl: this.selectItem,
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
            item_tpl: this.selectItem,
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
        this._part = extData.part
        let curEquip: BagItem = extData.curEquip
        let con1: SelectCondition = [BagType.GUARDIANEQUIP, { part: this._part }]
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
                if (element.series != curEquip.series) {
                    equipList.push(element)
                }
            } else {
                equipList.push(element)
            }
        }
        GlobalUtil.sortArray(equipList, this._equipSort)
        this._showDatas = equipList
        this.list.set_data(equipList)
        this.noEquipTips.active = false

        if (curEquip && curEquip.series > 0) {
            this._initDressListView()
            this.dressScrollView.node.active = true
            let dressData = []
            let equipOnItem = GuardianUtils.getGuardianEquipData(curEquip.series)
            if (!equipOnItem) {
                equipOnItem = curEquip
            }
            dressData.push(equipOnItem)
            this.dressList.set_data(dressData)
            this.scrollView.node.height = 660 - 162
        } else {
            this.dressScrollView.node.active = false

            if (equipList.length == 0) {
                this.noEquipTips.active = true
            } else {
                this.noEquipTips.active = false
            }
        }

        this._updteSuitBtns()
        this.selectSuitFunc(null, 0)
    }

    _equipSort(a: BagItem, b: BagItem) {
        let cfgA = ConfigManager.getItemById(Guardian_equipCfg, a.itemId)
        let starA = ConfigManager.getItemByField(Guardian_equip_starCfg, "star", (a.extInfo as icmsg.GuardianEquip).star, { part: cfgA.part, type: cfgA.type })

        let cfgB = ConfigManager.getItemById(Guardian_equipCfg, b.itemId)
        let starB = ConfigManager.getItemByField(Guardian_equip_starCfg, "star", (b.extInfo as icmsg.GuardianEquip).star, { part: cfgB.part, type: cfgB.type })

        let pA = GuardianUtils.getTargetEquipPower(a.extInfo as icmsg.GuardianEquip)
        let pB = GuardianUtils.getTargetEquipPower(b.extInfo as icmsg.GuardianEquip)
        if (pA == pB) {
            return starB.color - starA.color
        }
        return pB - pA
    }

    _updteSuitBtns() {
        for (let i = 0; i < this.suitBtns.length; i++) {
            let ctrl = this.suitBtns[i].node.getComponent(GuardianEquipSuitTypeCtrl)
            ctrl.updateViewInfo(i)
        }
    }


    /**选择页签, 筛选职业*/
    selectSuitFunc(e, utype) {
        this._selectSuitType = parseInt(utype)
        for (let idx = 0; idx < this.suitBtns.length; idx++) {
            const element = this.suitBtns[idx];
            element.interactable = idx != this._selectSuitType
            let select = element.node.getChildByName("select")
            select.active = idx == this._selectSuitType
        }

        let datas: BagItem[] = this._showDatas
        let selectDatas = []
        if (this._selectSuitType == 0) {
            this.list.set_data(datas)
        } else {
            datas.forEach(element => {
                let cfg = ConfigManager.getItemById(Guardian_equipCfg, element.itemId)
                if (cfg.type == this._selectSuitType) {
                    selectDatas.push(element)
                }
            });
            this.list.set_data(selectDatas)
        }
    }


    onGetFunc() {
        gdk.panel.hide(PanelId.GuardianEquipSelect)
        JumpUtils.openView(2898)
    }

}