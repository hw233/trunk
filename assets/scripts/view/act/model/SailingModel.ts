import ActivityUtils from '../../../common/utils/ActivityUtils';
import ActUtil from '../util/ActUtil';
import SailingBoxCtrl from '../ctrl/sailing/SailingBoxCtrl';
import SailingPointCtrl from '../ctrl/sailing/SailingPointCtrl';
import { Sailing_mapCfg } from '../../../a/config';
/** 
 * @Description: 远航寻宝model
 * @Author: luoyong
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-04 17:25:26
 */

//点信息 
export type SailingPointInfo = {
    id: number,
    type: number,
    mapPoint: cc.Vec2,
    pos: cc.Vec2,
    cfg: Sailing_mapCfg,
}

//路径信息 
export type SailingPathInfo = {
    id: number,
    type: number,
    mapPoint: cc.Vec2,
    pos: cc.Vec2,
}

export default class SailingModel {

    pointDatas: { [key: string]: SailingPointInfo[] } = {}
    pointCtrlMap: { [key: string]: SailingPointCtrl } = {}
    boxCtrlMap: { [key: string]: SailingBoxCtrl } = {}

    sailingInfo: icmsg.ActivitySailingInfoRsp;  //远航寻宝-状态

    isOpenTreasure = false //是否打开寻宝界面

    get activityType(): number {
        let id = 123
        return ActUtil.getActRewardType(id)
    }
}