import ActivityBtnCtrl from '../../../view/act/ctrl/ActivityBtnCtrl';
import ActivityConfig, { ActType } from '../../../view/act/config/ActivityConfig';
import ActUtil from '../../../view/act/util/ActUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import InstanceNetModel from '../../../common/models/InstanceNetModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureModel from '../../../view/adventure2/model/NewAdventureModel';
import OpenSysButton from '../../../common/widgets/OpenSysButton';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import SdkTool from '../../../sdk/SdkTool';
import SignModel from '../../../view/sign/model/SignModel';
import SignUtil from '../../../view/sign/util/SignUtil';
import StoreModel from '../../../view/store/model/StoreModel';
import TaskModel from '../../../view/task/model/TaskModel';
import { ActivityEventId } from '../../../view/act/enum/ActivityEventId';
import { StoreMenuType } from '../../../view/store/ctrl/StoreViewCtrl';
/**
 * 主城界面控制类
 * @Author: weiliang.huang
 * @Description:
 * @Date: 2019-03-25 11:42:12
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-07 20:41:30
 */

/**按钮数据类型 */
type BtnTypeParams = {
    ctrl: ActivityBtnCtrl,
    x: number,
    y: number,
    data: ActType,
    ifShow: boolean,
}

/**按钮排版信息 */
const BtnInfo = {
    gapX: 10,
    gapY: 0,
    /**按钮左侧边距,对应每一行下标依次添加 */
    leftX: [20, 20, 20]
}
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainPanelCtrl")
export default class MainPanelCtrl extends gdk.BasePanel {

    @property(cc.Node)
    actPanel: cc.Node = null;

    @property(cc.Prefab)
    btnPrefab: cc.Prefab = null;

    @property(sp.Skeleton)
    spineBg: sp.Skeleton = null;

    @property(cc.Node)
    btnScore: cc.Node = null;

    @property(cc.Node)
    mustDobtn: cc.Node = null;

    @property(cc.Node)
    guardianTipNode: cc.Node = null;

    activityBtns: BtnTypeParams[][] = []; //存储活动按钮的数组
    btnShow: boolean = true; // 活动面板是否显示中
    _pooKey: string = "ACTIVITY_BTN_POOL";

    get roleModel() { return ModelManager.get(RoleModel); }
    get taskModel() { return ModelManager.get(TaskModel); }
    get instanceNetModel() { return ModelManager.get(InstanceNetModel); }
    get storeModel() { return ModelManager.get(StoreModel); }
    get signModel() { return ModelManager.get(SignModel); }
    get adventureModel() { return ModelManager.get(NewAdventureModel); }

    onLoad() {
        // 不显示充值按钮
        if (!SdkTool.tool.can_charge) {
            [
                'bg/btn13/button',
                'bg/btn3/button',
                'bg/btn4/button',
            ].forEach(e => {
                let n = cc.find(e, this.node);
                if (n) {
                    n.active = false;
                }
            });
        }
        this._updateBtns(false, false);
        this.spineBg.setAnimation(0, 'hit', false);
        this.spineBg.addAnimation(0, 'stand', true);
    }

    onEnable() {
        gdk.e.on(ActivityEventId.ACTIVITY_REMOVE, (e: gdk.Event) => {
            this._deleteActivity(e.data)
        }, this);
        //gdk.e.on(ChatEvent.ADD_CHAT_INFO, this._addMainChat, this);
        //this._addMainChat();
        // this._checkAutoOpenView();
        // this.scheduleOnce(() => {
        //     this._updateActBtns();
        // }, 0);
        // GlobalUtil.updateMainSelect(MainSelectType.BASE, 1);
        // this._showBaseInfo();
        if (this.spineBg.animation == 'hit') {
            // 隐藏所有动态显示隐藏的节点
            let ui = this.node.getChildByName('contentNode');
            ui.children.forEach(node => {
                node.active = false;
            });
            // 当前动作播放完成后更新按钮状态
            this.spineBg.setCompleteListener(() => {
                if (!cc.isValid(this.node)) return;
                if (!this.enabled) return;
                this.spineBg.setCompleteListener(null);
                this._updateBtns(true, true);
                let ui = this.node.getChildByName('contentNode');
                ui.children.forEach(node => {
                    gdk.NodeTool.show(node);
                });
                this.setGuardianTips()
            });
        } else {
            // 直接显示
            this._updateBtns(true, true);
            let ui = this.node.getChildByName('contentNode');
            ui.children.forEach(node => {
                gdk.NodeTool.show(node);
            });
            this.setGuardianTips()
        }
        // this._monthCardIconShowOrHide();
        this.btnScore.active = true;
        this.mustDobtn.active = JumpUtils.ifSysOpen(2873);

        if (this.adventureModel.needShowPushView) {
            this.adventureModel.firstShowPushView = false
            this.adventureModel.needShowPushView = false;
            JumpUtils.openActivityMain(22);
        }

    }

