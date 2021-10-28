import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Siege_rankingCfg } from '../../../../a/config';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-28 16:50:26
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/siege/SiegeRankRewardItemCtrl")
export default class SiegeRankRewardItemCtrl extends UiListItem {
    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    updateView() {
        let cfg: Siege_rankingCfg = this.data;
        if (cfg.rank[0] == cfg.rank[1]) {
            this.rankLab.string = StringUtils.format(gdk.i18n.t("i18n:ADVENTURE_TIP45"), cfg.rank[0])//'第' + cfg.rank + '名';
        } else {
            this.rankLab.string = `${cfg.rank[0]}-${cfg.rank[1]}${gdk.i18n.t("i18n:ADVENTURE_TIP12")}`;
        }
        this.content.removeAllChildren();
        cfg.rank_rewards.forEach(item => {
            let slot = cc.instantiate(this.slotPrefab);
            let ctrl = slot.getComponent(UiSlotItem);
            slot.setScale(.77, .77);
            slot.parent = this.content;
            ctrl.updateItemInfo(item[0], item[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: item[0],
                itemNum: item[1],
                type: BagUtils.getItemTypeById(item[0]),
                extInfo: null
            };
        });
        this.content.getComponent(cc.Layout).updateLayout();
        if (cfg.rank_rewards.length >= 5) {
            this.scrollView.enabled = true;
            this.scrollView.node.width = 410;
        }
        else {
            this.scrollView.enabled = false;
            this.scrollView.node.width = this.content.width;
        }
    }
}