import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroLockTipsCtrl from '../main/common/HeroLockTipsCtrl';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import { Hero_globalCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { MysticSkillMaterialsType } from './MysticHeroSkillAwakeViewCtrl';
import { RoleEventId } from '../../enum/RoleEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-17 14:19:01 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-26 21:16:35
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/geneConnect/MysticSkillMaterialsSelectViewCtrl")
export default class MysticSkillMaterialsSelectViewCtrl extends gdk.BasePanel {
  @property(cc.Label)
  numLab: cc.Label = null;

  @property(cc.RichText)
  tips: cc.RichText = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property(cc.Node)
  emptyNode: cc.Node = null;

  curSelect: MysticSkillMaterialsType;
  list: ListView;
  derect_item: number;
  onEnable() {
    this.curSelect = this.args[0];
    this.derect_item = ConfigManager.getItemByField(Hero_globalCfg, 'key', 'derect_skilllevel_item').value[0];
    this._updateListLater();
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
  }

  onGetBtnClick() {
    GlobalUtil.openGainWayTips(ModelManager.get(HeroModel).curHeroInfo.typeId);
  }

  onOneKeyBtnClick() {
    if (this.list.datas.length <= 0) return;
    if (this.list['select'] > 0) return;
    this.list.select_item(0);
  }

  onConfirmBtnClick() {
    gdk.e.emit(RoleEventId.MYSTIC_SKILL_MATERIALS_SELECT, this.curSelect ? JSON.parse(JSON.stringify(this.curSelect)) : null);
    this.close();
  }

  onEmptyGetBtnClick() {
    this.close();
    JumpUtils.openView(2951);
  }

  _updateLabs() {
    let selectId = this.list['select'] || 0;
    this.numLab.string = `已选择:${selectId > 0 ? 1 : 0}/1`;
    this.tips.node.active = selectId > 0;
    if (this.tips.node.active) {
      let typeId = parseInt(selectId.toString().slice(0, 6));
      let str1 = this.curSelect.type == 1 ? '英雄本体' : `${BagUtils.getConfigById(typeId).name}`;
      let str2 = this.curSelect.type == 0 && this.derect_item == typeId ? '定向' : '随机';
      this.tips.string = `使用${str1}可<color=#00ff00>${str2}</c>领悟英雄技能`;
    }
  }

  _initList() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.itemPrefab,
        column: 4,
        cb_host: this,
        async: true,
        gap_x: 30,
        gap_y: 30,
        direction: ListViewDir.Vertical,
      });
      this.list.onClick.on(this._selectItem, this);
    }
    this.list['select'] = this.curSelect ? this.curSelect.id : 0;
  }

  _updateListLater() {
    gdk.Timer.callLater(this, this._updateList);
  }

  _updateList() {
    this._initList();
    let hM = ModelManager.get(HeroModel);
    let curHero = hM.curHeroInfo;
    let derect_item = ConfigManager.getItemByField(Hero_globalCfg, 'key', 'derect_skilllevel_item').value[0];
    let random_item = ConfigManager.getItemByField(Hero_globalCfg, 'key', 'random_skilllevel_item').value[0];
    let data: {
      type: number, //0-获取按钮 1-英雄本体 2-材料
      id: number
    }[] = [];
    let heroItems = [];
    let derectItems = [];
    let randomItems = [];
    //英雄
    hM.heroInfos.forEach(h => {
      let info = <icmsg.HeroInfo>h.extInfo;
      if (info.heroId !== curHero.heroId && info.typeId == curHero.typeId) {
        let obj = {
          type: 1,
          id: info.heroId
        };
        heroItems.push(obj);
      }
    });
    //定向材料
    let derectItemNums = BagUtils.getItemNumById(derect_item);
    for (let i = 0; i < derectItemNums; i++) {
      let obj = {
        type: 0,
        id: parseInt(`${derect_item}${i + 1}`),
      }
      derectItems.push(obj);
    }
    //随机材料
    let randomItemNums = BagUtils.getItemNumById(random_item);
    for (let i = 0; i < randomItemNums; i++) {
      let obj = {
        type: 0,
        id: parseInt(`${random_item}${i + 1}`),
      }
      randomItems.push(obj);
    }
    // let first = { type: 0, id: 0 };
    data = [...derectItems, ...randomItems, ...heroItems];
    this.list.clear_items();
    this.list.set_data(data);
    this._updateLabs();
    this.emptyNode.active = data.length == 0;
  }

  _selectItem(data, idx) {
    if (data.id == this.list['select']) {
      this.curSelect = null;
      this.list['select'] = 0;
    } else {
      if (data.type == 1) {
        //lock hero
        let heroInfo = HeroUtils.getHeroInfoByHeroId(data.id);
        if (HeroUtils.heroLockCheck(heroInfo, false)) {
          gdk.panel.open(PanelId.HeroLockTips, (node: cc.Node) => {
            let ctrl = node.getComponent(HeroLockTipsCtrl);
            ctrl.initArgs(heroInfo.heroId, [], () => { this.list.select_item(idx) });
          });
          return
        }
      }
      this.list['select'] = data.id;
      this.curSelect = {
        type: data.type,
        id: data.id
      }
    }
    this.list.refresh_items();
    this._updateLabs();
  }
}
