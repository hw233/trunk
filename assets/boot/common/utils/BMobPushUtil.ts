import BGlobalUtil from './BGlobalUtil';

let isDebug = true; //是否打开调试
let seqId = 0;

/**
 * JSON字符串转换为对象
 * @param string        JSON字符串
 * @returns {Object}    转换后对象
 */
function JsonStringToObject(str: string) {
    try {
        return eval("(" + str + ")");
    } catch (err) {
        return null;
    }
};

/**
 * 对象转JSON字符串
 * @param obj           对象
 * @returns {string}    JSON字符串
 */
function ObjectToJsonString(obj: any): string {
    var S = [];
    var J = null;

    var type = Object.prototype.toString.apply(obj);

    if (type === '[object Array]') {
        for (var i = 0; i < obj.length; i++) {
            S.push(ObjectToJsonString(obj[i]));
        }
        J = '[' + S.join(',') + ']';
    } else if (type === '[object Date]') {
        J = "new Date(" + obj.getTime() + ")";
    } else if (type === '[object RegExp]' ||
        type === '[object Function]') {
        J = obj.toString();
    } else if (type === '[object Object]') {
        for (var key in obj) {
            var value = ObjectToJsonString(obj[key]);
            if (value != null) {
                S.push('"' + key + '":' + value);
            }
        }
        J = '{' + S.join(',') + '}';
    } else if (type === '[object String]') {
        J = '"' + obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '') + '"';
    } else if (type === '[object Number]') {
        J = obj;
    } else if (type === '[object Boolean]') {
        J = obj;
    }

    return J;
};

/** 调用API接口 */
interface IApiCaller {
    log(...msgs: string[]): void;
    callMethod(request: RequestInfo): void;
    callback(response: IResponseInfo, callbackFunc: (seqId: number, ...args: any[]) => any): void;
}

interface IResponseInfo {
    seqId: number;
    method: string;
}

/**
 * 请求信息
 * @param seqId         流水号
 * @param method        方法
 * @param params        参数集合
 * @constructor
 */
class RequestInfo {

    seqId: number;
    method: string;
    params: any;
    nextRequest: RequestInfo;

    constructor(seqId: number, method: string, params?: any) {
        this.seqId = seqId;
        this.method = method;
        this.params = params;
        this.nextRequest = null;
    }
}

/**
 * SDK方法名称
 * @type {object}
 */
enum MobPushMethodName {
    InitMobPushSDK = "initMobPushSDK",
    SendCustomMsg = "sendCustomMsg",
    SendAPNsMsg = "sendAPNsMsg",
    SendLocalNotify = "sendLocalNotify",
    GetRegistrationID = "getRegistrationID",
    SetAlias = "setAlias",
    GetAlias = "getAlias",
    DeleteAlias = "deleteAlias",
    AddTags = "addTags",
    GetTags = "getTags",
    DeleteTags = "deleteTags",
    CleanAllTags = "cleanAllTags",
    AddPushReceiver = "addPushReceiver",
    ClickMsg = "clickMsg",
    SetNotifyIcon = "setNotifyIcon",
    SetAppForegroundHiddenNotification = "setAppForegroundHiddenNotification",
    PrivacyPermissionStatus = "privacyPermissionStatus"
}

/**
 * 推送环境
 * @type {object}
 */
enum PushEnvironment {
    Debug = 0,
    Release = 1,
}

/**
 * 消息发送类型
 * @type {object}
 */
enum SendMsgType {
    apns = 1, //推送
    socket = 2, //应用内消息
    timed = 3, //定时消息
    local = 4, //本地通知
}

/**
 * Android接口调用器
 * @constructor
 */
class AndroidAPICaller implements IApiCaller {

    /**
     * 日志输出
     * @param msg 
     * @returns 
     */
    log(...msgs: string[]) {
        let logmsg = msgs.join(', ');
        let androidFunc = window['JSInterfaceForPush'];
        if (androidFunc && androidFunc.jsLog) {
            androidFunc.jsLog(logmsg);
            return;
        }
        let url = `mobpush://jsLog?msg=${logmsg}`;
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    }

