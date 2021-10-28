import GlobalUtil from '../../../common/utils/GlobalUtil';
import NetManager from '../../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
 * 战斗回放界面控制组件
 * @Author: sthoo.huang  
 * @Date: 2020-05-13 21:11:15 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:55:07
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bounty/BountReplayCtrl")
export default class BountReplayCtrl extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    noReplayTips: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView = null;
    stageId: number = -1;

    onEnable() {
        this._initListView();
    }

    onDisable() {
        this.stageId = -1;
        this.list && this.list.clear_items();
        NetManager.targetOff(this);
    }

    onDestroy() {
        this.list && this.list.destroy();
        this.list = null;
    }

    _initListView() {
        if (this.list) return;
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.itemPrefab,
            cb_host: this,
            async: true,
            column: 1,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        });
    }

    updateView(stageId) {
        // 查询网络数据
        this.stageId = stageId
        let qmsg = new icmsg.FightLookupReq();
        qmsg.stageId = this.stageId;
        NetManager.send(qmsg, (rmsg: icmsg.FightLookupRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.onFightLookupRsp(rmsg);
        }, this);

    }

    onFightLookupRsp(rmsg: icmsg.FightLookupRsp) {
        if (this.stageId != rmsg.stageId) return;
        let len = rmsg.list.length;
        if (len == 0) {
            // 无记录
            this.noReplayTips.active = true;
            this.list.clear_items();
            return;
        }
        this.noReplayTips.active = false;
        // 排序按战从低到高
        GlobalUtil.sortArray(rmsg.list, (a, b) => {
            return a.playerPower - b.playerPower;
        });
        this.list.set_data(rmsg.list);
    }
}