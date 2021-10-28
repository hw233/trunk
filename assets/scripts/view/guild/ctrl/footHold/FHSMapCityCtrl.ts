import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import PanelId from '../../../../configs/ids/PanelId';
import { FhPointInfo } from './FootHoldModel';
import { Foothold_cityCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHSMapCityCtrl")
export default class FHSMapCityCtrl extends cc.Component {

    @property(cc.Node)
    cityNode: cc.Node = null;

    @property(cc.Node)
    cityIcon: cc.Node = null;

    _pointInfo: FhPointInfo

    _cityIndex: number

    onEnable() {

    }

    updateCityInfo(index, colorId) {
        // this._pointInfo = info
        // if (this._pointInfo.fhPoint && this._pointInfo.fhPoint.playerId > 0) {
        //     let colorId = FootHoldUtils.getFHGuildColor(this._pointInfo.fhPoint.guildId)
        //     this._updatePointColor(colorId)
        // }
        this._cityIndex = index
        let cityCfg = ConfigManager.getItemById(Foothold_cityCfg, index)
        let path = `view/guild/texture/smallMap/sMap_city_${colorId}_${cityCfg.level}`
        GlobalUtil.setSpriteIcon(this.node, this.cityNode, path)

        let iconPath = `view/guild/texture/icon/${cityCfg.resources}`
        GlobalUtil.setSpriteIcon(this.node, this.cityIcon, iconPath)
        this.cityIcon.scale = 2 * cityCfg.resources_scale
        //已占领
        if (colorId > 0) {
            GlobalUtil.setGrayState(this.cityIcon, 0)
        } else {
            GlobalUtil.setGrayState(this.cityIcon, 1)
        }
    }


    openCityDetail() {
        gdk.panel.setArgs(PanelId.FHSmallMapCityDetail, this._cityIndex)
        gdk.panel.open(PanelId.FHSmallMapCityDetail)
    }

}