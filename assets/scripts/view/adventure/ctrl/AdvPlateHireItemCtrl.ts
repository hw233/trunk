import AdventureModel from '../model/AdventureModel';
import AdventureUtils from '../utils/AdventureUtils';
import AdvHireHeroDetailCtrl from './AdvHireHeroDetailCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Adventure_hireCfg, Hero_careerCfg, HeroCfg } from '../../../a/config';
/**
 * @Description: 雇佣英雄子项
 * @Author: luoyong
 * @Date: 2019-04-18 13:44:33
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-21 14:33:01
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdvPlateHireItemCtrl")
export default class AdvPlateHireItemCtrl extends UiListItem {

    @property(UiSlotItem)
    heroItem: UiSlotItem = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Label)
    powerLab: cc.Label = null

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Label)
    useLab: cc.Label = null

    @property(cc.Node)
    selectIcon: cc.Node = null

    _hireCfg: Adventure_hireCfg

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }

    updateView() {
        this._hireCfg = this.data.cfg
        this.selectIcon.active = this.data.isSelect

        this.powerLab.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP41")}${AdventureUtils.getHeroPower(this._hireCfg)}`
        this.nameLab.string = `${this._hireCfg.name}`
        this.lvLab.string = `${this.adventureModel.avgLevel}`
        this.useLab.string = `${this._hireCfg.hire_times}`

        this.heroItem.updateItemInfo(this._hireCfg.hero)
        let cfg = ConfigManager.getItemById(HeroCfg, this._hireCfg.hero)
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this._hireCfg.career_id)
        this.heroItem.updateGroup(cfg.group[0])
        this.heroItem.updateCareer(careerCfg.career_type)
        this.heroItem.updateStar(AdventureUtils.getHeroStar(this.adventureModel.avgLevel))
    }

    /**英雄预览 */
    previewFunc() {
        gdk.panel.open(PanelId.AdvHireHeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(AdvHireHeroDetailCtrl)
            comp.initHeroInfo(this._hireCfg)
        })
    }
}