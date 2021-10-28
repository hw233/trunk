import ConfigManager from '../../../../common/managers/ConfigManager';
import GuildModel from '../../model/GuildModel';
import ModelManager from '../../../../common/managers/ModelManager';
import { Guildboss_rankingCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-23 11:32:54 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/boss/GuildRankRewardViewCtrl")
export default class GuildRankRewardViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    onEnable() {
        this._updateView();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    _updateView() {
        this._initListView();
        let cfgs = ConfigManager.getItemsByField(Guildboss_rankingCfg, 'level', ModelManager.get(GuildModel).gbBossLv);
        cfgs.sort((a, b) => { return a.id - b.id; });
        this.list.clear_items();
        this.list.set_data(cfgs);
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
}
