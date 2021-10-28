import ConfigManager from '../../../../common/managers/ConfigManager';
import FHProduceItem2Ctrl from './FHProduceItem2Ctrl';
import FootHoldModel from './FootHoldModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Foothold_pointCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-23 18:32:22
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/footHold/FHProduceItemCtrl")
export default class FHProduceItemCtrl extends UiListItem {

    @property(cc.Node)
    pointIcon: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Label)
    descLab: cc.Label = null

    @property(cc.Node)
    produceItems: cc.Node[] = []

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }


    updateView() {
        let pointCfg: Foothold_pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", this.footHoldModel.curMapData.mapId, { world_level: this.footHoldModel.worldLevelIndex, point_type: this.data.type, map_type: this.footHoldModel.curMapData.mapType })
        let path = `view/guild/texture/icon/${pointCfg.resources}`
        GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
        this.lvLab.string = `${this.data.type}${gdk.i18n.t("i18n:FOOTHOLD_TIP3")}`
        this.descLab.string = `${pointCfg.describe}`

        for (let i = 0; i < this.produceItems.length; i++) {
            this.produceItems[i].active = false
            if (this.data.goods[i]) {
                this.produceItems[i].active = true
                let ctrl = this.produceItems[i].getComponent(FHProduceItem2Ctrl)
                ctrl.updateViewInfo(this.data.goods[i].typeId, this.data.goods[i].num)
            }
        }
    }
}