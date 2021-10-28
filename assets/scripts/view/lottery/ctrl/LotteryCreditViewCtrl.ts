import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import LotteryModel from '../model/LotteryModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { GlobalCfg } from '../../../a/config';
import { LotteryEventId } from '../enum/LotteryEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-31 17:18:42 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/LotteryCreditViewCtrl")
export default class LotteryCreditViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    cost: cc.Label = null;

    @property(cc.Label)
    itemName: cc.Label = null;

    @property(cc.Node)
    icon: cc.Node = null;

    onEnable() {
        let costCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'luckydraw_exchange');
        let rechangeCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'luckydraw_exchange_reward');
        this.cost.string = costCfg.value[0] + '';
        let itemCfg = BagUtils.getConfigById(rechangeCfg.value[0]);
        this.itemName.string = itemCfg.name;
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getIconById(itemCfg.id));
    }

    onDisable() {
    }

    onRechargeBtnClick() {
        let costCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'luckydraw_exchange');
        let credit = ModelManager.get(LotteryModel).credit;
        if (credit >= costCfg.value[0]) {
            let req = new icmsg.LuckyCreditExchangeReq();
            NetManager.send(req, (resp: icmsg.LuckyCreditExchangeRsp) => {
                ModelManager.get(LotteryModel).credit = resp.remain;
                GlobalUtil.openRewadrView(resp.rewards);
                gdk.e.emit(LotteryEventId.UPDATE_LOTTERY_CREDIT_CHANGE);
            })
        }
        else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:LOTTERY_TIP32"));
        }
    }
}
