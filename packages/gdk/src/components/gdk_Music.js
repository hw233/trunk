/** 
 * 背景音乐,同一时间只有一个背景音乐在播
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-06-06 16:14:48
 */

var MusicManager = require("../managers/gdk_MusicManager");
var MusicId = require("../enums/gdk_MusicId");
var Music = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(Component)/Music',
        disallowMultiple: false,
    },
    properties: {
        _musicName: "",
        _music: {
            get() {
                return MusicId[this._musicName] || 0;
            },
            set(value) {
                this._musicName = MusicId[value];
            },
            type: MusicId,
            visible: true,
            serializable: true,
            tooltip: CC_DEV && "如果没可选值，请先配置MusicId"
        },
        _audioClip: {
            default: null,
            type: cc.AudioClip,
            visible: true,
            serializable: true,
            tooltip: CC_DEV && "设置此值会覆盖musics的值,推荐使用musics设置，因为设置这里会影响场景加载速度，场景会把cc.AudioClip预加载进来"
        },
        _volume: {
            default: 1,
            visible: true,
            serializable: true,
        },
    },

    setMusic (v) {
        this._musicName = v;
        this.enabled && MusicManager._addMusic(this);
    },
    onEnable () {
        MusicManager._addMusic(this);
    },
    onDisable () {
        MusicManager._removeMusic(this);
    },
    onDestroy: function () {
        MusicManager._removeMusic(this);
    },
});

module.exports = Music;