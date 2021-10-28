import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RewardPreviewCtrl from '../../../../common/widgets/RewardPreviewCtrl';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { Activity_weekend_giftsCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-25 17:35:27 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wonderfulActivity/WeekendGiftViewCtrl")
export default class WeekendGiftViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    timeLab: cc.Label = null;

    @property([cc.Node])
    giftNode: cc.Node[] = [];

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }
    actId: number = 81;
    isPass: boolean = false;
    onEnable() {
        this._updateTime();
        this.schedule(this._updateTime, 1);
        let req = new icmsg.ActivityWeekendGiftInfoReq();
        NetManager.send(req, (resp: icmsg.ActivityWeekendGiftInfoRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateView();
        }, this);
    }

    onDisable() {
        this.unscheduleAllCallbacks();
        NetManager.targetOff(this);
    }

    onGiftClick(e, type) {
        let idx = parseInt(type);
        if (this.isPass) {
            gdk.gui.showMessage('活动已结束');
            return;
        }
        let day = new Date(GlobalUtil.getServerTime()).getDay();
        if (idx == { 6: 0, 0: 1, 1: 2 }[day] && (this.actModel.weekEndRecord & 1 << idx) < 1) {
            //当天未领
            let req = new icmsg.ActivityWeekendGiftReq();
            NetManager.send(req, (resp: icmsg.ActivityWeekendGiftRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                GlobalUtil.openRewadrView(resp.list);
                this._updateView();
            }, this);
        }
        else {
            //已领  时间未到 预览奖励
            let cfg = ConfigManager.getItemByField(Activity_weekend_giftsCfg, 'days', { 0: 6, 1: 0, 2: 1 }[idx]);
            let arr: icmsg.GoodsInfo[] = [];
            cfg.rewards.forEach(r => {
                let g = new icmsg.GoodsInfo();
                g.typeId = r[0];
                g.num = r[1];
                arr.push(g);
            });
            gdk.panel.open(PanelId.RewardPreview, (node: cc.Node) => {
                let worldPos = e.currentTarget.parent.convertToWorldSpaceAR(e.currentTarget.position);
                let pos = gdk.gui.layers.popupLayer.convertToNodeSpaceAR(worldPos);
                let ctrl = node.getComponent(RewardPreviewCtrl);
                ctrl.setRewards(arr, gdk.i18n.t("i18n:ARENA_TIP4"));
                node.setPosition(pos.x, pos.y + ctrl.scrollView.node.height + 90);
                if (idx == 2) {
                    node.x -= ctrl.scrollView.node.width / 2;
                }
            }, this);
        }
    }

    _updateView() {
        let curDay = new Date(GlobalUtil.getServerTime()).getDay();
        this.giftNode.forEach((n, idx) => {
            let flag = cc.find('icon/flag', n);
            let pass = cc.find('icon/pass', n);
            let redPoint = cc.find('icon/RedPoint', n);
            pass.active = (this.actModel.weekEndRecord & 1 << idx) <= 0 && idx < { 6: 0, 0: 1, 1: 2 }[curDay];
            flag.active = (this.actModel.weekEndRecord & 1 << idx) >= 1;
            redPoint.active = !flag.active && curDay == { 0: 6, 1: 0, 2: 1 }[idx];
        });
    }

    _updateTime() {
        let endTime = ActUtil.getActEndTime(this.actId);
        if (!endTime) {
            this.timeLab.string = '活动已结束';
            this.isPass = true;
            this.unscheduleAllCallbacks();
        } else {
            let eTime = endTime - GlobalUtil.getServerTime();
            if (eTime <= 0) {
                this.timeLab.string = '活动已结束';
                this.isPass = true;
                this.unscheduleAllCallbacks();
            }
            else {
                this.timeLab.string = TimerUtils.format4(eTime / 1000);
            }
        }
    }
}
