import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import ScoreSysWtItemCtrl from './ScoreSysWtItemCtrl';
import TaskModel from '../../model/TaskModel';
import { Score_problemCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-10-13 17:25:50
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysWtPanelCtrl")
export default class ScoreSysWtPanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    wtItem: cc.Prefab = null

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {
        let cfgs = ConfigManager.getItems(Score_problemCfg)
        for (let i = 0; i < cfgs.length; i++) {
            let item = cc.instantiate(this.wtItem)
            this.content.addChild(item)
            let ctrl = item.getComponent(ScoreSysWtItemCtrl)
            ctrl.updateViewInfo(cfgs[i], i)
        }
    }

    @gdk.binding("taskModel.scoreSysListScrolling")
    updateScroilView(state) {
        if (state) {
            this.scrollView.scrollToBottom()
            this.taskModel.scoreSysListScrolling = false
        }
    }
}