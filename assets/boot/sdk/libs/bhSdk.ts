const wx = window['wx'];
class MiniSdk {
    // 接口地址
    getTgUrl = `https://ggxyx.icefoxgame.com/api/get`
    apiPrefix = "https://api.icefoxgame.com/api/v1";
    sdkPrefix = "https://sdkapi.icefoxgame.com/api/v1";
    orderPrefix = "https://order.icefoxgame.com/api/v1";
    playPrefix = "https://play.icefoxgame.com/api/v1";
    logPrefix = "https://log.icefoxgame.com/api/v1";
    partnerFix = "https://partner.icefoxgame.com/api/v1";
    notifyrFix = "https://notify.icefoxgame.com/api/v1";

    // 回调函数
    loginCallback: any = "";
    payCallback: any = "";
    shareCallback: any = "";
    reportCallback: any = "";
    // 支付通知触发参数
    repay_timer: any = "";
    repay_delay = 6000;
    repay_empty_count = 0;
    repay_empty_count_max = 10;
    // 传入的分享参数
    shareQuery: any = "";
    // 分享的数据
    shareData: any = "";
    // 配置
    config: any = "";
    // 系统
    system: any = "";
    // client_id
    client_id: any = "";
    // 用户信息
    userInfo: any = "";
    // 绑定信息
    unionInfo: any = "";
    // 场景值
    via: any = "";
    flagList = {
        initFlag: false, //用于判断初始化是否完成
        loginFlag: false, //用于判断CP是否调用了login
        shareFlag: false, //用于判断获取分享数据是否完成
        clickFlag: false, //用于放置用户重复点击
        videoError: false //用户判断视频播放是否错误
    }
    //是否 是分享奖励按钮
    isAward = 0;
    //客服支付卡片的图片
    payCardImg: any = '';
    awardShareCallback: any;
    goShareCallback: any;

    constructor() {
        wx.onShow((res) => {
            const that = this
            console.log(res, '====res')
            this.isAward = res.query.isAward || 0
            if (res.query.isAward && this.awardShareCallback) {
                this.awardShareCallback(res.shareTicket, this.awardShareCallback)
                that.showMsg("分享成功");
                this.awardShareCallback = ''
            }
            if (this.goShareCallback) {
                this.goShareCallback()
                that.showMsg("分享成功");
                this.goShareCallback = ''
            }
        })
    }

    /**
     * 检查一段文本是否含有违法违规内容
     * opts:
     * {content:"文本内容"}
     */
    msgSecCheck(opts) {
        var reqUrl = "/wx/app/MsgCheck?accessToken=" + wx.getStorageSync("accessToken");
        const qdata: any = {
            content: opts.content,
        };
        wx.request({
            url: reqUrl,
            data: qdata,
            method: "post",
            success: function (res) {
                if (opts.callback) {
                    if (opts.callback) {
                        opts.callback(res);
                    }
                }
            }, fail: (res) => {
                if (opts.callback) {
                    opts.callback({ data: { result: 500, msg: res.errMsg } });
                }
            }, complete: (res) => {
                if (opts.loading) {
                    wx.hideLoading();
                }
            }
        });
    }

    /**
     * 打点
     * 需在入口文件 game.js里面调用此函数
     * obj {pid, gid}
     */
    setTag(obj) {
        const options = wx.getLaunchOptionsSync();
        let mid = wx.getStorageSync("mid");
        if (!mid) {
            mid = options.query.mid
            wx.setStorageSync("mid", options.query.mid);
        }
        let p_mid = wx.getStorageSync("p_mid");
        if (!p_mid) {
            p_mid = options.query.p_mid
            wx.setStorageSync("p_mid", options.query.p_mid);
        }
        let client_id = wx.getStorageSync("client_id");
        if (!client_id) {
            client_id = this.getClientId();
            wx.setStorageSync("client_id", client_id);
        }
        let data = {
            pid: obj.pid,
            gid: obj.gid,
            p_mid,
            mid,
            client_id
        }
        wx.request({
            url: `${this.sdkPrefix}/mini/show`, //正式
            // url: 'http://sdkapi.binghu666.com/api/v1/mini/show', //测试
            data,
            method: 'post',
            success: res => {
                console.log(res)
            }
        })
    }

    // 订阅消息授权    
    requestSubscribeMessage(messageId, callback) {
        let version = wx.getSystemInfoSync().SDKVersion
        version = version.replace(/\./g, "")
        if (version >= 294) {
            wx.requestSubscribeMessage({
                tmplIds: [messageId],
                success(res) {
                    callback(res)
                    res === {
                        errMsg: "requestSubscribeMessage:ok",
                        "zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE": "accept"
                    }
                },
                fail(res) {
                    console.log('失败')
                    callback(res)
                }
            })
        } else {
            wx.requestSubscribeMessage({
                tmplIds: [messageId],
                success(res) {
                    callback(res)
                    res === {
                        errMsg: "requestSubscribeMessage:ok",
                        "zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE": "accept"
                    }
                },
                fail(res) {
                    console.log('失败')
                    callback(res)
                }
            })
        }
    }


    /**
     * 初始化
     * @param {*} config
     * @param {*} callBack
     */
    init(config, callBack: any = "") {
        const that = this;
        this.config = config;
        if (!config.pid) {
            console.log("init Error：缺少pid");
            return;
        }
        if (!config.gid) {
            console.log("init Error：缺少gid");
            return;
        }
        if (config.debug) {
            this.repay_empty_count_max = 3;
            this.repay_delay = 2000;
        }
        const options = wx.getLaunchOptionsSync();
        this.config.mid = options.query.mid || "10000";
        this.config.p_mid = options.query.p_mid || 1;
        // 获取client_id
        let client_id = wx.getStorageSync("client_id");
        if (!client_id) {
            client_id = this.getClientId();
            wx.setStorageSync("client_id", client_id);
        }
        // 获取系统信息
        let systemObj = wx.getSystemInfoSync();
        if (systemObj.system.toLowerCase().includes("ios")) {
            this.system = "ios";
        } else {
            this.system = "android";
        }
        this.client_id = client_id;
        let initData: any = {
            pid: config.pid,
            gid: config.gid,
            mid: that.config.mid,
            p_mid: that.config.p_mid,
            client_id: client_id,
            brand: systemObj.brand,
            model: systemObj.model,
            wpi: Math.round(systemObj.windowWidth) || '0',
            hpi: Math.round(systemObj.windowHeight) || '0',
            version: systemObj.version,
            platform: that.system,
            tm: (Date.now() / 1000) >> 0
        };
        initData.sign = this.signData(initData);

        wx.request({
            url: `${this.sdkPrefix}/mini/init`,
            data: initData,
            method: "post",
            success: res => {
                const resData = res.data;
                if (resData.code === 200) {
                    that.config.shareImg = resData.data.config.share_img;
                    that.config.shareTitle = resData.data.config.share_title;
                    that.config.mid = resData.data.config.mid;
                    that.config.p_mid = resData.data.config.p_mid;
                    that.payCardImg = resData.data.kf_img_url;
                    wx.updateShareMenu({
                        withShareTicket: true
                    })
                    if (callBack && typeof callBack === "function") {
                        const cpInitData = resData.data.config
                        if (wx.checkGameLiveEnabled) {
                            wx.checkGameLiveEnabled({
                                success(res) {
                                    console.log('isEnabled', res.isEnabled) // 当前用户是否有直播权限（true/false）
                                    if (!res.isEnabled) {
                                        cpInitData.live_state = false
                                    }
                                    console.log('config', cpInitData)
                                    callBack(that.checkRes(200, cpInitData, resData.msg));
                                },
                                fail(err) {
                                    console.log('err', err)
                                    cpInitData.live_state = false
                                    console.log('config', cpInitData)
                                    callBack(that.checkRes(200, cpInitData, resData.msg));
                                }
                            })
                        } else {
                            console.log('没有内测资格')
                            console.log('cpdata', cpInitData)
                            cpInitData.live_state = false;
                            callBack(that.checkRes(200, cpInitData, resData.msg));
                        }
                        if (that.flagList.loginFlag) {
                            that.flagList.initFlag = true
                            that.login(that.loginCallback)
                        }
                    }
                } else {
                    that.showMsg(resData.msg);
                }
            },
            fail: err => {
                that.showMsg(err.msg);
            }
        });
        this.startRepay();
    }




