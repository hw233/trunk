import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Store_sevenday_war_giftCfg } from '../../../../a/config';
/**
 * @Description: 跨服活动列表
 * @Author: yaozu.hu
 * @Date: 2021-01-22 17:19:33
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-27 18:05:09
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/sevenDayWar/SevenDayWarActItemCtrl")
export default class SevenDayWarActItemCtrl extends UiListItem {

    @property(cc.Node)
    content1: cc.Node = null;

    @property(cc.Node)
    content2: cc.Node = null;

    @property(cc.Node)
    fightBtn: cc.Node = null;

    @property(cc.Node)
    getFreeBtn: cc.Node = null;

    @property(cc.Node)
    freeHasGet: cc.Node = null;

    @property(cc.Node)
    buyBtn: cc.Node = null;

    @property(cc.Node)
    getBuyBtn: cc.Node = null;

    @property(cc.Node)
    buyHasGet: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    _cfg: Store_sevenday_war_giftCfg
    _curDay: number

    cnStr = [
        gdk.i18n.t('i18n:ACT_FLIPCARD_NUM1'),
        gdk.i18n.t('i18n:ACT_FLIPCARD_NUM2'),
        gdk.i18n.t('i18n:ACT_FLIPCARD_NUM3'),
        gdk.i18n.t('i18n:ACT_FLIPCARD_NUM4'),
        gdk.i18n.t('i18n:ACT_FLIPCARD_NUM5'),
        gdk.i18n.t('i18n:ACT_FLIPCARD_NUM6'),
        gdk.i18n.t('i18n:ACT_FLIPCARD_NUM7'),
    ]

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    updateView() {
        this._cfg = this.data
        this.nameLab.string = `第${this.cnStr[this.curIndex]}天`

        let starTime = ActUtil.getActStartTime(138)
        let curTime = GlobalUtil.getServerTime()

        this._curDay = Math.ceil((curTime - starTime) / (1000 * 86400))

        this.fightBtn.active = true
        cc.find(`lab`, this.fightBtn).getComponent(cc.Label).string = `挑战`
        this.getFreeBtn.active = false
        this.freeHasGet.active = false
        GlobalUtil.setAllNodeGray(this.fightBtn, 0)


        this.buyBtn.active = true
        cc.find(`lab`, this.buyBtn).getComponent(cc.Label).string = `${this._cfg.RMB_cost}元`
        this.getBuyBtn.active = false
        this.buyHasGet.active = false
        GlobalUtil.setAllNodeGray(this.buyBtn, 0)


        if (this.curIndex + 1 > this._curDay) {
            cc.find(`lab`, this.fightBtn).getComponent(cc.Label).string = `未开启`
            GlobalUtil.setAllNodeGray(this.fightBtn, 1)

            GlobalUtil.setAllNodeGray(this.buyBtn, 1)
        }

        this.content1.removeAllChildren();
        this._cfg.free_rewards.forEach(reward => {
            if (reward && reward.length >= 2) {
                let slot = cc.instantiate(this.slotPrefab);
                slot.scale = 0.7
                slot.parent = this.content1;
                let ctrl = slot.getComponent(UiSlotItem);
                ctrl.updateItemInfo(reward[0], reward[1]);
                let itemInfo = {
                    series: null,
                    itemId: reward[0],
                    itemNum: reward[1],
                    type: BagUtils.getItemTypeById(reward[0]),
                    extInfo: null,
                };
                ctrl.itemInfo = itemInfo
            }
        });

        //免费的已通关
        if (Math.pow(2, (this.curIndex + 1)) & this.actModel.sevenDayWarInfo.stage) {
            this.fightBtn.active = false
            this.getFreeBtn.active = true
            //已领取
            if (Math.pow(2, (this.curIndex + 1)) & this.actModel.sevenDayWarInfo.reward) {
                this.getFreeBtn.active = false
                this.freeHasGet.active = true
            }
        }

        this.content2.removeAllChildren();
        this._cfg.RMB_rewards.forEach(reward => {
            if (reward && reward.length >= 2) {
                let slot = cc.instantiate(this.slotPrefab);
                slot.scale = 0.7
                slot.parent = this.content2;
                let ctrl = slot.getComponent(UiSlotItem);
                ctrl.updateItemInfo(reward[0], reward[1]);
                let itemInfo = {
                    series: null,
                    itemId: reward[0],
                    itemNum: reward[1],
                    type: BagUtils.getItemTypeById(reward[0]),
                    extInfo: null,
                };
                ctrl.itemInfo = itemInfo
            }
        });

        //购买的已通关
        if (Math.pow(2, (this.curIndex + 1)) & this.actModel.sevenDayWarInfo.buy) {
            this.buyBtn.active = false
            this.getBuyBtn.active = true
            //已领取
            if (Math.pow(2, (this.curIndex + 1)) & this.actModel.sevenDayWarInfo.gift) {
                this.getBuyBtn.active = false
                this.buyHasGet.active = true
            }
        }
    }

    onFight() {
        let starTime = ActUtil.getActStartTime(138)
        let curTime = GlobalUtil.getServerTime()
        this._curDay = Math.ceil((curTime - starTime) / (1000 * 86400))
        if (this.curIndex + 1 > this._curDay) {
            let sTime = TimerUtils.format4(Math.floor(((starTime + this.curIndex * 86400 * 1000) - curTime) / 1000))
            gdk.gui.showMessage(`${sTime}后开启`)
            return
        }
        gdk.panel.hide(PanelId.SevenDayWarActView)
        JumpUtils.openInstance(this._cfg.fbId);
    }

    onGetFreeReward() {
        let msg = new icmsg.DungeonSevenDayRewardReq()
        msg.stageId = this._cfg.fbId
        NetManager.send(msg, (data: icmsg.DungeonSevenDayRewardRsp) => {
            this.actModel.sevenDayWarInfo.reward = data.reward
            GlobalUtil.openRewadrView(data.rewards)
            this.getFreeBtn.active = false
            this.freeHasGet.active = true
        })
    }

    onBuy() {
        if (this.curIndex + 1 > this._curDay || this.fightBtn.active) {
            gdk.gui.showMessage("通关后才可购买")
            return
        }
        let msg = new icmsg.PayOrderReq()
        msg.paymentId = this._cfg.id
        NetManager.send(msg, () => {
            this.actModel.sevenDayWarInfo.buy += Math.pow(2, this.curIndex + 1)
        })
    }

    onGetBuyReward() {
        let msg = new icmsg.DungeonSevenDayGiftReq()
        msg.stageId = this._cfg.fbId
        NetManager.send(msg, (data: icmsg.DungeonSevenDayGiftRsp) => {
            GlobalUtil.openRewadrView(data.rewards)
            this.actModel.sevenDayWarInfo.gift = data.gift

            this.getBuyBtn.active = false
            this.buyHasGet.active = true
        })
    }


}