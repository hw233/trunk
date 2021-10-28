import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import NetManager from '../../../../../common/managers/NetManager';
import UiListItem from '../../../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../../../common/widgets/VipFlagCtrl';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-08 14:37:19
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationApplyItemCtrl")
export default class FHCooperationApplyItemCtrl extends UiListItem {

    @property(cc.Node)
    head: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    vipFlag: cc.Node = null;

    @property(cc.Label)
    playerName: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    _info: icmsg.FootholdCoopPlayer

    updateView() {
        this._info = this.data
        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this._info.roleBrief.head))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this._info.roleBrief.headFrame))
        this.playerName.string = `${this._info.roleBrief.name}`
        this.lvLab.string = `${this._info.roleBrief.level}`
        this.powerLab.string = `${this._info.roleBrief.power}`

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(this._info.roleBrief.vipExp))
    }

    onAgreeFunc() {
        let msg = new icmsg.FootholdCoopApplyAnswerReq()
        msg.playerId = this._info.roleBrief.id
        msg.agree = true
        NetManager.send(msg, () => {
            let msg2 = new icmsg.FootholdCoopApplyPlayersReq()
            NetManager.send(msg2)
        }, this)
    }


    onRefuseFunc() {
        let msg = new icmsg.FootholdCoopApplyAnswerReq()
        msg.playerId = this._info.roleBrief.id
        msg.agree = false
        NetManager.send(msg, () => {
            let msg2 = new icmsg.FootholdCoopApplyPlayersReq()
            NetManager.send(msg2)
        }, this)
    }
}