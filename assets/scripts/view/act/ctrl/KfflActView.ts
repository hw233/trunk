import ActUtil from '../util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import ModelManager from '../../../common/managers/ModelManager';
import TaskModel from '../../task/model/TaskModel';
import TaskUtil from '../../task/util/TaskUtil';
import { Copy_stageCfg, Mission_welfareCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-06-29 11:46:43 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/KfflActView")
export default class KfflActView extends gdk.BasePanel {

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    rewardNumLabel: cc.Label = null;

    @property(cc.ScrollView)
    taskScrollView: cc.ScrollView = null;

    @property(cc.Node)
    taskContent: cc.Node = null;

    @property(cc.ScrollView)
    progressScrollView: cc.ScrollView = null;

    @property(cc.Node)
    progressContent: cc.Node = null;

    @property(cc.Prefab)
    taskItemPrefab: cc.Prefab = null;

    list: ListView = null;
    cfgs: Mission_welfareCfg[] = [];
    onEnable() {
        ModelManager.get(TaskModel).isFirstOpenKfflView = false;
        let startTime = new Date(ActUtil.getActStartTime(6));
        let endTime = new Date(ActUtil.getActEndTime(6) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
        }
        else {
            this.timeLabel.string = `${gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2")}${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }
        this.cfgs = ConfigManager.getItems(Mission_welfareCfg);
        let totalNum: number = 0;
        this.cfgs.forEach(cfg => {
            let rewards = cfg.reward;
            for (let i = 0; i < rewards.length; i++) {
                totalNum += rewards[i][1];
            }
        });
        this.rewardNumLabel.string = totalNum + '';
        this._initList();
    }

    onDisable() {
        gdk.e.targetOff(this);
        this.list && this.list.destroy();
        this.list = null;
        this.cfgs = [];
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.taskScrollView,
                mask: this.taskScrollView.node,
                content: this.taskContent,
                item_tpl: this.taskItemPrefab,
                cb_host: this,
                async: true,
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }

        this.list.clear_items();
        this.list.set_data(this.cfgs);
        gdk.Timer.callLater(this, () => {
            let bg = this.progressContent.getChildByName('progressBg');
            bg.height = this.taskContent.height - 66;
            this._updateProgress();
            for (let i = 0; i < this.cfgs.length; i++) {
                let lastSid = ModelManager.get(CopyModel).lastCompleteStageId;
                if (!TaskUtil.getWelfareTaskState(this.cfgs[i].id) && lastSid >= this.cfgs[i].args) {
                    this.list.scroll_to(i);
                    this.onTaskScroll();
                    return;
                }
                if (lastSid < this.cfgs[i].args) {
                    this.list.scroll_to(Math.max(0, i - 4));
                    this.onTaskScroll();
                    return;
                }
            }
            this.list.scroll_to(Math.max(0, this.cfgs.length - 1));
            this.onTaskScroll();
        })
    }

    onTaskScroll() {
        // this.progressScrollView.scrollToOffset(this.taskScrollView.getScrollOffset());
        this.progressContent.y = this.taskContent.y - 6;
    }

    _updateProgress() {
        let bg = this.progressContent.getChildByName('progressBg');
        let bar = bg.getChildByName('progressbar');
        bar.height = 0;
        let cfgs = ConfigManager.getItems(Mission_welfareCfg);
        let dl = this.taskContent.height / cfgs.length - 61;
        let lastSid = ModelManager.get(CopyModel).lastCompleteStageId;
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].args <= lastSid) {
                bar.height += (i == 0 ? dl : dl + 61);
            }
            else {
                let copyCfgs = ConfigManager.getItemsByField(Copy_stageCfg, 'copy_id', 1);
                let ids = [];
                copyCfgs.forEach(cfg => {
                    ids.push(cfg.id);
                });
                let startIdx = Math.max(0, ids.indexOf(cfgs[i - 1] ? cfgs[i - 1].args : -1));
                let targetIdx = ids.indexOf(cfgs[i].args);
                let curIdx = Math.max(0, ids.indexOf(lastSid));
                let ddl = (i == 0 ? dl : dl + 61) / (targetIdx - startIdx);
                bar.height += (ddl * (curIdx - startIdx));
                return;
            }
        }
        bar.height = Math.min(bar.height, this.taskContent.height - 66);
    }
}
