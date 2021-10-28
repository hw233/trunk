var BaseShowHideEffect = require("./gdk_BaseShowHideEffect");
var SlideEffectMode = require("../../const/gdk_SlideEffectMode");
var DelayCall = require("../../core/gdk_DelayCall");

/** 
 * 滑动效果
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-03-06 11:08:23
 */
var SlideShowHideEffect = cc.Class({
    extends: BaseShowHideEffect,
    editor: {
        menu: 'gdk(Effect)/SlideShowHideEffect',
        disallowMultiple: false
    },
    properties: {
        normalValue: {
            default: 1,
            visible: false,
            override: true
        },
        slideMode: {
            default: SlideEffectMode.CENTER,
            type: SlideEffectMode,
        },
        target: {
            default: null,
            type: cc.Node,
            tooltip: CC_DEV && "指定对齐节点，默认为空，为空时表时当前父节点"
        },
    },

    onLoad () {
        this._x = this.node.x;
        this._y = this.node.y;
    },
    onEnable () {
        switch (this.slideMode) {
            case SlideEffectMode.CENTER:
            case SlideEffectMode.LEFT:
            case SlideEffectMode.RIGHT:
            case SlideEffectMode.TOP:
            case SlideEffectMode.BOTTOM:
                // 针对相对位置偏移的滑动效果特殊处理
                let parent = this.target || this.node.parent;
                if (cc.isValid(parent) && parent.getComponent(cc.Widget)) {
                    parent.on(cc.Node.EventType.POSITION_CHANGED, this._resize, this);
                    parent.on(cc.Node.EventType.SIZE_CHANGED, this._resize, this);
                    this._$NhasWidget = true;
                }
                break;

            default:
                break;
        }
    },
    onDisable () {
        if (this._$NhasWidget) {
            let parent = this.target || this.node.parent;
            if (cc.isValid(parent)) {
                parent.off(cc.Node.EventType.POSITION_CHANGED, this._resize, this);
                parent.off(cc.Node.EventType.SIZE_CHANGED, this._resize, this);
            }
            delete this._$NhasWidget;
        }
    },
    _resize () {
        if (this._isShow === true) {
            // 正在显示中
            let isActioning = this._stopAction();
            this._action = this.doShow(isActioning);
            if (this._action) {
                DelayCall.addCall(this._runAction, this, 0.15);
            }
        } else if (this._isShow === false) {
            // 正在隐藏
            let isActioning = this._stopAction();
            this._action = this.doHide(isActioning);
            if (this._action) {
                this.node.runAction(this._action);
            }
        } else if (this._action == null) {
            // 行动完成，更新起始坐标
            this._x = this.node.x;
            this._y = this.node.y;
        }
    },
    doShow (isActioning) {
        var NodeTool = require("../../Tools/gdk_NodeTool");
        var node = this.node;
        var parent = this.target || node.parent;
        var x;
        var y;
        if (this.slideMode == SlideEffectMode.CENTER) {
            var pos = NodeTool.getCenter(node, parent);
            x = pos.x;
            y = pos.y;
            if (isActioning == false) {
                node.y = y + this.startValue;
                node.x = x;
            }
        } else if (this.slideMode == SlideEffectMode.LEFT) {
            var pos = NodeTool.getLeft(node, true, parent);
            x = pos.x + node.width;
            y = node.y;
            if (isActioning == false) {
                node.x = pos.x;
            }
        } else if (this.slideMode == SlideEffectMode.RIGHT) {
            var pos = NodeTool.getRight(node, true, parent);
            x = pos.x - node.width;
            y = node.y;
            if (isActioning == false) {
                node.x = pos.x;
            }
        } else if (this.slideMode == SlideEffectMode.TOP) {
            NodeTool.top(node, true);
            var pos = NodeTool.getTop(node, true, parent);
            x = node.x;
            y = pos.y - node.height;
            if (isActioning == false) {
                node.y = pos.y;
            }
        } else if (this.slideMode == SlideEffectMode.BOTTOM) {
            var pos = NodeTool.getBottom(node, true, parent);
            x = node.x;
            y = pos.y + node.height;
            if (isActioning == false) {
                node.y = pos.y;
            }
        } else if (this.slideMode == SlideEffectMode.HORIZONTAL) {
            x = this._x;
            y = this._y;
            if (isActioning == false) {
                node.y = y;
                node.x = x + this.startValue;
            }
        } else if (this.slideMode == SlideEffectMode.VERTICAL) {
            x = this._x;
            y = this._y;
            if (isActioning == false) {
                node.y = y + this.startValue;
                node.x = x;
            }
        }
        var action = cc.sequence(
            cc.delayTime(this.showDelay), cc.moveTo(this.showTime, x, y).easing(this.easeShowFun()),
            cc.callFunc(() => {
                this.showComplete();
            })
        );
        return action;
    },
    doHide (isActioning) {
        var NodeTool = require("../../Tools/gdk_NodeTool");
        var node = this.node;
        var x;
        var y;
        var parent = this.node.parent;
        if (this.slideMode == SlideEffectMode.CENTER) {
            var pos = NodeTool.getCenter(node, parent);
            x = pos.x;
            y = pos.y + this.endValue;

        } else if (this.slideMode == SlideEffectMode.LEFT) {
            var pos = NodeTool.getLeft(node, true, parent);
            x = pos.x;
            y = pos.y;
        } else if (this.slideMode == SlideEffectMode.RIGHT) {
            var pos = NodeTool.getRight(node, true, parent);
            x = pos.x;
            y = pos.y;
        } else if (this.slideMode == SlideEffectMode.TOP) {
            var pos = NodeTool.getTop(node, true, parent);
            x = pos.x;
            y = pos.y;
        } else if (this.slideMode == SlideEffectMode.BOTTOM) {
            var pos = NodeTool.getBottom(node, true, parent);
            x = pos.x;
            y = pos.y;
        } else if (this.slideMode == SlideEffectMode.HORIZONTAL) {
            x = this._x + this.endValue;
            y = this._y;
        } else if (this.slideMode == SlideEffectMode.VERTICAL) {
            x = this._x;
            y = this._y + this.endValue;
        }
        var action = cc.sequence(
            cc.delayTime(this.hideDelay), cc.moveTo(this.hideTime, x, y).easing(this.easeHideFun()),
            cc.callFunc(() => {
                this.hideComplete();
            })
        );
        return action;
    },
});

module.exports = SlideShowHideEffect;