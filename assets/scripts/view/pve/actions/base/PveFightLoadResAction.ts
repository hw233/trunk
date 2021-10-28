import PveFightBaseAction from './PveFightBaseAction';
import PveTool from '../../utils/PveTool';
import { getPveFightAnmNameValue, PveFightAnmNameEnum } from '../../const/PveAnimationNames';
import { PveFightType } from '../../core/PveFightModel';

/**
 * Pve战斗单元资源加载动作
 * @Author: sthoo.huang
 * @Date: 2019-05-21 16:39:47
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-08 14:39:36
 */
const { property } = cc._decorator;

@gdk.fsm.action("PveFightLoadResAction", "Pve/Base")
export default class PveFightLoadResAction extends PveFightBaseAction {

    @property({ type: cc.Enum(PveFightAnmNameEnum), tooltip: "默认的动画名称" })
    animation: PveFightAnmNameEnum = PveFightAnmNameEnum.IDLE;

    @property({ tooltip: "默认动画是否循环" })
    loop: boolean = true;

    onEnter() {
        super.onEnter();
        this.loadRes();
    }

    /**
     * 加载资源
     */
    loadRes() {
        let resId: string = gdk.Tool.getResIdByNode(this.node);
        let url: string = this.getUrl();
        let id: number = this.model.id;
        let res = gdk.rm.getResByUrl(url, sp.SkeletonData, resId);
        if (!!res) {
            this.onLoadComplete(res);
            return;
        }
        gdk.rm.loadRes(resId, url, sp.SkeletonData, (res: sp.SkeletonData) => {
            if (!this.model || this.model.id != id) return;
            this.onLoadComplete(res);
        });
    }

    /** 设置默认动作，在子类中实现 */
    setAnimation() {
        this.ctrl.setAnimation(getPveFightAnmNameValue(this.animation), { loop: this.loop });
    }

    /** 资源路径，在子类中实现 */
    getUrl(): string {
        return PveTool.getSkinUrl(this.model.skin);
    }

    /** 动作混合列表，在子类中实现 */
    getMixs(): string[][] {
        return null;
    }

    onLoadComplete(res: sp.SkeletonData) {
        if (!this.active) return;
        if (!this.model) return;
        // 所有动作列表
        let mixs: string[][];
        let model = this.model;
        let spines: sp.Skeleton[] = this.ctrl.spines;
        for (let i = 0, n = spines.length; i < n; i++) {
            let spine = spines[i];
            if (spine.skeletonData !== res) {
                // 设置spine缓存模式
                let mode = sp.Skeleton.AnimationCacheMode.REALTIME;
                switch (model.type) {
                    case PveFightType.Enemy:
                        mode = sp.Skeleton.AnimationCacheMode.SHARED_CACHE;
                        break;

                    case PveFightType.Hero:
                        mode = sp.Skeleton.AnimationCacheMode.SHARED_CACHE;
                        break;

                    case PveFightType.Call:
                    case PveFightType.Soldier:
                    case PveFightType.Trap:
                    case PveFightType.Call:
                        mode = sp.Skeleton.AnimationCacheMode.SHARED_CACHE;
                        break;
                }
                spine.setAnimationCacheMode(mode);
                spine.enableBatch = model.attackable;
                spine.skeletonData = res;
                // 设置动作混合
                if (mode == sp.Skeleton.AnimationCacheMode.REALTIME) {
                    if (!mixs) {
                        mixs = this.getMixs();
                    }
                    if (mixs) {
                        for (let j = 0, jn = mixs.length; j < jn; j++) {
                            let args = mixs[j];
                            spine.setMix(args[0], args[1], 0.16);
                            spine.setMix(args[1], args[0], 0.16);
                        }
                    }
                }
            }
        }
        // 预加载技能资源
        this.preloadRes();
        // 设置动作
        this.setAnimation();
        // 完成
        this.onFinish();
    }

    // 预加载技能资源
    preloadRes() {
        if (!this.active) return;
        if (!this.model) return;
        if (!this.sceneModel.isDemo) {
            let skills = this.model.skillIds;
            if (skills && skills.length > 0) {
                PveTool.preloadFightRes(gdk.Tool.getResIdByNode(this.node), null, skills);
            }
        }
    }

    onFinish() {
        this.model.loaded = true;
        this.finish();
    }
}