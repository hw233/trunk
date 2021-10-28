import BErrorManager from '../../../common/managers/BErrorManager';
import BGlobalUtil from '../../../common/utils/BGlobalUtil';
import BLoginModel from '../../../common/models/BLoginModel';
import BLoginUtils from '../../../common/utils/BLoginUtils';
import BMaskWordUtils from '../../../common/utils/BMaskWordUtils';
import BMathUtil from '../../../common/utils/BMathUtil';
import BModelManager from '../../../common/managers/BModelManager';
import BNetManager from '../../../common/managers/BNetManager';
import BPanelId from '../../../configs/ids/BPanelId';
import BSdkTool from '../../../sdk/BSdkTool';
import BServerModel from '../../../common/models/BServerModel';
import BStringUtils from '../../../common/utils/BStringUtils';
import { NoticeItemType } from '../ctrl/NoticeViewCtrl';

/**
 * 初始化服务器列表
 * @Author: sthoo.huang
 * @Date: 2019-03-28 17:36:49
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-09 10:45:31
 */

@gdk.fsm.action("InitConnectionAction", "Boot")
export default class InitConnectionAction extends gdk.fsm.FsmStateAction {

    onEnter() {
        CC_DEBUG && cc.log("协议生成时间：", icmsg.datetime);
        BNetManager.init();
        BModelManager.clearAll([
            BServerModel,
        ]);
        BErrorManager.init();
        BSdkTool.init();
        BLoginUtils.setLogoActive(true);
        // 显示开始游戏按钮
        let startBtn = cc.find('background/start', gdk.engine.node);
        if (BSdkTool.tool.showStartBtn) {
            startBtn.active = true;
            startBtn.targetOff(this);
            startBtn.on(cc.Node.EventType.TOUCH_END, () => {
                BSdkTool.tool.login();
                gdk.Timer.loop(100, this, this.checkSdkState);
            }, this);
        } else {
            startBtn.active = false;
            gdk.Timer.loop(100, this, this.checkSdkState);
        }
    }

    // 检测SDK状态
    checkSdkState() {
        if (!BSdkTool.loaded) return;

        // 隐藏开始游戏按钮
        let startBtn = cc.find('background/start', gdk.engine.node);
        if (startBtn.active) {
            startBtn.targetOff(this);
            startBtn.active = false;
        }

        // SDK已经加载完成，清除计时器
        gdk.Timer.clear(this, this.checkSdkState);

        // 外部参数解释
        let m = BModelManager.get(BLoginModel);
        m.brand = BGlobalUtil.getUrlValue('brand');
        m.model = BGlobalUtil.getUrlValue('model');
        if (!m.brand || !m.model) {
            if (cc.sys.isMobile && gdk.mdd) {
                // 手机平台
                m.model = gdk.mdd.mobileModel;
                m.brand = gdk.mdd.mobileVendor;
            } else {
                // PC端
                m.brand = 'unknown';
                m.model = cc.sys.os;
            }
        }
        m.account = BSdkTool.tool.account;
        m.channelId = BSdkTool.tool.channelId;
        m.channelCode = BSdkTool.tool.channelCode;
        // 保存最后登录的帐户
        if (m.account) {
            BGlobalUtil.setLocal('login_userid', m.account, false);
        }
        // 获取服务器列表
        let sm = BModelManager.get(BServerModel);
        if (Date.now() - sm.timeStamp > 10 * 60 * 1000) {
            // 有数据并且超时才刷新
            sm.env = BSdkTool.tool.channelId;
            CC_DEBUG && cc.log(`env: ${sm.env}`);
            // 更新服务器列表
            gdk.gui.showWaiting('正在获取数据', 'get_server_list', null, null, null, 5);
            this.getServerList();
            this.checkNoticeList()
        } else {
            // 存在有效数据则直接完成
            this.finish();
        }
    }

    // 获取服务器列表，完成后完成动作
    getServerList() {
        let m = BModelManager.get(BServerModel);
        let sdk = BSdkTool.tool;
        let cfg = sdk.config;
        let api = cfg.api_urls;
        let index = BMathUtil.rnd(0, api.length - 1);
        let url = api[index];
        if (BStringUtils.startsWith(url, ":")) {
            for (let i = index - 1; i >= 0; i--) {
                if (!BStringUtils.startsWith(api[i], ":")) {
                    url = api[i].substring(0, api[i].lastIndexOf(":")) + url;
                    break;
                }
            }
        }
        CC_DEBUG && cc.log(`api_url: ${index}/${api.length} ${url}`);
        m.host = url;
        m.playerserverListUrl = `${url}/${sdk.player_list}`;
        BGlobalUtil.httpGet(`${url}/${sdk.server_list}`, (err: any, content: string) => {
            if (!cc.isValid(this.node)) return;
            if (!this.active) return;
            if (err) {
                cc.error(err);
                gdk.Timer.once(1000, this, function () {
                    this.getServerList(index + 1);
                });
                return;
            }
            try {
                m.parseServerList(content);
                m.timeStamp = Date.now();
                gdk.gui.hideWaiting('get_server_list');
                this.finish();
            } catch (err) {
                cc.error(err);
                gdk.Timer.once(1000, this, function () {
                    this.getServerList(index + 1);
                });
            }
        });

        // 更新敏感词库，只在正式发布版本中有效
        if (CC_BUILD && !CC_DEBUG && BSdkTool.tool.isNeedUpdateBadWords) {
            BMaskWordUtils.update(url + '/bad_words');
        }
    }

    /**自动弹出公告 */
    checkNoticeList() {
        let m = BModelManager.get(BServerModel)
        let url = m.host
        //获取公告列表
        BGlobalUtil.httpGet(url + "/placard_list", (err: any, content: string) => {
            if (err) {
                CC_DEBUG && cc.error(err);
                return;
            }
            if (!content || content == '') return;
            try {
                this.parsePlacardList(content)
            } catch (err) {
                CC_DEBUG && cc.error(err);
            }
        });
    }

    parsePlacardList(jsonStr: string) {
        if (!jsonStr || jsonStr == '') {
            return
        }
        let datas = JSON.parse(jsonStr) as any;
        let pop = 0
        for (let i = 0; i < datas.length; i++) {
            let item = NoticeItemType.parse(datas[i]);
            if (item && item.pop > pop) {
                pop = item.pop
            }
        }

        if (pop > 0 && (
            !BSdkTool.tool ||
            !BSdkTool.tool.isAutoLogin ||
            !!BGlobalUtil.getLocal('login_last_time', false)
        )) {
            // 自动弹公告，非首次自动登录
            gdk.panel.open(BPanelId.NoticeView);
        }
    }

    onExit() {
        gdk.Timer.clearAll(this);
        gdk.gui.hideWaiting('get_server_list');
    }
}