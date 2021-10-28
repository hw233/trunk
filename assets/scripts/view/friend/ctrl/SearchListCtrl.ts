import FriendModel, { FriendType } from '../model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import { FriendEventId } from '../enum/FriendEventId';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/** 
  * @Description: 搜索界面控制器
  * @Author: weiliang.huang  
  * @Date: 2019-05-21 19:30:10 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 11:46:50
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/friend/SearchListCtrl")
export default class SearchListCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    item: cc.Prefab = null

    curList: Array<FriendType> = []
    list: ListView = null;  // 好友列表scroll

    get model(): FriendModel { return ModelManager.get(FriendModel); }

    onLoad() {
        gdk.e.on(FriendEventId.UPDATE_RECOMMEND_STATE, this._updateRecommendState, this)
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
            item_tpl: this.item,
            cb_host: this,
            async: true,
            column: 1,
            gap_y: 10,
            direction: ListViewDir.Vertical,
        })
    }

    /**更新列表 */
    @gdk.binding("model.searchInfos")
    _updateScroll() {
        this._initListView()
        let list = []
        let model = this.model
        let len = model.searchInfos.length
        let onlineTab = []
        let offlineTab = []
        for (let index = 0; index < len; index++) {
            const element = model.searchInfos[index];
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
    }

    // 排序函数
    _sortFunc(a: FriendType, b: FriendType) {
        if (a.roleInfo.level == b.roleInfo.level) {
            return b.roleInfo.power - a.roleInfo.power
        } else {
            return b.roleInfo.level - a.roleInfo.level
        }
    }

    /**更新推荐列表状态 */
    _updateRecommendState(e: gdk.Event) {
        let id: number = e.data
        if (this.model.panelIndex != 2) {
            return
        }
        let pId = id.toLocaleString()
        for (let index = 0; index < this.curList.length; index++) {
            const element = this.curList[index];
            let eId = element.roleInfo.id.toLocaleString()
            if (eId == pId) {
                this.list.refresh_item(index, element)
                break
            }
        }
    }
}
