import PveSceneBaseAction from '../base/PveSceneBaseAction';
import PveSceneState from '../../enum/PveSceneState';

/**
 * Pve场景暂停与继续动作
 * @Author: sthoo.huang
 * @Date: 2019-03-22 14:20:59
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-04-17 14:35:24
 */

@gdk.fsm.action("PveScenePauseAction", "Pve/Scene")
export default class PveScenePauseAction extends PveSceneBaseAction {

    static timeScale: number = 0.0;

    onEnter() {
        super.onEnter();
        switch (this.model.state) {
            case PveSceneState.Fight:
                PveScenePauseAction.timeScale = this.model.timeScale;
                this.model.state = PveSceneState.Pause;
                this.model.timeScale = 0.0;
                break;

            case PveSceneState.Pause:
                this.model.timeScale = PveScenePauseAction.timeScale;
                this.model.state = PveSceneState.Fight;
                break;

            default:
                PveScenePauseAction.timeScale = this.model.defaultTimeScale;
                this.model.timeScale = 0.0;
                break;
        }
        this.finish();
    }
}