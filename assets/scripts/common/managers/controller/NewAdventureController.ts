import { Store_pushCfg } from '../../../a/config';
import NewAdventureModel from '../../../view/adventure2/model/NewAdventureModel';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import RoleModel from '../../models/RoleModel';
import GlobalUtil from '../../utils/GlobalUtil';
import { RedPointEvent } from '../../utils/RedPointUtils';
import ConfigManager from '../ConfigManager';
import ModelManager from '../ModelManager';

/**
 * @Description: 探险控制器
 * @Author: luoyong
 * @Date: 2019-05-06 11:52:00
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-25 19:13:25
 */
export default class NewAdventureController extends BaseController {

    model: NewAdventureModel = null

    get gdkEvents(): GdkEventArray[] {
        return [];
    }

    get netEvents(): NetEventArray[] {
        return [
            // [AdventureStoreListRsp.MsgType, this._onAdventureStoreListRsp],
            [icmsg.Adventure2RankListRsp.MsgType, this._onAdventureRankListRsp],
            [icmsg.Adventure2PassListRsp.MsgType, this._onAdventurePassListRsp],
            [icmsg.Adventure2PassAwardRsp.MsgType, this._onAdventurePassAwardRsp],
            [icmsg.Adventure2StoreBuyRsp.MsgType, this._onAdventureStoreBuyRsp],
            [icmsg.StorePushListRsp.MsgType, this._onStorePushListRsp],
        ];
    }

    onStart() {
        this.model = ModelManager.get(NewAdventureModel)
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
    _onAdventurePassListRsp(resp: icmsg.Adventure2PassListRsp) {
        this.model.isBuyPassPort = resp.bought;
        this.model.passPortFreeReward = resp.rewarded1;
        this.model.passPortChargeReward = resp.rewarded2;
    }

    /**通行任务领奖返回 */
    _onAdventurePassAwardRsp(resp: icmsg.Adventure2PassAwardRsp) {
        this.model.passPortFreeReward = resp.rewarded1;
        this.model.passPortChargeReward = resp.rewarded2;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**商店购买 */
    _onAdventureStoreBuyRsp(resp: icmsg.Adventure2StoreBuyRsp) {
        this.model.adventureStoreBuyInfo[resp.storeItem.id] = resp.storeItem.remain;
    }

    _onAdventureRankListRsp(resp: icmsg.Adventure2RankListRsp) {
        this.model.adventRankInfo = resp.list;
        this.model.adventServerNum = resp.serverNum
        for (let i = 0; i < resp.list.length; i++) {
            if (resp.list[i].brief.id == ModelManager.get(RoleModel).id) {
                this.model.adventMyRankInfo = resp.list[i];
                //this.model.adventMyRankNum = i + 1
            }
        }
        this.model.adventMyRankNum = resp.ranking
    }

    _onStorePushListRsp(rsp: icmsg.StorePushListRsp) {
        let temData = []
        let curTime = GlobalUtil.getServerTime() / 1000
        rsp.list.forEach(data => {
            let temCfg = ConfigManager.getItemByField(Store_pushCfg, 'gift_id', data.giftId)
            let startTime = data.startTime
            let have = false;
            if (startTime > 0) {
                if (startTime + temCfg.duration > curTime) {
                    have = true;
                }
            }
            if (have && temCfg.event_type == 5 && data.remainNum > 0) {
                temData.push(data);
            }
        })
        this.model.GiftTime = temData
        if (this.model.GiftTime.length > 0 && this.model.firstEnterGame) {
            this.model.firstEnterGame = false;
            this.model.needShowPushView = true;
        }
    }

}