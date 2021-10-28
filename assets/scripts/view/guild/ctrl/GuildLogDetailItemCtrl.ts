import ConfigManager from '../../../common/managers/ConfigManager';
import FriendModel from '../../friend/model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildUtils from '../utils/GuildUtils';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import UiListItem from '../../../common/widgets/UiListItem';
import { BtnMenuType } from '../../../common/widgets/BtnMenuCtrl';
import { GlobalCfg, Guild_logCfg } from '../../../a/config';
import { GuildMemberLocal } from '../model/GuildModel';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-24 14:41:18
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildLogDetailItemCtrl")
export default class GuildLogDetailItemCtrl extends UiListItem {
    @property(cc.Node)
    head: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Label)
    memberName: cc.Label = null;

    @property(cc.Label)
    state: cc.Label = null;

    @property(cc.Label)
    memberLv: cc.Label = null;

    @property(cc.Label)
    postionLab: cc.Label = null;

    @property(cc.Label)
    infoLab: cc.Label = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    guildMember: GuildMemberLocal = null

    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    updateView() {
        this.guildMember = this.data.info

        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this.guildMember.head))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this.guildMember.frame))
        this.memberName.string = this.guildMember.name
        this.state.string = GuildUtils.getOnLineState(this.guildMember.logoutTime)
        this.memberLv.string = `.${this.guildMember.level.toString()}`
        let positionStr = GuildUtils.isPresident(this.guildMember.id) ? gdk.i18n.t("i18n:GUILD_TIP32") : (GuildUtils.isVicePresident(this.guildMember.id) ? gdk.i18n.t("i18n:GUILD_TIP33") : gdk.i18n.t("i18n:GUILD_TIP34"))
        this.postionLab.string = `${positionStr}`

        let type = this.data.type
        let logCfg = ConfigManager.getItemByField(Guild_logCfg, "type", type)

        this.infoLab.string = `${logCfg.desc}:${this._getNumStr(type)}`

    }

    _getNumStr(type) {
        let str = ``
        switch (type) {
            case 1:
                str = this.guildMember.fightNum + ''
                break
            case 3:
                str = this.guildMember.signFlag ? gdk.i18n.t("i18n:GUILD_TIP35") : gdk.i18n.t("i18n:GUILD_TIP36")
                break
            case 4:
                // let guild_boss_times = ConfigManager.getItemById(GlobalCfg, "guild_boss_times").value[0]
                // let num = guild_boss_times - this.guildMember.bossNum
                // str = `${num > 0 ? num : 0}`
                str = `${this.guildMember.bossNum}`
                break
        }
        return str
    }

    /**展开菜单栏 */
    onBtnClick() {
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

        //6 驱逐 7 任命副会 8 解除副会 9 移交会长
        //操作者是会长
        if (GuildUtils.isPresident(this.roleModel.id)) {
            if (!GuildUtils.isPresident(id)) {
                btns.push(6)
            }

            if (GuildUtils.isVicePresident(id)) {
                btns.push(8)
            }

            //副会长未满 
            if (!GuildUtils.isFullPresident() && GuildUtils.isNomalMember(id)) {
                btns.push(7)
            }

            if (!GuildUtils.isPresident(id)) {
                btns.push(9)
            }
        }

        //操作者是副会长
        if (GuildUtils.isVicePresident(this.roleModel.id)) {
            if (GuildUtils.isNomalMember(id)) {
                btns.push(6)
            }
        }

        GlobalUtil.openBtnMenu(this.btnNode, btns, {
            id: this.guildMember.id,
            name: this.guildMember.name,
            headId: this.guildMember.head,
            headBgId: this.guildMember.frame,
            level: this.guildMember.level,
        })
    }
}