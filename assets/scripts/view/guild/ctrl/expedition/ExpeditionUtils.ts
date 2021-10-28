import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionModel from './ExpeditionModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import SdkTool from '../../../../sdk/SdkTool';
import { EXArmyPrivilegeType } from './army/ExpeditionArmyViewCtrl';
import {
    Expedition_buffCfg,
    Expedition_forcesCfg,
    Expedition_mapCfg,
    Expedition_missionCfg,
    Expedition_pointCfg,
    Expedition_powerCfg,
    Expedition_stageCfg,
    Expedition_strengthenCfg,
    Hero_careerCfg
    } from '../../../../a/config';
import { ExpeditionEventId } from './ExpeditionEventId';


export default class ExpeditionUtils {

    static get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    static armyTaskMap: { [node: number]: { [group: number]: Expedition_missionCfg[] } } = {};

    /**获取最新可放置的位置 */
    static getNewGridId() {
        let heros = this.expeditionModel.expeditionHeros
        let index = this.expeditionModel.expeditionHeros.length + 1
        for (let i = 0; i < heros.length; i++) {
            if (heros[i].heroId == 0) {
                index = heros[i].gridId
                break
            }
        }
        return index
    }

    static setTest(v) {
        this.expeditionModel.isTest = v
    }

    /**获得点的信息 */
    static findPointInfo(x, y) {
        let list = this.expeditionModel.expeditionPoints
        for (let i = 0; i < list.length; i++) {
            if (list[i].pos.x == x && list[i].pos.y == y) {
                return list[i]
            }
        }
        return null
    }

    /**更新点数据*/
    static updatePointInfo(point: icmsg.ExpeditionPoint) {
        let list = this.expeditionModel.expeditionPoints
        for (let i = 0; i < list.length; i++) {
            if (list[i].pos.x == point.pos.x && list[i].pos.y == point.pos.y) {
                this.expeditionModel.expeditionPoints[i] = point
                gdk.e.emit(ExpeditionEventId.EXPEDITION_POINTS_UPDATE)
                break
            }
        }
    }

    /**更新英雄数据 */
    static updateExpeditionHero(hero: icmsg.ExpeditionHero) {
        let grid = this.getHeroGirdByHeroId(hero.heroId)
        if (grid > 0) {
            let datas = this.expeditionModel.expeditionHeros
            for (let i = 0; i < datas.length; i++) {
                if (datas[i].gridId == hero.gridId) {
                    this.expeditionModel.expeditionHeros[i] = hero
                    gdk.e.emit(ExpeditionEventId.EXPEDITION_HEROS_UPDATE)
                    break
                }
            }
        } else {
            this.expeditionModel.expeditionHeros.push(hero)
            gdk.e.emit(ExpeditionEventId.EXPEDITION_HEROS_UPDATE)
        }
    }

    /**英雄的序号 */
    static getHeroGirdByHeroId(heroId: number) {
        let datas = this.expeditionModel.expeditionHeros
        let grid = 0
        for (let i = 0; i < datas.length; i++) {
            if (datas[i].heroId != 0 && datas[i].heroId == heroId) {
                grid = datas[i].gridId
                break
            }
        }
        return grid
    }

    static getHeroEnergyByHeroId(heroId: number) {
        let datas = this.expeditionModel.expeditionHeros
        let energy = -1
        for (let i = 0; i < datas.length; i++) {
            if (datas[i].heroId != 0 && datas[i].heroId == heroId) {
                energy = datas[i].energy
                break
            }
        }
        return energy
    }

    /**地图是否开启 */
    static isMapOpen(mapId) {
        let cfgs = ConfigManager.getItemsByField(Expedition_mapCfg, "type", this.expeditionModel.activityType)
        if (mapId == cfgs[0].map_id) {
            return true
        }
        let maps = this.expeditionModel.expeditionMaps
        for (let i = 0; i < maps.length; i++) {
            if (maps[i].mapId == mapId - 1 && maps[i].isClear) {
                return true
            }
        }
        return false
    }

    static getMapInfo(mapId) {
        let maps = this.expeditionModel.expeditionMaps
        for (let i = 0; i < maps.length; i++) {
            if (maps[i].mapId == mapId) {
                return maps[i]
            }
        }
        return null
    }


