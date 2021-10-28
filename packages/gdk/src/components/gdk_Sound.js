/** 
 * 场景上的声音，按钮，效果等， 只用于短暂的音效，背景音请使用Music
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-06-06 16:15:01
 */

var SoundManager = require("../managers/gdk_SoundManager");
var SoundId = require("../enums/gdk_SoundId");
var Tools = require("../core/gdk_Tool");
var TriggerType = cc.Enum({
    NONE: -1,
    ENABLE: -1,
    DISABLE: -1,
    DESTROY: -1,
    TOUCH_START: -1,
    TOUCH_MOVE: -1,
    TOUCH_END: -1,
    MOUSE_ENTER: -1,
});

var Sound = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(Component)/Sound',
        disallowMultiple: true,
    },
    properties: {
        _soundName: "",
        _sound: {
            get() {
                return SoundId[this._soundName] || 0;
            },
            set(value) {
                this._soundName = SoundId[value];
            },
            type: SoundId,
            visible: true,
            serializable: true,
            tooltip: CC_DEV && "如果没可选值，请先配置SoundId"
        },
        _audioClip: {
            default: null,
            type: cc.AudioClip,
            visible: true,
            serializable: true,
            tooltip: CC_DEV && "设置此值会覆盖sound的值,推荐使用sound设置，因为设置这里会影响场景加载速度，场景会把cc.AudioClip预加载进来"
        },
        _trigger: {
            default: TriggerType.NONE,
            type: TriggerType,
            visible: true,
            serializable: true,
        }
    },
    onLoad () {
        switch (this._trigger) {
            case TriggerType.TOUCH_START:
                this.node.on("touchstart", this.play, this);
                break;

            case TriggerType.TOUCH_MOVE:
                this.node.on("touchmove", this.play, this);
                break;

            case TriggerType.TOUCH_END:
                this.node.on("touchend", this.play, this);
                break;

            case TriggerType.MOUSE_ENTER:
                this.node.on("mouseenter", this.play, this);
                break;
        }
    },
    play () {
        if (this._audioClipm) {
            SoundManager.playAudio(this._audioClip);
        } else {
            let resId = Tools.getResIdByNode(this.node);
            SoundManager.play(resId, SoundId.getValue(this._soundName));
        }
    },
    onEnable () {
        if (this._trigger == TriggerType.ENABLE) {
            this.play()
        }
    },
    onDisable () {
        if (this._trigger == TriggerType.DISABLE) {
            this.play();
        }
    },
    onDestroy: function () {
        if (this._trigger == TriggerType.DESTROY) {
            this.play();
        }
    },
});


module.exports = Sound;