import GuildModel from '../../guild/model/GuildModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RelicModel from '../model/RelicModel';
import RoleModel from '../../../common/models/RoleModel';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-31 15:54:38 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicInviteAssistViewCtrl")
export default class RelicInviteAssistViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Label)
    assistNum: cc.Label = null;

    get guildModel(): GuildModel { return ModelManager.get(GuildModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get relicModel(): RelicModel { return ModelManager.get(RelicModel); }

    list: ListView;
    curAssistNum: number;
    cityId: number;
    guildDefendMap: { [id: number]: icmsg.RelicGuildDefender } = {};
    isFull: boolean;
    onEnable() {
        [this.cityId, this.curAssistNum] = this.args[0];
        let info = this.relicModel.cityMap[this.cityId];
        this.assistNum.string = `${this.curAssistNum}/${info.cfg.helper_num}`;
        this.isFull = this.curAssistNum >= info.cfg.helper_num;

        if (!this.roleModel.guildId) {
            return;
        }

        let msg = new icmsg.GuildDetailReq()
        msg.guildId = this.roleModel.guildId;
        NetManager.send(msg, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            if (!this.guildModel.guildDetail ||
                this.guildModel.guildDetail.members.length <= 0) {
                return
            }
            this.guildDefendMap = {};
            let req = new icmsg.RelicGuildDefendersReq();
            NetManager.send(req, (resp: icmsg.RelicGuildDefendersRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                resp.list.forEach(r => {
                    this.guildDefendMap[r.defenderId] = r;
                });
                this._updateList();
            }, this);
            NetManager.on(icmsg.RelicHelpDefendRsp.MsgType, this._onRelicHelpDefendRsp, this);
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
                item_tpl: this.itemPrefab,
                cb_host: this,
                async: true,
                gap_y: 3,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        this._initList();
        let list = this.guildModel.guildDetail.members;
        let datas = [];
        list.forEach(l => {
            if (l.id !== this.roleModel.id) {
                let info = this.guildDefendMap[l.id] || null;
                datas.push({
                    brief: l,
                    relicInfo: info,
                    isFull: this.isFull
                });
            }
        });
        this.list.clear_items();
        this.list.set_data(datas);
    }

    _onRelicHelpDefendRsp() {
        gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP4"));
        this.onCloseBtn();
    }

    onCloseBtn() {
        this.close();
        gdk.panel.setArgs(PanelId.RelicPointDetailsView, this.cityId);
        gdk.panel.open(PanelId.RelicPointDetailsView);
    }
}
