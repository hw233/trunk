import ActUtil from '../../act/util/ActUtil';
import BagUtils from '../../../common/utils/BagUtils';
import ChampionModel from '../../champion/model/ChampionModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import StoreModel from '../model/StoreModel';
import StoreUtils from '../../../common/utils/StoreUtils';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { GiftBuyInfo } from './StoreViewCtrl';
import { ListView } from '../../../common/widgets/UiListview';
import { Store_giftCfg, Store_giftrewardCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-23 17:13:10 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/StoreGiftItemCtrl")
export default class StoreGiftItemCtrl extends UiListItem {
    @property(cc.Label)
    giftName: cc.Label = null;

    @property(cc.Node)
    textBg: cc.Node = null;

    @property(cc.Node)
    limitNode: cc.Node = null;

    @property(cc.Node)
    valueNode: cc.Node = null;

    @property(cc.Node)
    profitNode: cc.Node = null;

    @property(cc.Node)
    leftTimeNode: cc.Node = null;

    @property(cc.Label)
    priceLabel: cc.Label = null;

    @property(cc.Node)
    sellOut: cc.Node = null;

    @property(cc.Node)
    buyBtn: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    newIcon: cc.Node = null;

    cfg: Store_giftCfg;
    rewardCfg: Store_giftrewardCfg;
    buyInfo: GiftBuyInfo;
    list: ListView;

    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v != 0) return;
        this._leftTime = Math.max(0, v);
        this.leftTimeNode.getChildByName('time').getComponent(cc.Label).string = TimerUtils.format3(Math.floor(this._leftTime / 1000));
        if (v == 0) {
            //TODO
            ModelManager.get(StoreModel).giftBuyList = ModelManager.get(StoreModel).giftBuyList;
        }
    }

    _dtime: number = 0;
    update(dt: number) {
        if (!this.leftTime || this.leftTime <= 0) return;
        if (this._dtime >= 1) {
            this._updateTime();
        }
        else {
            this._dtime += dt;
        }
    }

    updateView() {
        this.cfg = this.data.cfg;
        this.rewardCfg = ConfigManager.getItem(Store_giftrewardCfg, (cfg: Store_giftrewardCfg) => {
            if (cfg.gift_id == this.cfg.gift_id &&
                cfg.activity_id == 0 &&
                cfg.reward_type == 0) {
                return true;
            }
        });
        if (this.cfg.activity_id && this.cfg.activity_id.length > 0) {
            for (let i = 0; i < this.cfg.activity_id.length; i++) {
                let actCfg = ActUtil.getCfgByActId(this.cfg.activity_id[i]);
                if (actCfg) {
                    let tempCfg = ConfigManager.getItem(Store_giftrewardCfg, (cfg: Store_giftrewardCfg) => {
                        if (cfg.gift_id == this.cfg.gift_id &&
                            cfg.activity_id == actCfg.id &&
                            cfg.reward_type == actCfg.reward_type) {
                            return true;
                        }
                    });
                    if (tempCfg) {
                        this.rewardCfg = tempCfg;
                        break;
                    }
                }
            }
        }
        this.buyInfo = this.data.info;
        this.giftName.string = this.cfg.name;
        let outline = this.giftName.getComponent(cc.LabelOutline)
        this.limitNode.active = this.cfg.tab == 2 || this.cfg.tab == 4 || this.cfg.tab == 6;
        this.limitNode.getChildByName('limitLabel').getComponent(cc.Label).string = `${this.cfg.times_limit - this.buyInfo.count}/${this.cfg.times_limit}`;
        let bgPath = this.cfg.tab == 2 ? "lb_meizhouxiangou" : "lb_zhongshenxiangou"
        if (this.cfg.tab == 6) {
            bgPath = "lb_meiyuexiangou"
        } else if (this.cfg.timerule == 1 && [6, 7].indexOf(this.cfg.restricted[0]) !== -1) {
            bgPath = "lb_huodongxiangou"
        }
        GlobalUtil.setSpriteIcon(this.node, this.textBg, `view/store/textrue/store/${bgPath}`)
        this.sellOut.active = this.cfg.times_limit <= this.buyInfo.count;
        this.buyBtn.active = !this.sellOut.active;
        if (this.cfg.tab == 1) {
            let buyInfo = StoreUtils.getStoreGiftBuyInfo(20001);
            if (buyInfo && buyInfo.count >= 1) this.sellOut.active = true;
        }
        this.priceLabel.string = StringUtils.format(gdk.i18n.t("i18n:ACT_STORE_TIP1"), this.cfg.RMB_cost)//this.cfg.RMB_cost + gdk.i18n.t('i18n:ACT_STORE_TIP1');
        this.valueNode.active = this.cfg.tab == 1; //每日礼包独有
        this.profitNode.active = this.cfg.tab != 1;
        if (this.cfg.tab == 1) {
            cc.find('layout/label2', this.valueNode).getComponent(cc.Label).string = this.cfg.value;
        }
        else {
            this.profitNode.getChildByName('label').getComponent(cc.Label).string = `${this.cfg.profit}/`;
        }

        if (this.cfg.timerule == 1) {
            if (this.cfg.tab == 6) {
                this.leftTimeNode.active = false;
            } else {
                this.leftTimeNode.active = true;
                this._updateTime();
            }
        }
        else {
            this.leftTimeNode.active = false;
        }
        let sprite = this.node.getComponent(cc.Sprite);
        if (this.cfg.tab == 1) {
            let urlIdx = this.cfg.show - 1
            GlobalUtil.setSpriteIcon(this.node, sprite, `view/store/textrue/bg/lb_xinxidi${urlIdx}`);
            this.giftName.node.color = cc.color("#FFDFB1")
            outline.color = cc.color("#9A5F0E")
        } else {
            let bgPath = {}
            bgPath[4] = { bg: "lb_meiyuexinxidi02", color: "#ffc5b1", outline: "#8b283b" } //4限定
            bgPath[2] = { bg: "lb_meiyuexinxidi01", color: "#eed1fe", outline: "#6d278b" } //2每周
            bgPath[6] = { bg: "lb_meizhouxinxidi", color: "#FFDFB1", outline: "#9A5F0E" } //6每月
            GlobalUtil.setSpriteIcon(this.node, sprite, `view/store/textrue/bg/${bgPath[this.cfg.tab].bg}`);
            this.giftName.node.color = cc.color(bgPath[this.cfg.tab].color)
            outline.color = cc.color(bgPath[this.cfg.tab].outline)
        }
        this._initSlotItem();
        this.node.getComponent(cc.Layout).updateLayout();

        this._updateNewState()
    }


    _updateNewState() {
        if (this.cfg.tab == 1) {
            return
        }
        let giftIds = GlobalUtil.getLocal("newGiftData" + this.cfg.tab) || []
        this.newIcon.active = false
        if (giftIds.indexOf(this.cfg.gift_id) == -1 && this.buyInfo.count == 0) {//
            this.newIcon.active = true
            this.newIcon.getComponent(cc.Animation).play("giftNewAni")
        }
    }

    _updateTime() {
        if (this.cfg.timerule == 1) {
            let endArr = this.cfg.restricted[3];
            let time = GlobalUtil.getServerOpenTime() * 1000;
            let endTime;
            if (this.cfg.restricted[0] == 3) {
                endTime = time + (endArr[2] * 24 * 60 * 60 + endArr[3] * 60 * 60 + endArr[4] * 60) * 1000;
            }
            else if (this.cfg.restricted[0] == 1) {
                // endTime = new Date(endArr[0] + '/' + endArr[1] + '/' + endArr[2] + ' ' + endArr[3] + ':' + endArr[4] + ':0').getTime();
                endTime = TimerUtils.transformDate(endArr);
            } else if (this.cfg.restricted[0] == 6) {
                endTime = ActUtil.getActEndTime(this.cfg.restricted[1][0]);
            } else if (this.cfg.restricted[0] == 7) {
                let model = ModelManager.get(ChampionModel);
                if (model.infoData && model.infoData.seasonId) {
                    // let cfg: Champion_mainCfg = ConfigManager.getItemById(Champion_mainCfg, model.infoData.seasonId);
                    // if (cfg) {
                    //     let o = cfg.open_time.split('/');
                    //     let c = cfg.close_time.split('/');
                    //     // let ot = new Date(o[0] + '/' + o[1] + '/' + o[2] + ' ' + o[3] + ':' + o[4] + ':' + o[5]).getTime();
                    //     let ct = new Date(c[0] + '/' + c[1] + '/' + c[2] + ' ' + c[3] + ':' + c[4] + ':' + c[5]).getTime();
                    //     // let curTime = GlobalUtil.getServerTime();
                    //     // if (curTime >= ot && curTime <= ct + 24 * 60 * 60 * 1000 * 2) {
                    //     //     return true;
                    //     // }
                    //     endTime = ct;
                    // }
                    if (ActUtil.ifActOpen(122)) {
                        endTime = ActUtil.getActEndTime(122)
                    } else {
                        endTime = 0;
                    }
                }
            }
            let now = GlobalUtil.getServerTime();
            this.leftTime = endTime - now;
        }
    }

    _initSlotItem() {
        let itemNum: number = 0;
        this.content.removeAllChildren();
        if (this.rewardCfg) {
            //根据活动周期展示商品
            this.rewardCfg.items.forEach(reward => {
                itemNum += 1;
                let item = cc.instantiate(this.itemPrefab);
                let ctrl = item.getComponent(UiSlotItem);
                item.parent = this.content;
                ctrl.updateItemInfo(reward[0], reward[1]);
                ctrl.itemInfo = {
                    series: null,
                    itemId: reward[0],
                    itemNum: reward[1],
                    type: BagUtils.getItemTypeById(reward[0]),
                    extInfo: null,
                }
            });
        }
        else {
            for (let i = 0; i < 6; i++) {
                let reward: number[] = this.cfg[`item_${i + 1}`];
                if (reward && reward.length >= 2) {
                    itemNum += 1;
                    let item = cc.instantiate(this.itemPrefab);
                    let ctrl = item.getComponent(UiSlotItem);
                    item.parent = this.content;
                    ctrl.updateItemInfo(reward[0], reward[1]);
                    ctrl.itemInfo = {
                        series: null,
                        itemId: reward[0],
                        itemNum: reward[1],
                        type: BagUtils.getItemTypeById(reward[0]),
                        extInfo: null,
                    }
                }
            }
        }

        this.scrollView.scrollToTopLeft();
        this.scrollView.enabled = itemNum >= 5;
    }

    onBuyBtnClick() {
        let buyNum = this.buyInfo.count;
        let limitNum = this.cfg.times_limit;
        if (limitNum - buyNum > 0) {
            let msg = new icmsg.PayOrderReq();
            msg.paymentId = this.cfg.gift_id;
            NetManager.send(msg);
        } else {
            gdk.gui.showMessage(gdk.i18n.t('i18n:RECHARGE_TIP4'));
            return;
        }
    }
}
