/** 
 * 全局包定义
 * @Author: sthoo.huang  
 * @Date: 2021-03-24 11:26:40 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-13 16:16:37
 */

//////////////////////////////// ServerModel /////////////////////////////////////////
enum ServerStatus {
    DEBUG = 0,         // 调试
    MAINTAIN_FULL = 1, // 维护(爆满)
    MAINTAIN_FLOW = 2, // 维护(流畅)
    MAINTAIN = 3,      // 维护
    FULL = 4,          // 爆满
    FLOW = 5,          // 流畅
}

interface IServerPlayerItemModel {
    channel: number;       //渠道
    serverId: number;   //服务器Id
    name: string;       //角色名
    headId: number;     //头像Id
    level: number;      //等级
    loginTime: number;  //上次游戏时间
    server: IServerItemModel;
}

interface IServerItemModel {
    serverId: number;      //服务器id
    name: string;          //服务器名称
    // channel: number;    //渠道
    addr: string;          //服务器地址
    areaid?: number;       //区id
    recom: boolean;        //是否推荐
    time: number;          //如果是维护状态，结束维护切换到其他状态的时间
    status: ServerStatus;  //服务器状态
    areaName: string;      //区名
    idName: string;
    players: IServerPlayerItemModel[]; //玩家在该服务器的账号列表
    loginTime: number;           // 最后登录时间
    isShowInfo: boolean;
}

interface IServerGroupModel {
    groupId: number;            //区id
    name: string;               //区名
    servers: IServerItemModel[]; //该区全部的服务器
}

//////////////////////////////// ConfigManager /////////////////////////////////////////
class ConfigManagerClass {

    readonly initlized: number;
    readonly datetime: string;

    // 初始化配置
    init(config: any, json?: any): void;

    /**
     * 以ID键值为条件，获取一项配置数据
     * 用法：
     *      var item:Bag = ConfigManager.getItemById(Bag, 1034);
     * @param clz 配置结构类
     * @param id 
     */
    getItemById<T>(clz: { new(): T }, id: string | number): T;

    /**
     * 获取以指定字段的值为索引的配置列表
     * 用法：
     *      var items:Bag[] = ConfigManager.getItemsByField(Bag, 'type', 5);
     * @param clz 配置结构类
     * @param name 要查找的字段名
     * @param value 字段对应的值
     */
    getItemsByField<T>(clz: { new(): T }, name: string, value: string | number): T[];

    /**
     * 获取以指定字段的值为索引的配置列表中符合条件的项
     * 用法：
     *      var item:Bag = ConfigManager.getItemByField(Bag, 'typeId', 5, {value:100}); 
     * @param clz 
     * @param name 
     * @param value 
     * @param condition 
     */
    getItemByField<T>(clz: { new(): T }, name: string, value: string | number,): T;
    getItemByField<T>(clz: { new(): T }, name: string, value: string | number, condition: (cfg: T) => boolean): T;
    getItemByField<T>(clz: { new(): T }, name: string, value: string | number, condition: any): T;

    /**
     * 获取一项与condition条件相符的数据
     * 用法：
     *      var item:Bag = ConfigManager.getItem(Bag, {id:1034});
     * @param clz 
     * @param condition 
     */
    getItem<T>(clz: { new(): T }, condition: (cfg: T) => boolean): T;
    getItem<T>(clz: { new(): T }, condition: any): T;

    /**
     * 获取所有与condition条件相符的数据，如果没找到则返回空数组
     * 如果condition为null则返回所有配置
     * 用法：
     *      var items:Bag[] = ConfigManager.getItems(Bag, {type:1, sex: 2});
     *      var items:Bag[] = ConfigManager.getItems(Bag);
     * @param clz 
     * @param condition
     */
    getItems<T>(clz: { new(): T }): T[];
    getItems<T>(clz: { new(): T }, condition: (cfg: T) => boolean): T[];
    getItems<T>(clz: { new(): T }, condition: any): T[];

