import ConfigManager from '../../../../common/managers/ConfigManager';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Luckydraw_turntable_tipsCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-19 15:21:19 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/turntable/TurntableWeightViewCtrl")
export default class TurntableWeightViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    onEnable() {
        let type = this.args[0];
        let cfgs = ConfigManager.getItemsByField(Luckydraw_turntable_tipsCfg, 'type', type + 1);
        this.title = [gdk.i18n.t("i18n:TURNTABLE_TIP6"), gdk.i18n.t("i18n:TURNTABLE_TIP7")][type];
        this.content.removeAllChildren();
        cfgs.forEach(cfg => {
            let item = cc.instantiate(this.itemPrefab);
            item.parent = this.content;
            let nameLab = item.getChildByName('nameLab').getComponent(cc.Label);
            let weightLab = item.getChildByName('weightLab').getComponent(cc.Label);
            let slot = item.getChildByName('UiSlotItem').getComponent(UiSlotItem);
            slot.updateItemInfo(cfg.item_icon);
            slot.qualityEffect(null);
            nameLab.string = cfg.item;
            weightLab.string = `${cfg.weight}`;
        });
    }

    onDisable() {
    }
}
