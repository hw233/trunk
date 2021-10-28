import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import CarnivalUtil from '../../util/CarnivalUtil';
import CopyUtil from '../../../../common/utils/CopyUtil';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import RewardItem from '../../../../common/widgets/RewardItem';
import RoleModel from '../../../../common/models/RoleModel';
import TaskModel from '../../../task/model/TaskModel';
import TaskUtil from '../../../task/util/TaskUtil';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { Carnival_dailyCfg, Carnival_rewardsCfg, Carnival_ultimateCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { TaskEventId } from '../../../task/enum/TaskEventId';

/** 
 * @Description:跨服任务界面
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-06 16:26:23
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class CServerTaskViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;
    @property(cc.Label)
    myrankNum: cc.Label = null;
    @property(cc.Label)
    myScore: cc.Label = null;
    @property(cc.Sprite)
    rankBgSp: cc.Sprite = null;

    @property([cc.Node])
    rewardList: cc.Node[] = [];
    @property([cc.Node])
    rewardTipList: cc.Node[] = [];
    @property([cc.Node])
    liangNodes: cc.Node[] = []
    @property([cc.Label])
    scoreList: cc.Label[] = []
    @property(UiTabMenuCtrl)
    taskMenuBtn: UiTabMenuCtrl = null
    @property(cc.Node)
    scoreSp: cc.Node = null;

    @property(cc.Node)
    red1Node: cc.Node = null;
    @property(cc.Node)
    red2Node: cc.Node = null;
    @property(cc.Node)
    red3Node: cc.Node = null;


    list: ListView = null;
    curType: number;
    maxW: number = 448;
    activityId: number = 66;

    get model(): ActivityModel { return ModelManager.get(ActivityModel); }
    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }
    curDay: number = 1;
    actOver: boolean = false
    firstenter: boolean = true;
    scoreColor: cc.Color[] = [cc.color("#FFF600"), cc.color("#CAC5FF")]
    rankBgStrs: string[] = ['kfkh_huizhanglvse', 'kfkh_huizhanglanse', 'kfkh_huizhangzise', 'kfkh_huizhangchengse', 'kfkh_huizhanghongse']
    scoreCfgs: Carnival_rewardsCfg[] = [];
    scoreData: icmsg.CarnivalInfoRsp;
    onEnable() {
        //显示活动时间
        gdk.e.on(TaskEventId.UPDATE_TASK_AWARD_STATE, this._updateDataLater, this)
        gdk.e.on(TaskEventId.UPDATE_ONE_TASK, this._updateDataLater, this)

        this.red1Node.active = !this.model.enterCServerTask
        if (!this.model.enterCServerTask) {
            this.model.enterCServerTask = true;
        }
        let temStartTime = ActUtil.getActStartTime(this.activityId)
        let temEndTime = ActUtil.getActEndTime(this.activityId) - 5000
        let startTime = new Date(temStartTime);
        let endTime = new Date(temEndTime); //time为零点,减去5s 返回前一天
        if (!temStartTime || !temEndTime) {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1")//`活动已过期`;
            this.actOver = true;
        }
        else {
            this.actOver = false;
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }
        let temStart = ActUtil.getActStartTime(this.activityId)
        let curTime = GlobalUtil.getServerTime();
        let temDay = Math.floor(((curTime - temStart) / 1000) / 86400) + 1
        this.curDay = temDay > 3 ? 3 : temDay;

        this.scoreCfgs = CarnivalUtil.getRewardsConfigs();
        this.scoreCfgs.forEach((cfg, index) => {
            this.scoreList[index].string = cfg.value + '';
            let ctrl = this.rewardList[index].getComponent(RewardItem);
            let temData = { index: index, typeId: cfg.rewards[0][0], num: cfg.rewards[0][1], delayShow: false, effct: false }
            ctrl.data = temData;
            ctrl.updateView();
        })

        // 判断积分奖励是否领取 (this.taskModel.diaryLvRewards & 1 << this.cfg.level) >= 1
        //获取个人信息
        let msg = new icmsg.CarnivalInfoReq()
        NetManager.send(msg, (rsp: icmsg.CarnivalInfoRsp) => {
            this.initPlayerScoreInfo(rsp);
        }, this);

        //获取任务状态
        let msg1 = new icmsg.MissionListReq()
        NetManager.send(msg1)
        // NetManager.send(msg1, (rsp: icmsg.MissionListReq) => {
        //     this._updateScroll();
        // }, this);
    }


    onDisable() {
        NetManager.targetOff(this)
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    //刷新个人信息
    initPlayerScoreInfo(msg: icmsg.CarnivalInfoRsp) {
        this.model.cServerPersonData = msg;
        this.scoreData = msg;
        this.myrankNum.string = msg.numTd + '';
        this.myScore.string = msg.carnivalScore + '';
        this.taskModel.carnivalScoreRewards = msg.boxOpened;
        let temW = Math.floor(msg.carnivalScore * 0.6)
        this.scoreSp.width = temW > this.maxW ? this.maxW : temW;
        let idx = 0
        this.scoreCfgs.forEach((cfg, index) => {
            let state = cfg.value <= msg.carnivalScore;
            // if (cfg.value <= msg.carnivalScore) {
            //     id = cfg.id;
            // }
            this.liangNodes[index].active = state;
            this.scoreList[index].node.color = state ? this.scoreColor[0] : this.scoreColor[1];
            let ctrl = this.rewardList[index].getComponent(RewardItem);
            let state1 = (this.taskModel.carnivalScoreRewards & 1 << index) >= 1;
            this.rewardTipList[index].active = false;
            if (cfg.value <= msg.carnivalScore) {
                // id = cfg.id;
                idx = index;
                state1 == false ? ctrl.slot.itemInfo = null : false;
                this.rewardTipList[index].active = !state1;
            }
            ctrl.getNode.active = state1
        })
        let path = 'view/act/texture/cServer/' + this.rankBgStrs[idx]
        GlobalUtil.setSpriteIcon(this.node, this.rankBgSp, path);
        this.red2Node.active = RedPointUtils.has_cServer_task_reward([1])
        this.red3Node.active = RedPointUtils.has_cServer_task_reward([2])
    }

    _updateScroll(resetPos: boolean = false) {
        this._initListView();
        let listData = [];
        let rewardData = [];
        let unlockData = [];
        let overData = [];
        if (this.curType == 0) {
            let cfgs = CarnivalUtil.getDailyConfigsByDay(this.curDay);
            cfgs.forEach(cfg => {
                let state = 0;
                //判断完成状态
                let num = cc.js.isString(cfg.args) ? 0 : cfg.args;
                let data = this.taskModel.carnivalDailyData[cfg.target] ? this.taskModel.carnivalDailyData[cfg.target][num] : null;
                if (!data) {
                    let tem = new icmsg.MissionProgress()
                    tem.type = cfg.target;
                    tem.arg = num;
                    tem.num = 0;
                    data = tem;
                }
                if (!this.taskUnlock(cfg)) {
                    state = 3
                } else {
                    let proTab = TaskUtil.getTaskFinishNum(cfg.id)
                    if (proTab[0] < proTab[1]) {
                        state = 0;
                    } else {
                        //判断是否已经领取
                        if (this.taskModel.rewardIds[cfg.id]) {
                            state = 2
                        } else {
                            state = 1;
                        }
                    }
                }
                //判断任务是否领取（已经领取的添加到overData）
                let tem = { cfg: cfg, type: 0, data: data, state: state };
                if (state == 2) {
                    overData.push(tem)
                } else if (state == 1) {
                    rewardData.push(tem)
                } else if (state == 3) {
                    unlockData.push(tem)
                } else {
                    listData.push(tem)
                }
            })
        } else {
            let cfgs = CarnivalUtil.getUltimateConfigs();
            let typeNum = cfgs[cfgs.length - 1].theme
            for (let i = 1; i <= typeNum; i++) {
                let temCfgs = CarnivalUtil.getUltimateConfigsByTheme(i);
                let selectCfg = null;
                let selectData = null;
                //let state: boolean = true;
                for (let j = 0; j < temCfgs.length; j++) {
                    let cfg = temCfgs[j];
                    let num = cc.js.isString(cfg.args) ? 0 : cfg.args;
                    let data = this.taskModel.carnivalUltimateData[cfg.target] ? this.taskModel.carnivalUltimateData[cfg.target][num] : null;
                    if (!data) {
                        let tem = new icmsg.MissionProgress()
                        tem.type = cfg.target;
                        tem.arg = num;
                        tem.num = 0;
                        data = tem;
                    }
                    //判断任务是否领取（已经领取的添加到overData）
                    if (data.num >= cfg.number && this.taskModel.rewardIds[cfg.id]) {
                        continue;
                    }
                    selectCfg = cfg;
                    selectData = data;
                    break;
                }
                let state = 0;
                if (!selectCfg) {
                    selectCfg = temCfgs[temCfgs.length - 1];
                    let num = cc.js.isString(selectCfg.args) ? 0 : selectCfg.args;
                    selectData = this.taskModel.carnivalUltimateData[selectCfg.target][num];
                    if (!this.taskUnlock(selectCfg)) {
                        state = 3
                    } else {
                        let proTab = TaskUtil.getTaskFinishNum(selectCfg.id)
                        if (proTab[0] < proTab[1]) {
                            state = 0;
                        } else {
                            //判断是否已经领取
                            if (this.taskModel.rewardIds[selectCfg.id]) {
                                state = 2
                            } else {
                                state = 1;
                            }
                        }
                    }
                    let tem = { cfg: selectCfg, type: 1, data: selectData, state: state };
                    if (state == 2) {
                        overData.push(tem)
                    } else if (state == 1) {
                        rewardData.push(tem)
                    } else if (state == 3) {
                        unlockData.push(tem)
                    } else {
                        listData.push(tem)
                    }
                } else {
                    if (!this.taskUnlock(selectCfg)) {
                        state = 3
                    } else {
                        let proTab = TaskUtil.getTaskFinishNum(selectCfg.id)
                        if (proTab[0] < proTab[1]) {
                            state = 0;
                        } else {
                            //判断是否已经领取
                            if (this.taskModel.rewardIds[selectCfg.id]) {
                                state = 2
                            } else {
                                state = 1;
                            }
                        }
                    }
                    let tem = { cfg: selectCfg, type: 1, data: selectData, state: state };
                    if (state == 2) {
                        overData.push(tem)
                    } else if (state == 1) {
                        rewardData.push(tem)
                    } else if (state == 3) {
                        unlockData.push(tem)
                    } else {
                        listData.push(tem)
                    }
                }
            }
        }
        listData = rewardData.concat(listData).concat(unlockData).concat(overData)//listData.concat(overData)
        this.list.set_data(listData, resetPos);
    }


    taskUnlock(taskCfg: Carnival_dailyCfg | Carnival_ultimateCfg): boolean {
        let res = true;
        if (cc.js.isNumber(taskCfg.level)) {
            let roleModel = ModelManager.get(RoleModel)
            if (roleModel.level < taskCfg.level) {
                res = false;
            }
        } else if (res && cc.js.isNumber(taskCfg.fbId)) {
            res = CopyUtil.isStagePassed(taskCfg.fbId)
        }
        return res;
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scroll,
            mask: this.scroll.node,
            content: this.content,
            item_tpl: this.itemPre,
            cb_host: this,
            column: 1,
            gap_y: 3,
            async: true,
            //resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })
    }
    _updateDataLater() {
        let msg = new icmsg.CarnivalInfoReq()
        NetManager.send(msg, (rsp: icmsg.CarnivalInfoRsp) => {
            this.initPlayerScoreInfo(rsp);
        }, this);
        gdk.Timer.callLater(this, this._updateScroll)
    }

    infoPageSelect(event, index, refresh: boolean = false) {
        //cc.log('---------------------显示怪物信息页签：' + index)
        this.curType = index;
        let data: any;
        data = this.curType == 0 ? this.taskModel.carnivalDailyData : this.taskModel.carnivalUltimateData
        // if (this.firstenter) {
        //     this.firstenter = false;
        //     //获取任务状态
        //     let msg = new icmsg.MissionListReq()
        //     NetManager.send(msg, (rsp: icmsg.MissionListReq) => {
        //         this._updateScroll();
        //     }, this);
        // } else {
        //     this._updateScroll()
        // }
        if (data) {
            this._updateScroll(true)
        }
    }

    //打开排行榜界面
    rankDetailOpen() {
        this.red1Node.active = false;
        gdk.panel.open(PanelId.CServerPersonRankView)
    }

    //积分奖励按钮
    rewardItemBtnClick(event: cc.Event, index: string) {
        let i = parseInt(index);
        let cfg = this.scoreCfgs[i]
        if (cfg && this.scoreData) {
            let state = cfg.value <= this.scoreData.carnivalScore;
            this.liangNodes[i].active = state;
            this.scoreList[i].node.color = state ? this.scoreColor[0] : this.scoreColor[1];
            // let ctrl = this.rewardList[index].getComponent(RewardItem);
            let state1 = (this.taskModel.carnivalScoreRewards & 1 << (i)) >= 1;
            if (state && !state1) {
                //cc.log('-----------------积分奖励按钮--------------------' + index);
                //发送领取积分奖励
                let msg = new icmsg.MissionRewardReq()
                msg.kind = 2;
                msg.type = 12;
                msg.id = i + 1;//cfg.id;
                NetManager.send(msg);
            }
        }

    }

}
