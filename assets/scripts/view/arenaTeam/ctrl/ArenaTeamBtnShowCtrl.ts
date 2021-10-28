import ActUtil from '../../act/util/ActUtil';
import ArenaTeamViewModel from '../model/ArenaTeamViewModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import { RedPointEvent } from '../../../common/utils/RedPointUtils';


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // @property(cc.Node)
    // redNode: cc.Node = null;

    get model(): ArenaTeamViewModel { return ModelManager.get(ArenaTeamViewModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    onEnable() {
        //let show = false;
        // show = ActUtil.ifActOpen(76);
        // this.redNode.active = false;
        // if (show) {
        //     NetManager.send(new icmsg.ArenaTeamInvitersReq(), (rsp: icmsg.ArenaTeamInvitersRsp) => {
        //         if (rsp.inviters.length > 0) {
        //             this.model.inviterRed = true;
        //             if (!this.redNode.active) {
        //                 this.redNode.active = true;
        //             }
        //         }
        //     }, this)
        // }
        // if (!show) {
        //     show = ActUtil.ifActOpen(77);
        //     if (!show) {
        //         if (ActUtil.ifActOpen(78)) {
        //             let startTime = ActUtil.getActStartTime(78) / 1000;
        //             let curTime = GlobalUtil.getServerTime() / 1000;
        //             let temNum = curTime - startTime
        //             if (temNum < 24 * 60 * 60) {
        //                 show = true;
        //             }
        //         }
        //     }
        // }
        this.node.on(cc.Node.EventType.CHILD_ADDED, this._adjustSiblingIndex, this);
        this.node.on(cc.Node.EventType.CHILD_REMOVED, this._adjustSiblingIndex, this);
        this.node.on(cc.Node.EventType.CHILD_REORDER, this._adjustSiblingIndex, this);
        this.node.opacity = 1;
        this.node.width = this.node.height = 0;
        if (ActUtil.ifActOpen(75) && this.roleModel.level >= this.model.mainCfg.icon_level) {
            let msg = new icmsg.ArenaTeamInfoReq();
            NetManager.send(msg, (rsp: icmsg.ArenaTeamInfoRsp) => {
                this.model.arenaTeamInfo = rsp.teamInfo;
                this.model.matchInfo = rsp.matchInfo;
                this.model.fightRewarded = rsp.fightRewarded
                this.model.rankRewarded = rsp.rankRewarded;
                this.model.actId = rsp.activityId
                gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
                // if (!this.redNode.active) {
                //     this.redNode.active = RedPointUtils.is_ArenaTeam_show_redpoint(true);
                // }
                if (rsp.activityId > 0) {
                    if (rsp.activityId == 78) {
                        let startTime = ActUtil.getActStartTime(78) / 1000;
                        let curTime = GlobalUtil.getServerTime() / 1000;
                        let temNum = curTime - startTime
                        if (temNum < 24 * 60 * 60) {
                            this.node.width = this.node.height = 110;
                            this.node.opacity = 255;
                            this.node.active = true
                            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 29);
                            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
                        } else {
                            this.node.active = false;
                        }
                    } else {
                        this.node.width = this.node.height = 110;
                        this.node.opacity = 255;
                        this.node.active = true
                        gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 29);
                        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
                    }
                }
                else {
                    this.node.active = false
                }
            }, this)
        } else {
            this.node.active = false;
        }
        //等级不够隐藏按钮
        // if (this.roleModel.level < this.model.mainCfg.icon_level) {
        //     show = false;
        // }
        // this.node.active = show;
    }

    onDisable() {
        NetManager.targetOff(this);
        this.node.targetOff(this);
    }

    _adjustSiblingIndex() {
        let redPoint = this.node.getChildByName('RedPoint');
        if (redPoint) {
            redPoint.setPosition(35, 32);
        }
    }
}
