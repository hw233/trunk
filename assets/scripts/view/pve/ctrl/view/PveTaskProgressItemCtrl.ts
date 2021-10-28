import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import CopyUtil from '../../../../common/utils/CopyUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import StringUtils from '../../../../common/utils/StringUtils';
import TaskModel from '../../../task/model/TaskModel';
import TaskUtil, { TaskSheetType } from '../../../task/util/TaskUtil';
import TrialInfo from '../../../instance/trial/model/TrialInfo';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Copy_stageCfg, Mission_dailyCfg, Mission_welfareCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-05-18 10:59:18 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveTaskProgressItemCtrl")
export default class PveTaskProgressItemCtrl extends UiListItem {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    statusFlagNode: cc.Node = null;

    @property(cc.RichText)
    progressLabel: cc.RichText = null;

    @property(cc.Label)
    taskNameLabel: cc.Label = null;

    @property(cc.Node)
    rewardParent: cc.Node = null;

    @property(cc.Node)
    reciveBtn: cc.Node = null;

    @property(cc.Prefab)
    slot: cc.Prefab = null;

    sheetType: TaskSheetType;
    cfg: any;
    color: string[] = ["#37FF28", "#ECBD7C"];  // [done, todo]
    descTitle: string[] = [gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP1"), gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP2"), gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP3"), gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP4"), '', gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP5"), gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP6")]

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }

    get trialModel(): TrialInfo { return ModelManager.get(TrialInfo); }

    onDisable() {
        gdk.Timer.clearAll(this);
    }

    updateView() {
        // let layout = this.taskNameLabel.node.parent.getComponent(cc.Layout);
        // layout.node.setAnchorPoint(0, .5);
        // layout.node.x = -27;
        this.sheetType = this.data.sheetType;
        this.cfg = this.data.cfg;
        let state = TaskUtil.getTaskState(this.cfg.id, this.sheetType);
        this.statusFlagNode.getComponent(cc.Sprite).enabled = state;
        this.progressLabel.node.active = true;
        this.reciveBtn.active = false;
        if (!state) {
            this.taskNameLabel.string = this.descTitle[this.sheetType - 1];
        }
        else {
            this.taskNameLabel.string = '';
        }
        if (this.sheetType == TaskSheetType.daily && this.cfg instanceof Mission_dailyCfg) {
            this.taskNameLabel.string += this.cfg.desc.replace('{number}', this.cfg.number + '');
        }
        else if (this.sheetType == TaskSheetType.welfare && this.cfg instanceof Mission_welfareCfg) {
            this.taskNameLabel.string += this.cfg.desc.replace('{number}', `${CopyUtil.getChapterId(this.cfg.args)}-${CopyUtil.getSectionId(this.cfg.args)}`);
        }
        else {
            this.taskNameLabel.string += this.cfg.desc;
        }
        this.progressLabel.node.color = new cc.Color().fromHEX(state ? this.color[0] : this.color[1]);
        this.taskNameLabel.node.color = new cc.Color().fromHEX(state ? this.color[0] : this.color[1]);
        this.bg.getComponent(cc.Sprite).enabled = (this.curIndex + 1) % 2 == 0;
        this._updateProgress();
        if (state) {
            TaskUtil.setPveTaskProgressReadStatus(this.sheetType, this.cfg.target, this.cfg.id);
        }
        if (this.cfg['reward']) {
            for (let i = 0; i < this.cfg['reward'].length; i++) {
                let slot = cc.instantiate(this.slot);
                let ctrl = slot.getComponent(UiSlotItem);
                slot.parent = this.rewardParent;
                slot.setScale(.5, .5);
                ctrl.itemInfo = {
                    itemId: this.cfg['reward'][i][0],
                    series: 0,
                    type: BagUtils.getItemTypeById(this.cfg['reward'][i][0]),
                    itemNum: this.cfg['reward'][i][1],
                    extInfo: null,
                };
                ctrl.updateItemInfo(this.cfg['reward'][i][0], this.cfg['reward'][i][1]);
            }
        }
        else {
            for (let i = 0; i < 3; i++) {
                if (this.cfg[`reward${i + 1}`] && this.cfg[`reward${i + 1}`].length == 2) {
                    let slot = cc.instantiate(this.slot);
                    let ctrl = slot.getComponent(UiSlotItem);
                    slot.parent = this.rewardParent;
                    slot.setScale(.5, .5);
                    ctrl.itemInfo = {
                        itemId: this.cfg[`reward${i + 1}`][0],
                        series: 0,
                        type: BagUtils.getItemTypeById(this.cfg[`reward${i + 1}`][0]),
                        itemNum: this.cfg[`reward${i + 1}`][1],
                        extInfo: null,
                    };
                    ctrl.updateItemInfo(this.cfg[`reward${i + 1}`][0], this.cfg[`reward${i + 1}`][1]);
                }
            }
        }

        // if (this.sheetType == TaskSheetType.welfare) {
        // layout.node.setAnchorPoint(1, .5);
        // layout.node.x = 356;
        // let timeNode = cc.instantiate(this.taskNameLabel.node);
        // timeNode.parent = this.taskNameLabel.node.parent;
        // let label = timeNode.getComponent(cc.Label);
        // label.string = '剩余:' + TimerUtils.format3((ActUtil.getActEndTime(6) - GlobalUtil.getServerTime()) / 1000);
        // gdk.Timer.frameLoop(1, this, () => {
        //     label.string = '剩余:' + TimerUtils.format3((ActUtil.getActEndTime(6) - GlobalUtil.getServerTime()) / 1000);
        // })
        // }
        // layout.updateLayout();
    }

    /**
     * 202-通关主线 
     * 221-通关扫荡主线 
     * 213-通过第几级生存训练 
     * 209-击杀多少个正义的反击Boss
     * 205-通关无尽的黑暗第几层 
     * 206-通关多少次精英副本 
     * 602-竞技场获胜多少次
     */
    _updateProgress() {
        let targets = [202, 221, 213, 209, 205, 206, 602];
        if (targets.indexOf(this.cfg.target) != -1) {
            this[`_updateByType${this.cfg.target}`]();
        }
    }

    _updateByType202() {
        let targetId: number = this.cfg.args;
        if (targetId) {
            let cfgs = ConfigManager.getItemsByField(Copy_stageCfg, 'copy_id', 1);
            let ids = [];
            cfgs.forEach(cfg => {
                ids.push(cfg.id);
            });
            let num = Math.max(0, ids.indexOf(this.copyModel.lastCompleteStageId));
            let targetIdx = ids.indexOf(targetId);
            // this.progressLabel.string = `(${num >= 0 ? num + 1 : 0}/${targetIdx + 1})`;
            this.progressLabel.string = num >= targetIdx ? gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP7") : StringUtils.format(gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP8"), this.color[0], targetIdx - num);//`还差<color=${this.color[0]}>${targetIdx - num}</color>关`}`;
        }
        else {
            this.progressLabel.string = '';
        }
    }

    _updateByType221() {
        let num: number = 0;
        let datas = this._getDataByTaskType();
        if (!!datas[this.cfg.target] && datas[this.cfg.target][0]) {
            let item: icmsg.MissionProgress = datas[this.cfg.target][0];
            if (item) num = item.num;
        }
        this.progressLabel.string = num >= this.cfg.number ? gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP7") : StringUtils.format(gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP9"), this.color[0], this.cfg.number - num);//`还差<color=${this.color[0]}>${this.cfg.number - num}</color>次`;
        // this.progressLabel.string = `(${num}/${this.cfg.number})`;
    }

    _updateByType213() {
        let finish = TaskUtil.getTaskState(this.cfg.id, this.sheetType);
        this.progressLabel.string = `(${finish ? 1 : 0}/1)`;
    }

    _updateByType209() {
        let num: number = 0;
        let datas = this._getDataByTaskType();
        if (!!datas[this.cfg.target] && datas[this.cfg.target][0]) {
            let item: icmsg.MissionProgress = datas[this.cfg.target][0];
            if (item) num = item.num;
        }
        this.progressLabel.string = num >= this.cfg.number ? gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP7") : StringUtils.format(gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP10"), this.color[0], this.cfg.number - num);//`还差<color=${this.color[0]}>${this.cfg.number - num}</color>个`}`;
        // this.progressLabel.string = `(${num}/${this.cfg.number})`;
    }

    _updateByType205() {
        let subtype = this.cfg.args[0];
        let num = 0;
        let datas = this._getDataByTaskType();
        if (!!datas[this.cfg.target] && datas[this.cfg.target][subtype]) {
            let item: icmsg.MissionProgress = datas[this.cfg.target][subtype];
            if (item) num = item.num;
        }
        this.progressLabel.string = num >= this.cfg.number ? gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP7") : StringUtils.format(gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP11"), this.color[0], this.cfg.number - num);//`还差<color=${this.color[0]}>${this.cfg.number - num}</color>层`}`;
        // this.progressLabel.string = `(${num}/${this.cfg.number})`
    }

    _updateByType206() {
        let num: number = 0;
        let datas = this.copyModel.eliteStageData;
        datas.forEach(data => {
            if (data && data > 0) {
                let chapterId = CopyUtil.getChapterId(data);
                num += CopyUtil.getEliteStageCurChaterData(chapterId)[0];
            }
        });
        this.progressLabel.string = num >= this.cfg.number ? gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP7") : StringUtils.format(gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP9"), this.color[0], this.cfg.number - num);//`还差<color=${this.color[0]}>${this.cfg.number - num}</color>次`}`;
        // this.progressLabel.string = `(${num}/${this.cfg.number})`;
    }

    _updateByType602() {
        let num: number = 0;
        let datas = this._getDataByTaskType();
        if (!!datas[this.cfg.target] && datas[this.cfg.target][0]) {
            let item: icmsg.MissionProgress = datas[this.cfg.target][0];
            if (item) num = item.num;
        }
        this.progressLabel.string = num >= this.cfg.number ? gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP7") : StringUtils.format(gdk.i18n.t("i18n:PVE_TASK_PROGRESS_TIP9"), this.color[0], this.cfg.number - num);//`还差<color=${this.color[0]}>${this.cfg.number - num}</color>次`}`;
        // this.progressLabel.string = `(${num}/${this.cfg.number})`;
    }

    _getDataByTaskType() {
        let data = null;
        switch (this.sheetType) {
            case TaskSheetType.daily:
                data = this.taskModel.dailyDatas;
                break;
            case TaskSheetType.achievement:
                data = this.taskModel.achieveDatas;
                break;
            case TaskSheetType.grow:
                data = this.taskModel.GrowDatas;
                break;
        }
        return data;
    }
}
