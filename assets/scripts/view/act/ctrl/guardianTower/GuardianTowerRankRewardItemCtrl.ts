import RewardItem from '../../../../common/widgets/RewardItem';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Guardiantower_prizeCfg } from '../../../../a/config';
import { ListView } from '../../../../common/widgets/UiListview';

/**
 * @Description: 护使秘境排行榜奖励Item
 * @Author: yaozu.hu
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-15 19:26:15
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guardianTower/GuardianTowerRankRewardItemCtrl")
export default class GuardianTowerRankRewardItemCtrl extends UiListItem {

    @property(cc.RichText)
    nameLabel: cc.RichText = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;
    rewardList: ListView;

    info: { name: string, cfg: Guardiantower_prizeCfg }

    updateView() {
        this.info = this.data;
        this.nameLabel.string = this.info.name;
        this._updateRewardData();
    }
    _updateRewardData() {

        this.content.removeAllChildren()
        for (let i = 0; i < this.info.cfg.rank_prize.length; i++) {
            let node = cc.instantiate(this.itemPrefab);
            let ctrl = node.getComponent(RewardItem);
            let tem = this.info.cfg.rank_prize[i];
            let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.content)
        }

    }
}
