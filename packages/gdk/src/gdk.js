/**
 * game developer kit;
 * 游戏开发工具
 * 只要var gdk=require("gdk");
 * 就可以使用里面的所有功能
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-06-10 11:27:56
 */

var gdk = {
    /**
     * 版本号
     * @property {string} version
     */
    version: require("./gdk_Version"),

    // 一些默认设置项
    fontFamily: 'SimHei',

    // -----------  const  ---------------
    HideMode: require("./const/gdk_HideMode"),
    MessageMode: require("./const/gdk_MessageMode"),
    SlideEffectMode: require("./const/gdk_SlideEffectMode"),
    EaseType: require("./const/gdk_EaseType"),
    SizeType: require("./const/gdk_SizeType"),
    // -------- core  目录下为最核心的功能模块，都不能使用与任何框架相关的API,方便迁移重用，如cc   --------
    /**
     * 延时调用
     * @namespace DelayCall
     */
    DelayCall: require("./core/gdk_DelayCall"),
    /**
     * 计时器
     * @namespace Timer
     */
    Timer: require("./core/gdk_Timer"),
    /**
     * 有用的工具
     * @namespace Tool
     */
    Tool: require("./core/gdk_Tool"),
    /**
     *  对象池，大多数情况下请使用gdk.PoolManager
     * @class Pool
     */
    Pool: require("./core/gdk_Pool"),
    /**
     *  事件对象
     * @class Event
     */
    Event: require("./core/gdk_Event"),
    /**
     *  事件派发器
     * @class EventTrigger
     */
    EventTrigger: require("./core/gdk_EventTrigger"),
    /**
     *  缓存单个对象使用， 大多数情况下请使用gdk.PoolManager
     * @namespace Cache
     */
    Cache: require("./core/gdk_Cache"),



    //  -------- tools ---------

    /**
     *  绑定操作
     * @namespace Binding
     */
    Binding: require("./Tools/gdk_Binding"),

    /**
     *  同步操作
     * @namespace Wait
     */

    NodeTool: require("./Tools/gdk_NodeTool"),
    /**
     *  
     * @namespace i18n
     */
    LanguageId: require('./enums/gdk_LanguageId'),
    LanguageData: require('./i18/LanguageData'),
    i18n: require("./Tools/gdk_i18n"),

    /**
     *  
     * @namespace log
     */
    Log: require("./Tools/gdk_Log"),
    LogLevel: require("./const/gdk_LogLevel"),
    SizeTool: require("./Tools/gdk_SizeTool"),
    //-------- utils --------
    //--------config --------
    Enum: require("./enums/gdk_Enum"),
    PanelId: require("./enums/gdk_PanelId"),
    SoundId: require("./enums/gdk_SoundId"),
    ButtonSoundId: require("./enums/gdk_ButtonSoundId"),
    MusicId: require("./enums/gdk_MusicId"),
    SceneId: require("./enums/gdk_SceneId"),
    ResourceId: require("./enums/gdk_ResourceId"),
    EventId: require("./enums/gdk_EventId"),
    // -------- managers --------
    /**
     *  UI管理器，UI的大多API都在里面
     * 别名： gui
     * @namespace GUIManager
     */
    GUIManager: require("./managers/gdk_GUIManager"),
    /**
     *  面板管理器
     * 别名： panel
     * @namespace PanelManager
     */
    PanelManager: require("./managers/gdk_PanelManager"),
    /**
     *  事件管理器，是一个事件派发和监听中心
     * 别名： e
     * @namespace EventManager
     */
    EventManager: require("./managers/gdk_EventManager"),
    /**
     *  对象池管理器，也提供只缓存单个对象的API
     * 别名： pool
     * @namespace PoolManager
     */
    PoolManager: require("./managers/gdk_PoolManager"),
    /**
     *  弹出面板管理器， 大多数情况下请使用gdk.GUIManager.addPopup,
     * 别名： popup
     * @namespace PopupManager
     */
    PopupManager: require("./managers/gdk_PopupManager"),
    /**
     * 背景音乐管理器，同一时间只有一个背景音乐，使用场景上使用gdk.Music组件工作   
     * 别名:music
     */
    MusicManager: require("./managers/gdk_MusicManager"),
    /**
     * 场景上的声音，按钮，效果等， 只用于短暂的音效，背景音请使用gdk.Music
     * 需要在场景上挂一个gdk.Sound组件来播放，可以直接调用此类API播放
     * 别名:sound
     */
    SoundManager: require("./managers/gdk_SoundManager"),
    /**
     * 模块管理器，
     * 别名：m
     */
    ModuleManager: require("./managers/gdk_ModuleManager"),
    /**
     *  场景管理器
     *  别名： scene
     * @namespace SceneManager
     */
    SceneManager: require("./managers/gdk_SceneManager"),
    /**
     * 资源管理器
     * 别名：rm
     */
    ResourceManager: require("./managers/gdk_ResourceManager"),
    //   --------  ui   --------
    /**
     * @class TextUI
     */
    TextUI: require("./ui/gdk_TextUI"),
    /**
     * @class BasePanel
     */
    BasePanel: require("./ui/gdk_BasePanel"),
    /**
     * @class Alert
     */
    Alert: require("./ui/gdk_Alert"),
    /**
     * @class MessageUI
     */
    MessageUI: require("./ui/gdk_MessageUI"),
    /**
     * @class LoadingUI
     */
    LoadingUI: require("./ui/gdk_LoadingUI"),
    /**
     * @class WaitingUI
     */
    WaitingUI: require("./ui/gdk_WaitingUI"),
    /**
     * @class ToolTip
     */
    ToolTip: require("./ui/gdk_ToolTip"),
    /**
     * @class BaseList
     */
    BaseList: require("./ui/list/gdk_BaseList"),
    /**
     * @class lList
     */
    List: require("./ui/list/gdk_List"),
    /**
     * @class ItemRenderer
     */
    ItemRenderer: require("./ui/list/gdk_ItemRenderer"),
    /**
     * @class ItemRenderer
     */
    TextItemRenderer: require("./ui/list/gdk_TextItemRenderer"),
    /**
     * @class ScrollList
     */
    ScrollList: require("./ui/gdk_ScrollList"),

    /**
     * @class Switcher
     */
    Switcher: require("./ui/gdk_Switcher"),
    /**
     * @class PageViewTab
     */
    PageViewTab: require("./ui/gdk_PageViewTabBar"),

    AddPopupButton: require("./ui/buttons/gdk_AddPopupButton"),
    CloseButton: require("./ui/buttons/gdk_CloseButton"),
    OpenPanelButton: require("./ui/buttons/gdk_OpenPanelButton"),
    SoundButton: require("./ui/buttons/gdk_SoundButton"),
    // --------     components    --------  
    /**
     * @class ShowHideComponent
     */
    ShowHideComponent: require("./components/gdk_ShowHideComponent"),

    BaseShowHideEffect: require("./components/effects/gdk_BaseShowHideEffect"),
    FadeShowHideEffect: require("./components/effects/gdk_FadeShowHideEffect"),
    SlideShowHideEffect: require("./components/effects/gdk_SlideShowHideEffect"),

    AlertLayout: require("./components/layout/gdk_AlertLayout"),
    TextSizeLayout: require("./components/layout/gdk_TextSizeLayout"),

    BaseTween: require("./components/tweens/gdk_BaseTween"),
    RotateTween: require("./components/tweens/gdk_RotateTween"),
    /**
     * @class ShowHideComponent
     */
    PopupComponent: require("./components/gdk_PopupComponent"),

    Music: require("./components/gdk_Music"),
    Sound: require("./components/gdk_Sound"),

    CameraChildrenRender: require("./components/gdk_CameraChildrenRender"),
    // --------    module    --------  
    BaseModule: require("./module/gdk_BaseModule"),
    Module: require("./module/gdk_Module"),
    View: require("./module/gdk_View"),
    // --------    extension    --------  

    //--------   构建信息   --------
    _buildInfo: (window && window.buildInfo) || {},

    get buildInfo() {
        return this._buildInfo;
    },

    set buildInfo(value) {
        this._buildInfo = value;
        if (window && window.buildInfo) {
            for (let i in value) {
                if (window.buildInfo && window.buildInfo.hasOwnProperty(i)) {
                    value[i] = window.buildInfo[i];
                }
            }
        }
    },

    setBuildInfo (value) {
        this.buildInfo = value;
    }
};
//--   别名  --
gdk.gui = gdk.GUIManager;
gdk.panel = gdk.PanelManager;
gdk.e = gdk.EventManager;
gdk.pool = gdk.PoolManager;
gdk.popup = gdk.PopupManager;
gdk.music = gdk.MusicManager;
gdk.sound = gdk.SoundManager;
gdk.m = gdk.ModuleManager;
gdk.scene = gdk.SceneManager;
gdk.rm = gdk.ResourceManager;
gdk.binding = gdk.Binding.bindDescriptor;

