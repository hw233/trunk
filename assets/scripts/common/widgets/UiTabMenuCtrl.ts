import UiTabBtnCtrl from './UiTabBtnCtrl';

/** 
  * @Description: tab menu
  * @Author: chengyou.linyou  
  * @Date: 2019-11-23 13:43:58
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-06-16 15:47:57
*/
const { ccclass, property, executeInEditMode, requireComponent, menu } = cc._decorator;

@ccclass
@executeInEditMode
@menu("qszc/common/widgets/UiTabMenuCtrl")
export default class UiTabMenuCtrl extends cc.Component {
    //第一个按钮，若配置的按钮不够数据，就用此按钮进行克隆创建
    @property(cc.Node)
    tabBtn: cc.Node = null;

    //自动布局
    @property(cc.Boolean)
    _autoLayout: boolean = true;
    @property({ tooltip: "是否自动布局" })
    get autoLayout(): boolean {
        return this._autoLayout;
    }
    set autoLayout(v: boolean) {
        this._autoLayout = v;
        this.updateLayout();
    }

    //菜单项名称列表
    @property({})
    _itemNames: string[] = [];
    @property({ type: cc.String, displayName: "itemNames", tooltip: "配置菜单项文本" })
    get itemNames(): string[] {
        return this._itemNames;
    }
    set itemNames(names: string[]) {
        this._itemNames = names;
        this.updateMenuItems();
        this.updateLayout();
    }

    //选中指定菜单项
    @property({})
    _selectIdx: number = 0;
    @property({ type: cc.Integer, displayName: "selectIdx", tooltip: "默认选择菜单项" })
    get selectIdx(): number {
        return this._selectIdx;
    }
    set selectIdx(idx: number) {
        this.setSelectIdx(idx);
    }

    //在左边填充间距
    @property({})
    _paddingLeft: number = 0;
    @property({ type: cc.Integer, displayName: "paddingLeft" })
    get paddingLeft(): number {
        return this._paddingLeft;
    }
    set paddingLeft(value: number) {
        this._paddingLeft = value;
        this.updateLayout();
    }

    //菜单项的间距
    @property({})
    _spacingX: number = 0;
    @property({ type: cc.Integer, displayName: "spacingX" })
    get spacingX(): number {
        return this._spacingX;
    }
    set spacingX(value: number) {
        this._spacingX = value;
        this.updateLayout();
    }

    @property({ type: cc.Float, displayName: "anchorX" })
    get anchorX(): number {
        return this.node.anchorX;
    }
    set anchorX(value: number) {
        this.node.anchorX = value;
        this.updateLayout();
    }

    //tabmenu的事件
    @property(cc.Component.EventHandler)
    ClickEvents: cc.Component.EventHandler[] = [];

    onLoad() {
        //只在编辑器模式下运行，提高在游戏模式的效率
        CC_EDITOR && this.updateMenuItems();
    }

    start() {
        //只在编辑器模式下运行，提高在游戏模式的效率
        CC_EDITOR && this.updateLayout();

        let defaultIdx = this._selectIdx;
        this._selectIdx = -1;
        this.setSelectIdx(defaultIdx);
    }

    updateLayout() {
        if (!this.autoLayout) return;
        let children = this.node.children;
        if (children.length == 0) {
            return;
        }
        let totalWidth = this._paddingLeft;
        for (let index = 0; index < children.length; index++) {
            let tabBtn = children[index];
            let ctrl = tabBtn.getComponent(UiTabBtnCtrl)
            if (ctrl) {
                ctrl.updateSize();
            }
            totalWidth += tabBtn.width + this._spacingX;
        }
        totalWidth -= this._spacingX;

        let startX = -totalWidth * this.node.anchorX + this._paddingLeft;
        for (let index = 0; index < children.length; index++) {
            let tabBtn = children[index];
            tabBtn.x = startX + tabBtn.width * tabBtn.anchorX;
            startX += tabBtn.width + this._spacingX;
        }
    }

    updateMenuItems() {
        let cLen = this.node.childrenCount;
        if (cLen == 0) {
            return;
        }

        let iLen = this._itemNames.length;
        if (iLen == 0) {
            return;
        }
        for (let index = 0; index < iLen; index++) {
            const itemName = this._itemNames[index];
            this.setBtnTxt(index, "normal", itemName);
            this.setBtnTxt(index, "select", itemName);
        }
        //隐藏多余的按钮
        if (this.node.children.length > iLen) {
            let allLen = this.node.children.length
            for (let i = iLen; i < allLen; i++) {
                let tabBtn = this.node.children[i];
                tabBtn.active = false;
            }
        }
    }

    setBtnTxt(index: number, state: string, itemName: string) {
        let tabBtn = this.node.children[index];
        if (!tabBtn) {

            tabBtn = cc.instantiate(this.tabBtn);
            this.node.addChild(tabBtn);
        }
        tabBtn.active = true;
        let labNode = tabBtn.getChildByName(state);
        if (labNode) {
            let lab = labNode.getComponentInChildren(cc.Label);
            if (lab) {
                lab.string = itemName;
            }
        }
    }

    //单纯显示效果
    showSelect(idx: number) {
        if (this._selectIdx == idx) {
            return;
        }
        this._selectIdx = idx;
        let children = this.node.children;
        for (let index = 0; index < children.length; index++) {
            let tabBtn = children[index];
            let tabBtnCtrl = tabBtn.getComponent(UiTabBtnCtrl);
            if (tabBtnCtrl) {
                if (idx == index) {
                    tabBtnCtrl.check(true);
                } else {
                    tabBtnCtrl.check(false);
                }
            }
        }
    }

    //不但显示，还传递事件
    setSelectIdx(idx: number, event = null) {
        idx = Math.min(Math.max(idx, 0), this.node.childrenCount - 1);
        this._selectIdx = -1;
        this.showSelect(idx);
        this._selectIdx = idx;

        if (CC_EDITOR) {
            return;
        }
        if (this.ClickEvents) {
            for (let index = 0; index < this.ClickEvents.length; index++) {
                const element = this.ClickEvents[index];
                element.emit([event, idx]);
            }
        }
    }

    onTabClick(event) {
        let children = this.node.children;
        let selectIdx = -1;
        for (let index = 0; index < children.length; index++) {
            let tabBtn = children[index];
            if (tabBtn == event.currentTarget) {
                selectIdx = index;
                break;
            }
        }
        if (this._selectIdx == selectIdx) {
            return;
        }
        this.setSelectIdx(selectIdx, event);
    }

}
