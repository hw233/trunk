import ConfigManager from '../../../../../common/managers/ConfigManager';
import CopyUtil from '../../../../../common/utils/CopyUtil';
import { Copysurvival_equipCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';

/** 
 * 生存副本装备列表
 * @Author: sthoo.huang
 * @Date: 2020-07-16 11:50:54
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-09-02 17:30:56
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/equip/PveEquipListPanelCtrl")
export default class PveEquipListPanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    equipItem: cc.Prefab = null;

    private list: ListView = null;

    onEnable() {
        this.updateView();
    }

    onDisable() {
        this.list && this.list.destroy();
        this.list = null;
    }

    _initListView() {
        if (this.list) {
            return;
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.equipItem,
            cb_host: this,
            resize_cb: this._updateDataLater,
            column: 3,
            gap_x: 12.5,
            gap_y: 30,
            async: true,
            direction: ListViewDir.Vertical,
        });
    }

    _updateDataLater(v: any = null, resetPos: boolean = true) {
        gdk.Timer.callLater(this, this.updateView, [v, resetPos])
    }

    updateView() {
        this._initListView();
        let a = CopyUtil.getSurvivalHeroEquipsBy().concat().sort((a, b) => {
            // 先按品质排序，如果品质相同则按ID排序
            let cfgA = ConfigManager.getItemById(Copysurvival_equipCfg, a.equipId);
            let cfgB = ConfigManager.getItemById(Copysurvival_equipCfg, b.equipId);
            if (cfgA.color == cfgB.color) {
                return b.equipId - a.equipId;
            }
            return cfgB.color - cfgA.color;
        });
        this.list.set_data(a);
    }
}
