import { HeroCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import HeroModel from '../../../common/models/HeroModel';
import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import ResonatingUtils from '../utils/ResonatingUtils';


/** 
 * @Description: 共鸣水晶英雄Item
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:58:32
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class ResonatingUpHeroItemCtrl extends UiListItem {

    @property(cc.Node)
    selectNode: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null;

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

    heroInfo: icmsg.HeroInfo = null
    heroCfg: HeroCfg = null
    quality: number = 0
    get model(): HeroModel { return ModelManager.get(HeroModel); }
    grayState: boolean = false;
    updateView() {
        this.heroInfo = this.data;
        this.grayState = ResonatingUtils.isHeroInAssistAllianceList(this.heroInfo.heroId)
        let cfg = BagUtils.getConfigById(this.heroInfo.typeId);
        let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star, false)//`icon/hero/${cfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        let level = this.heroInfo.level || 1;
        this.lvLab.string = `${level}`;
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
        //let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.heroInfo.careerId).career_type;
        let type = Math.floor(this.heroInfo.soldierId / 100);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${this.heroInfo.color}`);
        this._updateStar();
        GlobalUtil.setAllNodeGray(this.node, this.grayState ? 1 : 0)
    }

    _itemSelect() {
        if (!this.grayState) {
            this.selectNode.active = this.ifSelect;
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
}
