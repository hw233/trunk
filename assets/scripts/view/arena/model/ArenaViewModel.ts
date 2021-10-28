
/** 
 * @Description: 竞技场数据模型类
 * @Author: jijing.liu  
 * @Date: 2019-04-18 11:13:54
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-03-25 17:52:32
 */



export default class ArenaViewModel {
    static get instance() {
        return gdk.Tool.getSingleton(ArenaViewModel);
    }

    // 请求挑战的入口：0 匹配 1 战报
    fightType: number = 0;
    // 挑战的对象 player id
    fightPlayerId: number;
    //如果是机器人 阵容配置 对应的是pvp配置中的id
    weaponId: number = 0

}