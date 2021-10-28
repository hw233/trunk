import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RewardPreviewCtrl from '../../../../common/widgets/RewardPreviewCtrl';
import TaskModel from '../../../task/model/TaskModel';
import TaskUtil from '../../../task/util/TaskUtil';
import { Mission_guildCfg } from '../../../../a/config';
import { TaskEventId } from '../../../task/enum/TaskEventId';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/GuildFhTaskCtrl")
export default class GuildFhTaskCtrl extends cc.Component {

    @property(cc.Node)
    tipIcon: cc.Node = null;

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null;

    @property(cc.Node)
    boxNodes: cc.Node[] = [];

    @property(cc.Label)
    boxNumLab: cc.Label[] = [];

    @property(cc.Label)
    proLab: cc.Label = null;

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {
        let cfgs = ConfigManager.getItemsByField(Mission_guildCfg, "target", 5004)
        let lastCfg = cfgs[cfgs.length - 1]

        let maxNum = lastCfg.number
        for (let i = 0; i < cfgs.length; i++) {
            this.boxNodes[i].y = this.proBar.node.y + cfgs[i].number / maxNum * this.proBar.node.height
            this.boxNumLab[i].node.y = this.boxNodes[i].y - 43
        }
    }

    updateBoxState() {
        let cfgs = ConfigManager.getItemsByField(Mission_guildCfg, "target", 5004)
        let lastCfg = cfgs[cfgs.length - 1]
        let finishNum = TaskUtil.getGuildTaskFinishNum(lastCfg.id)
        let ownNum = FootHoldUtils.getOccupiedPointsCount()
        let totalNum = FootHoldUtils.getTotalPointsCount()
        this.proBar.progress = ownNum / totalNum
        this.proLab.string = `${(ownNum / totalNum * 100).toFixed(1)}%`
        for (let i = 0; i < cfgs.length; i++) {
            this.boxNodes[i].angle = 0
            let on = this.boxNodes[i].getChildByName("on")
            let off = this.boxNodes[i].getChildByName("off")
            let lab = this.boxNumLab[i]
            lab.string = `${cfgs[i].number}%`
            on.active = false
            off.active = true
            if (TaskUtil.getGuildTaskState(cfgs[i].id)) {
                let state = this.taskModel.guildRewardIds[cfgs[i].id] || 0
                if (state == 0) {
                    let ani = this.boxNodes[i].getComponent(cc.Animation)
                    ani.play("reward_shake")
                } else {
                    on.active = true
                    off.active = false
                }
            }
        }
    }

    boxClick(e, index) {
        let cfgs = ConfigManager.getItemsByField(Mission_guildCfg, "target", 5004)
        let targetCfg = cfgs[index - 1]
        let arr = []
        targetCfg.rewards.forEach(e => {
            let goodsInfo = new icmsg.GoodsInfo();
            goodsInfo.typeId = e[0];
            goodsInfo.num = e[1];
            arr.push(goodsInfo);
        });

        if (TaskUtil.getGuildTaskState(cfgs[index - 1].id)) {
            let state = this.taskModel.guildRewardIds[cfgs[index - 1].id] || 0
            if (state == 0) {
                let ani = this.boxNodes[index - 1].getComponent(cc.Animation)
                ani.stop("reward_shake")

                let msg = new icmsg.GuildMissionRewardReq()
                msg.id = cfgs[index - 1].id
                NetManager.send(msg, (data: icmsg.GuildMissionRewardRsp) => {
                    this.taskModel.guildRewardIds[data.id] = 1
                    GlobalUtil.openRewadrView(data.list)
                    gdk.e.emit(TaskEventId.UPDATE_GUILD_TASK_REWARD)
                    this.updateBoxState()
                }, this)
            } else {
                this._showReward(arr, gdk.i18n.t("i18n:FOOTHOLD_TIP43"), true, index)
            }
        } else {
            this._showReward(arr, gdk.i18n.t("i18n:FOOTHOLD_TIP43"), false, index)
        }
    }

    _showReward(rewards, title, isGet, index) {
        if (rewards && rewards.length > 0) {
            PanelId.RewardPreview.maskAlpha = 0;
            PanelId.RewardPreview.onHide = {
                func: () => {
                    PanelId.RewardPreview.maskAlpha = 180;
                }
            }
            gdk.panel.open(PanelId.RewardPreview, (node: cc.Node) => {
                let ctrl = node.getComponent(RewardPreviewCtrl);
                ctrl.setRewards(rewards, title, "", null, this, isGet);
                let pos = cc.v2(this.boxNodes[index - 1].x + 240, this.proBar.node.y + this.boxNodes[index - 1].y + 100)
                node.setPosition(pos);
            }, this);
        }
    }

    openIconTip() {
        GlobalUtil.openCommonInfoTip(this.tipIcon, 0, gdk.i18n.t("i18n:FOOTHOLD_TIP44"))
    }
}