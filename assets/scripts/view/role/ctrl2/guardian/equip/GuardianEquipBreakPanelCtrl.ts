import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuardianModel from '../../../model/GuardianModel';
import GuardianUtils from '../GuardianUtils';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import StringUtils from '../../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { AttrType } from '../../../../../common/utils/EquipUtils';
import { BagEvent } from '../../../../bag/enum/BagEvent';
import { BagItem, BagType } from '../../../../../common/models/BagModel';
import { Guardian_equip_starCfg, Guardian_equipCfg } from '../../../../../a/config';
import { GuardianEquipItemInfo } from './GuardianEquipStrengthenPanelCtrl';
import { GuardianEquipTipsType } from './GuardianEquipTipsCtrl';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';

const { ccclass, property, menu } = cc._decorator;
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-20 11:55:06
 */

@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipBreakPanelCtrl")
export default class GuardianEquipBreakPanelCtrl extends gdk.BasePanel {

    @property(UiSlotItem)
    targetSlot: UiSlotItem = null;

    @property(cc.Label)
    equipName: cc.Label = null;

    @property(cc.Label)
    curStar: cc.Label = null;

    @property(cc.Label)
    nextStar: cc.Label = null;

    @property(cc.Label)
    curLv: cc.Label = null;

    @property(cc.Label)
    nextLv: cc.Label = null;

