import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from '../footHold/FootHoldModel';
import FootHoldUtils from '../footHold/FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { AskInfoType } from '../../../../common/widgets/AskPanel';
import { Foothold_globalCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-05 15:01:38
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cross/FhGuessCheckViewCtrl")
export default class FhGuessCheckViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    guildNameLab: cc.Label = null;

    @property(cc.Label)
    presidentLab: cc.Label = null;

    @property(cc.Label)
    guildPower: cc.Label = null;

    @property(cc.Label)
    priceLab: cc.Label = null;

    @property(cc.Label)
    addPriceLab: cc.Label = null;

    @property(cc.Label)
    moneyLab: cc.Label = null;

    @property(cc.Node)
    moneyIcon: cc.Node = null;

    @property(cc.EditBox)
    numEditBox: cc.EditBox = null;

    @property(cc.Label)
    guessLab: cc.Label = null;

    callFunc: any = null;
    maxNum: number = 0;
    buyNum: number = 0;
    canBuyNum: number = 0;

    _timeLimit: number;
    _moneyType: number;
    _buyPrice: number;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    _info: icmsg.FootholdGuessGuild
    _selectDay: number = 0

    onEnable() {
        let arg = this.args
        this._info = arg[0]
        this._selectDay = arg[1]
        this._updateViewInfo(this._info)
        this.updateBuyNum()
    }

    _updateViewInfo(info: icmsg.FootholdGuessGuild) {
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(info.bottom))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(info.frame))
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(info.icon))
        this.guildNameLab.string = info.name
        this.presidentLab.string = info.president
        this.guildPower.string = `${info.maxPower}`

        let quiz_ratio = ConfigManager.getItemById(Foothold_globalCfg, "quiz_ratio").value
        let price = quiz_ratio[1] - Math.floor(info.votes / FootHoldUtils.getTotalVotes() * quiz_ratio[2])

        this.priceLab.string = `${(price / 100).toFixed(2)}`
        this.addPriceLab.node.active = false
        if (this.roleModel.guildId == info.id) {
            this.addPriceLab.node.active = true
            this.addPriceLab.string = `(+${quiz_ratio[0] / 100})`
        }
        let itemId = ConfigManager.getItemById(Foothold_globalCfg, "quiz_rewards").value[0]
        GlobalUtil.setSpriteIcon(this.node, this.moneyIcon, GlobalUtil.getIconById(itemId))
        let totalNum = BagUtils.getItemNumById(itemId)
        this.moneyLab.string = `${totalNum}`
        this.guessLab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP66"), (price / 100).toFixed(2))//`猜中将获得${(price / 100).toFixed(2)}倍竞猜金额的奖励`
        this.maxNum = this.canBuyNum = totalNum
    }

    //更新购买价格和数量
    updateBuyNum() {
        let buyNum = this.buyNum;
        if (buyNum > this.maxNum) {
            buyNum = this.maxNum;
            this.buyNum = buyNum;
        } else if (buyNum < 1) {
            buyNum = 0;
            this.buyNum = buyNum;
        }
        this.numEditBox.string = buyNum.toString();
    }

    onOkBtn() {
        if (this.buyNum <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP67"))
            return
        }

        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let zeroTime = TimerUtils.getZerohour(curTime)
        let cfgTime = ConfigManager.getItemById(Foothold_globalCfg, "quiz_time").value[1]
        let resultEndTime = zeroTime + cfgTime * 3600 + 86400

        let info: AskInfoType = {
            title: "",
            sureText: gdk.i18n.t("i18n:FOOTHOLD_TIP68"),
            sureCb: () => {
                let msg = new icmsg.FootholdGuessVoteReq()
                msg.guildId = this._info.id
                msg.votedPoints = this.buyNum
                NetManager.send(msg, () => {
                    let msg = new icmsg.FootholdGuessQueryReq()
                    msg.day = this._selectDay
                    NetManager.send(msg)
                    gdk.panel.hide(PanelId.FHGuessCheckView)
                    gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP91"), TimerUtils.format1(resultEndTime - curTime)))
                }, this)
            },
            descText: gdk.i18n.t("i18n:FOOTHOLD_TIP69"),
            thisArg: this,
        }
        GlobalUtil.openAskPanel(info)
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

    onEditorDidEnded() {
        this.buyNum = parseInt(this.numEditBox.string) || 1;
        this.updateBuyNum();
    }
}