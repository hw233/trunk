import { MonsterCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import FightingMath from '../../../../common/utils/FightingMath';
import MathUtil from '../../../../common/utils/MathUtil';
import { getPveFightAnmNameValue, PveFightAnmNameEnum } from '../../const/PveAnimationNames';
import PveFsmEventId from '../../enum/PveFsmEventId';
import { onSpineEvent } from '../../model/PveSkillModel';
import PveTrapModel from '../../model/PveTrapModel';
import PveTool from '../../utils/PveTool';
import PveFightLoadResAction from '../base/PveFightLoadResAction';

/**
 * Pve陷阱资源加载动作
 * @Author: sthoo.huang
 * @Date: 2019-07-10 16:55:42
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-07 14:11:42
 */
const { property } = cc._decorator;

@gdk.fsm.action("PveTrapLoadResAction", "Pve/Trap")
export default class PveTrapLoadResAction extends PveFightLoadResAction {

    @property({ type: cc.Enum(PveFightAnmNameEnum), tooltip: "循环待机的动画名称" })
    loopAnimation: PveFightAnmNameEnum = PveFightAnmNameEnum.IDLE;

    model: PveTrapModel;

    loadRes() {
        if (this.model.skin) {
            super.loadRes();
            return;
        }
        // 预加载怪物模型
        if (this.model.type == 1 || this.model.type == 2) {
            let mcfg = ConfigManager.getItemById(MonsterCfg, this.model.config.enemy_id);
            if (cc.js.isString(mcfg.skin) && mcfg.skin.length > 0) {
                gdk.rm.loadRes(
                    gdk.Tool.getResIdByNode(this.node),
                    PveTool.getSkinUrl(mcfg.skin),
                    sp.SkeletonData,
                );
            }
        }
        // 无外观的陷阱
        gdk.Timer.once(40, this, this._finish)
    }

    setAnimation() {
        let config = this.model.config;
        let hit_anm: any = config.hit_animation;
        if (!hit_anm) {
            // 为空时，则不需要出现动画
            // 延迟60毫秒(立马结束，可能会导致第一次检测不到目标)
            gdk.Timer.once(40, this, this._finish)
        } else {
            // 存在出现动作时
            if (typeof hit_anm === 'object') {
                // 配置中动作为数组，则随机挑一个动作
                hit_anm = hit_anm[MathUtil.rnd(0, hit_anm.length - 1)];
            }
            if (!hit_anm) {
                hit_anm = getPveFightAnmNameValue(this.animation);
            }
            this.ctrl.setAnimation(
                hit_anm,
                {
                    loop: this.loop,
                    mode: 'set',
                    onComplete: () => {
                        if (!cc.isValid(this.node)) return;
                        this._finish();
                    },
                    onEvent: (eventName: string) => {
                        if (!this.ctrl) return;
                        onSpineEvent(eventName, null, this.ctrl);
                    },
                    thisArg: this,
                }
            );
        }
    }

    _finish() {
        if (!cc.isValid(this.node)) return;
        if (!this.model) return;
        let loop_anim: any = this.model.config.stand_animation;
        if (typeof loop_anim === 'object') {
            // 配置中动作为数组，则随机挑一个动作
            loop_anim = loop_anim[FightingMath.rnd(0, loop_anim.length - 1)];
        }
        if (loop_anim != '') {
            this.ctrl.setAnimation(loop_anim, {
                mode: 'set',
                loop: true,
                onEvent: (eventName: string) => {
                    if (!this.ctrl) return;
                    onSpineEvent(eventName, null, this.ctrl);
                },
                thisArg: this,
            });
        }
        this.model.stand_animation = loop_anim;
        if (this.model.config.type == 1) {
            // 创建怪物
            this.model.loaded = true;
            this.sendEvent(PveFsmEventId.PVE_FIGHT_CREATEMONSTER);
        } else if (this.model.config.type == 2) {
            // 创建召唤物
            this.model.loaded = true;
            this.sendEvent(PveFsmEventId.PVE_FIGHT_CREATECALL);
        } else {
            // 添加buff
            this.finish();
        }
    }

    // 加载完成时，不执行动作完成操作
    onFinish() { }

    finish() {
        this.model.loaded = true;
        super.finish();
    }

    onExit() {
        gdk.Timer.clearAll(this);
        super.onExit();
    }
}