import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import ServerModel from '../../../../common/models/ServerModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { Siege_checkpointCfg, Siege_globalCfg, SiegeCfg } from '../../../../a/config';

export default class SiegeModel {

    weekGroup: number = 0; //本周累计挑战波数
    todayMaxGroup: number = 0//今日挑战的波数
    todayBlood: number = 0//本日城门受到伤害
    weekBlood: number = 0// 本日之前城门受到伤害
    enterTimes: number = 0 // 挑战次数
    buyTimes: number = 0 // 购买次数
    serverNum: number = 0 // 跨服组中游戏服数量
    worldLevelIndex: number = 3001//世界等级序号
    storeTimes = {} //id---SiegeStoreTimes
    isActivityOpen: boolean = false

    curWave: number = 0//本次战斗的波数
    curDmg: number = 0//造成的伤害
    curKillNum: number = 0;//击杀数量

    /**当前是周几 */
    get weekDay() {
        let curTime = ModelManager.get(ServerModel).serverTime
        let date = new Date(curTime)
        let weekDay = date.getDay()
        if (weekDay == 0) {
            weekDay = 7
        }
        return weekDay
    }

    /**可挑战次数 */
    get canFightNum() {
        let cfgFightNum = ConfigManager.getItemById(Siege_globalCfg, "daily_challenge").value[0]
        return cfgFightNum + this.buyTimes - this.enterTimes
    }

    /**可购买次数 */
    get canBuyNum() {
        let cfgBuyNum = ConfigManager.getItemById(Siege_globalCfg, "challenge").value[0]
        return cfgBuyNum - this.buyTimes
    }

    /**当前关卡数据 */
    get curPointCfg() {
        let cfg = ConfigManager.getItemByField(Siege_checkpointCfg, "world_level", this.worldLevelIndex, { days: this.weekDay })
        return cfg
    }

    /**当前阵营加成 */
    get curSiegeCfg() {
        let cfg = ConfigManager.getItemByField(SiegeCfg, "cycle", this.weekDay)
        return cfg
    }

    /**当前轮次血量 数据 */
    get roundMap() {
        let roundMap = {}
        let cfg = this.curPointCfg
        let rounds = cfg.rounds
        for (let i = 0; i < rounds.length; i++) {
            roundMap[rounds[i][0]] = rounds[i][1]
        }
        return roundMap
    }

    /**当前怪物总血量 */
    get curBossTotalHP() {
        // let hp = 0
        // let map = this.roundMap
        // for (let key in map) {
        //     hp += parseInt(map[key])
        // }
        // let rounds = ConfigManager.getItemById(Siege_globalCfg, "rounds").value[0]
        // return hp * rounds
        let hp = ConfigManager.getItemById(Siege_globalCfg, "monster_hp").value[0]
        return hp
    }

    /**城门总血量 */
    get gateTotalHP() {
        let hp = ConfigManager.getItemById(Siege_globalCfg, "gate_hp").value[0]
        return hp
    }

    /**当前 boss血量比例 */
    get curBossHpPercent() {
        let hp = this.curBossTotalHP - this.todayBlood
        hp = hp >= 0 ? hp : 0
        return Math.floor(hp / this.curBossTotalHP * 100)
    }


    get bossHpCheckDay() {
        let day = this.weekDay - 1
        let activity_time = ConfigManager.getItemById(Siege_globalCfg, "activity_time").value
        let siegeStartTime = activity_time[0] * 3600 //怪物开始出现
        let siegeEndTime = activity_time[1] * 3600  // 怪物到达门口(结算时间)

        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let curZero = TimerUtils.getZerohour(curTime)//当天0点
        if (curTime >= curZero + siegeEndTime - 5) {
            day = this.weekDay
        }
        return day
    }
}