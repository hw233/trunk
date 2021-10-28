import { FriendEventId } from '../enum/FriendEventId';
import { FriendType } from '../model/FriendModel';
/** 
 * @Description: 好友信息面板
 * @Author: weiliang.huang  
 * @Date: 2019-03-27 10:25:45 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-23 17:34:32
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/friend/FriendInfoCtrl")
export default class FriendInfoCtrl extends gdk.BasePanel {

    @property(cc.Label)
    nameLab: cc.Label = null;
    @property(cc.Label)
    fightLab: cc.Label = null;
    @property(cc.Label)
    lvLab: cc.Label = null;
    @property(cc.Label)
    vipLab: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null

    @property(cc.Node)
    infoPanel: cc.Node = null

    @property(cc.Node)
    delPanel: cc.Node = null

    info: FriendType = null

    start() {
        this.delPanel.active = false
    }

    initFriendInfo(info: FriendType) {
        this.infoPanel.active = true
        this.delPanel.active = false
        this.info = info
        this.nameLab.string = info.name
        this.lvLab.string = `LV${info.lv}`
        this.vipLab.string = `V${info.vipLv}`
        this.fightLab.string = `${gdk.i18n.t("i18n:FRIEND_TIP1")}${info.fightNum}`
    }

    /**查看属性 */
    infoFunc() {
        // console.log("查看属性")
    }

    /**删除好友 */
    deleteFriend() {
        // console.log("删除好友")
        this.infoPanel.active = false
        this.delPanel.active = true
    }

    cancelFunc() {
        this.infoPanel.active = true
        this.delPanel.active = false
    }

    sureFunc() {
        this.close()
        gdk.e.emit(FriendEventId.DELETE_FRIEND, this.info)
    }
}
