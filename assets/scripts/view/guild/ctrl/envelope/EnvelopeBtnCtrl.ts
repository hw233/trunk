import GuildModel from '../../model/GuildModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import RoleModel from '../../../../common/models/RoleModel';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-08 16:51:41 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/envelop/EnvelopeBtnCtrl")
export default class EnvelopeBtnCtrl extends cc.Component {
    get gModel(): GuildModel { return ModelManager.get(GuildModel); }
    get rModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        if (this.gModel.firstInEnvelope) {
            let req = new icmsg.GuildEnvelopeListReq();
            req.my = true;
            NetManager.send(req);
        }
        this.gModel.firstInEnvelope = false;
        this._firstIn = true;
    }

    onDisable() {
        this.node.stopAllActions();
        gdk.e.targetOff(this);
    }

    _firstIn: boolean = true;
    @gdk.binding("rModel.guildId")
    _onGuildIdChanged() {
        let req2 = new icmsg.GuildEnvelopeListReq();
        req2.my = false;
        NetManager.send(req2);
    }

    @gdk.binding("gModel.grabEnvelopeList")
    @gdk.binding("gModel.myEnvelopeList")
    @gdk.binding("gModel.worldEnvMaxGotId")
    @gdk.binding("gModel.worldEnvMaxId")
    _updateAni() {
        if (this.node.getNumberOfRunningActions() >= 1) return;
        else {
            this.node.angle = 0;
            if (RedPointUtils.is_can_grab_red_envelope()
                || (RedPointUtils.is_can_send_red_envelope() && this.rModel.guildId)) {
                this.node.runAction(cc.repeatForever(
                    cc.sequence(
                        cc.rotateBy(.05, 10),
                        cc.rotateBy(.05, -10),
                        cc.rotateBy(.05, -10),
                        cc.rotateBy(.05, 10)
                    )
                ))
            }
        }
    }

    @gdk.binding("gModel.grabEnvelopeList")
    @gdk.binding("gModel.myEnvelopeList")
    @gdk.binding("gModel.worldEnvMaxGotId")
    @gdk.binding("gModel.worldEnvMaxId")
    _onRedpointStatusUpdate() {
        let panelId = gdk.Tool.getResIdByNode(gdk.gui.getCurrentView());
        if (panelId == PanelId.GuildMain.__id__ || RedPointUtils.is_can_send_red_envelope() || RedPointUtils.is_can_grab_red_envelope()) {
            this.node.active = true;
        }
        else {
            this.node.active = false;
        }
    }

    onClick() {
        if (RedPointUtils.is_can_grab_red_envelope()) {
            let idx = RedPointUtils.is_can_grab_guild_red_envelope() ? 0 : 1;
            gdk.panel.setArgs(PanelId.EnvelopeMainView, [1, idx]);
            gdk.panel.open(PanelId.EnvelopeMainView);
        }
        else if (RedPointUtils.is_can_send_red_envelope()) {
            if (this.rModel.guildId) {
                gdk.panel.setArgs(PanelId.EnvelopeMainView, [2]);
                gdk.panel.open(PanelId.EnvelopeMainView);
            }
            else {
                gdk.panel.open(PanelId.GuildList);
                gdk.gui.showMessage('加入公会后才可以发放和领取红包');
            }
        }
        else {
            gdk.panel.setArgs(PanelId.EnvelopeMainView, [2]);
            gdk.panel.open(PanelId.EnvelopeMainView);
        }
    }
}
