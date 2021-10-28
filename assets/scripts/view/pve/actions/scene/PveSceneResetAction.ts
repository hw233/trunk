import PveFsmEventId from '../../enum/PveFsmEventId';
import PveSceneBaseAction from '../base/PveSceneBaseAction';
import PveSceneState from '../../enum/PveSceneState';
import PveTool from '../../utils/PveTool';
import { CopyType } from '../../../../common/models/CopyModel';

/**
 * Pve关卡重置动作
 * @Author: sthoo.huang
 * @Date: 2019-03-22 17:59:04
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-23 17:05:20
 */

const { property } = cc._decorator;

@gdk.fsm.action("PveSceneResetAction", "Pve/Scene")
export default class PveSceneResetAction extends PveSceneBaseAction {

    onEnter() {
        super.onEnter();
        // 清除战斗实例
        let m = this.model;
        PveTool.removeSceneNodes(this.ctrl, false);
        m.state = PveSceneState.Reset;
        m.timeScale = m.defaultTimeScale;
        m.showAtkDis = false;
        m.showHeroEffect = false;
        m.seed = void 0;
        // 如果是竞技模式，则清除镜像战斗实例
        if (m.stageConfig.copy_id == CopyType.NONE && !m.isMirror) {
            let m2 = m.arenaSyncData.mirrorModel;
            PveTool.removeSceneNodes(m2.ctrl, false);
            m2.state = PveSceneState.Reset;
            m2.timeScale = m2.timeScale;
            m2.showAtkDis = false;
            m2.showHeroEffect = false;
            m2.seed = void 0;
            m2.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_RETURN);
        }
        this.finish();
    }
}