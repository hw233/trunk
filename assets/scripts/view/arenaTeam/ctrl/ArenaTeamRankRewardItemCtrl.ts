import ArenaTeamViewModel from '../model/ArenaTeamViewModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RewardItem from '../../../common/widgets/RewardItem';
import UiListItem from '../../../common/widgets/UiListItem';
import { ArenaTeamEvent } from '../enum/ArenaTeamEvent';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Teamarena_rank_prizeCfg } from '../../../a/config';

/** 
 * @Description: 组队竞技场排行奖励Item
 * @Author: yaozu.hu
 * @Date: 2021-02-01 10:50:41
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-02-06 16:25:55
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenaTeam/ArenaTeamRankRewardItemCtrl")
export default class ArenaTeamRankRewardItemCtrl extends UiListItem {

    @property(cc.RichText)
    nameLabel: cc.RichText = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    rewardBtn: cc.Node = null;
    @property(cc.Node)
    ylqSp: cc.Node = null;

    rewardList: ListView;
    info: { name: string, cfg: Teamarena_rank_prizeCfg, myRank: boolean, lock: boolean }
    lock: boolean = false;

    get model(): ArenaTeamViewModel { return ModelManager.get(ArenaTeamViewModel); }

    updateView() {
        this.info = this.data;
        this.nameLabel.string = this.info.name;
        this.lock = this.info.lock

        if (this.lock && this.info.myRank) {
            //判断奖励是否领取
            this.ylqSp.active = this.model.rankRewarded
            this.rewardBtn.active = !this.model.rankRewarded;
        } else {
            this.ylqSp.active = false;
            this.rewardBtn.active = false;
        }
        //刷新奖励信息
        this._updateRewardData()
    }


    _updateRewardData() {
        //this._initListView();
        let listData = []
        //index:xxxx, typeId: xxx, num: xxx, delayShow: xxx, effect: xxx
        this.content.removeAllChildren()
        for (let i = 0; i < this.info.cfg.rank_prize.length; i++) {
            let node = cc.instantiate(this.itemPrefab);
            let ctrl = node.getComponent(RewardItem);
            let tem = this.info.cfg.rank_prize[i];
            let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.content)
            //listData.push(temData);
        }

    }

    _initListView() {
        if (!this.rewardList) {
            this.rewardList = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                gap_x: -5,
                async: true,
                direction: ListViewDir.Horizontal,
            })
        }
    }

    onDisable() {
        NetManager.targetOff(this)
        if (this.rewardList) {
            this.rewardList.destroy()
            this.rewardList = null
        }
    }

    //领取段位奖励
    rewardBtnClick() {
        NetManager.send(new icmsg.ArenaTeamRankRewardsReq(), (rsp: icmsg.ArenaTeamRankRewardsRsp) => {
            GlobalUtil.openRewadrView(rsp.list);
            this.model.rankRewarded = true;
            this.updateView();
            gdk.e.emit(ArenaTeamEvent.RSP_ARENATEAM_RANK_REWARD)
        }, this)
    }

}
