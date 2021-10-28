import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Common_strongerCfg, Hero_careerCfg, HeroCfg } from '../../../../a/config';


/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 19:49:34
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/upgrade/UpgradeHeroItemCtrl")
export default class UpgradeHeroItemCtrl extends UiListItem {

    @property(cc.Node)
    tip: cc.Node = null;

    @property(cc.Label)
    fightLab: cc.Label = null;

    @property(cc.Label)
    careerLv: cc.Label = null;

    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Sprite)
    colorBg: cc.Sprite = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Sprite)
    heroIcon: cc.Sprite = null;

    @property(cc.Node)
    redPoint: cc.Node = null

    heroCfg: HeroCfg
    heroInfo: icmsg.HeroInfo

    onLoad() {

    }

    updateView() {
        this.heroInfo = this.data
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId)
        let path = `common/texture/sub_itembg0${this.heroInfo.color}`
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, path)
        let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star)//`icon/hero/${this.heroCfg.icon}_s`
        GlobalUtil.setSpriteIcon(this.node, this.heroIcon, icon)

        this.fightLab.string = `${this.heroInfo.power}`
        this.lvLabel.string = `${this.heroInfo.level}`


        let careerLv = HeroUtils.getHeroJobLv(this.heroInfo.heroId, this.heroInfo.careerId)
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.heroInfo.careerId, { career_lv: careerLv })
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, GlobalUtil.getCareerIcon(this.heroInfo.careerId))

        let copyModel = ModelManager.get(CopyModel)
        let stageId = copyModel.latelyStageId

        let strongerCfg = ConfigManager.getItemByField(Common_strongerCfg, "index", stageId)
        this.tip.active = false
        if (strongerCfg && (this.heroInfo.level < strongerCfg.level || this.isShowTip(strongerCfg))) {
            this.tip.active = true
        }

        this.redPoint.active = this.isShowRedPoint(this.heroInfo)
    }

    isShowRedPoint(heroInfo) {
        return RedPointUtils.is_can_hero_upgrade(heroInfo) || RedPointUtils.is_can_star_up(heroInfo)
            || RedPointUtils.is_can_job_up(heroInfo) || RedPointUtils.each_or([1, 2, 3, 4, 5, 6], RedPointUtils.is_can_change_job_to, heroInfo)
    }

    isShowTip(strongerCfg) {
        let heroCareerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.heroInfo.careerId)
        // if (strongerCfg["class_" + heroCareerCfg.career_type] && strongerCfg["class_" + heroCareerCfg.career_type].length > 0) {
        //     if (heroCareerCfg.rank < strongerCfg["class_" + heroCareerCfg.career_type][0] ||
        //         (heroCareerCfg.rank == strongerCfg["class_" + heroCareerCfg.career_type][0] && GlobalUtil.getHeroCareerLv(this.heroInfo) < strongerCfg["class_" + heroCareerCfg.career_type][1])) {
        //         return true
        //     }
        // }
        return false
    }

    oepnRolePanel() {
        gdk.panel.hide(PanelId.UpgradeHero)
        gdk.panel.hide(PanelId.PveSceneFailPanel)
        // JumpUtils.openRolePanel(["job", 0, this.heroCfg.id])
        JumpUtils.openEquipPanelById(this.heroCfg.id, [2])
    }
}