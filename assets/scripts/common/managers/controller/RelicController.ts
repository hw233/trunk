import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ConfigManager from '../ConfigManager';
import GlobalUtil from '../../utils/GlobalUtil';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RelicMainViewCtrl from '../../../view/relic/ctrl/RelicMainViewCtrl';
import RelicMapViewCtrl from '../../../view/relic/ctrl/RelicMapViewCtrl';
import RelicModel from '../../../view/relic/model/RelicModel';
import RelicUtils from '../../../view/relic/utils/RelicUtils';
import RoleModel from '../../models/RoleModel';
import { RedPointEvent } from '../../utils/RedPointUtils';
import { Relic_mapCfg } from '../../../a/config';
import { RelicEventId } from '../../../view/relic/enum/RelicEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-28 09:56:14 
  */
export default class RelicController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return [
            [RelicEventId.MAP_CITY_INFO_CHANGE_BACK_UP_FOR_NOT_BROAD_CAST, this._onRelicNotBroadcastPoint],
        ]
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.RelicPointListRsp.MsgType, this._onRelicPointListRsp, this],
            [icmsg.RelicPointDetailRsp.MsgType, this._onRelicPointDetailRsp, this],
            [icmsg.RelicGiveUpRsp.MsgType, this._onRelicGiveUpRsp, this],
            [icmsg.RelicPointExploreRsp.MsgType, this._onRelicPointExplorRsp, this],
            [icmsg.RelicBroadcastPointRsp.MsgType, this._onRelicBroadcastPointRsp, this],
            [icmsg.RelicFightOverRsp.MsgType, this._onRelicFightOverRsp, this],
            [icmsg.SystemRedPointListRsp.MsgType, this._onSystemRedPointListRsp, this],
            [icmsg.RelicExploreTimesRsp.MsgType, this._onRelicExploreTimesRsp, this],
            [icmsg.SystemRedPointCancelRsp.MsgType, this._onSystemRedPointCancelRsp, this],
            [icmsg.RelicQueryRewardsRsp.MsgType, this._onRelicQueryRewardsRsp, this],
            [icmsg.RelicFetchRewardsRsp.MsgType, this._onRelicFetchRewardsRsp, this],
            [icmsg.RelicFightClearCDRsp.MsgType, this._onRelicFightClearCDRsp, this],
            [icmsg.RelicFightStartRsp.MsgType, this._onRelicFightStartRsp, this],
            [icmsg.RelicTransferNoticeRsp.MsgType, this._onRelicTransferNoticeRsp, this],
            [icmsg.RelicTransferConfirmRsp.MsgType, this._onRelicTransferConfirmRsp, this],
            [icmsg.RelicUnderAttackNoticeRsp.MsgType, this._onRelicUnderAttackNoticeRsp, this],
            [icmsg.RelicGuildRankRsp.MsgType, this._onRelicGuildRankRsp, this],
            [icmsg.RelicCertStateRsp.MsgType, this._onRelicCertStateRsp, this],
            [icmsg.RelicCertRewardRsp.MsgType, this._onRelicCertRewardRsp, this],
            [icmsg.RelicFightRankRsp.MsgType, this._onRelicClearRankRsp, this],
            [icmsg.RelicClearRankRsp.MsgType, this._onRelicClearRankRsp, this],
        ];
    }

    model: RelicModel = null;
    onStart() {
        this.model = ModelManager.get(RelicModel);
    }

    onEnd() {
        this.model = null;
    }

    /**战争遗迹----据点列表 */
    _onRelicPointListRsp(resp: icmsg.RelicPointListRsp) {
        this.model.exploreTimes = resp.exploreTimes;
        this.model.extraExploreTimes = resp.exploreExtra;
        this.model.cityDataMap[resp.mapType] = {};
        this.model.mapNumId = RelicUtils.getNumCfgIdByYdLoginNum(resp.ydLoginNum);
        let rM = ModelManager.get(RoleModel);
        let serverId = GlobalUtil.getSeverIdByPlayerId(rM.id);
        if (this.model.curExploreCity && this.model.curExploreCity.length > 0) {
            let mapType = this.model.curExploreCity.split('-')[0];
            if (resp.mapType == parseInt(mapType)) {
                this.model.curExploreCity = '';
            }
        }
        resp.pointList.forEach(p => {
            this.model.cityDataMap[resp.mapType][p.pointId] = p;
            if (serverId === p.serverId && rM.name === p.ownerName) {
                this.model.curExploreCity = `${resp.mapType}-${p.pointId}`;
            }
            gdk.e.emit(RelicEventId.MAP_CITY_INFO_CHANGE, [resp.mapType, p.pointId]);
        });
    }

    /**据点详情 */
    _onRelicPointDetailRsp(resp: icmsg.RelicPointDetailRsp) {
        //更新维护地图上据点的信息
        let mapType = ConfigManager.getItemById(Relic_mapCfg, this.model.mapId).mapType;
        if (resp.defenders.length == 0 && resp.freezeTime <= 0) {
            delete this.model.cityDataMap[mapType][resp.pointId];
        }
        else {
            let info = new icmsg.RelicPoint();
            info.pointId = resp.pointId;
            info.serverId = resp.defenders.length == 0 ? 0 : GlobalUtil.getSeverIdByPlayerId(resp.defenders[0].brief.id);
            info.ownerName = resp.defenders.length == 0 ? '' : resp.defenders[0].brief.name;
            info.guildName = resp.guildName;
            info.defenderNum = resp.defenders.length;
            info.outputTime = resp.outputTime;
            info.fightTime = resp.fightTime;
            info.exploreRate = resp.exploreRate;
            info.freezeTime = resp.freezeTime;
            this.model.cityDataMap[mapType][resp.pointId] = info;
        }
        gdk.e.emit(RelicEventId.MAP_CITY_INFO_CHANGE, [mapType, resp.pointId]);
    }

    /**放弃据点 */
    _onRelicGiveUpRsp(resp: icmsg.RelicGiveUpRsp) {
        let str = this.model.curExploreCity;
        if (!str || str.length <= 0) return;
        let mapType = parseInt(str.split('-')[0]);
        let cityId = parseInt(str.split('-')[1]);
        this.model.curExploreCity = '';
        delete this.model.cityDataMap[mapType][cityId];
        gdk.e.emit(RelicEventId.MAP_CITY_INFO_CHANGE, [mapType, cityId]);
    }

    /**开始探索 */
    _onRelicPointExplorRsp(resp: icmsg.RelicPointExploreRsp) {
        this.model.curExploreCity = `${resp.mapType}-${resp.pointId}`;
    }

    /**据点更新,后端未广播 */
    _onRelicNotBroadcastPoint(e) {
        // let resp = e.data;
        // this._onRelicBroadcastPointRsp(resp);
    }

    /**据点广播 */
    _onRelicBroadcastPointRsp(resp: icmsg.RelicBroadcastPointRsp) {
        if (resp.point) {
            let str = this.model.curExploreCity;
            if (str && str.length > 0) {
                let mapType = parseInt(str.split('-')[0]);
                let cityId = parseInt(str.split('-')[1]);
                if (resp.mapType == mapType && resp.point.pointId == cityId) {
                    if (resp.point.ownerName !== ModelManager.get(RoleModel).name) {
                        this.model.curExploreCity = '';
                    }
                }
            }
            //更新维护地图上据点的信息
            let mapType = resp.mapType;
            if ((!resp.point.ownerName || resp.point.ownerName.length <= 0) && resp.point.freezeTime <= 0) {
                RelicUtils.setPointMapData(mapType, resp.point.pointId, null); //清除地图数据缓存
                delete this.model.cityDataMap[mapType][resp.point.pointId];
            }
            else {
                let info = this.model.cityDataMap[mapType][resp.point.pointId];
                if (info && info.ownerName !== resp.point.ownerName) {
                    RelicUtils.setPointMapData(mapType, resp.point.pointId, null); //清除地图数据缓存
                }
                this.model.cityDataMap[mapType][resp.point.pointId] = resp.point;
            }
            gdk.e.emit(RelicEventId.MAP_CITY_INFO_CHANGE, [mapType, resp.point.pointId]);
            gdk.e.emit(RelicEventId.RELIC_BROAD_CAST_POINT, [mapType, resp.point.pointId]);
        }
    }

    /**领取探索奖励 */
    _onRelicFetchRewardsRsp(resp: icmsg.RelicFetchRewardsRsp) {
        this.model.curExploreReward = null;
        let req = new icmsg.SystemRedPointCancelReq();
        req.eventId = 51002;
        NetManager.send(req);
    }

    /**抢夺结束 */
    _onRelicFightOverRsp(resp: icmsg.RelicFightOverRsp) {
        let req = new icmsg.RelicPointDetailReq();
        req.mapType = parseInt(this.model.curAtkCity.split('-')[0]);
        req.pointId = resp.pointId;
        NetManager.send(req, null, this);
        this.model.curAtkCity = '';
        if (resp.canExplore) {
            RelicUtils.setPointMapData(req.mapType, resp.pointId, null); //清除地图数据缓存
            this.model.curExploreCity = `${req.mapType}-${resp.pointId}`;
        }
    }

    /**系统-红点列表 */
    _onSystemRedPointListRsp(resp: icmsg.SystemRedPointListRsp) {
        //红点
        this.model.RedPointEventIdMap = {};
        resp.list.forEach(id => {
            this.model.RedPointEventIdMap[id] = true;
            if (id == 51002) {
                this.model.curExploreCity = '';
            }
        });
        this.model.RedPointEventIdMap = this.model.RedPointEventIdMap;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**系统-红点删除 */
    _onSystemRedPointCancelRsp(resp: icmsg.SystemRedPointCancelRsp) {
        if (this.model.RedPointEventIdMap[resp.eventId]) {
            delete this.model.RedPointEventIdMap[resp.eventId];
            this.model.RedPointEventIdMap = this.model.RedPointEventIdMap;
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        }
    }

    /**探索次数更新 */
    _onRelicExploreTimesRsp(resp: icmsg.RelicExploreTimesRsp) {
        this.model.exploreTimes = resp.number;
        this.model.extraExploreTimes = resp.extra;
    }

    /**探索奖励查询 */
    _onRelicQueryRewardsRsp(resp: icmsg.RelicQueryRewardsRsp) {
        this.model.curExploreReward = resp;
        if (!resp.rewards || resp.rewards.length <= 0) {
            if (this.model.RedPointEventIdMap[51002]) {
                let req = new icmsg.SystemRedPointCancelReq();
                req.eventId = 51002;
                NetManager.send(req);
            }
        }
        else {
            if (!this.model.RedPointEventIdMap[51002]) {
                this.model.RedPointEventIdMap[51002] = true;
                this.model.RedPointEventIdMap = this.model.RedPointEventIdMap;
                gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
            }
        }
    }

    /**清除进攻CD */
    _onRelicFightClearCDRsp(resp: icmsg.RelicFightClearCDRsp) {
    }

    /**开始战斗 */
    _onRelicFightStartRsp(resp: icmsg.RelicFightStartRsp) {
    }

    /**转让据点通知 */
    _onRelicTransferNoticeRsp(resp: icmsg.RelicTransferNoticeRsp) {
        let key = `${resp.ownerBrief.id}_${resp.mapType}_${resp.pointId}`; //唯一性
        if (!this.model.pointTransNoticeList) this.model.pointTransNoticeList = {};
        if (!this.model.pointTransNoticeList[key]) {
            this.model.pointTransNoticeList[key] = resp;
            this.model.pointTransNoticeList = this.model.pointTransNoticeList;
            let cb = () => {
                if (!gdk.panel.isOpenOrOpening(PanelId.RelicPointReciveListView)) {
                    gdk.panel.open(PanelId.RelicPointReciveListView);
                }
            };
            if (gdk.panel.isOpenOrOpening(PanelId.PveScene)) {
                let n = gdk.panel.get(PanelId.PveScene);
                n.onHide.on(() => {
                    n.onHide.targetOff(this);
                    cb();
                }, this);
            }
            else {
                cb();
            }
        }
    }

    /**转让据点确认返回 */
    _onRelicTransferConfirmRsp(resp: icmsg.RelicTransferConfirmRsp) {
        this.model.curExploreCity = `${resp.mapType}-${resp.pointId}`;
        if (gdk.panel.isOpenOrOpening(PanelId.RelicPointReciveListView)) {
            gdk.panel.hide(PanelId.RelicPointReciveListView);
            this.model.pointTransNoticeList = {};
            let cb = () => {
                this.model.jumpArgs = `${resp.mapType}-${resp.pointId}`;
                gdk.panel.open(PanelId.RelicMainView);
            };

            let relicMapView = gdk.panel.get(PanelId.RelicMapView);
            if (relicMapView) {
                let ctrl = relicMapView.getComponent(RelicMapViewCtrl);
                if (ctrl.mapType == resp.mapType) {
                    gdk.panel.hide(PanelId.RelicPointDetailsView);
                    gdk.e.emit(RelicEventId.MOVE_TO_TARGET_CITY, resp.pointId);
                }
                else {
                    gdk.panel.hide(PanelId.RelicMapView);
                    cb();
                }
            }
            else {
                let relicMainView = gdk.panel.get(PanelId.RelicMainView);
                if (relicMainView) {
                    let ctrl = relicMainView.getComponent(RelicMainViewCtrl);
                    this.model.jumpArgs = `${resp.mapType}-${resp.pointId}`;
                    ctrl.onEnterBtnClick(true, resp.mapType);
                }
                else {
                    cb();
                }
            }
        }
    }

    /**据点被攻击通知 */
    _onRelicUnderAttackNoticeRsp(resp: icmsg.RelicUnderAttackNoticeRsp) {
        if (!this.model.atkNoticeList) this.model.atkNoticeList = [];
        this.model.atkNoticeList.push(resp);
        this.model.miniChatatkNoticeVisible = true;
    }

    /**战争遗迹 公会排行榜 */
    _onRelicGuildRankRsp(resp: icmsg.RelicGuildRankRsp) {
        this.model.rankInfo = [];
        this.model.myRankInfo = null;
        this.model.myRankNum = 999;
        this.model.crossServerNum = resp.serverNum;
        let rM = ModelManager.get(RoleModel);
        resp.rankList.forEach((l, idx) => {
            this.model.rankInfo.push(l);
            if (l.id == rM.guildId && l.name == rM.guildName) {
                this.model.myRankInfo = l;
                this.model.myRankNum = idx;
            }
        });
    }

    /**遗迹之证领取状态 */
    _onRelicCertStateRsp(data: icmsg.RelicCertStateRsp) {
        this.model.isBuyPassPort = data.bought;
        this.model.passPortFreeReward = data.rewarded1;
        this.model.passPortChargeReward = data.rewarded2;
    }

    _onRelicCertRewardRsp(data: icmsg.RelicCertRewardRsp) {
        this.model.passPortFreeReward = data.rewarded1;
        this.model.passPortChargeReward = data.rewarded2;
    }

    _onRelicClearRankRsp(resp: icmsg.RelicFightRankRsp | icmsg.RelicClearRankRsp) {
        this.model.relicAtkRankList = resp.rankList;
        this.model.relicAtkMyRankOrder = resp.rankMine || -1;
        this.model.relicAtkMyRank = null;
        let rM = ModelManager.get(RoleModel);
        for (let i = 0; i < resp.rankList.length; i++) {
            if (resp.rankList[i].brief.id == rM.id) {
                this.model.relicAtkMyRank = resp.rankList[i];
                return;
            }
        }
    }
}
