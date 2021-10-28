import ButtonSoundId from '../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RewardPreviewCtrl from '../../../common/widgets/RewardPreviewCtrl';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import TaskModel from '../model/TaskModel';
import TaskUtil from '../util/TaskUtil';
import TimerUtils from '../../../common/utils/TimerUtils';
import {
    GlobalCfg,
    Mission_achievementCfg,
    Mission_daily_activeCfg,
    Mission_dailyCfg,
    Mission_guildCfg,
    Mission_main_lineCfg,
    Mission_weekly_activeCfg,
    Mission_weeklyCfg,
    SystemCfg,
    VipCfg
    } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { TaskEventId } from '../enum/TaskEventId';
/**
 * @Description: 任务界面控制器
 * @Author: weiliang.huang
 * @Date: 2019-03-25 15:22:12
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-09 14:44:33
 */

const { ccclass, property, menu } = cc._decorator;

export type TaskItemType = {
    type: number,
    state: number,   // 任务状态 0:可领取 1:未完成 2:已领取
    cfg: Mission_dailyCfg | Mission_achievementCfg | Mission_weeklyCfg | Mission_main_lineCfg | Mission_guildCfg
    isOpen: number, //是否已开启 0未开启 1已开启  排序已开启的要排在前面
}

//1日常，2周常，3成就，4主线，5七天
export enum MissionType {
    daily = 1,
    weekly = 2,
    achieve = 3,
    mainLine = 4,
    sevenDay = 5,
    guild = 6,
    flipCard = 7,
    grading = 8,
    diary = 10,
    carnivalDaily = 11,
    carnivalUltimate = 12,
    footholdDaily = 13,
    footholdRank = 14,
    relicDaily = 15,
    relicWeekly = 16,
    combineDaily = 17,
    combineUltimate = 18,
    linkGame = 19,
    cave = 20,
    costumeCustom = 21,
}

