/** 
  * @Description: 签到数据
  * @Author: weiliang.huang  
  * @Date: 2019-06-14 21:16:39 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-09-09 18:08:38
*/
export default class SignModel {
  signed: boolean = false; //今天是否已经签到

  count: number = 0; //月已经签到的次数

  buCount: number = 0; //月补签的次数

  max_bu: number = 2;  // 最大补签次数

  signPay: boolean = false//今天是否充值签到

  signPayAvailable: boolean = false//能否领取充值签到

  showSign: boolean = false; // 本次登录是否检测过显示登录界面
}