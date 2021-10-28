import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import EquipUtils, { AttrType, EquipAttrTYPE } from '../../../common/utils/EquipUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { AttrIconPath } from './EquipsTipsCtrl';
import {
    Item_equip_suitskillCfg,
    Item_equipCfg,
    ItemCfg,
    StoreCfg
    } from '../../../a/config';
import { SelectGiftInfo, SelectGiftType } from './SelectGiftViewCtrl';

/** 
  * @Description: 可选物品礼包确认框
  * @Author: luoyong
  * @Date: 2019-09-12 13:50:11
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-03-01 13:55:22
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/SelectGiftGetEquipCtrl")
export default class SelectGiftGetEquipCtrl extends gdk.BasePanel {

    @property(cc.Node)
    panel: cc.Node = null

    @property(cc.Node)
    useBtn: cc.Node = null

    @property(cc.Label)
    btnLab: cc.Label = null

    @property(cc.RichText)
    descLab: cc.RichText = null

    @property(cc.Node)
    panel1: cc.Node = null   // 装备等级信息面板

    @property(cc.Node)      // 技能信息面板
    panel4: cc.Node = null

    @property(cc.Node)
    attPanel: cc.Node = null

    @property(cc.Node)
    attNode: cc.Node = null

    @property(cc.Label)
    partType: cc.Label = null

    @property(cc.Node)
    careerContent: cc.Node = null;

    @property(cc.Node)
    costBg: cc.Node = null;

    @property(cc.Node)
    extraAtrNode: cc.Node = null;

    @property(cc.Node)
    extraAtrItem: cc.Node = null;

    get heroModel() {
        return ModelManager.get(HeroModel);
    }

    _getData: SelectGiftInfo = null
    baseConfig: Item_equipCfg = null

    start() {
    }

    onEnable() {
        this.node.opacity = 0;
    }

    initRewardInfo(data: SelectGiftInfo) {
        this._getData = data
        this.baseConfig = ConfigManager.getItemById(Item_equipCfg, this._getData.itemId)
        this.descLab.string = this.baseConfig.des

        this.title = this.baseConfig.name
        this._titleLabel.node.color = BagUtils.getColor(this.baseConfig.color)
        this._titleLabel.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(this.baseConfig.color)
        this.updatePanel1()
        this.updatePanel6()
        this._updatePanel4()

        if (this._getData.giftType == SelectGiftType.Bag) {
            this.btnLab.string = gdk.i18n.t("i18n:BAG_TIP13")
            this.costBg.active = false
        } else {
            this.btnLab.string = gdk.i18n.t("i18n:BAG_TIP14")
            this.costBg.active = true
            let costIcon = this.costBg.getChildByName("costIcon")
            let costNum = this.costBg.getChildByName("costNum").getComponent(cc.Label)
            let cfg = ConfigManager.getItemByField(StoreCfg, "item_id", this._getData.mainId)
            let moneyType = cfg.money_cost[0];
            let buyPrice = cfg.money_cost[1];

            let iconPath = GlobalUtil.getSmallMoneyIcon(moneyType);
            GlobalUtil.setSpriteIcon(this.node, costIcon, iconPath);

            costNum.string = `${buyPrice}`
            let moneyNum = GlobalUtil.getMoneyNum(moneyType);
            let canBuyNum = Math.floor(moneyNum / buyPrice);
            if (canBuyNum > 0) {
                costNum.node.color = cc.color("#F91111");
            } else {
                costNum.node.color = cc.color("#FFEB91");
            }
        }
        this.node.opacity = 255;
    }

    /**更新基础信息面板 */
    updatePanel1() {
        let slot = this.panel1.getChildByName("slot").getComponent(UiSlotItem)
        slot.updateItemInfo(this._getData.itemId)
        let level = 1
        let star = this.baseConfig.star
        slot.updateStar(star)
        let attrArr = EquipUtils.getEquipAttrNum(this._getData.itemId)
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
        let partName = [gdk.i18n.t("i18n:BAG_TIP2"), gdk.i18n.t("i18n:BAG_TIP3"), gdk.i18n.t("i18n:BAG_TIP4"), gdk.i18n.t("i18n:BAG_TIP5")]
        this.partType.string = `${partName[this.baseConfig.part - 1]}`
    }

    /**更新套装属性 */
    updatePanel6() {
        this.extraAtrNode.active = this.baseConfig.color == 5;
        if (!this.extraAtrNode.active) return;
        let content = cc.find('attPanel', this.extraAtrNode);
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
            let isActive = true; //礼包内
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

    /**更新技能面板 */
    _updatePanel4() {
        this.panel4.active = false
        // if (this.baseConfig.skill == 0) {
        //     this.panel4.active = false
        //     return
        // }
        // this.panel4.active = true
        // let bgNode = this.panel4.getChildByName("bgNode")
        // //显示塔防
        // let iconTa = bgNode.getChildByName("iconTa")
        // let nameLab = iconTa.getChildByName("nameLab").getComponent(cc.RichText)
        // let skillLv = iconTa.getChildByName("skillLv").getComponent(cc.Label)
        // let unActiveTip = iconTa.getChildByName("unActiveTip")
        // skillLv.node.active = false
        // unActiveTip.active = false
        // let desLab = bgNode.getChildByName("desLab").getComponent(cc.RichText)

        // //显示卡牌
        // let iconKa = bgNode.getChildByName("iconKa")
        // let nameLab2 = iconKa.getChildByName("nameLab2").getComponent(cc.RichText)
        // let skillLv2 = iconKa.getChildByName("skillLv2").getComponent(cc.Label)
        // let unActiveTip2 = iconKa.getChildByName("unActiveTip2")
        // skillLv2.node.active = false
        // unActiveTip2.active = false
        // let desLab2 = bgNode.getChildByName("desLab2").getComponent(cc.RichText)
        // let equipSkill = EquipUtils.getEquipSkillCfg(this.baseConfig.type, 1, this.baseConfig.skill);
        // if (!equipSkill) {
        //     this.panel4.active = false
        //     return
        // }

        // if (HeroUtils.isCardSkill(this.baseConfig.skill)) {
        //     nameLab2.string = equipSkill.name
        //     unActiveTip2.active = true
        //     desLab2.string = equipSkill.des
        //     iconTa.active = false
        //     desLab.node.active = false
        // } else {
        //     nameLab.string = equipSkill.name
        //     unActiveTip.active = true
        //     desLab.string = equipSkill.des
        //     iconKa.active = false
        //     desLab2.node.active = false
        // }
    }

    getFunc() {
        if (this._getData.giftType == SelectGiftType.Bag) {
            let good: icmsg.GoodsInfo = new icmsg.GoodsInfo()
            good.typeId = this._getData.mainId
            good.num = 1
            let msg = new icmsg.ItemDisintReq()
            msg.items = [good]
            msg.index = this._getData.index
            NetManager.send(msg, () => {
                this.close()
                gdk.panel.hide(PanelId.SelectGift)
            }, this)
        } else {
            let storeCfg = ConfigManager.getItemByField(StoreCfg, "item_id", this._getData.mainId)
            let moneyCfg = ConfigManager.getItemById(ItemCfg, storeCfg.money_cost[0])
            let askText = StringUtils.format(gdk.i18n.t("i18n:BAG_TIP16"), storeCfg.money_cost[1], moneyCfg.name, storeCfg.item_name)//`是否花费${storeCfg.money_cost[1]}${moneyCfg.name}购买${storeCfg.item_name}?`
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t("i18n:BAG_TIP15"),
                descText: askText,
                thisArg: this,
                sureText: gdk.i18n.t("i18n:BAG_TIP14"),
                sureCb: () => {
                    let msg = new icmsg.StoreBuyReq()
                    msg.id = storeCfg.id
                    NetManager.send(msg, () => {
                        //购买成功后使用
                        gdk.Timer.once(300, this, () => {
                            let good: icmsg.GoodsInfo = new icmsg.GoodsInfo()
                            good.typeId = this._getData.mainId
                            good.num = 1
                            let msg = new icmsg.ItemDisintReq()
                            msg.items = [good]
                            msg.index = this._getData.index
                            NetManager.send(msg, () => {
                                this.close()
                                gdk.panel.hide(PanelId.SelectGift)
                            }, this)
                        })
                    }, this)
                },
            })
        }

    }
}
