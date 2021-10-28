import EnvelopeGrabViewCtrl from './EnvelopeGrabViewCtrl';
import EnvelopeRankItemCtrl from './EnvelopeRankItemCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildModel from '../../model/GuildModel';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { GuildEventId } from '../../enum/GuildEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-08 10:06:05 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/envelop/EnvelopeMainViewCtrl")
export default class EnvelopeMainViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    titleNode: cc.Node = null;

    @property(cc.Node)
    rankNode: cc.Node = null;

    @property(cc.Node)
    myEnvelopeNode: cc.Node = null;

    @property(cc.Node)
    grabNode: cc.Node = null;

    @property(cc.ScrollView)
    envelopeScrollView: cc.ScrollView = null;

    @property(cc.Node)
    envelopeContent: cc.Node = null;

    @property(cc.Prefab)
    envelopeItemPrefab: cc.Prefab = null;

    @property(cc.ScrollView)
    rankScrollView: cc.ScrollView = null;

    @property(cc.Node)
    rankContent: cc.Node = null;

    @property(cc.Prefab)
    rankItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    myRankItem: cc.Node = null;

    @property(UiTabMenuCtrl)
    rankUiTabMenu: UiTabMenuCtrl = null;

    @property(UiTabMenuCtrl)
    tabMenu: UiTabMenuCtrl = null;

    get GuildModel(): GuildModel { return ModelManager.get(GuildModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    list1: ListView;
    list2: ListView;
    curView: number; // 0-红包榜 1-抢红包 2-发红包
    curRankIdx: number; //0-个人榜 1-公会榜   《红包榜》
    curGrabViewIdx: number; //0-公会红包 1-世界红包  《抢红包》
    onEnable() {
        NetManager.on(icmsg.GuildEnvelopeListRsp.MsgType, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            if (this.curView == 2) {
                this._updateView();
            }
        }, this);
        NetManager.on(icmsg.WorldEnvelopeRankRsp.MsgType, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            if (this.curView == 0) {
                this._updateView();
            }
        }, this);
        gdk.e.on(GuildEventId.UPDATE_ENVELOPE_LIST, this._onUpdateEnvlopeList, this);
        // this._req();
        let curIdx, curGabIdx;
        let arg = this.args[0];
        if (!arg[0] && arg[0] !== 0) curIdx = 2;
        else curIdx = arg[0];
        this.curGrabViewIdx = arg[1] ? arg[1] : 0;
        this.tabMenu.setSelectIdx(curIdx, true);
    }

    onDisable() {
        [this.list1, this.list2].forEach(l => {
            if (l) {
                l.destroy();
                l = null;
            }
        });
        NetManager.targetOff(this);
    }

    onMenuClick(e, type) {
        if (!e) return;
        let idx = parseInt(type);
        if (idx !== this.curView) {
            this.curView = idx;
            if (this.curView == 0) {
                this.curRankIdx = null;
                this.rankUiTabMenu.setSelectIdx(0, true);
            }
            else {
                this._req();
            }
        }
    }

    onRankUiTabMenuSelect(e, type) {
        if (!e) return;
        if (this.curView !== 0) return;
        let idx = parseInt(type);
        if (idx !== this.curRankIdx) {
            this.curRankIdx = idx;
            this._req();
        }
    }

    _req() {
        if (this.curView == 0) {
            let req = new icmsg.WorldEnvelopeRankReq();
            req.type = this.curRankIdx + 1;
            NetManager.send(req, null, this);
        }
        else if (this.curView == 2) {
            let req = new icmsg.GuildEnvelopeListReq();
            req.my = true;
            NetManager.send(req, null, this);
        }
        else {
            this._updateView();
        }
    }

    _onUpdateEnvlopeList(e) {
        let isMy = e.data;
        if (isMy && 2 == this.curView) {
            this._updateView();
        }
    }

    _updateView() {
        this.rankNode.active = this.curView == 0;
        this.myEnvelopeNode.active = this.curView == 2;
        this.grabNode.active = this.curView == 1;
        let path = ['view/guild/texture/envelope/ghhb_hongbaobang', 'view/guild/texture/envelope/ghhb_qianghongbao', 'view/guild/texture/envelope/ghhb_fahongbao']
        GlobalUtil.setSpriteIcon(this.node, this.titleNode, path[this.curView]);
        if (this.curView !== 1) {
            if (this.curView == 0) {
                let strs = [['头像', '名字'], ['公会徽章', '公会名字']][this.curRankIdx];
                cc.find('topLabelNode/icon', this.rankNode).getComponent(cc.Label).string = strs[0];
                cc.find('topLabelNode/name', this.rankNode).getComponent(cc.Label).string = strs[1];
            }
            gdk.Timer.callLater(this, this._updateList);
        }
        else {
            let ctrl = this.grabNode.getChildByName('EnvelopGrabView').getComponent(EnvelopeGrabViewCtrl);
            ctrl.init(this.curGrabViewIdx ? this.curGrabViewIdx : 0);
            this.curGrabViewIdx = 0;
        }
        // this._updateList();
    }

    _initList() {
        if (this.list1) {
            this.list1.destroy();
            this.list1 = null;
        }
        if (this.list2) {
            this.list2.destroy();
            this.list2 = null;
        }

        if (this.curView == 0) {
            //rank
            this.list2 = new ListView({
                scrollview: this.rankScrollView,
                mask: this.rankScrollView.node,
                content: this.rankContent,
                item_tpl: this.rankItemPrefab,
                cb_host: this,
                gap_y: 5,
                async: true,
                direction: ListViewDir.Vertical,
            });
        }
        else {
            //envelope
            this.list1 = new ListView({
                scrollview: this.envelopeScrollView,
                mask: this.envelopeScrollView.node,
                content: this.envelopeContent,
                item_tpl: this.envelopeItemPrefab,
                cb_host: this,
                column: 2,
                gap_y: 10,
                gap_x: 30,
                async: true,
                direction: ListViewDir.Vertical,
            });
        }
    }

    _updateList() {
        this._initList();
        let data;
        if (this.curView == 2) data = this.GuildModel.myEnvelopeList;
        if (this.curView == 0) {
            data = [this.GuildModel.envelopeRankList, this.GuildModel.envGuildRankList][this.curRankIdx];
        }
        let list = this.curView == 0 ? this.list2 : this.list1;
        let info: any = data;
        if (this.curView !== 0) {
            info = [];
            data.sort((a, b) => { return b.id - a.id; })
            let gotList = [];
            let others = [];
            data.forEach(d => {
                if (d.got) {
                    gotList.push({
                        type: this.curView,
                        info: d
                    });
                }
                else {
                    others.push({
                        type: this.curView,
                        info: d
                    });
                }
            });
            info = [...others, ...gotList];
        }
        list.clear_items();
        list.set_data(info);
        this._updateMyRankItem();
    }

    async _updateMyRankItem() {
        if (this.curView !== 0) return;
        let ctrl = this.myRankItem.getComponent(EnvelopeRankItemCtrl);
        if (this.curRankIdx == 1 && !this.GuildModel.myEnvGuildRankInfo) {
            //自己公会没有数据
            let brief = new icmsg.GuildBrief();
            let guildInfo = await GuildUtils.getGuildInfo().catch((e) => { info = null });
            if (!guildInfo) brief = null;
            else {
                brief.id = guildInfo.id;
                brief.name = guildInfo.name;
                brief.level = guildInfo.level;
                brief.icon = guildInfo.icon;
                brief.frame = guildInfo.frame;
                brief.bottom = guildInfo.bottom;
            }
            let info = new icmsg.WorldEnvelopeRank();
            info.guild = brief;
            info.name = guildInfo ? guildInfo.president : '';
            info.num = 0;
            info.value = 0;
            this.GuildModel.myEnvGuildRankInfo = {
                idx: 999,
                info: info
            };
        }
        ctrl.curIndex = this.curRankIdx == 0 ? this.GuildModel.myEnvelopeRankInfo.idx : this.GuildModel.myEnvGuildRankInfo.idx;
        ctrl._updateView(this.curRankIdx == 0 ? this.GuildModel.myEnvelopeRankInfo.info : this.GuildModel.myEnvGuildRankInfo.info);
    }
}
