import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import DiamondFlyCtrl from '../../../common/widgets/DiamondFlyCtrl';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import StringUtils from '../../../common/utils/StringUtils';
import TaskModel from '../model/TaskModel';
import TaskUtil from '../util/TaskUtil';
import TaskViewCtrl, { MissionType, TaskItemType } from './TaskViewCtrl';
import UiListItem from '../../../common/widgets/UiListItem';
import UiProgress from '../../../common/widgets/UiProgress';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../common/models/BagModel';
import {
    Hero_careerCfg,
    HeroCfg,
    Item_equipCfg,
    Item_rubyCfg,
    Mission_dailyCfg,
    Mission_main_lineCfg,
    Mission_weeklyCfg
    } from '../../../a/config';
import { TaskEventId } from '../enum/TaskEventId';

/**
 * @Description: 任务子项
 * @Author: weiliang.huang
 * @Date: 2019-03-25 16:34:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-16 16:15:26
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/TaskItemCtrl")
export default class TaskItemCtrl extends UiListItem {

    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Label)
    descLab: cc.Label = null;

    @property(cc.Button)
    goBtn: cc.Button = null;
    @property(cc.Button)
    getBtn: cc.Button = null;

    @property(cc.Node)
    geted: cc.Node = null;

    @property(UiSlotItem)
    slots: UiSlotItem[] = [];

    @property(UiProgress)
    pro: UiProgress = null;

    @property(cc.Label)
    proLab: cc.Label = null;

    @property(cc.Label)
    numLab: cc.Label = null;

    @property(cc.Node)
    titleIcon1: cc.Node = null;

    @property(cc.Node)
    titleIcon2: cc.Node = null;

    @property(cc.Layout)
    layout: cc.Layout = null;

    @property(cc.Label)
    activeLab: cc.Label = null;

    @property(cc.Node)
    mask: cc.Node = null;

    info: TaskItemType = null
    goId: number = 0

    get model(): TaskModel { return ModelManager.get(TaskModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    updateView() {
        this.info = this.data
        let cfg = this.info.cfg
        this.goId = cfg["forward"]
        this.titleLab.string = `${cfg["title"] ? cfg["title"] : 0}`
        let descText = cfg.desc
        // 带{number}需要替换为指定数量
        if (descText.indexOf("{number}") >= 0) {
            let replaceText = `${cfg.number}`
            if (cfg.target == 603) {
                // 603为竞技场名次要求,替换为目标名次
                replaceText = `${cfg["args"][0]}`
            }
            descText = descText.replace("{number}", replaceText)
        }
        let type = this.info.type
        let state = this.info.state

        this.descLab.string = descText
        //成就显示title
        if (type != 3) {
            this.titleLab.string = descText
            this.descLab.string = ``
        }

        this.geted.active = state == 2
        this.pro.node.active = false
        this.numLab.node.active = false
        this.goBtn.node.active = false
        this.getBtn.node.active = state == 0 || (state != 2 && cfg.target == 0)
        this.getBtn.interactable = true;

        this.titleIcon1.active = type != 4
        this.titleIcon2.active = type == 4
        this.layout.paddingLeft = 10
        if (type == 4 && cfg instanceof Mission_main_lineCfg) {
            this.layout.paddingLeft = 0
            GlobalUtil.setSpriteIcon(this.node, this.titleIcon2, `view/task/texture/reward/rw_yeqian0${cfg.logo}`)
        }

        this.activeLab.node.active = false
        this.mask.active = state == 2


        let proTab = TaskUtil.getTaskFinishNum(cfg.id)
        let cur = proTab[0]
        let max = proTab[1]

        //1日常，2周常，3成就，4主线，5七天 6 公会任务
        if (type == 3 || type == 4) {
            this._updateAwardInfo(cfg)
            // let proTab = TaskUtil.getTaskFinishNum(cfg.id)
            // let cur = proTab[0]
            // let max = proTab[1]
            if (cfg.target == 603) {
                if (state == 1) {
                    this.numLab.node.active = true
                    let rankText = gdk.i18n.t('i18n:TASK_TIP10')
                    if (cur > 0) {
                        rankText = `${cur}`
                    }
                    this.numLab.string = `${gdk.i18n.t('i18n:当前排名')}:${rankText}`
                }
            } else if (state == 1) {
                this.pro.node.active = true
                this.pro.node.x = 194
                if (cfg.target == 105) {
                    cur = cur == 0 ? 3 : cur
                }
            }

            if (type == 3) {
                this.activeLab.node.active = !TaskUtil.getAchieveTaskIsOpen(cfg.id)
                if (this.activeLab.node.active) {
                    this.activeLab.string = StringUtils.format(gdk.i18n.t('i18n:TASK_TIP12'), cfg["level"])
                    this.mask.active = true
                    this.goBtn.node.active = false
                    this.getBtn.node.active = false
                    this.numLab.node.active = false
                    this.pro.node.active = false
                }
            }
        } else if (type == MissionType.guild) {
            this._updateGuildAwardInfo(cfg)
            if (state == 1) {
                this.pro.node.active = true
                this.pro.node.x = -100
                let nums = TaskUtil.getGuildTaskFinishNum(cfg.id)
                cur = nums[0]
                max = nums[1]
                if (this.goId && this.goId > 0) {
                    this.goBtn.node.active = true
                }
            }
        } else {
            this.pro.node.active = true
            this.pro.node.x = -100
            if (state == 1 && this.goId && this.goId > 0) {
                this.goBtn.node.active = true
            }
            if (state == 1 && this.goId == 0) {
                let label = this.getBtn.node.getChildByName("label").getComponent(cc.Label);
                GlobalUtil.setGrayState(label, 1);
                this.getBtn.node.active = true;
                this.getBtn.interactable = false;
            }

            if (type == 1) {
                this.activeLab.node.active = !TaskUtil.getDailyTaskIsOpen(cfg.id)
                if (this.activeLab.node.active) {
                    this.activeLab.string = `${(cfg as Mission_dailyCfg).unlock}`
                    this.mask.active = true
                    this.goBtn.node.active = false
                    this.getBtn.node.active = false
                }
            } else if (type == 2) {
                this.activeLab.node.active = !TaskUtil.getWeeklyTaskIsOpen(cfg.id)
                if (this.activeLab.node.active) {
                    this.activeLab.string = `${(cfg as Mission_weeklyCfg).unlock}`
                    this.mask.active = true
                    this.goBtn.node.active = false
                    this.getBtn.node.active = false
                }
            }

            //挂机时间统计
            if (cfg.target == 210) {
                max = Math.floor(max / 3600)
                cur = Math.floor(cur / 3600)
            }

            //更新活跃度奖励显示
            this._updateActiveInfo(cfg)
        }

        this.proLab.string = `${cur}/${max}`
        let per = cur / max
        per = Math.min(per, 1)
        this.pro.progress = per

        if (this.getBtn.node.active) {
            if (this.model.isGuide) {
                this.model.isGuide = false
                GuideUtil.bindGuideNode(8001, this.getBtn.node)
            }
        }
    }

    recycleItem() {
        super.recycleItem();
        if (!this.getBtn.interactable) {
            let label = this.getBtn.node.getChildByName("label").getComponent(cc.Label);
            GlobalUtil.setGrayState(label, 0);
        }
    }

    /**更新奖励信息 */
    _updateAwardInfo(cfg) {
        if (this.info.type == 3) {
            let rewards = cfg.rewards
            for (let i = 0; i < this.slots.length; i++) {
                let slot = this.slots[i]
                let reward = rewards[i]
                if (reward) {
                    slot.node.active = true
                    let itemId = rewards[i][0]
                    let num = rewards[i][1]
                    slot.updateItemInfo(itemId, num)
                    slot.onClick.offAll()
                    let itemType = BagUtils.getItemTypeById(itemId)
                    if (itemType == BagType.EQUIP) {
                        let cfg = ConfigManager.getItemById(Item_equipCfg, itemId)
                        slot.updateStar(cfg.star)
                    } else if (itemType == BagType.JEWEL) {
                        let cfg = ConfigManager.getItemById(Item_rubyCfg, itemId)
                        slot.updateStar(cfg.level)
                        let quality = Math.min(cfg.level, 6)
                        slot.updateQuality(quality)
                    } else if (itemType == BagType.HERO) {
                        let cfg = ConfigManager.getItemById(HeroCfg, itemId)
                        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", cfg.career_id)
                        slot.updateCareer(careerCfg.career_type)
                    }
                    let item: BagItem = {
                        series: itemId,
                        itemId: itemId,
                        itemNum: num,
                        type: itemType,
                        extInfo: null
                    }
                    slot.itemInfo = item
                } else {
                    slot.itemInfo = null
                    slot.node.active = false
                }
            }
        } else {
            for (let index = 0; index < this.slots.length; index++) {
                let slot = this.slots[index]
                const key = `reward${index + 1}`;
                if (cfg[key]) {
                    slot.node.active = true
                    let itemId = cfg[key][0]
                    let num = cfg[key][1]
                    slot.updateItemInfo(itemId, num)
                    slot.onClick.offAll()
                    let itemType = BagUtils.getItemTypeById(itemId)
                    if (itemType == BagType.EQUIP) {
                        let cfg = ConfigManager.getItemById(Item_equipCfg, itemId)
                        if (cfg) {
                            slot.updateStar(cfg.star)
                        } else {
                            CC_DEBUG && cc.error("id=" + itemId + "不存在")
                        }

                    } else if (itemType == BagType.JEWEL) {
                        let cfg = ConfigManager.getItemById(Item_rubyCfg, itemId)
                        slot.updateStar(cfg.level)
                        let quality = Math.min(cfg.level, 6)
                        slot.updateQuality(quality)
                    } else if (itemType == BagType.HERO) {
                        let cfg = ConfigManager.getItemById(HeroCfg, itemId)
                        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", cfg.career_id)
                        slot.updateGroup(cfg.group[0])
                        slot.updateCareer(careerCfg.career_type)
                    }
                    let item: BagItem = {
                        series: itemId,
                        itemId: itemId,
                        itemNum: num,
                        type: itemType,
                        extInfo: null
                    }
                    slot.itemInfo = item
                } else {
                    slot.itemInfo = null
                    slot.node.active = false
                }
            }
        }
    }


    /**更新奖励信息 */
    _updateGuildAwardInfo(cfg) {
        for (let index = 0; index < this.slots.length; index++) {
            let slot = this.slots[index]
            const object = cfg.rewards[index];
            if (object) {
                slot.node.active = true
                let itemId = object[0]
                let num = object[1]
                slot.updateItemInfo(itemId, num)
                slot.onClick.offAll()
                let itemType = BagUtils.getItemTypeById(itemId)
                if (itemType == BagType.EQUIP) {
                    let cfg = ConfigManager.getItemById(Item_equipCfg, itemId)
                    slot.updateStar(cfg.star)
                } else if (itemType == BagType.JEWEL) {
                    let cfg = ConfigManager.getItemById(Item_rubyCfg, itemId)
                    slot.updateStar(cfg.level)
                    let quality = Math.min(cfg.level, 6)
                    slot.updateQuality(quality)
                }
                let item: BagItem = {
                    series: itemId,
                    itemId: itemId,
                    itemNum: num,
                    type: itemType,
                    extInfo: null
                }
                slot.itemInfo = item
            } else {
                slot.itemInfo = null
                slot.node.active = false
            }
        }
    }

    /**更新活跃度奖励显示 */
    _updateActiveInfo(cfg) {
        for (let index = 0; index < this.slots.length; index++) {
            let slot = this.slots[index]
            if (index == 0) {
                slot.node.active = true
                slot.updateItemInfo(cfg.icon, cfg.active)
                slot.onClick.on(() => {
                    GlobalUtil.openCommonInfoTip(slot.node, 11)
                })
            } else {
                slot.node.active = false
            }
        }

    }

    /**做任务 */
    doTask() {
        if (this.goId && this.goId > 0) {
            JumpUtils.openView(this.goId)
            if (this.goId == 2300 && gdk.panel.isOpenOrOpening(PanelId.Task)) {
                gdk.panel.hide(PanelId.Task);
            }
        }
    }

    /**领取任务奖励 */
    getAwards() {
        if (this.info.type == MissionType.guild) {
            let msg = new icmsg.GuildMissionRewardReq()
            msg.id = this.info.cfg.id
            NetManager.send(msg, (data: icmsg.GuildMissionRewardRsp) => {
                this.model.guildRewardIds[data.id] = 1
                GlobalUtil.openRewadrView(data.list)
                gdk.e.emit(TaskEventId.UPDATE_GUILD_TASK_REWARD)
            })
        } else {

            this.storeModel.vipPreLv = ModelManager.get(RoleModel).vipLv
            this.storeModel.vipPreExp = ModelManager.get(RoleModel).vipExp

            let msg = new icmsg.MissionRewardReq();
            msg.kind = 1
            msg.type = this.info.type
            msg.id = this.info.cfg.id;
            NetManager.send(msg, (data: icmsg.GuildMissionRewardRsp) => {
                if ([1, 2].indexOf(this.info.type) == -1) {
                    GlobalUtil.openRewadrView(data.list)
                }
            });

            if (this.info.type == 1 || this.info.type == 2) {
                let slot = this.slots[0]
                let ctrl = slot.getComponent(DiamondFlyCtrl)
                let panel = gdk.panel.get(PanelId.Task)
                let pos = null
                if (panel) {
                    let ctrl = panel.getComponent(TaskViewCtrl)
                    pos = ctrl.flyPosNode.getPos()
                }
                ctrl.flyAction(pos)
            }
        }

    }
}
