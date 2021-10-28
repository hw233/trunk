import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveBaseFightCtrl from './PveBaseFightCtrl';
import PveBuffModel from '../../model/PveBuffModel';
import PveBuildTowerCtrl from './PveBuildTowerCtrl';
import PveEnemyCtrl from './PveEnemyCtrl';
import PveHeroModel from '../../model/PveHeroModel';
import PveHurtableFightCtrl from './PveHurtableFightCtrl';
import PvePiecesDragHeroCtrl from '../view/pieces/PvePiecesDragHeroCtrl';
import PvePiecesHandCardCtrl from '../view/pieces/PvePiecesHandCardCtrl';
import PvePiecesHeroSellCtrl from '../view/pieces/PvePiecesHeroSellCtrl';
import PveSceneState from '../../enum/PveSceneState';
import PveSkillModel from '../../model/PveSkillModel';
import PveTool from '../../utils/PveTool';
import ThingColliderCtrl from '../../core/ThingColliderCtrl';
import {
    Copy_assistCfg,
    Copycup_rookieCfg,
    Hero_undersand_levelCfg,
    Pve_demo2Cfg,
    Skill_target_typeCfg
    } from '../../../../a/config';
import { CopyType } from '../../../../common/models/CopyModel';
import { PiecesEventId } from '../../../pieces/enum/PiecesEventId';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import { PveHeroDir, PveSoldierDir } from '../../const/PveDir';
import { RoleEventId } from '../../../role/enum/RoleEventId';

/**
 * Hero控制类
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-27 16:37:10
 */
const { ccclass, property, menu } = cc._decorator;

// ID字段值相等时
function hasId(v: any): boolean {
    return v.id == this.id;
}

function sortByAddTime(a: any, b: any) {
    return a.addTime - b.addTime;
}

@ccclass
@menu("qszc/scene/pve/fight/PveHeroCtrl")
export default class PveHeroCtrl extends PveHurtableFightCtrl {
    @property(cc.Node)
    bgSpine: cc.Node = null;

    @property(gdk.List)
    buffs: gdk.List = null;

    @property(cc.Node)
    mubeiNode: cc.Node = null;

    @property(cc.Label)
    timeLb: cc.Label = null;

    @property(cc.Prefab)
    piecesDragHeroPrefab: cc.Prefab = null;

    /** 数据 */
    model: PveHeroModel;
    spine: sp.Skeleton;

    _tower: PveBuildTowerCtrl;
    _pos: cc.Vec2;
    _lastCollidedTower: PveBuildTowerCtrl;

    showAtkDis = false; // 上阵时显示攻击距离
    offBattleState = true;  // 脱战状态
    OffBattleTime = 0;  // 脱战时间
    isAssist = false;   // 是否是新奖杯模式助战

    startRecover: boolean = false;  // 回血标记
    recoverTime: number = 0;
    attackTime: number = 0; // 被攻击后的延迟回血时间

    fightTime: number = 0;
    checkTime: number = 0;
    isFight: boolean = false;
    drawEnemyCheckTime: number = 0;

    relive: boolean = false;//复活记录
    killMonsterIds: number[] = [];

    piecesFakeDragHero: cc.Node; //自走棋模式拖拽显示的英雄模型 解决层级问题

