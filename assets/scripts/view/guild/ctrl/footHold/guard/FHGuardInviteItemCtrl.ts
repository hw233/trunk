import ConfigManager from '../../../../../common/managers/ConfigManager';
import FootHoldModel, { FhPointInfo } from '../FootHoldModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuildUtils from '../../../utils/GuildUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import RoleModel from '../../../../../common/models/RoleModel';
import StringUtils from '../../../../../common/utils/StringUtils';
import UiListItem from '../../../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../../../common/widgets/VipFlagCtrl';
import { Foothold_globalCfg } from '../../../../../a/config';
import { GuildMemberLocal } from '../../../model/GuildModel';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-06-17 20:22:03
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/guard/FHGuardInviteItemCtrl")
export default class FHGuardInviteItemCtrl extends UiListItem {

    @property(cc.Node)
    head: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Label)
    memberName: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Label)
    state: cc.Label = null;

    @property(cc.Label)
    memberLv: cc.Label = null;

    @property(cc.Node)
    postionIcon: cc.Node = null;

    @property(cc.Label)
    teamNum: cc.Label = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property(cc.Button)
    btnInvite: cc.Button = null

    @property(cc.Node)
    hasGuard: cc.Node = null

    guildMember: GuildMemberLocal = null
    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }


    updateView() {
        this.guildMember = this.data
        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this.guildMember.head))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this.guildMember.frame))
        this.memberName.string = this.guildMember.name
        this.memberName.node.color = cc.color("#E5B88C")
        if (this.guildMember.id == this.roleModel.id) {
            this.memberName.node.color = cc.color("#00ff00")
        }
        this.powerLab.string = `${this.guildMember.power}`
        this.state.string = this.guildMember.logoutTime == 0 ? gdk.i18n.t("i18n:FOOTHOLD_TIP110") : ""
        this.memberLv.string = `.${this.guildMember.level.toString()}`

        let forces = ConfigManager.getItemById(Foothold_globalCfg, "forces").value[0]
        let joinedNum = 0
        let inviteInfo = this.footHoldModel.guardInviteInfos[this.guildMember.id]
        if (inviteInfo) {
            joinedNum = inviteInfo.joinedNum
        }
        this.teamNum.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP111"), forces - joinedNum, forces)//`可调配部队:(${forces - joinedNum}/${forces})`

        this.postionIcon.active = true
        let path = GuildUtils.getMemberTitlePath(this.guildMember.position)
        GlobalUtil.setSpriteIcon(this.node, this.postionIcon, `view/guild/texture/common/${path}`)

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(this.guildMember.vipLv)


        let pos = this.footHoldModel.pointDetailInfo.pos
        let pointInfo: FhPointInfo = this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]
        this.btnInvite.node.active = true
        this.hasGuard.active = false
        let btnLab = cc.find("txt", this.btnInvite.node).getComponent(cc.Label)
        if (this.guildMember.id == this.roleModel.id) {
            btnLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP113")
            if (this.roleModel.id == pointInfo.fhPoint.playerId || (inviteInfo && inviteInfo.joined)) {
                this.btnInvite.node.active = false
                this.hasGuard.active = true
            }
        } else {
            btnLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP114")
            if ((inviteInfo && (inviteInfo.playerId == pointInfo.fhPoint.playerId || inviteInfo.joined)) || this.guildMember.id == pointInfo.fhPoint.playerId) {
                this.btnInvite.node.active = false
                this.hasGuard.active = true
            }
        }
    }


    onInviteFunc() {
        let self = this
        if (this.guildMember.id == this.roleModel.id) {
            //是自己直接加入
            let msg = new icmsg.FootholdGuardJoinReq()
            msg.pos = this.footHoldModel.pointDetailInfo.pos
            msg.index = 0
            NetManager.send(msg, () => {
                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP100"))
                self.btnInvite.node.active = false
                self.hasGuard.active = true
                let gmsg = new icmsg.FootholdGuardTeamReq()
                gmsg.includeOwner = true
                gmsg.pos = this.footHoldModel.pointDetailInfo.pos
                NetManager.send(gmsg)
            }, this)
        } else {
            let msg = new icmsg.FootholdGuardInviteReq()
            msg.pos = this.footHoldModel.pointDetailInfo.pos
            msg.targetId = this.guildMember.id
            NetManager.send(msg, () => {
                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP95"))
                self.btnInvite.interactable = false
                let lab = cc.find("txt", this.btnInvite.node).getComponent(cc.Label)
                lab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP96")
            }, this)
        }

    }
}