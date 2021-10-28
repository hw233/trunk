import ConfigManager from '../../../../../common/managers/ConfigManager';
import CopyModel from '../../../../../common/models/CopyModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import { Copysurvival_stageCfg } from '../../../../../a/config';
import { InstanceEventId } from '../../../../instance/enum/InstanceEnumDef';
import { timeFormat } from '../../../../instance/utils/InstanceUtil';

/** 
 * 生存副本进度
 * @Author: sthoo.huang
 * @Date: 2020-09-17 20:35:08
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-11-06 15:14:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/ready/SurvivalInfoView")
export default class SurvivalInfoView extends cc.Component {

    @property(cc.Node)
    flag: cc.Node = null;

    @property(cc.Node)
    progress: cc.Node = null;

    @property(cc.Node)
    bossItem: cc.Node = null;

    @property(cc.Label)
    resetTime: cc.Label = null;

    onEnable() {
        gdk.e.on(InstanceEventId.SURVIVAL_SUBTYPE_REFRESH, this.refreshData, this);
        this.refreshData();
    }

    onDisable() {
        this.node.active = false;
        let a = this.bossItem.parent.children;
        for (let i = a.length - 1; i > 0; i--) {
            a[i].destroy();
        }
        gdk.Timer.clearAll(this);
        gdk.e.targetOff(this)
    }

    refreshData() {
        let width = this.node.getChildByName('bg').width;
        let parent = this.bossItem.parent;
        let children = parent.children;
        let stateMsg = ModelManager.get(CopyModel).survivalStateMsg;
        let cfgs = ConfigManager.getItems(Copysurvival_stageCfg, (item: Copysurvival_stageCfg) => {
            if (item.subtype == stateMsg.subType) {
                return true;
            }
            return false;
        });
        let index = stateMsg.stageId <= 0 ? cfgs.length : 0;
        let count = 0;
        cfgs.forEach((c, i) => {
            // boss关卡
            if (c.type_stage == 3) {
                let n = children[count];
                if (!n) {
                    n = cc.instantiate(this.bossItem);
                    n.name = 'item' + count;
                    n.parent = parent;
                }
                let nm = cc.find('name', n);
                let lb = cc.find('label', nm).getComponent(cc.Label)
                lb.string = c.name;
                nm.width = lb.node.width + 30;
                n.x = width / cfgs.length * i;
                n.y = this.bossItem.y;
                count++;
            }
            if (c.id == stateMsg.stageId) {
                index = i;
            }
        });
        this.flag.x = width / cfgs.length * index;
        this.flag.active = index > 0 && index < cfgs.length;
        this.progress.width = this.flag.x;
        this.updateResetTime();
        gdk.Timer.loop(200, this, this.updateResetTime);
    }

    updateResetTime() {
        let model = ModelManager.get(CopyModel);
        let stateMsg = model.survivalStateMsg;
        let time = Math.floor(stateMsg.endTime - GlobalUtil.getServerTime() / 1000);
        this.resetTime.string = `${timeFormat(Math.max(0, time))}`;
    }
}