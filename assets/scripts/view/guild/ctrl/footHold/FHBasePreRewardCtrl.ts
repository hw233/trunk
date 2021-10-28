import ConfigManager from '../../../../common/managers/ConfigManager';
import { Foothold_baseCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-09-24 17:15:41
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHBasePreRewardCtrl")
export default class FHBasePreRewardCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    list: ListView = null;

    onEnable() {
        this._initListView()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rewardItem,
            cb_host: this,
            async: true,
            gap_y: 10,
            direction: ListViewDir.Vertical,
        })
        let datas = ConfigManager.getItems(Foothold_baseCfg)
        this.list.set_data(datas)
    }
}