    /**
     * 调用方法
     * @param request       请求信息
     */
    callMethod(request: RequestInfo) {
        if (isDebug) {
            this.log("js request: " + request.method);
            this.log("seqId = " + request.seqId);
            this.log("api = " + request.method);
            this.log("data = " + ObjectToJsonString(request.params));
        }
        let cmd = "mobpush://jsCallback";
        let args = {
            'seqId': request.seqId,
            'method': request.method,
            'data': ObjectToJsonString(request.params),
            'callback': "$mobpush.callback",
        };
        let androidFunc = window['JSInterfaceForPush']
        if (androidFunc && androidFunc.jsCallback) {
            androidFunc.jsCallback(args.seqId, args.method, args.data, args.callback);
            return;
        }
        let params = [];
        for (const key in args) {
            if (args.hasOwnProperty(key)) {
                let value = args[key];
                value = encodeURIComponent(value);
                params.push(`${key}=${value}`);
            }
        }
        let url = `${cmd}?${params.join("&")}`;
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    }

    /**
     * 返回回调
     * @param response      回复数据
     *
     * response结构
     * {
     *   "seqId" : "111111",
     *   "extra" : "sss",
     *   "content" : "sww",
     *   "callback" : "function string",
     *   "messageId" : "32353",
     *   "timeStamp" :  2313498473213,
     *   "errorCode" : 400,
     *   "errorMsg" : "error",
     * }
     */
    callback(response: IResponseInfo, callbackFunc: (seqId: number, ...args: any[]) => any) {
        let args = [response.seqId];
        switch (response.method) {
            case MobPushMethodName.GetRegistrationID:
                args.push(response['registrationID']);
                break;
        }
        if (isDebug) {
            this.log("execute callback: " + JSON.stringify(args));
        }
        try {
            callbackFunc.apply(null, args);
        } catch (err) {
            if (isDebug) {
                this.log("execute callback error: " + err);
            }
        }
    }
}

/**
 * iOS接口调用器
 */
class IOSAPICaller implements IApiCaller {

    /**
     * 日志输出
     * @param msg 
     */
    log(...msgs: string[]) {
        let type = "mobpush://log";
        jsb.reflection.callStaticMethod(
            'RootViewController',
            'receiveFromClient:',
            JSON.stringify({ 'cmd': type, 'args': msgs.join(', ') }),
        );
    }

    /**
     * 调用方法
     * @param request    请求信息
     */
    callMethod(request: RequestInfo) {
        let type = "mobpush://call";
        let args = {
            'seqId': request.seqId,
            'methodName': request.method,
            'paramsStr': (request && request.params) ? ObjectToJsonString(request.params) : null,
        };
        jsb.reflection.callStaticMethod(
            'RootViewController',
            'receiveFromClient:',
            JSON.stringify({ 'cmd': type, 'args': args || '' }),
        );
    }

