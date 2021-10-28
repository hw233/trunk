import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import RewardItem from '../../../common/widgets/RewardItem';
import RoyalModel from '../../../common/models/RoyalModel';
import UiListItem from '../../../common/widgets/UiListItem';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Royal_rankingCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaRankRewardItemCtrl")
export default class RoyalArenaRankRewardItemCtrl extends UiListItem {

    @property(cc.RichText)
    nameLabel: cc.RichText = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    curReward: cc.Node = null;

    rewardList: ListView;
    info: { name: string, cfg: Royal_rankingCfg, myRank: boolean, lock: boolean }
    lock: boolean = false;

    get model(): RoyalModel { return ModelManager.get(RoyalModel); }

    updateView() {
        this.info = this.data;
        this.nameLabel.string = this.info.name;
        this.lock = this.info.lock

        let cfgs = ConfigManager.getItems(Royal_rankingCfg, (cfg: Royal_rankingCfg) => {
            if (cfg.type == this.model.rewardType && cfg.server == this.model.serverNum) {
                return true;
            }
            return false;
        })

        this.curReward.active = false
        if (this.info.cfg.requirements == this.model.division) {
            this.curReward.active = true
        } else {
            if (this.info.cfg.requirements == 0 && this.model.division < cfgs[cfgs.length - 2].requirements) {
                this.curReward.active = true
            }
        }

        //刷新奖励信息
        this._updateRewardData()
    }

    _updateRewardData() {
        this.content.removeAllChildren()
        for (let i = 0; i < this.info.cfg.rank_rewards.length; i++) {
            let node = cc.instantiate(this.itemPrefab);
            let ctrl = node.getComponent(RewardItem);
            let tem = this.info.cfg.rank_rewards[i];
            let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.content)
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
        if (this.rewardList) {
            this.rewardList.destroy()
            this.rewardList = null
        }
    }
}