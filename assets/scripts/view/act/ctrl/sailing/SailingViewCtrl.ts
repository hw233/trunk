import { ActivityCfg, Sailing_topupCfg } from "../../../../a/config";
import ConfigManager from "../../../../common/managers/ConfigManager";
import ModelManager from "../../../../common/managers/ModelManager";
import ActivityUtils from "../../../../common/utils/ActivityUtils";
import { ListView, ListViewDir } from "../../../../common/widgets/UiListview";
import SailingModel from "../../model/SailingModel";
import ActUtil from "../../util/ActUtil";

/**
 * @Description: 跨服活动列表
 * @Author: yaozu.hu
 * @Date: 2021-01-22 17:19:33
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-19 10:51:07
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/sailing/SailingViewCtrl")
export default class SailingViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    activityId: number = 123;
    list: ListView;
    cfg: ActivityCfg;

    onEnable() {
        let startTime = new Date(ActUtil.getActStartTime(this.activityId));
        let endTime = new Date(ActUtil.getActEndTime(this.activityId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            // gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            this.close();
            return;
        }
        else {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
            this.cfg = ActUtil.getCfgByActId(this.activityId);
        }
        this._updateView();
    }

    onDisable() {
        gdk.Timer.clearAll(this);
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
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateView() {
        this._initList();
        this.list.clear_items();
        let rewardType = this.cfg.reward_type;
        let monthlyRecharge = ModelManager.get(SailingModel).sailingInfo.money;
        let cfgs = ConfigManager.getItems(Sailing_topupCfg, (cfg: Sailing_topupCfg) => {
            if (cfg.type == rewardType) return true;
        });
        let temDatas = []
        let endCfgs = [];
        cfgs.forEach((cfg, i) => {
            if (monthlyRecharge >= cfg.money) {
                if (!ActivityUtils.getSailingRewardState(i)) {//cfgs[i].index
                    temDatas.push(cfg)
                } else {
                    endCfgs.push(cfg);
                }
            }
            else {
                temDatas.push(cfg)
            }
        })
        temDatas = temDatas.concat(endCfgs)
        this.list.set_data(temDatas);
        // gdk.Timer.callLater(this, () => {
        //     if (!this.list || !cc.isValid(this.node)) return;

        //     for (let i = 0; i < cfgs.length; i++) {
        //         if (monthlyRecharge >= cfgs[i].money) {
        //             if (!ActivityUtils.getSailingRewardState(i)) {//cfgs[i].index
        //                 this.list.scroll_to(Math.max(0, i - 1));
        //                 return;
        //             }
        //         }
        //         else {
        //             this.list.scroll_to(Math.max(0, i - 1));
        //             return;
        //         }
        //     }
        // });
    }
}
