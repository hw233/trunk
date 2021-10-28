import ConfigManager from '../../../../common/managers/ConfigManager';
import PveReplayCtrl from '../../ctrl/PveReplayCtrl';
import PveSceneLoadResAction from '../scene/PveSceneLoadResAction';
import { MonsterCfg } from '../../../../a/config';

/**
 * PVE场景资源加载动作
 * @Author: sthoo.huang
 * @Date: 2019-12-21 11:52:19
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-26 16:18:10
 */

@gdk.fsm.action("PveReplayLoadResAction", "Pve/Replay")
export default class PveReplayLoadResAction extends PveSceneLoadResAction {

    ctrl: PveReplayCtrl;

    // 初始化关卡信息
    initStage(): boolean {
        let ctrl = this.ctrl;
        let model = this.model;
        let rmsg = ctrl.rmsg;
        // 处理binary字符串
        let data: any = gdk.Buffer.from(rmsg.actions, 'binary');
        data = gdk.pako.ungzip(data);
        data = gdk.Buffer.from(data);
        data = gdk.amf.decodeObject(data);
        model.isReplay = true;
        model.seed = rmsg.randSeed;
        model.id = rmsg.stageId;
        model.actions = data.a;
        model.enemyBorns = data.e;
        model.showAtkDis = false;
        model.showHeroEffect = false;
        // 计算最大敌人数量
        model.maxEnemy = 0;
        model.enemyBorns.forEach(a => {
            // 排除不可计数的怪物
            let enemyCfg = ConfigManager.getItemById(MonsterCfg, a[1]);
            if (enemyCfg && enemyCfg.type != 4) {
                model.maxEnemy += a[3];
            }
        });
        // 英雄阵形和属性
        ctrl.heroes = data.h;
        for (let i = 0, n = rmsg.heroList.length; i < n; i++) {
            let info = rmsg.heroList[i];
            if (info != null) {
                model.heroMap[info.heroId] = info;
            }
        }
        // 指挥官属性
        ctrl.general = rmsg.general;
        return true;
    }
}