    /**更新大地图数据 */
    static updateMap(mapId?) {
        let maps = this.expeditionModel.expeditionMaps
        let cfgs = ConfigManager.getItemsByField(Expedition_mapCfg, "type", this.expeditionModel.activityType)
        if (maps.length == 0) {
            let map = new icmsg.ExpeditionMap()
            map.mapId = cfgs[0].map_id
            map.isClear = false
            map.points = []
            map.process = 0
            this.expeditionModel.expeditionMaps.push(map)
        } else {
            if (mapId) {
                maps.forEach((element, index) => {
                    if (element.mapId == mapId) {
                        this.expeditionModel.expeditionMaps[index].isClear = true
                    }
                });
                let map = new icmsg.ExpeditionMap()
                map.mapId = mapId + 1
                map.isClear = false
                map.points = []
                map.process = 0
                this.expeditionModel.expeditionMaps.push(map)
            } else {
                let mapInfo = this.expeditionModel.expeditionMaps[this.expeditionModel.expeditionMaps.length - 1]
                if (mapInfo.isClear && this.expeditionModel.expeditionMaps.length < cfgs.length) {
                    let map = new icmsg.ExpeditionMap()
                    map.mapId = mapInfo.mapId + 1
                    map.isClear = false
                    map.points = []
                    map.process = 0
                    this.expeditionModel.expeditionMaps.push(map)
                }
            }
        }
    }


    /**据点中已使用的英雄 */
    static getPointUseHeroIds() {
        let datas = this.expeditionModel.expeditionStages
        let ids = []
        datas.forEach(element => {
            if (element.playerId == ModelManager.get(RoleModel).id) {
                ids = ids.concat(element.heroIds)
            }
        });
        return ids
    }

    /**获取占领点的数据 */
    static getOccupiedPoints(mapId) {
        let datas = []
        let points = this.expeditionModel.occupyPoints
        for (let i = 0; i < points.length; i++) {
            let cfg = ConfigManager.getItemByField(Expedition_pointCfg, "index", points[i].index, { type: this.expeditionModel.activityType })
            if (cfg.map_id == mapId) {
                for (let j = 0; j < points[i].num; j++) {
                    datas.push(points[i])
                }
            }
        }
        return datas
    }

    static getOccupiedPointsNum() {
        let num = 0
        let points = this.expeditionModel.occupyPoints
        points.forEach(element => {
            num += element.num
        });
        return num
    }

    static checkEventPoint(pos: icmsg.ExpeditionPos) {
        let events = this.expeditionModel.expeditionEvents
        for (let i = 0; i < events.length; i++) {
            if (events[i].pos.x == pos.x && events[i].pos.y == pos.y) {
                return true
            }
        }
        return false
    }


    /**地图进度 */
    static getMapProcess() {
        let curMap = this.expeditionModel.curMapCfg
        let parameter = curMap.parameter
        let points = this.expeditionModel.pointMap
        let result = []
        for (let i = 0; i < parameter.length; i++) {
            result.push({ a: 0, b: parameter[i][1] })
            for (let key in points) {
                let pointInfo = points[key]
                if (curMap.map_id == 10014) {
                    let changeMap = {}
                    changeMap[100] = 5
                    changeMap[101] = 4
                    if (pointInfo && pointInfo.info
                        && pointInfo.info.progress == pointInfo.cfg.stage_id2.length + 1 && pointInfo.type == changeMap[parameter[i][0]] && this.checkEventPoint(pointInfo.pos)) {
                        result[i].a = result[i].a + 1
                    }
                } else {
                    if (pointInfo && pointInfo.info
                        && pointInfo.info.progress == pointInfo.cfg.stage_id2.length + 1 && pointInfo.type == parameter[i][0]) {
                        result[i].a = result[i].a + 1
                    }
                }
            }
        }
        return result
    }

    //-------------task-------------//
    static initArmyTask() {
        this.armyTaskMap = {};
        let cfgs = ConfigManager.getItemsByField(Expedition_missionCfg, 'type', this.expeditionModel.activityType);
        cfgs.forEach(c => {
            if (!this.armyTaskMap[c.node]) {
                this.armyTaskMap[c.node] = {};
            }
            if (!this.armyTaskMap[c.node][c.group]) {
                this.armyTaskMap[c.node][c.group] = [];
            }
            this.armyTaskMap[c.node][c.group].push(c);
        });
    }

