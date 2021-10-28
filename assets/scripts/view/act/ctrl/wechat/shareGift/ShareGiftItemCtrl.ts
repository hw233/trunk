import ActivityModel from '../../../model/ActivityModel';
import ActivityUtils from '../../../../../common/utils/ActivityUtils';
import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { General_weaponCfg, Platform_activityCfg } from '../../../../../a/config';

/** 
 * 小程序邀请好友列表项
 * @Author: sthoo.huang  
 * @Date: 2021-07-13 14:33:13
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-14 12:06:18
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wechat/ShareGift/ShareGiftItemCtrl")
export default class StarGiftItemCtrl extends UiListItem {

    @property(cc.Label)
    targetLabel: cc.Label = null;
    @property(cc.Label)
    progressLabel: cc.Label = null;

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
        this.targetLabel.string = `累计邀请${this.cfg.args}位好友可领取`;
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
        this.scrollView.enabled = this.cfg.reward.length > 3;
        this._updateState();
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

    _updateState() {
        let status = ActivityUtils.getPlatformTaskStatue(this.cfg);
        switch (status) {
            case 1:
                // 奖励已经领取
                this.mask.active = true;
                this.progressLabel.node.active = false;
                this.progressLabel.string = ``;
                this.getBtn.active = false;
                break;

            case 2:
                // 已经完成，但没有领取奖励
                this.mask.active = false;
                this.progressLabel.node.active = true;
                this.getBtn.active = true;
                this.getBtn.getComponent(cc.Button).interactable = true;
                break;

            default:
                // 默认，没有完成，并且没有领取奖励
                this.mask.active = false;
                this.progressLabel.node.active = true;
                this.getBtn.active = true;
                this.getBtn.getComponent(cc.Button).interactable = false;
                break;
        }
        if (this.progressLabel.node.active) {
            let model = ModelManager.get(ActivityModel);
            let exist = model.platformTask.some(t => {
                if (t.missionId == this.cfg.id) {
                    this.progressLabel.string = `${t.number}/${this.cfg.args}`;
                    return true;
                }
                return false;
            });
            if (!exist) {
                this.progressLabel.string = `0/${this.cfg.args}`;
            }
        }
    }
}
