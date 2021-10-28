import ActUtil from '../../../view/act/util/ActUtil';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import CombineModel from '../../../view/combine/model/CombineModel';
import CombineUtils from '../../../view/combine/util/CombineUtils';
import ModelManager from '../ModelManager';
import { CombineEventId } from '../../../view/combine/enum/CombineEventId';
import { RedPointEvent } from '../../utils/RedPointUtils';
import { StoreEventId } from '../../../view/store/enum/StoreEventId';

/**
 * @Description: 合服相关数据
 * @Author:luoyong
 * @Date: 2020-12-28 10:54:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-13 13:47:48
 */
export default class CombineController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return [
            [StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this],
        ]
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.MergeCarnivalStoreRsp.MsgType, this._onMergeCarnivalStoreRsp, this],
            [icmsg.MergeCarnivalStoreBuyRsp.MsgType, this._onMergeCarnivalStoreBuyRsp, this],
            [icmsg.MergeCarnivalStoreLeftRsp.MsgType, this._onMergeCarnivalStoreLeftRsp, this],
            [icmsg.MergeCarnivalStateRsp.MsgType, this._onMergeCarnivalStateRsp, this],
            [icmsg.MergeCarnivalCurServerRankRsp.MsgType, this._onMergeCarnivalCurServerRankRsp, this],
        ];
    }

    model: CombineModel = null
    onStart() {
        this.model = ModelManager.get(CombineModel)
    }

    onEnd() {
    }

    _onPaySucc(e: gdk.Event) {
        let data = <icmsg.PaySuccRsp>e.data;
        if (ActUtil.ifActOpen(105)) {
            this.model.restrictionRecharge += data.money;
            gdk.e.emit(CombineEventId.RESTRICTION_INFO_UPDATE);
        }
    }

    _onMergeCarnivalStoreRsp(resp: icmsg.MergeCarnivalStoreRsp) {
        this.model.restrictionRecharge = resp.money;
        this.model.restrictionStoreInfo = {};
        this.model.ydLoginNum = resp.ydLoginNum;
        resp.goods.forEach(g => {
            this.model.restrictionStoreInfo[g.money] = g;
        });
        gdk.e.emit(CombineEventId.RESTRICTION_INFO_UPDATE);
    }

    _onMergeCarnivalStoreBuyRsp(resp: icmsg.MergeCarnivalStoreBuyRsp) {
        this.model.restrictionStoreInfo[resp.goods.money] = resp.goods;
        gdk.e.emit(CombineEventId.RESTRICTION_INFO_UPDATE, { money: resp.goods.money });
    }

    _onMergeCarnivalStoreLeftRsp(resp: icmsg.MergeCarnivalStoreLeftRsp) {
        if (!this.model.restrictionStoreInfo[resp.money]) {
            let info = new icmsg.MergeCarnivalStoreGoods();
            info.bought = false;
            info.money = resp.money;
            info.left = resp.left;
            this.model.restrictionStoreInfo[resp.money] = info;
        }
        else {
            this.model.restrictionStoreInfo[resp.money].left = resp.left;
        }
        gdk.e.emit(CombineEventId.RESTRICTION_INFO_UPDATE, { money: resp.money });
    }


    _onMergeCarnivalStateRsp(data: icmsg.MergeCarnivalStateRsp) {
        this.model.playerScore = data.score
        this.model.playerRank = data.ranking
        this.model.exchangeRecord = CombineUtils.checkScoreRewards(data.exchangeRecord)
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    _onMergeCarnivalCurServerRankRsp(data: icmsg.MergeCarnivalCurServerRankRsp) {
        this.model.serverScore = data.score
        this.model.serverRank = data.ranking
    }

}