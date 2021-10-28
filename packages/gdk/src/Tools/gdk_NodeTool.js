var ShowHideComponent = require("../components/gdk_ShowHideComponent");
var PoolManager = require("../managers/gdk_PoolManager");
var HideMode = require("../const/gdk_HideMode");

/**
 * 节点工具类
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-01-12 09:45:48
 */

var NodeTool = {
    /**
     * 显示节点
     * @method  show
     * @param {cc.Node} node 节点
     * @param {bool} isEffect 是否显示动画效果,默认true
     * @param {*} callback 回调
     * @param {*} thisArg 
     */
    show (node, isEffect = true, callback = null, thisArg = null) {
        if (!node || !cc.isValid(node, true)) {
            return;
        }
        var showhides = node.getComponents(ShowHideComponent);
        if (showhides && showhides.length > 0) {
            for (var i = 0; i < showhides.length; i++) {
                if (i == 0) {
                    showhides[i].show(isEffect, callback, thisArg);
                } else {
                    showhides[i].show(isEffect);
                }
            }
        } else {
            try {
                node.active = true;
            } catch (err) {
                // 显示异常回调
                callback && callback.call(thisArg, 'error:' + err);
                return;
            }
            callback && callback.call(thisArg, node);
        }
    },

    onStartShow (node) {
        var showhide = node.getComponent(ShowHideComponent);
        if (!showhide) {
            showhide = node.addComponent(ShowHideComponent);
        }
        return showhide.onStartShow;
    },

    /**
     * 监听节点Show事件
     * @param {*} node 
     * @return {EventTrigger}
     */
    onShow (node) {
        var showhide = node.getComponent(ShowHideComponent);
        if (!showhide) {
            showhide = node.addComponent(ShowHideComponent);
        }
        return showhide.onShow;
    },

    /**
     * 节点是否显示
     * @method isShow
     * @param {cc.Node} node 
     */
    isShow (node) {
        var showhide = node.getComponent(ShowHideComponent);
        if (showhide) {
            return showhide.isShow;
        }
        return node.parent && node.active;
    },

    /**
     * 不显一个节点
     * @method hide
     * @param {cc.Node} node 节点
     * @param {booble} isEffect  是否显示动画效果,默认true
     * @param {*} callback function|string 回调或隐藏节点后的操作，HideMode(disable|pool|destroy) 对应的是(不显示|放入池子|销毁)
     * @param {*} thisArg 
     * @returns {Node} 如果null就是被清除或放池子了
     */
    hide (node, isEffect = true, callback = null, thisArg = null) {
        if (!node || !cc.isValid(node, true)) {
            return;
        }
        var showhides = node.getComponents(ShowHideComponent);
        if (showhides && showhides.length > 0) {
            for (var i = 0; i < showhides.length; i++) {
                if (i == 0) {
                    showhides[i].hide(isEffect, callback, thisArg);
                } else {
                    showhides[i].hide(isEffect);
                }
            }
        } else {
            var mode = callback;
            if (typeof callback === "function") {
                callback.call(thisArg);
                mode = HideMode.REMOVE_FROM_PARENT;
            }
            switch (mode) {
                case HideMode.DISABLE:
                    node.active = false;
                    return node;

                case HideMode.POOL:
                case HideMode.CACHE:
                    let key = node.name;
                    if (node._prefab) {
                        key += "#" + node._prefab.fileId;
                    }
                    if (mode == HideMode.POOL) PoolManager.put(key, node);
                    else PoolManager.cache(key, node);
                    break;

                case HideMode.REMOVE_FROM_PARENT:
                    node.removeFromParent(false);
                    break;

                default:
                    node.destroy();
            }
        }
        return null;
    },

    onStartHide (node) {
        var showhide = node.getComponent(ShowHideComponent);
        if (!showhide) {
            showhide = node.addComponent(ShowHideComponent);
        }
        return showhide.onStartHide;
    },

    /**
     * 监听节点Hide事件
     * @param {*} node 
     * @return {EventTrigger}
     */
    onHide (node) {
        var showhide = node.getComponent(ShowHideComponent);
        if (!showhide) {
            showhide = node.addComponent(ShowHideComponent);
        }
        return showhide.onHide;
    },

    /**
     * 把节点提到最前
     * @method bringTop
     * @param {cc.Node} node 
     */
    bringTop (node) {
        var n = node.parent.childrenCount;
        if (n > 1) {
            var index = node.getSiblingIndex();
            if (index < n - 1)
                node.setSiblingIndex(n - 1);
        }
    },

    /**
     * 把节点提到最后
     * @method bringBottom
     * @param {cc.Node} node 
     */
    bringBottom (node) {
        var n = node.parent.childrenCount;
        if (n > 1) {
            var index = node.getSiblingIndex();
            if (index > 0)
                node.setSiblingIndex(0);
        }
    },

    /**
     * 把节点提到目标节点前
     * @method bringBefore
     * @param {cc.Node} node 
     *  @param {cc.Node} targetNode 目录节点
     */
    bringBefore (node, targetNode) {
        if (node.parent != targetNode.parent)
            node.parent = targetNode.parent;
        var targetNodeIndex = targetNodeIndex.getSiblingIndex();
        this.bringAt(node, targetNodeIndex);
    },

    /**
     * 把节点提到目标节点后 
     * @method bringBefore
     * @param {cc.Node} node  
     * @param {cc.Node} targetNode 目录节点
     */
    bringAfter (node, targetNode) {
        if (node.parent != targetNode.parent)
            node.parent = targetNode.parent;
        var targetNodeIndex = targetNodeIndex.getSiblingIndex();
        this.bringAt(node, targetNodeIndex + 1);
    },

    /**
     * @method bringAt
     * @param {cc.Node} node 
     * @param {number} targetNodeIndex 
     */
    bringAt (node, targetNodeIndex) {
        var nodeIndex = node.getSiblingIndex();
        if (nodeIndex != targetNodeIndex - 1) {
            if (targetNodeIndex > nodeIndex)
                this._mask.node.setSiblingIndex(targetNodeIndex - 1);
            else
                this._mask.node.setSiblingIndex(targetNodeIndex);
        }
    },

    /**
     * 获取中心坐标
     * @method getCenter
     * @param {cc.Node} node 
     */
    getCenter (node, target = null) {
        var parent = target || node.parent;
        var cx = parent.width * (0.5 - parent.anchorX);
        var cy = parent.height * (0.5 - parent.anchorY);
        var x = node.width * (0.5 - node.anchorX);
        var y = node.height * (0.5 - node.anchorY);
        x = cx - x;
        y = cy - y;
        return cc.v2(x, y);
    },

    /**
     * 获取上边界坐标，
     * @method getTop
     * @param {cc.Node} node 
     * @param {boolean} isOut  是否父级边界外 默认 false
     */
    getTop (node, isOut = false, target = null) {
        var parent = target || node.parent;
        var cy = parent.height * (1 - parent.anchorY);
        var y = node.height * ((isOut ? 0 : 1) - node.anchorY);
        y = cy - y;
        return cc.v2(node.x, y);
    },

    /**
     * 获取下边界坐标，
     * @method getBottom
     * @param {cc.Node} node 
     * @param {boolean} isOut  是否父级边界外 默认 false
     */
    getBottom (node, isOut = false, target = null) {
        var parent = target || node.parent;
        var cy = parent.height * (-parent.anchorY);
        var y = node.height * ((isOut ? 1 : 0) - node.anchorY);
        y = cy - y;
        return cc.v2(node.x, y);
    },

    /**
     * 获取左边界坐标，
     * @method getLeft
     * @param {cc.Node} node 
     * @param {boolean} isOut  是否父级边界外 默认 false
     */
    getLeft (node, isOut = false, target = null) {
        var parent = target || node.parent;
        var cx = parent.width * (-parent.anchorX);
        var x = node.width * ((isOut ? 1 : 0) - node.anchorX);
        x = cx - x;
        return cc.v2(x, node.y);
    },

    /**
     * 获取右边界坐标，
     * @method getRight
     * @param {cc.Node} node 
     * @param {boolean} isOut  是否父级边界外 默认 false
     */
    getRight (node, isOut = false, target = null) {
        var parent = target || node.parent;
        var cx = parent.width * (1 - parent.anchorX);
        var x = node.width * ((isOut ? 0 : 1) - node.anchorX);
        x = cx - x;
        return cc.v2(x, node.y);
    },

    /**
     * 居中
     * @method center
     * @param {cc.Node} node 
     */
    center (node, target = null) {
        node.setPosition(NodeTool.getCenter(node, target));
    },

    /**
     * 贴上边界
     * @method top
     * @param {cc.Node} node 
     * @param {boolean} isOut  是否父级边界外 默认 false
     */
    top (node, isOut = false, target = null) {
        node.y = NodeTool.getTop(node, isOut, target).y;
    },

    /**
     * 贴下边界
     * @method bottom
     * @param {cc.Node} node 
     * @param {boolean} isOut  是否父级边界外 默认 false
     */
    bottom (node, isOut = false, target = null) {
        node.y = NodeTool.getBottom(node, isOut, target).y;
    },

    /**
     * 贴左边界
     * @method left
     * @param {cc.Node} node 
     * @param {boolean} isOut  是否父级边界外 默认 false
     */
    left (node, isOut = false, target = null) {
        node.x = NodeTool.getLeft(node, isOut, target).x;
    },

    /**
     * 贴右边界
     * @method right
     * @param {cc.Node} node 
     * @param {boolean} isOut  是否父级边界外 默认 false
     */
    right (node, isOut = false, target = null) {
        node.x = NodeTool.getRight(node, isOut, target).x;
    },

    /**
     * 获取父级边界内的坐标修正值
     * @param {cc.Node} node 
     * @param {number} gap 间隔 
     * @param {boolean} isUpFrist 优先向上， 默认true
     */
    getPosInBox (node, x, y, gap = 20, isUpFrist = true, target = null) {
        var parent = target || node.parent;

        if (isUpFrist) {
            var cy = parent.height * (1 - parent.anchorY);
            if (y + node.height + gap > cy)
                y = y - node.height * (1 - node.anchorY) - gap;
            else
                y = y - node.height * (-node.anchorY) + gap;
        } else {
            var cy = parent.height * (-parent.anchorY);
            if (y - node.height - gap < cy)
                y = y - node.height * (-node.anchorY) + gap;
            else
                y = y - node.height * (1 - node.anchorY) - gap;
        }
        var cx = parent.width * (-parent.anchorX);
        var nx = node.width * (-node.anchorX);
        if (x + nx < cx) {
            x = cx - nx;
        } else {
            cx = parent.width * (1 - parent.anchorX);
            nx = node.width * (1 - node.anchorX);
            if (x + nx > cx) {
                x = cx - nx;
            }
        }
        return cc.v2(x, y);
    },

    /**
     * 渲染帧前调用
     * @method callBeforeDraw
     * @param {Function} callback 
     * @param {*} thisArg 
     */
    callBeforeDraw (callback, thisArg) {
        cc.director.once(cc.Director.EVENT_BEFORE_DRAW, callback, thisArg);
    },

    /**
     * 取消渲染帧前调用
     * @method cancelCallBeforeDraw
     * @param {Function} callback 
     * @param {*} thisArg 
     */
    cancelCallBeforeDraw (callback, thisArg) {
        cc.director.off(cc.Director.EVENT_BEFORE_DRAW, callback, thisArg);
    },

    /**
     * 每个update之后时调用
     * @method callAfterUpdate
     * @param {Function} callback 
     * @param {*} thisArg 
     */
    callAfterUpdate (callback, thisArg) {
        cc.director.once(cc.Director.EVENT_AFTER_UPDATE, callback, thisArg);
    },

    /**
     * 取消每个update之后调用
     * @method cancelCallAfterUpdate
     * @param {Function} callback 
     * @param {*} thisArg 
     */
    cancelCallAfterUpdate (callback, thisArg) {
        cc.director.off(cc.Director.EVENT_AFTER_UPDATE, callback, thisArg);
    }
};

module.exports = NodeTool;