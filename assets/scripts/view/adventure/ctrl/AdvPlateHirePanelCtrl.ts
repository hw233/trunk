import AdventureMainViewCtrl from './AdventureMainViewCtrl';
import AdventureModel from '../model/AdventureModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import { Adventure_hireCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/**
 * @Description: 探险事件--英雄雇佣
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 12:07:43
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdvPlateHirePanelCtrl")
export default class AdvPlateHirePanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    hireItem: cc.Prefab = null

    list: ListView = null;

    _selectCfg: Adventure_hireCfg

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }

    onEnable() {

        let msg = new icmsg.AdventureMercenaryListReq()
        msg.plateIndex = this.adventureModel.selectIndex
        NetManager.send(msg, (data: icmsg.AdventureMercenaryListRsp) => {
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
            let hireCfg = ConfigManager.getItemByField(Adventure_hireCfg, "group", list[i].group, { hero: list[i].typeId })
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

        let msg = new icmsg.AdventureMercenaryReq()
        msg.plateIndex = this.adventureModel.selectIndex
        msg.group = this._selectCfg.group
        msg.typeId = this._selectCfg.hero
        NetManager.send(msg, (data: icmsg.AdventureMercenaryRsp) => {
            this.adventureModel.historyPlate.push(this.adventureModel.plateIndex)//上一个点
            this.adventureModel.lastPlate = this.adventureModel.plateIndex
            this.adventureModel.plateIndex = data.plateIndex
            this.adventureModel.plateFinish = true
            this.adventureModel.isMove = true
            this.adventureModel.giveHeros = data.giveHeros

            gdk.panel.hide(PanelId.AdvPlateHirePanel)
            let curView = gdk.gui.getCurrentView()
            let ctrl = curView.getComponent(AdventureMainViewCtrl)
            ctrl.refreshPoints()
        })
    }
}