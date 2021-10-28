import ActivityUtils from '../../../common/utils/ActivityUtils';
import BagUtils from '../../../common/utils/BagUtils';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-22 21:03:23 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/SuperVipViewCtrl")
export default class SuperVipViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    onEnable() {
        let cfg = ActivityUtils.getPlatformConfig(6);
        this.content.removeAllChildren();
        cfg.reward.forEach(r => {
            let slot = cc.instantiate(this.slotPrefab);
            slot.parent = this.content;
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(r[0], r[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: r[0],
                itemNum: r[1],
                type: BagUtils.getItemTypeById(r[0]),
                extInfo: null
            };
        })
    }

    onDisable() {
        this.content.removeAllChildren();
    }

    onAddQQBtnClick() {
        gdk.panel.open(PanelId.SuperVipCopyView);
    }
}
