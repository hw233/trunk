import PveBaseBuffCtrl from '../buff/PveBaseBuffCtrl';
import PveBaseHaloCtrl from '../halo/PveBaseHaloCtrl';
import PveBuffModel from '../../model/PveBuffModel';
import PveBuffTipEffect, { PveBuffTipType } from '../base/PveBuffTipEffect';
import PveHaloModel from '../../model/PveHaloModel';
import PveHurtEffect, { PveHurtType } from '../base/PveHurtEffect';
import PvePool from '../../utils/PvePool';
import PveScaleEffectCtrl from '../effect/PveScaleEffectCtrl';
import PveSceneModel from '../../model/PveSceneModel';
import PveSceneState from '../../enum/PveSceneState';
import PveSkillModel from '../../model/PveSkillModel';
import PveTool from '../../utils/PveTool';
import StringUtils from '../../../../common/utils/StringUtils';
import { PveBaseFightModel } from '../../model/PveBaseFightModel';
import { PveFightAnimationOption, PveFightCtrl } from '../../core/PveFightCtrl';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import { Skill_buffCfg } from '../../../../a/config';

/**
 * Pve场景战斗对象基类
 * @Author: sthoo.huang
 * @Date: 2019-05-09 13:49:45
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-31 13:45:18
 */

const { ccclass, property, menu } = cc._decorator;

interface DamageColorType {
    c: cc.Color,
    b: number,
    t: number,
    s: number,
}

// 伤害颜色对应伤害类型的定义
const DamageColors: any = {
    1: {    // 红色，火系
        c: cc.color(0xfb, 0x8e, 0x87, 255), // 颜色
        b: 1.0, // 亮度
        t: 1.0, // 对比度
        s: 1.0  // 饱合度
    },
    2: {    // 绿色，辐射
        c: cc.color(0xa3, 0xf8, 0xa1, 255),
        b: 1.0, // 亮度
        t: 1.0, // 对比度
        s: 1.0  // 饱合度
    },
    3: {    // 蓝色，冷冻
        c: cc.color(0x8c, 0xb7, 0xff, 255),
        b: 1.0, // 亮度
        t: 1.0, // 对比度
        s: 1.0  // 饱合度
    },
    4: {    // 黄色，电能
        c: cc.color(0xfa, 0xf9, 0xb3, 255),
        b: 1.0, // 亮度
        t: 1.0, // 对比度
        s: 1.0  // 饱合度
    },
    5: {    // 黑色，穿刺
        c: cc.color(0x3f, 0x42, 0x3e, 255),
        b: 1.0, // 亮度
        t: 1.0, // 对比度
        s: 1.0  // 饱合度
    },
    0: {    // 白色，普通
        c: cc.color(255, 255, 255, 255),
        b: 1.5, // 亮度
        t: 1.0, // 对比度
        s: 1.0  // 饱合度
    },
};
DamageColors[''] = DamageColors[0];

// 缓存的模型对象包围框
const _rectCache: { [url: string]: cc.Rect } = {};

@ccclass
export default class PveBaseFightCtrl extends cc.Component implements PveFightCtrl {

    @property(sp.Skeleton)
    spines: Array<sp.Skeleton> = [];

    model: PveBaseFightModel;
    fsm: gdk.fsm.Fsm;
    sceneModel: PveSceneModel;
    rect: cc.Rect;
    buff: PveBaseBuffCtrl;
    halo: PveBaseHaloCtrl;

    onDie: gdk.EventTrigger;

    buffStackNode: cc.Node;
    specialStackNode: cc.Node; // 指定特效的buff层数
    bubbleNode: cc.Node; // 冒泡节点

