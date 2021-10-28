import { HeroCfg } from "../../../../../boot/configs/bconfig";
import { Activity_mysteriousCfg } from "../../../../a/config";
import ConfigManager from "../../../../common/managers/ConfigManager";
import ModelManager from "../../../../common/managers/ModelManager";
import NetManager from "../../../../common/managers/NetManager";
import BagUtils from "../../../../common/utils/BagUtils";
import GlobalUtil from "../../../../common/utils/GlobalUtil";
import HeroUtils from "../../../../common/utils/HeroUtils";
import StringUtils from "../../../../common/utils/StringUtils";
import UiSlotItem from "../../../../common/widgets/UiSlotItem";
import PanelId from "../../../../configs/ids/PanelId";
import HeroDetailViewCtrl from "../../../lottery/ctrl/HeroDetailViewCtrl";
import ActivityModel from "../../model/ActivityModel";
import ActUtil from "../../util/ActUtil";

/**
 * 灵力者集结
 * @Author: yaozu.hu
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-29 10:30:22
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mysteryVisitor/MysteryVisitorView1Ctrl")
export default class MysteryVisitorView1Ctrl extends gdk.BasePanel {

    @property(cc.Label)
    timeLb: cc.Label = null;

    @property(cc.Sprite)
    titleSp: cc.Sprite = null;


    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null;

    @property(cc.Sprite)
    bgSp: cc.Sprite = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    buyBtnNode: cc.Node = null;

    @property(cc.Label)
    buyBtnLabel: cc.Label = null;

    @property(cc.Node)
    buyBtnRed: cc.Node = null;

    actCfg: Activity_mysteriousCfg;
    heroCfg: HeroCfg;
    actId: number = 132
    maxPre: number = 0;

    // _leftTime: number;
    // get leftTime(): number { return this._leftTime; }
    // set leftTime(v: number) {
    //     if (!v && v !== 0) {
    //         return;
    //     }
    //     this._leftTime = Math.max(0, v);
    //     if (this._leftTime == 0) {
    //         // this.close();
    //         gdk.panel.hide(PanelId.MysteryVisitorActivityMainView);
    //         return;
    //     }
    //     else {
    //         this.timeLb.string = TimerUtils.format1(this.leftTime / 1000);
    //     }
    // }


    get activityModel() { return ModelManager.get(ActivityModel); }

    onEnable() {
        if (!ActUtil.ifActOpen(this.actId)) {
            return;
        }

        //设置活动时间
        let temStartTime = ActUtil.getActStartTime(this.actId)
        let temEndTime = ActUtil.getActEndTime(this.actId) - 5000
        let startTime = new Date(temStartTime);
        let endTime = new Date(temEndTime); //time为零点,减去5s 返回前一天
        this.timeLb.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;

        let actType = ActUtil.getActRewardType(this.actId);
        this.actCfg = ConfigManager.getItemByField(Activity_mysteriousCfg, 'type', actType, { 'index': 1 })
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.actCfg.hero);
        this.maxPre = this.actCfg.money;

        //设置背景图片
        let bgPath = 'view/act/texture/bg/' + this.actCfg.background;
        GlobalUtil.setSpriteIcon(this.node, this.bgSp, bgPath)
        //设置背景图片
        let titlePath = 'view/act/texture/mystery/' + this.actCfg.title;
        GlobalUtil.setSpriteIcon(this.node, this.titleSp, titlePath)


        //设置英雄模型
        this.heroSpine.node.scale = this.actCfg.scale / 100
        let heroPath = `spine/hero/${this.actCfg.model}/1/${this.actCfg.model}`
        GlobalUtil.setSpineData(this.node, this.heroSpine, heroPath, false, this.actCfg.action1, true);

        this._updateBuyBtnState();
        this._updateView()
    }

    // _dtime: number = 0;
    // update(dt: number) {
    //     if (!this.leftTime) {
    //         return;
    //     }
    //     if (this._dtime >= 1) {
    //         this._dtime = 0;
    //         this._updateTime();
    //     }
    //     else {
    //         this._dtime += dt;
    //     }
    // }

    // _updateTime() {
    //     let curTime = GlobalUtil.getServerTime();
    //     let ct = ActUtil.getActEndTime(this.actId)
    //     this.leftTime = ct - curTime;

    // }

    _updateView() {

        //刷新奖励物品
        this.content.removeAllChildren();
        this.actCfg.rewards.forEach(i => {
            let slot = cc.instantiate(this.slotPrefab);
            slot.parent = this.content;
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(i[0], i[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: i[0],
                itemNum: i[1],
                type: BagUtils.getItemTypeById(i[0]),
                extInfo: null
            };
        });
    }

    btnState: number = 0; //0 未达到 1可领取 2已领取
    @gdk.binding("activityModel.mysteryVisitorTotal")
    @gdk.binding("activityModel.mysteryVisitorState")
    _updateBuyBtnState() {
        let tem1 = this.activityModel.mysteryVisitorTotal
        let tem2 = this.activityModel.mysteryVisitorState;
        this.buyBtnRed.active = false;
        let state: 0 | 1 = 0
        if (tem1 >= this.maxPre) {
            if ((tem2 & 1 << 0) > 0) {
                this.buyBtnLabel.string = gdk.i18n.t("i18n:MYSTERY_TIP5")//`已领取`;
                this.btnState = 2;
                state = 1
            } else {
                this.buyBtnLabel.string = StringUtils.format(gdk.i18n.t("i18n:MYSTERY_TIP6"), this.heroCfg.name)//`召唤${this.heroCfg.name}`
                this.btnState = 1;
                this.buyBtnRed.active = true;
            }
        } else {
            this.buyBtnLabel.string = StringUtils.format(gdk.i18n.t("i18n:MYSTERY_TIP7"), this.maxPre, tem1, this.maxPre)//`累充${this.maxPre}元获得(${tem1}/${this.maxPre})`;
            this.btnState = 0;
        }
        GlobalUtil.setAllNodeGray(this.buyBtnNode, state)
    }

    buyBtnCLick() {
        if (this.btnState == 1) {
            let msg = new icmsg.ActivityMysteriousGainReq();
            msg.index = this.actCfg.index - 1;
            NetManager.send(msg, (rsp: icmsg.ActivityMysteriousGainRsp) => {
                GlobalUtil.openRewadrView(rsp.goodsInfo);
                this.activityModel.mysteryVisitorState = rsp.state;
            }, this)

        } else if (this.btnState == 0) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:MYSTERY_TIP8"), this.maxPre))//(`累充满${this.maxPre}可领取`)
        }
    }

    //英雄预览
    heroDetailBtnClick() {
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let ctrl = node.getComponent(HeroDetailViewCtrl)
            let data = HeroUtils.getMaxStarHeroInfo()
            ctrl.mysticState = 0;
            ctrl.mysticLinkId = data.heroId;
            let heroCfg = ConfigManager.getItemByField(HeroCfg, 'id', this.actCfg.hero)
            ctrl.initHeroInfo(heroCfg)
        })
    }

}
