import GlobalUtil from '../../../../common/utils/GlobalUtil';
import InstanceModel from '../../../instance/model/InstanceModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RewardItem from '../../../../common/widgets/RewardItem';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Ordeal_rankingCfg } from '../../../../a/config';


/** 
 * @Description: 英雄试炼排行榜Item
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-30 18:37:16
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/heroTrial/HeroTrialRewardItemCtrl")
export default class HeroTrialRewardItemCtrl extends UiListItem {

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
    @property(cc.Label)
    rewardNum: cc.Label = null;
    @property(cc.Node)
    ylqSp: cc.Node = null;

    rewardList: ListView;
    info: { name: string, cfg: Ordeal_rankingCfg, rewardData: icmsg.DungeonOrdealReward, myDamage: number }
    model: InstanceModel = ModelManager.get(InstanceModel);

    updateView() {
        this.info = this.data;
        this.nameLabel.string = this.info.name;

        //刷新奖励信息
        this._updateRewardData()
    }

    // onDisable() {
    //     // if (this.rewardList) {
    //     //     this.rewardList.destroy();
    //     //     this.rewardList = null;
    //     // }
    // }

    _updateRewardData() {
        //this._initListView();
        let listData = []
        //index:xxxx, typeId: xxx, num: xxx, delayShow: xxx, effect: xxx
        this.content.removeAllChildren()
        for (let i = 0; i < this.info.cfg.rank_rewards.length; i++) {
            let node = cc.instantiate(this.itemPrefab);
            let ctrl = node.getComponent(RewardItem);
            let tem = this.info.cfg.rank_rewards[i];
            let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.content)
            //listData.push(temData);
        }
        //this.rewardList.set_data(listData);
        // this.scrollView.enabledInHierarchy = false;

        let rewardRecord = this.model.heroTrialInfo.rewardRecord;
        this.rewardNum.string = StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_TIP5"), this.info.rewardData.times)//HEROTRIAL_TIP5 '还剩' + this.info.rewardData.times + '份'
        if (rewardRecord.indexOf(this.info.rewardData.damage) < 0) {
            this.rewardBtn.active = true;
            this.ylqSp.active = false;
            let state: 0 | 1 = 0
            if (this.info.myDamage < this.info.rewardData.damage) {
                state = 1
            } else if (this.info.rewardData.times <= 0) {
                state = 1
            }
            GlobalUtil.setAllNodeGray(this.rewardBtn, state)
        } else {
            this.rewardBtn.active = false;
            this.ylqSp.active = true;
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

    rewardBtnClick() {

        if (this.info.myDamage < this.info.rewardData.damage) {
            let str = StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_TIP6"), this.info.rewardData.damage)
            gdk.gui.showMessage(str)
            return;
        } else if (this.info.rewardData.times <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_TIP7"))
            return;
        }

        let msg = new icmsg.DungeonOrdealRewardReq()
        msg.damage = this.info.rewardData.damage;
        NetManager.send(msg, (rsp: icmsg.DungeonOrdealRewardRsp) => {
            this.model.heroTrialInfo.rewardRecord = rsp.rewardRecord;
            this.model.heroTrialInfo.rewardTimes = rsp.rewardTimes;
            GlobalUtil.openRewadrView(rsp.rewards);
            //this.datas = rsp;
            //刷新排名信息
            //this._updateView1()
            gdk.e.emit(ActivityEventId.ACTIVITY_HEROTRIAL_DAMAGEREWARD_UPDATE)
        }, this);
    }

    onDisable() {
        NetManager.targetOff(this)
    }
}
