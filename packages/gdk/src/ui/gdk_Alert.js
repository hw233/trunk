var BasePanel = require("./gdk_BasePanel");
var DelayCall = require("../core/gdk_DelayCall");
var NodeTool = require("../Tools/gdk_NodeTool");
var EventTrigger = require("../core/gdk_EventTrigger");
var i18n = require("../Tools/gdk_i18n");
var _tagDic = {};
/**
 * 警告窗
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-12-30 19:48:25
 */

var Alert = cc.Class({
    extends: BasePanel,
    editor: {
        menu: 'gdk(UI)/Alert',
        disallowMultiple: false,
    },
    properties: {
        //////     需要在属性面板上绑定的UI属性    ////////
        /**
         * 文本组件
         * @property {cc.Label} _textField
         */
        _textField: {
            default: null,
            type: cc.Label,
            serializable: true,
            visible: true,
        },
        _icon: {
            default: null,
            type: cc.Sprite,
            serializable: true,
            visible: true,
        },
        _defalutButton: {
            default: null,
            type: cc.Button,
            serializable: true,
            visible: true,
        },
        _normalButton: {
            default: null,
            type: cc.Button,
            serializable: true,
            visible: true,
        },

        //////////// 

        _text: "",
        text: {
            get: function () {
                return this._text;
            },
            set: function (value) {
                if (this._text == value)
                    return;
                this._text = value;
                this._updateText();
                this.onTextChanged.emit();
            },
            visible: false,
        },

        _iconPath: "",
        /**
         * @property {string|cc.SpriteFrame} icon
         */
        icon: {
            get: function () {
                return this._iconPath;
            },
            set: function (value) {
                if (this._iconPath == value)
                    return;
                this._iconPath = value;
                if (this._icon) {

                    if (this._iconPath instanceof cc.SpriteFrame)
                        this._icon.SpriteFrame = this._iconPath;
                    else {
                        this.loadRes(this._iconPath, cc.SpriteFrame, this._onIconLoaded);
                    }
                }
            },
            visible: false,
        },
        _buttonStrs: null,
        buttons: {
            get: function () {
                return this._buttonStrs;
            },
            set: function (value) {
                this._buttonStrs = value;
                this._updateButtons();
            },
            visible: false,
        },
        _tag: null,
        tag: {
            get() {
                return this._tag;
            },
            set(value) {
                if (this._tag)
                    delete _tagDic[this._tag];
                this._tag = value;
                _tagDic[this._tag] = this;
            },
            visible: false,
        },
        _defaultButtonIndex: 0,
        defaultButtonIndex: {
            get() {
                return this._defaultButtonIndex;
            },
            set(value) {
                if (this._defaultButtonIndex = value)
                    return;
                this._defaultButtonIndex = value;
                this._updateButtons();
            },
            visible: false,
        },


        _buttonLetToRight: {
            default: false,
            serializable: true,
            visible: true,
        },
        buttonLetToRight: {
            get() {
                return this._buttonLetToRight;
            },
            set(value) {
                if (this._buttonLetToRight = value)
                    return;
                this._buttonLetToRight = value;
                this._updateButtons();
            },
            visible: false,
        },
        onTextChanged: {
            default: null,
            serializable: false,
            visible: false,
        },
        _buttonArr: [],
        _buttonParent: null,
        _defaultIcon: null,
        _isLoaded: false,
        _timeoutButtonIndex: 0,
        _timeout: 0,
    },
    statics: {


        getByTag (tag) {
            return _tagDic[tag];
        }
    },
    // LIFE-CYCLE CALLBACKS:
    ctor () {
        this.onTextChanged = EventTrigger.get();
    },
    onLoad () {
        this._buttonArr.push(this._defalutButton, this._normalButton)
        this._buttonParent = this._defalutButton.node.parent;
        //this._textField.string = "";
        this._isLoaded = true;

        this._defalutButton.node.active = false;
        this._normalButton.node.active = false;
        if (this._icon)
            this._defaultIcon = this._icon.spriteFrame;
        this._updateButtons();
    },
    onDestroy () {
        if (this._tag) {
            delete _tagDic[this._tag];
            this._tag = null;
        }
        this.onTextChanged.release();
        this.onTextChanged = null;

    },
    setTimeout (timeout, timeoutButton = -1) {
        this._timeout = timeout;

        this._timeoutButtonIndex = timeoutButton;

    },
    /* 过场景即使不销毁也会调用onDisable
        onDisable() {
            if (this._tag) {
                delete _tagDic[this._tag];
                this._tag = null;
            }
        },
        */
    unuse () {
        // 调用super的方法
        let _super = cc.js.getSuper(this.__proto__.constructor);
        if (_super && _super.prototype && _super.prototype.unuse) {
            _super.prototype.unuse.call(this);
        }
        // this._super();
        this._iconPath = null;
        if (this._icon)
            this._icon.spriteFrame = this._defaultIcon;
        this._buttonStrs = null;
        this._text = "";
        this._textField.string = "";
        this._defaultButtonIndex = 0;
        this._buttonLetToRight = false;
        this._timeout = 0;

        if (this._tag) {
            delete _tagDic[this._tag];
            this._tag = null;
        }
        this.onTextChanged.offAll();
    },
    _onIconLoaded: (err, spriteFrame) => {
        if (err) {
            cc.error(err.message || err);
            return;
        }
        if (this._icon)
            this._icon.spriteFrame = spriteFrame;
    },
    _updateText () {
        NodeTool.callAfterUpdate(this._updateTextLate, this);
    },
    _updateTextLate () {
        this._textField.string = i18n.t(this._text);
    },

    _updateButtons () {
        NodeTool.callAfterUpdate(this._updateButtonsLate, this);
    },
    update (dt) {

        if (this._timeout > 0) {
            let index = this._timeoutButtonIndex;

            this._timeout -= dt;


            if (index >= 0) {
                for (let i = 0; i < this._buttonArr.length; i++) {
                    let button = this._buttonArr[i];
                    if (button.__time__) {
                        if (i == index) {
                            button.__time__.string = Math.round(this._timeout);
                            button.__time__.node.active = this._timeout > 0;
                        } else {
                            button.__time__.node.active = false;
                        }
                    }
                }
            }
            if (this._timeout < 0) {
                this._timeout = 0;
                this.close(this.index);
            }

        }


    },
    _updateButtonsLate () {
        if (this._isLoaded == false || cc.isValid(this.node) == false)
            return;
        var index = this._buttonArr.indexOf(this._defalutButton);
        if (this._defaultButtonIndex < 0) {
            if (this._defalutButton.node.parent)
                this._defalutButton.node.removeFromParent(false);
            if (index != -1)
                this._buttonArr.splice(index, 1);
        } else {
            if (this._defalutButton.node.parent == null)
                this._defalutButton.node.parent = this._buttonParent
            if (index == -1)
                this._buttonArr.add(this._defalutButton);
        }
        var buttonStrCount = this._buttonStrs ? this._buttonStrs.length : 0;
        while (this._buttonArr.length < buttonStrCount) {
            var node = cc.instantiate(this._normalButton.node);
            node.parent = this._buttonParent;
            var button = node.getComponent(cc.Button);
            this._buttonArr.push(button);
        }
        if (this._defaultButtonIndex >= 0) {
            index = this._buttonArr.indexOf(this._defalutButton);
            if (index != this._defaultButtonIndex) {
                this._buttonArr.splice(index, 1);
                if (this._defaultButtonIndex < this._buttonArr.length)
                    this._buttonArr.splice(this._defaultButtonIndex, 0, this._defalutButton);
                else
                    this._buttonArr.push(this._defalutButton);
            }
        }

        for (let i = 0, n = this._buttonArr.length; i < n; i++) {
            let button = this._buttonArr[i];
            let s = this._buttonStrs ? this._buttonStrs[i] : null;
            button.node.targetOff(this);
            if (s) {
                s = i18n.t(s);
                button.node.active = true;
                if (this._buttonLetToRight)
                    button.node.setSiblingIndex(i);
                else
                    button.node.setSiblingIndex(n - i - 1);
                if (button.__label__ == null) {
                    button.__label__ = cc.find("Label", button.node);
                    if (button.__label__)
                        button.__label__ = button.__label__.getComponent(cc.Label);
                }

                if (button.__label__ == null)
                    button.__label__ = button.node.getComponentInChildren(cc.Label);
                if (button.__label__) {
                    button.__label__.string = s || "";
                }
                if (button.__time__ == null) {
                    button.__time__ = cc.find("Time", button.node);
                    if (button.__time__)
                        button.__time__ = button.__time__.getComponent(cc.Label);
                }

                if (button.__time__) {
                    button.__time__.node.active = false;
                }
                button.node.on("click", function () {
                    this.close(i);
                }, this);
            } else {
                button.node.active = false;
            }
        }
    },
});

module.exports = Alert;