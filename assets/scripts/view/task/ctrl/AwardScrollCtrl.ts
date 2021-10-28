import { AwardInfo } from '../model/TaskModel';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
 * @Description: 奖励项滑动条(横向)
 * @Author: weiliang.huang  
 * @Date: 2019-03-25 17:25:47 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-09-17 17:35:51
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/AwardScrollCtrl")
export default class AwardScrollCtrl extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    awardItem: cc.Prefab = null

    private list: ListView = null;

    onDestroy() {
        if (this.list) {
            this.list.destroy()
        }

    }

    /**初始化奖励信息 */
    initAwardInfos(awards: Array<AwardInfo> = [], width: number = 0, height: number = 0) {
        if (awards.length <= 0) {
            this.node.active = false;
            return;
        }
        this.node.active = true;
        if (width > 0) {
            this.node.width = width
        }
        if (height > 0) {
            this.node.height = height
        }
        this.initListView(10)
        this.list.clear_items()
        this.list.set_data(awards)
    }

    clearItems() {
        if (this.list) {
            this.list.clear_items()
        }
    }

    /**在initAwardInfos之前调用,用于自己控制间隔 */
    initListView(gapX: number = 0) {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.awardItem,
            select_cb: this._selectItem,
            cb_host: this,
            column: 1,
            gap_x: gapX,
            direction: ListViewDir.Horizontal,
        })
    }

    _selectItem(data: AwardInfo, index) {
    }
}
