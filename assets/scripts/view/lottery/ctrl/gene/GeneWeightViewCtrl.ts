import ConfigManager from '../../../../common/managers/ConfigManager';
import GeneWeightItemCtrl from './GeneWeightItemCtrl';
import { Gene_poolCfg, Item_drop_groupCfg, Item_dropCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-14 17:59:19 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/GeneWeightViewCtrl')
export default class GeneWeightViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    poolId: number;
    onEnable() {
        this.poolId = this.args[0];
        let cfg = ConfigManager.getItemById(Gene_poolCfg, this.poolId);
        this.content.children.forEach((child, idx) => {
            let dropGroup = cfg[`drop_${idx + 1}`]
            if (dropGroup) {
                child.active = true;
                let tips = child.getChildByName('tips').getComponent(cc.Label);
                let content = child.getChildByName('content');
                let groupWeight = cfg[`weight_${idx + 1}`];
                tips.string = `${idx == 0 ? `${gdk.i18n.t("i18n:LOTTERY_TIP5")}` : `${gdk.i18n.t("i18n:LOTTERY_TIP12")}`}(${gdk.i18n.t("i18n:LOTTERY_TIP13")}${groupWeight / 1000}%)`;
                content.removeAllChildren();
                let dropCfgs = ConfigManager.getItemsByField(Item_dropCfg, 'drop_id', dropGroup);
                dropCfgs.forEach(drop => {
                    let groupCfgs = ConfigManager.getItemsByField(Item_drop_groupCfg, 'group_id', drop.group_id);
                    // groupCfgs.sort((a, b) => { return b.odds - a.odds; });
                    let total = 0;
                    groupCfgs.forEach(cfg => {
                        if (cfg.weight <= 0 || cfg.item_num <= 0) {
                            // 忽略数量或概率小于0，则不会掉落此物品
                            return;
                        }
                        total += cfg.weight;
                    });
                    let weight = groupWeight / 1000;
                    groupCfgs.forEach(cfg => {
                        if (cfg.weight <= 0 || cfg.item_num <= 0) {
                            // 忽略数量或概率小于0，则不会掉落此物品
                            return;
                        }
                        let item = cc.instantiate(this.itemPrefab);
                        item.parent = content;
                        let ctrl = item.getComponent(GeneWeightItemCtrl);
                        ctrl.updateView(cfg, weight * drop.probability / 100 * cfg.weight / total);
                    });
                });
            }
            else {
                child.active = false;
            }
        });
    }

    onDisable() {
    }
}
