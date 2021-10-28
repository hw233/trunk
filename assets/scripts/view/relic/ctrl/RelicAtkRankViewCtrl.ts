import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RelicAtkRankItemCtrl from './RelicAtkRankItemCtrl';
import RelicModel from '../model/RelicModel';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-20 15:15:37 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicAtkRankViewCtrl")
export default class RelicAtkRankViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    scoreTitle: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    myRankItem: cc.Node = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    get relicModel(): RelicModel { return ModelManager.get(RelicModel); }

    list: ListView = null;
    onEnable() {
        this.uiTabMenu.setSelectIdx(0, true);
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        NetManager.targetOff(this);
    }

    onTabMenuSelect(e, data) {
        if (!e) return;
        if (data == 0) {
            this.scoreTitle.string = '清除协防人数';
            NetManager.send(new icmsg.RelicClearRankReq(), (resp: icmsg.RelicClearRankRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this._updateList();
            }, this);
        }
        else {
            this.scoreTitle.string = '抢夺次数';
            NetManager.send(new icmsg.RelicFightRankReq(), (resp: icmsg.RelicFightRankRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this._updateList();
            }, this);
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
            item_tpl: this.itemPrefab,
            cb_host: this,
            gap_y: 8,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    async _updateList() {
        this._initList();
        this.list.clear_items();
        let ids = [];
        let list = this.relicModel.relicAtkRankList || [];
        list.forEach(l => { ids.push(l.brief.id); });
        await ModelManager.get(ServerModel).reqServerNameByIds(ids, 1);
        this.list.set_data(list);
        this._updateMyRank();
    }

    _updateMyRank() {
        let info = this.relicModel.relicAtkMyRank;
        if (!info) {
            info = new icmsg.RelicRankPlayer();
            let rM = ModelManager.get(RoleModel);
            let brief = new icmsg.RoleBrief();
            brief.head = rM.head;
            brief.headFrame = rM.frame;
            brief.level = rM.level;
            brief.id = rM.id;
            brief.name = rM.name;
            brief.power = rM.power;
            info.brief = brief;
            info.score = 0;
        }
        let ctrl = this.myRankItem.getComponent(RelicAtkRankItemCtrl);
        ctrl.curIndex = this.relicModel.relicAtkMyRankOrder - 1;
        ctrl._refreshView(info);
    }
}
