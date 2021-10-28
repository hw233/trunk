import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import SdkTool from '../../../sdk/SdkTool';
import SignModel from '../model/SignModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { AskInfoType } from '../../../common/widgets/AskPanel';
import { SignCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/sign/SignItemCtrl")
export default class SignItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    mask: cc.Node = null

    @property(cc.Node)
    gouNode: cc.Node = null

    @property(cc.Node)
    againNode: cc.Node = null

    @property(cc.Node)
    bg1: cc.Node = null
    @property(cc.Node)
    bg2: cc.Node = null

    @property(cc.Node)
    redpoint: cc.Node = null

    @property(cc.Label)
    dayLabel: cc.Label = null

    data: SignCfg;

    get model(): SignModel { return ModelManager.get(SignModel); }

    updateView() {
        let itemId = this.data.item_id;
        this.slot.starNum = 0
        this.slot.updateItemInfo(itemId, this.data.number)
        this.slot.itemInfo = {
            series: itemId,
            itemId: itemId,
            type: BagUtils.getItemTypeById(itemId),
            itemNum: this.data.number,
            extInfo: null,
        }
        let model = this.model;
        let signed = model.signed
        let count = model.count
        let idx = this.data.id
        this.dayLabel.string = StringUtils.format(gdk.i18n.t("i18n:FUNDS_TIP4"), idx)//`第${idx}天`
        let isNextToday = false;
        if (signed) {
            if (idx == count + 1) {
                isNextToday = true;
            }
        } else {
            if (idx == count + 2) {
                isNextToday = true;
            }
        }
        this.bg1.active = !isNextToday;
        this.bg2.active = isNextToday;
        this.dayLabel.node.color = isNextToday ? cc.color("#ffffff") : cc.color("#FFF3A9")
        this.mask.active = idx <= count;
        this.gouNode.active = idx <= count;

        this.redpoint.active = false
        this.againNode.active = false
        if (this.gouNode.active && idx == count && SdkTool.tool.can_charge) {
            if (this.model.signPay) {
                this.gouNode.active = true
                this.againNode.active = false
            } else {
                this.gouNode.active = false
                this.againNode.active = true
                if (this.model.signPayAvailable) {
                    this.redpoint.active = true
                }
            }
        }
    }

    againRewardFunc() {
        if (this.model.signPayAvailable) {
            let msg = new icmsg.SignPayReq()
            NetManager.send(msg, (data: icmsg.SignPayRsp) => {
                GlobalUtil.openRewadrView(data.list)
                let msg = new icmsg.SignInfoReq()
                NetManager.send(msg)
            })
        } else if (SdkTool.tool.can_charge) {
            let askInfo: AskInfoType = {
                title: "",
                descText: gdk.i18n.t("i18n:STORE_TIP34"),//`当前充值<color=00ff00>任意金额</c>可<color=00ff00>额外</c>获得一次奖励\n(单笔一元以上)`,
                sureText: gdk.i18n.t("i18n:OK"),
                closeText: gdk.i18n.t("i18n:CANCEL"),
                sureCb: () => {
                    gdk.panel.hide(PanelId.Sign)
                    gdk.panel.hide(PanelId.MainSet)
                    JumpUtils.openRechargeView([3])
                }
            }
            GlobalUtil.openAskPanel(askInfo)
        }
    }
}
