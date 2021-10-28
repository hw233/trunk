import ConfigManager from '../managers/ConfigManager';
import PveRes from '../../view/pve/const/PveRes';
import PveTool from '../../view/pve/utils/PveTool';
import StringUtils from './StringUtils';
import {
    Copy_stageCfg,
    Hero_careerCfg,
    HeroCfg,
    MonsterCfg,
    Pve_bornCfg,
    Pve_mainCfg,
    Skill_buffCfg,
    Skill_effect_typeCfg,
    Skill_haloCfg,
    Skill_target_typeCfg,
    SkillCfg
    } from './../../a/config';
/**
 * 配置检测工具类
 * @Author: sthoo.huang
 * @Date: 2020-05-21 10:46:24
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-05 13:04:43
 */

let CheckUtils = {};
// 条件编译，使正式版不包括此代码
if (CC_DEBUG && !CC_JSB) {

    enum ErrorType {
        res = '缺少资源',
        config = '缺少配置',
        expr = '表达式语法错误',
        action = '缺少动作',
        event = '缺少事件',
        field = '缺少字段',

        Pve_mainCfg = 'PVE副本缺少配置',
        Pve_bornCfg = 'PVE副本缺少配置',
        MonsterCfg = 'PVE副本缺少配置',
    }

    interface ErrorObj {
        config: any,
        message: string,
    }

    let _errorIdx: { [type: number]: { [name: string]: ErrorObj[] } } = {};
    let _skillIdx: { [skill_id: number]: boolean } = {};
    let _skillBuffIdx: { [id: number]: boolean } = {};
    let _cardSkillBuffIdx: { [id: number]: boolean } = {};

    let appendError = function (type: ErrorType, config: any, message: string) {
        let name = config['constructor'].name;
        if (!_errorIdx[type]) {
            _errorIdx[type] = {};
        }
        if (!_errorIdx[type][name]) {
            _errorIdx[type][name] = [];
        }
        _errorIdx[type][name].push({ config: config, message: message });
    };

    class CheckUtilsClass {

        // 检查所有配置
        checkAll() {
            _errorIdx = {};
            _skillIdx = {};
            _skillBuffIdx = {};
            _cardSkillBuffIdx = {};
            // 检查方法
            this.checkHeroCfg();
            this.checkSkillCfg(false);
            this.checkSkillBuffCfg(false);
            this.checkStageConfig();
            // 输出所有错误
            if (Object.keys(_errorIdx).length == 0) {
                cc.log("================没有找到错误==============");
            } else {
                cc.log("================分类错误信息开始==============");
                cc.log(_errorIdx);
                cc.log("================分类错误信息结束==============");
            }
        }

        // 检查hero配置表
        checkHeroCfg() {
            let items = ConfigManager.getItems(HeroCfg);
            items.forEach(c => {
                if (c.skin) {
                    let url = PveTool.getSkinUrl(c.skin);
                    let uuid = gdk.rm.getInfoWithPath(url, sp.SkeletonData);
                    if (!uuid) {
                        appendError(ErrorType.res, c, `Hero表id: ${c.id}, skin: ${c.skin} 资源文件不存在`);
                    } else {
                        // 加载资源，并判断资源中对应的事件，动作是否存在
                        gdk.rm.loadRes(0, url, sp.SkeletonData, (res: sp.SkeletonData) => {
                            // 所有技能
                            let careerItems = ConfigManager.getItemsByField(Hero_careerCfg, 'career_id', c.career_id);
                            let careerId = c.career_id;
                            while (true) {
                                let arr = ConfigManager.getItemsByField(Hero_careerCfg, 'career_pre', careerId);
                                if (!arr || !arr.length) {
                                    break;
                                }
                                careerItems.push(...arr);
                                careerId = arr[0].career_id;
                            }
                            careerItems.forEach(item => {
                                item.ul_skill.forEach(s => {
                                    // 塔防技能
                                    let skills = ConfigManager.getItemsByField(SkillCfg, 'skill_id', s);
                                    let table = 'Skill';

                                    skills.forEach((cfg: SkillCfg) => {
                                        if (!cfg) {
                                            // 缺少配置
                                            appendError(ErrorType.config, c, `Hero表id: ${c.id}, Career表id: ${item.id}, skill_id: ${s} 配置不存在`);
                                        } else {
                                            if (cfg instanceof SkillCfg && cfg.pre_animation && !PveTool.hasSpineAnimation(res, cfg.pre_animation)) {
                                                // 缺少前置动作
                                                appendError(ErrorType.action, cfg, `Hero表id: ${c.id}, ${table}表id: ${cfg.id}, skin: ${c.skin}, pre_animation: ${cfg.pre_animation} 动作不存在`);
                                            }
                                            if (cfg.animation) {
                                                if (!PveTool.hasSpineAnimation(res, cfg.animation)) {
                                                    // 缺少动作
                                                    appendError(ErrorType.action, cfg, `Hero表id: ${c.id}, ${table}表id: ${cfg.id}, skin: ${c.skin}, animation: ${cfg.animation} 动作不存在`);
                                                } else if (!PveTool.hasSpineEvent(res, cfg.animation, 'atk')) {
                                                    // 缺少事件
                                                    appendError(ErrorType.event, cfg, `Hero表id: ${c.id}, ${table}表id: ${cfg.id}, skin: ${c.skin}, animation: ${cfg.animation} 动作缺少 atk 事件`);
                                                }
                                            }
                                            // 检查具体技能
                                            this._checkSkillItem(cfg);
                                        }
                                    });
                                });
                            });
                            gdk.rm.releaseRes(0, res);
                        });
                    }
                }
            });
        }

        checkSkillCfg(b = true) {
            if (b) {
                _skillIdx = {};
            }
            let items = ConfigManager.getItems(SkillCfg);
            items.forEach(c => this._checkSkillItem(c));
        }

        /**
         * 检查单项技能配置
         * @param c 
         */
        _checkSkillItem(c: SkillCfg) {

            if (_skillIdx[c.skill_id]) return;
            _skillIdx[c.skill_id] = true;

            let table = c instanceof SkillCfg ? 'Skill' : 'CardSkill';

            // 超绝技能效果
            if (c.super_effect_res) {
                let url = StringUtils.format(PveRes.PVE_SKILL_RES, c.super_effect_res)
                let uuid = gdk.rm.getInfoWithPath(url, sp.SkeletonData);
                if (!uuid) {
                    // 缺少资源
                    appendError(ErrorType.res, c, `${table}表id: ${c.id}, super_effect_res: ${c.super_effect_res} 资源文件不存在`);
                }
            }

            // 技能效果
            if (c.effect_res) {
                let url = StringUtils.format(PveRes.PVE_SKILL_RES, c.effect_res)
                let uuid = gdk.rm.getInfoWithPath(url, sp.SkeletonData);
                if (!uuid) {
                    // 缺少资源
                    appendError(ErrorType.res, c, `${table}表id: ${c.id}, effect_res: ${c.effect_res} 资源文件不存在`);
                } else {
                    // 加载资源，并判断资源中对应的事件，动作是否存在
                    gdk.rm.loadRes(0, url, sp.SkeletonData, (res: sp.SkeletonData) => {
                        if (c.move_animation) {
                            let arr: string[] = cc.js.isString(c.move_animation) ? [c.move_animation] : c.move_animation as any;
                            arr.forEach(am => {
                                if (!PveTool.hasSpineAnimation(res, am)) {
                                    // 缺少弹道动作
                                    appendError(ErrorType.action, c, `${table}表id: ${c.id}, effect_res: ${c.effect_res}, move_animation: ${am} 动作不存在`);
                                }
                            });
                        }
                        if (c.hit_animation) {
                            let arr: string[] = c.hit_animation instanceof Array ? c.hit_animation : [c.hit_animation];
                            arr.forEach(am => {
                                if (!PveTool.hasSpineAnimation(res, am)) {
                                    // 缺少动作
                                    appendError(ErrorType.action, c, `${table}表id: ${c.id}, effect_res: ${c.effect_res}, hit_animation: ${am} 动作不存在`);
                                } else if (!PveTool.hasSpineEvent(res, am, 'atk')) {
                                    // 缺少事件
                                    appendError(ErrorType.event, c, `${table}表id: ${c.id}, effect_res: ${c.effect_res}, hit_animation: ${am} 动作缺少 atk 事件`);
                                }
                            });
                        }
                        // 回收资源
                        gdk.rm.releaseRes(0, res);
                    });
                }
            }

            // 光环
            if (cc.js.isNumber(c.halo_id) && c.halo_id > 0) {
                let haloCfg = ConfigManager.getItemById(Skill_haloCfg, c.halo_id);
                if (!haloCfg) {
                    // 缺少配置
                    appendError(ErrorType.config, c, `${table}表id: ${c.id}, halo_id: ${c.halo_id} 配置不存在`);
                } else if (haloCfg.skin) {
                    let url = StringUtils.format(PveRes.PVE_BUFF_RES, haloCfg.skin);
                    let uuid = gdk.rm.getInfoWithPath(url, sp.SkeletonData);
                    if (!uuid) {
                        // 缺少资源
                        appendError(ErrorType.res, haloCfg, `${table}_halo表id: ${haloCfg.id}, skin: ${haloCfg.skin} 资源文件不存在`);
                    }
                }
            }

            // BUFF
            if (c.buff_id) {
                let buffids: number[] = c.buff_id instanceof Array ? c.buff_id : [c.buff_id];
                buffids.forEach(id => {
                    let buffCfg = ConfigManager.getItemById(Skill_buffCfg, id);
                    if (!buffCfg) {
                        // 缺少配置
                        appendError(ErrorType.config, c, `${table}表id: ${c.id}, buff_id: ${id} 配置不存在`);
                    } else {
                        this._checkBuffItem(buffCfg);
                    }
                });
            }

            // target_type
            if (!c.target_type) {
                // 配置项不能为空
                appendError(ErrorType.field, c, `${table}表id: ${c.id}, target_type 不能为空`);
            } else {
                let targetCfg = ConfigManager.getItemById(Skill_target_typeCfg, c.target_type);
                if (!targetCfg) {
                    // 缺少配置
                    appendError(ErrorType.config, c, `${table}表id: ${c.id}, target_type: ${c.target_type} 配置不存在`);
                }
            }

            // effect_type
            if (!c.effect_type) {
                // 配置项不能为空
                appendError(ErrorType.field, c, `${table}表id: ${c.id}, effect_type 不能为空`);
            } else {
                let effectCfg = ConfigManager.getItemById(Skill_effect_typeCfg, c.effect_type);
                if (!effectCfg) {
                    // 缺少配置
                    appendError(ErrorType.config, c, `${table}表id: ${c.id}, effect_type: ${c.effect_type} 配置不存在`);
                }
            }

            // 表达式语法校验
            if (c.hurt_expr) {
                try {
                    gdk.math.parse(c.hurt_expr);
                } catch (err) {
                    appendError(ErrorType.expr, c, `${table}表id: ${c.id}, 错误: ${err}`);
                }
            }
        }

        checkSkillBuffCfg(b = true) {
            if (b) {
                _skillBuffIdx = {};
            }
            let items = ConfigManager.getItems(Skill_buffCfg);
            items.forEach(c => this._checkBuffItem(c));
        }

        /**
         * 检查单项BUFF配置
         * @param buffCfg 
         */
        _checkBuffItem(buffCfg: Skill_buffCfg) {

            // 记录
            let idx = buffCfg instanceof Skill_buffCfg ? _skillBuffIdx : _cardSkillBuffIdx;
            if (idx[buffCfg.id]) return;
            idx[buffCfg.id] = true;

            // 表名
            let table = buffCfg instanceof Skill_buffCfg ? 'Skill' : 'CardSkill';

            // 检查BUFF外观资源
            if (buffCfg.skin) {
                let url = StringUtils.format(PveRes.PVE_BUFF_RES, buffCfg.skin);
                let uuid = gdk.rm.getInfoWithPath(url, sp.SkeletonData);
                if (!uuid) {
                    // 缺少资源
                    appendError(ErrorType.res, buffCfg, `${table}_buff表id: ${buffCfg.id}, skin: ${buffCfg.skin} 资源文件不存在`);
                }
            }

            // 校验BUFF表达式
            if (buffCfg.effect_expr) {
                try {
                    gdk.math.parse(buffCfg.effect_expr);
                } catch (err) {
                    appendError(ErrorType.expr, buffCfg, `${table}_buff表id: ${buffCfg.id}, 错误: ${err}`);
                }
            }
        }

        /**
         * 检查stageConfig配置是否正确
         */
        checkStageConfig() {
            let obj = {};
            let arr = ConfigManager.getItems(Copy_stageCfg);
            arr.forEach(c => {
                if (obj[c.born]) return;
                obj[c.born] = true;
                switch (c.type_pk) {
                    case 'pve':
                    case 'pve_fun':
                        this._checkPveConfigItem(c);
                        break;

                    case 'pvp':
                        break;
                }
            });
        }

        _checkPveConfigItem(c: Copy_stageCfg) {
            let config = ConfigManager.getItemById(Pve_mainCfg, c.born);
            if (!config) {
                appendError(ErrorType.Pve_mainCfg, c, `Pve_mainCfg 表中找不到 id: ${c.born} 的配置`);
                return;
            }
            let bobj = {};
            let mobj = {};
            for (let i = 0, n = config.monster_born_cfg.length; i < n; i++) {
                let item: any = config.monster_born_cfg[i];
                if (cc.js.isString(item)) {
                    // 字符串格式，范围配置模式
                    let a = item.split('-');
                    let b = parseInt(a[0]);
                    let e = a[1] ? parseInt(a[1]) : b;
                    for (let id = b; id <= e; id++) {
                        this._checkBornConfigItem(config, id, bobj, mobj);
                    }
                } else {
                    this._checkBornConfigItem(config, item, bobj, mobj);
                }
            }
        }

        _checkBornConfigItem(config: Pve_mainCfg, id: number, bobj: any, mobj: any) {
            if (bobj[id]) return;
            bobj[id] = true;
            let bornCfg = ConfigManager.getItemById(Pve_bornCfg, id);
            if (!bornCfg) {
                appendError(ErrorType.Pve_bornCfg, config, `Pve_bornCfg 表中找不到 id: ${id} 的配置`);
                return;
            }
            if (mobj[bornCfg.enemy_id]) return;
            mobj[bornCfg.enemy_id] = true;
            let enemyCfg = ConfigManager.getItemById(MonsterCfg, bornCfg.enemy_id);
            if (!enemyCfg) {
                appendError(ErrorType.MonsterCfg, bornCfg, `MonsterCfg 表中找不到 enemy_id: ${bornCfg.enemy_id}} 的配置`);
            }
        }
    }

    // 创建实例
    CheckUtils = gdk.Tool.getSingleton(CheckUtilsClass);
    window['CheckUtils'] = CheckUtils;
}

export default CheckUtils;