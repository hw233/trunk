import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { MCRewardInfo } from '../MonthCardCtrl';
import { Store_monthcardCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-14 20:28:27
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/MonthCard/MonthCardRewardItemCtrl")
export default class MonthCardRewardItemCtrl extends UiListItem {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(UiSlotItem)
    solt: UiSlotItem = null;

    @property(cc.Label)
    dayLab: cc.Label = null;

    @property(cc.Node)
    getFlag: cc.Node = null;


    _info: MCRewardInfo

    updateView() {
        this._info = this.data
        let bgPath = `view/store/textrue/monthcard/tqk_zhuanshidiban${this._info.type}`
        GlobalUtil.setSpriteIcon(this.node, this.bg, bgPath)
        this.solt.updateItemInfo(this._info.itemId, this._info.num)
        this.solt.itemInfo = {
            series: this._info.itemId,
            itemId: this._info.itemId,
            itemNum: 1,
            type: BagUtils.getItemTypeById(this._info.itemId),
            extInfo: null,
        };
        this.dayLab.string = StringUtils.format(gdk.i18n.t('i18n:FUNDS_TIP4'), this._info.index + 1)
        this.getFlag.active = false

        if (this._info.cardInfo) {
            let cfg = ConfigManager.getItemById(Store_monthcardCfg, this._info.cardInfo.id)
            let nowTime = GlobalUtil.getServerTime() / 1000;
            let time = this._info.cardInfo.time - nowTime;
            let day = time <= 0 ? 0 : Math.ceil(time / 86400);//剩余多少天       // 1-30
            if (day > 0) {
                let curDay = cfg.day - (day % cfg.day == 0 ? cfg.day : day % cfg.day);   // 0-29
                if (this._info.index < curDay || (this._info.index == curDay && this._info.cardInfo.isRewarded)) {
                    this.getFlag.active = true
                }
            }
        }

    }
}