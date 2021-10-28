import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { AskInfoType } from '../../../common/widgets/AskPanel';
import { BagType } from '../../../common/models/BagModel';
import { ItemCfg, Store_chargeCfg } from '../../../a/config';
import { STORE_ICON_PATH } from '../model/StoreModel';
import { StoreEventId } from '../enum/StoreEventId';
import { StoreType } from '../enum/StoreType';

/** 
  * @Description: 商店-充值界面-充值物品子项
  * @Author: yaozu.hu 
  * @Date: 2019-05-22 15:39:36 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-21 13:59:53
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/StoreRechargeItemCtrl")
export default class StoreRechargeItemCtrl extends UiListItem {

    @property(cc.Node)
    icon: cc.Node = null

    //首次充值显示Node
    @property(cc.Node)
    firstRecNode: cc.Node = null

    //首次充值赠送label
    @property(cc.Label)
    firstRecLab: cc.Label = null

    //再次充值赠送label
    @property(cc.Label)
    recAddLab: cc.Label = null

    //再次充值赠送node
    @property(cc.Node)
    recAddNode: cc.Node = null

    //充值数额
    @property(cc.Label)
    costLab: cc.Label = null

    //充值节点
    @property(cc.Node)
    rechargeNode: cc.Node = null

    //特权卡节点
    @property(cc.Node)
    cardNode: cc.Node = null

    cfg: Store_chargeCfg = null
    type: StoreType = 8
    info: boolean = false;
    pos: number = 0 // 神秘商店购买时,传pos购买

    onDisable() {
        gdk.e.targetOff(this)
    }

    updateView() {
        if (this.data.card) {
            this.rechargeNode.active = false
            this.cardNode.active = true

            let monthName = this.cardNode.getChildByName("monthName").getComponent(cc.Label)
            let priceLab = this.cardNode.getChildByName("priceLab").getComponent(cc.Label)
            let icon = this.cardNode.getChildByName("icon")
            monthName.string = this.data.cfg.name;
            priceLab.string = StringUtils.format(gdk.i18n.t("i18n:ACT_STORE_TIP1"), this.data.cfg.RMB_cost)

            let iconPath = `${STORE_ICON_PATH}/${this.data.cfg.icon}`;
            GlobalUtil.setSpriteIcon(this.node, icon, iconPath);

        } else {
            this.rechargeNode.active = true
            this.cardNode.active = false

            this.cfg = this.data.cfg
            GlobalUtil.setSpriteIcon(this.node, this.icon, `${STORE_ICON_PATH}/${this.cfg.icon}`)
            this.pos = this.data.pos
            this.info = this.data.info
            this.costLab.string = StringUtils.format(gdk.i18n.t("i18n:ACT_STORE_TIP1"), this.cfg.RMB_cost)

            this.firstRecLab.string = `/${this.cfg.first_gem}`
            //判断是否是首次充值
            if (!this.info) {
                gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._updatePaySucc, this)
            }
            this._updatePayFirstShow()
        }
    }

    //判断是否是首次充值
    _updatePayFirstShow() {
        if (!this.info) {
            this.firstRecNode.active = true;
            this.recAddNode.active = false
        } else {
            this.firstRecNode.active = false;
            if (this.cfg.second_gem > 0) {
                this.recAddNode.active = true
                this.recAddLab.string = `${this.cfg.second_gem}`
            } else {
                this.recAddNode.active = false
            }
        }
    }

    _itemClick() {
        if (this.data.card) {
            let ids: number[] = [500001, 500002, 500003];
            gdk.panel.setArgs(PanelId.MonthCard, ids.indexOf(this.data.cfg.id));
            gdk.panel.open(PanelId.MonthCard);
        } else {
            let showTip = false
            let datas = BagUtils.getItemsByType(BagType.ITEM, { func_id: "cash_coupon" })
            let itemCfg: ItemCfg = null
            for (let i = 0; i < datas.length; i++) {
                itemCfg = <ItemCfg>BagUtils.getConfigById(datas[i].itemId)
                if (itemCfg && itemCfg.func_args[0] == this.cfg.RMB_cost) {
                    showTip = true
                    break
                }
            }
            if (showTip) {
                let info: AskInfoType = {
                    title: gdk.i18n.t('i18n:TIP_TITLE'),
                    sureCb: () => {
                        let msg = new icmsg.PayOrderReq()
                        msg.paymentId = this.cfg.id
                        NetManager.send(msg)
                    },
                    descText: StringUtils.format(gdk.i18n.t('i18n:STORE_TIP17'), itemCfg.name),
                    thisArg: this,
                }
                GlobalUtil.openAskPanel(info)
            } else {
                let msg = new icmsg.PayOrderReq()
                msg.paymentId = this.cfg.id
                NetManager.send(msg)
            }
        }
        // let money_cost = this.cfg.RMB_cost
        // //let moneyCfg = ConfigManager.getItemById(ItemCfg, money_cost[0])
        // let askText = `是否花费${money_cost}人民币购买${this.cfg.name}?`
        // GlobalUtil.openAskPanel({
        //     title: "购买提示",
        //     descText: askText,
        //     thisArg: this,
        //     sureText: "购买",
        //     sureCb: () => {
        //         let msg = new PayOrderReq()
        //         msg.paymentId = this.cfg.id
        //         NetManager.send(msg)
        //     },
        // })
    }

    _updatePaySucc(e: gdk.Event) {
        let id = e.data.paymentId;
        if (this.cfg != null && this.cfg.id == id) {
            this.info = true;
            this._updatePayFirstShow();
            gdk.e.targetOff(this);
        }
    }
}
