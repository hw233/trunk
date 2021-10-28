import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GeneralModel from '../../../common/models/GeneralModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import { General_weapon_levelCfg, General_weapon_progressCfg, General_weaponCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/general/GWeaponInfoViewCtrl")
export default class GWeaponInfoViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    weaponIcon: cc.Node = null;

    @property(cc.RichText)
    descLab: cc.RichText = null;

    @property(cc.Label)
    atkVLab: cc.Label = null;

    @property(cc.Label)
    defVLab: cc.Label = null;

    @property(cc.Label)
    hpVLab: cc.Label = null;

    @property(cc.Label)
    refineTitleLab: cc.Label = null;

    @property([cc.Node])
    refineAtrs: cc.Node[] = [];

    get generalModel(): GeneralModel { return ModelManager.get(GeneralModel); }
    onEnable() {
        let weaponCfg = ConfigManager.getItemByField(General_weaponCfg, 'artifactid', this.generalModel.curUseWeapon);
        this.descLab.string = '';
        this.nameLab.string = weaponCfg.name + `+${this.generalModel.weaponLv}【${gdk.i18n.t('i18n:GENERAL_WEAPON_TIP4')}+${this.generalModel.weaponRefineLv}】`;
        let color = weaponCfg.quality;
        this.nameLab.node.color = BagUtils.getColor(color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(color);
        let url = `icon/item/${weaponCfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.weaponIcon, url);
        if (weaponCfg.skill) {
            this.descLab.string = GlobalUtil.getSkillCfg(weaponCfg.skill).des;
        }
        let levelCfg = ConfigManager.getItemById(General_weapon_levelCfg, this.generalModel.waponLvCfgId);
        this.atkVLab.string = levelCfg.atk_g + '';
        this.defVLab.string = levelCfg.def_g + '';
        this.hpVLab.string = levelCfg.hp_g + '';
        let cfgs = ConfigManager.getItems(General_weapon_progressCfg, (cfg: General_weapon_progressCfg) => {
            if (cfg.skill && cfg.skill.length > 0) return true;
        });
        let n = 0;
        this.refineAtrs.forEach((node, idx) => {
            node.active = !!cfgs[idx];
            if (node.active) {
                let v = node.getChildByName('value').getComponent(cc.RichText);
                let limit = node.getChildByName('limit').getComponent(cc.Label);
                v.string = GlobalUtil.getSkillCfg(cfgs[idx].skill[0]).des;
                limit.string = `(${gdk.i18n.t('i18n:GENERAL_WEAPON_TIP7')}:${cfgs[idx].lv})`;
                if (cfgs[idx].lv <= this.generalModel.weaponRefineLv) {
                    n += 1;
                }
            }
        });
        this.refineTitleLab.string = `${gdk.i18n.t('i18n:GENERAL_WEAPON_TIP8')}(${n}/${cfgs.length})`;
    }

    onDisable() {
    }
}
