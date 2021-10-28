import { GlobalCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import { CopyType } from '../../../../common/models/CopyModel';
import ButtonSoundId from '../../../../configs/ids/ButtonSoundId';
import PanelId from '../../../../configs/ids/PanelId';
import PveGeneralCommingCtrl from '../../ctrl/view/PveGeneralCommingCtrl';
import PvePool from '../../utils/PvePool';
import PveTool from '../../utils/PveTool';
import PveSceneBaseAction from '../base/PveSceneBaseAction';

/**
 * PVE场景阵营表现节点
 * @Author: yaozu.hu 
 * @Date: 2020-11-26 09:51:41
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-04-02 17:01:31
 */


@gdk.fsm.action("PveSceneGroupEffectAction", "Pve/Scene")
export default class PveSceneGroupEffectAction extends PveSceneBaseAction {

    pathStr: string[] = ['E_zhenyingguanghuanhuang', 'E_zhenyingguanghuanzi', 'E_zhenyingguanghuanhong', 'E_zhenyingguanghuanlan', 'E_zhenyingguanghuanlv', 'E_zhenyingguanghuanbai']
    buffIds: number[] = [4033, 4034, 4035, 4036, 4037, 4038]
    onEnter() {
        super.onEnter();
        if (this.model.stageConfig.copy_id != CopyType.NONE && this.model.stageConfig.copy_id != CopyType.RookieCup && this.model.eliteStageUtil.upHerosAddSkills.length > 0 && this.model.eliteStageUtil.groupMaxtype > 0) {
            let type = this.model.eliteStageUtil.groupMaxtype
            let path = `spine/skill/${this.pathStr[type - 1]}/${this.pathStr[type - 1]}`
            let startPos = cc.v2(53, this.ctrl.content.height - 60)
            let endPos = cc.v2(this.ctrl.content.width / 2, this.ctrl.content.height / 2)
            //播放阵营特效 极光者-黄  漫夜者-紫   灵力者-红  潜力者-蓝   魅力者-绿
            PveTool.createSpine(
                this.ctrl.spineNodePrefab,
                this.ctrl.effect,
                path,
                'hit',
                false,
                Math.max(1, this.model.timeScale),
                (spine: sp.Skeleton, resId: string, res: sp.SkeletonData) => {
                    if (!cc.isValid(spine.node)) {
                        this.finish()
                        return;
                    }
                    spine.setCompleteListener(null);

                    spine.animation = 'hit2';
                    spine.loop = true;
                    spine.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
                    let n = spine.node;
                    //播放音效
                    gdk.sound.play(gdk.Tool.getResIdByNode(n), ButtonSoundId.group_buff)

                    let action = cc.speed(
                        cc.sequence(
                            cc.fadeIn(0),
                            cc.spawn(
                                cc.moveTo(0.6, endPos),
                                cc.callFunc((node: cc.Node, end: cc.Vec2) => {
                                    let from = node.getPos();
                                    let angle = Math.atan2(from.y - end.y, from.x - end.x);
                                    let degree = angle * 180 / Math.PI;
                                    n.angle = -(degree <= 0 ? -degree : 360 - degree);
                                }, n, endPos),
                            ),
                            cc.callFunc((node: cc.Node, spine: sp.Skeleton) => {
                                node.angle = 0;
                                spine.loop = false;
                                spine.animation = 'hit3';
                                //给所有英雄加buff
                                this.model.heros.forEach(hero => {
                                    PveTool.addBuffsTo(
                                        hero.model.fightId,
                                        hero.model.prop,
                                        hero,
                                        this.buffIds[type - 1],
                                        1.2,
                                        null,
                                    );
                                })
                                spine.setCompleteListener(() => {
                                    spine.setCompleteListener(null);
                                    PveTool.clearSpine(spine);
                                    PvePool.put(node);
                                    // 回收资源
                                    if (resId && cc.isValid(res)) {
                                        gdk.rm.releaseRes(resId, res, sp.SkeletonData);
                                    }
                                    this.showGeneralSkillTips();
                                });

                            }, n, spine)
                        ),
                        this.model.timeScale
                    );
                    n.runAction(action);

                },
                () => {
                    if (!this.ctrl.enabled) return false;
                    return true;
                },
                startPos,
                true,
                true,
            );

        } else {
            this.showGeneralSkillTips()
        }
    }


    showGeneralSkillTips() {
        //判断是否需要播放指挥官技能
        if (!this.model.isDemo && !this.model.isReplay) {
            let tem = ConfigManager.getItemByField(GlobalCfg, 'key', 'general_skills_unlock').value;
            if (tem && (tem[3] == this.model.stageConfig.id || tem[5] == this.model.stageConfig.id)) {

                let index = tem.indexOf(this.model.stageConfig.id);
                let skillId = tem[index - 1];
                gdk.panel.setArgs(PanelId.PveGeneralComming, skillId, this.model.timeScale)
                gdk.panel.open(PanelId.PveGeneralComming, (node) => {
                    let ctrl = node.getComponent(PveGeneralCommingCtrl);
                    ctrl.node.onHide.on(() => {
                        this.finish()
                    }, this);
                });
            } else {
                this.finish()
            }
        } else {
            this.finish()
        }
    }

    onExit() {
        super.onExit();
    }
}
