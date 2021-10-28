import {
    Guardian_equipCfg, Guardian_equip_skillCfg,
    Guardian_equip_starCfg
} from '../../../../../a/config';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import { BagItem } from '../../../../../common/models/BagModel';
import HeroModel from '../../../../../common/models/HeroModel';
import BagUtils from '../../../../../common/utils/BagUtils';
import { AttrType } from '../../../../../common/utils/EquipUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import RedPointUtils from '../../../../../common/utils/RedPointUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import ButtonSoundId from '../../../../../configs/ids/ButtonSoundId';
import PanelId from '../../../../../configs/ids/PanelId';
import { RoleEventId } from '../../../enum/RoleEventId';
import GuardianModel from '../../../model/GuardianModel';
import GuardianUtils from '../GuardianUtils';

const { ccclass, property, menu } = cc._decorator;
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: sthoo.huanguang
 * @Last Modified time: 2021-05-13 21:08:57
 */

export type GuardianEquipTipsType = {
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

@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipTipsCtrl")
export default class GuardianEquipTipsCtrl extends gdk.BasePanel {

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
    partType: cc.Label = null

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
    suitContent: cc.Node = null

    @property(cc.Node)
    suitNode: cc.Node = null

    @property(cc.Node)
    btnGroup: cc.Node = null;

    @property(cc.Node)
    changeRedPoint: cc.Node = null;

    @property(cc.Node)
    strengthRedPoint: cc.Node = null;

    tipsArgs: GuardianEquipTipsType = null
    itemInfo: BagItem = null
    baseConfig: Guardian_equipCfg = null
    starCfg: Guardian_equip_starCfg = null

    nameColorList = ["#f6f6f6", "33d646", "00deff", "d61399", "fff205"]

    get heroModel() {
        return ModelManager.get(HeroModel);
    }

    get guardianModel() {
        return ModelManager.get(GuardianModel);
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

    initItemInfo(item: GuardianEquipTipsType) {
        this.tipsArgs = item
        this.itemInfo = item.itemInfo
        this.baseConfig = ConfigManager.getItemById(Guardian_equipCfg, this.itemInfo.itemId)

        this.descLab.string = this.baseConfig.des
        let info: icmsg.GuardianEquip = this.itemInfo.extInfo as icmsg.GuardianEquip
        if (info) {
            this.strengthLv.string = `.${info.level}`
            this.powerTxt.string = gdk.i18n.t("i18n:ROLE_TIP20")
            this.powerLab.string = `${GuardianUtils.getTargetEquipPower(info)}`
        }
        this.starCfg = ConfigManager.getItemByField(Guardian_equip_starCfg, "star", info.star, { type: this.baseConfig.type, part: this.baseConfig.part })
        this.title = this.baseConfig.name
        let colorInfo = BagUtils.getColorInfo(this.starCfg.color);
        this._titleLabel.node.color = cc.color(colorInfo.color)
        this._titleLabel.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);
        GlobalUtil.setSpriteIcon(this.node, this.baseBg, `view/role/texture/bg/tip_bg_color_${this.starCfg.color}`)
        this.updatePanel1()
        this.btnGroup.active = true
        // 按钮显示隐藏， 特别处理的来源
        switch (item.from) {
            case PanelId.GuardianEquipPanel.__id__:
                this.useBtn.active = true;
                this.offBtn.active = true;
                this.replaceBtn.active = true;
                break;
            case PanelId.Bag.__id__:
                // 背包界面 
                this.btnGroup.active = false
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

        let star = this.starCfg.star
        slot.updateStar(star)
        slot.starNum = star

        for (let index = 0; index < this.attPanel.childrenCount; index++) {
            const attNode = this.attPanel.children[index];
            attNode.active = false
        }

        if (this.itemInfo.extInfo) {
            let attrArr = GuardianUtils.getTargetEquipAttr(this.itemInfo.extInfo as icmsg.GuardianEquip)
            for (let index = 0; index < attrArr.length; index++) {
                const info: AttrType = attrArr[index];
                let attNode: cc.Node = this.attPanel[index]
                if (!attNode) {
                    attNode = cc.instantiate(this.attNode)
                    attNode.parent = this.attPanel
                }
                this._updateOneAtt(attNode, info)
            }
        }

        for (let index = 0; index < this.suitContent.childrenCount; index++) {
            const suitNode = this.suitContent.children[index];
            suitNode.active = false
        }
        this.strengthRedPoint.active = false
        let suitCfgs = []
        let heroInfo = GuardianUtils.getGuardianHeroInfo(this.guardianModel.curGuardianId)
        if (heroInfo) {
            suitCfgs = ConfigManager.getItems(Guardian_equip_skillCfg, { type: this.baseConfig.type, star: this._getTargetStar(heroInfo.guardian) })
            this.strengthRedPoint.active = RedPointUtils.is_can_guardian_equip_strength(heroInfo, this.baseConfig.part) || RedPointUtils.is_can_guardian_equip_break_by_part(heroInfo, this.baseConfig.part)
            this.changeRedPoint.active = RedPointUtils.is_can_guardian_equip_up_by_part(heroInfo, this.baseConfig.part)
        } else {
            let cfgs = ConfigManager.getItems(Guardian_equip_skillCfg)
            suitCfgs = ConfigManager.getItems(Guardian_equip_skillCfg, { type: this.baseConfig.type, star: cfgs[0].star })
        }
        suitCfgs = [suitCfgs[suitCfgs.length - 1]]
        for (let index = 0; index < suitCfgs.length; index++) {
            let s_node: cc.Node = this.suitContent[index]
            if (!s_node) {
                s_node = cc.instantiate(this.suitNode)
                s_node.parent = this.suitContent
            }
            this._updateSuitNode(s_node, suitCfgs[index])
        }
        this.partType.string = `${gdk.i18n.t("i18n:BAG_TIP6")}${this.baseConfig.part_des}`
    }

    _updateOneAtt(attNode: cc.Node, info: AttrType) {
        if (info.initValue == 0) {
            attNode.active = false
            return
        }
        attNode.active = true
        let attrIcon = attNode.getChildByName("attrIcon")
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        let addLab = attNode.getChildByName("addLab").getComponent(cc.Label)
        typeLab.string = info.name
        numLab.string = `+${info.initValue}`
        addLab.string = ``
        if (info.value) {
            addLab.string = `+${info.value}`
        }
        GlobalUtil.setSpriteIcon(this.node, attrIcon, `view/role/texture/equipTip2/${AttrIconPath[info.name] ? AttrIconPath[info.name] : "sz_shanghaitubiao"}`)
    }

    _updateSuitNode(sNode: cc.Node, cfg: Guardian_equip_skillCfg) {
        sNode.active = true
        let suitDes = sNode.getChildByName("suitDes").getComponent(cc.RichText)
        suitDes.string = `${cfg.des}`
        sNode.height = suitDes.node.height
    }

    //全身装备符合的星级配置
    _getTargetStar(info: icmsg.Guardian) {
        let starTypes = []
        let cfgs = ConfigManager.getItems(Guardian_equip_skillCfg)
        for (let i = 0; i < cfgs.length; i++) {
            if (starTypes.indexOf(cfgs[i].star) == -1) {
                starTypes.push(cfgs[i].star)
            }
        }
        starTypes = starTypes.reverse()
        let arr = GuardianUtils.getEquipSuitNum(this.baseConfig.type, info)
        for (let i = 0; i < starTypes.length; i++) {
            if (arr[1] >= starTypes[i]) {
                return starTypes[i]
            }
        }
        return cfgs[0].star
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

        let heroInfo = GuardianUtils.getGuardianHeroInfo(this.guardianModel.curGuardianId)
        if (heroInfo) {
            let target = new icmsg.GuardianInHero()
            target.heroId = heroInfo.heroId
            target.guardianId = heroInfo.guardian.id
            let msg = new icmsg.GuardianEquipOffReq()
            msg.target = target
            msg.part = [this.baseConfig.part]
            NetManager.send(msg, (data: icmsg.GuardianEquipOffRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                GuardianUtils.updateGuardian(data.guardian.id, data.guardian)
                gdk.e.emit(RoleEventId.GUARDIAN_INHERO_EQUIP_UPDATE)
                this.close();
            })
        }
    }

    // 装备打造
    useFunc() {
        // if (!JumpUtils.ifSysOpen(2865, true)) {
        //     return;
        // }
        if (this.tipsArgs.from == PanelId.GuardianEquipPanel.__id__) {
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