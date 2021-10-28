import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import LuckTwistEggBallCtrl from './LuckTwistEggBallCtrl';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { GlobalCfg, Twist_eggCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';

/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-12 19:42:41
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/luckyTwist/LuckyTwistEggCtrl")
export default class LuckyTwistEggCtrl extends gdk.BasePanel {
    @property(cc.Node)
    machine: cc.Node = null;

    @property(cc.Node)
    twistedArea: cc.Node = null;

    @property(cc.Prefab)
    eggPrefab: cc.Prefab = null;

    @property(cc.Node)
    twistedBtn: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    rewardPrefab: cc.Prefab = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    tipsNode: cc.Node = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    isInAni: boolean = false;
    curJackPotChild: cc.Node;
    //_resultBallType: number = 0
    _resultCfg: Twist_eggCfg
    list: ListView;
    rewardList: icmsg.GoodsInfo[] = []

    activityId: number = 92;
    _realRewardType = 0
    onEnable() {
        let startTime = new Date(ActUtil.getActStartTime(this.activityId));
        let endTime = new Date(ActUtil.getActEndTime(this.activityId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLabel.string = `活动已过期`;
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }
        else {
            this.timeLabel.string = `活动时间：${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
            ModelManager.get(ActivityModel).firstInTwistView = false;
            this.mask.active = false;
            cc.director.getPhysicsManager().enabled = true;
            cc.director.getPhysicsManager().gravity = cc.v2(0, -640)
            this._initEggs();
            this._adjustEggsPos();
            this._updateViewInfo()
            gdk.e.on(ActivityEventId.ACTIVITY_TWISTED_ANI_END, this._onTwistedAniEnd, this);
        }
        this.actModel.firstInluckyTwistEgg = false
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    onDisable() {
        cc.director.getPhysicsManager().enabled = false;
        this.twistedBtn.stopAllActions();
        this.machine.stopAllActions();
        gdk.e.targetOff(this);
    }


    @gdk.binding("actModel.luckyTwistEggWished")
    _updateViewInfo() {
        this._initRewards();
        this._updateCost();
    }

    /**转动按钮点击 */
    onTwistedBtnClick() {
        if (this.isInAni) return;
        if (!ActUtil.ifActOpen(this.activityId)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }

        // let actCfg = ActUtil.getCfgByActId(this.activityId);
        // if (!actCfg) return null;
        let rewardCfgs = ConfigManager.getItemsByField(Twist_eggCfg, "type", this._realRewardType)

        let wishCount = 0
        for (let i = 0; i < rewardCfgs.length; i++) {
            if (rewardCfgs[i].wish && rewardCfgs[i].wish.length > 0) {
                wishCount++
            }
        }

        if (this.actModel.luckyTwistEggWished.length < wishCount) {
            gdk.gui.showMessage('请先设置许愿池的奖励');
            return;
        }

        if (ActivityUtils.getUseTwistEggTime() >= rewardCfgs.length) {
            gdk.gui.showMessage('已领取所有奖励');
            return;
        }

        let costNum = parseInt(cc.find('costLayout/costLabel', this.tipsNode).getComponent(cc.Label).string);
        if (this.roleModel.gems < costNum) {
            gdk.gui.showMessage('钻石不足');
            return;
        }

        let cb = () => {
            this.isInAni = true;
            this.mask.active = true;
            let req = new icmsg.TwistEggDrawReq();
            NetManager.send(req, (resp: icmsg.TwistEggDrawRsp) => {
                let activityModel = ModelManager.get(ActivityModel);
                let getNum = resp.rewarded - activityModel.luckyTwistEggRewarded
                activityModel.luckyTwistEggRewarded = resp.rewarded
                if (cc.isValid(this.node)) {
                    this.rewardList = resp.list
                    let result = 1
                    while (getNum) {
                        if (getNum == 2) {
                            result++
                            break;
                        }
                        if (0 == getNum % 2) {
                            getNum /= 2;
                            result++;
                        } else {
                            break
                        }
                    }
                    let ballType = 1
                    this._resultCfg = ConfigManager.getItemByField(Twist_eggCfg, "type", this._realRewardType, { "number": result })
                    if (this._resultCfg) {
                        ballType = this._resultCfg.reward_type
                    }
                    this._playTwistAni(ballType);
                }
            });
        }
        let transV = ConfigManager.getItemByField(GlobalCfg, 'key', 'proportion').value;
        GlobalUtil.openAskPanel({
            descText: `是否使用<color=#00ff00>${costNum}</c>钻石(拥有:<color=#00ff00>${this.roleModel.gems}</c>)<br/>购买<color=#00ff00>${costNum / transV[0] * transV[1]}英雄经验</c>(同时附赠<color=#00ff00>${1}</c>次转动)`,
            sureCb: cb,
        })
    }

    /**扭蛋动画 */
    _playTwistAni(jackPotType: number) {
        let action = cc.sequence(
            cc.rotateTo(.5, 80),
            cc.rotateTo(.1, 0),
            cc.callFunc(() => {
                this._machineAni();
                let childs = this.twistedArea.children;
                let jackPotNum = 0;
                childs.forEach(child => {
                    let ctrl = child.getComponent(LuckTwistEggBallCtrl);
                    if (jackPotNum <= 0 && ctrl.color == jackPotType) {
                        jackPotNum += 1;
                        ctrl.isJackPot = true;
                        this.curJackPotChild = child;
                    }
                    else ctrl.isJackPot = false;
                    ctrl.playAni();
                });
            })
        );
        this.twistedBtn.runAction(action);
    }

    /**机器晃动动画 */
    _machineAni() {
        let action = cc.sequence(
            cc.rotateBy(.05, 5),
            cc.rotateBy(.05, -5),
            cc.rotateBy(.05, -5),
            cc.rotateBy(.05, 5),
            cc.callFunc(() => {
                this.machine.angle = 0;
            })
        );
        this.machine.angle = 0;
        this.machine.runAction(cc.repeat(action, 20));
    }

    /**扭蛋动画结束 */
    _onTwistedAniEnd() {
        this._updateCost();
        if (this.rewardList) {
            GlobalUtil.openRewadrView(this.rewardList);
            this._updateViewInfo()
            if (this._resultCfg && ActivityUtils.getTwistEggPushGiftId(this._resultCfg) > 0) {
                gdk.e.on("popup#Reward#close", this._hideRewardFunc, this);
            }
        }
        gdk.Timer.once(200, this, () => {
            this.isInAni = false;
            this.mask.active = false;
            this.rewardList = [];
            this._initEggs();
            if (this.curJackPotChild) {
                this.curJackPotChild.removeFromParent();
                this.curJackPotChild = null;
            }
            this._adjustEggsPos();
        });
    }

    _hideRewardFunc() {
        gdk.e.off("popup#Reward#close", this._hideRewardFunc, this);
        PanelId.LuckyTwistGiftPanel.isMask = true
        PanelId.LuckyTwistGiftPanel.isTouchMaskClose = true
        PanelId.LuckyTwistGiftPanel.maskAlpha = 165

        let msg = new icmsg.StorePushListReq()
        NetManager.send(msg, () => {
            gdk.panel.setArgs(PanelId.LuckyTwistGiftPanel, true)
            gdk.panel.open(PanelId.LuckyTwistGiftPanel)
        }, this)

    }

    _initRewards() {
        let lvs: number[] = [9, 1, 2, 3]; // 特等 一等 二等 三等
        let cfg = ActUtil.getCfgByActId(this.activityId);
        this._realRewardType = this.actModel.luckyTwistEggSubType //活动类型
        let data: {
            lv: number,
            cfgs: Twist_eggCfg[]
        }[] = [];
        lvs.forEach(lv => {
            let cfgs = ConfigManager.getItems(Twist_eggCfg, (cfg: Twist_eggCfg) => {
                if (cfg.type == this._realRewardType && cfg.reward_type == lv) return true;
            });
            data.push({
                lv: lv,
                cfgs: cfgs
            })
        });

        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.rewardPrefab,
                cb_host: this,
                async: true,
                gap_y: 25,
                direction: ListViewDir.Vertical,
            })
        }
        this.scrollView.enabled = false;
        this.list.clear_items();
        this.list.set_data(data);
    }

    _initEggs() {
        let cfgs: Twist_eggCfg[] = ActivityUtils.getLeftTwistEggRewardCfg();
        this.twistedArea.removeAllChildren();
        cfgs.forEach(cfg => {
            let egg = cc.instantiate(this.eggPrefab);
            egg.parent = this.twistedArea;
            let ctrl = egg.getComponent(LuckTwistEggBallCtrl);
            ctrl.updateView(cfg.reward_type);
        });
    }

    /**更新钻石数量 */
    @gdk.binding("roleModel.gems")
    _updateMoney() {
        if (!this.tipsNode) return;
        cc.find('layout/moneyLabel', this.tipsNode).getComponent(cc.Label).string = GlobalUtil.numberToStr(this.roleModel.gems);
    }

    _updateCost() {
        // let cfg = ActUtil.getCfgByActId(this.activityId);
        let twistCfg = ConfigManager.getItem(Twist_eggCfg, (cfg: Twist_eggCfg) => {
            if (cfg.type == this._realRewardType && cfg.number == (ActivityUtils.getUseTwistEggTime() + 1)) return true;
        });
        let costLayout = cc.find('costLayout', this.tipsNode);
        let costTipsLabel = cc.find('costTipsLabel', this.tipsNode).getComponent(cc.Label);
        if (twistCfg) {
            costLayout.active = true;
            costTipsLabel.string = '转动消耗钻石';
            cc.find('costLabel', costLayout).getComponent(cc.Label).string = twistCfg.consume ? `${twistCfg.consume[1]}` : '0';
            let costNum = parseInt(cc.find('costLayout/costLabel', this.tipsNode).getComponent(cc.Label).string);
            if (this.roleModel.gems < costNum) {
                cc.find('costLabel', costLayout).getComponent(cc.Label).node.color = cc.color("#FF0000")
            } else {
                cc.find('costLabel', costLayout).getComponent(cc.Label).node.color = cc.color("#00FF00")
            }
        }
        else {
            costLayout.active = false;
            costTipsLabel.string = '已领取所有奖励';
        }
    }

    /**
     * 位置更新， 有规律没时间找,暂时map写死。。
     */
    _adjustEggsPos() {
        let dw = 50;
        let dh = 50;
        let map = {
            1: { row: 1, col: 1, x: -95 }, 2: { row: 1, col: 2, x: -35 }, 3: { row: 1, col: 3, x: 35 }, 4: { row: 1, col: 4, x: 95 },
            5: { row: 2, col: 1, x: -70 }, 6: { row: 2, col: 2, x: 0 }, 7: { row: 2, col: 3, x: 70 },
            8: { row: 3, col: 1, x: -45 }, 9: { row: 3, col: 2, x: 45 },
            10: { row: 4, col: 1, x: 0 },
        }
        let childs = this.twistedArea.children;
        let len = childs.length;
        childs.forEach((child, idx) => {
            child.setPosition(map[idx + 1].x, 50 + (map[idx + 1].row - 1) * dh);
        });
        for (let i = len; i > 0; i--) {
            childs[i - 1].setSiblingIndex(len - i);
        }
    }
}
