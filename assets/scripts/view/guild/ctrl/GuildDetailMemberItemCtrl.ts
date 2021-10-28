import FriendModel from '../../friend/model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildUtils from '../utils/GuildUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import { BtnMenuType } from '../../../common/widgets/BtnMenuCtrl';
import { GuildAccess, GuildMemberLocal, GuildTitle } from '../model/GuildModel';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-23 12:35:48
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildDetailMemberItemCtrl")
export default class GuildDetailMemberItemCtrl extends UiListItem {

    @property(cc.Node)
    head: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    titleIcon: cc.Node = null;

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
    fightNum: cc.Label = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property(cc.Label)
    timeLab: cc.Label = null;

    guildMember: GuildMemberLocal = null

    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onLoad() {

    }

    updateView() {
        this.guildMember = this.data
        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this.guildMember.head))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this.guildMember.frame))
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(this.guildMember.title))

        this.memberName.string = this.guildMember.name
        this.powerLab.string = `${this.guildMember.power}`
        this.state.string = GuildUtils.getOnLineState(this.guildMember.logoutTime)
        this.memberLv.string = `.${this.guildMember.level.toString()}`
        this.fightNum.string = `${this.guildMember.fightNum}`

        let path = GuildUtils.getMemberTitlePath(this.guildMember.position)
        GlobalUtil.setSpriteIcon(this.node, this.postionIcon, `view/guild/texture/common/${path}`)

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(this.guildMember.vipLv)
        if (this.guildMember.position == GuildTitle.President) {
            this._createTime()
        }
    }


    /**展开菜单栏 */
    _itemClick() {
        let id = this.guildMember.id
        if (id.toLocaleString() == this.roleModel.id.toLocaleString()) {
            return
        }
        let btns: BtnMenuType[] = [1, 0]
        let friendIdList = this.friendModel.friendIdList
        // 非好友的情况下增加添加好友按钮
        if (!friendIdList[id.toLocaleString()]) {
            btns.splice(1, 0, 2)
        }

        //6 驱逐 7 任命副会 8 解除副会 9 移交会长 14设置战斗队长 15 取消战斗队长
        //操作者是会长
        if (GuildUtils.isPresident(this.roleModel.id)) {
            if (!GuildUtils.isPresident(id)) {
                btns.push(6)
            }

            if (GuildUtils.isVicePresident(id)) {
                btns.push(8)
            }

            //副会长未满 
            if (!GuildUtils.isFullPresident() && (GuildUtils.isNomalMember(id) || GuildUtils.isTeamLeader(id))) {
                btns.push(7)
            }

            if (GuildUtils.isTeamLeader(id)) {
                btns.push(15)
            } else {
                if (GuildUtils.isNomalMember(id) && !GuildUtils.isFullTeamLeader()) {
                    btns.push(14)
                }
            }

            if (!GuildUtils.isPresident(id)) {
                btns.push(9)
            }
        }

        //操作者是副会长
        if (GuildUtils.isVicePresident(this.roleModel.id)) {
            if (GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.SetTeamLeader)) {
                if (GuildUtils.isTeamLeader(id)) {
                    btns.push(15)
                } else {
                    if (GuildUtils.isNomalMember(id)) {
                        btns.push(14)
                    }
                }
            }
            if (GuildUtils.isNomalMember(id) && GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.KickoutMember)) {
                btns.push(6)
            }
        }

        GlobalUtil.openBtnMenu(this.head, btns, {
            id: this.guildMember.id,
            name: this.guildMember.name,
            headId: this.guildMember.head,
            headBgId: this.guildMember.frame,
            level: this.guildMember.level,
        })
    }



    _createTime() {
        this._clearTime()
        this._updateTime()
        this.schedule(this._updateTime, 1)
    }

    _updateTime() {
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let logoutTime = this.guildMember.logoutTime
        if (logoutTime > 0 && (curTime > logoutTime + 86400) && (curTime < logoutTime + 86400 * 2)) {
            this.timeLab.string = TimerUtils.format2(logoutTime + 86400 * 2 - curTime) + gdk.i18n.t("i18n:GUILD_TIP57")
        } else {
            this.timeLab.string = ``
            this._clearTime()
        }
    }

    _clearTime() {
        this.unschedule(this._updateTime)
    }


}