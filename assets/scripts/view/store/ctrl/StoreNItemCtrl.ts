import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import ExpeditionModel from '../../guild/ctrl/expedition/ExpeditionModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import SelectGiftViewCtrl, { SelectGiftInfo, SelectGiftType } from '../../bag/ctrl/SelectGiftViewCtrl';
import SiegeModel from '../../guild/ctrl/siege/SiegeModel';
import StoreItemBuyCtrl from './StoreItemBuyCtrl';
import StoreModel from '../model/StoreModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagEvent } from '../../bag/enum/BagEvent';
import { BagType } from '../../../common/models/BagModel';
import {
    Copyultimate_stageCfg,
    Item_equipCfg,
    ItemCfg,
    RuneCfg,
    Store_runeCfg,
    StoreCfg
    } from '../../../a/config';
import { MoneyType } from './StoreViewCtrl';
import { StoreType } from '../enum/StoreType';
/** 
  * @Description: 商店普通物品子项
  * @Author: weiliang.huang  
  * @Date: 2019-05-22 15:39:36 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-13 14:28:57
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/StoreNItemCtrl")
export default class StoreNItemCtrl extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Node)
    numBg: cc.Node = null

    @property(cc.Node)
    costIcon: cc.Node = null

    @property(cc.Label)
    costLab: cc.Label = null

    @property(cc.Node)
    noneNode: cc.Node = null    // 售罄节点

    @property(cc.Node)
    limitNode: cc.Node = null    // 限购节点

    @property(cc.RichText)
    limitLab1: cc.RichText = null

    @property(cc.Node)
    limitIcon: cc.Node = null

    @property(cc.Node)
    sellout: cc.Node = null//售罄图标

    @property(cc.Node)
    state1: cc.Node = null//常用商品

    @property(cc.Node)
    state2: cc.Node = null//特殊商品 虚拟的月卡物品

    @property(cc.Node)
    redPoint: cc.Node = null;

    @property(cc.Node)
    discountNode: cc.Node = null;

    @property(cc.Node)
    vipLimit: cc.Node = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    lockNode: cc.Node = null;

    @property(cc.Node)
    specialIcon: cc.Node = null;

    cfg: any = null
    type: StoreType = 1
    info: icmsg.StoreBuyInfo = null
    pos: number = 0 // 神秘商店购买时,传pos购买
    data: any = null
    onLoad() {

    }

    onEnable() {
        this.node.getChildByName('content').on(cc.Node.EventType.TOUCH_END, this._itemClick, this);
        gdk.e.on(BagEvent.SELECT_CLICK_ITEM, this._clickGiftItem, this);
    }

    onDisable() {
        this.content.stopAllActions();
        this.node.getChildByName('content').off(cc.Node.EventType.TOUCH_END, this._itemClick, this);
        gdk.e.off(BagEvent.SELECT_CLICK_ITEM, this._clickGiftItem, this)
    }

    updateView(data) {
        if (data.showAni) {
            data.showAni = false;
            this.content.stopAllActions();
            this.content.scaleX = 0;
            this.content.runAction(cc.scaleTo(.2, 1, 1));
        } else {
            this.content.scaleX = 1;
        }
        this.data = data
        this.state1.active = true
        this.state2.active = false
        this.lockNode.active = false
        this.discountNode.active = false
        //虚拟月卡道具处理
        if (!this.data.cfg && !this.data.info) {
            this.state1.active = false
            this.state2.active = true
            let item = this.state2.getChildByName("UiSlotItem").getComponent(UiSlotItem)
            let nameLab = this.state2.getChildByName("nameLab").getComponent(cc.Label)
            item.updateItemInfo(150001)
            nameLab.string = `${BagUtils.getConfigById(150001).name}`
            return
        }
        this.cfg = this.data.cfg
        if (this.data.info && this.data.info.itemType) {
            this.slot.updateItemInfo(this.data.info.itemType)
            this.slot.updateNumLab(`${this.data.info.itemNum ? this.data.info.itemNum : this.cfg.item_number}`)
            let cfg = BagUtils.getConfigById(this.data.info.itemType);
            this.nameLab.string = cfg.name;
            this.numBg.active = true
        } else {
            this.slot.updateItemInfo(this.cfg.item_id)
            if (this.cfg.item_number > 1) {
                this.slot.updateNumLab(`${this.cfg.item_number}`)
                this.numBg.active = true
            } else {
                this.numBg.active = false
            }
            this.nameLab.string = this.cfg.item_name
        }
        this._updateLockText();
        this.sellout.active = false
        this.pos = this.data.pos
        this.info = this.data.info || { id: this.cfg.id, count: 0 }

        let money_cost = this.cfg.money_cost

        let moneyCfg = ConfigManager.getItemById(ItemCfg, money_cost[0])
        if (moneyCfg.id == MoneyType.Gold) {
            this.costLab.string = `${GlobalUtil.numberToStr(money_cost[1], true)}`
        } else {
            this.costLab.string = `${money_cost[1]}`
        }
        let icon = `common/texture/${moneyCfg.icon}`
        this._updateCostIcon(icon)
        let maxNum = this.cfg.times_limit
        let buyNum = this.info.count
        let refresh = this.cfg.refresh || 0
        if ((maxNum > 0 || refresh > 0) && this.cfg.type != StoreType.BLACK && this.cfg.type != StoreType.RUNE) {
            // this.node.getComponent(cc.Layout).spacingY = 5;
            this.limitNode.active = true
            let limitStr = gdk.i18n.t('i18n:STORE_TIP8');
            // let path = `${STORE_TEXTURE_PATH}/sd_bri`
            if (refresh == 1) {
                limitStr = gdk.i18n.t('i18n:STORE_TIP9');
                // path = `${STORE_TEXTURE_PATH}/sd_bzhou`
            } else if (refresh == 2) {
                limitStr = gdk.i18n.t('i18n:STORE_TIP10');
                // path = `${STORE_TEXTURE_PATH}/sd_byue`
            } else if (refresh == 4 || refresh == 5) {
                limitStr = '';
            }
            else if (refresh == 6) {
                limitStr = gdk.i18n.t('i18n:STORE_TIP11');
            }
            if (maxNum) {
                this.sellout.active = (buyNum - maxNum == 0)
                // this.costIcon.parent.active = (buyNum - maxNum != 0)
            }
            // GlobalUtil.setSpriteIcon(this.node, this.limitIcon, path)
            // this.limitLab1.string = StringUtils.setRichtOutLine(`限购${this._getNumTxt(buyNum, maxNum)}`, "#8f2811", 2)

            if (this.cfg.type == StoreType.GEMS && this.cfg.activity_id > 0) {
                limitStr = ''
            }

            this.limitLab1.string = '<b>' + limitStr + `${gdk.i18n.t('i18n:STORE_TIP12')}: ${maxNum - buyNum}/${maxNum}` + '</b>';
        } else {
            // this.node.getComponent(cc.Layout).spacingY = 20;
            this.limitNode.active = false
            if (maxNum) {
                this.sellout.active = (buyNum - maxNum == 0)
                this.costIcon.parent.active = (buyNum - maxNum != 0)
            }
        }
        if (this.cfg.discount && this.cfg.discount > 0) {
            this.discountNode.active = true;
            cc.find('layout/label', this.discountNode).getComponent(cc.Label).string = `${this.cfg.discount}`.replace('.', '/');
        }

        if (this.cfg instanceof Store_runeCfg) {
            let cfg = ConfigManager.getItemById(RuneCfg, parseInt(data.info.itemType.toString().slice(0, 6)));
            this.lvLab.node.active = true;
            this.lvLab.string = '.' + cfg.level;
        }
        else {
            this.lvLab.node.active = false;
        }

        this.updateStar()
        this._updateRedpoint();


        let itemCfg = BagUtils.getConfigById(this.cfg.item_id) as ItemCfg
        if (this.sellout.active || (itemCfg && itemCfg.style && itemCfg.style == 1 && itemCfg.color == 3)) {
            let chipEffect = this.slot.UiItemIcon.node.getChildByName("chipEffect")
            if (chipEffect && chipEffect.active) {
                chipEffect.active = false
            }
        }

        if (this.cfg.VIP_limit && ModelManager.get(RoleModel).vipLv < this.cfg.VIP_limit) {
            this.vipLimit.active = true;
            this.costNode.active = true;
            this.vipLimit.getChildByName('lab').getComponent(cc.Label).string = `VIP${this.cfg.VIP_limit}${gdk.i18n.t('i18n:STORE_TIP13')}`;
        }
        else {
            this.costNode.active = true;
            this.vipLimit.active = false;
        }

        if (this.cfg.will_buy && this.cfg.will_buy == 1) {
            cc.find('layout/mustBuy', this.costNode).active = true;
        }
        else {
            cc.find('layout/mustBuy', this.costNode).active = false;
        }

        //绑定指引
        if (this.cfg.type == 5 && this.pos == 0) {
            GuideUtil.bindGuideNode(11011, this.node)
        }

        if (this.cfg.bargain) {
            this.specialIcon.active = true
            this.specialIcon.getComponent(cc.Animation).play("itemSpecialAni")
        } else {
            this.specialIcon.active = false
        }
    }

    _updateLockText() {
        if (this.data.cfg.type == StoreType.SIEGE && ModelManager.get(SiegeModel).todayMaxGroup >= this.cfg.unlock_ || !this.cfg.unlock_) {
            this.lockNode.active = false
        } else {
            this.lockNode.active = true
            this.lockNode.getChildByName('richtext').getComponent(cc.RichText).string = StringUtils.format(gdk.i18n.t("i18n:STORE_TIP39"), this.cfg.unlock_)//`<color=#FBF2D4><outline color=#962e00 width=2>击杀<color=#ffd71a>${this.cfg.unlock_}</c>波\n丧尸解锁</outline></c>`
        }

        if (this.cfg && this.cfg.forces && ModelManager.get(ExpeditionModel).armyLv < this.cfg.forces) {
            this.lockNode.active = true
            this.lockNode.getChildByName('richtext').getComponent(cc.RichText).string = StringUtils.format(gdk.i18n.t("i18n:STORE_TIP43"), this.cfg.forces)//`<color=#FBF2D4><outline color=#962e00 width=2>击杀<color=#ffd71a>${this.cfg.unlock_}</c>波\n丧尸解锁</outline></c>`
        }

        if (this.data.cfg.type == StoreType.ULTIMATE && this.cfg.unlock_ultimate) {
            let stagetId = ModelManager.get(CopyModel).ultimateMaxStageId
            let cfg = ConfigManager.getItemById(Copyultimate_stageCfg, stagetId)
            let sort = cfg ? cfg.sort : 0
            this.lockNode.active = this.cfg.unlock_ultimate > sort
            this.lockNode.getChildByName('richtext').getComponent(cc.RichText).string = StringUtils.format(gdk.i18n.t("i18n:STORE_TIP48"), this.cfg.unlock_ultimate)
        }
    }

    _updateRedpoint() {
        this.redPoint.active = false;
        if (this.cfg && this.cfg instanceof StoreCfg && this.cfg.type == StoreType.GEMS && [100076].indexOf(this.cfg.item_id) != -1) {
            let list = ModelManager.get(StoreModel).storeInfo;
            let buyCount: icmsg.StoreBuyInfo = list[this.cfg.id];
            if (!buyCount || (this.cfg.times_limit - buyCount.count > 0)) {
                this.redPoint.active = true;
                return true
            }
        }

        if (this.cfg && this.cfg instanceof StoreCfg && this.cfg.type == StoreType.GEMS && this.cfg.money_cost[1] == 0) {
            let list = ModelManager.get(StoreModel).storeInfo;
            let buyCount: icmsg.StoreBuyInfo = list[this.cfg.id];
            if (!buyCount || (this.cfg.times_limit - buyCount.count > 0)) {
                this.redPoint.active = true;
                return true
            }
        }
    }

    _getNumTxt(value1, value2) {
        let str = "";
        let result = value2 - value1
        if (result > 0) {
            str = `<color=#61ffab>${result}</c>/${value2}`
        } else {
            str = `<color=#ff0000>${result}</c>/${value2}`
        }
        return str
    }

    _clickGiftItem(event: gdk.Event) {
        let data = event.data;
        if (data.storeId == this.cfg.id) {
            let itemCfg = ConfigManager.getItemById(ItemCfg, this.cfg.item_id)
            let cfg = JSON.parse(JSON.stringify(this.cfg));
            if (itemCfg && itemCfg.use_type == 4) {
                gdk.panel.open(PanelId.SelectGift, (node: cc.Node) => {
                    let comp = node.getComponent(SelectGiftViewCtrl)
                    comp.initRewardInfo(this.cfg.item_id, SelectGiftType.Store, (item) => {
                        this.openBuyPanel(item, cfg);
                    })
                    gdk.Timer.once(200, this, () => {
                        gdk.e.emit(BagEvent.SELECT_CLICK_ITEM_BUY, { itemId: data.itemId });
                    })
                })
            } else {
                this.openBuyPanel(null);
            }
        }
    }

    /**更新星级 */
    updateStar() {
        let itemId = this.cfg.item_id
        let itemType = BagUtils.getItemTypeById(itemId)
        if (itemType == BagType.EQUIP) {
            let cfg = ConfigManager.getItemById(Item_equipCfg, itemId)
            this.slot.updateStar(cfg.star)
        }
    }

    /** 更新货币icon */
    _updateCostIcon(path: string = "") {
        if (!path) {
            return
        }
        GlobalUtil.setSpriteIcon(this.node, this.costIcon, path)
    }

    _itemClick() {
        if (!this.data.cfg && !this.data.info) {
            gdk.panel.setArgs(PanelId.MonthCard, 1)
            gdk.panel.open(PanelId.MonthCard)
        } else {
            let cfg = JSON.parse(JSON.stringify(this.cfg));
            let itemCfg = ConfigManager.getItemById(ItemCfg, this.cfg.item_id)
            //类型4为可选奖励类型礼包
            if (itemCfg && itemCfg.use_type == 4) {
                gdk.panel.open(PanelId.SelectGift, (node: cc.Node) => {
                    let comp = node.getComponent(SelectGiftViewCtrl)
                    comp.initRewardInfo(this.cfg.item_id, SelectGiftType.Store, (item) => {
                        this.openBuyPanel(item, cfg);
                    })
                })
                return
            } else {
                if (this.lockNode.active) {
                    if (this.cfg && this.cfg.forces) {
                        gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:STORE_TIP44"), this.cfg.forces))
                    }
                    else {
                        gdk.gui.showMessage(this.lockNode.getChildByName('richtext').getComponent(cc.RichText).string);//`当天击杀${this.cfg.unlock_}波丧尸后解锁`
                    }
                    // gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:SIEGE_TIP7"), this.cfg.unlock_));//`当天击杀${this.cfg.unlock_}波丧尸后解锁`
                    return
                }
                this.openBuyPanel(null);
            }
        }
    }

    openBuyPanel(info: SelectGiftInfo, storeCfg?: StoreCfg | Store_runeCfg) {
        let cfg;
        if (storeCfg) cfg = storeCfg;
        else cfg = this.cfg;
        if (cfg.times_limit > 0) {
            let leftNum = cfg.times_limit - this.info.count;
            //已无购买次数
            if (leftNum <= 0) {
                if (cfg.type == StoreType.BLACK) {
                    GlobalUtil.showMessageAndSound(gdk.i18n.t('i18n:STORE_TIP14'))
                } else {
                    GlobalUtil.showMessageAndSound(gdk.i18n.t('i18n:STORE_TIP15'))
                }
                return;
            }
        }
        if (this.cfg.VIP_limit && ModelManager.get(RoleModel).vipLv < this.cfg.VIP_limit) {
            // gdk.gui.showMessage(`VIP${this.cfg.VIP_limit}专属`);
            GlobalUtil.openAskPanel({
                descText: StringUtils.format(gdk.i18n.t('i18n:STORE_TIP16'), this.cfg.VIP_limit),
                sureCb: () => {
                    JumpUtils.openRechargeView([3]);
                }
            })
            return;
        }

        if (cfg.type == StoreType.BLACK && !ModelManager.get(StoreModel).showBuyPop) {
            //黑市跳过二次确认弹窗
            let msg = new icmsg.StoreBlackMarketBuyReq();
            msg.position = this.pos;
            NetManager.send(msg);
            return;
        }

        let num = info ? info.num : (this.data && this.data.info && this.data.info.itemNum ? this.data.info.itemNum : 0);
        let itemId = info ? info.itemId : (this.data && this.data.info && this.data.info.itemType ? this.data.info.itemType : cfg.item_id);
        let actIds = [35, 40, 135]
        gdk.panel.open(PanelId.StoreItemBuy, (node: cc.Node) => {
            let comp = node.getComponent(StoreItemBuyCtrl)
            comp.initItemInfo(cfg.id, itemId, num, this.info, (num) => {
                if (cc.isValid(this.node)) {
                    if (cfg.type == StoreType.BLACK) {
                        let msg = new icmsg.StoreBlackMarketBuyReq();
                        msg.position = this.pos;
                        NetManager.send(msg);
                    } else if (cfg.type == StoreType.RUNE) {
                        let msg = new icmsg.StoreRuneBuyReq();
                        msg.id = cfg.id;
                        msg.num = cfg.item_number;
                        NetManager.send(msg);
                    } else if (cfg.type == StoreType.GEMS && cfg.activity_id > 0 && actIds.indexOf(cfg.activity_id) != -1) {
                        let msg = new icmsg.ActivityStoreBuyReq()
                        msg.itemId = cfg.id
                        msg.itemNum = num
                        msg.activityId = cfg.activity_id
                        NetManager.send(msg)
                    } else {
                        let msg = new icmsg.StoreBuyReq()
                        msg.id = cfg.id;
                        msg.num = num;
                        NetManager.send(msg, (data) => {
                            if (!info) {
                                return;
                            }
                            let good: icmsg.GoodsInfo = new icmsg.GoodsInfo();
                            good.typeId = info.mainId;
                            good.num = num;
                            let msg = new icmsg.ItemDisintReq();
                            msg.index = info.index;
                            msg.items = [good];
                            NetManager.send(msg);
                        });
                    }
                }
            });
        })
    }
}
