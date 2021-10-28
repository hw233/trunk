import ChatModel from '../../view/chat/model/ChatModel';
import ConfigManager from '../../common/managers/ConfigManager';
import GlobalUtil from '../../common/utils/GlobalUtil';
import GuideModel from '../model/GuideModel';
import GuideUtil from '../../common/utils/GuideUtil';
import HeroUtils from '../../common/utils/HeroUtils';
import JumpUtils from '../../common/utils/JumpUtils';
import MathUtil from '../../common/utils/MathUtil';
import ModelManager from '../../common/managers/ModelManager';
import PanelId from '../../configs/ids/PanelId';
import PveGeneralModel from '../../view/pve/model/PveGeneralModel';
import RoleModel from '../../common/models/RoleModel';
import SdkTool from '../../sdk/SdkTool';
import StringUtils from '../../common/utils/StringUtils';
import { ChatEvent } from '../../view/chat/enum/ChatEvent';
import { GlobalCfg, GuideCfg, HeroCfg } from '../../a/config';
import { MonsterCfg } from './../../a/config';
import { RoleEventId } from '../../view/role/enum/RoleEventId';

/** 
 * @Description: 新手引导界面控制器
 * @Author: weiliang.huang  
 * @Date: 2019-06-04 18:11:14 
 * @Last Modified by: weiliang.huang
 * @Last Modified time: 2019-06-21 17:45:04
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-28 11:53:43
 */
const { ccclass, property, menu } = cc._decorator;

export enum GuideType {
    FIRST = 1,              // 首次出现展示
    FREE = 2,               // 自由点击，例如引导玩家使用技能
    FREE_CLICK = 9,         // 连续点击绑定按钮，直到达成完成条件
    OPEN_FUNCTION = 3,      // 开启新功能
    ENDLESS = 4,            // 不会记录完成状态的引导，例如进入某个关卡自动一键上阵
    PLAY_VIDEO = 5,         // 播放视频
    AUTO_COMPLETE = 6,      // 无需点击自动完成
    BTN_FOR_SHOW = 7,       // 按钮只用于展示效果,不显示手指,点击不触发自身事件而是结束当前引导(目前用于引导玩家关注某个关卡)
    IGNORE_BTN_CLICK = 10,  // 按钮只用于定位坐标展示效果，点击不触发按钮自身事件
    FREE_SHOW = 8,          // 引导提示点击某个按钮，但不影响其他按钮点击
}