    /**
     * 判断item的数据是否符合condition的条件值
     * @param item 
     * @param condition 
     */
    isEquivalent(item: any, condition: Function | any): boolean;
}

//////////////////////////////// NetManager /////////////////////////////////////////
class Connection {
    url: string;
    binaryType: BinaryType;

    onOpen: gdk.EventTrigger;
    onClose: gdk.EventTrigger;
    onMessage: gdk.EventTrigger;

    /** 获得当前连接状态 */
    readonly isConnected: boolean;

    /**
     * 建立连接
     * @param addr 
     * @param binaryType 
     */
    connect(addr: string, binaryType?: BinaryType, timeout?: number): void;
    /** 关闭连接 */
    close(): void;
    /**
     * 发送网络消息，如果网络当前可用则把此消息放入发送缓冲队列中
     * @param m 
     * @param cb 
     * @param thisArg 
     */
    send(m: icmsg.Message, cb?: (msg: icmsg.Message, r: boolean) => void, thisArg?: any): boolean;
}

class BaseController extends cc.Component {
    get gdkEvents(): GdkEventArray[];
    get netEvents(): NetEventArray[];

    /**
     * 在子类中实现，启用时
     */
    onStart(): void;

    /**
     * 在子类中实现，结束时
     */
    onEnd(): void;
}

class NetManagerClass {

    node: cc.Node;
    conn: Connection;
    queue: icmsg.Message[];  // 发送失败的包数组
    sendCallbackQueue: { [id: number]: { callback: Function, thisArg: any }[] };    // 发送回调监听队列

    /**
     * 初始化网络管理器
     */
    init(): void;

    /**
     * 销毁网络管理器
     */
    destroy(): void;

    /**
     * 追加只记录最后一次发送失败的消息
     * @param msgType 
     */
    addSingleQueuMsg(msgType: number | number[]): void;

    /**
     * 添加控制器组件
     * @param clz 控制器组件类
     */
    addController(clz: new () => BaseController): BaseController;

    /**
     * 移除控制器组件
     * @param clz 控制器组件类
     */
    removeController(clz: new () => BaseController): void;

    /**
     * 连接服务器
     * @param addr 
     * @param cb 
     * @param thisArg 
     * @param timeout
     */
    connect(addr: string, cb?: Function, thisArg?: any, timeout?: number): void;

    /**
     * 清除回调
     * @param cb 
     * @param thisArg 
     */
    offcb(cb: Function, thisArg?: any): void;

    // 发送断线后发送失败的包
    sendQueue(): void;

    /**
     * 发送网络数据
     * @param data 
     * @param cb 
     * @param thisArg 
     */
    send(msg: icmsg.Message, cb?: Function, thisArg?: any): boolean;

    // 网络数据发送结果处理回调函数
    _sendResult(msg: icmsg.Message, isSucc: boolean): void;

    _onMessageHandler(id: number, msg: icmsg.Message): void;

    /**
     * 监听网络消息
     * @param id 协议号
     * @param callback 监听函数
     * @param thisArg 回调函数的this参数
     * @param priority 优先级
     */
    on(id: number, callback: Function, thisArg?: any, priority?: number): void;

    /**
     * 监听网络消息一次后自动移除
     * @param id 协议号
     * @param callback 监听函数
     * @param thisArg 回调函数的this参数
     * @param priority 优先级
     */
    once(id: number, callback: Function, thisArg?: any, priority?: number): void;

    /**
     * 移除网络监听
     * @param id 协议号
     * @param callback 监听函数
     * @param thisArg 回调函数的this参数
     */
    off(id: number, callback: Function, thisArg?: any): void;

    /**
     * 取消指定协议号的所有监听
     * @param id 
     */
    offAll(id: number): void;

    /**
     * 取消thisArg对象注册的所有监听
     * @param {any} thisArg 
     */
    targetOff(thisArg: any): void;
}

//////////////////////////////// LoginUtils /////////////////////////////////////////
class LoginUtilsClass {

    readonly serverModel: ServerModel;
    readonly loginModel: LoginModel;

