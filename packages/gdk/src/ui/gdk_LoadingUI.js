/**
 * 加载界面
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-25 19:21:35
 */
var i18n = require("../Tools/gdk_i18n");
var NodeTool = require("../Tools/gdk_NodeTool");
var LoadingUI = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(UI)/LoadingUI',
        disallowMultiple: false
    },
    properties: {
        //////     需要在属性面板上绑定的UI属性    ////////
        _label: {
            default: null,
            type: cc.Label,
            serializable: true,
            visible: true,
        },
        _progressBar: {
            default: null,
            type: cc.ProgressBar,
            serializable: true,
            visible: true,
        },
        /////////////
        _info: "",
        /**
         * 显示加载信息
         * %0 ：已加载数
         * %1 : 总量
         * %2 : 百分比
         * %% : %
         * @property {string} info
         */
        info: {
            get: function () {
                return this._info;
            },
            set: function (value) {
                this._info = value;
                this._updateInfo();
            },
            visible: false,
        },
        _loaded: 0,
        /**
         * 已加载数
         * @property {string} loaded
         */
        loaded: {
            get: function () {
                return this._loaded;
            },
            set: function (value) {
                this._loaded = value;
                this._updateInfo();
            },
            visible: false,
        },
        _total: 100,
        /**
         * 总量
         * @property {string} total
         */
        total: {
            get: function () {
                return this._total;
            },
            set: function (value) {
                this._total = value;
                this._updateInfo();
            },
            visible: false,
        }
    },
    onEnable () {
        this._updateInfo();
    },
    unuse () {
        this._label = "";
        this._loaded = -1;
        this._total = -1;
        if (this._progressBar) this._progressBar.progress = 0.0;
        NodeTool.cancelCallBeforeDraw(this._updateInfoLate, this);
    },

    _updateInfo () {
        NodeTool.callBeforeDraw(this._updateInfoLate, this);
    },
    _updateInfoLate () {
        var p = 0.0;
        if (this._total > 0) {
            p = this._loaded / this._total * 100;
            if (this._label) {
                var s = i18n.t(this._info);
                s = s.replace("{0}", this._loaded)
                    .replace("{1}", this._total)
                    .replace("{2}", p.toFixed(2))
                    .replace("{3}", p >> 0);
                this._label.string = s;
            }
        }
        if (this._progressBar) {
            this._progressBar.progress = p * 0.01;
        }
    },
});

module.exports = LoadingUI;