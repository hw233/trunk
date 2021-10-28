import { Activity_mysteriousCfg, HeroCfg, ItemCfg } from "../../../../a/config";
import ConfigManager from "../../../../common/managers/ConfigManager";
import ModelManager from "../../../../common/managers/ModelManager";
import NetManager from "../../../../common/managers/NetManager";
import GlobalUtil from "../../../../common/utils/GlobalUtil";
import HeroUtils from "../../../../common/utils/HeroUtils";
import RewardPreviewCtrl from "../../../../common/widgets/RewardPreviewCtrl";
import UiSlotItem from "../../../../common/widgets/UiSlotItem";
import PanelId from "../../../../configs/ids/PanelId";
import HeroDetailViewCtrl from "../../../lottery/ctrl/HeroDetailViewCtrl";
import ActivityModel from "../../model/ActivityModel";
import ActUtil from "../../util/ActUtil";

/**
 * 修炼进度
 * @Author: yaozu.hu
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-29 10:30:22
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mysteryVisitor/MysteryVisitorView1Ctrl")
export default class MysteryVisitorView2Ctrl extends gdk.BasePanel {

    @property(cc.Label)
    timeLb: cc.Label = null;


    @property(cc.Sprite)
    titleSp: cc.Sprite = null;

    @property(sp.Skeleton)
    bgSpine: sp.Skeleton = null;

    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null;

    @property(cc.Sprite)
    bgSp: cc.Sprite = null;

    @property(cc.Label)
    jinduLb: cc.Label = null;

    @property(cc.Node)
    jindu: cc.Node = null;

    @property(cc.Node)
    itemNode: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;


    actCfgs: Activity_mysteriousCfg[];
    actId: number = 132

    jinduMaxW = 520;
    minPre: number = 0;
    showHero: number = 0;
    get activityModel() { return ModelManager.get(ActivityModel); }

    showActCfg: Activity_mysteriousCfg;
    onEnable() {
        if (!ActUtil.ifActOpen(this.actId)) {
            gdk.panel.hide(PanelId.MysteryVisitorActivityMainView)
            return;
        }

        //设置活动时间
        let temStartTime = ActUtil.getActStartTime(this.actId)
        let temEndTime = ActUtil.getActEndTime(this.actId) - 5000
        let startTime = new Date(temStartTime);
        let endTime = new Date(temEndTime); //time为零点,减去5s 返回前一天
        this.timeLb.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;


        let actType = ActUtil.getActRewardType(this.actId);
        this.actCfgs = ConfigManager.getItems(Activity_mysteriousCfg, (cfg: Activity_mysteriousCfg) => {
            if (cfg.type == actType && cfg.index > 1) {
                return true;
            }
        })
        this.showActCfg = this.actCfgs[0]

        //设置背景图片
        let bgPath = 'view/act/texture/bg/' + this.showActCfg.background;
        GlobalUtil.setSpriteIcon(this.node, this.bgSp, bgPath)
        //设置背景图片
        let titlePath = 'view/act/texture/mystery/' + this.showActCfg.title;
        GlobalUtil.setSpriteIcon(this.node, this.titleSp, titlePath)

        //英雄背景特效
        this.bgSpine.setAnimation(1, this.showActCfg.animation, true);
        //设置英雄模型
        this.heroSpine.node.scale = this.showActCfg.scale / 100
        let heroPath = `spine/hero/${this.showActCfg.model}/1/${this.showActCfg.model}`
        GlobalUtil.setSpineData(this.node, this.heroSpine, heroPath, false, this.showActCfg.action2, false, false, (spine: sp.Skeleton) => {

            spine.setCompleteListener((trackEntry, loopCount) => {
                let name = trackEntry.animation ? trackEntry.animation.name : '';
                if (name === this.showActCfg.action2) {
                    this.heroSpine.setAnimation(1, this.showActCfg.action3, true);
                }
                spine.setCompleteListener(null);
            })
        });

        let temCfg = ConfigManager.getItemByField(Activity_mysteriousCfg, 'type', actType, { 'index': 1 })
        this.minPre = temCfg.money;
        this.showHero = temCfg.hero;

        this._initItemsData()
        this._updateItemsState()

    }
    // update (dt) {}

    onDisable() {
        NetManager.targetOff(this)
        gdk.Timer.clearAll(this)
    }

    allItems: cc.Node[] = []

    _initItemsData() {
        this.allItems = []
        this.itemNode.removeAllChildren();
        for (let i = 0, n = this.actCfgs.length; i < n; i++) {
            let node = cc.instantiate(this.itemPre);
            let x = (this.jinduMaxW / n) * (i + 1);
            let y = 22;
            node.setPosition(cc.v2(x, y));
            node.setParent(this.itemNode);
            this.allItems.push(node);
            let slot = node.getChildByName('UiSlotItem')
            let slotBtn = slot.getComponent(cc.Button);
            var eventHandler = new cc.Component.EventHandler();
            let itemCfg = ConfigManager.getItemById(ItemCfg, this.actCfgs[i].icon)
            let icon_pzgty = slot.getChildByName('icon_pzgty').getComponent(cc.Animation);
            let icon_pzgzi = slot.getChildByName('icon_pzgzi').getComponent(cc.Animation);
            let icon_pzgjin = slot.getChildByName('icon_pzgjin').getComponent(cc.Animation);
            icon_pzgty.node.active = false;
            icon_pzgzi.node.active = false;
            icon_pzgjin.node.active = false;
            if (itemCfg.effects != '') {
                if (itemCfg.color != 3 && itemCfg.color != 4) {
                    icon_pzgty.node.active = true
                    icon_pzgty.play()
                } else if (itemCfg.color == 3) {
                    icon_pzgzi.node.active = true
                    icon_pzgzi.play()
                } else {
                    icon_pzgjin.node.active = true
                    icon_pzgjin.play()
                }
            }
            eventHandler.target = this.node;
            eventHandler.component = "MysteryVisitorView2Ctrl";
            eventHandler.handler = "itemClick";
            eventHandler.customEventData = i + ''
            slotBtn.clickEvents[0] = eventHandler;

        }
    }

    _updateItemsState() {

        let tem = this.minPre;
        let pw = this.jinduMaxW / this.allItems.length
        let temW = 0;
        let n = this.actCfgs.length
        this.allItems.forEach((node, i) => {
            let score = node.getChildByName('score').getComponent(cc.Label);
            let slot = node.getChildByName('UiSlotItem');
            let redPoint = node.getChildByName('RedPoint');
            let cfg = this.actCfgs[i];
            score.string = cfg.money + gdk.i18n.t("i18n:MYSTERY_TIP9");
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(cfg.icon, 1);
            if (i == n - 1) {
                gdk.Timer.once(100, this, () => {
                    slot.scale = 0.6
                    slot.y = 33
                })

            } else {
                gdk.Timer.once(100, this, () => {
                    slot.scale = 0.45
                    slot.y = 25
                })
            }

            let flag = node.getChildByName('flag');
            let total = this.activityModel.mysteryVisitorTotal
            score.node.color = total >= cfg.money ? cc.color('#ebe02c') : cc.color('#0a0e1f')
            GlobalUtil.setSpriteIcon(this.node, flag, `view/act/texture/costumeCustom/texture/szdz_guangdian0${total >= cfg.money ? 2 : 1}`);
            let state = (this.activityModel.mysteryVisitorState & 1 << (cfg.index - 1)) > 0
            slot.getChildByName('mask').active = state
            redPoint.active = total >= cfg.money && !state;

            if (total >= cfg.money) {
                temW += pw;
            } else if (total >= tem && total < cfg.money) {
                let tem1 = (total - tem) / (cfg.money - tem) * pw;
                temW += tem1;
            }
            tem = cfg.money;
        })

        //let temW = 
        this.jinduLb.string = this.activityModel.mysteryVisitorTotal + gdk.i18n.t("i18n:MYSTERY_TIP9")
        this.jindu.width = temW;
    }

    itemClick(e, idx: string) {
        let i = parseInt(idx);
        let cfg = this.actCfgs[i];
        let state = (this.activityModel.mysteryVisitorState & 1 << (cfg.index - 1)) > 0
        if (this.activityModel.mysteryVisitorTotal >= cfg.money && !state) {
            let msg = new icmsg.ActivityMysteriousGainReq()
            msg.index = cfg.index - 1;
            NetManager.send(msg, (rsp: icmsg.ActivityMysteriousGainRsp) => {
                GlobalUtil.openRewadrView(rsp.goodsInfo);
                this.activityModel.mysteryVisitorState = rsp.state;
                this._updateItemsState()
            }, this)
        } else {
            //打开奖励物品预览
            let list = []
            cfg.rewards.forEach(data => {
                let good = new icmsg.GoodsInfo()
                good.typeId = data[0];
                good.num = data[1];
                list.push(good);
            })
            //GlobalUtil.openRewardPreview(list,'可获得以下全部奖励',null,null,{})
            gdk.panel.open(PanelId.RewardPreview, (node: cc.Node) => {
                let ctrl = node.getComponent(RewardPreviewCtrl);
                ctrl.setRewards(list, gdk.i18n.t("i18n:MYSTERY_TIP10"), "", null, this, state);

            }, this);
        }
    }

    //英雄预览
    heroDetailBtnClick() {
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let ctrl = node.getComponent(HeroDetailViewCtrl)
            let data = HeroUtils.getMaxStarHeroInfo()
            ctrl.mysticState = 1;
            ctrl.mysticLinkId = data.heroId;
            let heroCfg = ConfigManager.getItemByField(HeroCfg, 'id', this.showHero)
            ctrl.initHeroInfo(heroCfg)
        })
    }
}
