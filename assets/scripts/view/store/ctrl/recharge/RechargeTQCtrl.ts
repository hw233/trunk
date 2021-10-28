import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import TaskModel from '../../../task/model/TaskModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Store_monthcardCfg, TipsCfg } from '../../../../a/config';
import { StoreEventId } from '../../enum/StoreEventId';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-11-10 15:45:23
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/recharge/RechargeTQCtrl")
export default class RechargeTQCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Label)
    desLab: cc.Label = null;

    list: ListView;

    onEnable() {
        gdk.e.on(StoreEventId.UPDATE_MONTHCARD_RECEIVE, this._refreshViewInfo, this);
        this.desLab.string = ConfigManager.getItemById(TipsCfg, 36).desc21
        this._initTabList()
    }

    onDisable() {
        ModelManager.get(TaskModel).tavernGuideId = null;
        gdk.e.targetOff(this)
    }

    _initTabList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                async: true,
                gap_y: 10,
                direction: ListViewDir.Vertical,
            })
        }

        let cfgs = ConfigManager.getItemsByField(Store_monthcardCfg, "show", 1)
        GlobalUtil.sortArray(cfgs, (a, b) => {
            return a.sorting - b.sorting
        })
        this.list.set_data(cfgs)
    }

    _refreshViewInfo() {
        this.list.refresh_items()
    }
}