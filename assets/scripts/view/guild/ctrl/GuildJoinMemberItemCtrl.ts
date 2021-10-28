import FriendModel from '../../friend/model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel, { GuildMemberLocal } from '../model/GuildModel';
import GuildUtils from '../utils/GuildUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import UiListItem from '../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import { BtnMenuType } from '../../../common/widgets/BtnMenuCtrl';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-01 11:42:42
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildJoinMemberItemCtrl")
export default class GuildJoinMemberItemCtrl extends UiListItem {

    @property(cc.Node)
    head: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    titleIcon: cc.Node = null;

    @property(cc.Label)
    memberName: cc.Label = null;

    @property(cc.Label)
    state: cc.Label = null;

    @property(cc.Label)
    memberLv: cc.Label = null;

    @property(cc.Node)
    postionIcon: cc.Node = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    guildMember: GuildMemberLocal = null

    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get guildModel() { return ModelManager.get(GuildModel); }

    onLoad() {

    }

    updateView() {
        this.guildMember = this.data
        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this.guildMember.head))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this.guildMember.frame))
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(this.guildMember.title))
        this.memberName.string = this.guildMember.name
        this.state.string = GuildUtils.getOnLineState(this.guildMember.logoutTime)
        this.memberLv.string = `.${this.guildMember.level.toString()}`
        this.postionIcon.active = true
        let path = GuildUtils.getMemberTitlePath(this.guildMember.position)
        GlobalUtil.setSpriteIcon(this.node, this.postionIcon, `view/guild/texture/common/${path}`)
        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(this.guildMember.vipLv)
    }


    /**展开菜单栏 */
    _itemClick() {
        let id = this.guildMember.id
        if (id.toLocaleString() == this.roleModel.id.toLocaleString()) {
            return
        }
        let btns: BtnMenuType[] = [1, 0]

        let guildId = this.guildModel.guildDetail.info.id
        let targetServerId = GlobalUtil.getSeverIdByGuildId(guildId)
        let roleServerId = GlobalUtil.getSeverIdByGuildId(this.roleModel.guildId)
        if (targetServerId == roleServerId) {
            let friendIdList = this.friendModel.friendIdList
            // 非好友的情况下增加添加好友按钮
            if (!friendIdList[id.toLocaleString()]) {
                btns.splice(1, 0, 2)
            }
        } else {
            btns = [1]
        }


        GlobalUtil.openBtnMenu(this.head, btns, {
            id: this.guildMember.id,
            name: this.guildMember.name,
            headId: this.guildMember.head,
            headBgId: this.guildMember.frame,
            level: this.guildMember.level,
        })
    }


}