    onDisable() {
        gdk.e.targetOff(this);
        this.spineBg.setCompleteListener(null);
        this._updateBtns(false, false);
        gdk.Timer.clearAll(this);
        this.btnScore.active = false
    }

    // 预加载界面列表
    get preloads() {
        let a = [
            PanelId.TowerPanel,
            PanelId.Instance,
            PanelId.Store,
            PanelId.Role2,
            PanelId.EquipView2,
            PanelId.Lottery,
            PanelId.Task,
            PanelId.Alchemy,
            PanelId.BYView,
            PanelId.GuildMain,
            PanelId.Arena,
            PanelId.GeneLotteryView,
            PanelId.TurntableDrawView,
            PanelId.HeroComposeView,
            PanelId.HeroResetPanel,
        ];
        return a;
    }

    setGuardianTips() {
        if (JumpUtils.ifSysOpen(2897) && ActUtil.ifActOpen(98)) {
            let type = ActUtil.getActRewardType(98);
            let tem = GlobalUtil.getLocal('guardianType');
            if (!tem || tem != type) {
                GlobalUtil.setLocal('guardianType', type);
                this.guardianTipNode.active = true;
            } else {
                this.guardianTipNode.active = false;
            }
        } else {
            this.guardianTipNode.active = false;
        }
    }

    // 显示或隐藏所有按钮
    _updateBtns(b: boolean, effect: boolean = true) {
        let a = this.spineBg.node.children;
        for (let i = 0, n = a.length; i < n; i++) {
            let node = a[i];
            if (b) {
                gdk.NodeTool.show(node, effect);
                // 锁的显示与隐藏
                let l = cc.find('button/sub_arrowbg', node);
                if (l) {
                    let c = node.getComponentInChildren(OpenSysButton);
                    if (c && !JumpUtils.ifSysOpen(c.sysId) && c.sysId != 300) {
                        l.active = true;
                    } else {
                        l.active = false;
                    }
                }
                // 播放动画
                let m = node.getComponentInChildren(sp.Skeleton);
                if (m) {
                    m.setAnimation(0, 'hit', false);
                    m.addAnimation(0, 'stand', true);
                }
            } else {
                gdk.NodeTool.hide(node, effect);
            }
        }
    }

    /**自动签到 */
    @gdk.binding("signModel.signed")
    _updateSignState() {
        if (!this.signModel.signed) {
            gdk.Timer.once(800, this, () => {
                SignUtil.CheckOpenSign();
            });
        }
    }

    /**更新主界面任务内容 */
    @gdk.binding("roleModel.level")
    @gdk.binding("instanceNetModel.instanceList")
    _updateTaskText() {
        // let id = InstanceNetUtils.getCompleteStageId(InstanceID.MAIN_INST)
        // let items = ConfigManager.getItems(Mission_mainCfg)
        // let cfg: Mission_mainCfg = null
        // let ifFinish = false
        // if (id == 0) {
        //     this.taskState = 0
        //     cfg = items[0]
        // } else {
        //     for (let index = 0; index < items.length; index++) {
        //         const element = items[index];
        //         if (element.stage_id == id) {
        //             let geted = TaskUtil.getTaskAwardState(element.id)
        //             if (geted) {
        //                 cfg = items[index + 1]
        //             } else {
        //                 this.taskState = 2
        //                 ifFinish = true
        //                 cfg = element
        //             }
        //         }
        //     }
        // }
        // this.curTask = cfg
        // let height = 82
        // if (!cfg) {
        //     this.taskPanel.active = false
        // } else {
        //     this.taskPanel.active = true
        //     let copyCfg = ConfigManager.getItemById(Copy_stageCfg, cfg.stage_id)
        //     let text = cfg.desc.replace("{stage_id}", copyCfg.name)
        //     let ifOpen = this.roleModel.level >= cfg.player_lv
        //     if (!ifOpen) {
        //         text = `${text}<color=#FF5A5A>(${cfg.player_lv}级解锁)</c>`
        //     } else if (ifFinish) {
        //         text = `${text}<color=#58FF47>(已完成)</c>`
        //     } else {
        //         this.taskState = 1
        //     }
        //     this.taskDesc.string = text
        //     height = Math.max(height, this.taskDesc.node.height + 40)
        //     this.taskTips.y = height / 2
        //     this.taskDesc.node.y = height / 2
        //     this.taskPanel.height = height
        // }
    }



