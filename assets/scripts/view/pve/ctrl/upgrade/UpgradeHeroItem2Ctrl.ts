import CareerIconItemCtrl from '../../../role/ctrl2/main/career/CareerIconItemCtrl';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Common_strongerCfg } from '../../../../a/config';

/**
 * @Author: luoyong
 * @Description:
 * @Date: 2020-07-10 11:42:28
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 12:27:17
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/upgrade/UpgradeHeroItem2Ctrl")
export default class UpgradeHeroItem2Ctrl extends cc.Component {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    careerIconItem: cc.Node = null

    @property(cc.Node)
    tip: cc.Node = null


    _heroId: number = 0

    /* 更新格子数据*/
    updateViewInfo(heroInfo: icmsg.HeroInfo) {
        let ctrl = this.slot.getComponent(UiSlotItem)
        ctrl.updateItemInfo(heroInfo.typeId)
        ctrl.updateNumLab(`${heroInfo.level}`)
        ctrl.updateStar(heroInfo.star)
        this._updateCareerInfo(heroInfo)
        this._heroId = heroInfo.heroId
        let copyModel = ModelManager.get(CopyModel)
        let stageId = copyModel.latelyStageId

        let strongerCfg = ConfigManager.getItemByField(Common_strongerCfg, "index", stageId)
        this.tip.active = false
        if (strongerCfg && (heroInfo.level < strongerCfg.level)) {
            this.tip.active = true
        }
    }

    _updateCareerInfo(heroInfo: icmsg.HeroInfo) {
        let ctrl = this.careerIconItem.getComponent(CareerIconItemCtrl)
        ctrl.updateView(heroInfo.careerId, GlobalUtil.getHeroCareerLv(heroInfo), heroInfo.soldierId)
    }

    oepnRolePanel() {
        gdk.panel.hide(PanelId.PveSceneFailPanel)
        JumpUtils.openEquipPanelById(this._heroId, [0])
    }

}