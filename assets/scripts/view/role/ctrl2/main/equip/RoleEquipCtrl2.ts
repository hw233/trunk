import BagUtils from '../../../../../common/utils/BagUtils';
import ButtonSoundId from '../../../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import EquipModel from '../../../../../common/models/EquipModel';
import EquipUtils from '../../../../../common/utils/EquipUtils';
import ErrorManager from '../../../../../common/managers/ErrorManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../../common/utils/GuideUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../../common/utils/RedPointUtils';
import RoleModel from '../../../../../common/models/RoleModel';
import RoleViewCtrl2 from '../RoleViewCtrl2';
import RuneModel from '../../../../../common/models/RuneModel';
import StringUtils from '../../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../../../common/models/BagModel';
import { ColorType } from '../../../../chat/enum/ChatChannel';
import { EquipTipsType } from './../../../../bag/ctrl/EquipsTipsCtrl';
import {
    Item_equipCfg,
    Item_rubyCfg,
    Rune_unlockCfg,
    RuneCfg,
    Unique_globalCfg,
    Unique_starCfg
    } from '../../../../../a/config';
import { RoleEventId } from '../../../enum/RoleEventId';
import { SelectInfo } from './EquipSelectCtrl2';


export interface EquipPower {
    power: number,
    bagItem: BagItem
}

