import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagType } from '../../../common/models/BagModel';
import { Mission_7showCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-15 16:18:45 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/SevenDaysRewardsPreView")
export default class SevenDaysRewardsPreView extends gdk.BasePanel {
    @property(cc.ScrollView)
    loginScrollView: cc.ScrollView = null;

    @property(cc.Node)
    loginContent: cc.Node = null;

    @property(cc.ScrollView)
    taskScrollView: cc.ScrollView = null;

    @property(cc.Node)
    taskContent: cc.Node = null;

    @property(cc.Prefab)
    slotItemPrefab: cc.Prefab = null;

    selectDay: number = null;
    cfg: Mission_7showCfg;
    onEnable() {
        let arg = this.args;
        this.selectDay = arg[0];
        this.cfg = ConfigManager.getItemByField(Mission_7showCfg, 'day', this.selectDay);
        this._updateLoginReward();
        this._updateTaskReward();
    }

    onDisable() {
        this.loginContent && this.loginContent.removeAllChildren();
        this.taskContent && this.taskContent.removeAllChildren();
    }

    _updateLoginReward() {
        this.loginContent.removeAllChildren();
        let rewards = this.cfg.reward1;
        rewards.forEach(reward => {
            let slot = cc.instantiate(this.slotItemPrefab);
            slot.parent = this.loginContent;
            let ctrl = slot.getComponent(UiSlotItem);
            if (BagUtils.getItemTypeById(reward[0]) == BagType.HERO) ctrl.isCanPreview = true;
            ctrl.updateItemInfo(reward[0], reward[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: reward[0],
                itemNum: reward[1],
                type: BagUtils.getItemTypeById(reward[0]),
                extInfo: null,
            }
        });
        this.loginContent.getComponent(cc.Layout).updateLayout();
        this.loginScrollView.scrollToTopLeft();
        if (rewards.length <= 4) this.loginScrollView.node.width = this.loginContent.width;
        else this.loginScrollView.node.width = 551;
    }

    _updateTaskReward() {
        this.taskContent.removeAllChildren();
        let rewards = this.cfg.reward2;
        rewards.forEach(reward => {
            let slot = cc.instantiate(this.slotItemPrefab);
            slot.parent = this.taskContent;
            let ctrl = slot.getComponent(UiSlotItem);
            if (BagUtils.getItemTypeById(reward[0]) == BagType.HERO) ctrl.isCanPreview = true;
            ctrl.updateItemInfo(reward[0], reward[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: reward[0],
                itemNum: reward[1],
                type: BagUtils.getItemTypeById(reward[0]),
                extInfo: null,
            }
        });
        this.taskContent.getComponent(cc.Layout).updateLayout();
        this.taskScrollView.scrollToTopLeft();
        if (rewards.length <= 4) {
            this.taskScrollView.node.width = rewards.length * 130;
            this.taskContent.width = rewards.length * 130;
            this.taskScrollView.node.height = this.taskContent.height;
        }
        else {
            this.taskScrollView.node.width = 551;
            this.taskContent.width = 551;
            this.taskScrollView.node.height = 241;
        }
    }
}

