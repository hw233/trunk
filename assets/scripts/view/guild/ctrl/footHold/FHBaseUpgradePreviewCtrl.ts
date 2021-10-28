import ConfigManager from '../../../../common/managers/ConfigManager';
import { Foothold_baseCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-14 10:40:53 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHBaseUpgradePreviewCtrl")
export default class FHBaseUpgradePreviewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    onEnable() {
        this._updateList();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    _initList() {
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
    }

    _updateList() {
        this._initList();
        let datas = ConfigManager.getItems(Foothold_baseCfg);
        this.list.clear_items();
        this.list.set_data(datas);
    }
}
