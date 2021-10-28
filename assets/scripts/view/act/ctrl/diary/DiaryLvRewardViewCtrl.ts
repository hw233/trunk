import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { Diary_globalCfg, Diary_reward1Cfg, Diary_rewardCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-22 14:59:49 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/diary/DiaryLvRewardViewCtrl")
export default class DiaryLvRewardViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  itemPrefab2: cc.Prefab = null;

  @property(UiTabMenuCtrl)
  tabMenu: UiTabMenuCtrl = null;

  @property(cc.Node)
  topView: cc.Node = null;

  actId: number = 59;
  list: ListView;
  curSelectType: number;
  onEnable() {
    this.curSelectType = this.args[0] || 0;
    this.tabMenu.setSelectIdx(this.curSelectType, true);
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
  }

  _initList() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    this.list = new ListView({
      scrollview: this.scrollView,
      mask: this.scrollView.node,
      content: this.content,
      item_tpl: this.curSelectType == 0 ? this.itemPrefab : this.itemPrefab2,
      cb_host: this,
      async: true,
      gap_y: 5,
      direction: ListViewDir.Vertical,
    })
  }

  onSuperRewardBtnClick() {
    this.curSelectType = 1;
    this.tabMenu.setSelectIdx(this.curSelectType, true);
  }

  onDailyGiftBtnClick() {
    gdk.gui.removeAllPopup();
    JumpUtils.openRechargetLBPanel([2]);
  }

  onUiTabMenuSelect(e, utype) {
    if (!e) return;
    this.curSelectType = parseInt(utype);
    this._updateTopView();
    this._updateList();
  }

  _updateTopView() {
    this.topView.getChildByName('title1').active = this.curSelectType == 0;
    this.topView.getChildByName('title2').active = this.curSelectType == 1;
    let key = this.curSelectType == 0 ? 'item' : 'item1';
    let itemId = ConfigManager.getItemByField(Diary_globalCfg, 'key', key).value[0];
    cc.find('layout/lab', this.topView).getComponent(cc.Label).string = `${gdk.i18n.t('i18n:ACT_DIARY_TIP2')}${BagUtils.getConfigById(itemId).name}`;
    cc.find('layout/costNode/num', this.topView).getComponent(cc.Label).string = `${BagUtils.getItemNumById(itemId)}`;
    GlobalUtil.setSpriteIcon(this.node, cc.find('layout/costNode/icon', this.topView), GlobalUtil.getIconById(itemId));
  }

  _updateList() {
    let actCfg = ActUtil.getCfgByActId(this.actId);
    this._initList();
    let datas;
    if (this.curSelectType == 0) {
      //普通等级奖励
      datas = ConfigManager.getItems(Diary_rewardCfg, (cfg: Diary_rewardCfg) => {
        if (cfg.level !== 0 && cfg.reward_type == actCfg.reward_type) {
          return true;
        }
      });
    }
    else {
      //豪华奖励
      datas = ConfigManager.getItems(Diary_reward1Cfg, (cfg: Diary_reward1Cfg) => {
        if (cfg.level !== 0 && cfg.reward_type == actCfg.reward_type) {
          return true;
        }
      });
    }

    datas.sort((a, b) => { return a.level - b.level; });
    this.list.clear_items();
    this.list.set_data(datas);
  }
}
