import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import NetManager from '../../../../common/managers/NetManager';
import TaskUtil from '../../../task/util/TaskUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Relic_taskCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/tradingPort/RelicTaskItemCtrl")
export default class RelicTaskItemCtrl extends UiListItem {

    @property(cc.Label)
    descLab: cc.Label = null;

    @property(cc.Node)
    btnGet: cc.Node = null;

    @property(cc.Node)
    hasGet: cc.Node = null;

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null;

    @property(cc.Label)
    proLab: cc.Label = null;

    @property(UiSlotItem)
    itemSlot: UiSlotItem = null;

    _cfg: Relic_taskCfg

    updateView() {
        this._cfg = this.data.cfg
        let state = this.data.state

        this.descLab.string = this._cfg.desc
        this.itemSlot.updateItemInfo(this._cfg.point[0], this._cfg.point[1])
        this.itemSlot.itemInfo = {
            series: this._cfg.point[0],
            itemId: this._cfg.point[0],
            itemNum: 1,
            type: BagUtils.getItemTypeById(this._cfg.point[0]),
            extInfo: null
        }

        //0: 可领取 1: 未完成 2: 已领取
        this.proBar.node.parent.active = false
        this.btnGet.active = false
        this.hasGet.active = false
        if (state == 1) {
            this.proBar.node.parent.active = true
            let proNums = TaskUtil.getTaskFinishNum(this._cfg.id)
            this.proLab.string = `${proNums[0]}/${proNums[1]}`
            let per = proNums[0] / proNums[1]
            per = Math.min(per, 1)
            this.proBar.progress = per
        } else {
            this.hasGet.active = state == 2
            this.btnGet.active = state == 0 || (state != 2 && this._cfg.target == 0)
        }
    }

    onGetFunc() {
        let type = 15
        if (this._cfg.type == 2) {
            type = 16
        }
        let msg = new icmsg.MissionRewardReq();
        msg.kind = 1
        msg.type = type
        msg.id = this._cfg.id;
        NetManager.send(msg);
    }
}