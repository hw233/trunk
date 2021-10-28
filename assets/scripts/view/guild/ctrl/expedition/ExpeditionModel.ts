import ActUtil from '../../../act/util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionCityCtrl from './ExpeditionCityCtrl';
import ExpeditionPointCtrl from './ExpeditionPointCtrl';
import {
    Expedition_forcesCfg,
    Expedition_mapCfg,
    Expedition_pointCfg,
    Expedition_stageCfg
    } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:04:01 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-24 16:35:05
 */


//据点信息
export type ExpeditionPointInfo = {
    id: number,
    type: number,
    mapPoint: cc.Vec2,
    pos: icmsg.ExpeditionPos,
    cfg: Expedition_pointCfg,
    info: icmsg.ExpeditionPoint
    tilePos: number[],
    extInfo: any,
}

//大地图块信息 
export type ExpeditionCityInfo = {
    id: number,
    type: number,
    mapPoint: cc.Vec2,
    pos: icmsg.ExpeditionPos,
    cfg: Expedition_mapCfg,
}


export default class ExpeditionModel {

    isTest = false

    mapId: number = 0 //当前地图id
    pointMap: { [pos: string]: ExpeditionPointInfo } = {};
    pointCtrlMap: { [pos: string]: ExpeditionPointCtrl } = {};
    tilePointMap: { [pos: string]: ExpeditionPointInfo } = {};

    cityMap: { [pos: string]: ExpeditionCityInfo } = {};
    cityCtrlMap: { [pos: string]: ExpeditionCityCtrl } = {};

    curMapCfg: Expedition_mapCfg = null
    expeditionMaps: icmsg.ExpeditionMap[] = []//大地图数据
    energyBought: number = 0//已购买的次数
    expedtitionAllPower: number; //远征总战力
    expeditionHeros: icmsg.ExpeditionHero[] = []//远征列表的英雄
    useHeroIds: number[] = [] //当前关卡 已使用的英雄id
    expeditionStages: icmsg.ExpeditionStage[] = [] //据点中关卡数据
    expeditionPoints: icmsg.ExpeditionPoint[] = []//地图中点的数据
    expeditionEvents: icmsg.ExpeditionEvent[] = []//据点事件类型
    occupyPointNum: number = 0//已占领的据点数量
    occupyPoints: icmsg.ExpeditionOccupiedPoint[] = []//占领点的数据
    isHeroListScrolling: boolean = false

    isEnterCity: boolean = false

    /*活动类型*/
    private _activityType: number;
    get activityType(): number {
        if (this._activityType) return this._activityType;
        this._activityType = ActUtil.getActRewardType(114)
        let cfgs = ConfigManager.getItems(Expedition_mapCfg)
        if (this._activityType > cfgs[cfgs.length - 1].type) {
            this._activityType = cfgs[cfgs.length - 1].type
        }
        return this._activityType
    }

    curPointInfo: ExpeditionPointInfo = null//当前选中的点
    curStage: Expedition_stageCfg = null
    curIndex: number = 0//关卡序号
    curHeroIds: number[] = []//参战的英雄唯一id
    curHeroGirds: number[] = []//参战英雄序号

    armyExp: number = 0; //部队经验
    armyTaskData: any = {} //部队任务
    armyTaskRewardsIds = {}; //部队任务领奖idMap

    // armyLv: number = 1;//部队等级 默认1级
    get armyLv(): number {
        let lv = 1;
        let cfgs = ConfigManager.getItemsByField(Expedition_forcesCfg, 'type', this.activityType);
        for (let i = cfgs.length - 1; i >= 0; i--) {
            if (this.armyExp >= cfgs[i].exp) {
                lv = cfgs[i].id;
                break;
            }
        }
        return lv;
    }

    armyStrengthenStateMap: { [pType: number]: number[] } = {}; //部队强化状态  职业类型-[攻击,防御,生命,增伤,减伤,全属性]
}