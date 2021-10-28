import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import ScoreSysHeroZrItem3Ctrl from './ScoreSysHeroZrItem3Ctrl';
import TaskModel from '../../model/TaskModel';
import { Score_recommendedCfg } from '../../../../a/config';


/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-10-30 13:36:12
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysHeroZrItem2Ctrl")
export default class ScoreSysHeroZrItem2Ctrl extends cc.Component {

    @property(cc.RichText)
    descLab1: cc.RichText = null

    @property(cc.RichText)
    descLab2: cc.RichText = null

    @property(cc.Node)
    groupContent: cc.Node = null;

    @property(cc.Prefab)
    heroZrItem3: cc.Prefab = null;

    _cfg: Score_recommendedCfg = null

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {

    }

    updateViewInfo(cfg: Score_recommendedCfg) {
        this.descLab1.string = cfg.kernel
        this.descLab2.string = cfg.analyze

        this.groupContent.removeAllChildren()
        this.groupContent.height = 0
        let cfgs = ConfigManager.getItemsByField(Score_recommendedCfg, "type", cfg.type)
        for (let i = 0; i < cfgs.length; i++) {
            let item = cc.instantiate(this.heroZrItem3)
            let ctrl = item.getComponent(ScoreSysHeroZrItem3Ctrl)
            ctrl.updateViewInfo(cfgs[i])
            this.groupContent.addChild(item)
        }
    }
}