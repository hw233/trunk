import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../../common/models/BagModel';
import {
    Item_equipCfg,
    Item_rubyCfg,
    Rune_unlockCfg,
    RuneCfg
    } from '../../../../a/config';

/**
 * 查看英雄装备界面
 * @Author:luoyong
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-03-05 15:38:52
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/lookHero/LookHeroEquipCtrl")
export default class LookHeroEquipCtrl extends gdk.BasePanel {

    @property(cc.Node)
    equipNodes: Array<cc.Node> = [];

    @property([cc.Node])
    runeNodes: cc.Node[] = [];

    equipCtrls: Array<UiSlotItem> = [];

    get heroModel(): HeroModel { return ModelManager.get(HeroModel) }

    _heroImage: icmsg.HeroImage

    onEnable() {
        this._heroImage = this.heroModel.heroImage
        for (let index = 0; index < this.equipNodes.length; index++) {
            const element = this.equipNodes[index];
            this.equipCtrls[index] = element.getComponent(UiSlotItem)
            element.on(cc.Node.EventType.TOUCH_END, () => {
                this._equipClick(index)
            }, this)
        }
        //符文
        for (let i = 0; i < this.runeNodes.length; i++) {
            this.runeNodes[i].on(cc.Node.EventType.TOUCH_END, () => {
                this._runeClick(i);
            }, this)
        }

        this._updateEquip()
        this._updateRune();
    }

    _updateEquip() {
        for (let index = 0; index < 4; index++) {
            let ctrl = this.equipCtrls[index]
            let magicIcon = ctrl.node.getChildByName("magicIcon")
            magicIcon.active = false
            //宝石信息
            let jewelNode = ctrl.node.getChildByName("jewelNode")
            jewelNode.active = false

            let typeIcon = ctrl.node.getChildByName("type_icon")
            typeIcon.active = true

            //强化等级
            let strenghLv = ctrl.node.getChildByName("strengthLv").getComponent(cc.Label)
            strenghLv.string = ``

            ctrl.updateItemInfo(0)

            for (let i = 0; i < this._heroImage.slots.length; i++) {
                let equipInfo: icmsg.HeroEquipSlot = this._heroImage.slots[i]
                if (equipInfo && equipInfo.equipId > 0) {
                    let cfg = ConfigManager.getItemById(Item_equipCfg, equipInfo.equipId)
                    //同一部位
                    if (cfg.part == index + 1) {
                        ctrl.updateItemInfo(equipInfo.equipId);
                        ctrl.updateStar(cfg.star)
                        let showJewelNode = false
                        for (let i = 0; i < jewelNode.childrenCount; i++) {
                            let jewelIcon = jewelNode.getChildByName("jewel" + (i + 1))
                            let rubyId = equipInfo.rubies[i]
                            if (rubyId != 0) {
                                let jewelCfg = ConfigManager.getItemById(Item_rubyCfg, rubyId)
                                GlobalUtil.setSpriteIcon(this.node, jewelIcon, `view/role/texture/equip2/icon_diamond${jewelCfg.type}`)
                                showJewelNode = true
                            } else {
                                GlobalUtil.setSpriteIcon(this.node, jewelIcon, `view/role/texture/equip2/icon_diamond0`)
                            }
                        }
                        jewelNode.active = showJewelNode
                        typeIcon.active = false
                    }
                }
            }
        }
        this._updateRedSuitEquipEffect();
    }

    /**装备点击 */
    _equipClick(index) {
        for (let i = 0; i < this._heroImage.slots.length; i++) {
            let equipInfo: icmsg.HeroEquipSlot = this._heroImage.slots[i]
            if (equipInfo && equipInfo.equipId > 0) {
                let cfg = ConfigManager.getItemById(Item_equipCfg, equipInfo.equipId)
                //部位一致 
                if (cfg.part == index + 1) {
                    let itemData: BagItem = { series: equipInfo.equipId, itemId: equipInfo.equipId, itemNum: 1, type: BagType.EQUIP, extInfo: null }
                    GlobalUtil.openItemTips(itemData, true, true)
                    break;
                }
            }
        }
    }

    _updateRune() {
        if (!this._heroImage) {
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
        let limitCfg = ConfigManager.getItemById(Rune_unlockCfg, `${idx + 1}`);
        lock.active = false;
        if (limitCfg.level && this._heroImage.level < limitCfg.level) {
            lock.active = true;
            lockLab.string = `${limitCfg.level}${gdk.i18n.t("i18n:HERO_TIP8")}`;
        }
        else if (limitCfg.star && this._heroImage.star < limitCfg.star) {
            lock.active = true;
            lockLab.string = `${limitCfg.star}${gdk.i18n.t("i18n:HERO_TIP9")}`;
        }

        let runId = this._heroImage.runes[idx];
        add.active = false;
        if (runId) {
            slot.updateItemInfo(parseInt(runId.toString().slice(0, 6)));
            let cfg = ConfigManager.getItemById(RuneCfg, parseInt(runId.toString().slice(0, 6)));
            lv.string = '.' + cfg.level;
            lv.node.active = true;
        }
        else {
            lv.node.active = false;
            slot.updateQuality(-1);
            slot.updateItemIcon(null);
        }
    }

    //符文槽点击
    _runeClick(idx: number) {
        if (!this._heroImage) {
            return;
        }
        let limitCfg = ConfigManager.getItemById(Rune_unlockCfg, `${idx + 1}`);
        if (limitCfg.level && this._heroImage.level < limitCfg.level) {
            // gdk.gui.showMessage(`英雄等级达到${limitCfg.level}级解锁符文槽`);
            return;
        }
        if (limitCfg.star && this._heroImage.star < limitCfg.star) {
            // gdk.gui.showMessage(`英雄星级达到${limitCfg.star}星解锁符文槽`);
            return;
        }

        let runeId = this._heroImage.runes[idx];
        if (runeId) {
            gdk.panel.setArgs(PanelId.RuneInfo, [runeId, idx, null]);
            gdk.panel.open(PanelId.RuneInfo);
        }
        // else {
        //     gdk.panel.setArgs(PanelId.RuneSelect, [null, idx]);
        //     gdk.panel.open(PanelId.RuneSelect);
        // }
    }

    /**红色套装特效 */
    _updateRedSuitEquipEffect() {
        let num = 0;
        this._heroImage.slots.forEach(slot => {
            let cfg = ConfigManager.getItemById(Item_equipCfg, slot.equipId);
            if (cfg && cfg.color == 5) {
                num += 1;
            }
        });
        this.equipNodes.forEach(n => {
            n.getChildByName('redSuitSpine').active = num == 4;
        });
    }
}
