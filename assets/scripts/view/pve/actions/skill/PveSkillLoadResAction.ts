import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PvePool from '../../utils/PvePool';
import PveRes from '../../const/PveRes';
import PveSceneModel from '../../model/PveSceneModel';
import PveSceneState from '../../enum/PveSceneState';
import PveSkillBaseAction from '../base/PveSkillBaseAction';
import PveTool from '../../utils/PveTool';
import StringUtils from '../../../../common/utils/StringUtils';
import { PveFightType } from '../../core/PveFightModel';
import { PveSkillType } from '../../const/PveSkill';

/**
 * Pve技能资源加载动作
 * @Author: sthoo.huang
 * @Date: 2019-04-30 11:21:18
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-31 16:35:09
 */
const { property } = cc._decorator;
const COMM_URL = 'spine/common/E_com_xuli/E_com_xuli';

@gdk.fsm.action("PveSkillLoadResAction", "Pve/Skill")
export default class PveSkillLoadResAction extends PveSkillBaseAction {

    sceneModel: PveSceneModel;
    loaded: boolean;
    time: number;
    fightId: number = 0;    // 记录技能所属的fightId

    onEnter() {
        super.onEnter();
        this.sceneModel = this.model.ctrl.sceneModel;
        this.loaded = false;
        this.time = this.model.config.pre_cd || 0;
        if (this.sceneModel.state === PveSceneState.Ready) {
            this.time = Math.max(this.time, 0.5);
        }
        this.fightId = this.model.attacker_id;

        // 加载特效资源
        this.loadRes();
    }

    loadRes() {
        let resId: string = gdk.Tool.getResIdByNode(this.node);
        let url: string = StringUtils.format(PveRes.PVE_SKILL_RES, this.model.config.effect_res);
        let id: number = this.model.id;
        gdk.rm.loadRes(resId, url, sp.SkeletonData, () => {
            // 资源加载成功
            if (!cc.isValid(this.node)) return;
            if (!this.active) return;
            if (!this.model || this.model.id != id) return;
            this.loaded = true;
            this.checkFinish();
        }, () => {
            // 资源加载失败，使用默认特效代替
            if (!cc.isValid(this.node)) return;
            if (!this.active) return;
            if (!this.model || this.model.id != id) return;
            this.model.config.effect_res = 'E_null';
            this.loadRes();
        });
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        if (!this.model.attacker || !this.model.attacker.isAlive) {
            this.broadcastEvent(PveFsmEventId.PVE_SKILL_ANIM_COMPLETE);
            return;
        }
        // 塔防准备界面，上下阵英雄时的技能残留问题检测
        if (this.fightId != this.model.attacker_id) {
            this.broadcastEvent(PveFsmEventId.PVE_SKILL_ANIM_COMPLETE);
            return;
        }
        if (this.time <= 0) return;
        if (this.sceneModel.state !== PveSceneState.Fight) return;
        // 计算前置冷却时间
        this.time -= dt * this.getScale();
        if (this.time <= 0) {
            // 冷却时间到了
            this.checkFinish();
        }
    }

    // 获取当前施法对象的时间缩放值
    getScale() {
        let attacker = this.model.attacker;
        if (!attacker || !attacker.isAlive) {
            return 100000000;
        }
        return attacker.model.speedScale;
    }

    // 检查是否完成
    checkFinish() {
        // 前置CD还没到，或资源没加载完成
        if (this.time > 0 || !this.loaded) return;

        // 非战斗状态不使用技能
        if (this.sceneModel.state !== PveSceneState.Fight) {
            this.time = 0.2;
            return;
        }

        // 放法者死亡了，则清除此技能
        let attacker = this.model.attacker;
        if (!attacker || !attacker.isAlive) {
            this.broadcastEvent(PveFsmEventId.PVE_SKILL_ANIM_COMPLETE);
            return;
        }

        // 播放闪光特效
        let m = this.model;
        if (m.attacker.model.type == PveFightType.Hero &&
            (PveSkillType.isAutoTDSkill(m.config.type) || PveSkillType.isSuper(m.config.type))
        ) {
            // 非普攻，施法者为英雄，类型为自动施放的TD技能
            let url = m.config.super_effect_res || COMM_URL;
            if (url != COMM_URL) {
                url = StringUtils.format(PveRes.PVE_SKILL_RES, url);
            }
            PveTool.createSpine(
                this.sceneModel.ctrl.spineNodePrefab,
                this.sceneModel.ctrl.effect,
                url,
                url == COMM_URL ? 'stand' : 'atk',
                false,
                Math.max(1, this.sceneModel.timeScale),
                (spine: sp.Skeleton, resId: string, res: sp.SkeletonData) => {
                    if (!cc.isValid(spine.node)) return;
                    // 清理并回收spine节点
                    PveTool.clearSpine(spine);
                    PvePool.put(spine.node);
                    // // 回收资源
                    // url != COMM_URL && gdk.rm.releaseRes(resId, res);
                },
                () => {
                    //if (!cc.isValid(this.node)) return false;
                    if (!m.attacker) return false;
                    if (!m.attacker.isAlive) return false;
                    return true;
                },
                PveTool.getCenterPos(m.attacker.getPos(), m.attacker.getRect()),
                true,
                true,
            );
            // 延时调用完成
            gdk.Timer.once(600 / Math.max(1.0, m.attacker.model.speedScale * this.sceneModel.timeScale), this, this._finish);
        } else {
            // 调用完成接口
            gdk.Timer.once(1, this, this._finish);
        }
    }

    _finish() {
        if (!this.model) return;
        // 播放施法音效
        this.model.config.atk_sound &&
            GlobalUtil.isSoundOn &&
            gdk.sound.play(
                gdk.Tool.getResIdByNode(this.sceneModel.ctrl.node),
                this.model.config.atk_sound,
            );

        if (!this.model.effectType.has_atk_animation) {
            // 查找目标
            this.sendEvent(PveFsmEventId.PVE_SKILL_SEARCH);
        } else {
            // 播放施法动作
            this.sendEvent(PveFsmEventId.PVE_SKILL_ATK_ANIM);
        }
    }

    onExit() {
        gdk.Timer.clear(this, this._finish);
        this.sceneModel = null;
        this.loaded = false;
        this.time = 0;
        this.fightId = 0;
        super.onExit();
    }
}