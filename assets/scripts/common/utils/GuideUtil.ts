import BagUtils from './BagUtils';
import ConfigManager from '../managers/ConfigManager';
import GlobalUtil from './GlobalUtil';
import GuideModel from '../../guide/model/GuideModel';
import HeroModel from '../models/HeroModel';
import JumpUtils from './JumpUtils';
import ModelManager from '../managers/ModelManager';
import NetManager from '../managers/NetManager';
import PanelId from '../../configs/ids/PanelId';
import RoleModel from '../models/RoleModel';
import StringUtils from './StringUtils';
import { GuideCfg } from '../../a/config';
import { GuideType } from './../../guide/ctrl/GuideViewCtrl';

// 依赖条件类型结构
interface GuideDependence {
    panel?: string[] | string,  // 界面 [panelId,panelId...]
    goods?: number[],           // 物品 [id,num,id,num...]
    level?: number[],           // 等级 [min,max]
    herostar?: number[],        // 英雄星级 [heroItemId或0, min, max]
    sysids?: number[],          //   [id, id...]
    battle?: number[],          // 上阵队列数量 [下限，上限]
    days?: number[],            // 开服天数限制 [下限，上限]
}

class GuideUtilClass {

    isLog: boolean = false;  // 是否输出日志
    isHideGuide: boolean = false;    // 为true时不触发任何指引
    ignoreDoneIds: { [id: number]: boolean } = {};  // 忽略已完成的引导，只在初始时有效

    get model() { return ModelManager.get(GuideModel); }
    get guideCtrl() { return this.model.guideCtrl; }

    // 输出日志
    log(...args: any[]) {
        if (!this.isLog) return;
        cc.log.apply(null, args);
    }

    /**当前是否有激活的引导 */
    get isGuiding() {
        return !!this.model.curGuide;
    }

    /**获取当前正在进行的指引id */
    getCurGuideId(): number {
        if (this.model.curGuide) {
            return this.model.curGuide.id;
        }
        return -1;
    }

    /**获取当前正在进行的指引信息 */
    getCurGuide(): GuideCfg {
        return this.model.curGuide
    }

    /**获取指引导是否已完成 */
    ifGuideDone(group: number) {
        return !!this.model.doneIds[group];
    }

    /**销毁引导 */
    destroy() {
        let ctrl = this.guideCtrl;
        if (ctrl) {
            ctrl.node.destroy();
        }
    }

    /**中转至下一个引导 */
    nextGuide() {
        let guideCtrl = this.guideCtrl;
        if (guideCtrl) {
            guideCtrl.nextGuide();
        }
    }

    /**清除当前指引 */
    clearGuide(next: boolean = true) {
        let guideCtrl = this.guideCtrl;
        if (guideCtrl) {
            guideCtrl.clearGuide();
            // 下一个引导队列项
            if (!next) return;
            let model = this.model;
            let waits = model.waitActives;
            // 检查高优先级的弹框
            [
                PanelId.Reward, PanelId.TaskRewardView, PanelId.HeroReward,
                PanelId.InstanceHangRewardView, PanelId.RaidReward,
                PanelId.PveBossCommingEffect,
                PanelId.PveSceneWinPanel, PanelId.PveSceneFailPanel,
            ].forEach(v => {
                if (!gdk.panel.isOpenOrOpening(v)) return;
                let k: string;
                if (v.isPopup) {
                    k = `popup#${v.__id__}#close`;
                } else {
                    k = `view#${v.__id__}#close`;
                }
                if (!waits.some(g => k == g.activeCondition)) {
                    waits.unshift(this._creatAcitveGuide('', k));
                }
            });
            // 显示下一个可用的引导
            if (waits.length > 0) {
                let cfg = waits.shift();
                let key = cfg.activeCondition;
                // 显示升级效果引导
                if (cc.js.isString(key) &&
                    StringUtils.startsWith(key, 'levelup#') &&
                    StringUtils.endsWith(key, '#open')
                ) {
                    let [_, oldLv, level] = key.split('#');
                    guideCtrl.showMask(0, true);
                    gdk.panel.open(
                        PanelId.MainLevelUpTip,
                        () => {
                            guideCtrl.hideMask();
                        },
                        this,
                        {
                            args: {
                                oldLv: parseInt(oldLv),
                                newLv: parseInt(level),
                            }
                        }
                    );
                }
                // 设置引导数据
                model.curGuide = cfg;
                this._setGuideCfg(cfg);
            }
        }
    }

