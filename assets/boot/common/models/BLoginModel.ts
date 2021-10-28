/**
 * 登录相关信息
 * @Author: sthoo.huang
 * @Date: 2019-04-08 10:18:00
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-07 16:25:39
 */
class BLoginModel {

    account: string;
    serverId: number;
    channelId: number;
    channelCode: string;
    token: string;
    sessionId: number;
    brand: string;  // 手机品牌;
    model: string;  // 手机机型;
    isFirstLogin: boolean;  // 是否为首次登录（当天）
    serverOpenTime: number//开服时间 
    operateMap: any = {}//操作记录
}

iclib.addProp('LoginModel', BLoginModel);
export default BLoginModel;