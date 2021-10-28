import BGlobalUtil from '../../../common/utils/BGlobalUtil';

/** 
 * 游戏服务协议浏览
 * @Author: sthoo.huang  
 * @Date: 2021-03-08 11:42:37
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-09 12:18:14
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/login/ServiceView")
export default class ServiceView extends gdk.BasePanel {

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.RichText)
    text: cc.RichText = null;

    contentArr: string[];
    lastNode: cc.Node;

    onLoad() {
        this.text.string = '';
        this.text.node.active = false;
    }

    onEnable() {
        let args = this.args;
        if (!args || args.length == 0) {
            this.close();
            return;
        }
        this.content.destroyAllChildren();
        this.title = args[0].title || '';
        BGlobalUtil.httpGet(args[0].url, (err: any, content: string) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            if (!err && content) {
                // 加载成功，并且文件内容不为空
                this.contentArr = content.split('\n').reverse();
                this.node.on("scrolling", this._event_update_opacity, this);
                this.scroll.node.on('scroll-to-bottom', this.createItem, this);
                this.createItem();
                return;
            }
        }, null, 'ver');
    }

    onDisable() {
        this.contentArr = null;
        this.lastNode = null;
        this.content.destroyAllChildren();
        this.node.off("scrolling", this._event_update_opacity, this);
        this.scroll.node.off('scroll-to-bottom', this.createItem, this);
    }

    /**创建一行文本内容 */
    createItem() {
        if (!this.contentArr) return;
        if (!this.contentArr.length) return;
        gdk.Timer.callLater(this, this._createItemLater);
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
        text.string = this.contentArr.pop();
        this.lastNode = node;
        this.content.height += node.height;
        // 判断是已经超出显示
        if (!this._check_collision(node)) {
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
        gdk.Timer.callLater(this, this._event_update_opacity_later);
    }
    private _event_update_opacity_later(): void {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        this.content.children.forEach(v1_o => {
            v1_o.opacity = this._check_collision(v1_o) ? 255 : 0;
        });
    }
}