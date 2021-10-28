import PveBaseFightCtrl from '../../ctrl/fight/PveBaseFightCtrl';
import PveFightIdleAction from '../base/PveFightIdleAction';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveSceneState from '../../enum/PveSceneState';
import PveTrapModel from '../../model/PveTrapModel';
import { onSpineEvent } from '../../model/PveSkillModel';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
/** 
 * Pve陷阱待机动作
 * @Author: sthoo.huang  
 * @Date: 2019-08-01 20:14:41 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-07 14:11:57
 */

@gdk.fsm.action("PveTrapIdleAction", "Pve/Trap")
export default class PveTrapIdleAction extends PveFightIdleAction {

    model: PveTrapModel;

    onEnter() {
        this.ctrl = this.node.getComponent(PveBaseFightCtrl);
        this.model = this.ctrl.model as PveTrapModel;
        this.sceneModel = this.ctrl.sceneModel;
        if (this.model.stand_animation != '') {
            switch (this.sceneModel.state) {
                case PveSceneState.Fight:
                    this.ctrl.setAnimation(this.getAnimation(), {
                        loop: true,
                        onEvent: (eventName: string) => {
                            if (!this.ctrl) return;
                            onSpineEvent(eventName, null, this.ctrl);
                        },
                        thisArg: this,
                    });
                    break;

                default:
                    this.ctrl.setAnimation(this.getAnimation(), {
                        mode: 'set',
                        loop: true,
                        onEvent: (eventName: string) => {
                            if (!this.ctrl) return;
                            onSpineEvent(eventName, null, this.ctrl);
                        },
                        thisArg: this,
                    });
                    break;
            }
        }
        this.time = this.model.getProp('cd');
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        this.time -= dt * this.model.speedScale;
        if (this.time <= 0) {
            // 冷却时间到了
            if (this.model.config && this.model.config.type == 1) {
                this.sendEvent(PveFsmEventId.PVE_FIGHT_CREATEMONSTER);
            } else if (this.model.config && this.model.config.type == 2) {
                this.sendEvent(PveFsmEventId.PVE_FIGHT_CREATECALL);
            } else {
                this.finish();
            }
        }
    }

    getAnimation(): string {
        let animation = this.model.stand_animation; // this.model.config.stand_animation;
        if (!animation) {
            animation = PveFightAnmNames.IDLE;
        }
        return animation;
    }
}