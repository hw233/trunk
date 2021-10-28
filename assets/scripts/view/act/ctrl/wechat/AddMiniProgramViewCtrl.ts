import ActivityUtils from '../../../../common/utils/ActivityUtils';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { General_weaponCfg, Platform_activityCfg } from '../../../../a/config';

/** 
 * 小游戏添加到小程序
 * @Author: sthoo.huang  
 * @Date: 2021-06-30 10:36:20 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-06 11:10:58
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wechat/AddMiniProgramViewCtrl")
export default class AddMiniProgramViewCtrl extends gdk.BasePanel {

    @property(cc.Sprite)
    image: cc.Sprite = null;
    @property(cc.Node)
    leftArrow: cc.Node = null;
    @property(cc.Node)
    rightArrow: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Button)
    getBtn: cc.Button = null;
    @property(cc.Label)
    getBtnLabel: cc.Label = null;

    current: number = 1;
    cfg: Platform_activityCfg;

    onEnable() {
        this.current = 1;
        this.content.removeAllChildren();
        this.cfg = ActivityUtils.getPlatformConfig(3);
        if (!this.cfg) {
            // 不存在此任务
            this.close();
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
        // 领取按钮
        let status = ActivityUtils.getPlatformTaskStatue(this.cfg);
        switch (status) {
            case 1:
                // 奖励已经领取
                this.close();
                break;

            case 2:
                // 已经完成，但没有领取奖励
                this.getBtn.interactable = true;
                this.getBtnLabel.string = '领取';
                break;

            default:
                // 默认，没有完成，并且没有领取奖励
                this.getBtn.interactable = false;
                this.getBtnLabel.string = '未达成';
                gdk.Timer.loop(2000, this, this.onArrowClcik);
                break;
        }
    }

    onDisable() {
        this.current = 1;
        this.content.removeAllChildren();
        gdk.Timer.clearAll(this);
        NetManager.targetOff(this);
    }

    @gdk.binding('current')
    _setCurrent(v: number) {
        this.leftArrow.active = v > 1;
        this.rightArrow.active = v < 4;
        GlobalUtil.setSpriteIcon(this.node, this.image, `view/act/texture/bg/wechat/gzyl_pic${this.current}`);
        if (v >= 4 && !this.getBtn.interactable) {
            gdk.Timer.clearAll(this);
            let req = new icmsg.PlatformMissionTriggerReq();
            req.missionType = this.cfg.type;
            NetManager.send(req, () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this.getBtn.interactable = true;
                this.getBtnLabel.string = '领取';
            }, this);
        }
    }

    onArrowClcik(e, data) {
        (data === void 0) && (data = 'right');
        if (data == 'left') {
            this.current = Math.max(1, this.current - 1);
        } else if (data == 'right') {
            this.current = Math.min(4, this.current + 1);
        }
    }

    onGetRewardClick() {
        let req = new icmsg.PlatformMissionRewardReq();
        req.missionId = this.cfg.id;
        NetManager.send(req, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.close();
        }, this);
        this.getBtn.interactable = false;
    }
}
