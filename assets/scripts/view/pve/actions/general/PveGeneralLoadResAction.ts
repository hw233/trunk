import PveFightLoadResAction from '../base/PveFightLoadResAction';
import StringUtils from '../../../../common/utils/StringUtils';
import { PveEnemyDir, PveFightDirName } from '../../const/PveDir';
import { PveFightAnmNames } from '../../const/PveAnimationNames';

/**
 * Pve指挥官资源加载动作
 * @Author: sthoo.huang
 * @Date: 2019-04-12 10:44:23
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-10-16 18:11:35
 */

@gdk.fsm.action("PveGeneralLoadResAction", "Pve/General")
export default class PveGeneralLoadResAction extends PveFightLoadResAction {

    getMixs(): string[][] {
        let mixs: string[][] = [];
        let d: string[] = [PveFightDirName.SIDE];
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
        if (this.model.ctrl.node.name == 'general_1') {
            this.model.dir = PveEnemyDir.DOWN;
            super.setAnimation();
            return;
        }
        let char = this.sceneModel.tiled.general.name.substr(0, 1);
        switch (char) {
            case 'l':
                this.model.dir = PveEnemyDir.DOWN_LEFT;
                break;

            case 'r':
                this.model.dir = PveEnemyDir.DOWN_RIGHT;
                break;

            default:
                this.model.dir = PveEnemyDir.DOWN;
                break;
        }

        super.setAnimation();
    }

    // 预加载技能资源
    preloadRes() {
        if (!cc.isValid(this.node)) return;
        if (!this.sceneModel.isDemo) {
            // 预加载手动技能指示图
            let resId = gdk.Tool.getResIdByNode(this.node);
            gdk.rm.loadRes(resId, 'view/pve/texture/ui/common/skill_range', cc.SpriteFrame);
            // gdk.rm.loadRes(resId, 'view/pve/texture/ui/common/skill_arrow', cc.SpriteFrame);
            // gdk.rm.addResInBackground(
            //     [
            //         'view/pve/texture/ui/common/skill_range',
            //         'view/pve/texture/ui/common/skill_arrow',
            //     ],
            //     cc.SpriteFrame,
            //     gdk.Tool.getResIdByNode(this.node),
            // );
            super.preloadRes();
        }
    }
}