// 改数学解析库函数
let mathjsUtils = require('mathjs/lib/utils/customs.js');
mathjsUtils.getSafeProperty = function (object, prop) {
    if (typeof (object) === 'object' && object) {
        return object[prop];
    }
    throw new Error('No access to property "' + prop + '"');
};
mathjsUtils.setSafeProperty = function (object, prop, value) {
    if (typeof (object) === 'object' && object) {
        object[prop] = value;
        return value;
    }
    throw new Error('No access to property "' + prop + '"');
};

// 数学表达式解析库
gdk.math = require('mathjs-expression-parser');
delete gdk.math.matrix;
delete gdk.math.and;
delete gdk.math.or;
gdk.math.import({
    matrix: function (a) {
        return a;
    },
    get: function (a, b) {
        return a[b];
    },
    rate: function (r, v1, v2) {
        return Math.random() <= r ? v1 : v2;
    },
    array: function (...args) {
        return [...args];
    },
    and: function () {
        let a = arguments;
        for (let i = 0, n = a.length; i < n; i++) {
            if (!a[i]) {
                return false;
            }
        }
        return true;
    },
    or: function () {
        let a = arguments;
        for (let i = 0, n = a.length; i < n; i++) {
            if (!!a[i]) {
                return true;
            }
        }
        return false;
    },
});

