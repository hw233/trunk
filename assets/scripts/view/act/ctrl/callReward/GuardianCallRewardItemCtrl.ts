import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianModel from '../../../role/model/GuardianModel';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activity_guardianCfg } from '../../../../a/config';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';

/** 
 * @Description: 守护者召唤有礼Item
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-07 15:23:20
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/prefab/callReward/GuardianCallRewardItemCtrl")
export default class GuardianCallRewardItemCtrl extends UiListItem {
    // @property(cc.Label)
    // targetNumLab: cc.Label = null;

    @property(cc.Label)
    needNumLb: cc.Label = null;

    @property(cc.Label)
    curNumLb: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    goBtn: cc.Node = null;

    @property(cc.Button)
    getBtn: cc.Button = null;
    @property(cc.Label)
    getBtnLb: cc.Label = null;

    @property(cc.Label)
    numTip: cc.Label = null;

    @property(cc.Node)
    ylqNode: cc.Node = null;

    info: { cfg: Activity_guardianCfg, state: number, curNum: number, haveNum: number };
    get model(): GuardianModel { return ModelManager.get(GuardianModel); }
    updateView() {
        this.info = this.data;
        // this.targetNumLab.string = `${this.cfg.number}`;
        this.needNumLb.string = `${this.info.cfg.number}`;
        this.curNumLb.string = `(${this.info.curNum}/${this.info.cfg.number})`
        this.numTip.string = StringUtils.format(gdk.i18n.t("i18n:GUARDIANCALL_TIP10"), this.info.haveNum)//`还剩余${this.info.haveNum}份`
        this.content.removeAllChildren();
        this.info.cfg.rewards.forEach(reward => {
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
                ctrl.itemInfo = itemInfo;
                // ctrl.onClick.on(() => {
                //     if ([160225, 160226, 160227, 160228, 160229, 160230, 160231].indexOf(reward[0]) == -1) {
                //         GlobalUtil.openItemTips(itemInfo, ctrl.noBtn, ctrl.isOther);
                //     }
                //     else {
                //         let id = ConfigManager.getItemByField(General_weaponCfg, 'item', reward[0]).artifactid;
                //         gdk.panel.setArgs(PanelId.GeneralWeaponTips, id);
                //         gdk.panel.open(PanelId.GeneralWeaponTips);
                //     }
                // })
            }
        });
        this.content.getComponent(cc.Layout).updateLayout();
        this.scrollView.scrollToTopLeft();
        this.scrollView.enabled = this.info.cfg.rewards.length > 4;
        this._updateState();
    }

    onGoBtnClick() {
        if (JumpUtils.openView(this.info.cfg.forward, true)) {
            if (gdk.panel.isOpenOrOpening(PanelId.GuardianActivityMainView)) {
                gdk.panel.hide(PanelId.GuardianActivityMainView);
            }
        }
    }

    onGetBtnClick() {

        let req = new icmsg.ActivityGuardianDrawAwardReq();
        req.awardId = this.info.cfg.reward_id;
        NetManager.send(req, (resp: icmsg.ActivityGuardianDrawAwardRsp) => {
            if (cc.isValid(this.node)) {
                this.getBtn.node.active = false;
                this.info.state = 3
                this.goBtn.active = false;
                this.ylqNode.active = true;
                this.info.haveNum -= 1;
                this.numTip.string = StringUtils.format(gdk.i18n.t("i18n:GUARDIANCALL_TIP10"), this.info.haveNum)
            }
            this.model.callRewardInfo.rewarded = resp.rewarded;
            GlobalUtil.openRewadrView(resp.list);
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        });
    }

    _updateState() {
        //state 0 前往 1不可领取(已领完) 2可领取 3已领取
        this.getBtn.node.active = this.info.state == 1 || this.info.state == 2;
        this.getBtn.interactable = this.info.state == 2;
        this.getBtnLb.string = gdk.i18n.t("i18n:GUARDIANCALL_TIP11")//'领取';
        GlobalUtil.setAllNodeGray(this.getBtn.node, 0)
        if (this.info.state == 1) {
            this.getBtnLb.string = gdk.i18n.t("i18n:GUARDIANCALL_TIP12")//'已领完';
            GlobalUtil.setAllNodeGray(this.getBtn.node, 1)
        }
        this.goBtn.active = this.info.state == 0;
        this.ylqNode.active = this.info.state == 3;
    }
}
