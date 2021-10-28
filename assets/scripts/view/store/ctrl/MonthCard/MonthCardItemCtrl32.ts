import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import NetManager from '../../../../common/managers/NetManager';
import StringUtils from '../../../../common/utils/StringUtils';
import { Quickcombat_globalCfg, Store_monthcardCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/MonthCard/MonthCardItemCtrl32")
export default class MonthCardItemCtrl32 extends cc.Component {

    @property(cc.Node)
    buyNode: cc.Node = null;

    @property(cc.Node)
    unBuyNode: cc.Node = null;

    @property(cc.Label)
    costLab: cc.Label = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    addLab: cc.Label = null;

    data: icmsg.MonthCardInfo;
    cfg: Store_monthcardCfg;

    updateView() {
        let nowTime = GlobalUtil.getServerTime() / 1000;
        if (this.data && this.data.time - nowTime > 0) {
            this.unBuyNode.active = false
            this.buyNode.active = true
            let time = this.data.time - nowTime;
            let leftDay = Math.ceil(time / 86400);//剩余多少天
            this.timeLab.string = `${leftDay}${gdk.i18n.t('i18n:MONTH_CARD_TIP1')}`
            this.costLab.string = ``
        } else {
            this.unBuyNode.active = true
            this.buyNode.active = false
            this.costLab.string = StringUtils.format(gdk.i18n.t("i18n:ACT_STORE_TIP1"), this.cfg.RMB_cost)
        }

        let add1 = ConfigManager.getItemByField(Quickcombat_globalCfg, 'key', 'quick_combat_free').value[0]
        let add2 = ConfigManager.getItemByField(Quickcombat_globalCfg, 'key', 'quick_combat_pay').value[0]
        this.addLab.string = `${add1 + add2}`
    }

    buyFunc() {
        let msg = new icmsg.PayOrderReq()
        msg.paymentId = this.cfg.id
        NetManager.send(msg, () => {
            let msg = new icmsg.MonthCardQuickCombatInfoReq()
            NetManager.send(msg)
        })
    }

    againBuyFunc() {
        let msg = new icmsg.PayOrderReq()
        msg.paymentId = this.cfg.id
        NetManager.send(msg, () => {
            let msg = new icmsg.MonthCardQuickCombatInfoReq()
            NetManager.send(msg)
            gdk.gui.showMessage(gdk.i18n.t('i18n:MONTH_CARD_TIP3'))
        })
    }

    getFunc() {
        let msg = new icmsg.MonthCardDayRewardReq();
        msg.id = this.cfg.id;
        NetManager.send(msg)
    }
}