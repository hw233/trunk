import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import { Activity_top_upCfg, ActivityCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-04 11:43:53 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/lcdl/LcdlViewCtrl")
export default class LcdlViewCtrl extends gdk.BasePanel {
  @property(cc.Label)
  timeLabel: cc.Label = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  activityId: number = 11;
  list: ListView;
  cfg: ActivityCfg;

  onEnable() {
    let startTime = new Date(ActUtil.getActStartTime(this.activityId));
    let endTime = new Date(ActUtil.getActEndTime(this.activityId) - 5000); //time为零点,减去5s 返回前一天
    if (!startTime || !endTime) {
      this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
      // gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
      this.close();
      return;
    }
    else {
      this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
      this.cfg = ActUtil.getCfgByActId(this.activityId);
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
    let rewardType = this.cfg.reward_type;
    let cfgs = ConfigManager.getItems(Activity_top_upCfg, (cfg: Activity_top_upCfg) => {
      if (cfg.type == rewardType) return true;
    });
    this.list.set_data(cfgs);
    gdk.Timer.callLater(this, () => {
      if (!this.list || !cc.isValid(this.node)) return;
      let monthlyRecharge = ModelManager.get(ActivityModel).monthlyRecharge;
      for (let i = 0; i < cfgs.length; i++) {
        if (monthlyRecharge >= cfgs[i].money) {
          if (!ActivityUtils.getLcdlRewardState(cfgs[i].index)) {
            this.list.scroll_to(Math.max(0, i - 1));
            return;
          }
        }
        else {
          this.list.scroll_to(Math.max(0, i - 1));
          return;
        }
      }
    });
  }
}
