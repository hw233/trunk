var EventTrigger = require("../../core/gdk_EventTrigger");
/**
 * 列表项
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-03-21 10:53:21
 */
var ItemRenderer = cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'gdk(UI)/ItemRenderer',
        disallowMultiple: false,
    },
    properties: {
        selectClip: {
            default: null,
            type: cc.Node,
        },
        _data: null,
        /**
         * 列表项数据
         * @property {any} data
         */
        data: {
            visible: false,
            get() {
                return this._data;
            }
        },
        _index: -1,
        /**
         * 列表项索引
         * @property {number} index
         */
        index: {
            visible: false,
            get() {
                return this._index;
            }
        },
        _list: null,
        /**
         * 列表对象
         * @property {BaseList} list
         */
        list: {
            visible: false,
            get() {
                return this._list;
            }
        },
        _isSelected: null,
        /**
         * 是否选中
         * @property {booble} isSelected
         */
        isSelected: {
            visible: false,
            get() {
                return this._isSelected;
            }
        },
        /**
         * 选中事件
         * @property {EventTrigger} isSelected
         */
        onSelectChanged: {
            default: null,
            type: EventTrigger,
            visible: false,
            serializable: false,
        },
        /**
         * 数据改变事件
         * @property {EventTrigger} onDataChanged
         */
        onDataChanged: {
            default: null,
            type: EventTrigger,
            visible: false,
            serializable: false,
        },


    },
    ctor () {
        this.onSelectChanged = EventTrigger.get();
        this.onDataChanged = EventTrigger.get();
    },

    onLoad () {
        this.node.on("touchend", this._triggerClick, this);
    },
    onDestroy () {
        this.onSelectChanged.release();
        this.onDataChanged.release();
        this.onSelectChanged = null;
        this.onDataChanged = null;
    },
    unuse () {
        this.onSelectChanged.offAll();
        this.onDataChanged.offAll();
        this._index = -1;
        this._data = null;
        this._list = null;
        this._isSelected = false;
    },


    _setData (list, index, data, isSelected) {
        this._list = list;
        this._data = data;
        this._index = index;
        this._isSelected = isSelected;
        this.updateView();
        if (this.selectClip) {
            this.selectClip.active = this._isSelected;
        }
        this.onDataChanged.emit();
    },
    _setSelected (value) {
        if (this._isSelected == value) {
            return;
        }
        this._isSelected = value;
        if (this.selectClip) {
            this.selectClip.active = this._isSelected;
        }
        // this.updateView();
        this.onSelectChanged.emit();
    },
    _triggerClick () {
        if (this._list) {
            this._list._itemClick(this);
        }
    },
    /**
     * 派发列表项事件
     * @method triggerItemEvent
     * @param {string} type 
     */
    triggerItemEvent (type) {
        if (this.list) {
            this.list.onItemEvent.emit(type, this.index, this.data);
        }
    },
    /**
     * 被重载来更新显示
     * @method updateView
     */
    updateView () {

    },
});

module.exports = ItemRenderer;