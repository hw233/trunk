import ActivityUtils from '../../../../common/utils/ActivityUtils';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { General_weaponCfg, Platform_activityCfg } from '../../../../a/config';

/** 
 * 关注有礼
 * @Author: sthoo.huang  
 * @Date: 2021-06-30 10:36:20 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-06 11:11:20
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wechat/FollowGroupViewCtrl")
export default class FollowGroupViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    cfg: Platform_activityCfg;

    onEnable() {
        this.content.removeAllChildren();
        this.cfg = ActivityUtils.getPlatformConfig(1);
        if (!this.cfg) {
            return;
        }
        // 奖励列表
        let rewards = this.cfg.reward;
        rewards.forEach(reward => {
            if (reward && reward.length >= 2) {
                let slot = cc.instantiate(this.slotPrefab);
                slot.parent = this.content;
                let ctrl = slot.getComponent(UiSlotItem);
                ctrl.updateItemInfo(reward[0], reward[1]);
                let itemInfo = {
                    series: null,
                    itemId: reward[0],
                    itemNum: reward[1],
                    type: BagUtils.getItemTypeById(reward[0]),
                    extInfo: null,
                };
                ctrl.onClick.on(() => {
                    if ([160225, 160226, 160227, 160228, 160229, 160230, 160231].indexOf(reward[0]) == -1) {
                        GlobalUtil.openItemTips(itemInfo, ctrl.noBtn, ctrl.isOther);
                    }
                    else {
                        let id = ConfigManager.getItemByField(General_weaponCfg, 'item', reward[0]).artifactid;
                        gdk.panel.setArgs(PanelId.GeneralWeaponTips, id);
                        gdk.panel.open(PanelId.GeneralWeaponTips);
                    }
                })
            }
        });
        this.content.getComponent(cc.Layout).updateLayout();
        // gdk.Timer.once(3000, this, this._onComplete);
    }

    onDisable() {
        gdk.Timer.clearAll(this);
    }

    // // 完成任务
    // _onComplete() {
    //     let model = ModelManager.get(ActivityModel);
    //     model.platformTask.some(t => {
    //         if (t.missionId == this.cfg.id) {
    //             if (!t.rewarded && t.number == 0) {
    //                 // 没有完成，并且没有领取奖励
    //                 let req = new icmsg.PlatformMissionTriggerReq();
    //                 req.missionType = this.cfg.type;
    //                 NetManager.send(req);
    //             }
    //             return true;
    //         }
    //         return false;
    //     });
    // }
}
