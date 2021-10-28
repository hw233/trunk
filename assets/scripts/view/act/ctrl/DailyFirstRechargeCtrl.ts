import ActivityModel from '../model/ActivityModel';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Gift_daily_firstCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-21 16:53:21 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/DailyFirstRechargeCtrl")
export default class DailyFirstRechargeCtrl extends gdk.BasePanel {
    @property(cc.Label)
    rechargeNum: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    rechargeBtn: cc.Node = null;

    @property(cc.Node)
    getBtn: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    tips1: cc.Node = null;

    @property(cc.Node)
    tips2: cc.Node = null;

    get activityModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    curWorldAvgLv: number;
    curDailyPayMoney: number;
    cfg: Gift_daily_firstCfg;
    onEnable() {
        this.curWorldAvgLv = this.activityModel.worldAvgLv;
        this.curDailyPayMoney = this.activityModel.dailyPayMoney;
        this.cfg = ConfigManager.getItem(Gift_daily_firstCfg, (cfg: Gift_daily_firstCfg) => {
            if (cfg.world_level[0] <= this.curWorldAvgLv && cfg.world_level[1] >= this.curWorldAvgLv) {
                return true;
            }
        });
        this.node.setScale(.7);
        this.node.runAction(cc.sequence(
            cc.scaleTo(.2, 1.05, 1.05),
            cc.scaleTo(.15, 1, 1)
        ));
    }

    onDisable() {
        this.node.stopAllActions;
    }

    @gdk.binding('activityModel.dailyPayMoney')
    _updateView() {
        if (this.curDailyPayMoney !== this.activityModel.dailyPayMoney && this.activityModel.dailyPayMoney == 0) {
            this.close();
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_DAILY_TIP1"));
        }
        else {
            let leftNum = Math.max(0, this.cfg.RMB_cost - this.activityModel.dailyPayMoney) * 10;
            if (leftNum <= 0) {
                this.tips1.active = false;
                this.tips2.active = true;
            }
            else {
                this.tips1.active = true;
                this.tips2.active = false;
                this.rechargeNum.string = `${leftNum}`;
            }
            this.content.removeAllChildren();
            this.cfg.rewards.forEach(reward => {
                let slot = cc.instantiate(this.itemPrefab);
                slot.parent = this.content;
                let ctrl = slot.getComponent(UiSlotItem);
                ctrl.updateItemInfo(reward[0], reward[1]);
                ctrl.itemInfo = {
                    series: null,
                    itemId: reward[0],
                    itemNum: reward[1],
                    type: BagUtils.getItemTypeById(reward[0]),
                    extInfo: null
                };
            });
            let b = this.cfg.RMB_cost <= this.activityModel.dailyPayMoney;
            this.getBtn.active = b;
            this.rechargeBtn.active = !b;
        }
    }

    onGetBtnClick() {
        let req = new icmsg.PayDailyFirstRewardReq();
        NetManager.send(req, (resp: icmsg.PayDailyFirstRewardRsp) => {
            if (cc.isValid(this.node)) {
                this.close();
            }
            ModelManager.get(ActivityModel).dailyRechargeProto = true;
            ModelManager.get(ActivityModel).dailyRechargeRewarded = true;
            GlobalUtil.openRewadrView(resp.list);
        });
    }

    onRechargeBtnClick() {
        this.close();
        // JumpUtils.openStore([StoreMenuType.Diamond]);
        JumpUtils.openRechargeView([3]);
    }
}
