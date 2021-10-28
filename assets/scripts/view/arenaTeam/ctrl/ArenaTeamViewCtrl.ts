import ActUtil from '../../act/util/ActUtil';
import ArenaTeamViewModel from '../model/ArenaTeamViewModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import ErrorManager from '../../../common/managers/ErrorManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import MathUtil from '../../../common/utils/MathUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import { ArenaTeamEvent } from '../enum/ArenaTeamEvent';
import {
    Hero_awakeCfg,
    HeroCfg,
    Teamarena_divisionCfg,
    Teamarena_prizeCfg
    } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
 * @Description: 组队竞技场View
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-26 14:54:12
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
//@menu("qszc/scene/pve/PveSceneCtrl")
export default class ArenaTeamViewCtrl extends gdk.BasePanel {

    @property([cc.Node])
    hideNodes: cc.Node[] = []
    @property([cc.Node])
    showNodes: cc.Node[] = []
    @property([cc.Label])
    playerNames: cc.Label[] = []
    @property([cc.Label])
    serverNames: cc.Label[] = []
    @property([sp.Skeleton])
    playerSpines: sp.Skeleton[] = []
    @property([cc.Label])
    rankLbs: cc.Label[] = []
    @property([cc.Label])
    scoreLbs: cc.Label[] = []

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    @property(cc.Label)
    attackNum: cc.Label = null;
    @property(cc.Label)
    attackTimeLb: cc.Label = null;
    @property(cc.Node)
    attackBtn: cc.Node = null;
    @property(cc.Node)
    teamBtn: cc.Node = null;
    @property(cc.Node)
    lockNode: cc.Node = null;

    @property(cc.Toggle)
    skipBtn: cc.Toggle = null;

    @property(cc.Node)
    reAttackBtn: cc.Node = null;

    @property(cc.Label)
    timeLb: cc.Label = null;

    @property(cc.Node)
    inviterRed: cc.Node = null;

    @property(cc.Node)
    rewardRed: cc.Node = null;
    @property(cc.Node)
    rankRed: cc.Node = null;

    list: ListView = null;
    //是否是队长
    isTeamer: boolean = false;

    //可以组队
    canTeam: boolean = false;
    //可以挑战
    canAttack: boolean = false;
    //休战期
    lock: boolean = false;

    //是否在队伍当中
    inTeam: boolean = true;

