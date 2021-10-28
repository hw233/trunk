import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from '../footHold/FootHoldModel';
import ModelManager from '../../../../common/managers/ModelManager';
import { Foothold_titleCfg } from '../../../../a/config';

export default class MilitaryRankUtils {

    /**军衔等级 对应的图标 */
    static getIcon(lv) {
        let cfg = ConfigManager.getItemByField(Foothold_titleCfg, "level", lv)
        return `view/guild/texture/militaryRank/${cfg.icon}`
    }

    /**军衔等级 对应的图标 */
    static getName(lv) {
        let cfg = ConfigManager.getItemByField(Foothold_titleCfg, "level", lv)
        return cfg.name
    }

    /**
     * 0 进攻加成词条
     * 1 防守加成词条
     * 2 额外领取体力数
     * 3 据点上限提升
     * 4 耐久度提升
     * 5 耐久恢复速度提升
     * 6 指挥官生命值上限
     */
    static getPrivilegeHardCore(type, lv) {
        let cfg = ConfigManager.getItemByField(Foothold_titleCfg, "level", lv)
        return cfg[`privilege${type}`] ? cfg[`privilege${type}`] : []
    }

    static getPrivilegeCommon(type, lv) {
        let cfg = ConfigManager.getItemByField(Foothold_titleCfg, "level", lv)
        return cfg[`privilege${type}`][0] ? cfg[`privilege${type}`][0] : 0
    }


    /**经验转换成等级 */
    static getMilitaryRankLvByExp(exp: number) {
        let cfgs = ConfigManager.getItems(Foothold_titleCfg)
        for (let i = cfgs.length - 1; i >= 0; i--) {
            if (cfgs[i].exp && exp >= cfgs[i].exp) {
                return cfgs[i].level
            }
        }
        return 0
    }


}