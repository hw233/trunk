import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import FHBasePreSlotItemCtrl from './FHBasePreSlotItemCtrl';
import FootHoldModel from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { FhRankInfo } from './GlobalFootHoldViewCtrl';
import { Foothold_baseCfg, Foothold_rankingCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-23 18:20:59
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHBasePreRewardItemCtrl")
export default class FHBasePreRewardItemCtrl extends UiListItem {

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotItem: cc.Prefab = null;

    _cfg: Foothold_baseCfg

    updateView() {
        this._cfg = this.data
        this.lvLab.string = `${this._cfg.level}${gdk.i18n.t("i18n:FOOTHOLD_TIP3")}`
        this.content.removeAllChildren()
        gdk.Timer.callLater(this, () => {
            for (let j = 0; j < this._cfg.rewards.length; j++) {
                let solt = cc.instantiate(this.slotItem)
                solt.scale = 0.8
                let ctrl = solt.getComponent(FHBasePreSlotItemCtrl)
                ctrl.updateSoltItem(this._cfg.level, this._cfg.rewards[j][0], this._cfg.rewards[j][1])
                ctrl.slotItem.itemInfo = {
                    series: 0,
                    itemId: this._cfg.rewards[j][0],
                    itemNum: 1,
                    type: BagUtils.getItemTypeById(this._cfg.rewards[j][0]),
                    extInfo: null
                }
                this.content.addChild(solt)
            }
        })

    }

}