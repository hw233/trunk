import FootHoldModel, { FhPointInfo } from '../FootHoldModel';
import FootHoldUtils from '../FootHoldUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../../common/utils/GuideUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RoleModel from '../../../../../common/models/RoleModel';
import VipFlagCtrl from '../../../../../common/widgets/VipFlagCtrl';
import { AskInfoType } from '../../../../../common/widgets/AskPanel';
import { O_CREAT } from 'constants';
import { timeStamp } from 'console';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-25 14:11:38
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/gather/FHGatherPlayerItemCtrl")
export default class FHGatherPlayerItemCtrl extends cc.Component {

    @property(cc.Node)
    playerNode: cc.Node = null;

    @property(cc.Node)
    btnGather: cc.Node = null;

    @property(cc.Node)
    head: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    _temamateInfo: icmsg.FootholdGatherTeammate

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {

    }

    updateViewInfo(info: icmsg.FootholdGatherTeammate) {
        this._temamateInfo = info
        if (info.brief) {
            this.playerNode.active = true
            this.btnGather.active = false
            GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(info.brief.head))
            GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(info.brief.headFrame))
            this.nameLab.string = info.brief.name
            this.nameLab.node.color = cc.color("#E5B88C")
            if (info.brief.id == ModelManager.get(RoleModel).id) {
                this.nameLab.node.color = cc.color("#00ff00")
            }
            this.powerLab.string = `${info.brief.power}`
            this.lvLab.string = `.${info.brief.level}`
            let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
            vipCtrl.updateVipLv(GlobalUtil.getVipLv(info.brief.vipExp))
        } else {
            this.playerNode.active = false
            this.btnGather.active = true
            let addLab = this.btnGather.getChildByName("addLab")
            if (addLab && this.footHoldModel.pointGatherPlayerIds.indexOf(ModelManager.get(RoleModel).id) != -1) {
                addLab.active = false
            }
        }
    }

    onJoinFunc() {
        let info = this.footHoldModel.pointDetailInfo
        let fhPointInfo: FhPointInfo = this.footHoldModel.warPoints[`${info.pos.x}-${info.pos.y}`]
        if (fhPointInfo.fhPoint && !(fhPointInfo.fhPoint.status & 8)) {
            if (FootHoldUtils.isPlayerCanSetGather) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP105"))
                GuideUtil.setGuideId(212010)
            } else {
                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP106"))
            }
            return
        }

        if (FootHoldUtils.isPlayerCanSetGather) {
            gdk.panel.open(PanelId.FHGatherInviteView)
        } else {
            if (this.footHoldModel.pointGatherPlayerIds.indexOf(ModelManager.get(RoleModel).id) != -1) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP107"))
                return
            } else {
                let askInfo: AskInfoType = {
                    sureCb: () => {
                        this._joinReq()
                    },
                    descText: gdk.i18n.t("i18n:FOOTHOLD_TIP108"),
                    thisArg: this,
                }
                GlobalUtil.openAskPanel(askInfo)
            }
        }
    }

    _joinReq() {
        let msg = new icmsg.FootholdGatherJoinReq()
        msg.pos = this.footHoldModel.pointDetailInfo.pos
        msg.index = this._temamateInfo.index
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP109"))
            let reqMsg = new icmsg.FootholdGatherTeamReq()
            reqMsg.pos = this.footHoldModel.pointDetailInfo.pos
            NetManager.send(reqMsg)
        }, this)
    }

    openPlayerInfo() {
        gdk.panel.setArgs(PanelId.MainSet, this._temamateInfo.brief.id)
        gdk.panel.open(PanelId.MainSet)
    }

}