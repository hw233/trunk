import ConfigManager from '../../../common/managers/ConfigManager';
import { Item_equipCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-04 09:55:26 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/EquipBookViewCtrl')
export default class EquipBookViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    partName: string[] = [
        gdk.i18n.t("i18n:LOTTERY_TIP14"),
        gdk.i18n.t("i18n:LOTTERY_TIP15"),
        gdk.i18n.t("i18n:LOTTERY_TIP16"),
        gdk.i18n.t("i18n:LOTTERY_TIP17")
    ];
    _list: ListView;
    select: number;
    cfgs: any = {};
    onLoad() {
        let cfgs = ConfigManager.getItems(Item_equipCfg);
        cfgs.forEach(cfg => {
            if (!cfg.isShow || cfg.isShow != "1") {
                if (!this.cfgs[cfg.part - 1]) this.cfgs[cfg.part - 1] = [];
                this.cfgs[cfg.part - 1].push(cfg);
            }
        });
        for (let key in this.cfgs) {
            this.cfgs[key].sort((a: Item_equipCfg, b: Item_equipCfg) => {
                return b.color - a.color;
            });
        }
    }

    onEnable() {
        let idx;
        let arg = this.args;
        if (arg) {
            if (arg instanceof Array) idx = arg[0];
            else idx = arg;
        }
        if (!idx) idx = 0;
        this.selectPartType(idx);
    }

    onDisable() {
        if (this._list) {
            this._list.destroy();
            this._list = null;
        }
    }

    selectPartType(idx: number) {
        if (idx == this.select) return;
        this.select = idx;
        this._updateView();
    }

    onMenuClick(e, data) {
        if (!e) return
        this.selectPartType(data);
    }

    _initList() {
        if (!this._list) {
            this._list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.slotPrefab,
                cb_host: this,
                column: 5,
                gap_x: 28,
                gap_y: 15,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateView() {
        this._initList();
        let cfgs = this.cfgs[this.select];
        this._list.clear_items();
        this._list.set_data(cfgs);
    }

}
