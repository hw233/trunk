import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import HeroModel from '../../../common/models/HeroModel';
import InstanceModel, { InstanceData } from '../model/InstanceModel';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import { BagItem } from '../../../common/models/BagModel';
import {
    Copy_stageCfg,
    CopyCfg,
    GeneralCfg,
    GlobalCfg,
    Justice_bossCfg,
    MonsterCfg
    } from '../../../a/config';
import { InstanceID, InstanceType } from '../enum/InstanceEnumDef';

/**
 * @Description: 副本数据操作
 * @Author: jijing.liu
 * @Date: 2019-04-18 11:13:54
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-03-30 15:28:00
 */

// 英雄副本的子类型
let HeroInstanceSubType = 14;

// 英雄副本检查最后一个boss是否已死亡
export function IsLastBossDead(id: number, hp: number) {
    let stageDatas: Justice_bossCfg[] = ConfigManager.getItems(Justice_bossCfg);
    let lastStageId = stageDatas[stageDatas.length - 1].id;
    if (lastStageId == id && hp == 0) {
        return true;
    }
    return false;
}

//计算英雄的战斗力总和
export function GetHerosFight(ids: number[]): number {
    let a: BagItem[] = ModelManager.get(HeroModel).heroInfos;
    let ret = 0;
    ids.forEach(element => {
        for (let i = 0, len = a.length; i < len; i++) {
            if ((<icmsg.HeroInfo>a[i].extInfo).heroId == element) {
                ret += (<icmsg.HeroInfo>a[i].extInfo).power;
                break;
            }
        }
    });
    let tem = ConfigManager.getItem(GlobalCfg, { key: 'copy_hero_hurt' })
    if (tem) {
        ret = ret * tem.value[0] / 10000;
    }
    return ret;
}

//计算点杀副本当前单次伤害的战力
export function GetBossInstanceAllFight(): number {
    let ret = 0
    let a = ModelManager.get(InstanceModel).dunGeonBossJusticeState;

    ret = a.generalDps + a.slotDps;

    return ret;
}


//获取服务器返回的英雄个数
export function GetHeroNumber(serverList: number[]) {
    let ret: number = 0;
    serverList && serverList.forEach(element => {
        if (element >= 0) {
            ret++;
        }
    });
    return ret;
}

// [阵亡boss数，boss总数]
export function GetDeadBossAndTotalBoss(stageId: number): number[] {
    let ret: number[] = [0, 0];
    let stageDatas: Copy_stageCfg[] = ConfigManager.getItems(Copy_stageCfg, { subtype: HeroInstanceSubType }); // 14英雄副本子类型
    for (let i = 0, len = stageDatas.length; i < len; i++) {
        if (stageDatas[i].id == stageId) {
            ret[0] = i + 1;
            ret[1] = len;
            break;
        }
    }
    return ret;
}

//获取英雄副本剩下的boss总血量
export function GetHeroInstanceAllBossHP(stageId: number, curHpLeft: number, lv: number): number {

    let gb: GeneralCfg = ConfigManager.getItem(GeneralCfg, { id: lv });
    let ratio = gb == null ? 1 : (gb.ratio / 10000);
    let roleLv = ModelManager.get(RoleModel).level
    let stageDatas: Copy_stageCfg[] = ConfigManager.getItems(Copy_stageCfg, { subtype: HeroInstanceSubType });
    let find: Boolean = false;
    let ret = 0;
    for (let i = 0, len = stageDatas.length; i < len; i++) {
        if (stageDatas[i].player_lv > roleLv) {
            break;
        }
        if (find) {
            let mon: MonsterCfg = ConfigManager.getItem(MonsterCfg, { id: stageDatas[i].born });
            ret += (mon == null ? 0 : mon.hp * ratio);
        }
        if (stageDatas[i].id == stageId) {
            find = true;
            ret = curHpLeft;
        }
    }
    return ret;
}

export function GetInstanceTypeByID(id: number): number {
    switch (id) {
        case InstanceID.BRO_INST:
            {
                return InstanceType.AUTO_INST;
            }
        case InstanceID.HERO_INST:
        case InstanceID.GOLD_INST:
        case InstanceID.CONET_INST:
            //case InstanceID.EXP_INST:
            {
                return InstanceType.TIMES_INST;
            }
        case InstanceID.GOD_INST:
        case InstanceID.ELITE_INST:
        case InstanceID.SPACE_INST:
            {
                return InstanceType.CHALENGE_INST;
            }
        default:
            break;
    }
    return -1;
}


export function GetInstanceIndexByID(id: number): number {
    let index = 0;
    switch (id) {
        case InstanceID.BRO_INST:
            index = 4;
            break
        case InstanceID.DOOMSDAY_INST:
            index = 3;
            break
        case InstanceID.HERO_INST:
            index = 1;
            break
        case InstanceID.GOLD_INST:
            index = 6;
            break
        case InstanceID.SPACE_INST:
            index = 5;
            break
        case InstanceID.CUP_ROOKIE_INST:
            index = 2;
            break
        case InstanceID.GUARDIAN_INST:
            index = -99;
            break;
        default:
            break;
    }
    return index;
}


