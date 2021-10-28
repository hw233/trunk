import BUiListItem from './BUiListItem';

export enum ListViewDir {
    Vertical = 1,
    Horizontal = 2,
};

//item及父节点锚点都为(0,1)
class LayoutUtil {
    static vertical_layout(index: number, item_width: number, item_height: number, column: number = 1, gap_x: number = 0, gap_y: number = 0): [number, number] {
        let x: number = (index % column) * (item_width + gap_x);
        let y: number = -Math.floor(index / column) * (item_height + gap_y);
        return [x, y];
    }

    static horizontal_layout(index: number, item_width: number, item_height: number, row: number = 1, gap_x: number = 0, gap_y: number = 0): [number, number] {
        let x: number = Math.floor(index / row) * (item_width + gap_x);
        let y: number = -(index % row) * (item_height + gap_y);
        return [x, y];
    }
}

interface ListViewParams {
    scrollview: cc.ScrollView;
    mask: cc.Node;
    content: cc.Node;
    item_tpl: cc.Prefab;
    direction?: ListViewDir;
    width?: number;
    height?: number;
    gap_x?: number;
    gap_y?: number;
    row?: number;                                                                       //水平方向排版时，垂直方向上的行数
    column?: number;                                                                    //垂直方向排版时，水平方向上的列数
    cb_host?: any;                                                                      //回调函数host
    auto_scrolling?: boolean;                                                           //append时自动滚动到尽头
    async?: boolean;                                                                    //是否开启异步加载
    resize_cb?: () => void;                                                             //尺寸改变时回调
    select_cb?: (data: any, index: number, pre_data?: any, pre_index?: number) => void; //item选中回调
    scroll_to_end_cb?: () => void;                                                      //滚动到尽头的回调
};

interface ListItem {
    x: number;
    y: number;
    node: cc.Node;
    is_select: boolean;
};

export class ListView {
    private scrollview: cc.ScrollView;
    private mask: cc.Node;
    private content: cc.Node;
    private item_tpl: cc.Prefab;

    private dir: number;
    private width: number;
    private height: number;
    private gap_x: number;
    private gap_y: number;
    private row: number;
    private col: number;
    private item_width: number;
    private item_height: number;
    private async: boolean = false;
    private cb_host: any;
    private auto_scrolling: boolean;
    private node_pool: cc.Node[];
    private start_index: number;
    private stop_index: number;
    private _datas: any[];
    private _items: ListItem[];
    private _selected_index: number = -1;

    private resize_cb: () => void;
    private select_cb: (data: any, index: number, pre_data?: any, pre_index?: number) => void;
    private scroll_to_end_cb: () => void;

    onClick: gdk.EventTrigger;

    constructor(params: ListViewParams) {
        this.onClick = gdk.EventTrigger.get();
        this.scrollview = params.scrollview;
        this.mask = params.mask;
        this.content = params.content;
        this.item_tpl = params.item_tpl;
        this.async = params.async || false;
        this.item_width = this.item_tpl.data.width;
        this.item_height = this.item_tpl.data.height;
        this.dir = params.direction || ListViewDir.Vertical;
        this.width = params.width || 0;
        this.height = params.height || 0;

        this.gap_x = params.gap_x || 0;
        this.gap_y = params.gap_y || 0;
        this.row = params.row || 1;
        this.col = params.column || 1;
        this.cb_host = params.cb_host;
        this.resize_cb = params.resize_cb;
        this.select_cb = params.select_cb;
        this.scroll_to_end_cb = params.scroll_to_end_cb;
        this.auto_scrolling = params.auto_scrolling || false;
        this._items = [];
        this.node_pool = [];
        // 遮罩
        if (this.mask) {
            this.mask.on(cc.Node.EventType.SIZE_CHANGED, this.on_mask_size_change, this);
        }
        this.on_mask_size_change();
        // 滚动条
        if (this.scrollview) {
            this.scrollview.vertical = this.dir == ListViewDir.Vertical;
            this.scrollview.horizontal = this.dir == ListViewDir.Horizontal;
            this.scrollview.inertia = true;
            this.scrollview.node.on("scrolling", this.on_scrolling, this);
            this.scrollview.node.on("scroll-to-bottom", this.on_scroll_to_end, this);
            this.scrollview.node.on("scroll-to-right", this.on_scroll_to_end, this);
        }
    }

