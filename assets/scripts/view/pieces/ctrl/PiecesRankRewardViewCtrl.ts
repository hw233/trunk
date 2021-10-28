import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Pieces_divisionCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-18 15:49:31 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/pieces/PiecesRankRewardViewCtrl")
export default class PiecesRankRewardViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    rewardPrefab: cc.Prefab = null;

    list: ListView;
    onEnable() {
        this._updateList();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.rewardPrefab,
                cb_host: this,
                gap_y: 5,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        let rewardType = ActUtil.getActRewardType(106);
        let c = ConfigManager.getItems(Pieces_divisionCfg);
        rewardType = Math.min(rewardType, c[c.length - 1].type);
        this._initListView();
        let cfgs = ConfigManager.getItems(Pieces_divisionCfg, (cfg: Pieces_divisionCfg) => {
            if (cfg.point > 0 && cfg.type == rewardType) return true;
        });
        this.list.clear_items();
        this.list.set_data(cfgs);
    }
}
