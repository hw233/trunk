import ConfigManager from '../../../../common/managers/ConfigManager';
import HeroDetailViewCtrl from '../../../lottery/ctrl/HeroDetailViewCtrl';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import TaskModel from '../../model/TaskModel';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Hero_careerCfg, HeroCfg, Score_recommendedCfg } from '../../../../a/config';


/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-09 16:44:51
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysHeroItemCtrl")
export default class ScoreSysHeroItemCtrl extends cc.Component {

    @property(UiSlotItem)
    uiSlot: UiSlotItem = null

    @property(cc.Node)
    unGet: cc.Node = null

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }
    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }

    onEnable() {

    }

    updateViewInfo(cfg: Score_recommendedCfg, showMask: boolean = false) {
        let heroCfg = ConfigManager.getItemById(HeroCfg, cfg.heroid)
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", heroCfg.career_id)
        this.uiSlot.group = heroCfg.group[0]
        this.uiSlot.starNum = heroCfg.star_min
        this.uiSlot.career = careerCfg.career_type
        this.uiSlot.starNum = cfg.star
        this.uiSlot.quality = cfg.color
        this.uiSlot.updateItemInfo(cfg.heroid)
        // this.uiSlot.updateStar(cfg.star)
        // this.uiSlot.updateQuality(cfg.color)
        this.uiSlot.onClick.on(() => {
            gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
                let comp = node.getComponent(HeroDetailViewCtrl)
                comp.initHeroInfo(heroCfg)
            })
        })

        this.unGet.active = false
        let heroInfo = HeroUtils.getHeroInfoById(cfg.heroid)
        if (!heroInfo) {
            this.unGet.active = true && showMask
        }
    }
}