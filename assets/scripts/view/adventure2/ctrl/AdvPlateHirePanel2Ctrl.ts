import AdventureMainView2Ctrl from './AdventureMainView2Ctrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import { Adventure2_hireCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/**
 * @Description: 探险事件--英雄雇佣
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-18 18:28:49
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdvPlateHire2PanelCtrl")
export default class AdvPlateHire2PanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    hireItem: cc.Prefab = null

    list: ListView = null;

    _selectCfg: Adventure2_hireCfg

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    difficulty: number;
    selectIndex: number;
    plateIndex: number;
    onEnable() {
        this.plateIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_plateIndex : this.adventureModel.endless_plateIndex;
        this.difficulty = this.adventureModel.copyType == 0 ? this.adventureModel.difficulty : 4;
        this.selectIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_selectIndex : this.adventureModel.endless_selectIndex

        let msg = new icmsg.Adventure2MercenaryListReq()
        msg.difficulty = this.difficulty
        msg.plateIndex = this.selectIndex
        NetManager.send(msg, (data: icmsg.Adventure2MercenaryListRsp) => {
            this._updateViewData(data.heroList)
        })
    }

    onDisable() {

    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.hireItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this)
    }

    _updateViewData(list: icmsg.AdventureHero[]) {
        this._initListView()
        let newList = []
        for (let i = 0; i < list.length; i++) {
            let hireCfg = ConfigManager.getItemByField(Adventure2_hireCfg, "group", list[i].group, { hero: list[i].typeId })
            newList.push({ isSelect: false, cfg: hireCfg })
        }
        this.list.set_data(newList)
    }

    _selectItem(data, index) {
        let datas = this.list.datas
        for (let i = 0; i < datas.length; i++) {
            datas[i].isSelect = false
            if (data == datas[i]) {
                this._selectCfg = datas[i].cfg
                datas[i].isSelect = true
            }
        }
        this.list.set_data(datas, false)
    }

    clickFunc() {
        if (!this._selectCfg) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:ADVENTURE_TIP42"))
            return
        }

        let msg = new icmsg.Adventure2MercenaryReq()
        msg.difficulty = this.difficulty
        msg.plateIndex = this.selectIndex
        msg.group = this._selectCfg.group
        msg.typeId = this._selectCfg.hero
        NetManager.send(msg, (data: icmsg.Adventure2MercenaryRsp) => {
            if (this.adventureModel.copyType == 0) {
                this.adventureModel.normal_historyPlate.push(this.plateIndex)//上一个点
                this.adventureModel.normal_lastPlate = this.plateIndex
                this.adventureModel.normal_plateIndex = data.plateIndex
                this.adventureModel.normal_plateFinish = true
                this.adventureModel.normal_giveHeros.push(data.giveHeros)
            } else {
                this.adventureModel.endless_historyPlate.push(this.plateIndex)//上一个点
                this.adventureModel.endless_lastPlate = this.plateIndex
                this.adventureModel.endless_plateIndex = data.plateIndex
                this.adventureModel.endless_plateFinish = true
                //this.adventureModel.endless_giveHeros.push(data.giveHeros)
            }
            this.adventureModel.isMove = true

            gdk.panel.hide(PanelId.AdvPlateHirePanel2)
            let curView = gdk.gui.getCurrentView()
            let ctrl = curView.getComponent(AdventureMainView2Ctrl)
            ctrl.refreshPoints()
        })
    }
}