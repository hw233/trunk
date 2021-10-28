import FootHoldModel from './FootHoldModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildModel, { GuildMemberLocal } from '../../model/GuildModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:02:35
 */
/**有职位的成员信息 本地使用 */
export type FhRewardListData = {
    menberInfo: GuildMemberLocal,
    recoredInfo: icmsg.GuildDropRecord,
}


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHRewardListCtrl")
export default class FHRewardListCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    listItem: cc.Prefab = null

    rewardList: ListView

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get guildModel(): GuildModel { return ModelManager.get(GuildModel); }

    onEnable() {
        NetManager.on(icmsg.GuildDropStateRsp.MsgType, this._onGuildDropStateRsp, this)
        //gdk.e.on(FootHoldEventId.UPDATE_FOOTHOLD_DROP_REWARD, this._refreshViewInfo, this)
        let msg = new icmsg.GuildDropStateReq()
        NetManager.send(msg)
    }

    onDisable() {
        NetManager.targetOff(this)
        gdk.e.targetOff(this)
    }

    _initRewardListView() {
        if (this.rewardList) {
            return
        }
        this.rewardList = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.listItem,
            cb_host: this,
            async: true,
            column: 2,
            direction: ListViewDir.Vertical,
        })
    }

    _onGuildDropStateRsp(data: icmsg.GuildDropStateRsp) {
        this.footHoldModel.fhDropGoods = data.goodsList
        this.footHoldModel.fhDropRecord = data.recordList

        let members = this.guildModel.guildDetail.members
        GlobalUtil.sortArray(members, this.sortPositionFunc)
        let infos = []
        for (let i = 0; i < members.length; i++) {
            for (let j = 0; j < data.recordList.length; j++) {
                if (members[i].id == data.recordList[j].playerId) {
                    let info: FhRewardListData = {
                        menberInfo: members[i],
                        recoredInfo: data.recordList[j],
                    }
                    infos.push(info)
                }
            }
        }
        this._initRewardListView()
        this.rewardList.set_data(infos)
    }

    _refreshViewInfo() {
        this.rewardList.refresh_items()
    }

    /**职位排序 */
    sortPositionFunc(a: any, b: any) {
        let infoA = <GuildMemberLocal>a
        let infoB = <GuildMemberLocal>b
        if (infoA.position == infoB.position) {
            if (infoA.level == infoB.level) {
                if (infoA.logoutTime == infoB.logoutTime) {
                    return infoA.id - infoB.id
                } else {
                    if ((infoA.logoutTime == 0 && infoB.logoutTime != 0) ||
                        (infoB.logoutTime == 0 && infoA.logoutTime != 0)) {
                        return infoA.logoutTime - infoB.logoutTime
                    } else {
                        return infoB.logoutTime - infoA.logoutTime
                    }
                }
            } else {
                return infoB.level - infoA.level
            }
        }
        return infoB.position - infoA.position
    }
}