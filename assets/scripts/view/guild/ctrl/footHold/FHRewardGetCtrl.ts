import FootHoldModel from './FootHoldModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-19 17:53:45
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHRewardGetCtrl")
export default class FHRewardGetCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    list: ListView = null;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        this._updateViewData()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rewardItem,
            cb_host: this,
            async: true,
            gap_x: 10,
            direction: ListViewDir.Horizontal,
        })
    }

    _updateViewData() {
        this._initListView()
        let datas = this.footHoldModel.fhDropReward
        this.list.set_data(datas)

        let maxLen = datas.length
        if (maxLen >= 3) {
            maxLen = 3
        }
        this.scrollView.node.width = maxLen * 110 + (maxLen - 1) * 10
        this.scrollView.node.x = -this.scrollView.node.width / 2
    }


    getRewaredFunc() {
        let msg = new icmsg.GuildDropFetchReq()
        NetManager.send(msg, (data: icmsg.GuildDropFetchRsp) => {
            this.close()
            GlobalUtil.openRewadrView(data.list)
            this.footHoldModel.fhDropReward = []
            gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_DROP_REWARD)
            let msg = new icmsg.GuildDropStateReq()
            NetManager.send(msg)
        }, this)
    }
}