import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import DecomposeNumPanelCtrl from './DecomposeNumPanelCtrl';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import PanelId from '../../../configs/ids/PanelId';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../common/models/BagModel';
import { DecomposeEvent } from '../enum/DecomposeEvent';
import { Item_equipCfg } from '../../../a/config';

/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 12:02:42
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/decompose/DecomposeItemCtrl")
export default class DecomposeItemCtrl extends UiListItem {

    @property(UiSlotItem)
    bagSlot: UiSlotItem = null

    @property(cc.Node)
    lockNode: cc.Node = null

    @property(cc.Node)
    magicIcon: cc.Node = null

    @property(cc.Node)
    select: cc.Node = null

    @property(cc.Node)
    selectItem: cc.Node = null

    @property(cc.Sprite)
    UiItemIcon: cc.Sprite = null;

    @property(cc.Sprite)
    UiQualityIcon: cc.Sprite = null;

    @property(cc.Label)
    curNumLab: cc.Label = null

    @property(cc.Label)
    totalNumLab: cc.Label = null

    @property(cc.Node)
    txtBg: cc.Node = null;

    @property(cc.Node)
    LvNode: cc.Node = null

    @property(cc.Label)
    equipLvLab: cc.Label = null

    // @property(cc.Node)
    // starBar: cc.Node = null;

    // model: BagModel = null;
    itemData: BagItem = null
    // baseConfig: any = null
    // oldItemData: BagItem = null

    start() {
        // this.model = ModelManager.get(BagModel);
    }

    updateItemId(id: number) {
        let cfg = BagUtils.getConfigById(id);
        if (cfg) {
            this.UiItemIcon.node.active = true;
            if (cfg.defaultColor > 0) {
                this.UiQualityIcon.node.active = true;
                let path = `common/texture/sub_itembg0${cfg.defaultColor}`;
                GlobalUtil.setSpriteIcon(this.node, this.UiQualityIcon, path);
            } else {
                this.UiQualityIcon.node.active = false;
            }
            let path = GlobalUtil.getIconById(id);
            if (path) {
                GlobalUtil.setSpriteIcon(this.node, this.UiItemIcon, path);
                this.UiItemIcon.node.active = true;
            } else {
                this.UiItemIcon.node.active = true;
            }
        } else {
            this.UiQualityIcon.node.active = false;
            this.UiItemIcon.node.active = true;
        }
    }

    /* 更新格子数据*/
    updateView() {
        this.itemData = this.data.info
        let itemData = this.itemData;
        this.lockNode.active = false;
        this.select.active = this.data.isSelect;
        if (itemData) {
            if (this.magicIcon) {
                this.magicIcon.active = false;
            }
            this.bagSlot.node.active = true;
            // this.updateItemId(itemData.itemId);
            this.bagSlot.updateItemInfo(itemData.itemId)
            if (itemData.type == BagType.EQUIP) {
                this._updateEquipData();
                this.LvNode.active = true;
            } else {
                this._updateItemData();
                this.LvNode.active = false
            }
        } else {
            this.bagSlot.node.active = false;
            this.curNumLab.node.active = false;
            this.totalNumLab.node.active = false;
            this.selectItem.active = false;
            //this.txtBg.active = false;
        }

    }

    /**物品点击 */
    _itemClick() {
        if (this.itemData) {
            gdk.e.emit(DecomposeEvent.DECOMPOSE_CLICK_ITEM, {
                index: this.data.index,
                isSelect: !this.data.isSelect
            })
        }
    }

    _updateItemData() {
        // this.starBar.active = false;
        this.bagSlot.updateStar(0);
        //this.txtBg.active = true;
        this.totalNumLab.node.active = true;
        if (this.data.isSelect) {
            this.selectItem.active = this.itemData.itemNum > 1;
            this.curNumLab.node.active = true;
            this.curNumLab.string = this.data.decomposeNum.toString();
            let num = this.itemData.itemNum;
            this.totalNumLab.string = "/" + (num >= 1000 ? '>=' : num);
            this.txtBg.width = this.curNumLab.node.width + this.totalNumLab.node.width + 12;
            this.totalNumLab.node.once(cc.Node.EventType.SIZE_CHANGED, () => {
                this.curNumLab.node.x = this.totalNumLab.node.x - this.totalNumLab.node.width - 1;
                this.txtBg.width = this.curNumLab.node.width + this.totalNumLab.node.width + 11;
            });
        } else {
            this.selectItem.active = false;
            this.curNumLab.node.active = false;
            this.totalNumLab.string = this.itemData.itemNum.toString();
            this.txtBg.width = this.totalNumLab.node.width + 11;
            this.totalNumLab.node.once(cc.Node.EventType.SIZE_CHANGED, () => {
                this.txtBg.width = this.totalNumLab.node.width + 10;
            });
        }
    }

    _updateEquipData() {
        this.curNumLab.node.active = false;
        this.totalNumLab.node.active = false;
        //this.txtBg.active = false;
        this.selectItem.active = false;
        // this.starBar.active = true;

        let itemId = this.itemData.itemId
        let cfg = ConfigManager.getItemById(Item_equipCfg, itemId)
        let extInfo = <icmsg.EquipInfo>this.itemData.extInfo
        this.bagSlot.updateStar(cfg.star);

        // this.lockNode.active = extInfo.isLock
    }

    openDecomposeNumPanel() {
        gdk.panel.open(PanelId.DecomposeNumPanel, (node: cc.Node) => {
            let comp = node.getComponent(DecomposeNumPanelCtrl)
            comp.updatePanelShow(this.itemData, null, this.itemData.itemNum, this.data.decomposeNum)
        })
    }
}
