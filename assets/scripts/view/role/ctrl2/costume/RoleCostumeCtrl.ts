import ConfigManager from '../../../../common/managers/ConfigManager';
import CostumeStrengthenPanelCtrl from './CostumeStrengthenPanelCtrl';
import CostumeUtils from '../../../../common/utils/CostumeUtils';
import EquipViewCtrl2 from '../equip/EquipViewCtrl2';
import ErrorManager from '../../../../common/managers/ErrorManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointCtrl from '../../../../common/widgets/RedPointCtrl';
import RoleModel from '../../../../common/models/RoleModel';
import RoleViewCtrl2 from '../main/RoleViewCtrl2';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { AttrType, EquipAttrTYPE } from '../../../../common/utils/EquipUtils';
import { BagItem, BagType } from '../../../../common/models/BagModel';
import { Costume_compositeCfg, CostumeCfg } from '../../../../a/config';
import { CostumeTipsType } from './CostumeTipsCtrl';
import { RoleEventId } from '../../enum/RoleEventId';
import { SelectInfo } from '../main/equip/EquipSelectCtrl2';

/**
 * @Description: 神装
 * @Author: luoyong
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-25 11:08:53
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/costume/RoleCostumeCtrl")
export default class RoleCostumeCtrl extends gdk.BasePanel {

    @property(cc.Node)
    costumeNodes: Array<cc.Node> = [];

    costumeCtrls: Array<UiSlotItem> = [];

    @property(cc.Label)
    attrLabs: Array<cc.Label> = [];

    @property(cc.Node)
    partNode: Array<cc.Node> = [];

    @property(cc.Node)
    typeNode: Array<cc.Node> = [];

    @property(cc.Node)
    suitContent: cc.Node = null

    @property(cc.Node)
    suitNode: cc.Node = null

    @property(cc.Node)
    noTip: cc.Node = null

    @property(cc.Label)
    suitLab: cc.Label = null

    @property(sp.Skeleton)
    spines: Array<sp.Skeleton> = []

    get model() {
        return ModelManager.get(HeroModel);
    }

    get heroInfo() {
        return this.model.curHeroInfo;
    }

    get roleModel() {
        return ModelManager.get(RoleModel);
    }


    onEnable() {

        gdk.e.on(RoleEventId.COSTUME_ADD, this._updateEquips, this);
        gdk.e.on(RoleEventId.COSTUME_REMOVE, this._updateEquips, this);

        // 点击事件
        for (let index = 0; index < this.costumeNodes.length; index++) {
            const element = this.costumeNodes[index];
            this.costumeCtrls[index] = element.getComponent(UiSlotItem);
            element.on(cc.Node.EventType.TOUCH_END, () => {
                this._equipClick(index);
            }, this);
        }
    }

    onDisable() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
        ErrorManager.targetOff(this);
        for (let index = 0; index < this.costumeNodes.length; index++) {
            const element = this.costumeNodes[index];
            element.targetOff(this);
        }
    }

    /**更新英雄信息 */
    @gdk.binding("model.curHeroInfo")
    _updateHero(curHero: icmsg.HeroInfo) {
        if (!curHero) {
            return;
        }
        this._updateEquips();
        gdk.e.emit(RoleEventId.UPDATE_ONE_HERO)
    }

    /**更新英雄装备 */
    _updateEquips() {
        if (!this.heroInfo) {
            return
        }
        // this._clearEquipSelect()
        gdk.Timer.callLater(this, () => {
            // 设置各装备状态
            for (let index = 0; index < 4; index++) {
                this._refreshEquipInfo(index)
            }

        })
        this._updateAttr()
    }

    /**更新装备的信息 */
    _refreshEquipInfo(index) {
        let heroInfo = this.heroInfo;
        let costumeIds = heroInfo.costumeIds //神装信息
        const info: icmsg.CostumeInfo = costumeIds[index] ? costumeIds[index] : null
        let ctrl = this.costumeCtrls[index]
        let add = ctrl.node.getChildByName("add")
        add.active = info.id > 0 ? false : CostumeUtils.get_free_costumesByCareerAndPart(heroInfo, index).length > 0
        let redPoint = ctrl.node.getComponent(RedPointCtrl)
        redPoint.isShow = false
        let itemId = 0
        if (info.id > 0) {
            itemId = info.typeId
            redPoint.isShow = true
        }
        ctrl.updateItemInfo(itemId)
        ctrl.updateStar(0)
        let typeIcon = ctrl.node.getChildByName("type_icon")
        typeIcon.active = true
        //强化等级
        let strenghLv = ctrl.node.getChildByName("strengthLv").getComponent(cc.Label)
        strenghLv.string = info.id > 0 ? `.${info.level}` : ""
        if (itemId > 0) {
            let cfg = ConfigManager.getItemById(CostumeCfg, itemId)
            if (cfg) {
                ctrl.updateStar(cfg.star)
            } else {
                CC_DEBUG && cc.error("id：" + itemId + "没有相应的配置")
            }
            typeIcon.active = false
        }
    }



    /**装备点击 */
    _equipClick(index: number) {
        let heroInfo = this.heroInfo
        if (!heroInfo) {
            return
        }
        // this._clearEquipSelect()
        let costumeIds = heroInfo.costumeIds //神装信息
        let info: icmsg.CostumeInfo = costumeIds[index] ? costumeIds[index] : null
        if (info && info.id > 0) {
            let costumeData: BagItem = CostumeUtils.getCostumeData(info.id)
            if (!costumeData) {
                let bagItem: BagItem = {
                    series: info.id,
                    itemId: info.typeId,
                    itemNum: 1,
                    type: BagType.COSTUME,
                    extInfo: info,
                }
                costumeData = bagItem
            }
            this.model.curCostume = costumeData
            //打开装备提示框
            let tipsInfo: CostumeTipsType = {
                itemInfo: costumeData,
                from: gdk.Tool.getResIdByNode(this.node),
                equipOnCb: () => {
                    this._openStrengthenPanel(index);
                },
                equipChangeCb: () => {
                    this._openCostumeSelect(index);
                },
            };
            gdk.panel.open(PanelId.CostumeTips, null, null, { args: tipsInfo });
        } else {
            this.model.curCostume = null
            this._openCostumeSelect(index)
        }
    }

    _openStrengthenPanel(index) {
        let info = this.model.curCostume.extInfo as icmsg.CostumeInfo
        this.close();
        let panel = gdk.panel.get(PanelId.RoleView2);
        let roleCtrl = panel.getComponent(RoleViewCtrl2);
        //let origNode = gdk.gui.getCurrentView();
        JumpUtils.openPanel({
            panelId: PanelId.EquipView2,
            panelArgs: { args: 2 },
            // hideArgs: {
            //     id: PanelId.RoleView2,
            //     args: roleCtrl.panelIndex,
            // },
            callback: (node: cc.Node) => {
                let e_ctrl = node.getComponent(EquipViewCtrl2);
                e_ctrl._onPanelShow = (node: cc.Node) => {
                    if (!node) return;
                    let ctrl = node.getComponent(CostumeStrengthenPanelCtrl);
                    ctrl.selectById(info)
                    e_ctrl._onPanelShow = null;
                };
            },
        })
    }

    _openCostumeSelect(index) {
        let heroId = this.heroInfo.heroId;
        let costumeIds = this.heroInfo.costumeIds //神装信息
        let info: icmsg.CostumeInfo = costumeIds[index]
        let costumeData: BagItem = {
            series: info.id,
            itemId: info.typeId,
            itemNum: 1,
            type: BagType.COSTUME,
            extInfo: info,
        }
        let args: SelectInfo = {
            extData: {
                part: index,
                curEquip: costumeData,
                heroId: heroId,
                careerId: this.heroInfo.careerId,
            }
        };
        gdk.panel.open(PanelId.CostumeSelect, null, null, {
            args: args,
        });
    }

    _updateAttr() {
        let costumeIds = this.heroInfo.costumeIds //神装信息
        let keys = ["hp_g", "atk_g", "def_g", "atk_dmg"]
        for (let i = 0; i < this.attrLabs.length; i++) {
            let keyMap = CostumeUtils.getAllCostumeAttr(costumeIds)
            let info: AttrType = keyMap[keys[i]] ? keyMap[keys[i]] : null
            this.attrLabs[i].string = `+${0}`
            if (info) {
                let value = `${info.value}`
                if (info.type == EquipAttrTYPE.R) {
                    value = `${Number(info.value / 100).toFixed(1)}%`
                }
                this.attrLabs[i].string = `+${value}`
            }
        }

        for (let index = 0; index < this.suitContent.childrenCount; index++) {
            const suitNode = this.suitContent.children[index];
            suitNode.active = false
        }
        let isSuit = false
        let suitNum = 0//是否有多套装
        let suitMap = CostumeUtils.getCostumeSuitInfo(costumeIds)
        let suitName = ``
        let suitActiveType = []
        for (let key in suitMap) {
            if (suitMap[key].length >= 2) {
                suitNum++
                suitActiveType.push(parseInt(key))
            }
        }
        for (let key in suitMap) {
            let colors = suitMap[key]
            //颜色从小到大
            GlobalUtil.sortArray(colors, (a: number, b: number) => {
                return a - b
            })
            let suitCfgs: Costume_compositeCfg[] = []
            if (colors.length >= 2) {
                let type = parseInt(key)
                let color1Num = CostumeUtils.getSuitColorNum(colors, 1, true)
                let color2Num = CostumeUtils.getSuitColorNum(colors, 2, true)
                let color3Num = CostumeUtils.getSuitColorNum(colors, 3, true)
                let color4Num = CostumeUtils.getSuitColorNum(colors, 4, true)
                let colorNums = [{ color: 1, num: color1Num }, { color: 2, num: color2Num }, { color: 3, num: color3Num }, { color: 4, num: color4Num }]
                GlobalUtil.sortArray(colorNums, (a: any, b: any) => {
                    if (a.num == b.num) {
                        return b.color - a.color
                    }
                    return a.num - b.num
                })

                let colorMax = this._getColorMax(colorNums, 4)
                let colorMin = this._getColorMax(colorNums, 2)
                let numMax = CostumeUtils.getSuitColorNum(colors, colorMax, true)
                let numMin = CostumeUtils.getSuitColorNum(colors, colorMin, true)

                let suitCfgMax = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMax, num: numMax })
                let suitCfgMin = null//
                if (colorMin != colorMax || suitNum > 1) {
                    suitCfgMin = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMin, num: numMin })
                }
                if (suitCfgMin && colorMin != colorMax) {
                    if (suitCfgMax.num != suitCfgMin.num) {
                        suitCfgs.push(suitCfgMin)
                    } else {
                        if (colorMin > colorMax) {
                            suitCfgMax = suitCfgMin
                        }
                    }
                }
                suitCfgs.push(suitCfgMax)

                if (suitNum == 1 && suitCfgs.length == 1) {
                    let suitCfg2 = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMax, num: 2 })
                    let suitCfg4 = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMax, num: 4 })

                    if (suitCfg2.num != suitCfgs[0].num) {
                        suitCfgs.push(suitCfg2)
                    }

                    if (suitCfg4.num != suitCfgs[0].num) {
                        suitCfgs.push(suitCfg4)
                    }
                }

                GlobalUtil.sortArray(suitCfgs, (a, b) => {
                    return a.num - b.num
                })

                for (let index = 0; index < suitCfgs.length; index++) {
                    let s_node: cc.Node = this.suitContent[index]
                    if (!s_node) {
                        s_node = cc.instantiate(this.suitNode)
                        s_node.parent = this.suitContent
                    }
                    let number = CostumeUtils.getSuitColorNum(colors, suitCfgs[index].color)
                    this._updateSuitNode(s_node, suitCfgs[index], number)
                    if (suitName == '') {
                        suitName = suitCfgs[index].name
                    } else {
                        if (suitName != suitCfgs[index].name) {
                            suitName += `&${suitCfgs[index].name}`
                        }
                    }
                }
                isSuit = true
            }
        }
        this.noTip.active = !isSuit
        if (isSuit) {
            this.suitLab.string = `${suitName}`
        } else {
            this.suitLab.string = gdk.i18n.t("i18n:ROLE_TIP24")
        }

        let aniArr = ["stand", "stand2", "stand4", "stand3"]
        for (let i = 0; i < costumeIds.length; i++) {
            this.partNode[i].active = false
            this.typeNode[i].active = false
            this.spines[i].node.active = false
            let c_cfg = ConfigManager.getItemById(CostumeCfg, costumeIds[i].typeId)
            if (c_cfg) {
                this.partNode[i].active = true
                this.typeNode[i].active = true
                GlobalUtil.setSpriteIcon(this.node, this.partNode[i], `view/role/texture/costume/sz_${c_cfg.color}_${c_cfg.part + 1}`)
                GlobalUtil.setSpriteIcon(this.node, this.typeNode[i], `view/role/texture/costume/suit/sz_suit_${c_cfg.type}_${c_cfg.part + 1}`)
                if (suitActiveType.indexOf(c_cfg.type) != -1) {
                    this.spines[i].node.active = true
                    this.spines[i].setAnimation(0, aniArr[i], true)
                }
            }

        }
    }

    _updateSuitNode(sNode: cc.Node, cfg: Costume_compositeCfg, hasNum) {
        sNode.active = true
        let suitLab = sNode.getChildByName("suitLab").getComponent(cc.Label)
        let suitDes = sNode.getChildByName("suitDes").getComponent(cc.RichText)
        suitLab.string = `${cfg.name}${cfg.num}${gdk.i18n.t("i18n:ROLE_TIP23")}(${hasNum > cfg.num ? cfg.num : hasNum}/${cfg.num})`
        suitDes.string = `${cfg.des}`
        if (hasNum < cfg.num) {
            suitDes.node.color = cc.color("#7D736C")
        } else {
            suitDes.node.color = cc.color("#F1B77F")
        }
    }

    openAttrTip() {
        gdk.panel.setArgs(PanelId.CostumeAttrTips, this.heroInfo.costumeIds)
        gdk.panel.open(PanelId.CostumeAttrTips)
    }

    _getColorMax(colorNums, num) {
        for (let i = 0; i < colorNums.length; i++) {
            if (colorNums[i].num >= num) {
                return colorNums[i].color
            }
        }
        return 1
    }


    // _clearEquipSelect() {
    //     for (let index = 0; index < this.costumeNodes.length; index++) {
    //         const element = this.costumeNodes[index];
    //         this._fadeEquip(element, false)
    //     }
    // }

    // /**装备选中UI变化 */
    // _fadeEquip(node: cc.Node, flag: boolean) {
    //     let selectIcon = node.getChildByName("selectIcon")
    //     if (flag) {
    //         selectIcon.active = true
    //     } else {
    //         selectIcon.active = false
    //     }
    // }
}