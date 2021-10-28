import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StoreItemBuyCtrl from '../StoreItemBuyCtrl';
import StoreModel from '../../model/StoreModel';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { StoreCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-29 10:51:58 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/recharge/RechargeMFNItemCtrl")
export default class RechargeMFNItemCtrl extends cc.Component {
    // @property(cc.Label)
    // nameLab: cc.Label = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    // @property(cc.Node)
    // discountNode: cc.Node = null;

    cfg: StoreCfg;
    onEnable() {
    }

    onDisable() {
    }

    updateView(cfg: StoreCfg) {
        this.cfg = cfg;
        this.slot.updateItemInfo(this.cfg.item_id, this.cfg.item_number);
        GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('costIcon'), GlobalUtil.getIconById(this.cfg.money_cost[0]));
        this.costNode.getChildByName('costLab').getComponent(cc.Label).string = this.cfg.money_cost[1] + '';
    }

    onClick() {
        let cfg = this.cfg;
        gdk.panel.open(PanelId.StoreItemBuy, (node: cc.Node) => {
            let c = node.getComponent(StoreItemBuyCtrl);
            c.initItemInfo(cfg.id, cfg.item_id, cfg.item_number, ModelManager.get(StoreModel).storeInfo[cfg.id], (num) => {
                if (cc.isValid(this.node)) {
                    let req = new icmsg.StoreBuyReq();
                    req.id = cfg.id;
                    req.num = num;
                    NetManager.send(req, (resp: icmsg.StoreBuyRsp) => {
                        GlobalUtil.openRewadrView(resp.list);
                    });
                }
            });
        });
    }
}
