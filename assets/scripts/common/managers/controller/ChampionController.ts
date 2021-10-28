import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ChampionModel from '../../../view/champion/model/ChampionModel';
import ModelManager from '../ModelManager';
import { RedPointEvent } from '../../utils/RedPointUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-23 13:41:02 
  */
export default class ChampionController extends BaseController {
    model: ChampionModel = null

    get gdkEvents(): GdkEventArray[] {
        return [];
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.ChampionRankingRsp.MsgType, this._onChampionRankingRsp, this],
            [icmsg.ChampionGuessRsp.MsgType, this._onChampionGuessRsp, this],
            [icmsg.ChampionGuessListRsp.MsgType, this._onChampionGuessListRsp, this],
            [icmsg.ChampionGuessFightResultRsp.MsgType, this._onChampionGuessFightResultRsp, this],
            [icmsg.ChampionRedPointsRsp.MsgType, this._onChampionRedPointsRsp, this],
            [icmsg.FightDefenceFailRsp.MsgType, this._onFightDefenceFailRsp, this],
            [icmsg.ChampionInfoRsp.MsgType, this._onChampionInfoRspRsp, this],
            [icmsg.ChampionMatchRsp.MsgType, this._onChampionMatchRsp, this],
            [icmsg.ChampionFightOverRsp.MsgType, this._onChampionFightOverRsp, this],
        ];
    }

    onStart() {
        this.model = ModelManager.get(ChampionModel)
    }

    onEnd() {
        this.model = null
    }

    /**排行榜数据返回 */
    _onChampionRankingRsp(resp: icmsg.ChampionRankingRsp) {
        this.model.rankList = resp.list;
        this.model.myRank = resp.playerRank;
        this.model.myPoints = resp.playerPoints;
    }

    _onChampionGuessRsp(resp: icmsg.ChampionGuessRsp) {
        this.model.guessList[resp.index].playerId = resp.playerId;
        this.model.guessList[resp.index].score = resp.score;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    _onChampionGuessListRsp(resp: icmsg.ChampionGuessListRsp) {
        this.model.guessList = resp.list;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    _onChampionGuessFightResultRsp() {
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**锦标赛红点数据 */
    _onChampionRedPointsRsp(resp: icmsg.ChampionRedPointsRsp) {
        this.model.redInfoData = resp;
        resp.exchanged.forEach(info => {
            this.model.exchangedInfo[info.id] = info.num;
        });
        this.model.myPoints = resp.points;
        if (!this.model.infoData) this.model.infoData = new icmsg.ChampionInfoRsp();
        this.model.infoData.seasonId = resp.seasonId;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    _onFightDefenceFailRsp(resp: icmsg.FightDefenceFailRsp) {
        if (resp.type == 0) {
            this.model.isDefLose = true;
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        }
    }

    _onChampionInfoRspRsp(resp: icmsg.ChampionInfoRsp) {
        this.model.infoData = resp;
        this.model.reMatchTimes = resp.reMatch;
    }

    _onChampionMatchRsp(resp: icmsg.ChampionMatchRsp) {
        this.model.reMatchTimes = resp.reMatch;
    }

    _onChampionFightOverRsp(resp: icmsg.ChampionFightOverRsp) {
        this.model.reMatchTimes = resp.reMatch;
    }
}
