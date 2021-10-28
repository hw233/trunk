import FriendModel, { FriendType } from '../model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { FriendEventId } from '../enum/FriendEventId';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/** 
  * @Description: 黑名单列表界面
  * @Author: weiliang.huang  
  * @Date: 2019-05-21 19:30:26 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 13:51:24
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/friend/BlackListCtrl")
export default class BlackListCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    blackItem: cc.Prefab = null

    // @property(cc.RichText)
    // numLabel: cc.RichText = null
    @property(cc.Node)
    tipsNode: cc.Node = null

    curList: Array<FriendType> = []
    list: ListView = null;  // 好友列表scroll

    onLoad() {
        gdk.e.on(FriendEventId.DELETE_BACKLIST, this._deleteItem, this)
    }

    onDestroy() {
        gdk.e.targetOff(this)
    }

    start() {

    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.blackItem,
            cb_host: this,
            async: true,
            column: 1,
            gap_y: 10,
            direction: ListViewDir.Vertical,
        })
    }

    /**更新列表 */
    @gdk.binding("model.backList")
    _updateScroll() {
        this._initListView()
        let model = ModelManager.get(FriendModel)
        let list = []
        let len = model.backList.length
        let onlineTab = []
        let offlineTab = []
        for (let index = 0; index < len; index++) {
            const element = model.backList[index];
            if (element.roleInfo.logoutTime == 0) {
                onlineTab.push(element)
            } else {
                offlineTab.push(element)
            }
        }
        GlobalUtil.sortArray(onlineTab, this._sortFunc)
        GlobalUtil.sortArray(offlineTab, this._sortFunc)
        list = [...onlineTab, ...offlineTab]
        this.curList = list
        this.list.set_data(list)
        //this.numLabel.string = "屏蔽数量:" + `<color=#b64637>${list.length}</c>/50`
        this.tipsNode.active = list.length == 0;
    }

    // 好友排序函数
    _sortFunc(a: FriendType, b: FriendType) {
        if (a.roleInfo.level == b.roleInfo.level) {
            return b.roleInfo.power - a.roleInfo.power
        } else {
            return b.roleInfo.level - a.roleInfo.level
        }
    }

    // update (dt) {}
    _deleteItem(e: gdk.Event) {
        let id: number = e.data
        for (let index = 0; index < this.curList.length; index++) {
            const element = this.curList[index];
            if (id.toLocaleString() == element.roleInfo.id.toLocaleString()) {
                this.list.remove_data(index)
                break
            }
        }
        //this.numLabel.string = "屏蔽数量:" + `<color=#b64637>${this.curList.length}</c>/50`
        if (this.list.datas.length == 0) {
            this.tipsNode.active = true;
        }
    }

    /**一键移除黑名单 */
    removeAllBlack() {
        for (let index = 0; index < this.curList.length; index++) {
            const info = this.curList[index];
            let msg = new icmsg.FriendBlacklistOutReq()
            msg.playerId = info.roleInfo.id
            NetManager.send(msg)
        }
    }
}
