import { BagItem, BagType } from '../../../../../common/models/BagModel';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';

/**
 * @Description: 装备面板控制
 * @Author: chengyou.lin
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-03-12 21:29:35
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/equip/common/EquipBagCtrl2")
export default class EquipBagCtrl2 extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    materialItemPre: cc.Prefab = null;

    list: ListView = null;
    onClick: gdk.EventTrigger = null;

    columnNum: number = 5;
    datas: any = null;

    private _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.materialItemPre,
            cb_host: this,
            async: true,
            column: this.columnNum,
            gap_x: 14,
            gap_y: 14,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._clickItem, this)
    }

    onLoad() {
        this.onClick = gdk.EventTrigger.get();
        this.scrollView.node.on(cc.Node.EventType.SIZE_CHANGED, () => {
            this.reloadList();
        });
    }

    reloadList() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        if (this.datas) {
            this.updateData(this.datas);
        }
    }

    selectItem(idx: number) {
        if (this.list && this.list.datas.length > 0) {
            this.list.select_item(idx);
        }
    }

    onDestroy() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    private _clickItem(data, index, preData, preIndex) {
        if (this.onClick) {
            let node = this.list['_items'][index];
            this.onClick.emit(data, index, node);
        }
    }

    updateData(_datas) {
        this.datas = _datas;
        let rowNum = Math.ceil(this.scrollView.node.height / 120);
        //空格填充
        let datas = _datas.concat();
        let len = datas.length;
        let row = Math.ceil(len / this.columnNum);
        if (row < rowNum) {
            row = rowNum;
        }
        let maxNum = row * this.columnNum;
        let emptyItem: BagItem = { series: 0, itemId: 0, itemNum: 0, type: BagType.ITEM, extInfo: null };
        let data = { bagItem: emptyItem };
        for (let i = datas.length; i < maxNum; i++) {
            datas.push(data);
        }
        this._initListView();
        this.list.clear_items();
        this.list.set_data(datas);
    }
}
