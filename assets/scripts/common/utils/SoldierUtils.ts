import ConfigManager from '../managers/ConfigManager';
import { SkillCfg, SoldierCfg } from '../../a/config';

/**
 * @Description: 士兵工具类
 * @Author: jianwei.mai
 * @Date: 2019-10-30 11:13:20
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-05 14:17:50
 */
export default class SoldierUtils {

    /**获得士兵技能塔防或卡牌的技能信息*/
    static getSkillInfo(soldierId: number, skillType: number, level: number = 1) {
        let soldierCfg = ConfigManager.getItemById(SoldierCfg, soldierId);
        let skillInfo = { name: "", desc: "", skillId: 0 };
        for (let i = 0; i < soldierCfg.skills.length; i++) {
            //塔防技能
            if (skillType == 0 && (soldierCfg.skills[i] >= 2000 && soldierCfg.skills[i] < 300000)) {
                let skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", soldierCfg.skills[i], { level: level });
                if (skillCfg) {
                    skillInfo.skillId = soldierCfg.skills[i];
                    skillInfo.name = skillCfg.name;
                    skillInfo.desc = skillCfg.des;
                    return skillInfo
                }
            }
        }
        return skillInfo
    }
}
