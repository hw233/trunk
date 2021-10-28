import GlobalUtil from '../../../../common/utils/GlobalUtil';
import InstanceModel from '../../../instance/model/InstanceModel';
import ModelManager from '../../../../common/managers/ModelManager';
import RewardItem from '../../../../common/widgets/RewardItem';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Ordeal_challengeCfg } from '../../../../a/config';

/** 
 * @Description: 英雄试炼挑战奖励Item
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-30 14:26:30
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/heroTrial/HeroTrialChallengeRewardItemCtrl")
export default class HeroTrialChallengeRewardItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    yilingqu: cc.Node = null;
    @property(cc.Node)
    lingquBtn: cc.Node = null;

    rewardList: ListView;
    info: { cfg: Ordeal_challengeCfg, num: number, state: number }  //state 0 已领取 1可领取 2 不可领取

    model: InstanceModel = ModelManager.get(InstanceModel);

    updateView() {
        this.info = this.data;
        let desc = gdk.i18n.t("i18n:HEROTRIAL_NAME");
        let text = StringUtils.replace(desc, "@number", this.info.cfg.challenge_times + '');
        this.nameLabel.string = text//'挑战' + this.info.cfg.challenge_times + '次';
        this.numLabel.string = '(' + this.info.num + '/' + this.info.cfg.challenge_times + ')';
        if (this.info.state == 0) {
            this.yilingqu.active = true;
            this.lingquBtn.active = false;
        } else {
            this.yilingqu.active = false;
            this.lingquBtn.active = true;
            let temState: 0 | 1 = this.info.state > 1 ? 1 : 0;
            GlobalUtil.setAllNodeGray(this.lingquBtn, temState);
        }
        //刷新奖励信息
        this._updateRewardData()
    }

    // onDisable() {
    //     if (this.rewardList) {
    //         this.rewardList.destroy();
    //         this.rewardList = null;
    //     }
    // }

    _updateRewardData() {
        //this._initListView();
        //let listData = []
        //index:xxxx, typeId: xxx, num: xxx, delayShow: xxx, effect: xxx
        // for (let i = 0; i < this.info.cfg.challenge_rewards.length; i++) {
        //     let tem = this.info.cfg.challenge_rewards[i];
        //     let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
        //     listData.push(temData);
        // }
        //this.rewardList.set_data(listData);
        this.content.removeAllChildren()
        for (let i = 0; i < this.info.cfg.challenge_rewards.length; i++) {
            let node = cc.instantiate(this.itemPrefab);
            let ctrl = node.getComponent(RewardItem);
            let tem = this.info.cfg.challenge_rewards[i];
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
                gap_x: 10,
                async: true,
                direction: ListViewDir.Horizontal,
            })
        }
    }

    lingquBtnClick() {
        if (!this.info || this.info.state > 1) {
            return;
        }
        // let msg = new icmsg.DungeonOrdealChallengeRewardReq();
        // msg.times = this.info.cfg.challenge_times;
        // NetManager.send(msg, (rsp: icmsg.DungeonOrdealChallengeRewardRsp) => {
        //     GlobalUtil.openRewadrView(rsp.rewards);
        //     if (this.model.heroTrialInfo) {
        //         this.model.heroTrialInfo.challengeReward = rsp.challengeReward;
        //         gdk.e.emit(ActivityEventId.ACTIVITY_HEROTRIAL_CHALLENGEREWARD_UPDATE)
        //     }
        // })
    }

}
