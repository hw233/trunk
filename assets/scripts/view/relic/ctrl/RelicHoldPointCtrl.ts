import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RelicModel, { RelicMapType, RelicPointInfo } from '../model/RelicModel';
import { Relic_mapCfg, Relic_pointCfg } from '../../../a/config';
import { RelicEventId } from '../enum/RelicEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-28 10:25:44 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicHoldPointCtrl")
export default class RelicHoldPointCtrl extends cc.Component {
    @property(cc.Node)
    colorNode: cc.Node = null;

    get RelicModel(): RelicModel { return ModelManager.get(RelicModel); }

    pointInfo: RelicPointInfo;
    mapType: RelicMapType;
    isClick: boolean = true;
    onEnable() {
        gdk.e.on(RelicEventId.RELIC_BROAD_CAST_POINT, this._onMapCityInfoChange, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
    }

    visibleState() {
        this.mapType = ConfigManager.getItemById(Relic_mapCfg, this.RelicModel.mapId).mapType;
        let cityData = this.RelicModel.cityDataMap[this.mapType][this.pointInfo.ownerCity] || null;
        this.isClick = this.pointInfo.numType <= this.RelicModel.mapNumId || !!cityData;
        if (!this.isClick) {
            GlobalUtil.setSpriteIcon(this.node, this.colorNode, `view/guild/texture/footHold/${this.mapType == 1 ? 'gh_zhezhao' : 'gh_zhezhao2'}`);
        }
    }

    initInfo(info: RelicPointInfo) {
        this.pointInfo = info;
        this.updateColor();
        this.visibleState();
    }

    onClick() {
        if (this.isClick) {
            gdk.panel.setArgs(PanelId.RelicPointDetailsView, this.pointInfo.ownerCity);
            gdk.panel.open(PanelId.RelicPointDetailsView);
        }
    }

    updateColor() {
        let color = ConfigManager.getItemById(Relic_pointCfg, this.RelicModel.cityMap[this.pointInfo.ownerCity].pointType).color;
        if (color > 0) {
            this.colorNode.active = true;
            GlobalUtil.setSpriteIcon(this.node, this.colorNode, `view/guild/texture/icon/footHold_color_${color}`);
        }
        else {
            this.colorNode.active = false;
        }
    }

    _onMapCityInfoChange(e) {
        let [mapType, cityId] = e.data;
        if (this.mapType == mapType && this.pointInfo.ownerCity == cityId) {
            this.updateColor();
            this.visibleState();
        }
    }
}
