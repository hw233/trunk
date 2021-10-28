import ConfigManager from '../../../../common/managers/ConfigManager';
import PanelId from '../../../../configs/ids/PanelId';
import { Guardian_starCfg, GuardianCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
/** 
 * @Description: 英雄守护者图鉴
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-01 18:22:43
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianBookPanelCtrl")
export default class GuardianBookPanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;

    onEnable() {
        this._updateViewInfo()
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 4,
                gap_x: 42,
                gap_y: 20,
                async: true,
                direction: ListViewDir.Vertical,
            })
            this.list.onClick.on(this._selectItem, this);
        }
    }

    _updateViewInfo() {
        this._initListView()
        let cfgs = ConfigManager.getItemsByField(GuardianCfg, "show", 1)
        this.list.set_data(cfgs)
    }

    _selectItem(cfg: GuardianCfg) {
        let maxStar = cfg.star_max
        let starCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", cfg.id, { star: maxStar })
        let guardian = new icmsg.Guardian
        guardian.id = 0
        guardian.level = starCfg.guardian_lv
        guardian.star = maxStar
        guardian.type = cfg.id
        gdk.panel.setArgs(PanelId.GuardianInfoTip, guardian, true)
        gdk.panel.open(PanelId.GuardianInfoTip)
    }
}