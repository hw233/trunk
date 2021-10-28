import ErrorUtils from '../../../../common/utils/ErrorUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MathUtil from '../../../../common/utils/MathUtil';
import PveBaseFightCtrl from '../fight/PveBaseFightCtrl';
import PveBSExprUtils, { PveBSScopeType } from '../../utils/PveBSExprUtils';
import PveBuffModel from '../../model/PveBuffModel';
import PveFightBaseEffectCtrl from '../base/PveFightBaseEffectCtrl';
import PveFightModel, { PveFightType } from '../../core/PveFightModel';
import PvePool from '../../utils/PvePool';
import PveRes from '../../const/PveRes';
import PveTool from '../../utils/PveTool';
import StringUtils from '../../../../common/utils/StringUtils';
import { PveBuffTipType } from '../base/PveBuffTipEffect';
import { PveHurtType } from '../base/PveHurtEffect';
import { ShiedBuffData } from '../../model/PveBaseFightModel';
/**
 * Pve场景Buff控制组件类
 * @Author: sthoo.huang 
 * @Date: 2019-03-20 20:13:07
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-09 22:05:39
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
export default class PveBaseBuffCtrl extends PveFightBaseEffectCtrl {

    // 链接特效的终点坐标
    endPos: cc.Vec2;
    // 链接特效的标记
    isLinkEffet: boolean = false;
    // 当前特效的buffmodel
    buffmodel: PveBuffModel;
    // BUFF属性正在计算中，检测此标记防止循环调用的问题
    isApplying: boolean = false;
    // 需要刷新
    needRefresh: boolean = false;

    onDisable() {
        let model: PveFightModel = this.target && this.target.model;
        if (model) {
            // 针对加减速BUFF特殊处理
            if (model.speedScale != 1) {
                model.speedScaleDirty = true;
                model.speedScale = 1;
            }
            // 清除所有BUFF
            if (model.buffs.length > 0) {
                PvePool.put(...model.buffs);
                model.buffs.length = 0;
                model.buffShield.length = 0;
            }
        }
        this.target && this.target.updateBuff();
        this.isApplying = false;
        this.needRefresh = false;
        this._tempPropFrameId = 0;
        this._tempProp = null;
        gdk.DelayCall.cancel(this.updateEffect, this);
        super.onDisable();
    }

    // 使当前计算的属性失效
    removeTempProp(b: boolean = false) {
        let model = this.target && this.target.model;
        if (model) {
            model.removeTempProp();
        }
        b && (this._tempProp = null);
        this._tempPropFrameId = 0;
    }

    /**
     * Buff效果值
     */
    _tempProp: any;
    _tempPropFrameId: number = 0;
    get prop() {
        let frameId: number = this.sceneModel.frameId;
        if (this.isApplying ||
            this._tempPropFrameId === frameId) {
            // 同一帧取对象属性不重复计算
            return this._tempProp || {};
        }
        this.isApplying = true;
        this.needRefresh = false;
        this._tempPropFrameId = frameId;
        let target = this.target;
        if (target && target.isAlive) {
            // 为了防止在BUFF应用中添加新的BUFF引起异常，则此处需复制一份BUFF列表进行操作
            let model = target.model;
            let n = model.buffs.length;
            let p: any = {};
            if (n > 0) {
                let buffs = n == 1 ? model.buffs : model.buffs.concat();
                for (let i = 0; i < n; i++) {
                    let buf = buffs[i];
                    if (n > 1 && model.buffs.indexOf(buf) < 0) continue;
                    if (buf.isPropType) {
                        // 只针对非间隔执行类型
                        let s: any;
                        if (buf.hasChanged(frameId)) {
                            // 属性发生改变
                            s = this._applyOne(buf, frameId);
                            // 判断目标是否已经死亡
                            if (!target || !target.isAlive) {
                                return;
                            }
                            if (!s) continue;
                        } else {
                            // 没有改变时不重复计算属性
                            s = buf.prop;
                        }
                        // 合并到临时属性中
                        for (let pn in s) {
                            if (s[pn] === void 0) continue;
                            p[pn] = PveTool.getMergeProp(pn, s[pn], p);
                        }
                    }
                    // 合并事件到临时属性中
                    for (let pn in buf.events) {
                        p[pn] = PveTool.getMergeProp(pn, buf.events[pn], p);
                    }
                }
            }

            // 针对加减速BUFF特殊处理
            if ('speed_scale' in p) {
                let speed = Math.min(4, 1 + p.speed_scale);
                speed = Math.max(0, speed);
                if (model.speedScale != speed) {
                    // 更新speedScale属性
                    model.speedScale = speed;
                }
                delete p.speed_scale;
            } else if (model.speedScale != 1) {
                // BUFF失效后还原
                model.speedScale = 1;
            }

            // 针对模型缩放的操作
            let node_scale = p.node_scale
            if (node_scale) {
                // 刚获得BUFF时需修改当前的缩放值
                if (model.nodeScale != p.node_scale) {
                    model.nodeScale = p.node_scale;
                }
            } else if (model.nodeScale != 0) {
                // 针对模型缩放的还原
                model.nodeScale = 0;
            }

            // 针对透明度的操作
            let node = target.node;
            let opacity = p.opacity;
            if (cc.js.isNumber(opacity)) {
                // 刚获得BUFF时修改当前的透明值
                if (node.opacity != opacity) {
                    node.opacity = Math.max(0, Math.min(opacity, 255));
                    node['___has_buf_opacity___'] = true;
                    // 停止节点的渐显效果动作
                    let comp = node.getComponent(gdk.ShowHideComponent);
                    if (comp && comp['_isShow'] === true) {
                        comp['_stopAction']();
                        comp['_isShow'] = null;
                    }
                }
            } else if (node['___has_buf_opacity___']) {
                // 针对透明度的还原
                target.node.opacity = 255;
                delete node['___has_buf_opacity___'];
            }

            // 针对血量上限的操作
            let hp_max = p.hp_max
            if (hp_max) {
                let hp: number = Math.floor(p['hp_max']);
                if (!isNaN(hp)) {
                    // 刚获得BUFF时需修改当前的血量
                    p.hp = hp;
                    // hp = model.hp + hp;
                    // hp = Math.max(0, hp);
                    // hp = Math.min(hp, model.hpMax);
                    // model.hp = hp;
                }
                delete p['hp_max'];
            }

            // 由于血量上限BUFF失效而降低当前血量
            let hpmax: number = model.baseProp.hp + (p.hp ? p['hp'] : 0);
            if (model.hp > hpmax) {
                model.hp = hpmax;
            }
            // 使用新的属性
            this._tempProp = p;
        }
        this.isApplying = false;
        return this._tempProp;
    }

    // 执行一次
    _applyOne(buf: PveBuffModel, frameId?: number) {
        // 从缓存中取表达式
        let key: string = buf.config.effect_expr;
        if (!key || key == '') {
            // 计算次数和执行间隔等
            buf.run();
            // 设置首次执行标志
            buf.first = false;
            // 保存并返回计算结果
            buf.prop = null;
            return;
        }
        let target = this.target;
        let model: PveFightModel = target.model;
        let attacker = this.sceneModel.getFightBy(buf.attacker_id);
        // 构建环境变量
        let scope: PveBSScopeType = {
            t: model.baseProp,
            a: buf.attacker_prop,
            b: buf.config,
            bm: buf,
            am: attacker ? attacker.model : null,
            tm: model,
            m: model,   // 兼容旧的配置
            stacking: buf.stacking,
        };
        let keys = Object.keys(scope);
        // 计算效果表达式
        try {
            PveBSExprUtils.eval(attacker, target, key, scope, buf.config);
        } catch (error) {
            ErrorUtils.post(`BUFF( id: ${buf.id} )表达式( ${key} )配置错误, ${error}`);
            return;
        }
        // BUFF可能在执行表达式过程中被移除
        if (!buf.config) {
            return;
        }
        // 间隔生效BUFF类型的每次执行的时候显示buff_word
        if (buf.config.buff_word && !buf.isPropType) {
            let type = PveBuffTipType.BUFF;
            if (buf.config.type != 1) {
                type = PveBuffTipType.DEBUFF;
            }
            let isEnemy = (buf.attacker_prop && buf.attacker_prop.type == PveFightType.Enemy) ? true : false;
            target.showBuffTip(buf.config.buff_word, type, isEnemy, buf.config);
        }

        // 计算叠加表达式
        if (buf.stacking > 1) {
            let key2: string = buf.config.stacking_expr;
            if (key2 && key2 != '') {
                try {
                    PveBSExprUtils.eval(attacker, target, key2, scope);
                } catch (error) {
                    ErrorUtils.post(`BUFF( id: ${buf.id} )叠加表达式( ${key2} )配置错误, ${error}`);
                    return;
                }
            } else {
                // 没有叠加表达式配置的话，则简单的计算各属性*叠加数
                for (let pn in scope) {
                    if (!(StringUtils.endsWith(pn, '_id') || StringUtils.endsWith(pn, '_type'))) {
                        // 属性名不为_id或_type结尾
                        let v: any = scope[pn];
                        if (cc.js.isNumber(v) && keys.indexOf(pn) == -1) {
                            // 值类型为数值
                            scope[pn] = v * buf.stacking;
                        }
                    }
                }
            }
        }
        // BUFF表达式事件，BUFF开始
        if (buf.first && buf.events.onbegin != null && typeof buf.events.onbegin === 'object') {
            // 验证onbegin事件对象有效
            PveTool.evalBuffEvent(
                buf.events.onbegin,
                buf.attacker_id,
                buf.attacker_prop,
                attacker,
                target,
                scope,
            );
        }
        // 针对血量的操作
        if ('hp' in scope) {
            // 增加持续伤害百分比
            if (scope.hp < 0 && buf.config.type == 3) {
                let tem = scope.a.add_continuousDmg;
                if (cc.js.isNumber(tem) && tem != 0) {
                    scope.hp = Math.floor(scope.hp * (1 + tem));
                }
            }
            let hp: number = Math.floor(scope.hp);
            // 免疫持续伤害判断
            if (hp < 0 && buf.config.type == 3 && model.getProp('immunity_continuousDmg')) {
                if (model.getProp('immunity_continuousDmg_tip')) {
                    let type = PveBuffTipType.BUFF;
                    let isEnemy = (buf.attacker_prop && buf.attacker_prop.type == PveFightType.Enemy) ? true : false;
                    target.showBuffTip('buff_mianyi', type, isEnemy, buf.config);
                }
            } else {
                if (!isNaN(hp)) {
                    // BUFF表达式事件，受到伤害事件
                    let onhurt = model.prop.onhurt;
                    let onbuffAtk = attacker ? attacker.model.prop.onbuffAtk : null;
                    if (hp < 0) {

                        if (onbuffAtk != null && typeof onbuffAtk === 'object') {
                            // 验证onbuffAtk事件对象有效
                            PveTool.evalBuffEvent(
                                onbuffAtk,
                                buf.attacker_id,
                                buf.attacker_prop,
                                attacker,
                                target,
                                scope,
                            );
                        }
                        if (onhurt != null && typeof onhurt === 'object') {
                            // 验证onhurt事件对象有效
                            PveTool.evalBuffEvent(
                                onhurt,
                                buf.attacker_id,
                                buf.attacker_prop,
                                attacker,
                                target,
                                scope,
                            );
                        }
                        //hp = Math.floor(scope.hp);
                    } else if (hp > 0) {
                        // 目标有回血害事件
                        let onrestore = scope.tm ? scope.tm.prop.onrestore : null;
                        if (onrestore != null && typeof onrestore === 'object') {
                            PveTool.evalBuffEvent(
                                onrestore,
                                buf.attacker_id,
                                buf.attacker_prop,
                                attacker,
                                target,
                                scope,
                            );
                            //hp = Math.floor(scope.hp);
                        }
                        if (scope.a && scope.a.add_restoreDmg > 0) {
                            // let tem = attacker.model.getProp('add_restoreDmg');
                            scope.hp = Math.floor(scope.hp * (1 + scope.a.add_restoreDmg));
                        }
                    }
                    scope.hp = Math.ceil(scope.hp)
                    // BUFF表达式事件，目标被杀事件
                    let temShied = scope.tm.shield + scope.tm.getBuffShiedValue();
                    if (scope.tm.hp + temShied + scope.hp <= 0) {
                        let onkill = scope.am ? scope.am.prop.onkill : null;
                        if (onkill != null && typeof onkill === 'object') {
                            // 验证onkill事件对象有效
                            PveTool.evalBuffEvent(
                                onkill,
                                buf.attacker_id,
                                buf.attacker_prop,
                                attacker,
                                target,
                                scope,
                            );
                        }
                        let ondead = this._tempProp ? this._tempProp.ondead : null;
                        if (ondead != null && typeof ondead === 'object') {
                            PveTool.evalBuffEvent(
                                ondead,
                                buf.attacker_id,
                                buf.attacker_prop,
                                attacker,
                                target,
                                scope,
                            );
                        }
                        // 目标死亡事件，验证ondead事件对象有效
                        if (buf.first && buf.events.ondead != null && typeof buf.events.ondead === 'object') {
                            PveTool.evalBuffEvent(
                                buf.events.ondead,
                                buf.attacker_id,
                                buf.attacker_prop,
                                attacker,
                                target,
                                scope,
                            );
                            delete scope['ondead'];
                        }
                        //指定英雄击杀指定怪物
                        if (attacker && attacker.sceneModel.gateconditionUtil && attacker.sceneModel.gateconditionUtil.heroKillMonsterLimit.length > 0) {
                            attacker.sceneModel.gateconditionUtil.heroKillMonsterLimit.forEach(index => {
                                let data = attacker.sceneModel.gateconditionUtil.DataList[index]
                                if ((attacker.model.config.id == data.cfg.data1 && target.model.config.id == data.cfg.data2 && data.cfg.data3 == "")) {
                                    data.state = true;
                                    data.curData = 1;
                                }
                            })
                        }
                    }

                    // 计算最终血量
                    let result = PveTool.pveGetRealHurt(scope.tm, scope.hp);
                    //result.shield && (target.model.shield += result.shield);
                    result.shield && target.model.refreshShied(result.shield); //刷新护盾值
                    hp = result.hp
                    hp = model.hp + hp;
                    hp = Math.max(0, hp);
                    hp = Math.min(hp, model.hpMax);
                    // 显示飘血数字
                    //let tempHp = hp - model.hp;
                    let tempHp = result.hp + result.shield;
                    if (tempHp != 0) {
                        let type = cc.js.isString(buf.config.eject) ? PveHurtType.BUFF : buf.config.eject;

                        if ('CRIT' in scope) {
                            if (scope['CRIT'] > 0) {
                                type = PveHurtType.CRIT;
                            }
                        }
                        if (tempHp > 0) {
                            // 回血
                            type = PveHurtType.RECOVER;
                        }
                        let dmg_type = cc.js.isString(buf.config.dmg_type) ? 0 : buf.config.dmg_type
                        model.ctrl.showHurt(tempHp, type, 1, dmg_type);
                        // 添加战斗信息
                        if (this.sceneModel.battleInfoUtil) {
                            this.sceneModel.battleInfoUtil.addBattleInfo(
                                model.id,
                                PveHurtType.BUFF,
                                dmg_type,
                                buf.attacker_id,
                                buf.attacker_prop.id,
                                scope.am ? scope.am.type : PveFightType.Unknow,
                                model.fightId,
                                model.id,
                                model.type,
                                tempHp,
                            );
                        }
                        //特定英雄攻击范围内外的伤害统计
                        if (scope.am && scope.hp < 0 && attacker.sceneModel.gateconditionUtil && attacker.sceneModel.gateconditionUtil.HeroAttackDisDamage.length > 0) {
                            attacker.sceneModel.gateconditionUtil.HeroAttackDisDamage.forEach(index => {
                                let data = attacker.sceneModel.gateconditionUtil.DataList[index];
                                if (scope.am.type == PveFightType.Hero && scope.tm.type == PveFightType.Enemy) {
                                    if (scope.am.config.id == data.cfg.data1) {
                                        let dis = MathUtil.distance(scope.am.ctrl.getPos(), scope.tm.ctrl.getPos());
                                        if (data.cfg.data3 == 1) {
                                            if (dis <= scope.am.range) {
                                                data.curData += Math.abs(scope.hp)
                                            }
                                        } else if (data.cfg.data3 == 2) {
                                            if (dis > scope.am.range) {
                                                data.curData += Math.abs(scope.hp)
                                            }
                                        }
                                        data.state = data.curData >= data.cfg.data2;
                                    }
                                }
                            })
                        }
                    }
                    window['TD_TEST'] && cc.log(
                        '结果:', tempHp,
                        // ', 施法者:', model.attacker,
                        // ', 目标:', model.selectedTargets,
                        ', buff_id:', buf.id,
                        ', 表达式:', key,
                        ', 结算后生命值:', hp,
                    );

                    // 目标减血
                    target.onAttacked(null, buf);
                    model.hp = hp;
                    // 判断目标是否已经死亡
                    if (!target || !target.isAlive) {
                        return;
                    }
                }
            }
            delete scope['hp'];
        }
        // 针对血量上限的操作
        if ('hp_max' in scope && buf.first) {
            // 首次执行，则对当前血量进行操作
            //delete scope['hp_max'];
            let hp: number = Math.floor(scope['hp_max']);
            if (!isNaN(hp)) {
                // 刚获得BUFF时需修改当前的血量
                //p.hp = hp;
                let tem = model.hpMax + hp
                hp = model.hp + hp;
                hp = Math.max(0, hp);
                hp = Math.min(hp, tem);
                model.hp = hp;
                model.hpMax = tem;
            }
        }

        // 针对护盾的操作
        if ('shield' in scope && buf.first) {
            // 只在BUFF首次时生效
            //model.buffShield += scope['shield'];
            let temData: ShiedBuffData = { buffId: buf.id, shiedNum: scope['shield'] }
            let exist = model.buffShield.some(data => {
                if (data.buffId == buf.id) {
                    exist = true;
                    if (buf.config.stacking_fold > 1) {
                        data.shiedNum = Math.min(data.shiedNum + scope['shield'], buf.config.stacking_fold * scope['shield']);
                    } else {
                        data.shiedNum = scope['shield'];
                    }
                    return true;
                }
                return false;
            });
            if (!exist) {
                model.buffShield.push(temData);
            }
            model.buffShield.sort((a, b) => {
                let buf1 = this.findBuf(a.buffId);
                let buf2 = this.findBuf(b.buffId);
                if (!buf1) {
                    return -1;
                }
                if (!buf2) {
                    return 1;
                }
                return buf1.remain - buf2.remain;
            });
            // 刷新护盾显示
            target.refreshShiedShow();
        }

        // 删除不需要的属性
        for (let i = 0, n = keys.length; i < n; i++) {
            delete scope[keys[i]];
        }
        // 计算次数和执行间隔等
        buf.run();
        // 设置首次执行标志
        buf.first = false;
        // 保存并返回计算结果
        buf.prop = scope;
        buf.propFrameId = frameId || this.sceneModel.frameId;
        return scope;
    }

    /**
     * 增加Buff
     * @param v 
     */
    addBuf(v: PveBuffModel) {
        let target = this.target;
        let model = target.model;
        let prop = model.prop;
        // 免疫debuff状态时，debuff效果不执行
        if (v.config.type == 2) {
            let b = prop.immun_debuff;  // immun_debuff为免疫所有2类型的BUFF
            if (!b && v.isPropType) {
                // 免疫特殊的属性
                for (let p in v.propNames) {
                    if (prop['immun_debuff_' + p]) {
                        b = true;
                        break;
                    }
                }
            }
            if (b) {
                let type = PveBuffTipType.BUFF;
                let isEnemy = (v.attacker_prop && v.attacker_prop.type == PveFightType.Enemy) ? true : false;
                target.showBuffTip('buff_mianyi', type, isEnemy, v.config);
                return;
            }
        }
        //免疫增益状态时
        if (v.config.type == 1) {
            let b = prop.immun_addbuff;
            if (b) {
                return;
            }
        }
        let frameId = this.sceneModel.frameId;
        let buf = this.findBuf(v.id, v.config.stacking_class);
        if (buf) {
            // BUFF已经存在
            if (buf.id !== v.id &&
                buf.config.stacking_class instanceof Array &&
                v.config.stacking_class instanceof Array
            ) {
                // 将要添加的BUFF与查找到的目标BUFF不是同一配置，则说明是同类BUFF，则根据优先级替换
                if (buf.config.stacking_class[1] < v.config.stacking_class[1]) {
                    buf.id = v.id;
                }
            }
            else if (v.config.stacking_fold == 1 && buf.lastTime == frameId) {
                // 不能堆叠的BUFF，并且新BUFF与已经存在的BUFF在同一帧添加，则不重复处理
                PvePool.put(v);
                return;
            }
            // 更新时间并增加堆叠次数
            buf.lastTime = frameId;
            buf.remain = v.remain;
            buf.times = v.times;
            buf.attacker_id = v.attacker_id;
            buf.pubNumber = v.pubNumber;
            if (buf.hasProp('hp_max')) {
                buf.first = true;
            }
            let stacking = Math.min(buf.stacking + 1, v.config.stacking_fold);
            if (buf.stacking != stacking) {
                buf.stacking = stacking;
                buf.prop = null;
                buf.propFrameId = 0;
            }
            // 把不需要的数据放入到对象池中
            PvePool.put(v);
        } else {
            // BUFF不存在，则添加至BUFF列表
            buf = v;
            buf.addTime = frameId;
            buf.lastTime = frameId;
            model.buffs.push(buf);
            // 属性BUFF类型的每次新加的时候显示buff_word
            if (buf.config.buff_word && buf.isPropType) {
                let type = PveBuffTipType.BUFF;
                if (buf.config.type != 1) {
                    type = PveBuffTipType.DEBUFF;
                }
                let isEnemy = (buf.attacker_prop && buf.attacker_prop.type == PveFightType.Enemy) ? true : false;
                target.showBuffTip(buf.config.buff_word, type, isEnemy, buf.config);
            }
        }

        //-------------------------- 添加buff时的事件-----start-----------------------------------
        let onadd = prop.onadd;
        if (onadd != null && typeof onadd === 'object') {
            // 构建环境变量
            let attacker = this.sceneModel.getFightBy(buf.attacker_id);
            let scope: PveBSScopeType = {
                t: model.baseProp,
                a: buf.attacker_prop,
                b: buf.config,
                bm: buf,
                am: attacker ? attacker.model : null,
                tm: model,
                m: model,   // 兼容旧的配置
                stacking: buf.stacking,
            };
            PveTool.evalBuffEvent(
                onadd,
                buf.attacker_id,
                buf.attacker_prop,
                attacker,
                target,
                scope,
            );
        }
        //-------------------------- 添加buff时的事件-------end---------------------------------

        // 判断是否有延长时间字段
        let extendTime = prop.extendTime;
        if (extendTime && cc.js.isString(extendTime)) {
            let types = extendTime.split(',')
            let bufType = Number(types[0]);
            let dmgType = types[1]
            let addNum = Number(types[2]);
            if (buf.config.type == bufType && (dmgType == "" || buf.config.dmg_type == dmgType)) {
                buf.remain = buf.remain * addNum;
                buf.max_remain = buf.remain * addNum;
            }
        }

        // 更新组件状态
        if (!this.enabled) {
            this.enabled = true;
        }

        // 即时生效
        if (buf.config.effect_expr && buf.active) {
            // 显示气泡
            if (buf.hasProp('showBubble')) {
                PveTool.callLater(this, this._showBubble, [buf.id]);
            }
            // 显示buff层数
            if (buf.hasProp('showBuffStack')) {
                PveTool.callLater(this, this._showBuffStack, [buf.id]);
            }
            // 显示buff层数
            if (buf.hasProp('showSpecialStack')) {
                PveTool.callLater(this, this._showSpecialStack, [buf.id]);
            }
            // 判断expr必需要有值
            if (buf.hasProp([
                'speed_scale', 'atk_speed_r', 'atk',
                'speed', 'speed_r', 'speed_r_ex',
                'hp_max', 'refresh',
                'invisible', 'invisible_enemy', 'invisible_noGeneral',
                'invisible_type', 'invisible_noGeneral',
                'invisible_noQiang', 'invisible_noPao',
                'node_scale', 'opacity',
            ])) {
                // 非叠加BUFF
                buf.refresh = true;
                // 此类BUFF需要刷新，但延迟至下一帧处理
                this.needRefresh = true;
            }
            // 删除临时属性
            buf.isPropType && this.removeTempProp();
            model.speedScaleDirty = buf.hasProp(['speed_scale', 'atk_speed_r', 'speed', 'speed_r', 'speed_r_ex']);
        }

        // 需要刷新特效或图标
        buf.refreshEffect = !!buf.config.skin || !!buf.config.icon;
        this._updateBuff();
    }

    // 显示气泡
    _showBubble(id: number) {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        if (!this.target || !this.target.isAlive) return;
        let buf = this.findBuf(id);
        if (!buf || !buf.active) return;
        let temTarget = this.target as PveBaseFightCtrl;
        if (temTarget.bubbleNode) {
            let spine: sp.Skeleton = temTarget.bubbleNode.getChildByName('spine').getComponent(sp.Skeleton)
            if (spine) {
                let path = StringUtils.format(PveRes.PVE_BUFF_RES, buf.config.des);
                GlobalUtil.setSpineData(this.node, spine, path, true, 'hit', true)
            }
        } else {
            let sceneModel = this.sceneModel;
            if (!sceneModel) {
                return;
            }
            let sceneCtrl = sceneModel.arenaSyncData ? sceneModel.arenaSyncData.mainModel.ctrl : sceneModel.ctrl;
            if (sceneCtrl.bubblePrefab) {
                let node: cc.Node = PvePool.get(sceneCtrl.bubblePrefab);
                let spine: sp.Skeleton = node.getChildByName('spine').getComponent(sp.Skeleton)
                if (spine) {
                    let path = StringUtils.format(PveRes.PVE_BUFF_RES, buf.config.des);
                    GlobalUtil.setSpineData(this.node, spine, path, true, 'hit', true)
                }
                node.opacity = 255;
                //node.zIndex = 101;
                node.parent = sceneCtrl.hurt;
                gdk.NodeTool.show(node);
                temTarget.bubbleNode = node;
                temTarget.updateBubblePos();
                temTarget.node.on(
                    cc.Node.EventType.POSITION_CHANGED,
                    temTarget.updateChangePos,
                    temTarget,
                );
            }
        }
    }

    // 显示buff层数
    _showBuffStack(id: number) {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        if (!this.target || !this.target.isAlive) return;
        let buf = this.findBuf(id);
        if (!buf || !buf.active) return;
        let temTarget = this.target as PveBaseFightCtrl;
        if (temTarget.buffStackNode) {
            let stack: cc.Label = temTarget.buffStackNode.getChildByName('stack').getComponent(cc.Label)
            if (stack) {
                if (buf.hasProp('showBuffStack_Reverse')) {
                    stack.string = (buf.config.stacking_fold - buf.stacking) + '';
                } else {
                    stack.string = buf.stacking + '';
                }
            }
        } else {
            let sceneModel = this.sceneModel;
            if (!sceneModel) {
                return;
            }
            let sceneCtrl = sceneModel.arenaSyncData ? sceneModel.arenaSyncData.mainModel.ctrl : sceneModel.ctrl;
            if (sceneCtrl.buffStackPrefab) {
                let node: cc.Node = PvePool.get(sceneCtrl.buffStackPrefab);
                let stack: cc.Label = node.getChildByName('stack').getComponent(cc.Label)
                if (stack) {
                    if (buf.hasProp('showBuffStack_Reverse')) {
                        stack.string = (buf.config.stacking_fold - buf.stacking) + '';
                    } else {
                        stack.string = buf.stacking + '';
                    }
                }
                node.opacity = 255;
                node.zIndex = 101;
                node.parent = sceneCtrl.hurt;
                gdk.NodeTool.show(node);
                temTarget.buffStackNode = node;
                temTarget.updateBuffStackPos();
                temTarget.node.on(
                    cc.Node.EventType.POSITION_CHANGED,
                    temTarget.updateChangePos,
                    temTarget,
                );
            }
        }
    }

    _showSpecialStack(id: number) {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        if (!this.target || !this.target.isAlive) return;
        let buf = this.findBuf(id);
        if (!buf || !buf.active) return;
        let temTarget = this.target as PveBaseFightCtrl;
        if (!temTarget.specialStackNode) {
            let sceneModel = this.sceneModel;
            if (!sceneModel) {
                return;
            }
            let sceneCtrl = sceneModel.arenaSyncData ? sceneModel.arenaSyncData.mainModel.ctrl : sceneModel.ctrl;
            if (sceneCtrl.specialStackPrefab) {
                let node: cc.Node = PvePool.get(sceneCtrl.specialStackPrefab);
                node.opacity = 255;
                node.zIndex = 101;
                node.parent = sceneCtrl.hurt;
                gdk.NodeTool.show(node);
                temTarget.specialStackNode = node;
                temTarget.updateSpecialStackPos();
                temTarget.node.on(
                    cc.Node.EventType.POSITION_CHANGED,
                    temTarget.updateChangePos,
                    temTarget,
                );
            }
        }
        if (temTarget.specialStackNode) {
            let node = temTarget.specialStackNode;
            let spine = cc.find('layout/spine/spine', node).getComponent(sp.Skeleton);
            let spine1 = cc.find('layout/spine1/spine1', node).getComponent(sp.Skeleton);
            let spine2 = cc.find('layout/spine2/spine2', node).getComponent(sp.Skeleton);
            let spine3 = cc.find('layout/spine3/spine3', node).getComponent(sp.Skeleton);
            let num = buf.stacking;
            if (buf.hasProp('showSpecialStack_Reverse')) {
                num = buf.config.stacking_fold - buf.stacking
            }
            // let name = buf.prop['showSpecialStack_effect'];
            let name = `E_buff_yadianna`;
            let path = `spine/buff/${name}/${name}`;

            GlobalUtil.setSpineData(this.node, spine, path, true, 'stand', true);
            spine1.node.parent.active = num >= 100;
            spine2.node.parent.active = num >= 10;
            spine3.node.parent.active = true;
            if (num >= 100) {
                let tem = Math.floor(num / 100);
                let animName = tem == 0 ? 'hit10' : 'hit' + tem;
                GlobalUtil.setSpineData(this.node, spine1, path, true, animName, true);
            }
            if (num >= 10) {
                let tem = Math.floor((num % 100) / 10);
                let animName = tem == 0 ? 'hit10' : 'hit' + tem;
                GlobalUtil.setSpineData(this.node, spine2, path, true, animName, true);
            }
            let tem = num % 10
            let animName = tem == 0 ? 'hit10' : 'hit' + tem;
            GlobalUtil.setSpineData(this.node, spine3, path, true, animName, true);
        }
    }

    _getSkinCfg() {
        if (!this.enabled) return null;
        if (!this.target || !this.target.isAlive) return null;
        let buffs = this.target.model.buffs;
        let skinLv = -1;
        let ret: PveBuffModel = null;
        for (let i = buffs.length - 1; i >= 0; i--) {
            let buf = buffs[i];
            if (buf.config.skin != '' && buf.config.skin_lv > skinLv) {
                ret = buf;
                skinLv = buf.config.skin_lv;
            }
        }
        this.buffmodel = ret;
        return ret ? ret.config : null;
    }

    getSkin(): string {
        if (this.target.model.getProp('hideEffect')) {
            return null;
        }
        let cfg = this._getSkinCfg();
        if (cfg) {
            return StringUtils.format(PveRes.PVE_BUFF_RES, cfg.skin);
        }
        return null;
    }

    getSkinPos(): number {
        let cfg = this._getSkinCfg();
        if (cfg) {
            return cfg.skin_pos;
        }
        return 1;
    }
    getPos(): cc.Vec2 {
        switch (this.getSkinPos()) {
            case 110:
                // 链接特效buff
                if (this.buffmodel) {
                    let attacker = this.sceneModel.getFightBy(this.buffmodel.attacker_id);
                    if (attacker && attacker.isAlive) {
                        this.isLinkEffet = true;
                        // let pos1 = PveTool.getCenterPos(cc.Vec2.ZERO, attacker.getRect());
                        // let pos2 = attacker.getPos()
                        // this.endPos = cc.v2(pos1.x + pos2.x, pos1.y + pos2.y)
                        this.endPos = attacker.node.parent.convertToWorldSpaceAR(PveTool.getCenterPos(attacker.getPos(), attacker.getRect()));
                    }
                    break;
                }
            default:
                this.isLinkEffet = false;
                this.endPos = null;
        }
        return super.getPos();
    }

    // BUFF有更新时调用
    _updateBuff() {
        this.target.updateBuff();
        gdk.DelayCall.addCall(this.updateEffect, this, 0);
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        let target = this.target;
        let model = target.model;
        let buffs = model.buffs;
        let len = buffs.length;
        let refresh = this.needRefresh;
        let refreshEffect = false;
        if (!target || !target.isAlive) {
            return;
        }
        if (len > 0) {
            this.isApplying = true;
            buffs = len == 1 ? buffs : buffs.concat();
            for (let i = 0; i < len; i++) {
                let buf = buffs[i];
                if (buf.config == null) continue;
                if (model.buffs.indexOf(buf) == -1) continue;
                if (buf.isPropType) {
                    // 属性BUFF类型
                    buf.remain -= dt;
                } else {
                    // 间隔执行类型，只针对减血等非战斗属性操作
                    buf.updateScript(dt);
                    if (buf.active) {
                        this._applyOne(buf);
                        // 判断目标是否已经死亡
                        if (!target || !target.isAlive) {
                            return;
                        }
                    }
                }
                if (buf.remove) {
                    // 移除BUFF
                    refresh = refresh || buf.refresh;
                    refreshEffect = refreshEffect || buf.refreshEffect;
                    this._removeOne(buf);
                    // 判断目标是否已经死亡
                    if (!target || !target.isAlive) {
                        return;
                    }
                }
            }
            this.isApplying = false;
        }

        // 刷新
        if (refresh) {
            this.removeTempProp(true);
            this.prop;
        }
        refreshEffect && this._updateBuff();

        // 所有BUF都已失效
        if (buffs.length == 0) {
            if (this.sceneModel) {
                this.enabled = false;
            }
            this.isLinkEffet = false;
            this.endPos = null;
        }

        // 链接buff特效特殊处理
        if (this.isLinkEffet && this.spines.length > 0) {
            let linkSpine = this.spines[this.spines.length - 1];
            if (linkSpine && this.endPos) {
                //this.endPos = cc.v2(0, 0)
                let attacker = this.sceneModel.getFightBy(this.buffmodel.attacker_id);
                if (attacker && attacker.isAlive) {
                    // let pos1 = PveTool.getCenterPos(cc.Vec2.ZERO, attacker.getRect());
                    // let pos2 = attacker.getPos()
                    // this.endPos = cc.v2(pos1.x + pos2.x, pos1.y + pos2.y)  attacker.node.parent
                    this.endPos = this.sceneModel.ctrl.thing.convertToWorldSpaceAR(PveTool.getCenterPos(attacker.getPos(), attacker.getRect()));
                } else {
                    //隐藏特效
                    linkSpine.node.active = false;
                    this.endPos = null;
                    return;
                }
                if (linkSpine.isAnimationCached()) {
                    linkSpine.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
                }
                let temPos = linkSpine.node.parent.getPos();
                let angle: number = Math.atan2(temPos.y - this.endPos.y, temPos.x - this.endPos.x);
                let degree: number = angle * 180 / Math.PI;
                linkSpine.node.angle = -(degree <= 0 ? -degree : 360 - degree);
                let root = linkSpine.findBone('root');
                //let bone3 = linkSpine.findBone('bone3');
                let tem = linkSpine.findBone('objective'); //objective  atk
                if (tem && root) {
                    // let size = cc.winSize
                    // this.endPos.y += Math.floor((size.height - 1280) / 2)
                    let localTo: cc.Vec2 = linkSpine.node.convertToNodeSpaceAR(this.endPos);
                    tem.x = localTo.x / root.scaleX;
                    tem.y = localTo.y / root.scaleY;
                }
            }
        }
    }


    /**
     * 移除指定ID的BUFF效果
     * @param id 
     * @param mode 
     */
    removeBuf(id: number, mode: 'first' | 'all') {
        this.removeBuffStacking(id, 999, mode == 'first' ? 1 : 999);
    }

    /**
     * 移除BUFF叠加层数
     * @param id 
     * @param stack 移除的叠加层数
     * @param count 移除数量
     */
    removeBuffStacking(id: number, stack: number, count: number = 999) {
        if (stack <= 0) return;
        let target = this.target;
        let model = target.model;
        let buffs = model.buffs;
        let refresh = this.needRefresh;
        let refreshProp = false;
        let refreshEffect = false;
        for (let i = buffs.length - 1; i >= 0; i--) {
            let buf = buffs[i];
            if (buf.id === id) {
                buf.stacking = Math.max(buf.stacking - stack, 0);
                refresh = refresh || buf.refresh;
                refreshProp = refreshProp || buf.isPropType;
                refreshEffect = refreshEffect || buf.refreshEffect;
                if (buf.stacking <= 0) {
                    // BUFF为不能堆叠的类型，则移除数量固定为1
                    if (buf.config.stacking_fold == 1) {
                        count = 1;
                    }
                    this._removeOne(buf);
                    // 判断目标是否已经死亡
                    if (!target || !target.isAlive) {
                        return;
                    }
                }
                // 移除计数器
                count--;
                if (count <= 0) {
                    break;
                }
            }
        }
        // 删除临时属性
        if (refreshProp) {
            this.removeTempProp(true);
        }
        // 需要主动刷新属性
        this.needRefresh = refresh;
        // 需要刷新特效
        if (refreshEffect) {
            this._updateBuff();
        }
    }

    // 清除一个BUFF相关的操作
    _removeOne(buf: PveBuffModel) {
        let target = this.target;
        let model = target.model;
        // BUFF结束事件
        let onend = buf.events.onend;
        if (onend != null && typeof onend === 'object') {
            let sceneModel = this.sceneModel;
            let attacker = sceneModel.getFightBy(buf.attacker_id);
            PveTool.evalBuffEvent(
                onend,
                buf.attacker_id,
                buf.attacker_prop,
                sceneModel.getFightBy(buf.attacker_id),
                target,
                {
                    t: model.baseProp,
                    a: buf.attacker_prop,
                    b: buf.config,
                    bm: buf,
                    am: attacker ? attacker.model : null,
                    tm: model,
                    m: model,   // 兼容旧的配置
                },
            );
            // 判断目标是否已经死亡
            if (!target || !target.isAlive) {
                return;
            }
        }
        // 判断expr必需要有值
        let expr: string = buf.config.effect_expr;
        if (cc.js.isString(expr) && expr) {
            // 当前血量检测
            if (buf.hasProp('hp_max')) {
                let hp = model.hp;
                hp = Math.min(hp, model.hpMax);
                model.hp = hp;
            }
            // 检测护盾
            if (buf.hasProp('shield')) {
                let exist = model.buffShield.some((b, i) => {
                    if (b.buffId == buf.id) {
                        model.buffShield.splice(i, 1);
                        return true;
                    }
                    return false;
                });
                // 刷新护盾显示
                if (exist) {
                    target.refreshShiedShow();
                }
            }
            if (!model.speedScaleDirty) {
                model.speedScaleDirty = buf.hasProp(['speed_scale', 'atk_speed_r', 'speed', 'speed_r', 'speed_r_ex']);
            }
        }
        // 从BUFF列表中移除
        let index = model.buffs.indexOf(buf);
        if (index >= 0) {
            model.buffs.splice(index, 1);
        }
        PvePool.put(buf);
    }

    /**
     * 查找BUFF，如果为多个则只返回第一个
     * @param id 
     * @param stacking_class
     */
    findBuf(id: number, stacking_class?: number[]): PveBuffModel {
        let buffs = this.target.model.buffs;
        for (let i = 0, n = buffs.length; i < n; i++) {
            let b = buffs[i];
            if (id === b.id) {
                return b;
            }
            if (stacking_class instanceof Array &&
                b.config.stacking_class instanceof Array &&
                stacking_class[0] === b.config.stacking_class[0]
            ) {
                // 相同叠加类型的BUFF，可归为同一BUFF
                return b;
            }
        }
        return null;
    }

    /**
     * 获得BUFF的数量
     * @param id 
     */
    getBufCount(id: number) {
        let c: number = 0;
        let buffs = this.target.model.buffs;
        for (let i = 0, n = buffs.length; i < n; i++) {
            let b = buffs[i];
            if (b.id === id) {
                c++;
            }
        }
        return c;
    }

    clearAll() {
        this.removeTempProp(true);
        super.clearAll();
    }

    onDead() {
        let model = this.target && this.target.model;
        if (model) {
            let buffs = model.buffs;
            for (let i = buffs.length - 1; i >= 0; i--) {
                let buf = buffs[i];
                if (!buf || !buf.config || buf.config.rm_type != 1) {
                    buffs.splice(i, 1);
                    buf && PvePool.put(buf);
                }
            }
            // 针对加减速BUFF特殊处理
            if (model.speedScale != 1) {
                model.speedScaleDirty = true;
                model.speedScale = 1;
            }
            model.buffShield.length = 0;
            // 清除状态
            this.isApplying = false;
            this.needRefresh = false;
            this.removeTempProp(true);
            this._updateBuff();
        }
    }
}