/**
 * @Description: 角色界面上方面板控制
 * @Author: weiliang.huang
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-13 11:21:18
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/equip/RoleEquipCtrl2")
export default class RoleEquipCtrl2 extends gdk.BasePanel {

    @property(cc.Node)
    equipNodes: Array<cc.Node> = [];

    @property([cc.Node])
    runeNodes: cc.Node[] = [];

    @property(cc.Node)
    uniqueEquip: cc.Node = null;

    attLabs: Array<cc.Label> = [];      // 白字属性lab数组
    extLabs: Array<cc.Label> = [];      // 绿字属性lab数组
    stageLabs: Array<cc.Sprite> = [];    // 评级lab数组
    equipCtrls: Array<UiSlotItem> = [];
    equipIndex: number = -1;   // 当前选择的装备下标

    get model() {
        return ModelManager.get(HeroModel);
    }

    get heroInfo() {
        return this.model.curHeroInfo;
    }

    get roleModel() {
        return ModelManager.get(RoleModel);
    }

    get runeModel() {
        return ModelManager.get(RuneModel);
    }

    onEnable() {
        // 事件
        gdk.e.on(RoleEventId.UPDATE_ONE_EQUIP, this._updateOneEquip, this);
        gdk.e.on(RoleEventId.RSP_EQUIP_OFF, this._onEquipOff, this);
        gdk.e.on(RoleEventId.UPDATE_HERO_UNIQUE_EQUIP, this._updateUniqueEquip, this);
        gdk.e.on(RoleEventId.UPDATE_ONE_UNIQUEEQUIP, this._updateUniqueEquip, this);
        gdk.e.on(RoleEventId.REMOVE_ONE_UNIQUEEQUIP, this._updateUniqueEquip, this);
        // gdk.e.on(RoleEventId.RUNE_ON, this._onRuneChange, this);
        // gdk.e.on(RoleEventId.RUNE_OFF, this._onRuneChange, this);
        gdk.e.on(RoleEventId.RUNE_ADD, this._onRuneChange, this);
        gdk.e.on(RoleEventId.RUNE_REMOVE, this._onRuneChange, this);

        // 引导
        GuideUtil.bindGuideNode(801, this.equipNodes[0]);
        // 点击事件
        for (let index = 0; index < this.equipNodes.length; index++) {
            const element = this.equipNodes[index];
            // this._fadeEquip(element, false);
            this.equipCtrls[index] = element.getComponent(UiSlotItem);
            element.on(cc.Node.EventType.TOUCH_END, () => {
                this._equipClick(index);
            }, this);
        }
        //符文
        for (let i = 0; i < this.runeNodes.length; i++) {
            this.runeNodes[i].on(cc.Node.EventType.TOUCH_END, () => {
                this._runeClick(i);
            }, this)
        }
    }

    onDisable() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
        ErrorManager.targetOff(this);
        GuideUtil.bindGuideNode(801);
        for (let index = 0; index < this.equipNodes.length; index++) {
            const element = this.equipNodes[index];
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
        this._updateRune();
        this._updateUniqueEquip()
        gdk.e.emit(RoleEventId.UPDATE_ONE_HERO)
    }

    /**更新专属装备 */
    _updateUniqueEquip() {
        if (!JumpUtils.ifSysOpen(2956)) {
            this.uniqueEquip.active = false
            return
        }
        this.uniqueEquip.active = true
        let ctrl = this.uniqueEquip.getComponent(UiSlotItem)
        ctrl.updateItemInfo(0)
        ctrl.updateStar(0)

        let add = cc.find("add", this.uniqueEquip)
        let redPoint = cc.find("RedPoint", this.uniqueEquip)
        add.active = false
        redPoint.active = false

        let lockNode = cc.find("lock", this.uniqueEquip)
        lockNode.active = false
        let herostar_unlock = ConfigManager.getItemById(Unique_globalCfg, "herostar_unlock").value[0]
        if (this.heroInfo.star < herostar_unlock) {
            lockNode.active = true
            let limitLab = cc.find("limitLab", lockNode).getComponent(cc.Label)
            limitLab.string = `${herostar_unlock}星解锁`
        } else {
            if (this.heroInfo.uniqueEquip && this.heroInfo.uniqueEquip.id > 0) {
                ctrl.updateItemInfo(this.heroInfo.uniqueEquip.itemId)
                ctrl.updateStar(this.heroInfo.uniqueEquip.star)
                ctrl.starNum = this.heroInfo.uniqueEquip.star
                redPoint.active = RedPointUtils.is_unique_equip_can_star_up(this.heroInfo)
            } else {
                add.active = RedPointUtils.is_has_target_unique_equip(this.heroInfo)
            }
        }

    }

    /**更新英雄装备 */
    _updateEquips() {
        if (!this.heroInfo) {
            return
        }
        this._clearEquipSelect()

        // 设置各装备状态
        for (let index = 0; index < 4; index++) {
            this._refreshEquipInfo(index)
        }
        /**红色套装特效 */
        this._updateRedSuitEquipEffect();
    }

    /**更新装备的信息 */
    _refreshEquipInfo(index) {
        let heroInfo = this.heroInfo;
        let equips = heroInfo.slots//装备信息

        const id = equips[index] ? equips[index].equipId : 0
        let ctrl = this.equipCtrls[index]
        let add = ctrl.node.getChildByName("add")
        let hasEquips = RedPointUtils.get_free_equipsByCareer(heroInfo, { part: index + 1 });
        add.active = id > 0 ? false : (hasEquips.length > 0);
        let equipData: BagItem = EquipUtils.getEquipData(id)
        let itemId = id
        if (equipData) {
            itemId = equipData.itemId
        }
        ctrl.updateItemInfo(itemId)
        ctrl.updateStar(0)
        let magicIcon = ctrl.node.getChildByName("magicIcon")
        magicIcon.active = false
        //融合标志
        let mergeIcon = ctrl.node.getChildByName("mergeIcon")
        mergeIcon.active = false
        //宝石信息
        let jewelNode = ctrl.node.getChildByName("jewelNode")
        jewelNode.active = false
        //突破信息
        let breakupTip = ctrl.node.getChildByName("breakupTip")
        breakupTip.active = false

        let typeIcon = ctrl.node.getChildByName("type_icon")
        typeIcon.active = true
        //强化等级
        let strenghLv = ctrl.node.getChildByName("strengthLv").getComponent(cc.Label)
        strenghLv.string = ``
        if (itemId > 0) {
            let cfg = ConfigManager.getItemById(Item_equipCfg, itemId)
            if (cfg) {
                ctrl.updateStar(cfg.star)
            } else {
                CC_DEBUG && cc.error("id：" + itemId + "没有相应的配置")
            }
            typeIcon.active = false
        }
        let showJewelNode = false
        for (let i = 0; i < jewelNode.childrenCount; i++) {
            let jewelIcon = jewelNode.getChildByName("jewel" + (i + 1))
            let info = this.heroInfo.slots[index]
            let rubyId = info && info.rubies[i] ? info.rubies[i] : 0
            if (rubyId != 0) {
                let jewelCfg = ConfigManager.getItemById(Item_rubyCfg, rubyId)
                GlobalUtil.setSpriteIcon(this.node, jewelIcon, `view/role/texture/equip2/icon_diamond${jewelCfg.type}`)
                showJewelNode = true
            } else {
                GlobalUtil.setSpriteIcon(this.node, jewelIcon, `view/role/texture/equip2/icon_diamond0`)
            }
        }
        jewelNode.active = showJewelNode
        //breakupTip.active = RedPointUtils.is_can_break_through(equipData, false)
    }

    /**更新单个英雄装备 */
    _updateOneEquip(e: gdk.Event) {
        let equip: BagItem = e.data
        if (equip) {
            let cfg: Item_equipCfg = <Item_equipCfg>BagUtils.getConfigById(equip.itemId)
            let index = cfg.part - 1 // 更新位置
            this._refreshEquipInfo(index)
            this.model.curEquip = equip
            /**红色套装特效 */
            this._updateRedSuitEquipEffect();
        }
    }

    /**卸下装备 */
    _onEquipOff(e: gdk.Event) {
        // console.log("卸下装备", e.data)
        //let heroId = e.data.heroId
        let part = e.data.part
        // if (heroId != this.heroInfo.heroId) {
        //     return
        // }
        let ctrl = this.equipCtrls[part - 1]
        ctrl.updateItemInfo(0)
        ctrl.updateStar(0)
        let add = ctrl.node.getChildByName("add")
        add.active = true
        let magicIcon = ctrl.node.getChildByName("magicIcon")
        magicIcon.active = false
        let jewelNode = ctrl.node.getChildByName("jewelNode")
        jewelNode.active = false
        let breakupTip = ctrl.node.getChildByName("breakupTip")
        breakupTip.active = false
        let mergeIcon = ctrl.node.getChildByName("mergeIcon")
        mergeIcon.active = false
        let typeIcon = ctrl.node.getChildByName("type_icon")
        typeIcon.active = true
        let strenghLv = ctrl.node.getChildByName("strengthLv").getComponent(cc.Label)
        strenghLv.string = ``
        this.model.curEquip = null
        /**红色套装特效 */
        this._updateRedSuitEquipEffect();
    }

    /**装备点击 */
    _equipClick(index: number) {
        let heroInfo = this.heroInfo
        if (!heroInfo) {
            return
        }
        this._clearEquipSelect()
        let equips = heroInfo.slots
        let id = equips[index] ? equips[index].equipId : 0
        if (id > 0) {
            let curEquip = EquipUtils.getEquipData(id)
            if (!curEquip) {
                let bagItem: BagItem = {
                    series: id,
                    itemId: id,
                    itemNum: 1,
                    type: BagType.EQUIP,
                    extInfo: null,
                }
                curEquip = bagItem
            }
            this._selectEquip(index)
            // 打开装备提示框
            let tipsInfo: EquipTipsType = {
                itemInfo: curEquip,
                from: gdk.Tool.getResIdByNode(this.node),
                equipOnCb: () => {
                    this._openEquipView(index);
                },
                equipChangeCb: () => {
                    this._openEquipSelect(index);
                },
            };
            this.model.curEquip = curEquip;
            gdk.panel.open(PanelId.EquipTips, null, null, { args: tipsInfo });
        } else {
            this.model.curEquip = null
            this._openEquipSelect(index)
            this.equipIndex = index
            let curSelect = this.equipNodes[index]
            this._fadeEquip(curSelect, true)
            gdk.sound.isOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.click)
        }
    }

    _clearEquipSelect() {
        for (let index = 0; index < this.equipNodes.length; index++) {
            const element = this.equipNodes[index];
            this._fadeEquip(element, false)
        }
    }


    /**装备选中逻辑 */
    _selectEquip(index) {
        let curSelect = this.equipNodes[index]
        if (curSelect) {
            this._fadeEquip(curSelect, true)
        }
        if (index == this.equipIndex) {
            return
        }
        this.equipIndex = index
    }

    /**装备选中UI变化 */
    _fadeEquip(node: cc.Node, flag: boolean) {
        let selectIcon = node.getChildByName("selectIcon")
        if (flag) {
            selectIcon.active = true
        } else {
            selectIcon.active = false
        }
    }

    _openEquipSelect(index: number) {
        let heroId = this.heroInfo.heroId;
        let id = this.heroInfo.slots[index] ? this.heroInfo.slots[index].equipId : 0//this.heroInfo.equips[index];
        let equipData: BagItem = EquipUtils.getEquipData(id);
        if (id > 0 && !equipData) {
            let bagItem: BagItem = {
                series: id,
                itemId: id,
                itemNum: 1,
                type: BagType.EQUIP,
                extInfo: null,
            }
            equipData = bagItem
        }
        let args: SelectInfo = {
            extData: {
                part: index + 1,
                curEquip: equipData,
                heroId: heroId,
            }
        };
        gdk.panel.open(PanelId.EquipSelect2, null, null, {
            args: args,
        });
    }

    /** 打造装备 */
    _openEquipView(index: number) {
        let panel = gdk.panel.get(PanelId.RoleView2);
        let ctrl = panel.getComponent(RoleViewCtrl2);
        JumpUtils.openPanel({
            panelId: PanelId.EquipView2,
            // hideArgs: {
            //     id: PanelId.RoleView2,
            //     args: ctrl.panelIndex,
            // },
        });
    }

    /**一键穿戴 */
    oneKeyOnFunc() {
        let equipIds = []
        for (let i = 1; i <= 4; i++) {
            //对应部位，没被穿戴的装备
            let equips = BagUtils.getItemsByType(BagType.EQUIP, { part: i }, (equip: BagItem) => {
                return equip.itemNum > 0
            })
            if (equips.length == 0) {
                equipIds.push(0)
                continue
            }
            let partEquips: Array<EquipPower> = []
            for (let j = 0; j < equips.length; j++) {
                let ePower: EquipPower = {
                    power: GlobalUtil.getEquipPower(equips[j]),
                    bagItem: equips[j]
                }
                partEquips.push(ePower)
            }
            //从大到小排序
            partEquips.sort((eP1, eP2) => {
                let color1 = ConfigManager.getItemById(Item_equipCfg, eP1.bagItem.itemId).color
                let color2 = ConfigManager.getItemById(Item_equipCfg, eP2.bagItem.itemId).color
                if (color1 == color2) {
                    return eP2.power - eP1.power
                }
                return color2 - color1
            })
            let maxEPower = partEquips[0]
            let heroEquips = this.heroInfo.slots
            if (heroEquips.length > 0) {
                //有装备了
                if (heroEquips[i - 1].equipId != 0) {
                    let onEquip = EquipUtils.getEquipData(heroEquips[i - 1].equipId)
                    if (!onEquip) {
                        let bagItem: BagItem = {
                            series: heroEquips[i - 1].equipId,
                            itemId: heroEquips[i - 1].equipId,
                            itemNum: 1,
                            type: BagType.EQUIP,
                            extInfo: null,
                        }
                        onEquip = bagItem
                    }
                    let color1 = ConfigManager.getItemById(Item_equipCfg, onEquip.itemId).color
                    let color2 = ConfigManager.getItemById(Item_equipCfg, maxEPower.bagItem.itemId).color

                    let star1 = ConfigManager.getItemById(Item_equipCfg, onEquip.itemId).star
                    let star2 = ConfigManager.getItemById(Item_equipCfg, maxEPower.bagItem.itemId).star

                    //已穿戴装备已经是最高品质，则不进行替换
                    if ((GlobalUtil.getEquipPower(onEquip) < maxEPower.power && color1 != ColorType.Gold) || (color1 < color2) || (color1 == color2 && star1 < star2)) {
                        equipIds.push(maxEPower.bagItem.series)
                    } else {
                        equipIds.push(0)
                    }
                } else {
                    equipIds.push(maxEPower.bagItem.series)
                }
            } else {
                //一件装备都没有
                equipIds.push(maxEPower.bagItem.series)
            }
        }
        if (equipIds.length > 0) {
            let msg = new icmsg.HeroEquipOnReq()
            msg.heroId = this.heroInfo.heroId
            msg.equipIds = equipIds
            NetManager.send(msg)
            gdk.Timer.once(100, this, () => {
                this._updateEquips();
            })
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP32"))
        }

    }

    /**一键卸下 */
    oneKeyOffFunc() {
        let pos = []
        for (let i = 1; i <= 4; i++) {
            let heroEquips = this.heroInfo.slots
            if (heroEquips[i - 1] && heroEquips[i - 1].equipId != 0) {
                pos.push(i - 1)
            }
        }

        if (pos.length > 0) {
            let msg = new icmsg.HeroEquipOffReq()
            msg.heroId = this.heroInfo.heroId
            msg.equipParts = pos
            NetManager.send(msg)

            gdk.Timer.once(100, this, () => {
                this._updateEquips();
            })
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP33"))
        }
    }


    // 装备槽红点
    equipSlotRedPointHandle(index: string | number) {
        return false//this.heroInfo.equips[index] > 0;
    }

    //符文槽点击
    _runeClick(idx: number) {
        if (!this.heroInfo) {
            return;
        }
        let limitCfg = ConfigManager.getItemById(Rune_unlockCfg, `${idx + 1}`);
        if (limitCfg.level && this.heroInfo.level < limitCfg.level) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:HERO_TIP34"), limitCfg.level));//`英雄等级达到${limitCfg.level}级解锁符文槽`
            return;
        }
        if (limitCfg.star && this.heroInfo.star < limitCfg.star) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:HERO_TIP35"), limitCfg.star));//`英雄星级达到${limitCfg.star}星解锁符文槽`
            return;
        }

        let runeId = this.heroInfo.runes[idx];
        if (runeId) {
            gdk.panel.setArgs(PanelId.RuneInfo, [runeId, idx, this.heroInfo.heroId]);
            gdk.panel.open(PanelId.RuneInfo);
        }
        else {
            // gdk.panel.setArgs(PanelId.RuneSelect, [null, idx]);
            // gdk.panel.open(PanelId.RuneSelect);

            gdk.panel.setArgs(PanelId.RuneSelectNew, idx);
            gdk.panel.open(PanelId.RuneSelectNew);

        }
    }

    _updateRune() {
        if (!this.heroInfo) {
            return;
        }
        for (let i = 0; i < this.runeNodes.length; i++) {
            this._refreshRuneInfo(i);
        }
    }

    _refreshRuneInfo(idx: number) {
        let node = this.runeNodes[idx];
        let slot = node.getComponent(UiSlotItem);
        let lock = node.getChildByName('lock');
        let lockLab = lock.getChildByName('limitLab').getComponent(cc.Label);
        let add = node.getChildByName('add');
        let lv = node.getChildByName('lv').getComponent(cc.Label);
        let redPoint = node.getChildByName('RedPoint');
        let limitCfg = ConfigManager.getItemById(Rune_unlockCfg, `${idx + 1}`);
        let runId = this.heroInfo.runes[idx];
        lv.node.active = false;
        add.active = !runId;
        redPoint.active = runId && (RedPointUtils.is_can_rune_up(this.heroInfo, idx) || RedPointUtils.single_rune_strengthen(runId));
        lock.active = false;
        if (limitCfg.level && this.heroInfo.level < limitCfg.level) {
            add.active = false;
            redPoint.active = false;
            lock.active = true;
            lockLab.string = `${limitCfg.level}${gdk.i18n.t("i18n:HERO_TIP8")}`;
        }
        else if (limitCfg.star && this.heroInfo.star < limitCfg.star) {
            add.active = false;
            redPoint.active = false;
            lock.active = true;
            lockLab.string = `${limitCfg.star}${gdk.i18n.t("i18n:HERO_TIP9")}`;
        }

        if (runId) {
            slot.updateItemInfo(parseInt(runId.toString().slice(0, 6)));
            lv.node.active = true;
            lv.string = '.' + ConfigManager.getItemById(RuneCfg, parseInt(runId.toString().slice(0, 6))).level;
        }
        else {
            slot.updateQuality(-1);
            slot.updateItemIcon(null);
        }
    }

    _onRuneChange(e: gdk.Event) {
        this._updateRune();
    }

    /**红色套装特效 */
    _updateRedSuitEquipEffect() {
        let num = 0;
        this.heroInfo.slots.forEach(slot => {
            let cfg = ConfigManager.getItemById(Item_equipCfg, slot.equipId);
            if (cfg && cfg.color == 5) {
                num += 1;
            }
        });
        this.equipNodes.forEach(n => {
            n.getChildByName('redSuitSpine').active = num == 4;
        });
    }

    /**英雄重置 */
    openResetFunc() {
        if (!JumpUtils.ifSysOpen(2804, true)) {
            return
        }
        //符合条件的进入
        if (this.heroInfo.level >= 2) {
            this.model.resetHeroId = this.heroInfo.heroId
            JumpUtils.openPanel({
                panelId: PanelId.HeroResetView,
                currId: PanelId.RoleView2
            });
        } else {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP30"))
        }
    }

    /**专属装备点击 */
    onUniqueEquipClick() {
        let heroInfo = this.heroInfo
        if (!heroInfo) {
            return
        }
        let herostar_unlock = ConfigManager.getItemById(Unique_globalCfg, "herostar_unlock").value[0]
        if (this.heroInfo.star < herostar_unlock) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:HERO_TIP88"), herostar_unlock))
            return
        }
        //已有专属
        if (heroInfo.uniqueEquip && heroInfo.uniqueEquip.id > 0) {
            gdk.panel.setArgs(PanelId.UniqueEquipTip, heroInfo.uniqueEquip)
            gdk.panel.open(PanelId.UniqueEquipTip)
        } else {
            // 没有装备
            gdk.panel.open(PanelId.UniqueEquipList)
        }
    }
}
