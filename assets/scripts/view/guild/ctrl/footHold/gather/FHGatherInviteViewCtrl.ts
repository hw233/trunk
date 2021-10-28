import ConfigManager from '../../../../../common/managers/ConfigManager';
import FootHoldModel, { FhPointInfo } from '../FootHoldModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuildModel, { GuildMemberLocal } from '../../../model/GuildModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RoleModel from '../../../../../common/models/RoleModel';
import StringUtils from '../../../../../common/utils/StringUtils';
import { AskInfoType } from '../../../../../common/widgets/AskPanel';
import { Foothold_globalCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-27 13:58:50
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/gather/FHGatherInviteViewCtrl")
export default class FHGatherInviteViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    inviteItem: cc.Prefab = null

    @property(cc.RichText)
    tipLab: cc.RichText = null

    list: ListView = null;

    get guildModel() { return ModelManager.get(GuildModel); }
    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel() { return ModelManager.get(RoleModel); }

    onEnable() {
        NetManager.on(icmsg.FootholdGatherBriefRsp.MsgType, this._onFootholdGatherBriefRsp, this)

        //成员信息可能发生变化 请求公会详情信息
        let msg = new icmsg.GuildDetailReq()
        msg.guildId = this.guildModel.guildDetail.info.id
        NetManager.send(msg)

        this.tipLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP103")

    }

    onDisable() {
        this.footHoldModel.gatherInviteInfos = {}
        NetManager.targetOff(this)
    }

    @gdk.binding("footHoldModel.guildDetail")
    updateGuildDetail() {
        let msg = new icmsg.FootholdGatherBriefReq()
        msg.pos = this.footHoldModel.pointDetailInfo.pos
        NetManager.send(msg)
    }

    _onFootholdGatherBriefRsp(data: icmsg.FootholdGatherBriefRsp) {

        for (let i = 0; i < data.list.length; i++) {
            this.footHoldModel.gatherInviteInfos[data.list[i].playerId] = data.list[i]

        }
        this._initListView()
        let datas = this.guildModel.guildDetail.members
        GlobalUtil.sortArray(datas, this.sortPositionFunc)

        let otherMembers = []
        if (this.footHoldModel.coopGuildId == 0) {
            let msg = new icmsg.FootholdCoopGuildMembersReq()
            msg.guildId = this.roleModel.guildId
            NetManager.send(msg, (data: icmsg.FootholdCoopGuildMembersRsp) => {
                //协战人员
                for (let i = 0; i < data.members.length; i++) {
                    if (data.members[i].roleBrief && data.members[i].roleBrief.guildId != this.roleModel.guildId) {
                        let guildMemberLocal: GuildMemberLocal = {
                            id: data.members[i].roleBrief.id,
                            name: data.members[i].roleBrief.name,
                            head: data.members[i].roleBrief.head,
                            frame: data.members[i].roleBrief.headFrame,
                            level: data.members[i].roleBrief.level,
                            fightNum: 0,
                            signFlag: false,
                            bossNum: 0,
                            position: -1,
                            logoutTime: data.members[i].roleBrief.logoutTime,
                            vipLv: GlobalUtil.getVipLv(data.members[i].roleBrief.vipExp),
                            power: data.members[i].roleBrief.power,
                            title: data.members[i].roleBrief.title,
                        }
                        otherMembers.push(guildMemberLocal)
                    }
                }
                this.list.set_data(datas.concat(otherMembers))
            })
        } else {
            this.list.set_data(datas)
        }


    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.inviteItem,
            cb_host: this,
            async: true,
            gap_y: 4,
            direction: ListViewDir.Vertical,
        })
    }

    /**职位排序 */
    sortPositionFunc(a: any, b: any) {
        let infoA = <GuildMemberLocal>a
        let infoB = <GuildMemberLocal>b
        if (infoA.position == infoB.position) {
            if (infoA.fightNum == infoB.fightNum) {
                if (infoA.logoutTime == infoB.logoutTime) {
                    if (infoA.level == infoB.level) {
                        return parseInt((infoA.id + "").slice(4, 10)) - parseInt((infoB.id + "").slice(4, 10))
                    } else {
                        return infoB.level - infoA.level
                    }
                } else {
                    if ((infoA.logoutTime == 0 && infoB.logoutTime != 0) ||
                        (infoB.logoutTime == 0 && infoA.logoutTime != 0)) {
                        return infoA.logoutTime - infoB.logoutTime
                    } else {
                        return infoB.logoutTime - infoA.logoutTime
                    }
                }
            } else {
                return infoB.fightNum - infoA.fightNum
            }
        }
        return infoB.position - infoA.position
    }


    onCloseFunc() {
        gdk.panel.hide(PanelId.FHGatherInviteView)
    }

    onFightFunc() {
        let pointInfo: FhPointInfo = this.footHoldModel.warPoints[`${this.footHoldModel.pointDetailInfo.pos.x}-${this.footHoldModel.pointDetailInfo.pos.y}`]
        let targetInfo: FhPointInfo = this.footHoldModel.warPoints[`${pointInfo.fhPoint.gather.targetPos.x}-${pointInfo.fhPoint.gather.targetPos.y}`]
        if (targetInfo && targetInfo.fhPoint) {
            let time = targetInfo.fhPoint.statusEndtime - Math.floor(GlobalUtil.getServerTime() / 1000)
            if (time > 0) {
                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP23"), time))//`该据点处于保护期,${time}秒后才可进行抢夺`
                return
            }
        }
        this.footHoldModel.gatherFightType = 1
        gdk.panel.open(PanelId.FHGatherReadyFight)
    }
}