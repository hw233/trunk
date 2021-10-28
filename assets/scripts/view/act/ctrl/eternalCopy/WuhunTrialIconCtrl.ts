import { ActivityCfg, CopyCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import CopyModel from '../../../../common/models/CopyModel';
import RoleModel from '../../../../common/models/RoleModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import PanelId from '../../../../configs/ids/PanelId';
import { ActivityEventId } from '../../enum/ActivityEventId';
import ActUtil from '../../util/ActUtil';

/** 
 * @Description: 武魂试炼入口
 * @Author:yaozu.hu yaozu
 * @Date: 2020-08-04 11:29:25
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-18 17:03:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/eternalCopy/WuhunTrialIconCtrl")
export default class WuhunTrialIconCtrl extends cc.Component {


    // @property(cc.Label)
    // resetTimeLabel: cc.Label = null;


    _leftTime: number;
    dtime: number = 0;
    endTime: number = 0;
    activeId: number = 0;
    copyCfg: CopyCfg;
    get roleModel() { return ModelManager.get(RoleModel); }
    get copyModel() { return ModelManager.get(CopyModel); }
    // get leftTime(): number { return this._leftTime; }
    // set leftTime(v: number) {
    //     if (!v && v != 0) return;
    //     v = Math.max(0, v);
    //     this._leftTime = v;
    //     this.resetTimeLabel.string = '' + TimerUtils.format2(v);
    //     if (v == 0) {
    //         //TODO
    //         //gdk.gui.showMessage('武魂试炼已结束');
    //         this.refreshActivityData()
    //         //this.node.active = false;
    //     }
    // }

    onEnable() {
        gdk.gui.onViewChanged.on(this._onViewChanged, this);
    }

    onDisable() {
        gdk.gui.onViewChanged.off(this._onViewChanged, this);
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
        this.refreshActivityData()
    }

    refreshActivityData() {
        if (!cc.isValid(this.node)) return;

        //if (!this.node.activeInHierarchy) return;

        if (!JumpUtils.ifSysOpen(2833)) {
            this.node.active = false;
            return;
        }

        let temCfgs = ConfigManager.getItems(ActivityCfg, (item: ActivityCfg) => {
            if (item.id >= 24 && item.id <= 30) {
                return true;
            }
        });
        //加入平台判断
        let tCfgs = [];
        temCfgs.forEach(c => {
            if (Array.isArray(c.platform_id) && c.platform_id.indexOf(iclib.SdkTool.tool.config.platform_id) !== -1) {
                tCfgs.push(c);
            }
        })
        if (tCfgs.length <= 0) {
            temCfgs.forEach(c => {
                if (!c.platform_id) {
                    tCfgs.push(c);
                }
            })
        }
        temCfgs = tCfgs;
        let listData = []
        let nowTime = GlobalUtil.getServerTime();
        temCfgs.forEach(cfg => {
            //type 0多久后开启 1多久后结束
            if (ActUtil.ifActOpen(cfg.id)) {
                let endTime = ActUtil.getActEndTime(cfg.id)
                listData.push({ cfg: cfg, type: 1, time: endTime - nowTime })
            }
        })
        if (listData.length == 0) {
            this.node.active = false;
            return
        }
        this.node.active = true;
        gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 18);
        //this.resetTimeLabel.string = ''
        // this.node.active = this.copyCfg != null;
        // let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        // this.endTime = ActUtil.getActEndTime(this.activeId) / 1000;
        // this.leftTime = Math.max(0, Math.floor(this.endTime - nowTime));
    }

    update(dt: number) {
        // if (!this.leftTime || this.leftTime <= 0) return;
        // if (this.dtime >= 1) {
        //     let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        //     this.leftTime = Math.max(0, Math.floor(this.endTime - nowTime));
        //     this.dtime = 0;
        // }
        // else {
        //     this.dtime += dt;
        // }
    }

    //前往挑战按钮点击事件
    goActiveBtnClick() {

        gdk.panel.open(PanelId.EternalCopyView);
        //gdk.panel.open(PanelId.EternalCopyView);
        // let pos: cc.Vec2 = this.node.convertToWorldSpaceAR(cc.v2(0, -60));
        // gdk.panel.setArgs(PanelId.LimitTimeActivity, pos)
        // gdk.panel.open(PanelId.LimitTimeActivity);

    }
}
