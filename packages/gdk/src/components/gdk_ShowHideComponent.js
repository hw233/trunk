var HideMode = require("../const/gdk_HideMode");
var EventTrigger = require("../core/gdk_EventTrigger");
var PoolManager = require("../managers/gdk_PoolManager");
var DelayCall = require("../core/gdk_DelayCall");

/**
 * 显示隐藏组件
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-01-12 09:46:11
 */
var ShowHideComponent = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(Component)/ShowHideComponent',
        // disallowMultiple: false
    },
    properties: {
        hideMode: {
            default: HideMode.DESTROY,
            type: HideMode,
            visible: true,
            serializable: true,
            tooltip: CC_DEV && `NONE:什么也不做\nDISABLE:取消激活\nPOOL:回收进对象池\nDESTROY:销毁\nCACHE:缓存起来，但这里是单一对象的缓存,没有池子对面板等单一对象尤其适用.`
        },
        onStartShow: {
            default: null,
            type: EventTrigger,
            visible: false,
            serializable: false,
        },
        onShow: {
            default: null,
            type: EventTrigger,
            visible: false,
            serializable: false,
        },
        onStartHide: {
            default: null,
            type: EventTrigger,
            visible: false,
            serializable: false,
        },
        onHide: {
            default: null,
            type: EventTrigger,
            visible: false,
            serializable: false,
        },
        _isShow: null,
        isShow: {
            visible: false,
            get() {
                if (this._isShow == null) {
                    return this.node.active;
                }
                return this._isShow;
            },
        },
        isShowWheEnable: false,
        _hideMode: null,
        _action: null,
    },
    ctor () {
        this.onStartShow = EventTrigger.get();
        this.onShow = EventTrigger.get();
        this.onStartHide = EventTrigger.get();
        this.onHide = EventTrigger.get();
    },

    onEnable () {
        if (this.isShowWheEnable) {
            this.show();
        }
    },
    onDisable () { // 过场景时直接完成吧
        var isActioning = this._stopAction();
        if (isActioning && cc.isValid(this.node, true)) {
            // if (this._action.getOriginalTarget()) {
            //     this.node.stopAction(this._action);
            // }
            // this.onHide.emit(this);
            this.hideComplete();
        }
        DelayCall.cancel(this._runAction, this);
        // if (this._isShow) {
        //     this._isShow = null;
        // }
        this._isShow = null;
        this._action = null;
    },

    onDestroy () {
        this.onShow.release();
        this.onHide.release();
        this.onShow = null;
        this.onHide = null;
        this.onStartShow.release();
        this.onStartHide.release();
        this.onStartShow = null;
        this.onStartHide = null;
        this._isShow = null;
    },
    unuse () {
        this._isShow = null;
        this._action = null;
        this.onShow.offAll();
        this.onHide.offAll();
        this.onStartShow.offAll();
        this.onStartHide.offAll();
    },
    _stopAction () {
        var isActioning = this._action != null && this._action.isDone() == false;
        if (isActioning) {
            if (!!this._action.getOriginalTarget() &&
                !!cc.director.getActionManager()._hashTargets[this.node._id]
            ) {
                this.node.stopAction(this._action);
            }
        }
        this._action = null;
        return isActioning;
    },

    show (isEffect = true, callback = null, thisArg = null) {
        if (this.isShow && this._isShow != null) {
            return;
        }
        var isActioning = this._stopAction();
        this._isShow = true;
        this._hideMode = null;
        this.onHide.offOnce();
        this.onStartHide.offOnce();
        try {
            this.node.active = true;
        } catch (err) {
            // 显示异常回调
            callback && callback(thisArg, 'error:' + err);
            return;
        }
        if (callback) {
            this.onShow.once(callback, thisArg);
        }
        this.onStartShow.emit(this);
        if (isEffect && this.isShowEffect()) {
            this._action = this.doShow(isActioning);
            if (this._action) {
                DelayCall.addCall(this._runAction, this, 0.15);
            }
        } else {
            this.showComplete();
        }
    },
    _runAction () {
        if (this._action && this._isShow && this.node.active) {
            this.node.runAction(this._action);
        } else {
            this._action = null;
        }
    },
    hide (isEffect = true, callback = null, thisArg = null) {
        if (this.isShow == false) {
            return;
        }
        var isActioning = this._stopAction();
        this._isShow = false;
        this.onShow.offOnce();
        this.onStartShow.offOnce();
        this._hideMode = null;
        if (typeof callback == "function") {
            this.onHide.once(callback, thisArg);
        } else if (callback != null) {
            this._hideMode = callback;
        }
        this.node.active = true;
        this.onStartHide.emit(this);
        if (isEffect && this.isHideEffect()) {
            this._action = this.doHide(isActioning);
            if (this._action) {
                this.node.runAction(this._action);
            }
        } else {
            this.hideComplete();
        }
    },
    isShowEffect () {
        return true;
    },
    isHideEffect () {
        return true;
    },
    doShow (isActioning) {
        this.showComplete();
    },
    doHide (isActioning) {
        this.hideComplete();
    },
    showComplete () {
        if (this.isShow == false) {
            return;
        }
        this._action = null;
        this.onShow.emit(this);
    },
    hideComplete () {
        if (this.isShow) {
            return;
        }
        this._action = null;
        this.onHide.emit(this);

        let hideMode = this._hideMode != null ? this._hideMode : this.hideMode;
        this._hideMode = null;
        switch (hideMode) {
            case HideMode.DISABLE:
                this.node.active = false;
                break;

            case HideMode.POOL:
            case HideMode.CACHE:
                let node = this.node;
                let key = node.name;
                if (node._prefab) {
                    key += "#" + node._prefab.fileId;
                }
                if (hideMode == HideMode.POOL) PoolManager.put(key, node);
                else PoolManager.cache(key, node);
                break;

            case HideMode.DESTROY:
                this.node.destroy();
                break;

            case HideMode.REMOVE_FROM_PARENT:
                this.node.removeFromParent(false);
                break;

            default:
        }
    },
});

module.exports = ShowHideComponent;