    setLogoActive(v: boolean): void;
    reqLoginRole(thiz: gdk.fsm.FsmStateAction): boolean;
    reqLoginRoleOnExit(thiz: gdk.fsm.FsmStateAction): void;
    sendReqList(arr: { new() }[], cb?: Function, thisArg?: any, setSingle?: boolean): void;
}

//////////////////////////////// MaskWordUtils /////////////////////////////////////////
class MaskWordUtilsClass {

    _root: Map<any, any>;
    _lastUrl: string;

    /**
     * 追加敏感词库
     * @param items 
     */
    append(items: string[]): void;

    /**
     * 从index开始检测是否包含敏感词，完整匹配才算
     * @param txt 
     * @param index
     */
    check(txt: string, index?: number): any;

    /**
     * 敏感词过滤
     * @param txt 
     * @param val 
     */
    filter(txt: string, val?: string): string;

    /**
     * 通过url更新敏感词库
     * @param url 
     */
    update(url?: string): void;
}

//////////////////////////////// ErrorManager /////////////////////////////////////////
class ErrorManagerClass {

    /**
     * 初始化错误管理器，需在网络管理器之后初始化
     */
    init(): void;

    /**
     * 销毁错误管理器
     */
    destroy(): void;

    /**
     * 显示防沉迷信息
     * @param msg
     * @param cfg
     */
    showForbidInfo(msg: icmsg.SystemErrorRsp, cfg: ForbidtipsCfg): void;

    /**
     * 通过错误码获得对应的文本信息
     * @param code  错误id / 错误code
     * @param args  可变参数
     */
    get(code: number | string, args?: any[]): string;

    /**
     * 监听错误号消息
     * @param id 错误号或错误号数组
     * @param callback 监听函数
     * @param thisArg 回调函数的this参数
     * @param priority 优先级
     */
    on(id: number | number[], callback: Function, thisArg?: any, priority?: number): void;

    /**
     * 监听错误号消息一次后自动移除
     * @param id 错误号或错误号数组
     * @param callback 监听函数
     * @param thisArg 回调函数的this参数
     * @param priority 优先级
     */
    once(id: number | number[], callback: Function, thisArg?: any, priority?: number): void;

    /**
     * 移除错误号监听
     * @param id 错误号
     * @param callback 监听函数
     * @param thisArg 回调函数的this参数
     */
    off(id: number, callback: Function, thisArg?: any): void;

    /**
     * 取消指定错误号的所有监听
     * @param id 
     */
    offAll(id: number): void;

    /**
     * 取消thisArg对象注册的所有监听
     * @param {any} thisArg 
     */
    targetOff(thisArg: any): void;
}

//////////////////////////////// ModelManager /////////////////////////////////////////
class ModelManagerClass {

    models: any[];

    /**
     * 获得指定数据模型类的实例
     * @param clz 数据模型类
     */
    get<T>(clz: { new(): T }): T;

    /**
     * 销毁指定数据模型
     * @param clz 数据模型类或实例
     */
    put(clz: any): void;

    /**
     * 清除所有数据
     */
    clearAll(excludes?: any[]): void;
}

//////////////////////////////// ErrorUtils /////////////////////////////////////////
class ErrorUtilsClass {

    /**
     * 异常上报
     * @param message 
     * @param url 
     * @param lineNo 
     * @param columnNo 
     * @param error 
     */
    post(message: string, uri?: string, lineNo?: number, columnNo?: number, error?: any): boolean;
}

//////////////////////////////// GuideUtil /////////////////////////////////////////
class GuideUtilClass {
    destroy(): void;
}

//////////////////////////////// MobPushUtilClass /////////////////////////////////////////
class MobPushUtilClass {

    initMobPushJS(): void;
    getRegistrationID(cb: (seqId: number, regId: string) => void): void;
}

declare module iclib {

    // 当前加载的version.json内容
    export const verjson: {
        version: string,
        time: string,
        vers: { [filename: string]: string },
    };

