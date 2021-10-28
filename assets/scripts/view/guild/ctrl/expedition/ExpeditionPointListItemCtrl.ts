import ConfigManager from '../../../../common/managers/ConfigManager';
import CreateRoleCtrl from '../../../../scenes/main/ctrl/CreateRoleCtrl';
import ExpeditionLayerViewCtrl from './ExpeditionLayerViewCtrl';
import ExpeditionModel, { ExpeditionPointInfo } from './ExpeditionModel';
import ExpeditionProduceItemCtrl from './ExpeditionProduceItemCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Expedition_globalCfg, Expedition_mapCfg, Expedition_pointCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-28 10:12:37
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/expedition/ExpeditionPointListItemCtrl")
export default class ExpeditionPointListItemCtrl extends UiListItem {

    @property(cc.Node)
    pointIcon: cc.Node = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Node)
    produceLayout: cc.Node = null;

    @property(cc.Prefab)
    produceItem: cc.Prefab = null;

    _pointInfo: icmsg.ExpeditionOccupiedPoint
    _pointCfg: Expedition_pointCfg

    get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    updateView() {
        this._pointInfo = this.data
        this._pointCfg = ConfigManager.getItemByField(Expedition_pointCfg, "index", this._pointInfo.index, { type: this.expeditionModel.activityType })
        this.nameLab.string = `${this._pointCfg.name}`

        if (this._pointCfg.skin_type == 1) {
            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/icon/${this._pointCfg.point_skin[0]}`)
            this.pointIcon.scale = 0.3 * this._pointCfg.point_skin[1] / 100
        } else {
            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/icon/${this._pointCfg.occupation_skin[0]}`)
            this.pointIcon.scale = 0.3 * this._pointCfg.occupation_skin[1] / 100
        }

        let production_time = ConfigManager.getItemById(Expedition_globalCfg, "production_time").value[0]
        let times = 3600 / production_time

        this.produceLayout.removeAllChildren()
        let rewards = this._pointCfg.output_reward
        rewards.forEach(element => {
            let item = cc.instantiate(this.produceItem)
            this.produceLayout.addChild(item)
            let ctrl = item.getComponent(ExpeditionProduceItemCtrl)
            ctrl.updateViewInfo(element[0], `${element[1] * times}${gdk.i18n.t("i18n:EXPEDITION_TIP13")}`)
        });

    }

    goFunc() {
        let node = gdk.panel.get(PanelId.ExpeditionLayerView)
        let curMap = ConfigManager.getItemByField(Expedition_mapCfg, "map_id", this._pointCfg.map_id)
        if (node) {
            if (curMap.map_id == this.expeditionModel.curMapCfg.map_id) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:EXPEDITION_TIP18"))
                return
            }
            this.expeditionModel.curMapCfg = curMap
            let ctrl = node.getComponent(ExpeditionLayerViewCtrl)
            ctrl.refreshMapView()
        } else {
            this.expeditionModel.curMapCfg = curMap
            JumpUtils.openPanel({
                panelId: PanelId.ExpeditionLayerView,
                currId: PanelId.ExpeditionMainView,
            });
        }
    }
}