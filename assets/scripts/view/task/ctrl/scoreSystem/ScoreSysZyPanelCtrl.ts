import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import ScoreSysZyItemCtrl from './ScoreSysZyItemCtrl';
import TaskModel from '../../model/TaskModel';
import { Score_recourseCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-11-18 15:07:11
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysZyPanelCtrl")
export default class ScoreSysZyPanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    zyItem: cc.Prefab = null

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {
        let cfgs = ConfigManager.getItemsByField(Score_recourseCfg, "whether_theme", 1)
        for (let i = 0; i < cfgs.length; i++) {
            let item = cc.instantiate(this.zyItem)
            this.content.addChild(item)
            let ctrl = item.getComponent(ScoreSysZyItemCtrl)
            ctrl.updateViewInfo(cfgs[i], i)
        }
    }

    @gdk.binding("taskModel.scoreSysListScrollIndex")
    updateScroilView(index) {
        let layout = this.content.getComponent(cc.Layout)
        layout.updateLayout()

        let items = this.content.children
        let targetItem = items[index]
        this.scrollView.elastic = false

        let all = ConfigManager.getItemsByField(Score_recourseCfg, "whether_theme", 1)
        if (index == all.length - 1 || index == all.length - 2) {
            gdk.Timer.once(100, this, () => {
                this.scrollView.scrollToBottom()
            })
        } else {
            gdk.Timer.once(100, this, () => {
                this.scrollView.scrollToOffset(cc.v2(0, Math.abs(targetItem.y)))
                this.scrollView.elastic = true
            })
        }
    }
}