import ActUtil from '../../act/util/ActUtil';
import CombineCarnivalRewardItemCtrl from './CombineCarnivalRewardItemCtrl';
import CombineModel from '../model/CombineModel';
import CombineUtils from '../util/CombineUtils';
import CombinRankRewardItemCtrl from './CombinRankRewardItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildUtils from '../../guild/utils/GuildUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import TaskModel from '../../task/model/TaskModel';
import TaskUtil from '../../task/util/TaskUtil';
import { Combine_dailyCfg, Combine_rewardsCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { MissionType } from '../../task/ctrl/TaskViewCtrl';
import { RedPointEvent } from '../../../common/utils/RedPointUtils';
import { TaskEventId } from '../../task/enum/TaskEventId';

/**
 * @Description: 合服狂欢 界面
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-07 15:24:25
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/combine/CombineCarnivalViewCtrl")
export default class CombineCarnivalViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    tabBtns: cc.Node[] = [];

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    taskItem: cc.Prefab = null

    @property(cc.Label)
    rankLab: cc.Label = null

    @property(cc.Label)
    scoreLab: cc.Label = null

    @property(CombineCarnivalRewardItemCtrl)
    rewardItems: CombineCarnivalRewardItemCtrl[] = []

    @property(cc.Node)
    head: cc.Node = null

    @property(cc.Node)
    headFrame: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Label)
    timeLab: cc.Label = null

    _curIndex = 0

    list: ListView = null;

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }
    get combineModel(): CombineModel { return ModelManager.get(CombineModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        gdk.e.on(TaskEventId.UPDATE_TASK_AWARD_STATE, this._updateListData, this)
        NetManager.on(icmsg.MergeCarnivalPlayerScoreRsp.MsgType, this._MergeCarnivalPlayerScoreRsp, this)
        let startTime = new Date(ActUtil.getActStartTime(93));
        let endTime = new Date(ActUtil.getActEndTime(93) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
        }
        else {
            this.timeLab.string = `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }
        this._initPlayerInfo()
        this._updateRewardItems()
        this.selectTab(null, 0)
    }

    _initPlayerInfo() {
        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this.roleModel.head));
        GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(this.roleModel.frame));
        this.lvLab.string = `${this.roleModel.level}`
    }

    _MergeCarnivalPlayerScoreRsp(data: icmsg.MergeCarnivalPlayerScoreRsp) {
        this.combineModel.playerScore += data.addScore
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
        this._updateRewardItems()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.taskItem,
            cb_host: this,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _updateListData(isReset: boolean = false) {
        this._initListView()
        let datas = []
        if (this._curIndex == 0) {
            let cfgs = ConfigManager.getItems(Combine_dailyCfg, { type: ModelManager.get(RoleModel).serverMegCount, day: CombineUtils.getCombineCarnivalDay() })
            if (cfgs.length == 0) {
                let tempCfgs = ConfigManager.getItems(Combine_dailyCfg)
                cfgs = ConfigManager.getItems(Combine_dailyCfg, { type: tempCfgs[tempCfgs.length - 1].type, day: CombineUtils.getCombineCarnivalDay() })
            }
            for (let i = 0; i < cfgs.length; i++) {
                let finish = TaskUtil.getTaskState(cfgs[i].id)
                let geted = this.taskModel.rewardIds[cfgs[i].id] || 0
                // 任务状态 0:可领取 1:未完成 2:已领取
                let state = 1
                if (finish) {
                    if (geted == 0) {
                        state = 0
                    } else {
                        state = 2
                    }
                }
                let info: any = { type: MissionType.combineDaily, cfg: cfgs[i], state: state }
                datas.push(info)
            }
        } else {
            let list = TaskUtil.getCombineUltimateTaskList()
            for (let index = 0; index < list.length; index++) {
                const cfg = list[index];
                let finish = TaskUtil.getTaskState(cfg.id)
                let geted = this.taskModel.rewardIds[cfg.id] || 0
                // 任务状态 0:可领取 1:未完成 2:已领取
                let state = 1
                if (finish) {
                    if (geted == 0) {
                        state = 0
                    } else {
                        state = 2
                    }
                }
                let info: any = { type: MissionType.combineUltimate, cfg: cfg, state: state }
                datas.push(info)
            }
        }

        GlobalUtil.sortArray(datas, (a, b) => {
            return a.state - b.state
        })
        if (isReset) {
            this.scrollView.stopAutoScroll()
        }
        this.list.set_data(datas, isReset)
    }

    selectTab(e, index) {
        this._curIndex = parseInt(index)
        for (let i = 0; i < this.tabBtns.length; i++) {
            let node = this.tabBtns[i]
            let btn = node.getComponent(cc.Button)
            btn.interactable = index != i
            let select = node.getChildByName("select")
            let common = node.getChildByName("common")
            select.active = index == i
            common.active = index != i
        }
        this._updateListData(true)
    }


    _updateRankScore() {
        this.rankLab.string = `${this.combineModel.playerRank}`
        this.scoreLab.string = `${this.combineModel.playerScore}`
    }


    @gdk.binding("combineModel.playerScore")
    _updateRewardItems() {
        let cfgs = ConfigManager.getItems(Combine_rewardsCfg, { type: ModelManager.get(RoleModel).serverMegCount })
        if (cfgs.length == 0) {
            cfgs = ConfigManager.getItems(Combine_rewardsCfg, { type: 1 })
        }
        for (let i = 0; i < this.rewardItems.length; i++) {
            let ctrl = this.rewardItems[i]
            ctrl.updateViewInfo(cfgs[i])
        }
        this._updateRankScore()
    }

    onOpenRank() {
        gdk.panel.open(PanelId.CombineRankView)
    }
}