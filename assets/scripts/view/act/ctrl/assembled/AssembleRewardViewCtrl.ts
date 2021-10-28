import { Activity_assembledCfg, HeroCfg } from "../../../../a/config";
import ConfigManager from "../../../../common/managers/ConfigManager";
import ModelManager from "../../../../common/managers/ModelManager";
import NetManager from "../../../../common/managers/NetManager";
import BagUtils from "../../../../common/utils/BagUtils";
import GlobalUtil from "../../../../common/utils/GlobalUtil";
import StringUtils from "../../../../common/utils/StringUtils";
import TimerUtils from "../../../../common/utils/TimerUtils";
import UiSlotItem from "../../../../common/widgets/UiSlotItem";
import UiTabMenuCtrl from "../../../../common/widgets/UiTabMenuCtrl";
import PanelId from "../../../../configs/ids/PanelId";
import HeroDetailViewCtrl from "../../../lottery/ctrl/HeroDetailViewCtrl";
import ActivityModel from "../../model/ActivityModel";
import ActUtil from "../../util/ActUtil";


/**
 * 灵力者集结
 * @Author: luoyong
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 10:30:22
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/assembled/AssembleRewardViewCtrl")
export default class AssembleRewardViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    timeLb: cc.Label = null;

    @property(cc.Label)
    oldpriceLb: cc.Label = null;
    @property(cc.Label)
    newpriceLb: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    buyBtnNode: cc.Node = null;


    @property(UiTabMenuCtrl)
    tabBtn: UiTabMenuCtrl = null;

    @property(cc.Toggle)
    skipBtn: cc.Toggle = null;

    @property(cc.Node)
    boxState1: cc.Node = null;
    @property(cc.Node)
    boxState2: cc.Node = null;

    @property([cc.Node])
    rewardNodes: cc.Node[] = []


    curCfg: Activity_assembledCfg;


    isCurDay: boolean = false;

    curDayNum: number = 0;
    selectNum: number = -1;
    get model(): ActivityModel { return ModelManager.get(ActivityModel); }

    tabStrs: string[] = ['第1天', '第2天', '第3天', '第4天', '第5天', '第6天', '第7天']


    heroIds: number[] = [300072, 300057, 300071]

    actCfgs: Activity_assembledCfg[]

    actId: number = 118

    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v !== 0) {
            return;
        }
        this._leftTime = Math.max(0, v);
        if (this._leftTime == 0) {
            // this.close();
            gdk.panel.hide(PanelId.AssembledActivityMainView);
            return;
        }
        else {
            this.timeLb.string = TimerUtils.format1(this.leftTime / 1000);
        }
    }

    onEnable() {
        let actType = ActUtil.getActRewardType(this.actId);
        this.actCfgs = ConfigManager.getItems(Activity_assembledCfg, (cfg: Activity_assembledCfg) => {
            if (cfg.type == actType) {
                return true;
            }
            return false;
        })

        //获取当前是活动第几天
        let temStartTime = ActUtil.getActStartTime(this.actId)
        let curTime = GlobalUtil.getServerTime();
        this.curDayNum = Math.floor(((curTime - temStartTime) / 1000) / 86400) + 1
        this.selectNum = this.curDayNum - 1;
        this.isCurDay = true;
        //let openStr = GlobalUtil.getLocal('assembledOpenState');
        let state = GlobalUtil.getLocal('assembledIsSkipTip', true)
        this.skipBtn.isChecked = state == null ? false : state;
        this.model.assembledOpenState = true;
        this.model.assembledOpen = 'assembled_' + actType + '_' + this.curDayNum;
        GlobalUtil.setLocal('assembledOpenState', this.model.assembledOpen);

        let temStrs = this.tabStrs.concat();
        temStrs.length = this.actCfgs.length;
        this.tabBtn.itemNames = temStrs;
        this.tabBtn.selectIdx = this.selectNum;
        this.curCfg = this.actCfgs[this.selectNum];
        this.tabBtn.showSelect(this.selectNum)
        this._updateView()
        this._updateTime();
        NetManager.on(icmsg.ActivityAssembledInfoRsp.MsgType, this.onActivityAssembledInfoRsp, this)
        NetManager.on(icmsg.ActivityAssembledGainRsp.MsgType, this.onActivityAssembledGainRsp, this)
    }

    onDisable() {
        NetManager.targetOff(this);
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

    _updateView() {
        //刷新价格
        this.oldpriceLb.string = StringUtils.format(gdk.i18n.t("i18n:ASSEMBLED_TIP3"), this.curCfg.original_price)//`原价${this.curCfg.original_price}元`
        this.newpriceLb.string = StringUtils.format(gdk.i18n.t("i18n:ASSEMBLED_TIP4"), this.curCfg.discount_price)//`折后价${this.curCfg.discount_price}元`
        if (this.isCurDay && ((this.model.assembledState & 1 << this.curDayNum - 1) > 0)) {
            this.newpriceLb.string = gdk.i18n.t("i18n:ASSEMBLED_TIP5")
        }
        // GlobalUtil.setAllNodeGray(this.newpriceLb.node.parent, 0);
        let state: 0 | 1 = 0;
        if (this.selectNum < (this.curDayNum - 1)) {
            if ((this.model.assembledState & 1 << this.selectNum) > 0) {
                state = 1;
                //GlobalUtil.setAllNodeGray(this.newpriceLb.node.parent, 1);
                this.newpriceLb.string = gdk.i18n.t("i18n:ASSEMBLED_TIP5")
            }
            //  else {
            //     this.newpriceLb.string = gdk.i18n.t("i18n:ASSEMBLED_TIP6")
            // }
        } else if (this.isCurDay && ((this.model.assembledState & 1 << this.curDayNum - 1) > 0)) {
            state = 1;
        } else if (this.selectNum > (this.curDayNum - 1)) {
            state = 1;
        }

        this.boxState1.active = (!this.isCurDay || ((this.model.assembledState & 1 << this.curDayNum - 1) == 0))
        this.boxState2.active = (this.isCurDay && ((this.model.assembledState & 1 << this.curDayNum - 1) > 0))

        GlobalUtil.setAllNodeGray(this.buyBtnNode, state);

        //刷新奖励物品
        this.content.removeAllChildren();
        this.curCfg.rewards.forEach(i => {
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

        this.refreshRewardNodeState();

    }

    buyBtnClick() {
        if (this.isCurDay && ((this.model.assembledState & 1 << this.curDayNum - 1) == 0)) {

            let msg = new icmsg.PayOrderReq()
            msg.paymentId = this.curCfg.index;
            NetManager.send(msg);

        } else if (!this.isCurDay) {
            if (this.selectNum < this.curDayNum - 1) {
                if ((this.model.assembledState & 1 << this.selectNum) > 0) {
                    //gdk.gui.showMessage(gdk.i18n.t("i18n:ASSEMBLED_TIP1"));
                } else {
                    //gdk.gui.showMessage(gdk.i18n.t("i18n:ASSEMBLED_TIP7"));
                    let msg = new icmsg.PayOrderReq()
                    msg.paymentId = this.curCfg.index;
                    NetManager.send(msg);
                }
            } else {
                //提示剩余时间
                let temStartTime = ActUtil.getActStartTime(this.actId)
                let temTime = temStartTime + (this.selectNum) * 86400 * 1000
                let curTime = GlobalUtil.getServerTime();
                let temStr = TimerUtils.format4(Math.floor((temTime - curTime) / 1000))
                gdk.gui.showMessage(temStr + gdk.i18n.t("i18n:ASSEMBLED_TIP2"))
            }
        }
    }

    onActivityAssembledInfoRsp(rsp: icmsg.ActivityAssembledInfoRsp) {
        this.model.assembledState = rsp.state;
        let actType = ActUtil.getActRewardType(this.actId);
        //获取当前是活动第几天
        let temStartTime = ActUtil.getActStartTime(this.actId)
        let curTime = GlobalUtil.getServerTime();
        this.curDayNum = Math.floor(((curTime - temStartTime) / 1000) / 86400) + 1
        this.selectNum = this.curDayNum - 1;
        this.isCurDay = true;
        //let openStr = GlobalUtil.getLocal('assembledOpenState');
        let state = GlobalUtil.getLocal('assembledIsSkipTip', true)
        this.skipBtn.isChecked = state == null ? false : state;
        this.model.assembledOpenState = true;
        this.model.assembledOpen = 'assembled_' + actType + '_' + this.curDayNum;
        GlobalUtil.setLocal('assembledOpenState', this.model.assembledOpen);

        let temStrs = this.tabStrs.concat();
        temStrs.length = this.actCfgs.length;
        this.tabBtn.itemNames = temStrs;
        this.tabBtn.selectIdx = this.selectNum;
        this.curCfg = this.actCfgs[this.selectNum];
        this.tabBtn.showSelect(this.selectNum)
        this._updateView()
    }

    onActivityAssembledGainRsp(rsp: icmsg.ActivityAssembledGainRsp) {
        this.model.assembledState = rsp.state;
        GlobalUtil.openRewadrView(rsp.goodsInfo);
        GlobalUtil.setAllNodeGray(this.buyBtnNode, 1);
        this.boxState1.active = false
        this.boxState2.active = true;
        this.newpriceLb.string = gdk.i18n.t("i18n:ASSEMBLED_TIP5")
        this.refreshRewardNodeState();
        NetManager.send(new icmsg.StorePushListReq())
    }


    refreshRewardNodeState() {
        for (let i = 0, n = this.rewardNodes.length; i < n; i++) {
            let node = this.rewardNodes[i]
            if ((this.model.assembledState & 1 << i) <= 0) {
                node.active = false
            } else {
                node.active = true;
            }
        }
    }


    openHaloView() {
        gdk.panel.open(PanelId.RoleUpHeroHaloView)
    }


    heroBtnClick(e, data) {
        let index = parseInt(data)
        let heroId = this.heroIds[index]
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroId);
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl)
            comp.initHeroInfo(heroCfg)
        })
    }


    onTabMenuSelect(e, data) {
        // if (data + 1 < this.curDayNum) {
        //     //提示活动已经结束
        //     gdk.gui.showMessage(gdk.i18n.t("i18n:ASSEMBLED_TIP1"));
        //     this.tabBtn.showSelect(this.selectNum);
        // } else {

        // }
        if (this.selectNum != data) {
            this.selectNum = data;
            this.isCurDay = this.selectNum + 1 == this.curDayNum;
            this.curCfg = this.actCfgs[this.selectNum];
            this._updateView();
        }
    }

    skipBtnClick() {
        GlobalUtil.setLocal('assembledIsSkipTip', this.skipBtn.isChecked, true);
    }
}


