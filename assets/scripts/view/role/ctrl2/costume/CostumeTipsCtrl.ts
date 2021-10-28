import BagUtils from '../../../../common/utils/BagUtils';
import ButtonSoundId from '../../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CostumeUtils from '../../../../common/utils/CostumeUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { AttrType, EquipAttrTYPE } from '../../../../common/utils/EquipUtils';
import { BagItem } from '../../../../common/models/BagModel';
import {
    Costume_attrCfg,
    Costume_compositeCfg,
    Costume_qualityCfg,
    CostumeCfg
    } from '../../../../a/config';


export type CostumeTipsType = {
    itemInfo: BagItem,
    from?: string | number,  // 装备来源 panelId中定义的名称
    noBtn?: Boolean, // 是否隐藏按钮
    equipOnCb?: (info?: BagItem) => void,   // 穿装备回调
    equipOffCb?: (info?: BagItem) => void,  // 脱装备回调
    equipChangeCb?: (info?: BagItem) => void,    // 替换装备回调
    thisArg?: any,
    isOther?: boolean,//是否其他人装备
}

export const AttrIconPath = {
    "生命": "yx_tctubiao02",
    "回复效果": "yx_tctubiao02",
    "攻击": "yx_tctubiao04",
    "无视防御": "yx_tctubiao04",
    "攻速": "yx_tctubiao04",
    "普攻伤害": "sz_shanghaitubiao",
    "防御": "yx_tctubiao03",
    "技能免伤": "yx_tctubiao03",
    "免伤": "yx_tctubiao03",
    "普攻免伤": "yx_tctubiao03",
    "抗性": "yx_tctubiao03",
    "命中": "yx_tctubiao06",
    "闪避": "yx_tctubiao05",
}
/**
 * 神装
 * @Author: weiliang.huang
 * @Description:
 * @Date: 2019-03-21 09:57:55
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-20 15:38:52
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/costume/CostumeTipsCtrl")
export default class CostumeTipsCtrl extends gdk.BasePanel {
    @property(cc.Node)
    baseBg: cc.Node = null

    @property(cc.Node)
    panel: cc.Node = null

    @property(cc.Node)
    useBtn: cc.Node = null
    @property(cc.Node)
    offBtn: cc.Node = null
    @property(cc.Node)
    replaceBtn: cc.Node = null

    @property(cc.Label)
    powerTxt: cc.Label = null

    @property(cc.Label)
    powerLab: cc.Label = null

    @property(cc.Label)
    strengthLv: cc.Label = null

    @property(cc.RichText)
    descLab: cc.RichText = null

    @property(cc.Node)
    panel1: cc.Node = null   // 装备等级信息面板

    @property(cc.Node)
    attPanel: cc.Node = null

    @property(cc.Node)
    attNode: cc.Node = null

    @property(cc.Node)
    randomAttPanel: cc.Node = null

    @property(cc.Node)
    suitContent: cc.Node = null

    @property(cc.Node)
    suitNode: cc.Node = null

    @property(cc.Label)
    partType: cc.Label = null

    @property(cc.Label)
    careerLab: cc.Label = null

    @property(cc.Node)
    btnGroup: cc.Node = null;

    @property(cc.Node)
    changeRedPoint: cc.Node = null;

    @property(cc.Node)
    strengthRedPoint: cc.Node = null;

    tipsArgs: CostumeTipsType = null
    itemInfo: BagItem = null
    baseConfig: CostumeCfg = null

    nameColorList = ["#f6f6f6", "33d646", "00deff", "d61399", "fff205"]
    _typeArr = [gdk.i18n.t("i18n:BINGYING_TIP1"), "", gdk.i18n.t("i18n:BINGYING_TIP3"), gdk.i18n.t("i18n:BINGYING_TIP4")]

    get heroModel() {
        return ModelManager.get(HeroModel);
    }

    onEnable() {
        let args = this.args;
        if (args && args.length > 0) {
            this.initItemInfo(args[0]);
        }
    }

    onDisable() {
        this.panel.targetOff(this);
    }

    onDestroy() {
        this.unscheduleAllCallbacks()
    }

    initItemInfo(item: CostumeTipsType) {
        this.tipsArgs = item
        this.itemInfo = item.itemInfo
        this.baseConfig = ConfigManager.getItemById(CostumeCfg, this.itemInfo.itemId)
        this.descLab.string = this.baseConfig.des
        let info: icmsg.CostumeInfo = this.itemInfo.extInfo as icmsg.CostumeInfo
        if (info) {
            this.strengthLv.string = `.${info.level}`
            this.powerTxt.string = gdk.i18n.t("i18n:ROLE_TIP20")
            this.powerLab.string = `${CostumeUtils.getEquipPower(info)}`
        } else {
            this.powerTxt.string = gdk.i18n.t("i18n:ROLE_TIP21")
            this.powerLab.string = `${this.baseConfig.show_power}`
            this.strengthLv.string = `.${1}`
        }
        this.title = this.baseConfig.name
        this._titleLabel.node.color = cc.color(this.nameColorList[this.baseConfig.color])
        GlobalUtil.setSpriteIcon(this.node, this.baseBg, `view/role/texture/bg/tip_bg_color_${this.baseConfig.color}`)
        this.updatePanel1()
        this.btnGroup.active = true
        // 按钮显示隐藏， 特别处理的来源
        switch (item.from) {
            case PanelId.SubRoleCostumePanel.__id__:
                this.useBtn.active = true;
                this.offBtn.active = true;
                this.replaceBtn.active = true;
                this.strengthRedPoint.active = RedPointUtils.is_can_costume_strength(this.heroModel.curHeroInfo, this.baseConfig.part)
                let canChange = false
                let equips = RedPointUtils.get_free_costume({ part: this.baseConfig.part });
                if (equips.length > 0) {
                    for (let index = 0; index < equips.length; index++) {
                        if (RedPointUtils.is_can_costume_up(this.heroModel.curHeroInfo, equips[index])) {
                            canChange = true
                            break
                        }
                    }
                }
                this.changeRedPoint.active = canChange
                break;
            case PanelId.Bag.__id__:
                // 背包界面 
                this.offBtn.active = false;
                this.replaceBtn.active = false;
                break;
            default:
                this.btnGroup.active = false
                break;
        }
        this.node.x = 0
        if (item.noBtn) {
            this.useBtn.active = false
            this.offBtn.active = false
            this.replaceBtn.active = false
            return
        }
    }

    /**更新基础信息面板 */
    updatePanel1() {
        let slot = this.panel1.getChildByName("slot").getComponent(UiSlotItem)
        slot.updateItemInfo(this.itemInfo.itemId)

        let star = this.baseConfig.star
        slot.updateStar(star)
        slot.starNum = star

        for (let index = 0; index < this.attPanel.childrenCount; index++) {
            const attNode = this.attPanel.children[index];
            attNode.active = false
        }

        if (this.itemInfo.extInfo) {
            let attrArr = CostumeUtils.getCostumeAttrNum(this.itemInfo)
            for (let index = 0; index < attrArr.length; index++) {
                const info: AttrType = attrArr[index];
                if (info.id == this.baseConfig.attr) {
                    let attNode: cc.Node = this.attPanel[index]
                    if (!attNode) {
                        attNode = cc.instantiate(this.attNode)
                        attNode.parent = this.attPanel
                    }
                    this._updateOneAtt(attNode, info)
                }
            }

            let hasRandomAttr = false
            for (let index = 0; index < attrArr.length; index++) {
                const info: AttrType = attrArr[index];
                if (info.id != this.baseConfig.attr) {
                    let attNode: cc.Node = this.attPanel[index]
                    if (!attNode) {
                        attNode = cc.instantiate(this.attNode)
                        attNode.parent = this.randomAttPanel
                    }
                    this._updateOneAtt(attNode, info)
                    hasRandomAttr = true
                }
            }
            this.randomAttPanel.parent.active = hasRandomAttr
        } else {
            let lab1 = cc.instantiate(this.powerTxt.node)
            let cfg = ConfigManager.getItemById(Costume_attrCfg, this.baseConfig.attr)
            lab1.getComponent(cc.Label).string = `${cfg.attr_show}:???`
            this.attPanel.addChild(lab1)

            let lab2 = cc.instantiate(this.powerTxt.node)
            lab2.getComponent(cc.Label).string = gdk.i18n.t("i18n:ROLE_TIP22")
            this.randomAttPanel.parent.active = true
            this.randomAttPanel.addChild(lab2)
        }

        for (let index = 0; index < this.suitContent.childrenCount; index++) {
            const suitNode = this.suitContent.children[index];
            suitNode.active = false
        }

        let suitCfgs = ConfigManager.getItems(Costume_compositeCfg, { type: this.baseConfig.type, color: this.baseConfig.color })
        for (let index = 0; index < suitCfgs.length; index++) {
            let s_node: cc.Node = this.suitContent[index]
            if (!s_node) {
                s_node = cc.instantiate(this.suitNode)
                s_node.parent = this.suitContent
            }
            this._updateSuitNode(s_node, suitCfgs[index])
        }

        let partName = [`${gdk.i18n.t("i18n:BAG_TIP18")}`, `${gdk.i18n.t("i18n:BAG_TIP19")}`, `${gdk.i18n.t("i18n:BAG_TIP20")}`, `${gdk.i18n.t("i18n:BAG_TIP21")}`]
        this.partType.string = `${gdk.i18n.t("i18n:BAG_TIP6")}${partName[this.baseConfig.part]}`
        this.careerLab.string = `${this._typeArr[this.baseConfig.career_type - 1]}`
    }

    _updateOneAtt(attNode: cc.Node, info: AttrType) {
        attNode.active = true
        let attrIcon = attNode.getChildByName("attrIcon")
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        let scoreLab = attNode.getChildByName("scoreLab").getComponent(cc.Label)
        typeLab.string = info.name
        let value = `${info.value}`
        if (info.type == EquipAttrTYPE.R) {
            value = `${Number(info.value / 100).toFixed(1)}%`
        }
        numLab.string = `+${value}`
        GlobalUtil.setSpriteIcon(this.node, attrIcon, `view/role/texture/equipTip2/${AttrIconPath[info.name] ? AttrIconPath[info.name] : "sz_shanghaitubiao"}`)

        let obj = this._getScoreQuality(info.keyName, info.value)
        if (obj) {
            scoreLab.node.color = BagUtils.getColor(obj.color + 1)
            scoreLab.string = `${obj.name} ${Math.floor(info.initValue * 100 / obj.maxValue)}%`
        }
    }

    _getScoreQuality(keyName, value) {
        let labs = ["C", "B", "A", "S", "SS"]
        let cfgs = ConfigManager.getItems(Costume_qualityCfg)
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].attr.indexOf(keyName) != -1) {
                let values = cfgs[i].quality
                for (let j = 0; j < values.length; j++) {
                    if (value < values[j]) {
                        if (j - 1 >= 0) {
                            return { name: labs[j - 1], color: j - 1, maxValue: values[values.length - 2] }
                        }
                    }
                }
                if (value >= values[values.length - 1]) {
                    return { name: labs[4], color: 4, maxValue: values[values.length - 2] }
                }
            }
        }
        return null
    }

    _updateSuitNode(sNode: cc.Node, cfg: Costume_compositeCfg) {
        sNode.active = true
        let suitLab = sNode.getChildByName("suitLab").getComponent(cc.Label)
        let suitDes = sNode.getChildByName("suitDes").getComponent(cc.RichText)
        suitLab.string = `${cfg.name}${cfg.num}${gdk.i18n.t("i18n:ROLE_TIP23")}`
        suitDes.string = `${cfg.des}`
        sNode.height = suitDes.node.height

        if (this.tipsArgs.from == PanelId.SubRoleCostumePanel.__id__) {
            let costumeIds = this.heroModel.curHeroInfo.costumeIds //神装信息
            let suitMap = CostumeUtils.getCostumeSuitInfo(costumeIds)
            let colors = suitMap[cfg.type]
            let hasNum = CostumeUtils.getSuitColorNum(colors, cfg.color)
            if (hasNum < cfg.num) {
                suitDes.node.color = cc.color("#7D736C")
            } else {
                suitDes.node.color = cc.color("#F1B77F")
            }
        }
    }


    // 装备脱下
    offFunc() {
        let part = this.baseConfig.part
        let cb = this.tipsArgs ? this.tipsArgs.equipOffCb : null;
        if (cb) {
            cb.call(this.tipsArgs.thisArg, this.itemInfo);
            this.close();
            return;
        }
        let msg = new icmsg.CostumeOnReq()
        msg.heroId = this.heroModel.curHeroInfo.heroId
        msg.index = part
        NetManager.send(msg)
        this.close();
    }

    // 装备打造
    useFunc() {
        if (!JumpUtils.ifSysOpen(2865, true)) {
            return;
        }
        if (this.tipsArgs.from == PanelId.EquipSelect2.__id__) {
            GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.equip);
        } else {
            GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.click);
        }
        let cb = this.tipsArgs ? this.tipsArgs.equipOnCb : null;
        if (cb) {
            cb.call(this.tipsArgs.thisArg, this.itemInfo);
            this.close();
            return;
        }
        this.close();
    }

    // 装备替换
    replaceFunc() {
        let cb = this.tipsArgs ? this.tipsArgs.equipChangeCb : null;
        if (cb) {
            cb.call(this.tipsArgs.thisArg, this.itemInfo);
            this.close();
            return;
        }
        this.close();
    }
}