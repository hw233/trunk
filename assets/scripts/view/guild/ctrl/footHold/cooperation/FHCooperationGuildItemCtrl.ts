import ConfigManager from '../../../../../common/managers/ConfigManager';
import FootHoldModel from '../FootHoldModel';
import FootHoldUtils from '../FootHoldUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuildUtils from '../../../utils/GuildUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RoleModel from '../../../../../common/models/RoleModel';
import StringUtils from '../../../../../common/utils/StringUtils';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { AskInfoType } from '../../../../../common/widgets/AskPanel';
import { Foothold_globalCfg } from '../../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-17 16:19:46
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationGuildItemCtrl")
export default class FHCooperationGuildItemCtrl extends UiListItem {

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    guildName: cc.Label = null;

    @property(cc.RichText)
    rewardLab: cc.RichText = null;

    @property(cc.Label)
    scoreLab: cc.Label = null;

    @property(cc.Label)
    joinNum: cc.Label = null;

    @property(cc.Label)
    fightNum: cc.Label = null;

    @property(cc.Node)
    btnCooper: cc.Node = null;

    _info: icmsg.FootholdCoopGuild

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    updateView() {
        this._info = this.data
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(this._info.guildInfo.bottom))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(this._info.guildInfo.frame))
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this._info.guildInfo.icon))
        this.guildName.string = `[S${GlobalUtil.getSeverIdByGuildId(this._info.guildInfo.id)}服]${this._info.guildInfo.name}`
        this.scoreLab.string = `${this._info.guildInfo.score}`
        this.joinNum.string = `${this._info.joinNum}`
        this.fightNum.string = `+(${this._info.coopNum}/${this._info.coopMax})`

        let cooperation_multiple = ConfigManager.getItemById(Foothold_globalCfg, "cooperation_multiple").value
        this.rewardLab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP133"), cooperation_multiple[this.curIndex] / 100)//`协战奖励<color=#F6E707>${cooperation_multiple[this.curIndex] / 100}</c>倍`

        GlobalUtil.setGrayState(this.btnCooper, 0)
        if (this.footHoldModel.coopGuildId > 0 && FootHoldUtils.isInCoopertionInviteTime()) {
            GlobalUtil.setGrayState(this.btnCooper, 1)
        }
    }


    //查看参战人员列表
    onLookFunc() {
        gdk.panel.setArgs(PanelId.FHCooperationPlayerList, this._info.guildInfo.id)
        gdk.panel.open(PanelId.FHCooperationPlayerList)
    }

    //协战
    onCooperFunc() {
        if (this.footHoldModel.cooperGuildList.length < 4) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP132"))
            return
        }
        if (this.roleModel.guildId == 0) {
            let info: AskInfoType = {
                sureCb: () => {
                    gdk.panel.hide(PanelId.FHCooperationMain)
                    gdk.panel.setArgs(PanelId.GuildJoin, this._info.guildInfo.id, false)
                    gdk.panel.open(PanelId.GuildJoin)
                },
                closeCb: () => {
                    gdk.panel.hide(PanelId.FHCooperationMain)
                    gdk.panel.open(PanelId.GuildList)
                },
                sureText: gdk.i18n.t("i18n:FOOTHOLD_TIP134"),
                closeText: gdk.i18n.t("i18n:FOOTHOLD_TIP135"),
                descText: gdk.i18n.t("i18n:FOOTHOLD_TIP136"),
                thisArg: this,
            }
            GlobalUtil.openAskPanel(info)
            return
        }

        if (!FootHoldUtils.isCanCooperation(this.roleModel.guildId)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP137"))
            return
        }

        if (this.footHoldModel.coopGuildId > 0 && FootHoldUtils.isInCoopertionInviteTime()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP138"))
            return
        }

        if (!FootHoldUtils.isInCoopertionInviteTime()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP139"))
            return
        }

        if (this._info.coopNum >= this._info.coopMax) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP140"))
            return
        }

        let msg = new icmsg.FootholdCoopApplyAskReq()
        msg.guildId = this._info.guildInfo.id
        NetManager.send(msg, (data: icmsg.FootholdCoopApplyAskRsp) => {
            if (data.autoJoin) {
                this.footHoldModel.coopGuildId = data.guildId
                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP141"))
            } else {
                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP142"))
            }
        }, this)
    }
}