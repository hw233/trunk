import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MathUtil from '../../../../common/utils/MathUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import TaskModel from '../../model/TaskModel';
import TaskUtil from '../../util/TaskUtil';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { MissionType } from '../TaskViewCtrl';
import { Score_missionCfg, ScoreCfg } from '../../../../a/config';
import { TaskEventId } from '../../enum/TaskEventId';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 12:52:26
 */

export type ScoreSysBqItemType = {
    index: number,
    type: number,
    state: number,   // 任务状态 0:可领取 1:未完成 2:已领取
    cfg: Score_missionCfg
    isOpen: number, //是否已开启 0未开启 1已开启  排序已开启的要排在前面
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysBqPanelCtrl")
export default class ScoreSysBqPanelCtrl extends gdk.BasePanel {

    @property(cc.Node)
    leftNode: cc.Node = null

    @property(cc.Node)
    rightNode: cc.Node = null

    @property(cc.Label)
    proLab: cc.Label = null

    @property(cc.Node)
    proBg: cc.Node = null

    @property(cc.Node)
    pro: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    bqItem: cc.Prefab = null

    @property(cc.Node)
    tipNode: cc.Node = null

    @property(sp.Skeleton)
    spine: sp.Skeleton = null

    @property(cc.RichText)
    tipLab: cc.RichText = null

    list: ListView = null;

    get model(): TaskModel { return ModelManager.get(TaskModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {
        gdk.e.on(TaskEventId.UPDATE_TASK_AWARD_STATE, this._updateViewInfo, this)
        gdk.gui.guiLayer.on(cc.Node.EventType.TOUCH_START, this._endGuide, this, true);
        this._updateViewInfo()
        this._updateTipNode()
    }

    onDisable() {
        this.roleModel.gradingGuideIndex = -1
        gdk.e.targetOff(this)
        gdk.gui.guiLayer.targetOff(this);
    }

    _endGuide() {
        this.tipNode.active = false
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.bqItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
    }

    _updateViewInfo() {
        this._updateUpInfo()
        this._initListView()
        let model = ModelManager.get(TaskModel);
        let list = TaskUtil.getGradingTaskList()
        let datas = []
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
            if (TaskUtil.getGradingTaskIsOpen(cfg.id)) {
                isOpen = 1
            }
            let info: ScoreSysBqItemType = { type: MissionType.grading, state: state, cfg: cfg, isOpen: isOpen, index: index }
            datas.push(info)
        }

        /**任务列表排序, */
        GlobalUtil.sortArray(datas, (a, b) => {
            if (a.state == b.state) {
                if (a.isOpen == b.isOpen) {
                    return a.cfg.id - b.cfg.id
                }
                return b.isOpen - a.isOpen // 已开启>未开启
            }
            return a.state - b.state
        })
        for (let i = 0; i < datas.length; i++) {
            datas[i].index = i
        }
        this.list.set_data(datas)
    }

    @gdk.binding("roleModel.gradingGuideIndex")
    _updateTipNode() {
        this.tipNode.active = false
        if (this.roleModel.gradingGuideIndex >= 0) {
            if (this.roleModel.gradingGuideIndex >= 4) {
                gdk.Timer.callLater(this, () => {
                    this.list.scroll_to(this.roleModel.gradingGuideIndex)
                })
            }
            this.tipNode.active = true
            let index = this.roleModel.gradingGuideIndex > 3 ? 3 : this.roleModel.gradingGuideIndex
            this.tipNode.y = this.scrollView.node.parent.y - index * 160 + 80
            let id = MathUtil.rnd(1, 3)
            this.spine.setAnimation(0, `action${id}`, true)
            //let cfgs = ConfigManager.getItemsByField(Score_missionCfg, "node", curNode)
            this.tipLab.string = `${this.list.datas[this.roleModel.gradingGuideIndex].cfg.guide}`
        }
    }

    _updateUpInfo() {
        let curIcon = cc.find('icon', this.leftNode)
        let curName = cc.find('nameLab', this.leftNode).getComponent(cc.Label)
        let curScore = cc.find('scoreLab', this.leftNode).getComponent(cc.Label)

        let nextIcon = cc.find('icon', this.rightNode)
        let nextName = cc.find('nameLab', this.rightNode).getComponent(cc.Label)
        let nextScore = cc.find('scoreLab', this.rightNode).getComponent(cc.Label)

        let curLv = this.model.grading.boxOpened
        if (curLv == 0) {
            curLv = 1
        }
        let cfgs = ConfigManager.getItems(ScoreCfg)
        if (curLv > cfgs.length) {
            curLv = cfgs.length
        }
        let cfg = ConfigManager.getItemById(ScoreCfg, curLv)
        let nextCfg = ConfigManager.getItemById(ScoreCfg, curLv + 1)
        if (!nextCfg) {
            nextCfg = cfg
        }
        if (cfg.resources) {
            GlobalUtil.setSpriteIcon(this.node, curIcon, `view/task/texture/scoreSystem/${cfg.resources}`)
        }
        curName.string = cfg.name
        if (cfg.id == 1) {
            curScore.string = `0`
            nextScore.string = `${cfg.exp[1]}`
        } else {
            let preCfg = ConfigManager.getItemById(ScoreCfg, curLv - 1)
            curScore.string = `${preCfg.exp[1]}`
            if (nextCfg.exp && nextCfg.exp.length > 0) {
                nextScore.string = `${cfg.exp[1]}`
            } else {
                nextScore.string = `满级`
            }
        }
        if (nextCfg.resources) {
            GlobalUtil.setSpriteIcon(this.node, nextIcon, `view/task/texture/scoreSystem/${nextCfg.resources}`)
        }
        nextName.string = nextCfg.name

        if (cfg.exp && cfg.exp.length > 0) {
            this.proLab.string = `${this.roleModel.badgeExp}/${cfg.exp[1]}`
            let percent = this.roleModel.badgeExp / cfg.exp[1]
            this.pro.width = this.proBg.width * Math.min(percent, 1)
        } else {
            this.proLab.string = `${this.roleModel.badgeExp}/满级`
            this.pro.width = this.proBg.width
        }

    }

    openPreView() {
        gdk.panel.open(PanelId.ScoreSysBqPreView)
    }

    getRewardFunc() {
        let msg = new icmsg.MissionRewardReq();
        msg.kind = 2
        msg.type = MissionType.grading
        msg.id = this.model.grading.boxOpened
        NetManager.send(msg);
    }
}