    // 动作超时处理队列
    private timeOutArr: { spine: sp.Skeleton, opt: PveFightAnimationOption }[];
    private addTimeOut(spine: sp.Skeleton, opt: PveFightAnimationOption) {
        this.removeTimeOut(spine);
        this.timeOutArr.push({
            spine: spine,
            opt: opt,
        });
    }
    private removeTimeOut(spine: sp.Skeleton) {
        for (let i = this.timeOutArr.length - 1; i >= 0; i--) {
            if (this.timeOutArr[i].spine === spine) {
                this.timeOutArr.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    private timeOutUpdate(dt: number) {
        let spine: sp.Skeleton;
        let opt: PveFightAnimationOption;
        for (let i = this.timeOutArr.length - 1; i >= 0; i--) {
            let item = this.timeOutArr[i];
            spine = item.spine;
            if (!cc.isValid(spine) || !cc.isValid(spine.node) || !spine.node.active) {
                this.timeOutArr.splice(i, 1);
                continue;
            }
            opt = item.opt;
            opt.timeOut -= dt * spine.timeScale;
            if (opt.timeOut <= 0) {
                this.timeOutArr.splice(i, 1);
                // 清除事件监听
                spine.setStartListener(null);
                spine.setEventListener(null);
                spine.setCompleteListener(null);
                // 事件和完成回调
                opt.onEvent && opt.onEvent.call(opt.thisArg, opt.eventName);
                // 设置后续动作
                if (opt.after) {
                    this.setAnimation(opt.after.name, opt.after);
                }
                opt.onComplete && opt.onComplete.call(opt.thisArg);
            }
        }
    }

    onEnable() {
        this.fsm = this.node.getComponent(gdk.fsm.FsmComponent).fsm;
        this.onDie = gdk.EventTrigger.get();
        this.timeOutArr = [];
        // 设置默认尺寸
        let sm = this.sceneModel;
        let scale: number = this.model.size * sm.scale;
        for (let i = 0, n = this.spines.length; i < n; i++) {
            let spine = this.spines[i];
            spine.node.scale = scale;
            if (spine.node.parent === this.node) {
                spine.node.zIndex = i + 2;
            }
        }
        gdk.NodeTool.show(this.node);
        CC_DEBUG && !cc.sys.isMobile && this.node.on(
            cc.Node.EventType.TOUCH_END,
            () => {
                let model = this.model;
                if (!model || !model.ready || !model.loaded) return;
                // 基础属性
                let baseProp = model.baseProp;
                let baseAttr = {};
                for (let name in baseProp) {
                    baseAttr[name] = baseProp[name];
                }
                // 详细属性
                let prop = model.prop;
                let attr = {};
                for (let name in prop) {
                    attr[name] = prop[name];
                }
                cc.log('=====================================');
                cc.log('名字:', model.prop.name);
                cc.log('基础属性:', baseAttr);
                cc.log('属性:', attr);
                cc.log('技能:', model.skills.concat());
                cc.log('BUFF:', model.buffs.concat());
                cc.log('光环:', model.halos.concat());
                cc.log('=====================================');
            },
            this,
        );
    }

    onDisable() {
        this.sceneModel.removeFight(this);
        for (let i = 0, n = this.spines.length; i < n; i++) {
            let spine = this.spines[i];
            PveTool.clearSpine(spine);
        }
        this.removePrePos();
        this.restColor();
        this.onDie && this.onDie.release();
        this.onDie = null;
        this.timeOutArr = null;
        this.fsm = null;
        this.sceneModel = null;
        this.model = null;
        this.rect = null;
        this.node.off(cc.Node.EventType.POSITION_CHANGED,
            this.updateChangePos,
            this,
        );
        this.buffStackNode && this.hideBuffStack(false);
        this.specialStackNode && this.hideSpecialStack(false);
        this.bubbleNode && this.hideBubble(false);
        CC_DEBUG && this.node.off(cc.Node.EventType.TOUCH_END);
    }

    onRecover() {
        PvePool.put(this.node);
    }

    hide(effect: boolean = true) {
        this.buff && this.buff.clearAll();
        this.halo && this.halo.clearAll();
        this.buffStackNode && this.hideBuffStack(effect);
        this.specialStackNode && this.hideSpecialStack(false);
        this.bubbleNode && this.hideBubble(false);
        gdk.NodeTool.hide(this.node, effect, this.onRecover, this);
    }

    get isAlive() {
        if (this.sceneModel &&
            this.model &&
            this.model.hp > 0 &&
            cc.isValid(this.node) &&
            this.node.activeInHierarchy
        ) {
            return true;
        }
        return false;
    }

    get invisible() {
        return this.model.getProp('invisible');
    }

    updateBuff(): void {

    }

    getAnimation(animation: string): string {
        return animation;
    }

    getScale(animation: string): number {
        return 1;
    }

    /**
     * 需在子类中覆写此方法实现目标查找功能
     */
    setDir(to: cc.Vec2) {

    }

    // 设置动作
    setAnimation(name: string, opt?: PveFightAnimationOption): boolean {
        let scaleX = this.getScale(name);
        let loop = !opt || (opt.loop === void 0) || opt.loop;
        let cb = opt && opt.onComplete;
        let eb = opt && opt.onEvent;
        let after = opt && opt.after;
        let animation = this.getAnimation(name);

        for (let index = this.spines.length - 1; index >= 0; index--) {
            let spine: sp.Skeleton = this.spines[index];

            // 无spine数据的对象，则不操作
            if (!spine || !spine.skeletonData) continue;

            // 设置播放完成回调、事件回调，如果有多个动画则只监听第一个动画
            if (index == 0) {
                if (cb || eb || after) {
                    if (eb) {
                        // 事件侦听
                        spine.setEventListener((entry: any, event: any) => {
                            eb.call(opt.thisArg, event.data.name);
                        });
                        // 指定的事件不存在，则打印错误信息
                        if (!!opt.eventName &&
                            !PveTool.hasSpineEvent(spine, animation, opt.eventName)) {
                            CC_DEBUG && cc.error(`缺少事件：${opt.eventName}, 文件名：${spine.skeletonData.name}, 动作名：${animation}`);
                            eb.call(opt.thisArg, opt.eventName);
                        }
                    }
                    // 超时处理
                    if (cc.js.isNumber(opt.timeOut)) {
                        this.addTimeOut(spine, opt);
                    } else {
                        this.removeTimeOut(spine);
                    }
                    // 完成监听
                    spine.setCompleteListener(() => {
                        // 清除超时回调
                        if (cc.js.isNumber(opt.timeOut)) {
                            this.removeTimeOut(spine);
                        }
                        // 清除事件
                        spine.setStartListener(null);
                        // 陷阱待机特效范围显示问题修改（range_begin事件）
                        if (!spine.loop) {
                            spine.setEventListener(null);
                        }
                        spine.setCompleteListener(null);
                        // 设置后续动作
                        if (after) {
                            this.setAnimation(after.name, after);
                        }
                        // 完成回调
                        cb && cb.call(opt.thisArg);
                    });
                } else {
                    // 清除事件
                    spine.setStartListener(null);
                    spine.setEventListener(null);
                    spine.setCompleteListener(null);
                    this.removeTimeOut(spine);
                }
            }

            // 设置镜像
            spine.node.scaleX = Math.abs(spine.node.scaleX) * scaleX;

            // 将要设置的动作不存在时
            if (!PveTool.hasSpineAnimation(spine, animation)) {
                CC_DEBUG && cc.error(`缺少动作：${animation} , 文件名：${spine.skeletonData.name}`);
                animation = spine.animation;
            }

            // 设置动画名称
            let oldanm = spine.animation;
            let isadd = true;
            if (oldanm == null || oldanm == '' || (opt && opt.mode === 'set')) {
                // 行走动画为了平顺，则使用添加的方式修改 (怪物的移动动作可能会改变)
                isadd = (oldanm == animation) //&& (name == PveFightAnmNames.WALK );
            }
            let a: any[] = spine['_animationQueue'];
            if (isadd) {
                // 添加动画
                if (a && a.length > 0) {
                    a[0].animationName = animation;
                    a[0].loop = loop;
                } else {
                    spine.addAnimation(0, animation, loop);
                }
            } else {
                // 替换更新
                a && (a.length = 0);
                spine.loop = loop;
                spine.animation = animation;
            }
        }
        // 设置动画数据
        let model = this.model;
        if (model.animation != name) {
            model.animation = name;
            gdk.Timer.callLater(this, this._setSpeedScale);
        }
        // 更新包围框
        if (!this.rect) {
            gdk.Timer.callLater(this, this.updateRect);
        }
        return true;
    }

    // 快速设置坐标
    setPos(x: number, y: number) {
        let trs = this.node['_trs'];
        if (trs[0] === x && trs[1] === y) {
            return false;
        }
        this['_$N_pre_pos'] = { x: trs[0], y: trs[1] };
        this.node.once(cc.Node.EventType.POSITION_CHANGED, this.removePrePos, this);
        trs[0] = x;
        trs[1] = y;
        this.node['setLocalDirty'](cc.Node._LocalDirtyFlag.ALL_POSITION);
        this.updateChangePos();
        return true;
    }
    removePrePos() {
        delete this['_$N_pre_pos'];
    }

    // 上一个坐标
    getPrePos(): cc.Vec2 {
        if (this['_$N_pre_pos']) {
            return this['_$N_pre_pos'];
        }
        return this.node.getPos();
    }

    // 获得当前坐标
    getPos(dt: number = 0): cc.Vec2 {
        return this.node.getPos();
    }

    // 获得包围框
    getRect(): cc.Rect {
        let r = this.rect;
        if (r && this.spines.length == 1) {
            let s = Math.abs(this.spines[0].node.scaleX);
            if (s != 1) {
                r = r.clone();
                r.width *= s;
                r.height *= s;
                return r;
            }
        }
        return r;
    }

    // 更新包围框
    updateRect() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let model = this.model;
        if (!model || !model.ready) return;
        if (this.spines.length == 1) {
            let key = model.skin + "#" + model.size;
            let rect = _rectCache[key];
            if (rect) {
                // 从缓存中直接获取
                return this.rect = rect;
            } else {
                let spine = this.spines[0];
                let skeleton = spine['_skeleton'];
                if (skeleton && spine.animation != '') {
                    let bones = skeleton.bones;
                    let bone = null;
                    rect = spine.node.getBoundingBox();
                    if (bones && bones.length) {
                        skeleton.updateWorldTransform();
                        for (let i = 0, n = bones.length; i < n; i++) {
                            let bname: string = bones[i].data.name;
                            if (bname == 'head01' ||
                                StringUtils.endsWith(bname, '_head01') ||
                                StringUtils.endsWith(bname, '_head') ||
                                StringUtils.endsWith(bname, '_head1')) {
                                bone = bones[i];
                                break;
                            }
                        }
                        if (bone) {
                            rect.height = bone.worldY + (bone.data.length * bones[0].scaleY);
                            rect.y = 0;
                        }
                        // 保存至缓存中
                        _rectCache[key] = rect;
                    }
                    return this.rect = rect;
                }
            }
        } else if (this.spines.length > 1) {
            // 小兵
            return this.rect = cc.rect(0, 0);
        }
        return this.rect = null;
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        let model = this.model;
        if (this.isAlive) {
            let sceneModel = this.sceneModel;
            if (sceneModel.isLogicalFrame) {
                let tdt = model.lastLogicalTime < 0 ? dt : sceneModel.time - model.lastLogicalTime;
                model.lastLogicalTime = sceneModel.time;
                //if (!sceneModel.isDemo) {
                if (this.buff && this.buff.enabled) {
                    this.buff.updateScript(tdt);
                }
                if (this.halo && this.halo.enabled) {
                    this.halo.updateScript(tdt);
                }
                if (sceneModel.isReplay) {
                    // 回放模式不执行后续逻辑
                    return;
                }
                if (model.speedScaleDirty) {
                    // 刷新播放速度
                    this._setSpeedScale();
                } else if (this.spines[0].timeScale == 0) {
                    // 强制恢复播放速度
                    gdk.Timer.callLater(this, this._setSpeedScale);
                }
                //}
                model.updateCD(tdt);
            }
        }
        if (this.buffStackNode && !model.getProp('showBuffStack')) {
            this.hideBuffStack();
        }
        if (this.specialStackNode && !model.getProp('showSpecialStack')) {
            this.hideBuffStack();
        }
        if (this.bubbleNode && !model.getProp('showBubble')) {
            this.hideBubble();
        }
        if (this.timeOutArr.length > 0) {
            this.timeOutUpdate(dt);
        }
        this.fsm && PveTool.execFsmUpdateScript(this.fsm, dt);
    }

    //隐藏buff层数
    hideBuffStack(effect: boolean = true) {
        if (!this.buffStackNode) return;
        gdk.NodeTool.hide(this.buffStackNode, effect, () => {
            PvePool.put(this.buffStackNode);
        });
        this.buffStackNode = null;

    }
    //隐藏特殊buff层数
    hideSpecialStack(effect: boolean = true) {
        if (!this.specialStackNode) return;
        gdk.NodeTool.hide(this.specialStackNode, effect, () => {
            PvePool.put(this.specialStackNode);
        });
        this.specialStackNode = null;

    }

    //隐藏气泡
    hideBubble(effect: boolean = true) {
        if (!this.bubbleNode) return;
        gdk.NodeTool.hide(this.bubbleNode, effect, () => {
            PvePool.put(this.bubbleNode);
        });
        this.bubbleNode = null;

    }

    updateChangePos() {
        if (this.specialStackNode) {
            this.updateSpecialStackPos()
        }
        if (this.buffStackNode) {
            this.updateBuffStackPos()
        }
        if (this.bubbleNode) {
            this.updateBubblePos()
        }
    }

    // 更新buff层数位置
    updateBuffStackPos() {
        if (!this.buffStackNode) return;
        let r = this.getRect();
        if (r) {
            this.buffStackNode.setPosition(
                this.node.x,
                this.node.y + Math.ceil(r.y + r.height + 55),
            );
        }
    }
    // 更新特殊buff层数位置
    updateSpecialStackPos() {
        if (!this.specialStackNode) return;
        let r = this.getRect();
        if (r) {
            this.specialStackNode.setPosition(
                this.node.x,
                this.node.y + Math.ceil(r.y + r.height + 55),
            );
        }
    }

    // 更新气泡位置
    updateBubblePos() {
        if (!this.bubbleNode) return;
        let r = this.getRect();
        if (r) {
            this.bubbleNode.setPosition(
                this.node.x + 90,
                this.node.y + Math.ceil(r.y + r.height + 55),
            );
        }
    }

    /**
     * 显示飘血数字
     * @param hurt 
     * @param type 
     * @param dir 
     * @param dmg_type 
     */
    showHurt(
        hurt: number,
        type: PveHurtType = PveHurtType.SKILL,
        dir: 1 | -1 = 1,
        dmg_type: number = 0
    ): void {
        let sceneModel = this.sceneModel;
        if (!sceneModel || sceneModel.isDemo) {
            return;
        }
        PveTool.callLater(this, this.showHurtLater, [hurt, type, dir, dmg_type]);
    }
    showHurtLater(
        hurt: number,
        type: PveHurtType = PveHurtType.SKILL,
        dir: 1 | -1 = 1,
        dmg_type: number = 0,
    ) {
        let sceneModel = this.sceneModel;
        if (!sceneModel) return;
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy || !this.node.visible) return;
        let sceneCtrl = sceneModel.arenaSyncData ? sceneModel.arenaSyncData.mainModel.ctrl : sceneModel.ctrl;
        let node = PvePool.get(sceneCtrl.hurtEffectPrefab) as cc.Node;
        let ctrl = node.getComponent(PveHurtEffect);
        ctrl.sceneModel = sceneModel;
        ctrl.target = this;
        ctrl.dir = dir;
        ctrl.type = type;
        ctrl.dmg_type = dmg_type;
        ctrl.value = '' + Math.abs(hurt); // '/' 代表 '-' 号
        sceneCtrl.hurt.addChild(node, 100);
    }

    /**
     * 显示BUFF提示文字
     * @param tipStr 
     * @param type 
     * @param isEnemy 
     * @param bufCfg 
     */
    showBuffTip(
        tipStr: string,
        type: PveBuffTipType = PveBuffTipType.BUFF,
        isEnemy: boolean = false,
        bufCfg?: Skill_buffCfg,
    ) {
        let sceneModel = this.sceneModel;
        if (!sceneModel || sceneModel.isDemo) {
            return;
        }
        let n = '_N$_buff_tips_' + tipStr;
        if (!this[n]) {
            this[n] = true;
            PveTool.callLater(this, this.showBuffTipLater, [tipStr, type, isEnemy, bufCfg]);
        }
    }
    showBuffTipLater(
        tipStr: string,
        type: PveBuffTipType = PveBuffTipType.BUFF,
        isEnemy: boolean = false,
        bufCfg?: Skill_buffCfg,
    ) {
        delete this['_N$_buff_tips_' + tipStr];
        let sceneModel = this.sceneModel;
        if (!sceneModel) return;
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy || !this.node.visible) return;
        let sceneCtrl = sceneModel.arenaSyncData ? sceneModel.arenaSyncData.mainModel.ctrl : sceneModel.ctrl;
        let node = PvePool.get(sceneCtrl.buffEffectPrefab) as cc.Node;
        let ctrl = node.getComponent(PveBuffTipEffect);
        ctrl.sceneModel = sceneModel;
        ctrl.target = this;
        //ctrl.dir = dir;
        ctrl.type = type;
        ctrl.value = tipStr;
        ctrl.isEnemy = isEnemy;
        ctrl.buffCfg = bufCfg;
        sceneCtrl.buffTip.addChild(node, 110);
    }

