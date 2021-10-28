import BYModel from '../../../bingying/model/BYModel';
import ModelManager from '../../../../common/managers/ModelManager';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/upgrade/UpgradeBarrackCtrl")
export default class UpgradeBarrackCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    barrackItem: cc.Prefab = null

    list: ListView = null;

    get model(): BYModel { return ModelManager.get(BYModel); }

    onEnable() {
        this._updateView()
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    onDestroy() {

    }

    _updateView() {
        let ids = [1, 3, 4]
        this._initListView()
        this.list.set_data(ids)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.barrackItem,
            cb_host: this,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }
}