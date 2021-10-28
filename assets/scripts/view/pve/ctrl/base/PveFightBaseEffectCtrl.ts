import PvePool from '../../utils/PvePool';
import PveTool from '../../utils/PveTool';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import { PveFightCtrl } from '../../core/PveFightCtrl';

/**
 * Pve战斗对象效果基类
 * @Author: sthoo.huang
 * @Date: 2019-06-03 11:21:22
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-28 14:05:40
 */

const { ccclass, property, menu } = cc._decorator;
@ccclass
export default class PveFightBaseEffectCtrl extends cc.Component {

    target: PveFightCtrl;
    spines: sp.Skeleton[] = [];
    url: string;

    onDisable() {
        if (this.spines.length > 0) {
            gdk.Timer.callLater(null, (...a: sp.Skeleton[]) => {
                for (let i = 0, n = a.length; i < n; i++) {
                    let s = a[i];
                    if (!s) continue;
                    if (!cc.isValid(s.node)) continue;
                    PveTool.clearSpine(s);
                    PvePool.put(s.node);
                }
            }, this.spines);
            this.spines = [];
        }
        this.url = null;
        // this.target = null;
        // this.sceneModel = null;
    }

    // 场景数据
    get sceneModel() {
        if (this.target) {
            return this.target.sceneModel;
        }
        return null;
    }

    // 效果地址，为null则不显示任何效果
    getSkin(): string {
        return null;
    }

    // 效果显示位置
    getSkinPos(): number {
        return 1;
    }

    // 效果显示位置
    getPos(): cc.Vec2 {
        switch (this.getSkinPos()) {
            case 1:
            case 101:
                // 中心位置
                return PveTool.getCenterPos(cc.Vec2.ZERO, this.target.getRect());

            case 2:
            case 102:
                // 脚底
                return cc.v2(0, 0);

            case 3:
            case 103:
                // 头顶
                let r = this.target.getRect();
                if (r) {
                    return cc.v2(0, Math.ceil(r.height + r.y));
                } else {
                    return cc.v2(0, 0);
                }
            case 4:
                // 血条上方
                let r1 = this.target.getRect();
                if (r1) {
                    return cc.v2(0, Math.ceil(r1.height + r1.y + 20 + 20));
                } else {
                    return cc.v2(0, 0);
                }

        }
        // 默认
        return PveTool.getCenterPos(cc.Vec2.ZERO, this.target.getRect());
    }

    getZIndex(): number {
        switch (this.getSkinPos()) {
            case 1:
            case 2:
            case 3:
                // 显示在人物上面
                return 999;

            case 101:
            case 102:
            case 103:
                // 显示在人物下面
                return -999;
        }
        // 默认
        return 999;
    }

    updateEffect() {
        let url = this.getSkin();
        if (url) {
            if (this.url !== url) {
                this.url = url;
                // 创建或更新spine实例
                let c = this.sceneModel.ctrl;
                let p = this.getPos();
                let i = this.getZIndex();
                this.target.spines.forEach((spine, index) => {
                    let s = this.spines[index];
                    if (!s) {
                        s = PvePool.get(c.spineNodePrefab).getComponent(sp.Skeleton);
                        s.node.parent = spine.node.parent;
                        this.spines[index] = s;
                    }
                    s.node.angle = 0;
                    s.node.zIndex = i;
                    s.node.setPosition(p.x + spine.node.x, p.y + spine.node.y);
                    let streak = s.node.getComponentInChildren(cc.MotionStreak);
                    streak.node.active = false;
                });
                // 加载资源
                let resId = gdk.Tool.getResIdByNode(this.node);
                let res = gdk.rm.getResByUrl(url, sp.SkeletonData, resId);
                if (res) {
                    // 已经加载的资源无需重复加载
                    this._loadComplete(res);
                } else {
                    gdk.rm.loadRes(resId, url, sp.SkeletonData, (res: sp.SkeletonData) => {
                        if (!cc.isValid(this.node)) return;
                        if (!this.enabled) return;
                        if (!this.spines.length) return;
                        if (!this.url || this.url != url) return;
                        this._loadComplete(res);
                    });
                }
            }
            return;
        }
        // 没有可显示特效的BUFF，则清除当前存在的特效
        if (this.spines.length > 0) {
            this.spines.forEach(spine => {
                PveTool.clearSpine(spine);
                PvePool.put(spine.node);
            });
            this.spines.length = 0;
            this.url = null;
        }
    }

    // BUFF特效加载成功回调
    _loadComplete(res: sp.SkeletonData) {
        if (!this.sceneModel) return;
        if (!this.target || !this.target.isAlive) return;
        this.spines.forEach(spine => {
            if (spine.skeletonData !== res) {
                spine.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
                spine.skeletonData = res;
                spine.loop = true;
                spine.animation = PveFightAnmNames.HIT;
            }
            spine.timeScale = this.sceneModel.timeScale;
            spine.paused = false;
            spine.node.active = true;
        });
    }

    // 清除所有效果并禁用组件
    clearAll() {
        if (this.spines.length > 0) {
            this.spines.forEach(spine => {
                PveTool.clearSpine(spine);
                PvePool.put(spine.node);
            });
            this.spines.length = 0;
            this.url = null;
        }
        if (this.enabled) {
            this.enabled = false;
        }
    }

    @gdk.binding('target.sceneModel.timeScale')
    _setSpeedScale() {
        if (!this.target) return;
        if (!this.sceneModel) return;
        this.spines.forEach(spine => spine.timeScale = this.sceneModel.timeScale);
    }
}