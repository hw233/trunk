import GlobalUtil from "../../../../common/utils/GlobalUtil";
import { PveFightAnmNameEnum } from "../../const/PveAnimationNames";
import { default as PveLittleGameEnemyCtrl } from "../../ctrl/littleGame/PveLittleGameEnemyCtrl";
import PveLittleGameModel from "../../model/PveLittleGameModel";
import PveTool from "../../utils/PveTool";

const { property } = cc._decorator;

@gdk.fsm.action("PveLittleGameEnemyLoadResAction", "Pve/LittleGame")
export default class PveLittleGameEnemyLoadResAction extends gdk.fsm.FsmStateAction {

    @property({ type: cc.Enum(PveFightAnmNameEnum), tooltip: "默认的动画名称" })
    animation: PveFightAnmNameEnum = PveFightAnmNameEnum.IDLE;

    @property({ tooltip: "默认动画是否循环" })
    loop: boolean = true;

    ctrl: PveLittleGameEnemyCtrl;
    sceneModel: PveLittleGameModel;

    onEnter() {
        this.ctrl = this.node.getComponent(PveLittleGameEnemyCtrl);
        this.sceneModel = this.ctrl.sceneModel;
        this.loadRes()
    }

    /**
     * 加载资源
     */
    loadRes() {
        if (this.ctrl.type == 2) {
            let resId: string = gdk.Tool.getResIdByNode(this.node);
            let url: string = this.getUrl();
            let id: number = this.ctrl.cfg.id;
            let res = gdk.rm.getResByUrl(url, sp.SkeletonData, resId);
            if (!!res) {
                this.onLoadComplete(res);
                return;
            }
            gdk.rm.loadRes(resId, url, sp.SkeletonData, (res: sp.SkeletonData) => {
                if (!this.ctrl || this.ctrl.cfg.id != id) return;
                this.onLoadComplete(res);
            });
            // this.ctrl.weaponSp.node.active = false;
            // this.ctrl.weaponAni.stop()
        } else {
            let url = 'view/pve/texture/littleGame/' + this.ctrl.cfg.skin[1]
            GlobalUtil.setSpriteIcon(this.node, this.ctrl.weaponSp, url);
            this.ctrl.hpLb.node.setPosition(
                0,
                130
            );
            // this.ctrl.weaponSp.node.active = true;
            // this.ctrl.weaponAni.play()
            // 完成
            this.onFinish();
        }

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
                80
            );
        }
        // 完成
        this.onFinish();
    }

    /** 资源路径，在子类中实现 */
    getUrl(): string {
        if (this.ctrl.cfg.skin[0] == 1) {
            let skinName = this.ctrl.cfg.skin[1]
            return `spine/weapon/${skinName}/0.5/${skinName}`
        }
        return PveTool.getSkinUrl(this.ctrl.cfg.skin[1]);
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
