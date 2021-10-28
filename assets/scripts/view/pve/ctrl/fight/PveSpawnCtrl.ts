import PvePool from '../../utils/PvePool';
import PveSceneModel from '../../model/PveSceneModel';
import PveSpawnModel from '../../model/PveSpawnModel';
import PveTool from '../../utils/PveTool';
import { PveFightAnmNames } from '../../const/PveAnimationNames';

/**
 * Pve怪物出生点控制类
 * @Author: sthoo.huang
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-27 13:57:55
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/other/PveSpawnCtrl")
export default class PveSpawnCtrl extends cc.Component {

    /** 出生点数据 */
    model: PveSpawnModel;
    sceneModel: PveSceneModel;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    //隐藏特效
    hideSpine: boolean = false;
    onEnable() {
        this.spine.node.active = true;
        this.hideSpine = false;

        let url: string = this.model.skin;
        if (url) {
            let resId: string = gdk.Tool.getResIdByNode(this.node);
            gdk.rm.loadRes(resId, url, sp.SkeletonData, (res: sp.SkeletonData) => {
                if (!cc.isValid(this.node)) return;
                if (!this.model) return;
                this.spine.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
                this.spine.skeletonData = res;
                this.spine.loop = true;
                this.spine.animation = PveFightAnmNames.IDLE;
            });
        } else {
            this.spine.skeletonData = null;
        }
        gdk.NodeTool.show(this.node);
    }

    update(dt: number) {
        // 特殊传说门特殊处理
        if (this.model.config.id == 1 && !this.hideSpine) {
            if (this.sceneModel.enemies.length > 0) {
                this.hideSpine = true;
                this.spine.node.active = false;
                // 回收资源
                let res = this.spine.skeletonData;
                if (cc.isValid(res)) {
                    let resId = gdk.Tool.getResIdByNode(this.node);
                    gdk.rm.releaseRes(resId, res, sp.SkeletonData);
                }
                PveTool.clearSpine(this.spine);
            }
        }
    }

    onDisable() {
        PveTool.clearSpine(this.spine);
        this.model = null;
        this.sceneModel = null;
    }

    hide(effect: boolean = true) {
        var index: number = this.sceneModel.spawns.indexOf(this);
        if (index != -1) {
            this.sceneModel.spawns.splice(index, 1);
        }
        gdk.NodeTool.hide(this.node, effect, () => {
            PvePool.put(this.node);
        });
    }
}