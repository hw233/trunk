import AdventureModel from '../model/AdventureModel';
import ModelManager from '../../../common/managers/ModelManager';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/**
 * @Description:增益遗物列表
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-11-20 15:25:32
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdventureEntryListCtrl")
export default class AdventureEntryListCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    entryItem: cc.Prefab = null

    list: ListView = null;

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }

    onEnable() {
        this._updateListView()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.entryItem,
            cb_host: this,
            async: true,
            column: 3,
            gap_x: 15,
            gap_y: 15,
            direction: ListViewDir.Vertical,
        })
    }

    _updateListView() {
        this._initListView()
        let datas = []
        this.adventureModel.entryList.forEach(element => {
            datas.push({ info: element, isSelect: false })
        });
        this.list.set_data(datas)
    }
}