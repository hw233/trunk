import InstanceModel from '../../../instance/model/InstanceModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RewardItem from '../../../../common/widgets/RewardItem';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Carnival_personal_rankCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';


/** 
 * @Description: 跨服任务排行榜Item2
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-15 17:33:37
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class CServerPersonRewardItemCtrl extends UiListItem {

    @property(cc.RichText)
    nameLabel: cc.RichText = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    // @property(cc.Node)
    // rewardBtn: cc.Node = null;
    // @property(cc.Label)
    // rewardNum: cc.Label = null;
    // @property(cc.Node)
    // ylqSp: cc.Node = null;

    rewardList: ListView;
    info: { name: string, cfg: Carnival_personal_rankCfg, myRank: number }
    model: InstanceModel = ModelManager.get(InstanceModel);

    updateView() {
        this.info = this.data;
        this.nameLabel.string = this.info.name;

        //刷新奖励信息
        this._updateRewardData()
    }


    _updateRewardData() {
        //this._initListView();
        let listData = []
        //index:xxxx, typeId: xxx, num: xxx, delayShow: xxx, effect: xxx
        this.content.removeAllChildren()
        for (let i = 0; i < this.info.cfg.rewards.length; i++) {
            let node = cc.instantiate(this.itemPrefab);
            let ctrl = node.getComponent(RewardItem);
            let tem = this.info.cfg.rewards[i];
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
}


