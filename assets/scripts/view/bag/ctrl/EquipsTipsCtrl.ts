import ButtonSoundId from '../../../configs/ids/ButtonSoundId';
import ChatUtils from '../../chat/utils/ChatUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import EquipUtils, { AttrType, EquipAttrTYPE } from '../../../common/utils/EquipUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../common/models/BagModel';
import { Item_equip_suitskillCfg, Item_equipCfg } from '../../../a/config';

export type EquipTipsType = {
    itemInfo: BagItem,
    heroInfo?: icmsg.HeroInfo,
    from?: string | number,  // 装备来源 panelId中定义的名称
    noBtn?: Boolean, // 是否隐藏按钮
    compareItem?: BagItem, // 装备对比道具
    equipOnCb?: (info?: BagItem) => void,   // 穿装备回调
    equipOffCb?: (info?: BagItem) => void,  // 脱装备回调
    equipChangeCb?: (info?: BagItem) => void,    // 替换装备回调
    thisArg?: any,
    isOther?: boolean,//是否其他人装备
}

export const AttrIconPath = {
    "生命": "yx_tctubiao02",
    "攻击": "yx_tctubiao04",
    "命中": "yx_tctubiao06",
    "防御": "yx_tctubiao03",
    "闪避": "yx_tctubiao05",
    "暴击": "yx_tctubiao08",
}
/**
 * 物品提示面板
 * @Author: weiliang.huang
 * @Description:
 * @Date: 2019-03-21 09:57:55
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-28 16:22:59
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/EquipsTipsCtrl")
export default class EquipsTipsCtrl extends gdk.BasePanel {

    @property(cc.Node)
    baseBg: cc.Node = null

    @property(cc.Node)
    panel: cc.Node = null

    @property(cc.Node)
    shareBtn: cc.Node = null
    @property(cc.Node)
    useBtn: cc.Node = null
    @property(cc.Node)
    offBtn: cc.Node = null
    @property(cc.Node)
    replaceBtn: cc.Node = null

    @property(cc.Label)
    powerLab: cc.Label = null

    @property(cc.RichText)
    descLab: cc.RichText = null

    @property(cc.Node)
    panel1: cc.Node = null   // 装备等级信息面板

    @property(cc.Node)
    attPanel: cc.Node = null

    @property(cc.Node)
    attNode: cc.Node = null

    @property(cc.Label)
    partType: cc.Label = null

    @property(cc.Node)
    btnGroup: cc.Node = null;

    @property(cc.Node)
    extraAtrNode: cc.Node = null;

    @property(cc.Node)
    extraAtrItem: cc.Node = null;

    tipsArgs: EquipTipsType = null
    itemInfo: BagItem = null
    // equipInfo: EquipInfo = null
    baseConfig: Item_equipCfg = null

    nameColorList = ["#f6f6f6", "33d646", "00deff", "d61399", "fff205", "FF0000"]

    get heroModel() {
        return ModelManager.get(HeroModel);
    }

    onEnable() {
        this.shareBtn.active = false;
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

    initItemInfo(item: EquipTipsType) {
        this.tipsArgs = item
        this.itemInfo = item.itemInfo
        this.baseConfig = ConfigManager.getItemById(Item_equipCfg, this.itemInfo.itemId)
        this.descLab.string = this.baseConfig.des
        this.powerLab.string = `${GlobalUtil.getPowerValue(this.baseConfig) + this.baseConfig.power}`
        this.title = this.baseConfig.name
        this._titleLabel.node.color = cc.color(this.nameColorList[this.baseConfig.color])
        GlobalUtil.setSpriteIcon(this.node, this.baseBg, `view/role/texture/bg/tip_bg_color_${this.baseConfig.color}`)
        this.updatePanel1()
        this.updatePanel2()
        this.btnGroup.active = true
        // 按钮显示隐藏， 特别处理的来源
        switch (item.from) {
            case PanelId.EquipSelect2.__id__:
                // 装备选择界面
                this.useBtn.active = true;
                this.offBtn.active = false;
                this.replaceBtn.active = false;
                break;

            case PanelId.SubEquipPanel2.__id__:
                // 英雄详情装备子界面
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
        this.shareBtn.active = false
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
        let level = 1
        let star = this.baseConfig.star

        slot.updateStar(star)
        slot.starNum = star
        let attrArr = EquipUtils.getEquipAttrNum(this.itemInfo.itemId)
        for (let index = 0; index < this.attPanel.childrenCount; index++) {
            const attNode = this.attPanel.children[index];
            attNode.active = false
        }
        for (let index = 0; index < attrArr.length; index++) {
            const info: AttrType = attrArr[index];
            let attNode: cc.Node = this.attPanel[index]
            if (!attNode) {
                attNode = cc.instantiate(this.attNode)
                attNode.parent = this.attPanel
            }
            this._updateOneAtt(attNode, info)
        }
        let partName = [`${gdk.i18n.t("i18n:BAG_TIP2")}`, `${gdk.i18n.t("i18n:BAG_TIP3")}`, `${gdk.i18n.t("i18n:BAG_TIP4")}`, `${gdk.i18n.t("i18n:BAG_TIP5")}`]
        this.partType.string = `${gdk.i18n.t("i18n:BAG_TIP6")}${partName[this.baseConfig.part - 1]}`
    }

    /**更新套装属性 */
    updatePanel2() {
        if (this.baseConfig.color !== 5) {
            this.extraAtrNode.active = false;
            return;
        }
        let heroImg = this.heroModel.heroImage || this.heroModel.curHeroInfo;
        let map: { [color: number]: { [star: number]: number } } = {}; // [colr][star] = num
        let content = cc.find('extraAttPanel', this.extraAtrNode);
        map[5] = {}
        map[5][1] = 0;
        if (heroImg) {
            heroImg.slots.forEach(s => {
                let cfg = ConfigManager.getItemById(Item_equipCfg, s.equipId);
                if (cfg && cfg.color == 5 && cfg.star >= 1) {
                    map[5][1] += 1;
                }
            });
        }
        let cfgs = ConfigManager.getItems(Item_equip_suitskillCfg, (cfg: Item_equip_suitskillCfg) => {
            if (cfg.color == 5 && cfg.star == 1) {
                return true;
            }
        });
        cfgs.forEach((cfg, idx) => {
            let n = content.children[idx];
            if (!n) {
                n = cc.instantiate(this.extraAtrItem);
                n.parent = content;
            }
            let titleLab = cc.find('suitLab', n).getComponent(cc.Label);
            let descLab = cc.find('suitDes', n).getComponent(cc.RichText);
            titleLab.string = cfg.des_title;
            let isActive = map[5][1] >= cfg.number || (!heroImg && (!this.tipsArgs.from || this.tipsArgs.from !== PanelId.Bag.__id__));
            descLab.string = `<color=${`${isActive ? '#ffe1c2' : '#7d736c'}`}>${cfg.des}</c>`;
            n.height = descLab.node.height + 8;
        });
    }

    _updateOneAtt(attNode: cc.Node, info: AttrType) {
        attNode.active = true
        let attrIcon = attNode.getChildByName("attrIcon")
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        typeLab.string = info.name
        let value = `${info.value}`
        if (info.type == EquipAttrTYPE.R) {
            value = `${Number(info.value / 100).toFixed(1)}%`
        }
        numLab.string = `+${value}`
        GlobalUtil.setSpriteIcon(this.node, attrIcon, `view/role/texture/equipTip2/${AttrIconPath[info.name]}`)
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
        let msg = new icmsg.HeroEquipOffReq()
        msg.heroId = this.heroModel.curHeroInfo.heroId//this.equipInfo.heroId
        msg.equipParts = [part - 1]
        NetManager.send(msg)

        this.close();
    }

    // 装备打造
    useFunc() {
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

    /**装备分享 */
    shareBtnFunc() {
        ChatUtils.sendShareItem(this.itemInfo)
        this.close()
    }

}
