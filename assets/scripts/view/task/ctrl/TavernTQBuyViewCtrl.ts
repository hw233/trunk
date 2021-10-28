import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Store_monthcardCfg } from '../../../a/config';
import { StoreEventId } from '../../store/enum/StoreEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-08 20:48:40 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/TavernTQBuyViewCtrl")
export default class TavernTQBuyViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    onEnable() {
        gdk.e.on(StoreEventId.UPDATE_MONTHCARD_RECEIVE, this._refreshViewInfo, this);
        // this.desLab.string = ConfigManager.getItemById(TipsCfg, 36).desc21
        this._initTabList()
    }

    onDisable() {
        // ModelManager.get(TaskModel).tavernGuideId = null;
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
                gap_y: 15,
                direction: ListViewDir.Vertical,
            })
        }

        let cfgs = ConfigManager.getItemsByField(Store_monthcardCfg, "show", 1)
        GlobalUtil.sortArray(cfgs, (a, b) => {
            return a.sorting - b.sorting
        })
        cfgs = cfgs.slice(1);
        this.list.set_data(cfgs)
    }

    _refreshViewInfo() {
        this.list.refresh_items()
    }
}
