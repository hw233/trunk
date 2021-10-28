import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianModel from '../../model/GuardianModel';
import GuardianUtils from './GuardianUtils';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { Guardian_globalCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../enum/RoleEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-29 11:02:09 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianBackSelectViewCtrl")
export default class GuardianBackSelectViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  get guardianModel(): GuardianModel { return ModelManager.get(GuardianModel); }

  curSelectId: number;
  list: ListView;
  onEnable() {
    this.curSelectId = this.args[0];
    this._updateViewLater();
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
  }

  onConfirmBtnClick() {
    let id = this.curSelectId || 0;
    gdk.e.emit(RoleEventId.GUARDIAN_BACK_SELECT, id);
    this.close();
  }

  _initListView() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.itemPrefab,
        cb_host: this,
        column: 5,
        gap_x: 16,
        gap_y: 15,
        async: true,
        direction: ListViewDir.Vertical,
      })
      this.list.onClick.on(this._selectItem, this);
      this.list['curSelect'] = this.curSelectId;
    }
  }

  _updateViewLater() {
    gdk.Timer.callLater(this, this._updateView);
  }

  _updateView() {
    this._initListView();
    let limit = ConfigManager.getItemByField(Guardian_globalCfg, 'key', 'limit').value;
    let first = [];
    let l1 = [];
    let l2 = [];
    this.guardianModel.guardianItems.forEach(item => {
      let guardianInfo = <icmsg.Guardian>item.extInfo;
      if (guardianInfo.star <= limit[0] && guardianInfo.level <= limit[1]) {
        if (guardianInfo.star > 1 || guardianInfo.level > 1) {
          let heroInfo = GuardianUtils.getGuardianHeroInfo(guardianInfo.id);
          let obj = {
            id: guardianInfo.id,
          };
          if (obj.id == this.list['curSelect']) {
            first.push(obj);
          } else if (heroInfo) {
            l2.push(obj);
          } else {
            l1.push(obj);
          }
        }
      }
    });
    this.list.clear_items();
    this.list.set_data([...first, ...l1, ...l2]);
  }

  _selectItem(data, idx: number, preData, preIdx) {
    if (data.id == this.curSelectId) {
      this.curSelectId = null;
      this.list['curSelect'] = null;
      this.list.refresh_item(idx);
      return;
    }

    let heroInfo = GuardianUtils.getGuardianHeroInfo(data.id);
    if (heroInfo) {
      GlobalUtil.openAskPanel({
        descText: '此守护者已出战,是否将其卸下并选定?',
        sureCb: () => {
          let msg = new icmsg.GuardianTakeOffReq();
          msg.heroId = heroInfo.heroId;
          NetManager.send(msg, (data: icmsg.GuardianTakeOffRsp) => {
            let heroModel = ModelManager.get(HeroModel);
            HeroUtils.updateHeroInfo(heroInfo.heroId, data.hero)
            if (heroModel.curHeroInfo && heroModel.curHeroInfo.heroId == data.hero.heroId) {
              heroModel.curHeroInfo = data.hero;
            }
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.list.select_item(idx);
          })
        }
      })
      return;
    }

    this.curSelectId = data.id;
    this.list['curSelect'] = this.curSelectId;
    this.list.refresh_items();
  }
}
