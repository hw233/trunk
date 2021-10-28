/** 
 * @Description: 
 * @Author: weiliang.huang  
 * @Date: 2019-03-29 18:21:41 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-08-03 18:09:27
 */

export enum BagEvent {
    UPDATE_BAG_ITEM = "UPDATE_BAG_ITEM", // 刷新背包数据
    UPDATE_ONE_ITEM = "UPDATE_ONE_ITEM", // 更新单个物品数据
    REMOVE_ITEM = "REMOVE_ITEM", // 删除某个数据
    SELECT_GIFT_ITEM = "SELECT_GIFT_ITEM", // 礼包选择界面选中
    SELECT_CLICK_ITEM = "SELECT_CLICK_ITEM", //自动点击商店物品
    SELECT_CLICK_ITEM_BUY = "SELECT_CLICK_ITEM_BUY", //自动购买商店物品

    AUTO_COMPOSE_CHIP = "AUTO_COMPOSE_CHIP"//自动合成进阶道具碎片
}