import BagUtils from '../../../common/utils/BagUtils';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Combine_personal_rankCfg, Combine_topupCfg } from '../../../a/config';

/**
 * @Description: 合服狂欢 合服排行
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-07 14:00:31
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/combine/CombinRankRewardItemCtrl")
export default class CombinRankRewardItemCtrl extends UiListItem {
    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    updateView() {
        let cfg: Combine_personal_rankCfg = this.data;
        if (cfg.interval[0] == cfg.interval[1]) {
            this.rankLab.string = StringUtils.format(gdk.i18n.t("i18n:ADVENTURE_TIP45"), cfg.interval[0])//'第' + cfg.rank + '名';
        }
        else {
            this.rankLab.string = `${cfg.interval[0]}-${cfg.interval[1]}${gdk.i18n.t("i18n:ADVENTURE_TIP12")}`;
        }

        this.content.removeAllChildren();
        cfg.rewards.forEach(item => {
            let slot = cc.instantiate(this.slotPrefab);
            let ctrl = slot.getComponent(UiSlotItem);
            slot.setScale(.6, .6);
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
        if (cfg.rewards.length >= 5) {
            this.scrollView.enabled = true;
            this.scrollView.node.width = 410;
        }
        else {
            this.scrollView.enabled = false;
            this.scrollView.node.width = this.content.width;
        }
    }
}
