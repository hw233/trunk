/**
 * @Description: gdk所有的类，函数，属性和常量都在这个命名空间中定义。
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-04-15 11:28:40
 */
declare module gdk {

    /**
     * 版本号
     */
    export var version: string;

    /** 默认字体 */
    export var fontFamily: string;

    /** 引擎组件实例 */
    export var engine: cc.Component;

    /** 宏定义 */
    export var macro: {
        /**
         * 是否开启多点触控
         */
        ENABLE_MULTI_TOUCH: boolean;
        /**
         * 是否开启Worker加载并解码png图片
         */
        ENABLE_PNG_WORKER: boolean,

        /**
         * 是否开启Worker加载二进制文件
         */
        ENABLE_ARRAYBUFFER_WORKER: boolean,

        /**
         * 资源回收间隔，单位毫秒
         */
        RESOURCE_RELEASE_INTERVAL: number,

        /**
         * 每次资源回收最大数量
         */
        RESOURCE_RELEASE_MAX: number,

        /**
         * 资源超时时间（默认只回收超过此时间不使用的资源）
         */
        RESOURCE_RELEASE_TIMEOUT: number,
    }

    //---------  const   -------------
    export enum HideMode {
        NONE,
        DISABLE,
        POOL,
        DESTROY,
        REMOVE_FROM_PARENT
    }
    export enum SlideEffectMode {
        CENTER,
        TOP,
        BOTTOM,
        LEFT,
        RIGHT,
    }
    export enum MessageMode {
        FLOAT,
        REPLACE,
    }
    export enum EaseType {
        easeLinear,
        easeIn,
        easeOut,
        easeInOut,
        easeExponentialIn,
        easeExponentialOut,
        easeExponentialInOut,
        easeSineIn,
        easeSineOut,
        easeSineInOut,
        easeElasticIn,
        easeElasticOut,
        easeElasticInOut,
        easeBounceIn,
        easeBounceOut,
        easeBounceInOut,
        easeBackIn,
        easeBackOut,
        easeBackInOut,
        easeBezierAction,
        easeQuadraticActionIn,
        easeQuadraticActionOut,
        easeQuadraticActionInOut,
        easeQuarticActionIn,
        easeQuarticActionOut,
        easeQuarticActionInOut,
        easeQuinticActionIn,
        easeQuinticActionOut,
        easeQuinticActionInOut,
        easeCircleActionIn,
        easeCircleActionOut,
        easeCircleActionInOut,
        easeCubicActionIn,
        easeCubicActionOut,
        easeCubicActionInOut
    }
    export enum LogLevel {
        LOG, WARN, ERROR
    }
    export enum SizeType {
        NONE,
        FULL, //长宽不按比例完全填满
        WIDTH, //按比例适配宽度
        HEIGHT, //按比例适配高度
        SHOW_ALL, //按比例全显示,有黑边
        CLIP, //按比例填满,部分裁切内容。
    }
    ///////------- core  目录下为最核心的功能模块，都不能使用与任何框架相关的API,方便迁移重用，如cc   ----/////  
    /**
     * 延时执行，统一管理setTimeout，比大量使用settimeou节约性能。
     */
    export var DelayCall: {
        addCall(callback: Function, thisArg?: any, delay?: number, args?: any[]): void,
        cancel(callback: Function, thisArg?: any): void,
        has(callback: Function, thisArg?: any): boolean,
        getDelayTime(callback: Function, thisArg?: any): number
    }

    export var Timer: {
        once(delay: number, caller: any, method: Function, args: Array<any> = null, coverBefore: boolean = true),
        loop(delay: number, caller: any, method: Function, args: Array<any> = null, coverBefore: boolean = true, jumpFrame: boolean = false),
        frameOnce(delay: number, caller: any, method: Function, args: Array<any> = null, coverBefore: boolean = true),
        frameLoop(delay: number, caller: any, method: Function, args: Array<any> = null, coverBefore: boolean = true),
        clear(caller: any, method: Function),
        clearAll(caller: any),
        callLater(caller: any, method: Function, args: Array<any> = null),
        runCallLater(caller: any, method: Function),
        runTimer(caller: any, method: Function),
        pause(),
        resume(),
        toString(),
    }

