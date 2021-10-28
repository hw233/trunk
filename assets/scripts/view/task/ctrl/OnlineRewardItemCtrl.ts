import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import NetManager from '../../../common/managers/NetManager';
import OnlineRewardPanelCtrl from './OnlineRewardPanelCtrl';
import PanelId from '../../../configs/ids/PanelId';
import TaskUtil from '../util/TaskUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../common/models/BagModel';
import { HeroCfg, Mission_onlineCfg } from '../../../a/config';
import { ItemSubType } from '../../decompose/ctrl/DecomposeViewCtrl';

/**
 * @Description: 通关奖励任务奖励物品
 * @Author: yaozu.hu
 * @Date: 2019-10-09 17:39:12
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-15 13:47:33
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/OnlineRewardItemCtrl")
export default class OnlineRewardItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    over: cc.Node = null;

    @property(cc.Node)
    component: cc.Node = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.Node)
    blockMask: cc.Node = null;

    @property(cc.Node)
    pzgjinNode: cc.Node = null;
    @property(cc.Node)
    pzgziNode: cc.Node = null;
    @property(cc.Node)
    pzgtyNode: cc.Node = null;

    @property(cc.Animation)
    pzgjin: cc.Animation = null;
    @property(cc.Animation)
    pzgzi: cc.Animation = null;
    @property(cc.Animation)
    pzgty: cc.Animation = null;
    @property(sp.Skeleton)
    chipSpine: sp.Skeleton = null;

    time: number = 0;
    state: number = 0;
    cfg: Mission_onlineCfg;
    curCountRewardCfg: Mission_onlineCfg;
    isShowProgress: boolean = false;

    update(dt: number) {
        if (this.isShowProgress && this.cfg && this.curCountRewardCfg && this.cfg.id == this.curCountRewardCfg.id) {
            this.progressNode.active = true;
            let restTime = TaskUtil.getOnlineRewardTime();
            let progress = (this.cfg.time - restTime) / this.cfg.time;
            // this.progressNode.getChildByName('mask').width = progress * this.progressNode.width;
            let p = 1 - progress;
            if (p < 0 || p > 1 || !p) {
                p = 0;
            }
            this.progressNode.getChildByName('splash').getComponent(cc.Sprite).fillRange = p;
            // cc.tween(this.progressNode.getChildByName('mask'))
            //     .to(0.5, { width: progress * this.progressNode.width })
            //     .start();
        }
        else {
            this.progressNode.active = false;
        }
    }

    updateView() {
        this.pzgjinNode.active = false;
        this.pzgziNode.active = false;
        this.pzgtyNode.active = false;
        this.blockMask.active = false;
        this.chipSpine.node.active = false;
        // GlobalUtil.setAllNodeGray(this.node, 0)
        this.time = this.data.time;
        this.cfg = this.data.cfg;
        this.node.getChildByName('heroFlag').active = false;
        if (BagUtils.getItemTypeById(this.cfg.reward[0]) == BagType.HERO) {
            let cfg = ConfigManager.getItemById(HeroCfg, this.cfg.reward[0]);
            this.slot.group = cfg.group[0];
            this.slot.starNum = cfg.star_min;
        }
        else {
            this.slot.starNum = 0;
            this.slot.group = 0;
        }
        this.slot.updateItemInfo(this.cfg.reward[0], this.cfg.reward[1])
        this.state = TaskUtil.getOnlineRewardItemSstate(this.cfg.id, this.data.time)
        this.curCountRewardCfg = TaskUtil.getOnLineCountRewardCfg();
        if (this.state == 0) {
            this.over.active = false;
            this.component.active = false;
            this.isShowProgress = true;
        } else if (this.state == 1) {
            this.over.active = false;
            this.component.active = true;
            this.isShowProgress = false;
            this.showItemPz();
        } else {
            this.over.active = true;
            this.component.active = false;
            this.isShowProgress = false;
            // GlobalUtil.setAllNodeGray(this.node, 1)
            this.blockMask.active = true;
        }

        // 玩家首日领取完所有奖励后,显示第二天在线奖励的英雄礼包特效
        if (this.cfg.days == 2 && this.cfg.reward[0] == 160185) {
            if (TaskUtil.getCrateRoleDays() == 1) {
                this.showItemPz();
                this.node.getChildByName('heroFlag').active = true;
            }
        }
    }

    _itemClick() {
        if (this.cfg.days < TaskUtil.getCrateRoleDays() && this.state != 2) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:TASK_TIP2'));
            let panel = gdk.panel.get(PanelId.OnlineRewardPanel);
            if (panel) {
                let ctrl = panel.getComponent(OnlineRewardPanelCtrl);
                ctrl.close();
            }
            return;
        }

        if (this.state == 1) {
            let msg = new icmsg.MissionOnlineAwardReq();
            msg.id = this.cfg.id;
            msg.day = this.cfg.days;
            NetManager.send(msg);
        } else if (this.state == 0) {
            let type = BagUtils.getItemTypeById(this.cfg.reward[0])
            let item: BagItem = {
                series: this.cfg.reward[0],
                itemId: this.cfg.reward[0],
                itemNum: this.cfg.reward[1],
                type: type,
                extInfo: null,
            }
            GlobalUtil.openItemTips(item, true)
        }
    }
    //设置品质动画
    showItemPz() {
        //播放品质特效
        let itemConfig = <any>BagUtils.getConfigById(this.cfg.reward[0])
        if (itemConfig) {
            let subType = Math.floor(this.cfg.reward[0] / 10000);
            if (itemConfig.use_type != 6 && subType != ItemSubType.HEROCHIP) {
                if (itemConfig.color == 3) {
                    this.pzgziNode.active = true;
                    this.pzgzi.play();
                } else if (itemConfig.color == 4) {
                    this.pzgjinNode.active = true;
                    this.pzgjin.play();
                } else {
                    this.pzgtyNode.active = true;
                    this.pzgty.play();
                }
            } else {
                if (itemConfig.color == 3) {
                    this.chipSpine.node.active = true;
                    this.chipSpine.setAnimation(0, "stand2", true)
                } else if (itemConfig.color == 4) {
                    this.chipSpine.node.active = true;
                    this.chipSpine.setAnimation(0, "stand", true)
                }
            }

        }
    }

}
