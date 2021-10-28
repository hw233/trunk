import { Growthfund_towerfundCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import StoreUtils from '../../../../common/utils/StoreUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import TrialInfo from '../../../instance/trial/model/TrialInfo';
import StoreModel from '../../model/StoreModel';

/** 
 * @Description: 试练塔基金
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-08-26 22:29:45
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/growthFunds/TowerFundsViewCtrl")
export default class TowerFundsViewCtrl extends gdk.BasePanel {
    @property(cc.Button)
    buyBtn: cc.Button = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    cfgs: Growthfund_towerfundCfg[] = [];
    get model() { return ModelManager.get(TrialInfo); }
    maxNum: number = 0;
    onEnable() {
        this.cfgs = ConfigManager.getItems(Growthfund_towerfundCfg);
        this.buyBtn.node.active = !ModelManager.get(StoreModel).isBuyTowerFunds;
        this.maxNum = this.model.lastStageId;//ConfigManager.getItemById(Copy_stageCfg, this.model.bestStageId).order;
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
        req.paymentId = 700011;
        NetManager.send(req);
    }

    _onPaySuccRsp(resp: icmsg.PaySuccRsp) {
        if (resp.paymentId == 700011) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:FUNDS_TIP6'));
            this.buyBtn.node.active = false;
            ModelManager.get(StoreModel).isBuyTowerFunds = true;
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
        let data = [];
        this.cfgs.forEach(cfg => {
            let tem = { cfg: cfg, maxNum: this.maxNum }
            data.push(tem)
        })
        this.list.set_data(data);
        gdk.Timer.callLater(this, () => {
            if (!this.list || !cc.isValid(this.node)) return;
            if (!ModelManager.get(StoreModel).isBuyTowerFunds) {
                this.list.scroll_to(0);
                return;
            }
            for (let i = 0; i < this.cfgs.length; i++) {
                if (this.maxNum >= this.cfgs[i].layer) {
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


