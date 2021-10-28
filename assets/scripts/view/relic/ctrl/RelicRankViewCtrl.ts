import ConfigManager from '../../../common/managers/ConfigManager';
import GuildModel from '../../guild/model/GuildModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RelicModel from '../model/RelicModel';
import RelicRankItemCtrl from './RelicRankItemCtrl';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Relic_rankingCfg, TipsCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-05 10:42:15 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicRankViewCtrl")
export default class RelicRankViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    rankItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    rewardItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    myRankItem: cc.Node = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    @property(cc.Label)
    tipsLab: cc.Label = null;

    @property(cc.Node)
    titleLab1: cc.Node = null;

    @property(cc.Node)
    titleLab2: cc.Node = null;

    curSelectView: number;
    list: ListView;
    onEnable() {
        cc.find('layout/label', this.node).getComponent(cc.Label).string = ConfigManager.getItemById(TipsCfg, 107).desc21;
        NetManager.on(icmsg.RelicGuildRankRsp.MsgType, this._updateList, this);
        this.uiTabMenu.setSelectIdx(0, true);
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    onTabMenuSelect(e, data) {
        if (!e) return;
        this.curSelectView = data;
        this.titleLab1.active = data == 0;
        this.titleLab2.active = data !== 0;
        this.scrollView.node.height = data == 0 ? 607 : 710;
        if (data == 0) {
            let req = new icmsg.RelicGuildRankReq();
            NetManager.send(req);
        }
        else {
            this._updateList();
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
            item_tpl: this.curSelectView == 0 ? this.rankItemPrefab : this.rewardItemPrefab,
            cb_host: this,
            gap_y: 8,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    async _updateList() {
        this._initList();
        let datas;
        if (this.curSelectView == 0) {
            //rank
            let ids = [];
            let rankInfo = ModelManager.get(RelicModel).rankInfo;
            rankInfo.forEach(i => {
                ids.push(i.id);
            });
            await ModelManager.get(ServerModel).reqServerNameByIds(ids, 2);
            datas = rankInfo;
        }
        else {
            //reward
            datas = ConfigManager.getItems(Relic_rankingCfg, { server: ModelManager.get(RelicModel).crossServerNum });
            if (!datas || datas.length == 0) {
                let cfgs = ConfigManager.getItems(Relic_rankingCfg);
                datas = cfgs.slice(cfgs.length - 4);
            }
        }
        this.list.clear_items();
        this.list.set_data(datas);
        this._updateMyRankItem();
    }

    _updateMyRankItem() {
        if (this.curSelectView == 0) {
            this.myRankItem.active = true;
            let noGuild = cc.find('RankItem/noGuild', this.myRankItem).getComponent(cc.Label);
            let guildInfo = cc.find('RankItem/state1', this.myRankItem);
            let rM = ModelManager.get(RoleModel);
            if (!rM.guildId || !rM.guildName) {
                noGuild.string = gdk.i18n.t('i18n:STORE_TIP26');
                noGuild.node.active = true;
                guildInfo.active = false;
            }
            else {

                let ctrl = this.myRankItem.getComponent(RelicRankItemCtrl);
                let aM = ModelManager.get(RelicModel);
                let gM = ModelManager.get(GuildModel);
                let info = aM.myRankInfo;
                if (!info) {
                    noGuild.string = gdk.i18n.t('i18n:TASK_TIP10');
                    noGuild.node.active = true;
                    guildInfo.active = false;
                }
                else {
                    noGuild.node.active = false;
                    guildInfo.active = true;
                    ctrl.curIndex = aM.myRankNum;
                    ctrl.updateItem(info);
                }
            }
        }
        else {
            this.myRankItem.active = false;
        }
    }
}
