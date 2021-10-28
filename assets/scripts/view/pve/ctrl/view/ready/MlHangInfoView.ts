import ActUtil from '../../../../act/util/ActUtil';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import CopyModel, { CopyEventId, CopyType } from '../../../../../common/models/CopyModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import MainLineModel from '../../../../instance/model/MainLineModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RoleModel from '../../../../../common/models/RoleModel';
import StringUtils from '../../../../../common/utils/StringUtils';
import {
    Copy_stageCfg,
    CopyCfg,
    GlobalCfg,
    Secretarea_globalCfg,
    VipCfg
    } from '../../../../../a/config';
import { timeFormat } from '../../../../instance/utils/InstanceUtil';

/** 
 * 主线挂机信息
 * @Author: jijing.liu
 * @Description: 
 * @Date: 2019-03-21 09:57:55 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 12:32:34
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/ready/MlHangInfoView")
export default class MlHangInfoView extends cc.Component {

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    normalBox: cc.Node = null;

    @property([cc.Vec2])
    pos: cc.Vec2[] = []

    setupTimer: boolean = false;
    copyCfg: CopyCfg;
    stageId: number;
    _vipAddTime: number = 0

    get model() { return ModelManager.get(MainLineModel); }
    get copyModel() { return ModelManager.get(CopyModel); }
    get roleModel() { return ModelManager.get(RoleModel); }

    hangTimeLv: number[];
    actNames: string[] = [];
    onEnable() {
        this.stageId = this.copyModel.hangStageId;
        this.hangTimeLv = ConfigManager.getItemByField(GlobalCfg, 'key', 'on_look_mainline').value;
        let actId = ConfigManager.getItemByField(Secretarea_globalCfg, 'key', 'store_activity_id').value[0];
        this.actNames = ActUtil.ifActOpen(actId) ? ['stand4', 'stand5', 'stand6'] : ['stand', 'stand2', 'stand3'];
        if (this.progress) {
            this.progress.progress = 0;
        }
        if (this.stageId) {
            let stageCfg = ConfigManager.getItem(Copy_stageCfg, { id: this.stageId });
            if (stageCfg) {
                this.copyCfg = ConfigManager.getItem(CopyCfg, { subtype: stageCfg.subtype });
                // 事件侦听
                gdk.e.on(CopyEventId.RSP_COPY_MAIN_HANG, this._updateHangInfo, this, 0, false);
                gdk.e.on(CopyEventId.RSP_COPY_MAIN_HANG_REWARD, this._updateHangInfo, this, 0, false);
                if (this.copyModel.hangStateMsg) {
                    // 直接显示
                    this._updateHangInfo();
                } else {
                    // 首次请求
                    let msg = new icmsg.DungeonHangStatusReq();
                    msg.stageId = this.stageId;
                    NetManager.send(msg);
                }
            }
        }
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.e.targetOff(this);
        this._removeHangTimer();
    }

    getReward() {
        let m = ModelManager.get(MainLineModel);
        if (m.rewardList.length > 0) {
            // 领取奖励
            // let msg = new DungeonHangRewardReq();
            // msg.stageId = this.copyModel.hangStageId;
            // NetManager.send(msg);
            //挂机预览
            let msg = new icmsg.DungeonHangPreviewReq()
            msg.dungeonId = CopyType.MAIN
            NetManager.send(msg, (data: icmsg.DungeonHangPreviewRsp) => {
                gdk.panel.setArgs(PanelId.MainHangPreReward, data)
                gdk.panel.open(PanelId.MainHangPreReward)
            })

        } else {
            let now = Math.floor(GlobalUtil.getServerTime() / 1000);
            let hmsg = this.copyModel.hangStateMsg;
            let remain = this.copyCfg.search - (now - hmsg.exploreTime);
            if (remain <= 0) {
                // 剩余时间小于0，又没有奖励，可能是后端出现异常了
                let msg = new icmsg.DungeonHangStatusReq();
                msg.stageId = this.stageId;
                NetManager.send(msg, (rmsg: icmsg.DungeonHangStatusRsp) => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    if (!rmsg.goodsList.length) return;
                    this.getReward();
                }, this);
            } else if (remain < 60) {
                // 小于一分钟，显示具体的秒
                GlobalUtil.showMessageAndSound(StringUtils.format(
                    gdk.i18n.t("i18n:HANG_REWARD_S"),
                    remain,
                ))
            } else {
                // 大于一分钟，显示分钟
                GlobalUtil.showMessageAndSound(StringUtils.format(
                    gdk.i18n.t("i18n:HANG_REWARD_M"),
                    Math.floor(remain / 60),
                ))
            }
        }
    }

    _updateHangInfo() {
        let msg = this.copyModel.hangStateMsg;
        let has = msg.goodsList.length > 0;
        let now = Math.floor(GlobalUtil.getServerTime() / 1000);
        this._vipAddTime = 0
        let vipCfg = ConfigManager.getItemByField(VipCfg, "level", this.roleModel.vipLv)
        if (vipCfg) {
            this._vipAddTime = vipCfg.vip5
        }


        // 到达探索上限
        if (now - msg.startTime >= this.copyCfg.search_limit + this._vipAddTime) {
            if (this.progress) {
                this.progress.progress = 1;
            }
            this._removeHangTimer();
            this._showHangTime(this.copyCfg.search_limit + this._vipAddTime);
        } else {
            this._updateHangTimer();
            this._updateTime();
        }
        this.model.rewardList = msg.goodsList;
        // this.spine.animation = has ? 'idle' : 'stand';
        gdk.e.emit(CopyEventId.UPDATE_COPY_MAIN_REWARD);
    }

    _updateHangTimer() {
        if (this.setupTimer) return;
        this.setupTimer = true;
        this.schedule(this._updateTime, 0.25);
    }

    _removeHangTimer() {
        if (!this.setupTimer) return;
        this.setupTimer = false;
        this.unschedule(this._updateTime);
    }

    _updateTime() {
        let now = Math.floor(GlobalUtil.getServerTime() / 1000);
        let hmsg = this.copyModel.hangStateMsg;
        let remain = this.copyCfg.search - (now - hmsg.exploreTime);
        if (remain <= 0) {
            // 当前探索时间到，重新请求数据
            // let msg = new DungeonHangStatusReq();
            // msg.stageId = this.stageId;
            // NetManager.send(msg);
        }
        this._showHangTime(Math.min(
            now - hmsg.startTime,
            this.copyCfg.search_limit + this._vipAddTime,
        ));
        if (this.progress) {
            this.progress.progress = (now - hmsg.startTime) / (this.copyCfg.search_limit + this._vipAddTime);
        }
    }

    _showHangTime(num: number) {
        // let actNames = 
        this.time.string = timeFormat(Math.max(0, num));
        if (!this.hangTimeLv || this.hangTimeLv.length <= 0) {
            this.hangTimeLv = ConfigManager.getItemByField(GlobalCfg, 'key', 'on_look').value;
        }
        let min = Math.max(0, num) / 60;
        this.spine.node.active = min >= this.hangTimeLv[0];
        this.normalBox.active = min < this.hangTimeLv[0];
        if (min >= this.hangTimeLv[2]) {
            if (this.spine.node.active && this.spine.animation != this.actNames[2]) {
                this.spine.animation = this.actNames[2];
                this.node.setPosition(this.pos[2]);
                this.node.getChildByName('btn').width = 500;
            }
        }
        else if (min >= this.hangTimeLv[1]) {
            if (this.spine.node.active && this.spine.animation != this.actNames[1]) {
                this.spine.animation = this.actNames[1];
                this.node.setPosition(this.pos[1]);
                this.node.getChildByName('btn').width = 250;
            }
        }
        else {
            if (this.spine.node.active && this.spine.animation != this.actNames[0]) {
                this.spine.animation = this.actNames[0];
                this.node.setPosition(this.pos[0]);
                this.node.getChildByName('btn').width = 130;
            }
            if (!this.spine.node.active) {
                this.node.setPosition(this.pos[0]);
                this.node.getChildByName('btn').width = 130;
            }
        }
    }
}
