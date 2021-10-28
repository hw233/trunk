import { Copy_assistCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import NetManager from '../../../../common/managers/NetManager';
import PveSceneBaseAction from '../base/PveSceneBaseAction';

/** 
 * PVE场景上阵助阵英雄
 * @Author: sthoo.huang  
 * @Date: 2020-05-06 10:03:04 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 11:50:30
 */
const { property } = cc._decorator;

@gdk.fsm.action("PveSceneDeployAssistsAction", "Pve/Scene")
export default class PveSceneDeployAssistsAction extends PveSceneBaseAction {

    onEnter() {
        super.onEnter();
        let stageId = this.model.id;
        let cfgs = ConfigManager.getItems(Copy_assistCfg, { 'stage_id': stageId });
        if (cfgs && cfgs.length > 0) {
            // 需要请求额外助理英雄
            let smsg = new icmsg.DungeonAssistsReq();
            smsg.stageId = stageId;
            smsg.activityId = cfgs[0].activity_id;
            NetManager.send(smsg, (rmsg: icmsg.DungeonAssistsRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.active) return;
                if (!this.model || this.model.id != stageId) return;
                for (let i = 0, n = rmsg.list.length; i < n; i++) {
                    let info = rmsg.list[i];
                    let series = 1000000 + info.heroId % 300000;
                    this.model.heroMap[series] = info;
                }
                this.finish();
            }, this);
            return;
        }
        // 无需特殊处理
        this.finish();
    }

    onExit() {
        super.onExit();
        NetManager.targetOff(this);
    }
}