    onEnable() {
        this.spine = this.spines[0];
        this.mubeiNode.active = false;
        this.timeLb.node.active = false;
        this.timeLb.node.zIndex = 1001;
        this.buffs.node.zIndex = 999;
        this.spine.node.active = true;
        this.spine.node.setPosition(0, 0);
        this._pos = this.node.getPosition();
        this.offBattleState = true;
        this.OffBattleTime = 0;
        this.fightTime = 0
        this.isFight = false;
        this.bgSpine.active = false;
        super.onEnable();
        //检测塔位是否需要修改英雄模型大小
        if (this.sceneModel && this.sceneModel.eliteStageUtil && this.sceneModel.eliteStageUtil.towerScaleIndexData.length > 0 && this.model) {
            let index = this.sceneModel.eliteStageUtil.towerScaleIndexData.indexOf(this._tower.id);
            let scale: number = this.model.size * this.sceneModel.scale;
            if (index >= 0) {
                if (index > this.sceneModel.eliteStageUtil.towerScaleNumData.length - 1) {
                    index = 0;
                }
                scale = this.model.size * this.sceneModel.scale * this.sceneModel.eliteStageUtil.towerScaleNumData[index];
            }
            for (let i = 0, n = this.spines.length; i < n; i++) {
                let spine = this.spines[i];
                spine.node.scale = scale;
            }
        }
        if (this.sceneModel && this.sceneModel.isDemo) {
            let cfg = ConfigManager.getItemByField(Pve_demo2Cfg, 'hero_id', this.model.config.id);
            if (cfg) {
                let scale = cfg.size;
                for (let i = 0, n = this.spines.length; i < n; i++) {
                    let spine = this.spines[i];
                    spine.node.scale = scale;
                }
            }
        }
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        if (this.offBattleState) {
            this.OffBattleTime += dt;
        }
        if (this.startRecover && this.isAlive && this.attackTime <= 0) {
            this.recoverTime += dt;
            if (this.recoverTime >= 0.5) {
                // 每0.5秒回复一次
                let model = this.model;
                let hpMax = model.hpMax;
                let hp = model.hp + Math.floor(hpMax * model.getProp('heal') * this.recoverTime);
                if (hp < hpMax) {
                    model.hp = hp;
                } else {
                    // 已达到最大血量
                    if (model.hp != hpMax) {
                        model.hp = hpMax;
                    }
                    this.startRecover = false;
                }
                this.recoverTime = 0;
            }
        }
        if (this.attackTime > 0) {
            this.attackTime -= dt;
        }
        // 检测拦截战斗时长
        if (this.isFight && this.checkTime > 0 && this.isAlive) {
            this.fightTime += dt;
            this.checkTime -= dt;
            if (this.checkTime <= 0) {
                this.checkTime = 1;
                this.isFight = false;
            }
        }
        // 主动吸引怪物攻击自己检查
        if (this.drawEnemyCheckTime > 0) {
            this.drawEnemyCheckTime -= dt;
        }
        if (this.drawEnemyCheckTime <= 0) {
            this.drawEnemyCheckTime = 0.5;
            // 只针对守卫英雄
            let model = this.model;
            let hate_num = model.soldierType == 4 ? model.getProp('hate_num') : 0;
            if (hate_num > 0) {
                let sm = this.sceneModel;
                let cfg = ConfigManager.getItemById(Skill_target_typeCfg, 101); // 目标敌人
                let pos = this.getTowerPos();
                let fightId = model.fightId;
                let all = sm.fightSelector.getAllFights(this, cfg, sm, null, pos, 9999);
                // 查询列表中满足要求的数量
                for (let i = 0; i < all.length; i++) {
                    let t = all[i];
                    if (t.model.targetId == fightId) {
                        // 不同阵营的对象的目标为attacker时，则仇恨值减一
                        if (--hate_num < 1) break;
                    }
                }
                // 设置自己为对方的目标
                if (hate_num > 0) {
                    let arr = sm.fightSelector.getAllFights(this, cfg, sm, null, pos, model.range);
                    for (let i = 0; i < arr.length; i++) {
                        let tm = arr[i].model;
                        if (tm.targetId == -1) {
                            tm.targetId = fightId;
                            if (--hate_num < 1) break;
                        }
                    }
                }
            }
        }
        // 基类的处理循环
        super.updateScript(dt);
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.e.targetOff(this);
        this.node.targetOff(this);
        this.node.stopAllActions();
        this.buffs.datas = [];
        this.buffs.updateView();
        this.tower = null;
        this.isAssist = false;
        this._lastCollidedTower = null;
        if (this.piecesFakeDragHero) {
            this.piecesFakeDragHero.removeFromParent();
            this.piecesFakeDragHero = null;
        }
        PveTool.clearSpine(this.bgSpine.getChildByName('spine').getComponent(sp.Skeleton));
        super.onDisable();
    }

    hide(effect: boolean = true) {
        for (let i = 0, n = this.model.soldiers.length; i < n; i++) {
            let soldier = this.model.soldiers[i];
            soldier.hide(false);
        }
        this.model.soldiers.length = 0;
        super.hide(effect);
    }

    getTowerPos() {
        return this._pos;
    }

    getScale(animation: string): number {
        let scaleX: number = 1;
        switch (this.model.dir) {
            case PveHeroDir.LEFT:
                scaleX = 1;
                break;

            case PveHeroDir.RIGHT:
                scaleX = -1;
                break;
        }
        return scaleX;
    }

