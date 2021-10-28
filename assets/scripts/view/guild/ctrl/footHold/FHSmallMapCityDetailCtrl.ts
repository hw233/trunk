import ConfigManager from '../../../../common/managers/ConfigManager';
import FHSMapBigPointCtrl from './FHSMapBigPointCtrl';
import FootHoldModel, { FhPointInfo } from './FootHoldModel';
import ModelManager from '../../../../common/managers/ModelManager';
import { Foothold_cityCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHSmallMapCityDetailCtrl")
export default class FHSmallMapCityDetailCtrl extends gdk.BasePanel {

    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Label)
    socreLab: cc.Label = null;

    @property(cc.Node)
    city1Node: cc.Node = null;

    @property(cc.Node)
    city2Node: cc.Node = null;

    @property(cc.Node)
    city3Node: cc.Node = null;

    @property(cc.Node)
    city4Node: cc.Node = null;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    _cityNodes: cc.Node

    onEnable() {
        let args = this.args
        let cityIndex = args[0]
        let cityCfg = ConfigManager.getItemById(Foothold_cityCfg, cityIndex)

        this.titleLab.string = `${cityCfg.level}${gdk.i18n.t("i18n:FOOTHOLD_TIP21")}`
        this.socreLab.string = `${cityCfg.score}${gdk.i18n.t("i18n:FOOTHOLD_TIP22")}`

        this.city2Node.active = false
        this.city3Node.active = false
        this.city1Node.active = false
        this.city4Node.active = false

        if (cityCfg.level == 1) {
            this.city1Node.active = true
            this._cityNodes = this.city1Node
        } else if (cityCfg.level == 2) {
            this.city2Node.active = true
            this._cityNodes = this.city2Node
        } else if (cityCfg.level == 3) {
            this.city3Node.active = true
            this._cityNodes = this.city3Node
        } else if (cityCfg.level == 4) {
            this.city4Node.active = true
            this._cityNodes = this.city4Node
        }

        let cityDatas = this.footHoldModel.cityDatas
        let points = cityDatas[cityIndex]
        for (let i = 0; i < points.length; i++) {
            let info: FhPointInfo = this.footHoldModel.warPoints[`${points[i].pos.x}-${points[i].pos.y}`]
            let pointItem = this._cityNodes.children[i]
            let ctrl = pointItem.getComponent(FHSMapBigPointCtrl)
            ctrl.updatePointInfo(info)
        }
    }
}