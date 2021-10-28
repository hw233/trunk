import { Activity_mystery_enterCfg, Copy_stageCfg, HeroCfg, Hero_starCfg } from "../../../../a/config";
import ConfigManager from "../../../../common/managers/ConfigManager";
import ModelManager from "../../../../common/managers/ModelManager";
import GlobalUtil from "../../../../common/utils/GlobalUtil";
import HeroUtils from "../../../../common/utils/HeroUtils";
import JumpUtils from "../../../../common/utils/JumpUtils";
import TimerUtils from "../../../../common/utils/TimerUtils";
import PanelId from "../../../../configs/ids/PanelId";
import HeroDetailViewCtrl from "../../../lottery/ctrl/HeroDetailViewCtrl";
import { ActivityEventId } from "../../enum/ActivityEventId";
import ActivityModel from "../../model/ActivityModel";
import ActUtil from "../../util/ActUtil";



/**
 * enemy神秘者活动界面
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-08-04 10:26:10
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/MysteryViewCtrl")
export default class MysteryViewCtrl extends gdk.BasePanel {

    @property(cc.Sprite)
    heroSp: cc.Sprite = null;

    @property(cc.Sprite)
    heroNameSp: cc.Sprite = null;

    @property(cc.Node)
    heroNode1: cc.Node = null;
    @property(cc.Node)
    heroNode2: cc.Node = null;

    @property(cc.Node)
    btnTipNode: cc.Node = null;
    @property(cc.Label)
    btnTipLb: cc.Label = null;

    @property(cc.Label)
    btnLb1: cc.Label = null;

    @property(cc.Label)
    btnLb2: cc.Label = null;

    @property(cc.Label)
    timeLb: cc.Label = null;

    @property(sp.Skeleton)
    lineSpine: sp.Skeleton = null;

    copyState: boolean = false;
    rewardState: boolean = false;

    actId: number = 131;

    actRewardType: number = 1;

    stageCfg: Copy_stageCfg;
    actinfoCfg: Activity_mystery_enterCfg;

    get activityModel() { return ModelManager.get(ActivityModel); }


    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v !== 0) {
            return;
        }
        this._leftTime = Math.max(0, v);
        if (this._leftTime == 0) {
            // this.close();
            gdk.panel.hide(PanelId.MysteryVisitorActivityMainView);
            return;
        }
        else {
            this.timeLb.string = TimerUtils.format1(this.leftTime / 1000);
        }
    }

    onEnable() {

        if (!ActUtil.ifActOpen(this.actId)) {
            this.close()
            return
        }
        this.actRewardType = ActUtil.getActRewardType(this.actId)

        this.stageCfg = ConfigManager.getItemByField(Copy_stageCfg, 'copy_id', 28, { 'order': this.actRewardType });
        if (!this.stageCfg) {
            //cc.log('活动关卡配置有问题，请检查配置-->' + this.actRewardType)
            this.close()
            return
        }
        this.actinfoCfg = ConfigManager.getItemByField(Activity_mystery_enterCfg, 'reward_type', this.actRewardType)

        this._updateTime();

        GlobalUtil.setSpriteIcon(this.node, this.heroSp, 'view/act/texture/bg/' + this.actinfoCfg.background)
        GlobalUtil.setSpriteIcon(this.node, this.heroNameSp, 'view/act/texture/mystery/' + this.actinfoCfg.name)

        this.setHeroItemData();
        this.copyState = this.stageCfg.id == this.activityModel.mysterypassStageId;

        this.rewardState = !!HeroUtils.getHeroItemById(this.actinfoCfg.hero_id)

        if (!this.copyState) {
            this.btnLb1.string = gdk.i18n.t("i18n:MYSTERY_TIP1")//'神秘之战';
            this.btnTipLb.string = this.stageCfg.first_reward[0][1] + '';
            this.btnTipNode.active = true;
            GlobalUtil.setAllNodeGray(this.btnLb1.node.parent, 0)
        } else {
            this.btnLb1.string = gdk.i18n.t("i18n:MYSTERY_TIP2")//'已通关';
            this.btnTipNode.active = false;
            GlobalUtil.setAllNodeGray(this.btnLb1.node.parent, 1)
        }

        if (!this.rewardState) {
            this.btnLb2.string = gdk.i18n.t("i18n:MYSTERY_TIP3")//'前往获取';
            GlobalUtil.setAllNodeGray(this.btnLb2.node.parent, 0)
        } else {
            this.btnLb2.string = gdk.i18n.t("i18n:MYSTERY_TIP4")//'已获取';
            GlobalUtil.setAllNodeGray(this.btnLb2.node.parent, 1)
        }

    }

    _dtime: number = 0;
    update(dt: number) {
        if (!this.leftTime) {
            return;
        }
        if (this._dtime >= 1) {
            this._dtime = 0;
            this._updateTime();
        }
        else {
            this._dtime += dt;
        }
    }

    _updateTime() {
        let curTime = GlobalUtil.getServerTime();
        let ct = ActUtil.getActEndTime(this.actId)
        this.leftTime = ct - curTime;

    }

    setHeroItemData() {
        //1.显示英雄1
        this.heroNode1.active = true;
        this.heroNode2.active = true;
        let heroCfg = ConfigManager.getItemById(HeroCfg, this.actinfoCfg.hero_id);
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, 'star', heroCfg.star_min)
        let tem1Data1 = { heroId: heroCfg.id, level: 1, star: heroCfg.star_min, color: starCfg.color, soldierId: heroCfg.soldier_id[0] };
        this.setHeroItemInfo(this.heroNode1, tem1Data1)

        //2.显示英雄2,改变英雄1信息
        //let data = HeroUtils.getMaxLevelHero()
        let data = HeroUtils.getMaxStarHeroInfo()
        let starCfg1 = ConfigManager.getItemByField(Hero_starCfg, 'star', data.star)
        let tem1Data2 = { heroId: data.typeId, level: data.level, star: data.star, color: starCfg1.color, soldierId: data.soldierId };
        this.setHeroItemInfo(this.heroNode2, tem1Data2)
        //3.播放特效
        this.lineSpine.setAnimation(1, 'stand2', false);
        this.lineSpine.setCompleteListener((trackEntry, loopCount) => {
            let name = trackEntry.animation ? trackEntry.animation.name : '';
            if (name === 'stand') {
                this.lineSpine.setAnimation(1, 'stand', true);
            }
            this.lineSpine.setCompleteListener(null);

            let tem1Data1 = { heroId: heroCfg.id, level: data.level, star: data.star, color: starCfg1.color, soldierId: heroCfg.soldier_id[0] };
            this.setHeroItemInfo(this.heroNode1, tem1Data1)
        })


    }

    //英雄预览
    heroDetailBtnCLick() {

        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let ctrl = node.getComponent(HeroDetailViewCtrl)
            let data = HeroUtils.getMaxStarHeroInfo()
            ctrl.mysticState = 0;
            ctrl.mysticLinkId = data.heroId;
            let heroCfg = ConfigManager.getItemByField(HeroCfg, 'id', this.actinfoCfg.hero_id)
            ctrl.initHeroInfo(heroCfg)
        })

    }

    //进入关卡按钮
    onBtn1Click() {
        if (!this.copyState) {
            JumpUtils.openInstancePvePanel(this.stageCfg.id)
            gdk.panel.hide(PanelId.MysteryVisitorActivityMainView);
        }
    }

    //获取英雄按钮
    onBtn2Click() {
        if (!this.rewardState) {
            gdk.e.emit(ActivityEventId.ACTIVITY_MYSTERY_HERO)
        }
    }

    setHeroItemInfo(heroNode: cc.Node, data: { heroId: number, level: number, star: number, color: number, soldierId: number }) {

        let lvLab = heroNode.getChildByName('lvLab').getComponent(cc.Label);
        let icon = heroNode.getChildByName('icon').getComponent(cc.Sprite);
        let colorBg = heroNode.getChildByName('colorBg').getComponent(cc.Sprite);
        let groupIcon = heroNode.getChildByName('groupIcon').getComponent(cc.Sprite);
        let careerIcon = heroNode.getChildByName('careerIcon').getComponent(cc.Sprite);
        let starLab = heroNode.getChildByName('starLabel').getComponent(cc.Label);
        let maxStarNode = heroNode.getChildByName('maxstar');
        let maxStarLb = maxStarNode.getChildByName('maxStarLb').getComponent(cc.Label);

        lvLab.string = `${data.level}`;
        let iconPath = HeroUtils.getHeroHeadIcon(data.heroId, data.star, false)
        GlobalUtil.setSpriteIcon(this.node, icon, iconPath);
        let heroCfg = ConfigManager.getItemById(HeroCfg, data.heroId);
        GlobalUtil.setSpriteIcon(this.node, groupIcon, `common/texture/role/select/group_${heroCfg.group[0]}`);

        let type = Math.floor(data.soldierId / 100);
        GlobalUtil.setSpriteIcon(this.node, careerIcon, `common/texture/role/select/career_${type}`);
        GlobalUtil.setSpriteIcon(this.node, colorBg, `common/texture/role/select/quality_bg_0${data.color}`);

        let starNum = data.star;
        if (starNum >= 12 && maxStarNode) {
            starLab.node.active = false;
            maxStarNode.active = true;
            maxStarLb.string = (starNum - 11) + ''
        } else {
            starLab.node.active = true;
            maxStarNode ? maxStarNode.active = false : 0;
            let starTxt = "";
            if (starNum > 5) {
                starTxt = '1'.repeat(starNum - 5);
            }
            else {
                starTxt = '0'.repeat(starNum);
            }
            starLab.string = starTxt;
        }
    }


    // update (dt) {}
}
