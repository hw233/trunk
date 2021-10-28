import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';

/** 
 * @Description: 
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-28 10:30:51
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionPointLogItemCtrl")
export default class ExpeditionPointLogItemCtrl extends UiListItem {

    @property(cc.Label)
    timeLab1: cc.Label = null;

    @property(cc.Label)
    timeLab2: cc.Label = null;

    @property(cc.RichText)
    content: cc.RichText = null;


    _info: icmsg.ExpeditionLog

    updateView() {
        this._info = this.data
        let time = new Date(this._info.time * 1000);
        let mon = time.getMonth() + 1;
        let d = time.getDate();
        let h = time.getHours();
        let s = time.getSeconds();
        let timeStr = `${mon >= 10 ? mon : `0${mon}`}/${d >= 10 ? d : `0${d}`} ${h >= 10 ? h : `0${h}`}:${s >= 10 ? s : `0${s}`}`;
        let strs = timeStr.split(' ');
        this.timeLab1.string = strs[0];
        this.timeLab2.string = strs[1];

        let bossName = this._info.isBoss ? gdk.i18n.t("i18n:EXPEDITION_TIP19") : gdk.i18n.t("i18n:EXPEDITION_TIP20")
        let result = this._info.value > 0 ? StringUtils.format(gdk.i18n.t('i18n:EXPEDITION_TIP21'), this._info.value) : gdk.i18n.t("i18n:EXPEDITION_TIP22")

        this.content.string = StringUtils.format(gdk.i18n.t('i18n:EXPEDITION_TIP22'), this._info.playerName, bossName, result)//`<color=#00ff00>${this._info.playerName}</color>挑战${bossName}${result}`
    }
}