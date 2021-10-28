import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel, { FhPointInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalFootHoldViewCtrl from './GlobalFootHoldViewCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Foothold_bonusCfg, Foothold_pointCfg, TipsCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-17 19:56:55
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/footHold/FHPointListItemCtrl")
export default class FHPointListItemCtrl extends UiListItem {

    @property(cc.Node)
    pointIcon: cc.Node = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Label)
    posLab: cc.Label = null

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    _pointInfo: FhPointInfo

    updateView() {
        this._pointInfo = this.data
        let pointCfg: Foothold_pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", this.footHoldModel.curMapData.mapId, { world_level: this.footHoldModel.worldLevelIndex, point_type: this._pointInfo.type, map_type: this.footHoldModel.curMapData.mapType })
        this.nameLab.string = `${pointCfg.point_type}${gdk.i18n.t("i18n:FOOTHOLD_TIP15")}`
        this.posLab.string = `(${this._pointInfo.pos.x},${this._pointInfo.pos.y})`
        //辐射塔样式
        let path = `view/guild/texture/icon/${pointCfg.resources}`
        if (this._pointInfo.bonusType == 0) {
            let bonusCfg = ConfigManager.getItemByField(Foothold_bonusCfg, "map_type", this.footHoldModel.curMapData.mapType, { world_level: this.footHoldModel.worldLevelIndex })
            if (FootHoldUtils.getBuffTowerType(this._pointInfo.pos.x, this._pointInfo.pos.y) == 1) {
                path = `view/guild/texture/icon/${bonusCfg.resources_skin}`
            } else if (FootHoldUtils.getBuffTowerType(this._pointInfo.pos.x, this._pointInfo.pos.y) == 2) {
                path = `view/guild/texture/icon/${bonusCfg.attribute_skin}`
            } else if (FootHoldUtils.getBuffTowerType(this._pointInfo.pos.x, this._pointInfo.pos.y) == 3) {
                path = `view/guild/texture/icon/${bonusCfg.attenuation_skin}`
            }
            let tipCfg = ConfigManager.getItemById(TipsCfg, this._getTipId())
            this.nameLab.string = `${tipCfg.title1}`
        }
        GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
    }


    goFunc() {
        let node = gdk.panel.get(PanelId.GlobalFootHoldView)
        let ctrl = node.getComponent(GlobalFootHoldViewCtrl)

        let newInfo = FootHoldUtils.findFootHold(this._pointInfo.pos.x, this._pointInfo.pos.y)
        if (newInfo && newInfo.playerId != this.roleModel.id && newInfo.guildId != this.footHoldModel.roleTempGuildId) {
            if (!this.footHoldModel.markFlagPoints[`${this._pointInfo.pos.x}-${this._pointInfo.pos.y}`]) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP16"))
                ctrl.refreshMyPointsList()
                return
            }
        }

        ctrl.tiledMapScrollView.stopAutoScroll()
        let n = node
        let s = ctrl.tiledMap.tiledMap.getTileSize();
        let h = n.height * n.anchorY;
        let w = n.width * n.anchorX;
        let y = Math.min(0, -this._pointInfo.mapPoint.y + h);
        ctrl.tiledMap.node.setPosition((-this._pointInfo.mapPoint.x - w + s.width * 3) * 0.8, (y - h - s.height) * 0.8);
        gdk.Timer.callLater(this, () => {
            ctrl.tiledMap.updateView()
        })
    }


    _getTipId() {
        let type = FootHoldUtils.getBuffTowerType(this._pointInfo.pos.x, this._pointInfo.pos.y)
        let tipId = 39
        switch (type) {
            case 1:
                tipId = 44
                break
            case 2:
                tipId = 40
                break
            case 3:
                tipId = 41
                break
        }
        return tipId
    }
}