    changeColor(v: DamageColorType, time: number) {
        let sceneModel = this.sceneModel;
        if (!sceneModel || sceneModel.isDemo) {
            return;
        }
        if (!v) return;
        for (let i = 0, n = this.spines.length; i < n; i++) {
            PveTool.setSpineShader(
                this.spines[i],
                'spine_add_color',
                [
                    { key: 'added', value: v.c },
                    { key: 'brightness', value: v.b },
                    { key: 'contrast', value: v.t },
                    { key: 'saturation', value: v.s },
                ],
            );
        }
        gdk.DelayCall.addCall(this.restColor, this, time / sceneModel.timeScale);
    }

    restColor() {
        gdk.DelayCall.cancel(this.restColor, this);
        for (let i = 0, n = this.spines.length; i < n; i++) {
            PveTool.setSpineShader(this.spines[i]);
        }
    }

    addBuff(m: PveBuffModel): void {
        if (!this.buff) {
            this.buff = this.node.addComponent(PveBaseBuffCtrl);
            this.buff.target = this;
        }
        this.buff.addBuf(m);
    }

    // 删除BUFF
    removeBuff(id: number): void {
        if (this.buff) {
            this.buff.removeBuf(id, 'all');
        }
    }

    addHalo(m: PveHaloModel): void {
        if (!this.halo) {
            this.halo = this.node.addComponent(PveBaseHaloCtrl);
            this.halo.target = this;
        }
        this.halo.addHalo(m);
    }

