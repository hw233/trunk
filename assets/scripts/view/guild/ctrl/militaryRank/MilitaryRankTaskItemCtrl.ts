import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import NetManager from '../../../../common/managers/NetManager';
import TaskUtil from '../../../task/util/TaskUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Foothold_dailytaskCfg, Foothold_globalCfg, Foothold_ranktaskCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-09 11:02:53
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/militaryRank/MilitaryRankTaskItemCtrl")
export default class MilitaryRankTaskItemCtrl extends UiListItem {


    @property(UiSlotItem)
    expItem: UiSlotItem = null

    @property(cc.Label)
    descLab: cc.Label = null

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null

    @property(cc.Label)
    proLab: cc.Label = null

    @property(cc.Node)
    btnGo: cc.Node = null

    @property(cc.Node)
    btnGet: cc.Node = null

    @property(cc.Node)
    hasGet: cc.Node = null

    _cfg: Foothold_dailytaskCfg | Foothold_ranktaskCfg
    _type: number
    goId: number = 0

    updateView() {
        this._cfg = this.data.cfg
        this._type = this.data.type
        let state = this.data.state

        this.hasGet.active = state == 2
        this.btnGo.active = false
        this.btnGet.active = state == 0 || (state != 2 && this._cfg.target == 0)

        if (state == 1) {
            this.btnGo.active = false
        }
        this.descLab.string = this._cfg.desc

        let itemId = ConfigManager.getItemById(Foothold_globalCfg, "rank_icon").value[0]
        this.expItem.updateItemInfo(itemId, this._cfg.exp)
        this.expItem.itemInfo = {
            series: null,
            itemId: itemId,
            itemNum: 1,
            type: BagUtils.getItemTypeById(itemId),
            extInfo: null
        };

        if (this._cfg instanceof Foothold_dailytaskCfg) {
            let proNums = TaskUtil.getTaskFinishNum(this._cfg.id)
            this.proLab.string = `${proNums[0]}/${proNums[1]}`
            let per = proNums[0] / proNums[1]
            per = Math.min(per, 1)
            this.proBar.progress = per
        } else if (this._cfg instanceof Foothold_ranktaskCfg) {
            let proNums = TaskUtil.getTaskFinishNum(this._cfg.id)
            this.proLab.string = `${proNums[0]}/${proNums[1]}`
            let per = proNums[0] / proNums[1]
            per = Math.min(per, 1)
            this.proBar.progress = per
        }

    }

    /**做任务 */
    doTask() {
        if (this.goId && this.goId > 0) {
            JumpUtils.openView(this.goId)
        }
    }

    /**领取任务奖励 */
    getAwards() {
        let msg = new icmsg.MissionRewardReq();
        msg.kind = 1
        msg.type = this._type
        msg.id = this._cfg.id
        NetManager.send(msg, (data: icmsg.MissionRewardRsp) => {
            GlobalUtil.openRewadrView(data.list)
        });
    }
}