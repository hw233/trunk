import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import TaskModel from '../../../task/model/TaskModel';
import TaskUtil from '../../../task/util/TaskUtil';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { MissionType } from '../../../task/ctrl/TaskViewCtrl';
import { Relic_taskCfg } from '../../../../a/config';
import { TaskEventId } from '../../../task/enum/TaskEventId';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/tradingPort/RelicTaskViewCtrl")
export default class RelicTaskViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    tabBtns: cc.Node[] = [];

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    taskItem: cc.Prefab = null

    _curIndex = 0
    list: ListView = null;

    onEnable() {
        gdk.e.on(TaskEventId.UPDATE_TASK_AWARD_STATE, this._updateListData, this)
        this.selectTab(null, 0)
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
            item_tpl: this.taskItem,
            cb_host: this,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }


    selectTab(e, index) {
        this._curIndex = parseInt(index)
        for (let i = 0; i < this.tabBtns.length; i++) {
            let node = this.tabBtns[i]
            let btn = node.getComponent(cc.Button)
            btn.interactable = index != i
            let select = node.getChildByName("select")
            let common = node.getChildByName("common")
            select.active = index == i
            common.active = index != i
        }
        this._updateListData()
    }

    _updateListData() {
        this._initListView()
        let datas = []
        let cfgs = []
        if (this._curIndex == 0) {
            cfgs = ConfigManager.getItems(Relic_taskCfg, { type: 1 })
        } else if (this._curIndex == 1) {
            cfgs = ConfigManager.getItems(Relic_taskCfg, { type: 2 })
        }
        for (let i = 0; i < cfgs.length; i++) {
            let finish = TaskUtil.getTaskState(cfgs[i].id)
            let geted = ModelManager.get(TaskModel).rewardIds[cfgs[i].id] || 0
            // 任务状态 0:可领取 1:未完成 2:已领取
            let state = 1
            if (finish) {
                if (geted == 0) {
                    state = 0
                } else {
                    state = 2
                }
            }
            let info: any = { cfg: cfgs[i], state: state }
            datas.push(info)
        }
        GlobalUtil.sortArray(datas, (a, b) => {
            return a.state - b.state
        })
        this.list.set_data(datas)
    }
}