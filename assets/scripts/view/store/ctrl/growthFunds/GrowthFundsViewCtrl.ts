import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import StoreModel from '../../model/StoreModel';
import StoreUtils from '../../../../common/utils/StoreUtils';
import { GrowthfundCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-21 18:16:38 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/growthFunds/GrowthFundsViewCtrl")
export default class GrowthFundsViewCtrl extends gdk.BasePanel {
    @property(cc.Button)
    buyBtn: cc.Button = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    cfgs: GrowthfundCfg[] = [];
    onEnable() {
        this.cfgs = ConfigManager.getItems(GrowthfundCfg);
        this.buyBtn.node.active = !ModelManager.get(StoreModel).isBuyGrowFunds;
        this._initList();
        NetManager.on(icmsg.PaySuccRsp.MsgType, this._onPaySuccRsp, this);
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        gdk.Timer.clearAll(this);
        NetManager.targetOff(this);
    }

    onBuyBtnClick() {
        let req = new icmsg.PayOrderReq();
        req.paymentId = 700003;
        NetManager.send(req);
    }

    _onPaySuccRsp(resp: icmsg.PaySuccRsp) {
        if (resp.paymentId == 700003) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:FUNDS_TIP6'));
            this.buyBtn.node.active = false;
            ModelManager.get(StoreModel).isBuyGrowFunds = true;
        }
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                async: true,
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }
        this.list.set_data(this.cfgs);
        gdk.Timer.callLater(this, () => {
            if (!this.list || !cc.isValid(this.node)) return;
            if (!ModelManager.get(StoreModel).isBuyGrowFunds) {
                this.list.scroll_to(0);
                return;
            }
            for (let i = 0; i < this.cfgs.length; i++) {
                if (ModelManager.get(RoleModel).level >= this.cfgs[i].level) {
                    if (!StoreUtils.getGrowthFundsRewardState(this.cfgs[i].id)) {
                        this.list.scroll_to(Math.max(0, i - 1));
                        return;
                    }
                }
                else {
                    this.list.scroll_to(Math.max(0, i - 1));
                    return;
                }
            }
        });
    }
}
