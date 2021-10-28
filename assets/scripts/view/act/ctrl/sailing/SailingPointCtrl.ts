import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import SailingModel, { SailingPointInfo } from '../../model/SailingModel';
import { ItemCfg, Sailing_globalCfg, Sailing_mapCfg } from '../../../../a/config';
import { SailingEventId } from './SailingEventId';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/sailing/SailingPointCtrl")
export default class SailingPointCtrl extends cc.Component {

    @property(cc.Node)
    pointIcon: cc.Node = null;

    _info: SailingPointInfo

    get sailingModel(): SailingModel { return ModelManager.get(SailingModel); }

    initInfo(info: SailingPointInfo) {
        this._info = info
        //GlobalUtil.setSpriteIcon(this.node, this.boxIcon, `view/guild/texture/icon/${this._info.cfg.skin[0]}`)
    }

    clickFunc() {
        if (this._info.type > 0) {
            let isGet = Boolean(Math.pow(2, this._info.type - 1) & this.sailingModel.sailingInfo.mapRewarded)
            if (isGet) {
                gdk.gui.showMessage("该岛屿已探索")
                return
            }
            gdk.panel.setArgs(PanelId.SailingCheckView, this._info.cfg)
            gdk.panel.open(PanelId.SailingCheckView)
        }
    }
}