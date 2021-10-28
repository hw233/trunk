import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import NetManager from '../../../../common/managers/NetManager';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Gift_powerCfg, Store_miscCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-02 17:15:15 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/oneDollarGift/OneDollarGiftBuyViewCtrl")
export default class OneDollarGiftBuyViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Button)
    buyBtn: cc.Button = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    cfgs: Gift_powerCfg[];
    onEnable() {
        let cfg = ConfigManager.getItemById(Store_miscCfg, 700002);
        this.buyBtn.node.getChildByName('label').getComponent(cc.Label).string = `￥${cfg.RMB_cost}`;
        this.cfgs = ConfigManager.getItems(Gift_powerCfg);
        this.content.removeAllChildren();
        let rewards = this._composeReward(this.cfgs.length);
        rewards.forEach(reward => {
            let id = reward[0];
            let num = reward[1];
            let slot1 = this.createSlot(id, num);
            slot1.parent = this.content;
        });
        this.content.getComponent(cc.Layout).updateLayout();
        if (rewards.length <= 4) this.scrollView.node.width = this.content.width;
        else this.scrollView.node.width = 500;
    }

    onDisable() {
    }

    createSlot(id: number, num: number): cc.Node {
        let slot = cc.instantiate(this.slotPrefab);
        let ctrl = slot.getComponent(UiSlotItem);
        ctrl.updateItemInfo(id, num);
        ctrl.itemInfo = {
            series: 0,
            itemId: id,
            itemNum: num,
            type: BagUtils.getItemTypeById(id),
            extInfo: null
        };
        return slot;
    }

    /**
     * 合并奖励
     * @param rewards 
     */
    _composeReward(idx: number): number[][] {
        let r = {};
        let finalReward: number[][] = [];
        for (let i = 0; i < idx; i++) {
            let rewards = this.cfgs[i].reward;
            rewards.forEach(reward => {
                let id = reward[0];
                let num = reward[1];
                if (!r[id]) r[id] = 0;
                r[id] += num;
            });
        }

        for (let key in r) {
            finalReward.push([parseInt(key), r[key]]);
        }

        finalReward.sort((a, b) => {
            let typeA = BagUtils.getConfigById(a[0]).defaultColor;
            let typeB = BagUtils.getConfigById(b[0]).defaultColor;
            if (typeA == typeB) {
                return b[0] - a[0];
            }
            else {
                return typeB - typeA;
            }
        });
        return finalReward;
    }

    onBuyBtnClick() {
        let cfg = ConfigManager.getItemById(Store_miscCfg, 700002);
        GlobalUtil.openAskPanel({
            descText: StringUtils.format(gdk.i18n.t('i18n:ONE_DOLLAR_GIFT_TIP1'), cfg.name, cfg.RMB_cost),
            sureText: gdk.i18n.t('i18n:ONE_DOLLAR_GIFT_TIP2'),
            sureCb: () => {
                let req = new icmsg.PayOrderReq();
                req.paymentId = cfg.id;
                NetManager.send(req);
            }
        });
        this.close();
    }
}
