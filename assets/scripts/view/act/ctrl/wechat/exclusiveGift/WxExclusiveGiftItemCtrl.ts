import ActivityUtils from '../../../../../common/utils/ActivityUtils';
import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import SdkTool from '../../../../../sdk/SdkTool';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { General_weaponCfg, Platform_activityCfg } from '../../../../../a/config';
/** 
 * 小程序专属礼包列表项
 * @Author: sthoo.huang  
 * @Date: 2021-06-30 10:36:20 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-03 17:31:14
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wechat/exclusiveGift/WxExclusiveGiftItemCtrl")
export default class WxExclusiveGiftItemCtrl extends UiListItem {
    @property(cc.Label)
    targetLabel: cc.Label = null;

    @property(cc.Node)
    getBtn: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    mask: cc.Node = null;

    cfg: Platform_activityCfg;
    updateView() {
        this.cfg = this.data;
        let money = SdkTool.tool.getRealRMBCost(this.cfg.args);
        if (money > 0) {
            this.targetLabel.string = `单笔充值${money}元可领取`;
        } else {
            this.targetLabel.string = `每日福利`;
        }
        this.content.removeAllChildren();
        this.cfg.reward.forEach(reward => {
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
        this.scrollView.scrollToTopLeft();
        this.scrollView.enabled = this.cfg.reward.length > 5;
        this._updateState();
    }

    _updateState() {
        let status = ActivityUtils.getPlatformTaskStatue(this.cfg);
        switch (status) {
            case 1:
                // 奖励已经领取
                this.mask.active = true;
                this.getBtn.active = false;
                break;

            case 2:
                // 已经完成，但没有领取奖励
                this.mask.active = false;
                this.getBtn.active = true;
                this.getBtn.getComponent(cc.Button).interactable = true;
                break;

            default:
                // 默认，没有完成，并且没有领取奖励
                this.mask.active = false;
                this.getBtn.active = true;
                this.getBtn.getComponent(cc.Button).interactable = false;
                break;
        }
    }

    onGetBtnClick() {
        let req = new icmsg.PlatformMissionRewardReq();
        req.missionId = this.cfg.id;
        NetManager.send(req, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateState();
        }, this);
        this.getBtn.getComponent(cc.Button).interactable = false;
    }
}
