import { HeroCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import { BagItem } from '../../../../common/models/BagModel';
import HeroModel from '../../../../common/models/HeroModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import ResonatingModel from '../../../resonating/model/ResonatingModel';
import ResonatingUtils from '../../../resonating/utils/ResonatingUtils';

/** 
 * @Description: 角色英雄面板-选择面板子项
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-24 09:57:58
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/selector/RoleSetUpHeroItemCtrl")
export default class RoleSetUpHeroItemCtrl extends UiListItem {

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
    redPoint: cc.Node = null

    @property(cc.Node)
    recommendNode: cc.Node = null;

    @property(cc.Node)
    mercenary: cc.Node = null;

    @property(cc.Node)
    upNode: cc.Node = null;

    @property(cc.Node)
    heroAwake: cc.Node = null;

    @property(cc.Node)
    mysticLink: cc.Node = null;

    @property(cc.Node)
    royalNum: cc.Node = null;

    heroInfo: icmsg.HeroInfo = null
    heroCfg: HeroCfg = null
    quality: number = 0

    get model(): HeroModel { return ModelManager.get(HeroModel); }
    updateView() {
        let item: BagItem = this.data.data;
        this.selectNode.active = this.data.isSelect;
        this.isHeroNode.active = this.data.isHero;
        this.recommendNode.active = this.data.ordealHero ? this.data.ordealHero : false;

        if (this.royalNum) {
            if (this.data.royalNum > 0) {
                let temHeroList = [];
                if (this.data.royalNum == 1) {
                    temHeroList = GlobalUtil.getLocal('Royal_setUpHero_atk')
                } else if (this.data.royalNum == 2) {
                    temHeroList = this.model.curUpHeroList(8)
                }
                let index = temHeroList.indexOf(item.series);
                if (index >= 0) {
                    let path = 'view/role/texture/select/hjjjc_tidui' + (Math.floor(index / 3) + 1);
                    GlobalUtil.setSpriteIcon(this.node, this.royalNum, path)
                    this.royalNum.active = true;
                } else {
                    this.royalNum.active = false;
                }
            } else {
                this.royalNum.active = false;
            }
        }
        // if (!this.heroInfo || this.heroInfo.typeId != item.itemId) {
        //     let cfg = BagUtils.getConfigById(item.itemId);
        //     let icon = `icon/hero/${cfg.icon}`;
        //     GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        // }
        this.heroInfo = <icmsg.HeroInfo>item.extInfo;
        let level = this.heroInfo.level || 1;
        this.lvLab.string = `${level}`;

        let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star, false)
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);

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
        if (this.mercenary) {
            this.mercenary.active = item.series > 600000
        }
        let b = ResonatingUtils.isHeroInAssistAllianceList(item.series);
        this.upNode.active = b;
        GlobalUtil.setAllNodeGray(this.node, b ? 1 : 0);
        if (this.heroAwake) {
            this.heroAwake.active = this.data.isHeroAwake ? this.data.isHeroAwake : false;
        }

        //基因链接
        let islink = this.heroInfo.mysticLink > 0 && this.heroCfg.group[0] !== 6;
        this.mysticLink.active = islink;
        if (this.mysticLink.active) {
            this.mysticLink.opacity = 255 * 0.55;
            this.mysticLink.runAction(cc.repeatForever(
                cc.sequence(
                    cc.fadeTo(.3, 255 * 0.9),
                    cc.delayTime(1),
                    cc.fadeTo(.3, 255 * 0.55),
                    cc.delayTime(5)
                )
            ))
        }

        // GlobalUtil.setAllNodeGray(this.node, islink ? 1 : 0);
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

    /** 红点判断逻辑 */
    redPointHandle(): boolean {
        if (!this.heroInfo) return false;
        // this.upFlag.active = RedPointUtils.is_can_job_up_and_can_get_item(this.heroInfo)//RedPointUtils.is_can_job_up_ignore_material(this.heroInfo)
        return false//RedPointUtils.is_can_hero_opration(this.heroInfo);
    }

    // redPointUpHero(): boolean {
    //     if (!this.heroInfo) return false;

    //     return false;
    // }
}
