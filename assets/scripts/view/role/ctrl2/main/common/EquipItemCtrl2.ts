import ConfigManager from '../../../../../common/managers/ConfigManager';
import GuideUtil from '../../../../../common/utils/GuideUtil';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../../common/models/BagModel';
import { Item_equipCfg } from '../../../../../a/config';

/** 
 * @Description: 装备选择面板子项
 * @Author: weiliang.huang  
 * @Date: 2019-04-02 18:24:37 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 11:49:00
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/common/EquipItemCtrl2")
export default class EquipItemCtrl2 extends UiListItem {

    @property(cc.Node)
    itemNode: cc.Node = null

    @property(UiSlotItem)
    slotItem: UiSlotItem = null

    @property(cc.Node)
    usedNode: cc.Node = null

    @property(cc.Sprite)
    heroIcon: cc.Sprite = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    @property(cc.Node)
    magicIcon: cc.Node = null

    @property(cc.Node)
    mergeIcon: cc.Node = null

    @property(cc.Node)
    LvNode: cc.Node = null

    @property(cc.Label)
    equipLvLab: cc.Label = null

    itemInfo: BagItem = null
    equipInfo: icmsg.EquipInfo = null

    onEnable() {

    }

    onDisable() {
        if (this.curIndex == 0) {
            GuideUtil.bindGuideNode(808)
        }
    }

    updateView() {
        this.itemInfo = this.data
        if (this.itemInfo.series == 0 && this.itemInfo.itemId == 0) {
            this.usedNode.active = false;
            this.redPoint.active = false;
            this.magicIcon.active = false;
            this.mergeIcon.active = false;
            this.slotItem.updateItemInfo(0)
            this.slotItem.updateStar(0)
            this.LvNode.active = false
            return;
        }
        if (this.curIndex == 0) {
            GuideUtil.bindGuideNode(808, this.node)
        }
        this.equipInfo = <icmsg.EquipInfo>this.itemInfo.extInfo
        this.usedNode.active = false//this.equipInfo.heroId != 0
        // this.magicIcon.active = this.equipInfo.magicId > 0
        // this.mergeIcon.active = this.equipInfo.skills.length > 0
        // if (this.equipInfo.magicId > 0) {
        //     GlobalUtil.setSpriteIcon(this.node, this.magicIcon, GlobalUtil.getMagicIcon(this.equipInfo.magicId))
        // }
        this.slotItem.updateItemInfo(this.itemInfo.itemId)

        let cfg = ConfigManager.getItemById(Item_equipCfg, this.itemInfo.itemId)
        this.slotItem.updateStar(cfg.star)

        // if (this.equipInfo.heroId > 0) {
        //     let heroItem = HeroUtils.getHeroInfoBySeries(this.equipInfo.heroId)
        //     GlobalUtil.setSpriteIcon(
        //         this.node,
        //         this.heroIcon,
        //         GlobalUtil.getIconById(heroItem.itemId),
        //     )
        // }
        this.LvNode.active = false
        // this.LvNode.active = true
        // this.equipLvLab.string = `.${this.equipInfo.level}`
        //this.updateRedPoint();
    }

    // updateRedPoint() {
    //     //别人装备的排除
    //     if (this.equipInfo.heroId > 0) {
    //         this.redPoint.active = false
    //         return
    //     }
    //     let model = ModelManager.get(HeroModel)
    //     this.redPoint.active = RedPointUtils.is_can_equip_up(model.curHeroInfo, this.itemInfo);
    // }
}