    export var Tool: {
        getSingleton<T>(c: { new(): T; }): T;
        destroySingleton(c: any): void;
        getResIdByNode(node: cc.Node): string;
        /**
         * 从给定的参数列表中返回第一个非null的值，如果没有任何值满足要求则返回最后一个参数的值
         * @param  {...any} args 
         */
        validate(...args): any;
    }

    export class Pool<T> {
        static clearTime: number;

        onClear: (obj: T) => void;
        onPut: (obj: T) => void;
        onGet: (obj: T) => void;
        createFun: () => T;

        size: number;
        count: number;
        /**少于等0则不会定期清除 */
        clearTime: number;

        get(): T;
        put(obj: T): void;
        isInPool(obj): boolean;
        clearAll(): void;
        clearInactivity(): void;
        unClear(): void;
    }

    export class Event {
        type: string;
        data: any;
        code: number;
        isCancel: number;

        release(alwayRelease: boolean = true): void;
        canRelease(value: boolean): void;
        stop(): void;
        static get(type: string, data: any): void;
    }

    export class EventTrigger {
        count: number;
        on(callback: (...res) => any, thisArg?: any, priority?: number): void;
        once(callback: (...res) => any, thisArg?: any, priority?: number): void;
        off(callback: (...res) => any, thisArg?: any): void;
        offAll(): void;
        targetOff(thisArg): void;
        emit(p1?: any, p2?: any, p3?: any, p4?: any, p5?: any): any;
        has(callback: Function, thisArg?: any): any;
        release(): void;
        static get(): EventTrigger;
        static put(e: EventTrigger): void;
    }
    export var Cache: {
        count: number,
        get(key: string): any,
        has(key: string): boolean,
        put(key: string, obj: any, clearTime?: number, clearFun?: () => void, thisArg?: any): void,
        clear(key: string): void,
        clearAll(): void
    }

    //  -------- tools ---------
    export function binding(source: object, sourceProps: string): Function;
    export function binding(targetProp: string, source: object, sourceProps: string): Function;
    export function binding(targetProp: string, sourceProps: string): Function;
    export function binding(sourceProps: string): Function;
    export var Binding: {
        bind(target: object, targetProp: string, source: object, sourceProps: string): void;
        unbind(target: object, targetProp?: string): void;
    }
    export var Wait: {
        forSecond(t: number): Generator;
        forNextFrame(): Generator;
        forEvent(event: string | EventTrigger, timeout?: number): Generator;
        forNodeEvent(node: cc.Node, eventType: string, timeout?: number): Generator;
        forLoadRes(url: string, type?: any, timeout?: number): Generator;
        forLoadResArray(urls: Array<string>, type?: any, timeout?: number): Generator;
        forLoadResDir(url: string | Array<string>, type?: any, timeout?: number): Generator;
        forLoad(url: string | Array<string>, timeout?: number): Generator;
        forAction(action: cc.Action): Generator;
    }
    export var NodeTool: {
        show(node: cc.Node, isEffect: boolean = true, callback?: () => void, thisArg?: any): void;
        isShow(node: cc.Node): boolean;
        hide(node: cc.Node, isEffect: boolean = true, callback?: () => void, thisArg?: any): void;
        hide(node: cc.Node, isEffect: boolean = true, hideMode: HideMode): void;
        onStartShow(node: cc.Node): EventTrigger;
        onShow(node: cc.Node): EventTrigger;
        onStartHide(node: cc.Node): EventTrigger;
        onHide(node: cc.Node): EventTrigger;

        bringTop(node: cc.Node): void,
        bringBottom(node: cc.Node): void,
        bringBefore(node: cc.Node, targetNode: cc.Node): void,
        bringAfter(node: cc.Node, targetNode: cc.Node): void,
        bringAt(node: cc.Node, targetNodeIndex: number): void,
        getCenter(node: cc.Node, parent?: cc.Node): cc.Vec2;
        getLeft(node: cc.Node, isOut?: boolean, parent?: cc.Node): cc.Vec2;
        getRight(node: cc.Node, isOut?: boolean, parent?: cc.Node): cc.Vec2;
        getTop(node: cc.Node, isOut?: boolean, parent?: cc.Node): cc.Vec2;
        getBottom(node: cc.Node, isOut?: boolean, parent?: cc.Node): cc.Vec2;
        center(node: cc.Node, parent?: cc.Node): void,
        top(node: cc.Node, isOut?: boolean, parent?: cc.Node): void,
        bottom(node: cc.Node, isOut?: boolean, parent?: cc.Node): void,
        left(node: cc.Node, isOut?: boolean, parent?: cc.Node): void,
        right(node: cc.Node, isOut?: boolean, parent?: cc.Node): void,
        getPosInBox(node: cc.Node, x: number, y: number, gap: number = 10, isUpFrist: boolean = true, parent?: cc.Node): void
        callBeforeDraw(callback: Function, thisArg: any): void;
        cancelcallBeforeVisit(callback: Function, thisArg: any): void;
        callAfterUpdate(callback: Function, thisArg: any): void;
        cancelCallAfterUpdate(callback: Function, thisArg: any): void;
    }

