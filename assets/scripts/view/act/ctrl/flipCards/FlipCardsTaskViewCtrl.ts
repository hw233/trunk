import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import TaskUtil from '../../../task/util/TaskUtil';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Mission_cardsCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-05 15:07:14 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/flipCards/FlipCardsTaskViewCtrl")
export default class FlipCardsTaskViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  taskItemPrefab: cc.Prefab = null;

  list: ListView;
  cfgs: Mission_cardsCfg[];
  onLoad() {
    this.cfgs = ConfigManager.getItems(Mission_cardsCfg);
  }

  onEnable() {
    this._initList();
    gdk.e.on(ActivityEventId.UPDATE_NEW_DAY, this._updateNetDay, this);
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    gdk.e.targetOff(this);
  }

  _initList() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.taskItemPrefab,
        cb_host: this,
        async: true,
        gap_y: 5,
        direction: ListViewDir.Vertical,
      })
    }

    let undo: Mission_cardsCfg[] = [];
    let limit: Mission_cardsCfg[] = [];
    let canReceive: Mission_cardsCfg[] = [];
    let finished: Mission_cardsCfg[] = [];
    this.cfgs.forEach(cfg => {
      if (ModelManager.get(RoleModel).level < cfg.level || ModelManager.get(CopyModel).lastCompleteStageId < cfg.fbId) {
        limit.push(cfg);
      }
      else if (TaskUtil.getTaskAwardState(cfg.index)) {
        finished.push(cfg);
      } else if (TaskUtil.getTaskState(cfg.index)) {
        canReceive.push(cfg);
      } else {
        undo.push(cfg);
      }
    });
    this.list.clear_items();
    this.list.set_data(canReceive.concat(undo).concat(limit).concat(finished));
  }

  _updateNetDay() {
    gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_FLIPCARD_TIP7"));
    this._initList();
  }
}
