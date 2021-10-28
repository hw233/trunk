import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import PveTool from '../../utils/PveTool';
import { MonsterCfg } from './../../../../a/config';

/** 
 * Pve中BOSS来袭提示窗口
 * @Author: sthoo.huang
 * @Date: 2020-06-06 10:25:14
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-11-23 17:44:51
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveBossCommingCtrl")
export default class PveBossCommingCtrl extends gdk.BasePanel {

    @property(cc.Animation)
    animation: cc.Animation = null;

    @property(sp.Skeleton)
    bgSpine: sp.Skeleton = null;
    @property(sp.Skeleton)
    frSpine: sp.Skeleton = null;

    @property(cc.Label)
    nameLb: cc.Label = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Label)
    txt01: cc.Label = null;
    @property(cc.Label)
    txt02: cc.Label = null;
    @property(cc.Label)
    txt03: cc.Label = null;

    monsterCfg: MonsterCfg;

    onEnable() {
        let args = this.args[0];
        this.monsterCfg = args[0];
        this.bgSpine.node.active = false;
        this.frSpine.node.active = false;
        if (this.animation) {
            // BOSS类型
            this.animation.on('finished', this.startSpine, this);
            this.animation.play('PveBossComming', 0);
        } else {
            this.startSpine();
        }
    }

    startSpine() {
        let arr = this.monsterCfg.present.split('|');
        this.txt01.string = arr[0];
        this.txt02.string = arr[1];
        this.txt03.string = arr[2];
        this.nameLb.string = this.monsterCfg.name;

        // 怪物模型
        this.spine.node.scale = parseFloat(arr[3]) || 1.0;
        GlobalUtil.setSpineData(
            this.node,
            this.spine,
            PveTool.getSkinUrl(this.monsterCfg.skin),
            false,
            'stand_s',
            false,
            false,
            (spine: sp.Skeleton) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                spine.paused = true;
            }
        );

        this.bgSpine.node.active = true;
        this.frSpine.node.active = true;
        this.bgSpine.setAnimation(0, 'stand2', false);
        this.frSpine.setAnimation(0, 'stand', false);
        this.bgSpine.setCompleteListener(this.close.bind(this));
    }

    onDisable() {
        this.monsterCfg = null;
        this.txt01.string = '';
        this.txt02.string = '';
        this.txt03.string = '';
        this.nameLb.string = '';
        GlobalUtil.setSpineData(this.node, this.spine, null);
        JumpUtils.resumeFight();
    }
}
