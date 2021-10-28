import ConfigManager from '../../../../common/managers/ConfigManager';
import PveSceneBaseAction from '../base/PveSceneBaseAction';
import PveSceneState from '../../enum/PveSceneState';
import { Copysurvival_stageCfg } from '../../../../a/config';
/** 
 * Pve生存副本进入下一关
 * @Author: sthoo.huang  
 * @Date: 2020-07-10 16:24:18
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-11-03 10:42:29
 */

@gdk.fsm.action("PveSceneSurivalNextLevelAction", "Pve/Scene")
export default class PveSceneSurivalNextLevelAction extends PveSceneBaseAction {

    onEnter() {
        super.onEnter();
        this.model.state = PveSceneState.NextLevel;
        this.checkReady();
    }

    checkReady() {
        let m = this.model;
        if (!m) return;
        let b: boolean = m.generals.some(g => {
            let m = g.model;
            return !m.ready || !m.loaded;
        });
        b = b || m.heros.some(h => {
            let m = h.model;
            return !m.ready || !m.loaded;
        });
        if (b) {
            // 数据还没准备好，则延迟重试
            gdk.Timer.callLater(this, this.checkReady);
            return;
        }
        // 获得下一关的配置数据
        let cfg: Copysurvival_stageCfg = m.stageConfig as any;
        let stageCfg = ConfigManager.getItem(Copysurvival_stageCfg, { subtype: cfg.subtype, sort: cfg.sort + 1 });
        m.id = stageCfg.id;
        // 清除战斗记录信息
        m.battleInfoUtil.clearAll();
        m.battleInfoUtil.sceneModel = m;
        // 完成动作
        this.finish();
    }

    onExit() {
        super.onExit();
    }
}