    // 重复触发发货通知
    startRepay(res?) {
        const that = this;
        if (
            wx.getStorageSync("accessToken") &&
            wx.getStorageSync("orderNo") &&
            wx.getStorageSync("hasOrder") == 1
        ) {
            that.repay_timer = setInterval(function () {
                that.repay_empty_count++;
                if (that.repay_empty_count > that.repay_empty_count_max) {
                    clearInterval(that.repay_timer);
                    that.repay_timer = null;
                } else {
                    that.sendPayNotify();
                }
            }, that.repay_delay * that.repay_empty_count);
        }
    }


    // 发货通知函数
    sendPayNotify() {
        const that = this;
        if (wx.getStorageSync("accessToken") && wx.getStorageSync("orderNo")) {
            const notifyData: any = {
                accessToken: wx.getStorageSync("accessToken"),
                orderNo: wx.getStorageSync("orderNo"),
                platform: that.system,
                sessionKey: wx.getStorageSync("sessionKey")
            };
            notifyData.sign = that.signData(notifyData);
            that.repay_empty_count++;
            wx.request({
                url: `${that.notifyrFix}/partner/call/${that.config.pid}/${that.config.gid
                    }`,
                data: notifyData,
                method: "post",
                success: function (res) {
                    const resData = res.data;
                    if (resData.code === 200) {
                        if (that.config.debug) {
                            that.showMsg("回调成功");
                        }
                        that.payCallback(that.checkRes(200, "", "success"));
                        clearInterval(that.repay_timer);
                        that.repay_timer = null;
                        wx.setStorageSync("hasOrder", 0);
                        wx.removeStorageSync("orderNo");
                    } else {
                        if (that.repay_empty_count >= that.repay_empty_count_max) {
                            wx.setStorageSync("hasOrder", 0);
                            wx.removeStorageSync("orderNo");
                            that.payCallback(that.checkRes(resData.code, "", resData.msg));
                        } else {
                            that.repay_empty_count++;
                            setTimeout(() => {
                                that.sendPayNotify();
                            }, that.repay_empty_count * 1000);
                        }
                    }
                },
                fail: function (err) {
                    that.showMsg(JSON.stringify(err));
                }
            });
        }
    }

