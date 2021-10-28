import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RelicModel, { RelicMapType } from '../model/RelicModel';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Relic_mapCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-31 15:12:23 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicPointListViewCtrl")
export default class RelicPointListViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    get RelicModel(): RelicModel { return ModelManager.get(RelicModel); }

    mapType: RelicMapType;
    list: ListView;
    onEnable() {
        this.mapType = ConfigManager.getItemById(Relic_mapCfg, this.RelicModel.mapId).mapType;
        NetManager.send(new icmsg.RelicPointListReq({
            mapType: this.mapType,
            needPoints: true
        }), () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateList();
        }, this);
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
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
                gap_y: 3,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        this._initList();
        let infos = this.RelicModel.cityDataMap[this.mapType];
        let datas = [];
        for (let key in this.RelicModel.cityMap) {
            if (this.RelicModel.cityMap[key].numType <= this.RelicModel.mapNumId || !!infos[key]) {
                datas.push({
                    cityId: parseInt(key),
                    info: infos[key] || null,
                    cfg: this.RelicModel.cityMap[key].cfg
                })
            }
        };
        datas.sort((a, b) => { return b.cfg.fight - a.cfg.fight; });
        this.list.clear_items();
        this.list.set_data(datas);
    }
}
