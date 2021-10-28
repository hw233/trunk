var DelayCall = require("../../core/gdk_DelayCall");
var EventTrigger = require("../../core/gdk_EventTrigger");
var NodeTool = require("../../Tools/gdk_NodeTool");
var PoolManager = require("../../managers/gdk_PoolManager");
var ItemRenderer = require("./gdk_ItemRenderer");
/**
 * 列表基类
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-07-16 15:37:36
 */
var BaseList = cc.Class({
    extends: cc.Component,

    editor: {
        // menu: 'gdk_ui/BaseList',
        disallowMultiple: false,
    },
    properties: {
        _itemRenderer: {
            default: null,
            type: cc.Prefab,
            serializable: true,
            visible: true,
            toolTip: CC_DEV && "列表项",
        },

        _selectable: {
            default: false,
            serializable: true,
            visible: true,
            toolTip: CC_DEV && "列表项是否可以选中",
        },
        /**
         * 列表项是否可以选中
         * @property {booble} selectable
         */
        selectable: {
            visible: false,
            get() {
                return this._selectable;
            },
            set(value) {
                if (this._selectable == value)
                    return;
                this._selectable = value;
                if (this._selectable == false && this._selectIndexs.length > 0) {
                    this._selectIndexs.length = 0;
                    for (var i = 0, n = _itemRenderers.length; i < n; i++) {
                        _itemRenderers[i]._setSelected(false);
                    }
                    this.onSelectChanged.emit();
                }
            },
        },
        _selectToggle: {
            default: false,
            serializable: true,
            visible: true,
            toolTip: CC_DEV && "选中的项是否可以再次点击时取消",
        },
        /**
         * 选中的项是否可以再次点击时取消
         * @property {booble} selectToggle
         */
        selectToggle: {
            visible: false,
            get() {
                return this._selectToggle;
            },
            set(value) {
                if (this._selectToggle == value) {
                    return;
                }
                this._selectToggle = value;
            },
        },
        _isMultipleSelection: {
            default: false,
            serializable: true,
            visible: true,
            toolTip: CC_DEV && "是否可以多选",
        },
        /**
         * 是否可以多选
         * @property {booble} isMultipleSelection
         */
        isMultipleSelection: {
            visible: false,
            get() {
                return this._isMultipleSelection;
            },
            set(value) {
                if (this._isMultipleSelection == value)
                    return;
                this._isMultipleSelection = value;
                if (this._isMultipleSelection == false && this._selectIndexs.length > 1) {
                    this._selectIndexs.length = 1;
                    for (var i = 1, n = _itemRenderers.length; i < n; i++) {
                        _itemRenderers[i]._setSelected(false);
                    }
                    this.onSelectChanged.emit();
                }
            },
        },
        /**
         * 开启异步模式，对于一次生成大量列表数据时，会每帧生成一个，不会造成瞬时阻塞，让程序平滑
         * @property {booble} async
         */
        async: {
            default: false,
            toolTip: CC_DEV && "开启异步模式，对于一次生成大量列表数据时，会每帧生成一个，不会造成瞬时阻塞，让程序平滑",
        },

        _datas: [],
        /**
         * 列表数据
         * @property {[any]} datas
         */
        datas: {
            visible: false,
            get() {
                return this._datas;
            },
            set(value) {
                if (value != this._datas) {
                    this._selectIndexs.length = 0;
                }
                if (value && value.length > 0) {
                    this._datas = value;
                } else {
                    this._datas.length = 0;
                }
                this._appendIndex = 0;
                this.InvalidView();
                this.onDataChanged.emit();
            }
        },

        _selectIndexs: [],
        /**
         * 选中的索引
         * @property {[number]} selectIndexs
         */
        selectIndexs: {
            visible: false,
            get() {
                return this._selectIndexs;
            },
            set(value) {
                if (this._selectable) {
                    var isChanged = false;
                    if (value && value.length > 0) {
                        if (value.length > 1 && this._isMultipleSelection) {
                            this._selectIndexs = value;
                            isChanged = true;
                        } else if (value[0] != this._selectIndexs[0]) {
                            this._selectIndexs[0] = value[0];
                            isChanged = true;
                        }
                    } else {
                        isChanged = true;
                        this._selectIndexs.length = 0;

                    }
                    if (isChanged) {
                        this.updateItemSelect();
                        this.onSelectChanged.emit();
                    }
                }
            }
        },
        /**
         * 选中的索引
         * @property {number} selectIndex
         */
        selectIndex: {
            visible: false,
            get() {
                return this._selectIndexs && this._selectIndexs.length > 0 ? this._selectIndexs[0] : -1;
            },
            set(value) {
                if (value < 0) {
                    this.selectIndexs = null;
                } else if (value < this._datas.length) {
                    this.selectIndexs = [value];
                }
            }
        },
        /**
         * 
         * 选中改变事件
         * @property {EventTrigger} onSelectChanged
         */
        onSelectChanged: {
            default: null,
            type: EventTrigger,
            visible: false,
            serializable: false,
        },
        /**
         * 
         * 数据改变事件
         * @property {EventTrigger} onDataChanged
         */
        onDataChanged: {
            default: null,
            type: EventTrigger,
            visible: false,
            serializable: false,
        },
        /**
         * 
         *列表项点击事件 
         * 参数： index,data
         * @property {EventTrigger} onItemClick
         */
        onItemClick: {
            default: null,
            type: EventTrigger,
            visible: false,
            serializable: false,
        },
        /**
         * 
         *列表项事件
         * 参数： type:string,index,data
         * @property {EventTrigger} onItemEvent
         */
        onItemEvent: {
            default: null,
            type: EventTrigger,
            visible: false,
            serializable: false,
        },
        _appendIndex: 0,
        _itemRenderers: [],
    },
    ctor () {
        this.onSelectChanged = EventTrigger.get();
        this.onDataChanged = EventTrigger.get();
        this.onItemClick = EventTrigger.get();
        this.onItemEvent = EventTrigger.get();
    },

    onDestroy () {
        this.onSelectChanged.release();
        this.onDataChanged.release();
        this.onItemClick.release();
        this.onItemEvent.release();
        this.onSelectChanged = null;
        this.onDataChanged = null;
        this.onItemClick = null;
        this.onItemEvent = null;
        this._removeAllRenerer();
        this.unschedule(this._updateRenderer);
        DelayCall.cancel(this.updateView, this);
    },
    onEnable () {
        this.InvalidView();
    },
    onDisable () {
        this.unschedule(this._updateRenderer);
        this._appendingRenderer = false;
        DelayCall.cancel(this.updateView, this);
    },
    unuse () {
        this.onSelectChanged.offAll();
        this.onDataChanged.offAll();
        this.onItemClick.offAll();
        this.onItemEvent.offAll();
        this._selectIndexs.length = 0;
        this._datas.length = 0;
        this._selectable = false;
        this._isMultipleSelection = false;
        this._selectToggle = false;
        this._appendIndex = 0;
        this._removeAllRenerer();
        this.unschedule(this._updateRenderer);
        DelayCall.cancel(this.updateView, this);
    },
    /**
     * 添加多个数据
     * @method addDatas
     * @param {[any]} arr 
     */
    addDatas (arr) {
        if (arr && arr.length > 0) {
            if (this._datas == null || this._datas.length == 0) {
                this._datas = arr;
            } else {
                this._datas = [...this._datas, ...arr];
            }
            this.InvalidView();
            this.onDataChanged.emit();
        }
    },
    /**
     * 追加数据
     * @method addData
     * @param {any} value 
     */
    addData (value) {
        this._datas.push(value);
        this.InvalidView();
        this.onDataChanged.emit();
    },
    /**
     * 指定位置插入数据
     * @method addDataAt
     * @param {any} value 
     * @param {number} index 
     */
    addDataAt (value, index) {
        this._datas.splice(index, 0, value);
        var isSelectChanged = false;
        this._appendIndex = Math.min(this._appendIndex, index);
        for (var i = this._selectIndexs.length - 1; i >= 0; i--) {
            if (this._selectIndexs[i] >= index) {
                this._selectIndexs[i] = this._selectIndexs[i] + 1;
                isSelectChanged = true;
            }
        }
        this.InvalidView();
        if (isSelectChanged) {
            this.onSelectChanged.emit();
        }
        this.onDataChanged.emit();
    },
    /**
     * 删除指定位置
     * @method removeDataAt
     * @param {number} index 
     */
    removeDataAt (index) {
        if (index < this.datas.length) {
            this._datas.splice(index, 1);
            var isSelectChanged = false;
            this._appendIndex = Math.min(this._appendIndex, index);
            for (var i = this._selectIndexs.length - 1; i >= 0; i--) {
                if (this._selectIndexs[i] > index) {
                    this._selectIndexs[i] = this._selectIndexs[i] - 1;
                    isSelectChanged = true;
                } else if (this._selectIndexs[i] == index) {
                    this._selectIndexs.splice(i, 1);
                    isSelectChanged = true;
                }
            }
            this.InvalidView();
            if (isSelectChanged)
                this.onSelectChanged.emit();
            this.onDataChanged.emit();
        }
    },
    /**
     * 更新指定索引的项
     * @method updateItem
     * @param {number} index 
     */
    updateItem (index) {
        if (index < this._datas.length) {
            for (var i = 0; i < this._itemRenderers.length; i++) {
                var renderer = this._itemRenderers[i];
                if (renderer.index == index) {
                    renderer._setData(this, index, this._datas[index], renderer.isSelected)
                    break;
                }
            }
        }
    },
    /**
     * 刷新所有项
     * @method refresh
     */
    refresh () {
        this._appendIndex = 0;
        this.InvalidView();
    },
    /**
     * 更新选中
     */
    updateItemSelect () {
        for (var i = this._selectIndexs.length - 1; i >= 0; i--) {
            if (this._selectIndexs[i] > this._datas.length && this._selectIndexs[i] < 0) {
                this._selectIndexs.splice(i, 1);
            }
        }
        for (var i = 0; i < this._itemRenderers.length; i++) {
            var renderer = this._itemRenderers[i];
            renderer._setSelected(this._selectIndexs.indexOf(renderer.index) != -1);
        }
    },
    InvalidView () {
        DelayCall.addCall(this.updateView, this);
    },
    updateView () {
        this.removeRenererAfter(this._datas.length);
        this._appendRenderer();
    },
    _appendRenderer () {
        if (this._appendingRenderer) return;
        var len = this._datas.length;
        if (this.async) {
            if (this._appendIndex < len) {
                this._appendingRenderer = true;
                this.schedule(this._updateRenderer, 0);
            } else {
                this._updateRenderer();
            }
        } else {
            for (var i = this._appendIndex, n = len; i < n; i++) {
                this.updateRenderer(i);
            }
            this.unschedule(this._updateRenderer);
            this._appendIndex = len;
            this._appendingRenderer = false;
        }
    },
    _updateRenderer () {
        var len = this._datas.length;
        if (this._appendIndex < len) {
            for (var i = 0; i < 3; i++) {
                this.updateRenderer(this._appendIndex);
                this._appendIndex++;
                if (this._appendIndex >= len) break;
            }
        } else {
            this.unschedule(this._updateRenderer);
            this._appendIndex = len;
            this._appendingRenderer = false;
        }
    },
    /**
     * 被重载来删除多余的项
     * @method removeRenererAfter
     * @param {number} index 
     */
    removeRenererAfter (index) {

    },
    _removeAllRenerer () {
        for (var i = 0; i < this._itemRenderers.length; i++) {
            var renderer = this._itemRenderers[i];
            if (renderer.node) {
                NodeTool.hide(renderer.node, false);
            }
        }
        this._itemRenderers.length = 0;
    },
    getRenderer () {
        let prefab = this._itemRenderer;
        let key = prefab.name + "#" + prefab.data._prefab.fileId;
        let node = PoolManager.get(key);
        if (!node) {
            node = cc.instantiate(prefab);
        }
        node.setPosition(0, 0);
        return node.getComponent(ItemRenderer);
    },
    /**
     * 被重载，来更新一项
     * @method updateRenderer
     * @param {number} index 
     */
    updateRenderer (index) {

    },
    _itemClick (renderer) {
        var index = renderer.index;
        var data = renderer.data;
        this.onItemClick.emit(index, data);
        if (this._selectable) {
            var arr = this._selectIndexs;
            if (arr.length == 0) {
                renderer._setSelected(true);
                arr.push(index);
                this.onSelectChanged.emit();
            } else if (this.isMultipleSelection == false) {
                if (arr[0] != index) {
                    arr[0] = index;
                    this.updateItemSelect();
                    this.onSelectChanged.emit();
                } else if (this._selectToggle) {
                    arr.length = 0;
                    renderer._setSelected(false);
                    this.onSelectChanged.emit();
                }
            } else {
                var i = arr.indexOf(index);
                if (i == -1) {
                    arr.push(index);
                    renderer._setSelected(true);
                    this.onSelectChanged.emit();
                } else if (this._selectToggle) {
                    arr.splice(i, 1);
                    renderer._setSelected(false);
                    this.onSelectChanged.emit();
                }
            }
        }
    }
});

module.exports = BaseList;