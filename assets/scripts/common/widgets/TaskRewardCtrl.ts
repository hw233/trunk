import CCActionUtils from '../utils/CCActionUtils';
import GuideModel from '../../guide/model/GuideModel';
import JumpUtils from '../utils/JumpUtils';
import ModelManager from '../managers/ModelManager';
import UiSlotItem from './UiSlotItem';
import { ListView, ListViewDir } from './UiListview';

/** 
  * @Description: 恭喜获得窗口
  * @Author: weiliang.huang  
  * @Date: 2019-05-14 14:57:28 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 13:14:22
*/
const { ccclass, property, menu } = cc._decorator;

export type RewardInfoType = {
    goodList: icmsg.GoodsInfo[],  // 奖励信息
    showType: RewardType,    // 用于区别奖励信息来源,做显示修改用
}

export enum RewardType {
    NORMAL = 0,
    HERO = 1
}
@ccclass
@menu("qszc/common/widgets/TaskRewardCtrl")
export default class TaskRewardCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    closeTips: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    @property(sp.Skeleton)
    titleSpine: sp.Skeleton = null

    goodList: icmsg.GoodsInfo[] = []

    list: ListView = null

    get guideModel(): GuideModel {
        return ModelManager.get(GuideModel);
    }

    start() {
        // let a = new GoodsInfo()
        // a.typeId = 200001
        // a.num = 1
        // let a1 = new GoodsInfo()
        // a1.typeId = 200001
        // a1.num = 1
        // let a2 = new GoodsInfo()
        // a2.typeId = 200001
        // a2.num = 1
        // let info: RewardInfoType = { goodList: [a1, a, a2], showType: RewardType.NORMAL }
        // this.initRewardInfo(info)
    }

    onDisable() {
        JumpUtils.showGuideMask()
        for (let i = 0; i < this.goodList.length; i++) {
            let reward = cc.instantiate(this.rewardItem)
            let item = reward.getChildByName("UiSlotItem").getComponent(UiSlotItem)
            item.node.parent = gdk.gui.layers.guideLayer
            item.updateItemInfo(this.goodList[i].typeId)
            item.node.x = this.scrollView.node.x + 55 + i * 130
            item.node.y = this.scrollView.node.y - 50

            let moveAction = CCActionUtils.Instance.moveTo(cc.v2(274, -590), 0.6);
            let scaleAction = CCActionUtils.Instance.scaleTo(0.6, 0.2, 0.2)
            let endAction = cc.callFunc(() => {
                item.node.destroy()
                JumpUtils.hideGuideMask()
            }, this)
            //同步执行飞动，缩小
            let ation1 = CCActionUtils.Instance.spawn([moveAction, scaleAction])
            //顺序执行后消除图标，恢复可以点击
            let flyAction = CCActionUtils.Instance.sequence([ation1, endAction])
            CCActionUtils.Instance.runAction(item.node, flyAction);
        }
    }

    onDestroy() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
    }

    _initListView() {
        if (this.list) {
            this.list.destroy()
        }

        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rewardItem,
            cb_host: this,
            async: true,
            gap_x: 5,
            direction: ListViewDir.Horizontal,
        })
    }


    initRewardInfo(info: RewardInfoType) {
        this.titleSpine.setAnimation(0, "UI_gxhd", false)
        this.goodList = info.goodList
        // 计算scrollview的宽高
        let svWidth = this.goodList.length * 110
        let svHeight = 120

        this.scrollView.node.setContentSize(cc.size(svWidth, svHeight))
        this.scrollView.node.x = -svWidth / 2 + 5
        this.scrollView.node.y = svHeight / 2 - 20
        this._initListView()
        this.list.set_data(this.goodList)
    }
}
