import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import JewelUtils from '../../../../../common/utils/JewelUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../../common/models/BagModel';
import { EquipAttrTYPE } from '../../../../../common/utils/EquipUtils';
import { Item_equipCfg, Item_rubyCfg } from '../../../../../a/config';

/**
 * @Description: 装备镶嵌面板控制
 * @Author: chengyou.lin
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 11:39:12
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/inlay/EquipInlayItemCtrl2")
export default class EquipInlayItemCtrl2 extends cc.Component {

    @property(cc.Node)
    noInlayNode: cc.Node = null;
    @property(cc.Label)
    tipsLabel: cc.Label = null;
    @property(cc.Node)
    plusIcon: cc.Node = null;

    @property(cc.Node)
    inlayNode: cc.Node = null;
    @property(UiSlotItem)
    slot: UiSlotItem = null;

    // @property(cc.Node)
    // noUpdateNode: cc.Node = null;
    // @property(cc.Label)
    // nameLabel1: cc.Label = null;
    // @property(cc.Label)
    // proLabel1: cc.Label = null;

    // @property(cc.Node)
    // updateNode: cc.Node = null;
    // @property(cc.Label)
    // nameLabel2: cc.Label = null;
    // @property(cc.Label)
    // proLabel2: cc.Label = null;
    // @property(cc.Label)
    // costLabel: cc.Label = null;
    // @property(cc.Label)
    // upProLabel: cc.Label = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Node)
    addLayout: cc.Node = null;

    @property(cc.Label)
    attrLabeles: cc.Label[] = [];

    @property(cc.Node)
    addNodes: cc.Node[] = [];

    @property(cc.Node)
    changeIcon: cc.Node = null;
    @property(cc.Node)
    updateBtn: cc.Node = null;

    onClick: gdk.EventTrigger = gdk.EventTrigger.get();

    holePos: number;
    equip: BagItem;
    rubyId: number;

    onLoad() {
        this.slot.onClick.on(this._clickItem, this);
    }

    private _clickItem(data) {
        if (this.onClick) {
            this.onClick.emit(this, 0);
        }
    }

    onUpdateBtnClick() {
        if (this.onClick) {
            this.onClick.emit(this, 1);
        }
    }

    /**更新装备信息 */
    updateData(equip: BagItem, rubyId: number) {
        if (!this.node.active) {
            return;
        }
        this.equip = equip;
        this.rubyId = rubyId;
        let isInlay = rubyId > 0;
        this.noInlayNode.active = !isInlay;
        this.inlayNode.active = isInlay;
        this.plusIcon.active = false;
        this.changeIcon.active = false;
        if (isInlay) {
            this._updateInlay(equip, rubyId);
        } else {
            this._updateNoInlay(equip);
        }
    }

    //显示可切换图标
    showChangeIcon(active: boolean) {
        this.changeIcon.active = active;
    }

    //显示可镶嵌图标
    showInlayIcon(active: boolean) {
        this.plusIcon.active = active;
    }

    _updateInlay(equip: BagItem, rubyId: number) {
        let equipInfo = <icmsg.EquipInfo>equip.extInfo;
        let maxLv = JewelUtils.getJewelMaxLv(equipInfo.equipId);
        let rubyCfg = ConfigManager.getItemById(Item_rubyCfg, rubyId);
        this.slot.updateItemInfo(rubyId);
        this.slot.node.opacity = 255;

        let nextRubyCfg;
        if (rubyCfg.level < maxLv) {
            nextRubyCfg = ConfigManager.getItemByField(Item_rubyCfg, "level", rubyCfg.level + 1, { type: rubyCfg.type, sub_type: rubyCfg.sub_type });
        }
        //达到升级条件
        let isCanUpdate: boolean = false;
        if (nextRubyCfg) {
            let bagJewelExps = BagUtils.getJewelExpByType(nextRubyCfg.sub_type, nextRubyCfg.type, nextRubyCfg.level - 1);
            let totalExps = bagJewelExps + rubyCfg.exp;
            isCanUpdate = Math.floor(totalExps / nextRubyCfg.exp) >= 1;
        }
        this._initState()
        this.updateBtn.active = isCanUpdate
        this.addLayout.active = isCanUpdate
        let attArr = BagUtils.getJewelAttrById(rubyId);
        this.nameLabel.string = `${rubyCfg.name}`
        for (let i = 0; i < attArr.length; i++) {
            let attrLab = this.attrLabeles[i]
            attrLab.node.active = true
            let v = `${attArr[i].value}`
            if (attArr[i].type == EquipAttrTYPE.R) {
                v = `${attArr[i].value / 100}%`
            }
            attrLab.string = `${attArr[i].name} +${v}`
        }

        if (isCanUpdate) {
            let nextAttArr = BagUtils.getJewelAttrById(nextRubyCfg.id);
            for (let i = 0; i < nextAttArr.length; i++) {
                let addNode = this.addNodes[i]
                addNode.active = true
                let addLab = addNode.getChildByName("upProLabel").getComponent(cc.Label)
                let v = `${nextAttArr[i].value}`
                if (nextAttArr[i].type == EquipAttrTYPE.R) {
                    v = `${nextAttArr[i].value / 100}%`
                }
                addLab.string = `+${v}`
            }

            if (attArr.length < nextAttArr.length) {
                for (let i = 0; i < nextAttArr.length; i++) {
                    let attrLab = this.attrLabeles[i]
                    attrLab.node.active = true
                    if (attArr[i]) {
                        let v = `${attArr[i].value}`
                        if (attArr[i].type == EquipAttrTYPE.R) {
                            v = `${attArr[i].value / 100}%`
                        }
                        attrLab.string = `${attArr[i].name} +${v}`
                    } else {
                        let v = `${0}`
                        if (nextAttArr[i].type == EquipAttrTYPE.R) {
                            v = `${0}%`
                        }
                        attrLab.string = `${nextAttArr[i].name} +${v}`
                    }
                }
            }
        }
    }

    _initState() {
        for (let i = 0; i < this.attrLabeles.length; i++) {
            this.attrLabeles[i].node.active = false
        }

        for (let i = 0; i < this.addNodes.length; i++) {
            this.addNodes[i].active = false
        }
    }

    _updateNoInlay(equip: BagItem) {
        let equipCfg = ConfigManager.getItemById(Item_equipCfg, equip.itemId);
        let rubyId = 0;
        if (equipCfg.part == 1) {
            this.tipsLabel.string = "可镶嵌伤害宝石";
        } else {
            let items = ConfigManager.getItemsByField(Item_rubyCfg, "equip_part", equipCfg.part);
            for (let i = 0; i < items.length; i++) {
                if (items[i].part.indexOf(this.holePos) != -1) {
                    let item = items[i];
                    rubyId = item.id;
                    let itemName = item.name
                    let str = itemName.replace(/\d*/, "")
                    this.tipsLabel.string = `可镶嵌${str.replace("级", "")}`;
                    break
                }
            }
        }
        this.slot.updateItemInfo(0);
        this.slot.updateItemIcon(GlobalUtil.getIconById(rubyId));
        this.slot.updateQuality(-1);
        this.slot.node.opacity = 150;
    }

}