import PvePool from '../../utils/PvePool';
import PveSceneModel from '../../model/PveSceneModel';
import PveSkillModel from '../../model/PveSkillModel';
import PveTool from '../../utils/PveTool';

/**
 * Pve技能控制组件类
 * @Author: sthoo.huang
 * @Date: 2019-04-30 11:03:03
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-10-24 16:31:01
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/skill/PveBaseSkillCtrl")
export default class PveBaseSkillCtrl extends cc.Component {

    spines: sp.Skeleton[] = [];
    fsm: gdk.fsm.Fsm;
    model: PveSkillModel;
    sceneModel: PveSceneModel;
    event: gdk.EventTrigger;

    onEnable() {
        this._isHideCalled = false;
        this.event = gdk.EventTrigger.get();
        this.fsm = this.node.getComponent(gdk.fsm.FsmComponent).fsm;
    }

    onDisable() {
        this.event && this.event.release();
        this.event = null;
        this.spines.length = 0;
        this.model && PvePool.put(this.model);
        this.model = null;
        this.sceneModel = null;
        this.fsm = null;
    }

    addSpine(spine: sp.Skeleton) {
        this.spines.push(spine);
        this.node.addChild(spine.node);
    }

    // 隐藏并放入至对象池中
    _isHideCalled: boolean = false;
    hide(effect: boolean = true) {
        if (this._isHideCalled) return;
        this._isHideCalled = true;
        var index: number = this.sceneModel.skills.indexOf(this);
        if (index != -1) {
            this.sceneModel.skills.splice(index, 1);
        }
        for (let i = 0, n = this.spines.length; i < n; i++) {
            let spine = this.spines[i];
            if (!spine) continue;
            PveTool.clearSpine(spine);
            PvePool.put(spine.node);
        }
        this.spines.length = 0;
        // 隐藏测试伤害范围node
        let m = this.model;
        let n = m.graphicNode;
        if (n) {
            gdk.NodeTool.hide(n, effect, () => {
                PvePool.put(n);
            });
            m.graphicNode = null;
        }
        gdk.NodeTool.hide(this.node, effect, () => {
            PvePool.put(this.node);
        });
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        // let sm = this.sceneModel;
        // if (sm.state != PveSceneState.Fight) return;
        // if (this.model.continueTime <= 0) return;
        // this.model.continueTime -= sm.deltaTime * sm.timeScale;
        // if (this.model.continueTime <= 0) {
        //     this.fsm.broadcastEvent(PveFsmEventId.PVE_SKILL_ANIM_COMPLETE);
        // }
        this.fsm && PveTool.execFsmUpdateScript(this.fsm, dt);
    }
}