    getAnimation(animation: string): string {
        animation = PveEnemyCtrl.prototype.getAnimation.call(this, animation, false);
        let asuffix = this.model.getProp('skill_suffix');
        if (asuffix && asuffix != 0) {
            asuffix = '_' + asuffix;
        } else {
            asuffix = '';
        }
        return animation + asuffix;
    }

    setDir(to: cc.Vec2) {
        let dx: number = (to.x - this.getPos().x);
        if (dx != 0) {
            this.model.dir = dx > 0 ? PveHeroDir.RIGHT : PveHeroDir.LEFT;
        }
    }

    get tower(): PveBuildTowerCtrl {
        return this._tower;
    }

    set tower(v: PveBuildTowerCtrl) {
        if (this._tower === v) return;
        this._tower = v;
        this._pos = this.node.getPosition();
        // 默认的方向和位置
        if (v && this.model) {
            this.model.orignalPos = this._tower.node.getPos();
            // 调整自己的方向
            let d: string = v.name.charAt(0);
            this.model.dir = d == 'r' ? PveHeroDir.RIGHT : PveHeroDir.LEFT;
            // 调整小兵的位置和方向
            let n: number = this.model.soldiers.length;
            for (let i = 0; i < n; i++) {
                let soldier = this.model.soldiers[i];
                soldier.model.dir = d == 'r' ? PveSoldierDir.DOWN_RIGHT : PveSoldierDir.DOWN_LEFT;
                soldier.node.name = this.node.name.split('_').shift() + '_soldier_' + i;
                soldier.setPosBy(i, n);
                soldier.setAnimation(PveFightAnmNames.IDLE);
            }
            this.setAnimation(PveFightAnmNames.IDLE);
            let copy_id = this.sceneModel.stageConfig.copy_id
            if (copy_id == CopyType.RookieCup) {
                let temCfg = ConfigManager.getItem(Copycup_rookieCfg, { 'stage_id': this.sceneModel.stageConfig.id })
                let towerStr = 'tower_' + v.id;
                this.isAssist = false;
                if (temCfg[towerStr].length == 1) {
                    this.isAssist = true;
                }
                // if (temCfg.assist.length > 0) {
                //     this.isAssist = false;
                //     temCfg.assist.forEach(data => {
                //         if (v.id == data[1]) {
                //             this.isAssist = true;
                //         }
                //     })
                // }
            }
            if (copy_id == CopyType.HeroTrial || copy_id == CopyType.NewHeroTrial) {
                let temCfgs = ConfigManager.getItems(Copy_assistCfg, { 'stage_id': this.sceneModel.stageConfig.id })
                if (temCfgs.length > 0) {
                    this.isAssist = false;
                    temCfgs.forEach(cfg => {
                        if (this.model.config.id == cfg.hero_id) {
                            this.isAssist = true;
                        }
                    })
                }
            }

            //检测塔位是否需要修改英雄模型大小
            if (this.sceneModel && this.sceneModel.eliteStageUtil && this.sceneModel.eliteStageUtil.towerScaleIndexData.length > 0 && this.model) {
                let index = this.sceneModel.eliteStageUtil.towerScaleIndexData.indexOf(this._tower.id);
                let scale: number = this.model.size * this.sceneModel.scale;
                if (index >= 0) {
                    if (index > this.sceneModel.eliteStageUtil.towerScaleNumData.length - 1) {
                        index = 0;
                    }
                    scale = this.model.size * this.sceneModel.scale * this.sceneModel.eliteStageUtil.towerScaleNumData[index];
                }
                for (let i = 0, n = this.spines.length; i < n; i++) {
                    let spine = this.spines[i];
                    spine.node.scale = scale;
                }
            }
        }
    }

