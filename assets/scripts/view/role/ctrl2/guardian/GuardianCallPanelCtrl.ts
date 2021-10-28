import ActUtil from '../../../act/util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianModel from '../../model/GuardianModel';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RewardItem from '../../../../common/widgets/RewardItem';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagEvent } from '../../../bag/enum/BagEvent';
import { BagItem } from '../../../../common/models/BagModel';
import {
    GlobalCfg,
    Guardian_cumulativeCfg,
    Guardian_drawCfg,
    Guardian_globalCfg,
    Guardian_trailerCfg,
    ItemCfg
    } from '../../../../a/config';

/** 
 * @Description: 英雄守护者界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-12 19:45:23
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianCallPanelCtrl")
export default class GuardianCallPanelCtrl extends cc.Component {

    @property(cc.Node)
    BgNode: cc.Node = null;
    @property([cc.Node])
    rewardNodes: cc.Node[] = [];
    @property(cc.Label)
    scoreLb: cc.Label = null;
    @property(cc.Node)
    jinduNode: cc.Node = null;
    @property(cc.Node)
    callAddNode: cc.Node = null;
    @property(UiSlotItem)
    callInfo: UiSlotItem = null;
    @property(cc.Label)
    num: cc.Label = null;
    @property(cc.Label)
    gemsNum: cc.Label = null;
    @property([cc.Sprite])
    itemIcons: cc.Sprite[] = []
    @property(cc.Label)
    useNum: cc.Label = null;

    @property(cc.Node)
    callNum1: cc.Node = null;
    @property(cc.Node)
    callNum10: cc.Node = null;

    @property(cc.Node)
    tipNode: cc.Node = null;
    @property(cc.Node)
    tipRewardLayout: cc.Node = null;
    @property(cc.Prefab)
    tipRewadPre: cc.Prefab = null;
    @property(cc.RichText)
    tipText: cc.RichText = null;

    @property(cc.Widget)
    trammelInfoWgt: cc.Widget = null;
    @property(sp.Skeleton)
    spine: sp.Skeleton = null;


    useItemId: number = 0;
    diamond: number = 0;
    rewardCfgs: Guardian_cumulativeCfg[] = [];
    rewardState: { state: number }[] = [];

    callRewardType: number = 1;
    actId: number = 99;
    tipActId: number = 98;
    tipRewardType: number = 0;
    get model() { return ModelManager.get(GuardianModel) }
    get roleModel() { return ModelManager.get(RoleModel) }

    monthDay: number = 1;

    trailerCfg: Guardian_trailerCfg = null;
    _dtime: number = 0;
    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v !== 0) {
            return;
        }
        this._leftTime = Math.max(0, v);
        if (this._leftTime == 0) {
            this.tipNode.active = false;
        }
        else {
            let str = TimerUtils.format1(this.leftTime / 1000);
            this.tipText.string = StringUtils.format(this.trailerCfg.desc, str)
        }
    }

    onEnable() {

        //设置积分累计奖励
        this.useItemId = ConfigManager.getItemByField(Guardian_globalCfg, 'key', 'guardian_item').value[0];
        this.diamond = ConfigManager.getItemByField(Guardian_globalCfg, 'key', 'diamond').value[0];
        this.callRewardType = ActUtil.getActRewardType(this.actId);
        let rewardType = ActUtil.getActRewardType(100);
        this.rewardCfgs = ConfigManager.getItems(Guardian_cumulativeCfg, (cfg: Guardian_cumulativeCfg) => {
            if (cfg.reward_type == rewardType) {
                return true;
            }
        });
        let nowTime = GlobalUtil.getServerTime();
        let temDate = new Date(nowTime)
        this.monthDay = temDate.getDate();
        this.model.enterCallView = true;

        //设置背景图
        let temActType = ActUtil.getActRewardType(99);
        let temCfg = ConfigManager.getItem(Guardian_drawCfg, (cfg: Guardian_drawCfg) => {
            if (cfg.reward_type == temActType && cfg.bg != '') {
                return true;
            }
        })
        if (!temCfg) {
            temCfg = ConfigManager.getItem(Guardian_drawCfg, (cfg: Guardian_drawCfg) => {
                if (cfg.reward_type == 1 && cfg.bg != '') {
                    return true;
                }
            })
        }
        let bgpath = 'view/role/texture/bg/' + temCfg.bg
        GlobalUtil.setSpriteIcon(this.node, this.BgNode, bgpath);

        this.rewardNodes.forEach((node, index) => {
            let ctrl = node.getChildByName("UiSlotItem").getComponent(UiSlotItem);
            let cfg = this.rewardCfgs[index]
            ctrl.isEffect = false;
            ctrl.updateItemInfo(cfg.awards[0][0], cfg.awards[0][1])
        })
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateItemNum, this)

        NetManager.send(new icmsg.GuardianDrawStateReq(), (rsp: icmsg.GuardianDrawStateRsp) => {
            this.model.guardianDrawState = rsp;
            this.refreshRewardState()
        })


        //显示预览部分
        this.tipRewardType = ActUtil.getActRewardType(this.tipActId);
        this.refreshTipRewardState()
    }

    onDisable() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    refreshTipRewardState() {
        //this.tipRewardType = 0
        this.spine.node.active = false;
        if (this.tipRewardType > 0) {

            let tem = GlobalUtil.getLocal('guardianCallType_spine')
            if (!tem || tem != this.tipRewardType) {
                this.spine.node.active = true;
                this.spine.setAnimation(0, 'stand', false);
            }
            this.trammelInfoWgt.top = 280
            this.tipNode.active = true;
            this.tipRewardLayout.removeAllChildren();
            let cfg = ConfigManager.getItemByField(Guardian_trailerCfg, 'reward_type', this.tipRewardType);
            if (cfg) {
                cfg.guardian_id[0].forEach((id, index) => {
                    let node = cc.instantiate(this.tipRewadPre)
                    let ctrl = node.getComponent(RewardItem);
                    let temData = { index: index, typeId: id, num: 1, delayShow: false, effct: false }
                    ctrl.data = temData;
                    ctrl.updateView();
                    node.setParent(this.tipRewardLayout)
                })
                this.trailerCfg = cfg;
                this._updateTime()
            }
        } else {
            this.trammelInfoWgt.top = 235
            this.tipNode.active = false;
        }
    }

    update(dt: number) {
        if (!this.leftTime) {
            return;
        }
        this._dtime += dt;
        if (this._dtime >= 1) {
            this._dtime -= 1;
            this._updateTime();

        }
    }

    _updateTime() {
        let curTime = GlobalUtil.getServerTime();
        let ct = ActUtil.getActEndTime(this.tipActId);
        this.leftTime = ct - curTime;
    }
    refreshRewardState() {
        this.rewardState = []
        this.rewardCfgs.forEach(cfg => {
            //state 0不可领取(时间未到) 1不可领取(次数未到) 2可领取(时间已到) 3已领取
            let tem = { state: 0 };
            let isMonth = this.model.guardianDrawState.cumIsMonthGain;
            if (!isMonth || this.monthDay >= cfg.days) {
                if (this.model.guardianDrawState.drawnNum >= cfg.integral) {
                    tem.state = 2;
                    let temNum = this.model.guardianDrawState.cumAwardFlag
                    if ((temNum & 1 << cfg.reward_id - 1) >= 1) {
                        tem.state = 3;
                    }
                } else {
                    tem.state = 1;
                }
            }

            this.rewardState.push(tem);
        })

        let lastScore = this.rewardCfgs[this.rewardCfgs.length - 1].integral;
        this.rewardNodes.forEach((node, index) => {
            let klq = node.getChildByName("klqSp");
            let ylq = node.getChildByName("getNode");
            let lock = node.getChildByName("lock");
            let timelb = lock.getChildByName("time").getComponent(cc.Label);
            let temState = this.rewardState[index].state
            lock.active = temState == 0;
            klq.active = temState == 2;
            ylq.active = temState == 3;
            let num = node.getChildByName("num").getComponent(cc.Label);
            let cfg = this.rewardCfgs[index]
            if (cfg.days > this.monthDay) {
                timelb.string = (cfg.days - this.monthDay) + gdk.i18n.t("i18n:GUARDIANCALL_TIP8")
            }
            num.string = cfg.integral + ''
            //let state: 0 | 1 = temState <= 1 ? 1 : 0;
            //GlobalUtil.setAllNodeGray(node, state);
        })
        this.useNum.string = Math.max(0, this.diamond - this.model.guardianDrawState.numByGems) + '/' + this.diamond;
        this.scoreLb.string = gdk.i18n.t("i18n:GUARDIANCALL_TIP1") + this.model.guardianDrawState.drawnNum;
        let widthNum = Math.min(1, this.model.guardianDrawState.drawnNum / lastScore) * 512;
        this.jinduNode.width = Math.max(10, widthNum);
        this._updateItemNum();
    }

    _updateItemNum() {
        let itemNum = BagUtils.getItemNumById(this.useItemId)
        this.num.string = itemNum + '';
        this.gemsNum.string = this.roleModel.gems + '';
        this.callNum1.color = itemNum >= 1 ? cc.color('#FFFFFF') : cc.color('#FF0000');
        this.callNum10.color = itemNum >= 10 ? cc.color('#FFFFFF') : cc.color('#FF0000')
    }

    @gdk.binding("model.wishItemId")
    updateHeroInfo() {
        this.callAddNode.active = this.model.wishItemId <= 0;
        this.callInfo.node.active = this.model.wishItemId > 0;
        if (this.model.wishItemId > 0) {
            let cfg = ConfigManager.getItem(Guardian_drawCfg, (cfg: Guardian_drawCfg) => {
                if (cfg.reward_type == this.callRewardType && cfg.award[0] == this.model.wishItemId) {
                    return true
                }
                return false;
            });
            if (cfg) {
                this.callInfo.updateItemInfo(cfg.award[0], cfg.award[1])
            } else {
                this.callAddNode.active = true;
                this.callInfo.node.active = false;
            }
        }
    }

    //增加消耗物按钮点击事件
    addItemBtnClick(e: any, idx: string) {
        let index = parseInt(idx)
        if (index == 1) {
            JumpUtils.openPanel({
                panelId: PanelId.Recharge,
                panelArgs: { args: [3] },
                currId: PanelId.GuardianView,
            });
        } else {
            GlobalUtil.openGainWayTips(this.useItemId)
        }
    }

    //奖池物品概率
    itemProbilityBtnClick() {
        gdk.panel.open(PanelId.GuardianCallProbabilityView)
    }

    rewardBtnClicl(e: any, idx: string) {
        let index = parseInt(idx);
        if (this.rewardState[index].state == 2) {
            //发送领取奖励消息
            let msg = new icmsg.GuardianCumAwardReq()
            msg.index = index + 1
            NetManager.send(msg, (rsp: icmsg.GuardianCumAwardRsp) => {
                let tem = this.model.guardianDrawState.cumAwardFlag;
                tem |= 1 << (index);
                this.model.guardianDrawState.cumAwardFlag = tem;
                if (this.model.guardianDrawState.drawnNum != rsp.drawnNum) {
                    this.model.guardianDrawState.cumAwardFlag = 0;
                    this.model.guardianDrawState.drawnNum = rsp.drawnNum;
                    if (!this.model.guardianDrawState.cumIsMonthGain) {
                        this.model.guardianDrawState.cumIsMonthGain = true
                    }
                }
                this.refreshRewardState();
                GlobalUtil.openRewadrView(rsp.list);
            }, this)
        } else {
            //查看物品详情界面
            let cfg = this.rewardCfgs[index]
            let itemInfo: BagItem = {
                series: 0,
                itemId: cfg.awards[0][0],
                itemNum: cfg.awards[0][1],
                type: BagUtils.getItemTypeById(cfg.awards[0][0]),
                extInfo: null,
            }
            GlobalUtil.openItemTips(itemInfo);
        }
    }

    //许愿池按钮点击事件
    wishBtnClick() {
        //打开许愿池
        gdk.panel.open(PanelId.GuardianCallSelectView)
    }

    //召唤按钮点击事件
    callBtnClick(e: any, idx: string) {
        let index = parseInt(idx)
        if (this.model.wishItemId <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIANCALL_TIP2"))
            return;
        }
        //判断次数
        let itemNum = BagUtils.getItemNumById(this.useItemId);
        let itemCfg: ItemCfg = ConfigManager.getItemById(ItemCfg, this.useItemId)
        let addBuy = 0
        if (itemNum < index) {
            let tem = ConfigManager.getItemByField(Guardian_globalCfg, 'key', 'diamond_consumption').value;
            let allNum = BagUtils.getItemNumById(tem[0]);
            let needNum = (index - itemNum) * tem[1];
            if (allNum >= needNum) {
                //提示话费钻石购买
                addBuy = index - itemNum;
                if (addBuy + this.model.guardianDrawState.numByGems > this.diamond) {
                    gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIANCALL_TIP3"))
                    return;
                }
                // GlobalUtil.openAskPanel({
                //     descText: StringUtils.format(gdk.i18n.t("i18n:GUARDIANCALL_TIP4"), itemCfg.name, needNum),//'退出副本不返还进入次数,是否退出',
                //     sureCb: () => {
                //         this.sendCallReq(index, addBuy);
                //     }
                // })
                let transV = ConfigManager.getItemByField(GlobalCfg, 'key', 'proportion').value;
                GlobalUtil.openAskPanel({
                    descText: `是否使用<color=#00ff00>${needNum}</c>钻石(拥有:<color=#00ff00>${allNum}</c>)<br/>购买<color=#00ff00>${needNum / transV[0] * transV[1]}英雄经验</c>(同时附赠<color=#00ff00>${index - itemNum}</c>次召唤)`,
                    sureCb: () => {
                        this.sendCallReq(index, addBuy);
                    },
                })
            } else {
                //提示守护之芯不够，且钻石数量不够
                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:GUARDIANCALL_TIP5"), itemCfg.name))
            }
            return;
        }
        this.sendCallReq(index, addBuy);
    }

    sendCallReq(index: number, addBuy: number) {
        let msg = new icmsg.GuardianDrawReq()
        msg.type = index > 1 ? 2 : 1;
        NetManager.send(msg, (rsp: icmsg.GuardianDrawRsp) => {
            this.model.guardianDrawState.drawnNum += index;
            this.model.guardianDrawState.numByGems += addBuy;
            this.refreshRewardState();
            GlobalUtil.openRewadrView(rsp.list);
            //召唤更新召唤有礼信息
            this.model.callRewardInfo.drawTimes = this.model.guardianDrawState.drawnNum
            //NetManager.send(new icmsg.ActivityGuardianDrawInfoReq())
        }, this)
    }


}
