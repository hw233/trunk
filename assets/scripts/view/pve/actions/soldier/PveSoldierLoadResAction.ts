import PveFightLoadResAction from '../base/PveFightLoadResAction';
import PveSoldierModel from '../../model/PveSoldierModel';
import StringUtils from '../../../../common/utils/StringUtils';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import { PveFightDirName, PveSoldierDir } from '../../const/PveDir';

/**
 * Pve小兵资源加载动作
 * @Author: sthoo.huang
 * @Date: 2019-04-12 10:44:23
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-08 14:25:38
 */

@gdk.fsm.action("PveSoldierLoadResAction", "Pve/Soldier")
export default class PveSoldierLoadResAction extends PveFightLoadResAction {

    getMixs(): string[][] {
        let mixs: string[][] = [];
        let d: string[] = [PveFightDirName.DOWN, PveFightDirName.SIDE];
        for (let j = 0; j < d.length; j++) {
            let a: string[] = [PveFightAnmNames.IDLE, PveFightAnmNames.ATTACK];
            let t: string[] = [];
            for (let i = 0; i < a.length; i++) {
                t.push(StringUtils.format('{0}_{1}', a[i], d[j]));
            }
            mixs.push(t);
        }
        return mixs;
    }

    setAnimation() {
        let m: PveSoldierModel = this.model as PveSoldierModel;
        let d: string = m.hero.tower.name.charAt(0);
        this.model.dir = d == 'r' ? PveSoldierDir.DOWN_RIGHT : PveSoldierDir.DOWN_LEFT;
        super.setAnimation();
    }
}