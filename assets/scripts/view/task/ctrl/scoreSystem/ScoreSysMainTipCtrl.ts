import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MathUtil from '../../../../common/utils/MathUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import ScoreSysUtils from './ScoreSysUtils';
import SdkTool from '../../../../sdk/SdkTool';
import TaskModel from '../../model/TaskModel';
import TaskUtil from '../../util/TaskUtil';
import { MissionType } from '../TaskViewCtrl';
import { Score_missionCfg } from '../../../../a/config';
import { ScoreSysBqItemType } from './ScoreSysBqPanelCtrl';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-19 18:23:27
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysMainTipCtrl")
export default class ScoreSysMainTipCtrl extends cc.Component {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null

    @property(cc.Node)
    tipNode: cc.Node = null

    @property(cc.RichText)
    tipLab: cc.RichText = null

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {
        // this.node.on(cc.Node.EventType.TOUCH_START, this._onNodeClick, this)
        this._updateState()
    }

    _updateState() {
        let curNode = this.taskModel.grading.boxOpened
        if (curNode == 0) {
            curNode = 1
        }
        let cfgs = ConfigManager.getItemsByField(Score_missionCfg, "node", curNode)
        GlobalUtil.sortArray(cfgs, (a: Score_missionCfg, b: Score_missionCfg) => {
            if (a.priority == b.priority) {
                return a.id - b.id
            }
            return a.priority - b.priority
        })

        let tip = ''
        let priority = 1
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i]
            let finish = TaskUtil.getTaskState(cfg.id)
            if (!finish) {
                tip = cfg.content
                priority = cfg.priority
                break
            }
        }

        if (this.roleModel.gradingWarFail && tip && ScoreSysUtils.is_can_upgrade()) {
            this.spine.node.x = -40
            let id = MathUtil.rnd(1, 3)
            this.spine.setAnimation(0, `action${id}`, true)
            this.tipNode.active = true
            this.tipLab.string = tip

            let list = TaskUtil.getGradingTaskList()
            let datas: ScoreSysBqItemType[] = []
            for (let index = 0; index < list.length; index++) {
                const cfg = list[index];
                // 是否已完成
                let finish = TaskUtil.getTaskState(cfg.id)
                let geted = this.taskModel.rewardIds[cfg.id] || 0
                // 任务状态 0:可领取 1:未完成 2:已领取
                let state = 1
                if (finish) {
                    if (geted == 0) {
                        state = 0
                    } else {
                        state = 2
                    }
                }
                let isOpen = 0
                if (TaskUtil.getGradingTaskIsOpen(cfg.id)) {
                    isOpen = 1
                }
                let info: ScoreSysBqItemType = { type: MissionType.grading, state: state, cfg: cfg, isOpen: isOpen, index: index }
                datas.push(info)
            }
            /**任务列表排序, */
            GlobalUtil.sortArray(datas, (a, b) => {
                if (a.state == b.state) {
                    if (a.isOpen == b.isOpen) {
                        return a.cfg.id - b.cfg.id
                    }
                    return b.isOpen - a.isOpen // 已开启>未开启
                }
                return a.state - b.state
            })
            for (let i = 0; i < datas.length; i++) {
                datas[i].index = i
            }
            for (let i = 0; i < datas.length; i++) {
                if (datas[i].cfg.priority == priority) {
                    this.roleModel.gradingGuideIndex = i
                }
            }
        } else {
            this.spine.node.x = 30
            this.spine.setAnimation(0, "standby", true)
            this.tipNode.active = false
            this.roleModel.gradingWarFail = false
        }
    }

    onNodeClick() {
        this.roleModel.gradingWarFail = false
        this._updateState()
        // 不显示充值按钮
        if (!SdkTool.tool.can_charge) {
            return;
        }
        gdk.panel.open(PanelId.ScoreSytemView)
    }
}