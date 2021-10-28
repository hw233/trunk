/** 
 * @Description: 聊天数据模型类
 * @Author: weiliang.huang  
 * @Date: 2019-03-25 14:43:46 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-31 15:57:35
 */

/**最近联系的玩家信息结构 */
export interface PrivatePlayer {
    id: number,
    name: string,
    head?: number,
    frame?: number,
    level?: number,
}


/**
 * text 富文本属性说明
 * 富文本使用到的img表情需要在同一个Atlas图集里面
 * 文本格式遵循格式如下
 * <color=#ff0000>Red Text</c>	设定颜色值,支持十六进制,系统提供的内置颜色如下
 * white Color 纯白色，RGBA 是 [255, 255, 255, 255]。
   black Color 纯黑色，RGBA 是 [0, 0, 0, 255]。
   transparent Color 透明，RGBA 是 [0, 0, 0, 0]。
   gray Color 灰色，RGBA 是 [127.5, 127.5, 127.5]。
   red Color 纯红色，RGBA 是 [255, 0, 0]。
   green Color 纯绿色，RGBA 是 [0, 255, 0]。
   blue Color 纯蓝色，RGBA 是 [0, 0, 255]。
   yellow Color 黄色，RGBA 是 [255, 235, 4]。
   orange Color 橙色，RGBA 是 [255, 127, 0]。
   cyan Color 青色，RGBA 是 [0, 255, 255]。
   magenta Color 洋红色（品红色），RGBA 是 [255, 0, 255]
 * <size=30></size> 字体渲染大小，大小值必须是一个整数
 * <outline color=red width=4>A label with outline</outline> 设置文本的描边颜色和描边宽度
 * <b></b> 使用粗体来渲染
 * <i></i> 使用斜体
 * <u></u> 下划线
 * <on click="handler" param="test"> click me! </on> 点击事件, param为事件参数
 * 除了 on 标签可以添加 click 属性，color 和 size 标签也可以添加, 如<size=10 click="handler2">click me</size>
 * "<on click='itemClick' color=red param='{#typeId}'>[#name]</on>" #typeId 道具id #name 道具名称
 * "<on click='equipClick' color=red param='{@equip#index}'>[#name]</on>" #index 对应equips装备下标 #name 道具名称
 * <img src='emoji1' click='handler'/> emoji1对应表情图集的表情名字
 */
export default class ChatModel {

    maxNum: number = 50
    lastTimeStamp = 0;  // 最后发送消息时间戳

    AllMessages: Array<icmsg.ChatSendRsp> = [];
    SysMessages: Array<icmsg.ChatSendRsp> = [];
    WorldMessages: Array<icmsg.ChatSendRsp> = [];
    GuildMessages: Array<icmsg.ChatSendRsp> = [];
    AllianceMessages: Array<icmsg.ChatSendRsp> = [];//据点战联盟频道
    CrossactMessages: Array<icmsg.ChatSendRsp> = []; //跨服消息

    privateMessages: any = {}   // 记录玩家的私聊记录信息

    unRedMessages: any = {} //未读消息   id-unRedNum

    recentPlayers: PrivatePlayer[] = [] // 记录最近的聊天玩家信息
    /**表情静态数据 */
    FaceConfig = (() => {
        let r = [];
        for (let i = 1; i < 60; i++) {
            r.push({
                id: `#${i}#`,
                icon: `emoji_${(Array(4).join("0") + i).slice(-4)}`,
            });
        }
        return r;
    })();

    /**表情转换数据, id:icon*/
    _FaceConfig = null;

    linkTab: LinkStr[] = [] // 超链接信息表

    chatInputText: string = ""  // 聊天界面输入框内容

    noticeList = []; //从右到左滚动,新的不顶调旧的,内容长度不限制 tvcfg.show_type = 1
    lowEffectNoticeList = []; //快速从下到上,新的顶掉旧的,内容长度有限 tvcfg.show_type = 2

    guildMsgCount: number = 0//公会聊天信息数量
    corssactMsgCount: number = 0//跨服聊天信息数量

    privateMsgCount: number = 0//私聊聊天信息数量

    bountyListCount: number = 0 //赏金列表数量

    allianceMsgCount: number = 0 //联盟聊天 新信息数量

    kfMsgCount: number = 0 //客服消息数量

    miniChatState = { pve: false, other: true }
}

export interface LinkStr {
    0: string,
    1: string
}
