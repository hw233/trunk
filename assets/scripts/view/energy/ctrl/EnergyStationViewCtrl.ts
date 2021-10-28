import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import EnergyModel from '../model/EnergyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { EnergyEventId } from '../enum/EnergyEventId';
import {
    Energystation_advancedCfg,
    Energystation_typeCfg,
    Energystation_upgradeCfg,
    Hero_starCfg
    } from '../../../a/config';
import { RoleEventId } from '../../role/enum/RoleEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-27 10:50:13 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/energy/EnergyStationViewCtrl")
export default class EnergyStationViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    advanceBtn: cc.Node = null;

    @property([cc.Label])
    curTotalValues: cc.Label[] = [];

    @property(cc.Label)
    curLv: cc.Label = null;

    @property(cc.Node)
    lvProgressNode: cc.Node = null;

    @property(cc.Node)
    curBasicValueNode: cc.Node = null;

    @property(cc.Node)
    heroMaterialNode: cc.Node = null;

    @property(cc.Node)
    otherMaterialNode: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    activeBtn: cc.Node = null;

    @property(cc.Node)
    upgradeBtn: cc.Node = null;

    @property(cc.Node)
    topLvTips: cc.Node = null;

    @property(UiTabMenuCtrl)
    tabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    redPointSwitch: cc.Node = null;

    get EnergyModel(): EnergyModel { return ModelManager.get(EnergyModel); }
    curSelectType: number;
    heroMaterialIds: number[] = [];
    onEnable() {
        this.tabMenu.setSelectIdx(0, true);
        gdk.e.on(EnergyEventId.ENERGY_HERO_MATERIALS_SELECT, this._onHeroMaterialsSelect, this);
        gdk.e.on(RoleEventId.REMOVE_ONE_HERO, this._updateRedpoint, this);
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateCost();
            this._updateRedpoint();
        }, this);
        NetManager.on(icmsg.RoleUpdateRsp.MsgType, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateCost();
            this._updateRedpoint();
        }, this);
        NetManager.on(icmsg.EnergyStationAdvanceRsp.MsgType, this._updateTopView, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    onRedpointSwichClick() {
        let info = this.EnergyModel.energyStationInfo[this.curSelectType];
        if (!info) return;
        let req = new icmsg.EnergyStationRedPointReq();
        req.stationId = this.curSelectType;
        req.open = !info.isRedPoint;
        NetManager.send(req, (resp: icmsg.EnergyStationRedPointRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            GlobalUtil.setSpriteIcon(this.node, this.redPointSwitch, `common/texture/role/yx_icon0${resp.info.isRedPoint ? 2 : 4}`);
            this._updateRedpoint();
        }, this);
    }

    /**进阶 */
    onAdvanceBtnClick() {
        gdk.panel.setArgs(PanelId.EnergyAdvanceView, this.curSelectType);
        gdk.panel.open(PanelId.EnergyAdvanceView);
    }

    /**英雄材料消耗 */
    onHeroMaterialAddBtnClick() {
        let typeCfg = ConfigManager.getItemById(Energystation_typeCfg, this.curSelectType);
        gdk.panel.setArgs(PanelId.EnergyMaterialsView, [typeCfg.consumption, [...this.heroMaterialIds]]);
        gdk.panel.open(PanelId.EnergyMaterialsView);
    }

    /**激活 */
    onActBtnClick() {
        let typeCfg = ConfigManager.getItemById(Energystation_typeCfg, this.curSelectType);
        if (this.heroMaterialIds.length < typeCfg.consumption[2]) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:MINECOPY_EXCHANGE_BTN1'));
            return;
        }
        let req = new icmsg.EnergyStationUnlockReq();
        req.stationId = this.curSelectType;
        req.heroIds = this.heroMaterialIds;
        NetManager.send(req, (resp: icmsg.EnergyStationUnlockRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateView();
            //todo show pop
            gdk.panel.setArgs(PanelId.EnergySuccView, [0, this.curSelectType]);
            gdk.panel.open(PanelId.EnergySuccView);
        }, this);
    }

    /**升级 */
    onUpgradeBtnClick() {
        let info = this.EnergyModel.energyStationInfo[this.curSelectType];
        let upgradeCfg = ConfigManager.getItemById(Energystation_upgradeCfg, info.upgradeId);
        let nextCfg = ConfigManager.getItem(Energystation_upgradeCfg, (cfg: Energystation_upgradeCfg) => {
            if (cfg.type == upgradeCfg.type && cfg.level == upgradeCfg.level && cfg.times == upgradeCfg.times + 1) {
                return true;
            }
        });
        for (let i = 0; i < nextCfg.consumption.length; i++) {
            let c = nextCfg.consumption[i];
            if (BagUtils.getItemNumById(c[0]) < c[1]) {
                gdk.gui.showMessage(`${BagUtils.getConfigById(c[0]).name}${gdk.i18n.t('i18n:RELIC_TIP11')}`);
                return;
            }
        }
        let req = new icmsg.EnergyStationUpgradeReq();
        req.upgradeId = nextCfg.id;
        NetManager.send(req, (resp: icmsg.EnergyStationUpgradeRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateView();
            let newCfg = ConfigManager.getItemById(Energystation_upgradeCfg, resp.info.upgradeId);
            if (newCfg.level > upgradeCfg.level) {
                //todo
                gdk.panel.setArgs(PanelId.EnergySuccView, [1, this.curSelectType]);
                gdk.panel.open(PanelId.EnergySuccView);
            }
            else {
                let attrNames = ['hero_atk', 'hero_hp', 'hero_def', 'hero_hit', 'hero_dodge'];
                let s = [
                    gdk.i18n.t('i18n:ROLE_TIP36'), gdk.i18n.t('i18n:ROLE_TIP34'),
                    gdk.i18n.t('i18n:ROLE_TIP37'), gdk.i18n.t('i18n:ROLE_TIP38'),
                    gdk.i18n.t('i18n:ROLE_TIP39')];
                attrNames.forEach((attr, idx) => {
                    let d = Math.floor(newCfg[attr]) - Math.floor(upgradeCfg[attr]);
                    if (d > 0) {
                        gdk.gui.showMessage(`${s[idx]}: +${d}`);
                    }
                });
            }
        }, this);
    }

    onTabMenuSelect(e, type) {
        if (!e) return;
        this.curSelectType = parseInt(type) + 1;
        this.heroMaterialIds = [];
        this._updateView();
    }

    _updateView() {
        this._updateTopView();
        this._updateContent();
        this._updateCost();
        this._updateTabMenu();
        this._updateRedpoint();
    }

    _updateTopView() {
        let info = this.EnergyModel.energyStationInfo[this.curSelectType];
        let typeCfg = ConfigManager.getItemById(Energystation_typeCfg, this.curSelectType);
        let upgradeCfg = info.upgradeId == 0 ? ConfigManager.getItem(Energystation_upgradeCfg, (cfg: Energystation_upgradeCfg) => {
            if (cfg.type == this.curSelectType && cfg.level == 1 && cfg.times == 0) return true;
        }) : ConfigManager.getItemById(Energystation_upgradeCfg, info.upgradeId);
        let advanceCfg = info.advanceId == 0 ? ConfigManager.getItem(Energystation_advancedCfg, (cfg: Energystation_advancedCfg) => {
            if (cfg.type == this.curSelectType && cfg.class == 1 && cfg.level == 0) return true;
        }) : ConfigManager.getItemById(Energystation_advancedCfg, info.advanceId);
        this.nameLab.string = `${typeCfg.name}${gdk.i18n.t('i18n:ENERGY_STATION_TIP5')}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/energy/texture/${typeCfg.resources}`);
        GlobalUtil.setAllNodeGray(this.icon, info.upgradeId == 0 ? 1 : 0);
        this.advanceBtn.active = info.upgradeId !== 0;
        if (advanceCfg) {
            this.advanceBtn.getChildByName('lab').getComponent(cc.Label).string = Math.floor(advanceCfg.class) + gdk.i18n.t('i18n:ENERGY_STATION_TIP6');
        }
        let attrNames = ['hero_atk', 'hero_hp', 'hero_def', 'hero_hit', 'hero_dodge'];
        let percentStr = '_r';
        this.curTotalValues.forEach((lab, idx) => {
            let num = upgradeCfg ? Math.floor(upgradeCfg[attrNames[idx]]) : 0;
            if (idx < 3) {
                num += advanceCfg ? num * Math.floor(advanceCfg[`${attrNames[idx]}${percentStr}`]) / 100 : 0;
            }
            lab.string = Math.ceil(num) + '';
        });
    }

    _updateContent() {
        let info = this.EnergyModel.energyStationInfo[this.curSelectType];
        let upgradeCfg = info.upgradeId == 0 ? ConfigManager.getItem(Energystation_upgradeCfg, (cfg: Energystation_upgradeCfg) => {
            if (cfg.type == this.curSelectType && cfg.level == 1 && cfg.times == 0) return true;
        }) : ConfigManager.getItemById(Energystation_upgradeCfg, info.upgradeId);
        this.curLv.string = info.upgradeId == 0 ? 'Lv.1' : `Lv.${Math.floor(upgradeCfg.level)}`;
        this.lvProgressNode.active = info.upgradeId !== 0;
        if (this.lvProgressNode.active) {
            let cfgs = ConfigManager.getItemsByField(Energystation_upgradeCfg, 'level', upgradeCfg.level);
            let totalExp = 0;
            let curExp = 0;
            cfgs.forEach(c => {
                if (c.times <= upgradeCfg.times) {
                    curExp += c.exp;
                }
                totalExp += c.exp;
            });
            this.lvProgressNode.getChildByName('bar').width = Math.max(0, curExp / totalExp * 452);
            this.lvProgressNode.getChildByName('num').getComponent(cc.Label).string = `${Math.floor(curExp)}/${Math.floor(totalExp)}`
        }
        let attrNames = ['hero_atk', 'hero_hp', 'hero_def', 'hero_hit', 'hero_dodge'];
        this.curBasicValueNode.children.forEach((n, idx) => {
            n.getChildByName('num').getComponent(cc.Label).string = '+' + (upgradeCfg ? Math.floor(upgradeCfg[attrNames[idx]]) : '0');
        });
        GlobalUtil.setSpriteIcon(this.node, this.redPointSwitch, `common/texture/role/yx_icon0${info.isRedPoint ? 2 : 4}`);
    }

    _updateCost() {
        this._updateHeroMaterialNode();
        let info = this.EnergyModel.energyStationInfo[this.curSelectType];
        let upgradeCfg = info.upgradeId == 0 ? null : ConfigManager.getItemById(Energystation_upgradeCfg, info.upgradeId);
        let nextCfg = !!!upgradeCfg ? null : ConfigManager.getItem(Energystation_upgradeCfg, (cfg: Energystation_upgradeCfg) => {
            if (upgradeCfg && cfg.type == upgradeCfg.type && cfg.level == upgradeCfg.level && cfg.times == upgradeCfg.times + 1) {
                return true;
            }
        });
        this.otherMaterialNode.removeAllChildren();
        if (nextCfg) {
            nextCfg.consumption.forEach(r => {
                let slot = cc.instantiate(this.slotPrefab);
                let ctrl = slot.getComponent(UiSlotItem);
                slot.parent = this.otherMaterialNode;
                let hasNum = BagUtils.getItemNumById(r[0]);
                ctrl.updateItemInfo(r[0], hasNum);
                ctrl.itemInfo = {
                    series: null,
                    itemId: r[0],
                    itemNum: hasNum,
                    type: BagUtils.getItemTypeById(r[0]),
                    extInfo: null
                };
                let color = hasNum >= r[1] ? '#FFFFFF' : '#FF0000'
                ctrl.updateNumLab(`${GlobalUtil.numberToStr(hasNum, true, true)}/${GlobalUtil.numberToStr(r[1], true, true)}`, null, cc.color().fromHEX(color));
            });
        }
        this.activeBtn.active = !upgradeCfg;
        this.upgradeBtn.active = !!nextCfg;
        this.topLvTips.active = !!upgradeCfg && !nextCfg;
    }

    _updateHeroMaterialNode() {
        let info = this.EnergyModel.energyStationInfo[this.curSelectType];
        this.heroMaterialNode.active = info.upgradeId == 0;
        if (this.heroMaterialNode.active) {
            let typeCfg = ConfigManager.getItemById(Energystation_typeCfg, this.curSelectType);
            GlobalUtil.setSpriteIcon(this.node, this.heroMaterialNode.getChildByName('group'), GlobalUtil.getGroupIcon(typeCfg.consumption[0], false));
            this.heroMaterialNode.getChildByName('starLabel').active = typeCfg.consumption[1] !== 0;
            if (typeCfg.consumption[1] !== 0) {
                this.heroMaterialNode.getChildByName('starLabel').getComponent(cc.Label).string = typeCfg.consumption[1] > 5 ? '1'.repeat(typeCfg.consumption[1] - 5) : '0'.repeat(typeCfg.consumption[1]);
            }
            let color = ConfigManager.getItemById(Hero_starCfg, typeCfg.consumption[1]).color;
            GlobalUtil.setSpriteIcon(this.node, this.heroMaterialNode.getChildByName('frame'), `common/texture/sub_itembg0${color}`);
            this.heroMaterialNode.getChildByName('num').getComponent(cc.Label).string = `${this.heroMaterialIds.length}/${typeCfg.consumption[2]}`
            this.heroMaterialNode.getChildByName('num').color = cc.color().fromHEX(this.heroMaterialIds.length == typeCfg.consumption[2] ? '#FFFFFF' : '#FF0000');
            this.heroMaterialNode.getChildByName('icon').active = this.heroMaterialIds.length == typeCfg.consumption[2];
            this.heroMaterialNode.getChildByName('mask').active = this.heroMaterialIds.length !== typeCfg.consumption[2];
            this.heroMaterialNode.getChildByName('RedPoint').active = RedPointUtils.is_energy_can_active(this.curSelectType) && this.heroMaterialIds.length !== typeCfg.consumption[2];
        }
    }

    _updateTabMenu() {
        this.tabMenu.node.children.forEach((n, idx) => {
            if (n.active) {
                let info = this.EnergyModel.energyStationInfo[idx + 1];
                let upgradeCfg = info.upgradeId == 0 ? null : ConfigManager.getItemById(Energystation_upgradeCfg, info.upgradeId);
                let selectLab = cc.find('select/lv', n).getComponent(cc.Label);
                let normalLab = cc.find('normal/lv', n).getComponent(cc.Label);
                selectLab.string = normalLab.string = upgradeCfg ? `Lv.${upgradeCfg.level}` : gdk.i18n.t('i18n:ENERGY_STATION_TIP9');
            }
        });
    }

    _updateRedpoint() {
        this.tabMenu.node.children.forEach((n, idx) => {
            if (n.active) {
                cc.find('RedPoint', n).active = RedPointUtils.is_energy_can_update(idx + 1);
            }
        });
        cc.find('RedPoint', this.activeBtn).active = RedPointUtils.is_energy_can_active(this.curSelectType);
        cc.find('RedPoint', this.upgradeBtn).active = RedPointUtils.is_energy_can_upgrade(this.curSelectType);
        cc.find('RedPoint', this.advanceBtn).active = RedPointUtils.is_energy_can_advance(this.curSelectType);
    }

    _onHeroMaterialsSelect(e) {
        let info = this.EnergyModel.energyStationInfo[this.curSelectType];
        if (info.upgradeId !== 0) return; // 已解锁
        this.heroMaterialIds = [...e.data];
        this._updateHeroMaterialNode();
    }
}
