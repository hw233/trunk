import StringUtils from '../../../../common/utils/StringUtils';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import PveRes from '../../const/PveRes';
import PveProtegeModel from '../../model/PveProtegeModel';
import PveSceneModel from '../../model/PveSceneModel';
import { PveBSScopeType } from '../../utils/PveBSExprUtils';
import PvePool from '../../utils/PvePool';
import PveTool from '../../utils/PveTool';
import { CopyType } from './../../../../common/models/CopyModel';

/** 
 * 被保护对象控制类
 * @Author: sthoo.huang  
 * @Description: 
 * @Date: 2019-03-21 20:36:08 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-11-21 10:49:51
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/other/PveProtegeCtrl")
export default class PveProtegeCtrl extends cc.Component {

    /** 数据 */
    model: PveProtegeModel;
    sceneModel: PveSceneModel;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Label)
    hp: cc.Label = null;

    onEnable() {
        let skin = this.model.skin;
        if (skin) {
            let url: string = StringUtils.format(PveRes.PVE_PROTEGE_RES, skin);
            let resId: string = gdk.Tool.getResIdByNode(this.node);
            gdk.rm.loadRes(resId, url, sp.SkeletonData, (res: sp.SkeletonData) => {
                if (!cc.isValid(this.node)) return;
                if (!this.model) return;
                this.spine.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
                this.spine.skeletonData = res;
                this.spine.loop = true;
                this.spine.animation = PveFightAnmNames.IDLE;
                this.spine.node.scale = this.sceneModel.scale;
            });
        } else {
            this.spine.skeletonData = null;
        }
        let copy_id = this.sceneModel.stageConfig.copy_id;
        if (copy_id == CopyType.NONE && !(this.sceneModel.arenaSyncData.fightType == 'ROYAL' || this.sceneModel.arenaSyncData.fightType == 'ROYAL_TEST')) {
            // 不显示血量红心
            this.hp.node.active = false;
        } else {
            this.hp.node.active = true;
            this.hp.node.scale = this.sceneModel.scale;
            this.hp.node.y = 120 * this.sceneModel.scale;
        }
        gdk.NodeTool.show(this.node);
    }

    onDisable() {
        PveTool.clearSpine(this.spine);
        gdk.Timer.clearAll(this);
        this.model = null;
        this.sceneModel = null;
    }

    hide(effect: boolean = true) {
        var index: number = this.sceneModel.proteges.indexOf(this);
        if (index != -1) {
            this.sceneModel.proteges.splice(index, 1);
        }
        gdk.NodeTool.hide(this.node, effect, () => {
            PvePool.put(this.node);
        });
    }

    get isDead(): boolean {
        let n = this.node;
        if (!cc.isValid(n) || !n.activeInHierarchy) {
            return true;
        }
        let m = this.model;
        return !m || m.hp <= 0;
    }

    @gdk.binding('sceneModel.timeScale')
    _setSpeedScale(v: number) {
        this.spine.timeScale = v;
    }

    @gdk.binding('model.hp')
    _setHp(v: number, ov: number, nv: number) {
        let max = this.model.hpMax;
        if (this.hp && this.hp.enabledInHierarchy) {
            this.hp.string = (v > 0 ? '0'.repeat(v) : '') + ((v < max) ? '1'.repeat(max - v) : '');
        }
        let sceneModel = this.sceneModel;
        if (sceneModel.stageConfig.copy_id == CopyType.NONE) {
            sceneModel.ctrl.updateHeart(v, max);
        }

        //奇境探险副本血量减到1血判断
        if (sceneModel.stageConfig.copy_id == CopyType.Adventure && ov > nv && nv == 1) {
            let generals = sceneModel.generals;
            if (generals && generals.length > 0) {
                generals.forEach(general => {
                    let model = general.model
                    let onhurt = general.model.prop.onhurt;
                    if (onhurt != null && typeof onhurt === 'object') {
                        // 构建环境变量
                        let scope: PveBSScopeType = {
                            t: model.baseProp,
                            a: model.prop,
                            am: model,
                            tm: model,
                            m: model,
                        };
                        // 验证onhurt事件对象有效
                        PveTool.evalBuffEvent(
                            onhurt,
                            general.model.fightId,
                            general.model.prop,
                            general,
                            general,
                            scope,
                        );
                    }
                })
            }
        }

        // 死亡判定
        if (ov != nv && v <= 0) {
            // 如果有指挥官则播放死亡动作及振屏
            let generals = sceneModel.generals;
            if (generals && generals.length > 0) {
                sceneModel.ctrl.quake(5, 20);
                generals[0].setAnimation(PveFightAnmNames.DIE, {
                    mode: 'set',
                    loop: false,
                });
            }
            // 当前游戏实例失败
            PveTool.gameOver(sceneModel, false);
        }
    }
}