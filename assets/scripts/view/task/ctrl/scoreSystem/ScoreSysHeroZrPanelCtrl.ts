import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import ScoreSysHeroZrItemCtrl from './ScoreSysHeroZrItemCtrl';
import ScoreSysZyItemCtrl from './ScoreSysZyItemCtrl';
import TaskModel from '../../model/TaskModel';
import { Score_recommendedCfg, Score_recourseCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-10-30 15:23:25
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysHeroZrPanelCtrl")
export default class ScoreSysHeroZrPanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    heroZrItem: cc.Prefab = null

    _itemCtrl = []

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {
        let cfgs = ConfigManager.getItems(Score_recommendedCfg)
        let typesList = []
        for (let i = 0; i < cfgs.length; i++) {
            if (typesList.indexOf(cfgs[i].type) == -1) {
                typesList.push(cfgs[i].type)
            }
        }
        this._itemCtrl = []
        this.content.removeAllChildren()
        for (let i = 0; i < typesList.length; i++) {
            let item = cc.instantiate(this.heroZrItem)
            this.content.addChild(item)
            let ctrl = item.getComponent(ScoreSysHeroZrItemCtrl)
            ctrl.updateViewInfo(typesList[i], i)
            this._itemCtrl.push(ctrl)
        }
    }

    onDisable() {
        this.taskModel.scoreSysListScrollIndex = 0
    }

    @gdk.binding("taskModel.scoreSysListScrollIndex")
    updateScroilView(index) {
        let layout = this.content.getComponent(cc.Layout)
        layout.updateLayout()

        let items = this.content.children
        let targetItem = items[index]
        this.scrollView.elastic = false
        gdk.Timer.once(100, this, () => {
            this.scrollView.scrollToOffset(cc.v2(0, Math.abs(targetItem.y)))
            this.scrollView.elastic = true
        })
    }
}