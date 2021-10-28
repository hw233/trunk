import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import ResonatingModel from '../../../resonating/model/ResonatingModel';
import ResonatingUtils from '../../../resonating/utils/ResonatingUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { BagItem } from '../../../../common/models/BagModel';
import { HeroCfg } from '../../../../a/config';

/** 
 * @Description: 角色英雄面板-选择面板子项
 * @Author: weiliang.huang  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-08 14:29:26
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/selector/RoleHeroItemCtrl2")
export default class RoleHeroItemCtrl2 extends UiListItem {

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

    @property(cc.Node)
    redPoint: cc.Node = null

    @property(cc.Node)
    heroUp: cc.Node = null;

    @property(cc.Node)
    mercenary: cc.Node = null;

    @property(cc.Node)
    heroAwake: cc.Node = null;

    heroInfo: icmsg.HeroInfo = null
    heroCfg: HeroCfg = null
    quality: number = 0
    get model(): HeroModel { return ModelManager.get(HeroModel); }
    upHeros: number[];
    isHeroAwake: boolean = false;
    updateView() {
        let item: BagItem = this.data.data;
        this.upHeros = this.data.heros;
        this.selectNode.active = this.data.isSelect;
        // if (!this.heroInfo || this.heroInfo.typeId != item.itemId) {
        //     let cfg = BagUtils.getConfigById(item.itemId);
        //     let icon = `icon/hero/${cfg.icon}`;
        //     GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        // }
        this.heroInfo = <icmsg.HeroInfo>item.extInfo;
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);

        let level = this.heroInfo.level || 1;
        this.lvLab.string = `${level}`;

        let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star, false)
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);


        //设置等级颜色
        let resonatingModel = ModelManager.get(ResonatingModel)
        let temState = resonatingModel.getHeroInUpList(this.heroInfo.heroId)
        let linkingMystic = this.heroCfg.group[0] == 6 && this.heroInfo.mysticLink > 0;
        this.lvLab.node.color = temState || linkingMystic ? cc.color('#43FDFF') : cc.color('#FFFFFF')
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
        //let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.heroInfo.careerId).career_type;
        let type = Math.floor((<icmsg.HeroInfo>item.extInfo).soldierId / 100);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${this.heroInfo.color}`);
        this._updateStar();
        if (this.heroUp) {
            this.heroUp.active = false;
            //let upData = this.model.PveUpHeroList;//GlobalUtil.getLocal('Role_setUpHero_pve')
            if (this.upHeros.indexOf(item.series) >= 0) {
                this.heroUp.active = true;
                GlobalUtil.setSpriteIcon(this.node, this.heroUp, 'view/role/texture/select/yx_zhanxiaozi');
            }
            else if (ResonatingUtils.isHeroInAssistAllianceList(item.series)) {
                this.heroUp.active = true;
                GlobalUtil.setSpriteIcon(this.node, this.heroUp, 'view/role/texture/select/xzlm_lian');
            }
        }
        //雇佣兵标志
        if (this.mercenary) {
            this.mercenary.active = item.series > 600000
        }
        //英雄觉醒标志
        if (this.heroAwake) {
            this.heroAwake.active = this.isHeroAwake;
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

    /** 红点判断逻辑 */
    redPointHandle(): boolean {
        if (!this.heroInfo || !this.heroUp.active) return false;
        // this.upFlag.active = RedPointUtils.is_can_job_up_and_can_get_item(this.heroInfo)//RedPointUtils.is_can_job_up_ignore_material(this.heroInfo)
        return RedPointUtils.is_can_hero_opration(this.heroInfo);
    }
    //上阵英雄红点
    redPointUpHero(): boolean {
        if (!this.heroInfo) return false;
        //当同类型的英雄有更高星星时显示红点
        let datas: BagItem[] = this.model.heroInfos;
        let res = false
        datas.some(data => {
            let info = <icmsg.HeroInfo>data.extInfo;
            let type1 = Math.floor(info.soldierId / 100);
            let type2 = Math.floor(this.data.data.extInfo.soldierId / 100)
            let up = false;
            if (this.upHeros && this.upHeros.indexOf(data.itemId) >= 0) {
                up = true;
            }
            if (type1 == type2 && !up && info.star > this.data.data.extInfo.star) {
                res = true;
                return true;
            }
        })
        return res;
    }
}
