
import { Sailing_topupCfg } from "../../../../a/config";
import ModelManager from "../../../../common/managers/ModelManager";
import NetManager from "../../../../common/managers/NetManager";
import ActivityUtils from "../../../../common/utils/ActivityUtils";
import BagUtils from "../../../../common/utils/BagUtils";
import GlobalUtil from "../../../../common/utils/GlobalUtil";
import StringUtils from "../../../../common/utils/StringUtils";
import UiListItem from "../../../../common/widgets/UiListItem";
import UiSlotItem from "../../../../common/widgets/UiSlotItem";
import PanelId from "../../../../configs/ids/PanelId";
import SdkTool from "../../../../sdk/SdkTool";
import SailingModel from "../../model/SailingModel";
import ActUtil from "../../util/ActUtil";


/**
 * @Description: 跨服活动列表
 * @Author: yaozu.hu
 * @Date: 2021-01-22 17:19:33
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-19 10:51:07
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/sailing/SailingItemCtrl")
export default class SailingItemCtrl extends UiListItem {
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

    cfg: Sailing_topupCfg;
    get sModel() { return ModelManager.get(SailingModel); }
    updateView() {
        this.cfg = this.data;
        this.targetLabel.string = StringUtils.format(gdk.i18n.t('i18n:ACT_STORE_TIP1'), SdkTool.tool.getRealRMBCost(this.cfg.money));
        this.content.removeAllChildren();
        this.cfg.rewards.forEach(reward => {
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
                    GlobalUtil.openItemTips(itemInfo, ctrl.noBtn, ctrl.isOther);
                    // if ([160225, 160226, 160227, 160228, 160229, 160230, 160231].indexOf(reward[0]) == -1) {
                    //     GlobalUtil.openItemTips(itemInfo, ctrl.noBtn, ctrl.isOther);
                    // }
                    // else {
                    //     let id = ConfigManager.getItemByField(General_weaponCfg, 'item', reward[0]).artifactid;
                    //     gdk.panel.setArgs(PanelId.GeneralWeaponTips, id);
                    //     gdk.panel.open(PanelId.GeneralWeaponTips);
                    // }
                })
            }
        });
        this.content.getComponent(cc.Layout).updateLayout();
        this.scrollView.scrollToTopLeft();
        this.scrollView.enabled = this.cfg.rewards.length > 5;
        this._updateState();
    }

    _updateState() {

        let monthlyRecharge = this.sModel.sailingInfo.money
        if (monthlyRecharge >= this.cfg.money) {
            if (ActivityUtils.getSailingRewardState(this.cfg.index - (this.cfg.type - 1) * 8 - 1)) {
                this.mask.active = true;
                this.progressLabel.node.active = false;
                this.getBtn.active = false;
            }
            else {
                this.mask.active = false;
                this.progressLabel.node.active = true;
                this.getBtn.active = true;
                this.getBtn.getComponent(cc.Button).interactable = true;
                this.progressLabel.string = `(${SdkTool.tool.getRealRMBCost(monthlyRecharge)}/${SdkTool.tool.getRealRMBCost(this.cfg.money)})`;
            }
        }
        else {
            this.mask.active = false;
            this.progressLabel.node.active = true;
            this.getBtn.active = true;
            this.getBtn.getComponent(cc.Button).interactable = false;
            this.progressLabel.string = `(${SdkTool.tool.getRealRMBCost(monthlyRecharge)}/${SdkTool.tool.getRealRMBCost(this.cfg.money)})`;
        }
    }

    onGetBtnClick() {
        if (!ActUtil.ifActOpen(123)) {
            // gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1"));
            gdk.panel.hide(PanelId.LcdlView);
            return;
        }
        else {
            let req = new icmsg.ActivitySailingChargeReq();
            req.money = this.cfg.money;
            NetManager.send(req, (resp: icmsg.ActivitySailingChargeRsp) => {
                if (cc.isValid(this.node)) {
                    this.mask.active = true;
                    this.progressLabel.node.active = false;
                    this.getBtn.active = false;
                    this.sModel.sailingInfo.chargeRewarded = resp.chargeRewarded;
                    GlobalUtil.openRewadrView(resp.goodsList);
                }
            });
        }
    }
}
