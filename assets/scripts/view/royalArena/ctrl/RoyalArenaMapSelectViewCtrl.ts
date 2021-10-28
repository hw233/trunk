

/** 
 * @Description: 皇家竞技场场景选择界面
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-17 17:36:51
 */

import { Royal_sceneCfg } from "../../../a/config";
import ConfigManager from "../../../common/managers/ConfigManager";
import ModelManager from "../../../common/managers/ModelManager";
import RoyalModel from "../../../common/models/RoyalModel";
import { ListView, ListViewDir } from "../../../common/widgets/UiListview";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaMapSelectViewCtrl")
export default class RoyalArenaMapSelectViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    list: ListView = null


    //selectId: number = 0;

    get royalModel() { return ModelManager.get(RoyalModel); }

    cfgs: Royal_sceneCfg[] = []
    onEnable() {
        // let args = gdk.panel.getArgs(PanelId.RoyalArenaMapSelectView);
        // if (args) {
        //     this.selectId = args[0];
        // }
        this.cfgs = ConfigManager.getItems(Royal_sceneCfg)
        this._updateScroll();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
    }


    _updateScroll() {
        this._initListView()
        this.list.set_data(this.cfgs);
    }


    @gdk.binding('royalModel.mapIds')
    refreshData() {
        if (this.list) {
            this.list.refresh_items();
        }
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scroll,
            mask: this.scroll.node,
            content: this.content,
            item_tpl: this.itemPre,
            cb_host: this,
            column: 3,
            gap_x: 10,
            gap_y: 10,
            async: true,
            direction: ListViewDir.Vertical,
        })
        //this.list.onClick.on(this._selectItem, this);
    }

}
