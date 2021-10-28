import BagModel, { BagItem, BagType } from '../../../common/models/BagModel';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CostumeStrengthenPanelCtrl from '../../role/ctrl2/costume/CostumeStrengthenPanelCtrl';
import CostumeUtils from '../../../common/utils/CostumeUtils';
import EquipViewCtrl2 from '../../role/ctrl2/equip/EquipViewCtrl2';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import ItemCompositeViewCtrl from './ItemCompositeViewCtrl';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointCtrl from '../../../common/widgets/RedPointCtrl';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import SelectGiftViewCtrl, { SelectGiftType } from './SelectGiftViewCtrl';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import {
    CostumeCfg,
    Item_composeCfg,
    Item_dropCfg,
    Item_equipCfg,
    ItemCfg,
    RuneCfg
    } from '../../../a/config';
import { CostumeTipsType } from '../../role/ctrl2/costume/CostumeTipsCtrl';
import { EnergyStoneInfo } from '../../bingying/model/BYModel';
import { GuardianEquipTipsType } from '../../role/ctrl2/guardian/equip/GuardianEquipTipsCtrl';
/**
 * @Author: weiliang.huang
 * @Description:
 * @Date: 2019-03-19 18:03:03
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-13 15:56:41
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/BagItemCtrl")
export default class BagItemCtrl extends UiListItem {

    @property(UiSlotItem)
    bagSlot: UiSlotItem = null

    @property(cc.Node)
    usedNode: cc.Node = null

    @property(cc.Node)
    lockNode: cc.Node = null

    @property(cc.Sprite)
    heroIcon: cc.Sprite = null;

    @property(cc.Node)
    magicIcon: cc.Node = null

    @property(cc.Node)
    mergeIcon: cc.Node = null

    @property(cc.Node)
    numBg: cc.Node = null

    @property(cc.Node)
    expTipsNode: cc.Node = null;

    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Node)
    dressFlag: cc.Node = null;

    model: BagModel = null;
    itemData: BagItem = null
    baseConfig: any = null
    oldItemData: BagItem = null
    isMixRune: boolean;
    mixRuneClearLv: number;

    start() {
        this.model = ModelManager.get(BagModel);
        // this.onSelectChanged.on(this._onItemSelected, this)
    }

    /* 更新格子数据*/
    updateView() {
        this.itemData = this.data.info
        this.isMixRune = this.itemData && this.itemData.itemId.toString().length == 8
        if (this.isMixRune) {
            //融合符文8位id runeid+clearLv
            this.itemData.itemId = parseInt(this.itemData.itemId.toString().slice(0, 6));
            this.mixRuneClearLv = parseInt(this.itemData.itemId.toString().slice(6))
        }
        this.usedNode.active = false
        this.lockNode.active = false
        this.lv.node.active = false;
        this.dressFlag.active = false;
        //this.numBg.active = false
        if (this.magicIcon) {
            this.magicIcon.active = false
        }
        if (this.mergeIcon) {
            this.mergeIcon.active = false
        }

        this.expTipsNode.active = false;
        if (this.itemData) {
            let itemId = this.itemData.itemId
            this.bagSlot.starNum = 0;
            this.bagSlot.updateItemInfo(itemId, this.itemData.itemNum)
            //this.numBg.active = this.itemData.itemNum > 1
            if (this.itemData.type == BagType.EQUIP) {
                this._updateEquipData()
            }
            if (this.itemData.type == BagType.RUNE) {
                let runeInfo = <icmsg.RuneInfo>this.itemData.extInfo;
                if (runeInfo.heroId > 0) {
                    this.usedNode.active = true;
                    let heroInfo = HeroUtils.getHeroInfoByHeroId(runeInfo.heroId);
                    GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.usedNode), HeroUtils.getHeroHeadIcon(heroInfo.typeId, heroInfo.star));
                }
                this.lv.node.active = true;
                this.lv.string = '.' + ConfigManager.getItemById(RuneCfg, parseInt(this.itemData.itemId.toString().slice(0, 6))).level;
            }

            if (this.itemData.type == BagType.COSTUME) {
                let costumeInfo = <icmsg.CostumeInfo>this.itemData.extInfo;
                let heroInfo = CostumeUtils.getHeroInfoBySeriesId(costumeInfo.id)
                if (heroInfo) {
                    this.usedNode.active = true;
                    GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.usedNode), GlobalUtil.getIconById(heroInfo.typeId));
                }
                this.lv.node.active = true;
                this.lv.string = '.' + costumeInfo.level
                let cfg = ConfigManager.getItemById(CostumeCfg, this.itemData.itemId)
                this.bagSlot.updateStar(cfg.star)
                this.bagSlot.starNum = cfg.star
            } if (this.itemData.type == BagType.GUARDIANEQUIP) {
                let guardianEquipInfo = <icmsg.GuardianEquip>this.itemData.extInfo;
                this.lv.node.active = true;
                this.lv.string = '.' + guardianEquipInfo.level;
                this.bagSlot.updateStar(guardianEquipInfo.star)
                this.bagSlot.starNum = guardianEquipInfo.star
            }
            if (this.itemData.type == BagType.ENERGSTONE) {
                let info = <EnergyStoneInfo>this.itemData.extInfo;
                this.dressFlag.active = info && info.slot >= 0;
            }

            if (this.itemData.type == BagType.UNIQUEEQUIP) {
                let uniqueInfo = <icmsg.UniqueEquip>this.itemData.extInfo;
                this.bagSlot.updateStar(uniqueInfo.star)
                this.bagSlot.starNum = uniqueInfo.star
            }

            let idx = [100008, 100009, 100010, 100011].indexOf(itemId);
            if (idx != -1) {
                this.expTipsNode.active = true;
                this.expTipsNode.getChildByName('label').getComponent(cc.Label).string = ['2小时', '6小时', '12小时', '24小时'][idx];
            }
            // else if (this.itemData.type == BagType.JEWEL) {
            //     let cfg = ConfigManager.getItemById(Item_rubyCfg, itemId)
            //      this.bagSlot.updateStar(cfg.level)
            // }
        } else {
            this.bagSlot.starNum = 0
            this.bagSlot.updateItemInfo(0)
        }
        this.node.getComponent(RedPointCtrl).isShow = this.redPointHandle();
    }

    /** 物品清除 */
    recycleItem() {
        this.bagSlot.recycleItem();
        super.recycleItem();
    }

    /**物品点击 */
    _itemClick() {
        if (this.itemData) {
            let itemCfg = ConfigManager.getItemById(ItemCfg, this.itemData.itemId)
            CC_DEBUG && cc.log(
                `物品信息, id: ${this.itemData.itemId}, config: `,
                BagUtils.getConfigById(this.itemData.itemId, this.itemData.type)
            )
            //类型4为可选奖励类型礼包
            if (itemCfg && itemCfg.use_type == 4) {
                // if (this._isHeroGift(itemCfg)) {
                //     gdk.panel.open(PanelId.SelectHero, (node: cc.Node) => {
                //         let comp = node.getComponent(SelectHeroViewCtrl)
                //         comp.initRewardInfo(this.itemData.itemId, SelectGiftType.Bag)
                //     })
                // } else {
                gdk.panel.open(PanelId.SelectGift, (node: cc.Node) => {
                    let comp = node.getComponent(SelectGiftViewCtrl)
                    comp.initRewardInfo(this.itemData.itemId, SelectGiftType.Bag)
                })
                // }
                RedPointUtils.save_state('bag_item_' + this.itemData.itemId, false)
            } else if (itemCfg && itemCfg.use_type == 5 && itemCfg.func_id != 'activate_army_skin') {
                let itemCfg = ConfigManager.getItemById(ItemCfg, this.itemData.itemId)
                let comCfg = ConfigManager.getItemById(Item_composeCfg, this.itemData.itemId)
                if (comCfg) {
                    if (itemCfg.random_hero_chip && itemCfg.random_hero_chip.length >= 2) {
                        gdk.panel.open(PanelId.ItemComposite, (node: cc.Node) => {
                            let comp = node.getComponent(ItemCompositeViewCtrl)
                            comp.initRewardInfo(this.itemData.itemId)
                        })
                    }
                    else {
                        GlobalUtil.openItemTips(this.itemData, false, false, gdk.Tool.getResIdByNode(this.node))
                    }
                } else {
                    GlobalUtil.openItemTips(this.itemData, false, false, gdk.Tool.getResIdByNode(this.node))
                    // 清除红点标志
                    let id = this.itemData.itemId
                    if (this.itemData.type == BagType.EQUIP) {
                        id = this.itemData.series
                    }
                    RedPointUtils.save_state('bag_item_' + id, false)
                }
            } else if (itemCfg && itemCfg.func_id == 'activate_army_skin') {
                //士兵皮肤
                gdk.panel.setArgs(PanelId.BYarmySkinInfoPanel, itemCfg.func_args[0], 0);
                gdk.panel.open(PanelId.BYarmySkinInfoPanel)
            }
            else if (BagUtils.getConfigById(this.itemData.itemId, this.itemData.type) instanceof RuneCfg) {
                let runeInfo = <icmsg.RuneInfo>this.itemData.extInfo;
                let pos = null;
                if (runeInfo.heroId) {
                    let heroInfo = HeroUtils.getHeroInfoByHeroId(runeInfo.heroId);
                    pos = heroInfo.runes[0] == runeInfo.id ? 0 : 1;
                }
                gdk.panel.setArgs(PanelId.RuneInfo, [runeInfo.id, pos, runeInfo.heroId]);
                gdk.panel.open(PanelId.RuneInfo);
            }
            else if (this.itemData.type == BagType.COSTUME) {
                let tipsInfo: CostumeTipsType = {
                    itemInfo: this.itemData,
                    from: PanelId.Bag.__id__,
                    equipOnCb: () => {
                        let info = this.itemData.extInfo as icmsg.CostumeInfo
                        let origNode = gdk.gui.getCurrentView();
                        JumpUtils.openPanel({
                            panelId: PanelId.EquipView2,
                            panelArgs: { args: 2 },
                            callback: (node: cc.Node) => {
                                let e_ctrl = node.getComponent(EquipViewCtrl2);
                                e_ctrl._onPanelShow = (node: cc.Node) => {
                                    if (!node) return;
                                    let ctrl = node.getComponent(CostumeStrengthenPanelCtrl);
                                    ctrl.selectById(info)
                                    e_ctrl._onPanelShow = null;
                                };
                            },
                            currId: origNode ? origNode : null
                        })
                    },
                };
                gdk.panel.open(PanelId.CostumeTips, null, null, { args: tipsInfo });
            } else if (this.itemData.type == BagType.GUARDIANEQUIP) {
                //打开装备提示框
                let tipsInfo: GuardianEquipTipsType = {
                    itemInfo: this.itemData,
                    from: PanelId.Bag.__id__,
                };
                gdk.panel.open(PanelId.GuardianEquipTips, null, null, { args: tipsInfo });
            } else if (this.itemData.type == BagType.ENERGSTONE) {
                //能源石
                let obj: EnergyStoneInfo = {
                    slot: -1,
                    itemId: this.itemData.itemId,
                    itemNum: this.itemData.itemNum
                };
                gdk.panel.setArgs(PanelId.BYTechStoneInfoView, [obj, null]);
                gdk.panel.open(PanelId.BYTechStoneInfoView);
            } else if (this.itemData.type == BagType.UNIQUEEQUIP) {
                let uniqueEquip = new icmsg.UniqueEquip()
                uniqueEquip.id = -1
                uniqueEquip.itemId = this.itemData.itemId
                uniqueEquip.star = (this.itemData.extInfo as icmsg.UniqueEquip).star
                gdk.panel.setArgs(PanelId.UniqueEquipTip, uniqueEquip)
                gdk.panel.open(PanelId.UniqueEquipTip)
            }
            else {
                GlobalUtil.openItemTips(this.itemData, false, false, gdk.Tool.getResIdByNode(this.node))
                // 清除红点标志
                let id = this.itemData.itemId
                if (this.itemData.type == BagType.EQUIP) {
                    id = this.itemData.series
                }
                RedPointUtils.save_state('bag_item_' + id, false)
            }
        }
    }

    _isHeroGift(itemCfg) {
        let dropCfgs = ConfigManager.getItemsByField(Item_dropCfg, "drop_id", itemCfg.func_args[0])
        for (let i = 0; i < dropCfgs.length; i++) {
            if (BagUtils.getItemTypeById(dropCfgs[i].item_id) == BagType.HERO) {
                return true
            }
        }
        return false
    }

    _updateEquipData() {
        let itemId = this.itemData.itemId
        let cfg = ConfigManager.getItemById(Item_equipCfg, itemId)
        let extInfo = <icmsg.EquipInfo>this.itemData.extInfo
        this.bagSlot.updateStar(cfg.star)

        // this.lockNode.active = extInfo.isLock
        // this.usedNode.active = extInfo.heroId > 0

        // if (extInfo.heroId > 0) {
        //     let heroItem = HeroUtils.getHeroInfoBySeries(extInfo.heroId)
        //     let icon = GlobalUtil.getIconById(heroItem.itemId, BagType.HERO)
        //     GlobalUtil.setSpriteIcon(this.node, this.heroIcon, icon)
        // }
    }

    /** 红点逻辑 */
    redPointHandle(): boolean {
        // if (!this.itemData) return false
        // let id = this.itemData.itemId
        // if (this.itemData.type == BagType.EQUIP) {
        //     id = this.itemData.series
        // }
        // return RedPointUtils.is_in_state('bag_item_' + id)

        if (!this.itemData) return false
        if (this.itemData.type == BagType.ITEM) {
            let cfg = ConfigManager.getItemById(ItemCfg, this.itemData.itemId)
            if (cfg.func_id == "add_drop_items" || cfg.func_id == "choose_drop_item") {
                let id = this.itemData.itemId
                if ([100012, 100013, 100014, 100015, 100016, 100017, 100018].indexOf(id) != -1) return true;
                return RedPointUtils.is_in_state('bag_item_' + id)
            }
            else if (cfg.func_id == 'add_stage_hexp') {
                return true;
            }
            else if (cfg.random_hero_chip && cfg.random_hero_chip.length >= 2) {
                let composeCfg = ConfigManager.getItemById(Item_composeCfg, cfg.id);
                if (composeCfg && Math.floor(this.itemData.itemNum / composeCfg.amount) >= 1) {
                    return true;
                }
            }
        }
        return false
    }
}
