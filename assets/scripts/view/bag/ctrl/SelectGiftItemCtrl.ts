import BagUtils from '../../../common/utils/BagUtils';
import BYarmySkinSelectGiftGetCtrl from '../../bingying/ctrl/BYarmySkinSelectGiftGetCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import PanelId from '../../../configs/ids/PanelId';
import SelectGiftGetCtrl from './SelectGiftGetCtrl';
import SelectGiftGetEquipCtrl from './SelectGiftGetEquipCtrl';
import SelectGiftGetHeroCtrl from './SelectGiftGetHeroCtrl';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagEvent } from '../enum/BagEvent';
import { BagType } from '../../../common/models/BagModel';
import {
    GuardianCfg,
    Hero_careerCfg,
    HeroCfg,
    RuneCfg
    } from '../../../a/config';
import { SelectGiftInfo, SelectGiftType } from './SelectGiftViewCtrl';

/** 
  * @Description: 恭喜获得道具子项
  * @Author: luoyong 
  * @Date: 2019-09-12 14:24:36
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-16 10:37:20
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/SelectGiftItemCtrl")
export default class SelectGiftItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    selectIcon: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null;

    _itemData: SelectGiftInfo
    _star: number

    start() {

    }
    onEnable() {
        gdk.e.on(BagEvent.SELECT_CLICK_ITEM_BUY, this._clickGiftItem, this);
    }
    onDisable() {
        gdk.e.off(BagEvent.SELECT_CLICK_ITEM_BUY, this._clickGiftItem, this);
    }
    /**
     *index: 
     typeId: 
     num:  
     mainId: 
     giftType: 
     */
    updateView() {
        this._itemData = this.data
        let type = BagUtils.getItemTypeById(this._itemData.itemId);
        this.lvLab.node.active = false;
        if (type == BagType.HERO) {
            let cfg = <HeroCfg>BagUtils.getConfigById(this._itemData.itemId);
            this.slot.group = cfg.group[0];
            this.slot.starNum = cfg.star_min;
            this.careerIcon.active = true;
            let type = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', cfg.career_id).career_type;
            GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        }
        else {
            this.slot.group = 0;
            this.slot.starNum = 0;
            this.careerIcon.active = false;
            if (type == BagType.RUNE) {
                this.lvLab.node.active = true;
                this.lvLab.string = '.' + ConfigManager.getItemById(RuneCfg, parseInt(this._itemData.itemId.toString().slice(0, 6))).level;
            } else if (type == BagType.GUARDIANEQUIP) {
                let itemId = parseInt(this._itemData.itemId.toString().slice(0, 6))
                this._star = parseInt(this._itemData.itemId.toString().slice(7))
                this._itemData.itemId = itemId
                this._itemData.star = this._star

            }
        }
        this.slot.updateItemInfo(this._itemData.itemId, this._itemData.num)

        if (type == BagType.GUARDIANEQUIP) {
            this.slot.updateStar(this._star)
            this.slot.starNum = this._star
        }
    }

    /**物品点击 */
    _itemClick() {
        let type = BagUtils.getItemTypeById(this._itemData.itemId)
        if (type == BagType.EQUIP) {
            gdk.panel.open(PanelId.SelectGiftGetEquip, (node: cc.Node) => {
                let comp = node.getComponent(SelectGiftGetEquipCtrl)
                comp.initRewardInfo(this._itemData)
            })
        } else if (type == BagType.HERO) {
            gdk.panel.open(PanelId.SelectGiftGetHero, (node: cc.Node) => {
                let comp = node.getComponent(SelectGiftGetHeroCtrl)
                comp.initRewardInfo(this._itemData)
            })
        } else if (type == BagType.GUARDIAN) {
            // gdk.panel.open(PanelId.SelectGiftGetHero, (node: cc.Node) => {
            //     let comp = node.getComponent(SelectGiftGetHeroCtrl)
            //     comp.initRewardInfo(this._itemData)
            // })

            let cfg = ConfigManager.getItemById(GuardianCfg, this._itemData.itemId);
            let guardian = new icmsg.Guardian();
            guardian.id = 0;
            guardian.level = 1;
            guardian.star = cfg.star_min;
            guardian.type = cfg.id;
            gdk.panel.setArgs(PanelId.GuardianInfoTip, guardian, guardian.id == 0, this._itemData);
            gdk.panel.open(PanelId.GuardianInfoTip);

        } else {
            //商城走回调函数
            if (this._itemData.giftType == SelectGiftType.Store) {
                gdk.e.emit(BagEvent.SELECT_GIFT_ITEM, this._itemData);
                return;
            }
            // // 特殊物品处理
            // let itemCfg = ConfigManager.getItemById(ItemCfg, this._itemData.itemId)
            // if (itemCfg && itemCfg.func_id == 'activate_army_skin') {
            //     // 士兵皮肤
            //     gdk.panel.setArgs(PanelId.BYarmySkinInfoPanel, itemCfg.func_args[0], 0);
            //     gdk.panel.open(PanelId.BYarmySkinInfoPanel);
            //     return;
            // }
            //精甲自选特殊处理
            if (Math.floor(this._itemData.itemId / 1000) == 161) {

                gdk.panel.open(PanelId.BYarmySkinSelectGift, (node: cc.Node) => {
                    let comp = node.getComponent(BYarmySkinSelectGiftGetCtrl)
                    comp.initRewardInfo(this._itemData)
                })
                return;
            }
            //背包继续打开面板
            gdk.panel.open(PanelId.SelectGiftGet, (node: cc.Node) => {
                let comp = node.getComponent(SelectGiftGetCtrl)
                comp.initRewardInfo(this._itemData)
            })
        }
    }

    _clickGiftItem(event: gdk.Event) {
        let data = event.data;
        if (data.itemId == this._itemData.itemId) {
            this._itemClick()
        }
    }
    _itemSelect() {
        this.selectIcon.active = this.ifSelect
    }
}
