import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureModel from '../model/NewAdventureModel';
import NewAdventureUtils from '../utils/NewAdventureUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { Adventure_hireCfg, Adventure2_themeheroCfg, HeroCfg } from '../../../a/config';
import { BagItem } from '../../../common/models/BagModel';


/** 
 * @Description: 角色英雄面板-选择面板子项
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-14 12:00:59
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdventureSetUpHeroItem2Ctrl")
export default class AdventureSetUpHeroItem2Ctrl extends UiListItem {

    @property(cc.Node)
    selectNode: cc.Node = null

    @property(cc.Node)
    isHeroNode: cc.Node = null

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

    @property(cc.Node)
    hireNode: cc.Node = null;

    @property(cc.Node)
    upNode: cc.Node = null;

    @property(cc.Label)
    hireLab: cc.Label = null;

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    heroInfo: icmsg.HeroInfo = null
    heroCfg: HeroCfg = null
    quality: number = 0

    updateView() {
        let item: BagItem = this.data.data;
        this.selectNode.active = this.data.isSelect;
        this.isHeroNode.active = this.data.isHero;;
        // if (!this.heroInfo || this.heroInfo.typeId != item.itemId) {
        //     let cfg = BagUtils.getConfigById(item.itemId);
        //     let icon = `icon/hero/${cfg.icon}`;
        //     GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        // }
        this.heroInfo = <icmsg.HeroInfo>item.extInfo;
        let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star, false)
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        let level = this.heroInfo.level || 1;
        this.lvLab.string = `${level}`;
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
        let type = Math.floor((<icmsg.HeroInfo>item.extInfo).soldierId / 100);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${this.heroInfo.color}`);
        this._updateStar();

        this.hireNode.active = false
        let info: icmsg.Adventure2Hero = NewAdventureUtils.getHireHero(item.series)
        if (info.type == 1) {
            this.hireNode.active = true
            let hireCfg = ConfigManager.getItemByField(Adventure_hireCfg, "group", info.group, { hero: info.typeId })
            let hireTime = hireCfg.hire_times
            let leftTime = hireTime - info.useTimes > 0 ? hireTime - info.useTimes : 0
            this.hireLab.string = `${leftTime}`
        }

        let recommendIds = []
        let themeheroCfg = ConfigManager.getItemByField(Adventure2_themeheroCfg, "type", NewAdventureUtils.actRewardType, { difficulty: this.adventureModel.difficulty })
        let strs = themeheroCfg.theme_hero.split('|');
        for (let i = 0; i < strs.length; i++) {
            let heroId = Number(strs[i].split(';')[0]);
            recommendIds.push(heroId)
        }
        this.upNode.active = false
        if (recommendIds.indexOf(this.heroInfo.typeId) != -1) {
            this.upNode.active = true
        }
    }

    _itemSelect() {
        this.selectNode.active = this.data.isSelect;
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
