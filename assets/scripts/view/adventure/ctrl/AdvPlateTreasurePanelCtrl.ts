import AdventureMainViewCtrl from './AdventureMainViewCtrl';
import AdventureModel from '../model/AdventureModel';
import AdventureUtils from '../utils/AdventureUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Adventure_treasureCfg, AdventureCfg } from '../../../a/config';
/**
 * @Description: 探险事件--宝藏事件
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:47:19
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdvPlateTreasurePanelCtrl")
export default class AdvPlateTreasurePanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    soltItem: cc.Prefab = null

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }

    onEnable() {
        let curIndex = this.adventureModel.selectIndex
        let advCfg = ConfigManager.getItemByField(AdventureCfg, "difficulty", this.adventureModel.difficulty, { type: AdventureUtils.actRewardType, layer_id: this.adventureModel.layerId, plate: curIndex })
        let items = ConfigManager.getItemsByField(Adventure_treasureCfg, "group", advCfg.event_id)

        for (let i = 0; i < items.length; i++) {
            let showItem = cc.instantiate(this.soltItem)
            let ctrl = showItem.getComponent(UiSlotItem)
            ctrl.updateItemInfo(items[i].item, items[i].item_number)
            this.content.addChild(showItem)
        }
    }

    onDisable() {

    }

    openFunc() {
        let msg = new icmsg.AdventureTreasureReq()
        msg.plateIndex = this.adventureModel.selectIndex
        NetManager.send(msg, (data: icmsg.AdventureTreasureRsp) => {
            GlobalUtil.openRewadrView(data.list)
            this.adventureModel.historyPlate.push(this.adventureModel.plateIndex)//上一个点
            this.adventureModel.lastPlate = this.adventureModel.plateIndex
            this.adventureModel.plateIndex = data.plateIndex
            this.adventureModel.plateFinish = true
            this.adventureModel.isMove = true
            gdk.panel.hide(PanelId.AdvPlateTreasurePanel)
            let curView = gdk.gui.getCurrentView()
            let ctrl = curView.getComponent(AdventureMainViewCtrl)
            ctrl.refreshPoints()
        })
    }
}