import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel, { GuildAccess, GuildMemberLocal } from '../model/GuildModel';
import GuildUtils from '../utils/GuildUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import SdkTool from '../../../sdk/SdkTool';
import ServerModel from '../../../common/models/ServerModel';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import { AskInfoType } from '../../../common/widgets/AskPanel';
import { Guild_globalCfg, Guild_lvCfg } from '../../../a/config';
import { GuildEventId } from '../enum/GuildEventId';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-23 12:35:46
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildDetailCtrl")
export default class GuildDetailCtrl extends gdk.BasePanel {

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Label)
    guildNum: cc.Label = null;

    @property(cc.Label)
    guildName: cc.Label = null;

    @property(cc.Label)
    guildLv: cc.Label = null;

    @property(cc.Node)
    progressBg: cc.Node = null;

    @property(cc.Node)
    progressBar: cc.Node = null;

    @property(cc.Label)
    expLab: cc.Label = null;

    @property(cc.EditBox)
    inputBox: cc.EditBox = null;

    @property(cc.Button)
    noticeBtn: cc.Button = null;

    @property(cc.Label)
    memberNum: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    btnIcon: cc.Node = null

    @property(cc.Node)
    btnName: cc.Node = null

    @property(cc.Node)
    btnOperate: cc.Node = null

    @property(cc.Node)
    operateNode: cc.Node = null

    @property(cc.Node)
    btnCheck: cc.Node = null

    @property(cc.Node)
    btnApply: cc.Node = null

    @property(cc.Node)
    btnQuit: cc.Node = null

    @property(cc.Prefab)
    guildDetailMemberItem: cc.Prefab = null

    @property(cc.Label)
    signTimeLab: cc.Label = null;

    @property(cc.Node)
    maskPanel: cc.Node = null

    @property(cc.Node)
    btnNotice: cc.Node = null

    @property(cc.Button)
    btnRecruit: cc.Button = null

    @property(cc.Node)
    mailBtn: cc.Node = null;

    list: ListView = null;

    isShowOperateNode: boolean = false

    notice: string = ""

    get model() { return ModelManager.get(GuildModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get serverModel(): ServerModel { return ModelManager.get(ServerModel); }

    onLoad() {

    }

    start() {

    }

    onEnable() {
        gdk.e.emit(GuildEventId.REQ_GUILD_SIGN_INFO)
        gdk.e.emit(GuildEventId.REQ_GUILD_DETAIL, this.model.guildCamp.guild.id)
        gdk.e.on(GuildEventId.UPDATE_GUILD_MEMBERS, this._updateGuildMembers, this)
        gdk.e.on(GuildEventId.REMOVE_GUILD_MEMBER, this._updateGuildMembers, this)
        gdk.e.on(GuildEventId.REFRESH_GUILD_PRESIDENT, this._updatePresidentState, this)
        let announcement = ConfigManager.getItemById(Guild_globalCfg, "announcement")
        this.inputBox.maxLength = announcement ? announcement.value[0] : 50
    }

    _updateGuildMembers() {
        let datas = this.model.guildDetail.members
        GlobalUtil.sortArray(datas, this.sortPositionFunc)
        this.list.set_data(datas)
    }

    onDisable() {
        gdk.e.targetOff(this)
        this.unschedule(this.updateSignTime)
    }

    onDestroy() {

    }

    hideMaskPanel() {
        this.isShowOperateNode = false
        this.operateNode.active = this.isShowOperateNode
        this.maskPanel.active = this.isShowOperateNode
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.guildDetailMemberItem,
            cb_host: this,
            async: true,
            gap_y: 4,
            direction: ListViewDir.Vertical,
        })
    }


    @gdk.binding("model.guildDetail")
    updateGuildDetail() {
        if (!this.model.guildDetail) {
            return
        }
        this._initListView()
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this.model.guildDetail.info.icon))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(this.model.guildDetail.info.frame))
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(this.model.guildDetail.info.bottom))
        this.guildNum.string = `${this.model.guildDetail.info.id}`
        this.guildName.string = `${this.model.guildDetail.info.name}`
        this.notice = '每天上线签到，打据点战，打公会BOSS，打造最强公会'//this.model.guildDetail.notice ? this.model.guildDetail.notice : "会长很懒，什么都没留下"
        this.inputBox.string = this.notice

        this._updateGuildMembers()

        this._updatePresidentState()
        this.updateMemberNum()
        this.updateLvExp()

        let label = this.btnRecruit.getComponentInChildren(cc.Label);
        GlobalUtil.setAllNodeGray(this.btnRecruit.node, 0)
        label.getComponent(cc.LabelOutline).enabled = true
        if (!GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.Recruit)) {
            GlobalUtil.setAllNodeGray(this.btnRecruit.node, 1)
            label.getComponent(cc.LabelOutline).enabled = false
        }
        this.updateRecruitBtn(0, true);
        //this.mailBtn.active = !GuildUtils.isNomalMember(this.roleModel.id);
    }

    /**会长操作权限 显示 */
    _updatePresidentState() {
        this.btnIcon.active = GuildUtils.isPresident(this.roleModel.id)
        this.btnName.active = GuildUtils.isPresident(this.roleModel.id)

        this.btnCheck.active = GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.Approve)
        this.btnApply.active = GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.Approve) && !this.model.guildDetail.autoJoin
        // this.btnQuit.active = !GuildUtils.isPresident(this.roleModel.id)

        //this.noticeBtn.node.active = GuildUtils.isPresident(this.roleModel.id)
        this.noticeBtn.node.active = false
        if (GuildUtils.isPresident(this.roleModel.id)) {
            this.model.selectIcon = this.model.guildDetail.info.icon
            this.model.selectFrame = this.model.guildDetail.info.frame
            this.model.selectBottom = this.model.guildDetail.info.bottom
        }
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

    @gdk.binding("model.guildDetail.info.num")
    updateMemberNum() {
        if (!this.model.guildDetail) {
            return
        }
        let cfg = ConfigManager.getItemByField(Guild_lvCfg, "clv", this.model.guildDetail.info.level)
        this.memberNum.string = `${gdk.i18n.t("i18n:GUILD_TIP9")}${this.model.guildDetail.info.num}/${cfg.number}`
    }

    @gdk.binding("model.guildDetail.exp")
    updateLvExp() {
        if (!this.model.guildDetail) {
            return
        }
        let lv = this.model.guildDetail.info.level
        this.guildLv.string = `${lv}`
        let cfgs = ConfigManager.getItems(Guild_lvCfg)
        if (lv == cfgs.length) {
            lv = lv - 1
        }
        lv = lv == 0 ? 1 : lv
        let lvCfg = ConfigManager.getItemByField(Guild_lvCfg, "clv", lv)
        this.progressBar.width = this.progressBg.width * (Math.min(lvCfg.exp, this.model.guildDetail.exp) / lvCfg.exp)
        this.expLab.string = `${this.model.guildDetail.exp}/${lvCfg.exp}`

        //升级后更新公会人数
        this.updateMemberNum()
        //更新签到刷新时间
        this.updateSignTime()
        this.schedule(this.updateSignTime.bind(this), 1)
    }

    updateSignTime() {
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let zeroTime = TimerUtils.getTomZerohour(curTime)
        let time = zeroTime - curTime
        this.signTimeLab.string = `${TimerUtils.format2(time)}`
    }

    operateNodeClick() {
        this.isShowOperateNode = !this.isShowOperateNode
        this._updatePresidentState()
        this.operateNode.active = this.isShowOperateNode
        this.maskPanel.active = this.isShowOperateNode
    }

    /** 改名*/
    changeNameFunc() {
        gdk.panel.open(PanelId.GuildChangeName)
    }

    /** 验证设置*/
    setCheckFunc() {
        this.hideMaskPanel()
        gdk.panel.open(PanelId.GuildSetCheck)
    }

    /** logo设置*/
    setIconFunc() {
        gdk.panel.open(PanelId.GuildSetIcon)
    }

    /**申请列表*/
    applyListFunc() {
        this.hideMaskPanel()
        gdk.panel.open(PanelId.GuildApplyList)
    }

    /**退出公会 */
    quitFunc() {
        this.hideMaskPanel()
        let state = 0
        let isPresident = GuildUtils.isPresident(this.roleModel.id)
        let guildName = this.model.guildDetail.info.name
        let text = StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP10"), guildName)//`退出${guildName}公会后,1小时内不可加入新公会`
        if (isPresident) {
            if (this.list.datas.length > 1) {
                let member = this.model.guildDetail.members[1]
                text = StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP11"), guildName, member.name)//`退出${guildName}公会后,会长将移交给${member.name},且1小时不能加入新公会`
            } else {
                state = 1
                text = StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP12"), guildName)//`是否解散${guildName}公会,解散后1小时不能加入新公会`
            }
        }
        let self = this
        GlobalUtil.openAskPanel({
            title: gdk.i18n.t("i18n:GUILD_TIP3"),
            descText: text,
            thisArg: this,
            sureCb: () => {
                let msg = new icmsg.GuildQuitReq()
                NetManager.send(msg, () => {
                    this.roleModel.guildId = 0
                    this.roleModel.guildTitle = 0
                    this.roleModel.guildName = ""
                    if (state == 0) {
                        gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP13"), guildName))
                    } else {
                        gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP14"), guildName))
                    }
                    GuildUtils.clearGuildData()
                    gdk.panel.hide(PanelId.GuildDetail)
                    gdk.panel.hide(PanelId.GuildMain)
                })
            },
        });
    }

    /**查找公会 */
    searchFunc() {
        this.hideMaskPanel()
        gdk.panel.setArgs(PanelId.GuildList, false)
        JumpUtils.openPanel({
            panelId: PanelId.GuildList,
            currId: this.node,
        })
    }

    /**签到 */
    signFunc() {
        gdk.panel.open(PanelId.GuildSign)
    }

    /**公会公告设置 */
    onNoticeChange() {
        this.inputBox.string = this.notice
        this.btnNotice.active = false
        this.inputBox.focus()
    }

    /**公会公告设置 */
    saveNoticeFunc() {
        if (this.inputBox.string != "" && this.inputBox.string != this.notice) {
            this.btnNotice.active = true
            SdkTool.tool.hasMaskWord(this.inputBox.string, ret => {
                if (ret) {
                    this.inputBox.string = this.notice
                    gdk.GUIManager.showMessage(gdk.i18n.t("i18n:GUILD_TIP6"));
                    return;
                }
                this.notice = this.inputBox.string
                let msg = new icmsg.GuildSetNoticeReq()
                msg.notice = this.inputBox.string
                NetManager.send(msg, () => {
                    this.model.guildDetail.notice = msg.notice
                    this.model.guildDetail = this.model.guildDetail
                    gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP8"))
                })
            });
        } else {
            this.btnNotice.active = true
            this.inputBox.string = this.notice
        }
    }

    openRankFunc() {
        gdk.panel.open(PanelId.FHResultView)
    }

    onRecruitFunc() {
        if (!GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.Recruit)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP15"))
            return
        }
        let time = (this.serverModel.serverTime - this.model.recruitTime) / 1000;
        let recruiting_interval = ConfigManager.getItemById(Guild_globalCfg, "recruiting_interval").value[0]
        let checkTime = recruiting_interval
        if (time < checkTime) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP16"), Math.ceil(checkTime - time)))//`休息一下，${Math.ceil(checkTime - time)}秒后再尝试发布`
            return
        }

        if (this.model.guildDetail.recruitNum == 0) {
            let info: AskInfoType = {
                title: gdk.i18n.t("i18n:GUILD_TIP3"),
                sureCb: () => {
                    this._reqRecruitFunc()
                },
                descText: gdk.i18n.t("i18n:GUILD_TIP17"),
                thisArg: this,
            }
            GlobalUtil.openAskPanel(info)
        } else {
            gdk.panel.open(PanelId.GuildRecruitCheck)
        }
    }

    _reqRecruitFunc() {
        this.model.recruitTime = this.serverModel.serverTime;
        let msg = new icmsg.GuildRecruitReq()
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP18"))
            this.model.guildDetail.recruitNum += 1
        })
    }

    @gdk.binding("model.guildDetail.recruitNum")
    updateBtnState() {
        this.updateRecruitBtn(0, true);
    }

    /**
   * 更新按钮标签
   * @param dt 
   * @param isAddSchedule 
   */
    updateRecruitBtn(dt: number, isAddSchedule?: boolean) {
        let text = this.btnRecruit.getComponentInChildren(cc.Label);
        text.getComponent(cc.LabelOutline).enabled = true
        let time = (this.serverModel.serverTime - this.model.recruitTime) / 1000;
        let recruiting_interval = ConfigManager.getItemById(Guild_globalCfg, "recruiting_interval").value[0]
        let checkTime = recruiting_interval
        if (time >= checkTime) {
            this.unschedule(this.updateRecruitBtn);
            text.string = gdk.i18n.t("i18n:GUILD_TIP19");
            GlobalUtil.setAllNodeGray(this.btnRecruit.node, 0)
        } else {
            text.string = StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP20"), Math.ceil(checkTime - time))//`招募(${Math.ceil(checkTime - time)}s)`;
            text.getComponent(cc.LabelOutline).enabled = false
            GlobalUtil.setAllNodeGray(this.btnRecruit.node, 1)
            if (isAddSchedule) {
                this.schedule(this.updateRecruitBtn, 1);
            }
        }
    }

    onLogBtnClick() {
        gdk.panel.open(PanelId.GuildLog);
    }

    onRankBtnClick() {
        gdk.panel.open(PanelId.GuildListRankView);
    }

    onMailBtnClick() {
        gdk.panel.open(PanelId.GuildMailSendView);
    }
}