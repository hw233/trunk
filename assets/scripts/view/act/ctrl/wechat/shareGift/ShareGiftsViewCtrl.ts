import ActivityUtils from '../../../../../common/utils/ActivityUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import RoleModel from '../../../../../common/models/RoleModel';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';

/** 
 * 小程序邀请好友
 * @Author: sthoo.huang  
 * @Date: 2021-07-13 14:33:13
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-06 11:19:18
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wechat/ShareGift/ShareGiftsViewCtrl")
export default class StarGiftsViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property({ type: cc.Integer, tooltip: "平台活动类型ID" })
    typeId: number = 0;
    @property({ type: cc.Integer, tooltip: "平台活动等级参数" })
    level: number = 0;
    @property({ type: cc.Integer, tooltip: "列表每行列数" })
    column: number = 1;

    list: ListView;

    onEnable() {
        this._updateView();
    }

    onDisable() {
        gdk.Timer.clearAll(this);
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                async: true,
                gap_y: 5,
                column: this.column,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateView() {
        this._initList();
        this.list.clear_items();
        let cfgs = ActivityUtils.getPlatformConfigs(this.typeId);
        if (this.typeId == 9) {
            // 成长大礼，成长豪礼特殊处理
            for (let i = cfgs.length - 1; i >= 0; i--) {
                let c = cfgs[i];
                if (Math.floor(c.args / 100) != this.level) {
                    cfgs.splice(i, 1);
                }
            }
        }
        if (!cfgs || !cfgs.length) {
            return;
        }
        this.list.set_data(cfgs);
    }

    // 只针对冰狐小游戏平台
    onShareBtnClick() {
        let sdk: any = iclib.SdkTool.tool['_bhSdk'];
        if (sdk && typeof sdk.goShare === 'function') {
            sdk.goShare({ query: 'friend=' + ModelManager.get(RoleModel).id });
        }
    }
}
