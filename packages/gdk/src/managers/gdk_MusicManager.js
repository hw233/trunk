/** 
 * 背景音乐,同一时间只有一个背景音乐在播,
 * 不直接使用，只用于设置音乐开关和声量
 * 需要在场景上挂一个Music组件来播放
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-05-04 16:24:18
 */

const MusicId = require("../enums/gdk_MusicId");
const DelayCall = require("../core/gdk_DelayCall");
const ResourManager = require("./gdk_ResourceManager");
const PanelManager = require("./gdk_PanelManager");
const Tools = require("../core/gdk_Tool");

var MusicManager = {

    _musices: [],
    _isOn: true,
    _isPause: false,
    _url: null,
    _volume: 1,
    prefix: "music",

    /** 开关 */
    get isOn() {
        return this._isOn && cc.audioEngine.getMusicVolume() > 0;
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
        return this.getVolume();
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
        cc.audioEngine.setMusicVolume(value);
    },
    on () {
        this._isOn = true;
        this.isOn && this._updateMusic();
    },
    off () {
        this._isOn = false;
        this._url = null;
        cc.audioEngine.stopMusic();
    },
    /**当前正在播 */
    getCurrent () {
        let n = this._musices.length;
        if (n > 0) {
            return this._musices[n - 1];
        }
        return null;
    },
    /**停止 */
    stop () {
        this._url = null;
        cc.audioEngine.stopMusic();
    },

    _addMusic (m) {
        let index = this._musices.indexOf(m);
        if (index != -1) {
            this._musices.splice(index, 1);
        }
        this._musices.push(m);
        DelayCall.addCall(this._updateMusic, this);
    },

    _removeMusic (m) {
        let index = this._musices.indexOf(m);
        if (index != -1) {
            if (index == this._musices.length - 1) {
                this._musices.length--;
            } else {
                this._musices.splice(index, 1);
            }
            DelayCall.addCall(this._updateMusic, this);
        }
    },
    _updateMusic () {
        if (cc.game.isPaused()) {
            return;
        }
        let music = this.getCurrent();
        if (this.isOn && music) {
            if (music._audioClip) {
                if (this._url != music._audioClip.nativeUrl) {
                    this._url = music._audioClip.nativeUrl;
                    cc.audioEngine.playMusic(music._audioClip, true);
                }
            } else {
                let name = MusicId.getValue(music._musicName) || music._musicName;
                if (name) {
                    let url = this.prefix + name;
                    let resId = Tools.getResIdByNode(music.node);
                    if (this._url != name) {
                        this._url = name;
                        ResourManager.loadRes(resId, url, cc.AudioClip, (clip) => {
                            if (!cc.isValid(music.node)) return;
                            if (!music.enabled) return;
                            if (!this.isOn || this._isPause) return;
                            if (this._url == name) {
                                if (resId == 'Scene#' + cc.director.getScene().name ||
                                    PanelManager.isOpenOrOpening(resId)) {
                                    // resId为当前场景或已打开的面板
                                    cc.audioEngine.playMusic(clip, true);
                                }
                            }
                        });
                    } else {
                        // 防止音乐资源被回收
                        ResourManager.loadRes(resId, url, cc.AudioClip);
                    }
                } else {
                    this._url = null;
                    cc.audioEngine.stopMusic();
                }
            }
        } else {
            this._url = null;
            cc.audioEngine.stopMusic();
        }
    },

    _pausedCallback () {
        this._isPause = true;
        cc.audioEngine.setMusicVolume(0);
        cc.audioEngine.pauseMusic();
    },

    _restoreCallback () {
        this._isPause = false;
        cc.audioEngine.setMusicVolume(this._volume);
        if (this.isOn && this._url) {
            cc.audioEngine.resumeMusic();
        }
    },
};

// 切到后台时静音
// if (!CC_EDITOR) {
//     cc.game.on(cc.game.EVENT_HIDE, MusicManager._pausedCallback, MusicManager);
//     cc.game.on(cc.game.EVENT_SHOW, MusicManager._restoreCallback, MusicManager);
// }

module.exports = MusicManager;