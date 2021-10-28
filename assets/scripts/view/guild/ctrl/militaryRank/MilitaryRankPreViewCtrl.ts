import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from '../footHold/FootHoldModel';
import ModelManager from '../../../../common/managers/ModelManager';
import { Foothold_titleCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-02-05 15:22:19
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/militaryRank/MilitaryRankPreViewCtrl")
export default class MilitaryRankPreViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    preItem: cc.Prefab = null

    list: ListView = null;

    get footholdModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }


    onEnable() {
        this._updateViewInfo()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.preItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
    }

    _updateViewInfo() {
        this._initListView()
        let cfgs = ConfigManager.getItems(Foothold_titleCfg)
        this.list.set_data(cfgs)

        this.list.scroll_to(this.footholdModel.militaryRankLv)
    }
}