    export var i18n: {
        t(str: string, opt: any = null): string;
        init(language: string): void;
    }

    export class Log {
        static isShowLog: boolean;
        static logLevel: LogLevel;
        static get logEnable(): boolean;
        static get warnEnable(): boolean;
        static get errorEnable(): boolean;
        static log(message?: string, ...optionalParams: any[]): void;
        static info(message?: string, ...optionalParams: any[]): void;
        static debug(message?: string, ...optionalParams: any[]): void;
        static warn(message?: string, ...optionalParams: any[]): void;
        static error(message?: string, ...optionalParams: any[]): void;
    }

    export var SizeTool: {
        full(source: cc.Size, border: cc.Size): cc.Size;
        sizeByWidth(source: cc.Size, border: cc.Size): cc.Size;
        sizeByHeight(source: cc.Size, border: cc.Size): cc.Size
        showAll(source: cc.Size, border: cc.Size): cc.Size
        clip(source: cc.Size, border: cc.Size): cc.Size
        size(source: cc.Size, border: cc.Size, type: SizeType): cc.Size
    }
    //-------- config --------
    export class Enum {
        getValue(id: int | string): any;
        mixins(obj: object): void
    }
    export var PanelId: Enum;
    export var SoundId: Enum;
    export var ButtonSoundId: Enum;
    export var MusicId: Enum;
    export var SceneId: Enum;
    export var ResourceId: Enum;
    export var EventId: Enum;
    //-------- utils --------
    // -------- managers --------
    function AlertCallBack(buttonIndex: int): void
    class _GUIManager {
        layers:
            {
                floorLayer: cc.Node,
                viewLayer: cc.Node,
                menuLayer: cc.Node,
                popupLayer: cc.Node,
                popMenuLayer: cc.Node,
                messageLayer: cc.Node,
                guideLayer: cc.Node,
                toolTipLayer: cc.Node,
                waitingLayer: cc.Node,
                loadingLayer: cc.Node,
                systemPopLayer: cc.Node,
                debugLayer: cc.Node,
            };
        guiLayer: cc.Node;
        guiWidgetSize: { top: number, bottom: number, left: number, right: number };
        messagePrefab: cc.Prefab;
        messageAutoCloseTime: number;
        messageMode: string;
        messageMax: number;
        waitingPrefab: cc.Prefab;
        waitingMaskColor: cc.color | string;
        alertPrefab: cc.Prefab;
        alertMaskColor: cc.color | string;
        alertTitle: string;
        alertOk: string;
        alertCancel: string;
        popupMaskColor: cc.color | string;
        popupMenuPrefab: cc.Prefab;
        toolTipPrefab: cc.Prefab;
        onLoadingShow: EventTrigger;
        onLoadingHide: EventTrigger;
        onViewChanged: EventTrigger;
        onPopupChanged: EventTrigger;
        onLockScreenClick: EventTrigger;

        init(guiLayer: cc.Node): void;

        getCurrentLoading(): cc.Node;
        showLoading(info?: string, loaded?: number, total?: number): cc.Node;
        showLoading(loaded: number, total?: number): cc.Node;
        hideLoading(): void;

        showAlert(text: string, title: string, tag: string, callback?: AlertCallBack, thisArg?: any, buttons?: Array<string>): Alert;
        showAlert(text: string, title: string, callback?: AlertCallBack, thisArg?: any, buttons?: Array<string>): Alert;
        showAlert(text: string, callback?: AlertCallBack, thisArg?: any, buttons?: Array<string>): Alert;
        showAskAlert(text: string, title: string, tag: string, callback?: AlertCallBack, thisArg?: any, opt?: any): Alert;
        showAskAlert(text: string, title: string, callback?: AlertCallBack, thisArg?: any): Alert;
        showAskAlert(text: string, callback?: AlertCallBack, thisArg?: any): Alert;
        showAlertWait(text: string, title?: string, buttons?: Array<string>): void;
        hideAlert(alertOrTag: cc.Node | Alert | string): void;
        hideAllAlert(): void;
        getAlert(alert: cc.Node | Alert | string): Alert;

