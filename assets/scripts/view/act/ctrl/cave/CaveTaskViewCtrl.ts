import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import TaskUtil from '../../../task/util/TaskUtil';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { Cave_adventureCfg, Cave_taskCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-07 10:46:52 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/cave/CaveTaskViewCtrl")
export default class CaveTaskViewCtrl extends gdk.BasePanel {
  @property(UiTabMenuCtrl)
  uiTabMenu: UiTabMenuCtrl = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

  list: ListView;
  actId: number = 104;
  rewardType: number;
  onEnable() {
    let t = ConfigManager.getItems(Cave_adventureCfg);
    this.rewardType = Math.min(t[t.length - 1].type, ActUtil.getActRewardType(this.actId));
    this.uiTabMenu.setSelectIdx(this.actModel.caveCurLayer - 1, true);
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
  }

  onTabMenuSelect(e, data) {
    if (!e) return;
    let layer = parseInt(data) + 1;
    if (layer < this.actModel.caveCurLayer) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:CAVE_TIPS6'));
      this.uiTabMenu.showSelect(this.actModel.caveCurLayer - 1);
    } else if (layer > this.actModel.caveCurLayer) {
      let d = layer - this.actModel.caveCurLayer;
      let nextZeroTime = TimerUtils.getTomZerohour(GlobalUtil.getServerTime() / 1000);
      if (d > 1) nextZeroTime += 24 * 60 * 60;
      let leftTime = nextZeroTime * 1000 - GlobalUtil.getServerTime();
      gdk.gui.showMessage(`${TimerUtils.format1(leftTime / 1000)}${gdk.i18n.t('i18n:CAVE_TIPS7')}`);
      this.uiTabMenu.showSelect(this.actModel.caveCurLayer - 1);
    }
    else {
      this._updateList();
    }
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

  _updateList() {
    this._initList();
    let cfgs = ConfigManager.getItems(Cave_taskCfg, (cfg: Cave_taskCfg) => {
      if (cfg.type == this.rewardType && cfg.layer == this.actModel.caveCurLayer) {
        return true;
      }
    });
    let todo = [];
    let finished = [];
    let recived = [];
    cfgs.forEach(c => {
      let state = TaskUtil.getTaskState(c.taskid);
      if (state) {
        if (TaskUtil.getTaskAwardState(c.taskid)) {
          recived.push(c);
        }
        else {
          finished.push(c);
        }
      }
      else {
        todo.push(c);
      }
    });
    this.list.clear_items();
    this.list.set_data([...finished, ...todo, ...recived]);
    this.scrollView.enabled = this.list.datas.length > 3;
  }
}