    reset() {
        let model = this.model;
        model.id = model.id;
        model.info = model.info;
        model.reliveNum = 0;
        this.offBattleState = true;
        this.OffBattleTime = 0;
        this.startRecover = false;
        this.recoverTime = 0;
        this.attackTime = 0;
        this.spine.node.setPosition(0, 0);
        this.bgSpine.setPosition(0, 0);
        this.node.setPosition(model.orignalPos);
        this.isFight = false;
        this.fightTime = 0;
        this.checkTime = 1;
        this.drawEnemyCheckTime = 0.5;
        this.killMonsterIds = []
        // 重置改变的骨骼显示状态
        let skeletonData = this.spine['_N$skeletonData'];
        if (skeletonData && skeletonData['_skeletonJson']) {
            let slots: any[] = skeletonData['_skeletonJson'].slots;
            slots && slots.forEach(slot => {
                let bone = slot.bone as string;
                if (bone.startsWith('bone_buff_')) {
                    let s = this.spine.findSlot(slot.name);
                    if (s) {
                        s.color.a = 0;
                    }
                }
            });
        }
        // let bone_change = model.prop.bone_change;
        // if (bone_change) {
        //     let spine = this.spine;
        //     for (let i = 0; i <= bone_change; i++) {
        //         let s = spine.findSlot('bone_buff_' + i);
        //         if (!s) break;
        //         s.color.a = 0;
        //     }
        // }
        if (this.piecesFakeDragHero) {
            this.piecesFakeDragHero.removeFromParent();
            this.piecesFakeDragHero = null;
        }
        super.reset();
    }

