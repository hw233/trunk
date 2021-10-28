import ConfigManager from '../../../../common/managers/ConfigManager';
import MathUtil from '../../../../common/utils/MathUtil';
import PveFightUtil from '../../utils/PveFightUtil';
import PveSceneModel from '../../model/PveSceneModel';
import PveSkillLinearMotionAction from './PveSkillLinearMotionAction';
import PveTool from '../../utils/PveTool';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import { Skill_callCfg, Skill_trapCfg } from '../../../../a/config';

/**
 * Pve技能直线移动动作
 * @Author: sthoo.huang
 * @Date: 2019-04-30 17:18:43
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-10-19 14:32:45
 */
const { property } = cc._decorator;

@gdk.fsm.action("PveSkillLinearMotionCallAction", "Pve/Skill")
export default class PveSkillLinearMotionCallAction extends PveSkillLinearMotionAction {

    sceneModel: PveSceneModel;
    delay: number;
    call_id: number;
    call_num: number;
    attacker: PveFightCtrl;
    call_lv: number;
    call_config: Skill_callCfg;
    trap_range: number;
    interval: number;
    call_time: number;
    is_arrival: boolean;

    preInit() {
        let model = this.model;
        this.sceneModel = this.ctrl.sceneModel;
        this.delay = 0.125;
        this.call_id = model.config.call_id;
        this.call_num = model.config.call_num;
        this.attacker = model.attacker;
        let temcfg = ConfigManager.getItemByField(Skill_callCfg, 'call_id', this.call_id)
        if (temcfg && (temcfg.ai == 1 || temcfg.ai == 2)) {
            this.call_config = PveTool.getSkillCallConfig(this.call_id, this.call_lv);
        } else {
            this.call_config = temcfg;
        }
        if (this.call_config) {
            let range = ConfigManager.getItemById(Skill_trapCfg, this.call_config.monster).range;
            if (cc.js.isNumber(range)) {
                this.trap_range = range;
            } else {
                this.trap_range = range[0];
            }
            this.call_time = model.config.call_time;
            this.interval = 0;
            this.is_arrival = false;
        } else {
            this.trap_range = 0;
        }
    }

    /** 根据伤害范围计算目标坐标点 */
    getToPos(index?: number, dt: number = 0) {
        if (!this.sceneModel) {
            this.preInit();
        }
        let from: cc.Vec2 = super.getFromPos(index);
        let to: cc.Vec2 = super.getToPos(index, dt);
        // 计算两点间的距离
        let range: number = 0;
        // 如果有配置to_pos_range则直接做为range使用
        let pos_range: number = this.model.effectType.to_pos_range;
        if (pos_range > 0) {
            range = pos_range;
        } else {
            // 如果有配置dmg_range则做为最小距离
            let dmg_range: any = this.model.config.dmg_range;
            range = MathUtil.distance(from, to) + this.trap_range;
            if (cc.js.isNumber(dmg_range) && dmg_range > range) {
                range = dmg_range;
            }
        }
        // 计算角度
        let angle: number = Math.atan2(to.y - from.y, to.x - from.x);
        //计算新坐标 r 就是两者的距离
        let pos: cc.Vec2 = cc.v2(
            Math.ceil(from.x + range * Math.cos(angle)),
            Math.ceil(from.y + range * Math.sin(angle)),
        );
        return pos;
    }

    // 节点到达事件
    onArrivalHandle(node: cc.Node, data: any) {
        this.is_arrival = true;
        if (this.call_config) {
            this.createTrap();
        }
        super.onArrivalHandle(node, data);
    }

    // 禁用常规召唤动作
    _callSomething(index: number) { }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        if (!this.is_arrival && this.call_config) {
            if (this.delay > 0) {
                this.delay -= dt;
            }
            if (this.delay <= 0) {
                this.interval -= dt;
                this.call_time -= dt;
                if (this.interval <= 0) {
                    this.createTrap();
                    this.interval = this.trap_range / this.model.config.speed;
                }
            }
        }
        super.updateScript(dt);
    }

    // 召唤陷阱
    createTrap() {
        let call_time = Math.max(0.01, this.call_time);
        let call_id = this.call_config.monster;
        for (let j = 0, m = this.spines.length; j < m; j++) {
            let pos = this.spines[j].node.getPos();
            for (let i = 0; i < this.call_num; i++) {
                PveFightUtil.createTrap(
                    this.sceneModel,
                    call_id,
                    call_time,
                    pos,
                    this.attacker,
                );
            }
        }
    }

    onExit() {
        super.onExit();
        this.sceneModel = null;
        this.delay = 0;
        this.call_id = 0;
        this.call_num = 0;
        this.attacker = null;
        this.call_lv = 0;
        this.call_config = null;
        this.trap_range = 0;
        this.interval = 0;
        this.call_time = 0;
    }
}