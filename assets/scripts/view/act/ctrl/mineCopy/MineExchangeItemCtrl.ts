import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MineModel from '../../model/MineModel';
import MineUtil from '../../util/MineUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activitycave_exchangeCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { BagItem } from '../../../../common/models/BagModel';

/** 
 * @Description: 矿洞大作战兑换界面Item
 * @Author:yaozu.hu yaozu
 * @Date: 2020-08-04 11:29:25
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:34:26
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MineExchangeItemViewCtrl")
export default class MineExchangeItemViewCtrl extends UiListItem {

    @property(UiSlotItem)
    reward: UiSlotItem = null;
    @property([UiSlotItem])
    rewardItems: UiSlotItem[] = [];
    @property([cc.Label])
    itemNum: cc.Label[] = [];
    @property(cc.Label)
    exChangeNum: cc.Label = null;
    @property(cc.Node)
    exChangeBtn: cc.Node = null;
    @property(cc.Label)
    exChangeBtnLb: cc.Label = null;

    redColor: string = '#FF1B1B'
    greenColor: string = '#18FF0D'

    cfg: Activitycave_exchangeCfg;
    canExChange: boolean = true;

    inExChange: boolean = false;
    times: number = 0;
    model: MineModel;
    onEnable() {
        this.model = ModelManager.get(MineModel);
        gdk.e.on(ActivityEventId.ACTIVITY_MINE_EXCHANGE_REFRESH, this.updateView, this)
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this.updateView, this);
    }

    onDisable() {
        gdk.e.off(ActivityEventId.ACTIVITY_MINE_EXCHANGE_REFRESH, this.updateView, this)
        NetManager.targetOff(this);
    }
    updateView() {
        this.cfg = this.data.cfg;
        let rewardId = this.cfg.reward[0]
        let rewardNum = this.cfg.reward[1]
        this.reward.updateItemInfo(rewardId, rewardNum)
        let item: BagItem = {
            series: rewardId,
            itemId: rewardId,
            itemNum: 1,
            type: BagUtils.getItemTypeById(rewardId),
            extInfo: null
        }
        this.reward.itemInfo = item
        this.canExChange = true;
        for (let i = 1; i <= 3; i++) {
            if (this.cfg['item' + i].length > 0) {
                this.rewardItems[i - 1].node.active = true;
                this.itemNum[i - 1].node.active = true;
                let itemId = this.cfg['item' + i][0]
                let itemNum = this.cfg['item' + i][1]
                //this.reward.updateItemInfo(itemId, itemNum)
                let item: BagItem = {
                    series: itemId,
                    itemId: itemId,
                    itemNum: 1,
                    type: BagUtils.getItemTypeById(itemId),
                    extInfo: null
                }
                this.rewardItems[i - 1].itemInfo = item
                this.rewardItems[i - 1].updateItemInfo(itemId)
                let curNum = BagUtils.getItemNumById(itemId);
                this.itemNum[i - 1].node.color = curNum >= itemNum ? cc.color(this.greenColor) : cc.color(this.redColor)
                this.itemNum[i - 1].string = GlobalUtil.numberToStr2(curNum, true) + '/' + itemNum;
                if (curNum < itemNum) {
                    this.canExChange = false;
                }
            } else {
                this.rewardItems[i - 1].node.active = false;
                this.itemNum[i - 1].node.active = false;
            }
        }

        //判断是否达到上限
        this.times = MineUtil.getExChangeItemTimes(this.cfg.id);
        this.exChangeNum.string = '(' + this.times + '/' + this.cfg.times + ')'
        if (this.times >= this.cfg.times) {
            this.canExChange = false;
            this.exChangeBtnLb.string = 'Max';
        } else {
            this.exChangeBtnLb.string = this.canExChange ? gdk.i18n.t("i18n:MINECOPY_EXCHANGE_BTN1") : gdk.i18n.t("i18n:MINECOPY_EXCHANGE_BTN2")//'兑换' : '材料不足';
        }
        let state: 0 | 1 = this.canExChange ? 0 : 1;
        GlobalUtil.setGrayState(this.exChangeBtn, state)

    }

    exChangeBtnClick() {
        if (this.canExChange && !this.inExChange) {
            this.inExChange = true
            let msg = new icmsg.ActivityCaveExchangeReq()
            msg.exchangeId = this.cfg.id;
            NetManager.send(msg, (rsp: icmsg.ActivityCaveExchangeRsp) => {
                GlobalUtil.openRewadrView(rsp.rewards);
                if (this.times < this.cfg.times) {
                    let haveData = false;
                    this.model.curCaveSstate.exchange.forEach(data => {
                        if (data.exchangeId == this.cfg.id) {
                            haveData = true;
                            data.times += 1;
                        }
                    })
                    if (!haveData) {
                        let data = new icmsg.ActivityCaveExchange()
                        data.exchangeId = this.cfg.id;
                        data.times = 1;
                        this.model.curCaveSstate.exchange.push(data);
                    }
                }
                //刷新数据
                gdk.e.emit(ActivityEventId.ACTIVITY_MINE_EXCHANGE_REFRESH);
                this.inExChange = false;
            })
            //GlobalUtil.openRewadrView()
        } else {
            //gdk.gui.showMessage('')
        }
    }
}
