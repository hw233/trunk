import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import ScoreSysWtItem2Ctrl from './ScoreSysWtItem2Ctrl';
import TaskModel from '../../model/TaskModel';
import { Score_problemCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-19 15:11:30
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysWtItemCtrl")
export default class ScoreSysWtItemCtrl extends cc.Component {

    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Node)
    btnOpen: cc.Node = null;

    @property(cc.Node)
    groupContent: cc.Node = null;

    @property(cc.Prefab)
    wtItem2: cc.Prefab = null;

    _isOpen = false

    _problemCfg: Score_problemCfg
    _index = 0

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {

    }

    updateViewInfo(cfg: Score_problemCfg, index) {
        this._problemCfg = cfg
        this._index = index
        this.titleLab.string = cfg.title
    }

    openTheme() {
        let btnLab = this.btnOpen.getChildByName("label").getComponent(cc.Label)
        let arrow = this.btnOpen.getChildByName("arrow")

        if (!this._isOpen) {
            btnLab.string = `收起`
            arrow.scaleY = -1
            this._isOpen = true
            this.groupContent.removeAllChildren()
            let item = cc.instantiate(this.wtItem2)
            let ctrl = item.getComponent(ScoreSysWtItem2Ctrl)
            ctrl.updateViewInfo(this._problemCfg)
            this.groupContent.addChild(item)
        } else {
            this._isOpen = false
            btnLab.string = `展开`
            arrow.scaleY = 1
            this.groupContent.removeAllChildren()
            this.groupContent.height = 0
        }

        let all = ConfigManager.getItems(Score_problemCfg)
        if (this._index == all.length - 1 || this._index == all.length - 2) {
            gdk.Timer.once(100, this, () => {
                this.taskModel.scoreSysListScrolling = true
            })
        }

    }
}