
const { ccclass, property } = cc._decorator;

export enum EventType {
    SCROLL_START,
    SCROLL_ING,
    SCROLL_END
}

@ccclass
export default class UIScrollSelectCtrl extends cc.Component {

    public static EventType = EventType;
    @property(cc.Node)
    content: cc.Node = null;
    @property({
        type: cc.Integer,
        tooltip: '单个控件之间的距离'
    })
    deltaX: number = 100 //x间隔距离
    @property({
        type: cc.Integer,
        tooltip: '中心点的缩放比例'
    })
    centerScale: number = 1.0
    @property({
        type: cc.Integer,
        tooltip: '边缘点的缩放比例'
    })
    minScale: number = 1.0
    @property({
        type: cc.Integer,
        tooltip: '滚动时的速度'
    })
    scrollSpeed: number = 300;
    @property({
        type: cc.Component.EventHandler,
        tooltip: "选择后的回调"
    })
    selectEvents: Array<cc.Component.EventHandler> = [];

    private childs: Array<cc.Node> = [];
    private isTouching: boolean = false;
    private hasTouchMove: boolean = false;
    public isTestX: boolean = false;
    private _touchId: any = null;
    private currentIndex: number = 0;
    private _toMoveX: number = 1; //移动方向
    private dx: number = 0;
    private moveAim: number = 0;



    onLoad() {
        this.childs = [];
        for (var i = 0; i < this.content.children.length; i++) {
            this.childs[i] = this.content.children[i];
            this.childs[i].x = this.deltaX * (i - 1);
        }
        this.isTouching = false
        this.hasTouchMove = false
        this.isTestX = false;
        this._touchId = null;
        // this.currentIndex = 0;
        this.scrollTo(0, false);
    }

    updateChilds() {
        this.childs = [];
        for (var i = 0; i < this.content.children.length; i++) {
            this.childs[i] = this.content.children[i];
            this.childs[i].x = this.deltaX * (i - 1);
        }
        this.isTouching = false
        this.hasTouchMove = false
        this.isTestX = false;
        this._touchId = null;
        this.currentIndex = 0;
        this._toMoveX = 1;
        this.dx = 0;
        this.moveAim = 0;
        this.scrollTo(0, false);
    }


    /** 滚动到指定节点 
     * @param anim 是否带移动动画
    */
    scrollTo(idx: number, anim: boolean = true) {
        if (this.isTestX) return;
        if (idx < 0 && idx >= this.childs.length) {
            return console.error(this.node.name + '->移动超出边界面')
        }
        this.currentIndex = idx;
        this.moveAim = idx;
        if (!anim) {
            for (var i = 0; i < this.childs.length; i++) {
                this._checkChildX(this.childs[i], (i - idx) * this.deltaX)
            }
        } else {
            this.isTestX = true
        }
    }
    /** 向左滚一个点 */
    scrollToLeft() {
        if (this.isTestX) return;
        this._toMoveX = 1
        this.scrollTo((this.currentIndex - 1 + this.childs.length) % this.childs.length)
    }

    /** 向左滚一个点 */
    scrollToRight() {
        if (this.isTestX) return;
        this._toMoveX = -1
        this.scrollTo((this.currentIndex + 1 + this.childs.length) % this.childs.length)
    }

    _checkChildX(child, x) {
        if (x > this.childs.length / 2 * this.deltaX) {
            x -= this.childs.length * this.deltaX
        } else if (x < -this.childs.length / 2 * this.deltaX) {
            x += this.childs.length * this.deltaX
        }
        child.x = x;
        let dx = Math.min(Math.abs(x), this.deltaX)
        child.scale = (1 - dx / this.deltaX) * (this.centerScale - this.minScale) + this.minScale
    }

    start() {
        this.content.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this, true);
        this.content.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this, true);
        // this.content.on(cc.Node.EventType.MOUSE_DOWN, this._onTouchEnd, this, true);
        // this.content.on(cc.Node.EventType.TOUCH_START, this._onTouchEnd, this, true);
    }

    onDestroy() {
        this.content.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this, true);
        this.content.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this, true);
    }

    _onTouchEnd(e: cc.Event.EventTouch) {
        // e.stopPropagation();
        if (this.isTestX) return;
        let d = e.getLocationX() - e.getStartLocation().x
        if (Math.abs(d) >= 50) {
            var event1 = {
                target: e.target,
                index: this.currentIndex,
                direction: d < 0 ? -1 : 1
            }
            cc.Component.EventHandler.emitEvents(this.selectEvents, event1);
        }

    }

    fix(d) {
        var stepx = d * .2 * this.scrollSpeed
        let lx = this.childs[this.moveAim].x
        for (var i = 0; i < this.childs.length; i++) {
            this._checkChildX(this.childs[i], this.childs[i].x + stepx)
        }
    }

    update(dt) {
        if (this.isTouching || !this.isTestX) {
            return;
        }
        var stepx = this._toMoveX * dt * this.scrollSpeed
        let lx = this.childs[this.moveAim].x
        for (var i = 0; i < this.childs.length; i++) {
            this._checkChildX(this.childs[i], this.childs[i].x + stepx)
        }

        var x = this.childs[0].x;
        var idx = Math.round(x / this.deltaX);
        var tox = this.deltaX * idx;
        let cx = this.childs[this.moveAim].x
        if (lx * cx < 0 && Math.abs(cx) < this.deltaX) {
            this.isTestX = false;
            for (let i = 0; i < this.childs.length; i++) {
                if (Math.abs(this.childs[i].x) <= Math.abs(stepx)) {
                    this.currentIndex = i;
                    break;
                }
            }
            for (var i = 0; i < this.childs.length; i++) {
                this._checkChildX(this.childs[i], this.childs[i].x + tox - x)
            }
        }
    }

    get curIdx(): number { return this.currentIndex; }
}
