import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../model/NewAdventureModel';
import NewAdventureUtils from '../utils/NewAdventureUtils';
import RewardItem from '../../../common/widgets/RewardItem';
import UiListItem from '../../../common/widgets/UiListItem';
import { Adventure2_themeheroCfg } from '../../../a/config';
import { ListView } from '../../../common/widgets/UiListview';


/** 
 * @Description: 英雄试炼关卡奖励Item
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-23 18:05:31
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/NewAdventureStageRewardItemCtrl")
export default class NewAdventureStageRewardItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Node)
    jinduNode: cc.Node = null;
    @property(cc.Node)
    jinduSp: cc.Node = null;
    @property(cc.Label)
    jinduLb: cc.Label = null;
    @property(cc.Label)
    desLb: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    yilingqu: cc.Node = null;

    @property(cc.Node)
    attackBtn: cc.Node = null;

    rewardList: ListView;

    info: { cfg: Adventure2_themeheroCfg, index: number }  //state 0 已领取 1可领取 2 不可领取

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    btnState: number = 0; //btnState 0可挑战 1时间未到 2通关前置关卡
    activityId: number = 44;
    updateView() {
        this.info = this.data;
        this.nameLabel.string = this.info.cfg.difficulty_name
        // let heroTrialInfo = this.model.heroTrialInfo;
        // let stageId = heroTrialInfo.maxStageId > 0 ? heroTrialInfo.maxStageId : 0;
        // let curDamage = heroTrialInfo.stageDamages.length > this.info.index ? heroTrialInfo.stageDamages[this.info.index] : 0;
        // let allDamage = this.getStageAllEnemyHp(this.info.cfg.round);
        // let num = Math.floor((curDamage / allDamage) * 100)

        // this.jinduLb.string = num + '%'
        // this.jinduSp.width = 158 * num / 100;
        let state = 0;
        let old = this.adventureModel.difficultyRewarded;
        let curDifficulty = this.adventureModel.difficulty
        if (curDifficulty > this.info.cfg.difficulty ||
            (curDifficulty == this.info.cfg.difficulty && NewAdventureUtils.isLayerPass(curDifficulty))) {
            if (!((old & 1 << (this.info.cfg.difficulty - 1) % 8) >= 1)) {
                state = 1
            } else {
                state = 2
            }
        }
        this.attackBtn.active = state == 1;
        this.yilingqu.active = state == 2;

        //刷新奖励信息
        this._updateRewardData()
    }

    onDisable() {
        gdk.Timer.clearAll(this);
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
    }

    lingquBtnClick() {
        let msg = new icmsg.Adventure2DifficultyRewardReq()
        msg.difficulty = this.info.cfg.difficulty
        NetManager.send(msg, (rsp: icmsg.Adventure2DifficultyRewardRsp) => {
            this.adventureModel.difficultyRewarded = rsp.rewarded;
            this.updateView()
            GlobalUtil.openRewadrView(rsp.list);
        })
    }


}
