import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildListRankItemCtrl from './GuildListRankItemCtrl';
import GuildModel from '../model/GuildModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-14 15:27:19 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildListRankViewCtrl")
export default class GuildListRankViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  rankItemPrefab: cc.Prefab = null;

  @property(cc.Node)
  myRankItem: cc.Node = null;

  @property(cc.Node)
  topThreeNode: cc.Node = null;

  get GModel(): GuildModel { return ModelManager.get(GuildModel); }

  list: ListView;
  onEnable() {
    let req = new icmsg.GuildListReq();
    req.all = true;
    NetManager.send(req, (resp: icmsg.GuildListRsp) => {
      this.GModel.guildList = resp.list;
      this._updateListView(resp.list);
    }, this);
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    NetManager.targetOff(this);
  }

  _initList() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.rankItemPrefab,
        cb_host: this,
        gap_y: 15,
        async: true,
        direction: ListViewDir.Vertical,
      });
    }
  }

  _updateListView(resp: icmsg.GuildInfo[]) {
    this._initList();
    let datas = resp.sort((a, b) => {
      if (a.maxPower == b.maxPower) {
        return b.level - a.level;
      }
      else {
        return b.maxPower - a.maxPower;
      }
    });
    this.list.clear_items();
    this.list.set_data(datas);
    this._updateTopView(datas);
    //myrankItem todo
    let myInfo = null;
    let rM = ModelManager.get(RoleModel);
    let ctrl = this.myRankItem.getComponent(GuildListRankItemCtrl);
    for (let i = 0; i < datas.length; i++) {
      if (datas[i].id == rM.guildId) {
        myInfo = datas[i];
        ctrl.curIndex = i;
      }
    }
    ctrl._updateInfo(myInfo);
  }

  _updateTopView(datas: icmsg.GuildInfo[]) {
    let child = this.topThreeNode.children;
    let o = {};
    child.forEach((node, idx) => {
      let info = datas[idx];
      let nameNode = node.getChildByName('layout');
      if (info) {
        o[info.presidents[0]] = node.getChildByName('hero');
        nameNode.active = true;
        nameNode.getChildByName('name').getComponent(cc.Label).string = info.president;
        cc.find('frame', o[info.presidents[0]]).on(cc.Node.EventType.TOUCH_END, () => {
          gdk.panel.setArgs(PanelId.MainSet, info.presidents[0]);
          gdk.panel.open(PanelId.MainSet);
        }, this);
        //查询会长头像
        let msg = new icmsg.RoleImageReq()
        msg.playerId = info.presidents[0]
        NetManager.send(msg, (data: icmsg.RoleImageRsp) => {
          let node = o[data.brief.id];
          node.active = true;
          GlobalUtil.setSpriteIcon(this.node, cc.find('mask/head', node), GlobalUtil.getHeadIconById(data.brief.head));
          GlobalUtil.setSpriteIcon(this.node, cc.find('frame', node), GlobalUtil.getHeadFrameById(data.brief.headFrame));
        }, this)
      }
      else {
        let heroNode = node.getChildByName('hero');
        heroNode.active = false;
        nameNode.active = false;
        cc.find('frame', heroNode).targetOff(this);
      }
    });
  }
}
