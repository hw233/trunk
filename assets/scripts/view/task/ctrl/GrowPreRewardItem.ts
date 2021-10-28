import CommanderSkillTipCtrl from '../../role/ctrl2/main/skill/CommanderSkillTipCtrl';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import TaskModel from '../model/TaskModel';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagType } from '../../../common/models/BagModel';
import { GrowPreRewardItemType, GrowPreRewardType } from './GrowPreRewardCtrl';

/**
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-11-15 16:34:45
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-25 14:44:12
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/task/GrowPreRewardItem")
export default class GrowPreRewardItem extends UiListItem {

    @property(cc.RichText)
    title: cc.RichText = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    itemPre: cc.Node = null;

    reward: GrowPreRewardType

    get model(): TaskModel { return ModelManager.get(TaskModel); }

    _activeSkills = [99030, 99050, 99060]

    updateView() {
        this.reward = this.data
        this.title.string = this.reward.title
        let items = this.reward.items
        this.content.removeAllChildren()
        for (let j = 0; j < items.length; j++) {
            let item: GrowPreRewardItemType = items[j]
            let ele = cc.instantiate(this.itemPre)
            ele.active = true
            ele.y = 0
            ele.parent = this.content
            let slot = ele.getChildByName("UiSlotItem").getComponent(UiSlotItem)
            let skillNode = ele.getChildByName("skillNode")
            if (item.lv > 0) {
                //技能
                slot.node.active = false
                skillNode.active = true
                let bg = skillNode.getChildByName("bg")
                let icon = skillNode.getChildByName("icon")
                let bgName = this._activeSkills.indexOf(item.id) >= 0 ? "common/texture/task/jn_yuan01" : "common/texture/career/sub_skillbg";
                GlobalUtil.setSpriteIcon(skillNode, bg, `${bgName}`)
                let lvNode = skillNode.getChildByName("lvNode")
                lvNode.active = this._activeSkills.indexOf(item.id) >= 0
                let lvLab = lvNode.getChildByName("lv").getComponent(cc.Label)
                GlobalUtil.setSpriteIcon(skillNode, icon, GlobalUtil.getSkillIcon(item.id))
                lvLab.string = `${item.lv}`
                skillNode.on(cc.Node.EventType.TOUCH_END, () => {
                    gdk.panel.open(PanelId.CommanderSkillTip, (node: cc.Node) => {
                        let comp = node.getComponent(CommanderSkillTipCtrl);
                        comp.showSkillInfo(item.id, item.lv, true);
                    });
                }, this)
            } else {
                slot.node.active = true
                skillNode.active = false
                slot.updateItemInfo(item.id, item.num)
                slot.itemInfo = {
                    itemId: item.id,
                    type: BagType.ITEM,
                    series: item.id,
                    itemNum: 1,
                    extInfo: null,
                }
            }
        }

        this.content.x = -(items.length * this.itemPre.width) / 2
    }
}