        showMessage(text: string, type?: string, mode: 'add' | 'update' = 'add', offsetY: number = 0): void;
        hideAllMessage(): void;

        getCurrentWaiting(): cc.Node;
        showWaiting(text?: string, tag?: string, timeout?: number, timeoutFun: Function = null, thisArg: any = null, delay: number = 0): cc.Node;
        showWaiting(text: string, timeout: number, timeoutFun: Function = null, thisArg: any = null, delay: number = 0): cc.Node;
        showWaiting(timeout: number, timeoutFun: Function = null, thisArg: any = null, delay: number = 0): cc.Node;
        hideWaiting(tag?: string): void;
        hideAllWaiting(): void;

        showPopupMenu([any], isMask?: boolean, onClose?: (index: number) => void, thisArg?: any): void;
        hidePopupMenu(): void;
        addPopupOneByOne(prefabOrNode: cc.Prefab | cc.Node, isMask: boolean = true, callBack: (prefab: PopupComponent) => void = null, thisArg: any = null);
        addPopup(prefabOrNode: cc.Prefab | cc.Node, isMask?: boolean, precb?: (node?: cc.Node) => any, cb?: (pop?: PopupComponent) => any): void;
        pinTop(prefabOrNode: cc.Node | cc.Component | string): void;
        unPinTop(prefabOrNode: cc.Node | cc.Component | string): void;
        removePopup(prefabOrNode: cc.Node | cc.Component | string): void;
        getPopup(prefabOrNode: cc.Node | cc.Component | string): PopupComponent;
        getPopups(): Array<PopupComponent>;
        hasPopup(): boolean;
        getPopupByName(name: string): PopupComponent;
        removeAllPopup(): void;

        addMenu(prefabOrNode: cc.Prefab | cc.Node): void;
        removeMenu(node: cc.Node): void;
        removeAllMenu(): void;


        getCurrentView(): cc.Node;
        showView(prefabOrNode: cc.Prefab | cc.Node): void;
        hideView(prefabOrNode?: cc.Prefab | cc.Node): void;
        backView(): void;
        hideAllView(...excludes: cc.Node[]): void;
        getView(name: string): cc.Node;

        showNodeToolTip(text: string, node: cc.node, gap?: number, isUpFrist?: boolean): ToolTip;
        showToolTip(text: string, x: number, y: number, gap?: number, isUpFrist?: boolean): void;
        hideToolTip(): void;
        hasToolTip(): boolean;

        addGuide(prefabOrNode: cc.Prefab | cc.Node): void;
        addDebug(prefabOrNode?: cc.Prefab | cc.Node): void;

        lockScreen(timeout?: number): void;
        unLockScreen(): void;
        isScreenLock(): boolean;

    }
    export var GUIManager: _GUIManager;
    export var gui: _GUIManager;
    export interface PanelOption {
        pos?: cc.Vec2,
        classType?: { new(): T },
        onTimeoutCallback?: Function,
        args?: any,
        parent?: cc.Node,
    }
    class _PanelManager {
        loadingString: string;
        loadErrorMessage: string;
        loadTimeout: number = 10;
        loadWaitingDelay: number = 0.5;
        isShowWaiting: boolean = true;
        readonly hasOpening: boolean;
        // onShow: gdk.EventTrigger;
        // onHide: gdk.EventTrigger;
        preload(id: string | number | PanelValue, autoRelease: boolean = true): void;
        open(id: string | number | PanelValue, callback?: (node: cc.Node) => void, thisArg?: any, opt?: PanelOption): void;
        openOneByOne(id: string | number | PanelValue, callback?: (panel: T) => void, thisArg?: any, opt?: PanelOption): void;
        hide(id: stirng | number | PanelValue): void;
        isOpening(id: string | number | PanelValue): boolean;
        isOpenOrOpening(id: string | number | PanelValue): boolean;
        get(id: string | number | PanelValue): cc.Node;
        getConfig(id: string | number | PanelValue): PanelValue;
        setArgs(id: string | number | PanelValue, ...args): void;
        getArgs(id: string | number | PanelValue, remove = true): any[];
    }
    export var PanelManager: _PanelManager;
    export var panel: _PanelManager;
    class _EventManager {
        on(eventType: string, callback: Function, thisArg?: any, priority?: number, hasEventArg: boolean = true): void;
        once(eventType: string, callback: Function, thisArg?: any, priority?: number, hasEventArg: boolean = true): void;
        off(eventType: string, callback: Function, thisArg?: any): void;
        offAll(eventType: string): void;
        targetOff(thisArg: any): void;
        has(eventType: string, callback: Function, thisArg?: any): void;
        emit(eventType: string, data?: any, code?: number): any;
        getEventCount(eventType?: string): number;
    }
    export var EventManager: _EventManager;
    export var e: _EventManager;

