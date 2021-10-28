import BagModel, { BagItem, BagType } from '../../models/BagModel';
import BagUtils from '../../utils/BagUtils';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ConfigManager from '../ConfigManager';
import GlobalUtil from '../../utils/GlobalUtil';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../utils/RedPointUtils';
import { AskInfoType } from '../../widgets/AskPanel';
import { BagEvent } from '../../../view/bag/enum/BagEvent';
import { DecomposeEvent } from '../../../view/decompose/enum/DecomposeEvent';
import { HeroCfg, Item_composeCfg, ItemCfg } from '../../../a/config';

/**
 * @Description: 背包通信器
 * @Author: weiliang.huang
 * @Date: 2019-05-27 17:35:16
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-06-23 10:51:33
 */

export default class BagController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return [
            [BagEvent.AUTO_COMPOSE_CHIP, this._autoComposeChip]
        ]
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.ItemListRsp.MsgType, this._onItemListRsp],
            [icmsg.ItemDisintRsp.MsgType, this._onItemDisintRsp],
            [icmsg.ItemUpdateRsp.MsgType, this._onItemUpdateRsp],
            [icmsg.EquipDisintRsp.MsgType, this._onEquipDisintRsp],
            [icmsg.ItemComposeRsp.MsgType, this._onItemComposeRsp],
            [icmsg.SystemErrorRsp.MsgType, this._onSystemErrorRsp]
        ];
    }

    model: BagModel = null

    onStart() {
        this.model = ModelManager.get(BagModel)
        this.model.idItems = {}
        this.model.bagItems = []
    }

    onEnd() {
        this.model = null
    }


    _autoComposeChip() {
        let items = BagUtils.getItemsByType(BagType.ITEM)
        items.forEach(element => {
            let cfg = ConfigManager.getItemById(ItemCfg, element.itemId);
            if (!cfg) {
                CC_DEBUG && cc.error(`背包物品 未找到配置表数据 itemId = ${element.itemId}`);
                return;
            }
            if (!cfg.random_hero_chip || cfg.random_hero_chip.length < 2) {
                let composeCfg = ConfigManager.getItemById(Item_composeCfg, element.itemId)
                if (composeCfg && element.itemNum >= composeCfg.amount) {
                    let msg = new icmsg.ItemComposeReq()
                    msg.stuffId = composeCfg.id
                    msg.num = Math.floor(element.itemNum / composeCfg.amount)
                    NetManager.send(msg)
                }
            }
        })
    }

    /**
     * 请求分解物品
     */
    reqDecomposeItem(e: gdk.Event) {
        let data = e.data
        let items = data.items
        let rubies = data.rubies
        let equips = data.equips

        if (items.length > 0) {
            let msg = new icmsg.ItemDisintReq()
            msg.items = items
            NetManager.send(msg)
            return
        }

        if (equips.length > 0) {
            let msg = new icmsg.EquipDisintReq()
            msg.equipList = equips;
            NetManager.send(msg)
            return
        }
    }

    /**服务器返回道具数据 */
    _onItemListRsp(data: icmsg.ItemListRsp) {
        this.model.idItems = {}
        this.model.bagItems = []
        let list = data.list
        let len = list.length
        for (let index = 0; index < len; index++) {
            const element: icmsg.ItemInfo = list[index];
            BagUtils.updateItemInfo(element.itemId, element, len == index + 1)
        }
        let usedList = data.used;
        this.model.itemUsedMap = {};
        usedList.forEach(item => {
            this.model.itemUsedMap[item.itemId] = item.itemNum;
        });
    }

    /**
     * 更新普通物品数据
     * @param item
     */
    _onItemUpdateRsp(data: icmsg.ItemUpdateRsp) {
        // let bagItems = this.model.bagItems
        let list = data.list
        let len = list.length
        for (let index = 0; index < len; index++) {
            const element = list[index];
            // 为红点设置标记
            let type = BagUtils.getItemTypeById(element.itemId)
            let isAdd = element.itemNum > BagUtils.getItemNumById(element.itemId)
            if (isAdd) {
                let cfg = BagUtils.getConfigById(element.itemId)
                // if (type == BagType.EQUIP) {
                //     // 金色装备
                //     isAdd = cfg.color >= 4
                // } else 
                if (type == BagType.ITEM) {
                    // 可打开的礼包
                    isAdd = (cfg as ItemCfg).func_id == "add_drop_items" || (cfg as ItemCfg).func_id == "choose_drop_item"

                    //英雄碎片记录 用于自动合成处理
                    let composeCfg = ConfigManager.getItemById(Item_composeCfg, element.itemId)
                    if (composeCfg) {
                        let composeNum = 0
                        let isAdd = false
                        if (composeCfg.target) {
                            let heroCfg = ConfigManager.getItemById(HeroCfg, composeCfg.target)
                            composeNum = Math.floor(element.itemNum / composeCfg.amount)
                            if (heroCfg && composeNum > 0) {
                                isAdd = true
                            }
                        } else {
                            let itemCfg = ConfigManager.getItemById(ItemCfg, composeCfg.id)
                            if (itemCfg && itemCfg.random_hero_chip && itemCfg.random_hero_chip.length > 0) {
                                composeNum = Math.floor(element.itemNum / composeCfg.amount)
                                if (composeNum > 0) {
                                    isAdd = true
                                }
                            }
                        }
                        if (isAdd) {
                            let chips = this.model.heroChips
                            let isHave = false
                            for (let i = 0; i < chips.length; i++) {
                                if (chips[i].itemId == element.itemId) {
                                    isHave = true
                                    this.model.heroChips[i].itemNum = element.itemNum
                                }
                            }
                            if (!isHave) {
                                let bagItem: BagItem = {
                                    series: element.itemId,
                                    itemId: element.itemId,
                                    itemNum: composeNum * composeCfg.amount,
                                    type: type,
                                    extInfo: element
                                }
                                this.model.heroChips.push(bagItem)
                            }
                        }
                    }
                } else {
                    // 其它物品全部不标记红点
                    isAdd = false
                }
            }
            RedPointUtils.update_bag_item(type, element.itemId, isAdd)
            // 更新数据
            if (element.itemNum == 0) {
                BagUtils.removeItemById(element.itemId, true)
            } else {
                BagUtils.updateItemInfo(element.itemId, element, true)
            }
        }
    }

    /**使用物品回调 */
    _onItemDisintRsp(data: icmsg.ItemDisintRsp) {
        if (this.model.openDecompose) {
            gdk.gui.showMessage("分解成功")
            gdk.e.emit(DecomposeEvent.RSP_DECOMPOSE_ITEM, data);
        } else {
            GlobalUtil.openRewadrView(data.list)
        }
        data.used.forEach(item => {
            if (!this.model.itemUsedMap[item.typeId]) this.model.itemUsedMap[item.typeId] = 0;
            this.model.itemUsedMap[item.typeId] += item.num;
            if (item.typeId == 130090) {
                let cfg = <ItemCfg>BagUtils.getConfigById(item.typeId);
                gdk.gui.showMessage(`使用成功，遗迹探索点+${item.num * cfg.func_args[0]}`);
            }
        });
    }

    /**装备分解 */
    _onEquipDisintRsp(data: icmsg.EquipDisintRsp) {
        gdk.gui.showMessage("分解成功")
        gdk.e.emit(DecomposeEvent.RSP_DECOMPOSE_ITEM, data);
    }

    /**碎片合成 */
    _onItemComposeRsp(data: icmsg.ItemComposeRsp) {
        let isShow = true
        let text = '';
        if (data.list.length > 0) {
            text = ',获得';
            let i = 0;
            data.list.forEach(item => {
                let cfg = ConfigManager.getItemById(ItemCfg, item.typeId);
                let chipType = Math.floor(item.typeId / 1000)
                if (chipType == 120) {
                    isShow = false
                }
                if (cfg) {
                    text = text + cfg.name + 'X' + item.num;
                    if (i > 0) {
                        text = text + ','
                    }
                    i++;
                }
                else {
                    isShow = false;
                }
            })
        }
        if (!isShow || text == "") {
            return
        }
        // gdk.gui.showMessage("合成成功" + text);
    }

    _onSystemErrorRsp(data: icmsg.SystemErrorRsp) {
        if (data.code == 800 || data.code == 843) {

            gdk.Timer.callLater(this, () => {
                let info: AskInfoType = {
                    title: gdk.i18n.t("i18n:TIP_TITLE"),
                    sureCb: () => {
                        PanelId.AskPanel.isTouchMaskClose = true
                        if (gdk.panel.isOpenOrOpening(PanelId.LotteryEffect)) {
                            gdk.panel.hide(PanelId.LotteryEffect);
                        }
                        gdk.panel.setArgs(PanelId.HeroResetView, 1);
                        gdk.panel.open(PanelId.HeroResetView);
                    },
                    oneBtn: true,
                    sureText: "去分解",
                    descText: "英雄背包已满,分解多余的英雄清理背包",
                    closeBtnCb: () => {
                        PanelId.AskPanel.isTouchMaskClose = true
                    },
                }
                PanelId.AskPanel.isTouchMaskClose = false
                GlobalUtil.openAskPanel(info)
            })
        }
    }
}