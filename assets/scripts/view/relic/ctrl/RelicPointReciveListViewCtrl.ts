import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RelicModel from '../model/RelicModel';
import RelicUtils from '../utils/RelicUtils';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Relic_pointCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-02-22 10:45:27 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicPointReciveListViewCtrl")
export default class RelicPointReciveListViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    get relicModel(): RelicModel { return ModelManager.get(RelicModel); }

    list: ListView;
    onEnable() {
    }

    onDisable() {
        this.relicModel.pointTransNoticeList = {};
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    onCancelBtnClick() {
        if (this.list) {
            let datas: icmsg.RelicTransferNoticeRsp[] = this.list.datas;
            for (let i = 0; i < datas.length; i++) {
                let req = new icmsg.RelicTransferCancelReq();
                req.ownerId = datas[i].ownerBrief.id;
                NetManager.send(req);
            }
            this.relicModel.pointTransNoticeList = {};
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

    @gdk.binding("relicModel.pointTransNoticeList")
    _updateView() {
        this._initList();
        let map = this.relicModel.pointTransNoticeList;
        let datas = [];
        for (let key in map) {
            datas.push(map[key]);
        }
        datas.sort((a, b) => {
            let mapId = [1001, 1002][a.mapType - 1];
            let cfgA = ConfigManager.getItemById(Relic_pointCfg, RelicUtils.getTypeByCityId(mapId, a.pointId))
            let cfgB = ConfigManager.getItemById(Relic_pointCfg, RelicUtils.getTypeByCityId(mapId, b.pointId))
            return cfgB.color - cfgA.color;
        });
        this.list.clear_items();
        this.list.set_data(datas);
    }
}