    /**
     * 返回回调
     * @param response      回复数据
     *
     * response结构
     * {
     *   "seqId" : "111111",
     *   "extra" : "sss",
     *   "content" : "sww",
     *   "callback" : "function string",
     *   "messageId" : "32353",
     *   "timeStamp" :  2313498473213,
     *   "errorCode" : 400,
     *   "errorMsg" : "error",
     * }
     */
    callback(response: IResponseInfo, callbackFunc: (seqId: number, ...args: any[]) => any) {
        let args = [response.seqId];
        switch (response.method) {
            case MobPushMethodName.SendCustomMsg:
                args.push(response['content'], response['messageId']);
                break;
            case MobPushMethodName.SendAPNsMsg:
                args.push(response['content'], response['mobpushMessageId']);
                break;
            case MobPushMethodName.SendLocalNotify:
                args.push(response['content'], response['title'], response['subtitle'], response['badge']);
                break;
            case MobPushMethodName.ClickMsg:
                args.push(response['url']);
                break;
            case MobPushMethodName.GetRegistrationID:
                args.push(response['registrationID'], response['errorCode'], response['errorMsg']);
                break;
            case MobPushMethodName.SetAlias:
                args.push(response['errorCode'], response['errorMsg']);
                break;
            case MobPushMethodName.GetAlias:
                args.push(response['alias'], response['errorCode'], response['errorMsg']);
                break;
            case MobPushMethodName.DeleteAlias:
                args.push(response['errorCode'], response['errorMsg']);
                break;
            case MobPushMethodName.AddTags:
                args.push(response['errorCode'], response['errorMsg']);
                break;
            case MobPushMethodName.GetTags:
                args.push(response['tags'], response['errorCode'], response['errorMsg']);
                break;
            case MobPushMethodName.DeleteTags:
                args.push(response['errorCode'], response['errorMsg']);
                break;
            case MobPushMethodName.CleanAllTags:
                args.push(response['errorCode'], response['errorMsg']);
                break;
        }
        if (isDebug) {
            this.log("execute callback: " + JSON.stringify(args));
        }
        try {
            callbackFunc.apply(null, args);
        } catch (err) {
            if (isDebug) {
                this.log("execute callback error: " + err);
            }
        }
    }
}

class MobPushUtilClass {

    // 回调集合
    private callbackDics: { [id: number]: (seqId: number, ...args: any[]) => any } = {};
    private isRunning = false; // 是否正在与本地进行交互
    private apiCaller: IApiCaller = null; //API调用器   
    private firstRequest: RequestInfo = null;
    private lastRequest: RequestInfo = null;

    /**平台类型，1 安卓 2 iOS */
    get platform() {
        let p = -1;
        if (cc.sys.isNative && cc.sys.OS_IOS === cc.sys.os) {
            // 原生，只对IOS有效
            p = 2;
        }
        else if (cc.sys.isBrowser && cc.sys.OS_ANDROID === cc.sys.os && BGlobalUtil.getUrlValue('app') == 'true') {
            // 微端，只对安卓有效
            p = 1;
        }
        return p;
    }

    /**
     * 初始化MobPush.js (由系统调用)
     * @private
     */
    initMobPushJS() {
        switch (this.platform) {
            case 1:
                this.apiCaller = new AndroidAPICaller();
                this.apiCaller.log("found platform type: Android");
                break;

            case 2:
                this.apiCaller = new IOSAPICaller();
                this.apiCaller.log("found platform type: IOS");
                break;
        }
    };

    /**
     * 调用方法
     * @param method        方法
     * @param params        参数
     * @private
     */
    private CallMethod(method: MobPushMethodName, params?: any, callbackFunc?: (seqId: number, ...args: any[]) => any) {
        if (!this.apiCaller) {
            // 安卓微端和苹果原生时才输出错误信息
            if (this.platform > 0) {
                cc.error('使用前需要调用initMobPushJS初始化接口');
            }
            callbackFunc && callbackFunc(0);
            return;
        }

        seqId++;

        if (callbackFunc) {
            this.callbackDics[seqId] = callbackFunc;
        }

        let req = new RequestInfo(seqId, method, params);
        if (this.firstRequest == null) {
            this.firstRequest = req;
            this.lastRequest = this.firstRequest;
        } else {
            this.lastRequest.nextRequest = req;
            this.lastRequest = req;
        }
        this.SendRequest();

        return seqId;
    };

    /**
     * 发送请求
     * @private
     */
    private SendRequest() {
        if (!this.isRunning && this.firstRequest) {
            this.isRunning = true;
            this.apiCaller.callMethod(this.firstRequest);
            setTimeout(() => {
                this.isRunning = false;
                // 直接发送下一个请求
                this.NextRequest();
                this.SendRequest();
            }, 50);
        }
    };

    /**
     * 下一个请求
     * @private
     */
    private NextRequest() {
        if (this.firstRequest == this.lastRequest) {
            this.firstRequest = null;
            this.lastRequest = null;
            this.isRunning = false;
        } else {
            this.firstRequest = this.firstRequest.nextRequest;
        }
    }

