import BGlobalUtil from '../utils/BGlobalUtil';
import BLoginModel from './BLoginModel';
import BMathUtil from '../utils/BMathUtil';
import BModelManager from '../managers/BModelManager';
import BNetManager from '../managers/BNetManager';
import BSdkTool from '../../sdk/BSdkTool';

/**
 * 服务器数据模型
 * @Author: sthoo.huang
 * @Date: 2019-03-28 16:19:54
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-09 10:36:00
 */

const LAST_LOCAL_KEY: string = 'last_server_ids';

export enum ServerStatus {
    DEBUG = 0,         // 调试
    MAINTAIN_FULL = 1, // 维护(爆满)
    MAINTAIN_FLOW = 2, // 维护(流畅)
    MAINTAIN = 3,      // 维护
    FULL = 4,          // 爆满
    FLOW = 5,          // 流畅
}

export class ServerPlayerItemModel {
    channel: number;        //渠道
    serverId: number;       //服务器Id
    name: string;           //角色名
    headId: number;         //头像Id
    level: number;          //等级
    loginTime: number;      //上次游戏时间
    server: ServerItemModel;
}

export class ServerItemModel {
    serverId: number;      //服务器id
    name: string;          //服务器名称
    // channel: number;    //渠道
    addr: string;          //连接地址
    addrOri: string;       //原始连接地址
    areaid?: number;       //区id
    recom: boolean;        //是否推荐
    time: number;          //如果是维护状态，结束维护切换到其他状态的时间
    status: ServerStatus;  //服务器状态
    areaName: string;      //区名
    idName: string;
    players: ServerPlayerItemModel[];   //玩家在该服务器的账号列表
    loginTime: number = 0;              // 最后登录时间
    isShowInfo: boolean = false;
}

export class ServerGroupModel {
    groupId: number;            //区id
    name: string;               //区名
    servers: ServerItemModel[]; //该区全部的服务器
}

class BServerModel {
    copyrightIndex: number = 0;  // 版号信息索引号
    groups: Array<ServerGroupModel> = [];
    // 所有服务器列表
    list: ServerItemModel[] = [];
    timeStamp: number = -1;
    // 运行环境，0：本地测试，1:本地正式， 2：远程测试，3：正式
    env: number = CC_DEBUG ? 0 : 3;
    host: string;   // 服务器url根地址
    serverListUrl: string;   // 获取服务器列表连接地址
    playerserverListUrl: string; // 获取玩家玩过的服务器列表连接地址
    gateway: {
        val: number,    // 权重
        addr: string,    // 地址
    }[];   // 网关列表

    // 服务器时间
    _serverTime: number = 0;
    _localTime: number = 0;

    // 与服务器通信的延时
    pingTime: number = 0;

    // 超级用户，可以看到所有服务器列表
    isSupperMan: boolean = CC_DEBUG ? true : false;

    /** 最近登录列表 */
    get lastList() {
        let d = BGlobalUtil.getLocal(LAST_LOCAL_KEY, false);
        let r: ServerItemModel[] = [];
        if (d != null) {
            // 有登录历史服务器列表时，查找匹配对象
            let v = this.list;
            let a = d[this.env];
            if (typeof a === 'object' && a.length) {
                for (let j = 0, m = a.length; j < m; j++) {
                    let id = a[j];
                    for (let i = 0, n = v.length; i < n; i++) {
                        if (id == v[i].serverId) {
                            r.push(v[i]);
                            break;
                        }
                    }
                }
            }
        } else {
            // 没有登录过的服务器时，则取推荐服务器列表
            for (let i = 0; i < this.groups.length; i++) {
                const group = this.groups[i];
                if (group.groupId == -1) {
                    r = group.servers;
                    break;
                }
            }
        }
        // 没有登录历史也没有推荐服时
        if (!r || r.length == 0) {
            r = this.list;
        }
        return r;
    }

    // 当前选择的服务器
    current: ServerItemModel = null;

