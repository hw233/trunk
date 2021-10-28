import ConfigManager from '../../../common/managers/ConfigManager';
import GeneralModel from '../../../common/models/GeneralModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import { General_weapon_levelCfg, General_weapon_progressCfg, General_weaponCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-19 14:59:12 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/general/GWeaponUpgradeSucViewCtrl")
export default class GWeaponUpgradeSucViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  titleNode: cc.Node = null;

  @property(cc.Node)
  weaponIcon: cc.Node = null;

  @property([cc.Node])
  values: cc.Node[] = [];

  get generalModel(): GeneralModel { return ModelManager.get(GeneralModel); }

  effectAni: cc.Animation = null
  titlUrl: string[] = ['view/general/texture/general/sub_gongxishengji', 'view/general/texture/general/sub_jinglianchenggong'];
  curType: number; //0-升级 1-精炼
  onEnable() {
    this.curType = this.args[0];
    GlobalUtil.setSpriteIcon(this.node, this.titleNode, this.titlUrl[this.curType]);
    let weaponCfg = ConfigManager.getItemByField(General_weaponCfg, 'artifactid', this.generalModel.curUseWeapon);
    let url = `icon/item/${weaponCfg.icon}`;
    GlobalUtil.setSpriteIcon(this.node, this.weaponIcon, url);
    let oldCfg: General_weapon_levelCfg | General_weapon_progressCfg;
    let newCfg: General_weapon_levelCfg | General_weapon_progressCfg;
    if (this.curType == 0) {
      oldCfg = ConfigManager.getItemById(General_weapon_levelCfg, this.generalModel.oldWaponLvCfgId);
      newCfg = ConfigManager.getItemById(General_weapon_levelCfg, this.generalModel.waponLvCfgId);
    }
    else {
      oldCfg = ConfigManager.getItemByField(General_weapon_progressCfg, 'lv', this.generalModel.oldWeaponRefineLv);
      newCfg = ConfigManager.getItemByField(General_weapon_progressCfg, 'lv', this.generalModel.weaponRefineLv);
    }
    this.values.forEach((n, idx) => {
      let nameLab = n.getChildByName('name').getComponent(cc.Label);
      let oldLab = n.getChildByName('old').getComponent(cc.Label);
      let newLab = n.getChildByName('new').getComponent(cc.Label);
      if (idx == 0) {
        nameLab.string = gdk.i18n.t('i18n:RUNE_TIP5');
        oldLab.string = oldCfg ? oldCfg.lv + '' : '0';
        newLab.string = newCfg.lv + '';
      } else if (idx == 1) {
        nameLab.string = this.curType == 0 ? gdk.i18n.t('i18n:ROLE_TIP36') : gdk.i18n.t('i18n:GENERAL_WEAPON_TIP1');
        if (newCfg instanceof General_weapon_levelCfg) {
          oldLab.string = oldCfg && oldCfg instanceof General_weapon_levelCfg ? oldCfg.atk_g + '' : '0';
          newLab.string = newCfg.atk_g + '';
        }
        else if (newCfg instanceof General_weapon_progressCfg) {
          oldLab.string = oldCfg && oldCfg instanceof General_weapon_progressCfg ? Math.floor(oldCfg.dmg_add / 100) + '%' : '0%';
          newLab.string = Math.floor(newCfg.dmg_add / 100) + '%';
        }
      } else if (idx == 2) {
        nameLab.string = this.curType == 0 ? gdk.i18n.t('i18n:ROLE_TIP37') : gdk.i18n.t('i18n:GENERAL_WEAPON_TIP2');
        if (newCfg instanceof General_weapon_levelCfg) {
          oldLab.string = oldCfg && oldCfg instanceof General_weapon_levelCfg ? oldCfg.def_g + '' : '0';
          newLab.string = newCfg.def_g + '';
        }
        else if (newCfg instanceof General_weapon_progressCfg) {
          oldLab.string = oldCfg && oldCfg instanceof General_weapon_progressCfg ? Math.floor(oldCfg.dmg_res / 100) + '%' : '0%';
          newLab.string = Math.floor(newCfg.dmg_res / 100) + '%';
        }
      } else if (idx == 3) {
        n.active = this.curType == 0;
        if (n.active && newCfg instanceof General_weapon_levelCfg) {
          nameLab.string = gdk.i18n.t('i18n:ROLE_TIP34');
          oldLab.string = oldCfg && oldCfg instanceof General_weapon_levelCfg ? oldCfg.hp_g + '' : '0';
          newLab.string = newCfg.hp_g + '';
        }
      }
    });

    this.effectAni = this.node.getComponent(cc.Animation)
    this.effectAni.on('finished', this.onFinished, this);
    this.effectAni.play("UI_hdyx")

    this.node.setScale(.7);
    this.node.runAction(cc.sequence(
      cc.scaleTo(.2, 1.05, 1.05),
      cc.scaleTo(.15, 1, 1)
    ));
  }

  onDisable() {
    if (this.effectAni) {
      this.effectAni.targetOff(this);
      this.effectAni = null;
    }
  }

  onFinished() {
    // this.mask.active = false
    this.effectAni.off('finished', this.onFinished, this);
    this.effectAni.play("UI_hdyx", 2.5)
    this.schedule(() => {
      this.effectAni.play("UI_hdyx", 2.5)
    }, 1)
  }
}
