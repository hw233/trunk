import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import BagUtils from '../../../../common/utils/BagUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activity_awards_showCfg, Twist_eggCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/luckyTwist/LuckyTwistEggUiSlotItemCtrl")
export default class LuckyTwistEggUiSlotItemCtrl extends cc.Component {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    wishNode: cc.Node = null;

    @property(UiSlotItem)
    wishItem: UiSlotItem = null;

    cfg: Twist_eggCfg;
    _wishItemId = 0
    _wishItemNum = 0

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    onEnable() {
        gdk.e.on(ActivityEventId.ACTIVITY_TWISTED_ANI_END, this._onTwistedAniEnd, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
    }

    updateState(cfg: Twist_eggCfg) {
        this.cfg = cfg
        if (cfg.wish && cfg.wish.length > 0) {
            this.wishNode.active = true
            this.wishItem.node.active = false
            this.slotItem.node.active = false
            let wishIds = this.actModel.luckyTwistEggWished
            let wishReward = [] //id,num
            for (let i = 0; i < wishIds.length; i++) {
                if (wishIds[i] > 0) {
                    wishReward = cfg.wish[wishIds[i] - 1]
                    break
                }
            }
            if (wishReward.length > 0) {
                this.wishItem.node.active = true
                this._wishItemId = wishReward[0]
                this._wishItemNum = wishReward[1]
                this.wishItem.updateItemInfo(wishReward[0], wishReward[1])
            }
        } else {
            this.wishNode.active = false
            this.slotItem.node.active = true

            this.slotItem.updateItemInfo(cfg.item_id[0], cfg.item_id[1])
            this.slotItem.itemInfo = {
                series: null,
                itemId: cfg.item_id[0],
                itemNum: cfg.item_id[1],
                type: BagUtils.getItemTypeById(cfg.item_id[0]),
                extInfo: null
            }
        }

        this.mask.active = ActivityUtils.getTwistEggRewardState(cfg.number);
        if (this.mask.active) {
            this.slotItem.isEffect = false;
            this.slotItem.qualityEffect(null);
        }
    }

    _onTwistedAniEnd() {
        this.updateState(this.cfg);
    }

    onWishClick() {
        if (this.mask.active) {
            this.wishItem.itemInfo = {
                series: null,
                itemId: this._wishItemId,
                itemNum: this._wishItemNum,
                type: BagUtils.getItemTypeById(this._wishItemId),
                extInfo: null
            }
            return
        }
        gdk.panel.setArgs(PanelId.LuckyTwistEggSelectView, this.cfg, this._wishItemId)
        gdk.panel.open(PanelId.LuckyTwistEggSelectView)
    }

}
