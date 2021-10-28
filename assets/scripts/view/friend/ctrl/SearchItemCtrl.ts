import FriendModel, { FriendType } from '../model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { BtnMenuType } from '../../../common/widgets/BtnMenuCtrl';

/** 
 * @Description: 搜索列表子项
 * @Author: weiliang.huang  
 * @Date: 2019-03-26 19:37:24 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-23 17:53:07
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/friend/SearchItemCtrl")
export default class SearchItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    fightLab: cc.Label = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    selectIcon: cc.Node = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null

    @property(cc.Sprite)
    iconFrame: cc.Sprite = null

    info: FriendType = null
    roleInfo: icmsg.RoleBrief = null

    get model(): ServerModel { return ModelManager.get(ServerModel); }
    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }

    updateView() {
        this.info = this.data
        this.roleInfo = this.info.roleInfo
        this.nameLab.string = this.roleInfo.name
        this.lvLab.string = `${this.roleInfo.level}` + "级"
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getHeadIconById(this.roleInfo.head));
        GlobalUtil.setSpriteIcon(this.node, this.iconFrame, GlobalUtil.getHeadFrameById(this.roleInfo.headFrame));

        this.fightLab.string = `${this.roleInfo.power}`
        this._updateOnlineState()

    }

    /**更新在线状态 */
    _updateOnlineState() {
        let offTime = this.roleInfo.logoutTime * 1000
        if (offTime == 0) {
            this.timeLab.string = gdk.i18n.t("i18n:FRIEND_TIP3")
            this.timeLab.node.color = cc.color("#5ee015")
        } else {
            let serverTime = this.model.serverTime
            // console.log(serverTime, offTime)
            let pasTime = Math.floor((serverTime - offTime) / 1000)
            let day = Math.floor(pasTime / 3600 / 24)
            let hour = Math.floor(pasTime / 3600)
            let min = Math.floor(pasTime / 60)
            let text = ""
            if (day > 0) {
                text = StringUtils.format(gdk.i18n.t("i18n:FRIEND_TIP4"), day)//`离线${day}天`
            } else if (hour > 0) {
                text = StringUtils.format(gdk.i18n.t("i18n:FRIEND_TIP5"), hour)//`离线${hour}小时`
            } else if (min >= 0) {
                min = Math.max(min, 1)
                text = StringUtils.format(gdk.i18n.t("i18n:FRIEND_TIP6"), min)//`离线${min}分钟`
            }
            this.timeLab.string = text
            this.timeLab.node.color = cc.color("#ff1d1")
        }
    }

    _itemClick() {
        // GlobalUtil.openBtnMenu(this.node, [1, 5], {
        //     id: this.roleInfo.id,
        //     name: this.roleInfo.name,
        //     headId: this.roleInfo.head,
        // })
        let btns: BtnMenuType[] = [1, 0]
        let id = this.roleInfo.id
        let friendModel = this.friendModel
        let friendIdList = friendModel.friendIdList
        let idList = friendModel.backIdList
        // 判断添加屏蔽/取消屏蔽按钮
        if (idList[id.toLocaleString()]) {
            btns.splice(1, 0, 5)
        } else {
            btns.splice(1, 0, 4)
        }
        // 非好友的情况下增加添加好友按钮
        if (!friendIdList[id.toLocaleString()]) {
            btns.splice(1, 0, 2)
        }
        // //非普通成员可 发出 公会邀请
        if (ModelManager.get(RoleModel).guildTitle != 0 && this.roleInfo.guildId == 0) {
            btns.push(10)
        }
        let data = this.roleInfo
        GlobalUtil.openBtnMenu(this.node, btns, {
            id: id,
            name: data.name,
            headId: data.head,
            headBgId: data.headFrame,
            level: data.level,
        })
    }

    _itemSelect() {
        this.selectIcon.active = this.ifSelect
    }
}