    @property(UiSlotItem)
    selectSlot: UiSlotItem = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Prefab)
    costItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    noEquipTips: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    btnBreak: cc.Node = null;

    @property(cc.Node)
    breakNode: cc.Node = null;

    @property(cc.Node)
    attPanel1: cc.Node = null

    @property(cc.Node)
    attPanel2: cc.Node = null

    @property(cc.Node)
    attNode: cc.Node = null

    @property(cc.Node)
    maxNode: cc.Node = null

    @property(sp.Skeleton)
    spineEffect: sp.Skeleton = null;

    list: ListView;

    openArg: icmsg.GuardianEquip;
    curGuardianEquip: GuardianEquipItemInfo

    get guardianModel(): GuardianModel { return ModelManager.get(GuardianModel); }

    _extInfo: icmsg.GuardianEquip
    _equipCfg: Guardian_equipCfg
    _targetStarCfg: Guardian_equip_starCfg

    onEnable() {
        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateList, this)
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateList, this)
        this._updateList();
    }

    onDisable() {
        this.curGuardianEquip = null;
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.itemPrefab,
            cb_host: this,
            async: true,
            column: 5,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._clickItem, this)
    }

    selectById(equipInfo: icmsg.GuardianEquip) {
        this.openArg = equipInfo
        this._updateList();
    }

    _updateList() {
        this._initListView();
        let datas: GuardianEquipItemInfo[] = [];
        let list1 = this.guardianModel.guardianEquipInHeros
        if (list1.length <= 0) {
            this._clickItem(null);
            this.scrollView.node.active = false;
            this.noEquipTips.active = true;
            //this.noEquipTips.getChildByName('lab').getComponent(cc.Label).string = gdk.i18n.t("i18n:ROLE_TIP19")
        }
        else {
            this.scrollView.node.active = true;
            this.noEquipTips.active = false;
            // let sortFunc = (a: BagItem, b: BagItem) => {
            //     let cfgA = ConfigManager.getItemById(CostumeCfg, a.itemId);
            //     let cfgB = ConfigManager.getItemById(CostumeCfg, b.itemId);
            //     if ((a.extInfo as icmsg.CostumeInfo).level == (b.extInfo as icmsg.CostumeInfo).level) {
            //         return cfgB.color - cfgA.color;
            //     }
            //     else {
            //         return (b.extInfo as icmsg.CostumeInfo).level - (a.extInfo as icmsg.CostumeInfo).level;
            //     }
            // };
            // list1.sort(sortFunc);
            datas = [...list1];
            //this.list.clear_items();
            this.list.set_data(datas, false);
            gdk.Timer.clearAll(this);
            gdk.Timer.callLater(this, () => {
                if (cc.isValid(this.node)) {
                    let idx = 0;
                    if (this.openArg || this.guardianModel.curSelectGuardianEquip) {
                        for (let i = 0; i < datas.length; i++) {
                            let id = (<icmsg.GuardianEquip>datas[i].bagItem.extInfo).id
                            if ((this.openArg && id == this.openArg.id)
                                || (this.guardianModel.curSelectGuardianEquip && id == this.guardianModel.curSelectGuardianEquip.id)) {
                                idx = i;
                                break;
                            }
                        }
                    }
                    this.list.select_item(idx);
                    this.list.scroll_to(idx);
                }
            });
        }
    }

    _clickItem(itemInfo: GuardianEquipItemInfo) {
        if (!itemInfo) {
            this.equipName.string = '';
            this.costNode.parent.active = false;
            this.btnBreak.active = false;
            this.targetSlot.node.active = false;
            this.breakNode.active = false
        }
        else {
            this.curGuardianEquip = itemInfo;
            this._updateTopView(itemInfo);
        }
    }

    _updateTopView(itemInfo: GuardianEquipItemInfo) {
        this._extInfo = itemInfo.bagItem.extInfo as icmsg.GuardianEquip
        this.guardianModel.curSelectGuardianEquip = this._extInfo

        this._equipCfg = ConfigManager.getItemById(Guardian_equipCfg, itemInfo.bagItem.itemId)
        let starCfgs = ConfigManager.getItems(Guardian_equip_starCfg, { part: this._equipCfg.part, type: this._equipCfg.type })
        this._targetStarCfg = ConfigManager.getItemByField(Guardian_equip_starCfg, "star", this._extInfo.star, { part: this._equipCfg.part, type: this._equipCfg.type })
        this.equipName.string = `${this._equipCfg.name}`
        let colorInfo = BagUtils.getColorInfo(this._targetStarCfg.color);
        this.equipName.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.equipName.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);

        if (this._extInfo.star >= starCfgs.length) {
            this.breakNode.active = false
            this.btnBreak.active = false
            this.costNode.parent.active = false
            this.maxNode.active = true
            this._updateMaxNode()
        } else {
            this.maxNode.active = false
            this.costNode.parent.active = true;
            this.btnBreak.active = true;
            this.breakNode.active = true
            this.curStar.string = '1'.repeat(this._extInfo.star) + "0".repeat(starCfgs.length - this._extInfo.star)
            this.nextStar.string = '1'.repeat(this._extInfo.star + 1) + "0".repeat(starCfgs.length - this._extInfo.star - 1)
            this.curLv.string = `${this._targetStarCfg.limit}`
            this.nextLv.string = `${this._targetStarCfg.limit + 10}`
            this._updateBreakAddAttr()
        }
        this.targetSlot.node.active = true
        this.targetSlot.updateItemInfo(itemInfo.bagItem.itemId)
        this.targetSlot.updateStar(this._extInfo.star)
        this.targetSlot.starNum = this._extInfo.star
        this.targetSlot.node.getChildByName("lv").getComponent(cc.Label).string = '.' + this._extInfo.level + ''
        this.guardianModel.breakSelectIds = []
        this._updateCostNode()
    }

    _updateCostNode() {
        this.costNode.removeAllChildren()
        let costItems = this._targetStarCfg ? this._targetStarCfg.consumption : []
        for (let i = 0; i < costItems.length; i++) {
            let item = cc.instantiate(this.costItemPrefab)
            item.scale = 0.8
            this.costNode.addChild(item)
            let ctrl = item.getComponent(UiSlotItem)
            let itemId = costItems[i][0]
            let needNum = costItems[i][1]
            ctrl.updateItemInfo(itemId)
            ctrl.itemInfo = {
                series: null,
                itemId: itemId,
                itemNum: 1,
                type: BagUtils.getItemTypeById(itemId),
                extInfo: null
            }

            let hasNum = BagUtils.getItemNumById(itemId)
            ctrl.UiNumLab.node.anchorX = 0.5
            ctrl.UiNumLab.node.x = 0
            ctrl.UiNumLab.node.active = true
            ctrl.UiNumLab.string = `${GlobalUtil.numberToStr(hasNum, true, true)}/${GlobalUtil.numberToStr(needNum, true, true)}`
            if (hasNum < costItems[i][1]) {
                ctrl.UiNumLab.node.color = cc.color("#ff0000")
            } else {
                ctrl.UiNumLab.node.color = cc.color("#ffffff")
            }
        }
    }

    onSelectFunc() {
        gdk.panel.setArgs(PanelId.GuardianEquipBreakMaterialsSelect, this._targetStarCfg)
        gdk.panel.open(PanelId.GuardianEquipBreakMaterialsSelect)
    }


    @gdk.binding("guardianModel.breakSelectIds")
    updateMaterials() {
        if (!this.curGuardianEquip) {
            return
        }
        let ctrl = this.selectSlot.node.getComponent(UiSlotItem)
        let proLab = cc.find("bg/proLab", this.selectSlot.node).getComponent(cc.RichText)
        let add = this.selectSlot.node.getChildByName("add")

        if (!this._targetStarCfg || (this._targetStarCfg && !this._targetStarCfg.special)) {

            return
        }

        let itemId = this._targetStarCfg.special[0][0]
        let needNum = this._targetStarCfg.special[0][1]
        ctrl.updateItemInfo(itemId)
        let ids = this.guardianModel.breakSelectIds
        if (ids.length == 0) {
            add.active = true
            proLab.string = StringUtils.setRichtOutLine(`<color=#ff0000>${0}</c>/${needNum}`, "#000000", 2)
            return
        }
        add.active = false
        let ownNum = this.guardianModel.breakSelectIds.length
        let ownNumStr = `${ownNum}`
        if (ownNum < needNum) {
            ownNumStr = `<color=#ff0000>${ownNum}</c>`
        }
        proLab.string = StringUtils.setRichtOutLine(`${ownNumStr}/${needNum}`, "#000000", 2)
    }

    onBreakFunc() {
        if (this._extInfo.level < this._targetStarCfg.limit) {
            gdk.gui.showMessage("请将装备强化至满级后再进行突破")
            return
        }
        let needNum = this._targetStarCfg.special[0][1]
        if (this.guardianModel.breakSelectIds.length < needNum) {
            gdk.gui.showMessage("突破材料不足")
            return
        }

        let costItems = this._targetStarCfg.consumption
        for (let i = 0; i < costItems.length; i++) {
            let hasNum = BagUtils.getItemNumById(costItems[i][0])
            if (hasNum < costItems[i][1]) {
                gdk.gui.showMessage("突破材料不足")
                return
            }
        }

        let target = new icmsg.GuardianInHero()
        target.heroId = this.curGuardianEquip.heroId
        target.guardianId = this.curGuardianEquip.guardianId

        let cost1 = []//本体唯一id
        let cost2 = new icmsg.GoodsInfo()
        cost2.typeId = this._targetStarCfg.alternative[0][0]
        let cost2Num = 0
        let ids = this.guardianModel.breakSelectIds
        ids.forEach(id => {
            if (id.toString().length > 6) {
                cost2Num++
            } else {
                cost1.push(id)
            }
        });
        cost2.num = cost2Num
        let msg = new icmsg.GuardianEquipStarUpReq()
        msg.target = target
        msg.part = this._equipCfg.part
        msg.cost1 = cost1
        msg.cost2 = cost2.num > 0 ? [cost2] : []
        NetManager.send(msg, (data: icmsg.GuardianEquipStarUpRsp) => {
            this.openArg = this.curGuardianEquip.bagItem.extInfo as icmsg.GuardianEquip
            GuardianUtils.updateGuardian(data.guardian.id, data.guardian)
            this.spineEffect.node.active = true
            this.spineEffect.setAnimation(0, "stand3", false)
            this.spineEffect.setCompleteListener(() => {
                this.spineEffect.setCompleteListener(null);
                this.spineEffect.node.active = false;
                gdk.panel.setArgs(PanelId.GuardianEquipBreakSuccess, this._equipCfg, this._targetStarCfg, this._extInfo)
                gdk.panel.open(PanelId.GuardianEquipBreakSuccess)
            });

        })
    }

    _updateBreakAddAttr() {
        for (let index = 0; index < this.attPanel1.childrenCount; index++) {
            const attNode = this.attPanel1.children[index];
            attNode.active = false
        }
        let attrArr = GuardianUtils.getTargetEquipBreakAddAttr(this._extInfo)
        for (let index = 0; index < attrArr.length; index++) {
            const info: AttrType = attrArr[index];
            let attNode: cc.Node = this.attPanel1[index]
            if (!attNode) {
                attNode = cc.instantiate(this.attNode)
                attNode.parent = this.attPanel1
            }
            this._updateOneAtt(attNode, info)
        }

        let nextExtInfo = new icmsg.GuardianEquip()
        nextExtInfo.id = this._extInfo.id
        nextExtInfo.level = this._extInfo.level
        nextExtInfo.star = this._extInfo.star + 1
        nextExtInfo.type = this._extInfo.type
        let nextAttrArr = GuardianUtils.getTargetEquipBreakAddAttr(nextExtInfo)
        for (let index = 0; index < this.attPanel2.childrenCount; index++) {
            const attNode = this.attPanel2.children[index];
            attNode.active = false
        }
        for (let index = 0; index < nextAttrArr.length; index++) {
            const info: AttrType = nextAttrArr[index];
            let attNode: cc.Node = this.attPanel2[index]
            if (!attNode) {
                attNode = cc.instantiate(this.attNode)
                attNode.parent = this.attPanel2
            }
            this._updateOneAtt(attNode, info)
        }

        this.scheduleOnce(() => {
            this.attPanel1.parent.height = this.attPanel1.height
            this.breakNode.getComponent(cc.Layout).updateLayout()
        }, 0.2)
    }

    _updateOneAtt(attNode: cc.Node, info: AttrType) {
        let value = info.initValue
        if (value == 0) {
            attNode.active = false
            return
        }
        attNode.active = true
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        typeLab.string = info.name
        numLab.string = `+${value}`
    }

    _updateMaxNode() {
        let star = cc.find("star", this.maxNode).getComponent(cc.Label)
        let lv = cc.find("lv", this.maxNode).getComponent(cc.Label)
        let attPanel = cc.find("attPanel", this.maxNode)

        star.string = '1'.repeat(this._extInfo.star)
        lv.string = `${this._targetStarCfg.limit}`

        for (let index = 0; index < attPanel.childrenCount; index++) {
            const attNode = attPanel.children[index];
            attNode.active = false
        }

        let attrArr = GuardianUtils.getTargetEquipAttr(this._extInfo)
        for (let index = 0; index < attrArr.length; index++) {
            const info: AttrType = attrArr[index];
            let attNode: cc.Node = attPanel[index]
            if (!attNode) {
                attNode = cc.instantiate(this.attNode)
                attNode.parent = attPanel
            }
            this._updateOneAtt(attNode, info)
        }
    }

    onTopItemTip() {
        let bagItem: BagItem = {
            series: this._extInfo.id,
            itemId: this._extInfo.type,
            itemNum: 1,
            type: BagType.GUARDIANEQUIP,
            extInfo: this._extInfo,
        }
        //打开装备提示框
        let tipsInfo: GuardianEquipTipsType = {
            itemInfo: bagItem,
            from: PanelId.Bag.__id__,
        };
        gdk.panel.open(PanelId.GuardianEquipTips, null, null, { args: tipsInfo });
    }

    onGetFunc() {
        JumpUtils.openView(2898)
    }
}