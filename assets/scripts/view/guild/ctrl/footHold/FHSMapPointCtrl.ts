import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel, { FhPointInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalFootHoldViewCtrl from './GlobalFootHoldViewCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import { Foothold_bonusCfg, Foothold_towerCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHSMapPointCtrl")
export default class FHSMapPointCtrl extends cc.Component {

    @property(cc.Node)
    occupyNode: cc.Node = null;

    @property(cc.Node)
    occupyColorNodes: cc.Node[] = [];

    @property(cc.Node)
    colorNode: cc.Node = null;

    @property(cc.Node)
    guildNode: cc.Node = null;

    @property(cc.Node)
    typeIcon: cc.Node = null;

    @property(cc.Node)
    markFlag: cc.Node = null;

    @property(cc.Node)
    markFlagTip: cc.Node = null;

    _pointInfo: FhPointInfo

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {

    }

    updatePointInfo(info: FhPointInfo) {
        this.guildNode.active = false
        this.colorNode.active = false
        this.markFlagTip.active = false
        this.markFlag.active = false
        this._pointInfo = info
        if (this._pointInfo.fhPoint && this._pointInfo.fhPoint.playerId > 0) {
            let colorId = FootHoldUtils.getFHGuildColor(this._pointInfo.fhPoint.guildId)
            this.updatePointColor(colorId)
        }

        if (this._pointInfo.type == 0) {
            this.guildNode.active = true
            let bottom = this.guildNode.getChildByName("bottom")
            let frame = this.guildNode.getChildByName("frame")
            let icon = this.guildNode.getChildByName("icon")
            let left = this.guildNode.getChildByName("left")
            let right = this.guildNode.getChildByName("right")
            let guild = FootHoldUtils.findGuildByPos(this._pointInfo.pos.x, this._pointInfo.pos.y)
            if (guild) {
                GlobalUtil.setSpriteIcon(this.node, bottom, GuildUtils.getIcon(guild.bottom))
                GlobalUtil.setSpriteIcon(this.node, frame, GuildUtils.getIcon(guild.frame))
                GlobalUtil.setSpriteIcon(this.node, icon, GuildUtils.getIcon(guild.icon))

                let colorId = FootHoldUtils.getFHGuildColor(guild.id)
                GlobalUtil.setSpriteIcon(this.guildNode, left, `view/guild/texture/smallMap/sMap_kuang_${colorId}`)
                GlobalUtil.setSpriteIcon(this.guildNode, right, `view/guild/texture/smallMap/sMap_kuang_${colorId}`)
            }
        }

        this.typeIcon.active = false
        if (this._pointInfo.bonusType == 0) {
            let path = ""
            let bonusCfg = ConfigManager.getItemByField(Foothold_bonusCfg, "map_type", this.footHoldModel.curMapData.mapType, { world_level: this.footHoldModel.worldLevelIndex })
            if (FootHoldUtils.getBuffTowerType(this._pointInfo.pos.x, this._pointInfo.pos.y) == 1) {
                path = `view/guild/texture/icon/${bonusCfg.resources_skin}`
            } else if (FootHoldUtils.getBuffTowerType(this._pointInfo.pos.x, this._pointInfo.pos.y) == 2) {
                path = `view/guild/texture/icon/${bonusCfg.attribute_skin}`
            } else if (FootHoldUtils.getBuffTowerType(this._pointInfo.pos.x, this._pointInfo.pos.y) == 3) {
                path = `view/guild/texture/icon/${bonusCfg.attenuation_skin}`
            }
            this.typeIcon.active = true
            let tower_cfg = ConfigManager.getItemByField(Foothold_towerCfg, "tower_id", this._pointInfo.bonusId)
            this.typeIcon.scale = 2 * tower_cfg.resources_scale
            GlobalUtil.setSpriteIcon(this.node, this.typeIcon, path)
        }
    }

    /**更新占领者地块颜色 */
    updatePointColor(id) {
        this.occupyNode.active = true
        for (let i = 0; i < this.occupyColorNodes.length; i++) {
            this.occupyColorNodes[i].active = false
        }
        this.occupyColorNodes[id].active = true
    }

    goFunc() {
        let cityDatas = this.footHoldModel.cityDatas
        for (let key in cityDatas) {
            let points = cityDatas[key]
            let x = 0
            let y = 0
            for (let i = 0; i < points.length; i++) {
                x = (points[i] as FhPointInfo).pos.x
                y = (points[i] as FhPointInfo).pos.y
                if (this._pointInfo.pos.x == x && this._pointInfo.pos.y == y) {
                    gdk.panel.setArgs(PanelId.FHSmallMapCityDetail, parseInt(key))
                    gdk.panel.open(PanelId.FHSmallMapCityDetail)
                    return
                }

            }
        }

        gdk.panel.hide(PanelId.FHSmallMap)
        let node = gdk.panel.get(PanelId.GlobalFootHoldView)
        let ctrl = node.getComponent(GlobalFootHoldViewCtrl)

        ctrl.tiledMapScrollView.stopAutoScroll()
        let n = node
        let s = ctrl.tiledMap.tiledMap.getTileSize();
        let h = n.height * n.anchorY;
        let w = n.width * n.anchorX;
        let y = Math.min(0, -this._pointInfo.mapPoint.y + h);
        ctrl.tiledMap.node.setPosition((-this._pointInfo.mapPoint.x - w + s.width * 3) * 0.8, (y - h - s.height) * 0.8);
    }
}