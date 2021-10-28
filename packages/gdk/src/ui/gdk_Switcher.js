var EventTrigger = require("../core/gdk_EventTrigger");

/**
 * 
 * @author
 */

var Switcher = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(UI)/Switcher',
        disallowMultiple: false,
        requireComponent: cc.Button
    },
    properties: {
        /**
         * !#en When this value is true, the check mark component will be enabled, otherwise
         * the check mark component will be disabled.
         * !#zh 如果这个设置为 true，则 check mark 组件会处于 enabled 状态，否则处于 disabled 状态。
         * @property {Boolean} isOn
         */
        isOn: {
            default: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.toggle.isOn',
            notify: function () {
                this._updateCheckMark();
                this.onToggle.emit(this.isOn);
            }
        },


        /**
         * !#en The image used for the checkmark.
         * !#zh Toggle 处于选中状态时显示的图片
         * @property {Sprite} onNode
         */
        onNode: {
            default: null,
            type: cc.Node,
            tooltip: CC_DEV && 'i18n:COMPONENT.toggle.onNode'
        },

        /**
         * !#en The image used for the checkmark.
         * !#zh Toggle 处于未选中状态时显示的图片
         * @property {Sprite} onNode
         */
        offNode: {
            default: null,
            type: cc.Node,
            tooltip: CC_DEV && '处于未选中状态时显示的图片'
        },

        onToggle: {
            default: null,
            visible: false,
            serializable: false,
        }
    },
    ctor () {
        this.onToggle = EventTrigger.get();
    },
    start () {
        this._updateCheckMark();
    },
    onDestroy () {
        this.onToggle.release();
        this.onToggle = null;
    },
    onEnable: function () {

        if (!CC_EDITOR) {
            this._registerToggleEvent();
        }

    },

    onDisable: function () {

        if (!CC_EDITOR) {
            this._unregisterToggleEvent();
        }

    },
    _updateCheckMark: function () {
        if (this.onNode) {
            this.onNode.active = !!this.isOn;

        }
        if (this.offNode)
            this.offNode.active = !this.isOn;

    },

    _registerToggleEvent: function () {
        this.node.on('click', this.toggle, this);
    },

    _unregisterToggleEvent: function () {
        this.node.off('click', this.toggle, this);
    },

    /**
     * !#en Make the toggle button checked.
     * !#zh 使 toggle 按钮处于选中状态
     * @method check
     */
    check: function () {

        this.isOn = true;
    },

    /**
     * !#en Make the toggle button unchecked.
     * !#zh 使 toggle 按钮处于未选中状态
     * @method uncheck
     */
    uncheck: function () {

        this.isOn = false;

    },
    toggle () {
        this.isOn = !this.isOn;
    }
});

module.exports = Switcher;