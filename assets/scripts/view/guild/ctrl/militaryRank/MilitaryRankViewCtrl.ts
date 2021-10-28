import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from '../footHold/FootHoldModel';
import FootHoldUtils from '../footHold/FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MilitaryRankUtils from './MilitaryRankUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveRes from '../../../pve/const/PveRes';
import TaskModel from '../../../task/model/TaskModel';
import TaskUtil, { TaskSheetType } from '../../../task/util/TaskUtil';
import { Foothold_dailytaskCfg, Foothold_ranktaskCfg, Foothold_titleCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { MissionType } from '../../../task/ctrl/TaskViewCtrl';
import { TaskEventId } from '../../../task/enum/TaskEventId';



export type MilitaryRankTaskInfo = {
    type: number,//任务类型
    state: number,   // 任务状态 0:可领取 1:未完成 2:已领取
    cfg: Foothold_dailytaskCfg | Foothold_ranktaskCfg
}

/**
 * 0 进攻加成词条(pvp)
 * 1 防守加成词条(pvp)
 * 2 额外领取体力数
 * 3 据点上限提升
 * 4 耐久度提升
 * 5 耐久恢复速度提升
 * 6 指挥官生命值上限
 * 7 进攻加成(pve)
 */
export enum MRPrivilegeType {
    p0 = 0,
    p1 = 1,
    p2 = 2,
    p3 = 3,
    p4 = 4,
    p5 = 5,
    p6 = 6,
    p7 = 7,
}

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-02-05 16:51:56
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/militaryRank/MilitaryRankViewCtrl")
export default class MilitaryRankViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    showMR: cc.Node = null

    @property(cc.Label)
    showMRLab: cc.Label = null

    @property(cc.Label)
    showMRExp: cc.Label = null

    @property(cc.Node)
    MRNode: cc.Node = null

    @property(cc.Node)
    noMRTip: cc.Node = null

    @property(cc.Node)
    maxTip: cc.Node = null

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null

    @property(cc.Label)
    expLab: cc.Label = null

    @property(cc.Node)
    curMR: cc.Node = null

    @property(cc.Label)
    curMRLab: cc.Label = null

    @property(cc.Node)
    nextMR: cc.Node = null

    @property(cc.Label)
    nextMRLab: cc.Label = null

    @property(cc.Node)
    tabBtns: cc.Node[] = [];

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    taskItem: cc.Prefab = null

    @property(cc.Node)
    descContent: cc.Node = null

    @property(cc.Node)
    descItem: cc.Node = null

    @property(cc.Node)
    energyState: cc.Node = null

    _curIndex = 0

    list: ListView = null;

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }
    get footholdModel() { return ModelManager.get(FootHoldModel); }

    onEnable() {
        gdk.e.on(TaskEventId.UPDATE_TASK_AWARD_STATE, this._updateListData, this)
        this._updateViewInfo()
        this.selectTab(null, 0)
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    @gdk.binding("footholdModel.militaryExp")
    _updateViewInfo() {
        let cfgs = ConfigManager.getItems(Foothold_titleCfg)
        let curLv = this.footholdModel.militaryRankLv
        let curCfg = ConfigManager.getItemByField(Foothold_titleCfg, "level", curLv)
        this.showMRLab.string = `${curCfg.name}`
        this.showMRExp.string = `${this.footholdModel.militaryExp}`
        GlobalUtil.setSpriteIcon(this.node, this.showMR, MilitaryRankUtils.getIcon(curLv))
        if (curLv >= cfgs.length - 1) {
            this.MRNode.active = false
            this.maxTip.active = true
        } else {
            this.MRNode.active = true
            this.maxTip.active = false
            this.curMRLab.string = `${curCfg.name}`
            let nextCfg = ConfigManager.getItemByField(Foothold_titleCfg, "level", curLv + 1)
            this.nextMRLab.string = `${nextCfg.name}`
            this.proBar.progress = this.footholdModel.militaryExp / nextCfg.exp
            this.expLab.string = `${this.footholdModel.militaryExp}/${nextCfg.exp}`
            GlobalUtil.setSpriteIcon(this.node, this.curMR, MilitaryRankUtils.getIcon(curLv))
            GlobalUtil.setSpriteIcon(this.node, this.nextMR, MilitaryRankUtils.getIcon(curLv + 1))
        }

        this._updateDescContent()
        this._updateFreeEnergyState()
    }


    @gdk.binding("footholdModel.freeEnergy")
    _updateFreeEnergyState() {
        let freeEnergyNum = MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p2, this.footholdModel.militaryRankLv)
        if (this.footholdModel.freeEnergy < freeEnergyNum) {
            this.energyState.active = true
            this.energyState.setScale(1);
            this.energyState.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.scaleTo(.5, 1.3, 1.3),
                        cc.scaleTo(.5, 1, 1)
                    )
                )
            );
        } else {
            this.energyState.active = false
            this.energyState.stopAllActions();
        }
    }

    _updateDescContent() {
        this.descContent.removeAllChildren()
        let curLv = this.footholdModel.militaryRankLv
        let cfg_desc = ConfigManager.getItemByField(Foothold_titleCfg, "level", curLv).desc

        if (cfg_desc == '') {
            this.noMRTip.active = true
        } else {
            this.noMRTip.active = false
            let datas = cfg_desc.split("<br>")
            for (let i = 0; i < datas.length; i++) {
                let item = cc.instantiate(this.descItem)
                item.active = true
                let richLab = cc.find("label", item).getComponent(cc.RichText)
                richLab.string = `${datas[i]}`
                this.descContent.addChild(item)
            }
        }
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


    _updateListData() {
        this._initListView()
        let datas = []
        if (this._curIndex == 0) {
            let cfgs = ConfigManager.getItems(Foothold_dailytaskCfg)
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
                let info: MilitaryRankTaskInfo = { type: MissionType.footholdDaily, cfg: cfgs[i], state: state }
                datas.push(info)
            }
        } else {
            let list = TaskUtil.getFootholdRankTaskList()
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
                let info: MilitaryRankTaskInfo = { type: MissionType.footholdRank, cfg: cfg, state: state }
                datas.push(info)
            }
        }

        GlobalUtil.sortArray(datas, (a, b) => {
            return a.state - b.state
        })

        this.list.set_data(datas)
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
        this._updateListData()
    }

    openPreView() {
        gdk.panel.open(PanelId.MilitaryRankPreView)
    }

    openGetEngergy() {
        gdk.panel.open(PanelId.MilitaryRankGetEngergy)
    }

}