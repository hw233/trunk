import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import SdkTool from '../../../../sdk/SdkTool';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activity_newtopupCfg, General_weaponCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-04 11:45:51 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/newLcdl/NewLcdlItemCtrl")
export default class NewLcdlItemCtrl extends UiListItem {
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

    cfg: Activity_newtopupCfg;
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
        this.scrollView.enabled = this.cfg.rewards.length > 5;
        this._updateState();
    }

    _updateState() {
        let model = ModelManager.get(ActivityModel);
        if (model.newTopUpRecharge >= this.cfg.money) {
            if (ActivityUtils.getNewLcdlRewardState(this.cfg.index)) {
                this.mask.active = true;
                this.progressLabel.node.active = false;
                this.getBtn.active = false;
            }
            else {
                this.mask.active = false;
                this.progressLabel.node.active = true;
                this.getBtn.active = true;
                this.getBtn.getComponent(cc.Button).interactable = true;
                this.progressLabel.string = `(${SdkTool.tool.getRealRMBCost(model.newTopUpRecharge)}/${SdkTool.tool.getRealRMBCost(this.cfg.money)})`;
            }
        }
        else {
            this.mask.active = false;
            this.progressLabel.node.active = true;
            this.getBtn.active = true;
            this.getBtn.getComponent(cc.Button).interactable = false;
            this.progressLabel.string = `(${SdkTool.tool.getRealRMBCost(model.newTopUpRecharge)}/${SdkTool.tool.getRealRMBCost(this.cfg.money)})`;
        }
    }

    onGetBtnClick() {
        if (!ActUtil.ifActOpen(72)) {
            // gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1"));
            gdk.panel.hide(PanelId.NewLcdlView);
            return;
        }
        else {
            let req = new icmsg.ActivityNewTopUpAwardReq();
            req.paySum = this.cfg.money;
            NetManager.send(req, (resp: icmsg.ActivityNewTopUpAwardRsp) => {
                if (cc.isValid(this.node)) {
                    this.mask.active = true;
                    this.progressLabel.node.active = false;
                    this.getBtn.active = false;
                    GlobalUtil.openRewadrView(resp.list);
                }
            });
        }
    }
}
