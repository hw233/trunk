import AdventureModel from '../../../view/adventure/model/AdventureModel';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import RoleModel from '../../models/RoleModel';
import { RedPointEvent } from '../../utils/RedPointUtils';
import ModelManager from '../ModelManager';

/**
 * @Description: 探险控制器
 * @Author: luoyong
 * @Date: 2019-05-06 11:52:00
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-02-02 16:25:56
 */
export default class AdventureController extends BaseController {

    model: AdventureModel = null

    get gdkEvents(): GdkEventArray[] {
        return [];
    }

    get netEvents(): NetEventArray[] {
        return [
            // [AdventureStoreListRsp.MsgType, this._onAdventureStoreListRsp],
            [icmsg.AdventureRankListRsp.MsgType, this._onAdventureRankListRsp],
            [icmsg.AdventurePassListRsp.MsgType, this._onAdventurePassListRsp],
            [icmsg.AdventurePassAwardRsp.MsgType, this._onAdventurePassAwardRsp],
            [icmsg.AdventureStoreBuyRsp.MsgType, this._onAdventureStoreBuyRsp],
        ];
    }

    onStart() {
        this.model = ModelManager.get(AdventureModel)
    }

    onEnd() {
        this.model = null
    }

    // _onAdventureStoreListRsp(resp: AdventureStoreListRsp) {
    //     resp.list.forEach(info => {
    //         this.model.adventureStoreBuyInfo[info.id] = info.remain;
    //     })
    // }

    /**通行证任务列表 */
    _onAdventurePassListRsp(resp: icmsg.AdventurePassListRsp) {
        this.model.isBuyPassPort = resp.bought;
        this.model.passPortFreeReward = resp.rewarded1;
        this.model.passPortChargeReward = resp.rewarded2;
    }

    /**通行任务领奖返回 */
    _onAdventurePassAwardRsp(resp: icmsg.AdventurePassAwardRsp) {
        this.model.passPortFreeReward = resp.rewarded1;
        this.model.passPortChargeReward = resp.rewarded2;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**商店购买 */
    _onAdventureStoreBuyRsp(resp: icmsg.AdventureStoreBuyRsp) {
        this.model.adventureStoreBuyInfo[resp.storeItem.id] = resp.storeItem.remain;
    }

    _onAdventureRankListRsp(resp: icmsg.AdventureRankListRsp) {
        this.model.adventRankInfo = resp.list;
        this.model.adventServerNum = resp.serverNum;
        this.model.adventMyRankNum = 0;
        for (let i = 0; i < resp.list.length; i++) {
            if (resp.list[i].brief.id == ModelManager.get(RoleModel).id) {
                this.model.adventMyRankInfo = resp.list[i];
                this.model.adventMyRankNum = i + 1
            }
        }

    }
}