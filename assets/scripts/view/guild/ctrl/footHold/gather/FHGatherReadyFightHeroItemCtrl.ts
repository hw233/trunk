import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { Hero_starCfg, HeroCfg } from '../../../../../a/config';
/**
 * @Description: 个人名片-英雄子项
 * @Author: yaozu.hu
 * @Date: 2021-02-01 16:39:37
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:54:55
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/gather/FHGatherReadyFightHeroItemCtrl")
export default class FHGatherReadyFightHeroItemCtrl extends UiListItem {

    @property(cc.Sprite)
    colorBg: cc.Sprite = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Sprite)
    heroIcon: cc.Sprite = null;

    @property(cc.Sprite)
    soldierIcon: cc.Sprite = null;
    @property(cc.Sprite)
    groupIcon: cc.Sprite = null;


    @property(cc.Label)
    starLabel: cc.Label = null;

    _info: icmsg.FightHero

    updateView() {
        this._info = this.data.hero
        let cfg = ConfigManager.getItemById(HeroCfg, this._info.heroType)
        if (!cfg) {
            this.colorBg.node.active = false
        } else {
            this.colorBg.node.active = true
            let starCfg = ConfigManager.getItemById(Hero_starCfg, this._info.heroStar)
            let path = `common/texture/role/select/quality_bg_0${starCfg.color}`
            GlobalUtil.setSpriteIcon(this.node, this.colorBg, path)
        }

        let icon = HeroUtils.getHeroHeadIcon(this._info.heroType, this._info.heroStar, false)//`icon/hero/${cfg.icon}`
        GlobalUtil.setSpriteIcon(this.node, this.heroIcon, icon)
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${cfg.group[0]}`);
        icon = GlobalUtil.getSoldierTypeIcon(this._info.soldier.soldierId)
        GlobalUtil.setSpriteIcon(this.node, this.soldierIcon, icon)

        this.lvLabel.string = this._info.heroLv + "";

        let starNum = this._info.heroStar;
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