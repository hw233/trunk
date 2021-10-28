import ArenaModel from '../../../common/models/ArenaModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import UiScrollView from '../../../common/widgets/UiScrollView';
import { ArenaEvent } from '../enum/ArenaEvent';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-04-15 14:35:44 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arena/ArenaReportViewCtrl")
export default class ArenaReportViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    scrollNode: cc.Node = null;

    @property(cc.Prefab)
    listItem: cc.Prefab = null;


    list: UiScrollView = null;

    get arenaModel() { return ModelManager.get(ArenaModel); }

    onLoad() {
        this.list = this.scrollNode.getComponent(UiScrollView);
        this.list.init();
    }

    onEnable() {
        gdk.e.on(ArenaEvent.RSP_ARENA_INFO, this._onArenaInfoRsp, this);
    }

    start() {
        let msg = new icmsg.ArenaInfoReq();
        NetManager.send(msg);
        this.reportListUpdate();
    }

    onDisable() {
        gdk.e.targetOff(this);
        this.list && this.list.clear_items();
    }

    _onArenaInfoRsp() {
        this.reportListUpdate();
    }

    reportListUpdate() {
        if (!this.list.enabled) {
            this.list.clear_items();
            return;
        }
        this.list.set_data(this.arenaModel.logList);
    }
}
