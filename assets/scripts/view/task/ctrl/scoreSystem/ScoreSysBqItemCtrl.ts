import BagModel, { BagItem, BagType } from '../../../../common/models/BagModel';
import BagUtils from '../../../../common/utils/BagUtils';
import BYModel from '../../../bingying/model/BYModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import EquipUtils from '../../../../common/utils/EquipUtils';
import EquipViewCtrl2 from '../../../role/ctrl2/equip/EquipViewCtrl2';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import HeroModel from '../../../../common/models/HeroModel';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import RoleModel from '../../../../common/models/RoleModel';
import RuneStrengthenPanelCtrl from '../../../role/ctrl2/rune/RuneStrengthenPanelCtrl';
import TaskUtil from '../../util/TaskUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiProgress from '../../../../common/widgets/UiProgress';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import {
    Item_equipCfg,
    Item_rubyCfg,
    Rune_unlockCfg,
    RuneCfg,
    Score_missionCfg
    } from '../../../../a/config';
import { ScoreSysBqItemType } from './ScoreSysBqPanelCtrl';

/**
 * @Description: 任务子项
 * @Author: weiliang.huang
 * @Date: 2019-03-25 16:34:58
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-04-02 10:00:41
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysBqItemCtrl")
export default class ScoreSysBqItemCtrl extends UiListItem {

    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.Node)
    titleIcon: cc.Node = null;

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
    activeLab: cc.Label = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    rewardContent: cc.Node = null;

    @property(cc.Node)
    stateNo: cc.Node = null;

    @property(cc.Node)
    stateYes: cc.Node = null;

    info: ScoreSysBqItemType
    goId: number = 0

    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }
    get byModel(): BYModel { return ModelManager.get(BYModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get bagModel(): BagModel { return ModelManager.get(BagModel); }

    updateView() {
        this.info = this.data
        let cfg = this.info.cfg
        this.goId = cfg["forward"]
        let state = this.info.state
        this.descLab.string = ""

        this.geted.active = state == 2
        this.pro.node.active = false
        this.goBtn.node.active = false
        this.getBtn.node.active = state == 0 || (state != 2 && cfg.target == 0)
        this.getBtn.interactable = true;

        this.activeLab.node.active = false
        this.mask.active = state == 2

        this.stateNo.active = false
        this.stateYes.active = false

        let proTab = TaskUtil.getTaskFinishNum(cfg.id)
        let cur = proTab[0]
        let max = proTab[1]

        if (state == 1) {
            this.pro.node.active = true
            this.goBtn.node.active = true
            this.stateNo.active = true
        }

        let path = cfg.difficulty == 1 ? 'pfxt_kunlan' : 'pfxt_putong'
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, `view/task/texture/scoreSystem/${path}`)
        if (cfg.icon) {
            GlobalUtil.setSpriteIcon(this.node, this.iconNode, `view/task/texture/scoreSystem/${cfg.icon}`)
        }
        this.activeLab.node.active = !TaskUtil.getGradingTaskIsOpen(cfg.id)
        if (this.activeLab.node.active) {
            this.goBtn.node.active = false
            this.getBtn.node.active = false
            this.pro.node.active = false
            this.rewardContent.active = false
            this.titleLab.string = cfg.unlock_name
            this.descLab.string = cfg.unlock_desc
            this.activeLab.string = cfg.unlock
        } else {
            this.titleLab.string = cfg.name
            this.rewardContent.active = true
            this._updateAwardInfo(cfg)
        }

        this.proLab.string = `${cur}/${max}`
        let per = cur / max
        per = Math.min(per, 1)
        this.pro.progress = per

        if (this.info.index == this.roleModel.gradingGuideIndex) {
            if (this.goBtn.node.active) {
                GuideUtil.bindGuideNode(16000, this.goBtn.node)
                GuideUtil.setGuideId(210010);
            }
        }

        if (cfg.target == 412) {
            //英雄升星
            let heroInfos = this._getHeroInfos(true)
            for (let i = 0; i < heroInfos.length; i++) {
                let info = heroInfos[i] as icmsg.HeroInfo
                if (info.star < cfg.args) {
                    if (RedPointUtils.is_can_star_up(info) && !TaskUtil.getTaskState(cfg.id)) {
                        this.stateYes.active = true
                        break
                    }
                }
            }
        } else if (cfg.target == 408) {
            //英雄升级
            let heroInfos = this._getHeroInfos(true)
            for (let i = 0; i < heroInfos.length; i++) {
                let info = heroInfos[i] as icmsg.HeroInfo
                if (info.level <= cfg.args) {
                    if (RedPointUtils.is_can_hero_upgrade(info) && !TaskUtil.getTaskState(cfg.id)) {
                        this.stateYes.active = true
                        break
                    }
                }
            }
        } else if (cfg.target == 701) {
            //符文穿戴
            let heroInfos = this._getHeroInfos()
            let limitCfg = ConfigManager.getItemById(Rune_unlockCfg, 1);
            for (let i = 0; i < heroInfos.length; i++) {
                let info = heroInfos[i] as icmsg.HeroInfo
                if (((limitCfg.level && info.level >= limitCfg.level) || (limitCfg.star && info.star >= limitCfg.star))
                    && !TaskUtil.getTaskState(cfg.id)) {
                    this.stateYes.active = true
                    break
                }
            }
        } else if (cfg.target == 702) {
            //符文升级
            let heroInfos = this._getHeroInfos(true)
            let heroInfo: icmsg.HeroInfo = null
            let targetLv = 0
            let targetId = 0
            let num = cfg.number
            for (let n = 0; n < num; n++) {
                for (let i = 0; i < heroInfos.length; i++) {
                    let info = heroInfos[i] as icmsg.HeroInfo
                    let runes = info.runes
                    for (let j = 0; j < runes.length; j++) {
                        let runeCfg = runes[j] ? ConfigManager.getItemById(RuneCfg, parseInt(runes[j].toString().slice(0, 6))) : null;
                        if (runeCfg && runeCfg.level < cfg.args && runeCfg.level > targetLv) {
                            targetId = runeCfg.rune_id
                            targetLv = runeCfg.level
                            heroInfo = info
                            if (targetLv >= cfg.args || !runeCfg.strengthening) {
                                targetId = 0
                                targetLv = 0
                                heroInfo = null
                            }
                        }
                    }
                }
                if (targetLv > 0 && heroInfo && !TaskUtil.getTaskState(cfg.id)) {
                    let r_cfg = ConfigManager.getItemById(RuneCfg, parseInt(targetId.toString().slice(0, 6)))
                    if (r_cfg.strengthening && BagUtils.getItemNumById(r_cfg.strengthening[0][0]) >= r_cfg.strengthening[0][1]) {
                        this.stateYes.active = true
                        break
                    }
                }
            }
        } else if (cfg.target == 105) {
            // 兵营升级
            let byTypes = [1, 3, 4]
            let lv = 0
            for (let i = 0; i < byTypes.length; i++) {
                lv += this.byModel.byLevelsData[byTypes[i] - 1]
            }
            if (lv < cfg.number) {
                for (let i = 0; i < byTypes.length; i++) {
                    if (RedPointUtils.is_can_barracks_practice(byTypes[i]) && !TaskUtil.getTaskState(cfg.id)) {
                        this.stateYes.active = true
                        break
                    }
                }
            }
        } else if (cfg.target == 507) {
            //是否有白色1星或以上装备
            let equipItems = EquipUtils.getEquipItems()
            let count = 0
            equipItems.forEach(element => {
                let equipCfg = ConfigManager.getItemById(Item_equipCfg, element.itemId)
                if (equipCfg.color >= 0 && equipCfg.star >= 1) {
                    count++
                }
            });
            if (count >= cfg.number && !TaskUtil.getTaskState(cfg.id)) {
                this.stateYes.active = true
            }
        } else if (cfg.target == 514) {
            let equipItems = EquipUtils.getEquipItems()
            let args = (cfg.args as number).toString().split("0")   //第一位  颜色  后两位星级
            let color = parseInt(args[0])
            let star = parseInt(args[1])
            let count = 0
            equipItems.forEach(element => {
                let equipCfg = ConfigManager.getItemById(Item_equipCfg, element.itemId)
                if (equipCfg.color >= color && equipCfg.star >= star) {
                    count++
                }
            });
            if (count >= cfg.number && !TaskUtil.getTaskState(cfg.id)) {
                this.stateYes.active = true
            }
        }
    }

    // /**更新奖励信息 */
    _updateAwardInfo(cfg: Score_missionCfg) {
        for (let index = 0; index < this.slots.length; index++) {
            let slot = this.slots[index]
            let reward = cfg.rewards[index]
            if (reward) {
                slot.node.active = true
                let itemId = reward[0]
                let num = reward[1]
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


    /**做任务 */
    doTask() {
        if (this.goId && this.goId > 0) {
            let cfg = this.info.cfg
            if (cfg.target == 412) {
                //英雄升星
                let heroInfos = this._getHeroInfos(true)
                for (let i = 0; i < heroInfos.length; i++) {
                    let info = heroInfos[i] as icmsg.HeroInfo
                    if (info.star < cfg.args) {
                        if (RedPointUtils.is_can_star_up(info)) {
                            this._checkView()
                            gdk.panel.hide(PanelId.ScoreSytemView)
                            JumpUtils.openEquipPanelById(info.heroId, [0])
                            gdk.Timer.callLater(this, () => {
                                gdk.panel.open(PanelId.SubSkillPanel2, () => {
                                    gdk.panel.open(PanelId.StarUpdateView)
                                    gdk.Timer.once(200, this, () => {
                                        GuideUtil.setGuideId(210007);
                                    })
                                })
                            })
                            return
                        }
                    }
                }
            } else if (cfg.target == 408) {
                //英雄升级
                let heroInfos = this._getHeroInfos(true)
                for (let i = 0; i < heroInfos.length; i++) {
                    let info = heroInfos[i] as icmsg.HeroInfo
                    if (info.level <= cfg.args) {
                        if (RedPointUtils.is_can_hero_upgrade(info)) {
                            this._checkView()
                            gdk.panel.hide(PanelId.ScoreSytemView)
                            JumpUtils.openEquipPanelById(info.heroId, [0])
                            gdk.Timer.once(200, this, () => {
                                GuideUtil.setGuideId(210006);
                            })
                            return
                        }
                    }
                }
            } else if (cfg.target == 701) {
                //符文
                let heroInfos = this._getHeroInfos()
                let limitCfg = ConfigManager.getItemById(Rune_unlockCfg, 1);
                for (let i = 0; i < heroInfos.length; i++) {
                    let info = heroInfos[i] as icmsg.HeroInfo
                    if ((limitCfg.level && info.level >= limitCfg.level) || (limitCfg.star && info.star >= limitCfg.star)) {
                        this._checkView()
                        gdk.panel.hide(PanelId.ScoreSytemView)
                        JumpUtils.openEquipPanelById(info.heroId, [1])
                        gdk.Timer.callLater(this, () => {
                            gdk.panel.open(PanelId.SubEquipPanel2, () => {
                                gdk.Timer.once(200, this, () => {
                                    GuideUtil.setGuideId(210009);
                                })
                            })
                        })
                        return
                    }
                }
            } else if (cfg.target == 702) {
                //符文升级
                let heroInfos = this._getHeroInfos(true)
                let heroInfo: icmsg.HeroInfo = null
                let targetLv = 0
                let targetId = 0

                let num = cfg.number
                for (let n = 0; n < num; n++) {
                    for (let i = 0; i < heroInfos.length; i++) {
                        let info = heroInfos[i] as icmsg.HeroInfo
                        let runes = info.runes
                        for (let j = 0; j < runes.length; j++) {
                            let runeCfg = runes[j] ? ConfigManager.getItemById(RuneCfg, parseInt(runes[j].toString().slice(0, 6))) : null;
                            if (runeCfg && runeCfg.level < cfg.args && runeCfg.level > targetLv) {
                                targetId = runeCfg.rune_id
                                targetLv = runeCfg.level
                                heroInfo = info
                                if (targetLv >= cfg.args || !runeCfg.strengthening) {
                                    targetId = 0
                                    targetLv = 0
                                    heroInfo = null
                                }
                            }
                        }
                    }
                    if (targetLv > 0 && heroInfo && !TaskUtil.getTaskState(cfg.id)) {
                        let r_cfg = ConfigManager.getItemById(RuneCfg, parseInt(targetId.toString().slice(0, 6)))
                        if (r_cfg.strengthening && BagUtils.getItemNumById(r_cfg.strengthening[0][0]) >= r_cfg.strengthening[0][1]) {
                            JumpUtils.openPanel({
                                panelId: PanelId.EquipView2,
                                panelArgs: { args: 2 },
                                callback: (node: cc.Node) => {
                                    let ctrl = node.getComponent(EquipViewCtrl2);
                                    ctrl._onPanelShow = (node: cc.Node) => {
                                        if (!node) return;
                                        gdk.panel.hide(PanelId.ScoreSytemView)
                                        let runeMergeCtrl = node.getComponent(RuneStrengthenPanelCtrl);
                                        let runeInfo = new icmsg.RuneInfo();
                                        runeInfo.id = targetId;
                                        runeInfo.heroId = heroInfo.heroId;
                                        runeMergeCtrl.selectById(runeInfo);
                                        ctrl._onPanelShow = null;
                                    };
                                },
                            })
                            return
                        }
                    }
                }

            } else if (cfg.target == 105) {
                // 兵营升级
                let byTypes = [1, 3, 4]
                let lv = 0
                for (let i = 0; i < byTypes.length; i++) {
                    lv += this.byModel.byLevelsData[byTypes[i] - 1]
                }
                if (lv < cfg.number) {
                    for (let i = 0; i < byTypes.length; i++) {
                        if (RedPointUtils.is_can_barracks_practice(byTypes[i])) {
                            this._checkView()
                            gdk.panel.hide(PanelId.ScoreSytemView)
                            gdk.panel.setArgs(PanelId.BYView, byTypes[i])
                            gdk.panel.open(PanelId.BYView)
                            gdk.Timer.once(200, this, () => {
                                GuideUtil.setGuideId(210008);
                            })
                            return
                        }
                    }
                }
            } else if (cfg.target == 507) {
                //是否有白色1星或以上装备
                let equipItems = EquipUtils.getEquipItems()
                let count = 0
                equipItems.forEach(element => {
                    let equipCfg = ConfigManager.getItemById(Item_equipCfg, element.itemId)
                    if (equipCfg.color >= 0 && equipCfg.star >= 1) {
                        count++
                    }
                });
                if (count >= cfg.number) {
                    let heroInfos = this._getHeroInfos(true)
                    for (let i = 0; i < heroInfos.length; i++) {
                        let info = heroInfos[i] as icmsg.HeroInfo
                        gdk.panel.hide(PanelId.ScoreSytemView)
                        JumpUtils.openEquipPanelById(info.heroId, [1])
                        gdk.Timer.callLater(this, () => {
                            gdk.panel.open(PanelId.SubEquipPanel2)
                        })
                    }
                    return
                }
            } else if (cfg.target == 514) {
                let equipItems = EquipUtils.getEquipItems()
                let args = (cfg.args as number).toString().split("0")   //第一位  颜色  后两位星级
                let color = parseInt(args[0])
                let star = parseInt(args[1])
                let count = 0
                equipItems.forEach(element => {
                    let equipCfg = ConfigManager.getItemById(Item_equipCfg, element.itemId)
                    if (equipCfg.color >= color && equipCfg.star >= star) {
                        count++
                    }
                });
                if (count >= cfg.number) {
                    let heroInfos = this._getHeroInfos(true)
                    for (let i = 0; i < heroInfos.length; i++) {
                        let info = heroInfos[i] as icmsg.HeroInfo
                        gdk.panel.hide(PanelId.ScoreSytemView)
                        JumpUtils.openEquipPanelById(info.heroId, [1])
                        gdk.Timer.callLater(this, () => {
                            gdk.panel.open(PanelId.SubEquipPanel2)
                        })
                    }
                }
            }
            this.roleModel.gradingGuideIndex = -1
            gdk.panel.setArgs(PanelId.GainWayTips, cfg.gain_item, cfg.gain)
            gdk.panel.open(PanelId.GainWayTips)
        }
    }

    _checkView() {
        let node = gdk.panel.get(PanelId.PveSceneFailPanel)
        if (node) {
            gdk.panel.hide(PanelId.PveSceneFailPanel)
        }
    }

    /**领取任务奖励 */
    getAwards() {
        this.roleModel.gradingGuideIndex = -1
        let msg = new icmsg.MissionRewardReq();
        msg.kind = 1
        msg.type = this.info.type
        msg.id = this.info.cfg.id;
        NetManager.send(msg, (data: icmsg.MissionRewardRsp) => {
            GlobalUtil.openRewadrView(data.list)
        });
    }


    //获得英雄列表 出战英雄排前面
    _getHeroInfos(isUpFight: boolean = false) {
        let heroInfos = this.heroModel.heroInfos
        //排序
        heroInfos.sort(this._sortFunc1)
        let upHeroIds = this.heroModel.PveUpHeroList
        let upList = []
        let otherList = []
        for (let i = 0; i < upHeroIds.length; i++) {
            let bagItem: BagItem = this.heroModel.idItems[upHeroIds[i]]
            if (bagItem) {
                upList.push(bagItem.extInfo)
            }
        }
        if (isUpFight) {
            return upList
        }

        for (let j = 0; j < heroInfos.length; j++) {
            let info = heroInfos[j].extInfo as icmsg.HeroInfo
            if (upHeroIds.indexOf(info.heroId) == -1) {
                otherList.push(info)
            }
        }
        return upList.concat(otherList)
    }

    //排序方法  战力>星星>id
    _sortFunc1(a: any, b: any) {
        let heroInfoA = <icmsg.HeroInfo>a.extInfo;
        let heroInfoB = <icmsg.HeroInfo>b.extInfo;
        if (heroInfoA.power == heroInfoB.power) {
            if (heroInfoA.star == heroInfoB.star) {
                return heroInfoA.typeId - heroInfoB.typeId;
            }
            else {
                return heroInfoB.star - heroInfoA.star;
            }
        }
        else {
            return heroInfoB.power - heroInfoA.power;
        }
    }
}
