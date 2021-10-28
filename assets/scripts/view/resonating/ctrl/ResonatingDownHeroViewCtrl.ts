import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import ResonatingModel from '../model/ResonatingModel';
import StringUtils from '../../../common/utils/StringUtils';
import { Hero_careerCfg, Hero_starCfg, HeroCfg } from '../../../a/config';
import { ResonatingEventId } from '../enum/ResonatingEventId';


/** 
 * @Description: 永恒水晶卸下英雄界面
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:58:19
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class ResonatingDownHeroView extends gdk.BasePanel {

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

    @property(cc.Label)
    lvLab2: cc.Label = null;

    @property(cc.Sprite)
    icon2: cc.Sprite = null;

    @property(cc.Label)
    starLab2: cc.Label = null;
    @property(cc.Node)
    maxStarNode2: cc.Node = null;
    @property(cc.Label)
    maxStarLb2: cc.Label = null;

    @property(cc.Node)
    careerIcon2: cc.Node = null;

    @property(cc.Node)
    groupIcon2: cc.Node = null;

    @property(cc.Sprite)
    colorBg2: cc.Sprite = null

    @property(cc.Node)
    openSp: cc.Node = null;
    @property(cc.Node)
    closeSp: cc.Node = null;
    @property(cc.RichText)
    levelTip: cc.RichText = null;

    heroInfo: icmsg.HeroInfo = null
    heroCfg: HeroCfg = null
    quality: number = 0;
    index: number = 0;
    get model(): ResonatingModel { return ModelManager.get(ResonatingModel); }

    onEnable() {
        //获取状态
        let state = GlobalUtil.getLocal('ResonatingDownState', true)
        let temState = state == null ? true : state;
        this.openSp.active = temState;
        this.closeSp.active = !temState;

        let arg = gdk.panel.getArgs(PanelId.ResonatingDownHeroView);
        let data = arg[0]
        this.heroInfo = data.heroInfo;
        this.index = data.index;
        let cfg = BagUtils.getConfigById(this.heroInfo.typeId);
        let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star, false)//`icon/hero/${cfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        GlobalUtil.setSpriteIcon(this.node, this.icon2, icon);
        let level = this.heroInfo.level || 1;
        this.lvLab.string = `${data.newherolv}`;
        this.lvLab2.string = `${data.herolv}`;
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
        //let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.heroInfo.careerId).career_type;
        let type = Math.floor(this.heroInfo.soldierId / 100);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${this.heroInfo.color}`);

        GlobalUtil.setSpriteIcon(this.node, this.groupIcon2, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon2, `common/texture/role/select/career_${type}`);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg2, `common/texture/role/select/quality_bg_0${this.heroInfo.color}`);
        this._updateStar();
        this.levelTip.node.parent.active = false;//data.heroLv < this.model.minLevel;

        if (data.newherolv < this.model.minLevel) {
            let heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
            let maxCareerLv = ConfigManager.getItemByField(Hero_starCfg, 'star', heroCfg.star_max);
            let maxCareerCfg = ConfigManager.getItem(Hero_careerCfg, (item: Hero_careerCfg) => {
                if (item.career_id == this.heroInfo.careerId && maxCareerLv.career_lv == item.career_lv) {
                    return true;
                }
                return false;
            })
            if (data.heroLv == maxCareerCfg.hero_lv) {
                return;
            }
            this.levelTip.node.parent.active = true;
            this.levelTip.string = ''
            let careerCfg = ConfigManager.getItem(Hero_careerCfg, (item: Hero_careerCfg) => {
                if (item.career_id == this.heroInfo.careerId && item.hero_lv >= this.model.minLevel) {
                    return true;
                }
                return false;
            })
            if (careerCfg) {
                let starCfg = ConfigManager.getItem(Hero_starCfg, (item: Hero_starCfg) => {
                    if (item.career_lv >= careerCfg.career_lv) {
                        return true;
                    }
                    return false;
                })
                let lvNum = this.model.minLevel
                let starNum = starCfg.star
                if (starCfg.star > maxCareerLv.star) {
                    lvNum = maxCareerCfg.hero_lv
                    starNum = maxCareerLv.star
                }
                if (starCfg) {
                    this.levelTip.string = StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP9"), starCfg.star, lvNum)//'提升至{0}星，英雄可以升级至{1}级'
                }
            }
        }
    }

    /**更新星星数量 */
    _updateStar() {
        let starNum = this.heroInfo.star;

        if (starNum >= 12 && this.maxStarNode) {
            this.starLab.node.active = false;
            this.starLab2.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (starNum - 11) + ''
            this.maxStarNode2.active = true;
            this.maxStarLb2.string = (starNum - 11) + ''
        } else {
            this.starLab.node.active = true;
            this.starLab2.node.active = true;
            this.maxStarNode ? this.maxStarNode.active = false : 0;
            this.maxStarNode2 ? this.maxStarNode2.active = false : 0;
            let starTxt = "";
            if (starNum > 5) {
                starTxt = '1'.repeat(starNum - 5);
            }
            else {
                starTxt = '0'.repeat(starNum);
            }
            this.starLab.string = starTxt;
            this.starLab2.string = starTxt;
        }

        // let starTxt = "";
        // if (starNum > 5) {
        //     starTxt = '1'.repeat(starNum - 5);
        // }
        // else {
        //     starTxt = '0'.repeat(starNum);
        // }
        // this.starLab.string = starTxt;
        // this.starLab2.string = starTxt;
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    downBtnClick() {
        //卸载当前选择的英雄
        let state = GlobalUtil.getLocal('ResonatingDownState', true)
        let temState = state == null ? true : state;

        let msg = new icmsg.ResonatingTakeOffReq()
        msg.gridId = this.index
        msg.isDrop = temState
        NetManager.send(msg, (resp: icmsg.ResonatingTakeOffRsp) => {

            let temData = new icmsg.ResonatingGrid()
            temData.heroId = 0
            temData.heroLv = 0
            temData.heroLv0 = 0
            temData.offTime = resp.grid.offTime
            this.model.Lower[resp.gridId] = temData;
            GlobalUtil.openRewadrView(resp.list);
            //更新英雄数据
            //let temMsg = new icmsg.HeroListReq()
            let msg = new icmsg.HeroInfoReq()
            msg.heroIds = [resp.grid.heroId];
            NetManager.send(msg)
            gdk.e.emit(ResonatingEventId.RESONATING_DATA_UPDATA);
            this.close()
        }, this)
    }

    stateBtnClick() {
        let state = GlobalUtil.getLocal('ResonatingDownState', true)
        let temState = state == null ? true : state;
        GlobalUtil.setLocal('ResonatingDownState', !temState, true)
        this.openSp.active = !temState;
        this.closeSp.active = temState;
    }
}