    /**
     * 回调方法 (由系统调用)
     * @param response  回复数据
     * @private
     */
    private callback(response: IResponseInfo) {
        let callbackFunc = this.callbackDics[response.seqId];
        if (isDebug) {
            this.apiCaller.log("callback with params: " + JSON.stringify(response) + ", callback: " + callbackFunc);
        }
        if (callbackFunc) {
            delete this.callbackDics[response.seqId];
            this.apiCaller.callback(response, callbackFunc);
        }
    }

    /**
     * 初始化MobPushSDK
     * @param pushConfig            配置信息
     */
    initMobPushSDK(pushConfig: any) {
        var params = {
            "pushConfig": pushConfig
        };
        this.CallMethod(MobPushMethodName.InitMobPushSDK, params);
    }

    /**
     * 隐私协议许可
     * @param status false不同意，true同意
     */
    uploadPrivacyPermissionStatus(status: boolean) {
        var params = {
            "agree": status
        };
        this.CallMethod(MobPushMethodName.PrivacyPermissionStatus, params);
    };

    /**
     * 发送消息 仅供demo使用
     * @param msgParams
     * @param callback
     */
    sendCustomMsg(msgParams: any, callback: (seqId: number, ...args: any[]) => any) {
        var params = {
            "msgParams": msgParams,
        };
        this.CallMethod(MobPushMethodName.SendCustomMsg, params, callback);
    };

    /**
     * apns消息推送 仅供demo使用
     * @param msgParams
     * @param callback
     */
    sendAPNsMsg(msgParams: any, callback: (seqId: number, ...args: any[]) => any) {
        var params = {
            "msgParams": msgParams,
        };
        this.CallMethod(MobPushMethodName.SendAPNsMsg, params, callback);
    }


    /**
     * 发送本地通知 仅供demo使用
     * @param msgParams
     * @param callback
     */
    sendLocalNotify(msgParams: any, callback: (seqId: number, ...args: any[]) => any) {
        var params = {
            "msgParams": msgParams,
        };
        this.CallMethod(MobPushMethodName.SendLocalNotify, params, callback);
    }

    /**
     * 点击消息回调 仅供demo使用
     * @param msgParams
     * @param callback
     */
    clickMsg(msgParams: any, callback: (seqId: number, ...args: any[]) => any) {
        var params = {
            "msgParams": msgParams,
        };
        this.CallMethod(MobPushMethodName.ClickMsg, params, callback);
    }

    /**
     * 获取注册id（可与用户id绑定，实现向指定用户推送消息）
     * @param callback
     */
    getRegistrationID(callback: (seqId: number, ...args: any[]) => any) {
        var params = {};
        this.CallMethod(MobPushMethodName.GetRegistrationID, params, callback);
    };

    /**
     * 设置别名
     * @param msgParams : {"alias" : "我的别名"}
     * @param callback
     */
    setAlias(msgParams: any, callback: (seqId: number, ...args: any[]) => any) {
        var params = {
            "msgParams": msgParams,
        };
        this.CallMethod(MobPushMethodName.SetAlias, params, callback);
    };

    /**
     * 获取别名
     * @param callback
     */
    getAlias(callback: (seqId: number, ...args: any[]) => any) {
        var params = {};
        this.CallMethod(MobPushMethodName.GetAlias, params, callback);
    };

    /**
     * 删除别名
     * @param callback
     */
    deleteAlias(callback: (seqId: number, ...args: any[]) => any) {
        var params = {};
        this.CallMethod(MobPushMethodName.DeleteAlias, params, callback);
    };

    /**
     * 添加标签
     * @param msgParams : {"tags" : ['a','b','c'],}
     * @param callback
     */
    addTags(msgParams: any, callback: (seqId: number, ...args: any[]) => any) {
        var params = {
            "msgParams": msgParams,
        };
        this.CallMethod(MobPushMethodName.AddTags, params, callback);
    };

    /**
     * 获取所有标签
     * @param callback
     */
    getTags(callback: (seqId: number, ...args: any[]) => any) {
        var params = {};
        this.CallMethod(MobPushMethodName.GetTags, params, callback);
    };

