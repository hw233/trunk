import ConfigManager from '../../../../common/managers/ConfigManager';
import HeroUtils from '../../../../common/utils/HeroUtils';
import NetManager from '../../../../common/managers/NetManager';
import PveReplayCtrl from '../../ctrl/PveReplayCtrl';
import PveSceneDeploymentAction from '../scene/PveSceneDeploymentAction';
import { BagItem } from '../../../../common/models/BagModel';
import { Copy_assistCfg } from './../../../../a/config';
/**
 * PVE英雄塔布署动作
 * @Author: sthoo.huang
 * @Date: 2019-04-11 13:59:32
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 12:34:14
 */
const { property } = cc._decorator;
@gdk.fsm.action("PveReplayDeploymentAction", "Pve/Replay")
export default class PveReplayDeploymentAction extends PveSceneDeploymentAction {

    // 在面板中隐藏不需要的参数
    @property({ override: true, visible: false, serializable: false })
    showTowerTip: boolean = false;

    // 重新定义ctrl的类型
    ctrl: PveReplayCtrl;

    startDeploy() {
        let model = this.model;
        let a: number[] = this.ctrl.heroes;
        let heroMap = model.heroMap;
        let arr: BagItem[] = [];
        for (let i = 0, n = model.towers.length; i < n; i++) {
            let heroId = a[i];
            if (heroId > 0 && heroMap[heroId]) {
                let item = arr[i] = HeroUtils.createHeroBagItemBy(heroMap[heroId]);
                let extInfo = item.extInfo as icmsg.HeroInfo;
                item.series = heroId;
                extInfo.heroId = heroId;
            }
        }
        // 有助阵英雄配置，则请求助阵英雄属性
        let stageId = model.id;
        let cfgs = ConfigManager.getItems(Copy_assistCfg, { 'stage_id': stageId });
        if (cfgs && cfgs.length > 0) {
            let smsg = new icmsg.DungeonAssistsReq();
            smsg.stageId = stageId;
            NetManager.send(smsg, (rmsg: icmsg.DungeonAssistsRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.active) return;
                if (!this.model || this.model.id != stageId) return;
                for (let i = 0, n = rmsg.list.length; i < n; i++) {
                    let info = rmsg.list[i];
                    model.heroMap[info.heroId] = info;
                }
                this.deployOne(arr, 0);
            }, this);
        } else {
            // 无需特殊处理
            this.deployOne(arr, 0);
        }
    }

    onExit() {
        super.onExit();
        NetManager.targetOff(this);
    }
}