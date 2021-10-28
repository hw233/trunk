import NetManager from '../../../common/managers/NetManager';
import RelicRecordItemCtrl from './RelicRecordItemCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-29 10:49:42 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicRecordCtrl")
export default class RelicRecordCtrl extends cc.Component {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    refreshNode: cc.Node = null;

    mapType: number;
    cityId: number;
    totalNum: number;
    rewards: icmsg.GoodsInfo[];
    eachReqNum: number = 10; //每次请求十条
    curRecords: icmsg.RelicRecord[] = []; //当前日志
    logMap: { [timesamp: string]: icmsg.RelicRecord } = {}; //时间戳-日志信息
    onEnable() {
        this.scrollView.node.on("scroll-to-bottom", this.onScrollToEnd, this);
    }

    onDisable() {
        this.scrollView.node.targetOff(this);
        this.refreshNode.stopAllActions();
        NetManager.targetOff(this);
    }

    init(mapType: number, cityId: number, totalNum: number) {
        [this.mapType, this.cityId, this.totalNum] = [mapType, cityId, totalNum];
        this._req(0);
    }

    setReward(rewards: icmsg.GoodsInfo[]) {
        this.rewards = rewards;
    }

    _req(index) {
        let req = new icmsg.RelicPointRecordsReq();
        req.mapType = this.mapType;
        req.pointId = this.cityId;
        req.index = index;
        req.count = Math.min(this.eachReqNum, this.totalNum);
        NetManager.send(req, (resp: icmsg.RelicPointRecordsRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            //todo
            this._setRefreshState(false);
            this._updateLogs(resp.records);
        }, this);
    }

    _updateLogs(newLog: icmsg.RelicRecord[]) {
        newLog.forEach(log => {
            if (!this.logMap[log.time]) {
                this.logMap[log.time] = log;
                this.curRecords.push(log);
            }
        });
        this.curRecords.sort((a, b) => { return b.time - a.time; });
        this._updateList();
    }

    // _initList() {
    //     if (!this.list) {
    //         this.list = new ListView({
    //             scrollview: this.scrollView,
    //             mask: this.scrollView.node,
    //             content: this.content,
    //             item_tpl: this.itemPrefab,
    //             cb_host: this,
    //             async: true,
    //             gap_y: 3,
    //             direction: ListViewDir.Vertical,
    //             scroll_to_end_cb: this._onScrollToEnd,
    //         })
    //     }
    // }

    _updateList() {
        this.content.removeAllChildren();
        this.content.getComponent(cc.Layout).enabled = true;
        this.curRecords.forEach(r => {
            let item = cc.instantiate(this.itemPrefab);
            item.parent = this.content;
            let ctrl = item.getComponent(RelicRecordItemCtrl);
            let rewards = r.type == 2 ? this.rewards : null;
            ctrl.updateView(r, rewards);
        });
        this.scrollView.scrollToTop();
        gdk.Timer.callLater(this, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.content.getComponent(cc.Layout).enabled = false;
            this.content.height = Math.max(140, this.content.height);
        })
    }

    onScrollToEnd() {
        if (this.refreshNode.getNumberOfRunningActions() >= 1) return;
        if (this.totalNum <= this.curRecords.length) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP24"));
        }
        else {
            this._setRefreshState(true);
            this._req(this.totalNum - this.curRecords.length);
        }
    }

    /**
     * 设置刷新标志的状态
     * @param v false-隐藏 true-显示
     */
    _setRefreshState(v: boolean) {
        if (!v) {
            this.refreshNode.stopAllActions();
            this.refreshNode.active = false;
            this.scrollView.node.height = 138;
        }
        else {
            this.scrollView.node.height = 112;
            this.refreshNode.active = true;
            this.refreshNode.runAction(
                cc.repeatForever(
                    cc.rotateBy(2, 360)
                )
            )
        }
    }
}
