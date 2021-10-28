import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianModel from '../../../role/model/GuardianModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { Activity_guardianCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
/** 
 * @Description: 守护者召唤有礼
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-21 14:50:12
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/prefab/callReward/GuardianCallRewardViewCtrl")
export default class GuardianCallRewardViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Label)
    timeLb: cc.Label = null;

    list: ListView;

    actTypeId: number = 1;
    actId: number = 97;

    _dtime: number = 0;
    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v !== 0) {
            return;
        }
        this._leftTime = Math.max(0, v);
        if (this._leftTime == 0) {
            this.onCloseBtnClick();
            //this.timeLb.node.active = false;
        }
        else {
            let str = TimerUtils.format1(this.leftTime / 1000);
            this.timeLb.string = str
        }
    }

    get model(): GuardianModel { return ModelManager.get(GuardianModel); }

    onEnable() {

        NetManager.send(new icmsg.ActivityGuardianDrawInfoReq(), (rsp: icmsg.ActivityGuardianDrawInfoRsp) => {
            this.model.callRewardInfo = rsp;
            this.updateList();
        })

        // this.model.callRewardInfo = new icmsg.ActivityGuardianDrawInfoRsp();
        // this.model.callRewardInfo.drawTimes = 9;
        // this.model.callRewardInfo.playerNum = 5;
        // this.model.callRewardInfo.rewarded = 0;
        // let tem = new icmsg.ActivityGuardianDrawLimit()
        // tem.awardId = 1;
        // tem.limit = 100;
        // this.model.callRewardInfo.limit = [tem, tem, tem, tem, tem, tem]
        // this.updateList();
        this.actTypeId = ActUtil.getActRewardType(this.actId)

        this._updateTime()
    }

    update(dt: number) {
        if (!this.leftTime) {
            return;
        }
        this._dtime += dt;
        if (this._dtime >= 1) {
            this._dtime -= 1;
            this._updateTime();

        }
    }

    _updateTime() {
        let curTime = GlobalUtil.getServerTime();
        let ct = ActUtil.getActEndTime(this.actId);
        this.leftTime = ct - curTime;
    }

    onCloseBtnClick() {
        gdk.panel.hide(PanelId.GuardianActivityMainView);
    }

    onDisable() {

        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    updateList() {
        this._initList();
        this.list.clear_items();
        let listData = []
        let info = this.model.callRewardInfo
        let cfgs = ConfigManager.getItems(Activity_guardianCfg, (cfg: Activity_guardianCfg) => {
            if (cfg.type == this.actTypeId && info.playerNum >= cfg.players[0] && info.playerNum <= cfg.players[1]) {
                return true;
            }
        })

        for (let i = 0, n = cfgs.length; i < n; i++) {
            let cfg = cfgs[i]
            let state = 0;
            if (info.drawTimes >= cfg.number) {
                if ((info.rewarded & 1 << cfg.reward_id - 1) < 1) {
                    if (info.limit[i].limit > 0) {
                        state = 2
                    } else {
                        state = 1
                    }
                } else {
                    state = 3;
                }
            }

            let temData = { cfg: cfg, state: state, curNum: info.drawTimes, haveNum: info.limit[i].limit }
            listData.push(temData);
        }
        this.list.set_data(listData);
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                async: true,
                gap_y: 20,
                direction: ListViewDir.Vertical,
            })
        }
    }
}
