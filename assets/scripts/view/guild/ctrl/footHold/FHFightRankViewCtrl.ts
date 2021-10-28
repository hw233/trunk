import FHFightRankItemCtrl from './FHFightRankItemCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-22 13:56:31
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHFightRankViewCtrl")
export default class FHFightRankViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    rankItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    myRankItem: cc.Node = null;

    list: ListView;

    _rankDatas: icmsg.FootholdRankPlayer[] = []

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        let msg = new icmsg.FootholdFightRankReq()
        NetManager.send(msg, (data: icmsg.FootholdFightRankRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateList(data)
        })
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        NetManager.targetOff(this);
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
            item_tpl: this.rankItemPrefab,
            cb_host: this,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _updateList(data: icmsg.FootholdFightRankRsp) {
        this._initList();
        let datas = data.rankList
        GlobalUtil.sortArray(datas, (a, b) => {
            if (a.score == b.score) {
                return b.brief.power - a.brief.power
            }
            return b.score - a.score
        })
        this._rankDatas = datas
        this.list.clear_items();
        this.list.set_data(datas);
        this._updateMyRankItem();
    }

    _updateMyRankItem() {
        let ctrl = this.myRankItem.getChildByName('FHFightRankItem').getComponent(FHFightRankItemCtrl);
        let info: icmsg.FootholdRankPlayer = new icmsg.FootholdRankPlayer();
        let rBrief = new icmsg.RoleBrief();
        let rM = ModelManager.get(RoleModel);
        rBrief.name = rM.name;
        rBrief.level = rM.level;
        rBrief.head = rM.head;
        rBrief.headFrame = rM.frame;
        rBrief.power = rM.power;
        rBrief.guildId = rM.guildId
        rBrief.vipExp = rM.vipExp
        info.brief = rBrief;
        info.score = this._getMyRank()[1]
        ctrl.curIndex = this._getMyRank()[0]
        ctrl.updateItem(info);
    }

    _getMyRank() {
        let list = this._rankDatas
        let rank = -1
        let score = 0
        for (let i = 0; i < list.length; i++) {
            if (list[i].brief.id == this.roleModel.id) {
                rank = i
                score = list[i].score
                break
            }
        }
        return [rank, score]
    }
}