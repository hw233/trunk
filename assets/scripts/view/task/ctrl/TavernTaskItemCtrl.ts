import ActivityModel from '../../act/model/ActivityModel';
import ActUtil from '../../act/util/ActUtil';
import BagUtils from '../../../common/utils/BagUtils';
import CarnivalUtil from '../../act/util/CarnivalUtil';
import CombineModel from '../../combine/model/CombineModel';
import CombineUtils from '../../combine/util/CombineUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import TaskModel from '../model/TaskModel';
import TaskUtil from '../util/TaskUtil';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { TaskEventId } from '../enum/TaskEventId';
import { Tavern_taskCfg, TavernCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-06-04 15:27:35 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/TavernTaskItemCtrl")
export default class TavernTaskItemCtrl extends UiListItem {
    @property(cc.Node)
    slot: cc.Node = null;

    @property(cc.Label)
    qualityLabel: cc.Label = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Button)
    sendBtn: cc.Button = null;

    @property(cc.Button)
    getBtn: cc.Button = null;

    @property(cc.Button)
    quickGetBtn: cc.Button = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.Node)
    progressMask: cc.Node = null;

    @property(cc.Label)
    leftTimeLabel: cc.Label = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    tqSp: cc.Node = null;

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    isSendWithoutDispatchEvent: boolean = false;
    resp: icmsg.TavernTaskStartRsp;
    cfg: Tavern_taskCfg = null;
    _leftTime: number = null;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v != 0) return;
        this._leftTime = Math.max(0, v);
        this.progressMask.width = (1 - this._leftTime / this.cfg.time) * 152;
        if (this.leftTime == 0) {
            //TODO
            this.getBtn.node.active = true;
            this.quickGetBtn.node.active = false;
            this.leftTimeLabel.string = gdk.i18n.t('i18n:TASK_TIP33');
            gdk.e.emit(TaskEventId.TAVERN_TASK_COUNT_DOWN_OUT); //倒计时结束
        }
        else {
            //TODO
            this.leftTimeLabel.string = TimerUtils.format2(this._leftTime);
            this.quickGetBtn.node.active = true;
            this.getBtn.node.active = false;
            let quickInfo = ConfigManager.getItemById(TavernCfg, 1);
            let ration = quickInfo.finish_cost[1];
            cc.find('Background/layout/costLab', this.quickGetBtn.node).getComponent(cc.Label).string = Math.min(quickInfo.finish_cost[2], Math.ceil(this._leftTime / 3600) * ration) + '';
        }
    }

    dtime: number = 0;
    update(dt: number) {
        if (this.leftTime > 0 && this.data.startTime > 0) {
            if (this.dtime > 1) {
                this.dtime = 0;
                let curTime = Math.floor(GlobalUtil.getServerTime() / 1000);
                this.leftTime = this.cfg.time - (curTime - this.data.startTime);
                // this.leftTime -= 1;
            }
            else {
                this.dtime += dt;
            }
        }
    }

    onEnable() {
        NetManager.on(icmsg.TavernTaskStartRsp.MsgType, this._onTavernTaskStartRsp, this);
    }

    onDisable() {
        if (this.isSendWithoutDispatchEvent == true) {
            this.isSendWithoutDispatchEvent = false;
            this.spine.setCompleteListener(null);
            this.spine.node.active = false;
            this._updateTaskData(this.resp);
            gdk.e.emit(TaskEventId.TAVERN_TASK_START, this.resp);
        }
        this.leftTime = null;
        this.resp = null;
        this.isSendWithoutDispatchEvent = false;
        GuideUtil.bindGuideNode(4000);
        NetManager.targetOff(this);
    }

    updateView() {
        GlobalUtil.setSpineData(this.node, this.spine, null);
        this.spine.node.active = false;
        this.tqSp.active = false;
        let data: icmsg.TavernTask = this.data;
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000);
        this.cfg = ConfigManager.getItemById(Tavern_taskCfg, data.taskId);
        this.nameLabel.string = this.cfg.name;
        this.nameLabel.node.color = BagUtils.getColor(this.cfg.quality);
        this.nameLabel.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(this.cfg.quality);
        if (data.index == -1) {
            this.nameLabel.string += ` (${gdk.i18n.t('i18n:TASK_TIP34')})`;
        } else if (data.index == -2) {
            this.nameLabel.string += ` (${gdk.i18n.t('i18n:TASK_TIP35')})`;
        }
        if ([-1, -2].indexOf(data.index) >= 0) {
            //跨服特权
            let activityModel = ModelManager.get(ActivityModel);
            let rank = activityModel.roleServerRank ? activityModel.roleServerRank.rank : -1;
            if (rank >= 1 && rank <= 3) {
                let cServerRankTCfg = CarnivalUtil.getCrossRankConfig(rank);
                if (cc.js.isNumber(cServerRankTCfg.privilege3)) {
                    this.tqSp.active = true;
                }
            }

            //合服特权
            let combineModel = ModelManager.get(CombineModel)
            let combineRank = combineModel.serverRank ? combineModel.serverRank : -1
            if (ActUtil.ifActOpen(95) && combineRank >= 1 && combineRank <= 3) {
                let combineRankTCfg = CombineUtils.getCrossRankConfig(combineRank);
                if (cc.js.isNumber(combineRankTCfg.privilege3)) {
                    this.tqSp.active = true
                }
            }
        }
        let costCfg = ConfigManager.getItemById(TavernCfg, 1);
        GlobalUtil.setSpriteIcon(this.node, cc.find('cost/icon', this.sendBtn.node), GlobalUtil.getIconById(costCfg.cost[0]));
        cc.find('cost/num', this.sendBtn.node).getComponent(cc.Label).string = costCfg.cost[1] + '';
        if (data.startTime > 0) {
            this.timeLabel.node.active = false;
            this.progressNode.active = true;
            this.sendBtn.node.active = false;
            this.getBtn.node.active = false;
            this.quickGetBtn.node.active = true;
            this.leftTime = this.cfg.time - (curTime - data.startTime);
        }
        else {
            this.timeLabel.node.active = true;
            this.progressNode.active = false;
            this.sendBtn.node.active = true;
            this.getBtn.node.active = false;
            this.quickGetBtn.node.active = false;
            let hour = Math.floor(this.cfg.time / 3600);
            let minute = Math.floor((this.cfg.time - hour * 3600) / 60);
            this.timeLabel.string = `${gdk.i18n.t('i18n:TASK_TIP36')}:` + (hour > 0 ? `${hour}${gdk.i18n.t('i18n:TASK_TIP37')}` : '') + (minute > 0 ? `${minute}${gdk.i18n.t('i18n:TASK_TIP38')}` : '');
        }
        let qualitys = 5;
        let taskQuality = Math.min(qualitys, this.cfg.quality);
        this.qualityLabel.string = '1'.repeat(taskQuality) + '0'.repeat(qualitys - taskQuality);
        this.slot.getComponent(UiSlotItem).group = 0;
        this.slot.getComponent(UiSlotItem).starNum = 0;
        this.slot.getComponent(UiSlotItem).itemInfo = {
            itemId: this.cfg.reward[0],
            series: null,
            type: BagUtils.getItemTypeById(this.cfg.reward[0]),
            itemNum: this.cfg.reward[1],
            extInfo: null,
        }
        this.slot.getComponent(UiSlotItem).updateItemInfo(this.cfg.reward[0], this.cfg.reward[1]);
        if (this.curIndex == 0 && this.cfg.type == 99) {
            GuideUtil.bindGuideNode(4000, this.sendBtn.node);
        }
    }

    onSendBtnClick() {
        gdk.panel.setArgs(PanelId.TavernSendView, this.data);
        gdk.panel.open(PanelId.TavernSendView);
    }

    onGetBtnClick() {
        let req = new icmsg.TavernTaskRewardReq();
        req.index = this.data.index;
        req.isFast = false;
        NetManager.send(req);
    }

    onQuickGetBtnClick() {
        let req = new icmsg.TavernTaskRewardReq();
        req.index = this.data.index;
        req.isFast = true;
        NetManager.send(req);
    }

    onActiveTQbtnClick() {
        ModelManager.get(TaskModel).tavernGuideId = this.cfg.quality == 3 ? 500004 : 500005;
        JumpUtils.openRechargeView([0]);
    }

    /**
     * 
     * @param resp 
     */
    _onTavernTaskStartRsp(resp: icmsg.TavernTaskStartRsp) {
        if (resp.doingTask.taskId == this.data.taskId && resp.todoIndex == this.data.index) {
            this.spine.setCompleteListener(() => {
                this.isSendWithoutDispatchEvent = false;
                this.spine.setCompleteListener(null);
                this.spine.node.active = false;
                gdk.e.emit(TaskEventId.TAVERN_TASK_START, resp);
            });
            this._updateTaskData(resp);
            GlobalUtil.setSpineData(this.node, this.spine, 'spine/ui/UI_anniushengji/UI_anniushengji', true, 'stand', true);
            this.spine.node.active = true;
            this.isSendWithoutDispatchEvent = true;
            this.resp = resp;
        }
    }

    _updateTaskData(resp: icmsg.TavernTaskStartRsp) {
        //删除todoList
        for (let i = 0; i < this.taskModel.tavernTodoTaskList.length; i++) {
            if (this.taskModel.tavernTodoTaskList[i].index == resp.todoIndex) {
                this.taskModel.tavernTodoTaskList.splice(i, 1);
                break;
            }
        }
        //添加doingList
        if ([-1, -2].indexOf(resp.doingTask.index) === -1) {
            this.taskModel.tavernDoingTaskList.push(resp.doingTask);
        }
        else {

            if (resp.doingTask.index == -1) {
                this.taskModel.tavernExtraTask1 = resp.doingTask;
            }
            else {
                this.taskModel.tavernExtraTask2 = resp.doingTask;
            }
        }
        //更新英雄派遣状态
        let heroList = resp.doingTask.heroList;
        heroList.forEach(info => {
            TaskUtil.updatTavernHeroSendState(info.heroId, 1);
        })
    }
}
