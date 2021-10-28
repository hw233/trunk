import AdventureMainView2Ctrl from './AdventureMainView2Ctrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureMainViewCtrl from './NewAdventureMainViewCtrl';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import { Adventure2_travelCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/**
 * @Description: 探险事件--旅行商店
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-21 13:42:38
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdvPlateTravelPanel2Ctrl")
export default class AdvPlateTravelPanel2Ctrl extends gdk.BasePanel {

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

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    difficulty: number;
    selectIndex: number;
    plateIndex: number;
    onEnable() {
        this.plateIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_plateIndex : this.adventureModel.endless_plateIndex;
        this.difficulty = this.adventureModel.copyType == 0 ? this.adventureModel.difficulty : 4;
        this.selectIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_selectIndex : this.adventureModel.endless_selectIndex
        let msg = new icmsg.Adventure2TravelListReq()
        msg.difficulty = this.difficulty
        msg.plateIndex = this.selectIndex
        NetManager.send(msg, (data: icmsg.Adventure2TravelListRsp) => {
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
        let selectPlate = this.selectIndex
        let curPlate = this.plateIndex
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
                let cfg = ConfigManager.getItemById(Adventure2_travelCfg, datas[i].id)
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
        let msg = new icmsg.Adventure2PlateEnterReq()
        msg.difficulty = this.difficulty
        msg.plateIndex = this.selectIndex
        NetManager.send(msg, (data: icmsg.Adventure2PlateEnterRsp) => {
            if (this.adventureModel.copyType == 0) {
                this.adventureModel.normal_historyPlate.push(this.plateIndex)//上一个点
                this.adventureModel.normal_lastPlate = this.plateIndex
                this.adventureModel.normal_plateIndex = data.plateIndex
                this.adventureModel.normal_plateFinish = false
            } else {
                this.adventureModel.endless_historyPlate.push(this.plateIndex)//上一个点
                this.adventureModel.endless_lastPlate = this.plateIndex
                this.adventureModel.endless_plateIndex = data.plateIndex
                this.adventureModel.endless_plateFinish = false
            }
            this.plateIndex = data.plateIndex
            this.updateTravelView()

            let curView = gdk.gui.getCurrentView()
            if (this.adventureModel.copyType == 0) {
                let ctrl = curView.getComponent(AdventureMainView2Ctrl)
                ctrl.refreshPoints()
            } else {
                let ctrl = curView.getComponent(NewAdventureMainViewCtrl)
                ctrl.refreshPoints()
            }
        }, this)
    }


    giveUpFunc() {
        let msg = new icmsg.Adventure2TravelFinishReq()
        msg.difficulty = this.difficulty
        msg.plateIndex = this.selectIndex
        NetManager.send(msg, (data: icmsg.Adventure2TravelFinishRsp) => {
            gdk.panel.hide(PanelId.AdvPlateTravelPanel2)
            if (this.adventureModel.copyType == 0) {
                this.adventureModel.normal_plateFinish = true
            } else {
                this.adventureModel.endless_plateFinish = true
            }
            //this.adventureModel.plateFinish = true
            this.adventureModel.isMove = true
            let curView = gdk.gui.getCurrentView()
            if (this.adventureModel.copyType == 0) {
                let ctrl = curView.getComponent(AdventureMainView2Ctrl)
                ctrl.refreshPoints()
            } else {
                let ctrl = curView.getComponent(NewAdventureMainViewCtrl)
                ctrl.refreshPoints()
            }
        }, this)
    }
}