import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import ResonatingModel from '../model/ResonatingModel';
import StringUtils from '../../../common/utils/StringUtils';
import { Hero_careerCfg, Hero_starCfg, HeroCfg } from '../../../a/config';


/** 
 * @Description: 永恒水晶上阵英雄tip
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:58:37
 */


const { ccclass, property } = cc._decorator;

@ccclass
export default class ResonatingUpHeroTipCtrl extends gdk.BasePanel {

    @property(cc.Label)
    oldlvLab: cc.Label = null;
    @property(cc.Label)
    newlvLab: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    starLab: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;

    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.Sprite)
    colorBg: cc.Sprite = null

    @property(cc.RichText)
    levelTip: cc.RichText = null;

    heroInfo: icmsg.HeroInfo = null
    heroCfg: HeroCfg = null
    quality: number = 0;
    get model(): ResonatingModel { return ModelManager.get(ResonatingModel); }


    onEnable() {
        //获取状态
        let arg = gdk.panel.getArgs(PanelId.ResonatingUpHeroTip);
        let data: icmsg.ResonatingGrid = arg[0]
        this.heroInfo = HeroUtils.getHeroInfoByHeroId(data.heroId)//data.heroInfo;

        let cfg = BagUtils.getConfigById(this.heroInfo.typeId);
        let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star, false)//`icon/hero/${cfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        //let level = this.heroInfo.level || 1;
        this.newlvLab.string = `${data.heroLv}` + gdk.i18n.t("i18n:FOOTHOLD_TIP3");
        this.oldlvLab.string = `${data.heroLv0}` + gdk.i18n.t("i18n:FOOTHOLD_TIP3");
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
        //let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.heroInfo.careerId).career_type;
        let type = Math.floor(this.heroInfo.soldierId / 100);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${this.heroInfo.color}`);
        this._updateStar();
        this.levelTip.node.parent.active = false;//data.heroLv < this.model.minLevel;
        if (data.heroLv < this.model.minLevel) {
            let heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
            let maxCareerLv = ConfigManager.getItemByField(Hero_starCfg, 'star', heroCfg.star_max);
            let maxCareerCfg = ConfigManager.getItem(Hero_careerCfg, (item: Hero_careerCfg) => {
                if (item.career_id == this.heroInfo.careerId && maxCareerLv.career_lv == item.career_lv) {
                    return true;
                }
                return false;
            })
            if (data.heroLv == maxCareerCfg.hero_lv) {
                return;
            }
            this.levelTip.node.parent.active = true;
            this.levelTip.string = ''
            let careerCfg = ConfigManager.getItem(Hero_careerCfg, (item: Hero_careerCfg) => {
                if (item.career_id == this.heroInfo.careerId && item.hero_lv >= this.model.minLevel) {
                    return true;
                }
                return false;
            })
            if (careerCfg) {
                let starCfg = ConfigManager.getItem(Hero_starCfg, (item: Hero_starCfg) => {
                    if (item.career_lv >= careerCfg.career_lv) {
                        return true;
                    }
                    return false;
                })
                let lvNum = this.model.minLevel
                let starNum = starCfg.star
                if (starCfg.star > maxCareerLv.star) {
                    lvNum = maxCareerCfg.hero_lv
                    starNum = maxCareerLv.star
                }
                if (starCfg) {
                    this.levelTip.string = StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP9"), starCfg.star, lvNum)//'提升至{0}星，英雄可以升级至{1}级'
                }
            }
        }
    }
    /**更新星星数量 */
    _updateStar() {
        let starNum = this.heroInfo.star;
        if (starNum >= 12 && this.maxStarNode) {
            this.starLab.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (starNum - 11) + ''
        } else {
            this.starLab.node.active = true;
            this.maxStarNode ? this.maxStarNode.active = false : 0;
            let starTxt = "";
            if (starNum > 5) {
                starTxt = '1'.repeat(starNum - 5);
            }
            else {
                starTxt = '0'.repeat(starNum);
            }
            this.starLab.string = starTxt;
        }
    }

    onDisable() {
        //NetManager.targetOff(this);
    }
}
