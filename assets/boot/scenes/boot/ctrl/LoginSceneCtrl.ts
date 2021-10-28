import BConfigManager from '../../../common/managers/BConfigManager';
import BGlobalUtil from '../../../common/utils/BGlobalUtil';
import BLoginModel from '../../../common/models/BLoginModel';
import BLoginUtils from '../../../common/utils/BLoginUtils';
import BMathUtil from '../../../common/utils/BMathUtil';
import BModelManager from '../../../common/managers/BModelManager';
import BootFsmEventId from '../enum/BootFsmEventId';
import BPanelId from '../../../configs/ids/BPanelId';
import BSdkTool from '../../../sdk/BSdkTool';
import BServerModel, { ServerItemModel } from '../../../common/models/BServerModel';
import BStringUtils from '../../../common/utils/BStringUtils';
import { Charge_recoupCfg } from '../../../configs/bconfig';

/** 
 * @Description: 登录场景控制器
 * @Author: weiliang.huang  
 * @Date: 2019-04-04 15:57:23 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-09 10:50:06
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/login/LoginSceneCtrl")
export default class LoginSceneCtrl extends gdk.BasePanel {

    @property(cc.Node)
    ui: cc.Node = null;

    @property(cc.Node)
    bbsBtn: cc.Node = null;
    @property(cc.Node)
    kfBtn: cc.Node = null;
    @property(cc.Node)
    changeAccountBtn: cc.Node = null;

    @property(cc.EditBox)
    nameInput: cc.EditBox = null;

    @property(cc.Label)
    serverName: cc.Label = null;
    @property(cc.Node)
    serverNode: cc.Node = null;

    @property(cc.Node)
    serviceBox: cc.Node = null;
    @property(cc.Toggle)
    pkToggle: cc.Toggle = null;
    @property(cc.Toggle)
    playerToggle: cc.Toggle = null;

    @property(cc.Label)
    verLb: cc.Label = null;
    @property(cc.Sprite)
    copyRight: cc.Sprite = null;

    model: BServerModel;

    onLoad() {
        this.verLb.string = '';
        this.copyRight.node.active = false;
        this.copyRight.spriteFrame = null;
        this.ui.active = false;
        this.bbsBtn.active = false;
        this.kfBtn.active = false;
        this.changeAccountBtn.active = false;
        this.nameInput.node.parent.active = false;
        this.serviceBox.active = false;
    }

    onEnable() {
        let setting = window['_TDSettings'] || {
            version: '1.0.0.000',
            time: "0000-00-00 00:00:00.000",
        };
        if (cc.sys.isNative && CC_BUILD && !CC_DEBUG) {
            let resId = gdk.Tool.getResIdByNode(this.node);
            let url = 'view/hotupdate/data/version';
            gdk.rm.loadRes(resId, url, cc.TextAsset, (res: cc.TextAsset) => {
                let con = gdk.pako.ungzip(gdk.Buffer.from(res.text, 'base64'));
                let obj = JSON.parse(gdk.Buffer.from(con).toString('utf8'));
                setting.version = obj['version'];
                setting.remoteServerAddress = obj['pku'];
                gdk.rm.releaseRes(resId, res);
                this.onEnableAfter(setting);
            });
            return;
        }
        if (iclib.verjson) {
            setting.version = iclib.verjson.version;
            setting.time = iclib.verjson.time;
        }
        this.onEnableAfter(setting);
    }

    private onEnableAfter(setting: any) {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        this.verLb.string = `ver.${setting.version}`;
        this.model = BModelManager.get(BServerModel);
        this.ui.active = false;
        this.bbsBtn.active = false;
        this.kfBtn.active = false;
        this.changeAccountBtn.active = false;
        this.nameInput.node.parent.active = false;
        this.serviceBox.active = false;
        this.schedule(this.checkSdkState, 0.25);
        // 显示启动背景
        BLoginUtils.setLogoActive(true);
    }

    onDisable() {
        this.unschedule(this.checkSdkState);
        this.model = null;
        cc.game.targetOff(this);
    }

    // 检测SDK状态更新UI显示状态
    checkSdkState() {
        let ui = this.ui;
        let l = this.model.list;
        let t = BSdkTool.tool;
        let b = BSdkTool.loaded && l && l.length > 0;
        if (ui.active != b) {
            if (b) {
                // 显示帐号输入框
                if (t.showAccountInput) {
                    this.nameInput.string = t.account;
                    this.nameInput.node.parent.active = true;
                }
                // 隐藏微信小游戏加载中提示
                if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                    window['wx'].hideLoading();
                }
                gdk.NodeTool.show(ui);
            } else {
                gdk.NodeTool.hide(ui);
            }
        }
        // 社区、客服、切换帐号按钮显示或隐藏状态
        if (t != null) {
            this.bbsBtn.active = t.showBbsIcon;
            this.kfBtn.active = t.showKfIcon;
            this.changeAccountBtn.active = t.showChangeAccountIcon;
            // 用户协议状态
            if (t.showServiceCheckBox && !this.serviceBox.active) {
                this.serviceBox.active = true;
                this.pkToggle.isChecked = BGlobalUtil.getLocal('login_pk_notice', false, t.isServiceChecked);
                this.playerToggle.isChecked = BGlobalUtil.getLocal('login_player_notice', false, t.isServiceChecked);
            }
            // 首次打开APP时，自动进入游戏
            if (t && t.loaded && t.isAutoLogin &&
                !BGlobalUtil.getLocal('login_last_time', false) &&
                !!this.model.current) {
                // sdk初始化完成，并且获得了当前服务器
                this.enterGame();
            }
        } else {
            this.bbsBtn.active = false;
            this.kfBtn.active = false;
            this.changeAccountBtn.active = false;
            this.serviceBox.active = false;
        }
    }

    /** 更新服务器列表 */
    @gdk.binding('model.list')
    _setServerList(v: ServerItemModel[]) {
        if (!v.length) return;
        let a: ServerItemModel[] = this.model.lastList;
        let c: ServerItemModel = v[0];
        if (a && a.length > 0) {
            c = a[0];
        }
        this.model.current = c;
    }

    /** 更新当前服务器 */
    @gdk.binding('model.current')
    _setCurrent(v: ServerItemModel) {
        if (!v) {
            this.serverName.string = gdk.i18n.t('i18n:PLS_SELECT_SERVER');
        } else {
            this.serverName.string = v.name;
        }
    }

    /** 更新版号信息 */
    @gdk.binding('model.copyrightIndex')
    _setCopyRight(v: number) {
        let r = !!BSdkTool.tool && !!BSdkTool.tool.config;
        if (r) {
            if (v <= 0 || !cc.js.isNumber(v) || isNaN(v)) {
                r = false;
            }
            if (r && !!BSdkTool.tool.config.cr) {
                let url = `view/login/texture/txt/${BSdkTool.tool.config.cr}`;
                this.copyRight.node.active = true;
                BGlobalUtil.setSpriteIcon(this.node, this.copyRight, url);
                return;
            }
        }
        this.copyRight.node.active = false;
        this.copyRight.spriteFrame = null;
    }

    /** 点击打开服务器选择列表 */
    openServerList() {
        if (!BSdkTool.tool) return;
        if (!BSdkTool.tool.loaded) return;
        gdk.panel.open(BPanelId.ServerList);
    }

    /** 点击屏幕进入游戏 */
    enterGame() {
        if (!BSdkTool.tool) return;
        if (!BSdkTool.tool.loaded) return;
        if (!this.model.current) {
            gdk.panel.open(BPanelId.ServerList);
            return;
        }
        let model = BModelManager.get(BLoginModel);
        if (this.nameInput.enabledInHierarchy) {
            let a = BStringUtils.trim(this.nameInput.string);
            if (!a || a.length == 0 || a.indexOf(' ') >= 0) {
                // 用户名无效，长度为0或者包含空格
                gdk.gui.showMessage('帐号无效，请重新输入');
                return;
            }
            BGlobalUtil.setLocal('login_userid', a, false);
            model.account = a;
        }
        if (this.serviceBox.active) {
            if (!this.pkToggle.isChecked || !this.playerToggle.isChecked) {
                // 弹出界面提示接受PK提示和用户协议
                gdk.panel.open(BPanelId.ServiceAlert);
                return;
            }
            BGlobalUtil.setLocal('login_pk_notice', this.pkToggle.isChecked, false);
            BGlobalUtil.setLocal('login_player_notice', this.playerToggle.isChecked, false);
        }
        // 查询是否存在删档服充值返还
        let sdk = BSdkTool.tool;
        let cfg = BConfigManager.getItem(Charge_recoupCfg, { 'account': model.account, 'cid': sdk.channelId });
        if (!cfg) {
            // 此帐号没有返还信息
            this._enterGame();
            return;
        }
        let api = sdk.config.api_urls;
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
        gdk.gui.lockScreen();
        BGlobalUtil.httpGet(`${url}/recouped?account=${model.account}`, (err: any, content: string) => {
            gdk.gui.unLockScreen();
            if (!cc.isValid(this.node)) return;
            if (!this.node.active) return;
            if (err) {
                cc.error(err);
                return;
            }
            // {"Recouped":false,"Msg":""}
            let ret = JSON.parse(content || '{}');
            if (!ret || ret.Recouped) {
                // 已经领取，或者没有领取信息
                this._enterGame();
                return;
            }
            gdk.gui.showAskAlert(
                `系统检测您在删档计费期间累计充值：${cfg.money}元，本次登录后，将会在本区服以${(cfg.rate * 0.01).toFixed(2)}倍返利你的累计充值！\n\n注：若确认后，则其他区服无法进行返利`,
                `系统提示`, 'LOGIN-SCENE',
                index => {
                    if (index === 0) {
                        // 确定
                        this._enterGame();
                    }
                },
                this,
                {
                    cancel: gdk.i18n.t("i18n:CANCEL"),
                    ok: gdk.i18n.t("i18n:OK"),
                }
            );
        });
    }
    private _enterGame() {
        gdk.fsm.Fsm.main.sendEvent(BootFsmEventId.REQ_ENTER_GAME);
    }

    /** 打开公告 */
    openNoticeView() {
        if (!BSdkTool.tool) return;
        if (!BSdkTool.tool.loaded) return;
        gdk.panel.open(BPanelId.NoticeView);
    }

    /** 打开社区 */
    openBbs() {
        if (!BSdkTool.tool) return;
        if (!BSdkTool.tool.loaded) return;
        BSdkTool.tool.bbs();
    }

    /** 打开客服 */
    openKf() {
        if (!BSdkTool.tool) return;
        if (!BSdkTool.tool.loaded) return;
        BSdkTool.tool.kf();
    }

    /** 切换帐号 */
    changeAccount() {
        if (!BSdkTool.tool) return;
        if (!BSdkTool.tool.loaded) return;
        BSdkTool.tool.changeAccount();
    }

    userService() {
        if (!BSdkTool.tool) return;
        if (!BSdkTool.tool.loaded) return;
        BSdkTool.tool.userService();
    }

    privateService(): void {
        if (!BSdkTool.tool) return;
        if (!BSdkTool.tool.loaded) return;
        BSdkTool.tool.privateService();
    }

    ageTips() {
        if (!BSdkTool.tool) return;
        if (!BSdkTool.tool.loaded) return;
        gdk.panel.open(BPanelId.ServiceView, null, this, {
            args: {
                title: '适龄提示',
                url: '/uc/age.txt',
            }
        });
    }
}
