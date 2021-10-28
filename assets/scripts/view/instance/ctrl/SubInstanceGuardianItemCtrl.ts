import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import InstanceModel from '../model/InstanceModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Copy_stageCfg, GlobalCfg, VipCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-29 10:45:09 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubInstanceGuardianItemCtrl")
export default class SubInstanceGuardianItemCtrl extends UiListItem {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    listItem: cc.Prefab = null;

    @property(cc.Node)
    RaidBtn: cc.Node = null;

    @property(cc.Node)
    attackBtn: cc.Node = null;
    @property(cc.Node)
    lockNode: cc.Node = null;

    @property(cc.Node)
    tips: cc.Node = null;

    @property(cc.Label)
    stageNum: cc.Label = null;

    @property(cc.Node)
    redNode: cc.Node = null;

    @property(cc.Label)
    power: cc.Label = null;

    @property(cc.Node)
    mask: cc.Node = null;

    cfg: Copy_stageCfg;
    get model() { return ModelManager.get(InstanceModel); }
    get copyModel() { return ModelManager.get(CopyModel); }

    onDisable() {
        NetManager.targetOff(this);
    }

    updateView() {
        this.cfg = this.data;
        this._update();
    }

    _update() {
        this.stageNum.string = this.cfg.order + '';
        this.power.string = this.cfg.power + '';
        let maxStageId = this.copyModel.guardianMaxStageId || 0;
        let isPass = this.cfg.id <= maxStageId;
        this.mask.active = !isPass;
        let rewards = isPass ? this.cfg.sweep : this.cfg.first_reward;
        this.content.removeAllChildren();
        rewards.forEach(r => {
            let slot = cc.instantiate(this.listItem);
            slot.parent = this.content;
            let ctrl = slot.getChildByName("UiSlotItem").getComponent(UiSlotItem);
            let first = slot.getChildByName("first")
            first.active = !isPass;
            ctrl.updateItemInfo(r[0], r[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: r[0],
                itemNum: r[1],
                type: BagUtils.getItemTypeById(r[0]),
                extInfo: null
            }
        });
        this.attackBtn.active = this.cfg.pre_condition == maxStageId;;
        this.RaidBtn.active = isPass;
        this.lockNode.active = this.cfg.pre_condition > maxStageId;
        this.tips.active = !this.RaidBtn.active;
        if (this.tips.active) {
            this.tips.getComponent(cc.Label).string = this.attackBtn.active ? '挑战不消耗次数' : '通过前置关卡后开启';
        }
    }

    onChallengeBtnCick() {
        JumpUtils.openInstance(this.cfg.id);
    }

    onRaidBtnClick() {
        let gCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'guardian_free_sweep');
        let vipCfg = ConfigManager.getItemByField(VipCfg, 'level', ModelManager.get(RoleModel).vipLv);
        let maxRaidTimes = gCfg.value[0] + vipCfg.vip12 || 0;
        if (this.copyModel.guardianRaidNum >= maxRaidTimes) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP6"))//('已达到今日可扫荡次数上限');
        }
        else {
            let req = new icmsg.GuardianCopyRaidReq();
            req.all = false;
            NetManager.send(req, (resp: icmsg.GuardianCopyRaidRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                GlobalUtil.openRewadrView(resp.rewards);
            }, this);
        }
    }
}
