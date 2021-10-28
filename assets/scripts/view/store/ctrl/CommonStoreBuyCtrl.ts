import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagType } from '../../../common/models/BagModel';
import { ItemCfg } from '../../../a/config';
import { MoneyType } from './StoreViewCtrl';


/** 
  * @Description: 通用商城购买选择框
  * @Author: luoyong
  * @Date: 2019-09-12 13:50:11
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-14 20:47:44
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/CommonStoreBuyCtrl")
export default class CommonStoreBuyCtrl extends gdk.BasePanel {

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

    callFunc: any = null;
    maxNum: number;
    buyNum: number;
    canBuyNum: number;

    _timeLimit: number;
    _moneyType: number;
    _buyPrice: number;

    start() {

    }

    initItemInfo(item_id: number, item_num: number, info: icmsg.StoreBuyInfo, timeLimit, moneyType, buyPrice, callFunc) {
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
        this._timeLimit = timeLimit
        this._moneyType = moneyType
        this._buyPrice = buyPrice

        this.maxNum = this._timeLimit - info.count;

        if (!this._timeLimit) {
            this.maxNum = 99;
        }

        let moneyNum = BagUtils.getItemNumById(moneyType)
        this.canBuyNum = Math.floor(moneyNum / this._buyPrice);
        this.buyNum = this.maxNum == 0 ? 0 : 1;
        this.updateBuyNum();

        let iconPath = GlobalUtil.getIconById(moneyType);
        GlobalUtil.setSpriteIcon(this.node, this.btnIcon, iconPath);
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
        if (this._moneyType == MoneyType.Gold) {
            this.btnText.string = `${GlobalUtil.numberToStr(this._buyPrice * buyNum, true, false)}`;
        } else {
            this.btnText.string = `${this._buyPrice * buyNum}`;
        }
        if (buyNum > this.canBuyNum) {
            this.btnText.node.color = cc.color("#F91111");
        } else {
            this.btnText.node.color = cc.color("#FFEB91");
        }
    }

    onBuyBtn() {
        if (this.buyNum > this.canBuyNum) {
            let type = BagUtils.getItemTypeById(this._moneyType)
            if (type == BagType.MONEY) {
                if (!GlobalUtil.checkMoneyEnough(this.buyNum * this._buyPrice, this._moneyType, this)) {
                    return
                }
            } else {
                let itemCfg = BagUtils.getConfigById(this._moneyType)
                GlobalUtil.showMessageAndSound(`${itemCfg.name}${gdk.i18n.t('i18n:RELIC_TIP11')}`)
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


export type CommonStoreBuyType = {
    itemId: number,
    itemNum: number,
    cfg: any
}