    /**
     * 删除标签
     * @param msgParams : {"tags" : ['a','b'],}
     * @param callback
     */
    deleteTags(msgParams: any, callback: (seqId: number, ...args: any[]) => any) {
        var params = {
            "msgParams": msgParams,
        };
        this.CallMethod(MobPushMethodName.DeleteTags, params, callback);
    };

    /**
     * 清空所有标签
     * @param callback
     */
    cleanAllTags(callback: (seqId: number, ...args: any[]) => any) {
        var params = {};
        this.CallMethod(MobPushMethodName.CleanAllTags, params, callback);
    };

    /**
     * 清空所有标签(仅供android端使用，ios请忽略)
     * @param callback
     */
    addPushReceiver() {
        var params = {};
        this.CallMethod(MobPushMethodName.AddPushReceiver, params);
    };


    /**
     * 设置通知图标
     * @param msgParams : {"notifyIcon" : "图片资源名"}
     * @param callback
     */
    setNotifyIcon(msgParams: any, callback: (seqId: number, ...args: any[]) => any) {
        var params = {
            "msgParams": msgParams,
        };
        this.CallMethod(MobPushMethodName.SetNotifyIcon, params, callback);
    };

    /**
     * 设置通知图标
     * @param msgParams : {"hidden" : true}
     * @param callback
     */
    setAppForegroundHiddenNotification(msgParams: any, callback: (seqId: number, ...args: any[]) => any) {
        var params = {
            "msgParams": msgParams,
        };
        this.CallMethod(MobPushMethodName.SetAppForegroundHiddenNotification, params, callback);
    };

    /**
     * 添加MobPush推送接收监听(仅供android端使用，ios请忽略)
     * @param body
     * body: {"action":0,"result":{}}
     * action=0(透传),1(通知),2(点击打开通知),3(tags),4(alias)
     * action=0,result :{"messageId":"","content":"","extrasMap":{},"timestamp":""}
     * action=1,result :{"messageId":"","content":"","title":"","style":"","styleContent":"","extrasMap":{},"timestamp":"","inboxStyleContent":"","channel":""}
     * action=2,result :{"messageId":"","content":"","title":"","style":"","styleContent":"","extrasMap":{},"timestamp":"","inboxStyleContent":"","channel":""}
     * action=3,result :{"tags":"","operation":"","errorCode":""} operation 操作说明（0 获取， 1 设置， 2 删除，3 清空）,errorCode 操作结果（0 成功，其他失败，见{@link MobPushErrorCode}）
     * action=4,result :{"alias":"","operation":"","errorCode":""} operation 操作说明（0 获取， 1 设置， 2 删除）,errorCode 操作结果（0 成功，其他失败，见{@link MobPushErrorCode}）
     */
    onMessageCallBack = function (body: any) {
        // alert(body.action == 0 ? "接收到透传信息" :
        //     (body.action == 1 ? "接收到通知" :
        //         (body.action == 2 ? "接收到通知点击打开" :
        //             (body.action == 3 ? "接收到标签操作" :
        //                 "接收到别名操作"))));
        // if (body.action == 0) {
        //     //接收到透传信息回调
        //     alert(JSON.stringify(body.result));
        // } else if (body.action == 1) {
        //     //接收到通知回调
        //     alert(JSON.stringify(body.result));
        // } else if (body.action == 2) {
        //     //接收到通知点击打开回调
        //     alert(JSON.stringify(body.result));
        // } else if (body.action == 3) {
        //     //接收到标签操作回调
        //     alert(JSON.stringify(body.result));
        // } else if (body.action == 4) {
        //     //接收到别名操作回调
        //     alert(JSON.stringify(body.result));
        // }
    }
}

const BMobPushUtil = gdk.Tool.getSingleton(MobPushUtilClass);
window['$mobpush'] = BMobPushUtil;   // 提供给原生调用
iclib.addProp('MobPushUtil', BMobPushUtil);
export default BMobPushUtil;