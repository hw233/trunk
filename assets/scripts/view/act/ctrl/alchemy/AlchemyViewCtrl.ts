import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import CarnivalUtil from '../../util/CarnivalUtil';
import CombineModel from '../../../combine/model/CombineModel';
import CombineUtils from '../../../combine/util/CombineUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import StoreModel from '../../../store/model/StoreModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import {
    Activity_alchemyCfg,
    Copy_stageCfg,
    GlobalCfg,
    Talent_extra_chanceCfg
    } from '../../../../a/config';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';

/**
 * 点金UI
 * @Author: luoyong
 * @Date: 2019-04-09 18:08:59
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-04-01 11:25:18
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/alchemy/AlchemyViewCtrl")
export default class AlchemyViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    gainTime: cc.Label[] = []

    @property(cc.Label)
    getMoneyLab: cc.Label[] = []

    @property(cc.Label)
    leftTimeLab: cc.Label[] = []

    @property(cc.Label)
    costLab: cc.Label[] = []

    @property(cc.Node)
    getBtns: cc.Node[] = []

    @property(cc.Node)
    hasGets: cc.Node[] = []

    @property(cc.Label)
    refreshTimeLab: cc.Label = null

    get activityModel(): ActivityModel { return ModelManager.get(ActivityModel); }
    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }


    _cfgs: Activity_alchemyCfg[] = []

    onEnable() {
        this._cfgs = ConfigManager.getItems(Activity_alchemyCfg)
        this._updateViewInfo()
        this._updateTime()
        gdk.Timer.loop(1000, this, this._updateTime)
    }

    onDisable() {
        gdk.Timer.clear(this, this._updateTime)
    }

    _updateTime() {
        let date = new Date(GlobalUtil.getServerTime())
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let todayZeroTime = TimerUtils.getZerohour(curTime)
        let values = ConfigManager.getItemById(GlobalCfg, "alchemy_refresh_time").value
        let isRefresh = false
        for (let i = 0; i < values.length; i++) {
            let leftTime = todayZeroTime + values[i] - curTime
            if (leftTime > 0) {
                this.refreshTimeLab.string = `${gdk.i18n.t("i18n:ALCHEMY_VIEW_TIP1")}${TimerUtils.format2(leftTime)}`
                isRefresh = true
                break
            }
            if (!isRefresh) {
                leftTime = todayZeroTime + 24 * 60 * 60 - curTime
                this.refreshTimeLab.string = `${gdk.i18n.t("i18n:ALCHEMY_VIEW_TIP1")}${TimerUtils.format2(leftTime)}`
            }
        }
    }

    @gdk.binding('activityModel.alchemyTimes')
    _updateViewInfo() {
        let stageId = this.copyModel.lastCompleteStageId;
        let stageCfg = ConfigManager.getItemById(Copy_stageCfg, stageId)


        for (let i = 0; i < this._cfgs.length; i++) {
            this.gainTime[i].string = `${this._cfgs[i].profit / 60}${gdk.i18n.t("i18n:ALCHEMY_VIEW_TIP2")}`
            this.getMoneyLab[i].string = `${stageCfg.wait_drop[0] * this._cfgs[i].profit}`
            let addTime = 0
            if (this.storeModel.isMonthCardActive(this._cfgs[i].ex_condition)) {
                addTime += this._cfgs[i].ex_times
            }
            if (ActUtil.getCfgByActId(37)) {
                let exTimes = ConfigManager.getItemByField(Talent_extra_chanceCfg, 'key', `alchemy_${i + 1}`).value;
                addTime += exTimes
            }
            //跨服特权
            let activityModel = ModelManager.get(ActivityModel);
            let rank = activityModel.roleServerRank ? activityModel.roleServerRank.rank : -1;
            if (rank >= 1 && rank <= 3) {
                let cServerRankTCfg = CarnivalUtil.getCrossRankConfig(rank);
                if (cc.js.isNumber(cServerRankTCfg.privilege2)) {
                    addTime += cServerRankTCfg.privilege2
                }
            }

            //合服特权
            let combineModel = ModelManager.get(CombineModel)
            let combineRank = combineModel.serverRank ? combineModel.serverRank : -1
            if (ActUtil.ifActOpen(95) && combineRank >= 1 && combineRank <= 3) {
                let combineRankTCfg = CombineUtils.getCrossRankConfig(combineRank);
                if (cc.js.isNumber(combineRankTCfg.privilege2)) {
                    addTime += combineRankTCfg.privilege2
                }
            }

            let useTime = this.activityModel.alchemyTimes[i] ? this.activityModel.alchemyTimes[i] : 0
            let leftTime = this._cfgs[i].times + addTime - useTime
            this.leftTimeLab[i].string = `${gdk.i18n.t("i18n:ALCHEMY_VIEW_TIP3")}${leftTime}`
            let cost = this._cfgs[i].cost[1]
            if (cost > 0) {
                this.costLab[i].string = `${this._cfgs[i].cost[1]}`
            } else {
                this.costLab[i].string = ``
            }

            if (leftTime > 0) {
                this.getBtns[i].active = true
                this.hasGets[i].active = false
            } else {
                this.getBtns[i].active = false
                this.hasGets[i].active = true
            }


        }
    }

    getFunc(e, index) {
        let addTime = 0
        index = parseInt(index)
        if (this.storeModel.isMonthCardActive(this._cfgs[index].ex_condition)) {
            addTime += this._cfgs[index].ex_times
        }
        if (ActUtil.getCfgByActId(37)) {
            let exTimes = ConfigManager.getItemByField(Talent_extra_chanceCfg, 'key', `alchemy_${index + 1}`).value;
            addTime += exTimes
        }
        //跨服特权
        let activityModel = ModelManager.get(ActivityModel);
        let rank = activityModel.roleServerRank ? activityModel.roleServerRank.rank : -1;
        if (rank >= 1 && rank <= 3) {
            let cServerRankTCfg = CarnivalUtil.getCrossRankConfig(rank);
            if (cc.js.isNumber(cServerRankTCfg.privilege2)) {
                addTime += cServerRankTCfg.privilege2
            }
        }

        //合服特权
        let combineModel = ModelManager.get(CombineModel)
        let combineRank = combineModel.serverRank ? combineModel.serverRank : -1
        if (ActUtil.ifActOpen(95) && combineRank >= 1 && combineRank <= 3) {
            let combineRankTCfg = CombineUtils.getCrossRankConfig(combineRank);
            if (cc.js.isNumber(combineRankTCfg.privilege2)) {
                addTime += combineRankTCfg.privilege2
            }
        }

        let useTime = this.activityModel.alchemyTimes[index] ? this.activityModel.alchemyTimes[index] : 0
        if (this._cfgs[index].times + addTime - useTime <= 0) {
            gdk.gui.showMessage(`${gdk.i18n.t("i18n:ALCHEMY_VIEW_TIP4")}`)
            return
        }

        let msg = new icmsg.ActivityAlchemyFetchReq()
        msg.index = index
        NetManager.send(msg, (data: icmsg.ActivityAlchemyFetchRsp) => {
            GlobalUtil.openRewadrView(data.rewards)
            this.activityModel.alchemyTimes = data.times
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
        })
    }
}