    /**
     * 伪造client_id
     */
    getClientId() {
        const myDate = new Date();
        let client_id = "wx";
        const num = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000000);
        client_id += myDate.getFullYear();
        client_id += "-" + (myDate.getMonth() + 1);
        client_id += "-" + myDate.getDate();
        client_id += "-" + myDate.getHours();
        client_id += "-" + myDate.getMinutes();
        client_id += "-" + myDate.getSeconds();
        client_id += "-" + num;
        return client_id;
    }

    /**
     * 检测session状态
     * @param {*} callBack
     */
    checkSession(callBack) {
        const that = this;
        wx.checkSession({
            success(res) {
                callBack(that.checkRes(200));
            },
            fail(err) {
                callBack(that.checkRes(500, "", err.errMsg));
            }
        });
    }
    /**
     * 登录
     * @param {*} callBack
     */
    login(callBack) {
        const that = this;
        if (this.compareVersion(wx.getSystemInfoSync().SDKVersion, "2.0.6") >= 0) {
            that.loginFun(callBack);
        } else {
            wx.getSetting({
                success(res) {
                    wx.authorize({
                        scope: "scope.userInfo",
                        success() {
                            that.loginFun(callBack);
                        }
                    });
                }
            });
        }
        // that.loginFun(callBack)
    }
    /**
     * 登录回调
     * @param {*} loginCallBack
     */
    loginFun(loginCallBack) {
        const that = this;
        that.loginCallback = loginCallBack;
        wx.login({
            success: res => {
                console.log(res, '=====res')
                let loginData: any = {
                    pid: this.config.pid,
                    gid: this.config.gid,
                    mid: this.config.mid,
                    p_mid: this.config.p_mid,
                    tm: (Date.now() / 1000) >> 0,
                    client: "h5",
                    client_id: that.client_id,
                    partner_login_data: JSON.stringify({
                        code: res.code,
                        system: that.system,
                        client_id: that.client_id
                    })
                };
                loginData.sign = this.signData(loginData);
                // 触发登录接口
                wx.request({
                    url: `${this.partnerFix}/partner/login/account`,
                    data: loginData,
                    method: "post",
                    success: res => {
                        const resData = res.data.data;
                        if (res.data.code !== 200 && res.data.code == 2015) {
                            that.showMsg(res.data.msg);
                            return false
                        } else if (res.data.code !== 200 && res.data.code !== 2015) {
                            that.flagList.loginFlag = true
                            that.flagList.initFlag == true ? that.showMsg("登陆失败，请联系客服") : null
                            return false;
                        }
                        // 给CP的数据，以及设置缓存
                        const cpUserInfo: any = {
                            accessToken: resData.access_token,
                            device: resData.device,
                            gameName: resData.game_name,
                            uid: resData.p_uid,
                            mid: resData.mid,
                            p_mid: resData.p_mid,
                        };

                        resData.mid && (that.config.mid = resData.mid);
                        resData.p_mid && (that.config.p_mid = resData.p_mid);
                        wx.setStorageSync("uname", resData.uname);
                        wx.setStorageSync("openId", resData.p_uid);
                        wx.setStorageSync("accessToken", resData.access_token);
                        wx.setStorageSync("sessionKey", resData.session_key);
                        that.userInfo = resData;
                        // 判断用户是否需要实名验证
                        intoGame()

                        // 进入游戏
                        function intoGame() {
                            const step = resData.auth_conf.step
                            // 开启心跳统计
                            if (step && step != null) {
                                that.statisticalTime(step)
                            }
                            // 创建游戏圈
                            if (resData.show_game_club) {
                                that.gameClub()
                            }
                            // 返回给cp
                            that.loginCallback(that.checkRes(200, cpUserInfo, "success"));
                            // 开启弹窗
                            if (resData.alert) {
                                if (resData.alert.is) {
                                    wx.showModal({
                                        title: "提示",
                                        content: resData.alert.info || "复制链接到浏览器继续玩",
                                        confirmText: "复制",
                                        success(res) {
                                            wx.setClipboardData({
                                                data: resData.alert.url,
                                                success(res) {
                                                    wx.getClipboardData({
                                                        success(res) {
                                                            console.log(resData.alert.url); // data
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    },
                    fail: function (res) {
                        that.loginCallback(that.checkRes(500, "", "fail"));
                    }
                });
            },
            fail: function (res) {
                console.log("fail", res);
            }
        });
    }

    // 下架弹窗公告
    pullPop(roleData: any = {}) {
        const that = this;
        const data: any = {
            pid: that.config.pid,
            gid: that.config.gid,
            p_mid: that.config.p_mid,
            mid: that.config.mid,
            ext: JSON.stringify({
                role_id: roleData.role_id,
                role_level: roleData.role_level
            }),
            access_token: roleData.access_token || that.userInfo.access_token,
        }
        wx.request({
            url: `${that.sdkPrefix}/wap/token/alert`,
            data: data,
            method: "post",
            success: res => {
                const resData = res.data.data
                if (res.data.code === 200) {
                    if (resData.is) {
                        wx.showModal({
                            title: "提示",
                            content: resData.info || "复制链接到浏览器继续玩",
                            confirmText: "复制",
                            success(res) {
                                if (res.confirm) {
                                    wx.setClipboardData({
                                        data: resData.url,
                                        success(res) {
                                            wx.getClipboardData({
                                                success(res) {
                                                    console.log(data.url); // data
                                                }
                                            });
                                        }
                                    });
                                } else if (res.cancel) {
                                    console.log("用户点击取消");
                                }
                            }
                        });
                    }
                }
            },
            fail: function (err) {
                // that.showMsg(err.data.msg);
            }
        });
    }

    //获取实名认证信息
    getCertificationMessage(idMessage) {
        const that = this
        const bhData: any = {
            pid: that.config.pid,
            gid: that.config.gid,
            access_token: wx.getStorageSync("accessToken"),
            uname: wx.getStorageSync("uname"),
            tm: (Date.now() / 1000) >> 0
        }
        bhData.sign = that.signData(bhData)
        wx.request({
            url: `${that.sdkPrefix}/bindInfo/idCard`,
            data: bhData,
            method: "POST",
            success: res => {
                //此处需要cp将信息绑定在实名认证输入框用于展示
                console.log(res.data.data)
                idMessage(that.checkRes(200, res.data.data, "succees"));
            }
        })
    }

    //实名验证
    nameCertification(idName, idNumber, callBack, flag = true) {
        const that = this
        const bhData: any = {
            pid: this.config.pid,
            gid: this.config.gid,
            access_token: wx.getStorageSync("accessToken"),
            uname: wx.getStorageSync("uname"),
            real_name: idName,
            id_number: idNumber,
            tm: (Date.now() / 1000) >> 0
        }
        bhData.sign = this.signData(bhData)
        wx.request({
            url: `${that.sdkPrefix}/verify/id`,
            data: bhData,
            method: "POST",
            success: res => {
                if (res.data.code == 200) {
                    wx.setStorageSync("accessToken", res.data.access_token);
                    callBack(that.checkRes(200, "", "succees"))
                    flag ? that.loginFun(that.loginCallback) : ''
                } else {
                    callBack(that.checkRes(500, "", "fail"))
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    }

    //心跳统计时长  ==>初始化时判断  需要时登录时触发
    statisticalTime(time) {
        const that = this
        const step = time
        const step2 = step * 60 * 1000
        console.log('哈哈哈哈哈')
        console.log(step)

        let timer = setInterval(() => {
            const bhData: any = {
                pid: that.config.pid,
                gid: that.config.gid,
                client: "h5",
                uname: wx.getStorageSync("uname"),
                access_token: wx.getStorageSync("accessToken"),
                tm: (Date.now() / 1000) >> 0
            }
            bhData.sign = that.signData(bhData)
            wx.request({
                url: `${that.sdkPrefix}/sdk/user/heartbeat`,
                data: bhData,
                method: "POST",
                success: res => {
                    if (res.data.code == 104) {
                        //提示
                        const msg = res.data.msg
                        wx.showModal({
                            title: '提示',
                            content: msg,
                            showCancel: false,
                            success(res) {
                                if (res.confirm) {
                                    wx.onTouchStart(function (e) {
                                        wx.showModal({
                                            title: '提示',
                                            content: msg,
                                        })
                                    })
                                }
                            }
                        })
                        clearInterval(timer)

                    }
                }
            })
        }, step2)
    }


    /**
     * 排行版
     * data  要修改的 KV 数据列表
     */
    setLevelVersion(data) {
        const Data = data
        let that = this

        const wxData = JSON.stringify({ //微信所需数据
            "wxgame": {
                "role_level": Data.role_level
            },
            "tm": (Date.now() / 1000) >> 0
        })

        const bhData: any = { //后端所需数据
            pid: that.config.pid,
            gid: that.config.gid,
            tm: (Date.now() / 1000) >> 0,
            partner_data: JSON.stringify({
                "openid": wx.getStorageSync("openId"),
                "session_key": wx.getStorageSync("sessionKey"),
                "kv_list": {
                    "newslevel": Data.role_level
                }
            })
        }
        bhData.sign = that.signData(bhData),

            wx.setUserCloudStorage({
                KVDataList: [{
                    key: "newslevel",
                    value: wxData
                }],
                success: res => { //接口调用成功
                    console.log(res);
                    wx.request({
                        url: `${that.partnerFix}/partner/report`,
                        data: bhData,
                        method: "POST",
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success(res) {
                            console.log(res.data)
                        }
                    })
                },
                fail: res => { //接口调用失败
                    console.log(res);
                }
            })
    }
    /**
     *  小程序和公众号绑定（互通）
     * @param {*} data
     */
    bindAccount(data, callBack) {
        let that = this;
        let bindData: any = {
            pid: that.config.pid,
            gid: that.config.gid,
            access_token: data.access_token || wx.getStorageSync("accessToken"),
            encryptedData: data.encryptedData || that.unionInfo.encryptedData,
            iv: data.iv || that.unionInfo.iv,
            session_key: wx.getStorageSync("sessionKey")
        };
        bindData.sign = that.signData(bindData);
        if (data.encryptedData && data.iv) {
            wx.request({
                url: `${this.partnerFix}/partner/related/account`,
                data: bindData,
                method: "post",
                success: res => {
                    if (res.data.code == 200) {
                        if (callBack && typeof callBack === "function") {
                            wx.setStorageSync("unionId", res.data.data.unionId);
                            callBack(that.checkRes(200, res.data, "success"));
                        }
                    } else {
                        callBack(that.checkRes(res.data.code, "", res.data.msg));
                    }
                },
                fail: function (err) {
                    callBack(that.checkRes(err.data.code, "", err.data.msg));
                }
            });
        }
    }

    // 游戏更新订阅
    updateSubscription(callback) {
        const that = this
        wx.requestSubscribeWhatsNew({
            msgType: 1,    // 消息类型，1=游戏更新提醒，目前只有这种类型
            success(res) {
                console.log(res)
                // res.confirm === true（确认） 或 false（取消）
                // res.status === 0（未知状态） 1（未订阅，可以发起订阅） 2（用户已订阅该类型消息） 3（超过频率限制，暂时不允许发起订阅） 4（没有权限或已封禁） 
                if (res.confirm === true) {
                    callback(that.checkRes(200, "", '玩家点击了确认'))
                } else {
                    callback(that.checkRes(200, "", '玩家点击了取消'))
                }
            },
            fail(err) {
                console.error(err)
            }
        })
    }

    //获取移动积分活动url
    getYiDongActivityUrl(params, callBack) {
        const that = this
        const bhData = {
            pid: this.config.pid,
            gid: this.config.gid,
            access_token: wx.getStorageSync("accessToken"),
            role_id: params.role_id,
            role_name: params.role_name,
            server_id: params.server_id,
            server_name: params.server_name,
            mobile: params.mobile,
            sign: '',
        }
        let signData = (queryObj, noMd5?, hasSign?) => {
            const keyArr = Object.keys(queryObj);
            let str = "";
            keyArr.includes("sign") ?
                keyArr.splice(keyArr.findIndex(item => item === "sign"), 1) :
                "";
            if (hasSign) {
                keyArr.push('sign')
            }
            keyArr.sort();
            for (let i = 0; i < keyArr.length; i += 1) {
                if (queryObj[keyArr[i]]) {
                    str = `${str}&${keyArr[i]}=${queryObj[keyArr[i]]}`;
                }
            }
            str += "&GnA6z1h7580FOmItY9gHRZTMC"
            if (noMd5) {
                return `${str.substr(1)}`;
            } else {
                return md5(`${str.substr(1)}`);
            }
        }
        bhData.sign = signData(bhData)
        wx.request({
            url: `https://actapi.icefoxgame.com/PointsRedeem/userBind`,
            data: bhData,
            method: "POST",
            success: res => {
                if (res.data.code == 200) {
                    callBack(that.checkRes(200, res.data, "success"))
                } else {
                    callBack(that.checkRes(500, res.data, "fail"))
                }
            }
        })
    }

    /**
     * 游戏圈按钮
     */
    gameClub(icon = 'dark', style = {
        left: 10,
        top: 13,
        width: 27,
        height: 27
    }) {
        wx.createGameClubButton({
            icon,
            style
        })
    }


    /**
     * 创建按钮
     * @param {*} config
     */
    createUserInfoBtn(config) {
        let that = this;
        let button = "";
        let btnConfitg: any = {
            type: config.type || "type",
            style: {
                left: config.style.left || 10,
                top: config.style.top || 76,
                width: config.style.width || 200,
                height: config.style.height || 40,
                lineHeight: config.style.lineHeight || 40,
                backgroundColor: config.style.backgroundColor || "#f00",
                color: config.style.color || "#ffffff",
                textAlign: config.style.textAlign || "center",
                fontSize: config.style.fontSize || 16,
                borderRadius: config.style.borderRadius || 4
            }
        };
        if (config.type === "image" && config.image) {
            btnConfitg.image = config.image;
        } else {
            btnConfitg.text = btnConfitg.text || "获取用户信息";
        }
        if (this.compareVersion(wx.getSystemInfoSync().SDKVersion, "2.0.6") >= 0) {
            button = wx.createUserInfoButton(btnConfitg);
        } else {
            return false;
        }
        return button;
    }


    /**
     * 角色信息上报
     * @param {*} data
     * @param {*} callBack
     */
    submitRoleInfo(roleData: any = {}, callBack: any = "") {
        const that = this;
        const data: any = {
            tm: (Date.now() / 1000) >> 0,
            pid: this.config.pid,
            gid: this.config.gid,
            mid: this.config.mid,
            action: roleData.info_type,
            access_token: roleData.access_token || wx.getStorageSync("accessToken"),
            role_info: JSON.stringify(roleData),
            client: "h5"
            // access_token: this.userInfo.access_token,
        };
        data.sign = this.signData(data);
        // 触发角色上报接口
        wx.request({
            url: `${this.logPrefix}/role/index`,
            data: data,
            method: "post",
            success: res => {
                if (res.data.code === 200) {
                    if (callBack && typeof callBack === "function") {
                        callBack(that.checkRes(200, "上报成功"));
                        if (roleData.info_type === 'roleUplevel') {
                            that.pullPop(roleData)
                        }
                    }
                } else {
                    that.showMsg(res.data.msg);
                }
            },
            fail: function (err) {
                that.showMsg(err);
            }
        });
    }


    /**
     * 小程序内容检查(提审期间启用,过审关闭)
     * @param {*} content ,字符串  检测内容
     * @param {*} cb CP回调
     */
    checkContent(content, cb = null) {
        const that = this
        let data = {
            pid: that.config.pid | 0,
            gid: that.config.gid | 0,
            tm: (Date.now() / 1000) >> 0,
            partner_data: JSON.stringify({
                content
            })
        }
        wx.request({
            url: `${that.partnerFix}/partner/chat/index`,
            data: data,
            method: 'post',
            success: (res) => {
                let resData = res.data
                if (resData.code === 200 && resData.data.pass === true) {
                    if (cb && typeof (cb) === 'function') {
                        cb(that.checkRes(200, true, 'success'));
                    }
                } else {
                    cb(that.checkRes(500, '请求失败', 'error'));
                }
            },
            fail: (err) => {
                that.showMsg(err.data.msg);
                cb(that.checkRes(500, err.data.msg, 'error'));
            }
        })
    }

    /**
     * 切支付开关
     * @param {*} cpData cp传进来的数据  {role_level, system, access_token}
     * @param {*} cb   cp的回调函数
     */
    isShowPay(cpData, cb = null) {
        console.log('传入数据====', cpData)
        const that = this
        let obj = {
            role_level: cpData.role_level,
            system: cpData.system,
            version: ''
        }
        let data = {
            pid: that.config.pid,
            gid: that.config.gid,
            mid: that.config.mid,
            p_mid: that.config.p_mid,
            access_token: cpData.access_token,
            ext: JSON.stringify(obj)
        }
        wx.request({
            url: `${that.sdkPrefix}/sdk/show/cut`,
            data,
            method: 'post',
            success: (res) => {
                let resData = res.data
                if (resData.code === 200 && resData.data === true) {
                    if (cb && typeof (cb) === 'function') {
                        cb(that.checkRes(200, true, 'success'));
                    }
                } else {
                    if (cb && typeof (cb) === 'function') {
                        cb(that.checkRes(resData.code, false, 'fail'))
                    }
                }
            },
            fail: (err) => {
                that.showMsg(err.data.msg);
                if (cb && typeof (cb) === 'function') {
                    cb(that.checkRes(500, false, 'fail'))
                }
            }
        })
    }


    /**
     * 支付
     * @param {*} orderData 支付数据
     * @param {*} callBack 支付后回调
     */
    pay(data, callBack = "") {
        this.payCallback = callBack;
        let checkPayRes: any = this.checkPayData(data);
        const that = this;
        if (checkPayRes.isPay) {
            let client_id = wx.getStorageSync("client_id");
            if (client_id) {
                // 下单参数
                const orderData: any = {
                    pid: that.config.pid,
                    gid: that.config.gid,
                    mid: that.config.mid,
                    p_mid: that.config.p_mid,
                    tm: (Date.now() / 1000) >> 0,
                    access_token: data.access_token,
                    amt: data.amt,
                    game_order_no: data.game_order_no,
                    goods_name: data.goods_name,
                    role_id: data.role_id,
                    role_name: data.role_name,
                    role_level: data.role_level,
                    server_id: data.server_id,
                    server_name: data.server_name,
                    // game_order_no: data.game_order_no,
                    client: "h5",
                    client_id: that.client_id,
                    device_id: "",
                    sdk_ver: "",
                    game_ext: data.game_ext || "",
                    partner_pay_data: JSON.stringify({
                        system: that.system
                    })
                };
                orderData.sign = this.signData(orderData);
                // 多渠道下单
                wx.request({
                    url: `${that.orderPrefix}/partner/order`,
                    data: orderData,
                    method: "post",
                    success: res => {
                        let data = res.data.data;
                        console.log(data)
                        if (res.data.code === 200) {
                            // 支付方式
                            if (data.partner_data.type == 2) {
                                that.useServicePay();
                            } else if (data.partner_data.type == 3) {
                                that.useLinkPay(
                                    that.b64DecodeUnicode(data.partner_data.status)
                                );
                            } else if (data.partner_data.type == 4) {
                                that.useMiniGamePay(data.partner_data.status);
                            } else if (data.partner_data.type == 1) {
                                that.useNativePay(data.partner_data, data.my_order_no);
                            } else if (data.partner_data.type == 5) {
                                wx.request({
                                    // url: 'https://play.icefoxgame.com/api/v1/play/create',
                                    url: `${that.playPrefix}/play/create`,
                                    method: 'POST',
                                    data: data.partner_data.status,
                                    success: res => {
                                        that.projectCode(res.data.data.url);
                                    }
                                })
                            }

                        } else if (res.data.code == 103) {
                            that.payCallback(that.checkRes(400));
                        } else if (res.data.code == 500) {

                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    },
                    fail: function (res) {
                        console.log("pay fail");
                    }
                });
            } else {
                this.login(this.loginCallback);
            }
        } else {
            this.showMsg(checkPayRes.msg, true);
        }
    }

    /**
     * 设置分享函数，被动
     * @param {*} data
     * @param {*} callBack
     */
    setShare(data: any = "", callBack: any = "") {
        console.log('bh setShare')
        const that = this;
        if (!that.flagList.shareFlag) {
            that.getShareData(data, callBack, "setShare");
            return false;
        }
        let query: any = "";
        if (data.query) {
            query = that.pareUrl(data.query);
        } else {
            query = wx.getLaunchOptionsSync().query;
        }
        query.mid = 10000;
        query.p_mid = that.config.p_mid;
        query = this.signData(query, true);
        //分享到好友 朋友圈
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        // wx.showShareMenu({
        //   withShareTicket: true
        // });
        let title = that.config.shareTitle || data.shareTitle;
        let imgUrl = that.config.shareImg || data.shareImg;
        if (!title) {
            console.log("没有分享标题");
        } else if (!imgUrl) {
            console.log("没有分享图");
        }
        that.shareData = {
            title: title,
            imageUrl: imgUrl,
            query: query,
            // success: res => {
            //   var shareTicket = (res.shareTickets && res.shareTickets[0]) || "";
            //   wx.getShareInfo({
            //     // 把票据带上
            //     shareTicket: shareTicket,
            //     success: function (res) {
            //       // // 如果从小程序分享没有source，如果从别人分享的再二次分享带有source
            //       // // 后续会讲_this.data.source的来源
            //       // let source = _this.data.source ? _this.data.source : '';
            //       // // 上报给后台，把群信息带给后台，后台会去解密得到需要的信息
            //       // _this.upload_share_Result(res, '1', source)
            //       that.showMsg("分享成功");
            //     }
            //   });
            // },
            // fail: err => {
            //   that.showMsg("分享失败");
            //   console.log("share fail", err);
            // }
        };
        wx.onShareTimeline(() => {
            return that.shareData
        })
        wx.onShareAppMessage(function () {
            return that.shareData;
        });
        that.flagList.shareFlag = false;
    }

    /**
     * 主动分享
     */
    goShare(data: any = "", callBack: any = "", isAward?) {
        const that = this;
        if (isAward) that.isAward = 1 //开启分享奖励
        if (!that.flagList.shareFlag) {
            that.getShareData(data, callBack, "goShare");
            return false;
        }
        let query: any = "";
        if (data.query) {
            query = that.pareUrl(data.query);
        } else {
            query = wx.getLaunchOptionsSync().query;
        }
        query.mid = 10000;
        query.p_mid = that.config.p_mid;
        query.isAward = that.isAward || 0
        query = that.signData(query, true);
        let title = that.config.shareTitle || data.shareTitle;
        let imgUrl = that.config.shareImg || data.shareImg;
        if (!title) {
            console.log("没有分享标题");
        } else if (!imgUrl) {
            console.log("没有分享图");
        }
        that.shareData = {
            title: that.config.shareTitle || data.shareTitle,
            imageUrl: that.config.shareImg || data.shareImg,
            query: query,
            // success: res => {
            //   that.showMsg(JSON.stringify(res));
            //   if (that.config.debug) {
            //     that.showMsg("分享成功");
            //   }
            //   if (callBack && typeof callBack === "function") {
            //     that.shareCallback = callBack;
            //     that.shareCallback();
            //   } else {
            //     that.showMsg("分享成功");
            //   }
            // },
            // fail: err => {
            //   that.showMsg("分享失败");
            //   console.log("share fail", err);
            // }
        };
        if (that.isAward) {
            if (callBack && typeof callBack === "function") {
                that.awardShareCallback = callBack
            }
            wx.showModal({
                title: '提示',
                content: '在群聊天里点击自己分享的卡片进入游戏后即可获得奖励',
                confirmText: '知道了',
                success(res) {
                    if (res.confirm) {
                        wx.shareAppMessage(that.shareData);
                    }
                }
            })
        } else {
            if (callBack && typeof callBack === "function") {
                that.goShareCallback = callBack
            }
            wx.shareAppMessage(that.shareData);
        }
        that.flagList.shareFlag = false;
    }

    /* 
        获取分享数据
      */
    getShareData(shareData, callBack, type) {
        const that = this;
        let sendShareData: any = {
            pid: that.config.pid,
            gid: that.config.gid,
            tm: (Date.now() / 1000) >> 0,
            client: "h5",
            partner_data: JSON.stringify({
                key: shareData.key || ""
            })
        };
        sendShareData.sign = this.signData(sendShareData);
        wx.request({
            url: `${this.partnerFix}/partner/share`,
            data: sendShareData,
            method: "POST",
            success: res => {
                let code = res.data.code;
                let data = res.data.data;
                if (code == 200) {
                    that.config.shareImg = data.image;
                    that.config.shareTitle = data.title;
                    that.flagList.shareFlag = true;
                    if (type == "setShare") {
                        that.setShare(shareData, callBack);
                    } else if (type == "goShare") {
                        that.goShare(shareData, callBack);
                    }
                }
            },
            fail: err => {
                that.showMsg(err.msg);
            }
        });
    }

    /**
     * 获取微信群分享奖励
     */
    getShareAward(shareTicket, callBack) {
        const that = this

        function modal(msg) {
            wx.showModal({
                title: '提示',
                content: msg,
                confirmText: '重新分享',
                cancelText: '知道了',
                success(res) {
                    if (res.confirm) {
                        // console.log('用户点击确定')
                        that.goShare()
                    } else if (res.cancel) {
                        // console.log('用户点击取消')
                    }
                }
            })
        }
        wx.getShareInfo({
            shareTicket,
            success: (res) => {
                let data = {
                    pid: that.config.pid,
                    gid: that.config.gid,
                    access_token: wx.getStorageSync("accessToken"),
                    session_key: wx.getStorageSync("sessionKey"),
                    encrypted_data: res.encryptedData,
                    iv: res.iv,
                    tm: (Date.now() / 1000) >> 0
                }
                wx.request({
                    url: `${that.partnerFix}/partner/wxShareGroupLimit`,
                    data,
                    method: 'POST',
                    success: res2 => {
                        let resData = res2.data
                        if (callBack && typeof callBack === "function") {
                            if (resData.code == 200) {
                                callBack(that.checkRes(200, '', "success"))
                            } else {
                                callBack(that.checkRes(500, '', resData.msg))
                            }
                        } else {
                            if (resData.code == 200) {

                            } else {
                                modal(resData.msg)
                            }
                        }

                    }
                })
            },
            fail: err => {
                modal('点击个人的分享卡片不会获得奖励哦！请分享到微信群吧！')
            }
        })
    }

    /**
     * 原生支付：米大师支付
     * @param {*} data
     */
    useNativePay(data, orderNo) {
        const that = this;
        wx.requestMidasPayment({
            mode: "game",
            env: data.env, // 0:正式 1：沙箱
            offerId: data.offerId, //在米大师侧申请的应用 id
            currencyType: "CNY",
            buyQuantity: data.buyQuantity, //金额
            platform: that.system,
            zoneId: data.zoneId,
            success: res => {
                wx.setStorageSync("orderNo", orderNo);
                that.sendPayNotify();
            },
            fail: err => {
                console.log(err, '===米大师err')
                if (that.payCallback) {
                    that.payCallback(that.checkRes(500, "", "支付失败"));
                }
            }
        });
    }

    /**
     * 客服窗口支付
     */
    useServicePay() {
        const that = this;
        let cardMsg = {
            img: that.payCardImg
        }
        wx.showModal({
            title: "支付提示",
            content: "即将进入客服窗口，请输入【充值】获取订单并完成支付",
            success: function () {
                that.gotoService(cardMsg)
            }
        });
    }

    /**
     * 提示外链支付
     * @param {*} data
     */
    useLinkPay(data) {
        const that = this;
        wx.showModal({
            title: "点击复制url到浏览器支付",
            content: that.shareData.title || "复制链接进行支付",
            confirmText: "复制",
            success(res) {
                if (res.confirm) {
                    wx.setClipboardData({
                        data: data,
                        success(res) {
                            wx.getClipboardData({
                                success(res) {
                                    console.log(data.url); // data
                                }
                            });
                        }
                    });
                } else if (res.cancel) {
                    console.log("用户点击取消");
                }
            }
        });
    }

    /**
     * 使用其他小程序进行支付
     * @param {*} data
     */
    useMiniGamePay(data) {
        const that = this;
        wx.navigateToMiniProgram({
            appId: 'wxb90084ab6d56d48f',
            path: `pages/ipaynowpay/ipaynowpay-hike/hike?${that.signData(data, true, true)}`,
            // path: 'pages/index/index',
            extraData: {
                foo: 'bar'
            },
            envVersion: 'release',
            success(res) {
                // that.showMsg('打开')
            },
            fail(err) {
                that.showMsg(err)
            }
        })
    }


    /**
     * 二维码预览支付
     * @param {跳转地址} data 
     */
    projectCode(data) {
        const that = this;
        wx.previewImage({
            urls: [data], // 需要预览的图片http链接列表
            success: res => {
                console.log('===success')
                console.log(res)
            },
            fail: err => {
                console.log('===err')
                console.log(err)
            }
        })
    }

    /**
     * 发送验证码
     * @param {*} mobile
     * @memberof MiniSdk
     */
    sendCode(mobile) {
        const that = this;
        let data: any = {
            pid: this.config.pid,
            gid: this.config.gid,
            mid: this.config.mid || 10000,
            mobile: mobile,
            type: 'certification',
            tm: (Date.now() / 1000) >> 0,
            client: 'h5',
            access_token: this.userInfo.access_token,
        }
        data.sign = this.signData(data);
        wx.request({
            url: `${that.apiPrefix}/send/code`,
            data: data,
            method: "POST",
            success: res => {
                if (res.code != 200) {
                    that.showMsg(res.data.msg)
                }
            },
            fail: err => {
                that.showMsg(err.data.msg)
            }
        })
    }

    /**
     * 客服奖励
     * @param {*} roleInfo
     * @memberof MiniSdk
     */
    getCusward(roleInfo) {
        const that = this;
        let cardMsg = {
            img: "https://h5.icefoxgame.com/miniGameImg/getcCusward.png"
        }
        wx.request({
            url: `${this.partnerFix}/partner/cusward`,
            data: {
                openid: that.userInfo.openid,
                pid: that.config.pid,
                gid: that.config.gid,
                tm: (Date.now() / 1000) >> 0,
                role_id: roleInfo.role_id,
                server_id: roleInfo.server_id,
                type: roleInfo.type
            },
            method: "POST",
            success: res => {
                that.gotoService(cardMsg)
            },
            fail: err => {
                that.showMsg(err.msg);
            }
        });
    }

    /**
     * 跳转到客服
     * cardMsg{
     *  title: '',
     *  path: '',
     *  img: ''
     * }客服页面右下角的弹窗
     */
    gotoService(cardMsg) {
        wx.openCustomerServiceConversation({
            showMessageCard: (cardMsg.title || cardMsg.path || cardMsg.img) ? true : false,
            sendMessageTitle: cardMsg.title,
            sendMessagePath: cardMsg.path,
            sendMessageImg: cardMsg.img,
            success: () => {
                // that.showMsg('拉起成功')
            },
            fail: (err) => {
                // that.showMsg(JSON.stringify(err))
            }
        })
    }

    /**
     * 上报红包活动信息
     * @param {任务数据列表} arr  JSON数据
     *  [{
     *     "activity_id": "红包活动ID", 
     *     "task_id": "任务ID", 
     *     "task_type": "任务类型", 
     *     "task_desc": "任务描述	", 
     *     "task_state": "任务状态：1-参与 2-完成"
     *  }]
     */
    sendRedPacket(arr = []) {
        const that = this
        let data: any = {
            pid: that.config.pid,
            gid: that.config.gid,
            partner_data: JSON.stringify(arr),
            access_token: that.userInfo.access_token,
            tm: Date.now() / 1000 | 1
        }
        data.sign = that.signData(data)
        wx.request({
            data,
            url: `${that.partnerFix}/partner/redenvelope/task`, // 正式地址 
            // url: 'http://partner.binghu666.com/api/v1/partner/redenvelope/task', //测试地址
            method: 'post',
            success: res => {
                if (res.code == 200) {
                    console.log('红包信息上报成功')
                }
            }
        })
    }


    /**
     * 
     */
    getTG(TGData, callback) {
        var that = this;
        let TGtype = TGData.TGtype; //广告类型
        let TGdetailType = TGData.TGdetailType; //广告详细类型
        // let access_token = TGData.access_token; //登录token
        // let award = { //激励请求参数
        //   access_token,
        //   pid: that.adConfig.pid,
        // };
        // let data = {
        //   gid: that.adConfig.gid,
        //   type: TGdetailType,
        // };
        let data = {
            pid: that.config.pid,
            gid: that.config.gid,
            type: TGdetailType,
            access_token: TGData.accessToken || TGData.access_token || wx.getStorageSync('accessToken')
        }
        let str = TGtype == 1 ? "my" : "third"; //判断是自己的还是第三方的 自己的1 第三方的2
        let url = "";
        if (TGdetailType == 4) { //是否激励试玩
            url = `${that.getTgUrl}/${str}/award`;
            // data = Object.assign(data, award);  
        } else {
            url = `${that.getTgUrl}/${str}/tgdata`;
        }
        wx.request({
            method: 'GET',
            url,
            data,
            success(res) {
                const resObj = res.data.data
                if (res.data.code == 200 && resObj && resObj.length > 0) {
                    if (callback && typeof callback === 'function') {
                        callback(that.checkRes(200, resObj, 'success'))
                    }
                } else {
                    if (callback && typeof callback === 'function') {
                        callback(that.checkRes(500, '', 'fail'))
                    }
                }
            },
            fail(err) {
                callback(that.checkRes(500, '', 'fail'))
            }
        })
    }

    /**
     *
     * @param {*视频广告id} adUnitId
     */
    wxRewardedVideoTG(adUnitId, callback) {
        const that = this
        if (that.flagList.clickFlag) return false
        that.flagList.clickFlag = true
        // let TGData = {
        //   TGtype: 2,
        //   TGdetailType: 4,
        //   id: adUnitId
        // };
        wx.showLoading({
            title: '加载中',
        })
        let rewardedVideoAd = wx.createRewardedVideoAd({
            adUnitId: adUnitId
        })
        videoOnload()
        rewardedVideoAd.onClose((res) => {
            console.log('用户点击了【关闭广告】按钮')
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            // console.log(res)
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                console.log('看完广告')
                // that.TGtransform(TGData)
                if (callback && typeof callback === 'function') {
                    callback(that.checkRes(200, {
                        award: true
                    }, '看完视频广告了'));
                }
            } else {
                // 播放中途退出，不下发游戏奖励
                wx.showToast({
                    title: '中途退出不能获取奖励的哦',
                    duration: 1500,
                    icon: 'none',
                })
            }
            that.flagList.clickFlag = false
            if (!rewardedVideoAd) return
            rewardedVideoAd.offClose()
            rewardedVideoAd.offLoad()
        })

        rewardedVideoAd.onError(err => {
            wx.hideLoading()
            console.log('onError 拉取失败', err);
            rewardedVideoAd.offClose(null)
            rewardedVideoAd.offLoad(null)
            rewardedVideoAd.offError(null)
            if (that.flagList.videoError) {
                that.flagList.clickFlag = false
                wx.showToast({
                    title: '暂时没有视频广告，请稍后再试！',
                    duration: 1500,
                    icon: 'none',
                })
                return
            } else {
                loadFailed()
            }
        })

        function videoOnload() {
            rewardedVideoAd.load()
                .then(() => {
                    console.log('激励视频 加载完毕');
                    // wx.hideLoading()
                    // that.count('tgonload', TGData) // 拉取上报
                    videoShowed();
                })
        }

        function videoShowed() {
            wx.hideLoading()
            rewardedVideoAd.show().then(() => {
                console.log('视频播放了');
                //  that.count('show', TGData)
            }).catch(() => {
                loadFailed();
            })
            // that.TGShow(TGData); // 广告展示
            // that.flagList.clickFlag = false;
        }

        function loadFailed() {
            if (!that.flagList.videoError) {
                that.flagList.videoError = true;
                videoOnload()
                // rewardedVideoAd.load()
                // .then(() => {
                //   that.count('tgonload', TGData) // 拉取上报
                //   videoShowed()
                // })
                // .catch(err => {
                //   console.log('激励视频 广告显示失败')
                // })
            }
        }
    }


    /**
     * 格式化返回信息
     * @param {*} code 状态
     * @param {*} data 数据
     * @param {*} msg 信息
     */
    checkRes(code, data?, msg?) {
        const resObj = {
            code: code,
            data: data,
            msg: msg
        };
        return resObj;
    }

    /**
     * 检查支付数据
     * @param {*} data
     */
    checkPayData(data) {
        let isPay = true;
        let msg = "success";
        let resObj = {};
        if (!data.amt) {
            isPay = false;
            msg = "缺少金额";
            resObj = {
                isPay,
                msg
            };
            return resObj;
        }
        if (!data.game_order_no) {
            isPay = false;
            msg = "缺少订单号";
            resObj = {
                isPay,
                msg
            };
            return resObj;
        }
        if (!data.goods_name) {
            isPay = false;
            msg = "缺少订商品名";
            resObj = {
                isPay,
                msg
            };
            return resObj;
        }
        if (!data.role_id) {
            isPay = false;
            msg = "缺少角色id";
            resObj = {
                isPay,
                msg
            };
            return resObj;
        }
        if (!data.role_name) {
            isPay = false;
            msg = "缺少角色名";
            resObj = {
                isPay,
                msg
            };
            return resObj;
        }
        if (!data.role_level) {
            isPay = false;
            msg = "缺少角色等级";
            resObj = {
                isPay,
                msg
            };
            return resObj;
        }
        if (!data.server_id) {
            isPay = false;
            msg = "缺少服务器id";
            resObj = {
                isPay,
                msg
            };
            return resObj;
        }
        if (!data.server_name) {
            isPay = false;
            msg = "缺少服务器名";
            resObj = {
                isPay,
                msg
            };
            return resObj;
        }
        resObj = {
            isPay,
            msg
        };
        return resObj;
    }

    /**
     * 签名 / 排序参数
     * @param {*} queryObj
     * @param {*} noMd5
     */
    signData(queryObj, noMd5?, hasSign?) {
        const keyArr = Object.keys(queryObj);
        let str = "";
        keyArr.includes("sign") ?
            keyArr.splice(keyArr.findIndex(item => item === "sign"), 1) :
            "";
        if (hasSign) {
            keyArr.push('sign')
        }
        keyArr.sort();
        for (let i = 0; i < keyArr.length; i += 1) {
            if (queryObj[keyArr[i]]) {
                str = `${str}&${keyArr[i]}=${queryObj[keyArr[i]]}`;
            }
        }
        if (noMd5) {
            return `${str.substr(1)}`;
        } else {
            return md5(`${str.substr(1)}&`);
        }
    }

    /**
     * 提示信息
     * @param {*} msg
     */
    showMsg(msg, b?) {
        wx.showModal({
            title: "提示信息",
            content: msg
        });
    }

    /**
     * 解开base64
     * @param {*} str
     */
    b64DecodeUnicode(str) {
        const that = this;
        const base64EncodeChars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        let output = "";
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 0;
        str = str.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < str.length) {
            enc1 = base64EncodeChars.indexOf(str.charAt(i++));
            enc2 = base64EncodeChars.indexOf(str.charAt(i++));
            enc3 = base64EncodeChars.indexOf(str.charAt(i++));
            enc4 = base64EncodeChars.indexOf(str.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        return that.utf8_decode(output);
    }

    /*
     *  utf-8解码
     *  @parm : utftext 传入的字符串
     */
    utf8_decode(utftext) {
        let string = "";
        let i = 0;
        let c = 0;
        let c1 = 0;
        let c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if (c > 191 && c < 224) {
                c1 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
                i += 2;
            } else {
                c1 = utftext.charCodeAt(i + 1);
                c2 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(
                    ((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63)
                );
                i += 3;
            }
        }
        return string;
    }
    /**
     * 格式化url参数
     * @param {*} data
     */
    pareUrl(data) {
        const url = data;
        const obj = {};
        let keyvalue = [];
        let paraString: any = "";
        const num = url.indexOf("?");
        paraString = url.substr(num + 1);
        paraString = paraString.split("&");
        for (const i in paraString) {
            if (Object.prototype.hasOwnProperty.call(paraString, i)) {
                keyvalue = paraString[i].split("=");
                const key = keyvalue[0];
                const value = keyvalue[1];
                obj[key] = value;
            }
        }
        return obj;
    }

    /**
     * 版本对比
     * @param {*} v1
     * @param {*} v2
     */
    compareVersion(v1, v2) {
        v1 = v1.split(".");
        v2 = v2.split(".");
        const len = Math.max(v1.length, v2.length);

        while (v1.length < len) {
            v1.push("0");
        }
        while (v2.length < len) {
            v2.push("0");
        }

        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i]);
            const num2 = parseInt(v2[i]);

            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }
        return 0;
    }
}

function md5RotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
}

function md5AddUnsigned(lX, lY) {
    let lX4, lY4, lX8, lY8, lResult;
    lX8 = lX & 0x80000000;
    lY8 = lY & 0x80000000;
    lX4 = lX & 0x40000000;
    lY4 = lY & 0x40000000;
    lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) {
        return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    }
    if (lX4 | lY4) {
        if (lResult & 0x40000000) {
            return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
        } else {
            return lResult ^ 0x40000000 ^ lX8 ^ lY8;
        }
    } else {
        return lResult ^ lX8 ^ lY8;
    }
}

function md5F(x, y, z) {
    return (x & y) | (~x & z);
}

function md5G(x, y, z) {
    return (x & z) | (y & ~z);
}

function md5H(x, y, z) {
    return x ^ y ^ z;
}

function md5I(x, y, z) {
    return y ^ (x | ~z);
}

function md5FF(a, b, c, d, x, s, ac) {
    a = md5AddUnsigned(a, md5AddUnsigned(md5AddUnsigned(md5F(b, c, d), x), ac));
    return md5AddUnsigned(md5RotateLeft(a, s), b);
}

function md5GG(a, b, c, d, x, s, ac) {
    a = md5AddUnsigned(a, md5AddUnsigned(md5AddUnsigned(md5G(b, c, d), x), ac));
    return md5AddUnsigned(md5RotateLeft(a, s), b);
}

function md5HH(a, b, c, d, x, s, ac) {
    a = md5AddUnsigned(a, md5AddUnsigned(md5AddUnsigned(md5H(b, c, d), x), ac));
    return md5AddUnsigned(md5RotateLeft(a, s), b);
}

function md5II(a, b, c, d, x, s, ac) {
    a = md5AddUnsigned(a, md5AddUnsigned(md5AddUnsigned(md5I(b, c, d), x), ac));
    return md5AddUnsigned(md5RotateLeft(a, s), b);
}

function md5ConvertToWordArray(string) {
    let lWordCount;
    let lMessageLength = string.length;
    let lNumberOfWordsTemp1 = lMessageLength + 8;
    let lNumberOfWordsTemp2 =
        (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64;
    let lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
    let lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] =
            lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
        lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
}

function md5WordToHex(lValue) {
    let WordToHexValue = "";
    let WordToHexValueTemp = "";
    let lByte;
    let lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValueTemp = "0" + lByte.toString(16);
        WordToHexValue =
            WordToHexValue +
            WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
    }
    return WordToHexValue;
}

function md5Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    let utftext = "";
    for (let n = 0; n < string.length; n++) {
        let c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }
    return utftext;
}
const md5 = string => {
    let x = [];
    let k;
    let AA;
    let BB;
    let CC;
    let DD;
    let a;
    let b;
    let c;
    let d;
    let [
        S11,
        S12,
        S13,
        S14,
        S21,
        S22,
        S23,
        S24,
        S31,
        S32,
        S33,
        S34,
        S41,
        S42,
        S43,
        S44
    ] = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
    string = md5Utf8Encode(string);
    x = md5ConvertToWordArray(string);
    a = 0x67452301;
    b = 0xefcdab89;
    c = 0x98badcfe;
    d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = md5FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
        d = md5FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
        c = md5FF(c, d, a, b, x[k + 2], S13, 0x242070db);
        b = md5FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
        a = md5FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
        d = md5FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
        c = md5FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
        b = md5FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
        a = md5FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
        d = md5FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
        c = md5FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
        b = md5FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
        a = md5FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
        d = md5FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
        c = md5FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
        b = md5FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
        a = md5GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
        d = md5GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
        c = md5GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
        b = md5GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
        a = md5GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
        d = md5GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = md5GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
        b = md5GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
        a = md5GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
        d = md5GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
        c = md5GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
        b = md5GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
        a = md5GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
        d = md5GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
        c = md5GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
        b = md5GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
        a = md5HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
        d = md5HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
        c = md5HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
        b = md5HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
        a = md5HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
        d = md5HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
        c = md5HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
        b = md5HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
        a = md5HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
        d = md5HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
        c = md5HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
        b = md5HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
        a = md5HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
        d = md5HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
        c = md5HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
        b = md5HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
        a = md5II(a, b, c, d, x[k + 0], S41, 0xf4292244);
        d = md5II(d, a, b, c, x[k + 7], S42, 0x432aff97);
        c = md5II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
        b = md5II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
        a = md5II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
        d = md5II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
        c = md5II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
        b = md5II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
        a = md5II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
        d = md5II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
        c = md5II(c, d, a, b, x[k + 6], S43, 0xa3014314);
        b = md5II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
        a = md5II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
        d = md5II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
        c = md5II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
        b = md5II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
        a = md5AddUnsigned(a, AA);
        b = md5AddUnsigned(b, BB);
        c = md5AddUnsigned(c, CC);
        d = md5AddUnsigned(d, DD);
    }
    return (
        md5WordToHex(a) +
        md5WordToHex(b) +
        md5WordToHex(c) +
        md5WordToHex(d)
    ).toLowerCase();
};

export default MiniSdk;