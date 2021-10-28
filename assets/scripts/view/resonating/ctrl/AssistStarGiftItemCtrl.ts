import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import ResonatingModel from '../model/ResonatingModel';
import SdkTool from '../../../sdk/SdkTool';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Store_star_giftCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-09 10:16:11 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/resonating/AssistStarGiftItemCtrl")
export default class AssistStarGiftItemCtrl extends UiListItem {
    @property(UiSlotItem)
    freeItem: UiSlotItem = null;

    @property(cc.Node)
    giftItemNode: cc.Node = null;

    @property(cc.Node)
    progressFlag: cc.Node = null;

    @property(cc.Node)
    targetStarNode: cc.Node = null;

    @property(cc.Node)
    received: cc.Node = null;

    @property(cc.Button)
    getBtn: cc.Button = null;

    @property([cc.LabelAtlas])
    labFonts: cc.LabelAtlas[] = [];

    get model(): ResonatingModel { return ModelManager.get(ResonatingModel); }

    cfg: Store_star_giftCfg;
    onEnable() {
        NetManager.on(icmsg.AssistAllianceGiftRsp.MsgType, this._onAssistAllianceGiftRsp, this);
        NetManager.on(icmsg.PaySuccRsp.MsgType, this._onPaySuccRsp, this);
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    updateView() {
        this.cfg = this.data;
        let b = this.model.allianceMaxStar >= this.cfg.star_total;
        let starLab = this.targetStarNode.getChildByName('num').getComponent(cc.Label);
        let font = this.labFonts[b ? 1 : 0];
        starLab.string = this.cfg.star_total + '';
        if (!starLab.font || starLab.font.name !== font.name) {
            starLab.font = font;
        }
        GlobalUtil.setSpriteIcon(this.node, this.targetStarNode.getChildByName('star'), `${b ? 'view/resonating/texture/xzlm_xing01' : 'view/resonating/texture/xzlm_xing02'}`);
        GlobalUtil.setSpriteIcon(this.node, this.progressFlag, `${b ? 'view/resonating/texture/xzlm_xingjidi01' : 'view/resonating/texture/xzlm_xingjidi02'}`);
        //免费物品
        this.freeItem.updateItemInfo(this.cfg.free_rewards[0][0], this.cfg.free_rewards[0][1]);
        this.freeItem.itemInfo = {
            series: 0,
            itemId: this.cfg.free_rewards[0][0],
            itemNum: this.cfg.free_rewards[0][1],
            type: BagUtils.getItemTypeById(this.cfg.free_rewards[0][0]),
            extInfo: null,
        }
        //通行证解锁物品
        let passPortItems = this.giftItemNode.children;
        passPortItems.forEach((item, idx) => {
            let reward = this.cfg.RMB_rewards[idx];
            if (reward) {
                item.active = true;
                let ctrl = item.getComponent(UiSlotItem);
                ctrl.updateItemInfo(reward[0], reward[1]);
                ctrl.itemInfo = {
                    series: 0,
                    itemId: reward[0],
                    itemNum: reward[1],
                    type: BagUtils.getItemTypeById(reward[0]),
                    extInfo: null,
                }
            }
            else {
                item.active = false;
            }
        });
        this.updateRewardState();
    }

    updateRewardState() {
        let info = this.model.giftRecords[this.cfg.id] || null;
        this.freeItem.node.getChildByName('mask').active = info && info.record >= 1;
        let recived = this.freeItem.node.getChildByName('sub_lingqu02');
        recived.active = info && info.record >= 1;
        let passPortItems = this.giftItemNode.children;
        passPortItems.forEach((item, idx) => {
            if (item.active) {
                let lock = item.getChildByName('lock');
                let recived = item.getChildByName('sub_lingqu02');
                let mask = item.getChildByName('mask');
                recived.active = info && info.record >= 2;
                if (!info || info.record < 1) {
                    lock.active = true;
                    mask.active = true;
                }
                else {
                    lock.active = false;
                    mask.active = info && info.record >= 2;;
                }
            }
        });

        let label = this.getBtn.node.getChildByName('label').getComponent(cc.Label);
        let limit = this.node.getChildByName('limit').getComponent(cc.Label);
        this.received.active = false;
        this.getBtn.node.active = true;
        this.getBtn.interactable = true;
        limit.node.active = false;
        label.string = gdk.i18n.t('i18n:SUPPORT_TIPS2');
        if (this.cfg.star_total > this.model.allianceMaxStar) {
            this.getBtn.interactable = false;
        }
        else {
            if (!info || info.record < 1) {
                this.getBtn.interactable = true;
            }
            else if (info && info.record == 1) {
                label.string = StringUtils.format(gdk.i18n.t('i18n:ACT_STORE_TIP1'), SdkTool.tool.getRealRMBCost(this.cfg.RMB_cost));
                limit.node.active = true;
            }
            else if (info && info.record >= 2) {
                this.received.active = true;
                this.getBtn.node.active = false;
            }
        }
    }

    onGetBtnClick() {
        let info = this.model.giftRecords[this.cfg.id] || null;
        if (!info || info.record < 1) {
            let req = new icmsg.AssistAllianceGiftReq();
            req.giftId = this.cfg.id;
            NetManager.send(req, (resp: icmsg.AssistAllianceGiftRsp) => {
                GlobalUtil.openRewadrView(resp.rewards);
            });
        }
        else {
            let req = new icmsg.PayOrderReq();
            req.paymentId = this.cfg.id;
            NetManager.send(req);
        }
    }

    _onAssistAllianceGiftRsp(resp: icmsg.AssistAllianceGiftRsp) {
        if (this.cfg && resp.giftId == this.cfg.id) {
            this.updateRewardState();
        }
    }

    _onPaySuccRsp(resp: icmsg.PaySuccRsp) {
        if (resp.paymentId == this.cfg.id) {
            this.model.giftRecords[this.cfg.id].record = 3;
            this.updateRewardState();
            GlobalUtil.openRewadrView(resp.list);
        }
    }
}
