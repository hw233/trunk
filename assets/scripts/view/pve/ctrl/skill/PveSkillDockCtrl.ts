import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel, { CopyType } from '../../../../common/models/CopyModel';
import ModelManager from '../../../../common/managers/ModelManager';
import PveEventId from '../../enum/PveEventId';
import PveGeneralCtrl from '../fight/PveGeneralCtrl';
import PvePool from '../../utils/PvePool';
import PveSceneCtrl from '../PveSceneCtrl';
import PveSceneModel from '../../model/PveSceneModel';
import PveSceneState from '../../enum/PveSceneState';
import { GlobalCfg } from '../../../../a/config';
import { PveSkillType } from '../../const/PveSkill';

/**
 * Pve技能栏控制组件类
 * @Author: sthoo.huang
 * @Date: 2019-04-23 15:12:15
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-24 11:38:54
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/PveSkillDockCtrl")
export default class PveSkillDockCtrl extends cc.Component {

    @property(cc.Prefab)
    manualSkillPrefab: cc.Prefab = null;

    @property(gdk.List)
    list: gdk.List = null;

    @property(cc.ProgressBar)
    energyBar: cc.ProgressBar = null;

    @property(cc.Label)
    enerbyTxt: cc.Label = null;

    @property(PveSceneCtrl)
    sceneCtrl: PveSceneCtrl = null;

    @property(cc.Prefab)
    stopMoveEffect: cc.Prefab = null;

    @property(sp.Skeleton)
    stopSKillEffect: sp.Skeleton = null;

    sceneModel: PveSceneModel;

    stopSkillEffectNum: number = 0;

    stopSkillEffEctNodes: cc.Node[] = [];

    stopSKillTime = 0;
    isPause: boolean = false;
    onEnable() {
        this.sceneModel = this.sceneCtrl.model;
        gdk.e.on(PveEventId.PVE_STOP_GENERAL_SKILL, this.stopGeneralSkill, this, 0, false);
        gdk.e.on(PveEventId.PVE_GENERAL_UNLOCK_SKILL, this.unLockGeneralSkill, this, 0, false);
    }

    update(dt: number) {
        if (!this.sceneModel) return;
        if (!this.isPause && this.stopSKillTime > 0) {
            this.stopSKillTime -= dt * this.sceneModel.timeScale;
            if (this.stopSKillTime <= 0) {
                this.cancelStopEffect();
            }
        }
    }
    onDisable() {

        if (!this.isPause) {
            gdk.e.targetOff(this);
            this.sceneModel = null;
            this.cancelStopEffect();
        }
    }

    @gdk.binding('sceneModel.energy')
    _energy(v: number) {
        if (!this.sceneModel) return;
        if (!this.sceneModel.config) return;
        let max = this.sceneModel.config.energy_limit;
        this.enerbyTxt.string = Math.floor(v) + "/" + max;
        this.energyBar.progress = v / max;
    }

    @gdk.binding('sceneModel.generals')
    _setList(v: PveGeneralCtrl[]) {
        // console.log(GuideUtil.getCurGuideId())
        if (!this.sceneModel) return;
        if (!this.sceneModel.generals) return;
        if (!this.sceneModel.generals.length) return;
        let a: any[] = [];
        let g: PveGeneralCtrl = v[0];
        let s = g.model.skills;
        let skillId = 0;
        let tem = ConfigManager.getItemByField(GlobalCfg, 'key', 'general_skills_unlock').value;
        if (tem && (tem[3] == this.sceneModel.stageConfig.id || tem[5] == this.sceneModel.stageConfig.id)) {
            let index = tem.indexOf(this.sceneModel.stageConfig.id);
            if (index == 3) {
                skillId = tem[2]
            } else {
                skillId = tem[4]
            }
        }
        //非主线副本指挥官技能判断
        let hideSkillId: number[] = []
        if (this.sceneModel.stageConfig.copy_id != CopyType.MAIN) {
            let stageId = ModelManager.get(CopyModel).lastCompleteStageId;
            if (stageId < tem[3]) {
                hideSkillId = [tem[2], tem[4]]
            } else if (stageId < tem[5]) {
                hideSkillId = [tem[4]]
            }
        }
        s.forEach(item => {
            if (PveSkillType.isManualTD(item.type)) {
                if (hideSkillId.indexOf(item.id) < 0) {
                    a.push({
                        id: item.id,
                        general: g,
                        skill: item,
                        dock: this,
                        skillPrefab: this.manualSkillPrefab,
                        hideSkill: skillId,
                    });
                }
            }
        });
        this.list.datas = a;

    }

    @gdk.binding('sceneModel.state')
    _setState(v: PveSceneState) {
        switch (v) {
            case PveSceneState.Loading:
            case PveSceneState.Reset:
            case PveSceneState.Ready:
                this.list.datas = [];
                this.cancelStopEffect();
                this.stopSKillTime = 0;
            case PveSceneState.Pause:
                this.isPause = true;
            case PveSceneState.Fight:
                this.isPause = false;
                break;
        }
    }

    stopGeneralSkill(params: any[]) {
        let fightId = params[2];
        let temTime = params[1];
        let target = this.sceneModel.getFightBy(fightId);
        let skillPos = this.list.node.children
        this.stopSkillEffectNum = 0;
        this.stopSkillEffEctNodes = [];
        if (target && skillPos.length > 0) {
            let pos = target.getPos();
            let effrct = this.sceneModel.ctrl.stopSkillNode;
            effrct.removeAllChildren();
            let temPos1 = this.sceneModel.ctrl.thing.convertToWorldSpaceAR(pos);
            let from = effrct.convertToNodeSpaceAR(temPos1);

            if (fightId > 0) {
                //创建3个移动特效
                for (let i = 0; i < skillPos.length; i++) {
                    let temP1 = this.list.node.convertToWorldSpaceAR(skillPos[i].getPosition());
                    let end = effrct.convertToNodeSpaceAR(temP1);
                    let node: cc.Node = PvePool.get(this.stopMoveEffect);
                    node.setParent(effrct)
                    node.setPosition(from)
                    this.stopSkillEffEctNodes.push(node);
                    //设置朝向
                    let angle = Math.atan2(from.y - end.y, from.x - end.x);
                    let degree = angle * 180 / Math.PI;
                    node.angle = -(degree <= 0 ? -degree : 360 - degree);
                    let effect = node.getComponent(sp.Skeleton);
                    effect.setAnimation(0, 'skill1_move', true);
                    let action = cc.speed(
                        cc.sequence(
                            cc.fadeIn(0),
                            cc.delayTime(0.1),
                            cc.moveTo(0.5, end),
                            cc.callFunc(() => {
                                node.stopAllActions();
                                let t = effect.setAnimation(0, 'skill1_hit2', false);
                                if (t) {
                                    effect.setCompleteListener((trackEntry, loopCount) => {
                                        let name = trackEntry.animation ? trackEntry.animation.name : '';
                                        if (name === "skill1_hit2") {
                                            //this.stopSKillEffect.node.active = false;
                                            effect.setAnimation(0, 'skill1_stand2', true);
                                        }
                                    })
                                }
                                //PvePool.put(node);
                                //this.stopSkillEffectNum += 1;
                                // if (this.stopSkillEffectNum == 3) {
                                //     this.stopSKillEffect.node.active = true;

                                // }
                            }),
                        ),
                        1,
                    )
                    node.runAction(action);
                }
            }
        }
        //gdk.Timer.clear(this, this.cancelStopEffect);
        //gdk.Timer.once(temTime, this, this.cancelStopEffect)
        this.stopSKillTime = temTime / 1000;
    }

    cancelStopEffect() {
        //this.stopSKillEffect.node.active = false;
        for (let i = this.stopSkillEffEctNodes.length - 1; i >= 0; i--) {
            let node = this.stopSkillEffEctNodes[i];
            PvePool.put(node);
        }
        this.stopSkillEffEctNodes = []
    }

    //解锁指挥官技能
    unLockGeneralSkill(params: any[]) {
        this.list.node.children.forEach(child => {
            child.opacity = 255;
        })
    }
}