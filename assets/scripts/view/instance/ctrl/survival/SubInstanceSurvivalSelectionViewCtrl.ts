import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import InstanceModel from '../../model/InstanceModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { Copysurvival_stageCfg } from '../../../../a/config';
import { InstanceEventId } from '../../enum/InstanceEnumDef';



/** 
 * @Description: 新生存训练 
 * @Author: yaozu.hu
 * @Date: 2020-11-06 11:36:43
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:32:00
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubInstanceSurvivalSelectionViewCtrl")
export default class SubInstanceSurvivalSelectionViewCtrl extends gdk.BasePanel {


    get model(): InstanceModel { return ModelManager.get(InstanceModel); }
    get copyModel() { return ModelManager.get(CopyModel); }
    subTypeClick(event: any, index: string) {
        let type = 0;
        if (index == '1') {
            type = 1;
        }
        let msg = new icmsg.SurvivalSubTypeReq()
        msg.subType = type;
        NetManager.send(msg, (rsp: icmsg.SurvivalSubTypeRsp) => {
            this.copyModel.survivalStateMsg.select = true;
            this.copyModel.survivalStateMsg.subType = rsp.subType;
            this.copyModel.survivalStateMsg.heroes = rsp.heroes;
            if (rsp.subType == 0) {
                let stageCfg = ConfigManager.getItemByField(Copysurvival_stageCfg, 'subtype', 0);
                this.copyModel.survivalStateMsg.stageId = stageCfg.id;
            } else {
                let stageCfg = ConfigManager.getItemByField(Copysurvival_stageCfg, 'subtype', 1);
                this.copyModel.survivalStateMsg.stageId = stageCfg.id;
            }
            gdk.e.emit(InstanceEventId.SURVIVAL_SUBTYPE_REFRESH)
            this.close();
        })


    }

}