    get model(): ArenaTeamViewModel { return ModelManager.get(ArenaTeamViewModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    legends: icmsg.ArenaTeamLegend[] = []

    refreshTime: boolean = false;
    endTimes: number = 0;
    delayTime: number = 1;

    ActEndTimes: number = 0;
    ActDelayTime: number = 1;
    ActEndStr: string = '';

    onEnable() {

        this.model.enterView = true;
        //this.skipBtn.isChecked = state == null ? false : state;
        //判断当前时间状态
        this.getCurActState()
        this.initTeamData();

        // NetManager.on(icmsg.ArenaTeamSettingRsp.MsgType, (rsp: icmsg.ArenaTeamSettingRsp) => {
        //     this.model.arenaTeamInfo.setting = rsp.setting;
        //     this.skipBtn.isChecked = rsp.setting == 1 ? true : false;
        // }, this)
        gdk.e.on(ArenaTeamEvent.RSP_ARENATEAM_INVITER_AGREE, this.teamChangeUpData, this);
        gdk.e.on(ArenaTeamEvent.RSP_ARENATEAM_TEAMCHANGE, this.teamChangeUpData, this);//RSP_ARENATEAM_TEAMCHANGE
        gdk.e.on(ArenaTeamEvent.RSP_ARENATEAM_REDPOINT, this.teamChangeRedPoint, this);
        gdk.e.on(ArenaTeamEvent.RSP_ARENATEAM_CHANGETIMES_REWARD, this.refreshRedPoint, this);
        gdk.e.on(ArenaTeamEvent.RSP_ARENATEAM_RANK_REWARD, this.refreshRankRedPoint, this);
        // ErrorManager.on(5505, () => {
        //     //匹配不到玩家
        //     gdk.gui.showMessage(gdk.i18n.t("i18n:VAULT_TIP1"))
        // }, this);
    }


    update(dt: number) {

        if (this.ActEndTimes > 0) {
            this.ActDelayTime -= dt;
            if (this.ActDelayTime <= 0) {
                this.ActDelayTime += 1;
                let curTime = GlobalUtil.getServerTime()
                let temNum = (this.ActEndTimes - curTime) / 1000
                if (temNum > 0) {
                    this.timeLb.string = this.ActEndStr + TimerUtils.format1(temNum)
                } else {
                    this.getCurActState()
                    this.initTeamData();
                    return;
                }
            }
        }

        if (this.refreshTime) {
            this.delayTime -= dt;
            if (this.delayTime <= 0) {
                this.delayTime += 1;
                let curTime = GlobalUtil.getServerTime() / 1000;
                let temNum = this.endTimes - curTime;
                if (temNum <= 0) {
                    this.model.arenaTeamInfo.remainChance += 1;
                    this.endTimes = curTime + this.model.mainCfg.restore * 60 * 60
                    if (this.model.arenaTeamInfo.remainChance >= this.model.mainCfg.limit) {
                        this.refreshTime = false;
                        this.attackTimeLb.string = ''
                    }
                } else {
                    this.attackTimeLb.string = gdk.i18n.t("i18n:ARENATEAM_TIP1") + TimerUtils.format2(temNum);
                }

            }
        }
    }

    //获取当前活动状态
    getCurActState() {
        this.canTeam = ActUtil.ifActOpen(76);
        this.canAttack = ActUtil.ifActOpen(77);
        this.lock = this.canTeam == false && this.canAttack == false;
    }

    initTeamData() {
        if (this.lock) {
            this.scrollView.node.active = false;
            this.lockNode.active = true;
            this.attackNum.node.parent.active = false;
            this.attackBtn.active = false;
            this.teamBtn.active = false;
            this.reAttackBtn.active = false;
            this.timeLb.node.active = true
            this.ActEndTimes = ActUtil.getActEndTime(78)
            this.ActEndStr = gdk.i18n.t("i18n:ARENATEAM_TIP9")
            let curTime = GlobalUtil.getServerTime()
            let temNum = !this.ActEndTimes ? (this.ActEndTimes - curTime) / 1000 : 0
            this.timeLb.string = this.ActEndStr + (temNum > 0 ? TimerUtils.format1(temNum) : '');
            this.refreshRankRedPoint();
            this.refreshRedPoint();
            let msg = new icmsg.ArenaTeamInfoReq();
            NetManager.send(msg, (rsp: icmsg.ArenaTeamInfoRsp) => {
                this.model.arenaTeamInfo = rsp.teamInfo;
                this.model.matchInfo = rsp.matchInfo;
                this.model.fightRewarded = rsp.fightRewarded
                this.model.rankRewarded = rsp.rankRewarded;
                this.legends = rsp.legends;
                this.inTeam = rsp.teamInfo.players.length != 0;
                this.model.actId = rsp.activityId;
                this.initLegendsInfo();
            }, this)
        } else {
            this.rankRed.active = false;
            this.timeLb.node.active = true;
            this.reAttackBtn.active = false;
            this.scrollView.node.active = true;
            this.lockNode.active = false;
            this.attackNum.node.parent.active = this.canAttack;
            this.attackBtn.active = this.canAttack;
            this.teamBtn.active = this.canTeam;
            this.inviterRed.active = this.canTeam && this.model.inviterRed;
            this.attackTimeLb.string = '';

            if (this.canAttack) {
                this.ActEndTimes = ActUtil.getActEndTime(77)//ifActOpen(77)
                this.ActEndStr = gdk.i18n.t("i18n:ARENATEAM_TIP8")
            } else if (this.canTeam) {
                this.ActEndTimes = ActUtil.getActEndTime(76)
                this.ActEndStr = gdk.i18n.t("i18n:ARENATEAM_TIP7")
            }

            let curTime = GlobalUtil.getServerTime()
            let temNum = (this.ActEndTimes - curTime) / 1000
            this.timeLb.string = this.ActEndStr + TimerUtils.format1(temNum)

            let msg = new icmsg.ArenaTeamInfoReq();
            NetManager.send(msg, (rsp: icmsg.ArenaTeamInfoRsp) => {
                this.model.arenaTeamInfo = rsp.teamInfo;
                this.model.matchInfo = rsp.matchInfo;
                this.model.fightRewarded = rsp.fightRewarded
                this.model.rankRewarded = rsp.rankRewarded;
                this.legends = rsp.legends;
                this.inTeam = rsp.teamInfo.players.length != 0;
                this.model.actId = rsp.activityId
                if (this.inTeam) {
                    //判断玩家是否是队长
                    this.attackNum.string = rsp.teamInfo.remainChance + ''
                    this.isTeamer = this.roleModel.id == rsp.teamInfo.players[0].brief.id
                    // this.skipBtn.isChecked = false//rsp.teamInfo.setting
                    // this.skipBtn.interactable = this.isTeamer;
                    this.reAttackBtn.active = this.canAttack && rsp.matchInfo.confirmed;
                    this.attackBtn.active = this.canAttack && !rsp.matchInfo.confirmed;
                    let state: 0 | 1 = this.canAttack && this.isTeamer ? 0 : 1
                    GlobalUtil.setAllNodeGray(this.attackBtn, state);
                    GlobalUtil.setAllNodeGray(this.reAttackBtn, state);

                    if (rsp.teamInfo.remainChance < this.model.mainCfg.limit) {
                        this.refreshTime = true;
                        let curTime = GlobalUtil.getServerTime() / 1000;
                        this.endTimes = rsp.teamInfo.addChanceTime;
                        let temNum = this.endTimes - curTime;
                        if (temNum <= 0) {
                            this.model.arenaTeamInfo.remainChance += 1;
                            if (this.model.arenaTeamInfo.remainChance >= this.model.mainCfg.limit) {
                                this.refreshTime = false;
                                this.attackTimeLb.string = ''
                            }
                        } else {
                            this.attackTimeLb.string = gdk.i18n.t("i18n:ARENATEAM_TIP1") + TimerUtils.format2(temNum);
                        }
                    } else {
                        this.refreshTime = false;
                    }

                    this.refreshRedPoint();
                } else {
                    GlobalUtil.setAllNodeGray(this.attackBtn, 1);
                    GlobalUtil.setAllNodeGray(this.reAttackBtn, 1);
                    GlobalUtil.setAllNodeGray(this.teamBtn, 1);
                }

                this._updateScroll(true);
                this.initLegendsInfo();
            }, this)
        }

    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
        NetManager.targetOff(this);
        gdk.Timer.clearAll(this);
        ErrorManager.targetOff(this)
    }

    refreshRedPoint() {
        this.rewardRed.active = this.haveChangeNumReward();
    }
    refreshRankRedPoint() {
        if (ActUtil.ifActOpen(76) || ActUtil.ifActOpen(77)) {
            this.rankRed.active = false;
            return;
        }
        // let players = this.model.arenaTeamInfo.players;
        // let haveScore = false;
        // for (let i = 0; i < 3; i++) {
        //     if (i < players.length && players[i].brief.id == this.roleModel.id && players[i].rank > 0) {
        //         haveScore = true;
        //     }
        // }
        this.rankRed.active = !this.model.rankRewarded && this.model.arenaTeamInfo && this.model.arenaTeamInfo.fightTimes > 0//&& this.lock && this.model.arenaTeamInfo.players.length > 0 && haveScore;
    }

    haveChangeNumReward(): boolean {
        let res = false
        if (this.model.arenaTeamInfo) {
            let cfgs = ConfigManager.getItems(Teamarena_prizeCfg, (cfg: Teamarena_prizeCfg) => {
                if (cfg.times <= this.model.arenaTeamInfo.fightTimes) {
                    return true;
                }
                return false;
            })
            for (let i = 0; i < cfgs.length; i++) {
                let cfg = cfgs[i];
                let old = this.model.fightRewarded;
                if (!((old & 1 << cfg.times) >= 1)) {
                    return true;
                }
            }
        }
        return res;
    }

    initLegendsInfo() {
        this.playerNames.forEach((nameLb, index) => {

            if (this.legends.length > index) {
                let temData = this.legends[index]
                let data = temData.player.brief;
                this.hideNodes[index].active = false;
                this.showNodes[index].active = true;
                //
                nameLb.string = data.name;
                let serverNum = Math.floor((data.id % (10000 * 100000)) / 100000)
                this.serverNames[index].string = 'S' + serverNum + '  ' + temData.guildName//+ data.guildName;

                let path = 'H_zhihuiguan'
                if (data.head == 0) {
                    let str = 'H_zhihuiguan'
                    path = `spine/hero/${str}/1/${str}`//PveTool.getSkinUrl('H_zhihuiguan')
                } else {
                    let heroCfg = ConfigManager.getItemByField(HeroCfg, 'id', data.head);
                    if (heroCfg) {
                        path = `spine/hero/${heroCfg.skin}/1/${heroCfg.skin}`
                    } else {
                        //属于觉醒的头像 找到对应的英雄模型
                        let cfgs = ConfigManager.getItems(Hero_awakeCfg, { icon: data.head })
                        if (cfgs.length > 0) {
                            path = `spine/hero/${cfgs[cfgs.length - 1].ul_skin}/1/${cfgs[cfgs.length - 1].ul_skin}`
                        } else if ([310149, 310150, 310151].indexOf(data.head) !== -1) {
                            let heroCfg = ConfigManager.getItem(HeroCfg, (cfg: HeroCfg) => {
                                if (cfg.icon == data.head - 10000 && cfg.group[0] == 6) {
                                    return true;
                                }
                            });
                            path = `spine/hero/${heroCfg.skin}_jx/1/${heroCfg.skin}_jx`
                        } else {
                            let str = 'H_zhihuiguan'
                            path = `spine/hero/${str}/1/${str}`
                        }
                    }
                }
                let animStr = data.head == 0 ? 'stand_s' : 'stand';
                GlobalUtil.setSpineData(this.node, this.playerSpines[index], path, true, animStr, true);
                this.scoreLbs[index].string = temData.player.score + ''
                let cfgs = ConfigManager.getItems(Teamarena_divisionCfg, (cfg: Teamarena_divisionCfg) => {
                    if (cfg.point <= temData.player.score) {
                        return true;
                    }
                    return false;
                })
                this.rankLbs[index].string = cfgs[cfgs.length - 1].name;

            } else {
                this.hideNodes[index].active = true;
                this.showNodes[index].active = false;
            }
        })
    }

    teamChangeRedPoint(e: gdk.Event) {
        this.inviterRed.active = this.canTeam && this.model.inviterRed;
        if (e.data.type != 1) {
            let msg = new icmsg.ArenaTeamInfoReq();
            NetManager.send(msg, (rsp: icmsg.ArenaTeamInfoRsp) => {
                this.model.arenaTeamInfo = rsp.teamInfo;
                this.model.matchInfo = rsp.matchInfo;
                this.model.fightRewarded = rsp.fightRewarded
                this.model.rankRewarded = rsp.rankRewarded;
                this.model.actId = rsp.activityId
                this.legends = rsp.legends
                this.inTeam = rsp.teamInfo.players.length != 0;
                if (this.inTeam) {
                    //判断玩家是否是队长
                    this.attackNum.string = rsp.teamInfo.fightTimes + ''
                    this.isTeamer = this.roleModel.id == rsp.teamInfo.players[0].brief.id
                    // this.skipBtn.isChecked = false//rsp.teamInfo.setting
                    // this.skipBtn.interactable = this.isTeamer;
                    if (this.isTeamer) {
                        this.reAttackBtn.active = this.canAttack && rsp.matchInfo.confirmed;
                        this.attackBtn.active = this.canAttack && !rsp.matchInfo.confirmed;
                    } else {
                        this.reAttackBtn.active = false;
                        this.attackBtn.active = this.canAttack;
                    }

                    let state: 0 | 1 = this.canAttack && this.isTeamer ? 0 : 1
                    GlobalUtil.setAllNodeGray(this.attackBtn, state);
                    GlobalUtil.setAllNodeGray(this.reAttackBtn, state);
                    //this._updateScroll(true);
                } else {
                    GlobalUtil.setAllNodeGray(this.attackBtn, 1);
                    GlobalUtil.setAllNodeGray(this.reAttackBtn, 1);
                    GlobalUtil.setAllNodeGray(this.teamBtn, 1);
                }

                this._updateScroll(true);
                this.initLegendsInfo();
            }, this)
        }

    }

    teamChangeUpData() {
        this.inviterRed.active = this.canTeam && this.model.inviterRed;
        this.isTeamer = this.roleModel.id == this.model.arenaTeamInfo.players[0].brief.id
        this._updateScroll(true)
    }

    _updateScroll(resetPos: boolean = false) {
        this._initListView();
        let temData = []
        let players = this.model.arenaTeamInfo.players;
        for (let i = 0; i < 3; i++) {
            let tem = null;
            let isSelf = false;
            if (i < players.length) {
                tem = players[i];
                isSelf = players[i].brief.id == this.roleModel.id
            }
            let state = 0;  //当前活动状态 0休战状态 1组队状态 2挑战状态
            if (this.canTeam) {
                state = 1;
            } else if (this.canAttack) {
                state = 2;
            }

            let data = { playerInfo: tem, isTeamer: this.isTeamer, state: state, isSelf: isSelf, index: i }
            temData.push(data);
        }
        this.list.set_data(temData, resetPos);
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.itemPre,
            cb_host: this,
            gap_y: 1,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    // skipBtnClick() {
    //     //GlobalUtil.setLocal('turnDrawIsSkipAni', this.skipBtn.isChecked, true);
    //     let msg = new icmsg.ArenaTeamSettingReq()
    //     msg.setting = this.skipBtn.isChecked ? 1 : 0;
    //     NetManager.send(msg)
    //     this.skipBtn.interactable = false;
    //     gdk.Timer.once(1000, this, () => {
    //         this.skipBtn.interactable = true;
    //     })
    // }


    //打开组队大厅
    openTeamhallView() {
        if (!this.inTeam) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ARENATEAM_TIP2"))
            return;
        }
        gdk.panel.setArgs(PanelId.ArenaTeamTeamHallView, this.isTeamer)
        gdk.panel.open(PanelId.ArenaTeamTeamHallView);
    }

    //开始匹配
    attackBtnClick() {
        if (!this.inTeam) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ARENATEAM_TIP3"))
            return;
        }
        if (this.model.AttackEnterView == 0) {
            if (!this.isTeamer) {
                //gdk.gui.showMessage('队长才能发起挑战')
                return;
            }
            if (this.model.matchInfo.matchedNum > 0 || this.model.arenaTeamInfo.remainChance > 0) {
                let msg = new icmsg.ArenaTeamMatchReq()
                msg.query = this.model.matchInfo.matchedNum > 0;
                NetManager.send(msg, (rsp: icmsg.ArenaTeamMatchRsp) => {
                    // if (rsp.opponents.length == 0) {
                    //     gdk.gui.showMessage(gdk.i18n.t("i18n:ARENATEAM_TIP10"))
                    //     return;
                    // }
                    if (rsp.opponents.length != 0 && this.model.matchInfo.matchedNum == 0) {
                        this.model.matchInfo.matchedNum += 1;
                        this.model.randomNum = MathUtil.rnd(0, rsp.opponents.length - 1);
                    }
                    this.model.matchData = rsp;
                    //this.model.randomNum = MathUtil.rnd(0, rsp.opponents.length - 1);
                    gdk.panel.setArgs(PanelId.ArenaTeamSeachEnemyView, rsp)
                    gdk.panel.open(PanelId.ArenaTeamSeachEnemyView);
                })
            } else {
                gdk.gui.showMessage(gdk.i18n.t("i18n:ARENATEAM_TIP4"))
            }

        } else if (this.model.AttackEnterView == 1) {
            gdk.panel.setArgs(PanelId.ArenaTeamSeachEnemyView, this.model.matchData)
            gdk.panel.open(PanelId.ArenaTeamSeachEnemyView);
        } else if (this.model.AttackEnterView == 2) {
            gdk.panel.open(PanelId.ArenaTeamAttackView)
        }

    }

    //继续挑战
    reAttackBtnClick() {
        if (!this.isTeamer) {
            //gdk.gui.showMessage('队长才能发起挑战')
            return;
        }
        let msg = new icmsg.ArenaTeamMatchReq()
        msg.query = true;
        NetManager.send(msg, (rsp: icmsg.ArenaTeamMatchRsp) => {
            this.model.teamMates = rsp.teammates
            this.model.opponents = rsp.opponents;
            this.model.fightNum = this.model.matchInfo.fightResults.length;
            let index = this.model.fightNum;//this.model.matchInfo.fightedNum;
            //设置战斗记录
            this.model.attackWinList = [0, 0, 0];
            if (this.model.matchInfo.fightResults.length > 0) {
                this.model.matchInfo.fightResults.forEach((res, index) => {
                    this.model.attackWinList[index] = res + 1;
                })
            }
            //进入战斗
            //JumpUtils.openPveArenaScene()
            let p = this.model.opponents[index].brief;//infos.playerId == infos.player1.playerId ? infos.player2 : infos.player1;
            let player = new icmsg.ArenaPlayer();
            player.id = p.id;
            player.robotId = null;
            player.name = p.name;
            player.head = p.head;
            player.frame = p.headFrame;
            player.level = p.level;
            player.power = p.power;
            JumpUtils.openPveArenaScene([player.id, 0, player], player.name, 'ARENATEAM');

        }, this)
    }

    //打开排行榜页面
    openArenaTeamRankView() {
        gdk.panel.setArgs(PanelId.ArenaTeamRankView, this.lock);
        gdk.panel.open(PanelId.ArenaTeamRankView);
    }
    //打开奖励界面
    openArenaTeamRewardView() {
        gdk.panel.open(PanelId.ArenaTeamChallengeRewardView);
    }
    //打开对战记录界面
    openArenaTeamAttackListView() {
        gdk.panel.open(PanelId.ArenaTeamRecordView);
    }
    //打开商店界面
    openArenaTeamStoreView() {
        PanelId.Store.onHide = {
            func: () => {
                gdk.panel.open(PanelId.ArenaTeamView);
            }
        }
        JumpUtils.openView(1722, true);
    }

    //设置防御阵营
    openDefenderBtnClick() {
        gdk.panel.setArgs(PanelId.RoleSetUpHeroSelector, 1, 5)
        gdk.panel.open(PanelId.RoleSetUpHeroSelector);
    }


    spineBtnClick(e: cc.Event, idx: string) {
        let index = parseInt(idx);
        if (this.legends.length > index) {
            gdk.panel.setArgs(PanelId.MainSet, this.legends[index].player.brief.id)
            gdk.panel.open(PanelId.MainSet)
        }
    }

}
