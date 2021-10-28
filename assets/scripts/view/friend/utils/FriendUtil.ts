import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import TimerUtils from '../../../common/utils/TimerUtils';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-06-28 16:08:53 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



export default class FriendUtil {

  /**
   * 返回[当日好友请求数 , 当日好友添加数量]
   */
  static getFriendDailyLimits() {
    let time = TimerUtils.getZerohour(GlobalUtil.getServerTime() / 1000);
    let model = ModelManager.get(RoleModel);
    let cookie = model.cookie;
    let obj = {};
    if (cookie) obj = JSON.parse(cookie);
    if (!obj["friendLimits"]) obj["friendLimits"] = {};
    if (!obj["friendLimits"][time]) obj["friendLimits"][time] = {};
    if (!obj["friendLimits"][time]["requestFriendNum"]) obj["friendLimits"][time]["requestFriendNum"] = 0;
    if (!obj["friendLimits"][time]["addFriendNum"]) obj["friendLimits"][time]["addFriendNum"] = 0;
    return [obj["friendLimits"][time]["requestFriendNum"], obj["friendLimits"][time]["addFriendNum"]]
  }

  /**
   * 存储当日好友请求数以及好友添加数量
   * @param type 1-当日好友请求数 2-当日好友添加数量
   */
  static setFriendDailyLimits(type: number) {
    let time = TimerUtils.getZerohour(GlobalUtil.getServerTime() / 1000);
    let model = ModelManager.get(RoleModel);
    let cookie = model.cookie;
    let obj = {};
    if (cookie) obj = JSON.parse(cookie);
    if (!obj["friendLimits"]) obj["friendLimits"] = {};
    if (!obj["friendLimits"][time]) {
      obj["friendLimits"] = {};
      obj["friendLimits"][time] = {};
    }
    if (type == 1) {
      if (!obj["friendLimits"][time]["requestFriendNum"]) obj["friendLimits"][time]["requestFriendNum"] = 1;
      else obj["friendLimits"][time]["requestFriendNum"] += 1;
    }
    else {
      if (!obj["friendLimits"][time]["addFriendNum"]) obj["friendLimits"][time]["addFriendNum"] = 1;
      else obj["friendLimits"][time]["addFriendNum"] += 1;
    }
    model.cookie = JSON.stringify(obj);
    let req = new icmsg.RoleCookieSetReq();
    req.cookie = model.cookie;
    NetManager.send(req);
  }
}
