import ActivityModel from '../model/ActivityModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RankModel from '../../rank/model/RankModel';
import RoleModel from '../../../common/models/RoleModel';
import { GlobalCfg } from '../../../a/config';
import { RankTypes } from '../../rank/enum/RankEvent';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/KfcbBtnCtrl")
export default class KfcbBtnCtrl extends cc.Component {


    @property(cc.Node)
    arrow: cc.Node = null

    @property(cc.Label)
    percentLab: cc.Label = null
    @property(cc.Node)
    bg: cc.Node = null;

    get activityModel(): ActivityModel { return ModelManager.get(ActivityModel) };
    get roleModel(): RoleModel { return ModelManager.get(RoleModel) };
    get copyModel(): CopyModel { return ModelManager.get(CopyModel) };
    get rankModel(): RankModel { return ModelManager.get(RankModel) };

    end7Time: number = 0

    onEnable() {
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let serverOpenTime = GlobalUtil.getServerOpenTime()
        let endTime = serverOpenTime + 3600 * 24 * 7 - serverTime

        if (endTime > 0) {
            NetManager.on(icmsg.RankSelfRsp.MsgType, this._onRankSelfRsp, this)

            // let msg = new ActivityRankingInfoReq();
            // NetManager.send(msg);

            //请求排行榜主线数据
            let msg2 = new icmsg.RankDetailReq()
            msg2.type = RankTypes.Refine
            NetManager.send(msg2)
        }
    }

    _onRankSelfRsp(data: icmsg.RankSelfRsp) {
        if (!this.roleModel) return;
        this.rankModel.rankSelfMap[data.type] = data;
        this._updatePercent()
    }

    onDisable() {
        GlobalUtil.setSpriteIcon(this.node, this.arrow, null)
        NetManager.targetOff(this);
        gdk.e.targetOff(this)
    }

    @gdk.binding("roleModel.level")
    @gdk.binding("activityModel.showKfcbIcon")
    _updateInfo() {
        if (!this.roleModel) return;
        let kfcb_cfg = ConfigManager.getItemById(GlobalCfg, "kfcb_lv_time").value
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let serverOpenTime = GlobalUtil.getServerOpenTime()
        let endTime = serverOpenTime + 3600 * 24 * kfcb_cfg[1] - serverTime

        // let newStageCfg = ConfigManager.getItemById(Copy_stageCfg, this.copyModel.latelyStageId);
        // let targetStageId = ConfigManager.getItemById(GlobalCfg, "ranking_min_stage_id").value[0]
        this.end7Time = serverOpenTime + 3600 * 24 * 7 - serverTime
        // if (newStageCfg && newStageCfg.pre_condition >= targetStageId) {
        //     //超过活动时间 且进度都为0，没有进入过这个活动，或者两个档次都没达到领奖要求 图标不显示
        //     this.end7Time = serverOpenTime + 3600 * 24 * 7 - serverTime
        //     let list3 = ConfigManager.getItems(Activity_ranking3Cfg)
        //     let list7 = ConfigManager.getItems(Activity_ranking7Cfg)
        //     if (this.end7Time < 0 && ((this.activityModel.kfcb_history1 == 0 && this.activityModel.kfcb_history2 == 0)
        //         || (this.activityModel.kfcb_percent3 > list3[list3.length - 1].rank && this.activityModel.kfcb_percent7 > list7[list7.length - 1].rank))
        //         || (this.activityModel.kfcb_rewarded3 && this.activityModel.kfcb_rewarded7)
        //     ) {
        //         this.node.active = false
        //         this.unschedule(this._updateTime)
        //         return
        //     }
        //     if (this.roleModel.level >= kfcb_cfg[0] && endTime > 0) {
        //         this.node.active = true
        //         this.unschedule(this._updateTime)
        //         this.schedule(this._updateTime, 1)
        //     } else {
        //         this.node.active = false
        //     }
        // } else {
        //     this.node.active = false
        // }
        if (endTime > 0 && JumpUtils.ifSysOpen(1802)) { //JumpUtils.ifSysOpen(1802)
            this.node.active = true
            this.unschedule(this._updateTime)
            this.schedule(this._updateTime, 1)
        }
        else {
            this.node.active = false
            this.unschedule(this._updateTime)
        }
    }

    @gdk.binding("activityModel.kfcb_percent7")
    _updatePercent() {
        if (!this.activityModel) return;
        let percent0 = this.activityModel.kfcb_history1
        let percent7 = this.activityModel.kfcb_percent7

        if (this.end7Time > 0) {
            let rankInfo: icmsg.RankSelfRsp = this.rankModel.rankSelfMap[RankTypes.Refine]
            if (rankInfo && rankInfo.numTd != 0 && percent7 > rankInfo.numTd) {
                percent7 = rankInfo.numTd
            }
        }

        let changPercent = percent7 - percent0
        if (changPercent >= 0 && percent0 != 0) {
            //排名降低
            GlobalUtil.setSpriteIcon(this.node, this.arrow, "view/main/texture/main/sub_arrow06")
            this.arrow.active = true
        } else {
            GlobalUtil.setSpriteIcon(this.node, this.arrow, "view/main/texture/main/sub_arrow05")
            this.arrow.active = true
        }

        this.bg.active = percent7 > 0;
        this.percentLab.string = `${percent7}${gdk.i18n.t("i18n:KFCB_TIP2")}`

        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let serverOpenTime = GlobalUtil.getServerOpenTime()
        let endTime = serverOpenTime + 3600 * 24 * 1 - serverTime
        if (endTime > 0 || changPercent == 0) {
            this.arrow.active = false
        }
    }

    _updateTime() {
        let kfcb_cfg = ConfigManager.getItemById(GlobalCfg, "kfcb_lv_time").value
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let serverOpenTime = GlobalUtil.getServerOpenTime()
        let endTime = serverOpenTime + 3600 * 24 * kfcb_cfg[1] - serverTime

        //活动持续时间结束  奖励都领取后
        // if (endTime < 0 || (this.activityModel.kfcb_rewarded3 && this.activityModel.kfcb_rewarded7)) {
        //     this.node.active = false
        //     this.unschedule(this._updateTime)
        // }

        if (endTime < 0) {
            this.node.active = false
            this.unschedule(this._updateTime)
        }
    }
}