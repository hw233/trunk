import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Store_sevenday_war_giftCfg } from '../../../../a/config';


/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-28 14:30:49
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/sevenDayWar/SevenDayWarActViewCtrl")
export default class SevenDayWarActViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    list: ListView;
    activityId = 138

    get activityModel(): ActivityModel {
        return ModelManager.get(ActivityModel);
    }

    onEnable() {

        NetManager.on(icmsg.PaySuccRsp.MsgType, this._onPaySuccRsp, this);

        let startTime = new Date(ActUtil.getActStartTime(this.activityId));
        let endTime = new Date(ActUtil.getActEndTime(this.activityId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            this.close();
            return;
        }
        else {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }

        this._updateViewInfo()
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                async: true,
                gap_y: 10,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateViewInfo(isScroll: boolean = true) {
        let starTime = ActUtil.getActStartTime(138)
        let curTime = GlobalUtil.getServerTime()
        let curDay = Math.ceil((curTime - starTime) / (1000 * 86400))
        let showIndex = 0
        let cfgs = ConfigManager.getItems(Store_sevenday_war_giftCfg)
        for (let i = 0; i < cfgs.length; i++) {
            showIndex = i
            if (i + 1 > curDay) {
                break
            }
            if (Math.pow(2, (i + 1)) & this.activityModel.sevenDayWarInfo.stage) {
                if (!(Math.pow(2, (i + 1)) & this.activityModel.sevenDayWarInfo.reward)) {
                    break
                }
            } else {
                break
            }
        }
        this._initList()
        this.list.set_data(cfgs, false)

        if (isScroll) {
            this.list.scroll_to(showIndex)
        }
    }

    _onPaySuccRsp(data: icmsg.PaySuccRsp) {
        this._updateViewInfo(false)
    }
}