    /**设置指引id */
    setGuideId(id: number | GuideCfg) {
        if (this.isHideGuide) return; // 引导被禁用
        let model = this.model;
        let config = model.curGuide;
        if (id > 0 && config) {
            // 指引id相同则直接返回
            if (config.id == id) {
                return;
            }
        }
        let cfg = (id instanceof GuideCfg) ? id : model.guideCfgs[id];
        if (cfg) {
            CC_DEBUG && this.log('设置引导（前）：', cfg.id);
            model.curGuide = cfg;
            if (cc.js.isNumber(cfg.delay) && cfg.delay > 0) {
                let ctrl = this.guideCtrl;
                if (ctrl) {
                    ctrl.hideGuide();
                    ctrl.showMask(0, true);
                    gdk.Timer.once(Math.floor(cfg.delay * 1000), this, () => {
                        if (!cc.isValid(ctrl.node)) return;
                        ctrl.hideMask();
                        this._setGuideCfg(cfg);
                    });
                }
            } else {
                this._setGuideCfg(cfg);
            }
        } else {
            // 关闭指引
            this.clearGuide();
        }
    }

    // 实际设置当前引导配置
    _setGuideCfg(cfg: GuideCfg) {
        // 引导激活前置条件判断，如果不满足此条件引导会无法继续
        let igno = false;
        let conds = cfg.activeCondition.split("|");
        let startsWith = StringUtils.startsWith;
        for (let i = 0; !igno && i < conds.length; i++) {
            let cond = conds[i];
            if (startsWith(cond, 'main#')) {
                // 主线准备场景激活的引导
                igno = !gdk.panel.isOpenOrOpening(PanelId.PveReady);
            } else if (startsWith(cond, 'ready#')) {
                // 塔防战斗准备界面激活的引导
                igno = !gdk.panel.isOpenOrOpening(PanelId.PveScene);
            } else if (startsWith(cond, 'wave#')) {
                // 塔防战斗刷怪波数开始或结束激活的引导
                igno = !gdk.panel.isOpenOrOpening(PanelId.PveScene);
            } else if (startsWith(cond, 'end#')) {
                // 塔防或卡牌战斗结束时激活的引导
                igno = !(
                    gdk.panel.isOpenOrOpening(PanelId.PveScene) ||
                    gdk.panel.isOpenOrOpening(PanelId.PvpScene)
                );
            } else if (StringUtils.endsWith(cond, '#open') &&
                (startsWith(cond, 'view#') || startsWith(cond, 'popup#'))
            ) {
                // 打开某个界面时激活的引导
                igno = !gdk.panel.isOpenOrOpening(cond.split('#')[1]);
            }
        }
        // 前置条件判断
        let d: GuideDependence = cfg.dependence;
        if (!igno && typeof d === 'object') {
            // 界面判断
            if (d.panel instanceof Array) {
                igno = d.panel.some(p => {
                    if (StringUtils.startsWith(p, '!')) {
                        return gdk.panel.isOpenOrOpening(p.substr(1));
                    }
                    return !gdk.panel.isOpenOrOpening(p);
                });
            } else if (!!d.panel) {
                igno = !gdk.panel.isOpenOrOpening(d.panel);
            }
            // 物品判断
            if (!igno && d.goods instanceof Array) {
                for (let i = 0, n = d.goods.length; i < n; i += 2) {
                    let num = BagUtils.getItemNumById(d.goods[i]);
                    if (num < d.goods[i + 1]) {
                        igno = true;
                        break;
                    }
                }
            }
            // 等级判断
            if (!igno && d.level instanceof Array) {
                let lv = ModelManager.get(RoleModel).level;
                igno = lv < d.level[0] || lv > d.level[1];
            }
            // 功能开启判断
            if (!igno && d.sysids instanceof Array) {
                for (let i = 0, n = d.sysids.length; i < n; i++) {
                    if (!JumpUtils.ifSysOpen(d.sysids[i], false)) {
                        igno = true;
                        break;
                    }
                }
            }
            // 上阵英雄判断
            if (!igno && d.battle instanceof Array) {
                let list = ModelManager.get(HeroModel).PveUpHeroList;
                let num = 0;
                list.forEach(l => {
                    if (l > 0) num++;
                });
                if (num < d.battle[0] || num > d.battle[1]) {
                    igno = true;
                }
            }
            // 英雄判断
            if (!igno && d.herostar instanceof Array) {
                igno = true;
                let num = d.herostar[3] || 1;
                let list = ModelManager.get(HeroModel).heroInfos;
                for (let i = 0, n = list.length; i < n; i++) {
                    if (d.herostar[0] <= 0 || list[i].itemId == d.herostar[0]) {
                        let info = list[i].extInfo as icmsg.HeroInfo;
                        if (info.star >= d.herostar[1] && info.star <= d.herostar[2]) {
                            if (--num <= 0) {
                                igno = false;
                                break;
                            }
                        }
                    }
                }
            }
            // 开服天数判断
            if (!igno && d.days instanceof Array) {
                let num = GlobalUtil.getCurDays();
                if (num < d.days[0] || num > d.days[1]) {
                    igno = true;
                }
            }
        }
        // 忽略引导
        if (igno) {
            CC_DEBUG && this.log('忽略引导：', cfg.id);
            this.clearGuide();
            return;
        }
        CC_DEBUG && this.log('设置引导（后）：', cfg.id);
        // 引导跳转
        let openSys = cfg.openSys;
        if (cc.js.isNumber(openSys) || (openSys instanceof Array && openSys.length > 0)) {
            let arr: number[] = openSys instanceof Array ? openSys : [openSys];
            let con: boolean = arr.some(id => {
                if (!JumpUtils.openView(id, false)) {
                    // 如果功能达不到开启条件，则清除当前引导
                    CC_DEBUG && cc.error(`引导失败：达不到 ${id} 开启条件`);
                    this.clearGuide();
                    return true;
                }
                return false;
            });
            if (con) {
                // 有功能达不到开启条件
                return;
            }
        }
        // 显示引导
        let ctrl = this.guideCtrl;
        if (ctrl) {
            CC_DEBUG && this.log('显示引导：', cfg.id);
            // 保存至后端
            if (cc.js.isNumber(cfg.step)) {
                let qmsg = new icmsg.GuideGroupStepReq();
                qmsg.groupId = cfg.group;
                qmsg.stepId = cfg.step;
                NetManager.send(qmsg);
            }
            // 显示引导
            ctrl.hideGuide();
            ctrl.showGuideInfo();
        }
    }

