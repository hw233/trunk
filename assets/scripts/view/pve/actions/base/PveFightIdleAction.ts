import PveFightBaseAction from './PveFightBaseAction';
import PveSceneState from '../../enum/PveSceneState';
import { onSpineEvent } from '../../model/PveSkillModel';
import { PveFightAnmNames } from '../../const/PveAnimationNames';

/**
 * PVE战斗对象待机动作基类
 * @Author: sthoo.huang
 * @Date: 2019-03-18 11:29:57
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-05-06 16:57:02
 */

@gdk.fsm.action("PveFightIdleAction", "Pve/Base")
export default class PveFightIdleAction extends PveFightBaseAction {

    time: number;

    onEnter() {
        super.onEnter();
        switch (this.sceneModel.state) {
            case PveSceneState.Fight:
                this.ctrl.setAnimation(this.getAnimation(), {
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
                    onEvent: (eventName: string) => {
                        if (!this.ctrl) return;
                        onSpineEvent(eventName, null, this.ctrl);
                    },
                    thisArg: this,
                });
                break;
        }
        this.time = this.model.getProp('cd');
    }

    getAnimation(): string {
        return PveFightAnmNames.IDLE;
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        this.time -= dt * this.model.speedScale;
        if (this.time <= 0) {
            // 冷却时间到了
            this.finish();
        }
    }
}