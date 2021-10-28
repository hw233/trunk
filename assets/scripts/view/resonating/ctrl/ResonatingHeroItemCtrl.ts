import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import ResonatingModel from '../model/ResonatingModel';
import RoleModel from '../../../common/models/RoleModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import {
    GlobalCfg,
    Hero_careerCfg,
    Hero_crystalCfg,
    Hero_starCfg,
    HeroCfg
    } from '../../../a/config';



/** 
 * @Description: 共鸣水晶英雄Item
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:58:26
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class ResonatingHeroItemCtrl extends UiListItem {

    // @property(cc.Node)
    // selectNode: cc.Node = null

    @property(cc.Node)
    heroNode: cc.Node = null;
    @property(cc.Node)
    addNode: cc.Node = null;
    @property(cc.Node)
    timeNode: cc.Node = null;
    @property(cc.Node)
    lockNode: cc.Node = null;
    @property(cc.Label)
    lockLb: cc.Label = null;
    @property(cc.Node)
    lockSp1: cc.Node = null;
    @property(cc.Node)
    lockSp2: cc.Node = null;
    @property(cc.Label)
    timeLb: cc.Label = null;

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
    redNode: cc.Node = null

    heroInfo: icmsg.HeroInfo = null
    heroCfg: HeroCfg = null
    quality: number = 0
    get model(): HeroModel { return ModelManager.get(HeroModel); }
    get resonatingModel(): ResonatingModel { return ModelManager.get(ResonatingModel); }
    //state:1可上阵英雄 2已上阵英雄 3冷却中 4可解锁 5不能解锁
    info: { heroInfo: icmsg.HeroInfo, state: number, index: number, offTime: number, herolv: number, newherolv: number }
    refreshTime = 0;
    addTime = 0;
    updateView() {
        this.info = this.data;
        GlobalUtil.setAllNodeGray(this.node, 0);
        switch (this.info.state) {
            case 1:
                this.heroNode.active = false;
                this.addNode.active = true;
                this.timeNode.active = false;
                this.lockNode.active = false;
                break;
            case 2:
                this.heroNode.active = true;
                this.addNode.active = false;
                this.timeNode.active = false;
                this.lockNode.active = false;
                this.heroInfo = this.data.heroInfo;
                let cfg = BagUtils.getConfigById(this.heroInfo.typeId);
                let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star, false)//`icon/hero/${cfg.icon}`;
                GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
                //let level = this.heroInfo.level || 1;
                this.lvLab.string = `${this.info.newherolv}`;
                this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
                GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
                //let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.heroInfo.careerId).career_type;
                let type = Math.floor(this.heroInfo.soldierId / 100);
                GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
                GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${this.heroInfo.color}`);
                this._updateStar();
                this.redNode.active = false;//this.info.newherolv < this.resonatingModel.minLevel;
                if (this.info.newherolv < this.resonatingModel.minLevel) {
                    let heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
                    let maxCareerLv = ConfigManager.getItemByField(Hero_starCfg, 'star', heroCfg.star_max);
                    let maxCareerCfg = ConfigManager.getItem(Hero_careerCfg, (item: Hero_careerCfg) => {
                        if (item.career_id == this.heroInfo.careerId && maxCareerLv.career_lv == item.career_lv) {
                            return true;
                        }
                        return false;
                    })
                    if (this.info.newherolv == maxCareerCfg.hero_lv) {
                        return;
                    }
                    this.redNode.active = true;
                }

                break;
            case 3:
                this.heroNode.active = false;
                this.addNode.active = false;
                this.timeNode.active = true;
                this.lockNode.active = false;
                this.addTime = ConfigManager.getItemByField(GlobalCfg, 'key', 'crystal_cd').value[0]
                let curTime = Math.floor(GlobalUtil.getServerTime() / 1000);
                let tem = (this.info.offTime + this.addTime) - curTime
                this.timeLb.string = TimerUtils.format2(tem);
                this.refreshTime = 1;
                break;
            case 4:
                this.heroNode.active = false;
                this.addNode.active = false;
                this.timeNode.active = false;
                this.lockNode.active = true;
                this.lockSp1.active = true;
                this.lockSp2.active = false;
                let roleModel = ModelManager.get(RoleModel)
                let temCfg = ConfigManager.getItemById(Hero_crystalCfg, this.info.index + 1)
                this.lockLb.node.active = roleModel.level < temCfg.level
                this.lockLb.string = temCfg.level + gdk.i18n.t("i18n:RESONATING_TIP1");//'级可解锁'
                break;
            case 5:
                this.heroNode.active = false;
                this.addNode.active = false;
                this.timeNode.active = false;
                this.lockNode.active = true;
                this.lockSp1.active = false;
                this.lockSp2.active = true;
                this.lockLb.node.active = false;
                GlobalUtil.setAllNodeGray(this.node, 1);
                break;
        }

    }

    update(dt: number) {
        if (this.info.state == 3) {
            this.refreshTime -= dt;
            if (this.refreshTime < 0) {
                this.refreshTime = 1;
                let curTime = Math.floor(GlobalUtil.getServerTime() / 1000);
                let tem = (this.info.offTime + this.addTime) - curTime
                if (tem <= 0) {
                    this.data.state = 1;
                    this.updateView()
                    return;
                }
                this.timeLb.string = TimerUtils.format2(tem);
            }
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
