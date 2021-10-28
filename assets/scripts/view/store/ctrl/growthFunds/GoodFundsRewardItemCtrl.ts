import ActUtil from '../../../act/util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { GlobalCfg, Pass_daily_rewardsCfg } from '../../../../a/config';

/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-30 19:13:27
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/growthFunds/GoodFundsRewardItemCtrl")
export default class GoodFundsRewardItemCtrl extends UiListItem {

    @property(UiSlotItem)
    solt: UiSlotItem = null;

    @property(cc.Label)
    dayLab: cc.Label = null;

    @property(cc.Node)
    getFlag: cc.Node = null;

    _cfg: Pass_daily_rewardsCfg
    _fundsInfo: icmsg.PassFund

    updateView() {
        this._cfg = this.data.cfg
        this._fundsInfo = this.data.info
        this.solt.starNum = 0
        this.solt.updateItemInfo(this._cfg.rewards[0][0], this._cfg.rewards[0][1])
        this.solt.itemInfo = {
            series: this._cfg.rewards[0][0],
            itemId: this._cfg.rewards[0][0],
            itemNum: 1,
            type: BagUtils.getItemTypeById(this._cfg.rewards[0][0]),
            extInfo: null,
        };
        this.dayLab.string = StringUtils.format(gdk.i18n.t('i18n:FUNDS_TIP4'), this._cfg.day)
        this.getFlag.active = false

        let period = ConfigManager.getItemByField(GlobalCfg, 'key', 'pass_cycle').value[0];
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000);
        let startTime = ActUtil.getActStartTime(120) / 1000;
        let curPeriod = Math.floor((serverTime - startTime) / (period * 24 * 60 * 60)) + 1;
        let endTime = startTime + curPeriod * (period * 24 * 60 * 60)

        if ((this._fundsInfo && this._fundsInfo.startTime > 0)) {
            let startZero = TimerUtils.getZerohour(this._fundsInfo.startTime)
            let rewardZero = TimerUtils.getZerohour(this._fundsInfo.rewardTime)
            if ((startZero + period * 86400) >= serverTime && rewardZero >= (startZero + (this._cfg.day - 1) * 24 * 60 * 60)) {
                this.getFlag.active = true
            }
        }

    }
}