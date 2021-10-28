import ChampionModel from '../model/ChampionModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { Champion_exchangeCfg, Champion_mainCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RedPointEvent } from '../../../common/utils/RedPointUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-23 14:47:23 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionExchangeViewCtrl")
export default class ChampionExchangeViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    onEnable() {
        let req = new icmsg.ChampionRedPointsReq();
        NetManager.send(req, (resp: icmsg.ChampionRedPointsRsp) => {
            let model = ModelManager.get(ChampionModel);
            resp.exchanged.forEach(info => {
                model.exchangedInfo[info.id] = info.num;
            });
            model.myPoints = resp.points;
            this._updateList();
        }, this);
        // NetManager.on(ChampionExchangeRsp.MsgType, (resp: ChampionExchangeRsp) => {
        //     let model = ModelManager.get(ChampionModel);
        //     resp.exchanged.forEach(info => {
        //         model.exchangedInfo[info.id] = info.num;
        //     });
        //     this._updateList();
        // }, this)
        GlobalUtil.setLocal('championET', `${GlobalUtil.getServerTime()}_true`, true);
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
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
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        this._initList();
        let cfg: Champion_mainCfg = ConfigManager.getItemById(Champion_mainCfg, ModelManager.get(ChampionModel).infoData.seasonId);
        let datas = [];
        if (cfg) {
            datas = ConfigManager.getItemsByField(Champion_exchangeCfg, 'season', cfg.season);
            if (datas.length <= 0) {
                let cs = ConfigManager.getItems(Champion_exchangeCfg);
                datas = ConfigManager.getItemsByField(Champion_exchangeCfg, 'season', cs[cs.length - 1].season);
            }
        }
        let list1 = [];
        let list2 = [];
        let m = ModelManager.get(ChampionModel);
        datas.forEach(d => {
            let boughtNum = m.exchangedInfo[d.id] || 0;
            if (boughtNum >= d.limit_times) {
                list2.push(d);
            }
            else {
                list1.push(d);
            }
        });
        this.list.clear_items();
        this.list.set_data([...list1, ...list2]);
    }
}
