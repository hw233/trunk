import BagUtils from '../../../common/utils/BagUtils';
import CopyModel from '../../../common/models/CopyModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import OnlineRewardPanelCtrl from './OnlineRewardPanelCtrl';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import TaskModel from '../model/TaskModel';
import TaskUtil from '../util/TaskUtil';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { ItemSubType } from '../../decompose/ctrl/DecomposeViewCtrl';
import { Mission_onlineCfg } from '../../../a/config';
import { TaskEventId } from '../enum/TaskEventId';
/**
 * @Description: 主界面在线奖励图标控制
 * @Author: yaozu.hu
 * @Date: 2019-10-09 17:39:12
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-12 19:50:39
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class OnlineRewardInfoCtrl extends cc.Component {

    //@property(UiSlotItem)
    //slot: UiSlotItem = null;
    @property(cc.Label)
    timeLb: cc.Label = null;
    @property(cc.Node)
    component: cc.Node = null;
    @property(cc.Node)
    timeNode: cc.Node = null

    @property(cc.Node)
    slotParent: cc.Node = null;
    @property(cc.Prefab)
    slot: cc.Prefab = null;

    @property(cc.Node)
    pzgjinNode: cc.Node = null;
    @property(cc.Node)
    pzgziNode: cc.Node = null;
    @property(cc.Node)
    pzgtyNode: cc.Node = null;

    @property(cc.Animation)
    pzgjin: cc.Animation = null;
    @property(cc.Animation)
    pzgzi: cc.Animation = null;
    @property(cc.Animation)
    pzgty: cc.Animation = null;
    @property(sp.Skeleton)
    chipSpine: sp.Skeleton = null;

    get roleModel() { return ModelManager.get(RoleModel); }
    get copyModel() { return ModelManager.get(CopyModel); }


    time: number = 0;

    state = 2;
    cfg: Mission_onlineCfg = null;

    curSlot: cc.Node = null;
    onLoad() {
        gdk.e.on(TaskEventId.UPDATE_ONLINE_INFO, this.initOnlineData, this)
        gdk.gui.onViewChanged.on(this._onViewChanged, this);
        let taskmodel = ModelManager.get(TaskModel);
        if (!taskmodel.onlineInfo) {
            NetManager.send(new icmsg.MissionOnlineInfoReq())
        }
    }

    onEnable() {
    }

    onDisable() {
        // gdk.gui.onViewChanged.off(this._onViewChanged, this);
        // gdk.e.targetOff(this)
    }

    _onViewChanged(node: cc.Node) {
        let panelId = gdk.Tool.getResIdByNode(node);
        switch (panelId) {
            case PanelId.MainPanel.__id__:
            case PanelId.PveReady.__id__:
                this._updateNode();
                break;
            default:
                break;
        }
    }

    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateNode() {
        if (!cc.isValid(this.node)) return;
        // if (!this.node.activeInHierarchy) return;

        if (!JumpUtils.ifSysOpen(2844)) {
            this.node.active = false
            return
        }
        this.state = 2;
        this.initOnlineData()
    }

    initOnlineData() {
        if (!cc.isValid(this.node)) return;
        this.pzgjinNode.active = false;
        this.pzgziNode.active = false;
        this.pzgtyNode.active = false;
        this.chipSpine.node.active = false;
        this.state = TaskUtil.getOnlineReward()
        if (this.state == 2) {
            if (this.curSlot) {
                this.curSlot.destroy()
                this.curSlot = null;
            }
            this.node.active = false;
            return;
        } else if (this.state == 1) {
            this.node.active = true;
            this.timeNode.active = false;
            this.component.active = true;
        } else {
            this.node.active = true;
            this.timeNode.active = true;
            this.component.active = false;
            this.time = TaskUtil.getOnlineRewardTime();
            this.timeLb.string = TaskUtil.getOnlineRewardTimeStr(this.time);
        }
        //显示物品信息
        this.cfg = TaskUtil.getOnlineRewardCfg()
        if (this.cfg) {
            if (!this.curSlot) {
                this.curSlot = cc.instantiate(this.slot)
                this.curSlot.parent = this.slotParent
            }
            let slotCtrl = this.curSlot.getComponent(UiSlotItem)
            slotCtrl.updateItemInfo(this.cfg.reward[0], this.cfg.reward[1])
            let bg = this.curSlot.getChildByName("numbg")
            if (bg) {
                bg.active = this.cfg.reward[1] > 1
            }
            if (this.state == 1) {
                this.showItemPz();
            }
        }
        //刷新红点消息
        //gdk.e.emit(TaskEventId.UPDATE_CLEARANCE_GROW_ONLINE_RED);
    }

    temDt = 0;
    update(dt: number) {
        if (this.cfg && this.cfg.days < TaskUtil.getCrateRoleDays()) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:TASK_TIP2'));
            let panel = gdk.panel.get(PanelId.OnlineRewardPanel);
            if (panel) {
                let ctrl = panel.getComponent(OnlineRewardPanelCtrl);
                ctrl.close();
            }
            this.node.active = false;
            return;
        }

        if (this.state == 0) {
            if (this.time > 0) {
                this.temDt += dt;
                if (this.temDt > 1) {
                    this.time -= 1;
                    this.timeLb.string = TaskUtil.getOnlineRewardTimeStr(this.time);
                    this.temDt -= 1;
                }
            } else {
                this.initOnlineData();
            }
        }
    }

    //设置品质动画
    showItemPz() {
        //播放品质特效
        let itemConfig = <any>BagUtils.getConfigById(this.cfg.reward[0])
        if (itemConfig) {
            let subType = Math.floor(this.cfg.reward[0] / 10000);
            if (itemConfig.use_type != 6 && subType != ItemSubType.HEROCHIP) {
                if (itemConfig.color == 3) {
                    this.pzgziNode.active = true;
                    this.pzgzi.play();
                } else if (itemConfig.color == 4) {
                    this.pzgjinNode.active = true;
                    this.pzgjin.play();
                } else {
                    this.pzgtyNode.active = true;
                    this.pzgty.play();
                }
            } else {
                if (itemConfig.color == 3) {
                    this.chipSpine.node.active = true;
                    this.chipSpine.setAnimation(0, "stand2", true)
                } else if (itemConfig.color == 4) {
                    this.chipSpine.node.active = true;
                    this.chipSpine.setAnimation(0, "stand", true)
                }
            }
        }
    }

    //红点显示
    // showRedPoint(): boolean {
    //     return TaskUtil.getOnlineReward() == 1;
    // }
}
