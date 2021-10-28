import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import NetManager from '../../../../common/managers/NetManager';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Store_red_envelopeCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-08 10:06:02 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/envelop/EnvelopeItemCtrl")
export default class EnvelopeItemCtrl extends UiListItem {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Node)
    rewardNode: cc.Node = null;

    @property(cc.Label)
    botInfoLab: cc.Label = null;

    type: number;
    isMy: boolean;
    info: icmsg.GuildEnvelope;
    cfg: Store_red_envelopeCfg;
    state: number; // 0-未发 1-已发 2-未抢 3-已抢
    onDisable() {
        NetManager.targetOff(this);
    }

    updateView() {
        [this.type, this.info] = [this.data.type, this.data.info];
        this.isMy = this.type == 2;
        this._updateView();
        NetManager.on(icmsg.GuildEnvelopeChangeRsp.MsgType, this._onChanged, this);
    }

    _onChanged(resp: icmsg.GuildEnvelopeChangeRsp) {
        if (resp.my == this.isMy) {
            for (let i = 0; i < resp.list.length; i++) {
                if (resp.list[i].id == this.info.id) {
                    this.data.info = resp.list[i];
                    this.info = resp.list[i];
                    this._updateView();
                    return;
                }
            }
        }
    }

    _updateView() {
        this.cfg = ConfigManager.getItemByField(Store_red_envelopeCfg, 'gift_id', this.info.typeId);
        this.btnNode.active = true;
        this.rewardNode.active = true;
        this.titleLab.string = this.cfg.name;
        this.rewardNode.getChildByName('label').getComponent(cc.Label).string = this.cfg.num * this.cfg.red_envelope + '';
        this.botInfoLab.string = `${this.info.left}/${this.cfg.num}`;
        if (this.type == 2) {
            if (this.info.sendTime > 0) {
                this.state = 1;
                this.btnNode.getComponent(cc.Button).interactable = false;
            }
            else {
                this.state = 0;
                this.btnNode.getComponent(cc.Button).interactable = true;
            }
        }
        else {
            if (this.info.got) {
                this.state = 3;
                this.btnNode.active = false;
                this.btnNode.getComponent(cc.Button).interactable = false;
            }
            else {
                this.state = 2;
                this.rewardNode.active = false;
                this.botInfoLab.string = this.info.name;
                this.btnNode.getComponent(cc.Button).interactable = true;
            }
        }
        this.titleLab.node.active = this.state !== 3;
        this.node.getChildByName('ghhb_diban02').active = this.state !== 3;
        GlobalUtil.setSpriteIcon(this.node, this.bg, `common/bg/envelope/${this.state == 3 ? 'ghhb_yikaihongbao' : 'ghhb_weikaiihongbao'}`);
        if (this.btnNode.active) {
            let n = { 1: 3, 0: 2, 2: 1 };
            GlobalUtil.setSpriteIcon(this.node, this.btnNode.getChildByName("Background"), `common/bg/envelope/ghhb_hongbaoanniu0${n[this.state]}`);
        }
    }

    onBtnClick() {
        if (this.state == 1 || this.state == 3) {
            return;
        }
        else if (this.state == 0) {
            let req = new icmsg.GuildEnvelopeSendReq();
            req.id = this.info.id;
            NetManager.send(req, (resp: icmsg.GuildEnvelopeSendRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                gdk.gui.showMessage('成功发送');
                for (let i = 0; i < resp.list.length; i++) {
                    if (resp.list[i].id == this.info.id) {
                        this.info = resp.list[i];
                        this.list.datas[this.curIndex] = {
                            type: this.type,
                            info: resp.list[i]
                        }
                        this._updateView();
                        return;
                    }
                }
            }, this);
        } else {
            let req = new icmsg.GuildEnvelopeGetReq();
            req.id = this.info.id;
            NetManager.send(req, (resp: icmsg.GuildEnvelopeGetRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                GlobalUtil.openRewadrView(resp.goods);
            }, this);
        }
    }
}