    // 删除光环
    removeHalo(id: number): void {
        if (this.halo) {
            this.halo.removeHalo(id);
        }
    }

    /**
     * 被击退
     * @param attacker 
     */
    repel(attacker: PveFightCtrl): void {

    }

    /**
     * 重置
     */
    reset() {
        let model = this.model;
        // 清除BUFF
        if (this.buff) {
            this.buff.clearAll();
        }
        // 清除光环
        if (this.halo) {
            this.halo.clearAll();
        }
        if (this.buffStackNode) {
            this.hideBuffStack();
        }
        if (this.specialStackNode) {
            this.hideSpecialStack();
        }
        if (this.bubbleNode) {
            this.hideBubble();
        }
        this.node.off(cc.Node.EventType.POSITION_CHANGED,
            this.updateChangePos,
            this,
        );
        // 还原数据
        model.removeTempProp();
        model.currSkill = null;
        model.targetId = -1;
        model.hpMax = model.prop.hp;
        model.hp = model.hpMax;
        model.speedScale = 1;
        model.nodeScale = 0;
        model.lastLogicalTime = -1;
        // 重置Fsm
        this.fsm.start();
        this.onReady();
    }

    /**
     * 被攻击时事件接口
     * @param attacker 
     */
    onAttacked(attacker: PveFightCtrl, model: PveSkillModel | PveBuffModel): void {
        // 根据不同的伤害类型叠加不同的颜色
        this.model.lastDamageType = model.config.dmg_type;
        this.changeColor(DamageColors[model.config.dmg_type], 0.25);
    }

