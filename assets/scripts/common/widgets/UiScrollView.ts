/** 
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-22 18:04:32 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-06-28 15:50:32
 */

const { ccclass, property, menu, disallowMultiple } = cc._decorator;

const POOL_PREFIX: string = "__UiScrollView_ITEM__";

class ViewItem {
    x: number = 0;
    y: number = 0;
    width: number;
    height: number;
    data: any;
    node: cc.Node;
};

@ccclass
@disallowMultiple
@menu("qszc/common/widgets/UiScrollView")
export default class UiScrollView extends cc.Component {

    @property(cc.Node)
    uiScrollView: cc.Node = null;
    @property(cc.Prefab)
    itemsArr: cc.Prefab = null;
    @property(cc.Boolean)
    Vertical: boolean = false;
    //间距
    @property(cc.Float)
    gap_x: number = 0;
    @property(cc.Float)
    gap_y: number = 0;

    private scrView: cc.ScrollView;
    private content: cc.Node;
    private height: number;
    private width: number;
    private items: ViewItem[];
    private start_index: number;
    private stop_index: number;
    private pools: object = {};

    //初始化
    init() {
        this.scrView = this.uiScrollView.getComponent(cc.ScrollView);
        this.content = this.scrView.content;
        this.height = this.content.height;
        this.width = this.content.width;
        //存储item的map
        // this.item_templates = new Map();
        // this.itemsArr.data.active = false
        //uiScrollView监听事件
        this.uiScrollView.on('scrolling', this.on_scrolling, this);
    }
    //滑动中回调
    on_scrolling() {
        if (!this.items || !this.items.length) {
            return;
        }
        //垂直滚动
        if (this.Vertical) {
            let posy = this.content.y;
            if (posy < 0) {
                posy = 0;
            }
            if (posy > this.content.height - this.height) {
                posy = this.content.height - this.height;
            }
            let start = 0;
            let stop = this.items.length - 1;
            let viewport_start = -posy;
            let viewport_stop = viewport_start - this.height;
            while (this.items[start].y - this.items[start].height > viewport_start) {
                start++;
            }
            while (this.items[stop].y < viewport_stop) {
                stop--;
            }

            if (start != this.start_index && stop != this.stop_index) {
                this.start_index = start - 1;
                this.stop_index = stop;
                this.render_items();
            }
        } else { //水平滚动
            let posx = this.content.x;
            if (posx > 0) {
                posx = 0;
            }
            if (posx < this.width - this.content.width) {
                posx = this.width - this.content.width;
            }
            let start = 0;
            let stop = this.items.length - 1;
            let viewport_start = -posx;
            let viewport_stop = viewport_start + this.width;
            while (this.items[start].x + this.items[start].width < viewport_start) {
                start++;
            }
            while (this.items[stop].x > viewport_stop) {
                stop--;
            }
            if (start != this.start_index && stop != this.stop_index) {
                this.start_index = start - 1;
                this.stop_index = stop;
                this.render_items();
            }
        }
    }
    //生成node
    spawn_node() {
        let key = POOL_PREFIX + this.itemsArr.name + "#" + this.itemsArr['_uuid'];
        let node = gdk.pool.get(key);
        if (!node) {
            node = cc.instantiate(this.itemsArr);
            node.active = true;
        }
        node.parent = this.content;
        return node;
    }
    //回收item
    recycle_item(item: ViewItem) {
        if (!item || !item.node) return;
        if (!cc.isValid(item.node)) return;
        let key = POOL_PREFIX + this.itemsArr.name + "#" + this.itemsArr['_uuid'];
        if (!this.pools[key]) {
            this.pools[key] = true;
        }
        gdk.pool.put(key, item.node);
        item.node.removeFromParent(false);
        item.node = null;
    }
    //清除items
    clear_items() {
        if (!this.items) return;
        if (!this.items.length) return;
        this.items.forEach((item) => {
            this.recycle_item(item);
        });
        this.items = null;
    }
    //渲染items
    render_items() {
        let item: ViewItem;
        for (let i = 0; i < this.start_index; i++) {
            item = this.items[i];
            if (item.node) {
                this.recycle_item(item);
            }
        }
        for (let i = this.items.length - 1; i > this.stop_index; i--) {
            item = this.items[i];
            if (item.node) {
                this.recycle_item(item);
            }
        }
        for (let i = this.start_index; i <= this.stop_index + 1; i++) {
            if (!this.items[i]) {
                continue
            }
            item = this.items[i];
            if (!item.node) {
                item.node = this.spawn_node();
                this.item_setter(item.node, item.data);
            }
            item.node.setPosition(item.x, item.y);
        }
    }
    //赋值item
    pack_item(index: number, data: any) {
        let node = this.spawn_node();
        let [width, height] = this.item_setter(node, data);
        let item = new ViewItem();
        item.x = 0;
        item.y = 0;
        item.width = width;
        item.height = height;
        item.data = data;
        item.node = node;
        this.recycle_item(item);
        return item;
    }
    //item具体赋值
    item_setter(node: cc.Node, data: any) {
        let a: any[] = node['_components'];
        a.forEach(c => {
            if (c.updateView) {
                c.updateView(data);
            }
        });
        return [node.width, node.height];
    }
    //布局items
    layout_items(start) {
        if (this.items.length <= 0) {
            return;
        }
        let start_pos = 0;
        if (start > 0) {
            let prev_item = this.items[start - 1];
            if (this.Vertical) {
                start_pos = prev_item.y - prev_item.height - this.gap_y;
            } else {
                start_pos = prev_item.x + prev_item.width + this.gap_x;
            }
        }
        for (let index = start, stop = this.items.length; index < stop; index++) {
            let item = this.items[index];
            if (this.Vertical) {
                item.x = 0;
                item.y = start_pos;
                start_pos -= item.height + this.gap_y;
            } else {
                item.y = 0;
                item.x = start_pos;
                start_pos += item.width + this.gap_x;
            }
        }
    }
    //调整content
    resize_content() {
        if (this.items.length <= 0) {
            this.content.width = 0;
            this.content.height = 0;
            return;
        }
        let last_item = this.items[this.items.length - 1];
        if (this.Vertical) {
            // this.content.height = Math.max(this.height, last_item.height - last_item.y);
            this.content.height = last_item.height - last_item.y;
        } else {
            this.content.width = Math.max(this.width, last_item.x + last_item.width);
        }
    }
    //设置数据
    set_data(datas: any[]) {
        this.clear_items();
        this.items = [];
        datas.forEach((data, index) => {
            let item = this.pack_item(index, data);
            this.items.push(item);
        });
        this.layout_items(0);
        this.resize_content();
        this.start_index = -1;
        this.stop_index = -1;
        if (this.Vertical) {
            this.content.y = 0;
        } else {
            this.content.x = 0;
        }
        if (this.items.length > 0) {
            this.on_scrolling();
        }
    }
    //插入数据
    insert_data(index: number, datas: any[]) {
        if (datas.length == 0) {
            // console.log("没有要添加的数据");
            return;
        }
        if (!this.items) {
            this.items = [];
        }
        if (index < 0 || index > this.items.length) {
            console.log("无效的index", index);
            return;
        }

        let items = [];
        datas.forEach((data, index) => {
            let item = this.pack_item(index, data);
            items.push(item);
        });
        this.items.splice(index, 0, ...items);
        // console.log(this.items)
        this.layout_items(index);
        this.resize_content();
        this.start_index = -1;
        this.stop_index = -1;
        this.on_scrolling();
    }
    //删除数据
    remove_data(index: number) {
        if (!this.items) {
            this.items = [];
        }
        if (this.items.length == 0) {
            // console.log("没有要添加的数据");
            return;
        }
        if (index < 0 || index >= this.items.length) {
            console.log("无效的index", index);
            return;
        }

        this.recycle_item(this.items[index])
        this.items.splice(index, 1)
        // if (item.node) {
        //     item.node.removeFromParent()
        //     item.node = null
        // }
        this.layout_items(0);
        this.resize_content();
        this.start_index = -1;
        this.stop_index = -1;
        this.on_scrolling();
    }
    //追加数据
    append_data(datas: any[]) {
        if (!this.items) {
            this.items = [];
        }
        this.insert_data(this.items.length, datas);
    }
    //滑动到底
    scroll_to_end() {
        if (this.Vertical) {
            this.scrView.getComponent(cc.ScrollView).scrollToBottom(0);
        } else {
            this.scrView.getComponent(cc.ScrollView).scrollToRight(0);
        }
        this.on_scrolling()
    }
    /**获取当前数据长度 */
    getItemLength() {
        if (!this.items) {
            this.items = [];
        }
        return this.items.length
    }
    //销毁
    onDestroy() {
        this.clear_items();
        this.items = null;
        Object.keys(this.pools).forEach(key => {
            gdk.pool.clear(key);
            delete this.pools[key];
        });
        // if (cc.isValid(this.scrollview)) {
        //     this.scrollview.off("scrolling", this.on_scrolling, this);
        //     // this.scrollview.node.off("scroll-to-bottom", this.on_scroll_to_end, this);
        //     // this.scrollview.node.off("scroll-to-right", this.on_scroll_to_end, this);
        // }
    }
}