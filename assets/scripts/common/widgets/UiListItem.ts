import { ListView } from './UiListview';

/**
 * @Description: UiListItem对应的子项子类
 * @Author: weiliang.huang
 * @Date: 2019-03-25 14:42:33
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-18 14:24:06
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class UiListItem extends cc.Component {

    ifSelect: boolean = false
    list: ListView;
    data: any;
    curIndex: number;
    cancelClick: boolean = false;

    setData(list: ListView, index: number, data: any) {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
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
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
    }

    _onTouchStart() {
        this.cancelClick = false;
        gdk.Timer.once(300, this, () => {
            this.cancelClick = true;
            this._itemLongPress();
        });
    }

    _listItemClick() {
        if (this.cancelClick) return;
        gdk.Timer.clearAll(this);
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

    /** 子项长按 */
    _itemLongPress() {

    }
}