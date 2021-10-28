import ActUtil from '../../../act/util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import ModelManager from '../../../../common/managers/ModelManager';
import { Copyultimate_stageCfg } from '../../../../a/config';

/** 
 * 副本进度
 * @Author: sthoo.huang
 * @Date: 2020-09-17 20:35:08
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-24 16:16:08
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/ultimate/InstanceUltimateProgressCtrl")
export default class InstanceUltimateProgressCtrl extends cc.Component {

    @property(cc.Node)
    flag: cc.Node = null;

    @property(cc.Node)
    progress: cc.Node = null;

    @property(cc.Node)
    bossItem: cc.Node = null;

    get copyModel() { return ModelManager.get(CopyModel); }

    onEnable() {
        this.refreshData();
    }

    onDisable() {
        this.node.active = false;
        let a = this.bossItem.parent.children;
        for (let i = a.length - 1; i > 0; i--) {
            a[i].destroy();
        }
    }

    refreshData() {
        let width = this.node.getChildByName('bg').width;
        let parent = this.bossItem.parent;
        let children = parent.children;
        let cfgs = ConfigManager.getItemsByField(Copyultimate_stageCfg, "reward_id", this.curType);
        let index = 0
        let count = 0;
        cfgs.forEach((c, i) => {
            // boss关卡
            if (c.sort == 20 || c.sort == 50) {
                let n = children[count];
                if (!n) {
                    n = cc.instantiate(this.bossItem);
                    n.name = 'item' + count;
                    n.parent = parent;
                }
                let nm = cc.find('name', n);
                let lb = cc.find('label', nm).getComponent(cc.Label)
                lb.string = c.sort + "波";
                nm.width = lb.node.width + 30;
                n.x = width / cfgs.length * i;
                n.y = this.bossItem.y;
                count++;
            }
            if (c.id == this.copyModel.ultimateMaxStageId) {
                index = i + 1;
            }
        });
        this.flag.x = width / cfgs.length * index;
        this.flag.active = index > 0 && index < cfgs.length;
        this.progress.width = this.flag.x;
        // this.updateResetTime();
        // gdk.Timer.loop(200, this, this.updateResetTime);
    }

    get curType() {
        let type = ActUtil.getActRewardType(130)
        let cfgs = ConfigManager.getItems(Copyultimate_stageCfg)
        let maxType = cfgs[cfgs.length - 1].reward_id
        if (type > maxType) {
            type = maxType
        }
        return type
    }

    get maxStageId() {
        let cfgs = ConfigManager.getItemsByField(Copyultimate_stageCfg, "reward_id", this.curType)
        return cfgs[cfgs.length - 1].id
    }

    // updateResetTime() {
    //     let model = ModelManager.get(CopyModel);
    //     let stateMsg = model.survivalStateMsg;
    //     let time = Math.floor(stateMsg.endTime - GlobalUtil.getServerTime() / 1000);
    //     this.resetTime.string = `${timeFormat(Math.max(0, time))}`;
    // }
}