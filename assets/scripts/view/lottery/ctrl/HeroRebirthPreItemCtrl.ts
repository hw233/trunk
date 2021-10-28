
/** 
 * @Description: 英雄重生预览界面Item
 * @Author: weiliang.huang  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-25 17:03:41
 */

import { HeroCfg, Hero_starCfg } from "../../../a/config";
import ConfigManager from "../../../common/managers/ConfigManager";
import ModelManager from "../../../common/managers/ModelManager";
import HeroModel from "../../../common/models/HeroModel";
import GlobalUtil from "../../../common/utils/GlobalUtil";
import HeroUtils from "../../../common/utils/HeroUtils";
import UiListItem from "../../../common/widgets/UiListItem";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroRebirthPreItemCtrl")
export default class HeroRebirthPreItemCtrl extends UiListItem {

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


    heroInfo: { cfg: HeroCfg, star: number }
    heroCfg: HeroCfg = null
    quality: number = 0

    get model(): HeroModel { return ModelManager.get(HeroModel); }

    updateView() {
        this.heroInfo = this.data;
        this.heroCfg = this.data.cfg;
        let icon = HeroUtils.getHeroHeadIcon(this.heroCfg.id, this.heroInfo.star, false)
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
        let type = Math.floor(this.heroCfg.soldier_id[0] / 100);
        let heroStarCfg = ConfigManager.getItemByField(Hero_starCfg, 'star', this.heroInfo.star);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${heroStarCfg.color}`);
        this._updateStar();

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

    // update (dt) {}
}
