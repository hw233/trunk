import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import ScoreSysHeroItemCtrl from './ScoreSysHeroItemCtrl';
import ScoreSysHeroZrItem2Ctrl from './ScoreSysHeroZrItem2Ctrl';
import TaskModel from '../../model/TaskModel';
import { Score_recommendedCfg } from '../../../../a/config';

/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-14 10:49:26
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysHeroZrItemCtrl")
export default class ScoreSysHeroZrItemCtrl extends cc.Component {

    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Node)
    btnOpen: cc.Node = null;

    @property(cc.Node)
    groupContent: cc.Node = null;

    @property(cc.Prefab)
    heroZrItem2: cc.Prefab = null;

    @property(cc.Node)
    heroContent: cc.Node = null

    @property(cc.Prefab)
    heroItem: cc.Prefab = null

    _isOpen = false

    _index = 0

    _cfgs: Score_recommendedCfg[] = []

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {

    }

    updateViewInfo(type, index) {
        this._cfgs = ConfigManager.getItemsByField(Score_recommendedCfg, "type", type)
        this._index = index
        this.titleLab.string = this._cfgs[0].title
        this._updateHeroList()
    }


    _updateHeroList() {
        this.heroContent.removeAllChildren()
        for (let i = 0; i < this._cfgs.length; i++) {
            let item = cc.instantiate(this.heroItem)
            let ctrl = item.getComponent(ScoreSysHeroItemCtrl)
            ctrl.updateViewInfo(this._cfgs[i], true)
            // let ctrl = item.getComponent(UiSlotItem)
            // let heroCfg = ConfigManager.getItemById(HeroCfg, this._cfgs[i].heroid)
            // let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", heroCfg.career_id)
            // ctrl.group = heroCfg.group[0]
            // ctrl.starNum = heroCfg.star_min
            // ctrl.career = careerCfg.career_type
            // ctrl.updateItemInfo(this._cfgs[i].heroid)
            // item.scale = 0.8
            // ctrl.onClick.on(() => {
            //     gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            //         let comp = node.getComponent(HeroDetailViewCtrl)
            //         comp.initHeroInfo(heroCfg)
            //     })
            // })
            this.heroContent.addChild(item)
        }
    }

    openTheme() {
        // let btnLab = this.btnOpen.getChildByName("label").getComponent(cc.Label)
        // let arrow = this.btnOpen.getChildByName("arrow")
        if (!this._isOpen) {
            // btnLab.string = `收起`
            // arrow.scaleY = -1
            this._isOpen = true
            this.groupContent.removeAllChildren()
            this.groupContent.height = 0
            let item = cc.instantiate(this.heroZrItem2)
            let ctrl = item.getComponent(ScoreSysHeroZrItem2Ctrl)
            ctrl.updateViewInfo(this._cfgs[0])
            this.groupContent.addChild(item)
            this.taskModel.scoreSysListScrollIndex = this._index
        } else {
            this._isOpen = false
            // btnLab.string = `展开`
            // arrow.scaleY = 1
            this.groupContent.removeAllChildren()
            this.groupContent.height = 0
        }
    }

}