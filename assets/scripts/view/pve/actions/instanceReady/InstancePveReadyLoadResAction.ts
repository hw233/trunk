import InstanceModel, { InstanceData } from '../../../instance/model/InstanceModel';
import ModelManager from '../../../../common/managers/ModelManager';
import PveSceneLoadResAction from '../scene/PveSceneLoadResAction';
import StringUtils from '../../../../common/utils/StringUtils';
import { GetInstanceDataByInstanceId } from '../../../instance/utils/InstanceUtil';

/**
 * 副本Ready场景资源加载动作
 * @Author: yaozu.hu
 * @Date: 2019-03-18 18:29:01
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-06-10 14:42:37
 */
@gdk.fsm.action("InstancePveReadyLoadResAction", "Pve/Ready")
export default class InstancePveReadyLoadResAction extends PveSceneLoadResAction {

    // 初始化关卡信息
    initStage(): boolean {
        // 获取副本的挂机数据
        let temModel = ModelManager.get(InstanceModel);
        let data: InstanceData = GetInstanceDataByInstanceId(temModel.instanceId);
        let hangupId = (data && data.serverData) ? data.serverData.hangupId : 0;
        // 当前无挂机场景
        if (hangupId < 1) {
            hangupId = parseInt(data.data.copy_id + StringUtils.padding(data.data.subtype, 2) + '001');
        }
        // 设置当前挂机副本相关的演示战斗配置
        this.model.id = hangupId;
        return true;
    }

}
