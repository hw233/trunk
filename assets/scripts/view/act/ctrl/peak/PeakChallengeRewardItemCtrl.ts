import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PeakModel from '../../model/PeakModel';
import RewardItem from '../../../../common/widgets/RewardItem';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { Peak_challengeCfg } from '../../../../a/config';


/** 
 * @Description: 巅峰之战挑战奖励Item
 * @Author: yaozu.hu
 * @Date: 2021-02-22 11:30:49
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-02-27 09:43:21
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakChallengeRewardItemCtrl")
export default class PeakChallengeRewardItemCtrl extends UiListItem {

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
    info: { cfg: Peak_challengeCfg, num: number, state: number }  //state 0 已领取 1可领取 2 不可领取

    get model(): PeakModel { return ModelManager.get(PeakModel); }

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
        for (let i = 0; i < this.info.cfg.rewards.length; i++) {
            let node = cc.instantiate(this.itemPrefab);
            let ctrl = node.getComponent(RewardItem);
            let tem = this.info.cfg.rewards[i];
            let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.content)
        }
        if (this.info.cfg.item_icon != '') {
            for (let i = 0; i < this.info.cfg.item_icon.length; i++) {
                let node = cc.instantiate(this.itemPrefab);
                let ctrl = node.getComponent(RewardItem);
                let tem = this.info.cfg.item_icon[i];
                let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
                ctrl.data = temData;
                ctrl.updateView();
                node.setParent(this.content)
            }
        }

    }

    lingquBtnClick() {
        if (!this.info || this.info.state > 1) {
            return;
        }
        let msg = new icmsg.PeakRewardReq();
        msg.times = this.info.cfg.times;
        NetManager.send(msg, (rsp: icmsg.PeakRewardRsp) => {

            let temData = []
            temData = rsp.list;
            rsp.heroes.forEach(data => {
                let tem = new icmsg.GoodsInfo()
                tem.typeId = data.typeId;
                tem.num = 1;
                temData.push(tem);
            })
            GlobalUtil.openRewadrView(rsp.list);
            let tem = this.model.peakStateInfo.heroes.concat(rsp.heroes);
            this.model.peakStateInfo.heroes = tem
            //修改位图
            this.model.peakStateInfo.challenge = rsp.challenge;
            gdk.e.emit(ActivityEventId.ACTIVITY_PEAK_CHANGE_REWARD_UPDATE)
        }, this)
    }

}
