import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import StoreModel from '../../model/StoreModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TaskModel from '../../../task/model/TaskModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Store_monthcardCfg } from '../../../../a/config';

/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-21 14:00:09
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/recharge/RechargeTQItemCtrl")
export default class RechargeTQItemCtrl extends UiListItem {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    titleIcon: cc.Node = null;

    @property(cc.Node)
    boxIcon: cc.Node = null;

    @property(cc.RichText)
    descLab: cc.RichText = null;

    @property(cc.Node)
    sellout: cc.Node = null;

    @property(cc.Node)
    btnBuy: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    rewardItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    diamond: cc.Node = null;

    @property(cc.Label)
    costLab: cc.Label = null;

    @property(cc.Node)
    typeIcon: cc.Node = null;

    @property(cc.Node)
    guideSpine: cc.Node = null;

    _info: Store_monthcardCfg

    _arrIndex = [500003, 500006, 500004, 500005]

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }
    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    updateView() {
        this._info = this.data
        if (this.taskModel.tavernGuideId && this.taskModel.tavernGuideId == this._info.id) {
            this.guideSpine.active = true;
        }
        else {
            this.guideSpine.active = false;
        }

        let bgPath = `view/store/textrue/recharge/tq/tqsd_xinxidiban0${this._getIconTarget()}`
        GlobalUtil.setSpriteIcon(this.node, this.bg, bgPath)

        let boxPath = `view/store/textrue/recharge/tq/tqsd_baoshang0${this._getIconTarget()}`
        GlobalUtil.setSpriteIcon(this.node, this.boxIcon, boxPath)

        let titlePath = `view/store/textrue/recharge/tq/tqsd_biaoti0${this._arrIndex.indexOf(this._info.id) + 1}`
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, titlePath)

        if (this._getTypeTarget() == 0) {
            this.typeIcon.active = false
        } else {
            this.typeIcon.active = true
            let typePath = `view/store/textrue/recharge/tq/tqsd_shuqian0${this._getTypeTarget()}`
            GlobalUtil.setSpriteIcon(this.node, this.typeIcon, typePath)
        }

        this.descLab.string = `${this._info.desc}`

        this.diamond.active = false
        if (this._info.diamond_cost && this._info.diamond_cost > 0) {
            this.diamond.active = true
            this.costLab.string = `${this._info.diamond_cost}`
        } else {
            this.costLab.string = StringUtils.format(gdk.i18n.t("i18n:ACT_STORE_TIP1"), this._info.RMB_cost)
        }

        this.content.removeAllChildren()
        let rewards = this._info.activation_rewards
        for (let i = 0; i < rewards.length; i++) {
            let item = cc.instantiate(this.rewardItemPrefab)
            item.scale = 0.8
            let ctrl = item.getComponent(UiSlotItem)
            ctrl.updateItemInfo(rewards[i][0], rewards[i][1])
            ctrl.itemInfo = {
                series: rewards[i][0],
                itemId: rewards[i][0],
                type: BagUtils.getItemTypeById(rewards[i][0]),
                itemNum: 1,
                extInfo: null,
            }
            this.content.addChild(item)
        }
        this.btnBuy.active = true
        this.sellout.active = false

        let cardInfo = this.storeModel.getMonthCardInfo(this._info.id)
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        if (cardInfo && cardInfo.time > 0 && cardInfo.time > curTime) {
            this.btnBuy.active = false
            this.sellout.active = true
        }
    }

    _getIconTarget() {
        let target = 1
        if (this._info.id == 500004 || this._info.id == 500005) {
            target = 2
        }
        return target
    }

    _getTypeTarget() {
        let target = 0
        if (this._info.day == 7) {
            target = 1
        } else if (this._info.day == 30) {
            target = 3
        } else if (this._info.day >= 9999) {
            target = 2
        }
        return target
    }

    buyFunc() {
        if (this.taskModel.tavernGuideId && this.taskModel.tavernGuideId == this._info.id) {
            this.guideSpine.active = false;
            this.taskModel.tavernGuideId = null;
        }
        if (this._info.diamond_cost && this._info.diamond_cost > 0) {
            let msg = new icmsg.MonthCardBuyReq()
            msg.cardId = this._info.id
            NetManager.send(msg, (data: icmsg.MonthCardBuyRsp) => {
                GlobalUtil.openRewadrView(data.rewards)
            })
        } else {
            let msg = new icmsg.PayOrderReq()
            msg.paymentId = this._info.id
            NetManager.send(msg)
        }
    }

}