    // 热更开关
    export var hotupdateEnabled: boolean;

    /**
     * 向全局库中添加属性
     * @param p 属性名
     * @param v 属性值
     */
    export function addProp(p: string, v: any): void;

    //////////////////////////////// LoginModel /////////////////////////////////////////
    export class LoginModel {
        account: string;
        serverId: number;
        channelId: number;
        channelCode: string;
        token: string;
        sessionId: number;
        brand: string;  // 手机品牌;
        model: string;  // 手机机型;
        isFirstLogin: boolean;  // 是否为首次登录（当天）
        serverOpenTime: number;//开服时间 
        operateMap: any;    //操作记录
    }

    //////////////////////////////// ServerModel /////////////////////////////////////////
    export class ServerModel {
        copyrightIndex: number;  // 版号信息索引号
        groups: IServerGroupModel[];
        // 所有服务器列表
        list: IServerItemModel[];
        timeStamp: number;
        // 运行环境，0：本地测试，1:本地正式， 2：远程测试，3：正式
        env: number;
        host: string;   // 服务器url根地址
        serverListUrl: string;   // 获取服务器列表连接地址
        playerserverListUrl: string; // 获取玩家玩过的服务器列表连接地址

        // 服务器时间
        _serverTime: number;
        _localTime: number;

        // 与服务器通信的延时
        pingTime: number;


        /** 最近登录列表 */
        readonly lastList: IServerItemModel;

        // 当前选择的服务器
        current: IServerItemModel;

        /** 服务器时间 */
        serverTime: number;

        // 保存当前选中的服务器至登录历史列表
        saveCurrent(): void;

        // {"r":[1],"p":["分区1","分区2","分区3"],"s":[{"i":1,"n":"服1","a":"127.0.0.1:7001","p":0,"s":5,"t":0}]}
        //新接口
        //服务器返回的服务器列表
        parseServerList(jsonStr: string): void;

        // {"t":1577362073,"s":[[1,"guest1998",0,1,1566461581]]}
        // {"t":时间戳,"s":[[服务器Id,角色名,头像Id,等级,上次游戏时间],[服务器Id,角色名,头像Id,等级,上次游戏时间]]}
        //服务器返回的玩家玩过的服务器列表
        parsePlayerServerList(jsonStr: string): void;

        serverNameMap: { [id: number]: string }; //跨服组下 各服务器名字 id-name  id: int32(playerId / 100000)
        serverXIdMap: { [id: number]: string } = {}; //合服服务器Id 原本id--合服后的服务器id
        /**
         * 【异步】 根据playerIds获取服务名
         * @param ids 
         * @param type 1-playerId 2-guildId
         */
        reqServerNameByIds(ids?: number[], type?: number): Promise<{ [id: number]: string }>;
    }

    //////////////////////////////// GlobalUtil /////////////////////////////////////////
    export class GlobalUtilClass {

        /**
         * 格式化
         * @param number 
         * @param isChange 
         * @param useFont 
         */
        numberToStr(number: number, isChange: boolean = false, useFont = false): string;

        /**设置精灵icon */
        setSpriteIcon(
            resNode: cc.Node,
            node: cc.Node | cc.Sprite,
            icon: string,
            callback: () => void = null,
            thisArg: any = null,
        );

        /**
         * 保存本地变量
         * @param name
         * @param val
         * @param isSelf 是否每个用户单独保存
         */
        setLocal(name: string, val: any, isSelf: boolean = true);

        /**
         * 读取本地保存的变量
         * @param name
         * @param isSelf 是否每个用户独立
         * @param def 默认值
         */
        getLocal(name: string, isSelf: boolean = true, def?: any);

        // 在url后面添加参数
        urlAppendTimestamp(url: string, param?: string);

        // 通过get方式获取文件内容
        httpGet(url: string, cb: Function, params?: any, timeStamp: 'none' | 'time' | 'ver' = 'time');

        // 获取绝对链接
        getUrlRoot(url?: string): string;
        // 获得URL相对路径
        getUrlRelativePath(url?: string): string;

