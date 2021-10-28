/** 
 * @Description: 聊天频道配置信息
 * @Author: weiliang.huang  
 * @Date: 2019-03-25 14:43:07 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-03 16:18:32
 */

export enum ChatChannel {
    /**综合 */
    DEFAULT = 0,
    /**系统 */
    SYS = 1,
    /**世界 */
    WORLD = 2,
    /**公会 */
    GUILD = 3,
    /**私聊 */
    PRIVATE = 4,
    /**投诉 */
    REPORT = 5,
    /**联盟 */
    ALLIANCE = 6,
    /**跨服 */
    CROSSACT = 7,
}

// export const ChannelText = {
//     SYS: "<color=#5ee015>【系统】</c>",
//     WORLD: "<color=blue>【世界】</c>",
//     GUIDE: "<color=cyan>【工会】</c>",
//     PRIVATE: "<color=red>【私聊】</c>"
// }

export const ColorType = {
    Green: 1,
    Blue: 2,
    Purple: 3,
    Gold: 4,
    Red: 5,
}