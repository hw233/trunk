import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import EquipModel from '../../../../../common/models/EquipModel';
import EquipUtils, { AttrType, EquipAttrTYPE } from '../../../../../common/utils/EquipUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import {
    AttrCfg,
    Global_powerCfg,
    HeroCfg,
    SkillCfg,
    Unique_starCfg,
    UniqueCfg
    } from '../../../../../a/config';
import { BagItem, BagType } from '../../../../../common/models/BagModel';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { RoleEventId } from '../../../enum/RoleEventId';

/** 
 * @Description:装备列表
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-11 18:00:16
 */


export type UniqueEquipInfo = {
    bagItem: BagItem,
    selected: boolean,
    power?: number,
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/uniqueEquip/UniqueEquipListCtrl")
export default class UniqueEquipListCtrl extends gdk.BasePanel {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Node)
    attrNodes: cc.Node[] = [];

    @property(cc.Node)
    skillIcon: cc.Node = null;

    @property(cc.Label)
    skillName: cc.Label = null;

    @property(cc.RichText)
    skillDesc: cc.RichText = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    onNode: cc.Node = null;

    @property(cc.Node)
    offNode: cc.Node = null;

    @property(cc.Label)
    limitLab: cc.Label = null;

    @property(cc.Node)
    starNode: cc.Node = null;

    @property(cc.Node)
    starInfo: cc.Node = null;

    @property(cc.Node)
    tipNode: cc.Node = null;

    list: ListView;
    _isSelect: boolean = false
    _curUniqueEquipId: number = -1
    _careerIndex = 0
    _uniqueEquipCfg: UniqueCfg
    _equipInfo: icmsg.UniqueEquip

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel)
    }

    get equipModel(): EquipModel {
        return ModelManager.get(EquipModel)
    }

    onEnable() {
        let args = this.args
        if (args.length > 0) {
            this._curUniqueEquipId = (args[0] as icmsg.UniqueEquip).id
        }
        this._updateViewInfo()
    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 4,
                gap_x: 30,
                gap_y: 15,
                async: true,
                direction: ListViewDir.Vertical,
            })
            this.list.onClick.on(this._selectItem, this);
        }
    }

    _updateViewInfo() {
        this._initListView()
        let equipItems = this.equipModel.uniqueEquipItems
        let inHeros = []
        let freeItems = []
        let inHerosIds = []
        let heroInfos = this.heroModel.heroInfos
        for (let i = 0; i < heroInfos.length; i++) {
            let heroInfo = heroInfos[i].extInfo as icmsg.HeroInfo
            if (heroInfo.uniqueEquip && heroInfo.uniqueEquip.id > 0) {
                let bagItem: BagItem = {
                    series: heroInfo.uniqueEquip.id,
                    itemId: heroInfo.uniqueEquip.itemId,
                    itemNum: 1,
                    type: BagType.UNIQUEEQUIP,
                    extInfo: heroInfo.uniqueEquip,
                }
                let info: UniqueEquipInfo = {
                    bagItem: bagItem,
                    selected: false,
                }
                inHeros.push(info)
                inHerosIds.push(bagItem.series)
            }
        }

        equipItems.forEach(element => {
            let info: UniqueEquipInfo = {
                bagItem: element,
                selected: false,
                //power: GuardianUtils.getGuardianPower(element.itemId, extInfo.level, extInfo.star),
            }
            if (inHerosIds.indexOf(element.series) == -1) {
                freeItems.push(info)
            }
        });

        GlobalUtil.sortArray(inHeros, this.sortFunc)
        GlobalUtil.sortArray(freeItems, this.sortFunc)

        let datas = inHeros.concat(freeItems)
        this.list.set_data(datas, false)

        this.tipNode.active = datas.length == 0

        if (this._curUniqueEquipId > 0) {
            for (let i = 0; i < this.list.datas.length; i++) {
                let info = (this.list.datas[i] as UniqueEquipInfo)
                if (info.bagItem.series == this._curUniqueEquipId) {
                    this._selectItem(info, i)
                    this.list.scroll_to(i)
                    break
                }
            }
        }
    }

    /**排序方法 */
    sortFunc(a: UniqueEquipInfo, b: UniqueEquipInfo) {
        let aExtInfo = a.bagItem.extInfo as icmsg.UniqueEquip
        let bExtInfo = b.bagItem.extInfo as icmsg.UniqueEquip
        let cfgA = ConfigManager.getItemById(UniqueCfg, a.bagItem.itemId);
        let cfgB = ConfigManager.getItemById(UniqueCfg, b.bagItem.itemId);
        if (cfgA.color == cfgB.color) {
            if (aExtInfo.star == bExtInfo.star) {
                return b.bagItem.itemId - a.bagItem.itemId
            }
            return bExtInfo.star - aExtInfo.star
        } else {
            return cfgB.color - cfgA.color
        }
    }

    _selectItem(itemInfo: UniqueEquipInfo, index: number) {
        for (let i = 0; i < this.list.datas.length; i++) {
            if (i == index) {
                (this.list.datas[i] as UniqueEquipInfo).selected = !(this.list.datas[i] as UniqueEquipInfo).selected
                this._isSelect = (this.list.datas[i] as UniqueEquipInfo).selected
            } else {
                (this.list.datas[i] as UniqueEquipInfo).selected = false
            }
        }
        this.list.refresh_items()

        if (this._isSelect) {
            this.onNode.active = true
            this.offNode.active = false
            this._updateSelectInfo(itemInfo.bagItem)
        } else {
            this.onNode.active = false
            this.offNode.active = true
        }
    }

    _updateSelectInfo(item: BagItem) {
        this._equipInfo = item.extInfo as icmsg.UniqueEquip
        this._curUniqueEquipId = this._equipInfo.id
        this.slotItem.updateItemInfo(item.itemId)
        this.slotItem.updateStar(this._equipInfo.star)

        let starCfg = ConfigManager.getItemByField(Unique_starCfg, "unique_id", this._equipInfo.itemId, { star: this._equipInfo.star })
        let keys = ["atk_w", "hp_w", "def_w"]
        let values = [starCfg.atk_g, starCfg.hp_g, starCfg.def_g]
        let attrInfos = []
        for (let i = 0; i < keys.length; i++) {
            let attrCfg = ConfigManager.getItemById(AttrCfg, keys[i])
            if (attrCfg) {
                let info: AttrType = {
                    keyName: keys[i],
                    name: attrCfg.name,
                    value: values[i],
                    type: attrCfg.type,
                }
                attrInfos.push(info)
            }
        }
        let power = 0;
        for (let i = 0; i < this.attrNodes.length; i++) {
            this._updateOneAttr(this.attrNodes[i], attrInfos[i])
            let attrInfo = attrInfos[i] as AttrType
            let ratio = ConfigManager.getItemByField(Global_powerCfg, 'key', attrInfo.keyName.replace("_w", "")).value;
            power += Math.floor(ratio * attrInfo.value);
        }

        this._uniqueEquipCfg = ConfigManager.getItemById(UniqueCfg, item.itemId)

        this.nameLab.string = `${starCfg.unique_name}`
        this.powerLab.string = `战力:${power}`;

        let colorInfo = BagUtils.getColorInfo(this._uniqueEquipCfg.color);
        this.nameLab.string = `${this._uniqueEquipCfg.name}`
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline)


        if (this.heroModel.curHeroInfo) {
            this._careerIndex = this._uniqueEquipCfg.career_id.indexOf(this.heroModel.curHeroInfo.careerId)
            if (this._careerIndex == -1) {
                this._careerIndex = 0
            }
        }

        //this.limitLab.node.active = false
        if (this._uniqueEquipCfg.unique && this._uniqueEquipCfg.unique.length > 0) {
            //this.limitLab.node.active = true
            let heroCfg = ConfigManager.getItemById(HeroCfg, this._uniqueEquipCfg.unique[0])
            this.limitLab.string = `(${heroCfg.name}穿戴后激活)`
            if (this.heroModel.curHeroInfo && this.heroModel.curHeroInfo.typeId == heroCfg.id) {
                this.limitLab.node.color = cc.color("#8DCB2B")
            } else {
                this.limitLab.node.color = cc.color("#7D736C")
            }
        } else {
            this.limitLab.string = `(任意英雄穿戴后激活)`
            this.limitLab.node.color = cc.color("#8DCB2B")
        }

        this.skillName.string = `${this._uniqueEquipCfg.skill_name[this._careerIndex]}`
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, `icon/skill/${this._uniqueEquipCfg.skill_icon[this._careerIndex]}`)

        let starCfgs = ConfigManager.getItemsByField(Unique_starCfg, "unique_id", this._uniqueEquipCfg.id)
        this.skillDesc.string = "";
        this.skillDesc.string = this._careerIndex == 0 ? starCfgs[0].des1 : starCfgs[0].des2

        this.starNode.removeAllChildren()
        for (let index = 0; index < this.starNode.childrenCount; index++) {
            const info = this.starNode.children[index];
            info.active = false
        }
        for (let index = 1; index < starCfgs.length; index++) {
            let starInfo: cc.Node = this.starNode[index]
            if (!starInfo) {
                starInfo = cc.instantiate(this.starInfo)
                starInfo.parent = this.starNode
            }
            starInfo.active = true
            this._updateStarInfo(starInfo, starCfgs[index])
        }
    }

    _updateStarInfo(node, starCfg: Unique_starCfg) {
        let onDes = cc.find("on/des", node).getComponent(cc.RichText)
        let offDes = cc.find("off/des", node).getComponent(cc.RichText)
        onDes.node.parent.active = false
        offDes.node.parent.active = false

        if (this._uniqueEquipCfg.unique && this._uniqueEquipCfg.unique.length > 0) {
            let isActive = this.heroModel.curHeroInfo ? this.heroModel.curHeroInfo.typeId == this._uniqueEquipCfg.unique[0] : false
            if (this._equipInfo.star >= starCfg.star && isActive) {
                onDes.node.parent.active = true
                onDes.string = `[${starCfg.star}星解锁]` + (this._careerIndex == 0 ? `${starCfg.des1}` : `${starCfg.des2}`)
            } else {
                offDes.node.parent.active = true
                offDes.string = `[${starCfg.star}星解锁]` + (this._careerIndex == 0 ? `${starCfg.des1}` : `${starCfg.des2}`)
            }
        } else {
            if (this._equipInfo.star >= starCfg.star || this._equipInfo.id == -1) {
                onDes.node.parent.active = true
                onDes.string = `[${starCfg.star}星解锁]` + (this._careerIndex == 0 ? `${starCfg.des1}` : `${starCfg.des2}`)
            } else {
                offDes.node.parent.active = true
                offDes.string = `[${starCfg.star}星解锁]` + (this._careerIndex == 0 ? `${starCfg.des1}` : `${starCfg.des2}`)
            }
        }
    }

    _updateOneAttr(attNode: cc.Node, attrInfo: AttrType) {
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        typeLab.string = attrInfo.name
        let value = `${attrInfo.value}`
        if (attrInfo.type == EquipAttrTYPE.R) {
            value = `${Number(attrInfo.value / 100).toFixed(1)}%`
        }
        numLab.string = `+${value}`
    }

    onSelectFunc() {
        if (this._isSelect) {
            let uniqueEquip = this.heroModel.curHeroInfo.uniqueEquip
            if (uniqueEquip && uniqueEquip.id == this._curUniqueEquipId) {
                gdk.panel.hide(PanelId.UniqueEquipList)
                return
            }
            let heroInfo = EquipUtils.getUniqueEquipInHeroInfo(this._curUniqueEquipId)
            if (heroInfo) {
                gdk.gui.showMessage("该装备已被穿戴")
                return
            }
            this._reqPuton()
        } else {
            gdk.gui.showMessage("请先选择装备")
        }
    }

    _reqPuton() {
        // let uniqueEquip = this.heroModel.curHeroInfo.uniqueEquip
        // if (uniqueEquip && uniqueEquip.id > 0) {
        //     let msg = new icmsg.UniqueEquipOffReq()
        //     msg.heroId = this.heroModel.curHeroInfo.heroId
        //     msg.id = uniqueEquip.id
        //     NetManager.send(msg, () => {
        //         let msg2 = new icmsg.UniqueEquipOnReq()
        //         msg2.heroId = this.heroModel.curHeroInfo.heroId
        //         msg2.id = this._curUniqueEquipId
        //         NetManager.send(msg2, (data: icmsg.UniqueEquipOnRsp) => {
        //             this.heroModel.curHeroInfo.uniqueEquip = this.equipModel.uniqueIdItems[this._curUniqueEquipId].extInfo as icmsg.UniqueEquip
        //             HeroUtils.updateHeroInfo(this.heroModel.curHeroInfo.heroId, this.heroModel.curHeroInfo)
        //             gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP8"))
        //             gdk.panel.hide(PanelId.UniqueEquipList)
        //             gdk.e.emit(RoleEventId.UPDATE_HERO_UNIQUE_EQUIP)
        //         })
        //     })
        // } else {
        //     let msg = new icmsg.UniqueEquipOnReq()
        //     msg.heroId = this.heroModel.curHeroInfo.heroId
        //     msg.id = this._curUniqueEquipId
        //     NetManager.send(msg, (data: icmsg.UniqueEquipOnRsp) => {
        //         this.heroModel.curHeroInfo.uniqueEquip = this.equipModel.uniqueIdItems[this._curUniqueEquipId].extInfo as icmsg.UniqueEquip
        //         HeroUtils.updateHeroInfo(this.heroModel.curHeroInfo.heroId, this.heroModel.curHeroInfo)
        //         gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP8"))
        //         gdk.panel.hide(PanelId.UniqueEquipList)
        //         gdk.e.emit(RoleEventId.UPDATE_HERO_UNIQUE_EQUIP)
        //     })
        // }
        let msg = new icmsg.UniqueEquipOnReq()
        msg.heroId = this.heroModel.curHeroInfo.heroId
        msg.id = this._curUniqueEquipId
        NetManager.send(msg, (data: icmsg.UniqueEquipOnRsp) => {
            this.heroModel.curHeroInfo.uniqueEquip = this.equipModel.uniqueIdItems[this._curUniqueEquipId].extInfo as icmsg.UniqueEquip
            HeroUtils.updateHeroInfo(this.heroModel.curHeroInfo.heroId, this.heroModel.curHeroInfo)
            gdk.panel.hide(PanelId.UniqueEquipList)
            gdk.e.emit(RoleEventId.UPDATE_HERO_UNIQUE_EQUIP)
        })
    }

    onGotoGetFunc() {
        if (!JumpUtils.ifSysOpen(2955, true)) {
            return
        }
        gdk.panel.hide(PanelId.UniqueEquipList)
        JumpUtils.openGeneEquipView()
    }
}