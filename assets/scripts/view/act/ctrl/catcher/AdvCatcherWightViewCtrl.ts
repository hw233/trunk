import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Luckydraw_summon_tipsCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-19 15:21:19 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/catcher/AdvCatcherWightViewCtrl")
export default class AdvCatcherWightViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    onEnable() {
        let rewardType = ActUtil.getCfgByActId(56).reward_type;
        let cfgs = ConfigManager.getItemsByField(Luckydraw_summon_tipsCfg, 'reward_type', rewardType);
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
            weightLab.string = cfg.weight + '';
        });
    }

    onDisable() {
    }
}
