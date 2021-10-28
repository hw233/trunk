import ArenaModel from '../../models/ArenaModel';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import PanelId from '../../../configs/ids/PanelId';
import { ArenaEvent } from '../../../view/arena/enum/ArenaEvent';

/**
 * 竞技场信息控制器
 * @Author: jijing.liu
 * @Date: 2019-04-08 10:19:06
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-03-22 20:17:43
 */

export default class ArenaController extends BaseController {

    private model: ArenaModel = null;

    get gdkEvents(): GdkEventArray[] {
        return [];
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.ArenaInfoRsp.MsgType, this._onArenaInfoRsp],
            [icmsg.ArenaMatchRsp.MsgType, this._onArenaMatchRsp],
            [icmsg.ArenaDefenceRsp.MsgType, (msg: icmsg.ArenaDefenceRsp) => {
                this.model.battleArrayMsg = msg;
                gdk.e.emit(ArenaEvent.RSP_ARENA_BATTLE_ARRAY);
            }],
            [icmsg.ArenaDefenceSetRsp.MsgType, (msg: icmsg.ArenaDefenceSetRsp) => {
                gdk.e.emit(ArenaEvent.RSP_ARENA_BATTLE_ARRAY_SET);
            }],
            [icmsg.ArenaBuyRsp.MsgType, (msg: icmsg.ArenaBuyRsp) => {
                this.model.fightNum = msg.fightNum;
                this.model.buyNum = msg.buyNum;
                gdk.e.emit(ArenaEvent.RSP_ARENA_BUY);
            }],
            [icmsg.ArenaQueryRsp.MsgType, (msg: icmsg.ArenaQueryRsp) => {
                gdk.e.emit(ArenaEvent.RSP_ARENA_QUERY, msg.player);
            }],
            [icmsg.RankDetailRsp.MsgType, (msg: icmsg.RankDetailRsp) => {
                this.model.list = msg.list;
                gdk.e.emit(ArenaEvent.RSP_ARENA_RANK);
            }],
            [icmsg.ArenaFightResultRsp.MsgType, (msg: icmsg.ArenaFightResultRsp) => {
                gdk.e.emit(ArenaEvent.RSP_ARENA_RESULT, msg);
            }],
            [icmsg.ArenaRaidRsp.MsgType, this._onArenaRaidRsp]
        ];
    }


    onStart() {
        this.model = ModelManager.get(ArenaModel);
    }

    onEnd() {
        this.model = null;
    }

    //获取副本数据成功
    _onArenaInfoRsp(msg: icmsg.ArenaInfoRsp) {
        this.model.isArenaInfoGet = true;
        this.model.buyNum = msg.buyNum ? msg.buyNum : 0;
        this.model.fightNum = msg.fightNum ? msg.fightNum : 0;
        this.model.points = msg.points ? msg.points : 0;
        this.model.score = msg.score ? msg.score : 0;
        this.model.rank = msg.rankNum ? msg.rankNum : 0;
        this.model.awardNums = msg.awardNums ? msg.awardNums : [];
        this.model.raidTime = msg.raidTime;
        this.model.raidTimes = msg.raidTimes;
        msg.logList.sort((a, b) => {
            return b.fightTime - a.fightTime;
        });
        this.model.logList = msg.logList;
        gdk.e.emit(ArenaEvent.RSP_ARENA_INFO);
    }

    _onArenaMatchRsp(msg: icmsg.ArenaMatchRsp) {
        this.model.matchPlayers = msg.players;
        this.model.matchTime = msg.matchTime;
        gdk.e.emit(ArenaEvent.RSP_ARENA_MATH);
    }

    _onArenaRaidRsp(resp: icmsg.ArenaRaidRsp) {
        gdk.panel.setArgs(PanelId.PveSceneWinPanel, resp);
        gdk.panel.open(PanelId.PveSceneWinPanel);
        NetManager.send(new icmsg.ArenaInfoReq());
        NetManager.send(new icmsg.ArenaMatchReq());
    }
}