import ConfigManager from '../../../../common/managers/ConfigManager';
import PveFightBaseEffectCtrl from '../base/PveFightBaseEffectCtrl';
import PveFightModel from '../../core/PveFightModel';
import PveHaloModel from '../../model/PveHaloModel';
import PvePool from '../../utils/PvePool';
import PveRes from '../../const/PveRes';
import PveTool from '../../utils/PveTool';
import StringUtils from '../../../../common/utils/StringUtils';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import { Skill_buffCfg, Skill_haloCfg, Skill_target_typeCfg } from '../../../../a/config';

/**
 * Pve场景光环控制类组件
 * @Author: sthoo.huang
 * @Date: 2019-05-10 15:06:25
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-09 18:39:12
 */

const { ccclass, property, menu } = cc._decorator;
let _index = 0;

@ccclass
export default class PveBaseHaloCtrl extends PveFightBaseEffectCtrl {

    index: number;
    interval: number;

    get defaultInterval() {
        return 0.5 + this.index % 10 * (1 / cc.game.getFrameRate());
    }

    onEnable() {
        this.index = _index++;
        this.interval = this.defaultInterval;
    }

    onDisable() {
        if (this.target) {
            let model: PveFightModel = this.target.model;
            if (model) {
                if (model.halos.length > 0) {
                    PvePool.put(...model.halos);
                    model.halos.length = 0;
                }
            }
        }
        super.onDisable();
    }

    /**
     * 增加Halo
     * @param v 
     */
    addHalo(v: PveHaloModel) {
        let halo: PveHaloModel = this.findHalo(v.id);
        if (halo) {
            // halo已经存在, 更新剩余时间
            halo.remain = v.remain;
            // 把不需要的数据放入到对象池中
            PvePool.put(v);
            return;
        }
        // BUFF不存在，则添加至BUFF列表
        this.target.model.halos.push(v);
        // 更新组件状态
        if (!this.enabled) {
            this.enabled = true;
        }
        gdk.Timer.callLater(this, this.updateEffect);
    }

    /**
     * 删除光环
     * @param id 
     */
    removeHalo(id: number) {
        let b = false;
        let halos = this.target.model.halos;
        for (let i = halos.length - 1; i >= 0; i--) {
            let h = halos[i];
            if (id === h.id) {
                b = true;
                halos.splice(i, 1);
                PvePool.put(h);
            }
        }
        b && gdk.Timer.callLater(this, this.updateEffect);
    }

    /**
     * 查找Halo，如果为多个则只返回第一个
     * @param id 
     */
    findHalo(id: number): PveHaloModel {
        let halos = this.target.model.halos;
        for (let i = 0, n = halos.length; i < n; i++) {
            let h = halos[i];
            if (id === h.id) {
                return h;
            }
        }
        return null;
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        this.interval -= dt;
        // 刷新光环
        let halos = this.target.model.halos;
        let len = halos.length;
        let refresh: boolean = false;
        if (len > 0) {
            let am = this.target.model;
            let addbuff = false;
            if (this.interval <= 0) {
                this.interval = this.defaultInterval;
                addbuff = true;
            }
            for (let i = len - 1; i >= 0; i--) {
                let h: PveHaloModel = halos[i];
                let c: Skill_haloCfg = h.config;
                if (addbuff) {
                    if (cc.js.isNumber(c.buff_id)) {
                        // 添加Buff
                        let arr = this.searchObject(h);
                        if (arr && arr.length > 0) {
                            let cfg = ConfigManager.getItemById(Skill_buffCfg, c.buff_id);
                            for (let j = 0, n = arr.length; j < n; j++) {
                                let target = arr[j];
                                let exist = false;
                                if (target.buff) {
                                    let buf = target.buff.findBuf(c.buff_id, cfg.stacking_class);
                                    if (buf && cfg.stacking_fold == 1) {
                                        // 存在则仅更新BUFF的持续时间
                                        buf.remain = c.buff_time;
                                        buf.max_remain = c.buff_time;
                                        exist = true;
                                    }
                                }
                                if (!exist) {
                                    // 不存在就添加新的BUFF
                                    PveTool.addBuffTo(am.fightId, am.prop, arr[j], c.buff_id, c.buff_time);
                                }
                            }
                        }
                    }
                }
                // 更新持续时间
                h.remain -= dt;
                if (h.remain <= 0) {
                    // 移除Halo
                    PvePool.put(h);
                    halos.splice(i, 1);
                    refresh = true;
                }
            }
        }
        if (refresh) {
            this.updateEffect();
        }
        // 所有光环都已失效
        if (halos.length == 0) {
            if (this.sceneModel) {
                this.enabled = false;
            }
        }
    }

    _getSkinCfg() {
        if (!this.enabled) return null;
        if (!this.target || !this.target.isAlive) return null;
        let halos = this.target.model.halos;
        for (let i = halos.length - 1; i >= 0; i--) {
            let buf = halos[i];
            if (buf.config.skin != '') {
                return buf.config;
            }
        }
        return null;
    }

    getSkin(): string {
        let cfg = this._getSkinCfg();
        if (cfg) {
            return StringUtils.format(PveRes.PVE_BUFF_RES, cfg.skin);
        }
        return null;
    }

    getSkinPos(): number {
        let cfg = this._getSkinCfg();
        if (cfg && cc.js.isNumber(cfg.skin_pos)) {
            return cfg.skin_pos as any;
        }
        return 1;
    }

    // 查找目标
    searchObject(halo: PveHaloModel): PveFightCtrl[] {
        let c: Skill_target_typeCfg = ConfigManager.getItemById(Skill_target_typeCfg, halo.config.target_type);
        let r: number = halo.config.range;
        let p: cc.Vec2 = this.target.getPos();
        let all: PveFightCtrl[] = this.sceneModel.fightSelector.getAllFights(this.target, c, this.sceneModel, null, p, r);
        if (all && all.length) {
            return this.sceneModel.fightSelector.circleSelect(
                all,
                p,
                PveTool.getPriorityType(c, false),
                r,
                halo.config.num
            );
        }
        return null;
    }
}