import ActUtil from '../../act/util/ActUtil';
import ArenaModel from '../../../common/models/ArenaModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import { Arena_buyCfg, GlobalCfg, Talent_extra_chanceCfg } from '../../../a/config';

/**
 * @Description: 竞技场数据操作
 * @Author: jijing.liu
 * @Date: 2019-04-18 11:13:54
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:50:25
 */

// 获取剩下的购买次数
export function getLeftBuyTimes(): number {
    return getTotalBuyTimes() - ModelManager.get(ArenaModel).buyNum;
}

// 获取每天可购买总次数
export function getTotalBuyTimes(): number {
    let items: Arena_buyCfg[] = ConfigManager.getItems(Arena_buyCfg);
    return items.length;
}

// 获取剩下的竞技场次数
export function getLeftArenaTimes(): number {
    let num = getTotalArenaTimes() - ModelManager.get(ArenaModel).fightNum;
    if (num <= 0) {
        num = 0
    }
    return num
}

// 获取竞技场总次数
export function getTotalArenaTimes(): number {
    // let model: ArenaModel = ModelManager.get(ArenaModel);
    // let items: Arena_buyCfg[] = ConfigManager.getItems(Arena_buyCfg);
    let cfgFreeTime = ConfigManager.getItemById(GlobalCfg, "arena_free_times").value[0]
    let actExtraTimes = 0;
    if (ActUtil.getCfgByActId(39)) {
        actExtraTimes = ConfigManager.getItemByField(Talent_extra_chanceCfg, 'key', 'arena').value;
    }
    // let times: number = cfgFreeTime
    // for (let i = 0; i < model.buyNum; i++) {
    //     if (i > items.length - 1)
    //         break;
    //     times += items[i].buy_number;
    // }
    return cfgFreeTime + actExtraTimes;
}

export function getArenaInfoByiD(id: number): icmsg.ArenaPlayer {
    let info = ModelManager.get(ArenaModel).matchPlayers;
    for (let i = 0; i < info.length; i++) {
        if (info[i].id == id || info[i].robotId == id) {
            return info[i];
        }
    }
    return null;
}
