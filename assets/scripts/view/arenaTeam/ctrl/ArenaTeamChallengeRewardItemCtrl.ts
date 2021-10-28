import ArenaTeamViewModel from '../model/ArenaTeamViewModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RewardItem from '../../../common/widgets/RewardItem';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { ArenaTeamEvent } from '../enum/ArenaTeamEvent';
import { Teamarena_prizeCfg } from '../../../a/config';

/** 
 * @Description: 组队竞技场挑战奖励Item
 * @Author: yaozu.hu
 * @Date: 2021-02-03 16:29:36
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-02-05 18:11:09
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenaTeam/ArenaTeamChallengeRewardItemCtrl")
export default class ArenaTeamChallengeRewardItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    yilingqu: cc.Node = null;
    @property(cc.Node)
    lingquBtn: cc.Node = null;

    //rewardList: ListView;
    info: { cfg: Teamarena_prizeCfg, num: number, state: number }  //state 0 已领取 1可领取 2 不可领取

    get model(): ArenaTeamViewModel { return ModelManager.get(ArenaTeamViewModel); }

    updateView() {
        this.info = this.data;
        let desc = gdk.i18n.t("i18n:HEROTRIAL_NAME");
        let text = StringUtils.replace(desc, "@number", this.info.cfg.times + '');
        this.nameLabel.string = text//'挑战' + this.info.cfg.challenge_times + '次';
        this.numLabel.string = '(' + this.info.num + '/' + this.info.cfg.times + ')';
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

    onDisable() {
        NetManager.targetOff(this)
    }

    _updateRewardData() {

        this.content.removeAllChildren()
        for (let i = 0; i < this.info.cfg.prize.length; i++) {
            let node = cc.instantiate(this.itemPrefab);
            let ctrl = node.getComponent(RewardItem);
            let tem = this.info.cfg.prize[i];
            let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.content)
        }
    }

    lingquBtnClick() {
        if (!this.info || this.info.state > 1) {
            return;
        }
        let msg = new icmsg.ArenaTeamFightRewardsReq();
        msg.index = this.info.cfg.times;
        NetManager.send(msg, (rsp: icmsg.ArenaTeamFightRewardsRsp) => {
            GlobalUtil.openRewadrView(rsp.list);
            let reward = this.model.fightRewarded
            //修改位图
            reward |= 1 << rsp.index;
            this.model.fightRewarded = reward;
            gdk.e.emit(ArenaTeamEvent.RSP_ARENATEAM_CHANGETIMES_REWARD)
        }, this)
    }

}
