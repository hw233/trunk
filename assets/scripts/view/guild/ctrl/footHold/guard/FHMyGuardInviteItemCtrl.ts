import ConfigManager from '../../../../../common/managers/ConfigManager';
import FootHoldModel from '../FootHoldModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import StringUtils from '../../../../../common/utils/StringUtils';
import UiListItem from '../../../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../../../common/widgets/VipFlagCtrl';
import { Foothold_globalCfg, Foothold_pointCfg } from '../../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-25 11:00:43
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/guard/FHMyGuardInviteItemCtrl")
export default class FHMyGuardInviteItemCtrl extends UiListItem {

    @property(cc.Node)
    head: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Label)
    memberName: cc.Label = null;

    @property(cc.Label)
    memberLv: cc.Label = null;

    @property(cc.Label)
    pointLab: cc.Label = null;

    @property(cc.Node)
    pointIcon: cc.Node = null;

    @property(cc.RichText)
    teamNum: cc.RichText = null;

    @property(cc.Node)
    titleIcon: cc.Node = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    _inviteInfo: icmsg.FootholdGuardInviter

    updateView() {
        this._inviteInfo = this.data
        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this._inviteInfo.brief.head))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this._inviteInfo.brief.headFrame))
        this.memberName.string = this._inviteInfo.brief.name
        this.memberLv.string = `.${this._inviteInfo.brief.level.toString()}`

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(this._inviteInfo.brief.vipExp))

        let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_type", 4, { world_level: this.footHoldModel.worldLevelIndex, point_type: this._inviteInfo.pointType })
        let path = `view/guild/texture/icon/${pointCfg.resources}`
        GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
        this.pointLab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP117"), pointCfg.point_type)//`据点类型:${pointCfg.point_type}级据点`

        let guard_forces = ConfigManager.getItemById(Foothold_globalCfg, "guard_forces").value[0]
        this.teamNum.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP124"), this._inviteInfo.teamNum, guard_forces)//`驻守部队:<color=#99cd44>${this._inviteInfo.teamNum}/${guard_forces}</color>`

        // let memberInfo = GuildUtils.getMemberInfo(this._inviteInfo.brief.id)
        // let titlePath = GuildUtils.getMemberTitlePath(memberInfo.position)
        // GlobalUtil.setSpriteIcon(this.node, this.titleIcon, `view/guild/texture/common/${titlePath}`)
    }

    onAgreeFunc() {
        let msg = new icmsg.FootholdGuardJoinReq()
        msg.pos = this._inviteInfo.pos
        msg.index = 0
        NetManager.send(msg, () => {
            let msg2 = new icmsg.FootholdGuardInvitersReq()
            msg2.type = 2
            NetManager.send(msg2)
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP99"))
        }, this)
    }

    onRefuseFunc() {
        let msg = new icmsg.FootholdGuardRefuseReq()
        msg.pos = this._inviteInfo.pos
        msg.all = false
        NetManager.send(msg, () => {
            let msg2 = new icmsg.FootholdGuardInvitersReq()
            msg2.type = 2
            NetManager.send(msg2)
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP99"))
        })
    }
}