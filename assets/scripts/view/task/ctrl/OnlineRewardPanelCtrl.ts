import ConfigManager from '../../../common/managers/ConfigManager';
import NetManager from '../../../common/managers/NetManager';
import TaskUtil from '../util/TaskUtil';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Mission_onlineCfg } from '../../../a/config';
import { TaskEventId } from '../enum/TaskEventId';

/**
 * @Description: 在线奖励界面控制器
 * @Author: yaozu.hu
 * @Date: 2019-10-09 16:56:20
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-15 13:47:45
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/OnlineRewardPanelCtrl")
export default class OnlineRewardPanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    mask: cc.Node = null
    @property(cc.Node)
    content: cc.Node = null
    @property(cc.Prefab)
    taskItem: cc.Prefab = null

    @property(cc.Label)
    timeLb: cc.Label = null;

    @property(cc.Node)
    receiveBtn: cc.Node = null;
    @property(cc.Node)
    waitBtn: cc.Node = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;
    @property(cc.Label)
    tipsLabel: cc.Label = null;

    // @property(cc.Label)
    // btnLb: cc.Label = null;
    // @property(cc.Sprite)
    // btnSprite: cc.Sprite = null;

    private list: ListView = null;
    curDay = 1;
    isFirstInPanel: boolean = true;

    rewardData: any = []
    allReward = false;
    time = 0;
    state = 2;
    onLoad() {
        this.curDay = TaskUtil.getCrateRoleDays();
        gdk.e.on(TaskEventId.UPDATE_ONLINE_INFO, this._initTaskData, this)
        // this._initTaskData();
    }

    onEnable() {
        NetManager.on(icmsg.MissionOnlineInfoRsp.MsgType, this._onMissionOnlineInfoRsp, this);
        this.node.setScale(.7);
        this.node.runAction(cc.sequence(
            cc.scaleTo(.2, 1.05, 1.05),
            cc.scaleTo(.15, 1, 1)
        ));
    }

    onDisable() {
        NetManager.targetOff(this);
        this.node.stopAllActions();
    }

    temDt = 0;
    update(dt: number) {
        if (this.state != 2 && !this.allReward && this.uiTabMenu.selectIdx == TaskUtil.getCrateRoleDays() - 1) {
            if (this.time > 0) {
                this.temDt += dt;
                if (this.temDt > 1) {
                    this.time -= 1;
                    this.timeLb.string = TaskUtil.getOnlineRewardTimeStr(this.time);
                    this.temDt -= 1;
                }
            } else {
                this._initTaskData();
            }
        }
    }

    onDestroy() {
        gdk.e.targetOff(this)
        if (this.list) {
            this.list.destroy()
        }
    }

    onTabBtnClick(p: TouchEvent, data: number) {
        // this.selectTabPanel(data);
        if (this.isFirstInPanel) {
            this.isFirstInPanel = false;
            this.uiTabMenu.setSelectIdx(TaskUtil.getCrateRoleDays() - 1);
            return;
        }
        this._initTaskData();
    }

    _onMissionOnlineInfoRsp(resp: icmsg.MissionOnlineInfoRsp) {
        if (TaskUtil.getCrateRoleDays() > this.curDay) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:TASK_TIP2'));
            this.close();
        }
    }

    //获取通关奖励任务的数据
    _initTaskData() {
        this.state = TaskUtil.getOnlineReward()
        this.tipsLabel.string = gdk.i18n.t('i18n:TASK_TIP3')
        if (this.state == 2) {
            this.node.active = false;
            this.timeLb.node.active = false;
        } else {
            if (this.uiTabMenu.selectIdx != TaskUtil.getCrateRoleDays() - 1) {
                this.time = 0;
                this.timeLb.node.active = false;
                this.allReward = false;
                this.waitBtn.active = false
                this.receiveBtn.active = false;
                this.tipsLabel.string = this.uiTabMenu.selectIdx > TaskUtil.getCrateRoleDays() - 1 ? `第${['二', '三'][this.uiTabMenu.selectIdx - 1]}天在线奖励预览` : '';
            }
            else {
                this.time = TaskUtil.getOnlineRewardTime();
                this.timeLb.node.active = true;
                this.timeLb.string = TaskUtil.getOnlineRewardTimeStr(this.time);
                this.allReward = false;
                if (this.state == 1) {
                    this.receiveBtn.active = true;
                    this.waitBtn.active = false
                    if (this.time == 0) {
                        this.allReward = true;
                    }
                } else {
                    this.receiveBtn.active = false;
                    this.waitBtn.active = true;
                }
            }
        }

        this.rewardData = []
        let time = 0
        // let cfgs = ConfigManager.getItemsByField(Mission_onlineCfg, 'days', TaskUtil.getCrateRoleDays());
        let cfgs = ConfigManager.getItemsByField(Mission_onlineCfg, 'days', this.uiTabMenu.selectIdx + 1);
        if (!cfgs) cfgs = []; //超出活动在线奖励的天数
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i];
            time += cfg.time;
            let data = { cfg: cfg, time: time }
            this.rewardData.push(data)
        }

        this._updateTaskScroll(true);
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
            column: 4,
            gap_x: 26,
            gap_y: 26,
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
        this.list.clear_items();
        this.list.set_data(this.rewardData, resetPos)
    }

    oneKeyReward() {
        if (this.state == 0) {
            this.close();
            return;
        }
        // console.log(`startTime: ${ModelManager.get(TaskModel).onlineInfo.startTime}---now:${ModelManager.get(ServerModel).serverTime}`)
        let msg = new icmsg.MissionOnlineAwardReq();
        msg.id = 0;
        msg.day = this.curDay;
        NetManager.send(msg);
        this.receiveBtn.active = false;
        this.waitBtn.active = true;
    }

}