    /**绑定指引任务node节点 */
    bindGuideNode(id: number, node: cc.Node = null) {
        if (id <= 0) {
            return;
        }
        if (cc.isValid(node)) {
            this.model.bindBtns[id] = node;
        } else {
            delete this.model.bindBtns[id];
        }
        if (this.guideCtrl) {
            this.guideCtrl.onBindBtn(id, node);
        }
    }

    /**
     * 指引组结束
     * 任务组指引特殊处理
     */
    endGuide(cfg?: GuideCfg) {
        (cfg === void 0) && (cfg = this.model.curGuide);
        if (cfg && cfg.group >= 0 && cfg.group != 20000) {
            // 从可激活列表中删除
            let activeCfgs = this.model.activeCfgs;
            let cfgs = ConfigManager.getItemsByField(GuideCfg, "group", cfg.group);
            cfgs && cfgs.length && cfgs.some(cfg => {
                let key = cfg.activeCondition;
                let arr = activeCfgs[key];
                if (arr) {
                    for (let i = arr.length - 1; i >= 0; i--) {
                        if (arr[i].id == cfg.id) {
                            arr.splice(i, 1);
                        }
                    }
                    if (arr.length == 0) {
                        delete activeCfgs[key];
                    }
                    return true;
                }
                return false;
            });

            if (cfg.group != 20000 && cfg.nextTask >= 0) {
                // 标记完成并通知服务器保存
                this.model.doneIds[cfg.group] = true;
                let msg = new icmsg.GuideGroupSaveReq()
                msg.groupId = cfg.group
                NetManager.send(msg)
                CC_DEBUG && this.log('完成引导组：', cfg.group);
            }

        }
        // 清除当前引导
        (cfg === this.model.curGuide) && this.clearGuide(false);
    }

