import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PeakModel from '../../model/PeakModel';
import RewardItem from '../../../../common/widgets/RewardItem';
import UiListItem from '../../../../common/widgets/UiListItem';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { Peak_divisionCfg, Peak_gradeCfg } from '../../../../a/config';

/** 
 * @Description: 巅峰之战排行奖励Item
 * @Author: yaozu.hu
 * @Date: 2021-02-01 10:50:41
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-02-26 17:29:00
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakRankRewardItemCtrl")
export default class PeakRankRewardItemCtrl extends UiListItem {

    @property(cc.Sprite)
    divisionSp: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    Btn1: cc.Node = null;   //领取物品奖励
    @property(cc.Node)
    Btn2: cc.Node = null;   //领取英雄奖励

    @property(RewardItem)
    heroReward: RewardItem = null;

    info: { cfg: Peak_gradeCfg, divisionCfg: Peak_divisionCfg, num: number, state: number }    //state 0 已领取 1可领取物品奖励 2可领取英雄奖励 3 不可领取


    get model(): PeakModel { return ModelManager.get(PeakModel); }

    updateView() {
        this.info = this.data;
        this.nameLabel.string = this.info.divisionCfg.name;
        this.numLabel.string = '(' + this.info.num + '/' + this.info.divisionCfg.point + ')';
        GlobalUtil.setSpriteIcon(this.node, this.divisionSp, 'view/act/texture/peak/' + this.info.divisionCfg.icon)

        //刷新奖励信息
        if (this.info.state == 0 || this.info.state == 3) {
            this.Btn1.active = false;
            this.Btn2.active = false;
        } else if (this.info.state == 1) {
            this.Btn1.active = true;
            this.Btn2.active = false;
        } else if (this.info.state == 2) {
            this.Btn1.active = false;
            this.Btn2.active = true;
        }
        //刷新奖励信息
        this._updateRewardData()
    }


    _updateRewardData() {
        //this._initListView();
        let listData = []
        this.content.removeAllChildren()
        for (let i = 0; i < this.info.cfg.rewards.length; i++) {
            let node = cc.instantiate(this.itemPrefab);
            let ctrl = node.getComponent(RewardItem);
            let tem = this.info.cfg.rewards[i];
            let isGet = false;
            if (this.data.state == 0 || this.data.state == 2) {
                isGet = true
            }
            let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false, isGet: isGet }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.content)
        }
        let tem = this.info.cfg.item_icon[0];
        this.heroReward.node.active = this.data.cfg.hero != ''
        if (this.data.cfg.hero != '') {
            let isGet = false;
            if (this.data.state == 0) {
                isGet = true
            }
            let temData = { index: 0, typeId: tem[0], num: tem[1], delayShow: false, effct: false, isGet: isGet }
            this.heroReward.data = temData;
            this.heroReward.updateView();
        }

    }



    onDisable() {
        NetManager.targetOff(this)

    }

    //领取段位wup奖励
    rewardBtnClick() {
        let msg = new icmsg.PeakRewardReq()
        msg.grade = this.info.cfg.grade;
        NetManager.send(msg, (rsp: icmsg.PeakRewardRsp) => {
            this.model.peakStateInfo.gradeReward = rsp.gradeReward;
            GlobalUtil.openRewadrView(rsp.list);
            //this.model.rankRewarded = true;
            //this.updateView();
            gdk.e.emit(ActivityEventId.ACTIVITY_PEAK_RANK_REWARD_UPDATE)
        }, this)
    }

    openSelectHeroView() {
        gdk.panel.setArgs(PanelId.PeakSelectHeroView, this.info.cfg.grade)
        gdk.panel.open(PanelId.PeakSelectHeroView)
    }

}
