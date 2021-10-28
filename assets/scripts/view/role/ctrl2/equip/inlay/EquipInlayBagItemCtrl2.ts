import BagUtils from '../../../../../common/utils/BagUtils';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../../../common/models/BagModel';
import { CommonNumColor } from '../../../../../common/utils/GlobalUtil';
import { EquipAttrTYPE } from '../../../../../common/utils/EquipUtils';
import { Item_rubyCfg } from '../../../../../a/config';

/**
 * @Description: 装备突破面板控制
 * @Author: chengyou.lin
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-06-04 17:48:58
 */

export class InlayBagItemData {
    isUsed: boolean;
    isAvailable: boolean;
    maxLv: number;
    bagItem: BagItem;
    rubyCfg: Item_rubyCfg;
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/equip/inlay/EquipInlayBagItemCtrl2")
export default class EquipInlayBagItemCtrl2 extends UiListItem {
    @property(UiSlotItem)
    slot: UiSlotItem = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    // @property(cc.Label)
    // proKeyLabel: cc.Label = null;
    // @property(cc.Label)
    // proValLabel: cc.Label = null;

    @property(cc.Node)
    attrNodes: cc.Node[] = []

    @property(cc.Node)
    tipsIcon: cc.Node = null;

    @property(cc.Node)
    upBtn: cc.Node = null;
    @property(cc.Node)
    downBtn: cc.Node = null;

    @property(cc.Node)
    recommendIcon: cc.Node = null;

    onLoad() {
        // this.onClick = gdk.EventTrigger.get();
    }

    updateView() {
        let itemData = this.data as InlayBagItemData;
        let isEmpty = !itemData.rubyCfg;
        this.nameLabel.node.active = !isEmpty;
        // this.proKeyLabel.node.active = !isEmpty;
        // this.proValLabel.node.active = !isEmpty;
        if (!isEmpty) {
            let rubyCfg = itemData.rubyCfg;
            let attArr = BagUtils.getJewelAttrById(rubyCfg.id);
            this.nameLabel.string = `${rubyCfg.name}`;
            for (let i = 0; i < attArr.length; i++) {
                let attrNode = this.attrNodes[i]
                attrNode.active = true
                let keyLab = attrNode.getChildByName("proKeyLabel").getComponent(cc.Label)
                let valueLab = attrNode.getChildByName("proValLabel").getComponent(cc.Label)
                keyLab.string = `${attArr[i].name}`;
                let v = `${attArr[i].value}`
                if (attArr[i].type == EquipAttrTYPE.R) {
                    v = `${attArr[i].value / 100}%`
                }
                valueLab.string = `+${v}`;
            }
            if (itemData.bagItem) {
                this.tipsIcon.active = false;
                this.downBtn.active = false;
                let bagItem = itemData.bagItem;
                this.slot.updateItemInfo(rubyCfg.id, bagItem.itemNum);
                this.slot.itemInfo = {
                    series: bagItem.series,
                    itemId: bagItem.itemId,
                    itemNum: 1,
                    type: bagItem.type,
                    extInfo: bagItem.extInfo,
                };
                this.slot.noBtn = false;
                this.slot.showGainWay = true;
                this.recommendIcon.active = false

                if (rubyCfg.level <= itemData.maxLv) {
                    this.upBtn.active = true;
                    this.nameLabel.node.color = cc.color('#F1B77F');
                    //非普攻宝石的为显示推荐标识
                    if (rubyCfg.type != 6) {
                        this.recommendIcon.active = true
                    }
                } else {
                    this.upBtn.active = false;
                    this.nameLabel.node.color = CommonNumColor.red;
                }
            } else {
                this.tipsIcon.active = true;
                this.upBtn.active = false;
                this.downBtn.active = true;
                this.nameLabel.node.color = cc.color('#F1B77F');
                this.slot.updateItemInfo(rubyCfg.id);
                this.slot.itemInfo = {
                    series: rubyCfg.id,
                    itemId: rubyCfg.id,
                    itemNum: 1,
                    type: BagType.JEWEL,
                    extInfo: null,
                };
            }
        } else {
            this.tipsIcon.active = false;
            this.upBtn.active = false;
            this.downBtn.active = false;
            this.slot.updateItemInfo(0);
        }
    }

    onInlayBtnClick() {
        let itemData = this.data as InlayBagItemData;
        if (itemData && itemData['onClick']) {
            itemData['onClick'].emit(this.data, 1);
        }
    }

    onUnInlayBtnClick() {
        let itemData = this.data as InlayBagItemData;
        if (itemData && itemData['onClick']) {
            itemData['onClick'].emit(this.data, 0);
        }
    }
    // _itemSelect() {
    //     // if (this.data.bagItem.extInfo) {
    //     //     // this.selectNode.active = this.ifSelect;
    //     // }
    // }
}