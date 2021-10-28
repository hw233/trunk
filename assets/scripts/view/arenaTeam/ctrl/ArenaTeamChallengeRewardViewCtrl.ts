import ArenaTeamViewModel from '../model/ArenaTeamViewModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import { ArenaTeamEvent } from '../enum/ArenaTeamEvent';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Teamarena_prizeCfg } from '../../../a/config';


/** 
 * @Description: 组队竞技场挑战奖励
 * @Author: yaozu.hu
 * @Date: 2021-02-03 16:25:39
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-02-04 10:36:21
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenaTeam/ArenaTeamChallengeRewardViewCtrl")
export default class ArenaTeamChallengeRewardViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    get model(): ArenaTeamViewModel { return ModelManager.get(ArenaTeamViewModel); }
    onEnable() {

        gdk.e.on(ArenaTeamEvent.RSP_ARENATEAM_CHANGETIMES_REWARD, this.refreshData, this)
        //刷新排名奖励信息
        this._updateView()

    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
        gdk.e.off(ArenaTeamEvent.RSP_ARENATEAM_CHANGETIMES_REWARD, this.refreshData, this)
    }

    _updateView(reset: boolean = true) {
        this._initListView();
        let cfgs = ConfigManager.getItems(Teamarena_prizeCfg)
        let List2Data = []
        let curNum = this.model.arenaTeamInfo ? this.model.arenaTeamInfo.fightTimes : 0;
        let reward = this.model.fightRewarded;
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i];
            let temState = 0;
            if (curNum < cfg.times) {
                temState = 2;
            } else {
                let id = cfgs[i].times
                let old = reward;
                if (!((old & 1 << id) >= 1)) {
                    temState = 1;
                }
            }
            let temData = { cfg: cfg, num: curNum, state: temState }
            List2Data.push(temData);
        }
        this.list.clear_items();
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
