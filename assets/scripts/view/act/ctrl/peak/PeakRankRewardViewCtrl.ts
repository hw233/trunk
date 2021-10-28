import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import PeakModel from '../../model/PeakModel';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Peak_divisionCfg, Peak_gradeCfg } from '../../../../a/config';


/** 
 * @Description: 巅峰之战段位奖励
 * @Author: yaozu.hu
 * @Date: 2021-02-22 11:33:16
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-01 20:57:10
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakRankRewardViewCtrl")
export default class PeakRankRewardViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    get model(): PeakModel { return ModelManager.get(PeakModel); }
    reward_type: number = 1;
    selectCfg: Peak_divisionCfg;
    onEnable() {

        let args = gdk.panel.getArgs(PanelId.PeakRankRewardView)
        if (args) {
            this.selectCfg = args[0];
        }
        gdk.e.on(ActivityEventId.ACTIVITY_PEAK_RANK_REWARD_UPDATE, this.refreshData, this)
        //刷新排名奖励信息
        this._updateView()

    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
        gdk.e.off(ActivityEventId.ACTIVITY_PEAK_RANK_REWARD_UPDATE, this.refreshData, this)
    }

    _updateView(reset: boolean = true) {
        this._initListView();

        let ListData = [];

        let cfgs = ConfigManager.getItems(Peak_gradeCfg, (cfg: Peak_gradeCfg) => {
            if (cfg.rewards != '') {
                return true
            }
            return false;
        })
        let temStateInfo = this.model.peakStateInfo
        let index = 0;
        cfgs.forEach((cfg, idx) => {
            //{ cfg: Peak_gradeCfg, divisionCfg: Peak_divisionCfg, num: number, state: number }    //state 0 已领取 1可领取物品奖励 2可领取英雄奖励 3 不可领取
            let state = 0;
            let myPoints = temStateInfo.points;
            let divisionCfg = ConfigManager.getItemByField(Peak_divisionCfg, 'division', cfg.grade);
            if (this.selectCfg && this.selectCfg.division == cfg.grade) {
                index = idx;
            }
            if (cfg.grade > temStateInfo.maxRank) {
                state = 3
            } else {
                //判断是否领取物品奖励
                //temStateInfo.gradeReward
                let old = temStateInfo.gradeReward[Math.floor((cfg.grade - 1) / 8)];
                if ((old & 1 << (cfg.grade - 1) % 8) >= 1) {
                    //判断是否领取英雄奖励
                    if (cfg.hero == '') {
                        state = 0
                    } else {
                        let old = temStateInfo.gradeHero[Math.floor((cfg.grade - 1) / 8)];
                        if ((old & 1 << (cfg.grade - 1) % 8) >= 1) {
                            state = 0
                        } else {
                            state = 2
                        }
                    }
                } else {
                    state = 1
                }
            }
            let temData = { cfg: cfg, divisionCfg: divisionCfg, num: myPoints, state: state };
            ListData.push(temData);
        })

        this.list.clear_items();
        this.list.set_data(ListData, reset);
        if (index > 0) {
            this.list.scroll_to(index);
        }
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
