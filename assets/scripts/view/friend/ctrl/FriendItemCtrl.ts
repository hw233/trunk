import FriendModel, { FriendType } from '../model/FriendModel';
import FriendUtil from '../utils/FriendUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';


/** 
 * @Description: 好友子项
 * @Author: weiliang.huang  
 * @Date: 2019-03-26 19:37:24 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-30 10:05:59
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/friend/FriendItemCtrl")
export default class FriendItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    fightLab: cc.Label = null;
    @property(cc.Label)
    capLab: cc.Label = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    selectIcon: cc.Node = null;

    @property(cc.Node)
    addBtn: cc.Node = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null

    @property(cc.Sprite)
    iconFrame: cc.Sprite = null

    @property(cc.Sprite)
    titleIcon: cc.Sprite = null

    @property(cc.Node)
    sendBtn: cc.Node = null

    @property(cc.Node)
    getBtn: cc.Node = null

    @property(cc.Node)
    agreeBtn: cc.Node = null

    @property(cc.Node)
    refuseBtn: cc.Node = null

    @property(cc.Node)
    sendImg: cc.Node = null

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property(cc.Node)
    selectBtn: cc.Node = null

    info: FriendType = null
    roleInfo: icmsg.RoleBrief = null

    _isSelect: boolean = false //是否勾选

    get model(): ServerModel { return ModelManager.get(ServerModel); }
    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }


    updateView() {
        this.info = this.data
        this.roleInfo = this.info.roleInfo
        this.nameLab.string = this.roleInfo.name
        this.lvLab.string = `.${this.roleInfo.level}`;
        // this.nameLab.node.on(cc.Node.EventType.SIZE_CHANGED, () => {
        //     this.lvLab.node.x = this.nameLab.node.x + this.nameLab.node.width + 5;
        // });

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(this.roleInfo.vipExp))

        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getHeadIconById(this.roleInfo.head));
        GlobalUtil.setSpriteIcon(this.node, this.iconFrame, GlobalUtil.getHeadFrameById(this.roleInfo.headFrame));
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(this.roleInfo.title));

        this.selectBtn.active = false
        this.fightLab.string = `${this.roleInfo.power}`
        this._updateOnlineState()
        this.capLab.string = `x${this.info.elite}`
        let utype = this.info.utype
        if (utype == 0) {
            if (this.friendModel.checkSelect) {
                this.sendBtn.active = false
                this.getBtn.active = false
                this.sendImg.active = false
                this.addBtn.active = false
                this.agreeBtn.active = false
                this.refuseBtn.active = false
                this.selectBtn.active = true

                this._isSelect = this.info.isCheckSelect
                let yes = cc.find("sub_yes", this.selectBtn)
                yes.active = this._isSelect
            } else {
                this._updateGiftState()
            }
        } else {
            this.sendBtn.active = false
            this.getBtn.active = false
            this.sendImg.active = false;
        }
        this.agreeBtn.active = utype == 1
        this.refuseBtn.active = utype == 1
        this.addBtn.active = utype == 2 || utype == 4
        if (this.addBtn.active) {
            let id = this.roleInfo.id.toLocaleString()
            // if (this.friendModel.addList[id]) {
            //     this.addBtn.getComponent(cc.Button).interactable = false;
            //     let labNode = this.addBtn.childrenCount[0];
            // } else {
            this.addBtn.getComponent(cc.Button).interactable = true;
            // }
            // let state = !!this.friendModel.addList[id]  // 是否已申请
            this.addBtn.getComponent(cc.Button).interactable = true
            let labNode = this.addBtn.getChildByName("lab");
            if (labNode) {
                // labNode.getComponent(cc.Label).string = state ? "已申请" : "申请";
                labNode.getComponent(cc.Label).string = gdk.i18n.t("i18n:FRIEND_TIP2");
                // labNode.getComponent(cc.LabelOutline).color = state ? cc.color("#0F5100") : cc.color("#0F5100");
            }
        }
    }

    /**更新在线状态 */
    _updateOnlineState() {
        let offTime = this.roleInfo.logoutTime * 1000
        if (offTime == 0) {
            this.timeLab.string = gdk.i18n.t("i18n:FRIEND_TIP3")
            this.timeLab.node.color = cc.color("#7AED74")
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
                text = StringUtils.format(gdk.i18n.t("i18n:FRIEND_TIP5"), hour)//`离线${hour}时`
            } else if (min >= 0) {
                min = Math.max(min, 1)
                text = StringUtils.format(gdk.i18n.t("i18n:FRIEND_TIP6"), min)//`离线${min}分钟`
            }
            this.timeLab.string = text
            this.timeLab.node.color = cc.color("#b64637")
        }
    }

    /**更新礼物状态 */
    _updateGiftState() {
        let ship = this.info.friendship
        let had = (ship & 4) > 0    // 是否有礼物可领
        let get = (ship & 2) > 0    // 礼物是否已领
        let give = (ship & 1) > 0   // 是否已赠送礼物
        if (!had || get) {
            this.sendBtn.active = !give
            this.getBtn.active = false
            this.sendImg.active = give
        } else {
            this.sendImg.active = false
            this.sendBtn.active = false
            this.getBtn.active = true
        }
    }

    _itemSelect() {
        if (this.friendModel.checkSelect) return
        this.selectIcon.active = this.ifSelect
    }

    /**添加好友 */
    addFunc() {
        if (FriendUtil.getFriendDailyLimits()[0] >= this.friendModel.maxPost) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FRIEND_TIP7"))
            return;
        }
        let msg = new icmsg.FriendRequestReq()
        msg.playerId = this.roleInfo.id
        NetManager.send(msg)
    }

    /**赠送礼物 */
    sendFunc() {
        if (this.friendModel.friendShipSendList.length >= this.friendModel.maxSendFriendShip) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FRIEND_TIP8"))
            return;
        }
        let msg = new icmsg.FriendGiveReq()
        msg.playerId = this.roleInfo.id
        NetManager.send(msg)
    }

    /**领取礼物 */
    getFunc() {
        if (this.friendModel.friendShipGetList.length >= this.friendModel.maxFriend) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FRIEND_TIP9"))
            return;
        }
        let msg = new icmsg.FriendTakeReq()
        msg.playerId = this.roleInfo.id
        NetManager.send(msg)
    }

    /**同意 */
    agreeFunc() {
        if (FriendUtil.getFriendDailyLimits()[1] >= this.friendModel.maxAdd) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FRIEND_TIP10"))
            return;
        }
        let msg = new icmsg.FriendBecomeReq()
        msg.playerId = this.roleInfo.id
        NetManager.send(msg)
    }

    /**拒绝 */
    refuseFunc() {
        let msg = new icmsg.FriendRefuseReq()
        msg.playerId = this.roleInfo.id
        NetManager.send(msg)
    }

    _itemClick() {
        if (this.friendModel.checkSelect) return
        let data = this.roleInfo;
        if (this.info.utype == 0) {
            let btns = [0, 1, 3]
            //非普通成员可 发出 公会邀请
            if (this.roleModel.guildTitle != 0 && data.guildId == 0) {
                btns.push(10)
            }
            GlobalUtil.openBtnMenu(this.node, btns, {
                id: data.id,
                name: data.name,
                headId: data.head,
                headBgId: data.headFrame,
                level: data.level,
            })
        } else if (this.info.utype == 2 || this.info.utype == 4) {
            let btns = [0, 1, 2, 4]

            //非普通成员可 发出 公会邀请
            if (this.info.utype == 2 && this.roleModel.guildTitle != 0 && data.guildId == 0) {
                btns.push(10)
            }

            GlobalUtil.openBtnMenu(this.node, btns, {
                id: data.id,
                name: data.name,
                headId: data.head,
                headBgId: data.headFrame,
                level: data.level,
            })
        } else if (this.info.utype == 1) {
            let btns = [0, 1, 4]
            //非普通成员可 发出 公会邀请
            if (this.roleModel.guildTitle != 0 && data.guildId == 0) {
                btns.push(10)
            }
            GlobalUtil.openBtnMenu(this.node, btns, {
                id: data.id,
                name: data.name,
                headId: data.head,
                headBgId: data.headFrame,
                level: data.level,
            })
        }

    }


    onSelectCheckFun() {
        let infos = this.friendModel.friendInfos
        for (let i = 0; i < infos.length; i++) {
            if (infos[i].roleInfo.id == this.info.roleInfo.id) {
                infos[i].isCheckSelect = !infos[i].isCheckSelect

                this._isSelect = infos[i].isCheckSelect
                let yes = cc.find("sub_yes", this.selectBtn)
                yes.active = this._isSelect

                let index = this.friendModel.selectIds.indexOf(this.info.roleInfo.id)
                if (this._isSelect) {
                    if (index == -1) {
                        this.friendModel.selectIds.push(this.info.roleInfo.id)
                    }
                } else {
                    if (index != -1) {
                        this.friendModel.selectIds.splice(index, 1)
                    }
                }
                break
            }
        }

    }
}
