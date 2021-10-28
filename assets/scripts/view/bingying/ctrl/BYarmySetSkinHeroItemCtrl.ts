import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { Hero_careerCfg, Hero_starCfg, HeroCfg } from '../../../a/config';





/** 
 * @Description: 兵营-兵团精甲穿戴Item
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:54:13
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYarmySetSkinHeroItemCtrl")
export default class BYarmySetSkinHeroItemCtrl extends UiListItem {

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.Sprite)
    colorBg: cc.Sprite = null;

    @property(cc.Label)
    lvLb: cc.Label = null;
    @property(cc.Label)
    starLb: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;

    @property(cc.Node)
    state1: cc.Node = null; //已选中
    @property(cc.Node)
    state2: cc.Node = null; //穿戴了其他精甲


    heroInfo: icmsg.HeroInfo = null;
    state: number = 0; //0 未选择 1已选择 2选择其他

    updateView() {
        this.heroInfo = this.data.heroInfo;
        this.state = this.data.state;
        let level = this.heroInfo.level || 1;
        this.lvLb.string = `${level}`;

        let heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId)
        let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star, false)
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${heroCfg.group[0]}`);
        let temCareerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.heroInfo.careerId)
        let type = temCareerCfg.career_type
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, 'star', this.heroInfo.star);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${starCfg.color}`);
        this._updateStar()
        this.state1.active = this.state == 1;
        this.state2.active = this.state == 2;

    }

    /**更新星星数量 */
    _updateStar() {
        let starNum = this.heroInfo.star;
        if (starNum >= 12 && this.maxStarNode) {
            this.starLb.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (starNum - 11) + ''
        } else {
            this.starLb.node.active = true;
            this.maxStarNode ? this.maxStarNode.active = false : 0;
            let starTxt = "";
            if (starNum > 5) {
                starTxt = '1'.repeat(starNum - 5);
            }
            else {
                starTxt = '0'.repeat(starNum);
            }
            this.starLb.string = starTxt;
        }
    }
    // update (dt) {}
}
