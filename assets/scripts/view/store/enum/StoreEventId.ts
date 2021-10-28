/** 
  * @Description: 商店事件id
  * @Author: weiliang.huang  
  * @Date: 2019-05-22 15:13:43 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-28 12:03:45
*/

export enum StoreEventId {
  UPDATE_SHOP_INFO = "UPDATE_SHOP_INFO", // 更新商店信息

  UPDATE_BLACK_ITEM = "UPDATE_BLACK_ITEM",  // 更新单项黑店信息
  UPDATE_SHOP_ITEM = "UPDATE_SHOP_ITEM",  // 更新单项道具信息
  UPDATE_SIEGE_SHOP_ITEM = "UPDATE_SIEGE_SHOP_ITEM",  // 更新丧尸攻城商店信息
  UPDATE_UNIQUE_SHOP_ITEM = "UPDATE_UNIQUE_SHOP_ITEM",  // 更新专属装备商店信息

  UPDATE_RUNE_ITEM = "UPDATE_RUNE_ITEM",  // 更新符文商店信息

  UPDATE_STORE_GIFT_LIST = "UPDATE_STORE_GIFT_LIST",//更新礼包购买信息

  UPDATE_PAY_SUCC = "UPDATE_PAY_SUCC", //购买成功
  UPDATE_MONTH_CARD_INFO = "UPDATE_MONTH_CARD_INFO", //特权卡的剩余时间更新
  UPDATE_PAY_FIRST = "UPDATE_PAY_FIRST", //充值后首充刷新

  UPDATE_MONTHCARD_RECEIVE = "UPDATE_MONTHCARD_RECEIVE", //特权卡奖励领取红点提示

  UPDATE_PASS_PORT = "UPDATE_PASS_PORT", //通行证更新   红点

  UPDATE_WEEKLY_PASS_PORT = "UPDATE_WEEKLY_PASS_PORT", //特惠周卡更新

  HERO_AWAKE_GIFT_PASS_TIME = "HERO_AWAKE_GIFT_PASS_TIME", //英雄觉醒礼包过期
}

