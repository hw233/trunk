import PanelId from '../../../../configs/ids/PanelId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';


/** 
 * @Description: 英雄试炼排行榜Item
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-26 14:35:11
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/newHeroTrial/NewHeroTrialDamageViewCtrl")
export default class NewHeroTrialDamageViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView1: cc.ScrollView = null;

    @property(cc.Node)
    content1: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab1: cc.Prefab = null;

    list1: ListView;
    damages: number[] = []
    onEnable() {
        let arg = gdk.panel.getArgs(PanelId.NewHeroTrialDamageView);
        if (arg) {
            this.damages = arg[0];
            //this.serverNum = arg[1]
            this._updateView1()
        }
    }
    onDisable() {
        if (this.list1) {
            this.list1.destroy();
            this.list1 = null;
        }
    }
    _updateView1(resetPos: boolean = true) {
        this._initListView1();
        let temData = [];
        this.list1.clear_items();
        this.damages.forEach((dmg, i) => {
            let data = { index: i, damage: dmg }
            temData.push(data);
        })
        this.list1.set_data(temData, resetPos);
    }
    _initListView1() {
        if (!this.list1) {
            this.list1 = new ListView({
                scrollview: this.scrollView1,
                mask: this.scrollView1.node,
                content: this.content1,
                item_tpl: this.itemPrefab1,
                cb_host: this,
                gap_y: 5,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }
}