export function GetInstanceSystemIdByID(id: number): number {
    let systemId = 0;
    switch (id) {
        case InstanceID.BRO_INST:
            systemId = 702;
            break
        case InstanceID.GOD_INST:
            systemId = 715;
            break
        case InstanceID.HERO_INST:
            systemId = 701;
            break
        case InstanceID.GOLD_INST:
            systemId = 9999;
            break
        case InstanceID.SPACE_INST:
            systemId = 705;
            break
        case InstanceID.ELITE_INST:
            systemId = 2700;
            break
        case InstanceID.CUP_ROOKIE_INST:
            systemId = 2700;
            break
        case InstanceID.DOOMSDAY_INST:
            systemId = 703;
            break
        case InstanceID.RUNE_INST:
            systemId = 716;
            break
        case InstanceID.GUARDIAN_INST:
            systemId = 718;
            break
        default:
            break;
    }
    return systemId;
}

//                副本类型id	子类型id	章节	关卡
//    命名规则	       x+	        x+	    xx+	    xx
// 100101 id为1 关卡为1
export function GetStageIDFromServerID(id: number): number {
    return Number(String(id).substring(4));
}

//                副本类型id	子类型id	章节	关卡
//    命名规则	       x+	        x+	    xx+	    xx
// 100101 id为1 关卡为1
export function GetInstanceIDFromServerID(id: number): number {
    return Number(String(id).substring(0, 0));
}

export function GetCopyIDIDBySubType(id: number): number {
    var instances: CopyCfg[] = ConfigManager.getItems(CopyCfg);
    for (let i = 0, len = instances.length; i < len; i++) {
        if (instances[i].subtype == id) {
            return instances[i].copy_id;
        }
    }
    return -1;
}

export function GetInstanceDataByInstanceId(instId: number): InstanceData {
    let insts: Array<InstanceData> = ModelManager.get(InstanceModel).instanceListItemData;
    for (let i = 0, len = insts.length; i < len; i++) {
        if (insts[i].data.copy_id == instId) {
            return insts[i];
        }
    }
    return null;
}

// 获取副本已使用的次数，服务器同步
export function GetCopyUseTimes(subTypeP: number) {
    let cid = GetCopyIDIDBySubType(subTypeP);
    let insts: Array<InstanceData> = ModelManager.get(InstanceModel).instanceListItemData;
    for (let i = 0, len = insts.length; i < len; i++) {
        if (cid == insts[i].data.copy_id && insts[i].serverData != null) {
            return insts[i].serverData.num;
        }
    }
    return 0;
}

// 获取某关卡是否能扫荡
export function GetStageRaidsState(subTypeP: number) {
    var instances: CopyCfg = ConfigManager.getItem(CopyCfg, { subtype: subTypeP });
    return (instances && instances.quick == 1) ? true : false;
}

// 获取某关卡是否限制进入次数:0不限制 >0 限制
export function GetStageTimesState(subTypeP: number) {
    var instances: CopyCfg = ConfigManager.getItem(CopyCfg, { subtype: subTypeP });
    return (instances && instances.times != 0) ? instances.times : 0;
}

// 获取某关卡扫荡消耗的道具
export function GetStageRaidsItem(subTypeP: number) {
    var instances: CopyCfg = ConfigManager.getItem(CopyCfg, { subtype: subTypeP });
    return instances ? instances.quick_cost : [];
}

// 获取某关卡进入消耗的道具
export function GetStageEnterItem(subTypeP: number) {
    var instances: CopyCfg = ConfigManager.getItem(CopyCfg, { subtype: subTypeP });
    return instances ? instances.item_1 : [];
}

//获取副本的某一个关卡详细数据
export function GetStageDataInInstance(instanceId: number, stageid: number): Copy_stageCfg {
    let stageDatas: [Copy_stageCfg] = ModelManager.get(InstanceModel).stageDatas[this.instanceId];
    if (stageDatas == null) {
        return null;
    }
    for (let i = 0, len = stageDatas.length; i++; i < len) {
        if (stageDatas[i].id == stageid) {
            return stageDatas[i];
        }
    }
    return null;
}

export function timeFormat(sec: number, sco: boolean = true): string {
    sec = Math.floor(sec);
    let h = Math.floor(sec / 3600);
    let m = Math.floor((sec - h * 3600) / 60);
    let s = (sec - h * 3600 - m * 60);
    let str = (h < 10 ? `0${h}` : `${h}`) + (sco ? ':' : '小时') + (m < 10 ? `0${m}` : `${m}`) + (sco ? ':' : '分') + (s < 10 ? `0${s}` : `${s}`) + (sco ? '' : '秒');
    return str;
}


// 解析主线关卡id，返回需要的数据
// type：0 章节id 1 区域id 2 关卡id
export function ParseMainLineId(stageId: number, type: number): number {
    let ret: number = 0;
    switch (type) {
        case 0:
            {
                ret = Number(String(stageId).substring(1, 2));
                break;
            }
        case 1:
            {
                ret = Number(String(stageId).substring(2, 4));
                break;
            }
        case 2:
            {
                ret = Number(String(stageId).substring(4));
                break;
            }
        default:
            break;
    }
    return ret;
}

/**
 * 判断主线副本某一关卡是否过关
 * @param stageId 
 */
export function MLStageIsComplete(stageId: number) {
    let latelyStageId = ModelManager.get(CopyModel).latelyStageId;
    if (latelyStageId == 0) {
        return false;
    }
    return stageId < latelyStageId;
}