    private on_mask_size_change() {
        // 遮罩
        if (this.mask) {
            this.width = this.mask.width;
            this.height = this.mask.height;
            this.mask.setContentSize(this.width, this.height);
        }
        // 垂直
        if (this.dir == ListViewDir.Vertical) {
            let real_width: number = (this.item_width + this.gap_x) * Math.ceil(this.col) - this.gap_x;
            if (real_width > this.width) {
                this.width = real_width;
            }
            this.content.width = this.width;
        } else {
            let real_height: number = (this.item_height + this.gap_y) * Math.ceil(this.row) - this.gap_y;
            if (real_height > this.height) {
                this.height = real_height;
            }
            this.content.height = this.height;
        }
        // 滚动条
        if (this.scrollview) {
            this.scrollview.node.setContentSize(this.width, this.height);
        }
        // 刷新内容
        this.on_scrolling();
        this.resize_cb && this.resize_cb.call(this.cb_host);
    }

    private on_scroll_to_end() {
        if (this.scroll_to_end_cb) {
            this.scroll_to_end_cb.call(this.cb_host);
        }
    }

    private on_scrolling(scroll: cc.ScrollView = null, needSync: boolean = false) {
        if (!this._items || !this._items.length) {
            return;
        }
        if (!scroll) {
            this.scrollview.stopAutoScroll();
        }
        if (this.dir == ListViewDir.Vertical) {
            let posy: number = this.content.y;
            // cc.info("onscrolling, content posy=", posy);
            if (posy < 0) {
                posy = 0;
            }
            if (posy > this.content.height - this.height) {
                posy = this.content.height - this.height;
            }
            let start: number = 0;
            let stop: number = this._items.length - 1;
            let viewport_start: number = -posy;
            let viewport_stop: number = viewport_start - this.height;
            while (this._items[start].y - this.item_height > viewport_start) {
                start++;
            }
            while (this._items[stop].y < viewport_stop) {
                stop--;
            }
            if (start != this.start_index || stop != this.stop_index) {
                this.start_index = Math.max(start, 0)
                this.stop_index = stop;
                this.render_items(needSync);
            }
        } else {
            let posx: number = this.content.x;
            if (posx > 0) {
                posx = 0;
            }
            if (posx < this.width - this.content.width) {
                posx = this.width - this.content.width;
            }
            let start: number = 0;
            let stop: number = this._items.length - 1;
            let viewport_start: number = -posx;
            let viewport_stop: number = viewport_start + this.width;
            while (this._items[start].x + this.item_width < viewport_start) {
                start++;
            }
            while (this._items[stop].x > viewport_stop) {
                stop--;
            }
            if (start != this.start_index || stop != this.stop_index) {
                this.start_index = Math.max(start - this.row, 0)
                this.stop_index = stop;
                this.render_items(needSync);
            }
        }
    }

    private inner_select_item(index: number, is_select: boolean) {
        let item: ListItem = this._items[index];
        if (!item) {
            cc.warn("inner_select_item index is out of range{", 0, this._items.length - 1, "}", index);
            return;
        }
        item.is_select = is_select;
        if (item.node) {
            this.selectItem(item.node, is_select)
        }
        if (is_select) {
            let pre_index = this._selected_index;
            this._selected_index = index;
            if (this.select_cb) {
                this.select_cb.call(this.cb_host, this._datas[index], index, this._datas[pre_index], pre_index);
            }
        } else {
            this._selected_index = -1;
        }
    }

    private spawn_node(index: number): cc.Node {
        let node: cc.Node = this.node_pool.pop();
        if (!node) {
            node = cc.instantiate(this.item_tpl);
            node.active = true;
        }
        node.parent = this.content;
        node.zIndex = 99;
        return node;
    }

    private recycle_item(item: ListItem) {
        if (!item.node) return;
        if (!cc.isValid(item.node)) return;
        this._recycleItem(item.node);
        this.node_pool.push(item.node);
        item.node.removeFromParent(false);
        item.node = null;
    }

    private render_items(needSync: boolean = false) {
        let item: ListItem;
        for (let i: number = 0; i < this.start_index; i++) {
            item = this._items[i];
            if (item.node) {
                // cc.info("recycle_item", i);
                this.recycle_item(item);
            }
        }
        for (let i: number = this._items.length - 1; i > this.stop_index; i--) {
            item = this._items[i];
            if (item.node) {
                // cc.info("recycle_item", i);
                this.recycle_item(item);
            }
        }
        this._appendItems(needSync);
    }

    /** 只有在set_datas时,根据需要进行异步操作 */
    private _appendItems(needSync: boolean = false) {
        if (this.async && needSync) {
            this.scrollview.unscheduleAllCallbacks();
            let i = this.start_index;
            this.scrollview.schedule(() => {
                if (i > this.stop_index) {
                    this.scrollview.unscheduleAllCallbacks();
                    return;
                }
                let n = Math.min(i + 3, this.stop_index);
                for (; i <= n; i++) {
                    this._updateItem(i);
                }
            }, 0);
        } else {
            for (let i = this.start_index; i <= this.stop_index; i++) {
                this._updateItem(i);
            }
        }
    }

