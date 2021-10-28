import ConfigManager from '../../../common/managers/ConfigManager';
import PveGuardCtrl from '../ctrl/fight/PveGuardCtrl';
import PveSoldierModel from './PveSoldierModel';
import { PveEnemyDir } from '../const/PveDir';
import { PveMoveableFightModel } from '../core/PveFightModel';
import { Soldier_army_skinCfg } from '../../../a/config';

/**
 * Pve守卫数据模型
 * @Author: sthoo.huang
 * @Date: 2019-05-16 15:18:33
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-12 16:39:40
 */

export default class PveGuardModel extends PveSoldierModel implements PveMoveableFightModel {

    ctrl: PveGuardCtrl;
    dir: number = PveEnemyDir.None; // 方向

    init() {
        super.init();
        this.dir = PveEnemyDir.DOWN;
        this.attackable = true;
    }

    get skin() {
        let v = this.hero.model.getProp('guard_skin');
        if (v && this.hp > 0) {
            return v;
        }
        if (this.hero.model.item.extInfo) {
            let heroInfo = <icmsg.HeroInfo>this.hero.model.item.extInfo
            if (heroInfo.soldierSkin > 0) {
                let cfg = ConfigManager.getItemByField(Soldier_army_skinCfg, 'skin_id', heroInfo.soldierSkin)
                if (cfg) {
                    return cfg.skin;
                }
            }
        }
        return this.getProp('skin');
    }

    get range(): number {
        return this.hero.model.range;
    }

    get ownerPos(): cc.Vec2 {
        return this.hero.getPos();
    }

    get ownerRange(): number {
        return this.hero.model.range;
    }

    // 复活时间（秒)
    get revive(): number {
        let t: number = this.getProp('revive');
        let tm = Math.max(0, t);
        return tm;
    }
}