// 手机型号检查
gdk.MobileDeviceDetect = require('mobile-device-detect');
gdk.mdd = gdk.MobileDeviceDetect;
gdk.amf = require('ham-amf');
gdk.pako = require('pako');
gdk.Buffer = require('buffer').Buffer;
gdk.SmartBuffer = require('smart-buffer').SmartBuffer;
gdk.md5 = require('md5');

// 一些宏定义
gdk.macro = {
    ENABLE_MULTI_TOUCH: true, // 使用多点触控
    ENABLE_PNG_WORKER: false, // 使用worker加载和解析png图片
    ENABLE_ARRAYBUFFER_WORKER: false, // 使用worker加载二进制数据
    RESOURCE_RELEASE_INTERVAL: 1000, // 资源回收间隔，单位毫秒
    RESOURCE_RELEASE_MAX: 50, // 每次资源回收最大数量
    RESOURCE_RELEASE_TIMEOUT: 3 * 60 * 1000, // 资源超时时间（默认只回收超过此时间不使用的资源）
};

// 全局
window.gdk = window.gdk || {};
window.gdk = Object.assign(window.gdk, gdk);

/**
 * 引擎初始化组件
 */
require("./gdk_Engine");
require("./components");
require("./ui");
require("./i18");
require("./engine");

module.exports = window.gdk;