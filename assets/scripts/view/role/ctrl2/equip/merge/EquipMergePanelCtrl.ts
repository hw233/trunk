import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import EquipUtils from '../../../../../common/utils/EquipUtils';
import GlobalUtil, { CommonNumColor } from '../../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../../common/utils/RedPointUtils';
import RoleModel from '../../../../../common/models/RoleModel';
import StringUtils from '../../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { BagEvent } from '../../../../bag/enum/BagEvent';
import { BagType } from '../../../../../common/models/BagModel';
import { GlobalCfg, Item_equipCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
/**
 * @Description: 
 * @Author: chengyou.lin
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-25 10:20:01
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/equip/merge/EquipMergePanelCtrl")
export default class EquipMergePanelCtrl extends gdk.BasePanel {

    @property(cc.Node)
    tabBtns: cc.Node[] = [];

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    equipItem: cc.Prefab = null;

    @property(UiSlotItem)
    curEquip: UiSlotItem = null

    @property(UiSlotItem)
    targetEquip: UiSlotItem = null

    @property(cc.Label)
    curNameLab: cc.Label = null

    @property(cc.Label)
    targetNameLab: cc.Label = null

    @property(cc.ProgressBar)
    numBar: cc.ProgressBar = null

    @property(cc.Label)
    numLab: cc.Label = null

    @property(cc.Label)
    costLab: cc.Label = null

    @property(cc.Label)
    mergeNumLab: cc.Label = null

    @property(cc.Button)
    btnCut: cc.Button = null

    @property(cc.Button)
    btnAdd: cc.Button = null

    @property(sp.Skeleton)
    effectSpine: sp.Skeleton = null

    @property(cc.Node)
    btnOneKey: cc.Node = null

    _selectIndex = 0
    _partType = 0

    list: ListView = null;
    _itemDatas = []
    _mergeNum: number = 0
    _maxNum: number = 0
    _needItem: Item_equipCfg

    get roleModel() { return ModelManager.get(RoleModel); }

    onEnable() {
        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._refreshViewData, this)
        this._updateBtnState()
        this.selectType(null, 0)
    }

    onDisable() {
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
            column: 5,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._clickItem, this)
    }

    _updateBtnState() {
        let values = ConfigManager.getItemById(GlobalCfg, 'key_synthesis').value
        if (this.roleModel.level < values[0]) {
            GlobalUtil.setAllNodeGray(this.btnOneKey, 1)
        } else {
            GlobalUtil.setAllNodeGray(this.btnOneKey, 0)
        }
    }

    _clickItem(item: Item_equipCfg) {
        if (!item) return
        let needEquip = ConfigManager.getItemByField(Item_equipCfg, "target_equip", item.id)
        this._needItem = needEquip
        this.curEquip.updateItemInfo(needEquip.id)
        this.curEquip.updateStar(needEquip.star)

        this.targetEquip.updateItemInfo(item.id)
        this.targetEquip.updateStar(item.star)

        this._createItemInfo(this.curEquip)
        this._createItemInfo(this.targetEquip)

        this._updateCostNum()

        let curOutline = this.curNameLab.getComponent(cc.LabelOutline)
        let targetOutline = this.targetNameLab.getComponent(cc.LabelOutline)

        let curEquip = ConfigManager.getItemById(Item_equipCfg, needEquip.id)
        let targetEquip = ConfigManager.getItemById(Item_equipCfg, item.id)

        this.curNameLab.string = `${curEquip.name}`
        this.curNameLab.node.color = BagUtils.getColor(curEquip.color)
        curOutline.color = BagUtils.getOutlineColor(curEquip.color)

        this.targetNameLab.string = `${targetEquip.name}`
        this.targetNameLab.node.color = BagUtils.getColor(targetEquip.color)
        targetOutline.color = BagUtils.getOutlineColor(targetEquip.color)
    }

    _updateCostNum() {
        if (!this._needItem) return
        this.numLab.string = `${BagUtils.getItemNumById(this._needItem.id)}/${this._needItem.material_number}`
        this.numBar.progress = BagUtils.getItemNumById(this._needItem.id) / this._needItem.material_number

        this._mergeNum = this._maxNum = Math.floor(BagUtils.getItemNumById(this._needItem.id) / this._needItem.material_number)
        this._updatemergeNum()

    }

    _createItemInfo(solt: UiSlotItem) {
        solt.itemInfo = {
            series: solt.itemId,
            itemId: solt.itemId,
            itemNum: 1,
            type: BagType.EQUIP,
            extInfo: null,
        }
    }

    mergeCutFunc() {
        this._mergeNum--;
        if (this._maxNum > 0) {
            this._mergeNum = Math.max(1, this._mergeNum)
        }
        this._updatemergeNum();
    }

    mergeAddFunc() {
        this._mergeNum++;
        this._updatemergeNum();
    }

    _updatemergeNum() {
        let getNum = this._mergeNum;
        if (getNum > this._maxNum) {
            getNum = this._maxNum;
            this._mergeNum = getNum;
        } else if (getNum <= 0) {
            getNum = 0;
            this._mergeNum = getNum;
        }
        this.mergeNumLab.string = getNum.toString();

        if (this._mergeNum <= 1) {
            this.btnCut.enabled = false
            this.btnCut.interactable = false
        } else {
            this.btnCut.enabled = true
            this.btnCut.interactable = true
        }

        if (this._mergeNum >= this._maxNum) {
            this.btnAdd.enabled = false
            this.btnAdd.interactable = false
        } else {
            this.btnAdd.enabled = true
            this.btnAdd.interactable = true
        }

        this.costLab.string = `${GlobalUtil.numberToStr(GlobalUtil.getMoneyNum(this._needItem.consumption[0]), true)}/${GlobalUtil.numberToStr(this._needItem.consumption[1] * this._mergeNum, true)}`
        this.costLab.node.color = cc.color("#FFCE4B")
        if (GlobalUtil.getMoneyNum(this._needItem.consumption[0]) < this._needItem.consumption[1] * this._mergeNum) {
            this.costLab.node.color = CommonNumColor.red
        }
    }

    selectType(e, index) {
        this._selectIndex = parseInt(index)
        this._partType = this._selectIndex + 1
        for (let i = 0; i < this.tabBtns.length; i++) {
            let node = this.tabBtns[i]
            let btn = node.getComponent(cc.Button)
            btn.interactable = this._selectIndex != i
            let on = node.getChildByName("on")
            let off = node.getChildByName("off")
            on.active = this._selectIndex == i
            off.active = this._selectIndex != i
        }
        this._refreshListData()
        this.list.select_item(0)
    }


    /**更新装备列表 */
    _refreshListData() {
        this._initListView()
        let cfgs = ConfigManager.getItemsByField(Item_equipCfg, "part", this._partType)
        this._itemDatas = []
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].target_equip && cfgs[i].target_equip > 0) {
                let equipCfg = ConfigManager.getItemById(Item_equipCfg, cfgs[i].target_equip)
                this._itemDatas.push(equipCfg)
            }
        }
        // this._fullList()
        this.list.set_data(this._itemDatas)
    }

    _refreshViewData() {
        this._refreshListData()
        this._updateCostNum()
    }

    /**补齐背包数据,补满一列 
   * 并且保证显示满一个背包
  */
    _fullList() {
        let len = this._itemDatas.length
        let row = Math.ceil(len / 5)
        if (row < 5) {
            row = row + 5
            row = Math.min(row, 5);
        }
        let nullRow = Math.ceil(this.scrollView.node.height / 128)
        row = Math.max(row, nullRow);
        let maxNum = row * 5

        for (let index = this._itemDatas.length; index < maxNum; index++) {
            let item = null
            this._itemDatas.push(item)
        }
    }

    mergeFunc() {
        if (this._mergeNum <= 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP5"))
            return
        }
        if (GlobalUtil.getMoneyNum(this._needItem.consumption[0]) < this._needItem.consumption[1] * this._mergeNum) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP6"))
            return
        }

        JumpUtils.showGuideMask()
        this.effectSpine.setAnimation(0, "stand", false)
        this.effectSpine.setCompleteListener(() => {
            JumpUtils.hideGuideMask()
            let msg = new icmsg.EquipComposeReq()
            msg.materialTypeId = this.curEquip.itemId
            msg.composeNumber = this._mergeNum
            NetManager.send(msg, (data: icmsg.EquipComposeRsp) => {
                GlobalUtil.openRewadrView(data.goodsList)
            })
        })
    }

    oneKeyMergeFunc() {
        let values = ConfigManager.getItemById(GlobalCfg, 'key_synthesis').value
        if (this.roleModel.level < values[0]) {
            GlobalUtil.showMessageAndSound(StringUtils.format(gdk.i18n.t("i18n:HERO_TIP7"), values[0]))//`指挥官${values[0]}级开启一键合成`
            return
        }

        if (GlobalUtil.getMoneyNum(this._needItem.consumption[0]) < EquipUtils.getOneKeyEquipMergeCost(this._partType)) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP6"))
            return
        }

        if (!RedPointUtils.is_part_equip_merge(this._partType)) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP5"))
            return
        }

        gdk.panel.setArgs(PanelId.EquipMergeCheck, this._partType)
        gdk.panel.open(PanelId.EquipMergeCheck)
        // let msg = new EquipComposeRecursiveReq()
        // msg.partId = this._partType
        // NetManager.send(msg, (data: EquipComposeRecursiveRsp) => {
        //     GlobalUtil.openRewadrView(data.goodsList)
        // })
    }

}