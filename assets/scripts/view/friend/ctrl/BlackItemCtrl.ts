import FriendModel, { FriendType } from '../model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import ServerModel from '../../../common/models/ServerModel';
import UiListItem from '../../../common/widgets/UiListItem';
import { IncomingMessage } from 'http';

/** 
 * @Description: 屏蔽列表子项
 * @Author: weiliang.huang  
 * @Date: 2019-03-26 19:37:24 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 11:43:45
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/friend/BlackItemCtrl")
export default class BlackItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    fightLab: cc.Label = null;

    // @property(cc.Label)
    // timeLab: cc.Label = null;

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
        this.lvLab.string = `.${this.roleInfo.level}`
        this.fightLab.string = `${this.roleInfo.power}`
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getHeadIconById(this.roleInfo.head));
        GlobalUtil.setSpriteIcon(this.node, this.iconFrame, GlobalUtil.getHeadFrameById(this.roleInfo.headFrame));
        this._updateOnlineState()
    }

    /**更新在线状态 */
    _updateOnlineState() {
        let offTime = this.roleInfo.logoutTime * 1000
        // if (offTime == 0) {
        //     this.timeLab.string = "在线"
        //     this.timeLab.node.color = cc.color("#488b00")
        // } else {
        //     let serverTime = this.model.serverTime
        //     // console.log(serverTime, offTime)
        //     let pasTime = Math.floor((serverTime - offTime) / 1000)
        //     let day = Math.floor(pasTime / 3600 / 24)
        //     let hour = Math.floor(pasTime / 3600)
        //     let min = Math.floor(pasTime / 60)
        //     let text = ""
        //     if (day > 0) {
        //         text = `离线${day}天`
        //     } else if (hour > 0) {
        //         text = `离线${hour}小时`
        //     } else if (min >= 0) {
        //         min = Math.max(min, 1)
        //         text = `离线${min}分钟`
        //     }
        //     this.timeLab.string = text
        //     this.timeLab.node.color = cc.color("#b64637")
        // }
    }

    _itemClick() {
        let data = this.roleInfo;
        // GlobalUtil.openBtnMenu(this.node, [1, 5], {
        //     id: data.id,
        //     name: data.name,
        //     headId: data.head,
        //     headBgId: data.headFrame,
        //     level: data.level,
        // })
        gdk.panel.setArgs(PanelId.MainSet, data.id)
        gdk.panel.open(PanelId.MainSet)
    }

    _itemSelect() {
        this.selectIcon.active = this.ifSelect
    }

    delBtnCliick() {
        let data = this.roleInfo;
        let msg = new icmsg.FriendBlacklistOutReq()
        msg.playerId = data.id
        NetManager.send(msg)
    }
}