        // 检测客户端版本
        checkClientVer(cb?: Function, thisArg?: any);

        // 获取指定名称的外部参数对应的值
        getUrlValue(prop: string, url?: string): string;

        // 设置游戏帧频
        setFrameRate(v: number);

        /**提示瓢字 并播放声音 */
        showMessageAndSound(tips: string, targetNode?: cc.Node, soundId: ButtonSoundId = ButtonSoundId.invalid);
    }

    //////////////////////////////// interface /////////////////////////////////////////
    export interface IGameUtils {

        // 初始化游戏配置
        initGameConfig(thiz: gdk.fsm.FsmStateAction, cb: Function): void;

        // 初始化游戏数据
        initGameModel(thiz: gdk.fsm.FsmStateAction): void;

        // 初始化控制器
        initGameController(thiz: gdk.fsm.FsmStateAction, isAdd: boolean): void;

        // 预加载游戏资源
        preloadGameResource(thiz: gdk.fsm.FsmStateAction): void;

        // 加载游戏资源
        loadGameResource(thiz: gdk.fsm.FsmStateAction, loadingErrorText: string, setProgress: (v: number) => void): void;

        // 初始化请求
        initServerRequest(thiz: gdk.fsm.FsmStateAction): void;
        initServerRequestOnExit(thiz: gdk.fsm.FsmStateAction): void;

        // 断线重连
        reconnectServer(thiz: gdk.fsm.FsmStateAction): void;
        reconnectServerOnExit(thiz: gdk.fsm.FsmStateAction): void;

        // 进入主场景
        enterMain(thiz: gdk.fsm.FsmStateAction): void;
        enterMainOnExit(thiz: gdk.fsm.FsmStateAction): void;
    }

    export interface ISdkTool {
        readonly loaded: boolean;
        readonly updating: boolean;
        readonly userData: any;
        readonly config: iccfg.IChannel;
        readonly channelId: number;
        readonly channelCode: string;
        readonly player_list: string;
        readonly server_list: string;
        readonly ios_source: string;
        readonly ios_ver: number;

        can_charge: boolean;
        showAccountInput: boolean;
        account: string;
        showKfIcon: boolean;
        showH5Icon: boolean;
        showChangeAccountIcon: boolean;
        showStartBtn: boolean;
        showBbsIcon: boolean;
        showServiceCheckBox: boolean;
        isServiceChecked: boolean;
        isNeedUpdateBadWords: boolean;
        isAutoLogin: boolean;
        showServerGroup: boolean;

        preinit(): void;
        init(): void;
        login(): void;
        logout(): void;
        logerr(): void;
        pay(data: any, itemName: string, paymentDes: string): void;
        kf(): void;
        h5(): void;
        bbs(): void;
        updateVer(): void;
        changeAccount(): void;
        connectServerBefore(): void;
        connectServer(): void;
        createRole(): void;
        enterGame(): void;
        levelUp(): void;
        itemChanged?(data: any): void;
        chatWatch?(data: any): void;

        userService(): void;
        privateService(): void;

        getRealRMBCost(v: number): number;
        hasMaskWord(txt: string, callback: (succ: boolean) => void): void;
    }

    export interface ISdkToolClass {
        loaded: boolean;
        tool: ISdkTool;
        init(): void;
    }

    //////////////////////////////// GlobalUtils /////////////////////////////////////////
    export const SdkTool: ISdkToolClass;
    export const NetManager: NetManagerClass;
    export const ConfigManager: ConfigManagerClass;
    export const LoginUtils: LoginUtilsClass;
    export const MaskWordUtils: MaskWordUtilsClass;
    export const ErrorManager: ErrorManagerClass;
    export const ModelManager: ModelManagerClass;
    export const ErrorUtils: ErrorUtilsClass;
    export const GameUtils: IGameUtils;
    export const GlobalUtil: GlobalUtilClass;
    export const GuideUtil: GuideUtilClass;
    export const MobPushUtil: MobPushUtilClass;
}