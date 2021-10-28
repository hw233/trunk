import { Item_dropCfg, MonsterCfg, Pve_bossbornCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import { CopyType } from '../../../../common/models/CopyModel';
import RoyalModel from '../../../../common/models/RoyalModel';
import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MathUtil from '../../../../common/utils/MathUtil';
import FootHoldModel from '../../../guild/ctrl/footHold/FootHoldModel';
import GuildModel from '../../../guild/model/GuildModel';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import { PveCampType } from '../../core/PveFightModel';
import PveEventId from '../../enum/PveEventId';
import PveEnemyModel from '../../model/PveEnemyModel';
import { PveBSScopeType } from '../../utils/PveBSExprUtils';
import PvePool from '../../utils/PvePool';
import PveRoadUtil from '../../utils/PveRoadUtil';
import PveTool from '../../utils/PveTool';
import PveFightBaseAction from '../base/PveFightBaseAction';

/**
 * PVE怪物死亡动作
 * @Author: sthoo.huang
 * @Date: 2019-03-20 18:14:25
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-13 17:00:37
 */

@gdk.fsm.action("PveEnemyDieAction", "Pve/Enemy")
export default class PveEnemyDieAction extends PveFightBaseAction {

    model: PveEnemyModel;

    temProp: any;
    onEnter() {
        super.onEnter();
        gdk.Timer.callLater(this, this.onEnterLater);
    }

    onEnterLater() {

        // 添加判空，非敌方怪物则不做任何其他操作
        if (!this.active || !this.model || !this.model.config || this.model.camp != PveCampType.Enemy) {
            this.finish();
            return;
        }

        // 计算杀敌数和金币
        if (this.model.config.type != 4) {
            this.sceneModel.killedEnemy++;
            // 保存击杀各类怪物数量
            let dic = this.sceneModel.killedEnemyDic;
            let id = this.model.id
            if (!dic[id]) {
                dic[id] = 0;
            }
            dic[id]++;
        }
        if (cc.js.isNumber(this.model.config.money)) {
            this.sceneModel.moneyNum += Number(this.model.config.money);
        }

        // 死亡特效
        let showDieEffect = this.ctrl.node.opacity > 0;
        let n = this.model.buffs.length;
        for (let i = 0; i < n; i++) {
            let buf = this.model.buffs[i];
            if (buf.hasProp('showDieEffect')) {
                showDieEffect = false;
            }
        }
        let c = this.sceneModel.ctrl;
        if (showDieEffect &&
            iclib.hotupdateEnabled &&
            cc.sys.platform !== cc.sys.WECHAT_GAME
        ) {
            // 热更关闭，微信小游不显示死亡特效
            this.createDieSpine();
        }

        let stageConfig = this.sceneModel.stageConfig
        //实战演练副本通关条件处理
        if (stageConfig.copy_id == CopyType.RookieCup || stageConfig.copy_id == CopyType.EndRuin) {
            if (this.sceneModel.gateconditionUtil.monsterTowerLimit.length > 0) {
                this.sceneModel.gateconditionUtil.monsterTowerLimit.forEach(index => {
                    let data = this.sceneModel.gateconditionUtil.DataList[index];
                    if (data.cfg.data1 == this.model.config.id) {
                        let pos1: cc.Vec2;
                        this.sceneModel.towers.forEach(tower => {
                            if (tower.id == data.cfg.data2) {
                                pos1 = tower.node.getPos();
                            }
                        })
                        let temR = this.sceneModel.tiled.roads[this.model.roadIndex];
                        let temRoad = PveRoadUtil.getShortestRoadBy(pos1, temR);
                        data.state = temRoad.length <= this.model.road.length;
                        data.start = true;
                    }
                })
            }
            if (this.sceneModel.gateconditionUtil.monsterKillTimeLimit.length > 0) {
                this.sceneModel.gateconditionUtil.monsterKillTimeLimit.forEach(index => {
                    let data = this.sceneModel.gateconditionUtil.DataList[index];
                    if (data.cfg.data1 == this.model.config.id) {
                        data.curData = this.model.aliveTime;
                        data.state = data.curData <= data.cfg.data2
                        data.start = true;
                    }
                })
            }

            if (this.sceneModel.gateconditionUtil.monsterUseSkillLimit.length > 0) {
                this.sceneModel.gateconditionUtil.monsterUseSkillLimit.forEach(index => {
                    let data = this.sceneModel.gateconditionUtil.DataList[index];
                    if (data.cfg.data1 == this.model.config.id) {
                        data.start = true;
                    }
                })
            }
        }

        // 据点战类型
        if (this.sceneModel.stageConfig.copy_id == CopyType.FootHold) {
            let fhModel = ModelManager.get(FootHoldModel)
            if (fhModel.pointDetailInfo && fhModel.pointDetailInfo.bossId == this.model.config.id) {
                this.sceneModel.footholdBossHurt = fhModel.pointDetailInfo.bossHp
            }
        }

        // 公会boss类型  理论上boss不会出现被击杀的情况
        if (this.sceneModel.stageConfig.copy_id == CopyType.GuildBoss) {
            let gModel = ModelManager.get(GuildModel);
            if (gModel.gbBossId) {
                if (gModel.gbBossId == this.model.config.id) {
                    let bossCfg = ConfigManager.getItemById(MonsterCfg, gModel.gbBossId);
                    this.sceneModel.guildBossHurt = bossCfg.hp;
                }
            }
        }

        // 掉落物品
        if (this.sceneModel.enemyRewardData != null) {
            let id = this.model.config.id;
            let arr = this.sceneModel.enemyRewardData[id];
            if (this.sceneModel.isDemo && MathUtil.rate(0.25)) {
                // 演示战斗掉落效果
                let drop = this.model.config.drop;
                if (drop instanceof Array && drop.length > 0) {
                    let rewards: { [type: number]: number } = null;
                    drop.forEach(d => {
                        let num = MathUtil.rnd(0, d[1]);
                        if (num > 0) {
                            if (!rewards) {
                                rewards = {};
                            }
                            rewards[d[0]] = num;
                        }
                    });
                    arr = rewards ? [rewards] : null;
                }
            }
            if (arr && arr.length > 0) {
                let rewards = arr.shift();
                let waitNum = 0
                for (let e in rewards) {
                    let type = parseInt(e);
                    let num = rewards[type];
                    // 记录掉落奖励
                    if (!this.sceneModel.isDemo) {
                        let killEnemyDrop = this.sceneModel.killEnemyDrop;
                        if (killEnemyDrop[type]) {
                            killEnemyDrop[type] += num;
                        } else {
                            killEnemyDrop[type] = num;
                        }
                        this.sceneModel.killEnemyDrop = killEnemyDrop;
                    }
                    // 显示掉落效果
                    if (num > 0) {
                        for (let i = 0; i < num; i++) {
                            // 创建掉落物品
                            this.createDropReward(type, waitNum);
                        }
                    }
                }
            }
        }
        //皇家竞技场,优先击杀指定怪物获得胜利
        let isRoyal = this.sceneModel.stageConfig.copy_id == CopyType.NONE && (this.sceneModel.arenaSyncData.fightType == 'ROYAL' || this.sceneModel.arenaSyncData.fightType == 'ROYAL_TEST')
        if (isRoyal) {
            let rmodel = ModelManager.get(RoyalModel)
            if (rmodel.winElite[2]) {
                let enemyId = rmodel.winElite[2];
                if (this.model.config.id == enemyId) {
                    PveTool.gameOver(this.sceneModel, true);
                    return;
                }
            }
            if (rmodel.winElite[6]) {
                let enemyId = rmodel.winElite[6][0];
                let num = rmodel.winElite[6][1];
                if (this.model.config.id == enemyId) {
                    let dic = this.sceneModel.killedEnemyDic;
                    let killNum = dic[this.model.config.id]
                    if (killNum >= num) {
                        PveTool.gameOver(this.sceneModel, true);
                        return;
                    }
                }
            }
        }
        // 符文副本
        if (this.sceneModel.stageConfig.copy_id == CopyType.Rune) {
            let have = false;
            for (let i = 0; i < this.sceneModel.RuneMonsters.length; i++) {
                let data = this.sceneModel.RuneMonsters[i];
                if (data.monsterId == this.model.config.id) {
                    have = true;
                    data.monsterNum += 1;
                }
            }
            if (!have) {
                let data = new icmsg.Monster()
                data.monsterId = this.model.config.id;
                data.monsterNum = 1;
                this.sceneModel.RuneMonsters.push(data);
            }
            if (this.model.config.monster_drop != '') {
                let drop = this.model.config.monster_drop
                for (let i = 0; i < drop.length; i++) {
                    let num = drop[i][1];
                    let key = drop[i][0];
                    for (let j = 0; j < num; j++) {
                        let dropCfg = ConfigManager.getItemByField(Item_dropCfg, 'drop_id', key);
                        for (let k = 0; k < dropCfg.drop_num; k++) {
                            if (MathUtil.rate(dropCfg.probability / 10000)) {
                                // 创建掉落物品
                                this.createDropReward(Number(dropCfg.item_id), 0);
                            }
                        }
                    }
                }
            }
        }

        // 英雄试炼副本
        let copy_id = this.sceneModel.stageConfig.copy_id
        if (copy_id == CopyType.HeroTrial || copy_id == CopyType.NewHeroTrial) {
            if ((!this.model.owner_id || this.model.owner_id <= 0) && this.model.config.type != 4) {
                this.sceneModel.allEnemyHurtNum += this.model.config.hp;
            }
        }

        // 对战副本，从出生点1刷新的怪物
        if (this.model.roadIndex == 1 && this.sceneModel.stageConfig.copy_id == CopyType.NONE && !isRoyal) {
            if (this.model.isBoss) {
                // 如果BOSS死亡，则更新下一个BOSS刷新倒计时
                let shared = this.sceneModel.arenaSyncData;
                if (shared.bossTimeOut === undefined && this.model.id == shared.bossEnemyId) {
                    // 一方首先杀死了BOSS
                    shared.bossId++;
                    shared.bossEnemyId = undefined;
                    shared.waveTimeOut = 15;
                    // 取出配置，并获得刷新间隔时间
                    let cfg = ConfigManager.getItemById(Pve_bossbornCfg, shared.bossId);
                    if (cfg) {
                        shared.bossTimeOut = cfg.interval;
                    }
                } else if (shared.waveTimeOut !== undefined) {
                    // 双方BOSS被击杀，马上刷下一波怪
                    shared.waveTimeOut = 1;
                }
            } else if (this.model.owner_id == -1) {
                // 非BOSS非召唤物死亡, 光球特效
                let mc = this.sceneModel.arenaSyncData.mainModel.ctrl;
                let isMirror = this.sceneModel.isMirror;
                let p = PveTool.getCenterPos(this.ctrl.getPos(), this.ctrl.getRect());
                p = mc.thing.convertToWorldSpaceAR(p);
                p = mc.dropIconNode.convertToNodeSpaceAR(p);
                let from = p;
                let to = cc.v2(p.x + MathUtil.rnd(20, 50), p.y + MathUtil.rnd(20, 50));
                // 终点
                let lnode = cc.find(`Pvp/ui/fightInfo/${isMirror ? 'down' : 'up'}/list`, mc.node);
                let end = cc.v2(lnode.x + (lnode.width + 25) * (isMirror ? -1 : 1), lnode.y);
                end = lnode.parent.convertToWorldSpaceAR(end);
                end = mc.dropIconNode.convertToNodeSpaceAR(end);
                // 实例
                let n = PvePool.get(c.energyItem) as cc.Node;
                n.setScale(this.sceneModel.scale);
                n.setPosition(p);
                n.parent = mc.dropIconNode;
                let dis = MathUtil.distance(from, to);
                let width = to.x - from.x;
                let param1 = 4.0
                let param2 = 1.0
                let pts: cc.Vec2[] = [
                    cc.v2(
                        width * (1 - param1 / 10),
                        dis * (1 - param1 / 10),
                    ),
                    cc.v2(
                        width * (1 - param2 / 10),
                        dis * (1 - param2 / 10),
                    ),
                    cc.v2(width, to.y - from.y),
                ];
                let speed = Math.max(1, this.sceneModel.timeScale);
                let event = `${PveEventId.PVE_APPEND_OPPSITE_ENEMIES}#${isMirror ? 'main' : 'mirror'}`;
                let enemyId = this.model.id;
                let action: cc.Action = cc.speed(
                    cc.sequence(
                        cc.bezierBy(0.5, pts),
                        cc.moveTo(0.8, end),
                        cc.callFunc(() => {
                            PvePool.put(n);
                            // 刷追加到对手刷怪列表
                            gdk.e.emit(event, [enemyId]);
                        }),
                    ),
                    speed,
                )
                n.runAction(action);
                // 预加载怪物图标资源
                gdk.rm.loadRes(this.sceneModel.ctrl.resId, 'icon/monster/' + this.model.config.icon + '_s', cc.SpriteFrame);
            }
        }

        // 获得能量，播放能量球移动效果
        let energy = this.model.getProp('energy');
        this.sceneModel.addEnergy(energy);
        if (energy > 0 && c.energyItem && c.energyAnim && showDieEffect && this.sceneModel.eliteStageUtil.general) {
            let p = PveTool.getCenterPos(this.ctrl.getPos(), this.ctrl.getRect());
            p = this.node.parent.convertToWorldSpaceAR(p);
            p = c.dropIconNode.convertToNodeSpaceAR(p);
            let from = p;
            let to = cc.v2(p.x + MathUtil.rnd(20, 50), p.y + MathUtil.rnd(20, 50));
            let max = this.sceneModel.config.energy_limit;
            let pro = this.sceneModel.energy / max;
            let temEnd = cc.v2(-220 + pro * 300, -60);
            let end = c.energyAnim.node.parent.convertToWorldSpaceAR(temEnd);
            end = c.dropIconNode.convertToNodeSpaceAR(end);
            if (!cc.isValid(c.node)) return;
            if (!c.enabled) return;
            let n: cc.Node = PvePool.get(c.energyItem);
            n.setPosition(p);
            n.parent = c.dropIconNode;
            let dis: number = MathUtil.distance(from, to);
            let dt: number = Math.min(0.5, dis / 1000);
            let width = to.x - from.x;
            let param1 = 4.0
            let param2 = 1.0
            let pts: cc.Vec2[] = [
                cc.v2(
                    width * (1 - param1 / 10),
                    dis * (1 - param1 / 10),
                ),
                cc.v2(
                    width * (1 - param2 / 10),
                    dis * (1 - param2 / 10),
                ),
                cc.v2(width, to.y - from.y),
            ];
            let speed = Math.max(1, this.sceneModel.timeScale)
            let action: cc.Action = cc.speed(
                cc.sequence(
                    cc.bezierBy(0.5, pts),
                    cc.moveTo(0.8, end),
                    cc.callFunc(() => {
                        c.energyAnim.node.setPosition(temEnd);
                        c.energyAnim.play();
                        PvePool.put(n);
                    })
                ),
                speed
            )
            n.runAction(action);
        }

        // BOSS播放死亡动作
        if (this.model.isBoss || this.model.getProp('playDieAnim')) {
            this.temProp = this.model.prop
            this.ctrl.buff && this.ctrl.buff.clearAll();
            this.ctrl.halo && this.ctrl.halo.clearAll();
            this.model.speedScale = 1.0;
            let spine = this.ctrl.spines[0]
            if (spine && !PveTool.hasSpineAnimation(spine, this.ctrl.getAnimation(PveFightAnmNames.DIE))) {
                this.finish()
            } else {
                this.ctrl.setAnimation(PveFightAnmNames.DIE, {
                    mode: 'set',
                    onComplete: this.finish,
                    thisArg: this,
                    loop: false,
                });
            }
        } else {
            // 完成动作
            this.finish();
        }


        //指定怪物在指定英雄范围内死亡
        let sceneModel = this.sceneModel
        if (sceneModel && sceneModel.gateconditionUtil && sceneModel.gateconditionUtil.heroKillMonsterLimit.length > 0) {
            sceneModel.gateconditionUtil.heroKillMonsterLimit.forEach(index => {
                let data = sceneModel.gateconditionUtil.DataList[index]
                for (let i = 0; i < sceneModel.heros.length; i++) {
                    if (sceneModel.heros[i].model.config.id == data.cfg.data1 && this.model.config.id == data.cfg.data2 && data.cfg.data3 == 2 && MathUtil.distance(sceneModel.heros[i].getPos(), this.ctrl.getPos()) <= sceneModel.heros[i].model.range) {
                        data.state = true;
                        data.curData = 1;
                    }
                }
            })
        }




    }

    //创建死亡特效
    createDieSpine() {
        if (!this.sceneModel.isDemo) return;
        let pos = this.ctrl.getPos();
        let c = this.sceneModel.ctrl;
        //let p = PveTool.getCenterPos(pos, this.ctrl.getRect());
        //!this.model.isBoss && PveTool.createSpine(
        PveTool.createSpine(
            c.spineNodePrefab,
            c.floor,
            'spine/common/E_die01/E_die01',
            null,
            false,
            Math.max(1, c.model.timeScale),
            (spine: sp.Skeleton, resId: string, res: sp.SkeletonData) => {
                if (!cc.isValid(spine.node)) return;
                // 清理并回收spine节点
                PveTool.clearSpine(spine);
                PvePool.put(spine.node);
            },
            () => {
                if (!c.enabled) return false;
                return true;
            },
            cc.v2(pos.x, pos.y),
            true,
            true,
        );
    }

    // 创建掉落宝箱
    createDropReward(type: number, waitNum: number) {
        let c = this.sceneModel.ctrl;
        if (!c.dropIconNode) return;
        let path = null;
        let path1 = null;
        let scaleNum = 1;
        switch (type) {
            case 1:
                path = 'icon/item/main_itemmoney03';
                scaleNum = 0.5;
                break;
            case 2:
                path = 'common/texture/1006';
                break;
            case 3:
                path = 'common/texture/1007';
                break;
            case 4:
                path = 'icon/item/main_itemmoney10';
                break;
            case 5:
                path = 'icon/item/main_itemmoney15';
                break;
        }
        if (type > 5) {
            let itemCfg = BagUtils.getConfigById(type);
            path = 'icon/item/' + itemCfg.icon;
            path1 = 'common/texture/sub_itembg0' + itemCfg.defaultColor;
            scaleNum = 0.5;
        }
        if (!path) return;

        let p = PveTool.getCenterPos(this.ctrl.getPos(), this.ctrl.getRect());
        p = this.node.parent.convertToWorldSpaceAR(p);
        p = c.dropIconNode.convertToNodeSpaceAR(p);

        let from = p;
        let temX = MathUtil.rnd(0, 1) == 0 ? -1 : 1;
        let to = cc.v2(p.x + MathUtil.rnd(40, 100) * temX, p.y + MathUtil.rnd(-20, 0));

        let temEnd: cc.Vec2;
        if (this.sceneModel.isDemo) {
            let n = cc.find('UI/downGroup/hangInfo', c.node);
            temEnd = n.getPos();
            temEnd = n.parent.convertToWorldSpaceAR(temEnd);
        } else {
            let temY = Math.floor(cc.winSize.height - 50);
            let endList: cc.Vec2[] = [cc.v2(460, temY), cc.v2(530, temY), cc.v2(600, temY)];
            temEnd = type <= 3 ? endList[type - 1] : endList[2];
            temEnd = c.thing.convertToWorldSpaceAR(temEnd);
        }
        temEnd = c.dropIconNode.convertToNodeSpaceAR(temEnd);
        let end = temEnd;

        if (!cc.isValid(c.node)) return;
        if (!c.enabled) return;
        let n: cc.Node = PvePool.get(c.enemyDropReward);
        let icon = n.getChildByName('icon')
        let quality = n.getChildByName('quality');

        n.setPosition(p);
        n.parent = c.dropIconNode;
        n.scale = scaleNum;
        GlobalUtil.setSpriteIcon(this.node, icon, path);
        if (path1) {
            quality.active = true;
            GlobalUtil.setSpriteIcon(this.node, quality, path1);
        } else {
            quality.active = false;
        }
        let dis: number = MathUtil.distance(from, to);
        let width = to.x - from.x;
        let param1 = 4.0
        let param2 = 1.0
        let pts: cc.Vec2[] = [
            cc.v2(
                width * (1 - param1 / 10),
                dis * (1 - param1 / 10),
            ),
            cc.v2(
                width * (1 - param2 / 10),
                dis * (1 - param2 / 10),
            ),
            cc.v2(width, to.y - from.y),
        ];
        let speed = Math.max(1, this.sceneModel.timeScale)
        let action: cc.Action = cc.speed(
            cc.sequence(
                cc.bezierBy(0.5, pts),
                cc.delayTime(0.4),
                cc.spawn(
                    cc.moveTo(0.5, end),
                    cc.scaleTo(scaleNum, 0.3),
                ),
                cc.callFunc(() => {
                    GlobalUtil.setSpriteIcon(this.node, icon, null);
                    PvePool.put(n);
                }),
            ),
            speed,
        )
        n.runAction(action);
    }

    finish() {
        if (this.model && this.model.isBoss) {
            // 播放死亡特效
            //this.createDieSpine();
            // 检测事件
            let onDieAnim = this.temProp.onDieAnim;
            if (onDieAnim != null && typeof onDieAnim === 'object') {
                let scope: PveBSScopeType = {
                    t: this.model.prop,
                    a: this.model.prop,
                    am: this.model,
                    tm: this.model,
                    m: this.model,   // 兼容旧的配置
                };
                PveTool.evalBuffEvent(
                    onDieAnim,
                    this.model.fightId,
                    this.model.prop,
                    this.model.ctrl,
                    this.ctrl,
                    scope,
                );
            }
        }
        super.finish();
    }

}