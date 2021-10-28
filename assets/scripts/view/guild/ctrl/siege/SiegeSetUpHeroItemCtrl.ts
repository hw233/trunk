import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import ResonatingModel from '../../../resonating/model/ResonatingModel';
import SiegeModel from './SiegeModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import { BagItem } from '../../../../common/models/BagModel';
import { HeroCfg } from '../../../../a/config';

/** 
 * @Description: 角色英雄面板-选择面板子项
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-30 13:51:58
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/siege/SiegeSetUpHeroItemCtrl")
export default class SiegeSetUpHeroItemCtrl extends UiListItem {

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
    upNode: cc.Node = null;

    heroInfo: icmsg.HeroInfo = null
    heroCfg: HeroCfg = null
    quality: number = 0

    get siegeModel() { return ModelManager.get(SiegeModel); }

    updateView() {
        let item: BagItem = this.data.data;
        this.selectNode.active = this.data.isSelect;
        this.isHeroNode.active = this.data.isHero;
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
        //设置等级颜色
        let resonatingModel = ModelManager.get(ResonatingModel)
        let temState = resonatingModel.getHeroInUpList(this.heroInfo.heroId)
        this.lvLab.node.color = temState ? cc.color('#43FDFF') : cc.color('#FFFFFF')
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
        //let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.heroInfo.careerId).career_type;
        let type = Math.floor((<icmsg.HeroInfo>item.extInfo).soldierId / 100);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${this.heroInfo.color}`);
        this._updateStar();

        this.upNode.active = false
        let curSiegeCfg = this.siegeModel.curSiegeCfg
        if (curSiegeCfg && curSiegeCfg.camp_type.length > 0 && curSiegeCfg.camp_type.indexOf(this.heroCfg.group[0]) != -1) {
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
