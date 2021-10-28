import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/**
 * @Description:增益遗物列表
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-02 10:20:38
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdventureEntryList2Ctrl")
export default class AdventureEntryList2Ctrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    entryItem: cc.Prefab = null

    list: ListView = null;

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    showType = 0;
    onEnable() {
        let arg = gdk.panel.getArgs(PanelId.AdventureEntryList2)
        if (arg) {
            this.showType = arg[0]
        }
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
        let datas = [];
        if (this.showType != 0) {
            this.adventureModel.normal_lastEntryList.forEach(element => {
                datas.push({ info: element, isSelect: false })
            });
        } else {
            if (this.adventureModel.copyType == 0) {
                this.adventureModel.normal_entryList.forEach(element => {
                    datas.push({ info: element, isSelect: false })
                });
            } else {
                this.adventureModel.endless_entryList.forEach(element => {
                    datas.push({ info: element, isSelect: false })
                });
            }
        }
        this.list.set_data(datas)

    }



}