import ConfigManager from '../../../../../common/managers/ConfigManager';
import ExpeditionUtils from '../ExpeditionUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import { Expedition_buffCfg, Skill_buffCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-16 16:18:09 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/army/ExpeditionArmySkillPreviewViewCtrl")
export default class ExpeditionArmySkillPreviewViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  careerIcon: cc.Node = null;

  @property(cc.Node)
  activeContent: cc.Node = null;

  @property(cc.Node)
  activeItem: cc.Node = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  careerUrl: string[] = ['view/guild/texture/expedition/army/tdyz_qiangbing', 'view/guild/texture/expedition/army/tdyz_paobing', 'view/guild/texture/expedition/army/tdyz_shouwei'];
  curCareer: number;
  list: ListView;
  onEnable() {
    this.curCareer = this.args[0];
    GlobalUtil.setSpriteIcon(this.node, this.careerIcon, this.careerUrl[this.curCareer - 1]);
    this._updateActiveSkill();
    this._updateList();
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
  }

  _updateActiveSkill() {
    let cfgs = ExpeditionUtils.getActiveSkillIdByCareer(this.curCareer);
    this.activeContent.removeAllChildren();
    cfgs.forEach(c => {
      let id = c.buff_id;
      let skillCfg = ConfigManager.getItemById(Skill_buffCfg, id);
      let item = cc.instantiate(this.activeItem);
      item.parent = this.activeContent;
      item.active = true;
      item.getComponent(cc.Label).string = skillCfg.name;
    })
  }

  _initList() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.itemPrefab,
        cb_host: this,
        gap_y: 5,
        async: true,
        direction: ListViewDir.Vertical,
      })
    }
  }

  _updateList() {
    this._initList();
    let cfgs = ConfigManager.getItems(Expedition_buffCfg, (cfg: Expedition_buffCfg) => {
      if (cfg.professional_type == this.curCareer && cfg.buff_id > 0) {
        return true;
      }
    });
    this.list.clear_items();
    this.list.set_data(cfgs);
  }
}
