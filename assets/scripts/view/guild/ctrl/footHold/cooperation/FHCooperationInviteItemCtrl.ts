import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuildUtils from '../../../utils/GuildUtils';
import ModelManager from '../../../../../../boot/common/managers/BModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import ServerModel from '../../../../../common/models/ServerModel';
import UiListItem from '../../../../../common/widgets/UiListItem';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-17 16:25:03
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationInviteItemCtrl")
export default class FHCooperationInviteItemCtrl extends UiListItem {

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    guildName: cc.Label = null;

    @property(cc.Label)
    serverLab: cc.Label = null;

    @property(cc.Label)
    scoreLab: cc.Label = null;

    @property(cc.Label)
    joinNumLab: cc.Label = null;

    _info: icmsg.FootholdCoopGuild

    updateView() {
        this._info = this.data
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(this._info.guildInfo.bottom))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(this._info.guildInfo.frame))
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this._info.guildInfo.icon))
        this.serverLab.string = `[S${GlobalUtil.getSeverIdByGuildId(this._info.guildInfo.id)}]`
        this.guildName.string = `${this._info.guildInfo.name}`
        this.scoreLab.string = `${this._info.guildInfo.score}`
        this.joinNumLab.string = `${this._info.joinNum + this._info.coopNum}`
    }


    onAgreeFunc() {
        let msg = new icmsg.FootholdCoopInviteAnswerReq()
        msg.guildId = this._info.guildInfo.id
        msg.agree = true
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP146"))

            let msg2 = new icmsg.FootholdCoopInviteGuildsReq()
            NetManager.send(msg2, (data: icmsg.FootholdCoopInviteGuildsRsp) => {
                if (data.guilds.length == 0) {
                    gdk.panel.hide(PanelId.FHCooperationInvite)
                }
            })
        }, this)
    }


    onRefuseFunc() {
        let msg = new icmsg.FootholdCoopInviteAnswerReq()
        msg.guildId = this._info.guildInfo.id
        msg.agree = false
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP146"))

            let msg2 = new icmsg.FootholdCoopInviteGuildsReq()
            NetManager.send(msg2, (data: icmsg.FootholdCoopInviteGuildsRsp) => {
                if (data.guilds.length == 0) {
                    gdk.panel.hide(PanelId.FHCooperationInvite)
                }
            })
        }, this)
    }

    _itemClick() {
        gdk.panel.setArgs(PanelId.GuildJoin, this._info.guildInfo.id, true)
        gdk.panel.open(PanelId.GuildJoin)
    }
}