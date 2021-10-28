import ActivityUtils from '../../../../../common/utils/ActivityUtils';
import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import VipFlagCtrl from '../../../../../common/widgets/VipFlagCtrl';
import { General_weaponCfg, Platform_activityCfg } from '../../../../../a/config';

/** 
 * 小程序成长豪礼列表项
 * @Author: sthoo.huang  
 * @Date: 2021-07-13 14:33:13
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-31 16:35:41
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wechat/GrowGift/GrowGiftItemCtrl")
export default class GrowGiftItemCtrl extends UiListItem {

    @property(cc.Label)
    titleLb: cc.Label = null;
    @property(cc.Node)
    getBtn: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.Node)
    headFrame: cc.Node = null;
    @property(cc.Node)
    headImg: cc.Node = null;
    @property(cc.Node)
    titleIcon: cc.Node = null;
    @property(cc.Label)
    playerName: cc.Label = null;
    @property(cc.Label)
    power: cc.Label = null;
    @property(cc.Label)
    lv: cc.Label = null;
    @property(cc.Node)
    vipFlag: cc.Node = null;

    @property(cc.Node)
    emptyFlag: cc.Node = null;
    @property(cc.Node)
    mask: cc.Node = null;

    cfg: Platform_activityCfg;
    updateView() {
        this.cfg = this.data;
        this.titleLb.string = `第${this.curIndex + 1}位好友`;
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
                this.getBtn.active = false;
                this.getBtn.getComponent(cc.Button).interactable = false;
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
        this.player.active = false;
        this.emptyFlag.active = true;
        // 更新玩家信息
        if (status != 0) {
            let req = new icmsg.PlatformFriendGiftListReq();
            req.level = Math.floor(this.cfg.args / 100);
            NetManager.send(req, (rsp: icmsg.PlatformFriendGiftListRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                let brief = rsp.list[this.curIndex];
                if (brief) {
                    this.player.active = true;
                    this.emptyFlag.active = false;
                    this.lv.string = "." + brief.level;
                    this.playerName.string = brief.name;
                    this.power.string = "" + brief.power;
                    this.vipFlag.getComponent(VipFlagCtrl).updateVipLv(GlobalUtil.getVipLv(brief.vipExp));
                    GlobalUtil.setSpriteIcon(this.node, this.headImg, GlobalUtil.getHeadIconById(brief.head));
                    GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(brief.headFrame));
                    GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(brief.title));
                    return;
                }
                this.player.active = false;
                this.emptyFlag.active = true;
            });
        }
    }
}
