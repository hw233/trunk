import FootHoldModel, { FhPointInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalFootHoldViewCtrl from './GlobalFootHoldViewCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHSMapBigPointCtrl")
export default class FHSMapBigPointCtrl extends cc.Component {

    @property(cc.Node)
    occupyColorNodes: cc.Node[] = [];

    @property(cc.Node)
    guildNode: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Label)
    noneLab: cc.Label = null

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    _pointInfo: FhPointInfo

    updatePointInfo(info: FhPointInfo) {
        this._pointInfo = info
        if (this._pointInfo.fhPoint && this._pointInfo.fhPoint.playerId > 0) {

            this.nameLab.node.active = true
            this.guildNode.active = true
            this.noneLab.node.active = false

            let colorId = FootHoldUtils.getFHGuildColor(this._pointInfo.fhPoint.guildId)
            this._updatePointColor(colorId)

            let bottom = this.guildNode.getChildByName("bottom")
            let frame = this.guildNode.getChildByName("frame")
            let icon = this.guildNode.getChildByName("icon")
            let guild = FootHoldUtils.findGuild(this._pointInfo.fhPoint.guildId)
            if (guild) {
                GlobalUtil.setSpriteIcon(this.node, bottom, GuildUtils.getIcon(guild.bottom))
                GlobalUtil.setSpriteIcon(this.node, frame, GuildUtils.getIcon(guild.frame))
                GlobalUtil.setSpriteIcon(this.node, icon, GuildUtils.getIcon(guild.icon))
            }

            let player = FootHoldUtils.findPlayer(this._pointInfo.fhPoint.playerId)
            this.nameLab.string = `${player.name}`
            if (this._pointInfo.fhPoint.guildId != this.footHoldModel.roleTempGuildId) {
                this.nameLab.node.color = cc.color("#ff6464")
                this.nameLab.getComponent(cc.LabelOutline).color = cc.color("#441500")
            } else {
                this.nameLab.node.color = cc.color("#50FDFF")
                this.nameLab.getComponent(cc.LabelOutline).color = cc.color("#294161")
            }
        } else {
            this._updatePointColor(0)
            this.nameLab.node.active = false
            this.guildNode.active = false
            this.noneLab.node.active = true
        }
    }

    /**更新地块颜色 */
    _updatePointColor(id) {
        for (let i = 0; i < this.occupyColorNodes.length; i++) {
            this.occupyColorNodes[i].active = false
        }
        this.occupyColorNodes[id].active = true
    }


    goFunc() {
        gdk.panel.hide(PanelId.FHSmallMap)
        gdk.panel.hide(PanelId.FHSmallMapCityDetail)

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