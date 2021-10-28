import AdventureMainView2Ctrl from './AdventureMainView2Ctrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureMainViewCtrl from './NewAdventureMainViewCtrl';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import { Adventure2_randomCfg } from '../../../a/config';
/**
 * @Description: 探险事件--随机事件
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-22 10:05:58
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdvPlateRandomEventPanel2Ctrl")
export default class AdvPlateRandomEventPanel2Ctrl extends gdk.BasePanel {





    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }
    difficulty: number;
    selectIndex: number;
    plateIndex: number;

    onEnable() {
        this.plateIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_plateIndex : this.adventureModel.endless_plateIndex;
        this.difficulty = this.adventureModel.copyType == 0 ? this.adventureModel.difficulty : 4;
        this.selectIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_selectIndex : this.adventureModel.endless_selectIndex
        //let layerId = this.adventureModel.copyType == 0 ? this.adventureModel.normal_layerId : this.adventureModel.endless_layerId
        //let curIndex = this.selectIndex
        //let advCfg = ConfigManager.getItemByField(Adventure2_adventureCfg, "difficulty", this.difficulty, { layer_id: layerId, plate: curIndex })
        //let items = ConfigManager.getItemsByField(Adventure2_rankingCfg, "group", advCfg.event_id)

    }

    onDisable() {

    }

    openFunc() {
        let msg = new icmsg.Adventure2RandomReq()
        msg.difficulty = this.difficulty
        msg.plateIndex = this.selectIndex
        NetManager.send(msg, (data: icmsg.Adventure2RandomRsp) => {
            //GlobalUtil.openRewadrView(data.list)

            let cfg = ConfigManager.getItemById(Adventure2_randomCfg, data.randomId)
            gdk.gui.showMessage(cfg.des);
            this.adventureModel.isMove = true
            gdk.panel.hide(PanelId.AdvPlateRandomEventPanel2)
            let curView = gdk.gui.getCurrentView()
            if (this.adventureModel.copyType == 0) {
                this.adventureModel.normal_historyPlate.push(this.plateIndex)//上一个点
                this.adventureModel.normal_lastPlate = this.plateIndex
                this.adventureModel.normal_plateIndex = data.plateIndex
                this.adventureModel.normal_plateFinish = true
                this.adventureModel.normal_randomIds = data.randomIds
                let ctrl = curView.getComponent(AdventureMainView2Ctrl)
                ctrl.refreshPoints()
            } else {
                this.adventureModel.endless_historyPlate.push(this.plateIndex)//上一个点
                this.adventureModel.endless_lastPlate = this.plateIndex
                this.adventureModel.endless_plateIndex = data.plateIndex
                this.adventureModel.endless_plateFinish = true
                this.adventureModel.endless_randomIds = data.randomIds
                let ctrl = curView.getComponent(NewAdventureMainViewCtrl)
                ctrl.refreshPoints()
            }
        })
    }
}