    _touchStart(event: any) {
        if (this.sceneModel.heros.indexOf(this) == -1) return; // 只对英雄列表中的对象有效
        if (gdk.panel.isOpenOrOpening(PanelId.PveSceneHeroDetailPanel)) return;
        if (gdk.panel.isOpenOrOpening(PanelId.PveHeroFightInfo)) return;
        if (gdk.panel.isOpenOrOpening(PanelId.PveSceneHeroSelectPanel)) return;
        let node: cc.Node = this.node;
        node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this);
        node.on(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEnd, this);
        // 禁用场景的ScrollView组件
        let scrollView = this.sceneModel.ctrl.root.getComponent(cc.ScrollView);
        if (scrollView && scrollView.enabled) {
            scrollView.enabled = false;
        }
        // 自走棋模式显示英雄售出图标
        if (this.sceneModel.arenaSyncData && this.sceneModel.arenaSyncData.fightType == 'PIECES_CHESS') {
            gdk.e.emit(PiecesEventId.PIECES_PVP_SHOW_HERO_SELL_ICON, this.model.info.heroId);
            let content = cc.find('Pvp/ui/pieces/bot/dragArea', this.sceneModel.ctrl.node);
            this.piecesFakeDragHero = cc.instantiate(this.piecesDragHeroPrefab);
            this.piecesFakeDragHero.parent = content;
            this.piecesFakeDragHero.setScale(this.spine.node.scale);
            this.piecesFakeDragHero.setPosition(content.convertToNodeSpaceAR(this.node.parent.convertToWorldSpaceAR(this.node.getPos())));
            this.piecesFakeDragHero.getComponent(cc.BoxCollider).enabled = false;
            let ctrl = this.piecesFakeDragHero.getComponent(PvePiecesDragHeroCtrl);
            ctrl.updateView(this.model.info.heroType);
            this.node.opacity = 1;
        }

    }

    _touchMove(event: any) {
        let node: cc.Node = this.node;
        let delta: cc.Vec2 = event.touch.getDelta();
        if (delta.x != 0 || delta.y != 0) {
            if (this.sceneModel.arenaSyncData && this.sceneModel.arenaSyncData.fightType == 'PIECES_CHESS') {
                node.x += delta.x;
                node.y += delta.y;
                node.opacity = 1;
                this.piecesFakeDragHero.x += delta.x;
                this.piecesFakeDragHero.y += delta.y;
            } else {
                node.x += delta.x;
                node.y += delta.y;
                node.opacity = 200;
            }
            // 检查是否与塔座相交
            let collider = node.getComponent(ThingColliderCtrl);
            if (!collider) {
                collider = node.addComponent(ThingColliderCtrl);
            }
            let tower = collider.getClolliderComponent(PveBuildTowerCtrl, t => t.sceneCtrl === this.sceneModel.ctrl);
            if (!tower) {
                // 当前没有与任何塔位有交集
                if (this._lastCollidedTower) {
                    this._lastCollidedTower.showAtkDisLater(0);
                }
                this._lastCollidedTower = null;
            } else if (tower !== this._lastCollidedTower) {
                // 与新的塔位产生了交集
                if (this._lastCollidedTower) {
                    this._lastCollidedTower.showAtkDisLater(0);
                }
                this._lastCollidedTower = tower;
                this._lastCollidedTower.showAtkDisLater(this.model.range * 2, false);
            }
        }
    }

    _touchEnd() {
        let node: cc.Node = this.node;
        node.off(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this);
        node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
        node.off(cc.Node.EventType.TOUCH_CANCEL, this._touchEnd, this);
        node.opacity = 255;
        // 检查是否与塔座相交
        let collider = node.getComponent(ThingColliderCtrl);
        if (collider) {
            let handCard = collider.getClolliderComponent(PvePiecesHandCardCtrl);
            let sellNode = collider.getClolliderComponent(PvePiecesHeroSellCtrl);
            let tower = collider.getClolliderComponent(PveBuildTowerCtrl, t => t.sceneCtrl === this.sceneModel.ctrl);
            if (tower && tower !== this.tower) {
                if (this.isAssist) {
                    // 新奖杯模式助战不能移动
                    tower = null;
                    gdk.gui.showMessage('此塔位英雄无法替换、移动');
                }
                if (this.sceneModel.stageConfig.copy_id == CopyType.RookieCup) {
                    // 新奖杯模式助战不能移动
                    tower = null;
                    gdk.gui.showMessage('实战模式塔位无法移动');
                }
            }
            if (tower && (!tower.hero || !tower.hero.isAssist)) { //tower.validItem(this.model.item) &&
                let valid = true;
                if (tower !== this.tower) {
                    let hero = tower.hero;
                    if (hero) {
                        // 交换
                        valid = this.tower.validItem(hero.model.item);
                        if (valid) {
                            this.tower.hero = hero;
                            // if (this.sceneModel.arenaSyncData && this.sceneModel.arenaSyncData.fightType == 'PIECES_CHESS') {
                            //     let req = new icmsg.PiecesHeroOnBattleReq();
                            //     req.heroId = this.model.info.heroId;
                            //     req.pos = tower.id - 1;
                            //     NetManager.send(req);
                            // }
                        }
                    } else {
                        // 清除原塔的hero
                        this.tower.hero = null;
                    }
                }
                if (valid) {
                    // 还原位置
                    tower.hero = this;
                    if (this.sceneModel.arenaSyncData && this.sceneModel.arenaSyncData.fightType == 'PIECES_CHESS') {
                        let req = new icmsg.PiecesHeroOnBattleReq();
                        req.heroId = this.model.info.heroId;
                        req.pos = tower.id - 1;
                        NetManager.send(req);
                    }
                    // 防守阵营需保存位置
                    if (this.sceneModel.isDefender) {
                        // let n = this.sceneModel.towers.length;
                        // // 初始数据
                        // let a = [];
                        // for (let i = 0; i < n; i++) {
                        //     a[i] = 0;
                        // }
                        // // 上阵数据
                        // for (let i = 0; i < n; i++) {
                        //     let t = this.sceneModel.towers[i];
                        //     if (t.hero) {
                        //         let e = <icmsg.HeroInfo>t.hero.model.item.extInfo;
                        //         if (e && e.heroId > 0) {
                        //             a[t.id - 1] = e.heroId;
                        //         }
                        //     }
                        // }
                        // let msg = new icmsg.BattleArraySetReq();
                        // let heroModel = ModelManager.get(HeroModel)
                        // msg.type = heroModel.curDefendType;
                        // msg.heroIds = a;
                        // NetManager.send(msg, (rsp: icmsg.BattleArraySetRsp) => {
                        //     if (!cc.isValid(this.node)) return;
                        //     let heroModel = ModelManager.get(HeroModel)
                        //     heroModel.refreshCurHeroList(heroModel.curDefendType, rsp.heroIds);
                        // }, this);
                    } else {
                        // 保存上阵数据
                        this.sceneModel.saveBuildTower();
                    }
                } else {
                    // 还原位置
                    this.tower.hero = this;
                }
                if (this.sceneModel.arenaSyncData && this.sceneModel.arenaSyncData.fightType == 'PIECES_CHESS') {
                    // 自走棋模式隐藏售出图标
                    gdk.e.emit(PiecesEventId.PIECES_PVP_HIDE_HERO_SELL_ICON);
                }
            } else if (handCard) {
                // 自走棋模式 备战区位置互换
                let cb = (resp: icmsg.PiecesHeroOnBattleRsp) => {
                    let clear: boolean = true;
                    for (let i = 0; i < resp.changeList.length; i++) {
                        let l = resp.changeList[i];
                        if (l.pos == this.tower.id - 1) {
                            clear = false;
                            let req = new icmsg.PiecesFightQueryReq();
                            req.heroId = l.heroId;
                            NetManager.send(req, (resp: icmsg.PiecesFightQueryRsp) => {
                                if (!cc.isValid(this.node)) return;
                                let info = resp.hero;
                                let item = HeroUtils.createHeroBagItemBy(info);
                                item.series = 800000 + info.heroId;
                                this.sceneModel.heroMap[item.series] = info;
                                this.tower.setHeroByItem(item);
                                this.fsm.start();
                            }, this);
                        }
                    }
                    if (clear) {
                        delete this.sceneModel.heroMap[800000 + this.model.info.heroId];
                        this.tower.setHeroByItem(null);
                    }
                };
                if (!handCard.offBattleReq(this.model.info.heroId, cb)) {
                    // 还原位置
                    this.tower.hero = this;
                }
                gdk.e.emit(PiecesEventId.PIECES_PVP_HIDE_HERO_SELL_ICON);
            } else if (sellNode) {
                //自走棋模式卖出英雄
                let cb = () => {
                    // delete this.sceneModel.heroMap[800000 + this.model.info.heroId];
                    this.tower.setHeroByItem(null);
                    // gdk.e.emit(PiecesEventId.PIECES_PVP_HIDE_HERO_SELL_ICON);
                }
                sellNode.sellHero(this.model.info.heroId, false, cb);
            } else {
                // 还原位置
                this.tower.hero = this;
                if (this.sceneModel.arenaSyncData && this.sceneModel.arenaSyncData.fightType == 'PIECES_CHESS') {
                    //自走棋模式隐藏售出图标
                    gdk.e.emit(PiecesEventId.PIECES_PVP_HIDE_HERO_SELL_ICON);
                }
            }
            node.removeComponent(ThingColliderCtrl);
        } else {
            if (this.sceneModel.arenaSyncData && this.sceneModel.arenaSyncData.fightType == 'PIECES_CHESS') {
                //自走棋模式隐藏售出图标
                gdk.e.emit(PiecesEventId.PIECES_PVP_HIDE_HERO_SELL_ICON);
            }
        }
        if (this._lastCollidedTower) {
            this._lastCollidedTower.showAtkDisLater(this.model.range * 2);
        }
        this._lastCollidedTower = null;
        // 启用场景的ScrollView组件
        let sceneCtrl = this.sceneModel.ctrl;
        let scrollView = sceneCtrl.root.getComponent(cc.ScrollView);
        if (scrollView) {
            scrollView.enabled = sceneCtrl.content.width > sceneCtrl.root.width;
        }

        if (this.sceneModel.arenaSyncData && this.sceneModel.arenaSyncData.fightType == 'PIECES_CHESS' && this.piecesFakeDragHero) {
            this.piecesFakeDragHero.removeFromParent();
            this.piecesFakeDragHero = null;
            this.node.opacity = 255;
        }
    }

    @gdk.binding('sceneModel.state')
    _setHeroState(v: PveSceneState) {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let node = this.node;
        if ([PveSceneState.Ready, PveSceneState.WaveOver].indexOf(v) !== -1 && !this.sceneModel.isMirror) {
            node.on(cc.Node.EventType.TOUCH_START, this._touchStart, this);
            gdk.e.on(RoleEventId.REMOVE_HERO_FIGHT_INFO, this._updateFightInfo, this);
        } else {
            // 镜像战斗只演示，不能操作
            node.off(cc.Node.EventType.TOUCH_START, this._touchStart, this);
            node.off(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this);
            node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
            node.off(cc.Node.EventType.TOUCH_CANCEL, this._touchEnd, this);
            gdk.e.off(RoleEventId.REMOVE_HERO_FIGHT_INFO, this._updateFightInfo, this);
        }
        // 基类的方法
        PveBaseFightCtrl.prototype._setState.call(this, v);
    }

    // 更新战斗属性
    _updateFightInfo(event: gdk.Event) {
        let heroId = event.data as number;
        let model = this.model;
        if (model && model._ready && model.heroId == heroId) {
            delete this.sceneModel.heroMap[heroId];
            this.model._info = null;
            this.model._ready = false;
            this.fsm.start();
        }
    }

    // BUFF列表更新
    updateBuff() {
        gdk.Timer.callLater(this, this.updateBuffLater);
    }

    updateBuffLater(): void {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (!this.model) return;
        let b: PveBuffModel[] = [];
        // 自己的BUFF
        let t = this.model.buffs;
        t && t.length && b.push(...t);
        // 小兵的BUFF
        for (let i = 0, n = this.model.soldiers.length; i < n; i++) {
            let soldier = this.model.soldiers[i];
            if (soldier && soldier.model) {
                t = soldier.model.buffs;
                t && t.length && b.push(...t);
            }
        }
        // 收集
        let a: any[] = this.buffs.datas;
        for (let i = 0, n = b.length; i < n; i++) {
            let item = b[i];
            if (item.config.icon) {
                if (!a.some(hasId.bind(item))) {
                    a.push({
                        id: item.id,
                        addTime: item.addTime,
                        config: item.config,
                        stack: item.stacking,
                    });
                } else {
                    // 刷新buff层数
                    a.forEach(data => {
                        if (data.id == item.id) {
                            data.stack = item.stacking;
                            return;
                        }
                    });
                }
            }
        }
        // 删除失效的
        for (let i = a.length - 1; i >= 0; i--) {
            if (!b.some(hasId.bind(a[i]))) {
                a.splice(i, 1);
            }
        }

        // 排序并保留最大3个BUFF
        a.sort(sortByAddTime);
        if (a.length > 3) a.length = 3;
        this.buffs.datas = a;
    }

    // 设置英雄退出脱战状态
    resetOffBattleState() {
        this.offBattleState = false;
        this.OffBattleTime = 0;
    }

    /**
    * 被攻击时事件接口
    */
    onAttacked(attacker: PveFightCtrl, skill: PveSkillModel | PveBuffModel): void {
        super.onAttacked(attacker, skill);
        if (attacker != null &&
            skill instanceof PveSkillModel &&
            skill.config.dmg_type != 6) {
            // 此处设6为回复技能
            this.startRecover = false;
            this.recoverTime = 0;
            this.attackTime = 3;
        }
        // 没有目标的情况下受到怪物攻击时判断是否在可攻击范围内，在的话就可以攻击
        let sm = this.model;
        if (sm.targetId == -1) {
            if (!attacker || !attacker.isAlive) return;
            let am = attacker.model;
            if (am.camp == sm.camp) return;
            sm.targetId = attacker.model.fightId;
        }
    }

    // 开启、关闭回血机制
    switchRecoverHp(state: boolean) {
        if (state) {
            let model = this.model;
            if (model.getProp('heal') > 0 &&
                model.hp < model.hpMax) {
                state = true;
            } else {
                state = false;
            }
        }
        this.startRecover = state;
    }

    @gdk.binding("model.hp")
    _setHp(v: number, ov: number, nv: number) {
        super._setHp(v, ov, nv);
        if (nv < ov && !this.isFight && this.model.soldierType == 4) {
            this.isFight = true;
            this.checkTime = 1;
        }
        // 英雄死亡时，小兵同时死亡
        if (ov != nv && v <= 0) {
            this.isFight = false;
            this.model.soldiers.forEach(s => {
                if (!s || !s.isAlive) return;
                s.model.hp = 0;
            });
        }
        // 受到伤害时退出回血机制
        if (ov > nv && v > 0) {
            // 此处设6为回复技能
            this.startRecover = false;
            this.recoverTime = 0;
            this.attackTime = 3;
        }
    }

    /**神秘者 背景特效 */
    @gdk.binding('model.ready')
    mysticBgSpine() {
        if (!this.model || !this.model.ready || this.model.config.group[0] !== 6 || !this.model._info) {
            PveTool.clearSpine(this.bgSpine.getChildByName('spine').getComponent(sp.Skeleton));
            this.bgSpine.active = false;
            return;
        }
        let mysticSkillLv: number = 0;
        let totalLv = HeroUtils.getMysticSkillTotalLvByFightHero(this.model._info);
        let cfg = ConfigManager.getItemByField(Hero_undersand_levelCfg, 'mystery_skill', totalLv);
        if (cfg) {
            mysticSkillLv = cfg.undersand_level;
        }
        this.bgSpine.active = false;
        if (mysticSkillLv >= 4) {
            this.bgSpine.active = true;
            this.bgSpine.setScale(this.spine.node.scale);
            this.bgSpine.setPosition(this.spine.node.getPosition());
            let spine = this.bgSpine.getChildByName('spine').getComponent(sp.Skeleton);
            spine.node.setScale(.3);
            let hitAni = HeroUtils.getMysticBgActName(mysticSkillLv);
            let url: string = 'spine/skill/E_mysterystage/E_mysterystage';
            GlobalUtil.setSpineData(this.node, spine, url, false, hitAni, true);
        }
    }
}