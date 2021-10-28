import { PveFightAnmNameEnum } from "../../const/PveAnimationNames";
import PveLittleGameGeneralCtrl from "../../ctrl/littleGame/PveLittleGameGeneralCtrl";
import PveLittleGameModel from "../../model/PveLittleGameModel";

const { property } = cc._decorator;

@gdk.fsm.action("PveLittleGameGeneralLoadResAction", "Pve/LittleGame")
export default class PveLittleGameGeneralLoadResAction extends gdk.fsm.FsmStateAction {

    @property({ type: cc.Enum(PveFightAnmNameEnum), tooltip: "默认的动画名称" })
    animation: PveFightAnmNameEnum = PveFightAnmNameEnum.IDLE;

    @property({ tooltip: "默认动画是否循环" })
    loop: boolean = true;

    ctrl: PveLittleGameGeneralCtrl;
    sceneModel: PveLittleGameModel;

    onEnter() {
        this.ctrl = this.node.getComponent(PveLittleGameGeneralCtrl);
        this.sceneModel = this.ctrl.sceneModel;
        this.loadRes();
    }

    /**
     * 加载资源
     */
    loadRes() {
        let resId: string = gdk.Tool.getResIdByNode(this.node);
        let url: string = this.getUrl();
        let res = gdk.rm.getResByUrl(url, sp.SkeletonData, resId);
        if (!!res) {
            this.onLoadComplete(res);
            return;
        }
        gdk.rm.loadRes(resId, url, sp.SkeletonData, (res: sp.SkeletonData) => {
            if (!this.ctrl) return;
            this.onLoadComplete(res);
        });
    }

    onLoadComplete(res: sp.SkeletonData) {
        if (!this.active) return;
        // 所有动作列表
        let mixs: string[][];
        let spines: sp.Skeleton[] = this.ctrl.spines;
        for (let i = 0, n = spines.length; i < n; i++) {
            let spine = spines[i];
            if (spine.skeletonData !== res) {
                // 设置spine缓存模式
                let mode = sp.Skeleton.AnimationCacheMode.REALTIME;
                spine.setAnimationCacheMode(mode);
                spine.enableBatch = true;
                spine.skeletonData = res;
            }
        }

        let r = this.ctrl.getRect();
        if (r) {
            let add = 30;
            this.ctrl.hpLb.node.setPosition(
                0,
                100,
            );
        }
        // 完成
        this.onFinish();
    }

    /** 资源路径，在子类中实现 */
    getUrl(): string {
        let skinStr = this.ctrl.getSkin()
        let skin = `spine/hero/${skinStr}/0.5/${skinStr}`
        return skin
    }

    onExit() {
        this.ctrl = null;
        this.sceneModel = null;
    }

    onFinish() {
        this.ctrl.loaded = true;
        this.finish();
    }
}