    /**新增活动 */
    _addActivity(id) {
        let config = ActivityConfig.getConfigById(id)
        this._updateOneBtn(config)
    }

    /**删除活动 */
    _deleteActivity(id) {
        this.activityBtns.forEach(arr => {
            let ifExist = false
            for (let index = 0; index < arr.length; index++) {
                let item: BtnTypeParams = arr[index];
                if (item.data.id == id) {
                    ifExist = true
                    item.ctrl.stopTimer()
                    item.ctrl.node.removeFromParent(false)
                    gdk.pool.put(this._pooKey, item.ctrl.node)
                    arr.splice(index, 1)
                }
            }
            if (ifExist) {
                this._layoutBtns()
            }
        })
    }

    /**根据id获取按钮数据 */
    _getActBtn(id) {
        let config = ActivityConfig.getConfigById(id)
        if (!this.activityBtns[config.row]) {
            this.activityBtns[config.row] = []
        }
        let items = this.activityBtns[config.row]
        for (let index = 0; index < items.length; index++) {
            const item: BtnTypeParams = items[index];
            const data = item.data;
            if (data.id == id) {
                return item
            }
        }
    }

    /**更新活动数据 */
    @gdk.binding("roleModel.level")
    _updateActBtns() {
        let configs = ActivityConfig.config
        for (let index = 0; index < configs.length; index++) {
            const element = configs[index];
            let ifOpen = ActUtil.ifActOpen(element.id)
            if (ifOpen) {
                this._updateOneBtn(element)
            } else {
                this._deleteActivity(element.id)
            }
        }
        // console.log("this.activityBtns", this.activityBtns)
        this._layoutBtns()
    }

    _updateOneBtn(info: ActType) {
        let item: BtnTypeParams = this._getActBtn(info.id)
        if (item && item.ctrl) {
            item.ctrl.updateActivityInfo(info)
            return
        }
        let ctrl = this._createBtn(info)
        let height = ctrl.node.height
        let newItem: BtnTypeParams = {
            ctrl: ctrl,
            x: 0,
            y: -(height + BtnInfo.gapY) * info.row - height / 2,
            data: info,
            ifShow: this.btnShow
        }
        ctrl.node.y = newItem.y

        this.activityBtns[info.row].push(newItem)
    }

    /**创建活动按钮 */
    _createBtn(info: ActType) {
        let btn = gdk.pool.get(this._pooKey)
        let ctrl: ActivityBtnCtrl
        if (!btn) {
            btn = cc.instantiate(this.btnPrefab)
        }
        btn.parent = this.actPanel
        ctrl = btn.getComponent(ActivityBtnCtrl)
        ctrl.updateActivityInfo(info)
        return ctrl
    }

    /**按钮重新排序 */
    _layoutBtns() {
        this.activityBtns.forEach((arr, row) => {
            GlobalUtil.sortArray(arr, this.sortFunc)
            let left = BtnInfo.leftX[row] || 0;
            for (let index = 0; index < arr.length; index++) {
                const element: BtnTypeParams = arr[index];
                let node = element.ctrl.node
                let width = node.width
                element.x = left + (width + BtnInfo.gapX) * index + width / 2
                if (element.ifShow) {
                    node.x = element.x
                }
            }
        });
    }

    sortFunc(a: BtnTypeParams, b: BtnTypeParams) {
        return a.data.col - b.data.col
    }

    /**左上角头像点击函数 */
    headBtnFunc() {
        gdk.panel.open("MainSet")
    }

    /**主线面板点击 */
    mainTaskFunc() {

    }

    /**跳转购买金币 */
    buyGoldFunc() {
        JumpUtils.openStore([StoreMenuType.Gold])
    }

    /**跳转购买钻石 */
    buyDiamondFunc() {
        // JumpUtils.openStore([StoreMenuType.Diamond])
        JumpUtils.openRechargeView([3]);
    }



    /** 月卡按钮显示或隐藏*/
    // @gdk.binding("storeModel.monthCardListInfo")
    // _monthCardIconShowOrHide() {
    //     if (this.storeModel.monthCardListInfo.length > 0) {
    //         this.monthCardBtn.active = true
    //     } else {
    //         this.monthCardBtn.active = false
    //     }
    // }
}