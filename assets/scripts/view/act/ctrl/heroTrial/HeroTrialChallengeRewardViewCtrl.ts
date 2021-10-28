import ConfigManager from '../../../../common/managers/ConfigManager';
import InstanceModel from '../../../instance/model/InstanceModel';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Ordeal_challengeCfg, OrdealCfg } from '../../../../a/config';

/** 
 * @Description: 英雄试炼挑战奖励
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-30 14:30:44
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/heroTrial/HeroTrialChallengeRewardViewCtrl")
export default class HeroTrialChallengeRewardViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    model: InstanceModel = ModelManager.get(InstanceModel);

    ordealCfg: OrdealCfg;
    onEnable() {
        let arg = gdk.panel.getArgs(PanelId.HeroTrialChallengeRewardView);
        if (arg) {
            this.ordealCfg = arg[0];
        } else {
            this.close()
            return;
        }

        gdk.e.on(ActivityEventId.ACTIVITY_HEROTRIAL_CHALLENGEREWARD_UPDATE, this.refreshData, this)
        //刷新排名奖励信息
        this._updateView()

    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
        gdk.e.off(ActivityEventId.ACTIVITY_HEROTRIAL_CHALLENGEREWARD_UPDATE, this.refreshData, this)
    }

    _updateView(reset: boolean = true) {
        this._initListView();
        let cfgs = ConfigManager.getItems(Ordeal_challengeCfg, (item: Ordeal_challengeCfg) => {
            if (item.activity_id == this.ordealCfg.activity_id && item.type == this.ordealCfg.type) {
                return true;
            }
        })
        let List2Data = []
        // let curNum = this.model.heroTrialInfo.challengeTimes
        // let reward = this.model.heroTrialInfo.challengeReward;
        // for (let i = 0; i < cfgs.length; i++) {
        //     let cfg = cfgs[i];
        //     let temState = 0;
        //     if (curNum < cfg.challenge_times) {
        //         temState = 2;
        //     } else {
        //         let id = cfgs[i].challenge_times
        //         let old = reward[Math.floor((id - 1) / 8)];
        //         if (!((old & 1 << (id - 1) % 8) >= 1)) {
        //             temState = 1;
        //         }
        //     }
        //     let temData = { cfg: cfg, num: this.model.heroTrialInfo.challengeTimes, state: temState }
        //     List2Data.push(temData);
        // }
        //this.list.clear_items();
        this.list.set_data(List2Data, reset);
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