    class _PoolManager {
        onPut: EventTrigger;
        onGet: EventTrigger;
        setCreateFun(key: string, fun: () => any): void;
        getCreateFun(key: string): () => any;
        put(key: string, obj: any): void;
        get(key: string): any;
        clear(key: string): void;
        clearAll(): void;
        clearInactivity(key: string): void;
        clearAllInactivity(): void;
        getSize(key: string): number;
        setSize(key: string, size: number): void;
        getCount(key: string): number;
        getClearTime(key: string): number;
        setClearTime(key: string, time: number): void;

        cache(key: string, obj: any, clearTime?: number, clearFun?: () => void): void;
        getCache(key: string): any;
        unCacheAll(): void;
        getCacheCount(key: string): number;

        getCacheOrPool(key: string): any;
        isInCacheOrPool(obj: any): boolean;
    }
    export var PoolManager: _PoolManager;
    export var pool: _PoolManager;

    class _PopupManager {
        addPopup(nodeOrPrefab: cc.Node | cc.Prefab, parent: cc.Node, isMask?: boolean): PopupComponent
        addPopupOne(nodeOrPrefab: cc.Node | cc.Prefab, parent: cc.Node, isMask?: boolean): PopupComponent
        removePopup(nodeOrPrefab: cc.Node | cc.Prefab): void
        has(nodeOrPrefabOrName: cc.Node | cc.Prefab | string): boolean;
        get(nodeOrPrefabOrName: cc.Node | cc.Prefab | string): PopupComponent;

    }
    export var PopupManager: _PopupManager;
    export var popup: _PopupManager;

    class _MusicManager {
        isOn: boolean;
        volume: number;
        prefix: string;
        extension: stirng;
        on(): void;
        off(): void;
        stop(): void;
        setVolume(value: number): void;
        getVolume(): number;
        getCurrent(): Music;
    }
    export var MusicManager: _MusicManager;
    export var music: _MusicManager;

    class _SoundManager {
        isOn: boolean;
        volume: number;
        maxAudioCount: number;//最多可以同时播放多少个声音，默认10个，再多人耳也听不出，浪费资源
        prefix: string;
        extension: stirng;

        on(): void;
        off(): void;
        stop(): void;
        setVolume(value: number): void;
        getVolume(): number;
        play(panelId: string | number, name: string | int | cc.AudioClip, release?: boolean): void
    }
    export var SoundManager: _SoundManager;
    export var sound: _SoundManager;

    class _ModuleManager {
        get count(): number;
        add<T>(m: { new(): T; }): T;
        add<T>(modules: Array<{ new(): T; }>): Array<T>;
        remove<T>(modules: { new(): T; } | Array<{ new(): T; }>): void;
        setActive(m: string | { new(): BaseModule; }, active: boolean): void;
        isActive(m: string | { new(): BaseModule; }): boolean;
        get<T>(m: string): T;
        get<T>(m: { new(): T; }): T;
        reset(m: string | { new(): BaseModule; }): void;
        resetAll(): void;
        on(moduleName: string | { new(): BaseModule; }, eventType: string | number, callback: Function, thisArg?: any, priority?: number): void;
        once(moduleName: string | { new(): BaseModule; }, eventType: string | number, callback: Function, thisArg?: any, priority?: number): void;
        off(moduleName: string | { new(): BaseModule; }, eventType: string | number, callback: Function, thisArg?: any): void;
        targetOff(thisArg: any): void;
        emit(moduleName: string | { new(): BaseModule; }, eventType: string | number, ...res): void;
        hasEvent(moduleName: string | { new(): BaseModule; }, eventType: string | number, onEventType: string, callBack: Function, thisArgs?: any): void;
    }
    export var ModuleManager: _ModuleManager;
    export var m: _ModuleManager;


