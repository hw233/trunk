import FootHoldModel from '../FootHoldModel';
import FootHoldUtils from '../FootHoldUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RoleModel from '../../../../../common/models/RoleModel';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { AskInfoType } from '../../../../../common/widgets/AskPanel';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-19 16:58:11
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationNoticeItemCtrl")
export default class FHCooperationNoticeItemCtrl extends UiListItem {

    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(cc.Node)
    rankIcon: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    serverLab: cc.Label = null;

    @property(cc.Label)
    guildName: cc.Label = null;

    @property(cc.Label)
    scoreLab: cc.Label = null;

    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];

    _info: icmsg.FootholdCoopGuild

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    updateView() {
        this._info = this.data
        this.rankLab.string = `${this.curIndex + 1}`
        if (this.curIndex > 2) {
            this.rankIcon.active = false
        } else {
            let path = this.rankSpriteName[this.curIndex];
            GlobalUtil.setSpriteIcon(this.node, this.rankIcon, path);
        }
        this.serverLab.string = `[s${GlobalUtil.getSeverIdByGuildId(this._info.guildInfo.id)}]`
        this.guildName.string = `${this._info.guildInfo.name}`
        this.scoreLab.string = `${this._info.guildInfo.score}`
    }

    onCooperFunc() {
        if (this.footHoldModel.cooperGuildList.length < 4) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP132"))
            return
        }

        if (this.roleModel.guildId == 0) {
            let info: AskInfoType = {
                sureCb: () => {
                    gdk.panel.hide(PanelId.FHCooperationNotice)
                    gdk.panel.setArgs(PanelId.GuildJoin, this._info.guildInfo.id, false)
                    gdk.panel.open(PanelId.GuildJoin)
                },
                closeCb: () => {
                    gdk.panel.hide(PanelId.FHCooperationNotice)
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

    _itemClick() {
        gdk.panel.setArgs(PanelId.GuildJoin, this._info.guildInfo.id, true)
        gdk.panel.open(PanelId.GuildJoin)
    }
}