import PveBaseFightCtrl from '../fight/PveBaseFightCtrl';
import PveEnemyModel from '../../model/PveEnemyModel';
import PvePool from '../../utils/PvePool';
import PveSceneModel from '../../model/PveSceneModel';
import PveSceneState from '../../enum/PveSceneState';
import { PveFightType } from '../../core/PveFightModel';

/**
 * Pve技能名字特效
 * @Author: yaozu.hu
 * @Date: 2019-08-20 11:48:29
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-07-06 10:56:18
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/other/PveSkillNameEffect")
export default class PveSkillNameEffect extends cc.Component {

    @property(cc.Node)
    heroNode: cc.Node = null;
    @property(cc.Node)
    enemyNode: cc.Node = null;

    @property(cc.Label)
    heroSkillNameLb: cc.Label = null;
    @property(cc.Label)
    enemySkillNameLb: cc.Label = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    sceneModel: PveSceneModel;
    target: PveBaseFightCtrl;

    isHero: boolean = true;
    action: cc.Action = null;

    set value(s: string) {
        this.heroSkillNameLb.string = s;
        this.enemySkillNameLb.string = s;
    }

    onEnable() {
        let spineName = "stand"
        if (this.target.model.type == PveFightType.Enemy) {
            this.isHero = false;
            this.heroNode.active = false;
            this.enemyNode.active = true;
            spineName = "stand2"
        } else {
            this.isHero = true;
            this.heroNode.active = true;
            this.enemyNode.active = false;
        }
        let pos = this.target.getPos();
        let rect = this.target.getRect();
        let add = 45;
        if (this.target.model.type == PveFightType.Enemy) {
            if ((this.target.model as PveEnemyModel).isBoss) {
                add = 75;
            }
        }
        let temY = rect != null ? rect.y + rect.height + add : add; //-90
        this.node.setPosition(pos.x, pos.y + temY);

        this.spine.node.active = false;
        let speed = Math.max(1, this.sceneModel.timeScale)
        this.action = cc.speed(
            cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.3),
                    cc.scaleTo(0.3, 1),
                ),
                cc.delayTime(0.2),
                cc.callFunc(() => {
                    this.spine.node.active = true;
                    this.spine.setAnimation(0, spineName, false)
                    this.spine.timeScale = speed;
                }),
                cc.delayTime(1.8),
                cc.spawn(
                    cc.fadeOut(0.2),
                    cc.scaleTo(0.2, 0.5),
                ),
                cc.callFunc(() => {
                    this.hide();
                }),
            ),
            speed
        )
        this.node.runAction(this.action);
    }

    onDisable() {
        this.target = null;
        this.sceneModel = null;
        this.value = '';
        this.action = null;
    }
    hide(effect: boolean = true) {
        gdk.NodeTool.hide(this.node, effect, () => {
            PvePool.put(this.node);
        });
    }

    @gdk.binding('sceneModel.timeScale')
    _setTimeScale(v: number) {
        if (!this.sceneModel) return;
        if (!cc.isValid(this.node)) return;
        this.spine.timeScale = v;
        this.action['setSpeed'](v);
    }
    @gdk.binding('sceneModel.state')
    _sceneState(v: PveSceneState) {
        switch (v) {
            case PveSceneState.Pause:
                this.spine.timeScale = 0;
                this.action['setSpeed'](0);
                break;
            case PveSceneState.Fight:
                let speed = Math.max(1, this.sceneModel.timeScale)
                this.spine.timeScale = speed;
                this.action['setSpeed'](speed);
                break;
            default:
                this.hide(false);
        }
    }
}
