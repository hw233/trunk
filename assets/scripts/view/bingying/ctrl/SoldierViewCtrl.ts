import BYModel from '../model/BYModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import { SoldierCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/SoldierViewCtrl")
export default class SoldierViewCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Label)
    attLabs: Array<cc.Label> = [];

    @property(cc.Label)
    speLab: cc.Label = null

    @property(cc.Node)
    classIcon: cc.Node = null;

    @property(cc.Label)
    soldierName: cc.Label = null;

    @property(cc.RichText)
    skillDescLabs: cc.RichText[] = [];

    soldierId: number;

    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }
    get roleModel() { return ModelManager.get(RoleModel); }
    get byModel() { return ModelManager.get(BYModel); }

    onDestroy() {

    }

    //兵营图鉴、兵营科技、职业进阶会调用
    initSoldierId(soldierId: number) {
        this.soldierId = soldierId
        this._updateSoldierInfo()
        // this._updateSkillInfo()
    }

    _updateSoldierInfo() {

        let cfg = ConfigManager.getItemById(SoldierCfg, this.soldierId);
        GlobalUtil.setUiSoldierSpineData(this.node, this.spine, cfg.skin, true)

        this.soldierName.string = `${cfg.name}`
        this.soldierName.node.color = cc.color(GlobalUtil.getSoldierNameColor(cfg.color, false))
        let outLine = this.soldierName.node.getComponent(cc.LabelOutline)
        outLine.color = cc.color(GlobalUtil.getSoldierNameColor(cfg.color, true))
        GlobalUtil.setSpriteIcon(this.node, this.classIcon, GlobalUtil.getSoldierClassIconById(cfg.class))

        //初始+（英雄等级-1）*成长值
        this.speLab.string = `${cfg.range_score}`
        let keys = ["hp_w", "atk_w", "def_w", "hit_w", "dodge_w"]
        let addKeys = ["grow_hp", "grow_atk", "grow_def", "grow_hit", "grow_dodge"]
        let lv = this.heroModel.curHeroInfo ? this.heroModel.curHeroInfo.level : 1
        for (let index = 0; index < this.attLabs.length; index++) {
            const lab = this.attLabs[index];
            let key = keys[index]
            let val = cfg[key] || 0
            lab.string = `${val + Math.floor((lv - 1) * cfg[addKeys[index]] / 100)}`
        }


    }

    // _updateSkillInfo() {
    //     let info = this.byModel.byTechInfos;
    //     let b_s_lv = ConfigManager.getItemByField(Barracks_science_lvCfg, "soldier_id", this.soldierId);
    //     let soldierLv = 1;
    //     if (info && b_s_lv && info[b_s_lv.science_id]) {
    //         soldierLv = info[b_s_lv.science_id].level;
    //     }
    //     for (let i = 0; i < 2; i++) {
    //         let skillInfo = SoldierUtils.getSkillInfo(this.soldierId, i, soldierLv);
    //         this.skillDescLabs[i].string = skillInfo.skillId > 0 ? StringUtils.setRichtOutLine(skillInfo.desc, "#432208", 2) : `${StringUtils.setRichtOutLine("无", "#432208", 2)}`;
    //     }
    // }

}
