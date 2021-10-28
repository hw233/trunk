import BagModel, { BagItem, BagType } from '../../../../common/models/BagModel';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Item_equipCfg, Item_rubyCfg, ItemCfg } from '../../../../a/config';
import { RolePoolKeys } from '../../../role/enum/RolePoolKeys';

const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/scene/pve/view/PveRewardItemCtrl")
export default class PveRewardItemCtrl extends UiListItem {

    @property(UiSlotItem)
    bagSlot: UiSlotItem = null

    @property(cc.Node)
    lockNode: cc.Node = null
    @property(cc.Node)
    firstReward: cc.Node = null

    @property(cc.Node)
    pzgjinNode: cc.Node = null;
    @property(cc.Node)
    pzgziNode: cc.Node = null;
    @property(cc.Node)
    pzgtyNode: cc.Node = null;

    @property(cc.Animation)
    pzgjin: cc.Animation = null;
    @property(cc.Animation)
    pzgzi: cc.Animation = null;
    @property(cc.Animation)
    pzgty: cc.Animation = null;
    @property(cc.Animation)
    Item_cx: cc.Animation = null;
    @property(sp.Skeleton)
    chipEffect: sp.Skeleton = null;


    model: BagModel = null;
    itemData: BagItem = null
    baseConfig: any = null
    oldItemData: BagItem = null

    cxEffect = true; //是否播放出现特效
    showCommonEffect = false; //是否播放通用特效
    _poolKey: string = RolePoolKeys.UI_SLOT_STAR;
    animationState: cc.AnimationState;

    start() {
        this.model = ModelManager.get(BagModel);
        // this.onSelectChanged.on(this._onItemSelected, this)
    }

    /* 更新格子数据*/
    updateView() {
        this.itemData = this.data.info
        this.lockNode.active = false
        this.firstReward.active = false
        this.pzgjinNode.active = false;
        this.pzgziNode.active = false;
        this.pzgtyNode.active = false;
        this.chipEffect.node.active = false
        if (this.itemData) {
            let itemId = this.itemData.itemId
            this.bagSlot.updateItemInfo(itemId, this.itemData.itemNum)
            if (this.itemData.type == BagType.EQUIP) {
                this._updateEquipData()
            } else if (this.itemData.type == BagType.JEWEL) {
                let cfg = ConfigManager.getItemById(Item_rubyCfg, itemId)
                this.bagSlot.updateStar(cfg.level)
            }
        } else {
            this.bagSlot.updateItemInfo(0)
        }
        if (this.data.cxEffect != null && !this.data.cxEffect) {
            this.cxEffect = this.data.cxEffect
        }
        if (this.data.delayShow) {
            this.node.active = false;
            this.data.delayShow = false;
            gdk.Timer.once(0.1 * this.data.index * 500, this, () => {
                this.node.active = true;
                //播放出现动画
                this.showItemEffect();
            })
        } else {
            this.node.active = true;
            this.showItemEffect();
        }
        if (this.data.showCommonEffect) {
            this.showCommonEffect = this.data.showCommonEffect
        }
        if (this.data.isFirst) {
            this.firstReward.active = true;
        } else {
            this.firstReward.active = false;
        }

        if (this.data.showItemInfo) {
            this.bagSlot.itemInfo = {
                itemId: this.itemData.itemId,
                series: this.itemData.itemId,
                type: BagUtils.getItemTypeById(this.itemData.itemId),
                itemNum: 1,
                extInfo: this.itemData.extInfo,
            };
        }

    }

    showItemEffect() {
        //播放出现动画
        if (this.data.effect) {
            if (this.cxEffect) {
                this.data.cxEffect = false;
                this.Item_cx.node.active = true;
                this.Item_cx.on('finished', this.showItemPz, this);
                this.animationState = this.Item_cx.play();
            } else {
                this.Item_cx.node.active = false;
                this.showItemPz()
            }
        } else {
            this.Item_cx.node.active = false;
        }
    }

    //设置品质动画
    showItemPz() {
        //播放品质特效
        let itemConfig = <any>BagUtils.getConfigById(this.itemData.itemId)
        if (itemConfig) {

            //碎片不要播放品质特效，本身就有特效了
            if (itemConfig instanceof ItemCfg && itemConfig.style && itemConfig.style == 1) {
                return
            }

            if (itemConfig.color == 3) {
                this.pzgziNode.active = true;
                this.pzgzi.play();
            } else if (itemConfig.color == 4) {
                this.pzgjinNode.active = true;
                this.pzgjin.play();
            } else {
                if (this.showCommonEffect) {
                    this.pzgtyNode.active = true;
                    this.pzgty.play();
                    return;
                }
                if (BagUtils.getItemTypeById(this.itemData.itemId) == BagType.HERO) {
                    this.pzgtyNode.active = true;
                    this.pzgty.play();
                }
            }
        }
    }
    /**物品点击 */
    _itemClick() {
        if (this.itemData) {
            GlobalUtil.openItemTips(this.itemData, true, true)
            // 清除红点标志
            let id = this.itemData.itemId
            if (this.itemData.type == BagType.EQUIP) {
                id = this.itemData.series
            }
            RedPointUtils.save_state('bag_item_' + id, false)
        }
    }

    _updateEquipData() {
        let itemId = this.itemData.itemId
        let cfg = ConfigManager.getItemById(Item_equipCfg, itemId)
        let extInfo = <icmsg.EquipInfo>this.itemData.extInfo
        let starNum = cfg.star
        this.bagSlot.updateStar(starNum)
        //this.lockNode.active = extInfo.isLock
    }
}
