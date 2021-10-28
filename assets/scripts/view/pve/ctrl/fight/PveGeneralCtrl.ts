import PveBaseFightCtrl from './PveBaseFightCtrl';
import PveEnemyCtrl from './PveEnemyCtrl';
import PveGeneralModel from '../../model/PveGeneralModel';
import PveManualSkillNameEffect from '../base/PveManualSkillNameEffect';
import PvePool from '../../utils/PvePool';
import PveTool from '../../utils/PveTool';

/**
 * Pve指挥官控制类
 * @Author: sthoo.huang
 * @Date: 2019-05-20 21:21:58
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-10-15 20:55:37
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/fight/PveGeneralCtrl")
export default class PveGeneralCtrl extends PveBaseFightCtrl {

    model: PveGeneralModel;
    spine: sp.Skeleton;

    onEnable() {
        this.spine = this.spines[0];
        this.spine.paused = false;
        if (this.node.name == 'general_1') {
            this.spine.node.opacity = 0;
            this.node.width = 0;
            this.node.height = 0;
        } else {
            this.spine.node.opacity = 255;
            this.node.width = 100;
            this.node.height = 140;
        }
        super.onEnable();
    }

    reset() {
        let model = this.model;
        model.id = model.id;
        model.info = model.info;
        this.node.setPosition(model.orignalPos);
        super.reset();
    }

    onReady() {
        this.model.energyTime = this.sceneModel.config.energy_time;
    }

    // 方向计算
    setDir(to: cc.Vec2) {
        PveEnemyCtrl.prototype.setDir.call(this, to);
    }

    getScale(animation: string): number {
        return PveEnemyCtrl.prototype.getScale.call(this, animation);
    }

    getAnimation(animation: string): string {
        return PveEnemyCtrl.prototype.getAnimation.call(this, animation, true);
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        let model = this.model;
        if (model.ready != true) return;
        // 能量恢复
        model.energyTime -= dt;
        if (model.energyTime <= 0) {
            let sceneModel = this.sceneModel;
            sceneModel.addEnergy(this.model.getProp('energy_charge'));
            model.energyTime = sceneModel.config.energy_time;
        }
        super.updateScript(dt);
    }

    // 显示技能名称提示
    showSkillName(skillId: number) {
        PveTool.callLater(this, this.showSkillNameLater, [skillId]);
    }
    showSkillNameLater(skillId: number) {
        let m = this.sceneModel;
        if (!m) return;
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let skillNames = ['zd_cnsp', 'zd_grsb', 'zd_tkcj']
        let name = '';
        switch (skillId) {
            case 99030:
                name = skillNames[0];
                break;
            case 99050:
                name = skillNames[1];
                break;
            case 99060:
                name = skillNames[2];
                break;
        }
        let node: cc.Node = PvePool.get(m.ctrl.manualSkillNamePrefabs);
        let ctrl = node.getComponent(PveManualSkillNameEffect);
        ctrl.iconName = name;
        m.ctrl.hurt.addChild(node);
    }
}