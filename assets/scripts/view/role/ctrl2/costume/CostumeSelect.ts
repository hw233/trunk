import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CostumeSuitTypeCtrl from './CostumeSuitTypeCtrl';
import CostumeUtils from '../../../../common/utils/CostumeUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import { BagItem, BagType } from '../../../../common/models/BagModel';
import { config } from 'process';
import { Costume_compositeCfg, CostumeCfg, Hero_careerCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { SelectCondition, SelectInfo } from '../main/equip/EquipSelectCtrl2';

/** 
 * @Description: 材料选择通用面板
 * @Author: weiliang.huang  
 * @Date: 2019-04-02 18:00:31 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-22 13:58:41
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/costume/CostumeSelect")
export default class CostumeSelect extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.ScrollView)
    dressScrollView: cc.ScrollView = null;

    @property(cc.Node)
    dressContent: cc.Node = null

    @property(cc.Prefab)
    costumeItem: cc.Prefab = null

    @property(cc.Node)
    contentUp: cc.Node = null

    @property(cc.ScrollView)
    suitScrollView: cc.ScrollView = null;

    @property(cc.Node)
    suitContent: cc.Node = null

    @property(cc.Prefab)
    suitSelectItem: cc.Prefab = null

    // @property(cc.Button)
    // suitBtns: cc.Button[] = []

    @property(cc.Node)
    btnSelectAll: cc.Node = null

    @property(cc.Node)
    btnSelectSuit: cc.Node = null

    list: ListView = null;
    dressList: ListView = null;
    suitList: ListView = null;

    _showDatas: BagItem[] = []
    isShowUp = false
    _selectSuitType: number = 0
    _part = 0
    _careerType = 0

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
            item_tpl: this.costumeItem,
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
            item_tpl: this.costumeItem,
            cb_host: this,
            async: true,
            gap_y: -3,
            direction: ListViewDir.Vertical,
        })
    }

    _initSuitListView() {
        if (this.suitList) {
            return
        }
        this.suitList = new ListView({
            scrollview: this.suitScrollView,
            mask: this.suitScrollView.node,
            content: this.suitContent,
            item_tpl: this.suitSelectItem,
            cb_host: this,
            async: true,
            gap_y: 2,
            direction: ListViewDir.Vertical,
        })
        this.suitList.onClick.on(this._clickItem, this)
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
        let careerId = extData.careerId
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId)
        this._careerType = careerCfg.career_type
        let con1: SelectCondition = [BagType.COSTUME, { part: this._part, career_type: careerCfg.career_type }]
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

        if (curEquip && curEquip.series > 0) {
            this._initDressListView()
            this.dressScrollView.node.active = true
            let dressData = []
            let equipOnItem = CostumeUtils.getCostumeData(curEquip.series)
            if (!equipOnItem) {
                equipOnItem = curEquip
            }
            dressData.push(equipOnItem)
            this.dressList.set_data(dressData)
            this.scrollView.node.height = 660 - 162
        } else {
            this.dressScrollView.node.active = false
        }

        this._updateDownState()
    }

    _equipSort(a: BagItem, b: BagItem) {
        let cfgA = ConfigManager.getItemById(CostumeCfg, a.itemId)
        let cfgB = ConfigManager.getItemById(CostumeCfg, b.itemId)
        let pA = CostumeUtils.getEquipPower(a.extInfo as icmsg.CostumeInfo)
        let pB = CostumeUtils.getEquipPower(b.extInfo as icmsg.CostumeInfo)
        return pB - pA
    }

    showUpContent() {
        this.isShowUp = !this.isShowUp
        this.contentUp.active = this.isShowUp

        if (this.contentUp.active) {
            this._initSuitListView()
            let datas = []
            for (let i = 0; i < 9; i++) {
                let obj = { type: i + 1, part: this._part, careerType: this._careerType, isSelect: false }
                if (this._selectSuitType == obj.type) {
                    obj.isSelect = true
                }
                datas.push(obj)
            }
            this.suitList.set_data(datas)
            let index = this._selectSuitType - 1 > 0 ? this._selectSuitType - 1 : 0
            this.suitList.scroll_to(index)
        }
    }

    openGetWayFunc() {
        let cfg = ConfigManager.getItemByField(CostumeCfg, "type", 0, { career_type: this._careerType, part: this._part })
        if (cfg) {
            GlobalUtil.openGainWayTips(cfg.id)
        }
    }

    _clickItem(obj: any) {
        this.showUpContent()
        if (obj.isSelect) {
            this._selectSuitType = 0
        } else {
            this._selectSuitType = parseInt(obj.type)
        }
        let datas: BagItem[] = this._showDatas
        let selectDatas = []
        if (this._selectSuitType == 0) {
            this.list.set_data(datas)
        } else {
            datas.forEach(element => {
                let cfg = ConfigManager.getItemById(CostumeCfg, element.itemId)
                if (cfg.type == this._selectSuitType) {
                    selectDatas.push(element)
                }
            });
            this.list.set_data(selectDatas)
        }

        this._updateDownState()
    }


    _updateDownState() {
        if (this._selectSuitType == 0) {
            this.btnSelectAll.active = true
            this.btnSelectSuit.active = false
        } else {
            this.btnSelectAll.active = false
            this.btnSelectSuit.active = true
            let suitCtrl = cc.find("suitIcon", this.btnSelectSuit).getComponent(CostumeSuitTypeCtrl)
            suitCtrl.updateViewInfo(this._selectSuitType, this._part)

            let suitCfgs = ConfigManager.getItems(Costume_compositeCfg, { type: this._selectSuitType, color: 1 })
            let suitDes = cc.find("suitDes", this.btnSelectSuit).getComponent(cc.RichText)
            suitDes.string = ``
            suitDes.string = `${suitCfgs[suitCfgs.length - 1].des}`
        }
    }
}