    /**当前部队任务列表 */
    static getCurArmyTaskList() {
        if (Object.keys(this.armyTaskMap).length <= 0) {
            this.initArmyTask();
        }
        let rewardIds = this.expeditionModel.armyTaskRewardsIds;
        let temp = ConfigManager.getItemsByField(Expedition_missionCfg, 'type', this.expeditionModel.activityType);
        let nodeIdx;
        for (let i = 0; i < temp.length; i++) {
            if (!rewardIds[temp[i].id]) {
                nodeIdx = temp[i].node;
                break;
            }
            if (i == temp.length - 1 && !nodeIdx) {
                nodeIdx = temp[i].node;
            }
        }
        let nodeAllCfgs = this.armyTaskMap[nodeIdx];
        let curTask = [];
        for (let key in nodeAllCfgs) {
            let groupCfgs = nodeAllCfgs[key];
            if (groupCfgs.length == 1) { curTask.push(groupCfgs[0]); }
            else if (groupCfgs.length > 1) {
                for (let i = groupCfgs.length - 1; i >= 0; i--) {
                    let preCfg = ConfigManager.getItemByField(Expedition_missionCfg, 'mission_id', groupCfgs[i].prev, { type: this.expeditionModel.activityType });
                    if (rewardIds[groupCfgs[i].id] == 1 || (preCfg && rewardIds[preCfg.id] == 1) || !preCfg) {
                        curTask.push(groupCfgs[i]);
                        break;
                    }
                }
            }
        }
        return curTask;
    }

    /**获取同任务组后置任务 */
    static getArmyAfterTask(id: number) {
        if (Object.keys(this.armyTaskMap).length <= 0) {
            this.initArmyTask();
        }
        let cfg = ConfigManager.getItemByField(Expedition_missionCfg, 'id', id, { type: this.expeditionModel.activityType });
        let groupCfgs = this.armyTaskMap[cfg.node][cfg.group];
        for (let i = 0; i < groupCfgs.length; i++) {
            if (groupCfgs[i].index == cfg.index + 1) {
                return groupCfgs[i];
            }
        }
        return null;
    }

    /**任务是否完成 */
    static getTaskState(id: number) {
        let datas = this.expeditionModel.armyTaskData;
        let cfg = ConfigManager.getItemByField(Expedition_missionCfg, 'id', id, { type: this.expeditionModel.activityType });
        let args = cfg.args;
        if (!args) { args = 0; }
        if (!!datas[cfg.target] && datas[cfg.target][args]) {
            let item: icmsg.MissionProgress = datas[cfg.target][args]
            if (item && item.num >= cfg.number) {
                return true
            }
        }
        return false
    }

    /**获取某个任务是否已领奖 */
    static getTaskAwardState(id: number) {
        return this.expeditionModel.armyTaskRewardsIds[id] == 1;
    }

