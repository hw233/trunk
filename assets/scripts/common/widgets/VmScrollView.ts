import {setModel} from '../../a/vm';
import Layout = cc.Layout;

const {ccclass, property} = cc._decorator;

@ccclass
export default class VmScrollView extends cc.Component {

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Float)
    itemWidth: number = 0;

    @property(cc.Float)
    itemHeight: number = 0;

    @property(cc.SpriteFrame)
    slotBg: cc.SpriteFrame = null;

    minRow: number = 0;

    slotIndex: number = 0;
    originContentY: number = 0;
    content: cc.Node = null;
    layout: cc.Layout = null;
    itemNodePool: cc.NodePool = new cc.NodePool();
    slotNodePool: cc.NodePool = new cc.NodePool();
    rowSize: number = 0;
    showNum: number = 0;
    showEnd: number = 0;

    onLoad() {
        if (!this.itemWidth) {
            this.itemWidth = this.itemPrefab.data.width;
        }
        if (!this.itemHeight) {
            this.itemHeight = this.itemPrefab.data.height;
        }
        this.scrollView.node.on("scrolling", this.onScroll, this);
        this.content = this.scrollView.content;
        this.originContentY = this.content.y;
        this.layout = this.content.getComponent(cc.Layout);
        let width = this.scrollView.node.width - this.layout.paddingLeft;
        this.rowSize = Math.floor((width + this.layout.spacingX) / (this.itemWidth + this.layout.spacingX));
        this.showEnd = this.getShowEnd();
        this.showNum = this.showEnd + this.rowSize;
        if (this.slotBg) {
            this.minRow = Math.floor(this.showEnd / this.rowSize);
        }
        this.content.on(cc.Node.EventType.SIZE_CHANGED, this.onResize, this);
    }

    onDestroy() {
        this.itemNodePool.clear();
        this.slotNodePool.clear();
    }

    onResize() {
        if (this.content.y != this.originContentY) {
            this.originContentY = this.content.y;
            let oldEnd = this.showEnd;
            this.showEnd = this.getShowEnd();
            this.showNum = this.showEnd + this.rowSize;
            this.refresh(oldEnd);
            if (this.slotBg) {
                this.minRow = Math.floor(this.showEnd / this.rowSize);
                let length = this.minRow * this.rowSize;
                if (length > this.content.childrenCount) {
                    for (let i = this.content.childrenCount; i < length; i++) {
                        this.setChild(i, null);
                    }
                }
            }
            this.content.off(cc.Node.EventType.SIZE_CHANGED, this.onResize, this);
        }
    }

    scrollTo(y: number, refresh: boolean = true) {
        this.scrollView.stopAutoScroll();
        this.content.y = y;
        if (refresh) {
            this.refresh();
        } else {
            this.showEnd = this.getShowEnd();
        }
    }

    scrollToIndex(i: number) {
        if (this.layout.verticalDirection == Layout.VerticalDirection.TOP_TO_BOTTOM) {
            this.content.y = this.originContentY + (i / this.rowSize) * this.itemHeight;
        } else {
            this.content.y = this.originContentY - (i / this.rowSize) * this.itemHeight;
        }
        this.refresh();
    }

    onScroll() {
        this.refresh();
    }

    refresh(oldEnd?: number) {
        if (!oldEnd) {
            oldEnd = this.showEnd;
        }
        let newEnd = this.getShowEnd();
        if (newEnd == oldEnd) {
            return;
        }
        this.showEnd = newEnd;
        let oldStart = this.getShowStart(oldEnd);
        let newStart = this.getShowStart(newEnd);
        if (newEnd > oldEnd) {
            for (let i = oldEnd; i < newEnd; i++) {
                let slot = this.content.children[i];
                if (slot) {
                    this.showItem(slot);
                }
            }
            for (let i = oldStart; i < newStart; i++) {
                let slot = this.content.children[i];
                if (slot) {
                    this.hideItem(slot);
                }
            }
        } else if (newEnd < oldEnd) {
            for (let i = newEnd; i < oldEnd; i++) {
                let slot = this.content.children[i];
                if (slot) {
                    this.hideItem(slot);
                }
            }
            for (let i = newStart; i < oldStart; i++) {
                let slot = this.content.children[i];
                if (slot) {
                    this.showItem(slot);
                }
            }
        }
    }

    setChildren(models: any[]) {
        let length = models.length;
        if (this.slotBg) {
            length = Math.max(length, this.minRow * this.rowSize);
            length = Math.ceil(length / this.rowSize) * this.rowSize;
        }
        for (let i = 0; i < length; i++) {
            this.setChild(i, models[i]);
        }
        this.removeChildren(length);
    }

    setChild(index: number, model: any) {
        let slot: cc.Node;
        if (this.content.children.length > index) {
            slot = this.content.children[index];
        } else {
            slot = this.getSlotNode(model);
            this.content.addChild(slot);
        }
        slot["model"] = model;
        if (model && index >= this.getShowStart(this.showEnd) && index < this.showEnd) {
            this.showItem(slot);
        } else {
            this.hideItem(slot);
        }
    }

    removeChildren(from: number) {
        for (let i = this.content.children.length - 1; i >= from; i--) {
            let slot = this.content.children[i];
            delete slot["model"];
            this.hideItem(slot);
            this.slotNodePool.put(slot);
        }
    }

    protected getShowEnd(): number {
        let offsetY = this.content.y - this.originContentY;
        if (this.layout.verticalDirection == Layout.VerticalDirection.BOTTOM_TO_TOP) {
            offsetY = -offsetY;
        }
        let height = this.scrollView.node.height + offsetY - this.layout.paddingTop - this.layout.paddingBottom;
        let rowNum = Math.ceil((height + 1 + this.layout.spacingY) / (this.itemHeight + this.layout.spacingY));
        return rowNum * this.rowSize;
    }

    protected getShowStart(showEnd: number): number {
        return showEnd - this.showNum;
    }

    protected hideItem(slot: cc.Node) {
        if (slot.childrenCount == 0) {
            return;
        }
        let item = slot.children[slot.childrenCount - 1];
        item.active = false;
        this.itemNodePool.put(item);
    }

    protected showItem(slot: cc.Node) {
        let model = slot["model"];
        if (model) {
            if (slot.childrenCount > 0) {
                let item = slot.children[0];
                setModel(item.getComponent(cc.Component), model);
                return;
            }
            let item = this.itemNodePool.get();
            if (!item) {
                item = cc.instantiate(this.itemPrefab);
            }
            item.getComponent(cc.Component)["model"] = model;
            slot.addChild(item);
            item.active || (item.active = true);
        } else if (slot.childrenCount > 0) {
            this.hideItem(slot);
        }
    }

    protected getSlotNode(model): cc.Node {
        let slot = this.slotNodePool.get();
        if (!slot) {
            slot = new cc.Node();
            slot.name = "slot" + (++this.slotIndex);
            slot.width = this.itemWidth;
            slot.height = this.itemHeight;
            slot.anchorX = this.itemPrefab.data.anchorX;
            slot.anchorY = this.itemPrefab.data.anchorY;
            if (this.slotBg) {
                let sprite = slot.addComponent(cc.Sprite);
                sprite.spriteFrame = this.slotBg;
            }
        }
        if (model != undefined) {
            slot["model"] = model;
        }
        return slot;
    }

}