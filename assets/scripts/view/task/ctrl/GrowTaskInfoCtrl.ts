import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import TaskModel from '../model/TaskModel';
import TaskUtil from '../util/TaskUtil';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Mission_grow_chapterCfg, Mission_growCfg } from '../../../a/config';
import { TaskEventId } from '../enum/TaskEventId';

/**
 * @Description: 成长任务主界面图标控制器
 * @Author: yaozu.hu
 * @Date: 2019-03-25 15:22:12
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 12:54:10
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class GrowTaskInfoCtrl extends cc.Component {

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.Node)
    pro: cc.Node = null;

    @property(cc.Node)
    flag: cc.Node = null;

    @property(cc.Node)
    state1: cc.Node = null;

    @property(cc.Node)
    state2: cc.Node = null;

    width: number = 99.6;
    lastChaptercfg: Mission_grow_chapterCfg;
    get model(): TaskModel { return ModelManager.get(TaskModel); }
    onEnable() {
        gdk.e.on(TaskEventId.UPDATE_TASK_GROW_INFO, this.initGrowTaskData, this)
        this.initGrowTaskData()
    }
    onDisable() {
        gdk.e.targetOff(this)
    }

    initGrowTaskData() {
        let model = this.model;
        let chapterCfgs = ConfigManager.getItems(Mission_grow_chapterCfg)
        this.lastChaptercfg = chapterCfgs[chapterCfgs.length - 1]
        //获取当前章节信息，如果没有就向服务器请求数据
        if (model.GrowChapter == 0) {
            NetManager.send(new icmsg.MissionGrowListReq())
            return;
        }
        // let chapterId = Math.min(model.GrowChapter, this.lastChaptercfg.id)
        let chapterId = model.GrowChapter
        this.state1.active = model.GrowChapter <= this.lastChaptercfg.id;
        this.state2.active = model.GrowChapter > this.lastChaptercfg.id;
        let cfgs: Mission_growCfg[] = ConfigManager.getItems(Mission_growCfg, { chapter: chapterId });
        if (cfgs.length == 0) {
            this.node.active = false;
            return;
        }
        this.node.active = true;
        if (this.state1) {
            let comNum = 0;
            for (let i = 0; i < cfgs.length; i++) {
                let cfg = cfgs[i];
                let state = TaskUtil.getGrowTaskItemState(cfg, i);
                if (state != 0) {
                    comNum += 1;
                }

            }

            this.num.string = comNum + '/' + cfgs.length
            this.pro.width = Math.floor(comNum / cfgs.length * this.width);

            let rewardCfg = ConfigManager.getItemById(Mission_grow_chapterCfg, chapterId);
            this.slot.updateItemInfo(rewardCfg.reward[0], rewardCfg.reward[1]);
            if (comNum == cfgs.length) {
                this.slot.qualityEffect(BagUtils.getConfigById(rewardCfg.reward[0]).defaultColor);
                this.flag.active = true;
            }
            else {
                this.slot.qualityEffect(-1);
                this.flag.active = false;
            }
        }
    }

    onClick() {
        JumpUtils.openGrowTaskView();
    }
}
