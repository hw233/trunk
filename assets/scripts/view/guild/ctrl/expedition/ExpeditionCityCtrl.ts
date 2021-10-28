import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionModel, { ExpeditionCityInfo } from './ExpeditionModel';
import ExpeditionUtils from './ExpeditionUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import { BagType } from '../../../../common/models/BagModel';
import { Expedition_mapCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionCityCtrl")
export default class ExpeditionCityCtrl extends cc.Component {

    @property(cc.Node)
    cityIcon: cc.Node = null;

    @property(cc.Node)
    monsterIcon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    proNode: cc.Node = null;

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null;

    @property(cc.Label)
    proLab: cc.Label = null;

    @property(cc.Label)
    tipLab: cc.Label = null;

    _info: ExpeditionCityInfo

    get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    initInfo(info: ExpeditionCityInfo) {
        this._info = info
        this.cityIcon.scale = 2 * this._info.cfg.skin[1] / 100
        GlobalUtil.setSpriteIcon(this.node, this.cityIcon, `view/guild/texture/icon/${this._info.cfg.skin[0]}`)
        this.nameLab.string = `${this._info.cfg.name}`
        GlobalUtil.setSpriteIcon(this.node, this.monsterIcon, `icon/monster/${this._info.cfg.head}`)
        this.nameLab.node.parent.scale = 2 * this._info.cfg.skin[1] / 100

        let isOpen = ExpeditionUtils.isMapOpen(this._info.cfg.map_id)
        GlobalUtil.setGrayState(this.cityIcon, isOpen ? 0 : 1)
        GlobalUtil.setAllNodeGray(this.nameLab.node.parent, isOpen ? 0 : 1)

        this.tipLab.node.active = !isOpen
        if (this.tipLab.node.active) {
            let preCfg = ConfigManager.getItemByField(Expedition_mapCfg, "map_id", this._info.cfg.map_id - 1)
            this.tipLab.string = `通关${preCfg.name}解锁`
        }

        this.proNode.active = isOpen
        if (isOpen) {
            let totalProcess = 0
            let parameter = this._info.cfg.parameter
            parameter.forEach(element => {
                totalProcess += element[1]
            });
            let mapInfo = ExpeditionUtils.getMapInfo(this._info.cfg.map_id)
            if (mapInfo) {
                this.proBar.progress = mapInfo.process / totalProcess
                if (mapInfo.process / totalProcess > 1) {
                    this.proLab.string = `${100}%`
                } else {
                    this.proLab.string = `${(mapInfo.process / totalProcess * 100).toFixed(1)}%`
                }
            }
        }
    }

    /**绑定引导按钮id */
    bindGuide() {
        GuideUtil.bindGuideNode(22000, this.node)
    }

    clickFunc() {
        this.expeditionModel.curMapCfg = this._info.cfg
        JumpUtils.openPanel({
            panelId: PanelId.ExpeditionLayerView,
            currId: PanelId.ExpeditionMainView,
        });
    }
}