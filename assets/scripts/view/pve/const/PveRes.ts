import ConfigManager from '../../../common/managers/ConfigManager';
import { CommonCfg } from '../../../a/config';

/**
 * Pve相关的资源常量定义
 * @Author: sthoo.huang
 * @Date: 2019-04-16 10:01:06
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-06-04 21:08:47
 */

class PveRes {

    get PVE_PROTEGE_RES(): string {
        return ConfigManager.getItemById(CommonCfg, 'PVE_PROTEGE_RES').value;
    }

    get PVE_MONSTER_RES(): string {
        return ConfigManager.getItemById(CommonCfg, 'PVE_MONSTER_RES').value;
    }

    get PVE_HERO_RES(): string {
        return ConfigManager.getItemById(CommonCfg, 'PVE_HERO_RES').value;
    }

    get PVE_SOLDIER_RES(): string {
        return ConfigManager.getItemById(CommonCfg, 'PVE_SOLDIER_RES').value;
    }

    get PVE_SKILL_RES(): string {
        return ConfigManager.getItemById(CommonCfg, 'PVE_SKILL_RES').value;
    }

    get PVE_BUFF_RES(): string {
        return ConfigManager.getItemById(CommonCfg, 'PVE_BUFF_RES').value;
    }

    get PVE_MAP_RES(): string {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // 微信小游戏
            return ConfigManager.getItemById(CommonCfg, 'PVE_MAP_RES_WX').value;
        }
        return ConfigManager.getItemById(CommonCfg, 'PVE_MAP_RES').value;
    }

    get PVE_ROAD_RES(): string {
        return ConfigManager.getItemById(CommonCfg, 'PVE_ROAD_RES').value;
    }

}

export default gdk.Tool.getSingleton(PveRes);