@ccclass
@menu("qszc/view/task/TaskViewCtrl")
export default class TaskViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    mask: cc.Node = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    taskItem: cc.Prefab = null

    @property(cc.ToggleContainer)
    selectBtns: cc.ToggleContainer = null;

    @property(cc.Node)
    activeNode: cc.Node = null;

    @property(cc.Node)
    timeNode: cc.Node = null;

    @property(cc.Node)
    flyPosNode: cc.Node = null;

    @property(cc.Node)
    boxNodes: cc.Node[] = [];

    @property(cc.Label)
    totalLab: cc.Label = null;

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null;

    @property(cc.Label)
    reFreshTimeLab: cc.Label = null;

    @property(cc.Node)
    activeIcon: cc.Node = null

    @property(cc.Node)
    vipUpTipNode: cc.Node = null;

    curIndex: number = -1
    taskList: Array<TaskItemType> = []
    list: ListView = null;
    targetTime: number
    activeCfgs = []
    _lastSelect: number = -1

    //0:日常 1:周常 2:主线 3:成就 选项类型转化成服务端定义的类型
    targetType = {
        0: MissionType.daily,
        1: MissionType.weekly,
        2: MissionType.mainLine,
        3: MissionType.achieve,
        4: MissionType.guild,//公会任务
    }

    get model(): TaskModel { return ModelManager.get(TaskModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    onLoad() {
        this.title = 'i18n:TASK_TITLE'
        gdk.e.on(TaskEventId.UPDATE_TASK_AWARD_STATE, this._updateTaskAward, this)
        gdk.e.on(TaskEventId.UPDATE_GUILD_TASK_REWARD, this._updateTaskAward, this)
        TaskUtil.initTaskConfig()
        TaskUtil.initMainLineConfig()
    }

    start() {

    }

    onEnable() {

        let arg = this.args
        if (arg && arg.length > 0) {
            this.curIndex = arg[0]
            if (this.curIndex == 4) {
                for (let idx = 0; idx < this.selectBtns.node.children.length; idx++) {
                    let btn = this.selectBtns.node.children[idx]
                    btn.active = this.curIndex == idx
                }
            }
            this.selectType(1, this.curIndex)
            return
        }
        //请求竞技场数据  成就里需要相关信息处理
        let msg = new icmsg.ArenaInfoReq();
        NetManager.send(msg);
        // msg = new RankArenaReq();
        // NetManager.send(msg)
        let msg2 = new icmsg.RankDetailReq()
        msg2.type = 5
        NetManager.send(msg2);
        let id = [1600, 1601, 1602, 1603, 2400];
        let btns = this.selectBtns.node.children;
        btns[0].active = JumpUtils.ifSysOpen(1600);
        btns[1].active = JumpUtils.ifSysOpen(1601);
        btns[2].active = JumpUtils.ifSysOpen(1602);
        btns[3].active = JumpUtils.ifSysOpen(1603);
        btns[4].active = JumpUtils.ifSysOpen(2400);
        let minActiveId = 2;
        for (let i = 0; i < btns.length; i++) {
            if (btns[i].active) {
                minActiveId = i;
                break;
            }
        }
        if (this.curIndex != -1) {
            if (!btns[this.curIndex].active) {
                gdk.gui.showMessage(`${ConfigManager.getItemById(SystemCfg, id[this.curIndex]).name}尚未解锁`);
                this.selectType(1, minActiveId)
            }
            else {
                this.selectType(1, this.curIndex)
            }
        } else {
            this.selectType(1, minActiveId)
        }
    }


    onDestroy() {
        gdk.e.targetOff(this)
        if (this.list) {
            this.list.destroy()
        }
        this.model.isGuide = true
        this.unscheduleAllCallbacks()
    }

    @gdk.binding('roleModel.vipExp')
    _updateVipUpTip() {
        if (this.roleModel.vipLv >= 3 || this.curIndex !== 0) {
            this.vipUpTipNode.active = false;
        }
        else {
            this.vipUpTipNode.active = true;
            let nextVipCfg = ConfigManager.getItemByField(VipCfg, 'level', this.roleModel.vipLv);
            let dExp = nextVipCfg.exp - this.roleModel.vipExp;
            let cfgs = ConfigManager.getItems(Mission_daily_activeCfg, (cfg: Mission_daily_activeCfg) => {
                if (cfg.index == 4 && cfg.order >= this.model.dailyRoundId) {
                    return true;
                }
            });
            cfgs.sort((a, b) => { return a.order - b.order; });
            let day = 0;
            for (let i = 0; i < cfgs.length; i++) {
                cfgs[i].reward.forEach(item => {
                    if (item[0] == 18) {
                        dExp -= item[1];
                    }
                });
                if (dExp <= 0) {
                    day = i;
                    break;
                }
            }
            let str = day == 0 ? gdk.i18n.t('i18n:TASK_TIP13') : `${day}${gdk.i18n.t('i18n:TASK_TIP14')}`;
            cc.find('layout/lab', this.vipUpTipNode).getComponent(cc.Label).string = str;
            cc.find('layout/VipFlag/bg/vipLv', this.vipUpTipNode).getComponent(cc.Label).string = `${nextVipCfg.level + 1}`;
        }
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.mask,
            content: this.content,
            item_tpl: this.taskItem,
            cb_host: this,
            gap_y: 20,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    /**更新滑动列表 */
    _updateTaskScroll(resetPos: boolean = true) {
        this._initListView()
        if (resetPos) {
            this.scrollView.stopAutoScroll()
        }
        this.list.set_data(this.taskList, resetPos)

        this.scheduleOnce(() => {
            this.list.select_item(0)
        })
    }

    /**选择页签, 筛选任务类型
     * 0:日常 1:周常 2:主线 3:成就
    */
    selectType(e, utype) {
        utype = parseInt(utype)
        this.curIndex = utype

        if (this.curIndex == 4 && this.roleModel.guildId <= 0) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:TASK_TIP15'))
            for (let idx = 0; idx < this.selectBtns.toggleItems.length; idx++) {
                let toggle = this.selectBtns.toggleItems[idx]
                if (idx == this._lastSelect) {
                    toggle.check()
                }
            }
            return
        }
        this._lastSelect = this.curIndex
        for (let idx = 0; idx < this.selectBtns.toggleItems.length; idx++) {
            let toggle = this.selectBtns.toggleItems[idx]
            let selected = idx == this.curIndex
            if (selected) {
                toggle.check()
            }
            let labNode = toggle.node.getComponentInChildren(cc.Label).node;
            labNode.color = selected ? cc.color("#FFEB91") : cc.color("#C8B89D");
            labNode.getComponent(cc.LabelOutline).color = selected ? cc.color("#5E400F") : cc.color("#594533");
            toggle.interactable = !selected;
        }

        let widget = this.scrollView.getComponent(cc.Widget)
        if (this.curIndex == 0 || this.curIndex == 1) {
            widget.top = 260
            this.activeNode.active = true
            this.timeNode.active = true
            this._updateRefreshTime()
        } else if (this.curIndex == 4) {
            widget.top = 120
            this.activeNode.active = false
            this.timeNode.active = true
            this._updateRefreshTime()
        } else {
            widget.top = 100
            this.activeNode.active = false
            this.timeNode.active = false
            this.unscheduleAllCallbacks();
        }
        widget.updateAlignment()

        if (this.curIndex != 4) {
            let model = this.model
            let list = TaskUtil.getTaskList(utype)
            this.taskList = []
            for (let index = 0; index < list.length; index++) {
                const cfg = list[index];
                // 是否已完成
                let finish = TaskUtil.getTaskState(cfg.id)
                let geted = model.rewardIds[cfg.id] || 0
                // 任务状态 0:可领取 1:未完成 2:已领取
                let state = 1
                if (finish) {
                    if (geted == 0) {
                        state = 0
                    } else {
                        state = 2
                    }
                }
                let isOpen = 0
                if (cfg instanceof Mission_dailyCfg && TaskUtil.getDailyTaskIsOpen(cfg.id)) {
                    isOpen = 1
                } else if (cfg instanceof Mission_weeklyCfg && TaskUtil.getWeeklyTaskIsOpen(cfg.id)) {
                    isOpen = 1
                } else if (cfg instanceof Mission_achievementCfg && TaskUtil.getAchieveTaskIsOpen(cfg.id)) {
                    isOpen = 1
                } else if (cfg instanceof Mission_main_lineCfg && TaskUtil.getMainLineTaskIsOpen(cfg.id)) {
                    isOpen = 1
                }

                let info: TaskItemType = { type: parseInt(this.targetType[utype]), state: state, cfg: cfg, isOpen: isOpen }
                // if (cfg.target == 701 && !finish) {//月卡每日奖励默认不显示，月卡1
                //     continue
                // }
                // if (cfg.target == 702 && !finish) {//月卡每日奖励默认不显示，月卡2
                //     continue
                // }
                // if (cfg.target == 703 && !finish) {//月卡每日奖励默认不显示，月卡3
                //     continue
                // }
                // if (cfg instanceof Mission_dailyCfg) {
                //     if (!TaskUtil.getDailyTaskIsOpen(cfg.id)) continue;
                // }

                // if (cfg instanceof Mission_weeklyCfg) {
                //     if (!TaskUtil.getWeeklyTaskIsOpen(cfg.id)) continue;
                // }

                // if (cfg instanceof Mission_achievementCfg) {
                //     if (!TaskUtil.getAchieveTaskIsOpen(cfg.id)) continue;
                // }

                if (cfg instanceof Mission_main_lineCfg) {
                    if (!TaskUtil.getMainLineTaskIsOpen(cfg.id)) continue;
                }
                this.taskList.push(info)
            }
            this._refreshTaskView(e)
        } else {
            let guildCfgs = ConfigManager.getItems(Mission_guildCfg)
            //公会任务处理
            let msg = new icmsg.GuildMissionListReq()
            NetManager.send(msg, (data: icmsg.GuildMissionListRsp) => {
                let guildDatas = {}
                for (let index = 0; index < data.progressList.length; index++) {
                    const element: icmsg.MissionProgress = data.progressList[index];
                    if (!guildDatas[element.type]) {
                        guildDatas[element.type] = {}
                    }
                    guildDatas[element.type][element.arg] = element
                }
                this.model.guildDatas = guildDatas
                for (let n = 0; n < data.missionRewarded.length; n++) {
                    for (let j = 0; j < guildCfgs.length; j++) {
                        if (Math.pow(2, guildCfgs[j].id - 1) & data.missionRewarded[n]) {
                            this.model.guildRewardIds[guildCfgs[j].id] = 1
                        }
                    }
                }
                this.taskList = []
                for (let i = 0; i < guildCfgs.length; i++) {
                    if (guildCfgs[i].hidden) {
                        continue
                    }
                    let finish = TaskUtil.getGuildTaskState(guildCfgs[i].id)
                    let geted = this.model.guildRewardIds[guildCfgs[i].id] || 0
                    // 任务状态 0:可领取 1:未完成 2:已领取
                    let state = 1
                    if (finish) {
                        if (geted == 0) {
                            state = 0
                        } else {
                            state = 2
                        }
                    }
                    let info: TaskItemType = { type: parseInt(this.targetType[utype]), state: state, cfg: guildCfgs[i], isOpen: 1 }
                    this.taskList.push(info)
                }
                this._refreshTaskView(e)
            })
        }
    }

    _refreshTaskView(e) {
        /**任务列表排序, */
        GlobalUtil.sortArray(this.taskList, (a, b) => {
            if (a.state == b.state) {
                if (a.isOpen == b.isOpen) {
                    return a.cfg.id - b.cfg.id
                }
                return b.isOpen - a.isOpen // 已开启>未开启
            }
            return a.state - b.state
        })

        let resetPos = true
        if (!e) {
            resetPos = false
        }
        this._updateTaskScroll(resetPos)
        if (this.curIndex == 0 || this.curIndex == 1) {
            let isEffect = !resetPos
            this._initBoxInfo(isEffect)
        }

        this._updateVipUpTip();
    }

    _initBoxInfo(isEffect) {
        for (let i = 0; i < this.boxNodes.length; i++) {
            this.boxNodes[i].active = false
        }
        let boxOpened = ""
        let totalActive = 0
        let maxValue = 0
        let lastProgress = this.proBar.progress
        if (this.curIndex == 0) {
            this.activeCfgs = ConfigManager.getItemsByField(Mission_daily_activeCfg, "order", this.model.dailyRoundId)
            maxValue = this.activeCfgs[this.activeCfgs.length - 1].value
            this.totalLab.string = `${TaskUtil.getDailyTotalActive()}`
            totalActive = TaskUtil.getDailyTotalActive()
            boxOpened = this.model.daily.boxOpened.toString(2)
            if (isEffect) {
                this.proBar.progress = lastProgress
                this.schedule(() => {
                    this.proBar.progress += (TaskUtil.getDailyTotalActive() / maxValue - lastProgress) / 10
                }, 0.05, 10)
            } else {
                this.proBar.progress = TaskUtil.getDailyTotalActive() / maxValue
            }
        } else if (this.curIndex == 1) {
            this.activeCfgs = ConfigManager.getItems(Mission_weekly_activeCfg)
            maxValue = this.activeCfgs[this.activeCfgs.length - 1].value
            this.totalLab.string = `${TaskUtil.getWeeklyTotalActive()}`
            totalActive = TaskUtil.getWeeklyTotalActive()
            boxOpened = (this.model.weekly ? this.model.weekly.boxOpened : 0).toString(2)
            if (isEffect) {
                this.proBar.progress = lastProgress
                this.schedule(() => {
                    this.proBar.progress += (TaskUtil.getWeeklyTotalActive() / maxValue - lastProgress) / 10
                }, 0.05, 10)
            } else {
                this.proBar.progress = TaskUtil.getWeeklyTotalActive() / maxValue
            }
        }
        while (boxOpened.length < 5) {
            boxOpened = "0" + boxOpened
        }
        let ids = boxOpened.split("").reverse()
        for (let i = 0; i < this.activeCfgs.length; i++) {
            let node = this.boxNodes[i]
            if (!node) continue;
            node.active = true
            node.x = this.proBar.node.x + this.proBar.node.width / maxValue * this.activeCfgs[i].value
            let lab = node.getChildByName("lab").getComponent(cc.Label)
            let on = node.getChildByName("on")
            let off = node.getChildByName("off")
            GlobalUtil.setSpriteIcon(node, on, `view/task/texture/reward/${this.activeCfgs[i].reward_icon}_open`)
            GlobalUtil.setSpriteIcon(node, off, `view/task/texture/reward/${this.activeCfgs[i].reward_icon}`)
            off.angle = 0
            let ani = off.getComponent(cc.Animation)
            ani.stop("reward_shake")
            if (ids[i] == "1") {
                on.active = true
                off.active = false
            } else {
                on.active = false
                off.active = true
                if (totalActive >= this.activeCfgs[i].value) {
                    ani.play("reward_shake")
                }
            }
            lab.string = this.activeCfgs[i].value
        }
    }

    _updateTaskAward() {
        this.selectType(null, this.curIndex)
    }


    boxClick(e, index) {
        let boxOpened = ""

        let rewards = []
        let totalActive = 0
        let boxActive = 0
        if (this.curIndex == 0) {
            let cfg = ConfigManager.getItemByField(Mission_daily_activeCfg, "index", parseInt(index), { order: this.model.dailyRoundId })
            if (cfg) {
                rewards = cfg.reward
                boxActive = cfg.value
            }
            boxOpened = this.model.daily.boxOpened.toString(2)
            totalActive = TaskUtil.getDailyTotalActive()
        } else if (this.curIndex == 1) {
            let cfg = ConfigManager.getItemById(Mission_weekly_activeCfg, parseInt(index))
            if (cfg) {
                rewards = cfg.reward
                boxActive = cfg.value
            }
            boxOpened = (this.model.weekly ? this.model.weekly.boxOpened : 0).toString(2)
            totalActive = TaskUtil.getWeeklyTotalActive()
        }

        while (boxOpened.length < 5) {
            boxOpened = "0" + boxOpened
        }

        let ids = boxOpened.split("").reverse()
        // 不可领取奖励，则显示预览
        if (ids[index - 1] == "1") {
            this._showReward(rewards, gdk.i18n.t('i18n:TASK_TIP16'), true, parseInt(index))
            return
        }
        if (totalActive >= boxActive) {

            this.storeModel.vipPreLv = ModelManager.get(RoleModel).vipLv
            this.storeModel.vipPreExp = ModelManager.get(RoleModel).vipExp

            let msg = new icmsg.MissionRewardReq();
            msg.kind = 2
            msg.type = this.curIndex + 1
            msg.id = (index - 1)
            NetManager.send(msg, () => {
                gdk.sound.isOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.income)
            });
        } else {
            this._showReward(rewards, gdk.i18n.t('i18n:TASK_TIP17'), false, parseInt(index))
        }
    }

    _showReward(rewards, title, isGet, index) {
        let arr: icmsg.GoodsInfo[] = [];
        // let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        // let serverOpenTime = GlobalUtil.getServerOpenTime()
        let createTime = TaskUtil.getCrateRoleDays()
        rewards.forEach(e => {
            if (!e || cc.js.isString(e)) return;
            if (e[0] != 12 || (e[0] == 12 && createTime >= 8)) {
                let goodsInfo = new icmsg.GoodsInfo();
                goodsInfo.typeId = e[0];
                goodsInfo.num = e[1];
                arr.push(goodsInfo);
            }
        });
        if (arr && arr.length > 0) {
            PanelId.RewardPreview.maskAlpha = 0;
            PanelId.RewardPreview.onHide = {
                func: () => {
                    PanelId.RewardPreview.maskAlpha = 180;
                }
            }
            gdk.panel.open(PanelId.RewardPreview, (node: cc.Node) => {
                let ctrl = node.getComponent(RewardPreviewCtrl);
                ctrl.setRewards(arr, title, "", null, this, isGet);
                if (index < this.activeCfgs.length) {
                    node.setPosition(this.boxNodes[index - 1].x, this.flyPosNode.y - 55);
                } else {
                    // node.setPosition(this.boxNodes[index - 1].x - 150, this.flyPosNode.y - 55);
                    node.setPosition(360 - ctrl.bg.width / 2, this.flyPosNode.y - 55)
                }

            }, this);
        }
    }

    _updateRefreshTime() {
        if (this.curIndex == 0) {
            let nowTime = GlobalUtil.getServerTime();
            let nextDate = new Date();
            nextDate.setTime(nowTime + 86400 * 1000);
            nextDate.setHours(0);
            nextDate.setMinutes(0);
            nextDate.setSeconds(0);
            let targetTime = nextDate.getTime();
            this.targetTime = targetTime;
        } else if (this.curIndex == 1) {
            let nowTime = GlobalUtil.getServerTime();
            let nextDate = new Date(nowTime);
            let day = nextDate.getDay()
            if (day == 0) {
                day = 7
            }
            nextDate.setTime(nowTime + 86400 * 1000 * (8 - day));
            nextDate.setHours(0);
            nextDate.setMinutes(0);
            nextDate.setSeconds(0);
            let targetTime = nextDate.getTime();
            this.targetTime = targetTime;
        } else if (this.curIndex == 4) {
            let nowTime = GlobalUtil.getServerTime();
            let nextDate = new Date(nowTime);
            let day = nextDate.getDay()
            if (day == 0) {
                day = 7
            }
            let cfgDay = ConfigManager.getItemByField(GlobalCfg, "key", "min_activity_days").value[0]
            let openTime = GlobalUtil.getServerOpenTime() * 1000
            let addDay = 8 - day
            if (openTime > nowTime - cfgDay * 24 * 60 * 60 * 1000) {
                let openDay = (new Date(openTime)).getDay()
                if (openDay == 0) {
                    openDay = 7
                }
                addDay = 7 - openDay + 8
                nextDate.setTime(openTime + 86400 * 1000 * addDay);
            } else {
                nextDate.setTime(nowTime + 86400 * 1000 * addDay);
            }

            nextDate.setHours(0);
            nextDate.setMinutes(0);
            nextDate.setSeconds(0);

            let targetTime = nextDate.getTime();
            this.targetTime = targetTime;
        }

        this.unscheduleAllCallbacks();
        this.schedule(this._updateSecond.bind(this), 1, cc.macro.REPEAT_FOREVER);
        this._updateSecond();
    }

    _updateSecond() {
        let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000);
        let detalTime = this.targetTime / 1000 - nowTime;
        if (detalTime <= 0) {
            this.unscheduleAllCallbacks();
            return;
        }
        detalTime = Math.floor(detalTime);
        if (detalTime > 86400) {
            this.reFreshTimeLab.string = `${TimerUtils.format1(detalTime)}`
        } else {
            this.reFreshTimeLab.string = `${TimerUtils.format2(detalTime)}`
        }
    }

    openIconTip() {
        GlobalUtil.openCommonInfoTip(this.activeIcon, 11)
    }
}

