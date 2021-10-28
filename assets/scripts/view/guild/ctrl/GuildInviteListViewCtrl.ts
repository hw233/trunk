import GuildModel from '../model/GuildModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-15 18:00:15 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildInviteListViewCtrl")
export default class GuildInviteListViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  get gModel(): GuildModel { return ModelManager.get(GuildModel); }

  list: ListView;
  onEnable() {
    NetManager.on(icmsg.GuildAcceptInviteRsp.MsgType, this._onGuildAcceptInviteRsp, this);
    NetManager.send(new icmsg.GuildInviteInfoReq(), null, this);
  }

  onDisable() {
    NetManager.targetOff(this);
  }

  @gdk.binding("gModel.guildInvitationList")
  updateList() {
    this._initList();
    this.list.clear_items();
    this.list.set_data(this.gModel.guildInvitationList || []);
  }

  _initList() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.itemPrefab,
        cb_host: this,
        gap_y: 15,
        async: true,
        direction: ListViewDir.Vertical,
      });
    }
  }

  _onGuildAcceptInviteRsp(resp: icmsg.GuildAcceptInviteRsp) {
    for (let i = 0; i < this.gModel.guildInvitationList.length; i++) {
      if (resp.guildId == this.gModel.guildInvitationList[i].guildId) {
        this.gModel.guildInvitationList.splice(i, 1);
        i--;
      }
    }
    this.gModel.guildInvitationList = this.gModel.guildInvitationList;
    // this.updateList();
    if (resp.isSuccess) {
      gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP21"));
    }
  }
}