    /** 服务器时间 */
    set serverTime(v: number) {
        this._serverTime = v;
        this._localTime = v > 0 ? Date.now() : 0;
    }
    get serverTime(): number {
        if (this._serverTime > 0) {
            return this._serverTime + (Date.now() - this._localTime) + this.pingTime;
        }
        return 0;
    }

    // 保存当前选中的服务器至登录历史列表
    saveCurrent() {
        let v: ServerItemModel = this.current;
        if (!v) return;
        let d = BGlobalUtil.getLocal(LAST_LOCAL_KEY, false);
        if (d == null) {
            d = {};
        }
        let a = d[this.env];
        if (typeof a != 'object') {
            a = d[this.env] = [];
        }
        let i = a.indexOf(v.serverId);
        if (i >= 0) {
            a.splice(i, 1);
        }
        a.unshift(v.serverId);
        BGlobalUtil.setLocal(LAST_LOCAL_KEY, d, false);
    }

    // {"r":[1],"p":["分区1","分区2","分区3"],"s":[{"i":1,"n":"服1","a":"127.0.0.1:7001","p":0,"s":5,"t":0}]}
    // 新接口
    // 服务器返回的服务器列表
    parseServerList(jsonStr: string) {
        let datas = JSON.parse(jsonStr) as any;
        let areaNames = datas.p || {};
        let recoms: number[] = datas.r || [];
        let groups = new Array<ServerGroupModel>();
        let list = [];
        let recomServers = new Array<ServerItemModel>();
        let uniqueIds = {};
        let servers: any[] = datas.s || [];
        // 网关列表
        this.gateway = [];
        (datas.g as string[]).forEach(g => {
            // 忽略无效数据
            if (!g || g === '') return;
            // 网关过滤条件
            let a = g.split('#');
            if (a[1] && cc.js.isString(a[1])) {
                let str = a[1];
                if (str.startsWith('!')) {
                    // 排除指定的渠道
                    let arr: number[] = JSON.parse(str.substr(1));
                    if (arr.some(c => BSdkTool.tool.config.channel_id == c)) {
                        // 此分区在排除列表中
                        return;
                    }
                } else {
                    // 包含指定渠道
                    let arr: number[] = JSON.parse(str);
                    if (!(arr.some(c => BSdkTool.tool.config.channel_id == c))) {
                        // 此分区不在允许列表中
                        return;
                    }
                }
            }
            // 添加到网关列表
            this.gateway.push({
                val: BMathUtil.rnd(1, 999),
                addr: a[0],
            });
        });
        // 特性开关
        let others = JSON.parse(`[${datas.o || ''}]`);
        if (others instanceof Array && others.length > 0) {
            BSdkTool.tool.isServiceChecked = !!others[0];
            this.copyrightIndex = others[1] || 0;
        }
        // 热更开关, [安卓&H5，小游戏，原生]  1为开启，0为关闭
        for (let key in areaNames) {
            const values = ((areaNames[key] as string) || '').split('#');
            if (values[2] && cc.js.isString(values[2])) {
                const arr: number[] = JSON.parse(values[2]);
                let v = false;
                if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                    // 微信小游戏
                    v = arr[1] == 1;
                } else if (cc.sys.isBrowser) {
                    // 安卓&H5
                    v = arr[0] == 1;
                } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
                    // 原生IOS
                    v = arr[4] >= BSdkTool.tool.ios_ver;
                }
                iclib.hotupdateEnabled = v || this.isSupperMan;
                if (v && CC_BUILD && !CC_DEBUG) {
                    // 检查客户端版本
                    BGlobalUtil.checkClientVer();
                }
                break;
            }
        }
        for (let index = 0; index < servers.length; index++) {
            const data = servers[index];
            if (data.s == ServerStatus.DEBUG && !this.isSupperMan) {
                // 此服务器状态为调试，则不显示
                CC_DEBUG && cc.log("ServerList 服务器为调试状态，丢弃掉 data =", data);
                continue;
            }
            if (uniqueIds[data.i]) {
                CC_DEBUG && cc.log("ServerList 服务器id发生重复，丢弃掉 data =", data);
                continue;
            }
            uniqueIds[data.i] = true;
            // 服务器列表返回的过滤条件
            let names = ((areaNames[data.p] as string) || "服务器未发").split('#');
            if (names[1] && cc.js.isString(names[1]) && !this.isSupperMan) {
                let str = names[1];
                if (str.startsWith('!')) {
                    // 排除指定的渠道
                    let arr: number[] = JSON.parse(str.substr(1));
                    if (arr.some(c => BSdkTool.tool.config.channel_id == c)) {
                        // 此分区在排除列表中，则不显示
                        CC_DEBUG && cc.log("ServerList 服务器分区在排除渠道列表中，丢弃掉 data =", data);
                        continue;
                    }
                } else {
                    // 包含指定渠道
                    let arr: number[] = JSON.parse(str);
                    if (!(arr.some(c => BSdkTool.tool.config.channel_id == c))) {
                        // 此分区不在允许列表中，则不显示
                        CC_DEBUG && cc.log("ServerList 服务器分区不在允许渠道列表中，丢弃掉 data =", data);
                        continue;
                    }
                }
            }
            // 创建数据项
            let server = new ServerItemModel();
            server.serverId = parseInt(data.i);
            server.name = data.n;
            server.addrOri = data.a;
            server.areaid = parseInt(data.p);
            server.recom = recoms.indexOf(server.serverId) >= 0;
            server.time = parseInt(data.t);
            server.status = parseInt(data.s);
            server.areaName = names[0];
            server.idName = `${server.serverId}服`;
            // 添加至分组
            let tgroup: ServerGroupModel;
            groups.some(group => {
                if (group.groupId == server.areaid) {
                    tgroup = group;
                    return true;
                }
            });
            if (!tgroup && (this.isSupperMan || BSdkTool.tool.showServerGroup)) {
                tgroup = new ServerGroupModel();
                tgroup.groupId = server.areaid;
                tgroup.name = names[0];
                tgroup.servers = [];
                groups.push(tgroup);
            }
            if (tgroup) {
                tgroup.servers.push(server);
            }
            // 添加至推荐分组
            if (server.recom) {
                recomServers.push(server);
            }
            list.push(server);
        }
        // 对各组进行排序
        groups.sort((a, b) => b.groupId - a.groupId);
        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            group.servers.sort((a, b) => {
                let aid = a.serverId;
                let bid = b.serverId;
                if (bid >= 9999) bid = -1 * bid;
                if (aid >= 9999) aid = -1 * bid;
                return bid - aid;
            });
        }
        // 添加玩家玩过的服务器列表
        let mygroup = new ServerGroupModel();
        mygroup.groupId = -2;
        mygroup.name = "角色";
        mygroup.servers = [];
        groups.unshift(mygroup);
        // 添加推荐的服务器列表
        recomServers.sort((a, b) => b.serverId - a.serverId);
        let recomgroup = new ServerGroupModel();
        recomgroup.groupId = -1;
        recomgroup.name = "推荐";
        recomgroup.servers = recomServers;
        groups.unshift(recomgroup);
        // 刷新界面
        this.groups = groups;
        this.list = list;
    }

    // {"t":1577362073,"s":[[1,"guest1998",0,1,1566461581]]}
    // {"t":时间戳,"s":[[服务器Id,角色名,头像Id,等级,上次游戏时间],[服务器Id,角色名,头像Id,等级,上次游戏时间]]}
    //服务器返回的玩家玩过的服务器列表
    parsePlayerServerList(jsonStr: string) {
        let datas = JSON.parse(jsonStr) as any;
        let mygroup: ServerGroupModel;
        for (let i = 0; i < this.groups.length; i++) {
            const group = this.groups[i];
            if (group.groupId == -2) {
                mygroup = group;
                break;
            }
        }
        if (!mygroup) return;
        mygroup.servers.length = 0;

        let serverList = this.list;
        let m = BModelManager.get(BLoginModel);
        for (let i = 0; i < datas.s.length; i++) {
            const data = datas.s[i];
            if (m.channelId != data[0]) {
                continue;
            }
            let serverId = data[1];
            let server: ServerItemModel;
            serverList.some(s => {
                if (s.serverId == serverId) {
                    server = s;
                    return true;
                }
                return false;
            });
            if (!server) continue;
            if (!server.players) {
                server.players = [];
            }
            let loginTime = data[5] || 0;
            if (!!this.current && serverId == this.current.serverId) {
                loginTime = Date.now();
            }
            if (!server.loginTime || server.loginTime < loginTime) {
                server.loginTime = loginTime;
            }
            let player: ServerPlayerItemModel;
            let playerName = data[2];
            server.players.some(p => {
                if (p.name == playerName) {
                    player = p;
                    return true;
                }
                return false;
            });
            if (!player) {
                // 角色列表中还没有此角色信息
                player = new ServerPlayerItemModel();
                player.channel = data[0];
                player.serverId = serverId;//data[1];
                player.name = playerName;//data[2];
                player.headId = data[3];
                player.level = data[4];
                player.loginTime = loginTime;//data[5] || 0;
                player.server = server;
                server.players.push(player);
            }
            if (mygroup.servers.indexOf(server) == -1) {
                mygroup.servers.push(server);
            }
        }
        if (mygroup.servers.length > 0) {
            mygroup.servers.sort((a, b) => b.loginTime - a.loginTime);
        }
        let serverNowTime = datas.t;
        for (let k = 0; k < serverList.length; k++) {
            const server = serverList[k];
            // 维护(爆满)
            if (server.status == ServerStatus.MAINTAIN_FULL) {
                if (serverNowTime >= server.time) {
                    server.status = ServerStatus.FULL;
                }
                // 维护(流畅)
            } else if (server.status == ServerStatus.MAINTAIN_FLOW) {
                if (serverNowTime >= server.time) {
                    server.status = ServerStatus.FLOW;
                }
            }
        }
    }

    serverNameMap: { [id: number]: string } = {}; //跨服组下 各服务器名字 id-name  id: int32(playerId / 100000)
    serverXIdMap: { [id: number]: string } = {}; //合服服务器Id 原本id--合服后的服务器id
    /**
     * 【异步】 根据playerIds获取服务名
     * @param ids 
     * @param type 1-playerId 2-guildId
     */
    async reqServerNameByIds(ids: number[] = [], type: number = 1) {
        return new Promise((resolve, reject) => {
            if (!this.serverNameMap) this.serverNameMap = {};
            if (!this.serverXIdMap) this.serverXIdMap = {}
            let channelServerIds = []; //渠道id+服务器id 跨服玩法中保证唯一性
            let n = type == 1 ? 100000 : 10000;
            ids.forEach(id => {
                let channelServerId = Math.floor(id / n);
                if (channelServerIds.indexOf(channelServerId) == -1) channelServerIds.push(channelServerId);
            });
            let keys = Object.keys(this.serverNameMap);
            for (let i = 0; i < keys.length; i++) {
                let idx = channelServerIds.indexOf(parseInt(keys[i]));
                if (idx !== -1) {
                    channelServerIds.splice(idx, 1);
                }
            }
            if (channelServerIds.length <= 0) {
                // resolve(this.serverNameMap);
                resolve(true);
            }
            else {
                let req = new icmsg.SystemServerNameReq();
                req.ids = channelServerIds;
                BNetManager.send(req, (resp: icmsg.SystemServerNameRsp) => {
                    gdk.Timer.clearAll(this);
                    resp.names.forEach(n => {
                        this.serverNameMap[n.serverId] = n.serverName;
                        this.serverXIdMap[n.serverId] = n.xServerId;
                    });
                    // resolve(this.serverNameMap);
                    // resolve(this.serverXIdMap);
                    resolve(true);
                });
                //todo 超时处理
                gdk.Timer.clearAll(this);
                gdk.Timer.once(5000, this, () => {
                    CC_DEBUG && cc.log("serverName req timeout");
                    // resolve(this.serverNameMap);
                    // resolve(this.serverXIdMap);
                    resolve(true);
                });
            }
        });
    }
}

iclib.addProp('ServerModel', BServerModel);
export default BServerModel;