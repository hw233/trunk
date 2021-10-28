import NetManager from '../../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/**
 * enemy世界巅峰赛竞猜投注结果记录界面
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-18 14:19:00
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/worldhonor/WorldHonorGuessReportViewCtrl")
export default class WorldHonorGuessReportViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    onEnable() {
        let req = new icmsg.ArenaHonorGuessHistoryReq();
        req.world = true;
        NetManager.send(req, (resp: icmsg.ArenaHonorGuessHistoryRsp) => {
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

    _updateList(datas: icmsg.ArenaHonorMatch[]) {
        this._initList();
        datas.sort((a, b) => { return b.guessTime - a.guessTime; })
        this.list.clear_items();
        this.list.set_data(datas);
    }
}
