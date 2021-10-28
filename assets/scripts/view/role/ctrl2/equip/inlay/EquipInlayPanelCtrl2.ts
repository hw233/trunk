import EquipInlayItemCtrl2 from './EquipInlayItemCtrl2';
import HeroModel from '../../../../../common/models/HeroModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { InlayBagItemData } from './EquipInlayBagItemCtrl2';

/**
 * @Description: 装备镶嵌面板控制
 * @Author: chengyou.lin
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 11:40:22
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/inlay/EquipInlayPanelCtrl2")
export default class EquipInlayPanelCtrl2 extends gdk.BasePanel {

    @property(cc.Label)
    equipNameLab: cc.Label = null;
    @property(UiSlotItem)
    curEquipSlot: UiSlotItem = null;
    @property(cc.Node)
    attrNodes: cc.Node[] = [];

    @property(EquipInlayItemCtrl2)
    inlayAttrs: EquipInlayItemCtrl2[] = [];

    // equipCfg: Item_equipCfg = null;
    holePos: number;
    inlayItemDatas: InlayBagItemData[][];

    get model() { return ModelManager.get(HeroModel); }
    get curEquip() { return this.model.curEquip; }

    // onLoad() {
    //     for (let i = 0; i < this.inlayAttrs.length; i++) {
    //         const inlayAttr = this.inlayAttrs[i];
    //         inlayAttr.onClick.on(this._clickItem, this);
    //     }
    // }

    // onEnable() {
    //     this.updateData();
    //     NetManager.on(ItemUpdateRsp.MsgType, this.updateData, this);
    // }

    // onDisable() {
    //     NetManager.targetOff(this);
    // }

    // /**更新装备信息 */
    // updateData() {
    //     if (!this.node.active) {
    //         return;
    //     }
    //     this._updateEquipInfo();
    //     this._updateRubyInfo();
    //     this._updateRubyBag();
    // }

    // _updateEquipInfo() {
    //     let curEquip = this.model.curEquip;
    //     if (!curEquip) {
    //         return;
    //     }
    //     let equipCfg = ConfigManager.getItemById(Item_equipCfg, curEquip.itemId);
    //     let equipInfo = <EquipInfo>curEquip.extInfo;
    //     this.equipNameLab.string = equipCfg.name;
    //     this.equipNameLab.node.color = BagUtils.getColor(equipCfg.color);
    //     this.equipNameLab.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(equipCfg.color);

    //     let equipSlot = this.curEquipSlot;
    //     equipSlot.updateItemInfo(curEquip.itemId);
    //     equipSlot.itemInfo = curEquip;
    //     equipSlot.noBtn = true;

    //     let curStar = equipCfg.star;
    //     let maxStar = curStar;
    //     let starTxt = "";
    //     for (let i = 0; i < curStar; i++) {
    //         starTxt += "1";
    //     }
    //     for (let i = curStar; i < maxStar; i++) {
    //         starTxt = "0" + starTxt;
    //     }
    //     let starLabel = this.attrNodes[0].getChildByName("curLabel").getComponent(cc.Label);
    //     starLabel.string = starTxt;
    //     let diaLabel = this.attrNodes[1].getChildByName("curLabel").getComponent(cc.Label);
    //     diaLabel.string = `${equipCfg.diamond_lv}`;
    // }

    // _updateRubyInfo() {
    //     let curEquip = this.model.curEquip;
    //     if (!curEquip) {
    //         return;
    //     }
    //     let equipInfo = <EquipInfo>curEquip.extInfo;
    //     let rubyIds: number[] = equipInfo.rubies || [];
    //     for (let i = 0; i < this.inlayAttrs.length; i++) {
    //         const inlayAttr = this.inlayAttrs[i];
    //         inlayAttr.holePos = i + 1;
    //         inlayAttr.updateData(curEquip, rubyIds[i]);
    //     }
    // }

    // _updateRubyBag() {
    //     let curEquip = this.model.curEquip;
    //     if (!curEquip) {
    //         return;
    //     }
    //     let equipInfo = <EquipInfo>curEquip.extInfo;
    //     let equipCfg: Item_equipCfg = ConfigManager.getItemById(Item_equipCfg, curEquip.itemId);
    //     let curStar = equipCfg.star
    //     let bagItems = BagUtils.getBagItems();
    //     this.inlayItemDatas = [];
    //     let rubyIds: number[] = equipInfo.rubies || [0, 0];
    //     for (let r = 0; r < rubyIds.length; r++) {
    //         let rubyId = rubyIds[r];
    //         let holePos = r + 1;
    //         let datas: InlayBagItemData[] = [];
    //         let unavailables: InlayBagItemData[] = [];
    //         for (let i = 0; i < bagItems.length; i++) {
    //             const bagItem = bagItems[i];
    //             if (bagItem.type == BagType.JEWEL) {
    //                 let rubyCfg = ConfigManager.getItemById(Item_rubyCfg, bagItem.itemId);
    //                 if (rubyCfg.equip_part != equipCfg.part) continue;
    //                 if (rubyCfg.part.indexOf(holePos) != -1) {
    //                     let data = new InlayBagItemData;
    //                     data.maxLv = equipCfg.diamond_lv;
    //                     data.bagItem = bagItem;
    //                     data.rubyCfg = rubyCfg;

    //                     //武器可镶嵌的宝石依赖于 英雄职业
    //                     // if (equipCfg.part == 1) {
    //                     //     let list = heroCareerCfg.ruby
    //                     //     if (list && list.length > 0) {
    //                     //         let count = 0
    //                     //         for (let n = 0; n < list.length; n++) {
    //                     //             if (rubyCfg.sub_type == list[n][0] && rubyCfg.type == list[n][1]) {
    //                     //                 count++
    //                     //             }
    //                     //         }
    //                     //         //不适合
    //                     //         if (count == 0) {
    //                     //             continue
    //                     //         }
    //                     //     }
    //                     // }

    //                     if (rubyCfg.level <= equipCfg.diamond_lv) {
    //                         for (let k = 0; k < datas.length; k++) {
    //                             const element = datas[k];
    //                             if (data.rubyCfg.level >= element.rubyCfg.level) {
    //                                 datas.splice(k, 0, data);
    //                                 data = null;
    //                                 break;
    //                             }
    //                         }
    //                         if (data) {
    //                             datas.push(data);
    //                         }
    //                     } else {
    //                         for (let k = 0; k < unavailables.length; k++) {
    //                             const element = unavailables[k];
    //                             if (data.rubyCfg.level >= element.rubyCfg.level) {
    //                                 unavailables.splice(k, 0, data);
    //                                 data = null;
    //                                 break;
    //                             }
    //                         }
    //                         if (data) {
    //                             unavailables.push(data);
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         const inlayAttr = this.inlayAttrs[r];
    //         if (rubyId > 0) {
    //             let rubyCfg = ConfigManager.getItemById(Item_rubyCfg, rubyId);
    //             let maxData = datas[0];
    //             if (maxData) {
    //                 //可换更高级宝石
    //                 if (maxData.rubyCfg.level > rubyCfg.level) {
    //                     inlayAttr.showChangeIcon(true)
    //                 } else {
    //                     inlayAttr.showChangeIcon(false)
    //                 }
    //             }

    //             let data = new InlayBagItemData;
    //             data.maxLv = equipCfg.diamond_lv;
    //             data.bagItem = null;
    //             data.rubyCfg = rubyCfg;
    //             datas.unshift(data);
    //         } else {
    //             if (datas.length > 0) {
    //                 inlayAttr.showInlayIcon(true);
    //             } else {
    //                 inlayAttr.showInlayIcon(false);
    //             }
    //         }
    //         for (let i = 0; i < unavailables.length; i++) {
    //             const data = unavailables[i];
    //             datas.push(data);
    //         }
    //         this.inlayItemDatas[r] = datas;
    //     }
    // }

    // private _clickItem(ctrl: EquipInlayItemCtrl2, evtId: number) {
    //     let curEquip = this.model.curEquip;
    //     if (!curEquip) {
    //         return;
    //     }
    //     let equipInfo = <EquipInfo>curEquip.extInfo;
    //     let holePos = ctrl.holePos;
    //     this.holePos = holePos;

    //     //打开更换面板
    //     if (evtId == 0) {
    //         let datas = this.inlayItemDatas[holePos - 1];
    //         gdk.panel.open(PanelId.EquipInlayBagView2, (node: cc.Node) => {
    //             let ctrl = node.getComponent(EquipInlayBagViewCtrl2);
    //             ctrl.updateDatas(datas);
    //             ctrl.onClick.on(this._bagItemClick, this);
    //         })
    //         //升级
    //     } else {
    //         let msg = new RubyUpgradeReq();
    //         msg.equipId = equipInfo.equipId;
    //         msg.slotPos = this.holePos;
    //         NetManager.send(msg, (data: RubyUpgradeRsp) => {
    //             let equip = EquipUtils.getEquipData(data.equipId);
    //             let extInfo = <EquipInfo>equip.extInfo
    //             extInfo.rubies[data.slotPos - 1] = data.rubyId;

    //             gdk.gui.showMessage("升级成功");
    //             if (cc.isValid(this.node)) {
    //                 this.updateData()
    //             }
    //         });
    //     }
    // }

    // _bagItemClick(data: InlayBagItemData, evtId: number) {
    //     let curEquip = this.model.curEquip;
    //     let equipInfo = <EquipInfo>curEquip.extInfo;

    //     let rubyId = 0;
    //     //镶嵌
    //     if (evtId == 1) {
    //         rubyId = data.rubyCfg.id;
    //         //卸下
    //     } else {
    //         rubyId = 0;
    //     }
    //     let msg = new EquipAddRubyReq();
    //     msg.equipId = equipInfo.equipId;
    //     msg.holePos = this.holePos;
    //     msg.rubyId = rubyId;
    //     NetManager.send(msg, (data: EquipAddRubyRsp) => {
    //         let equip = data.equip
    //         EquipUtils.updateEquipInfo(equip.equipId, equip)
    //         let rubyId = data.equip.rubies[this.holePos - 1]
    //         if (rubyId) {
    //             gdk.gui.showMessage("镶嵌成功");
    //         } else {
    //             gdk.gui.showMessage("拆卸成功");
    //         }
    //     });
    // }

    // openJewelCompose() {
    //     gdk.panel.open(PanelId.Bag, node => {
    //         gdk.Timer.callLater(this, () => {
    //             node.getChildByName('ViewTabMenu').getComponent(UiTabMenuCtrl).setSelectIdx(3);
    //         })
    //     });
    // }
}