@ccclass
@menu("qszc/guide/GuideViewCtrl")
export default class GuideViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    skipBtn: cc.Node = null

    @property(cc.Sprite)
    bg: cc.Sprite = null     // 背景图片

    @property(cc.Node)
    hand: cc.Node = null    // 手指指引

    @property(cc.Node)
    mask: cc.Node = null    // 遮罩

    @property(cc.Node)
    tipsNode: cc.Node = null

    @property(sp.Skeleton)
    tipsGirl: sp.Skeleton = null

    @property(cc.RichText)
    tipsText: cc.RichText = null

    @property(cc.Prefab)
    noticeBar: cc.Prefab = null

    @property(cc.Node)
    dialogNode: cc.Node = null

    @property(cc.RichText)
    npcName: cc.RichText = null

    @property(cc.RichText)
    npcDialgo: cc.RichText = null

    @property(sp.Skeleton)
    npcSpine: sp.Skeleton = null

    @property(sp.Skeleton)
    playerSpine: sp.Skeleton = null

    @property(cc.Node)
    contentNode: cc.Node = null

    @property(cc.Node)
    nameBg: cc.Node = null

    @property(cc.Node)
    arrowNode: cc.Node = null

    @property(cc.Node)
    nextBtn: cc.Node = null

    clickNode: cc.Node = null;
    isWaitingClickNode: boolean = false;
    isPrinting: boolean = false;  // 剧情是否正在显示打字效果
    tempMask: cc.Node = null;
    guideModel: GuideModel;

    curGuideId: number = 0;
    clickCount: number = 0;
    clickTimer: number = 0;

    onEnable() {
        this.guideModel = ModelManager.get(GuideModel);
        this.guideModel.guideCtrl = this;
        // 添加事件
        gdk.e.on(ChatEvent.ADD_SYSTEM_NOTICE, this._addSystemNotice, this, 0, false);
        gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._levelUpdate, this, 0, false);
        gdk.e.on('popupopen', (id: any) => GuideUtil.activeGuide(`popup#${id}#open`), this, 0, false);
        gdk.e.on('popupclose', (id: any) => GuideUtil.activeGuide(`popup#${id}#close`), this, 0, false);
        gdk.e.on('viewopen', (id: any) => GuideUtil.activeGuide(`view#${id}#open`), this, 0, false);
        gdk.e.on('viewclose', (id: any) => GuideUtil.activeGuide(`view#${id}#close`), this, 0, false);
        // gdk.gui.onViewChanged.on(this._onViewChanged, this);
        // gdk.gui.onPopupChanged.on(this._onPopupChanged, this);
        // gdk.gui.layers.popupLayer.on("child-added", this._onPopupChanged, this);
        // 主动激活引导
        let model = this.guideModel;
        // 英雄等级
        if (!!model.activeCfgs['hero#lvup']) {
            let heros = HeroUtils.getHeroItems();
            heros.some(h => {
                if ((h.extInfo as icmsg.HeroInfo).level > 1) {
                    GuideUtil.activeGuide('hero#lvup');
                    return true;
                }
                return false;
            });
        }
        // 英雄进阶
        if (!!model.activeCfgs['career#lvup']) {
            let heros = HeroUtils.getHeroItems();
            heros.some(h => {
                let info = h.extInfo as icmsg.HeroInfo;
                let level = HeroUtils.getHeroJobLv(info.heroId, info.careerId);
                if (level > 1) {
                    GuideUtil.activeGuide('career#lvup');
                    return true;
                }
                return false;
            });
        }
        // 是否已经改名
        let roleModel = ModelManager.get(RoleModel);
        if (!StringUtils.startsWith(roleModel.name, '指挥官')) {
            // 已经改名，则完成改名引导
            let cfg = ConfigManager.getItemByField(GuideCfg, 'finishCondition', 'changename');
            if (cfg && !model.doneIds[cfg.group]) {
                // 标记完成并通知服务器保存
                GuideUtil.endGuide(cfg);
            }
        }
        // 角色等级
        GuideUtil.levelActive(0, roleModel.level);
        // 清除遮挡层
        if (!GuideUtil.isGuiding) {
            this.clearGuide();
            this.hideMask();
        }
    }

    onDisable() {
        this.clearGuide();
        this.unregisterTouchListener();
        this.unscheduleAllCallbacks();
        gdk.e.targetOff(this);
        // gdk.gui.onViewChanged.targetOff(this);
        // gdk.gui.onPopupChanged.targetOff(this);
        gdk.Timer.clearAll(this);
    }

    onDestroy() {
        ModelManager.put(GuideModel);
    }

    update() {
        // 每帧查找是否在等待按钮
        if (this.isWaitingClickNode) {
            let cfg = this.guideModel.curGuide;
            let btn = this.guideModel.bindBtns[cfg.bindBtnId];
            if (cc.isValid(btn) && btn.activeInHierarchy) {
                this.isWaitingClickNode = false;
                this._showHandNode();
                this._showInvertedMask();
            }
        } else if (cc.isValid(this.clickNode) && this.clickNode.activeInHierarchy) {
            // 绑定按钮的情况下,每帧更新指引手指的位置
            let cfg = this.guideModel.curGuide;
            if (cfg.type != GuideType.FREE) {
                this._updateHandPos();
            }
            // 更新挖空遮罩位置
            if (this.tempMask && this.tempMask.activeInHierarchy) {
                this._updateInvertedMaskPos();
            }
        }
    }

    onNextBtn() {
        let cfg = this.guideModel.curGuide;
        while (cfg) {
            if (cfg.forward) {
                let isShowTips = CC_DEBUG ? true : false;
                JumpUtils.openView(cfg.forward, isShowTips)
                // 如果功能达不到开启条件，则清除当前引导
                GuideUtil.clearGuide();
            }
            let nextId = cfg.nextTask;
            if (nextId >= 0) {
                let nextCfg = this.guideModel.guideCfgs[nextId];
                if (nextCfg) {
                    try {
                        if (cfg.group != nextCfg.group) {
                            GuideUtil.endGuide();
                        }
                        cfg = nextCfg;
                        // 开启功能
                        if (cfg.type == GuideType.OPEN_FUNCTION) {
                            GuideUtil.setGuideId(nextId);
                            return;
                        }
                        let openSys = cfg.openSys;
                        if (cc.js.isNumber(openSys) || (openSys instanceof Array && openSys.length > 0)) {
                            let arr: number[] = openSys instanceof Array ? openSys : [openSys];
                            let con: boolean = arr.some(id => {
                                if (!JumpUtils.ifSysOpen(id, CC_DEBUG)) {
                                    // 是否有功能达不到开启条件
                                    return true;
                                }
                                return false;
                            });
                            if (con) {
                                // 有功能达不到开启条件
                                return;
                            }
                        }
                        GuideUtil.setGuideId(nextId);
                    } catch (e) {
                    }
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        GuideUtil.endGuide();
        GuideUtil.clearGuide();
    }

    registerTouchListener() {
        let cfg = this.guideModel.curGuide;
        if (cc.isValid(this.clickNode) || this.isWaitingClickNode) {
            switch (cfg.type) {
                case GuideType.PLAY_VIDEO:
                case GuideType.BTN_FOR_SHOW:
                case GuideType.IGNORE_BTN_CLICK:
                    break;

                case GuideType.FREE_SHOW:
                    // 自由展示类的引导
                    return;

                default:
                    // 循环调用防止新添加的节点能被点击
                    gdk.Timer.frameLoop(10, this, this.refreshTouchListener);
                    this.refreshTouchListener();
                    gdk.gui.guiLayer.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this, true);
                    return;
            }
        }
        if (cfg.type == GuideType.FREE_SHOW) {
            // 自由展示类的引导

        } else if (!cfg.finishCondition || !(cfg.type == GuideType.FREE || cfg.type == GuideType.FREE_CLICK)) {
            // 普通的触摸完成
            this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
            gdk.gui.guiLayer.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this, true);
        }
    }

    // 刷新触摸监听，暂停全局触摸事件，只允许绑定的按钮接受触摸事件
    private refreshTouchListener() {
        let cfg = this.guideModel.curGuide;
        if (cfg.force != 0) {
            // 强制引导，则禁用所有按钮点击
            gdk.engine.node.pauseSystemEvents(true);
            cc.macro.ENABLE_MULTI_TOUCH = true;
        }
        gdk.gui.guiLayer.resumeSystemEvents(false);
        if (cc.isValid(this.clickNode)) {
            if (!cfg.finishCondition || !(cfg.type == GuideType.FREE || cfg.type == GuideType.FREE_CLICK)) {
                // 普通的触摸完成，有按钮组件，则监听click事件，否则监听touchend
                let isBtn = !!this.clickNode.getComponent(cc.Button);
                this.clickNode.once(isBtn ? 'click' : 'touchend', this._onTouchEnded, this);
            }
            this.clickNode.resumeSystemEvents(true);
        }
        if (this.nextBtn.active) {
            this.nextBtn.resumeSystemEvents(false);
        }
    }

    unregisterTouchListener() {
        if (cc.isValid(this.clickNode)) {
            this.clickNode.targetOff(this);
        }
        gdk.Timer.clear(this, this.refreshTouchListener);
        gdk.engine.node.resumeSystemEvents(true);
        gdk.gui.guiLayer.targetOff(this);
        this.node.targetOff(this);
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    private _onTouchStart(event: cc.Event.EventTouch) {
        // 检测引导是否卡住
        let cfg = this.guideModel.curGuide;
        if (!cfg) {
            this.curGuideId = -1;
            CC_DEBUG && cc.log("没有引导了");
            return;
        }
        // 非强制引导
        if (cfg.force == 0) {
            if (cc.isValid(this.clickNode) && this.clickNode.activeInHierarchy) {
                let box = this.clickNode.getBoundingBoxToWorld();
                let camera = cc.Camera.cameras[0];
                let location: cc.Vec2 = camera.getScreenToWorldPoint(event.getLocation()) as any;
                if (!box.contains(location)) {
                    // 不在点击区域内，则关闭并完成指引
                    GuideUtil.endGuide();
                    GuideUtil.clearGuide();
                }
            }
            return;
        }
        // 不能被跳过的引导
        if (cfg.force > 1) return;
        if (this.nextBtn.active) return;
        // 重置点击计算
        let now = new Date().getTime();
        if (this.curGuideId != cfg.id || now - this.clickTimer > 300) {
            this.curGuideId = cfg.id;
            this.clickCount = parseInt(ConfigManager.getItemById(GlobalCfg, "guide_skip_click").value[0]);
        }
        this.clickTimer = now;
        this.clickCount--;
        this.nextBtn.active = this.clickCount <= 0;
    }

    private _onTouchEnded() {
        // 正在等待绑定的按钮
        let cfg = this.guideModel.curGuide;
        if (this.isWaitingClickNode || !cfg) {
            return;
        }
        // 正在逐一显示文字中，则全部显示
        if (this.isPrinting) {
            this.isPrinting = false;
            return;
        }
        // 优先使用传入的点击按钮事件
        if (cc.isValid(this.clickNode)) {
            // 按钮点击，则继续引导
            this.clickNode.targetOff(this);
            this.nextGuide();
        } else {
            // 无按钮情况下，点击屏幕均视为继续指引
            if (cfg.npcName) {
                // 剧情流程播放中点击
                if (this.dialogNode.active) {
                    this.npcDialgo.string = "";
                    this.hideMask();
                }
            }
            this.nextGuide();
        }
    }

    /**清除指引和相关事件 */
    clearGuide() {
        this.guideModel.curGuide = null;
        this.hideGuide();
    }

    /**隐藏指引相关 */
    hideGuide() {
        this.bg.node.active = false;
        this.mask.active = false;
        this.tempMask && (this.tempMask.active = false);
        this.tipsNode.active = false;
        this.tipsGirl.node.active = false;
        this.tipsGirl.skeletonData = null;
        this.dialogNode.active = false;
        this.hand.active = false;
        this.skipBtn.active = false;
        this.isPrinting = false;
        this.hand.getChildByName('hand').active = true;
        this.hand.getChildByName('spine').active = false;
        this.hand.stopAllActions();
        this.arrowNode.getComponent(cc.Animation).stop();
        this.unscheduleAllCallbacks();
        this.unregisterTouchListener();
        this.nextBtn.active = false;
        this.isWaitingClickNode = false;
        this.clickNode = null;
        // 回收资源（非依赖资源）
        this.bg.spriteFrame = null;
        this.npcSpine.skeletonData = null;
        this.playerSpine.skeletonData = null;
        gdk.rm.releaseResByPanel(this.resId);
        gdk.rm.loadResByPanel(this.resId);
    }

    showMask(opacity: number = 0, blockInput?: boolean) {
        this.mask.active = true;
        this.mask.opacity = opacity;
        blockInput && JumpUtils.showGuideMask();
    }

    hideMask() {
        this.mask.active = false;
        JumpUtils.hideGuideMask();
    }

    nextGuide() {
        let cfg = this.guideModel.curGuide;
        if (!cfg) return;
        // 需要跳转的情况下
        if (cfg.forward) {
            // 如果无法开启界面,则清除指引
            let isShowTips = CC_DEBUG ? true : false;
            if (!JumpUtils.openView(cfg.forward, isShowTips)) {
                GuideUtil.clearGuide();
                return;
            }
        }
        // 后置引导
        let nextId = cfg.nextTask;
        if (nextId >= 0) {
            // 大于等于0，表示有后续引导，或结束引导
            let nextCfg = this.guideModel.guideCfgs[nextId];
            if (nextCfg) {
                // 后续引导
                if (cfg.group != nextCfg.group) {
                    // 引导组不相同时结束上一个引导
                    GuideUtil.endGuide();
                }
                GuideUtil.setGuideId(nextId);
            } else {
                // 没有后继引导了，则结束当前引导
                GuideUtil.endGuide();
                GuideUtil.clearGuide();
            }
        } else {
            // 小于0，表示后续还有引导没有结束，但是不自动引导
            GuideUtil.clearGuide(false);
        }
    }

    // 更新当前引导
    showGuideInfo() {
        let cfg = this.guideModel.curGuide;
        if (!cfg) return;
        if (!cfg.dependence || !cfg.dependence.ignore_close_special_popup) {
            // 有引导时关闭一些特殊的弹框
            [
                PanelId.MainHangPreReward,
                PanelId.RaidReward2,
                // PanelId.Reward,
            ].forEach(pid => {
                gdk.panel.hide(pid);
            });
        }
        // 防止在上面的步骤中引导被清除
        cfg = this.guideModel.curGuide;
        if (!cfg) return;

        if (cfg.preload) {
            // 预加载的界面
            let preload: any = cfg.preload;
            if (cc.js.isString(preload)) {
                // 预加载一个界面
                gdk.panel.preload(preload);
            } else if (preload instanceof Array) {
                // 预加载多个界面
                preload.forEach(id => {
                    gdk.panel.preload(id);
                });
            }
        }
        if (cfg.type == GuideType.OPEN_FUNCTION) {
            // 开启新功能
            this.showMask(0, true);
            gdk.panel.setArgs(PanelId.FunctionOpen, cfg);
            gdk.panel.open(PanelId.FunctionOpen, (node: cc.Node) => {
                this.hideMask();
                // 界面隐藏后继续
                let onHide = gdk.NodeTool.onHide(node);
                onHide.on(() => {
                    onHide.targetOff(this);
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    gdk.Timer.callLater(GuideUtil, GuideUtil.nextGuide);
                }, this);
            }, this);
            return;
        }
        if (cfg.type == GuideType.ENDLESS) {
            // 不需要引导的主线任务
            return;
        }
        if (cfg.type == GuideType.AUTO_COMPLETE) {
            // 自动完成的引导
            this.nextGuide();
            return;
        }
        // 跳过按钮
        if (cfg.skip && cfg.nextTask && !cfg.forward && !cfg.bindBtnId) {
            this.skipBtn.active = true;
        } else {
            this.skipBtn.active = false;
        }
        // npc形象
        if (cfg.npcName == "" && cfg.npcHead == "" && cfg.text) {
            this._showTipsNode();
        } else {
            this.tipsNode.active = false;
            this.tipsGirl.node.active = false;
            GlobalUtil.setSpineData(this.node, this.tipsGirl, null, true);
        }
        // 剧情对话
        if (cfg.npcName && cfg.text) {
            this.dialogNode.active = true;
            if (cfg.npcName == "selfName") {
                let roleModel = ModelManager.get(RoleModel);
                let subnode = this.dialogNode.getChildByName('sub_listbg03');
                subnode.scaleX = -Math.abs(subnode.scaleX);
                this.npcName.string = roleModel.name;
                this.nameBg.x = this.nameBg.x >= 0 ? this.nameBg.x : -this.nameBg.x;
                this.nameBg.width = this.npcName.node.width + 48;
                this.playerSpine.node.scaleX = -0.8 * cfg.scale;
                this.playerSpine.node.scaleY = 0.8 * cfg.scale;
                this.playerSpine.node.y = -30;

                this.playerSpine.node.active = true;
                this.npcSpine.node.active = false;

                let spineName = ModelManager.get(PveGeneralModel).skin;
                let url = StringUtils.format("spine/hero/{0}/1/{0}", spineName);
                GlobalUtil.setSpineData(this.node, this.playerSpine, url, true, "stand_s", true, true);
                GlobalUtil.setSpineData(this.node, this.npcSpine, null);
            } else {
                let subnode = this.dialogNode.getChildByName('sub_listbg03');
                subnode.scaleX = Math.abs(subnode.scaleX);
                this.npcName.string = StringUtils.trim(cfg.npcName);
                this.nameBg.x = this.nameBg.x <= 0 ? this.nameBg.x : -this.nameBg.x;
                this.nameBg.width = this.npcName.node.width + 48;
                this.npcSpine.node.scaleY = 1 * cfg.scale;
                this.npcSpine.node.scaleX = -1 * cfg.scale;

                this.playerSpine.node.active = false;
                this.npcSpine.node.active = true;

                // spine资源路径
                let url: string;
                if (cc.js.isNumber(cfg.npcHead)) {
                    // 英雄或怪物配置
                    let hcfg = ConfigManager.getItemById(HeroCfg, cfg.npcHead);
                    if (hcfg) {
                        url = hcfg.skin;
                    } else {
                        url = ConfigManager.getItemById(MonsterCfg, cfg.npcHead).skin;
                    }
                } else if (cc.js.isString(cfg.npcHead)) {
                    // 直接配置的资源路径
                    url = cfg.npcHead;
                }
                let animation: string;
                if (StringUtils.startsWith(url, 'M_')) {
                    // 怪物
                    url = StringUtils.format("spine/monster/{0}/{0}", url);
                    animation = "stand_s";
                } else if (StringUtils.startsWith(url, 'H_')) {
                    // 英雄
                    url = StringUtils.format("spine/hero/{0}/1/{0}", url);
                    animation = "stand";
                }
                GlobalUtil.setSpineData(this.node, this.npcSpine, url, true, animation, true, true);
                GlobalUtil.setSpineData(this.node, this.playerSpine, null);
            }
            this.dialogNode.opacity = 0;
            this.dialogNode.runAction(cc.fadeIn(0.5));
            this.npcDialgo.string = "";
            this._printRichText(cfg.text);
            this.arrowNode.getComponent(cc.Animation).play("arrowJump");
        } else {
            this.dialogNode.active = false;
            this.dialogNode.stopAllActions();
            this.arrowNode.getComponent(cc.Animation).stop();
        }
        // 更新背景图和挖遮照
        this._showGuideBg();
        this._showHandNode();
        this._showInvertedMask();
    }

    /**富文本打印效果 */
    _printRichText(str: string = "") {
        const regex = /<.+?\/?>/g; // 匹配尖括号标签
        const matchArr = str.match(regex);
        const specialChar = "│";
        const replaceStr = str.replace(regex, specialChar); // 标签数组
        const textArr: string[] = replaceStr.split(specialChar); // 文字数组
        const strArr: string[] = []; // 存放处理过的文字数组
        let paraNum = 0; // 待替换参数个数
        for (let text of textArr) {
            // 非空字符替换成类似 $[0-n] 参数
            if (text !== "") {
                text = `$[${paraNum}]`;
                paraNum += 1;
            }
            strArr.push(text);
        }
        let templetStr: string = strArr.join(specialChar); // 数组转成待替换字符串
        for (let index = 0; index < textArr.length; index++) {
            // 转换代替换字符串之后, 删除文字数组多余空字符
            if (textArr[index] === "") {
                textArr.splice(index, 1);
                index = index - 1;
            }
        }
        while (templetStr.search(specialChar) !== -1) {
            // 数组转成的字符串原本 '特殊字符' 位置都是富文本标签的位置, 替换回标签
            if (matchArr[0]) {
                templetStr = templetStr.replace(specialChar, matchArr[0].toString());
                matchArr.splice(0, 1);
            } else {
                templetStr = templetStr.replace(specialChar, "");// 空字符串替换,防止死循环
                console.warn("matchArr not enough");
            }
        }
        const lastStrArr: string[] = []; // 转换后富文本数组
        const arrayParm: string[] = []
        for (let i = 0; i < paraNum; i++) {
            arrayParm.push("")
        }
        for (let i = 0; i < textArr.length; i++) {
            for (const text of textArr[i]) {
                arrayParm[i] = arrayParm[i] + text;
                let replaceStr1 = templetStr;
                for (let index = 0; index < paraNum; index++) {
                    replaceStr1 = replaceStr1.replace(`$[${index}]`, arrayParm[index]);
                }
                lastStrArr.push(replaceStr1);
            }
        }

        const func = () => {
            if (!this.dialogNode.active) return;
            if (!lastStrArr.length) {
                this.isPrinting = false;
                return;
            }
            this.npcDialgo.string = this.isPrinting ? lastStrArr.shift() : lastStrArr.pop();
            this.isPrinting && gdk.DelayCall.addCall(func, this, 0.05);
        };
        this.isPrinting = true;
        gdk.DelayCall.addCall(func, this, 0.3);
    }

    // 给按钮显示手指指引
    _showHandNode() {
        let cfg = this.guideModel.curGuide;
        // 绑定的按钮
        this.clickNode = this.guideModel.bindBtns[cfg.bindBtnId];
        if (!cc.isValid(this.clickNode) || !this.clickNode.activeInHierarchy) {
            // 绑定的按钮还没准备好，或者还没有添加到显示列表
            this.clickNode = null;
            this.isWaitingClickNode = !!cfg.bindBtnId;
            this.registerTouchListener();
            return;
        }
        this.registerTouchListener();
        // 播放视频类引导不显示手指
        if (cfg.type == GuideType.PLAY_VIDEO) {
            return;
        }
        // 展示按钮不显示手指
        if (cfg.type == GuideType.BTN_FOR_SHOW) {
            return;
        }
        this.hand.active = true;
        this._updateHandPos();
        if (cfg.type == GuideType.FREE) {
            // 拖拽动画
            this._showDragAct();
        } else {
            // 普通动画
            this._showsScaleAct();
        }
    }

    // 更新手势动画位置
    _updateHandPos() {
        let cfg = this.guideModel.curGuide;
        if (!cfg) return;
        let node = this.clickNode;
        if (!cc.isValid(node)) return;
        let offsetX = 40, offsetY = -15;
        if (!cc.js.isString(cfg.bindBtnOffset)) {
            [offsetX, offsetY] = cfg.bindBtnOffset;
        }
        let pos = node.getPosition();
        pos.x += offsetX;
        pos.y += offsetY;
        if (node.parent) {
            pos = node.parent.convertToWorldSpaceAR(pos);
        } else {
            pos = node.convertToWorldSpaceAR(pos);
        }
        pos = this.node.convertToNodeSpaceAR(pos);
        this.hand.setPosition(pos);
    }

    // 显示挖空遮照
    _showInvertedMask() {
        let cfg = this.guideModel.curGuide
        // 遮罩层
        if (cfg && cc.js.isNumber(cfg.maskAlpha)) {
            this.mask.active = true;
            this.mask.opacity = cfg.maskAlpha;
            this.mask.width = cc.winSize.width * 3;
            this.mask.height = cc.winSize.height * 3;
            // 挖空位置
            if (!cc.js.isString(cfg.maskInverted)) {
                // 挖空坐标设置
                let args: any[] = cfg.maskInverted;
                // 创建节点
                if (!this.tempMask) {
                    this.tempMask = new cc.Node();
                    this.tempMask.addComponent(cc.Mask).inverted = true;
                    this.tempMask.parent = this.bg.node;
                    this.mask.parent = this.tempMask;
                }
                // 设置显示状态
                this.bg.node.active = true;
                this.tempMask.active = true;
                // 挖空类型设置
                let comp = this.tempMask.getComponent(cc.Mask);
                switch (args[0]) {
                    case 'rect':
                        // 矩形
                        comp.type = cc.Mask.Type.RECT;
                        this.tempMask.width = args[3];
                        this.tempMask.height = args[4];
                        break;

                    case 'ellipse':
                        // 椭圆
                        comp.type = cc.Mask.Type.ELLIPSE;
                        comp.segements = args[3];
                        break;
                }
                this._updateInvertedMaskPos();
            } else if (this.tempMask) {
                // 不需要时清除
                this.mask.parent = this.node;
                this.mask.zIndex = -1;
                this.mask.setPosition(0, 0);
                this.tempMask.destroy();
                this.bg.node.active = false;
                this.tempMask = null;
            }
        } else {
            this.mask.active = false;
            this.tempMask && (this.tempMask.active = false);
        }
    }

    // 更新挖空位置
    _updateInvertedMaskPos() {
        if (!this.tempMask) return;
        if (!this.tempMask.activeInHierarchy) return;
        let cfg = this.guideModel.curGuide
        let args: any[] = cfg.maskInverted;
        let pos: cc.Vec2;
        if (cc.js.isNumber(args[1]) && cc.js.isNumber(args[2])) {
            // 使用配置中指定的绝对坐标
            pos = cc.v2(args[1], args[2]);
        } else if (this.clickNode && this.clickNode.activeInHierarchy) {
            // 使用当前按钮的坐标
            pos = this.clickNode.getPosition();
            pos = this.clickNode.parent.convertToWorldSpaceAR(pos);
            pos = this.node.convertToNodeSpaceAR(pos);
        } else {
            // 挖空参数存在异常
            this.tempMask.setPosition(10000, 10000);
            this.mask.setPosition(0, 0);
            return;
        }
        // 更新位置
        this.tempMask.setPosition(pos);
        this.mask.setPosition(-pos.x, -pos.y);
    }

    // 给提示文字显示手指指引
    showTipHand() {
        this.hand.active = true
        let pos = this.tipsNode.position
        let size = this.tipsNode.getContentSize()
        let newPos = cc.v2(pos.x + size.width / 2 * 0.8, pos.y - size.height / 2 * 0.8)
        this.hand.setPosition(newPos)
    }

    _showTipsNode() {
        let cfg = this.guideModel.curGuide;
        this.tipsNode.active = true;
        this.tipsGirl.node.active = true;
        let sysScoreGuideIds = [210006, 210007, 210008, 210009, 210010]
        if (sysScoreGuideIds.indexOf(cfg.id) != -1) {
            this.tipsGirl.node.y = -50
            this.tipsGirl.node.scale = 1.1
            GlobalUtil.setSpineData(
                this.node,
                this.tipsGirl,
                "spine/monster/M_qipaochongwu/M_qipaochongwu",
                false,
                "action1",
                false,
                true,
                (spine: sp.Skeleton) => {
                    let id = MathUtil.rnd(1, 3)
                    spine.addAnimation(0, `action${id}`, true);
                },
            );
        } else {
            this.tipsGirl.node.y = -100
            this.tipsGirl.node.scale = 0.85
            GlobalUtil.setSpineData(
                this.node,
                this.tipsGirl,
                "spine/common/E_com_xinshou/E_com_xinshou",
                false,
                "hit_s",
                false,
                true,
                (spine: sp.Skeleton) => {
                    spine.addAnimation(0, "stand_s", true);
                },
            );
        }
        // this.tipsGirl.addAnimation(0, "hit_s", false);
        // this.tipsGirl.addAnimation(0, "stand_s", true);
        this.tipsText.string = cfg.text;
        let tipsSize = this.tipsText.node.getContentSize();
        // console.log("_showTipsNode", cfg.text)
        let size = tipsSize
        // if (cfg.textSize) {
        //     size = cc.size(cfg.textSize[0], cfg.textSize[1])
        // }
        this.tipsText.node.setContentSize(size);
        this.tipsText.maxWidth = size.width;
        let pos = cc.v2(0, 0);
        if (cfg.textPos) {
            [pos.x, pos.y] = cfg.textPos;
        }
        this.tipsNode.setPosition(pos);
        // let parSize = cc.size(size.width + 40, size.height + 30)
        // this.tipsNode.setContentSize(parSize)
    }

    /*展示缩放动画 */
    _showsScaleAct() {
        this.hand.getChildByName('hand').active = false;
        this.hand.getChildByName('spine').active = true;
    }

    /**展示拖动指引 */
    _showDragAct() {
        // this.hand.getChildByName("hand").stopAllActions()
        // this.hand.getChildByName("click").stopAllActions()
        this.hand.getChildByName('hand').active = true;
        this.hand.getChildByName('spine').active = false;
        let startPos = this.hand.getPos();
        let dragPos = this.guideModel.curGuide.dragPos || [0, 0]
        let act2 = cc.moveTo(1, cc.v2(dragPos[0], dragPos[1]))
        let act3 = cc.delayTime(1)
        let act4 = cc.moveTo(0, startPos)
        let seq = cc.sequence(act2, act3, act4)
        let rep = cc.repeatForever(seq)
        this.hand.runAction(rep)
    }

    /**跳过按钮函数 */
    skipGuide() {
        let cfg = this.guideModel.curGuide;
        let nextCfg = null;
        // 一直跳到下一个无需点击跳转的引导
        while (cfg.skip && cfg.nextTask && !cfg.forward && !cfg.bindBtnId) {
            nextCfg = this.guideModel.guideCfgs[cfg.nextTask];
            cfg = nextCfg;
        }
        if (nextCfg) {
            GuideUtil.setGuideId(nextCfg.id);
        }
    }

    onBindBtn(id: number, node: cc.Node = null) {
        let cfg = this.guideModel.curGuide;
        if (cfg && cfg.bindBtnId == id && node) {
            this.clickNode = node;
        }
    }

    /**显示背景轮播 */
    _bgIndex: number;
    _showGuideBg() {
        let cfg = this.guideModel.curGuide;
        if (cfg && cfg.bg && cfg.bg.length > 0) {
            this._bgIndex = 0;
            this._showBgImg();
        } else {
            this.bg.spriteFrame = null;
        }
    }

    /**加载背景图 */
    _showBgImg() {
        let cfg = this.guideModel.curGuide;
        let name = cfg ? cfg.bg[this._bgIndex] : null;
        if (!name) {
            this.bg.spriteFrame = null;
            return;
        }
        this.bg.node.active = true;
        GlobalUtil.setSpriteIcon(this.node, this.bg, `guideBg/${name}`);
        this._bgIndex++;
        if (this._bgIndex < cfg.bg.length) {
            this.scheduleOnce(() => {
                this._showBgImg();
            }, 0.5);
        }
    }

    // 广播相关
    _addSystemNotice() {
        this._playSystemNotice();
        this._playLowEffectNotice();
    }

    //tvCfg.show_type==1时的广播效果
    _playSystemNotice() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (ModelManager.get(ChatModel).noticeList.length <= 0) return;
        let bar = gdk.gui.layers.messageLayer.getChildByName('guide_view_notice_bar');
        if (!bar) {
            bar = cc.instantiate(this.noticeBar);
            bar.y = cc.view.getVisibleSize().height / 2 - 220;
            bar.name = 'guide_view_notice_bar';
            bar.parent = gdk.gui.layers.messageLayer;
        }
        cc.find('mask', bar).getComponent(cc.Mask).enabled = true;
        let textLayout: cc.Node = cc.find('mask/layout', bar);
        if (textLayout.getNumberOfRunningActions() <= 0) {
            let chatModel = ModelManager.get(ChatModel);
            let richText = textLayout.getComponent(cc.RichText);
            richText.horizontalAlign = cc.macro.TextAlignment.LEFT;
            richText.string = chatModel.noticeList[0];
            textLayout.setAnchorPoint(0, .5);
            textLayout.x = 300;
            textLayout.y = 3;
            textLayout.runAction(cc.sequence(
                cc.moveTo(Math.max(10, Math.ceil(textLayout.width / 130)), cc.v2(-300 - textLayout.width, 0)),
                cc.callFunc(() => {
                    //移除第一条数据
                    chatModel.noticeList.shift();
                    //清除所有动作
                    textLayout.stopAllActions();
                    if (chatModel.noticeList.length > 0) {
                        gdk.Timer.callLater(this, this._playSystemNotice);
                    } else {
                        gdk.NodeTool.hide(bar, false);
                    }
                }, this),
            ));
        }
    }

    //tvCfg.show_type==2时的广播效果
    _playLowEffectNotice() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (ModelManager.get(ChatModel).lowEffectNoticeList.length <= 0) return;
        let bar = gdk.gui.layers.messageLayer.getChildByName('guide_view_low_effect_notice_bar');
        if (!bar) {
            bar = cc.instantiate(this.noticeBar);
            // bar.y = 590;
            bar.y = cc.view.getVisibleSize().height / 2 - 110;
            bar.name = 'guide_view_low_effect_notice_bar';
            bar.parent = gdk.gui.layers.messageLayer;
        }
        let chatModel = ModelManager.get(ChatModel);
        cc.find('mask', bar).getComponent(cc.Mask).enabled = false;
        let textLayout: cc.Node = cc.find('mask/layout', bar);
        if (textLayout.getNumberOfRunningActions() >= 1) {
            //移除第一条数据
            chatModel.lowEffectNoticeList.shift();
            //清除所有动作
            textLayout.stopAllActions();
            if (ModelManager.get(ChatModel).lowEffectNoticeList.length <= 0) {
                textLayout.stopAllActions();
                gdk.NodeTool.hide(bar, false);
                return;
            }
        }
        let richText = textLayout.getComponent(cc.RichText);
        richText.horizontalAlign = cc.macro.TextAlignment.CENTER;
        richText.string = chatModel.lowEffectNoticeList[0];
        textLayout.setAnchorPoint(.5, .5);
        textLayout.x = 0;
        textLayout.y = -70;
        textLayout.runAction(cc.sequence(
            cc.moveTo(.3, cc.v2(0, 3)),
            cc.delayTime(2),
            cc.callFunc(() => {
                //移除第一条数据
                chatModel.lowEffectNoticeList.shift();
                //清除所有动作
                textLayout.stopAllActions();
                if (chatModel.lowEffectNoticeList.length > 0) {
                    gdk.Timer.callLater(this, this._playLowEffectNotice);
                } else {
                    gdk.NodeTool.hide(bar, false);
                }
            }, this),
        ));
    }

    // // 界面相关的引导事件
    // _onViewChanged(node: cc.Node, old: cc.Node) {
    //     let resId: string, key: string;
    //     // 关闭事件
    //     if (old) {
    //         resId = gdk.Tool.getResIdByNode(old);
    //         key = 'view#' + resId + "#close";
    //         GuideUtil.activeGuide(key);
    //         gdk.e.emit(key);
    //     }
    //     // 打开事件
    //     if (node) {
    //         resId = gdk.Tool.getResIdByNode(node);
    //         key = 'view#' + resId + "#open";
    //         GuideUtil.activeGuide(key);
    //         gdk.e.emit(key);
    //     }
    // }

    // _onPopupChanged(node: cc.Node) {
    //     if (!cc.isValid(node)) return;
    //     let resId = gdk.Tool.getResIdByNode(node);
    //     let key = 'popup#' + resId + '#open';
    //     GuideUtil.activeGuide(key);
    //     // 关闭事件
    //     let onHide = gdk.NodeTool.onHide(node);
    //     onHide.on(() => {
    //         let key = 'popup#' + resId + '#close';
    //         onHide.targetOff(this);
    //         GuideUtil.activeGuide(key);
    //         gdk.e.emit(key)
    //     }, this);
    // }

    // 升级
    _levelUpdate(data: any) {
        let { index, value, oldv, } = data;
        if (index != 101) return;
        if (value <= oldv) return;
        if (!SdkTool.tool.can_charge && value >= 5) {
            GuideUtil.isHideGuide = true;
            GuideUtil.destroy();
            return;
        }
        gdk.Timer.once(100, this, () => {
            if (!cc.isValid(this.node)) return;
            GuideUtil.levelActive(oldv, value);
        });
    }
}
