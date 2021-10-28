import { Activity_discountCfg, Activity_discount_giftCfg } from "../../../../a/config";
import ConfigManager from "../../../../common/managers/ConfigManager";
import ModelManager from "../../../../common/managers/ModelManager";
import NetManager from "../../../../common/managers/NetManager";
import GlobalUtil from "../../../../common/utils/GlobalUtil";
import StringUtils from "../../../../common/utils/StringUtils";
import TimerUtils from "../../../../common/utils/TimerUtils";
import PanelId from "../../../../configs/ids/PanelId";
import StoreModel from "../../../store/model/StoreModel";
import { ActivityEventId } from "../../enum/ActivityEventId";
import ActivityModel from "../../model/ActivityModel";
import ActUtil from "../../util/ActUtil";


/**
 * 砍价大礼包界面
 * @Author: luoyong
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 10:30:22
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wonderfulActivity/DiscountViewCtrl")
export default class DiscountViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    numLb1: cc.Label = null;    //已砍数量
    @property(cc.Label)
    numLb2: cc.Label = null;    //剩余数量

    @property(cc.Node)
    jinduNode: cc.Node = null;
    @property(cc.Label)
    jinduLb: cc.Label = null;   //进度条数据

    @property(cc.Label)
    jinduTipLb: cc.Label = null;

    @property(cc.Label)
    oldLb: cc.Label = null;

    @property(cc.Label)
    newLb: cc.Label = null;

    @property(cc.Node)
    czTipNode: cc.Node = null;
    @property(cc.Label)
    czTipLb: cc.Label = null;

    @property(cc.Node)
    btn2Node: cc.Node = null;

    @property(cc.Label)
    timeLb: cc.Label = null;

    @property(cc.Node)
    btn2Red: cc.Node = null;
    @property(cc.Label)
    actTimeLb: cc.Label = null;

    get model(): ActivityModel { return ModelManager.get(ActivityModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    maxNum: number = 0;
    maskW: number = 470;
    actId: number = 119;
    curDayNum: number = 0;

    _leftTime: number;
    addDiscount: number = 0;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v !== 0) {
            return;
        }
        this._leftTime = Math.max(0, v);
        if (this._leftTime == 0) {
            // this.close();
            let temStartTime = ActUtil.getActStartTime(this.actId)
            let curTime = GlobalUtil.getServerTime();
            this.curDayNum = Math.floor(((curTime - temStartTime) / 1000) / 86400) + 1
            NetManager.send(new icmsg.ActivityDiscountStateReq)
            return;
        }
        else {
            this.timeLb.string = StringUtils.format(gdk.i18n.t("i18n:DISCOUNT_TIP4"), TimerUtils.format2(this.leftTime / 1000))//`今日砍价还剩${TimerUtils.format2(this.leftTime / 1000)}过期，快来砍价吧~`;
        }
    }

    giftCfg: Activity_discount_giftCfg;

    onEnable() {

        let startTime = new Date(ActUtil.getActStartTime(this.actId));
        let endTime = new Date(ActUtil.getActEndTime(this.actId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.actTimeLb.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            this.close();
            return;
        }
        else {
            this.actTimeLb.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }

        this.timeLb.node.active == true;
        let temStartTime = ActUtil.getActStartTime(this.actId)
        let curTime = GlobalUtil.getServerTime();
        this.curDayNum = Math.floor(((curTime - temStartTime) / 1000) / 86400) + 1
        this.giftCfg = ConfigManager.getItemById(Activity_discount_giftCfg, 1);
        this.maxNum = this.giftCfg.cost;
        this.oldLb.string = gdk.i18n.t("i18n:DISCOUNT_TIP3") + this.maxNum;

        this.refreshInfo();
        this._updateTime();
        NetManager.on(icmsg.ActivityDiscountStateRsp.MsgType, this._onActivityDiscountStateRsp, this);
    }

    _dtime: number = 0;
    update(dt: number) {
        if (!this.leftTime || this.model.discountData[0].times > 1) {
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
        let ct = ActUtil.getActStartTime(this.actId) + this.curDayNum * 86400 * 1000
        this.leftTime = ct - curTime;

    }
    onDisable() {
        NetManager.targetOff(this);

    }

    _onActivityDiscountStateRsp(rsp: icmsg.ActivityDiscountStateRsp) {
        let temStartTime = ActUtil.getActStartTime(this.actId)
        let curTime = GlobalUtil.getServerTime();
        this.curDayNum = Math.floor(((curTime - temStartTime) / 1000) / 86400) + 1
        this.model.discountData = rsp.gifts;
        this.refreshInfo()
    }

    refreshInfo(showAction: boolean = false) {
        let temData = this.model.discountData[0];

        this.numLb1.string = temData.discount + ''
        this.numLb2.string = (this.maxNum - temData.discount) + ''

        this.jinduLb.string = temData.discount + '/' + this.maxNum;

        let temW = Math.floor(temData.discount / this.maxNum * this.maskW);
        if (showAction) {
            let tween2 = new cc.Tween();
            tween2.target(this.jinduNode)
                .to(1, { width: temW })
                .start()
        } else {
            this.jinduNode.width = temW;
        }

        this.jinduTipLb.string = StringUtils.format(gdk.i18n.t("i18n:DISCOUNT_TIP1"), Math.floor(temData.discount / this.maxNum * 100), temData.over)//`砍价${Math.floor(temData.discount / this.maxNum * 100)}%,已超过本服${temData.over}%的玩家`;

        let temCfg = ConfigManager.getItemByField(Activity_discountCfg, 'id', temData.payId)
        let maxCost = temCfg.RMB_cost * 10;

        this.newLb.string = (this.maxNum - temData.discount) + gdk.i18n.t("i18n:DISCOUNT_TIP2")

        this.czTipNode.active = temData.times == 1 && this.model.dayRecharge * 10 < maxCost;
        this.czTipLb.string = (maxCost - this.model.dayRecharge * 10) + '';

        let btn2State: 0 | 1 = (temData.times == 0 || (temData.times == 1 && this.model.dayRecharge * 10 >= maxCost)) ? 0 : 1;
        this.btn2Red.active = btn2State == 0
        GlobalUtil.setAllNodeGray(this.btn2Node, btn2State);

    }

    btn1Click() {
        let msg = new icmsg.ActivityDiscountBuyReq()
        msg.id = this.model.discountData[0].id;
        NetManager.send(msg, (rsp: icmsg.ActivityDiscountBuyRsp) => {
            GlobalUtil.openRewadrView(rsp.goods);
            this.model.discountData[0].bought = true;
            gdk.panel.hide(PanelId.ActivityMainView);
            //gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
        });
    }


    btn2Click() {
        if (!GlobalUtil.getGrayState(this.btn2Node)) {
            this.addDiscount = 0;
            let msg = new icmsg.ActivityDiscountReq()
            msg.id = this.model.discountData[0].id;
            NetManager.send(msg, (rsp: icmsg.ActivityDiscountRsp) => {
                this.model.discountData[0] = rsp.gift;
                this.addDiscount = rsp.discount;
                if (rsp.gift.times == 2) {
                    this.timeLb.node.active = false;
                }
                this.refreshInfo(true);
            });
        }
    }

    openRewardView() {
        let temData: icmsg.GoodsInfo[] = []
        this.giftCfg.rewards.forEach(data => {
            let tem = new icmsg.GoodsInfo()
            tem.typeId = data[0];
            tem.num = data[1];
            temData.push(tem);
        })
        GlobalUtil.openRewardPreview(temData);
    }

}
