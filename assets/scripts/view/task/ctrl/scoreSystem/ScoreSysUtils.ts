import BYModel from '../../../bingying/model/BYModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import RoleModel from '../../../../common/models/RoleModel';
import TaskModel from '../../model/TaskModel';
import TaskUtil from '../../util/TaskUtil';
import { BagItem } from '../../../../common/models/BagModel';
import { MissionType } from '../TaskViewCtrl';
import { Rune_unlockCfg } from '../../../../a/config';
import { ScoreSysBqItemType } from './ScoreSysBqPanelCtrl';

export default class ScoreSysUtils {

    static get heroModel(): HeroModel { return ModelManager.get(HeroModel); }
    static get byModel(): BYModel { return ModelManager.get(BYModel); }
    static get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    /**当前的变强是否可以提升 */
    static is_can_upgrade(isGuide: boolean = false) {
        let model = ModelManager.get(TaskModel);
        let list = TaskUtil.getGradingTaskList()
        if (list.length == 0) return false;
        let datas = []
        for (let index = 0; index < list.length; index++) {
            const cfg = list[index];
            // 是否已完成
            let finish = TaskUtil.getTaskState(cfg.id)
            let geted = model.rewardIds[cfg.id] || 0
            // 任务状态 0:可领取 1:未完成 2:已领取
            let state = 1
            if (finish) {
                if (geted == 0) {
                    state = 0
                } else {
                    state = 2
                }
            }
            let isOpen = 0
            if (TaskUtil.getGradingTaskIsOpen(cfg.id)) {
                isOpen = 1
            }
            let info: ScoreSysBqItemType = { type: MissionType.grading, state: state, cfg: cfg, isOpen: isOpen, index: index }
            datas.push(info)
        }

        /**任务列表排序, */
        GlobalUtil.sortArray(datas, (a, b) => {
            if (a.state == b.state) {
                if (a.isOpen == b.isOpen) {
                    return a.cfg.id - b.cfg.id
                }
                return b.isOpen - a.isOpen // 已开启>未开启
            }
            return a.state - b.state
        })
        for (let i = 0; i < datas.length; i++) {
            datas[i].index = i
        }


        for (let i = 0; i < datas.length; i++) {
            if (datas[i].state == 1) {
                let cfg = datas[i].cfg
                if (cfg.target == 412) {
                    //英雄升星
                    let heroInfos = this.getHeroInfos(true)
                    for (let j = 0; j < heroInfos.length; j++) {
                        let info = heroInfos[j] as icmsg.HeroInfo
                        if (info.star < cfg.args) {
                            if (RedPointUtils.is_can_star_up(info)) {
                                if (isGuide) {
                                    this.roleModel.gradingGuideIndex = datas[i].index
                                }
                                return true
                            }
                        }
                    }
                } else if (cfg.target == 408) {
                    //英雄升级
                    let heroInfos = this.getHeroInfos(true)
                    for (let j = 0; j < heroInfos.length; j++) {
                        let info = heroInfos[j] as icmsg.HeroInfo
                        if (info.level <= cfg.args) {
                            if (RedPointUtils.is_can_hero_upgrade(info)) {
                                if (isGuide) {
                                    this.roleModel.gradingGuideIndex = datas[i].index
                                }
                                return true
                            }
                        }
                    }
                } else if (cfg.target == 701) {
                    //符文
                    let heroInfos = this.getHeroInfos()
                    let limitCfg = ConfigManager.getItemById(Rune_unlockCfg, 1);
                    for (let j = 0; j < heroInfos.length; j++) {
                        let info = heroInfos[j] as icmsg.HeroInfo
                        if ((limitCfg.level && info.level >= limitCfg.level) || (limitCfg.star && info.star >= limitCfg.star)) {
                            if (isGuide) {
                                this.roleModel.gradingGuideIndex = datas[i].index
                            }
                            return true
                        }
                    }
                } else if (cfg.target == 105) {
                    // 兵营升级
                    let byTypes = [1, 3, 4]
                    let lv = 0
                    for (let j = 0; j < byTypes.length; j++) {
                        lv += this.byModel.byLevelsData[byTypes[j] - 1]
                    }
                    if (lv < cfg.number) {
                        for (let j = 0; j < byTypes.length; j++) {
                            if (RedPointUtils.is_can_barracks_practice(byTypes[j])) {
                                if (isGuide) {
                                    this.roleModel.gradingGuideIndex = datas[i].index
                                }
                                return true
                            }
                        }
                    }
                }
            }
        }
        return false
    }


    //获得英雄列表 出战英雄排前面
    static getHeroInfos(isUpFight: boolean = false) {
        let heroInfos = this.heroModel.heroInfos
        //排序
        heroInfos.sort(this.sortFunc1)
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
    static sortFunc1(a: any, b: any) {
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