import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import { Adventure2_themeheroCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';


/**
 * @Description: 新奇境探险遗物兑换界面
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-20 19:37:30
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/NewAdventureStageRewardViewCtrl")
export default class NewAdventureStageRewardViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    actId: number = 107

    onEnable() {

        //刷新排名奖励信息
        this._updateView()

    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
    }

    _updateView(reset: boolean = true) {
        this._initListView();
        let actType = ActUtil.getActRewardType(this.actId);
        let cfgs = ConfigManager.getItemsByField(Adventure2_themeheroCfg, 'type', actType);
        let List2Data = [];
        for (let i = 0, n = cfgs.length; i < n - 1; i++) {
            let temData = { cfg: cfgs[i], index: i };
            List2Data.push(temData);
        }
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

}
