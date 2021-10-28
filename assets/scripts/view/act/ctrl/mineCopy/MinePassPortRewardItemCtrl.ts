import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MineModel from '../../model/MineModel';
import MineUtil from '../../util/MineUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activitycave_privilegeCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';

/**
 * 矿洞大作战通行证Item
 * @Author: yaozu.hu
 * @Date: 2020-08-10 11:02:45
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:35:22
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MinePassPortRewardItemCtrl")
export default class MinePassPortRewardItemCtrl extends UiListItem {

    @property(UiSlotItem)
    freeItem: UiSlotItem = null;

    @property(UiSlotItem)
    passPortItem1: UiSlotItem = null;

    @property(UiSlotItem)
    passPortItem2: UiSlotItem = null;

    @property(cc.Node)
    progressFlag: cc.Node = null;

    @property(cc.Label)
    targetExpNum: cc.Label = null;

    @property(cc.Node)
    received: cc.Node = null;

    @property(cc.Button)
    getBtn: cc.Button = null;

    cfg: Activitycave_privilegeCfg;

    model: MineModel
    onEnable() {
        //gdk.e.on(ActivityEventId.ACTIVITY_MINE_PASS_REWARD, this._onPassAwardRsp, this);
        this.model = ModelManager.get(MineModel)
    }

    onDisable() {
        //gdk.e.targetOff(this);
    }

    updateView() {
        this.cfg = this.data;
        this.targetExpNum.string = this.cfg.exp[1] + '';

        GlobalUtil.setSpriteIcon(this.node, this.progressFlag, `${ModelManager.get(RoleModel).acpe >= this.cfg.exp[1] ? 'view/act/texture/kffl/hdck_jingdutiao04' : 'view/store/textrue/passPort/txz_jingdutiao00'}`);
        //免费物品
        this.freeItem.updateItemInfo(this.cfg.reward1[0][0], this.cfg.reward1[0][1]);
        this.freeItem.itemInfo = {
            series: 0,
            itemId: this.cfg.reward1[0][0],
            itemNum: this.cfg.reward1[0][1],
            type: BagUtils.getItemTypeById(this.cfg.reward1[0][0]),
            extInfo: null,
        }
        //通行证解锁物品
        let passPortItems = [this.passPortItem1, this.passPortItem2];
        passPortItems.forEach((item, idx) => {
            let reward = this.cfg.reward2[idx];
            if (reward) {
                item.node.active = true;
                item.updateItemInfo(reward[0], reward[1]);
                item.itemInfo = {
                    series: 0,
                    itemId: reward[0],
                    itemNum: reward[1],
                    type: BagUtils.getItemTypeById(reward[0]),
                    extInfo: null,
                }
            }
            else {
                item.node.active = false;
            }
        });

        this.updateRewardState();
    }

    updateRewardState() {
        let recevie1 = MineUtil.getMinePassRewardState(1, this.cfg.id);
        let recevie2 = MineUtil.getMinePassRewardState(2, this.cfg.id);
        this.freeItem.node.getChildByName('mask').active = recevie1;
        let recived = this.freeItem.node.getChildByName('sub_lingqu02');
        recived.active = recevie1;
        let passPortItems = [this.passPortItem1, this.passPortItem2];
        passPortItems.forEach((item, idx) => {
            if (item.node.active) {
                let lock = item.node.getChildByName('lock');
                let recived = item.node.getChildByName('sub_lingqu02');
                let mask = item.node.getChildByName('mask');
                recived.active = recevie2;
                if (!this.model.passBoight) {
                    lock.active = true;
                    mask.active = true;
                }
                else {
                    lock.active = false;
                    mask.active = recevie2;
                }
            }
        });

        let label = this.getBtn.node.getChildByName('label').getComponent(cc.Label);
        this.getBtn.node.active = true;
        let pass = BagUtils.getItemNumById(this.cfg.exp[0]);
        if (pass < this.cfg.exp[1]) {
            this.received.active = false;
            this.getBtn.interactable = false;
            label.string = gdk.i18n.t("i18n:MINECOPY_PASSPORT_TIP4");
        }
        else {
            this.received.active = false;
            this.getBtn.interactable = true;
            if (!recevie1) {
                label.string = gdk.i18n.t("i18n:MINECOPY_PASSPORT_TIP4");
                return;
            }
            if (!recevie2) {
                label.string = gdk.i18n.t("i18n:MINECOPY_PASSPORT_TIP5");
            }
            else {
                this.received.active = true;
                this.getBtn.node.active = false;
            }
        }
    }

    onGetBtnClick() {
        let recevie1 = MineUtil.getMinePassRewardState(1, this.cfg.id);
        if (recevie1 && !this.model.passBoight) {
            //TODO
            gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_PASSPORT_TIP6"));
        }
        else {
            let req = new icmsg.ActivityCavePassAwardReq();
            req.id = this.cfg.id;
            NetManager.send(req, (resp: icmsg.ActivityCavePassAwardRsp) => {
                GlobalUtil.openRewadrView(resp.list);
                this.model.passReward1 = resp.rewarded1;
                this.model.passReward2 = resp.rewarded2;
                gdk.e.emit(ActivityEventId.ACTIVITY_MINE_PASS_REWARD);
                this.updateRewardState();
            });
        }
    }

    // _onPassAwardRsp(resp: ActivityCavePassAwardRsp) {

    //     this.updateRewardState();
    // }
}
