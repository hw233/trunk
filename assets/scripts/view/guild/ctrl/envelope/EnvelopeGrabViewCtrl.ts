import EnvelopeRankItemCtrl from './EnvelopeRankItemCtrl';
import GuildModel from '../../model/GuildModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-12 13:55:55 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/envelop/EnvelopeGrabViewCtrl")
export default class EnvelopeGrabViewCtrl extends cc.Component {
    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    titleNode: cc.Node = null;

    @property(cc.Node)
    rankItem: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    guildEnvelopePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    worldEnvelopePrefab: cc.Prefab = null;

    get GuildModel(): GuildModel { return ModelManager.get(GuildModel); }

    curPage: number; //0-公会 1-世界
    list: ListView;
    //----world Info----//
    minId: number = -1;  //最小未领取的红包序号
    curIdx: number = 0;  //当前翻页查询的下标
    count: number = 9;  //每次翻页查询的数量
    curWorldEnvList: icmsg.WorldEnvelope[] = []; //当前世界红包列表
    onEnable() {
        NetManager.on(icmsg.GuildEnvelopeChangeRsp.MsgType, (resp: icmsg.GuildEnvelopeChangeRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            if (!resp.my && this.curPage == 0) {
                this._updateList();
            }
        }, this);
        this.scrollView.node.on("scroll-to-bottom", this.onScrollToEnd, this);
    }

    onDisable() {
        this.curPage = null;
        this._clearWorldInfo();
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        this.scrollView.node.off("scroll-to-bottom", this.onScrollToEnd);
        NetManager.targetOff(this);
    }

    init(page: number) {
        this.uiTabMenu.setSelectIdx(page, true);
    }

    onTabMenuSelect(e, data) {
        if (!e) return;
        if (this.curPage !== parseInt(data)) {
            this.curPage = data;
            this._clearWorldInfo();
            this._initList();
            this._updateList();
            this._updateRankItem();
        }
    }

    onScrollToEnd() {
        let maxId = this.GuildModel.worldEnvMaxId || 0;
        let last = this.curWorldEnvList[this.curWorldEnvList.length - 1];
        if (maxId > 0 && last && last.id < maxId) {
            this._updateList();
        }
    }

    _clearWorldInfo() {
        this.minId = -1;
        this.curIdx = 0;
        this.curWorldEnvList = [];
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
            item_tpl: this.curPage == 0 ? this.guildEnvelopePrefab : this.worldEnvelopePrefab,
            cb_host: this,
            gap_y: 5,
            gap_x: 20,
            column: 3,
            async: true,
            direction: ListViewDir.Vertical,
        });
    }

    _updateList() {
        if (this.curPage == 0) {
            let data = this.GuildModel.grabEnvelopeList;
            data.sort((a, b) => { return b.id - a.id; })
            let gotList = [];
            let others = [];
            data.forEach(d => {
                if (d.got) {
                    gotList.push({
                        type: 1,
                        info: d
                    });
                }
                else {
                    others.push({
                        type: 1,
                        info: d
                    });
                }
            });
            this.list.clear_items();
            this.list.set_data([...others, ...gotList]);
        }
        else {
            let cb = () => {
                let req = new icmsg.WorldEnvelopeListReq();
                req.minId = this.minId;
                req.index = this.curWorldEnvList.length;
                req.count = this.count;
                NetManager.send(req, (resp: icmsg.WorldEnvelopeListRsp) => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    if (this.curPage == 1) {
                        this.curWorldEnvList = this.curWorldEnvList.concat(resp.list);
                        if (!this.list.datas || this.list.datas.length == 0) {
                            this.list.set_data(this.curWorldEnvList);
                        }
                        else {
                            this.list.append_data(...resp.list);
                        }
                    }
                }, this);
            };
            if (this.minId !== -1) {
                cb();
            }
            else {
                let req = new icmsg.WorldEnvelopeIdReq();
                NetManager.send(req, (resp: icmsg.WorldEnvelopeIdRsp) => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    if (this.curPage == 1) {
                        this.minId = resp.maxGotId;
                        cb();
                    }
                }, this);
            }
        }
    }

    _updateRankItem() {
        let strs = [['头像', '名字'], ['公会徽章', '公会名字']][this.curPage];
        cc.find('icon', this.titleNode).getComponent(cc.Label).string = strs[0];
        cc.find('name', this.titleNode).getComponent(cc.Label).string = strs[1];
        let req = new icmsg.WorldEnvelopeRankReq();
        req.type = this.curPage + 1;
        NetManager.send(req, (resp: icmsg.WorldEnvelopeRankRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.rankItem.getComponent(EnvelopeRankItemCtrl).curIndex = 0;
            this.rankItem.getComponent(EnvelopeRankItemCtrl)._updateView(resp.rank[0]);
        }, this);
    }
}
