import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import PeakModel from '../../model/PeakModel';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Peak_challengeCfg } from '../../../../a/config';


/** 
 * @Description: 巅峰之战挑战奖励
 * @Author: yaozu.hu
 * @Date: 2021-02-22 11:33:16
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-17 10:11:12
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakChallengeRewardViewCtrl")
export default class PeakChallengeRewardViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    get model(): PeakModel { return ModelManager.get(PeakModel); }
    reward_type: number = 1;
    onEnable() {

        this.reward_type = 1//this.model.reward_type;
        gdk.e.on(ActivityEventId.ACTIVITY_PEAK_CHANGE_REWARD_UPDATE, this.refreshData, this)
        //刷新排名奖励信息
        this._updateView()

    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
        gdk.e.off(ActivityEventId.ACTIVITY_PEAK_CHANGE_REWARD_UPDATE, this.refreshData, this)
    }

    _updateView(reset: boolean = true) {
        this._initListView();
        let cfgs = ConfigManager.getItems(Peak_challengeCfg, (item: Peak_challengeCfg) => {
            if (item.reward_type == this.reward_type) {
                return true
            }
            return false;
        })
        let List2Data = []
        let curNum = this.model.peakStateInfo ? this.model.peakStateInfo.totalEnterTimes : 0;
        let reward = this.model.peakStateInfo.challenge;
        let curIndex = -1;
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i];
            let temState = 0;
            if (curNum < cfg.times) {
                temState = 2;
            } else {
                let id = cfg.times
                let old = reward[Math.floor((id - 1) / 8)];
                if (!((old & 1 << (id - 1) % 8) >= 1)) {
                    temState = 1;
                }
            }
            if (temState == 1 && curIndex < 0) {
                curIndex = i;
            }
            let temData = { cfg: cfg, num: curNum, state: temState }
            List2Data.push(temData);
        }
        curIndex = Math.max(0, curIndex);
        this.list.clear_items();
        this.list.set_data(List2Data, reset);
        this.list.scroll_to(curIndex)
    }
    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                gap_y: 5,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    refreshData() {
        this._updateView(false)
    }
}
