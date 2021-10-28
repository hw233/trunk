import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildModel from '../../model/GuildModel';
import GuildPowerRankItemCtrl from './GuildPowerRankItemCtrl';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-28 10:05:42
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/power/GuildPowerRankViewCtrl")
export default class GuildPowerRankViewCtrl extends gdk.BasePanel {
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
        let req = new icmsg.GuildGatherRankReq()
        NetManager.send(req, (resp: icmsg.GuildGatherRankRsp) => {
            this.GModel.gatherRankInfo = resp
            this._updateListView(resp);
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

    _updateListView(resp: icmsg.GuildGatherRankRsp) {
        this._initList();
        let rankDatas = resp.list
        let datas = rankDatas.sort((a, b) => {
            if (a.totalPower == b.totalPower) {
                return b.numberCount - a.numberCount;
            }
            else {
                return b.totalPower - a.totalPower;
            }
        });
        // this.list.clear_items();
        this.list.set_data(datas);
        this._updateTopView(resp);

        let myInfo = null;
        let rM = ModelManager.get(RoleModel);
        let ctrl = this.myRankItem.getComponent(GuildPowerRankItemCtrl);
        for (let i = 0; i < datas.length; i++) {
            if (datas[i].guildId == rM.guildId) {
                myInfo = datas[i];
                ctrl.curIndex = i;
            }
        }
        ctrl._updateInfo(myInfo);
    }

    _updateTopView(resp: icmsg.GuildGatherRankRsp) {
        let top3Datas = resp.list
        let child = this.topThreeNode.children;
        child.forEach((node, idx) => {
            let info = top3Datas[idx];
            let nameNode = node.getChildByName('layout');
            let heroNode = node.getChildByName('hero');
            if (info) {
                nameNode.active = true;
                nameNode.getChildByName('name').getComponent(cc.Label).string = info.presidentName;
                cc.find('frame', heroNode).on(cc.Node.EventType.TOUCH_END, () => {
                    gdk.panel.setArgs(PanelId.MainSet, info.presidentId);
                    gdk.panel.open(PanelId.MainSet);
                }, this);
                GlobalUtil.setSpriteIcon(this.node, cc.find('mask/head', node), GlobalUtil.getHeadIconById(info.presidentHead));
                GlobalUtil.setSpriteIcon(this.node, cc.find('frame', node), GlobalUtil.getHeadFrameById(info.presidentHeadFrame));
            }
            else {
                heroNode.active = false;
                nameNode.active = false;
                cc.find('frame', heroNode).targetOff(this);
            }
        });
    }
}
