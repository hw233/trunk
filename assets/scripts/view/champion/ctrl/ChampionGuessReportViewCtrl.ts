import NetManager from '../../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-26 11:51:30 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionGuessReportViewCtrl")
export default class ChampionGuessReportViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    onEnable() {
        let req = new icmsg.ChampionGuessHistoryReq();
        NetManager.send(req, (resp: icmsg.ChampionGuessHistoryRsp) => {
            this._updateList(resp.list);
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
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList(datas: icmsg.ChampionGuess[]) {
        this._initList();
        datas.sort((a, b) => { return b.guessTime - a.guessTime; })
        this.list.clear_items();
        this.list.set_data(datas);
    }
}