    private _updateItem(index: number) {
        let item: ListItem = this._items[index];
        if (!item.node) {
            item.node = this.spawn_node(index);
            this._itemSetter(item.node, index);
            this.selectItem(item.node, item.is_select);
        } else {
            this._updateIndex(item.node, index);
        }
        item.node.setPosition(item.x, item.y);
    }

    private pack_item(): ListItem {
        return { x: 0, y: 0, node: null, is_select: false };
    }

    //item具体赋值
    private _itemSetter(node: cc.Node, index: number) {
        let comp: BUiListItem = node.getComponent(cc.Component) as BUiListItem;
        if (comp.setData) {
            comp.setData(this, index, this._datas[index]);
        }
    }

    //更新item下标
    private _updateIndex(node: cc.Node, index: number) {
        let comp: BUiListItem = node.getComponent(cc.Component) as BUiListItem;
        if (comp.updateIndex) {
            comp.updateIndex(index);
        }
    }

    //item回收
    private _recycleItem(item: cc.Node) {
        let comp: BUiListItem = item.getComponent(cc.Component) as BUiListItem;
        if (comp.recycleItem) {
            comp.recycleItem();
        }
    }

    //item选中
    private selectItem(item: cc.Node, ifSelect: boolean) {
        let comp: BUiListItem = item.getComponent(cc.Component) as BUiListItem;
        if (comp.itemSelect) {
            comp.itemSelect(ifSelect);
        }
    }

    private layout_items(start: number) {
        for (let i = start, n = this._items.length; i < n; i++) {
            let item: ListItem = this._items[i];
            if (item) {
                if (this.dir == ListViewDir.Vertical) {
                    [item.x, item.y] = LayoutUtil.vertical_layout(i, this.item_width, this.item_height, this.col, this.gap_x, this.gap_y);
                }
                else {
                    [item.x, item.y] = LayoutUtil.horizontal_layout(i, this.item_width, this.item_height, this.row, this.gap_x, this.gap_y);
                }
            }
        }
    }

    public updateItemSize(w: number, h: number) {
        this.item_width = w;
        this.item_height = h;
    }

    public resize_content() {
        if (this._items.length <= 0) {
            this.content.width = 0;
            this.content.height = 0;
            return;
        }
        let last_item: ListItem = this._items[this._items.length - 1];
        if (this.dir == ListViewDir.Vertical) {
            this.content.height = Math.max(this.height, this.item_height - last_item.y);
        }
        else {
            this.content.width = Math.max(this.width, last_item.x + this.item_width);
        }
    }

    /**
     * 清除所有项
     */
    clear_items() {
        this._selected_index = -1
        this._items.forEach((item) => {
            this.recycle_item(item);
        });
        this._items.length = 0;
        this.resize_content();
        this.start_index = -1;
        this.stop_index = -1;
        this.on_scrolling();
    }

    select_item(index: number) {
        if (this._items[index]) {
            let pre_index = this._selected_index;
            this.onClick.emit(this._datas[index], index, this._datas[pre_index], pre_index);
        }
        if (index == this._selected_index) {
            return;
        }
        if (this._selected_index != -1) {
            this.inner_select_item(this._selected_index, false);
        }
        this.inner_select_item(index, true);
    }

    clear_select() {
        if (this._selected_index != -1) {
            this.inner_select_item(this._selected_index, false);
        }
    }

    /**
     * 刷新listView
     * @param datas 子项数据
     * @param resetPos 是否需要重置content位置
     */
    set_data(datas: any[], resetPos: boolean = true) {
        // this.clear_items();
        this._datas = datas;
        // 当前已有显示项的情况下，则按需更新或回收
        let newLen = this._datas.length;
        let oldLen = this._items.length;
        if (newLen < oldLen) {
            // 清除多余项
            for (let i = newLen; i < oldLen; i++) {
                this.recycle_item(this._items[i]);
            }
            this._items.length = newLen;
        } else {
            // 创建不够的项
            for (let i = oldLen; i < newLen; i++) {
                this._items.push(this.pack_item());
            }
        }
        this.layout_items(0);
        this.resize_content();
        this.start_index = -1;
        this.stop_index = -1;
        if (resetPos) {
            if (this.dir == ListViewDir.Vertical) {
                this.content.y = 0;
            }
            else {
                this.content.x = 0;
            }
        }
        if (newLen > 0) {
            this.on_scrolling(null, true);
            if (oldLen > 0) {
                this.refresh_items();
            }
        }
    }

