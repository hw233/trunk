import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activity_star_giftsCfg, General_weaponCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { subActType } from '../wonderfulActivity/SubActivityViewCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-28 13:35:40 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/starGifts/StarGiftItemCtrl")
export default class StarGiftItemCtrl extends UiListItem {
    // @property(cc.Label)
    // targetNumLab: cc.Label = null;

    @property(cc.Label)
    targetStarLab: cc.Label = null;

    @property(cc.Label)
    progressLab: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    goBtn: cc.Node = null;

    @property(cc.Node)
    getBtn: cc.Node = null;

    @property(cc.Label)
    unLockTip: cc.Label = null;

    @property(cc.Node)
    receivedBtn: cc.Node = null;

    cfg: Activity_star_giftsCfg;
    updateView() {
        this.cfg = this.data;
        // this.targetNumLab.string = `${this.cfg.number}`;
        this.targetStarLab.string = `${this.cfg.args}`;
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
        this.scrollView.enabled = this.cfg.rewards.length > 4;
        this._updateState();
    }

    onGoBtnClick() {
        if (this.cfg.rounds > ModelManager.get(ActivityModel).excitingAcrOfStarGiftRounds) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_STAR_TIP1"));
            return;
        }
        if (JumpUtils.openView(this.cfg.forward, true)) {
            if (gdk.panel.isOpenOrOpening(PanelId.ActivityMainView)) {
                gdk.panel.hide(PanelId.ActivityMainView);
            }
        }
    }

    onGetBtnClick() {
        if (!JumpUtils.ifSysOpen(2842)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }

        let req = new icmsg.ExcitingActivityRewardsReq();
        req.type = subActType.starGift;
        req.taskId = this.cfg.taskid;
        NetManager.send(req, (resp: icmsg.ExcitingActivityRewardsRsp) => {
            if (cc.isValid(this.node)) {
                this.getBtn.active = false;
                this.goBtn.active = false;
                this.progressLab.node.active = false;
                this.unLockTip.node.active = false;
                this.receivedBtn.active = true;
            }
            GlobalUtil.openRewadrView(resp.rewards);
        });
    }

    _updateState() {
        let model = ModelManager.get(ActivityModel);
        let curRounds = model.excitingAcrOfStarGiftRounds;
        let info = model.excitingActInfo[subActType.starGift] || {};
        let rounds = this.cfg['rounds'] || 0;
        let args = this.cfg.args || 0;
        let num;

        if (info[rounds]
            && info[rounds][this.cfg.target]
            && info[rounds][this.cfg.target][args]) {
            num = info[rounds][this.cfg.target][args];
        }
        else {
            num = 0;
        }

        this.getBtn.active = false;
        this.goBtn.active = false;
        this.receivedBtn.active = false;
        this.progressLab.node.active = false;
        this.unLockTip.node.active = false;
        // this.goBtn.getComponent(cc.Button).interactable = true;
        GlobalUtil.setAllNodeGray(this.goBtn, 0);
        if (this.cfg.rounds > curRounds) {
            //未解锁
            this.goBtn.active = true;
            GlobalUtil.setAllNodeGray(this.goBtn, 1);
            // this.goBtn.getComponent(cc.Button).interactable = false;
            this.unLockTip.node.active = true;
            this.unLockTip.string = gdk.i18n.t("i18n:ACT_STAR_TIP1");
        }
        else {
            //解锁
            let state = ActivityUtils.getExcitingActTaskState(this.cfg.taskid); //0-未完成 1-可领奖 2-已领奖
            if (state == 0) {
                this.progressLab.node.active = true;
                this.progressLab.string = `(${Math.min(this.cfg.number, num)}/${this.cfg.number})`;
                this.goBtn.active = true;
            }
            else if (state == 1) {
                this.progressLab.node.active = true;
                this.progressLab.string = `(${Math.min(this.cfg.number, num)}/${this.cfg.number})`;
                this.getBtn.active = true;
            }
            else {
                this.receivedBtn.active = true;
            }
        }
    }
}