    class _SceneManager {
        load(sceneName: string, callback?: (error: Error, res: cc.Scene) => void, thisArg?: any);
        preload(sceneName: string, callback?: (error: Error) => void, thisArg?: any);
        getScene(): cc.Scene;
        getSceneName(): string;
        getCanvasNode(): cc.Node;
    }
    export var SceneManager: _SceneManager;
    export var scene: _SceneManager;

    class _ResourceManager {
        loadResByModule(panelId: string | number, modules: Array<string>, param: any = null, pcb: Function = null, cb: Function = null): void;
        loadResByPanel(panelId: string | number, param: any = null, pcb: Function = null, cb: Function = null): void;
        loadResArray(panelId: string | number, urls: Array<object>, pcb: Function = null, cb: Function = null): void;
        loadRes(panelId: string | number, url: String, type: any, cb?: Function, ecb?: Function): void;
        loadResBy(panelId: string | number, uuid: String, type: any, cb?: Function, ecb?: Function): void;

        releaseRes(panelId: string | number, asset: string | cc.Asset, type: any = null): void;
        releaseResByPanel(panelId: string | number): void;
        releaseAll(): void;

        addModuleInBackground(modules: Array<string>, panelId?: string | number): void;
        addPanelInBackground(panelId: string | number): void;
        addResInBackground(resArray: Array<string>, type: any, panelId?: string | number): void;

        getResByUrl<T>(url: string, type: new () => T = null, panelId?: string | number): T;
        getInfoWithPath(path: string, type?: typeof cc.Asset): Record<string, any>;

        addUnreleaseRes(url: string): void;
    }

    export var ResourceManager: _ResourceManager;
    export var rm: _ResourceManager;

    //   --------  ui   --------
    export class TextUI extends cc.Component {
        _label: cc.Label;
        text: string;
    }
    export interface PanelHideArg {
        args?: any;
        id?: number | string | PanelValue;
        func?: Function;
    }
    export interface PanelValue {
        __id__?: string, // 自动生成属性，不要主动设置
        prefab: string;
        module?: string[];
        isPopup?: boolean;
        isDisableView?: boolean;
        isMask?: boolean;
        maskAlpha?: number; // 遮照透明度，0~255
        maskColor?: cc.Color;   // 庶照颜色
        isTouchMaskClose?: boolean;
        hideMode?: gdk.HideMode;
        tempHidemode?: gdk.HideMode;    // 临时隐藏模式，只生效一次
        onHide?: PanelHideArg;  // 窗口关闭时参数，只生效一次
        zIndex?: number;
        isKeep?: boolean; // 正在打开时是否保持不被其他将要打开的界面强制关闭
        isNoExclusive?: boolean; // 此窗口打开时不强制关闭其他正在打开的窗口
        releaseAtlas?: boolean; // 当动态图集大于1时释放动态图集
        preloads?: (PanelValue | string)[]; // 预加载界面列表，效果与预制体中配置preloads相同
    }
    export class BasePanel extends cc.Component {
        _closeBtn: cc.Button;
        _titleLabel: cc.Label;
        isShowCloseBtn: boolean;
        loadingString: string;
        title: string;
        onClose: EventTrigger;

        readonly resId: string | number;
        readonly args: any[];
        readonly config: PanelValue;

        get hideArgs(): PanelHideArg;
        get preloads(): PanelValue[];

        close(buttonIndex: number = -1): void;
        ususe(): void;
        loadRes(url: string, type?: any, cb?: Function): void;
        loadResByModule(modules: string[], param?: any, pcb?: Function, cb: ?Function): void;
        releaseRes(asset: cc.Asset | string, type?: any): void;
    }
    export class Alert extends BasePanel {
        _textField: cc.Label;
        _icon: Array<cc.Sprite>;
        _defalutButton: cc.Button;
        _normalButton: cc.Button;
        text: string;
        icon: string | cc.SpriteFrame;
        buttons: Array<string>;
        tag: string;
        defaultButtonIndex: number = 0;
        setTimeout(timeout: number, buttonIndex: number = -1): void;
        buttonLetToRight: boolean;

