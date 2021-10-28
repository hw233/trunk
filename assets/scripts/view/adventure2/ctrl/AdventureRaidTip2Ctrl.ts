import AdventureMainView2Ctrl from './AdventureMainView2Ctrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureMainViewCtrl from './NewAdventureMainViewCtrl';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Adventure2_adventureCfg } from '../../../a/config';
/**
 * @Description: 探险事件--扫荡界面
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-26 16:40:38
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdventureRaidTip2Ctrl")
export default class AdventureRaidTip2Ctrl extends gdk.BasePanel {

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    soltItem: cc.Prefab = null

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }
    difficulty: number;
    selectIndex: number;
    plateIndex: number;
    _advCfg: Adventure2_adventureCfg
    onEnable() {
        this.plateIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_plateIndex : this.adventureModel.endless_plateIndex;
        this.difficulty = this.adventureModel.copyType == 0 ? this.adventureModel.difficulty : 4;
        this.selectIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_selectIndex : this.adventureModel.endless_selectIndex
        let layerId = this.adventureModel.copyType == 0 ? this.adventureModel.normal_layerId : this.adventureModel.endless_layerId
        let curIndex = this.selectIndex
        this._advCfg = ConfigManager.getItemByField(Adventure2_adventureCfg, "difficulty", this.difficulty, { layer_id: layerId, plate: curIndex })
        //let items = ConfigManager.getItemsByField(Adventure2_treasureCfg, "group", advCfg.event_id)

        for (let i = 0; i < this._advCfg.rewards.length; i++) {
            let showItem = cc.instantiate(this.soltItem)
            let ctrl = showItem.getComponent(UiSlotItem)
            ctrl.updateItemInfo(this._advCfg.rewards[i][0], this._advCfg.rewards[i][1])
            this.content.addChild(showItem)
        }

    }

    onDisable() {

    }

    openFunc() {
        let msg = new icmsg.Adventure2RaidReq()
        msg.difficulty = this.difficulty
        msg.plateIndex = this.selectIndex
        NetManager.send(msg, (data: icmsg.Adventure2RaidRsp) => {
            GlobalUtil.openRewadrView(data.list)

            this.adventureModel.isMove = true
            gdk.panel.hide(PanelId.AdventureRaidTip2)
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
                if (data.plateIndex == 9) {
                    let msg = new icmsg.Adventure2StateReq()
                    NetManager.send(msg)
                }
                let ctrl = curView.getComponent(NewAdventureMainViewCtrl)
                //ctrl.refreshPoints()
                if (ctrl.inRankShow) {
                    ctrl._updateRankNode()
                }
                ctrl._loadMap(this._advCfg.map_id)
            }
        })
    }
}