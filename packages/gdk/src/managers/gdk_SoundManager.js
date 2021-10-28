/** 
 * 场景上的声音，按钮，效果等， 只用于短暂的音效，背景音请使用Music
 * 需要在场景上挂一个Sound组件来播放，可以直接调用此类API播放
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-05-04 16:24:03
 */

var SoundId = require("../enums/gdk_SoundId");
var ResourManager = require("./gdk_ResourceManager");
var PanelManager = require("./gdk_PanelManager");
var DelayCall = require("../core/gdk_DelayCall");

var SoundManager = {
    _volume: 1,
    _isOn: true,
    _isPause: false,
    _stopQueue: [],

    prefix: "sound",

    /**
     * 最多可以同时播放多少个声音，默认10个，再多人耳也听不出，浪费资源
     */
    get maxAudioCount() {
        return this._maxAudioCount;
    },
    set maxAudioCount(value) {
        this._maxAudioCount = value;
    },
    /** 开关 */
    get isOn() {
        return this._isOn && cc.audioEngine.getEffectsVolume() > 0;
    },
    set isOn(value) {
        if (value) {
            this.on();
        } else {
            this.off();
        }
    },
    /**音量 */
    get volume() {
        return this._volume;
    },
    set volume(value) {
        this.setVolume(value);
    },

    getVolume () {
        return this._volume;
    },
    setVolume (value) {
        if (this._volume == value) {
            return;
        }
        this._volume = value;
        if (this.isPaused) {
            value = 0;
        }
        cc.audioEngine.setEffectsVolume(value);
    },
    on () {
        this._isOn = true;
    },
    off () {
        this._isOn = false;
        this.stop();
    },

    /**
     * 停止所有音效
     */
    stop () {
        cc.audioEngine.stopAllEffects();
    },
    /**
     * 播放声音带名后辍，自动组装prefix
     */
    play (panelId, name, release) {
        if (!this.isOn || this._isPause) return;
        if (name instanceof cc.AudioClip) {
            this.playAudio(name, release, panelId);
            return;
        }
        if (typeof name == "number") {
            name = SoundId.getValue(SoundId[name]);
        }
        if (!name) {
            return;
        }
        let url = `${this.prefix}${name}`;
        let clip = ResourManager.getResByUrl(url, cc.AudioClip);
        if (clip) {
            this.playAudio(clip, release, panelId);
        } else {
            ResourManager.loadRes(panelId, url, cc.AudioClip, (clip) => {
                if (panelId == 'Scene#' + cc.director.getScene().name ||
                    PanelManager.isOpenOrOpening(panelId)) {
                    // panelId为当前场景或已打开的面板
                    this.playAudio(clip, release, panelId);
                } else if (release) {
                    // 回收资源
                    ResourManager.releaseRes(panelId, clip);
                }
            });
        }
    },
    /**
     * 播放AudioClip
     * @param {*} audioClip 
     * @param {*} release
     * @param {*} panelId
     */
    playAudio (audioClip, release, panelId) {
        if (!this.isOn || this._isPause) {
            if (release && panelId) {
                ResourManager.releaseRes(panelId, audioClip);
            }
            return;
        }
        let audioId = cc.audioEngine.playEffect(audioClip, false);
        cc.audioEngine.setFinishCallback(audioId, () => {
            if (release && panelId) {
                ResourManager.releaseRes(panelId, audioClip);
                return;
            }
            this._stopQueue.push(audioId);
            DelayCall.addCall(this._stopAudioProc, this, 0);
        });
    },

    _pausedCallback () {
        this._isPause = true;
        cc.audioEngine.setEffectsVolume(0);
        this.stop();
    },

    _restoreCallback () {
        this._isPause = false;
        cc.audioEngine.setEffectsVolume(this._volume);
    },

    _stopAudioProc () {
        let len = this._stopQueue.length;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                cc.audioEngine.stopEffect(this._stopQueue[i]);
            }
            this._stopQueue.length = 0;
        }
    }
};

// 切到后台时静音
// if (!CC_EDITOR) {
//     cc.game.on(cc.game.EVENT_HIDE, SoundManager._pausedCallback, SoundManager);
//     cc.game.on(cc.game.EVENT_SHOW, SoundManager._restoreCallback, SoundManager);
// }

module.exports = SoundManager;