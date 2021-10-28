import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import NetManager from '../../../../common/managers/NetManager';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Store_red_envelopeCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-12 13:55:09 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/envelop/EnvelopeWorldItemCtrl")
export default class EnvelopeWorldItemCtrl extends UiListItem {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    btn: cc.Node = null;

    @property(cc.Node)
    rewardNode: cc.Node = null;

    @property(cc.Label)
    ownerLab: cc.Label = null;

    @property(cc.Label)
    guildNameLab: cc.Label = null;

    info: icmsg.WorldEnvelope;
    cfg: Store_red_envelopeCfg;
    updateView() {
        this._updateView(this.data);
    }

    _updateView(d: icmsg.WorldEnvelope) {
        this.info = d;
        this.cfg = ConfigManager.getItemByField(Store_red_envelopeCfg, 'gift_id', this.info.typeId);
        this.nameLab.string = this.cfg.name;
        this.btn.active = !this.info.got;
        GlobalUtil.setSpriteIcon(this.node, this.bg, `common/bg/envelope/ghhb_${!this.info.got ? 'weikaiihongbao01' : 'yikaihongbao01'}`);
        this.rewardNode.active = this.info.got;
        this.nameLab.node.active = !this.info.got;
        cc.find('ghhb_diban02', this.node).active = !this.info.got;
        this.ownerLab.node.active = !this.info.got;
        this.guildNameLab.node.active = !this.info.got;
        if (this.rewardNode.active) {
            GlobalUtil.setSpriteIcon(this.node, cc.find('main_itemmoney02', this.rewardNode), GlobalUtil.getIconById(this.cfg.red_envelope2[0]));
            cc.find('label', this.rewardNode).getComponent(cc.Label).string = this.cfg.red_envelope2[1] + '';
        }
        this.ownerLab.string = this.info.name;
        this.guildNameLab.string = this.info.guildName;
    }

    onClick() {
        if (!this.info.got) {
            let req = new icmsg.WorldEnvelopeGetReq();
            req.id = this.info.id;
            NetManager.send(req, (resp: icmsg.WorldEnvelopeGetRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                GlobalUtil.openRewadrView(resp.goods);
                this.info.got = true;
                this._updateView(this.info);
            }, this);
        }
    }
}
