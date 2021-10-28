import { ListView } from './BUiListview';

/**
 * @Description: UiListItem对应的子项子类
 * @Author: weiliang.huang
 * @Date: 2019-03-25 14:42:33
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-17 18:40:58
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class BUiListItem extends cc.Component {

    ifSelect: boolean = false
    list: ListView;
    data: any;
    curIndex: number;

    setData(list: ListView, index: number, data: any) {
        this.node.on(cc.Node.EventType.TOUCH_END, this._listItemClick, this)
        this.list = list;
        this.data = data;
        this.curIndex = index;
        this.updateView(index);
    }

    /** 刷新子项 */
    updateView(index: number) {

    }

    updateIndex(index: number) {
        this.curIndex = index;
    }

    /** 子项选中 */
    itemSelect(b: boolean = false) {
        this.ifSelect = b;
        this._itemSelect();
    }

    /** 物品清除 */
    recycleItem() {
        this.node.off(cc.Node.EventType.TOUCH_END, this._listItemClick, this);
    }

    _listItemClick() {
        if (this.list) {
            this.list.select_item(this.curIndex);
        }
        this._itemClick();
    }

    /** 子项点击 */
    _itemClick() {

    }

    /** 子项选中 */
    _itemSelect() {

    }
}