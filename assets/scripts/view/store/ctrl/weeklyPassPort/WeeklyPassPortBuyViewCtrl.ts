import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import StoreModel from '../../model/StoreModel';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Pass_weeklyCfg, Store_miscCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-31 10:24:34 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/weeklyPassPort/WeeklyPassPortBuyViewCtrl")
export default class WeeklyPassPortBuyViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView1: cc.ScrollView = null;

    @property(cc.Node)
    content1: cc.Node = null;

    @property(cc.ScrollView)
    scrollView2: cc.ScrollView = null;

    @property(cc.Node)
    content2: cc.Node = null;

    @property(cc.Node)
    buyBtn: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    cfgs: Pass_weeklyCfg[];
    reward: number[][] = [];
    lockIdx: number = 0;
    onEnable() {
        this.cfgs = this.args[0];
        let cfg = ConfigManager.getItemById(Store_miscCfg, 700010);
        this.buyBtn.getChildByName('label').getComponent(cc.Label).string = `￥${cfg.RMB_cost}`;
        this.cfgs.forEach((cfg, idx) => {
            if (cfg.day <= ModelManager.get(StoreModel).weeklyCurSignDay) this.lockIdx = idx + 1;
        });

        this.updateScrollView();
    }

    onDisable() {
    }

    updateScrollView() {
        this.content1.removeAllChildren();
        this.content2.removeAllChildren();
        let reward1 = this._composeReward(this.cfgs.length);
        let reward2 = this._composeReward(this.lockIdx);
        reward1.forEach(reward => {
            let id = reward[0];
            let num = reward[1];
            let slot1 = this.createSlot(id, num);
            slot1.parent = this.content1;
        });
        reward2.forEach(reward => {
            let id = reward[0];
            let num = reward[1];
            let slot1 = this.createSlot(id, num);
            slot1.parent = this.content2;
        });
        this.content1.getComponent(cc.Layout).updateLayout();
        this.content2.getComponent(cc.Layout).updateLayout();
        if (reward1.length <= 4) this.scrollView1.node.width = this.content1.width;
        else this.scrollView1.node.width = 500;
        if (reward2.length <= 4) this.scrollView2.node.width = this.content2.width;
        else this.scrollView2.node.width = 500;
        this.scrollView1.scrollToTopLeft(0);
        this.scrollView2.scrollToTopLeft(0);
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
            let rewards = this.cfgs[i].reward2;
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
        let cfg = ConfigManager.getItemById(Store_miscCfg, 700010);
        GlobalUtil.openAskPanel({
            title: gdk.i18n.t('i18n:WEEKLY_PASSPORT_TIP1'),
            descText: `${gdk.i18n.t('i18n:WEEKLY_PASSPORT_TIP2')}${cfg.RMB_cost}`,
            sureText: gdk.i18n.t('i18n:MINECOPY_PASSPORT_TIP3'),
            sureCb: () => {
                let req = new icmsg.PayOrderReq();
                req.paymentId = 700010;
                NetManager.send(req);
            }
        });
        this.close();
    }
}
