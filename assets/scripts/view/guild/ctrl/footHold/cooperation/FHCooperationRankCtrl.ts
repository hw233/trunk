import ConfigManager from '../../../../../common/managers/ConfigManager';
import FootHoldModel from '../FootHoldModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import { Foothold_cooperation_rankingCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
/*
 * @Description: 协战玩家的排行信息
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-12 16:14:39
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationRankCtrl")
export default class FHCooperationRankCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rankItem: cc.Prefab = null

    list: ListView = null

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        let msg = new icmsg.FootholdCoopRankListReq()
        NetManager.send(msg, (data: icmsg.FootholdCoopRankListRsp) => {
            this._updateViewInfo(data.rankList)
        }, this)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rankItem,
            cb_host: this,
            async: true,
            gap_y: 4,
            direction: ListViewDir.Vertical,
        })
    }

    _updateViewInfo(datas: icmsg.FootholdCoopPlayer[]) {
        this._initListView()
        let len = datas.length
        let showDatas = datas
        GlobalUtil.sortArray(showDatas, (a, b) => {
            if (a.score == b.score) {
                return b.number - a.number
            }
            return b.score - a.score
        })

        let cfgs = ConfigManager.getItems(Foothold_cooperation_rankingCfg, (rank: Foothold_cooperation_rankingCfg) => {
            if (this.footHoldModel.activityIndex >= rank.ranking[0] && this.footHoldModel.activityIndex <= rank.ranking[1]) {
                return true;
            }
            return false;
        })
        if (showDatas.length < cfgs.length) {
            let tempInfo = new icmsg.FootholdCoopPlayer()
            for (let i = 0; i < cfgs.length - len; i++) {
                showDatas.push(tempInfo)
            }
        }
        this.list.set_data(showDatas)
    }

}