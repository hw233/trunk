import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import EnergyModel from '../../../view/energy/model/EnergyModel';
import ModelManager from '../ModelManager';
import { RedPointEvent } from '../../utils/RedPointUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-27 10:46:08 
  */
export default class EnergyController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return []
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.EnergyStationInfoRsp.MsgType, this._onEnergyStationInfoRsp],
            [icmsg.EnergyStationUnlockRsp.MsgType, this._onEnergyStationUnlockRsp],
            [icmsg.EnergyStationUpgradeRsp.MsgType, this._onEnergyStationUpgradeRsp],
            [icmsg.EnergyStationAdvanceRsp.MsgType, this._onEnergyStationAdvanceRsp],
            [icmsg.EnergyStationRedPointRsp.MsgType, this._onEnergyStationRedPointRsp],
        ]
    }

    model: EnergyModel = null
    onStart() {
        this.model = ModelManager.get(EnergyModel)
        this.model.energyStationInfo = {};
    }

    onEnd() {
        this.model = null;
    }

    /**能量站信息 */
    _onEnergyStationInfoRsp(resp: icmsg.EnergyStationInfoRsp) {
        resp.info.forEach(i => {
            this.model.energyStationInfo[i.stationId] = i;
        });
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**能量站解锁 */
    _onEnergyStationUnlockRsp(resp: icmsg.EnergyStationUnlockRsp) {
        this.model.energyStationInfo[resp.info.stationId] = resp.info;
    }

    /**能量站升级 */
    _onEnergyStationUpgradeRsp(resp: icmsg.EnergyStationUpgradeRsp) {
        this.model.energyStationInfo[resp.info.stationId] = resp.info;
    }

    /**能量站升阶 */
    _onEnergyStationAdvanceRsp(resp: icmsg.EnergyStationAdvanceRsp) {
        this.model.energyStationInfo[resp.info.stationId] = resp.info;
    }

    /**能量站红点 */
    _onEnergyStationRedPointRsp(resp: icmsg.EnergyStationRedPointRsp) {
        this.model.energyStationInfo[resp.info.stationId] = resp.info;
    }
}
