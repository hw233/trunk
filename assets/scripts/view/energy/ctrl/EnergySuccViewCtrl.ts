import ConfigManager from '../../../common/managers/ConfigManager';
import EnergyModel from '../model/EnergyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import StringUtils from '../../../common/utils/StringUtils';
import { Energystation_advancedCfg, Energystation_typeCfg, Energystation_upgradeCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-27 10:51:10 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/energy/EnergySuccViewCtrl")
export default class EnergySuccViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    titleNode: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    nameNode: cc.Node = null;

    @property(cc.Node)
    upgradeNode: cc.Node = null;

    @property(cc.Node)
    advanceNode: cc.Node = null;

    pageType: number; //0-激活 1-升级 2-升阶
    stationType: number;
    onEnable() {
        [this.pageType, this.stationType] = this.args[0];
        let typeCfg = ConfigManager.getItemById(Energystation_typeCfg, this.stationType);
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/energy/texture/${typeCfg.resources}`);
        let url = ['nlz_jihuochenggong', 'nlz_shengjichenggong', 'nlz_jinjiechenggong'];
        GlobalUtil.setSpriteIcon(this.node, this.titleNode, `view/energy/texture/${url[this.pageType]}`);
        this.upgradeNode.active = this.pageType !== 2;
        this.advanceNode.active = this.pageType == 2;
        if (this.pageType == 2) {
            this._updateAdvanceNode();
        }
        else {
            this._updateUpgradeNode();
        }

        this.node.setScale(.7);
        this.node.runAction(cc.sequence(
            cc.scaleTo(.2, 1.05, 1.05),
            cc.scaleTo(.15, 1, 1)
        ));
    }

    onDisable() {
    }

    _updateUpgradeNode() {
        let info = ModelManager.get(EnergyModel).energyStationInfo[this.stationType];
        let typeCfg = ConfigManager.getItemById(Energystation_typeCfg, this.stationType);
        let advanceCfg = ConfigManager.getItemById(Energystation_advancedCfg, info.advanceId);
        let newUpgradeCfg = ConfigManager.getItemById(Energystation_upgradeCfg, info.upgradeId);
        let oldUpgradeCfg;
        if (newUpgradeCfg.level == 1) oldUpgradeCfg = null;
        else {
            let cfgs = ConfigManager.getItems(Energystation_upgradeCfg, (cfg: Energystation_upgradeCfg) => {
                if (cfg.level == newUpgradeCfg.level - 1) {
                    return true;
                }
            });
            oldUpgradeCfg = cfgs[cfgs.length - 2];//倒数第二个
        }

        this.nameNode.getChildByName('name').getComponent(cc.Label).string = `${typeCfg.name}${gdk.i18n.t('i18n:ENERGY_STATION_TIP7')}Lv.${oldUpgradeCfg ? oldUpgradeCfg.level : 0}`;
        this.nameNode.getChildByName('new').getComponent(cc.Label).string = `Lv.${newUpgradeCfg.level}`;

        let attrNames = ['hero_atk', 'hero_hp', 'hero_def', 'hero_hit', 'hero_dodge'];
        let percentStr = '_r';
        let oldNums = [];
        let newNums = [];
        attrNames.forEach((r, idx) => {
            let o = oldUpgradeCfg ? Math.floor(oldUpgradeCfg[r]) : 0;
            let n = Math.floor(newUpgradeCfg[r]);
            if (idx < 3) {
                //进阶百分比加成
                o += o * advanceCfg[`${r}${percentStr}`] / 100;
                n += n * advanceCfg[`${r}${percentStr}`] / 100;
            }
            oldNums.push(Math.ceil(o));
            newNums.push(Math.ceil(n));
        });
        this.upgradeNode.children.forEach((n, idx) => {
            let d = newNums[idx] - oldNums[idx];
            n.active = d > 0;
            if (n.active) {
                n.getChildByName('old').getComponent(cc.Label).string = oldNums[idx] + '';
                n.getChildByName('new').getComponent(cc.Label).string = newNums[idx] + '';
            }
        });
    }

    _updateAdvanceNode() {
        let info = ModelManager.get(EnergyModel).energyStationInfo[this.stationType];
        let typeCfg = ConfigManager.getItemById(Energystation_typeCfg, this.stationType);
        let newAdvanceCfg = ConfigManager.getItemById(Energystation_advancedCfg, info.advanceId);
        let oldAdvanceCfg;
        if (newAdvanceCfg.class == 1) oldAdvanceCfg = null;
        else {
            let cfgs = ConfigManager.getItems(Energystation_advancedCfg, (cfg: Energystation_advancedCfg) => {
                if (cfg.class == newAdvanceCfg.class - 1) {
                    return true;
                }
            });
            oldAdvanceCfg = cfgs[cfgs.length - 2];//倒数第二个
        }

        this.nameNode.getChildByName('name').getComponent(cc.Label).string = `${typeCfg.name}${gdk.i18n.t('i18n:ENERGY_STATION_TIP10')}Lv.${oldAdvanceCfg ? oldAdvanceCfg.class : 0}`;
        this.nameNode.getChildByName('new').getComponent(cc.Label).string = `Lv.${newAdvanceCfg.class}`;

        let attrNames = ['hero_atk_r', 'hero_hp_r', 'hero_def_r'];
        let s = [gdk.i18n.t('i18n:ROLE_TIP36'), gdk.i18n.t('i18n:ROLE_TIP34'), gdk.i18n.t('i18n:ROLE_TIP37')];
        let oldNums = [];
        let newNums = [];
        attrNames.forEach(r => {
            let o = oldAdvanceCfg ? Math.floor(oldAdvanceCfg[r]) : 0;
            let n = Math.floor(newAdvanceCfg[r]);
            oldNums.push(o);
            newNums.push(n);
        });
        this.advanceNode.children.forEach((n, idx) => {
            let d = newNums[idx] - oldNums[idx];
            n.active = d > 0;
            if (n.active) {
                n.getComponent(cc.RichText).string = StringUtils.format(gdk.i18n.t('i18n:ENERGY_STATION_TIP8'), typeCfg.name, s[idx], newNums[idx]);
            }
        });
    }
}