    insert_data(index: number, ...datas: any[]) {
        if (datas.length == 0) {
            // cc.info("nothing to insert");
            return;
        }
        if (!this._datas) {
            this.set_data(datas);
            return;
        }
        if (index < 0 || index > this._items.length) {
            cc.warn("invalid index", index);
            return;
        }
        let is_append: boolean = index == this._items.length;
        let items: ListItem[] = [];
        for (let i = 0, n = datas.length; i < n; i++) {
            let item: ListItem = this.pack_item();
            items.push(item);
        }
        this._datas.splice(index, 0, ...datas);
        this._items.splice(index, 0, ...items);
        this.layout_items(index - 1);
        this.resize_content();
        this.start_index = -1;
        this.stop_index = -1;
        if (this.auto_scrolling && is_append) {
            this.scroll_to_end();
        }
        this.on_scrolling();
        if (this._selected_index >= index) {
            this.select_item(this._selected_index + 1);
        }
    }

    remove_data(index: number, count: number = 1) {
        if (!this._datas) {
            // cc.info("call set_data before call this method");
            return;
        }
        if (index < 0 || index >= this._items.length) {
            cc.warn("invalid index", index);
            return;
        }
        if (count < 1) {
            // cc.info("nothing to remove");
            return;
        }
        if (this._selected_index == index) {
            this._selected_index = -1
        }
        let old_length: number = this._items.length;
        let del_items: ListItem[] = this._items.splice(index, count);
        this._datas.splice(index, count);
        //回收node
        del_items.forEach((item) => {
            this.recycle_item(item);
        });
        //重新排序index后面的
        if (index + count < old_length) {
            this.layout_items(index);
        }
        this.resize_content();
        if (this._items.length > 0) {
            this.start_index = -1;
            this.stop_index = -1;
            this.on_scrolling();
            if (this._selected_index > index) {
                this.select_item(this._selected_index - count)
            }
        }
    }

    append_data(...datas: any[]) {
        this.insert_data(this._items.length, ...datas);
    }

    scroll_to(index: number) {
        if (this.dir == ListViewDir.Vertical) {
            const min_y = this.height - this.content.height;
            if (min_y >= 0) {
                // cc.info("no need to scroll");
                return;
            }
            let [_, y] = LayoutUtil.vertical_layout(index, this.item_width, this.item_height, this.col, this.gap_x, this.gap_y);
            if (y < min_y) {
                y = min_y;
                // cc.info("content reach bottom");
            }
            if (y > 0) {
                y = 0;
                // cc.info("content reach top");
            }
            this.scrollview.setContentPosition(cc.v2(this.content.x, -y));
            this.on_scrolling();
        }
        else {
            const max_x = this.content.width - this.width;
            if (max_x <= 0) {
                // cc.info("no need to scroll");
                return;
            }
            let [x, _] = LayoutUtil.horizontal_layout(index, this.item_width, this.item_height, this.row, this.gap_x, this.gap_y);
            if (x > max_x) {
                x = max_x;
                // cc.info("content reach right");
            }
            if (x < 0) {
                x = 0;
                // cc.info("content reach left");
            }
            this.scrollview.setContentPosition(cc.v2(-x, this.content.y));
            this.on_scrolling();
        }
    }

    scroll_to_end() {
        if (this.dir == ListViewDir.Vertical) {
            this.scrollview.scrollToBottom();
        }
        else {
            this.scrollview.scrollToRight();
        }
    }

    refresh_item(index: number, data?: any) {
        if (!this._datas) {
            // cc.info("call set_data before call this method");
            return;
        }
        if (index < 0 || index >= this._items.length) {
            cc.warn("invalid index", index);
            return;
        }
        if (data !== void 0) {
            this._datas[index] = data;
        }
        let item: ListItem = this._items[index];
        if (item && item.node) {
            this._itemSetter(item.node, index);
        }
    }

    /** 刷新可见项 */
    refresh_items() {
        for (let i: number = this.start_index; i <= this.stop_index; i++) {
            let item: ListItem = this._items[i];
            if (item.node) {
                this._itemSetter(item.node, i);
            }
        }
    }

    destroy() {
        this.onClick && this.onClick.release();
        this.onClick = null;
        if (this.mask) {
            this.mask.targetOff(this);
            this.mask = null;
        }
        if (this.scrollview) {
            this.scrollview.unscheduleAllCallbacks();
            if (cc.isValid(this.scrollview.node)) {
                this.scrollview.node.targetOff(this);
            }
            this.scrollview = null;
        }
        this.clear_items();
        this.node_pool.forEach(node => {
            node.destroy();
        });
        this.node_pool = null;
        this._items = null;
        this._datas = null;
    }

    get items() {
        return this._items;
    }

    get datas() {
        return this._datas;
    }

    get selected_index() {
        return this._selected_index;
    }

    get selectd_data() {
        if (this._datas) {
            return this._datas[this._selected_index];
        }
        return null;
    }
}
