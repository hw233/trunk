import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import { FhTeacheGuideType } from './teaching/FootHoldTeachingCtrl';
import { Foothold_globalCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHBuyEngergyCtrl")
export default class FHBuyEngergyCtrl extends gdk.BasePanel {

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
    _costType: number
    _costNum: number

    _needEngergy: number = 0

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {

        let args = this.args
        if (args && args.length > 0) {
            this._needEngergy = args[0]
        }

        let fhGlobalCfg = ConfigManager.getItemByField(Foothold_globalCfg, "key", "buy_energy")
        let g_open = ConfigManager.getItemByField(Foothold_globalCfg, "key", "open").value
        if (this.footHoldModel.activityIndex >= g_open[4]) {
            fhGlobalCfg = ConfigManager.getItemByField(Foothold_globalCfg, "key", "buy_energy_1")
        }
        this._maxBuyTime = fhGlobalCfg.value[0]
        this._costType = fhGlobalCfg.value[1]
        this._costNum = fhGlobalCfg.value[2]
        this.updateBuyNum()
    }

    onBuyBtn() {
        if (this.footHoldModel.energy >= FootHoldUtils.getInitEnergyValue()) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FOOTHOLD_TIP8"))
            return
        }
        let msg = new icmsg.FootholdBuyEnergyReq()
        msg.number = this.buyNum
        NetManager.send(msg, (data: icmsg.FootholdBuyEnergyRsp) => {
            FootHoldUtils.commitFhGuide(FhTeacheGuideType.event_2)
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP9"))
            this.footHoldModel.engergyBought = data.bought
            this.footHoldModel.energy = data.energy
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            gdk.panel.hide(PanelId.FHBuyEngergy)
        }, this)
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
        this.canBuyNum = this._maxBuyTime - this.footHoldModel.engergyBought
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
    @gdk.binding("footHoldModel.engergyBought")
    updateBoughTime() {
        this.tipLab2.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP12"), this._maxBuyTime - this.footHoldModel.engergyBought)//`(今日还可购买${this._maxBuyTime - this.footHoldModel.engergyBought}次)`
    }
}