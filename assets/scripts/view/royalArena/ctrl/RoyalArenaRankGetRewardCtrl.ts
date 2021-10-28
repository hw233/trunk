import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RoyalModel from '../../../common/models/RoyalModel';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Royal_divisionCfg } from '../../../a/config';

/** 
 * @Description:
 * @Author: 
 * @Date: 2021-02-22 11:33:16
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-09 17:18:34
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaRankGetRewardCtrl")
export default class RoyalArenaRankGetRewardCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    get model(): RoyalModel { return ModelManager.get(RoyalModel); }
    selectCfg: Royal_divisionCfg;
    onEnable() {

        let args = gdk.panel.getArgs(PanelId.RoyalArenaRankGetReward)
        if (args) {
            this.selectCfg = args[0];
        }
        gdk.e.on(ActivityEventId.ACTIVITY_ROYAL_RANK_REWARD_UPDATE, this.refreshData, this)
        //刷新排名奖励信息
        this._updateView()

    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
        gdk.e.off(ActivityEventId.ACTIVITY_ROYAL_RANK_REWARD_UPDATE, this.refreshData, this)
    }

    _updateView(reset: boolean = true) {
        this._initListView();
        let cfgs = ConfigManager.getItems(Royal_divisionCfg, (cfg: Royal_divisionCfg) => {
            if (cfg.rewards && cfg.rewards.length > 0) {
                return true
            }
            return false;
        })
        let index = 0;
        cfgs.forEach((cfg, idx) => {
            if (this.selectCfg && this.selectCfg.division == cfg.division) {
                index = idx;
            }
        })
        this.list.clear_items();
        this.list.set_data(cfgs, reset);
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
