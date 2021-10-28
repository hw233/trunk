import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import TaskModel from '../../model/TaskModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Score_missionCfg, ScoreCfg } from '../../../../a/config';
import { TaskEventId } from '../../enum/TaskEventId';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-10-30 11:58:11
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysBqPreViewCtrl")
export default class ScoreSysBqPreViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    preItem: cc.Prefab = null

    list: ListView = null;

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {
        gdk.e.on(TaskEventId.UPDATE_TASK_AWARD_STATE, this._updateViewData, this)
        this._updateViewData()

        let curNode = this.taskModel.grading.boxOpened
        if (curNode >= 1) {
            curNode = curNode - 2
        }
        if (curNode < 0) {
            curNode = 0
        }
        this.list.scroll_to(curNode)
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.preItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
    }

    _updateViewData() {
        this._initListView()
        let cfgs = ConfigManager.getItems(ScoreCfg)
        let datas = []
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].rewards && cfgs[i].rewards.length > 0) {
                datas.push(cfgs[i])
            }
        }
        this.list.set_data(datas, false)
    }
}