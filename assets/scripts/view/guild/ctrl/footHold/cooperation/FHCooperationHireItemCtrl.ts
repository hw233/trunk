import FootHoldModel from '../FootHoldModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuildUtils from '../../../utils/GuildUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import UiListItem from '../../../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../../../common/widgets/VipFlagCtrl';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-17 16:24:36
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationHireItemCtrl")
export default class FHCooperationHireItemCtrl extends UiListItem {

    @property(cc.Node)
    head: cc.Node = null;

    @property(cc.Node)
    headFrame: cc.Node = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    vipFlag: cc.Node = null;

    @property(cc.Label)
    playerName: cc.Label = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    guildName: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Label)
    fightNumLab: cc.Label = null;

    @property(cc.Node)
    btnHire: cc.Node = null;

    _info: icmsg.FootholdCoopPlayer

    updateView() {
        this._info = this.data

        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this._info.roleBrief.head))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this._info.roleBrief.headFrame))
        this.playerName.string = `${this._info.roleBrief.name}`
        this.lvLab.string = `${this._info.roleBrief.level}`
        this.powerLab.string = `${this._info.roleBrief.power}`
        this.fightNumLab.string = `${this._info.number}`

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(this._info.roleBrief.vipExp))

        if (this._info.guildBrief) {
            GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(this._info.guildBrief.bottom))
            GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(this._info.guildBrief.frame))
            GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this._info.guildBrief.icon))
            this.guildName.string = `${this._info.guildBrief.name}`
        }
        this.btnHire.getComponent(cc.Button).enabled = true
        GlobalUtil.setGrayState(this.btnHire, 0)
    }

    onHireFunc() {
        this.btnHire.getComponent(cc.Button).enabled = false
        GlobalUtil.setGrayState(this.btnHire, 1)

        let msg = new icmsg.FootholdCoopInviteAskReq()
        msg.playerId = this._info.roleBrief.id
        NetManager.send(msg, (data: icmsg.FootholdCoopInviteAskRsp) => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP145"))
        }, this)
    }

    _itemClick() {
        let btns = [1]
        GlobalUtil.openBtnMenu(this.node, btns, {
            id: this._info.roleBrief.id,
            name: this._info.roleBrief.name,
            headId: this._info.roleBrief.head,
            headBgId: this._info.roleBrief.headFrame,
            level: this._info.roleBrief.level,
        })
    }


}