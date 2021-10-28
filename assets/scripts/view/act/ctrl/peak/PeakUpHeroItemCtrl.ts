import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import PeakHeroDetailViewCtrl from './PeakHeroDetailViewCtrl';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Hero_starCfg, HeroCfg } from '../../../../a/config';

/** 
 * @Description: 角色英雄面板-选择面板子项
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-09 17:19:21
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakUpHeroItemCtrl")
export default class PeakUpHeroItemCtrl extends UiListItem {

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


    heroInfo: icmsg.PeakHero = null
    heroCfg: HeroCfg = null
    quality: number = 0
    showInfo: boolean = false;
    //info:{heroData:icmsg.PeakHero,isSelect:boolean,isHero:boolean,ordealHero:boolean}
    updateView() {
        //let item: BagItem = this.data.heroData;
        this.heroInfo = this.data.heroData;
        this.selectNode.active = this.data.isSelect;
        this.isHeroNode.active = this.data.isHero;
        this.showInfo = this.data.showInfo
        if (this.recommendNode) {
            this.recommendNode.active = this.data.ordealHero ? this.data.ordealHero : false;
        }
        let cfg = BagUtils.getConfigById(this.heroInfo.typeId);
        let icon = `icon/hero/${cfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);

        let level = this.heroInfo.level || 1;
        this.lvLab.string = `${level}`;
        //设置等级颜色
        //let resonatingModel = ModelManager.get(ResonatingModel)
        //let temState = resonatingModel.getHeroInUpList(this.heroInfo.heroId)
        this.lvLab.node.color = cc.color('#FFFFFF')
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
        //let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.heroInfo.careerId).career_type;
        let type = this.heroInfo.careerType//Math.floor(this.heroInfo.soldierId / 100);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, 'star', this.heroInfo.star);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${starCfg.color}`);
        this._updateStar();
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

    showInfoClick() {
        if (this.showInfo) {
            gdk.panel.setArgs(PanelId.PeakHeroDetailView, 3);
            gdk.panel.open(PanelId.PeakHeroDetailView, (node: cc.Node) => {
                let comp = node.getComponent(PeakHeroDetailViewCtrl)
                comp.initHeroInfo(this.heroInfo.typeId, this.heroInfo.careerType, this.heroInfo.careerId)
            })
        }
    }
}
