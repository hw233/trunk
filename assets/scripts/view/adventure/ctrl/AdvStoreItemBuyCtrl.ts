import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Adventure2_storeCfg, ItemCfg } from '../../../a/config';
import { MoneyType } from '../../store/ctrl/StoreViewCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-27 13:38:18 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdvStoreItemBuyCtrl")
export default class AdvStoreItemBuyCtrl extends gdk.BasePanel {
    @property(UiSlotItem)
    getItem: UiSlotItem = null;

    @property(cc.Label)
    curNum: cc.Label = null;

    @property(cc.RichText)
    desc: cc.RichText = null;

    @property(cc.Label)
    btnText: cc.Label = null;

    @property(cc.Sprite)
    btnIcon: cc.Sprite = null;

    @property(cc.Node)
    buyBtn: cc.Node = null;

    @property(cc.Label)
    itemName: cc.Label = null;

    @property(cc.EditBox)
    numEditBox: cc.EditBox = null;

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    contentNode: cc.Node = null;

    @property(cc.Node)
    editNode: cc.Node = null;

    cfg: Adventure2_storeCfg = null;
    callFunc: any = null;
    maxNum: number;
    buyNum: number;
    buyPrice: number;
    canBuyNum: number;

    start() {
    }

    initItemInfo(goodId: number, item_id: number, item_num: number, info: number, callFunc) {
        let itemCfg = <ItemCfg>BagUtils.getConfigById(item_id);
        this.itemName.string = itemCfg.name;
        this.itemName.node.color = BagUtils.getColor(itemCfg.color);
        this.itemName.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(itemCfg.color);

        this.getItem.itemInfo = {
            series: null,
            itemId: item_id,
            itemNum: item_num,
            type: BagUtils.getItemTypeById(item_id),
            extInfo: null
        }
        this.getItem.updateItemInfo(item_id, item_num);

        this.curNum.string = `${BagUtils.getItemNumById(item_id)}`
        this.desc.string = GlobalUtil.makeItemDes(item_id);

        this.callFunc = callFunc;
        let cfg = ConfigManager.getItemById(Adventure2_storeCfg, goodId);
        this.cfg = cfg;
        this.maxNum = info ? info : cfg.times_limit;
        //奸商不需要编辑数量
        // if (cfg.type == StoreType.BLACK || cfg.type == StoreType.RUNE) {
        //     this.setMode(0);
        // } else {
        this.setMode(1);
        if (!cfg.times_limit) {
            this.maxNum = 99;
        }
        // }

        let moneyType = cfg.money_cost[0];
        this.buyPrice = cfg.money_cost[1];
        let moneyNum = BagUtils.getItemNumById(moneyType) || 0;
        this.canBuyNum = Math.floor(moneyNum / this.buyPrice);
        this.buyNum = this.maxNum == 0 ? 0 : 1;
        this.updateBuyNum();

        let iconPath = GlobalUtil.getSmallMoneyIcon(moneyType);
        GlobalUtil.setSpriteIcon(this.node, this.btnIcon, iconPath);
    }

    //模式，0：无指定购买数量。1：可指定购买数量
    setMode(mode: number) {
        if (mode == 0) {
            this.editNode.active = false;
            this.bg.height = 350;
        } else {
            this.editNode.active = true;
            this.bg.height = 479;
        }
    }

    //更新购买价格和数量
    updateBuyNum() {
        let buyNum = this.buyNum;
        if (buyNum > this.maxNum) {
            buyNum = this.maxNum;
            this.buyNum = buyNum;
        } else if (buyNum < 1) {
            buyNum = 1;
            this.buyNum = buyNum;
        }
        this.numEditBox.string = buyNum.toString();
        if (this.cfg.money_cost[0] == MoneyType.Gold) {
            this.btnText.string = `${GlobalUtil.numberToStr(this.buyPrice * buyNum, true, false)}`;
        } else {
            this.btnText.string = `${this.buyPrice * buyNum}`;
        }
        if (buyNum > this.canBuyNum) {
            this.btnText.node.color = cc.color("#F91111");
        } else {
            this.btnText.node.color = cc.color("#FFEB91");
        }
    }

    onBuyBtn() {
        if (this.buyNum > this.canBuyNum) {
            let moneyType = this.cfg.money_cost[0];
            if (!GlobalUtil.checkMoneyEnough(this.buyNum * this.buyPrice, moneyType, this)) {
                return
            }
        }
        if (this.buyNum > 0 && this.callFunc) {
            this.callFunc(this.buyNum);
        }
        this.close();
    }

    //减数量
    onMinusBtn() {
        this.buyNum--;
        this.updateBuyNum();
    }

    //加数量
    onPlusBtn() {
        this.buyNum++;
        this.updateBuyNum();
    }

    //最大数量
    onMaxBtn() {
        this.buyNum = this.canBuyNum;
        this.updateBuyNum();
    }

    //最小数量
    onMinBtn() {
        this.buyNum = 1;
        this.updateBuyNum();
    }

    onEditorDidEnded() {
        this.buyNum = parseInt(this.numEditBox.string) || 1;
        this.updateBuyNum();
    }
}
