import AdventureMainView2Ctrl from './AdventureMainView2Ctrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureMainViewCtrl from './NewAdventureMainViewCtrl';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import { Adventure2_adventureCfg, Adventure2_rankingCfg } from '../../../a/config';
/**
 * @Description: 探险事件--随机事件
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-14 16:05:16
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdvPlateSavePanel2Ctrl")
export default class AdvPlateSavePanel2Ctrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    soltItem: cc.Prefab = null

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }
    difficulty: number;
    selectIndex: number;
    plateIndex: number;

    onEnable() {
        this.plateIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_plateIndex : this.adventureModel.endless_plateIndex;
        this.difficulty = this.adventureModel.copyType == 0 ? this.adventureModel.difficulty : 4;
        this.selectIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_selectIndex : this.adventureModel.endless_selectIndex
        let layerId = this.adventureModel.copyType == 0 ? this.adventureModel.normal_layerId : this.adventureModel.endless_layerId
        let curIndex = this.selectIndex
        let advCfg = ConfigManager.getItemByField(Adventure2_adventureCfg, "difficulty", this.difficulty, { layer_id: layerId, plate: curIndex })
        let items = ConfigManager.getItemsByField(Adventure2_rankingCfg, "group", advCfg.event_id)

        // for (let i = 0; i < items.length; i++) {
        //     let showItem = cc.instantiate(this.soltItem)
        //     let ctrl = showItem.getComponent(UiSlotItem)
        //     ctrl.updateItemInfo(items[i].item, items[i].item_number)
        //     this.content.addChild(showItem)
        // }
    }

    onDisable() {

    }

    openFunc() {
        let msg = new icmsg.Adventure2SaveStateReq()
        msg.difficulty = this.difficulty
        msg.plateIndex = this.selectIndex
        NetManager.send(msg, (data: icmsg.Adventure2SaveStateRsp) => {
            //GlobalUtil.openRewadrView(data.list)

            this.adventureModel.isMove = true
            gdk.panel.hide(PanelId.AdvPlateSavePanel2)
            let curView = gdk.gui.getCurrentView()
            if (this.adventureModel.copyType == 0) {
                this.adventureModel.normal_historyPlate.push(this.plateIndex)//上一个点
                this.adventureModel.normal_lastPlate = this.plateIndex
                this.adventureModel.normal_plateIndex = data.plateIndex
                this.adventureModel.normal_plateFinish = true
                let ctrl = curView.getComponent(AdventureMainView2Ctrl)
                ctrl.refreshPoints()
            } else {
                this.adventureModel.endless_historyPlate.push(this.plateIndex)//上一个点
                this.adventureModel.endless_lastPlate = this.plateIndex
                this.adventureModel.endless_plateIndex = data.plateIndex
                this.adventureModel.endless_plateFinish = true
                let ctrl = curView.getComponent(NewAdventureMainViewCtrl)
                ctrl.refreshPoints()
            }
        })
    }
}