import BagUtils from '../../../../common/utils/BagUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Guildboss_rankingCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-23 11:33:24 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/boss/GuildRankRewardItemCtrl")
export default class GuildRankRewardItemCtrl extends UiListItem {
    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    cfg: Guildboss_rankingCfg;
    updateView() {
        this.cfg = this.data;
        this.rankLab.string = `${gdk.i18n.t("i18n:GUILDBOSS_TIP14")}${this.cfg.rank[0]}` + `${this.cfg.rank[0] == this.cfg.rank[1] ? gdk.i18n.t("i18n:GUILDBOSS_TIP15") : `-${this.cfg.rank[1]}${gdk.i18n.t("i18n:GUILDBOSS_TIP15")}`}`;
        this.content.removeAllChildren();
        this.cfg.rank_reward.forEach(reward => {
            let slot = cc.instantiate(this.slotPrefab);
            slot.parent = this.content;
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(reward[0], reward[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: reward[0],
                itemNum: reward[1],
                type: BagUtils.getItemTypeById(reward[0]),
                extInfo: null
            };
        });

        this.scrollView.enabled = this.cfg.rank_reward.length > 5;
    }
}