    onReady() {

    }

    @gdk.binding('sceneModel.timeScale')
    @gdk.binding('model.loaded')
    _setSpeedScale() {
        let model = this.model;
        if (!model) return;
        model.speedScaleDirty = false;
        let sceneModel = this.sceneModel;
        if (!sceneModel) return;
        let scale = model.speedScale * sceneModel.timeScale;
        // 不同的动作有不同的速度
        let temAnimationStr = '';
        if (model.animation && model.animation.indexOf('atk') != -1) {
            temAnimationStr = PveFightAnmNames.ATTACK
        } else {
            temAnimationStr = model.animation
        }
        switch (temAnimationStr) {
            case PveFightAnmNames.ATTACK:
                // 攻速只针对普攻有效
                scale *= model.atkSpeed;
                break;

            case PveFightAnmNames.WALK:
                // 行走速度
                scale *= model.walkSpeed * model.walkSpeedR;
                break;
        }
        let spines = this.spines;
        for (let i = 0, n = spines.length; i < n; i++) {
            let spine = spines[i];
            if (spine.timeScale == scale) {
                break;
            }
            spine.timeScale = scale;
        }
    }

    @gdk.binding("model.nodeScale")
    _setScale(v: number) {
        for (let i = 0, n = this.spines.length; i < n; i++) {
            let spine = this.spines[i];
            let ctrl: PveScaleEffectCtrl = spine.node.getComponent(PveScaleEffectCtrl);
            if (v != 0) {
                if (!ctrl) {
                    ctrl = spine.node.addComponent(PveScaleEffectCtrl);
                }
                ctrl.timeScale = this.sceneModel.timeScale;
                ctrl.value = v;
            } else if (ctrl) {
                ctrl.value = 0;
            }
        }
    }

    @gdk.binding('sceneModel.state')
    _setState(v: PveSceneState) {
        let model = this.model;
        let node = this.node;
        if (!cc.isValid(node)) return;
        if (!model) return;
        if (!model.ready) return;
        switch (v) {
            case PveSceneState.Loading:
            case PveSceneState.Reset:
                this.reset();
                break;
        }
    }

    /**
     * 刷新护盾展示
     */
    refreshShiedShow() {

    }
}