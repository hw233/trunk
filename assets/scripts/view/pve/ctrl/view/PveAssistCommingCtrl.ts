import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import PvePool from '../../utils/PvePool';
import PveSceneCtrl from '../PveSceneCtrl';
import { Copy_assistCfg, HeroCfg } from '../../../../a/config';

/** 
 * Pve中BOSS来袭提示窗口
 * @Author: sthoo.huang
 * @Date: 2020-06-06 10:25:14
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-11-23 17:44:18
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveAssistCommingCtrl")
export default class PveAssistCommingCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    bgSpine: sp.Skeleton = null;
    @property(sp.Skeleton)
    fgSpine: sp.Skeleton = null;

    @property(cc.Label)
    nameLb: cc.Label = null;

    @property(cc.Label)
    soliderLb: cc.Label = null;

    @property(cc.Label)
    desLb: cc.Label = null;

    @property(cc.Node)
    starNode: cc.Node = null;

    @property(cc.Prefab)
    starPre: cc.Prefab = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Label)
    starLb: cc.Label = null;

    assistCfg: Copy_assistCfg;

    onEnable() {
        let args = this.args[0];
        this.assistCfg = args[0];
        //this.bgSpine.node.active = false;
        let arr = this.assistCfg.present.split('|');
        this.desLb.string = arr[1];
        this.soliderLb.string = arr[0];
        let heroCfg = ConfigManager.getItemById(HeroCfg, this.assistCfg.hero_id)
        this.nameLb.string = heroCfg.name;

        //创建星星
        // for (let i = 0; i < this.assistCfg.hero_star; i++) {
        //     let star = PvePool.get(this.starPre);
        //     if (star) {
        //         this.starNode.addChild(star);
        //     }
        // }
        let starNum = this.assistCfg.hero_star
        this.starLb.string = starNum > 5 ? '1'.repeat(starNum - 5) : '0'.repeat(starNum);
        this.soliderLb.node.opacity = 0;
        this.desLb.node.opacity = 0;
        this.starNode.opacity = 0;
        let action1: cc.Action = this.getShowActon()
        let action2: cc.Action = this.getShowActon()
        let action3: cc.Action = this.getShowActon()
        this.soliderLb.node.runAction(action1);
        this.desLb.node.runAction(action2);
        this.starNode.runAction(action3);
        //创建助战模型
        this.spine.node.scale = parseFloat(arr[2]) || 1.0;
        GlobalUtil.setSpineData(
            this.node,
            this.spine,
            `spine/hero/${heroCfg.skin}/1/${heroCfg.skin}`,
            //PveTool.getSkinUrl(this.assistCfg.skin),
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
        this.bgSpine.setAnimation(0, 'stand2', false);
        this.fgSpine.setAnimation(0, 'stand', false);
        this.bgSpine.setCompleteListener(this.close.bind(this));
        gdk.Timer.once(220, this, () => {
            let p = gdk.gui.getCurrentView();
            let c = p.getComponent(PveSceneCtrl);
            if (c) {
                c.quake(5, 20)
            }
        })

    }

    onDisable() {
        this.soliderLb.node.stopAllActions();
        this.desLb.node.stopAllActions();
        this.starNode.stopAllActions();
        this.assistCfg = null;
        this.desLb.string = '';
        this.soliderLb.string = '';
        this.nameLb.string = '';
        GlobalUtil.setSpineData(this.node, this.spine, null);
        this.starNode.children.forEach(child => {
            PvePool.put(child);
        })
        gdk.Timer.clearAll(this)
        JumpUtils.resumeFight();
    }

    getShowActon(): cc.Action {
        let action = new cc.Action()
        action = cc.speed(
            cc.sequence(
                cc.delayTime(0.5),
                cc.fadeIn(0.3),
                cc.delayTime(1.2),
                cc.fadeOut(0.3)
            ),
            1
        )
        return action;
    }
}
