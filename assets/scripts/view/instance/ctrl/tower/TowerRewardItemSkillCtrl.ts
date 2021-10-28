import BagUtils from '../../../../common/utils/BagUtils';
import CommanderSkillTipCtrl from '../../../role/ctrl2/main/skill/CommanderSkillTipCtrl';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { ItemCfg } from '../../../../a/config';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


/** 
 * @Description: 
 * @Author: weiliang.huang  
 * @Date: 2019-03-25 17:29:13 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-09-21 16:11:28
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/tower/TowerRewardItemSkillCtrl")
export default class TowerRewardItemSkillCtrl extends gdk.ItemRenderer {


    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Node)
    itemNode: cc.Node = null;
    @property(UiSlotItem)
    itemSlot: UiSlotItem = null;
    @property(cc.Sprite)
    skillIcon: cc.Sprite = null;
    @property(cc.Node)
    qh: cc.Node = null;

    itemId: number;
    itemNum: number;
    skillId: number;
    skillLv: number
    updateView() {
        if (!this.data) return;
        this.itemId = this.data[0]
        this.itemNum = this.data[1];
        let cfg: ItemCfg = ConfigManager.getItemById(ItemCfg, this.itemId);
        if (cfg) {
            if (cfg.func_id == "gnr_skill_lvup") {
                this.skillNode.active = true;
                this.itemNode.active = false;
                this.skillId = cfg.func_args[0]
                this.skillLv = this.itemNum
                GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(this.skillId))
                this.qh.active = this.itemNum > 1;
            } else {
                this.skillNode.active = false;
                this.itemNode.active = true;
                this.itemSlot.starNum = 0;
                this.itemSlot.updateItemInfo(this.itemId, this.itemNum)
                let item: BagItem = {
                    series: this.itemId,
                    itemId: this.itemId,
                    itemNum: 1,
                    type: BagUtils.getItemTypeById(this.itemId),
                    extInfo: null
                }
                this.itemSlot.itemInfo = item
            }
        } else {
            this.skillNode.active = false;
            this.itemNode.active = true;
            this.itemSlot.starNum = 0;
            this.itemSlot.updateItemInfo(this.itemId, this.itemNum)
            let item: BagItem = {
                series: this.itemId,
                itemId: this.itemId,
                itemNum: 1,
                type: BagUtils.getItemTypeById(this.itemId),
                extInfo: null
            }
            this.itemSlot.itemInfo = item
        }
    }

    skillClick() {
        // let item: BagItem = {
        //     series: this.itemId,
        //     itemId: this.itemId,
        //     itemNum: 1,
        //     type: BagUtils.getItemTypeById(this.itemId),
        //     extInfo: null
        // }
        // GlobalUtil.openItemTips(item)
        gdk.panel.open(PanelId.CommanderSkillTip, (node: cc.Node) => {
            let comp = node.getComponent(CommanderSkillTipCtrl);
            comp.showSkillInfo(this.skillId, this.skillLv, false);
        });
    }


}