        static getByTag(tag: string): Alert;
    }
    export class MessageUI extends TextUI {

    }
    export class LoadingUI extends cc.Component {
        _label: cc.Label;
        _progressBar: cc.ProgressBar;

        set info(v: string): void;
        get info(): string;

        set loaded(v: number): void;
        get loaded(): number;

        set total(v: number): void;
        get total(): number;
    }
    export class WaitingUI extends TextUI {
        _icon: cc.Node;
    }
    export class ToolTip extends TextUI {

    }
    export class BaseList extends cc.Component {
        _itemRenderer: cc.Prefab;
        selectable: boolean;
        selectToggle: boolean;
        isMultipleSelection: boolean;
        async: boolean;
        datas: Array<any>;
        selectIndexs: Array<number>;
        selectIndex: number;
        onSelectChanged: EventTrigger;
        onDataChanged: EventTrigger;
        onItemClick: EventTrigger;
        onItemEvent: EventTrigger;
        unuse(): void;
        addDatas(arr: Array<any>): void;
        addData(value: any): void;
        addDataAt(value: any, index: number): void;
        removeDataAt(index: number): void;
        updateItem(index: number): void;
        refresh(): void;
        InvalidView(): void;
        updateView(): void;
    }
    export class List extends BaseList {

    }
    export class ItemRenderer extends cc.Component {
        selectClip: cc.Node;
        data: any;
        index: number;
        list: BaseList;
        isSelected: boolean;
        onSelectChanged: EventTrigger;
        onDataChanged: EventTrigger;
        unuse(): void;
        triggerItemEvent(type: string): void;
        updateView(): void;
    }
    export class TextItemRenderer extends ItemRenderer {

    }
    export class ScrollList extends cc.Component {

    }

    export class Switcher extends cc.Component {
        isOn: boolean;
        onToggle: EventTrigger;
    }

    export class PageViewTab extends cc.Component {

    }

    export class SoundButton extends cc.Component {
        onClick(): void;
    }
    export class CloseButton extends SoundButton {

    }
    export class AddPopupButton extends cc.Component {

    }
    export class CloseButton extends cc.Component {

    }
    export class OpenPanelButton extends cc.Component {

    }

    // --------     components    --------  


    export class PopupComponent extends cc.Component {
        isMask: boolean;
        maskColor: cc.color;
        isTouchMaskClose: boolean;
        isTouchBringTop: boolean;
        onMaskClick: EventTrigger;
    }
    export class ShowHideComponent extends cc.Component {

        hideMode: HideMode;
        onShow: EventTrigger;
        onHide: EventTrigger;
        isShow: boolean;
        isShowWheEnable: boolean;

        show(isEffect: boolean?, callback?: () => void, thisArg?: any);
        hide(isEffect: boolean = true, callback?: () => void | HideMode, thisArg?: any): void;
        onDestroy();
        unuse();
        onEnable();
        onDisable();
        isShowEffect(): boolean;
        isHideEffect(): boolean;

        doShow(isActioning: boolean): cc.Action;
        doHide(isActioning: boolean): cc.Action;
        showComplete(): void;
        hideComplete(): void;
    }

    export class Music extends cc.Component {
        setMusic(name: MusicId | string): void;
    }
    export class Sound extends cc.Component {
    }

    export class CameraChildrenRender extends cc.Component {
        target: cc.Node;
        content: cc.Node;
        sprite: cc.Sprite;
        camera: cc.Camera;
    }

    /////
    export class BaseShowHideEffect extends ShowHideComponent {
        startValue: number;
        normalValue: number;
        endValue: number;
        showTime: number;
        hideTime: number;
        showDelay: number;
        hideDelay: number;
        ease: string;
    }

    export class FadeShowHideEffect extends BaseShowHideEffect {

    }
    export class ScaleShowHideEffect extends BaseShowHideEffect {

    }
    export class SlideShowHideEffect extends BaseShowHideEffect {
        slideMode: SlideEffectMode;
        target: cc.Node;
    }




    export class BaseTween extends cc.Component {
        fromIsCurrent: boolean;
        isBy: boolean;
        from: number;
        to: number;
        time: number;
        loop: number;
        ease: string;
        onComplete: EventTrigger;

