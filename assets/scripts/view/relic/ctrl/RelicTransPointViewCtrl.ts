import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RelicModel from '../model/RelicModel';
import RoleModel from '../../../common/models/RoleModel';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Relic_mapCfg, Relic_pointCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-02-20 17:33:17 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicTransPointViewCtrl")
export default class RelicTransPointViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    resp: icmsg.RelicGuildExplorer[] = [];
    onEnable() {
        let m = ModelManager.get(RelicModel);
        let mapCfg = ConfigManager.getItemById(Relic_mapCfg, m.mapId);
        let pointId = m.curExploreCity.split('-')[1];
        let pointCfg = ConfigManager.getItemById(Relic_pointCfg, m.cityMap[parseInt(pointId)].pointType);
        let req = new icmsg.RelicGuildExplorersReq();
        req.minLevel = mapCfg.lv;
        req.minPower = pointCfg.fight_limit;
        NetManager.send(req, (resp: icmsg.RelicGuildExplorersRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.resp = resp.list;
            this._updateList();
        }, this);
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        NetManager.targetOff(this);
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
        this.resp.sort((a, b) => {
            if (a.endTime == b.endTime) {
                return b.remainTimes - a.remainTimes;
            }
            else {
                return a.endTime - b.endTime;
            }
        });
        let datas = [];
        let rM = ModelManager.get(RoleModel);
        this.resp.forEach(r => {
            if (r.playerBrief.id !== rM.id) {
                datas.push(r);
            }
        });
        this.list.clear_items();
        this.list.set_data(datas);
    }
}
