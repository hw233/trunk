var ButtonSoundId = require("../../enums/gdk_ButtonSoundId");
var SoundManager = require("../../managers/gdk_SoundManager");
var Tools = require("../../core/gdk_Tool");
/**
 * 播放声接扭
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-06-06 16:32:47
 */
var SoundButton = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(Button)/SoundButton',
        disallowMultiple: false,
    },

    properties: {
        _soundName: "",
        _sound: {
            get() {
                return ButtonSoundId[this._soundName] || 0;
            },
            set(value) {
                this._soundName = ButtonSoundId[value];
            },
            type: ButtonSoundId,
            visible: true,
            serializable: true,
            tooltip: CC_DEV && "如果没可选值，请先配置ButtonSoundId"
        },
        _audioClip: {
            default: null,
            type: cc.AudioClip,
            visible: true,
            serializable: true,
            tooltip: CC_DEV && "设置此值会覆盖sound的值,推荐使用sound设置，因为设置这里会影响场景加载速度，场景会把cc.AudioClip预加载进来"
        },
    },

    onLoad () {
        let btn = this.node.getComponent(cc.Button);
        if (btn) {
            this.node.on("click", this.onClick, this);
        } else {
            this.node.on("touchstart", this.onClick, this);
        }
    },
    onClick () {
        if (this._audioClip) {
            SoundManager.playAudio(this._audioClip);
        } else {
            let resId = Tools.getResIdByNode(this.node);
            SoundManager.play(resId, ButtonSoundId.getValue(this._soundName));
        }
    },
});

module.exports = SoundButton;