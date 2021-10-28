import BagUtils from '../../../common/utils/BagUtils';
import CommanderSkillTipCtrl from '../../role/ctrl2/main/skill/CommanderSkillTipCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GeneralModel from '../../../common/models/GeneralModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../common/models/BagModel';
import { ItemCfg, Mission_grow_chapterCfg } from '../../../a/config';
/*
 * @Author: your name
 * @Date: 2020-04-27 19:02:39
 * @LastEditTime: 2020-04-29 19:22:18
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\scripts\view\task\ctrl\AwardItemCtrl.ts
 */

/** 
 * @Description: 
 * @Author: weiliang.huang  
 * @Date: 2019-03-25 17:29:13 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-01-08 14:01:26
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/GrowRewardItemCtrl")
export default class GrowRewardItemCtrl extends cc.Component {

    @property(cc.Node)
    shakeNode: cc.Node = null

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    skillNode: cc.Node = null

    @property(cc.Label)
    indexLab: cc.Label = null

    @property(cc.Node)
    hasGet: cc.Node = null

    @property(cc.Node)
    on: cc.Node = null

    @property(cc.Node)
    itemMask: cc.Node = null

    @property(cc.Node)
    skillMask: cc.Node = null//被动技能遮罩

    @property(cc.Node)
    skillMask2: cc.Node = null//主动技能遮罩

    @property(cc.Node)
    select: cc.Node = null

    _canReward: boolean = false
    _chapterId: number = 0
    growChapterCfg: Mission_grow_chapterCfg
    itemCfg: ItemCfg
    _skillLv: number = 0

    _activeSkills = [99030, 99050, 99060]

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this._itemClick, this)
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this._itemClick, this)
        let ani = this.shakeNode.getComponent(cc.Animation)
        ani.stop("reward_shake")
    }

    updateInfo(gCfg: Mission_grow_chapterCfg, chapterId: number, canReward: boolean, index: number) {
        this.growChapterCfg = gCfg
        this._canReward = canReward
        this._chapterId = chapterId
        this.itemCfg = ConfigManager.getItemById(ItemCfg, this.growChapterCfg.reward[0])
        this.indexLab.string = `${index}`

        let grayLvNode = this.skillNode.getChildByName("grayLvNode")
        let grayLvLab = grayLvNode.getChildByName("grayLv").getComponent(cc.Label)
        grayLvNode.active = false

        if (this.itemCfg.func_id == "gnr_skill_lvup") {
            this.slot.node.active = false
            this.skillNode.active = true
            let skillId = this.itemCfg.func_args[0]
            let bg = this.skillNode.getChildByName("bg")
            let bgName = this._activeSkills.indexOf(skillId) >= 0 ? "common/texture/task/jn_yuan01" : "common/texture/career/sub_skillbg";
            GlobalUtil.setSpriteIcon(this.skillNode, bg, `${bgName}`)
            let icon = this.skillNode.getChildByName("icon")
            let lvNode = this.skillNode.getChildByName("lvNode")
            let lvLab = lvNode.getChildByName("lv").getComponent(cc.Label)
            lvNode.active = this._activeSkills.indexOf(skillId) >= 0

            GlobalUtil.setSpriteIcon(this.skillNode, icon, GlobalUtil.getSkillIcon(skillId))
            let generalModel = ModelManager.get(GeneralModel)
            let skills = generalModel.generalInfo.skills
            for (let i = 0; i < skills.length; i++) {
                if (skills[i].skillId == skillId) {
                    if (this.growChapterCfg.id < chapterId) {
                        lvLab.string = `${skills[i].skillLv}`
                        grayLvLab.string = `${skills[i].skillLv}`
                        this._skillLv = skills[i].skillLv
                    } else {
                        lvLab.string = `${skills[i].skillLv + 1}`
                        grayLvLab.string = `${skills[i].skillLv + 1}`
                        this._skillLv = skills[i].skillLv + 1
                    }
                    break
                }
            }
        } else {
            this.slot.node.active = true
            this.skillNode.active = false
            this.slot.updateItemInfo(this.growChapterCfg.reward[0], this.growChapterCfg.reward[1])
        }

        if (this.growChapterCfg.id < chapterId) {
            this.select.active = false
            this.on.active = true
            this.hasGet.active = true

            //已领取的
            if (this.itemCfg.func_id == "gnr_skill_lvup") {
                let skillId = this.itemCfg.func_args[0]
                if (this._activeSkills.indexOf(skillId) > 0) {
                    this.skillMask2.active = true
                    grayLvNode.active = true
                } else {
                    this.skillMask.active = true
                }
            } else {
                this.itemMask.active = true
            }
        } else if (this.growChapterCfg.id == chapterId) {
            this.select.active = true
            this.on.active = false
        }

        if (this._canReward && this.growChapterCfg.id == this._chapterId) {
            let ani = this.shakeNode.getComponent(cc.Animation)
            ani.play("reward_shake")
        }
    }

    _itemClick() {
        if (this._canReward && this.growChapterCfg.id == this._chapterId) {
            let ani = this.shakeNode.getComponent(cc.Animation)
            ani.stop("reward_shake")
            NetManager.send(new icmsg.MissionGrowChapterAwardReq())
        } else {
            if (this.itemCfg.func_id == "gnr_skill_lvup") {
                gdk.panel.open(PanelId.CommanderSkillTip, (node: cc.Node) => {
                    let comp = node.getComponent(CommanderSkillTipCtrl);
                    comp.showSkillInfo(this.itemCfg.func_args[0], this._skillLv, this.growChapterCfg.id > this._chapterId);
                });
            } else {
                let type = BagUtils.getItemTypeById(this.growChapterCfg.reward[0])
                let item: BagItem = {
                    series: this.growChapterCfg.reward[0],
                    itemId: this.growChapterCfg.reward[0],
                    itemNum: this.growChapterCfg.reward[1],
                    type: type,
                    extInfo: null,
                }
                GlobalUtil.openItemTips(item, true)
            }

        }
    }
}