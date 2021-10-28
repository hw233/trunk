import BagUtils from '../../../common/utils/BagUtils';
import CombineModel from '../model/CombineModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import TaskUtil from '../../task/util/TaskUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Combine_dailyCfg, Combine_ultimateCfg } from '../../../a/config';
import { MissionType } from '../../task/ctrl/TaskViewCtrl';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-07 15:29:20
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/combine/CombinecCarnivalTaskItemCtrl")
export default class CombinecCarnivalTaskItemCtrl extends UiListItem {

    @property(cc.Node)
    bg0: cc.Node = null;

    @property(cc.Node)
    bg1: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Label)
    descLab: cc.Label = null

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null

    @property(cc.Label)
    proLab: cc.Label = null

    @property(cc.Label)
    activeLab: cc.Label = null;

    @property(cc.Node)
    btnGo: cc.Node = null

    @property(cc.Node)
    btnGet: cc.Node = null

    @property(cc.Node)
    hasGet: cc.Node = null

    _cfg: Combine_dailyCfg | Combine_ultimateCfg
    _type: number
    goId: number = 0

    get combineModel(): CombineModel { return ModelManager.get(CombineModel); }

    updateView() {
        this._cfg = this.data.cfg
        this._type = this.data.type
        let state = this.data.state

        this.bg0.active = this._type == MissionType.combineDaily
        this.bg1.active = this._type == MissionType.combineUltimate

        this.hasGet.active = state == 2
        this.btnGo.active = false
        this.btnGet.active = state == 0 || (state != 2 && this._cfg.target == 0)

        if (state == 1) {
            this.btnGo.active = true
        }
        this.descLab.string = this._cfg.desc

        this.content.removeAllChildren();
        this._cfg.rewards.forEach(item => {
            let slot = cc.instantiate(this.slotPrefab);
            let ctrl = slot.getComponent(UiSlotItem);
            slot.setScale(.8, .8);
            slot.parent = this.content;
            ctrl.updateItemInfo(item[0], item[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: item[0],
                itemNum: item[1],
                type: BagUtils.getItemTypeById(item[0]),
                extInfo: null
            };
        });

        // 积分图标显示
        let slot = cc.instantiate(this.slotPrefab);
        let ctrl = slot.getComponent(UiSlotItem);
        slot.setScale(.8, .8);
        slot.parent = this.content;
        ctrl.updateItemInfo(130087, this._cfg.score);

        this.proLab.node.active = false
        this.proBar.node.active = false
        if (this._cfg instanceof Combine_dailyCfg) {
            this.activeLab.node.active = !TaskUtil.getCombineDailyTaskIsOpen(this._cfg.id)
            if (this.activeLab.node.active) {
                this.activeLab.string = `${(this._cfg as Combine_dailyCfg).unlock}`
                this.btnGo.active = false
                this.btnGet.active = false
            } else {
                if (state == 1) {
                    this.proLab.node.active = true
                    this.proBar.node.active = true
                }
                let proNums = TaskUtil.getTaskFinishNum(this._cfg.id)
                this.proLab.string = `${proNums[0]}/${proNums[1]}`
                let per = proNums[0] / proNums[1]
                per = Math.min(per, 1)
                this.proBar.progress = per
            }
        } else if (this._cfg instanceof Combine_ultimateCfg) {
            this.activeLab.node.active = !TaskUtil.getCombineUltimateTaskIsOpen(this._cfg.id)
            if (this.activeLab.node.active) {
                this.activeLab.string = `${(this._cfg as Combine_ultimateCfg).unlock}`
                this.btnGo.active = false
                this.btnGet.active = false
            } else {
                if (state == 1) {
                    this.proLab.node.active = true
                    this.proBar.node.active = true
                }
                let proNums = TaskUtil.getTaskFinishNum(this._cfg.id)
                this.proLab.string = `${proNums[0]}/${proNums[1]}`
                let per = proNums[0] / proNums[1]
                per = Math.min(per, 1)
                this.proBar.progress = per
            }
        }
    }

    /**做任务 */
    doTask() {
        if (this._cfg.forward && this._cfg.forward > 0) {
            gdk.panel.hide(PanelId.CombineMainView)
            if (ModelManager.get(RoleModel).guildId == 0) {
                gdk.panel.setArgs(PanelId.GuildList, true)
                gdk.panel.open(PanelId.GuildList)
                return
            }
            JumpUtils.openView(this._cfg.forward)
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

            let msg2 = new icmsg.MergeCarnivalStateReq()
            NetManager.send(msg2, (data: icmsg.MergeCarnivalStateRsp) => {
                this.combineModel.playerRank = data.ranking
                this.combineModel.playerScore = data.score
            })

        });
    }
}