    /**获取任务完成进度 */
    static getTaskFinishNum(id: number) {
        let datas = this.expeditionModel.armyTaskData;
        let cfg = ConfigManager.getItemByField(Expedition_missionCfg, 'id', id, { type: this.expeditionModel.activityType });
        let finishNum = 0;
        let maxNum = 0;
        let target;
        target = cfg.target;
        if (cfg.target == 108) {
            maxNum = cfg.args * 10000;
            finishNum = ModelManager.get(RoleModel).power;
        }
        else {
            maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!datas[cfg.target] && datas[cfg.target][args]) {
                let item: icmsg.MissionProgress = datas[cfg.target][args]
                if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                    finishNum = item.num >= cfg.number ? 1 : 0;
                }
                else {
                    finishNum = item.num
                }
            }
        }

        if (finishNum > maxNum) {
            finishNum = maxNum
        }

        if (target && target == 119) {
            //充值类任务,多语言需转换货币单位
            finishNum = SdkTool.tool.getRealRMBCost(finishNum);
            maxNum = SdkTool.tool.getRealRMBCost(maxNum);
        }
        return [finishNum, maxNum];
    }

    /**返回指定部队等级  对应特权的值 */
    static getPrivilegeNum(lv: number, type: EXArmyPrivilegeType) {
        let cfg = ConfigManager.getItemByField(Expedition_forcesCfg, 'id', lv, { type: this.expeditionModel.activityType });
        return cfg[`privilege${type}`] || 0;
    }

    /**返回指定职业 强化总等级 */
    static getTotalStrengthenLvByCareer(id: number) {
        let lvs = this.expeditionModel.armyStrengthenStateMap[id];
        let sum = 0;
        lvs.forEach(l => { sum += l; });
        return sum;
    }

    /**返回下一次能激活技能的强化等级 */
    static getNextUnLockStrengthenLvCfg(id: number) {
        let curLv = this.getTotalStrengthenLvByCareer(id);
        let cfgs = ConfigManager.getItems(Expedition_buffCfg, (cfg: Expedition_buffCfg) => {
            if (cfg.professional_type == id && cfg.buff_id > 0 && cfg.strengthen_level > curLv) {
                return true;
            }
        });
        if (!cfgs || cfgs.length <= 0) return null;
        else {
            return cfgs[0];
        }
    }

    /**返回已激活的技能 buffCfg */
    static getActiveSkillIdByCareer(id: number) {
        let curLv = this.getTotalStrengthenLvByCareer(id);
        let cfgs = ConfigManager.getItems(Expedition_buffCfg, (cfg: Expedition_buffCfg) => {
            if (cfg.professional_type == id && cfg.buff_id > 0 && cfg.strengthen_level <= curLv) {
                return true;
            }
        });
        return cfgs;
    }

    /**返回所有远征英雄战力 */
    static async getAllPower() {
        let heros = this.expeditionModel.expeditionHeros;
        let ids = [];
        heros.forEach(h => { ids.push(h.heroId); });
        let allPower = 0;
        for (let i = 0; i < ids.length; i++) {
            let p = await this.getPowerByHeorId(ids[i]);
            allPower += p;
        }
        return allPower;
    }

    static async getPowerByHeorId(id: number): Promise<number> {
        return new Promise((resolve, reject) => {
            let power = 0;
            let heroInfo = HeroUtils.getHeroInfoByHeroId(id);
            if (heroInfo) {
                let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'hero_id', heroInfo.typeId, { career_id: heroInfo.careerId }).career_type;
                let expeditionCareer = [1, 1, 2, 3][careerType - 1]; //转换下 远征中 职业 1-机枪 2-炮兵 3-守卫
                let heroDetail = HeroUtils.getHeroDetailById(id);
                if (!heroDetail) {
                    let req = new icmsg.HeroDetailReq();
                    req.heroId = id;
                    NetManager.send(req, (resp: icmsg.HeroDetailRsp) => {
                        heroDetail = resp.detail;
                        power = this.calculatePower(heroDetail.power, heroDetail.attr, expeditionCareer);
                        resolve(power);
                    });
                }
                else {
                    power = this.calculatePower(heroDetail.power, heroDetail.attr, expeditionCareer);
                    resolve(power);
                }
            } else {
                resolve(power);
            }
        })
    }

    static calculatePower(oldPower: number, attr: icmsg.HeroAttr, careerType: number) {
        let attrLvInfo = this.expeditionModel.armyStrengthenStateMap[careerType];
        let attrKeys = ['atk', 'def', 'hp', 'dmg_add', 'dmg_res', 'attribute'];
        let attrV = [];
        attrKeys.forEach((key, idx) => {
            let lv = attrLvInfo[idx];
            let c = ConfigManager.getItem(Expedition_strengthenCfg, (cfg: Expedition_strengthenCfg) => {
                if (cfg.professional_type == careerType && cfg.type == idx + 1 && cfg.level == lv) {
                    return true;
                }
            });
            if (c && c[key] > 0) {
                let v = c[key] / 10000;
                attrV.push(v);
            }
            else {
                attrV.push(0);
            }
        });
        let armyLv = this.expeditionModel.armyLv;
        let obj = {
            atk: Math.ceil(attr.atkW * attrV[0] + ExpeditionUtils.getPrivilegeNum(armyLv, 1)),
            def: Math.ceil(attr.defW * attrV[1] + ExpeditionUtils.getPrivilegeNum(armyLv, 2)),
            hp: Math.ceil(attr.hpW * attrV[2] + ExpeditionUtils.getPrivilegeNum(armyLv, 3)),
            cold_res: attrV[5],
            elec_res: attrV[5],
            fire_res: attrV[5],
            punc_res: attrV[5],
            radi_res: attrV[5],
            atk_res: attrV[5],
            dmg_cold: attrV[5],
            dmg_elec: attrV[5],
            dmg_fire: attrV[5],
            dmg_punc: attrV[5],
            dmg_radi: attrV[5],
            atk_dmg: attrV[5],
        }
        let power = GlobalUtil.getPowerValue(obj) + oldPower;
        return power;
    }

    /**上阵英雄战力/关卡总战力  返回属性加成 */
    static getRatioByPower(totalP: number, copyId: number) {
        let stageCfg = ConfigManager.getItemByField(Expedition_stageCfg, 'stage_id', copyId, { type: this.expeditionModel.activityType });
        let r = totalP / stageCfg.power;
        let pCfgs = ConfigManager.getItems(Expedition_powerCfg);
        for (let i = pCfgs.length - 1; i >= 0; i--) {
            if (r >= pCfgs[i].proportion) {
                return pCfgs[i].bonus;
            }
        }
        return 0;
    }
}

// 调试用代码，方便调试
CC_DEBUG && (window['ExpeditionUtils'] = ExpeditionUtils)