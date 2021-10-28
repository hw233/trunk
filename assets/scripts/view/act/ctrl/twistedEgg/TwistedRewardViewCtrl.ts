import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import { HeroCfg, Operation_wishCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-24 13:50:43 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/twistedEgg/TwistedRewardItemCtrl")
export default class TwistedRewardViewCtrl extends gdk.BasePanel {
  @property(cc.ToggleContainer)
  groupToggleContainer: cc.ToggleContainer = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  selectGroup: number = 0;
  list: ListView;
  curRewardType: number;
  activityId: number = 47;
  onEnable() {
    this._initList();
    this._initGroup();
    this.curRewardType = ActUtil.getCfgByActId(this.activityId).reward_type;
  }

  onDisable() {
    this.selectGroup = null;
  }

  checkRewardType() {
    let cfg = ActUtil.getCfgByActId(this.activityId);
    if (!cfg || cfg.reward_type != this.curRewardType) {
      gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_TIME_UPDATE"));
      this.close();
      gdk.panel.hide(PanelId.ActivityMainView);
      return false;
    }
    return true;
  }

  onConfirmBtnClick() {
    if (!this.checkRewardType()) {
      return;
    }
    if (!this.list['selectIdx']) {
      gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_EGG_TIP12"));
    }
    else {
      let twSp = ModelManager.get(ActivityModel).twistedSpReward;
      let old: number;
      if (twSp) {
        old = ConfigManager.getItemById(Operation_wishCfg, twSp).hero;
      }
      if (old && old == this.list['selectIdx']) {
        this.close();
        return;
      }
      else {
        let req = new icmsg.DrawEggSPRewardReq();
        req.sPRewardId = ConfigManager.getItemByField(Operation_wishCfg, 'hero', this.list['selectIdx']).id;
        NetManager.send(req);
        this.close();
      }
    }
  }

  onCancelBtnClick() {
    this.close();
  }

  onGroupToggleClick(toggle: cc.Toggle) {
    let name = toggle.node.name;
    this.selectGroup = parseInt(name.substring('group'.length));
    this.list['selectIdx'] = null;
    this._updateList();
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
        column: 4,
        gap_y: 5,
        gap_x: 35,
        direction: ListViewDir.Vertical,
      })
    }
    this.list.onClick.on(this._onItemClick, this);
    this.list['selectIdx'] = null;
  }

  _initGroup() {
    let toggles = this.groupToggleContainer.toggleItems;
    toggles.forEach(toggle => {
      let name = toggle.name;
      let idx = parseInt(name.slice('group'.length));
      toggle.node.active = true;
    });
    this.groupToggleContainer.toggleItems[0].check();
    this.onGroupToggleClick(this.groupToggleContainer.toggleItems[0]);
  }

  _updateList() {
    this._initList();
    let actCfg = ActUtil.getCfgByActId(47);
    let rewardCfgs = ConfigManager.getItemsByField(Operation_wishCfg, 'reward_type', actCfg.reward_type);
    let datas = [];
    let twSp = ModelManager.get(ActivityModel).twistedSpReward;
    let curWishHero: number;
    if (twSp) {
      curWishHero = ConfigManager.getItemById(Operation_wishCfg, twSp).hero;
    }
    rewardCfgs.forEach(cfg => {
      let id = cfg.hero;
      let itemId = parseInt(id.toString().slice(0, 6));
      if (this.selectGroup == 0 || (<HeroCfg>BagUtils.getConfigById(itemId)).group[0] == this.selectGroup) {
        datas.push(cfg);
        if (curWishHero && cfg.hero == curWishHero && !this.list['selectIdx']) {
          this.list['selectIdx'] = cfg.hero;
        }
      }
    });
    this.list.clear_items();
    this.list.set_data(datas);
  }

  _onItemClick(data: Operation_wishCfg, idx, preCfg, preIdx) {
    if (!this.checkRewardType()) {
      return;
    }
    if (this.list['selectIdx'] && this.list['selectIdx'] == data.hero) {
      this.list['selectIdx'] = null;
    }
    else {
      this.list['selectIdx'] = data.hero;
    }
    this.list.refresh_items();
  }
}
