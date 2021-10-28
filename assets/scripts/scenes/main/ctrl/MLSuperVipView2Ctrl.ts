import ActivityUtils from '../../../common/utils/ActivityUtils';
import ActUtil from '../../../view/act/util/ActUtil';
import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiSlotItem from '../../../common/widgets/UiSlotItem';

/**
 * 主界面右侧图标按钮列表
 * @Author: yaozu.hu
 * @Date: 2021-08-11 13:45:59
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-06 11:08:54
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MLSuperVipView2Ctrl")
export default class MLSuperVipView2Ctrl extends gdk.BasePanel {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    actBtnNode: cc.Node = null;
    @property(cc.Node)
    redNode: cc.Node = null;

    onEnable() {
        let cfg = ActivityUtils.getPlatformConfig(12);
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
        let show = ActUtil.ifActOpen(127);
        this.actBtnNode.active = show;
        this.redNode.stopAllActions();
        if (show) {
            let actType = ActUtil.getActRewardType(127);
            let type = GlobalUtil.getLocal('mlSuperVipActType2', true);
            if (!type || type != actType) {
                this.redNode.active = true;
                this.redNode.setScale(1);
                this.redNode.runAction(cc.repeatForever(
                    cc.sequence(
                        cc.scaleTo(.5, 1.3, 1.3),
                        cc.scaleTo(.5, 1, 1),
                    )
                ))
            } else {
                this.redNode.active = false;
            }
        } else {
            this.redNode.active = false;
        }

    }

    onDisable() {
        this.content.removeAllChildren();
    }

    // onAddQQBtnClick() {
    //     gdk.panel.open(PanelId.SuperVipCopyView);
    // }

    onTipBtnClick() {
        if (this.redNode.active) {
            this.redNode.active = false;
            this.redNode.setScale(1);
            this.redNode.stopAllActions();
            let actType = ActUtil.getActRewardType(127);
            GlobalUtil.setLocal('mlSuperVipActType2', actType, true);
        }
    }
}
