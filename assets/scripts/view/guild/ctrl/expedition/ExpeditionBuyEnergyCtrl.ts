import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionModel from './ExpeditionModel';
import ExpeditionUtils from './ExpeditionUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import { Expedition_energyCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionBuyEnergyCtrl")
export default class ExpeditionBuyEnergyCtrl extends gdk.BasePanel {

    @property(cc.EditBox)
    numEditBox: cc.EditBox = null;

    @property(cc.Label)
    tipLab: cc.Label = null;

    @property(cc.Label)
    tipLab2: cc.Label = null;

    @property(cc.Label)
    costLab: cc.Label = null;

    buyNum: number = 0;
    buyPrice: number;
    canBuyNum: number;

    _maxBuyTime: number
    _costNum: number

    _needEngergy: number = 0
    _gridId: number = 0;//出场 英雄的序号

    get expeditionModel() { return ModelManager.get(ExpeditionModel); }

    onEnable() {
        this._gridId = this.args[0]

        let cfgs = ConfigManager.getItems(Expedition_energyCfg)
        this._maxBuyTime = cfgs.length
        this._costNum = ConfigManager.getItemById(Expedition_energyCfg, this.expeditionModel.energyBought + 1).consumption[1]
        this.updateBuyNum()
    }

    onBuyBtn() {
        let msg = new icmsg.ExpeditionBuyEnergyReq()
        msg.gridId = this._gridId
        NetManager.send(msg, (data: icmsg.ExpeditionBuyEnergyRsp) => {
            this.expeditionModel.energyBought += 1
            ExpeditionUtils.updateExpeditionHero(data.hero)
            gdk.panel.hide(PanelId.ExpeditionBuyEnergy)
        })
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

    //更新购买价格和数量
    updateBuyNum() {
        this.canBuyNum = this._maxBuyTime - this.expeditionModel.energyBought
        if (this.canBuyNum < 1) {
            this.canBuyNum = 1
        }
        let buyNum = this.buyNum;
        if (buyNum > this.canBuyNum) {
            buyNum = this.canBuyNum;
            this.buyNum = buyNum;
        } else if (buyNum < 1) {
            buyNum = 1;
            this.buyNum = buyNum;
        }
        if (this._needEngergy > 0) {
            this.tipLab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP10"), this._needEngergy, this._needEngergy * this._costNum)//`本次挑战需要购买${this._needEngergy}体力,\n是否消耗${this._needEngergy * this._costNum}钻石进行抵扣`
        } else {
            this.tipLab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP11"), this._costNum * this.buyNum, this.buyNum)//`花费${this._costNum * this.buyNum}钻石可购买${this.buyNum}体力`
        }
        this.numEditBox.string = this.buyNum.toString();
        this.costLab.string = `${this._costNum * this.buyNum}`
        this.updateBoughTime()
    }


    @gdk.binding("expeditionModel.energyBought")
    updateBoughTime() {
        this.tipLab2.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP12"), this._maxBuyTime - this.expeditionModel.energyBought)//`(今日还可购买${this._maxBuyTime - this.footHoldModel.engergyBought}次)`
    }
}