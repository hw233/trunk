import ChatUtils from '../../../view/chat/utils/ChatUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';

const { ccclass, property, menu } = cc._decorator;

class ExchangeCodeModel {

    frozenTime: number = 0;
}

@ccclass
@menu("qszc/scene/main/ExchangeCodeCtrl")
export default class ExchangeCodeCtrl extends gdk.BasePanel {

    model = ModelManager.get(ExchangeCodeModel);

    lastServerTime: number;

    @property(cc.EditBox)
    InputBox: cc.EditBox = null;

    @property(cc.Button)
    ConfirmBtn: cc.Button = null;

    onEnable() {
        // 原生包适配
        if (GlobalUtil.getUrlValue('app') == 'true') {
            let comp = this.node.getComponent(cc.Widget);
            if (!comp) {
                comp = this.node.addComponent(cc.Widget);
                comp.isAlignTop = false;
                comp.isAlignBottom = true;
                comp.isAlignLeft = false;
                comp.isAlignRight = false;
                comp.alignMode = 2;
            }
            this.InputBox.node.on('editing-did-began', () => {
                comp.isAbsoluteBottom = true;
                comp.bottom = 80;
            }, this);
            this.InputBox.node.on('editing-did-ended', () => {
                comp.isAbsoluteBottom = false;
                comp.bottom = 0.5;
            }, this);
        }
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000);
        this.ConfirmBtn.interactable = serverTime - this.model.frozenTime >= 120;
        NetManager.on(icmsg.GiftFetchRsp.MsgType, this.onGiftFetchRsp, this);
    }

    onDisable() {
        this.InputBox.node.targetOff(this);
        NetManager.targetOff(this);
    }

    update() {
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000);
        if (serverTime > this.lastServerTime) {
            this.lastServerTime = serverTime;
            this.ConfirmBtn.interactable = serverTime - this.model.frozenTime >= 120;
        }
    }

    getFunc() {
        let text = ChatUtils.filter(this.InputBox.string)
        if (text == "") {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:MAIN_SET_TIP7"));
            return
        }
        NetManager.send(new icmsg.GiftFetchReq({ code: text }))
    }

    onGiftFetchRsp(rsp: icmsg.GiftFetchRsp) {
        if (rsp.frozenTime > 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:MAIN_SET_TIP8"));
            this.model.frozenTime = rsp.frozenTime;
            this.ConfirmBtn.interactable = false;
            return;
        }
        GlobalUtil.openRewadrView(rsp.list);
    }
}