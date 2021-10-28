import RewardItem from '../../../common/widgets/RewardItem';
import UiListItem from '../../../common/widgets/UiListItem';
import { Arenahonor_rewardsCfg } from '../../../a/config';

/** 
 * @Description: 世界巅峰赛奖励Item
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-18 15:45:15
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/worldhonor/WorldHonorRewardItemCtrl")
export default class WorldHonorRewardItemCtrl extends UiListItem {

    @property(cc.RichText)
    nameLabel: cc.RichText = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    info: { name: string, cfg: Arenahonor_rewardsCfg }

    updateView() {
        this.info = this.data;
        this.nameLabel.string = this.info.name;
        //刷新奖励信息
        this._updateRewardData()
    }

    _updateRewardData() {
        this.content.removeAllChildren()
        for (let i = 0; i < this.info.cfg.reward.length; i++) {
            let node = cc.instantiate(this.itemPrefab);
            let ctrl = node.getComponent(RewardItem);
            let tem = this.info.cfg.reward[i];
            let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.content)
        }
    }

}
