import AdventureMainViewCtrl from './AdventureMainViewCtrl';
import AdventureModel from '../model/AdventureModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import { Adventure_travelCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/**
 * @Description: 探险事件--旅行商店
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:46:57
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdvPlateTravelPanelCtrl")
export default class AdvPlateTravelPanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    travelItem: cc.Prefab = null

    @property(cc.Node)
    btnGo: cc.Node = null;

    @property(cc.Node)
    btnClose: cc.Node = null;

    list: ListView = null;

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }

    onEnable() {
        let msg = new icmsg.AdventureTravelListReq()
        msg.plateIndex = this.adventureModel.selectIndex
        NetManager.send(msg, (data: icmsg.AdventureTravelListRsp) => {
            this.adventureModel.travelList = data.travelIndex
        })
    }

    onDisable() {
        this.adventureModel.travelList = []
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.travelItem,
            cb_host: this,
            async: true,
            gap_y: 10,
            direction: ListViewDir.Horizontal,
        })
    }

    @gdk.binding("adventureModel.travelList")
    updateTravelView() {
        let selectPlate = this.adventureModel.selectIndex
        let curPlate = this.adventureModel.plateIndex
        if (selectPlate != curPlate) {
            this.btnGo.active = true
            this.btnClose.active = false
        } else {
            this.btnGo.active = false
            this.btnClose.active = true
        }

        this._initListView()
        this.list.set_data(this.adventureModel.travelList)

        let datas = this.adventureModel.travelList
        if (datas.length > 0) {
            let count = 0
            for (let i = 0; i < datas.length; i++) {
                let cfg = ConfigManager.getItemById(Adventure_travelCfg, datas[i].id)
                if (datas[i].times >= cfg.times_limit) {
                    count++
                }
            }

            if (count == datas.length) {
                this.giveUpFunc()
            }
        }

    }

    goFunc() {
        let msg = new icmsg.AdventurePlateEnterReq()
        msg.plateIndex = this.adventureModel.selectIndex
        NetManager.send(msg, (data: icmsg.AdventurePlateEnterRsp) => {
            this.adventureModel.historyPlate.push(this.adventureModel.plateIndex)//上一个点
            this.adventureModel.lastPlate = this.adventureModel.plateIndex
            this.adventureModel.plateIndex = data.plateIndex
            this.adventureModel.plateFinish = false

            this.updateTravelView()

            let curView = gdk.gui.getCurrentView()
            let ctrl = curView.getComponent(AdventureMainViewCtrl)
            ctrl.refreshPoints()
        }, this)
    }


    giveUpFunc() {
        let msg = new icmsg.AdventureTravelFinishReq()
        msg.plateIndex = this.adventureModel.selectIndex
        NetManager.send(msg, (data: icmsg.AdventureTravelFinishRsp) => {
            gdk.panel.hide(PanelId.AdvPlateTravelPanel)
            this.adventureModel.plateFinish = true
            this.adventureModel.isMove = true
            let curView = gdk.gui.getCurrentView()
            let ctrl = curView.getComponent(AdventureMainViewCtrl)
            ctrl.refreshPoints()
        }, this)
    }
}