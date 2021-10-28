import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import { Hero_starCfg, HeroCfg } from '../../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:54:59
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/guard/FHGuardHeroItemCtrl")
export default class FHGuardHeroItemCtrl extends cc.Component {

    @property(cc.Node)
    colorBg: cc.Node = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Node)
    heroIcon: cc.Node = null;

    @property(cc.Node)
    soldierIcon: cc.Node = null;

    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.Label)
    starLabel: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;

    updateView(hero: icmsg.HeroBrief) {
        let cfg = ConfigManager.getItemById(HeroCfg, hero.typeId)
        if (!cfg) {
            this.colorBg.active = false
        } else {
            this.colorBg.active = true
            let starCfg = ConfigManager.getItemById(Hero_starCfg, hero.star)
            let path = `common/texture/role/select/quality_bg_0${starCfg.color}`
            GlobalUtil.setSpriteIcon(this.node, this.colorBg, path)
        }

        let icon = HeroUtils.getHeroHeadIcon(hero.typeId, hero.star, false)//`icon/hero/${cfg.icon}`
        GlobalUtil.setSpriteIcon(this.node, this.heroIcon, icon)
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${cfg.group[0]}`);
        icon = GlobalUtil.getSoldierTypeIcon(hero.soldierId)
        GlobalUtil.setSpriteIcon(this.node, this.soldierIcon, icon)

        this.lvLabel.string = hero.level + "";

        let starNum = hero.star;
        if (starNum >= 12 && this.maxStarNode) {
            this.starLabel.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (starNum - 11) + ''
        } else {
            this.starLabel.node.active = true;
            this.maxStarNode ? this.maxStarNode.active = false : 0;
            let starTxt = "";
            if (starNum > 5) {
                starTxt = '1'.repeat(starNum - 5);
            }
            else {
                starTxt = '0'.repeat(starNum);
            }
            this.starLabel.string = starTxt;
        }
    }

    updateNullHero() {
        this.colorBg.active = false
        this.heroIcon.active = false
        this.groupIcon.active = false
        this.soldierIcon.active = false
        this.lvLabel.node.active = false
        this.starLabel.node.active = false
    }
}