import ButtonSoundId from '../../configs/ids/ButtonSoundId';
import GlobalUtil from '../utils/GlobalUtil';
import UiTabMenuCtrl from './UiTabMenuCtrl';

/** 
  * @Description: tab menu
  * @Author: chengyou.linyou  
  * @Date: 2019-11-23 13:43:58
 * @Last Modified by: chengyou.lin
 * @Last Modified time: 2019-12-17 16:39:19
*/
const { ccclass, property, executeInEditMode, menu } = cc._decorator;

@ccclass
@executeInEditMode
@menu("qszc/common/widgets/UiTabBtnCtrl")
export default class UiTabBtnCtrl extends cc.Component {

    //按钮是否自动大小
    @property({})
    _autoSize: boolean = true;
    @property({ type: cc.Boolean, displayName: "autoSize" })
    get autoSize(): boolean {
        return this._autoSize;
    }
    set autoSize(enble: boolean) {
        this._autoSize = enble;
        this.updateSize();
    }

    @property(cc.Component.EventHandler)
    ClickEvents: cc.Component.EventHandler[] = [];

    select: cc.Node = null;
    normal: cc.Node = null;
    isSelect: boolean = false;
    _isInit: boolean = false;

    createNode(tabName: string) {
        let tabNode = this.node.getChildByName(tabName);
        if (!tabNode) {
            tabNode = new cc.Node();
            tabNode.name = tabName
            this.node.addChild(tabNode);
            tabNode.addComponent(cc.Sprite);

            let label = new cc.Node();
            label.name = "label"
            tabNode.addChild(label);
            label.addComponent(cc.Label);
            label.addComponent(cc.LabelOutline);
        }
        return tabNode;
    }

    onLoad() {
        if (this._isInit) {
            return;
        }
        this._isInit = true;
        this.select = this.createNode("select");
        this.normal = this.createNode("normal");
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

        CC_EDITOR && this.updateSize();
    }

    start() {
        let parent = this.node.parent;
        let parentCtrl = parent.getComponent(UiTabMenuCtrl);
        if (parentCtrl && parent.children[parentCtrl.selectIdx] == this.node) {
            this.check(true);
        } else {
            this.check(false);
        }
    }

    updateSize() {
        if (!this._autoSize) {
            return;
        }
        let node = this.normal || this.select;
        if (node) {
            this.node.width = node.width;
            this.node.height = node.height;
        }
    }

    check(isSelect: boolean) {
        this.isSelect = isSelect;
        this.show(isSelect);
    }

    show(isShow: boolean) {
        if (isShow) {
            this.select && (this.select.active = true);
            this.normal && (this.normal.active = false);
        } else {
            this.select && (this.select.active = false);
            this.normal && (this.normal.active = true);
        }
    }

    onTouchStart() {
        this.show(true);
        GlobalUtil.isSoundOn && gdk.sound.play(
            gdk.Tool.getResIdByNode(this.node),
            ButtonSoundId.click
        );
    }

    onTouchEnd(event) {
        this.check(true);
        if (this.ClickEvents) {
            for (let index = 0; index < this.ClickEvents.length; index++) {
                const element = this.ClickEvents[index];
                element.emit([event]);
            }
        }
        let parentCtrl = this.node.parent.getComponent(UiTabMenuCtrl);
        if (parentCtrl) {
            parentCtrl.onTabClick(event);
        }
    }

    onTouchCancel() {
        if (!this.isSelect) {
            this.check(false);
        }
    }

}
