import BGlobalUtil from '../../../common/utils/BGlobalUtil';
import BModelManager from '../../../common/managers/BModelManager';
import BSdkTool from '../../../sdk/BSdkTool';
import BServerModel from '../../../common/models/BServerModel';
import { ListView, ListViewDir } from '../../../common/widgets/BUiListview';

/** 
 * 游戏公告
 * @Author: luoyong  
 * @Date: 2020-06-30 16:06:36 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-09 18:23:27
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/login/NoticeViewCtrl")
export default class NoticeViewCtrl extends gdk.BasePanel {

    @property(cc.Prefab)
    tabItem: cc.Prefab = null;

    @property(cc.ScrollView)
    tabScrollView: cc.ScrollView = null;
    @property(cc.Node)
    tabContent: cc.Node = null;

    @property(cc.Node)
    webNode: cc.Node = null;
    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.RichText)
    text: cc.RichText = null;

    @property(cc.Node)
    noTip: cc.Node = null;

    list: ListView = null;
    contentArr: string[];
    lastNode: cc.Node;
    originalPos: cc.Vec2;

    get model(): BServerModel {
        return BModelManager.get(BServerModel);
    }

    onLoad() {
        this.text.string = '';
        this.text.node.active = false;
        this.webNode.active = false;
        this.noTip.active = false;
        this.tabScrollView.node.active = false;
        this.originalPos = this.content.getPosition();
    }

    onEnable() {
        this.webNode.active = false;
        this.contentArr = null;
        this.lastNode = null;
        // 获取公告列表
        let url = BModelManager.get(BServerModel).host;
        if (CC_DEBUG) {
            url = 'https://api.ftmc.fmggames.cn:9001';
        }
        BGlobalUtil.httpGet(url + "/placard_list", (err: any, content: string) => {
            if (!cc.isValid(this.node)) return;
            if (err) {
                CC_DEBUG && cc.error(err);
                return;
            }
            let datas: any[];
            try {
                datas = JSON.parse(content || '[]');
            } catch (err) {
                CC_DEBUG && cc.error(err);
            }
            this.updateTabView(datas || []);
        });
    }

    onDisable() {
        this._resetContent();
    }

    initTabList() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.tabScrollView,
            mask: this.tabScrollView.node,
            content: this.tabContent,
            item_tpl: this.tabItem,
            cb_host: this,
            async: true,
            select_cb: this._tabSelectItem,
            column: 1,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        });
    }

    updateTabView(datas: any[]) {
        this.initTabList();
        let newDatas: NoticeItemType[] = [];
        let selectId = 0;
        let pop = 0;
        for (let i = 0, n = datas.length; i < n; i++) {
            let item = NoticeItemType.parse(datas[i]);
            if (item) {
                newDatas.push(item)
                if (item.pop > pop) {
                    pop = item.pop;
                    selectId = item.id;
                }
            }
        }
        if (newDatas.length > 0) {
            newDatas.sort((a, b) => b.sort - a.sort);
            this.tabScrollView.node.active = true;
            this.webNode.active = true;
            this.noTip.active = false;
            this.list.set_data(newDatas);
            this.list.select_item(this._getTabSelectIndex(newDatas, selectId));
        } else {
            this.tabScrollView.node.active = false;
            this.webNode.active = false;
            this.noTip.active = true;
        }
    }

    _getTabSelectIndex(list, id) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                return i;
            }
        }
        return 0;
    }

    _resetContent() {
        gdk.Timer.clearAll(this);
        this.contentArr = null;
        this.lastNode = null;
        this.content.destroyAllChildren();
        this.content.setPosition(this.originalPos);
        this.content.height = 0;
        this.webNode.off("scrolling", this._event_update_opacity, this);
        this.scroll.node.off('scroll-to-bottom', this.createItem, this);
        this.scroll.stopAutoScroll();
        this.content['_$url_'] = null;
    }

    _tabSelectItem() {
        let item: NoticeItemType = this.list.selectd_data;
        let url = `/placard/${item.id}.${item.md5}.html`;
        if (CC_DEBUG) {
            url = `https://h5.ftmc.fmggames.cn${url}`;
        }
        this._resetContent();
        this.content['_$url_'] = url;
        BGlobalUtil.httpGet(url, (err: any, content: string) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            if (!err && content && this.content['_$url_'] == url) {
                // 加载成功，并且文件内容不为空
                this.content['_$url_'] = null;
                this.contentArr = content.split('\n').reverse();
                this.webNode.on("scrolling", this._event_update_opacity, this);
                this.scroll.node.on('scroll-to-bottom', this.createItem, this);
                this.createItem();
            }
        }, null, 'none');
    }

    /**创建一行文本内容 */
    createItem() {
        if (!this.contentArr) return;
        if (!this.contentArr.length) return;
        gdk.Timer.frameOnce(1, this, this._createItemLater);
    }
    private _createItemLater() {
        if (!this.contentArr) return;
        if (!this.contentArr.length) return;
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        // 创建一行文本
        let node = cc.instantiate(this.text.node);
        let text = node.getComponent(cc.RichText);
        node.parent = this.content;
        node.active = true;
        node.setPosition(0, 0);
        if (this.lastNode) {
            node.y = this.lastNode.y - this.lastNode.height;
        }
        text.maxWidth = this.content.width;
        text.string = this.contentArr.pop();
        this.lastNode = node;
        this.content.height += node.height;
        // 判断是已经超出显示
        if (this.content.height > this.scroll.node.height && !this._check_collision(node)) {
            return;
        }
        this.createItem();
    }

    /**获取在世界坐标系下的节点包围盒(不包含自身激活的子节点范围) */
    private _get_bounding_box_to_world(node_o_: any): cc.Rect {
        let w_n: number = node_o_._contentSize.width;
        let h_n: number = node_o_._contentSize.height;
        let rect_o = cc.rect(
            -node_o_._anchorPoint.x * w_n,
            -node_o_._anchorPoint.y * h_n,
            w_n,
            h_n
        );
        node_o_._calculWorldMatrix();
        rect_o.transformMat4(rect_o, node_o_._worldMatrix);
        return rect_o;
    }

    /**检测碰撞 */
    private _check_collision(node_o_: cc.Node): boolean {
        let rect1_o = this._get_bounding_box_to_world(this.scroll.node);
        let rect2_o = this._get_bounding_box_to_world(node_o_);
        // ------------------保险范围
        rect1_o.width += rect1_o.width * 0.5;
        rect1_o.height += rect1_o.height * 0.5;
        rect1_o.x -= rect1_o.width * 0.25;
        rect1_o.y -= rect1_o.height * 0.25;
        return rect1_o.intersects(rect2_o);
    }

    /**更新子节点显示或隐藏状态 */
    private _event_update_opacity(): void {
        gdk.Timer.frameOnce(1, this, this._event_update_opacity_later);
    }
    private _event_update_opacity_later(): void {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        this.content.children.forEach(v1_o => {
            v1_o.opacity = this._check_collision(v1_o) ? 255 : 0;
        });
    }
}

export class NoticeItemType {
    id: number;         //id
    t: string;          //按钮名
    pf: number;         //平台id
    s: number;          //状态  0 默认 1 置顶 2 最新  3 火爆  
    sort: number;       //tab排序
    pop: number;        //优先选择哪个tab 值大的
    st: number;
    et: number;
    md5: string;        //公告地址
    ch: number[];       //渠道id

    static parse(data: any) {
        let item: NoticeItemType = {
            id: data["id"],
            t: data["t"],
            pf: data["pf"],
            s: data["s"],
            sort: data["sort"],
            pop: data["pop"],
            st: data["st"],
            et: data["et"],
            md5: data["md5"],
            ch: data["ch"],
        };
        let pid = BSdkTool.tool.config.platform_id;
        let cid = BSdkTool.tool.config.channel_id;
        if (item.pf == pid || item.pf == 0) {
            // 平台相同，或不限平台
            if (item.ch.length == 0 || item.ch.indexOf(0) >= 0 || item.ch.indexOf(cid) >= 0) {
                // 渠道相同，或不限渠道
                let now = Math.floor(Date.now() / 1000);
                if (item.st < now && item.et > now) {
                    return item;
                }
            }
        }
        return null;
    }
}