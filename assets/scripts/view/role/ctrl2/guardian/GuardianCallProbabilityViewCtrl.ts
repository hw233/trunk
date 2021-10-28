import ActUtil from '../../../act/util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import { Guardian_tipsCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';


/** 
 * @Description: 英雄守护者召唤物概率界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-21 16:28:11
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianCallProbabilityViewCtrl")
export default class GuardianCallProbabilityViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;
    list: ListView;
    actId: number = 99;
    callRewardType: number = 1;
    onEnable() {
        this.callRewardType = ActUtil.getActRewardType(this.actId);

        this._updateView()
    }
    onDisable() {

        if (this.list) {
            this.list.destroy()
            this.list = null;
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
                column: 1,
                gap_x: 0,
                gap_y: 0,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }

    }

    _updateView(resetPos: boolean = true) {
        this._initListView();
        let listData = [];
        listData = ConfigManager.getItems(Guardian_tipsCfg, (cfg: Guardian_tipsCfg) => {
            if (cfg.reward_type == this.callRewardType) {
                return true
            }
        });
        this.list.clear_items()
        this.list.set_data(listData, resetPos);
    }

}
