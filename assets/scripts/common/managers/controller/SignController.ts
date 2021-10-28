import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import SignModel from '../../../view/sign/model/SignModel';
import SignUtil from '../../../view/sign/util/SignUtil';
import { RedPointEvent } from '../../utils/RedPointUtils';

/** 
  * @Description: 背包通信器
  * @Author: weiliang.huang  
  * @Date: 2019-05-27 17:35:16 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 10:47:55
*/

export default class SignController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return []
    }
    get netEvents(): NetEventArray[] {
        return [
            [icmsg.SignInfoRsp.MsgType, this._onSignInfoRsp],
            [icmsg.SignLoginRsp.MsgType, this._onSignLoginRsp],
            [icmsg.SignBuRsp.MsgType, this._onSignBuRsp],
        ];
    }
    model: SignModel = null

    onStart() {
        this.model = ModelManager.get(SignModel)
    }

    onEnd() {
        this.model = null
    }

    reqBuqian() {
        let msg = new icmsg.SignBuReq()
        NetManager.send(msg)
    }

    _onSignInfoRsp(data: icmsg.SignInfoRsp) {
        this.model.signPay = data.info.signPay
        this.model.signPayAvailable = data.info.signPayAvailable
        this.model.signed = data.info.signed
        this.model.buCount = data.info.buCount
        this.model.count = data.info.count
        SignUtil.CheckOpenSign()
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    _onSignLoginRsp(data: icmsg.SignLoginRsp) {
        this.model.signed = true
        this.model.count = this.model.count + 1
        SignUtil.showSignReward(this.model.count)
    }

    _onSignBuRsp(data: icmsg.SignBuRsp) {
        this.model.buCount += 1
        this.model.count = this.model.count + 1
        SignUtil.showSignReward(this.model.count)
    }
}