import ActUtil from '../../../act/util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyUtil from '../../../../common/utils/CopyUtil';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Mission_daily_ritualCfg, SystemCfg } from '../../../../a/config';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MustDoTaskViewItemCtrl extends UiListItem {

    @property(cc.Label)
    taskName: cc.Label = null;
    @property(cc.Label)
    taskNum: cc.Label = null
    @property(cc.Label)
    taskState: cc.Label = null;
    @property(cc.Node)
    goBtnNode: cc.Node = null;
    @property(cc.Node)
    overNode: cc.Node = null;

    cfg: Mission_daily_ritualCfg;
    colorStr: cc.Color[] = [cc.color('#A8E426'), cc.color('#FF603B')]
    info: icmsg.RitualInfo;
    showTime: boolean = false;
    updateView() {
        this.cfg = this.data.cfg;
        this.info = this.data.data;
        this.showTime = false;
        this.overNode.active = false;
        this.goBtnNode.active = true;
        this.taskState.node.color = this.colorStr[0]
        this.taskState.node.active = true;
        this.taskName.string = this.cfg.desc;
        if (JumpUtils.ifSysOpen(this.cfg.forward)) {
            this.taskNum.string = StringUtils.format("({0}/{1})", this.info.remain, this.info.total)
            this.taskState.string = '可挑战'
            if (this.cfg.id == 4 || this.cfg.id == 15) {
                this.taskNum.string = ""
            } else if (this.cfg.id == 1) {
                if (this.info.remain <= 0) {
                    this.goBtnNode.active = false;
                    this.taskState.string = ""
                }
            } else if (this.info.time > 0) {
                this.showTime = true;
                this.goBtnNode.active = false;
                let curTime = Math.floor(GlobalUtil.getServerTime() / 1000);
                if (curTime > this.info.time) {
                    this.showTime = false;
                    this.info.remain += 1;
                    this.goBtnNode.active = true;
                    this.taskNum.string = StringUtils.format("({0}/{1})", this.info.remain, this.info.total)
                    this.taskState.string = '可挑战'
                    return;
                }
                this.taskState.string = TimerUtils.format2(this.info.time - curTime);
                this.refreshTime = 1;
            } else if (this.info.remain <= 0 && this.info.total != 0) {
                this.overNode.active = true;
                this.goBtnNode.active = false;
                this.taskState.node.active = false;
            }
        } else {
            this.taskNum.string = "";
            this.taskState.node.color = this.colorStr[1]
            this.taskState.string = this.getSystemOpenStr(this.cfg.forward)
            this.goBtnNode.active = false;
        }

    }

    refreshTime = 0
    update(dt: number) {
        if (this.showTime) {
            this.refreshTime -= dt;
            if (this.refreshTime <= 0) {
                this.refreshTime = 1;
                let curTime = Math.floor(GlobalUtil.getServerTime() / 1000);
                if (curTime > this.info.time) {
                    this.showTime = false;
                    this.taskState.string = '可挑战'
                    this.info.remain += 1;
                    this.goBtnNode.active = true;
                    this.taskNum.string = StringUtils.format("({0}/{1})", this.info.remain, this.info.total)
                    return;
                }
                this.taskState.string = TimerUtils.format2(this.info.time - curTime);
            }
        }
    }

    goBtnClick() {
        [PanelId.MustDoTaskView].forEach(p => {
            if (gdk.panel.isOpenOrOpening(p)) {
                gdk.panel.hide(p);
            }
        })
        JumpUtils.openView(this.cfg.forward, false)
    }

    getSystemOpenStr(sysId: number): string {
        let res = ""
        let cfg = ConfigManager.getItemById(SystemCfg, sysId);
        if (!cfg) {
            return res;
        }
        let model = ModelManager.get(RoleModel);
        // 等级达不到要求
        if (model.level < cfg.openLv) {
            // 显示提示信息
            let text = "指挥官达到" + "@level级开启";
            res = text.replace("@level", `${cfg.openLv}`);
        }
        // 已通过指定副本
        if (cc.js.isNumber(cfg.fbId) && cfg.fbId > 0 && !CopyUtil.isFbPassedById(cfg.fbId)) {
            // 显示提示信息
            res = GlobalUtil.getSysFbLimitStr(cfg.fbId);
        }
        if (cc.js.isNumber(cfg.vip) && cfg.vip > 0 && ModelManager.get(RoleModel).vipLv < cfg.vip) {
            res = `vip等级达到${cfg.vip}级开启`;
        }
        //限时开启的功能 已过活动日期
        if (cc.js.isNumber(cfg.activity) && cfg.activity > 0 && !ActUtil.ifActOpen(cfg.activity)) {
            res = `活动未开启`;
        }
        return res;
    }
}

