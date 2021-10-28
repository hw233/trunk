import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import ModelManager from '../../../../common/managers/ModelManager';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { Copyultimate_showCfg, Copyultimate_stageCfg } from '../../../../a/config';

/** 
 * @Description: 新 生存训练 物品展示 
 * @Author: luoyong
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-26 15:09:17
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/ultimate/InstanceUltimateRewardItemCtrl")
export default class InstanceUltimateRewardItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    lab: cc.Label = null;

    @property(cc.Node)
    lockNode: cc.Node = null;

    updateView() {
        if (!this.data) return;
        let cfg: Copyultimate_showCfg = this.data
        this.slot.updateItemInfo(cfg.reward[0])
        let item: BagItem = {
            series: 0,
            itemId: cfg.reward[0],
            itemNum: 1,
            type: BagUtils.getItemTypeById(cfg.reward[0]),
            extInfo: null
        }
        this.slot.itemInfo = item

        let stageId = ModelManager.get(CopyModel).ultimateMaxStageId
        let curCfg = ConfigManager.getItemById(Copyultimate_stageCfg, stageId)
        let sort = curCfg ? curCfg.sort : 0
        this.lockNode.active = cfg.power > sort
        this.lab.node.parent.parent.active = false
        if (cfg.power > 0) {
            this.lab.node.parent.parent.active = true
            this.lab.string = StringUtils.format(`{0}波商店解锁`, cfg.power)//`${sort}波掉落`
        }
    }

}