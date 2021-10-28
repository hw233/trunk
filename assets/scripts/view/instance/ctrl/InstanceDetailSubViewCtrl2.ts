import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import DetailViewHeroSlotCtrl from './DetailViewHeroSlotCtrl';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import InstanceHurtEffect, { InstanceHurtType } from '../ctrl/InstanceHurtEffect';
import InstanceModel, { InstanceMercenaryData } from '../model/InstanceModel';
import InstanceViewCtrl from './InstanceViewCtrl';
import JumpUtils from '../../../common/utils/JumpUtils';
import MathUtil from '../../../common/utils/MathUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import PveGeneralModel from '../../pve/model/PveGeneralModel';
import PvePool from '../../pve/utils/PvePool';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import ServerModel from '../../../common/models/ServerModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../common/models/BagModel';
import { GetHerosFight, IsLastBossDead } from '../utils/InstanceUtil';
import {
    HeroCfg,
    Justice_bossCfg,
    Justice_frameCfg,
    Justice_generalCfg,
    Justice_mercenaryCfg,
    TipsCfg
    } from './../../../a/config';
import { InstanceEventId, InstanceID } from '../enum/InstanceEnumDef';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/**
 * @Description: 英雄副本的详细界面控制器
 * @Author: jijing.liu
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:36:04
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/InstanceDetailSubViewCtrl2")
export default class InstanceDetailSubViewCtrl2 extends gdk.BasePanel {


    @property(cc.Node)
    dropArea: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property([cc.Node])
    heroSlots: cc.Node[] = [];

    @property(cc.Node)
    atkBtn: cc.Node = null;

    @property(cc.Node)
    hpFG: cc.Node = null;

    @property(cc.Node)
    bossNode: cc.Node = null;
    @property(cc.Node)
    bossBgNode: cc.Node = null;

    @property(cc.Node)
    generalNode: cc.Node = null;

    @property(cc.Node)
    bloodBar: cc.Node = null;
    @property(cc.Node)
    hpBg: cc.Node = null;
    @property(cc.Label)
    bloodLabel: cc.Label = null;
    @property(cc.Node)
    completeNode: cc.Node = null;

    //添加boss血条
    @property(cc.Node)
    bossBloodBar: cc.Node = null;
    @property(cc.Node)
    bossHpBg: cc.Node = null;
    @property(cc.Sprite)
    bossHpBgSp: cc.Sprite = null;
    @property(cc.Label)
    bossBloodLabel: cc.Label = null;
    @property(cc.Label)
    bossFloorLb: cc.Label = null;
    @property(cc.Node)
    bossHpFG: cc.Node = null;
    @property(cc.Sprite)
    bossHpFGSp: cc.Sprite = null;
    @property(cc.Sprite)
    bossBloodBg: cc.Sprite = null;
    @property(cc.Label)
    bossNewName: cc.Label = null;
    @property(cc.Node)
    bossTimeShow: cc.Node = null;
    @property(cc.Node)
    bossBoxBtn: cc.Node = null;


    @property(cc.Label)
    bossName: cc.Label = null;
    @property(cc.Node)
    hurtNode: cc.Node = null;
    @property(cc.Prefab)
    hurtEffectPrefab: cc.Prefab = null;
    @property(cc.Node)
    attack: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null
    @property(cc.Prefab)
    rewardPrefab: cc.Prefab = null;
    @property(cc.Label)
    showTitle: cc.Label = null;

    // @property([cc.Animation])
    // atk_hits: cc.Animation[] = []

    @property(cc.Node)
    heroRed: cc.Node = null;

    @property(cc.Node)
    setupNode: cc.Node = null;

    @property(cc.Node)
    oneKillNode: cc.Node = null;

    // @property(cc.Node)
    // killBossTimeBg: cc.Node = null;
    // @property(cc.Node)
    // killBossBg: cc.Node = null;
    // @property(cc.Node)
    // NoKillBg: cc.Node = null;
    @property(cc.Node)
    boxBtn: cc.Node = null;

    //----------------------------新版参数-------------------------------
    @property([cc.Node])
    bossHeadIconNodes: cc.Node[] = [];
    @property([cc.Label])
    bossHeadIconNums: cc.Label[] = [];
    @property([cc.Sprite])
    bossHeadIcons: cc.Sprite[] = [];
    @property(cc.Label)
    jifenLabel: cc.Label = null;
    @property(cc.Label)
    bossTimeLabel: cc.Label = null;
    @property(cc.Node)
    attackMoveNode: cc.Node = null;
    @property(cc.Prefab)
    movePre: cc.Prefab = null;
    @property(cc.Prefab)
    boxPre: cc.Prefab = null;
    @property(cc.Prefab)
    scoreMovePre: cc.Prefab = null;
    @property(cc.Prefab)
    frameUpEffectPre: cc.Prefab = null;
    @property(cc.Node)
    scoreMoveEndPos: cc.Node = null;
    @property(cc.Prefab)
    fightUpTip: cc.Prefab = null;
    //----------------------------新版(2)参数-------------------------------
    @property(cc.Label)
    recommendFight: cc.Label = null;
    @property(cc.Label)
    CurDpsFight: cc.Label = null;
    @property(cc.Node)
    refreshBoss: cc.Node = null;
    @property(cc.Prefab)
    mercenaryItem: cc.Prefab = null;
    @property(cc.Node)
    mercenaryContent: cc.Node = null
    @property(cc.ScrollView)
    mercenaryScrollView: cc.ScrollView = null
    @property(sp.Skeleton)
    bossDieEffect: sp.Skeleton = null;
    @property(cc.Sprite)
    sceneBg: cc.Sprite = null;
    @property(cc.Node)
    onekeyUpBtn: cc.Node = null;
    @property(cc.Node)
    bossTipsNode: cc.Node = null;
    @property(cc.RichText)
    bossTipLb: cc.RichText = null;

    @property(sp.Skeleton)
    oneKillEffect1: sp.Skeleton = null;
    @property(sp.Skeleton)
    oneKillEffect2: sp.Skeleton = null;

    @property(cc.Node)
    bossHeadNode: cc.Node = null;

    @property(cc.Label)
    playTips: cc.Label = null;

    mercenaryList: ListView;
    heroSlotsCtrlList: DetailViewHeroSlotCtrl[] = [];
    oldDps: number = 0;
    sceneBgStr: string = "";

    list: ListView;
    oriWidth: number;
    dungeonBoss: icmsg.JusticeBoss = null;//当前显示的数据
    dungeonData: icmsg.JusticeStateRsp = null;
    //slotCfg: number[] = [];
    isCreatComplite: boolean = false;

    bossRect: cc.Rect = null;
    lastBossCfg: Justice_bossCfg = null;

    bossSpine: sp.Skeleton = null;
    generalSpine: sp.Skeleton = null;
    bossPos: cc.Vec2 = null;
    //openReward: boolean = false;
    curAtkAnim: cc.Animation = null;
    bossDie: boolean = false;
    firstReq: boolean = true;
    tween: cc.Tween;
    get model(): InstanceModel { return ModelManager.get(InstanceModel); }

    bossDropCredit: number = 0;

    //气泡显示计时
    qipaoStartTime: number = 0;
    qipaoRefreshTime: number = 0;
    curQipaoTime: number = 0;
    qipaoWaitTime: number = 0;
    qipaoTipsStr: string[] = [];
    isShowBossTips: boolean = false;
    bossTiptween: cc.Tween;

    //Boss血条参数
    BossBloodWidth = 450;
    bossBloodFgStr: string[] = ['fb_chunbaise', 'fb_lvsexuetiao', 'fb_lansexuetiao', 'fb_zisexuetiao', 'fb_huangsexuetiao']
    curBloodFloor: number = 99;
    floorBloodNum: number;

    //快速击杀
    saveBossId: number = -1;
    onOnekillState: boolean = false;
    //一键按钮点击状态
    onOneKeyUpState: boolean = false;
    changeHero: boolean = false;

    //----------------------------新版参数-------------------------------
    //是否显示boss倒计时
    showBossTime: boolean = false;
    //boss倒计时时间
    bossTimeNum: number = 0;
    //当前积分
    curScore: number = 0;
    //指挥官下一等级需要的积分
    lastGeneralLvScore: number = 0;
    //下次计算伤害剩余时间
    curGeneralTime: number = 0;
    //挂机的攻击频率时长
    intervalTime: number = 1;
    //同步服务器状态时长
    syncServerlTime: number = 5;
    //挂机刷新血条的时间
    refreshBloodTime: number = 0.2;
    //boss掉落的可升级槽位边框的宝箱
    boxNodes: cc.Node[] = [];
    //英雄攻击弹道终点
    moveEndPos: cc.Vec2 = cc.v2(0, 10);
    //指挥官升级标记
    generalUp: boolean = false;
    //每0.5秒掉血的伤害
    curHutrNum: number = 0;
    //刷新血条剩余的时间
    curHurtTime: number = 0;
    //当前指挥官可以升级的最大等级
    generalMaxLv: number = 0;
    //指挥官等级下个阶段的击杀bossid
    nextgeneralcanUpLv: number = -1;

    //boss复活刷新标记
    isRecoverRefresh: boolean = false;
    //标记是否有上阵英雄
    isUpHero = false;
    //边框升级的最大等级
    frameMaxLv: number = 0;
    //是否杀死所有boss
    isKillAllBoss: boolean = false;
    //当前是否是最后一个boss
    isLastBoss: boolean = false;
    curBossHp: number = 0;
    //客户端判断boss死亡了
    clientDie: boolean = false;

    //玩家点击的频率时长
    intervalPlayClickTime: number = 0.3;
    //记录玩家点击的时长
    curPlayClickTime = 0;

    generalAutoAttackMaxLv: number = 100;

    //指挥官是否可以自动攻击
    generalCanAuto: boolean = false;
    //指挥官的攻击频率
    generalAutointervalTime: number = 1;
    //记录指挥官的攻击间隔时间
    generalAutoTime: number = 0
    //当前指挥官的战力
    curGeneralFight: number = 0;

    //首次进入游戏检测是否能挂机击杀boss
    firstCheck: boolean = true;


    onLoad() {


        gdk.e.on(InstanceEventId.RSP_BOSS_JUSTICE_STATE, this._onBossJusticeStateRsp, this);
        gdk.e.on(InstanceEventId.RSP_BOSS_PLAYER_CLICK, this._onBossPlayerClickRsp, this);
        gdk.e.on(InstanceEventId.RSP_BOSS_JUSTICE_SUMMON, this._onBossSummonRsq, this);
        gdk.e.on(InstanceEventId.RSP_BOSS_JUSTICE_RESETBOSS, this._onResetBoss, this);

        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -1920)
        this.boxBtn.on(cc.Node.EventType.TOUCH_START, () => {
            this.content.parent.active = true;
        }, this)
        this.boxBtn.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.content.parent.active = false;
        }, this)
        this.boxBtn.on(cc.Node.EventType.TOUCH_END, () => {
            this.content.parent.active = false;
        }, this)
        this.bossBoxBtn.on(cc.Node.EventType.TOUCH_START, () => {
            this.content.parent.active = true;
        }, this)
        this.bossBoxBtn.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.content.parent.active = false;
        }, this)
        this.bossBoxBtn.on(cc.Node.EventType.TOUCH_END, () => {
            this.content.parent.active = false;
        }, this)

    }

    //boss状态返回
    _onBossJusticeStateRsp(e: gdk.Event) {
        let info: icmsg.JusticeStateRsp = e.data.bossInfo;
        let curGeneralLevel = info.general.level > 0 ? info.general.level : 1
        //判断当前boss死亡
        if (this.dungeonData && this.dungeonData.boss.id != info.boss.id) {

            //隐藏气泡
            this.bossTiptween && this.bossTiptween.stop()
            this.bossTipsNode.active = false;

            //boss死亡，播放死亡动作
            this.updateBossHp()
            //播放积分掉落动作
            //this.bossScoreFly(this.lastBossCfg.show)
            let showNum = 5;
            if (this.lastBossCfg) {
                this.lastBossCfg.show.forEach(a => {
                    if (a[0] == 11) {
                        showNum = a[1];
                    }
                })
            }
            this.bossScoreFly(showNum)

            this.bossDie = true;
            this.model.dunGeonBossJusticeState = info
            this.dungeonData = this.model.dunGeonBossJusticeState;
            this.bossNode.opacity = 0;
            this.bossDieEffect.node.active = true;
            let t = this.bossDieEffect.setAnimation(0, "stand", false)
            if (t) {
                this.bossDieEffect.setCompleteListener((trackEntry, loopCount) => {
                    let name = trackEntry.animation ? trackEntry.animation.name : '';
                    if (name === "stand") {
                        this.bossDieEffect.node.active = false;
                        this.setUp();
                    }
                })
            } else {
                //this.bossSpine.node.opacity = 0;
                this.bossDieEffect.node.active = false;
                this.setUp();
            }


        } else {
            this.bossDie = false;
            this.model.dunGeonBossJusticeState = info
            this.dungeonData = this.model.dunGeonBossJusticeState;
            this.setUp();
        }
        this.clientDie = false;

        //let lastBoss = info.boss.id;
        this.isKillAllBoss = this.isEnd();
        if (this.isKillAllBoss) {
            this.hideBoss();
            this.completeNode.active = true;
            this.bossTimeLabel.node.parent.active = false;
            this.attackMoveNode.removeAllChildren();
            this.hurtNode.removeAllChildren();
        }
        //刷新积分和升级按钮
        this.curScore = info.score;
        this.jifenLabel.string = GlobalUtil.numberToStr2(this.curScore, true);//info.score + '';

        let lastGeneralCfg = ConfigManager.getItemById(Justice_generalCfg, curGeneralLevel + 1);
        if (lastGeneralCfg) {
            this.lastGeneralLvScore = lastGeneralCfg.exp;
            //this.generalUpJifenLabel.string = '' + lastGeneralCfg.exp;
        } else {
            this.lastGeneralLvScore = 0;
        }
        //刷新雇佣兵
        this.refreshMercenaryListData()
        let generalDps = this.dungeonData.generalDps;
        //当前战力
        let curDps = generalDps * 4 + this.dungeonData.slotDps
        //弹出战力提升飘字
        if (this.oldDps > 0 && this.oldDps < curDps) {
            this.showFightUpTip(curDps - this.oldDps)
        }
        this.oldDps = curDps;
        this.CurDpsFight.string = GlobalUtil.numberToStr2(curDps, true)
        this.CurDpsFight.node.color = cc.color('#F8ED9D');
        if (this.lastBossCfg) {
            if (curDps < this.lastBossCfg.recommended) {
                this.CurDpsFight.node.color = cc.color('#FF0000');
            }
        }

        //刷新下次伤害时间
        //this.curGeneralTime = 0;
        this.curHurtTime = this.refreshBloodTime;
        this.curHutrNum = this.getCurHurtNum();


        //刷新指挥官等级
        this.generalUp = false;
        //复活刷新纪录
        this.isRecoverRefresh = false;

        //显示(隐藏)一键升级按钮
        this.onekeyUpBtn.active = this.dungeonData.boss.id > 1;
        //设置一键升级按钮的状态
        let state: 0 | 1 = this.getMercenaryAndGeneralUpState() ? 0 : 1;
        GlobalUtil.setGrayState(this.onekeyUpBtn, state);

        //快速击杀、一键上阵按钮显隐
        let canKill = false;
        if (this.saveBossId < 0) {
            let cfgs = ConfigManager.getItems(Justice_bossCfg, (item: Justice_bossCfg) => {
                if (item.id <= this.dungeonData.maxKillId && cc.js.isNumber(item.save) && item.save == 1) {
                    return true;
                }
                return false;
            })
            if (cfgs.length > 0) {
                this.saveBossId = cfgs[cfgs.length - 1].id;
            } else {
                this.saveBossId = 0;
            }
        }
        if (this.dungeonData.boss.id < this.saveBossId && this.dungeonData.boss.id > 0) {
            canKill = true;
        }
        this.oneKillNode.active = canKill;
        this.setupNode.active = !canKill;

        //刷新掉落物品
        if (this.firstReq) {
            this.firstReq = false;
            if (info.rewards.length > 0) {
                GlobalUtil.openRewadrView(info.rewards);
            }
            return;
        }
        //显示掉落效果
        this.showDropItem(info.rewards, true);
    }

    //手动点击boss返回
    _onBossPlayerClickRsp(e: gdk.Event) {
        let clickData: icmsg.JusticeClickRsp = e.data.clickData;
        let type = clickData.isCrit ? InstanceHurtType.CARE : InstanceHurtType.NORMAL;
        this.curBossHp -= clickData.damage;
        this.curBossHp = Math.max(0, this.curBossHp);
        this.updateBossHp();
        if (this.curBossHp == 0) {
            //boss死亡了
            this.clientDie = true;
            NetManager.send(new icmsg.JusticeStateReq());
        } else {
            this._playHitAnimation();
        }
        //飘字
        this.showHurt(clickData.damage, type);
        //显示掉落物品
        if (clickData.rewards.length > 0) {
            this.showDropItem(clickData.rewards)
        }
        //暴击时boss震动
        if (type == InstanceHurtType.CARE) {
            this.bossShake();
        }
    }

    //显示战力提升tip
    showFightUpTip(fight: number) {
        let fightNode: cc.Node = gdk.pool.get('Instace_Detail2_fightUp')
        if (!fightNode) {
            fightNode = cc.instantiate(this.fightUpTip);
        }
        let fightLb = fightNode.getChildByName('fight').getComponent(cc.Label);
        fightLb.string = '+' + GlobalUtil.numberToStr2(Math.floor(fight), true)
        let pos1 = this.CurDpsFight.node.convertToWorldSpaceAR(cc.v2(25, 50));
        let pos = this.attackMoveNode.convertToNodeSpaceAR(pos1)
        fightNode.setPosition(pos);
        fightNode.parent = this.attackMoveNode;
        let action = cc.speed(
            cc.sequence(
                cc.fadeIn(0),
                cc.delayTime(0.5),
                cc.spawn(
                    cc.moveBy(0.3, 0, 100),
                    cc.fadeOut(0.3)
                ),
                cc.callFunc(() => {
                    fightNode.stopAllActions();
                    gdk.pool.put('Instace_Detail2_fightUp', fightNode)
                }),
            ),
            1,
        )
        fightNode.runAction(action);
    }
    //设置Boss伤害
    _setBossHurt(hurt: number) {

        if (this.clientDie) {
            return;
        }
        this.curBossHp -= hurt;
        this.curBossHp = Math.max(0, this.curBossHp);
        this.updateBossHp();
        if (this.curBossHp == 0) {
            this.clientDie = true;
            NetManager.send(new icmsg.JusticeStateReq());
        }

        // if (!this.isUpHero) {
        //     this.showHurt(hurt, InstanceHurtType.NORMAL);
        // }
    }

    //召唤boss回调
    _onBossSummonRsq(e: gdk.Event) {
        //let bossData: JusticeSummonRsp = e.data.bossData;
        //this.model.dungeonBoss = info;
        this.dungeonBoss = e.data.bossData.boss;
        this.curBossHp = e.data.bossData.boss.hp;
        this.dungeonData.general.level = 1;
        this.dungeonData.boss = e.data.bossData.boss;
        this.curGeneralTime = this.syncServerlTime;
        this.clientDie = false;
        this.curHutrNum = this.getCurHurtNum();
        //设置boss模型 血量
        this.updateBossSpine();
        this.updateBossInfo();
        this.refreshBossHeadIcon();
        //召唤完boss后请求一下state数据
        NetManager.send(new icmsg.JusticeStateReq());
    }

    //重置boss血量
    _onResetBoss(e: gdk.Event) {
        //this.dungeonBoss
        this.dungeonData.boss = e.data.resetData.boss;
        this.dungeonBoss = e.data.resetData.boss;
        this.dungeonData.atkTime = e.data.resetData.atkTime;
        this.curBossHp = this.dungeonBoss.hp;
        this.updateBossInfo();
    }

    //英雄攻击boss
    _heroAttackHurt(index: number, hurt: number, ballistic: string, type: number, level: number, show: boolean, sound: string, emission: string) {

        //boss死亡时不显示弹道
        if (this.bossDie || this.clientDie || this.isKillAllBoss || this.onOnekillState) {
            return;
        }

        if (show) {

            // node.stopAllActions();
            // this.attackMoveNode.addChild(node);
            let pos1 = this.heroSlots[index].convertToWorldSpaceAR(cc.v2(0, 0))
            let ctrl = this.heroSlotsCtrlList[index];
            //ctrl.frameBg.angle

            let temPos = this.attackMoveNode.convertToNodeSpaceAR(pos1)
            let addX = 0
            // if (index % 2 == 0) {
            //     addX = 80
            // }
            let start = cc.v2(temPos.x + addX, temPos.y);
            //this.moveStartPos[index]
            let to = cc.v2(this.moveEndPos.x, this.moveEndPos.y + MathUtil.rnd(0, 100))
            // gdk.NodeTool.show(node, false);
            //设置弹道朝向
            let angle = Math.atan2(start.y - to.y, start.x - to.x);
            let degree = angle * 180 / Math.PI;
            let temAngle = -(degree <= 0 ? -degree : 360 - degree);
            //node.angle = temAngle;
            let tween = new cc.Tween();

            let temframeAngle = temAngle + 180;
            if (temframeAngle > 90) {
                temframeAngle = temframeAngle - 360
            }
            let temV = cc.v2(to.x - start.x, to.y - start.y).normalizeSelf().mulSelf(80);
            let from = cc.v2(start.x + temV.x, start.y + temV.y);
            tween.target(ctrl.frameBg)
                .to(0.1, { angle: temframeAngle })
                .call(() => {
                    ctrl.emissionSpine.setAnimation(0, emission, false)
                    this.createHurtSpine(index, hurt, ballistic, type, level, sound, from, to, temAngle)
                })
                .start()
        } else {
            this.showHurt(hurt, InstanceHurtType.NORMAL);
        }

    }

    createHurtSpine(index: number, hurt: number, ballistic: string, type: number, level: number, sound: string, from: cc.Vec2, to: cc.Vec2, angle: number) {

        //英雄攻击音效
        GlobalUtil.isSoundOn &&
            gdk.sound.play(
                gdk.Tool.getResIdByNode(this.node),
                sound,
            );
        //设置英雄攻击弹道
        let node = gdk.pool.get('Instace_Detail2_move1')
        if (!node) {
            node = cc.instantiate(this.movePre);
        }

        let spine: sp.Skeleton = node.getComponent(sp.Skeleton);
        spine.setAnimation(0, ballistic, true);
        node.angle = angle;
        //设置弹道动画
        let action: cc.Action;
        switch (type) {
            case 4:
            case 1:
                action = cc.speed(
                    cc.sequence(
                        cc.fadeIn(0),
                        cc.moveTo(0.5, to.x, to.y),
                        cc.callFunc(() => {
                            node.stopAllActions();
                            //PvePool.put(node);
                            gdk.pool.put('Instace_Detail2_move1', node)
                            //this._playHitAnimation();
                            this.showHurt(hurt, InstanceHurtType.NORMAL);
                            //PveTool.clearSpine(spine);
                        }),
                    ),
                    1,
                )
                break;
            case 3:
                let dis: number = MathUtil.distance(from, to);
                let temNum = -1;
                if (MathUtil.rate(0.5)) {
                    temNum = -temNum;
                }
                let temp = to.sub(from).normalize();
                let temp1 = cc.v2(temp.x, temp.y).rotate(Math.PI / 2);//temp.rotate(Math.PI / 2)
                let temp2 = cc.v2(from.x + (to.x - from.x) / 10, from.y + (to.y - from.y) / 10);
                let temp3 = temp2.add(temp1.mul(dis / 5 * temNum));
                //let temp4 =cc.v2(from.x + (to.x - from.x) / 2, from.y + (to.y - from.y) / 2);
                let pts: cc.Vec2[] = [
                    temp3,
                    temp3,
                    to,
                ];
                action = cc.speed(
                    cc.sequence(
                        cc.spawn(
                            cc.bezierTo(0.5, pts).easing(cc.easeIn(3.0)),
                            cc.callFunc(() => {
                                let temForm = node.getPos();
                                let angle = Math.atan2(temForm.y - to.y, temForm.x - to.x);
                                let degree = angle * 180 / Math.PI;
                                node.angle = -(degree <= 0 ? -degree : 360 - degree);
                            }),
                        ),
                        cc.callFunc(() => {
                            node.stopAllActions();
                            //PvePool.put(node);
                            gdk.pool.put('Instace_Detail2_move1', node)
                            //this._playHitAnimation();
                            this.showHurt(hurt, InstanceHurtType.NORMAL);
                            //PveTool.clearSpine(spine);
                        }),
                    ),
                    1,
                );
                break;

        }

        node.setPosition(from);
        node.parent = this.attackMoveNode;
        node.show();
        node.runAction(action);

    }

    //boss死亡掉落积分
    bossScoreFly(num: number) {
        let createNum = num
        let posX = 0
        let random1: number = -200
        let random2: number = 200
        let createTime: number = 0.1
        let speed: number = 1000
        //let endPos: cc.Vec2 = null;
        for (let i = 0; i < createNum; i++) {
            let item: cc.Node = gdk.pool.get('Instace_Detail2_scoreMove')
            if (!item) {
                item = cc.instantiate(this.scoreMovePre);
            }
            posX = 150
            if (item) {
                item.setPosition(cc.v2(0, 0));
                item.parent = this.attackMoveNode;
                let rannumx = Math.floor(Math.random() * (random2 - random1 + 1) + random1)
                let rannumy = Math.floor(Math.random() * (random2 - random1 + 1) / 1.5 + random1 / 1.5)
                item.runAction(cc.moveBy(createTime, rannumx, rannumy))
                let finshend = cc.callFunc(function () {
                    gdk.pool.put('Instace_Detail2_scoreMove', item)
                }, this);
                gdk.Timer.once(createTime * 1000, this, () => {
                    item.stopAllActions()
                    let pos = item.getPosition()
                    //let dsz = cc.view.getVisibleSize();
                    let pos1 = this.scoreMoveEndPos.convertToWorldSpaceAR(cc.v2(0, 0));
                    let endPos = this.attackMoveNode.convertToNodeSpaceAR(pos1)
                    //let endPos = this.scoreMoveEndPos.getPos();//cc.v2(posX, dsz.height / 2)
                    let playTime = pos.sub(endPos).mag() / speed
                    item.runAction(cc.sequence(cc.moveTo(playTime, endPos.x, endPos.y), finshend))
                });
            }
        }
    }

    //当日的boss是否已打完
    isEnd() {
        if (this.dungeonBoss == null) {
            return false;
        }
        return IsLastBossDead(this.dungeonBoss.id, this.curBossHp);
    }


    onDestroy() {
        this.boxBtn.targetOff(this);
        this.bossBoxBtn.targetOff(this);
        cc.director.getPhysicsManager().enabled = false;
        gdk.Timer.clearAll(this);
        gdk.e.targetOff(this);
        this.clearTimerAndDropItem();
        gdk.pool.clear('Instace_Detail2_move1');
        gdk.pool.clear('Instace_Detail2_scoreMove');
        gdk.pool.clear('Instace_Detail2_frameEffect');
        gdk.pool.clear('Instace_Detail2_fightUp');
        if (this.list != null) {
            this.list.destroy();
        }
        if (this.mercenaryList != null) {
            this.mercenaryList.destroy();
        }
        if (this.dungeonBoss && this.model) {
            this.model.instanceBossLastStage = this.dungeonBoss.id;
            this.model.dunGeonBossJusticeState.boss.hp = this.curBossHp;
        }
        this.bossTiptween = null;
        this.tween = null;
        //记录最后离开的时间
        let n = "hero_inst"
        GlobalUtil.setLocal(n, ModelManager.get(ServerModel).serverTime)

        this.mercenraylevelData = [];

    }

    update(dt: number): void {

        if (!this.dungeonData || !this.dungeonBoss || this.dungeonBoss.id == 0 || this.isKillAllBoss || this.onOnekillState) {
            return
        }

        if (this.curPlayClickTime > 0) {
            this.curPlayClickTime -= dt;
        }

        //每5秒同步一次
        if (this.curGeneralTime <= 0) {
            this.curGeneralTime += this.syncServerlTime;
            NetManager.send(new icmsg.JusticeStateReq());

        } else {
            this.curGeneralTime -= dt;
        }

        if (this.clientDie) {
            return;
        }


        //气泡显示计时
        if (this.qipaoRefreshTime > 0) {
            if (this.qipaoStartTime > 0) {
                this.qipaoStartTime -= dt;
                if (this.qipaoStartTime <= 0) {
                    //显示气泡
                    this.showBossTips();
                }
            } else {
                if (this.curQipaoTime > 0) {
                    if (!this.isShowBossTips) {
                        this.curQipaoTime -= dt;
                        if (this.curQipaoTime <= 0) {
                            this.curQipaoTime += this.qipaoRefreshTime;
                            //显示气泡
                            this.showBossTips();
                        }
                    }
                } else {
                    this.curQipaoTime += this.qipaoRefreshTime;
                }
            }
        }

        //计算伤害
        // if (this.bossDie) {
        //     return;
        // }
        //指挥官自动攻击动作
        if (this.generalCanAuto && !this.bossDie) {
            if (this.generalAutoTime <= 0) {
                this.generalAutoTime = this.generalAutointervalTime;
                this._playAttackAnimation();
                this.showHurt(this.curGeneralFight, InstanceHurtType.NORMAL);
            } else {
                this.generalAutoTime -= dt;
            }
        }

        if (this.curHurtTime <= 0) {
            this.curHurtTime += this.refreshBloodTime;
            this._setBossHurt(this.curHutrNum);
        } else {
            this.curHurtTime -= dt;
        }

        //显示限时boss的剩余击杀时间
        if (this.showBossTime) {

            if (this.bossTimeNum <= 0 && !this.isRecoverRefresh) {
                this.isRecoverRefresh = true;
                //刷新boss血量
                NetManager.send(new icmsg.JusticeStateReq());
            }
            this.bossTimeNum -= dt;
            this.bossTimeLabel.string = '' + Math.max(0, this.bossTimeNum).toFixed(1);//this._timeFormat(Math.max(0, this.bossTimeNum))
            if (this.lastBossCfg) {
                this.bossTimeShow.width = Math.floor(this.bossTimeNum / this.lastBossCfg.limit * this.BossBloodWidth)
            } else {
                this.bossTimeShow.width = 0;
            }

        }
    }

    //显示boss气泡
    showBossTips() {
        this.isShowBossTips = true;
        this.bossTipsNode.active = true;
        let index = MathUtil.rnd(0, this.qipaoTipsStr.length - 1)
        this.bossTipLb.string = this.qipaoTipsStr[index];
        this.bossTipsNode.opacity = 0;
        this.bossTiptween = new cc.Tween();
        this.bossTiptween.target(this.bossTipsNode)
            .to(0.2, { opacity: 255 })
            .delay(this.qipaoWaitTime)
            .call(() => {
                this.bossTiptween = null;
                this.bossTipsNode.active = false;
                this.isShowBossTips = false;
            })
            .start()
    }

    //获取当前挂机每次造成的伤害量
    getCurHurtNum(): number {
        let hurt = 0

        if (!this.dungeonData) {
            return hurt;
        }
        if (this.lastBossCfg && this.lastBossCfg.id > this.generalAutoAttackMaxLv) {
            let generalCfg = ConfigManager.getItemById(Justice_generalCfg, this.dungeonData.general.level);

            this.generalCanAuto = true;
            this.generalAutointervalTime = generalCfg ? generalCfg.interval : 1;
            this.curGeneralFight = this.dungeonData.generalDps;
            hurt = this.dungeonData.generalDps + this.dungeonData.slotDps;
        } else {
            hurt = this.dungeonData.slotDps;
        }
        hurt = Math.floor(hurt / (1 / this.refreshBloodTime))
        return hurt;
    }

    start() {
        let res = GlobalUtil.getLocal('diansha_Cliclk_tip', true, true);
        this.firstCheck = res;
        let tipCfg = ConfigManager.getItemById(TipsCfg, 21);
        this.playTips.string = tipCfg ? tipCfg.desc21 : '伤害不够时可快速点击boss，提升伤害输出';
        // this.model.instHeroState = false;
        //保存最新进入副本的时间
        if (JumpUtils.ifSysOpen(RedPointUtils.get_copy_open_lv(InstanceID.HERO_INST), false)) {
            let n = "hero_inst"
            GlobalUtil.setLocal(n, ModelManager.get(ServerModel).serverTime)
        }
        this.isCreatComplite = true;
        this.oriWidth = this.hpFG.width;
        this.bossPos = cc.v2(this.bossNode.getPos().x, this.bossNode.getPos().y);

        //显示离开界面挂机期间的奖励
        if (this.model.dunGeonBossJusticeState && this.model.dunGeonBossJusticeState.rewards.length > 0) {
            GlobalUtil.openRewadrView(this.model.dunGeonBossJusticeState.rewards);
        }

        //请求挂机期间的奖励
        this.firstReq = true;
        NetManager.send(new icmsg.JusticeStateReq());

        //设置指挥官spine
        this.updateGeneralSpine();

        this.curHurtTime = this.refreshBloodTime;
        this.bossTimeLabel.node.parent.active = false;

        //获取边框最大等级
        this.frameMaxLv = ConfigManager.getItems(Justice_frameCfg).length;

        //获取解锁指挥官自动攻击的bossID
        this.generalAutoAttackMaxLv = ConfigManager.getItemByField(Justice_bossCfg, "automatic", 1).id;

        //
        this.dungeonData = this.model.dunGeonBossJusticeState;
        this.setUp();

        // //判断是否显示一键上阵的红点
        // let show = this._checkHeroPower(false);
        // this.heroRed.active = show;
        // this.setupNode.active = this.getSlotOpenNum() > 0;
    }

    //初始化雇佣兵列表
    _initMercenaryListView() {
        if (this.mercenaryList == null) {
            this.mercenaryList = new ListView({
                scrollview: this.mercenaryScrollView,
                mask: this.mercenaryScrollView.node,
                content: this.mercenaryContent,
                item_tpl: this.mercenaryItem,
                cb_host: this,
                async: true,
                column: 1,
                gap_y: 0,
                direction: ListViewDir.Vertical,
            })
        }
    }

    mercenraylevelData: number[] = [];
    //刷新雇佣兵列表数据
    refreshMercenaryListData() {

        if (!this.mercenaryList) {
            this._initMercenaryListView()
        }
        let list: any[] = [];
        let isChange = false;
        if (this.mercenraylevelData.length == 0) {
            this.mercenraylevelData[0] = this.dungeonData.general.level > 0 ? this.dungeonData.general.level : 1;
            isChange = true;
            for (let i = 1; i < 99; i++) {
                let cfg = ConfigManager.getItemByField(Justice_mercenaryCfg, 'type', i);
                if (cfg) {
                    this.mercenraylevelData[i] = 0
                } else {
                    break;
                }
            }
        }

        if (this.dungeonData.mercenaries.length != 0) {
            for (let i = 0; i < this.dungeonData.mercenaries.length; i++) {
                if (i > this.mercenraylevelData.length - 2) {
                    break;
                }
                let level = this.dungeonData.mercenaries[i]
                if (level != this.mercenraylevelData[i + 1]) {
                    this.mercenraylevelData[i + 1] = level;
                    isChange = true;
                }
            }
        }

        let curGeneralLevel = this.dungeonData.general.level > 0 ? this.dungeonData.general.level : 1;
        if (this.mercenraylevelData[0] != curGeneralLevel) {
            this.mercenraylevelData[0] = curGeneralLevel
            isChange = true;
        }

        if (this.changeHero && !isChange) {
            this.changeHero = false;
            isChange = true;
        }
        if (isChange) {
            for (let i = 0; i < this.mercenraylevelData.length; i++) {
                let data: InstanceMercenaryData = new InstanceMercenaryData()
                data.type = i;
                data.level = Math.max(1, this.mercenraylevelData[i]);
                data.isOpen = this.mercenraylevelData[i] > 0;
                data.scroll = this.mercenaryScrollView;
                list.push(data);
            }
            let temList: any[] = [];
            let temList1: any[] = [];
            temList.push(list.shift());
            let isOpen = true;
            while (isOpen) {
                let temData: InstanceMercenaryData = list[0];
                if (temData && temData.isOpen) {
                    temList1.push(list.shift());
                } else {
                    isOpen = false;
                }
            }
            temList = temList.concat(temList1.reverse())
            //temList.push(temList1.reverse())
            //temList.push(list)
            temList = temList.concat(list)
            this.mercenaryList.set_data(temList, false);
        }
        else {
            this.mercenaryList.refresh_items()
        }
    }


    _initListView() {
        if (this.list == null) {
            let opt = {
                scrollview: null,
                mask: null,
                content: this.content,
                item_tpl: this.rewardPrefab,
                column: 6,
                width: 600,
                gap_x: 10,
                gap_y: 5,
                async: false,
                direction: ListViewDir.Horizontal,
            };
            this.list = new ListView(opt);
        }
    }

    rewardShow() {
        this.content.parent.active = false;
        this._initListView()
        let temStageId = this.dungeonBoss.id;
        if (temStageId == 0) {
            let stageDatas: Justice_bossCfg[] = ConfigManager.getItems(Justice_bossCfg);
            let lastStageId = stageDatas[stageDatas.length - 1].id;
            temStageId = lastStageId
            this.showTitle.string = '奖励预览'
        } else {
            this.showTitle.string = '概率获得'
        }

        let stageD: Justice_bossCfg = ConfigManager.getItem(Justice_bossCfg, { id: temStageId });
        if (stageD) {
            let list: any[] = [];
            let firstKill = temStageId <= this.dungeonData.maxKillId
            if (firstKill) {
                for (let i = 0, n = stageD.drop_show.length; i < n; i++) {
                    let id = stageD.drop_show[i];
                    let extInfo = { itemId: id, itemNum: 1 };
                    let itemId = id;
                    let type = BagUtils.getItemTypeById(itemId);
                    let item = {
                        series: itemId,
                        itemId: itemId,
                        itemNum: extInfo.itemNum,
                        type: type,
                        extInfo: extInfo
                    };
                    if (i == 0) {
                        list.push({ index: i, info: item, effect: true, showCommonEffect: true, cxEffect: false });
                    } else {
                        list.push({ index: i, info: item });
                    }
                }
            } else {
                for (let i = 0, n = stageD.drop_show.length; i < n; i++) {
                    let id = stageD.drop_show[i];
                    let extInfo = { itemId: id, itemNum: 1 };
                    let itemId = id;
                    let type = BagUtils.getItemTypeById(itemId);
                    let item = {
                        series: itemId,
                        itemId: itemId,
                        itemNum: extInfo.itemNum,
                        type: type,
                        extInfo: extInfo
                    };
                    if (i == 0) {
                        list.push({ index: i, info: item, effect: true, showCommonEffect: true, cxEffect: false });
                    } else {
                        list.push({ index: i, info: item });
                    }
                }
            }

            this.list.set_data(list, true);
            this.content.y = 30;
        }

    }

    setUp() {

        if (this.dungeonBoss == null || this.dungeonBoss.id != this.model.dunGeonBossJusticeState.boss.id) {
            //let showAll = this.dungeonBoss != null;
            this.dungeonBoss = this.model.dunGeonBossJusticeState.boss;
            this.curBossHp = this.dungeonBoss.hp;
            this.refreshBossHeadIcon();
            this.updateBossSpine();
            //this.updateHeroInfo();
            this.updateBossInfo();
            //显示奖励预览
            this.rewardShow();
            if (this.isEnd()) { // 所有boss已击杀
                this.isKillAllBoss = true
                this.hideBoss();
                this.completeNode.active = true;
            } else {
                this.completeNode.active = false;
            }
        } else {
            this.dungeonBoss = this.model.dunGeonBossJusticeState.boss;
            this.curBossHp = this.dungeonBoss.hp;
            //刷新boss信息
            if (this.dungeonBoss.id != 0) {
                this.updateBossInfo();
            }
        }
        this.updateHeroInfo();
    }


    hideBoss() {
        this.bossNode.active = false;
        this.bossBgNode.active = false;
        this.bloodBar.active = false;
        this.bossBloodBar.active = false;

        this.bossTimeLabel.node.parent.active = false;
        this.refreshBoss.active = false;
    }

    showBoss() {
        this.bossNode.active = true;
        this.bossBgNode.active = true;
        if (this.lastBossCfg && cc.js.isNumber(this.lastBossCfg.limit) && this.lastBossCfg.limit > 0) {
            this.bloodBar.active = false;
            this.bossBloodBar.active = true;
        } else {
            this.bloodBar.active = true;
            this.bossBloodBar.active = false;
        }
    }

    refreshBossHeadIcon() {
        if (this.bossHeadIconNodes.length == 3 && this.bossHeadIcons.length == 3 && this.bossHeadIconNums.length == 3) {
            //1.判断当前关卡是否有前后关卡
            let temStageId = this.dungeonBoss ? this.dungeonBoss.id : 0;
            if (temStageId == 0) {
                this.bossHeadIconNodes[0].active = false;
                this.bossHeadIconNodes[1].active = false;
                this.bossHeadIconNodes[2].active = true;
                this.bossHeadIconNums[2].string = '1';
                //let stageD: Copy_stageCfg = ConfigManager.getItem(Copy_stageCfg, { copy_id: 4 });
                let mon: Justice_bossCfg = ConfigManager.getItems(Justice_bossCfg)[0]
                let path = `icon/monster/${mon.head}_s`;
                GlobalUtil.setSpriteIcon(this.node, this.bossHeadIcons[2], path)
            } else {
                this.bossHeadIconNodes[1].active = true;
                //let stageD: Copy_stageCfg = ConfigManager.getItem(Copy_stageCfg, { born: temStageId });
                let mon: Justice_bossCfg = ConfigManager.getItem(Justice_bossCfg, { id: temStageId });
                this.bossHeadIconNums[1].string = temStageId + '';
                let path = `icon/monster/${mon.head}_s`;
                GlobalUtil.setSpriteIcon(this.node, this.bossHeadIcons[1], path)
                let mon1: Justice_bossCfg = ConfigManager.getItem(Justice_bossCfg, { id: temStageId - 1 });
                if (!mon1) {
                    this.bossHeadIconNodes[0].active = false;
                } else {
                    this.bossHeadIconNodes[0].active = true;
                    this.bossHeadIconNums[0].string = (temStageId - 1) + '';
                    let path1 = `icon/monster/${mon1.head}_s`;
                    GlobalUtil.setSpriteIcon(this.node, this.bossHeadIcons[0], path1)
                }
                let mon2: Justice_bossCfg = ConfigManager.getItem(Justice_bossCfg, { id: temStageId + 1 });
                //let stageD2: Copy_stageCfg = ConfigManager.getItem(Copy_stageCfg, { pre_condition: stageD.id });
                if (!mon2) {
                    this.bossHeadIconNodes[2].active = false;
                    this.isLastBoss = true;
                } else {
                    this.bossHeadIconNodes[2].active = true;
                    this.bossHeadIconNums[2].string = (temStageId + 1) + '';
                    let path2 = `icon/monster/${mon2.head}_s`;
                    GlobalUtil.setSpriteIcon(this.node, this.bossHeadIcons[2], path2)
                }
            }
        }
    }

    //boss抖动
    bossShake() {
        if (!this.bossNode || !this.bossNode.active) {
            return;
        }
        this.bossNode.stopAllActions()
        this.bossNode.setPosition(this.bossPos);
        // boss抖动
        let node = this.bossNode;
        let pos = this.bossPos;
        let cb = function () {

            let min: any = -50;
            let max: any = 50;
            node.x = pos.x + MathUtil.rnd(min, max);
            node.y = pos.y + MathUtil.rnd(min, max);
        }
        let action: cc.Action = cc.speed(
            cc.sequence(
                cc.repeat(
                    cc.sequence(cc.delayTime(1 / cc.game.getFrameRate()), cc.callFunc(cb)), 15
                ),
                cc.callFunc(() => {
                    this.bossNode.setPosition(this.bossPos);
                }),
            ),
            1
        );
        this.bossNode.runAction(action);
    }

    updateGeneralSpine() {
        // let general = ConfigManager.getItemById(General_skinCfg, 1)
        // if (!general) {
        //     CC_DEBUG && cc.log('---------------------英雄副本的General_skinCfgID有问题，请检查-----' + 1)
        //     return;
        // }
        let generalSpine = this.generalNode.getComponent(sp.Skeleton)
        //this.generalNode.scaleX = this.generalNode.scaleY = 1.5;
        let model = ModelManager.get(PveGeneralModel);
        let skin = model.skin;
        let url: string = StringUtils.format("spine/hero/{0}/1/{0}", skin);
        GlobalUtil.setSpineData(this.generalNode, generalSpine, url, true, 'stand_d', true);
        generalSpine.node.opacity = 255;
        this.generalSpine = generalSpine;
    }

    updateBossSpine() {
        if (this.dungeonBoss == null || this.dungeonBoss.id == 0) {
            return;
        }
        //let stageD: Copy_stageCfg = ConfigManager.getItem(Copy_stageCfg, { born: this.dungeonBoss.id });
        let mon: Justice_bossCfg = ConfigManager.getItem(Justice_bossCfg, { id: this.dungeonBoss.id });
        if (!mon) {
            CC_DEBUG && cc.log('---------------------英雄副本的bossID有问题，请检查-----' + this.dungeonBoss.id)
            return;
        }
        //boss推荐战力
        if (cc.js.isNumber(mon.recommended) && mon.recommended > 0) {
            this.recommendFight.string = GlobalUtil.numberToStr2(mon.recommended, true);
            this.recommendFight.node.parent.active = true;
        } else {
            this.recommendFight.node.parent.active = false;
        }

        this.curBloodFloor = 99;
        this.floorBloodNum = Math.floor(mon.hp / 100);


        let bossSpine = this.bossNode.getComponent(sp.Skeleton)
        this.bossNode.scaleX = this.bossNode.scaleY = mon.size
        let url: string = StringUtils.format("spine/monster/{0}/{0}", mon.skin);
        GlobalUtil.setSpineData(this.bossNode, bossSpine, url, true, 'stand_s', true);
        //bossSpine.node.opacity = 255;
        this.bossSpine = bossSpine;
        let action: cc.Action = cc.speed(
            cc.sequence(
                //cc.delayTime(0.2),
                cc.fadeIn(0.2),
                cc.callFunc(() => {
                    this.bossDie = false;
                }, this)
            ),
            1
        )
        this.bossSpine.node.runAction(action);
        //添加容错，重置boss死亡参数
        gdk.Timer.once(2000, this, () => {
            if (this.bossDie) {
                this.bossDie = false;
            }
        })
        //更新Rect
        this.updateBossRect();
        if (this.bossName.string != mon.name) {
            this.bossName.string = mon.name
            this.bossNewName.string = mon.name;
        }

        //检测一键上阵红点
        let show = this._checkHeroPower(false);
        this.heroRed.active = show;

        //设置背景图 

        if (this.sceneBgStr == "" || this.sceneBgStr != mon.sceneBg) {
            this.sceneBgStr = mon.sceneBg;
            let path = "view/instance/texture/bg/" + mon.sceneBg
            this.sceneBg.node.active = false;
            GlobalUtil.setSpriteIcon(this.node, this.sceneBg, path, () => {
                this.sceneBg.node.active = true;
            }, this)
        }

        this.lastBossCfg = mon;
        this.generalMaxLv = mon.general_lv;

        //判断是否需要播放气泡
        if (mon.des_showTime.length == 3) {
            this.qipaoStartTime = mon.des_showTime[0];
            this.qipaoWaitTime = mon.des_showTime[1];
            this.qipaoRefreshTime = mon.des_showTime[2];
            this.curQipaoTime = mon.des_showTime[2];
            this.qipaoTipsStr = mon.des.split(';')
        } else {
            this.qipaoStartTime = 0;
            this.qipaoRefreshTime = 0;
            this.curQipaoTime = 0;
            this.qipaoWaitTime = 0;
            this.qipaoTipsStr = []
        }

    }

    _timeFormat(sec: number): string {
        let h = Math.floor(sec / 3600);
        let m = Math.floor((sec - h * 3600) / 60);
        let s = Math.floor(sec - h * 3600 - m * 60);
        let str = (h < 10 ? `0${h}` : `${h}`) + ':' + (m < 10 ? `0${m}` : `${m}`) + ':' + (s < 10 ? `0${s}` : `${s}`);
        return str;
    }


    dropItems: cc.Node[] = [];
    goods: icmsg.GoodsInfo[] = [];

    showDropItem(goods: icmsg.GoodsInfo[], show: boolean = false) {
        // 通用的恭喜获得奖励提示
        let time = 0
        for (let i = 0; i < goods.length; i++) {

            let showNum = 1;
            if (show && (goods[i].typeId == 3 || goods[i].typeId == 10)) {
                if (this.lastBossCfg) {
                    this.lastBossCfg.show.forEach(a => {
                        if (a[0] == goods[i].typeId) {
                            showNum = a[1];
                        }
                    })
                }
            }

            for (let j = 0; j < showNum; j++) {
                this.createDropRewardNode(goods[i].typeId, Math.floor(goods[i].num / showNum), time)
                time += 0.1;
            }
        }
    }

    createDropRewardNode(itemId: number, showNum: number, time: number) {
        let node = cc.instantiate(this.itemPrefab)
        this.dropArea.addChild(node);
        this.dropItems.push(node);
        node.getChildByName('UiSlotItem').getChildByName('nameLab').getComponent(cc.Label).string = '';//temp.name + '';
        let path = GlobalUtil.getIconById(itemId)//'icon/item/main_itemmoney03';
        let uislotItem: UiSlotItem = node.getChildByName('UiSlotItem').getComponent(UiSlotItem);
        if (uislotItem) {
            uislotItem.updateItemIcon(path)
        }
        node.stopAllActions();
        let numx = 0
        let number = MathUtil.rnd(0, 1)
        let number1 = MathUtil.rnd(80, 300)
        if (number == 0) {
            numx = -number1;
        } else {
            numx = number1;
        }
        let numY = this.onOnekillState ? MathUtil.rnd(800, 1000) : MathUtil.rnd(1280, 1400);
        node.x = 0;
        node.y = 160;
        let rigid = node.getComponent(cc.RigidBody);
        if (!rigid) {
            rigid = node.addComponent(cc.RigidBody)
            rigid.linearDamping = 0.1;
            rigid.fixedRotation = true;
        }
        node.opacity = 0;
        rigid.gravityScale = 0;
        let action: cc.Action = cc.speed(
            cc.sequence(
                cc.delayTime(time),
                cc.callFunc(() => {
                    rigid.linearVelocity = cc.v2(numx, numY);
                    rigid.gravityScale = 1;
                }, this),
                cc.fadeIn(0.05),
                cc.delayTime(2),
                cc.callFunc(() => {
                    node.removeComponent(rigid)
                    if (!this.onOnekillState) {
                        let temNode: cc.Node = PvePool.get(this.hurtEffectPrefab);
                        let ctrl: InstanceHurtEffect = temNode.getComponent(InstanceHurtEffect);
                        let value = '' + Math.abs(showNum);
                        ctrl.showHurt(1, value, InstanceHurtType.NORMAL, node.getPos());
                        this.hurtNode.addChild(temNode);
                    }

                }, this),
                cc.spawn(
                    cc.moveTo(0.4, 0, -119),
                    cc.scaleTo(0.4, 0.3),
                    cc.fadeTo(0.4, 0.4),//cc.fadeOut(0.5),
                ),
                cc.callFunc(this.removeDropItem, this)
            ),
            1
        )
        node.runAction(action);
    }

    removeDropItem(node: cc.Node) {
        let index = this.dropItems.indexOf(node);
        if (index > -1) {
            this.dropItems.splice(index, 1);
            node.destroy();
        }
        // if (this.dropItems.length == 0) {
        //     //刷新

        //     this.bossNode.opacity = 255;

        // }
    }

    clearTimerAndDropItem() {
        this.dropItems.forEach(element => {
            element.destroy();
        });
        this.dropItems = [];
    }

    updateBossInfo(showAll: boolean = false) {

        this.updateBossHp(showAll);
        if (this.dungeonBoss.id == 0) {
            this.hideBoss();
            this.attack.active = false;
            this.atkBtn.active = true;
            this.heroRed.active = false;
            this.lastBossCfg = null;
            this.mercenraylevelData.length = 0;
            this.refreshMercenaryListData()
        } else {
            this.showBoss();
            this.attack.active = true;
            this.atkBtn.active = false;
        }

        let mon: Justice_bossCfg = ConfigManager.getItem(Justice_bossCfg, { id: this.dungeonBoss.id });
        if (!mon) {
            CC_DEBUG && cc.log('---------------------英雄副本的bossID有问题，请检查-----' + this.dungeonBoss.id)
            this.showBossTime = false;
            this.bossTimeLabel.node.parent.active = this.showBossTime;
            return;
        }
        //设置倒计时时间
        if (cc.js.isNumber(mon.limit) && mon.limit > 0) {
            this.showBossTime = true;
            let curTime = ModelManager.get(ServerModel).serverTime / 1000;
            if (curTime > this.dungeonBoss.recoverTime) {
                cc.log('----------------当前时间超过了boss复活时间----------------')
            }
            this.bossTimeNum = Math.floor(this.dungeonBoss.recoverTime - curTime);
            this.bossTimeLabel.string = this._timeFormat(this.bossTimeNum);
            this.bloodBar.active = false;
            this.bossBloodBar.active = true;

            let generalDps = this.dungeonData.generalDps;
            //当前战力
            let curDps = generalDps + this.dungeonData.slotDps;
            let temHp = curDps * this.bossTimeNum + generalDps * 2
            if (temHp < this.dungeonBoss.hp && this.firstCheck) {
                GuideUtil.setGuideId(210005);
                this.firstCheck = false;
                GlobalUtil.setLocal('diansha_Cliclk_tip', false)
            } else {
                this.firstCheck = false
            }

        } else {
            this.showBossTime = false;
            this.bloodBar.active = true;
            this.bossBloodBar.active = false;
            this.firstCheck = false;
        }
        this.bossTimeLabel.node.parent.active = this.showBossTime;
        this.refreshBoss.active = this.showBossTime;
    }

    updateBossHp(showAll: boolean = false) {
        if (!this.dungeonBoss || this.dungeonBoss.id == 0 || showAll) {
            this.updateHp(1, 1);
            return;
        }
        if (this.lastBossCfg == null) {
            return;
        }
        this.updateHp(this.curBossHp, this.lastBossCfg.hp);
    }

    updateBossRect() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        let bossSpine = this.bossNode.getComponent(sp.Skeleton)
        if (bossSpine) {
            let rect = bossSpine.node.getBoundingBox();
            let bone = null;
            if (bossSpine['_skeleton'] && bossSpine.animation != '') {
                let bones = bossSpine['_skeleton'].bones;
                if (bones && bones.length) {
                    bossSpine['_skeleton'].updateWorldTransform();
                    for (let i = 0, n = bones.length; i < n; i++) {
                        let bname: string = bones[i].data.name;
                        if (StringUtils.endsWith(bname, '_head01') ||
                            StringUtils.endsWith(bname, '_head') ||
                            StringUtils.endsWith(bname, '_head1')) {
                            bone = bones[i];
                            break;
                        }
                    }
                    if (bone) {
                        rect.height = bone.worldY + (bone.data.length * bones[0].scaleY);
                        rect.y = 0;
                    }
                }
                return this.bossRect = rect;
            }
        }
        return this.bossRect = cc.rect(0, 0)
    }

    updateHp(cur: number, total: number) {

        if (!this.showBossTime) {
            let v = cur / total;
            v = Math.min(v, 1);
            this.hpFG.width = this.oriWidth * v;
            this.hpBg.stopAllActions();
            if (cur > 0) {
                this.bloodLabel.string = total == 1 ? '' : GlobalUtil.numberToStr2(cur, true);
            } else {
                this.bloodLabel.string = '';
            }
            if (this.hpFG.width < 306) {
                // 底层血条动画
                let tem = this.hpFG.width / 306;
                tem = Math.max(0, tem);
                this.tween && this.tween.stop()
                this.tween = cc.tween(this.hpBg)
                    .delay(0.05)
                    .to(0.25, { width: this.hpFG.width, opacity: 0 })
                    .call(() => {
                        this.hpBg.active = false;
                        this.tween = null;
                    })
                    .start();
                this.hpBg.active = true;
                this.hpBg.opacity = 255;
            }
        } else {
            let temfloor = Math.min(99, Math.floor(this.curBossHp / this.floorBloodNum))
            if (this.curBloodFloor != temfloor) {
                //修改boss血条背景图片
                let temIndex = (99 - temfloor) % 5;
                let path1 = 'view/instance/texture/part/' + this.bossBloodFgStr[temIndex];
                let path2 = 'view/instance/texture/part/' + (temIndex < 4 ? this.bossBloodFgStr[temIndex + 1] : this.bossBloodFgStr[0]);
                if (temfloor == 0) {
                    path2 = 'view/instance/texture/part/fb_xuetiaodi'
                }
                GlobalUtil.setSpriteIcon(this.node, this.bossBloodBg, path2)
                GlobalUtil.setSpriteIcon(this.node, this.bossHpFGSp, path1)
                GlobalUtil.setSpriteIcon(this.node, this.bossHpBgSp, path1)
                this.bossFloorLb.string = temfloor > 0 ? '/' + temfloor : '';
                this.bossHpBg.width = this.BossBloodWidth;
                this.curBloodFloor = temfloor;
            }
            let temBlood = cur % this.floorBloodNum;
            let v = temBlood / this.floorBloodNum;
            v = Math.min(v, 1);
            if (cur > 0) {
                this.bossBloodLabel.string = total == 1 ? '' : GlobalUtil.numberToStr2(cur, true);
            } else {
                this.bossBloodLabel.string = '';
            }
            this.bossHpFG.width = this.BossBloodWidth * v;
            this.bossHpBg.stopAllActions();
            if (this.bossHpFG.width < this.BossBloodWidth) {
                // 底层血条动画
                // let tem = this.bossHpFG.width / 450;
                // tem = Math.max(0, tem);
                this.tween && this.tween.stop()
                this.tween = cc.tween(this.bossHpBg)
                    .delay(0.01)
                    .to(0.2, { width: this.bossHpFG.width, opacity: 0 })
                    .call(() => {
                        this.bossHpBg.active = false;
                        this.tween = null;
                    })
                    .start();
                this.bossHpBg.active = true;
                this.bossHpBg.opacity = 255;
            }
        }

    }


    showHurt(hurt: number, type: InstanceHurtType = InstanceHurtType.NORMAL, dir: 1 | -1 = 1): void {
        //屏蔽0伤害
        if (hurt == 0) {
            return;
        }
        let node: cc.Node = PvePool.get(this.hurtEffectPrefab);
        let ctrl: InstanceHurtEffect = node.getComponent(InstanceHurtEffect);
        let value = '' + Math.abs(hurt);
        ctrl.showHurt(dir, value, type);
        this.hurtNode.addChild(node);
    }

    updateHeroInfo() {

        let heroDatas = this.dungeonData.slots;
        let num = this.getSlotOpenNum();

        for (let i = 0, len = this.heroSlots.length; i < len; i++) {
            if (this.heroSlotsCtrlList[i] == null) {
                this.heroSlotsCtrlList[i] = this.heroSlots[i].getComponent(DetailViewHeroSlotCtrl);
            }
            let ctrl = this.heroSlotsCtrlList[i];
            if (ctrl) {
                if (num > i) { // open
                    ctrl.fillSlot(i, true, heroDatas.length > i ? heroDatas[i] : null, this._heroAttackHurt, this);
                } else { // close
                    ctrl.fillSlot(i, false);
                }
            }
        }

        //标记是否有上阵英雄
        heroDatas.forEach(slot => {
            if (slot.heroId > 0) {
                this.isUpHero = true;
            }
        })
        // let fightN = GetHerosFight(heroIds);
        // this.fightNum.string = fightN + '';
        // cc.find('info/fightNode', this.node).active = !!fightN;
    }

    //获取解锁的槽位个数
    getSlotOpenNum() {
        //let lv = ModelManager.get(RoleModel).level;
        let num = 0;
        let bossId = this.dungeonData.boss.id
        let cfg = ConfigManager.getItemByField(Justice_bossCfg, 'id', bossId);
        if (cfg) {
            let temCfgs = ConfigManager.getItemsByField(Justice_bossCfg, 'slot', cfg.slot);
            if (cfg.id == temCfgs[0].id) {
                num = Math.max(0, cfg.slot - 1);
            } else {
                num = cfg.slot;
            }
        }

        return num;
    }

    fillSlot(index: number, slot: cc.Node, isOpen: boolean, heroId: number = 0) {

        let lock = slot.getChildByName('lock');
        let desc = slot.getChildByName('desc');
        let add = slot.getChildByName('add');
        let hero = cc.find('heroMask/hero', slot);//slot.getChildByName('hero');
        if (isOpen) {
            lock.active = false;
            desc.active = false;
            if (heroId == 0) {
                hero.active = false;
                add.active = true;
            } else {
                hero.active = true;
                add.active = false;

                // TODO 根据 heroId 创建英雄
                let bagItem = HeroUtils.getHeroInfoBySeries(heroId)
                let cfg = ConfigManager.getItemById(HeroCfg, bagItem.itemId)

                let heroSpine = hero.getComponent(cc.Sprite)
                //HeroUtils.setFightSpineData(slot, heroSpine, cfg.skin, true)
                //HeroUtils.set
                let icon = `icon/hero/${cfg.icon}_s`//GlobalUtil.getIconById(item.itemId, BagType.HERO)
                GlobalUtil.setSpriteIcon(this.node, heroSpine, icon)
            }
        } else {
            desc.active = true;
            hero.active = false;
            add.active = false;
            lock.active = true;
        }
    }

    onHitClick() {
        if (this.isEnd()) {
            gdk.gui.showMessage("Boss已全部击杀");
            return;
        }
        if (this.dungeonData.boss.id == 0) {
            // 召唤boss
            NetManager.send(new icmsg.JusticeSummonReq());
        } else {

            if (this.bossDie || this.clientDie) {
                return;
            }

            if (this.curPlayClickTime > 0) {
                return;
            }
            this.curPlayClickTime = this.intervalPlayClickTime;

            let guideCfg = GuideUtil.getCurGuide();
            if (guideCfg && guideCfg.id == 210005) {
                //
                GuideUtil.clearGuide()
            }
            // 攻击boss
            NetManager.send(new icmsg.JusticeClickReq());

            this._playAttackAnimation();

        }
    }

    //战利品按钮点击事件
    onTrophyClick() {
        //this.openReward = true;
        NetManager.send(new icmsg.JusticeItemsGotReq(), function (rsp: icmsg.JusticeItemsGotRsp) {
            if (rsp.list.length > 0) {
                GlobalUtil.openRewardPreview(rsp.list, "今日累计获得");
            } else {
                gdk.gui.showMessage("暂未获得奖励物品")
            }
        }, this)
    }

    //排行榜按钮点击事件
    onRankBtnClick() {
        gdk.panel.open(PanelId.DianshaRankView)
    }

    attackAnimList = ['diansha_atk1', 'diansha_atk2', 'diansha_atk3', 'diansha_atk4', 'diansha_atk5', 'diansha_atk6']
    curAtkIndex = 0;
    //指挥官攻击动作
    _playAttackAnimation(timeScale: number = 1) {

        if (this.generalSpine && this.generalSpine.skeletonData) {
            this.generalSpine.timeScale = timeScale;
            let animStr = this.attackAnimList[this.curAtkIndex];
            this.curAtkIndex = this.curAtkIndex < 5 ? this.curAtkIndex + 1 : 0;
            let t = this.generalSpine.setAnimation(0, animStr, false)
            this.generalSpine.setCompleteListener((trackEntry, loopCount) => {
                let name = trackEntry.animation ? trackEntry.animation.name : '';
                if (name === animStr) {
                    this.generalSpine.timeScale = 1;
                    this.generalSpine.setAnimation(0, "stand_d", true)
                }
            })
        }
        //指挥官攻击音效
        GlobalUtil.isSoundOn &&
            gdk.sound.play(
                gdk.Tool.getResIdByNode(this.node),
                'man1',
            );
    }

    //boss播放受击动作
    _playHitAnimation() {

        if (this.bossDie) {
            return;
        }
        //boss受击音效
        GlobalUtil.isSoundOn &&
            gdk.sound.play(
                gdk.Tool.getResIdByNode(this.node),
                'damage_dao',
            );
        if (this.bossSpine && this.bossSpine.skeletonData) {
            if (this.bossSpine.animation === 'hit_s') {
                return;
            }
            let t = this.bossSpine.setAnimation(0, "hit_s", false)
            if (t) {
                this.bossSpine.setCompleteListener((trackEntry, loopCount) => {
                    let name = trackEntry.animation ? trackEntry.animation.name : '';
                    if (name === "hit_s") {
                        this.bossSpine.setAnimation(0, "stand_s", true)
                    }
                })
            }
        }
    }

    //Boss受击特效
    onFinished() {
        if (this.curAtkAnim) {
            this.curAtkAnim.off('finished', this.onFinished, this);
            this.curAtkAnim.node.active = false;
            this.curAtkAnim = null;
        }
    }

    //重置boss事件
    onResetBossClick() {
        if (this.dungeonBoss && this.dungeonBoss.recoverTime > 0) {
            NetManager.send(new icmsg.JusticeBossResetReq())
        }
    }
    //快速击杀boss事件
    onOneKillBossClick() {

        if (!this.onOnekillState) {
            this.onOnekillState = true;
            this.bloodBar.active = false;
            this.bossBloodBar.active = false;
            this.bossTimeLabel.node.parent.active = false;
            this.bossHeadNode.active = false;
            this.bossTipsNode.active = false;
            this.recommendFight.node.parent.active = false;
            //this._closeBtn.node.active = false;


            if (gdk.panel.isOpenOrOpening(PanelId.Instance)) {
                let instanceNode = gdk.panel.get(PanelId.Instance);
                let ctrl = instanceNode.getComponent(InstanceViewCtrl);
                if (ctrl) ctrl._closeBtn.node.active = false;
            }

            //播放特效
            this.oneKillEffect1.node.active = true;
            this.oneKillEffect1.setAnimation(0, 'stand1', false);
            this.oneKillEffect2.node.active = true;
            this.oneKillEffect2.setAnimation(0, 'stand2', false);
            this.oneKillEffect2.setCompleteListener((trackEntry, loopCount) => {
                let name = trackEntry.animation ? trackEntry.animation.name : '';
                if (name === "stand2") {
                    //this.bossSpine.setAnimation(0, "stand_s", true)
                    this.bossHeadNode.active = true;
                    //this._closeBtn.node.active = true;
                    if (gdk.panel.isOpenOrOpening(PanelId.Instance)) {
                        let instanceNode = gdk.panel.get(PanelId.Instance);
                        let ctrl = instanceNode.getComponent(InstanceViewCtrl);
                        if (ctrl) ctrl._closeBtn.node.active = true;
                    }
                    this.oneKillNode.active = false;
                    this.setupNode.active = true;
                    this.oneKillEffect2.node.active = false;
                    this.oneKillEffect1.node.active = false;
                    this.generalSpine.setAnimation(0, "stand_d", true)
                    gdk.Timer.clear(this, this._playAttackAnimation);
                    this.onOnekillState = false;
                    for (let i = this.dropItems.length - 1; i >= 0; i--) {
                        this.dropItems[i].destroy();
                    }
                    this.dropItems = [];
                    this.dungeonBoss = null;
                    this.animCfg = null;
                    this.animNum = 0;
                    NetManager.send(new icmsg.JusticeQuickKillReq());
                }
            })

            //指挥官动作
            gdk.Timer.loop(300, this, this._playAttackAnimation, [1.6]);
            //boss动作
            this.oneKillAnim()
            //this.bossSpine
            //this.bossNode.active = true;
            // NetManager.send(new JusticeQuickKillReq())
            // gdk.Timer.once(800, this, () => {
            //     this.onOnekillState = false;
            // })
        }
    }

    animNum: number = 0;
    animCfg: Justice_bossCfg
    oneKillAnim() {

        if (!this.animCfg) {
            if (this.lastBossCfg) {
                this.animCfg = this.lastBossCfg
            } else {
                this.animCfg = ConfigManager.getItemById(Justice_bossCfg, 1);
            }
        } else {
            this.animCfg = ConfigManager.getItemById(Justice_bossCfg, this.animCfg.id + 1);
        }
        this.bossNode.active = true;
        this.bossNode.opacity = 255;
        this.bossNode.scaleX = this.bossNode.scaleY = this.animCfg.size
        if (!this.bossSpine) {
            this.bossSpine = this.bossNode.getComponent(sp.Skeleton)
        }
        let url: string = StringUtils.format("spine/monster/{0}/{0}", this.animCfg.skin);
        this.bossSpine.timeScale = 1.5;
        GlobalUtil.setSpineData(this.bossNode, this.bossSpine, url, true, 'stand_s', true, null, () => {
            let tem = 0;
            let die = false;
            let t = this.bossSpine.setAnimation(0, 'hit_s', true);
            if (t) {
                this.bossSpine.setCompleteListener((trackEntry, loopCount) => {
                    let name = trackEntry.animation ? trackEntry.animation.name : '';
                    if (name == "hit_s") {
                        tem += 1;
                        if (tem > 3 && !die) {
                            die = true;
                            this.bossNode.opacity = 0;
                            this.animNum += 1;
                            if (this.animNum < 5) {
                                this.bossDieEffect.node.active = true;
                                let data: icmsg.GoodsInfo[] = []
                                for (let i = 0; i < 10; i++) {
                                    let tem1: icmsg.GoodsInfo = new icmsg.GoodsInfo()
                                    tem1.typeId = 10;
                                    tem1.num = 10;
                                    data.push(tem1);
                                }
                                this.showDropItem(data)
                                let t = this.bossDieEffect.setAnimation(0, 'stand', false);
                                if (t) {
                                    this.bossDieEffect.setCompleteListener((trackEntry, loopCount) => {
                                        this.bossDieEffect.node.active = false;
                                        this.oneKillAnim();
                                    })
                                }
                            } else {
                                this.animNum = 0;
                                this.bossSpine.timeScale = 1;
                                this.bossSpine.setAnimation(0, 'stand_s', true);
                                this.bossNode.opacity = 255;
                            }
                        }
                    }
                })
            }

        });

    }


    //一键升级按钮
    onOneKeyUpBtnClick() {

        let state = GlobalUtil.getGrayState(this.onekeyUpBtn)
        //发送一键升级消息
        if (state == 0 && !this.onOneKeyUpState) {
            this.onOneKeyUpState = true;
            NetManager.send(new icmsg.JusticeQuickLvupReq())
            gdk.Timer.once(2000, this, () => {
                this.onOneKeyUpState = false;
            })
        }
    }

    //获取指挥官和雇佣兵是否能升级
    getMercenaryAndGeneralUpState(): boolean {
        let res = false;
        let score = this.dungeonData.score;

        //没有上阵英雄时按钮置灰
        if (this.dungeonData.slots.length == 0) return false;
        let haveHero = false;
        this.dungeonData.slots.forEach(slot => {
            if (slot.heroId > 0) {
                haveHero = true;
            }
        })
        if (!haveHero) return false;
        //判断指挥官是否能升级
        this.dungeonData.general.level;
        let temCfg1 = ConfigManager.getItemByField(Justice_generalCfg, 'lv', this.dungeonData.general.level + 1)
        if (temCfg1 && score > temCfg1.exp) {
            res = true;
        }
        if (!res) {
            for (let i = 1; i < this.mercenraylevelData.length; i++) {
                if (this.mercenraylevelData[i] > 0) {
                    let temCfg = ConfigManager.getItemByField(Justice_mercenaryCfg, 'type', i, { 'lv': this.mercenraylevelData[i] + 1 })
                    if (temCfg && score >= temCfg.exp) {
                        res = true;
                        break;
                    }
                }
            }
        }
        return res
    }

    //一键上阵按钮点击事件
    onLayoutClick() {
        //上阵英雄
        let num = this.getSlotOpenNum();
        if (num <= 0) {
            gdk.gui.showMessage(`未解锁`);
            return;
        }
        this._checkHeroPower(true);

        this.heroRed.active = false;
    }

    // 检查战斗力是更优势的组合
    _checkHeroPower(send: boolean = false): boolean {
        if (!this.dungeonData || ModelManager.get(HeroModel).heroInfos.length < 0) {
            //cc.log('玩家没有英雄');
            return false;
        }
        //开启的英雄槽数量
        let num = this.getSlotOpenNum();
        if (num <= 0) {
            send && gdk.gui.showMessage(`未解锁`);
            return false;
        }
        let heroIds: number[] = []
        this.dungeonData.slots.forEach(data => {
            if (data.heroId > 0) {
                heroIds.push(data.heroId);
            }
        })
        let curPower = GetHerosFight(heroIds);
        let a: BagItem[] = [];
        ModelManager.get(HeroModel).heroInfos.forEach(element => {
            a.push(element);
        });

        //战力高到低排序
        a.sort((a: BagItem, b: BagItem) => {
            return (<icmsg.HeroInfo>b.extInfo).power - (<icmsg.HeroInfo>a.extInfo).power;
        });


        let ids: number[] = [];
        let newPower: number = 0;

        for (let i = 0, len = a.length; i < len; i++) {
            if (num > i) {
                ids.push((<icmsg.HeroInfo>(a[i].extInfo)).heroId);
            } else {
                break;
            }
        }
        newPower = GetHerosFight(ids);

        if (ids.length > 0 && send && newPower > curPower) {
            this.changeHero = true;
            let msg = new icmsg.JusticeHeroInReq();
            msg.heroIds = ids;
            NetManager.send(msg);
        }
        return newPower > curPower;
    }

    // // 打开合卡界面
    // openLottery() {
    //     JumpUtils.openPanel({
    //         panelId: PanelId.SynthesisPanel,
    //         currId: this.node,
    //         hideArgs: this.hideArgs,
    //     });
    // }
}

