import ActUtil from '../../util/ActUtil';
import CombineModel from '../../../combine/model/CombineModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import { Activity_rechargeCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-21 10:34:14 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/restriction/RestrictionViewCtrl")
export default class RestrictionViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.RichText)
    curRechargeLab: cc.RichText = null;

    activityId: number = 105;
    list: ListView;
    onEnable() {
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
        let r = ModelManager.get(CombineModel).restrictionRecharge;
        this.curRechargeLab.node.parent.active = r > 0;
        if (r > 0) {
            this.curRechargeLab.string = r + '';
        }
        this._updateView();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
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
        let ydLoginNum = ModelManager.get(CombineModel).ydLoginNum;
        let cfgs = ConfigManager.getItems(Activity_rechargeCfg, (cfg: Activity_rechargeCfg) => {
            if (cfg.mount[0] <= ydLoginNum && ydLoginNum <= cfg.mount[1]) {
                return true;
            }
        });
        this.list.clear_items();
        this.list.set_data(cfgs);
        gdk.Timer.callLater(this, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            let m = ModelManager.get(CombineModel);
            let idx = 0;
            for (let i = 0; i < cfgs.length; i++) {
                let info = m.restrictionStoreInfo[cfgs[i].money];
                if (!info || (!info.bought && info.left > 0)) {
                    idx = i;
                    break;
                }
            }
            this.list.scroll_to(idx);
        });
    }
}
