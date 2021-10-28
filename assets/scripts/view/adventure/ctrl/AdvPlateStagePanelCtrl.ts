import AdventureModel from '../model/AdventureModel';
import AdventureUtils from '../utils/AdventureUtils';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { AdventureCfg, Copy_stageCfg } from '../../../a/config';
/**
 * @Description: 探险事件--关卡挑战
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 12:08:17
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdvPlateStagePanelCtrl")
export default class AdvPlateStagePanelCtrl extends gdk.BasePanel {

    @property(cc.Label)
    stageLab: cc.Label = null

    @property(cc.Label)
    powerLab: cc.Label = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    soltItem: cc.Prefab = null

    @property(cc.Node)
    difficultNode: cc.Node = null

    _advCfg: AdventureCfg
    _stageCfg: Copy_stageCfg

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }

    onEnable() {
        this._updateViewInfo()
    }

    onDisable() {

    }

    _updateViewInfo() {
        this._advCfg = ConfigManager.getItemByField(AdventureCfg, "difficulty", this.adventureModel.difficulty, { type: AdventureUtils.actRewardType, layer_id: this.adventureModel.layerId, plate: this.adventureModel.selectIndex })
        this._stageCfg = ConfigManager.getItemById(Copy_stageCfg, this._advCfg.event_id)
        this.stageLab.string = `${this._stageCfg.name}`
        this.powerLab.string = `${this._stageCfg.power}`
        let items = this._advCfg.rewards
        for (let i = 0; i < items.length; i++) {
            let showItem = cc.instantiate(this.soltItem)
            let ctrl = showItem.getComponent(UiSlotItem)
            ctrl.updateItemInfo(items[i][0], items[i][1])
            ctrl.itemInfo = {
                series: null,
                itemId: items[i][0],
                itemNum: items[i][1],
                type: BagUtils.getItemTypeById(items[i][0]),
                extInfo: null,
            }
            this.content.addChild(showItem)
        }

        if (this.adventureModel.difficulty == 4) {
            this.difficultNode.active = true
        }
    }

    fightFunc() {
        if (this.adventureModel.blood <= 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:ADVENTURE_TIP17"))
            return
        }
        gdk.panel.setArgs(PanelId.AdventureSetUpHeroSelector, [true])
        gdk.panel.open(PanelId.AdventureSetUpHeroSelector);
    }

    /* 排行*/
    openRank() {
        gdk.panel.open(PanelId.AdventureRankView)
    }
}