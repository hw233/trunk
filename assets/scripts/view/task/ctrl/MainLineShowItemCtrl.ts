import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import TaskModel from '../model/TaskModel';
import TaskUtil from '../util/TaskUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../common/models/BagModel';
import { Mission_main_lineCfg } from '../../../a/config';
/**
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-10-09 17:39:12
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-18 17:34:00
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/MainLineShowItemCtrl")
export default class MainLineShowItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    bgCanGet: cc.Node = null;

    @property(cc.Node)
    btnGet: cc.Node = null;

    @property(cc.Label)
    taskLab: cc.Label = null;

    @property(cc.Node)
    hasGet: cc.Node = null;

    _cfg: Mission_main_lineCfg

    updateView() {
        this._cfg = this.data
        this.slot.updateItemInfo(this._cfg.reward1[0], this._cfg.reward1[1])
        this.slot.itemInfo = {
            series: null,
            itemId: this._cfg.reward1[0],
            itemNum: 1,
            type: BagUtils.getItemTypeById(this._cfg.reward1[0]),
            extInfo: null
        }
        this.taskLab.string = `${this._cfg.show_desc}`

        this.hasGet.active = false
        this.bgCanGet.active = false
        this.btnGet.active = false

        let finish = TaskUtil.getTaskState(this._cfg.id)
        let geted = ModelManager.get(TaskModel).rewardIds[this._cfg.id] || 0
        if (finish) {
            this.hasGet.active = geted
            if (!geted) {
                this.btnGet.active = true
            }
        }
    }

    onGetFunc() {
        let finish = TaskUtil.getTaskState(this._cfg.id)
        let geted = ModelManager.get(TaskModel).rewardIds[this._cfg.id] || 0
        if (finish && !geted) {
            let msg = new icmsg.MissionRewardReq();
            msg.kind = 1
            msg.type = 4
            msg.id = this._cfg.id;
            NetManager.send(msg)
        }
    }
}