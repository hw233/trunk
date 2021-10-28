import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StoreModel from '../../../store/model/StoreModel';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activity_super_valueCfg, SystemCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-10-14 10:31:31 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-14 19:41:14
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/superValue/SuperValueViewCtrl")
export default class SuperValueViewCtrl extends gdk.BasePanel {
    @property(UiSlotItem)
    giftSlot: UiSlotItem = null;

    @property(cc.Node)
    giftBtn: cc.Node = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Node)
    leftArrow: cc.Node = null;

    @property(cc.Node)
    rightArrow: cc.Node = null;

    @property([cc.Node])
    actItems: cc.Node[] = [];

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    activityId: number = 140;
    curDay: number;
    curSelectDay: number;
    curCfgs: Activity_super_valueCfg[] = [];
    onEnable() {
        let startTime = new Date(ActUtil.getActStartTime(this.activityId));
        let endTime = new Date(ActUtil.getActEndTime(this.activityId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            this.close();
            return;
        }
        this.timeLab.string = `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        NetManager.on(icmsg.ActivitySuperValueInfoRsp.MsgType, this._onInfoRsp, this);
        NetManager.send(new icmsg.ActivitySuperValueInfoReq());
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    onActBtnClick(e, data) {
        let idx = parseInt(data);
        if (!this._checkActVaild(this.curSelectDay)) {
            gdk.gui.showMessage('当前活动已结束');
            this.close();
            // NetManager.send(new icmsg.ActivitySuperValueInfoReq());
            return;
        }
        let info = this.actModel.superValueInfo[this.curSelectDay];
        if (info && info.info[idx].isComplete) {
            return;
        }
        if (this.curCfgs[idx]) {
            if (this.curCfgs[idx].system_id == 2834) {
                if (!ModelManager.get(StoreModel).firstPayTime) {
                    JumpUtils.openView(1801);
                } else {
                    gdk.panel.open(PanelId.DailyFirstRecharge);
                }
            } else if (this.curCfgs[idx].index == 8) {
                //成长基金
                JumpUtils.openGrowthFunds(1);
            }
            else if (this.curCfgs[idx].index == 10) {
                //超值基金
                JumpUtils.openGrowthFunds(2);
            } else if (this.curCfgs[idx].index == 11) {
                //至尊月卡
                gdk.panel.setArgs(PanelId.MonthCard, 1);
                gdk.panel.setArgs(PanelId.TradingPort, 12);
                gdk.panel.open(PanelId.TradingPort);
            } else if (this.curCfgs[idx].index == 12) {
                //豪华基金
                JumpUtils.openGrowthFunds(3);
            } else {
                JumpUtils.openView(this.curCfgs[idx].system_id, true);
            }
            this.close();
        }
    }

    onArrowClick(e, data) {
        let dir = parseInt(data); //1-left 2-right
        if (dir == 1) {
            for (let i = this.curSelectDay; i > 0; i--) {
                if (this._checkActVaild(i - 1)) {
                    this.curSelectDay = i - 1;
                    this._updateView();
                    return;
                }
            }
        } else {
            for (let i = this.curSelectDay; i < this.curDay; i++) {
                if (this._checkActVaild(i + 1)) {
                    this.curSelectDay = i + 1;
                    this._updateView();
                    return;
                }
            }
        }
    }

    onGiftBtnClick() {
        let info = this.actModel.superValueInfo[this.curSelectDay];
        if (info && (!info.info[0].isComplete || !info.info[1].isComplete)) {
            gdk.gui.showMessage('请先完成以上全部活动');
            return;
        }
        let req = new icmsg.ActivitySuperValueGainReq();
        req.day = this.curSelectDay;
        NetManager.send(req, (resp: icmsg.ActivitySuperValueGainRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            GlobalUtil.openRewadrView(resp.goodsInfo);
            // this._onInfoRsp();
            this.giftBtn.active = false;
            this.giftSlot.node.getChildByName('flag').active = true;
            this.leftArrow.active = this._checkArrow(1);
            this.rightArrow.active = this._checkArrow(2);
            this._updateRedpoint();
        }, this);
    }

    _onInfoRsp() {
        this.curDay = Math.floor((GlobalUtil.getServerTime() - ActUtil.getActStartTime(this.activityId)) / (24 * 60 * 60 * 1000)) + 1;
        this.curSelectDay = Math.min(6, this.curDay);
        //已开启 但未全激活
        for (let i = 0; i < this.curDay; i++) {
            let info = this.actModel.superValueInfo[i + 1];
            if (this._checkActVaild(i + 1)) {
                if (!info || (!info.info[0].isComplete || !info.info[1].isComplete)) {
                    this.curSelectDay = i + 1;
                    break;
                }
            }
        }
        //可领奖
        for (let key in this.actModel.superValueInfo) {
            let info = this.actModel.superValueInfo[key];
            if (info && !info.isGain && info.info[0].isComplete && info.info[1].isComplete) {
                this.curSelectDay = info.day;
                break;
            }
        }
        this.curSelectDay = Math.min(6, this.curSelectDay);
        this._updateView();
    }

    _updateView() {
        this.curCfgs = ConfigManager.getItems(Activity_super_valueCfg, (cfg: Activity_super_valueCfg) => {
            if (cfg.reward_type == this.curSelectDay) return true;
        });
        let info = this.actModel.superValueInfo[this.curSelectDay];
        //gift
        let reward = this.curCfgs[0].rewards[0];
        this.giftSlot.updateItemInfo(reward[0], reward[1]);
        this.giftSlot.itemInfo = {
            series: null,
            itemId: reward[0],
            itemNum: reward[1],
            type: BagUtils.getItemTypeById(reward[0]),
            extInfo: null
        };
        if (info && info.isGain) {
            this.giftBtn.active = false;
            this.giftSlot.node.getChildByName('flag').active = true;
        } else if (info && info.info[0].isComplete && info.info[1].isComplete) {
            this.giftBtn.active = true;
            GlobalUtil.setAllNodeGray(this.giftBtn, 0);
            this.giftSlot.node.getChildByName('flag').active = false;
        } else {
            this.giftBtn.active = true;
            GlobalUtil.setAllNodeGray(this.giftBtn, 1);
            this.giftSlot.node.getChildByName('flag').active = false;
        }
        //actBanner
        this.actItems.forEach((item, idx) => {
            GlobalUtil.setSpriteIcon(this.node, item, `view/act/texture/superValue/${this.curCfgs[idx].background[0]}`);
            let isActive = info ? info.info[idx].isComplete : false;
            let url = isActive ? 'czg_yijihuo' : this.curCfgs[idx].background[1];
            GlobalUtil.setSpriteIcon(this.node, item.getChildByName('actBtn'), `view/act/texture/superValue/${url}`);
        });
        //arrow
        this.leftArrow.active = this._checkArrow(1);
        this.rightArrow.active = this._checkArrow(2);
        this._updateRedpoint();
    }

    _checkActVaild(day: number) {
        let cfgs = ConfigManager.getItems(Activity_super_valueCfg, (cfg: Activity_super_valueCfg) => {
            if (cfg.reward_type == day) return true;
        });
        if (!cfgs || cfgs.length !== 2) return false;
        for (let i = 0; i < cfgs.length; i++) {
            let actId = ConfigManager.getItemById(SystemCfg, cfgs[i].system_id).activity;
            if (actId == 137) {
                //每日首充
                // let storeM = ModelManager.get(StoreModel);
                // if (storeM.firstPayTime) {
                //     let time = TimerUtils.getTomZerohour(storeM.firstPayTime / 1000);
                //     if (GlobalUtil.getServerTime() < time * 1000 && !ActUtil.ifActOpen(actId)) {
                //         return false;
                //     }
                // } else if (!ActUtil.ifActOpen(actId)) {
                //     return false;
                // }
            } else if (cc.js.isNumber(actId) && actId > 0 && !ActUtil.ifActOpen(actId)) {
                return false;
            }

        }
        return true;
    }

    /**
     * 
     * @param dir 1-左 2-右
     */
    _checkArrow(dir: number) {
        if (this.curSelectDay == 1 && dir == 1) return false;
        if (this.curSelectDay == 6 && dir == 2) return false;
        if (dir == 1) {
            for (let i = 0; i < this.curSelectDay; i++) {
                if (this._checkActVaild(i + 1)) return true;
            }
        } else {
            let info = this.actModel.superValueInfo[this.curSelectDay];
            if (info && info.info[0].isComplete && info.info[1].isComplete) {
                for (let i = this.curSelectDay; i < this.curDay; i++) {
                    if (this._checkActVaild(i + 1)) return true;
                }
            }
        }
        return false;
    }

    _updateRedpoint() {
        if (this.leftArrow.active) {
            let b = false;
            for (let i = 0; i < this.curSelectDay - 1; i++) {
                let info = this.actModel.superValueInfo[i + 1];
                if (info && !info.isGain && info.info[0].isComplete && info.info[1].isComplete) {
                    b = true;
                    break;
                }
            }
            this.leftArrow.getChildByName('RedPoint').active = b;
        }
        if (this.rightArrow.active) {
            let b2 = false;
            for (let i = this.curSelectDay; i < this.curDay; i++) {
                let info = this.actModel.superValueInfo[i + 1];
                if (info && !info.isGain && info.info[0].isComplete && info.info[1].isComplete) {
                    b2 = true;
                    break;
                }
            }
            this.rightArrow.getChildByName('RedPoint').active = b2;
        }
    }
}
