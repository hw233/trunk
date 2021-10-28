import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildModel from '../../model/GuildModel';
import GuildPowerBossCtrl from './GuildPowerBossCtrl';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { ActivityEventId } from '../../../act/enum/ActivityEventId';
import { Guildpower_boss_hpCfg, Guildpower_bossCfg, Guildpower_globalCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';


export enum GuildPowerBossState {
    UnStart = 0, // 未开启
    Gathering = 1,  //集结中
    Fighting = 2, // 战斗中
    End = 3,  //已结束
}

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-28 10:08:06
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/power/GuildPowerViewCtrl")
export default class GuildPowerViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    bossName: cc.Label = null;

    @property(cc.Node)
    lineNodes: cc.Node[] = [];

    @property(cc.Node)
    bossNodes: cc.Node[] = [];

    @property(cc.RichText)
    totalPower: cc.RichText = null;

    @property(cc.RichText)
    targetPower: cc.RichText = null;

    @property(cc.RichText)
    gatherNum: cc.RichText = null;

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null;

    @property(cc.Label)
    percentLab: cc.Label = null;

    @property(cc.Node)
    rewardContent: cc.Node = null;

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null;

    @property(cc.Button)
    btnGather: cc.Button = null;

    @property(cc.Label)
    btnLab: cc.Label = null;

    @property(cc.Node)
    rankHide: cc.Node = null;

    @property(cc.Node)
    rankShow: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    rankItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    gatherRedPoint: cc.Node = null;

    @property(cc.Node)
    btnGet: cc.Node = null;

    @property(cc.Node)
    hasGet: cc.Node = null;

    @property(cc.Label)
    txtLab: cc.Label = null;

    @property(cc.Label)
    noRewardTip: cc.Label = null;

    list: ListView;
    _rankIsShow = false

    get guildModel() { return ModelManager.get(GuildModel); }
    _bossCfg: Guildpower_bossCfg
    _bossCtrl: GuildPowerBossCtrl[] = []
    _curState: number = 0 //当前的阶段
    _curDay: number = 0
    _cfgHp: number = 0; //目标战斗力

    onEnable() {
        gdk.e.on(ActivityEventId.UPDATE_NEW_DAY, this._updateViewInfo, this);//跨天更新信息
        NetManager.on(icmsg.GuildGatherStateRsp.MsgType, this._onGuildGatherStateRsp, this)

        let msg = new icmsg.GuildGatherStateReq()
        NetManager.send(msg)

        this._initBossDatas()
        this._updateViewInfo()
        this._createTimer()
    }

    onDisable() {
        gdk.e.targetOff(this)
        NetManager.targetOff(this)
        this._clearTimer()
    }

    _onGuildGatherStateRsp(data: icmsg.GuildGatherStateRsp) {
        this.guildModel.playerPower = data.power
        this.guildModel.totalPower = data.totalPower
        this.guildModel.numberCount = data.numberCount
        this.guildModel.heroOn = data.heroOn
        this.guildModel.hasReward = data.reward
        this.guildModel.getRewarded = data.rewarded
        this.guildModel.powerWorldLv = data.worldLevel || 1
        this.guildModel.powerStar = data.star
        this.guildModel.confirm = data.confirm
        this._updateViewInfo()
    }

    _initBossDatas() {
        let cfgs = ConfigManager.getItems(Guildpower_bossCfg)
        for (let i = 0; i < this.bossNodes.length; i++) {
            let ctrl = this.bossNodes[i].getComponent(GuildPowerBossCtrl)
            ctrl.updateViewInfo(cfgs[i])
            this._bossCtrl.push(ctrl)
        }
    }

    @gdk.binding("guildModel.totalPower")
    @gdk.binding("guildModel.numberCount")
    updateGatherInfo() {
        this.totalPower.string = `合计战力：<color=#00ff00>${this.guildModel.totalPower}</c>`
        let bossHpCfg = ConfigManager.getItemByField(Guildpower_boss_hpCfg, "world_lv", this.guildModel.powerWorldLv)
        this._cfgHp = this._bossCfg.type == 1 ? bossHpCfg.common_hp : bossHpCfg.endless_hp
        this.targetPower.string = `目标战力：<color=#00ff00>${this._cfgHp}</c>`
        this.gatherNum.string = `已集结<color=#00ff00>${this.guildModel.numberCount}人</c>`

        this.proBar.node.parent.active = true
        this.percentLab.node.active = true
        this.proBar.progress = this.guildModel.totalPower / this._cfgHp
        this.percentLab.string = `${Math.floor(this.guildModel.totalPower / this._cfgHp * 100)}%`
        if (this._bossCfg.type == 2) {
            this.targetPower.string = `目标战力：??????`
            this.proBar.node.parent.active = false
            this.percentLab.node.active = false
        }
    }

    updateBtnState() {
        switch (this._curState) {
            case GuildPowerBossState.UnStart:
                let timeCfg = ConfigManager.getItemById(Guildpower_globalCfg, "monster_open").value
                this.btnLab.string = `${timeCfg[0]}:00开启`
                break
            case GuildPowerBossState.Gathering:
                if (this.guildModel.confirm) {
                    this.btnLab.string = `集结中`
                } else {
                    this.btnLab.string = `集结`
                }
                break
            case GuildPowerBossState.Fighting:
                this.btnLab.string = `战斗中`
                break
            case GuildPowerBossState.End:
                this.btnLab.string = `已结束`
                break
        }
        if (this._bossCtrl[this._curDay - 1]) {
            this._bossCtrl[this._curDay - 1].updateTimeLab()
        }

        this.btnGet.active = false
        if (this.guildModel.hasReward && !this.guildModel.getRewarded) {
            this.btnGet.active = true
        }
        this.hasGet.active = this.guildModel.getRewarded

        this.gatherRedPoint.active = false
        if (this._curState == GuildPowerBossState.Gathering && !this.guildModel.confirm) {
            this.gatherRedPoint.active = true
        }

        if (this._curState == GuildPowerBossState.Gathering) {
            if (this.guildModel.confirm) {
                GlobalUtil.setGrayState(this.btnGather.node, 1)
            } else {
                GlobalUtil.setGrayState(this.btnGather.node, 0)
            }
        } else {
            GlobalUtil.setGrayState(this.btnGather.node, 1)
        }
    }

    _updateViewInfo() {
        let nowTime = new Date(GlobalUtil.getServerTime())
        this._curDay = nowTime.getDay() || 7; // 当前时间的星期几
        this._bossCfg = ConfigManager.getItemByField(Guildpower_bossCfg, "open", this._curDay)
        this.bossName.string = `${this._bossCfg.name}`

        for (let i = 0; i < this.lineNodes.length; i++) {
            let on = this.lineNodes[i].getChildByName("on")
            let off = this.lineNodes[i].getChildByName("off")
            if (i < this._curDay) {
                this._bossCtrl[i].updateBossState(true)
                on.active = true
                off.active = false
            } else {
                this._bossCtrl[i].updateBossState(false)
                on.active = false
                off.active = true
            }
            this._bossCtrl[i].updateIsEnd(i + 1 < this._curDay)
        }

        if (this._bossCtrl[this._curDay - 1]) {
            this._bossCtrl[this._curDay - 1].selectBoss()
        }

        this.noRewardTip.node.active = false
        this.rewardContent.removeAllChildren();
        this.txtLab.node.active = true
        //已结束，显示结算奖励
        let rewards = []
        if (this._curState == GuildPowerBossState.End) {
            if (this.guildModel.hasReward) {
                if (this._bossCfg.type == 1) {
                    rewards = this._bossCfg.reward
                } else {
                    let power_percent = ConfigManager.getItemById(Guildpower_globalCfg, "power_percent").value
                    let percent = Math.floor(this.guildModel.totalPower / this._cfgHp * 100)
                    if (percent > power_percent[2]) {
                        rewards = this._bossCfg.percent_reward3
                    } else if (percent > power_percent[1]) {
                        rewards = this._bossCfg.percent_reward2
                    } else if (percent > power_percent[0]) {
                        rewards = this._bossCfg.percent_reward1
                    }
                    let reward = [[this._bossCfg.extra_reward[0][0], this._bossCfg.extra_reward[0][2]]]
                    rewards = rewards.concat(reward)
                }
            } else {
                this.txtLab.node.active = false
                this.rewardContent.removeAllChildren();
                this.btnGet.active = false
                this.noRewardTip.node.active = true
            }
        } else {
            rewards = this._bossCfg.reward_show
        }
        rewards.forEach(item => {
            let slot = cc.instantiate(this.rewardItem);
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(item[0], item[1]);
            slot.scale = 0.7
            slot.parent = this.rewardContent;
            ctrl.itemInfo = {
                series: null,
                itemId: item[0],
                itemNum: item[1],
                type: BagUtils.getItemTypeById(item[0]),
                extInfo: null
            };
        });



        this.updateGatherInfo()
    }

    onOpenHeroSelector() {
        if (this._curState == GuildPowerBossState.UnStart) {
            let timeCfg = ConfigManager.getItemById(Guildpower_globalCfg, "monster_open").value
            gdk.gui.showMessage(`集结${timeCfg[0]}点开启`)
            return
        } else if (this._curState == GuildPowerBossState.Gathering) {
            if (this.guildModel.confirm) {
                gdk.gui.showMessage("阵容已经集结完毕")
                return
            }
        } else if (this._curState == GuildPowerBossState.Fighting) {
            gdk.gui.showMessage("正在战斗中")
            return
        } else if (this._curState == GuildPowerBossState.End) {
            gdk.gui.showMessage("今日集结已结束")
            return
        }
        gdk.panel.setArgs(PanelId.GuildPowerSetUpHeroSelector, this._bossCfg)
        gdk.panel.open(PanelId.GuildPowerSetUpHeroSelector)
    }

    onGetReward() {
        if (!this.guildModel.hasReward) {
            gdk.gui.showMessage("战斗结束后才可领取奖励")
            return
        }
        let msg = new icmsg.GuildGatherRewardReq()
        NetManager.send(msg, (data: icmsg.GuildGatherRewardRsp) => {
            this.guildModel.getRewarded = data.rewarded
            this.btnGet.active = false
            this.hasGet.active = true
            GlobalUtil.openRewadrView(data.rewards)
        })
    }

    /**公会排行 */
    onRank() {
        gdk.panel.open(PanelId.GuildPowerRankView)
    }

    /**当前排行 */
    onCurRankShow() {
        this._rankIsShow = !this._rankIsShow
        this.rankHide.active = !this._rankIsShow
        this.rankShow.active = this._rankIsShow

        if (this.rankShow.active) {
            let msg = new icmsg.GuildGatherRankReq()
            NetManager.send(msg, (data: icmsg.GuildGatherRankRsp) => {
                this._initList()
                this.list.set_data(data.list)
            })
        }
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.rankItemPrefab,
                cb_host: this,
                gap_y: 2,
                async: true,
                direction: ListViewDir.Vertical,
            });
        }
    }

    //计时器
    _createTimer() {
        this._updateTimer()
        this._clearTimer()
        this.schedule(this._updateTimer, 1)
    }

    _updateTimer() {
        let timeCfg = ConfigManager.getItemById(Guildpower_globalCfg, "monster_open").value
        let openTime = timeCfg[0] * 3600
        let closeTime = timeCfg[1] * 3600
        let fightTime = 3600
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let zeroTime = TimerUtils.getZerohour(curTime)
        if (curTime < zeroTime + openTime) {
            this._curState = GuildPowerBossState.UnStart
        } else {
            if (curTime < zeroTime + closeTime) {
                this._curState = GuildPowerBossState.Gathering
            } else {
                if (curTime < zeroTime + closeTime + fightTime) {
                    this._curState = GuildPowerBossState.Fighting
                } else {
                    this._curState = GuildPowerBossState.End
                    //结束的时候请求最新状态
                    if (curTime == zeroTime + closeTime + fightTime + 5) {
                        let msg = new icmsg.GuildGatherStateReq()
                        NetManager.send(msg)
                    }
                }
            }
        }
        this.updateBtnState()
    }

    _clearTimer() {
        this.unschedule(this._updateTimer)
    }


}