import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildUtils from '../utils/GuildUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { GuildEventId } from '../enum/GuildEventId';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:07:11
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildApplyListItem")
export default class GuildApplyListItem extends UiListItem {

    @property(cc.Node)
    head: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Label)
    roleName: cc.Label = null;

    @property(cc.Label)
    state: cc.Label = null;

    @property(cc.Label)
    lv: cc.Label = null;

    guildMember: icmsg.GuildMember = null

    onLoad() {

    }

    updateView() {
        this.guildMember = this.data
        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this.guildMember.head))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this.guildMember.frame))
        this.roleName.string = this.guildMember.name
        this.state.string = GuildUtils.getOnLineState(this.guildMember.logoutTime)
        this.lv.string = `.${this.guildMember.level}`
    }

    agreeFunc() {
        gdk.e.emit(GuildEventId.REQ_GUILD_CHECK, { playerId: this.guildMember.id, ok: true })
    }

    refuseFunc() {
        gdk.e.emit(GuildEventId.REQ_GUILD_CHECK, { playerId: this.guildMember.id, ok: false })
    }
}