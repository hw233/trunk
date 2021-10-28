import GuildBossDamageRankItemCtrl from './GuildBossDamageRankItemCtrl';
import GuildModel from '../../model/GuildModel';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import { GuildEventId } from '../../enum/GuildEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-22 14:30:21 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/boss/GuildBossDamageRankViewCtrl")
export default class GuildBossDamageRankViewCtrl extends cc.Component {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property(GuildBossDamageRankItemCtrl)
  myRankItem: GuildBossDamageRankItemCtrl = null;

  get guildModel() { return ModelManager.get(GuildModel); }

  list: ListView;
  onEnable() {
    this._updateView();
    gdk.e.on(GuildEventId.UPDATE_GUILD_BOSS_DAMAGE_RANK_INFO, this._updateView, this);
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    gdk.e.targetOff(this);
  }

  _updateView() {
    this._initListView();
    let roleModel = ModelManager.get(RoleModel);
    let infos = this.guildModel.gbRankInfo;
    infos.sort((a, b) => { return b.blood - a.blood; });
    let data = [];
    let brief = new icmsg.RoleBrief();
    brief.id = roleModel.id;
    brief.head = roleModel.head;
    brief.name = roleModel.name;
    brief.level = roleModel.level;
    brief.power = roleModel.power;
    brief.logoutTime = 0;
    brief.headFrame = roleModel.frame;//头像框
    brief.vipExp = roleModel.vipExp;
    brief.guildId = 0;
    let myInfo = {
      brief: brief,
      value: 0,
      rank: 99
    };
    infos.forEach((info, idx) => {
      let obj = {
        brief: info.brief,
        value: info.blood,
        rank: idx + 1
      };
      data.push(obj);
      if (info.brief.id == roleModel.id) {
        myInfo = obj;
      }
    });
    this.list.clear_items();
    this.list.set_data(data);

    this.myRankItem.updateItemView(myInfo);
  }

  _initListView() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.itemPrefab,
        cb_host: this,
        gap_y: -10,
        async: true,
        direction: ListViewDir.Vertical,
      })
    }
  }
}
