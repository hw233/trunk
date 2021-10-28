import { GlobalCfg, TipsCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import BagUtils from '../../../../common/utils/BagUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import PanelId from '../../../../configs/ids/PanelId';
import StoreModel from '../../model/StoreModel';
import TradingPortViewCtrl from '../tradingPort/TradingPortViewCtrl';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/MonthCard/MonthCardTipPanelCtrl")
export default class MonthCardTipPanelCtrl extends gdk.BasePanel {

    @property(cc.Label)
    descLab: cc.Label = null;

    @property(cc.Node)
    rewardContent: cc.Node = null;

    @property(cc.Prefab)
    rewardItemPrefab: cc.Prefab = null;

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    onEnable() {
        let tipCfg = ConfigManager.getItemById(TipsCfg, 66)
        this.descLab.string = `${tipCfg.desc21}`
        this._updateRewardContent()
    }

    _updateRewardContent() {
        this.rewardContent.removeAllChildren()
        let rewards = ConfigManager.getItemById(GlobalCfg, "fund_rewards").value
        for (let i = 0; i < rewards.length; i++) {
            let item = cc.instantiate(this.rewardItemPrefab)
            //item.scale = 0.8
            this.rewardContent.addChild(item)
            let ctrl = item.getComponent(UiSlotItem)
            ctrl.updateItemInfo(rewards[i])
            ctrl.itemInfo = {
                series: rewards[i],
                itemId: rewards[i],
                type: BagUtils.getItemTypeById(rewards[i]),
                itemNum: 1,
                extInfo: null,
            }
        }
    }

    buyFunc() {
        gdk.panel.hide(PanelId.MonthCardTipPanel)
        let info = this.storeModel.goodFundsInfo
        if (info && info.startTime > 0) {
            //跳转到豪华基金
            gdk.panel.setArgs(PanelId.FundsView, [3])
            gdk.panel.open(PanelId.TradingPort, (node) => {
                let ctrl = node.getComponent(TradingPortViewCtrl)
                ctrl.selectPanel(10)
            });
        } else {
            //跳转到超值基金
            gdk.panel.setArgs(PanelId.FundsView, [2])
            gdk.panel.open(PanelId.TradingPort, (node) => {
                let ctrl = node.getComponent(TradingPortViewCtrl)
                ctrl.selectPanel(10)
            });
        }
    }


}