    /**
     * 等级开启的指引
     * 该类指引加入轮播,如果有多个指引同时触发时
     * 如果有奖励界面,则等奖励界面关闭后再显示引导
     * @param oldLv 旧的等级
     * @param level 新的等级
     */
    levelActive(oldLv: number, level: number) {
        // 升级并且非登录游戏
        if (oldLv > 0 && level > oldLv) {
            this.model.waitActives.push(this._creatAcitveGuide(
                `levelup#${oldLv}#${level}#open`,
                `popup#${PanelId.MainLevelUpTip.__id__}#close`,
            ));
        }
        // 添加等级激活条件引导
        for (let lv = oldLv + 1; lv <= level; lv++) {
            let key = `level#${lv}`;
            if (!!this.model.activeCfgs[key]) {
                this.activeGuide(key, false);
            }
        }
        // 开启引导
        if (!this.isGuiding) {
            this.clearGuide();
        }
    }

    /**创建一条激活配置 */
    _creatAcitveGuide(activeCondition?: string, finishCondition?: string) {
        let cfg = new GuideCfg();
        cfg.id = 0;
        cfg.group = -1;
        cfg.type = GuideType.ENDLESS;
        cfg.nextTask = 0;
        cfg.maskAlpha = 0;
        cfg.force = 1;
        cfg.activeCondition = activeCondition;
        cfg.finishCondition = finishCondition;
        return cfg;
    }

    /**激活对应条件的没完成的引导 */
    activeGuide(key: string, immediate: boolean = true): boolean {
        if (!this.guideCtrl) return;
        CC_DEBUG && this.log('引导激活事件：' + key);
        let model = this.model;
        let waits = model.waitActives;
        let curr = model.curGuide;
        // 清除插入的临时引导
        for (let i = waits.length - 1; i >= 0; i--) {
            let cfg = waits[i];
            if (cfg.group < 0 && cfg.finishCondition == key) {
                waits.splice(i, 1);
            }
        }
        // 当前引导是否可完成
        if (curr && curr.finishCondition == key) {
            this.nextGuide();
            return true;
        }
        let cfgs = model.activeCfgs[key];
        let arr: GuideCfg[] = [];
        cfgs && cfgs.length && cfgs.forEach(cfg => {
            if (this.ifGuideDone(cfg.group)) return;
            if (curr === cfg) return;
            if (waits.indexOf(cfg) >= 0) return;
            arr.push(cfg);
        });
        // 添加到等待列表
        if (arr && arr.length > 0) {
            GlobalUtil.sortArray(arr, (a, b) => {
                return a.turn - b.turn;
            });
            arr.forEach(cfg => {
                waits.push(cfg);
            });
        }
        // 设置当前引导
        if (immediate && !curr && waits.length > 0) {
            let next = waits.shift();
            this.setGuideId(next.id);
            return true;
        }
        return false;
    }

    /**执行某一组的指引 */
    doneGuideGroup(group: number, force?: boolean) {
        let items = ConfigManager.getItemsByField(GuideCfg, "group", group);
        if (items && items.length) {
            GlobalUtil.sortArray(items, (a, b) => {
                return a.id - b.id
            });
            if (force || !this.ifGuideDone(items[0].group)) {
                this.setGuideId(items[0].id);
            }
        }
    }
}

const GuideUtil = gdk.Tool.getSingleton(GuideUtilClass);
iclib.addProp('GuideUtil', GuideUtil);
export default GuideUtil;
