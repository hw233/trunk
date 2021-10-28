import ConfigManager from '../../../../common/managers/ConfigManager';
import FHSendRewardSetItem2 from './FHSendRewardSetItem2';
import FootHoldModel, { FhPointInfo } from './FootHoldModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import MathUtil from '../../../../common/utils/MathUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import {
    ActivityCfg,
    Foothold_baseCfg,
    Foothold_bonusCfg,
    Foothold_cityCfg,
    Foothold_globalCfg,
    Foothold_openCfg,
    Foothold_pointCfg,
    Foothold_recommendCfg,
    Foothold_special_rewardCfg,
    Foothold_towerCfg,
    Foothold_world_levelCfg
    } from '../../../../a/config';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
import { GuildAccess } from '../../model/GuildModel';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';

export default class FootHoldUtils {

    static get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    static get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    static BaseExpId = 110009 //基本经验对应的物品id

    /**查找玩家信息 */
    static findPlayer(playerId): icmsg.FootholdPlayer {
        let list = this.footHoldModel.fhPlayers
        let player = null
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == playerId) {
                player = list[i]
                break
            }
        }
        return player
    }

    /**查找公会信息 */
    static findGuild(guildId): icmsg.FootholdGuild {
        let list = this.footHoldModel.fhGuilds
        let guild = null
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == guildId) {
                guild = list[i]
                break
            }
        }
        return guild
    }

    /**查找公会信息 */
    static findGuildByPos(x, y): icmsg.FootholdGuild {
        let list = this.footHoldModel.fhGuilds
        let guild = null
        for (let i = 0; i < list.length; i++) {
            if (list[i].origin.x == x && list[i].origin.y == y) {
                guild = list[i]
                break
            }
        }
        return guild
    }

    static updateGuildInfo(data: icmsg.FootholdBaseLevelRsp) {
        let list = this.footHoldModel.fhGuilds
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == data.guildId) {
                list[i].level = data.level
                break
            }
        }
    }


    static getFHGuildColor(guildId) {
        let list = this.footHoldModel.fhGuilds
        let colorId = 1
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == guildId) {
                colorId = i + 1
                break
            }
        }
        return colorId
    }

    static getFHGuildColorStr(guildId) {
        let colorId = this.getFHGuildColor(guildId)
        let colors = ["#FFFD61", "#308C64", "#CB4039", "#E487E8"]
        return colors[colorId - 1]
    }

    static findFootHold(x, y) {
        let list = this.footHoldModel.fhPoints
        for (let i = 0; i < list.length; i++) {
            if (list[i].pos.x == x && list[i].pos.y == y) {
                return list[i]
            }
        }
        return null
    }

    static updateFootHold(point: icmsg.FootholdPoint) {
        let list = this.footHoldModel.fhPoints
        for (let i = 0; i < list.length; i++) {
            if (list[i].pos.x == point.pos.x && list[i].pos.y == point.pos.y) {
                this.footHoldModel.fhPoints[i] = point
                break
            }
        }
    }

    /**玩家是否对据点造成伤害*/
    static isPlayerDmgPoint(playerId, pointDetail: icmsg.FootholdPointDetailRsp) {
        let list = pointDetail.damageList
        for (let i = 0; i < list.length; i++) {
            if (list[i].playerId == playerId && list[i].damage > 0) {
                return true
            }
        }
        return false
    }

    /**是否同一个点 */
    static isSameFightFootHold(x, y) {
        let fightPoint = this.footHoldModel.fightPoint
        if (fightPoint && fightPoint.x == x && fightPoint.y == y) {
            return true
        }
        return false
    }

    /**初始体力值 */
    static getInitEnergyValue() {
        let cfg = ConfigManager.getItemByField(Foothold_globalCfg, "key", "energy")
        let g_open = ConfigManager.getItemByField(Foothold_globalCfg, "key", "open").value
        if (this.footHoldModel.activityIndex >= g_open[4]) {
            cfg = ConfigManager.getItemByField(Foothold_globalCfg, "key", "energy_1")
        }
        return cfg.value[2]
    }

    static getEnergyRecoverTime() {
        let cfg = ConfigManager.getItemByField(Foothold_globalCfg, "key", "energy")
        return cfg.value[0]
    }

    /**世界等级配置 信息 */
    static getWorldLevelCfg(lv) {
        let cfgs = ConfigManager.getItems(Foothold_world_levelCfg)
        let targetCfg: Foothold_world_levelCfg = null
        for (let i = 0; i < cfgs.length; i++) {
            if (lv >= cfgs[i].average_level[0] && lv <= cfgs[i].average_level[1]) {
                targetCfg = cfgs[i]
                break
            }
        }
        if (!targetCfg) {
            targetCfg = cfgs[cfgs.length - 1]
        }
        return targetCfg
    }

    static getEnergyMaxBuyTime() {
        let cfg = ConfigManager.getItemByField(Foothold_globalCfg, "key", "buy_energy")
        return cfg.value[0]
    }


    /**获得当前所属周期 */
    static getRecommendCfg() {
        let cfgs = ConfigManager.getItems(Foothold_recommendCfg)
        let cycleLength = ConfigManager.getItems(Foothold_recommendCfg).length
        //开服时间
        let openServerTime = GlobalUtil.getServerOpenTime()
        //当前系统时间
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)

        let openDate = new Date(openServerTime * 1000)
        let openWeekDay = openDate.getDay()
        if (openWeekDay == 0) {
            openWeekDay = 7
        }
        let leftDay = 7 - openWeekDay

        let totolDay = Math.ceil((curTime - openServerTime) / (60 * 60 * 24))
        //第几个周
        let cycleNum = Math.ceil((totolDay - leftDay) / 7) + 1
        let realCycle = cycleNum % cycleLength
        if (realCycle == 0) {
            realCycle = cycleLength
        }
        let recommendCfg = ConfigManager.getItemByField(Foothold_recommendCfg, "cycle", realCycle)
        return recommendCfg
    }


    /**已被占领的据点个数*/
    static getOccupiedPointsCount() {
        let points = this.footHoldModel.warPoints
        let count = 0
        for (let key in points) {
            let info: FhPointInfo = points[key]
            if (info && info.fhPoint && info.fhPoint.playerId > 0) {
                count++
            }
        }
        return count
    }

    /**据点总数量*/
    static getTotalPointsCount() {
        let points = this.footHoldModel.warPoints
        let count = 0
        for (let key in points) {
            let info: FhPointInfo = points[key]
            if (info && info.type > 0 && info.type < 9) {
                count++
            }
        }
        return count
    }


    /**已玩家已占领的据点数数量   辐射塔排除*/
    static getPlayerPointNum(playerId) {
        let points = this.footHoldModel.warPoints
        let count = 0
        for (let key in points) {
            let info: FhPointInfo = points[key]
            if (info && info.fhPoint && info.bonusType != 0 && info.fhPoint.playerId > 0 && info.fhPoint.playerId == playerId) {
                count++
            }
        }
        return count
    }


    static isShowRedPoint(x, y) {
        if (this.footHoldModel.curMapData && this.footHoldModel.curMapData.redPoint) {
            let redPoints = this.footHoldModel.curMapData.redPoint.points
            for (let i = 0; i < redPoints.length; i++) {
                if (redPoints[i].x == x && redPoints[i].y == y) {
                    return true
                }
            }
        }
        return false
    }

    static deletePoint(x, y) {
        let redPoints = this.footHoldModel.curMapData.redPoint.points
        for (let i = 0; i < redPoints.length; i++) {
            if (redPoints[i].x == x && redPoints[i].y == y) {
                this.footHoldModel.curMapData.redPoint.points.splice(i, 1)
                break
            }
        }
        //更新红点状态
        gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
    }

    /**根据warId区分战场类型 */
    static getMapTypeByWarId(warId) {
        let guildMapData = this.footHoldModel.guildMapData
        let globalMapData = this.footHoldModel.globalMapData
        if (guildMapData && guildMapData.warId == warId) {
            return guildMapData.mapType
        }

        if (globalMapData && globalMapData.warId == warId) {
            return globalMapData.mapType
        }
    }

    /**排名前3图标 */
    static getTop3RankIconPath(rank) {
        return `common/texture/main/gh_gxbhuizhang0${rank}`
    }

    /**点所对应的城市信息*/
    static getCityCfg(x, y): Foothold_cityCfg {
        let cityDatas = this.footHoldModel.cityDatas
        for (let key in cityDatas) {
            //该城池的所有点
            let points: FhPointInfo[] = cityDatas[key]
            for (let i = 0; i < points.length; i++) {
                if (points[i].pos.x == x && points[i].pos.y == y) {
                    let cfg = ConfigManager.getItemByField(Foothold_cityCfg, "index", parseInt(key))
                    return cfg
                }
            }
        }
        return null
    }


    /**获取点的资源 */
    static getPointRecource(x, y): any {
        let info: FhPointInfo = this.footHoldModel.warPoints[`${x}-${y}`]
        let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_type", this.footHoldModel.curMapData.mapType, { world_level: this.footHoldModel.worldLevelIndex, point_type: info.type })
        let newReward = []

        if (this.footHoldModel.cityGetPoints[`${x}-${y}`]) {
            let cityCfg = this.getCityCfg(x, y)
            if (cityCfg) {
                newReward = this.addBonus(newReward, cityCfg.bonus)
            }
        }

        if (info.addState.indexOf(1) != -1) {
            let bonusCfg = ConfigManager.getItemByField(Foothold_bonusCfg, "map_type", this.footHoldModel.curMapData.mapType, { world_level: this.footHoldModel.worldLevelIndex })
            if (bonusCfg) {
                newReward = this.addBonus(newReward, bonusCfg.bonus_resources)
            }
        }
        return this.addBonus(newReward, pointCfg.output_reward)
    }

    static addBonus(rewards, addRewards) {
        let newRewards = []
        for (let i = 0; i < addRewards.length; i++) {
            let count = 0
            for (let j = 0; j < rewards.length; j++) {
                if (addRewards[i][0] == rewards[j][0]) {
                    newRewards.push([addRewards[i][0], (addRewards[i][1] + rewards[j][1])])
                    count++
                }
            }
            if (count == 0) {
                newRewards.push(addRewards[i])
            }
        }
        return newRewards
    }


    /**据点的产出收益 */
    static getPointOutput(x, y) {
        let list = this.footHoldModel.pointsOutputList
        for (let i = 0; i < list.length; i++) {
            if (list[i].pos.x == x && list[i].pos.y == y) {
                let goods = []
                if (list[i].exp > 0) {
                    let good = new icmsg.GoodsInfo()
                    good.typeId = this.BaseExpId
                    good.num = list[i].exp
                    goods.push(good)
                }
                return goods.concat(list[i].items)
            }
        }
        return null
    }

    /**清除 据点的产出收益 */
    static clearPointOutput(x, y) {
        let list = this.footHoldModel.pointsOutputList
        let newList = []
        for (let i = 0; i < list.length; i++) {
            if (list[i].pos.x == x && list[i].pos.y == y) {
                continue
            }
            newList.push(list[i])
        }
        this.footHoldModel.pointsOutputList = newList
        let info: FhPointInfo = this.footHoldModel.warPoints[`${x}-${y}`]
        info.output = []
    }

    static getBuffTowerType(x, y) {
        //统计buff塔信息
        let radioTypePoints = this.footHoldModel.radioTypePoints
        let index = 0
        for (let key in radioTypePoints) {
            let points = radioTypePoints[key]
            for (let i = 0; i < points.length; i++) {
                if (points[i].pos.x == x && points[i].pos.y == y && points[i].bonusType == 0 && points[i].bonusId == parseInt(key)) {
                    index = parseInt(key) - 1
                    return this.footHoldModel.radioTowerData[index]
                }
            }
        }
        return this.footHoldModel.radioTowerData[index]
    }


    static getBuffTowerIndex(x, y) {
        //统计buff塔信息
        let radioTypePoints = this.footHoldModel.radioTypePoints
        let index = 0
        for (let key in radioTypePoints) {
            let points = radioTypePoints[key]
            for (let i = 0; i < points.length; i++) {
                if (points[i].pos.x == x && points[i].pos.y == y && points[i].bonusId == parseInt(key)) {
                    index = parseInt(key)
                    return index
                }
            }
        }
        return index
    }

    static getResultReward(exp: number, goods: icmsg.GoodsInfo[]) {
        let list = []
        if (exp > 0) {
            let good = new icmsg.GoodsInfo()
            good.typeId = FootHoldUtils.BaseExpId
            good.num = exp
            goods.push(good)
        }
        list = list.concat(goods)
        return list
    }

    static clearData() {
        this.footHoldModel.guildMapData = null
        this.footHoldModel.globalMapData = null
        this.footHoldModel.curMapData = null
    }

    static setTest(v) {
        this.footHoldModel.isTest = v
    }

    static getMapPoints() {
        let warPoints = this.footHoldModel.warPoints;
        let datas = {}
        let towerDatas = {}
        for (let key in warPoints) {
            let info: FhPointInfo = warPoints[key];
            if (datas[info.type]) {
                datas[info.type].push(info)
            } else {
                datas[info.type] = []
                datas[info.type].push(info)
            }
        }

        let radioTypePoints = this.footHoldModel.radioTypePoints
        for (let key in radioTypePoints) {
            let tower_cfg = ConfigManager.getItemByField(Foothold_towerCfg, "tower_id", parseInt(key))
            if (towerDatas[tower_cfg.tower_type]) {
                towerDatas[tower_cfg.tower_type].push(tower_cfg)
            } else {
                towerDatas[tower_cfg.tower_type] = []
                towerDatas[tower_cfg.tower_type].push(tower_cfg)
            }
        }

        for (let type in datas) {
            CC_DEBUG && cc.log('据点类型：' + type + "###数量：" + datas[type].length)
        }

        for (let type in towerDatas) {
            CC_DEBUG && cc.log('辐射塔类型：' + type + "###数量：" + towerDatas[type].length)
        }
    }

    /*据点指引任务提交
    1 占领据点
    2 购买体力
    3 据点争夺攻击敌方据点
    4 占领城池
    5 占领辐射塔
    6 领取基地奖励
    7 放弃据点
    */
    static commitFhGuide(eventId) {
        let msg = new icmsg.FootholdGuideCommitReq()
        let guide = new icmsg.FootholdGuide()
        guide.eventId = eventId
        guide.number = 1
        msg.guide = guide
        NetManager.send(msg, () => {
            let num = this.footHoldModel.teachTaskEventDatas[eventId] || 0
            if (num >= 0) {
                num += 1
                this.footHoldModel.teachTaskEventDatas[eventId] = num
                gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
            }
        })
    }

    /**获得奖励的类型 */
    static getRewardType(itemId) {
        let cfg = ConfigManager.getItemByField(Foothold_special_rewardCfg, "item_id", itemId)
        if (cfg) {
            return cfg.quality
        }
        return 0
    }

    /**发送的所有物品id */
    static getSendRecord(playerId) {
        let ctrls: FHSendRewardSetItem2[] = this.footHoldModel.sendPlayerRecordCtrl[playerId] || [0, 0, 0, 0, 0, 0]
        let recordIds = []
        for (let i = 0; i < ctrls.length; i++) {
            recordIds.push(ctrls[i].itemId)
        }
        return recordIds
    }

    /** 已放的类型数量 */
    static getSendRecordTypeNum(playerId, type) {
        let ids = this.getSendRecord(playerId)
        let count = 0
        for (let i = 0; i < ids.length; i++) {
            if (this.getRewardType(ids[i]) == type) {
                count++
            }
        }
        return count
    }

    static checkTypeNumIsFull(playerId, type) {
        let ctrls: FHSendRewardSetItem2[] = this.footHoldModel.sendPlayerRecordCtrl[playerId] || []
        let targetType = 0
        for (let i = 0; i < ctrls.length; i++) {
            if (ctrls[i].itemId == 0) {
                targetType = ctrls[i].rewardType
                break
            }
        }
        if (targetType == 0) {
            gdk.gui.showMessage("该成员分配数量已满")
            return true
        }

        let typeName = ["珍稀", "极品", "豪华"]
        let cfgNum = this.getRewardCfgNumByType(type)
        if (this.getSendRecordTypeNum(playerId, type) >= cfgNum) {
            gdk.gui.showMessage(`每位玩家最多可领取${cfgNum}份${typeName[type - 1]}奖励`)
            return true
        }

        if (type < targetType) {
            gdk.gui.showMessage(`该格子只可放入${typeName[targetType - 1]}或以下品质的奖励`)
            return true
        }
        return false
    }

    static getRewardCfgNumByType(type) {
        let show1Cfg = ConfigManager.getItemById(Foothold_globalCfg, "reward_show1").value
        let show2Cfg = ConfigManager.getItemById(Foothold_globalCfg, "reward_show2").value
        let show3Cfg = ConfigManager.getItemById(Foothold_globalCfg, "reward_show3").value
        let num = 0;
        if (type == show1Cfg[0]) {
            num = show1Cfg[1]
        } else if (type == show2Cfg[0]) {
            num = show2Cfg[1] + show1Cfg[1]
        } else if (type == show3Cfg[0]) {
            num = show3Cfg[1] + show2Cfg[1] + show1Cfg[1]
        }
        return num
    }

    /**是否跨服据点战 */
    static get isCrossWar() {
        return this.footHoldModel.activityType == 63
    }


    /**据点战竞猜 标签显示 */
    static getGuessTabDatas() {
        let startTime = this.footHoldModel.warStartTime
        let endTime = this.footHoldModel.warEndTime
        let dayNum = Math.ceil((endTime - startTime) / 86400) - 1
        let tabDatas = []
        for (let i = 0; i < dayNum; i++) {
            tabDatas.push(i + 1)
        }
        return tabDatas
    }

    /**当前 竞猜轮次 */
    static getCurGuessRound() {
        let startTime = this.footHoldModel.warStartTime
        let startZero = TimerUtils.getZerohour(startTime)
        let serverModel = ModelManager.get(ServerModel)
        let curTime = Math.floor(serverModel.serverTime / 1000)
        let curDay = Math.ceil((curTime - startZero) / 86400)
        if (!FootHoldUtils.isGuessStart()) {
            curDay = curDay - 1
        }

        return curDay
    }

    /**据点战是否可进入 */
    static isGuildWarCanEnter() {
        if (this.roleModel.guildId > 0) {
            let openTime = this.roleModel.CrossOpenTime * 1000;
            // let cfg = ConfigManager.getItemById(Cross_etcdCfg, this.roleModel.crossId)
            if (openTime) {
                // let openTime = new Date(`${cfg.cross_open[0]}/${cfg.cross_open[1]}/${cfg.cross_open[2]} ${cfg.cross_open[3]}:${cfg.cross_open[4]}`).getTime();
                openTime = Math.floor(openTime / 1000)
                let localActCfg = ConfigManager.getItemByField(ActivityCfg, "id", 62)
                let crossActCfg = ConfigManager.getItemByField(ActivityCfg, "id", 63)
                let openDay = crossActCfg.open_time[2]
                let closeDay = localActCfg.close_time[2]
                let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
                if (curTime >= openTime + closeDay * 86400 && curTime <= openTime + openDay * 86400) {
                    let leftTime = openTime + openDay * 86400 - Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
                    if (leftTime > 0) {
                        return false
                    }
                }
            }
            return true
        }
        return false
    }

    /**是否竞猜模式 */
    static setGuessMode(v: boolean = false) {
        this.footHoldModel.isGuessMode = v
    }

    static isGuessStart() {
        let startTime = ConfigManager.getItemById(Foothold_globalCfg, "quiz_time").value[0]
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let zeroTime = TimerUtils.getZerohour(curTime)
        if (curTime >= zeroTime + startTime * 3600) {
            return true
        }
        return false
    }

    static isGuessEnd() {
        let endTime = ConfigManager.getItemById(Foothold_globalCfg, "quiz_time").value[1]
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let zeroTime = TimerUtils.getZerohour(curTime)
        if (curTime >= zeroTime + endTime * 3600) {
            return true
        }
        return false
    }

    //获得总投票数
    static getTotalVotes() {
        let datas = this.footHoldModel.guessGuilds
        let count = 0
        for (let i = 0; i < datas.length; i++) {
            count += datas[i].votes
        }
        return count == 0 ? 1 : count
    }

    /**玩家是否可以进行标记 */
    static get isPlayerCanMark() {
        if (GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.FhMark) && this.footHoldModel.coopGuildId == 0) {
            return true
        }
        return false
    }

    /**玩家是否可以进行设置驻守 */
    static get isPlayerCanSetGuard() {
        if (GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.GatherOrGuard) && this.footHoldModel.coopGuildId == 0) {
            return true
        }
        return false
    }

    /**玩家是否可以进行设置集结 */
    static get isPlayerCanSetGather() {
        if (GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.GatherOrGuard) && this.footHoldModel.coopGuildId == 0) {
            return true
        }
        return false
    }

    /**标记点的数量 */
    static getMarkPointsNum() {
        let count = 0
        for (let key in this.footHoldModel.markFlagPoints) {
            count++
        }
        return count
    }

    /**检测 集结点周边的点状态 */
    static getGatherAroundPoints(x, y) {
        //左上
        let leftUpPos = cc.v2(x - 1, y - 1)
        //右上
        let rightUpPos = cc.v2(x + 1, y - 1)
        //左
        let leftPos = cc.v2(x - 2, y)
        //右
        let rightPos = cc.v2(x + 2, y)
        //左下
        let leftDownPos = cc.v2(x - 1, y + 1)
        //右下
        let rightDownPos = cc.v2(x + 1, y + 1)

        let pointMap = {}
        pointMap[`${x}-${y}`] = cc.v2(x, y)
        pointMap[`${leftUpPos.x}-${leftUpPos.y}`] = leftUpPos
        pointMap[`${rightUpPos.x}-${rightUpPos.y}`] = rightUpPos
        pointMap[`${leftPos.x}-${leftPos.y}`] = leftPos
        pointMap[`${rightPos.x}-${rightPos.y}`] = rightPos
        pointMap[`${leftDownPos.x}-${leftDownPos.y}`] = leftDownPos
        pointMap[`${rightDownPos.x}-${rightDownPos.y}`] = rightDownPos
        return pointMap
    }

    static getTargetArrowAngle(from: cc.Vec2, to: cc.Vec2) {
        //左上
        let leftUpPos = cc.v2(from.x - 1, from.y - 1)
        //右上
        let rightUpPos = cc.v2(from.x + 1, from.y - 1)
        //左
        let leftPos = cc.v2(from.x - 2, from.y)
        //右
        let rightPos = cc.v2(from.x + 2, from.y)
        //左下
        let leftDownPos = cc.v2(from.x - 1, from.y + 1)
        //右下
        let rightDownPos = cc.v2(from.x + 1, from.y + 1)
        let angle = 0
        if (leftUpPos.x == to.x && leftUpPos.y == to.y) {
            angle = -160
        } else if (rightUpPos.x == to.x && rightUpPos.y == to.y) {
            angle = -240
        } else if (leftPos.x == to.x && leftPos.y == to.y) {
            angle = -120
        }
        else if (rightPos.x == to.x && rightPos.y == to.y) {
            angle = 60
        }
        else if (leftDownPos.x == to.x && leftDownPos.y == to.y) {
            angle = -70
        }
        else if (rightDownPos.x == to.x && rightDownPos.y == to.y) {
            angle = 30
        }
        return angle
    }

    /**
     * 
     * @param mapType 地图类型
     * @param index   开启次数
     */
    static getFootHoldMapData(mapType, index) {
        let cfgs = ConfigManager.getItemsByField(Foothold_openCfg, "map_type", mapType)
        let mapData = []
        for (let i = 0; i < cfgs.length; i++) {
            if (index >= cfgs[i].interval[0] && index <= cfgs[i].interval[1]) {
                mapData = cfgs[i].map_monster
                break
            }
        }
        if (mapData.length == 0) {
            mapData = cfgs[0].map_monster
        }
        let idIndex = MathUtil.rnd(0, mapData.length - 1)
        return mapData[idIndex]
    }

    static getPrivilegeCommon(type, lv) {
        let cfg = ConfigManager.getItemByField(Foothold_baseCfg, "level", lv)
        let d = cfg[`privilege${type}`];
        if (d) {
            if (d instanceof Array) {
                return d[0];
            }
            else {
                return d;
            }
        }
        else {
            return 0;
        }
    }


    /**是否可以参加协战
     * true 只能协战
     * false 处于4个公会之一 不能协战
     */
    static isCanCooperation(guildId) {
        let list = this.footHoldModel.cooperGuildList
        for (let i = 0; i < list.length; i++) {
            if (list[i].guildInfo.id == guildId) {
                return false
            }
        }
        return true
    }


    /**加入协战 公会的信息 */
    static findCooperGuildInfo(guildId) {
        let list = this.footHoldModel.cooperGuildList
        for (let i = 0; i < list.length; i++) {
            if (list[i].guildInfo.id == guildId) {
                return list[i]
            }
        }
        return null
    }

    /**是否处于允许招募时间内 */
    static isInCoopertionInviteTime() {
        let cooperation_time = ConfigManager.getItemById(Foothold_globalCfg, "cooperation_time").value[0]
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let leftTime = this.footHoldModel.coopStartTime + cooperation_time - curTime
        if (leftTime > 0) {
            return true
        }
        return false
    }
}

// 调试用代码，方便调试
CC_DEBUG && (window['FootHoldUtils'] = FootHoldUtils)