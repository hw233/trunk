import ActivityUtils from '../../../../../common/utils/ActivityUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { Platform_globalCfg } from './../../../../../a/config';

/** 
 * 小程序专属礼包
 * @Author: sthoo.huang  
 * @Date: 2021-06-30 10:36:20 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-06 11:17:46
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wechat/exclusiveGift/WxExclusiveGiftViewCtrl")
export default class WxExclusiveGiftViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;

    onEnable() {
        let stime = GlobalUtil.getServerOpenTime() * 1000;   //开服时间
        let cfg = ConfigManager.getItemById(Platform_globalCfg, 'binghu_dbcz_time');
        let startTime = new Date(stime + (cfg.value[0] - 1) * 86400000);
        let endTime = new Date(stime + (cfg.value[1] + 1) * 86400000 - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            this.close();
            return;
        }
        else {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }
        this._updateView();
    }

    onDisable() {
        gdk.Timer.clearAll(this);
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
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateView() {
        this._initList();
        this.list.clear_items();
        let cfgs = ActivityUtils.getPlatformConfigs(4);
        cfgs = cfgs.concat(ActivityUtils.getPlatformConfigs(5));
        if (!cfgs || !cfgs.length) {
            return;
        }
        this.list.set_data(cfgs);
    }
}
