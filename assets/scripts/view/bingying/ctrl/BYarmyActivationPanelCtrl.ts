import BYModel from '../model/BYModel';
import BYUtils from '../utils/BYUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import {
    BarracksCfg,
    SkillCfg,
    Soldier_army_skinCfg,
    SoldierCfg
    } from '../../../a/config';


/** 
 * @Description: 兵营-兵团解锁界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-12 14:25:25
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYarmyActivationPanelCtrl")
export default class BYarmyActivationPanelCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;
    @property(cc.Label)
    skinName: cc.Label = null;
    @property(cc.RichText)
    skillDes: cc.RichText = null;
    @property(cc.Label)
    atkLb: cc.Label = null;
    @property(cc.Label)
    atkAdd: cc.Label = null;
    @property(cc.Label)
    hpLb: cc.Label = null;
    @property(cc.Label)
    hpAdd: cc.Label = null;
    @property(cc.Label)
    defLb: cc.Label = null;
    @property(cc.Label)
    defAdd: cc.Label = null;

    curCfg: Soldier_army_skinCfg;
    get byModel() { return ModelManager.get(BYModel); }
    onEnable() {
        let args = gdk.panel.getArgs(PanelId.BYarmyActivationPanel)
        this.curCfg = args[0];
        let path = `spine/monster/${this.curCfg.skin}/ui/${this.curCfg.skin}`
        GlobalUtil.setSpineData(this.node, this.spine, path, true, 'stand_s', true);
        let skillCfg = ConfigManager.getItemByField(SkillCfg, 'skill_id', this.curCfg.skills);
        this.skillDes.string = skillCfg ? skillCfg.des : '';
        this.skinName.string = this.curCfg.name;

        let b_lv = this.byModel.byLevelsData[this.curCfg.type - 1];
        let cfgs = ConfigManager.getItems(BarracksCfg, (cfg: BarracksCfg) => {
            if (b_lv >= cfg.barracks_lv && cfg.soldier_id && cfg.soldier_id > 0 && cfg.type == this.curCfg.type) {
                return true
            }
            return false;
        })
        let selectSoldierId = cfgs[cfgs.length - 1].soldier_id;
        let maxHeroLv = HeroUtils.getMaxLevelHero();
        let cfg = ConfigManager.getItemById(SoldierCfg, selectSoldierId)

        let obj = BYUtils.getTotalAttr(this.curCfg.type, b_lv)

        this.atkLb.string = Math.floor((cfg['atk_w'] + Math.floor((maxHeroLv - 1) * cfg['grow_atk'] / 100) + obj["atk_g"].value) * (this.curCfg.atk_p / 10000)) + '';
        this.atkAdd.string = '+(' + (this.curCfg.atk_p / 100) + '%)'
        this.hpLb.string = Math.floor((cfg['hp_w'] + Math.floor((maxHeroLv - 1) * cfg['grow_hp'] / 100) + obj["hp_g"].value) * (this.curCfg.hp_p / 10000)) + '';
        this.hpAdd.string = '+(' + (this.curCfg.hp_p / 100) + '%)'
        this.defLb.string = Math.floor((cfg['def_w'] + Math.floor((maxHeroLv - 1) * cfg['grow_def'] / 100) + obj["def_g"].value) * (this.curCfg.def_p / 10000)) + '';
        this.defAdd.string = '+(' + (this.curCfg.def_p / 100) + '%)'

        let ani = this.node.getComponent(cc.Animation)
        ani.play()

        gdk.Timer.once(5000, this, this.close)
    }

    onDisable() {
        gdk.Timer.clearAll(this);
    }

}
