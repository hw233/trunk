import ActivityModel from '../../model/ActivityModel';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import ServerModel from '../../../../common/models/ServerModel';
import TaskUtil from '../../../task/util/TaskUtil';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Store_time_giftCfg } from '../../../../a/config';
import { StoreEventId } from '../../../store/enum/StoreEventId';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/turntable/TurntableGiftViewCtrl")
export default class TurntableGiftViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Label)
    discountLabel: cc.Label = null;

    @property(cc.Label)
    priceLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    desLabel: cc.Label = null;

    @property(cc.Prefab)
    giftItem: cc.Prefab = null;

    @property(cc.Node)
    payBtnNode: cc.Node = null;
    @property(cc.Node)
    rewardNode: cc.Node = null;

    @property(cc.Node)
    leftBtnNode: cc.Node = null;
    @property(cc.Node)
    RightBtnNode: cc.Node = null;

    @property(cc.Sprite)
    iconSp: cc.Sprite = null;

    @property(cc.Sprite)
    titleNameSp: cc.Sprite = null;


    curIndex: number = 0;;
    startTime: number;
    type: number = 0;
    _payGet: icmsg.GoodsInfo[] = []

    allLimitGift: icmsg.ActivityTimeGift[] = []
    _curLimitGift: icmsg.ActivityTimeGift = null;
    get aModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    iconStrs: string[] = ['xssj_zangshidaoju02', 'xssj_zangshidaoju03', 'xssj_zangshidaoju01', 'xssj_zangshidaoju04', 'xssj_zangshidaoju05'];
    titleStrs: string[] = ['xssj_mingchen02', 'xssj_mingchen03', 'xssj_mingchen01', 'xssj_mingchen04', 'xssj_mingchen05']
    // update (dt) {}
    onEnable() {

        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._updatePaySucc, this)

        let args = gdk.panel.getArgs(PanelId.TurntableGiftView)
        if (args) {
            this.type = args[0]
        }
        this.initGiftData();

    }

    onDisable() {
        gdk.e.targetOff(this)
        this.clear();
    }

    clear() {
        this.content.removeAllChildren();
    }

    //充值成功
    _updatePaySucc(e: gdk.Event) {
        let d = <icmsg.PaySuccRsp>e.data;
        if (d.paymentId > 1800000 && d.paymentId < 1900000) {
            // GlobalUtil.openRewadrView(e.data.list)
            this._payGet = e.data.list
            this._curLimitGift.state = 1;
            // this.payBtnNode.active = this._curLimitGift.state == 0
            // this.rewardNode.active = this._curLimitGift.state == 1
            this.onClickRewardBtn()
        }
    }

    _dtime = 0;
    update(dt: number) {
        if (!this.time || this.time <= 0) return;
        if (this._dtime > 1) {
            this._dtime = 0;
            this.time -= 1;
        }
        else {
            this._dtime += dt;
        }
    }

    initGiftData() {
        //获取
        this.allLimitGift = [];
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        this.aModel.LimitGiftDatas.forEach(data => {
            if ((curTime < data.endTime && data.state == 0) || data.state == 1) {
                let cfg = ConfigManager.getItemById(Store_time_giftCfg, data.giftId)
                if (cfg.gift_type == 4 || cfg.gift_type == 5) {
                    this.allLimitGift.push(data);
                }
            }
        })
        if (this.allLimitGift.length == 0) {
            this.close()
            return;
        }
        if (this.type) {
            this.allLimitGift.forEach((data, i) => {
                let cfg = ConfigManager.getItemById(Store_time_giftCfg, data.giftId)
                if (cfg && cfg.gift_type == this.type) {
                    this._curLimitGift = data;
                    this.curIndex = i;
                }
            })
            if (!this._curLimitGift) {
                this.close()
                return;
            }
        } else {
            this._curLimitGift = this.allLimitGift[0];
            this.curIndex = 0;
        }
        this.leftBtnNode.active = this.allLimitGift.length > 1;
        this.RightBtnNode.active = this.allLimitGift.length > 1;

        this.updateView();
    }



    updateView() {

        let cfg = ConfigManager.getItemById(Store_time_giftCfg, this._curLimitGift.giftId)
        let iconPath = 'view/act/texture/limitGift/' + this.iconStrs[cfg.gift_type - 1];
        let titlePath = 'view/act/texture/limitGift/' + this.titleStrs[cfg.gift_type - 1];
        GlobalUtil.setSpriteIcon(this.node, this.iconSp, iconPath)
        GlobalUtil.setSpriteIcon(this.node, this.titleNameSp, titlePath)

        this.priceLabel.string = '.' + cfg.RMB_cost;
        this.time = this._curLimitGift.endTime - Math.floor(ModelManager.get(ServerModel).serverTime / 1000);
        //let rewardCfg = ConfigManager.getItemByField(Store_giftrewardCfg, "gift_id", this._timeLimitGift.giftId)
        //this.descLabel.string = rewardCfg.desc;
        this.discountLabel.string = `.${cfg.value}`;
        this.content.removeAllChildren();
        //if (rewardCfg.items.length > 4) this.scrollView.horizontal = true;
        //else this.scrollView.horizontal = false;
        cfg.RMB_rewards.forEach(gift => {
            let item = cc.instantiate(this.giftItem);
            this.content.addChild(item);
            let ctrl = item.getComponent(UiSlotItem);
            ctrl.isEffect = true;
            ctrl.updateItemInfo(gift[0], gift[1]);
            ctrl.itemInfo = {
                itemId: gift[0],
                series: 0,
                type: BagUtils.getItemTypeById(gift[0]),
                itemNum: gift[1],
                extInfo: null,
            };
            gift[2] && ctrl.updateQuality(gift[2]);
        });
        this.content.getComponent(cc.Layout).updateLayout();

        this.payBtnNode.active = this._curLimitGift.state == 0
        this.rewardNode.active = this._curLimitGift.state == 1

    }

    onClickleftBtn() {
        if (this.curIndex <= 0) {
            this.curIndex = this.allLimitGift.length - 1;
        } else {
            this.curIndex -= 1
        }
        this._curLimitGift = this.allLimitGift[this.curIndex];
        this.updateView();
    }

    onClickRightBtn() {
        if (this.curIndex >= this.allLimitGift.length - 1) {
            this.curIndex = 0;
        } else {
            this.curIndex += 1;
        }
        this._curLimitGift = this.allLimitGift[this.curIndex];
        this.updateView();
    }

    onClickBuyBtn() {
        let req: icmsg.PayOrderReq = new icmsg.PayOrderReq();
        req.paymentId = this._curLimitGift.giftId;
        NetManager.send(req);
    }

    onClickRewardBtn() {
        let req: icmsg.ActivityTimeGiftGainReq = new icmsg.ActivityTimeGiftGainReq();
        req.giftId = this._curLimitGift.giftId
        NetManager.send(req, (rsp: icmsg.ActivityTimeGiftGainRsp) => {
            this._curLimitGift.state = rsp.state;
            GlobalUtil.openRewadrView(rsp.goodsInfo.concat(this._payGet));
            this.aModel.LimitGiftDatas = this.aModel.LimitGiftDatas
            this.initGiftData();
        });
    }

    _time: number;
    get time(): number { return this._time; }
    set time(v: number) {
        v = Math.floor(v);
        this._time = v;
        if (this._curLimitGift.state == 1) {
            this.timeLabel.string = '';
        } else {
            this.timeLabel.string = TaskUtil.getOnlineRewardTimeStr(v) + gdk.i18n.t('i18n:STORE_TIP6');
        }

        if (v <= 0 && this._curLimitGift.state == 0) {
            this.initGiftData();
        }
    }


}