        updateTween(): void;
    }
    export class RotateTween extends BaseTween {

    }
    // --------    module    --------  
    export class BaseModule {
        readonly moduleName: string;
        on(moduleName: string | { new(): BaseModule; }, eventType: string | Function | number, callback?: Function, thisArg?: any): void;
        once(moduleName: string | { new(): BaseModule; }, eventType: string | Function | number, callback?: Function, thisArg?: any): void;
        off(moduleName: string | { new(): BaseModule; }, eventType?: string | number, thisArg?: any): void;
        emit(eventType: string | number, ...res): any;
        sendEvent(moduleName: string | { new(): BaseModule; }, eventType: string | number, ...res): any;

        reset(): void;
    }
    export class Module extends BaseModule {

        active: boolean;
        destroy(): void;
    }
    export class View extends cc.Component {
        onEnable();
        onDisable();

    }
    export interface View extends BaseModule {


    }
    // --------    extension    --------  
    export var math: {
        eval(expr: string, scope?: any);
        parse(arg0, arg1?);
        compile(arg0, arg1?);
    }
    interface _IMobileDeviceDetect {
        isBrowser: boolean;
        isMobile: boolean;
        isTablet: boolean;
        isSmartTV: boolean;
        isConsole: boolean;
        isWearable: boolean;
        isMobileSafari: boolean;
        isChromium: boolean;
        isMobileOnly: boolean;
        isAndroid: boolean;
        isWinPhone: boolean;
        isIOS: boolean;
        isChrome: boolean;
        isFirefox: boolean;
        isSafari: boolean;
        isOpera: boolean;
        isIE: boolean;
        isEdge: boolean;
        isYandex: boolean;
        osVersion: string;
        osName: string;
        fullBrowserVersion: string;
        browserVersion: string;
        browserName: string;
        mobileVendor: string;
        mobileModel: string;
        engineName: string;
        engineVersion: string;
        getUA: string;
        deviceType: string;
        deviceDetect: () => any;
    }
    export var mdd: _IMobileDeviceDetect;
    export var MobileDeviceDetect: _IMobileDeviceDetect;
    export var amf: {
        encodeObject(obj: any): Uint8Array;
        decodeObject(data: Uint8Array): any;
    };
    export var pako: {
        inflate(input: Uint8Array, options?: any): Uint8Array;
        deflate(input: Uint8Array, options?: any): Uint8Array;

        gzip(input: Uint8Array, options?: any): Uint8Array;
        ungzip(input: Uint8Array, options?: any): Uint8Array;
    };
    //--------   构建信息   --------
    export var buildInfo;
    export function setBuildInfo(value: any): any;
    //-------    外部库   --------
    export const Buffer: typeof global.Buffer;
    export function md5(message: string | Buffer | Uint8Array, options?: any): string;
}

/** !#en
The main namespace of Cocos2d-JS, all engine core classes, functions, properties and constants are defined in this namespace.
!#zh
Cocos 引擎的主要命名空间，引擎代码中所有的类，函数，属性和常量都在这个命名空间中定义。 */
declare namespace cc {

    export interface Node {
        show(isEffect: boolean = true, callback?: () => void, thisArg?: any): void;
        readonly isShow: boolean;
        hide(isEffect: boolean = true, callback?: () => void, thisArg?: any): void;
        hide(isEffect: boolean = true, hideMode: HideMode): void;
        getPos(): cc.Vec2;
        /**节点是否渲染 */
        visible: boolean;
        /**节点显示 */
        readonly onStartShow: gdk.EventTrigger;
        /**节点显示 */
        readonly onShow: gdk.EventTrigger;
        /**节点关闭 */
        readonly onStartHide: gdk.EventTrigger;
        /**节点关闭 */
        readonly onHide: gdk.EventTrigger;
    }

    /** !#en Material Asset.
    !#zh 材质资源类。 */
    export interface Material extends Asset {
        effectAsset: EffectAsset;
        copy(mat: Material): void;
        define(name: string, val: any): void;
        setProperty(name: string, val: any);
        _owner: cc.RenderComponent;
        _uuid: string;
    }
    export class EffectAsset extends Asset {
        _name: string;
        _uuid: string;
        shaders: any[];
        properties: any[];
    }

    export function color(r?: number | string, g?: number, b?: number, a?: number): Color;
}
