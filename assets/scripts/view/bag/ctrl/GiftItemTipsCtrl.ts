import BagModel, { BagItem, BagType } from '../../../common/models/BagModel';
import BagUtils from '../../../common/utils/BagUtils';
import ChatUtils from '../../chat/utils/ChatUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ItemCompositeViewCtrl from './ItemCompositeViewCtrl';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import SelectGiftGetCtrl from './SelectGiftGetCtrl';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import {
    Copy_stageCfg,
    Hero_careerCfg,
    HeroCfg,
    Item_composeCfg,
    Item_dropCfg,
    ItemCfg
    } from '../../../a/config';
import { SelectGiftInfo } from './SelectGiftViewCtrl';

/** 
 * 物品提示面板
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-21 09:57:55 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-10 18:35:35
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/GiftItemTipsCtrl")
export default class GiftItemTipsCtrl extends gdk.BasePanel {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    useBtn: cc.Node = null

    @property(cc.Node)
    shareBtn: cc.Node = null

    @property(cc.Label)
    btnLab: cc.Label = null

    @property(cc.Label)
    numLab: cc.Label = null

    @property(cc.RichText)
    descLab: cc.RichText = null

    @property(cc.Node)
    panel: cc.Node = null

    @property(cc.Node)
    jumpBtn: cc.Node = null;

    @property(cc.Label)
    jumpBtnLab: cc.Label = null;

    @property(cc.Node)
    expTipsNode: cc.Node = null;

    @property(cc.Node)
    usePreviewNode: cc.Node = null;

    @property(cc.Node)
    giftPreviewNode: cc.Node = null;

    @property(cc.Prefab)
    giftItemPrefab: cc.Prefab = null;

    itemInfo: BagItem = null
    baseConfig: ItemCfg = null

    get bagModel(): BagModel { return ModelManager.get(BagModel); }

    onEnable() {
        this.shareBtn.active = false;
        let [itemInfo, noBtn] = this.args;
        if (itemInfo) {
            this.initItemInfo(itemInfo, noBtn);
        }
    }

    onDestroy() {
        let panel = gdk.panel.get(PanelId.Bag)
        if (panel) {
            this.bagModel.tipsRecordItem = null
        }
    }

    /**
     * 初始化背包提示
     * @param itemInfo 装备数据
     * @param noBtn 在有extInfo的情况下,是否需要显示按钮
     */
    initItemInfo(itemInfo: BagItem, noBtn: boolean = false) {
        this.itemInfo = itemInfo;
        let config = <ItemCfg>BagUtils.getConfigById(itemInfo.itemId);
        if (!config) {
            return;
        }
        this.baseConfig = config;

        this.descLab.string = config.des;
        this.slot.updateItemInfo(itemInfo.itemId, itemInfo.itemNum);
        if (itemInfo.type == BagType.ITEM) {
            this.numLab.string = `${BagUtils.getItemNumById(itemInfo.itemId)}`
        } else {
            this.numLab.node.parent.active = false
        }

        this.title = config.name;
        this._titleLabel.node.color = BagUtils.getColor(config.color);

        // let args = config.func_args;
        // let str = config.des;
        // let n: number = args ? args.length : 0;
        // let func_args = "func_args";
        // let disint_item = "disint_item";
        // if (n > 0) {
        //     for (let i = 0; i < n; i++) {
        //         str = StringUtils.replace(str, "{" + func_args + "}", args[i]);
        //     }
        // } else {
        //     //非分解类型
        //     if (config.func_args == "" && config.disint_item.length > 0) {
        //         let num = config.disint_item[0][1];
        //         str = StringUtils.replace(str, "{" + disint_item + "}", num);
        //     }
        // }
        // this.descLab.string = str;
        this.descLab.string = GlobalUtil.makeItemDes(itemInfo.itemId);

        if (itemInfo.extInfo) {
            // this.shareBtn.active = !noBtn;
            this.shareBtn.active = false;
            if (config.use_type == 1) {
                this.jumpBtn.active = false;
                this.useBtn.active = true;
                this.btnLab.string = config.disint_desc || `${gdk.i18n.t("i18n:BAG_TIP7")}`;
                // this.useBtn.y = -this.panel.height / 2 //- this.useBtn.height / 2
                //跳转到碎片合成界面
            } else if (config.use_type == 5) {
                this.useBtn.active = false;
                if (config.color < 4) {
                    this.jumpBtn.active = true;
                    this.jumpBtnLab.string = config.disint_desc || `${gdk.i18n.t("i18n:BAG_TIP8")}`;;
                    // this.jumpBtn.y = -this.panel.height / 2 //- this.useBtn.height / 2
                } else {
                    this.jumpBtn.active = false;
                }
            } else {
                this.useBtn.active = false;
                this.jumpBtn.active = false;
            }
        } else {
            this.shareBtn.active = false;
            this.useBtn.active = false;
            this.jumpBtn.active = false;
        }

        let idx = [100008, 100009, 100010, 100011].indexOf(itemInfo.itemId);
        if (idx != -1) {
            this.expTipsNode.active = true;
            this.expTipsNode.getChildByName('label').getComponent(cc.Label).string = ['2小时', '6小时', '12小时', '24小时'][idx];
            let hangSid = ModelManager.get(CopyModel).hangStageId;
            let cfg = ConfigManager.getItemById(Copy_stageCfg, hangSid);
            this.usePreviewNode.active = !!cfg;
            if (cfg) {
                let num = [2, 6, 12, 24][idx] * 60 * cfg.drop_show2[2] * itemInfo.itemNum;
                this.usePreviewNode.getChildByName('numLabel').getComponent(cc.Label).string = GlobalUtil.numberToStr2(num, true);
            }
        }
        else {
            this.expTipsNode.active = false;
            this.usePreviewNode.active = false;
        }

        this.giftPreviewNode.active = false;
        if (config.use_type == 4) {
            let dropCfgs = ConfigManager.getItemsByField(Item_dropCfg, 'drop_id', config.func_args[0]);
            if (dropCfgs && dropCfgs.length > 0) {
                let items: number[][] = [];
                dropCfgs.forEach(cfg => {
                    items.push([cfg.item_id, cfg.item_num]);
                })
                if (items.length > 0) {
                    this.giftPreviewNode.active = true;
                    let scrollView = this.giftPreviewNode;
                    let content = this.giftPreviewNode.getChildByName('content');
                    content.removeAllChildren();
                    items.forEach(item => {
                        let slot = cc.instantiate(this.giftItemPrefab);
                        slot.parent = content;
                        let ctrl = slot.getComponent(UiSlotItem);
                        if (BagUtils.getItemTypeById(item[0]) == BagType.HERO) {
                            let heroCfg = <HeroCfg>BagUtils.getConfigById(item[0]);
                            ctrl.group = heroCfg.group[0];
                            ctrl.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', heroCfg.career_id).career_type;
                            ctrl.isCanPreview = true;
                        }
                        ctrl.updateItemInfo(item[0], item[1]);
                        ctrl.itemInfo = {
                            series: null,
                            itemId: item[0],
                            itemNum: item[1],
                            type: BagUtils.getItemTypeById(item[0]),
                            extInfo: null
                        }
                        slot.setScale(.7, .7);
                    });
                    content.getComponent(cc.Layout).updateLayout();
                    if (items.length > 4) {
                        scrollView.height = 230;
                    }
                    else {
                        scrollView.height = content.height;
                    }
                }
            }
        }
        // let btnText: string = this.baseConfig.disint_desc || "";
        // this.btnLab.string = btnText;
        // if (itemInfo.extInfo) {
        //     this.useBtn.active = !noBtn
        //     this.shareBtn.active = !noBtn

        //     if (this.baseConfig.use_type == 1) {
        //         this.useBtn.active = true
        //     } else {
        //         this.useBtn.active = false
        //     }
        // } else {
        //     this.useBtn.active = false
        //     this.shareBtn.active = false
        // }

        // if (this.useBtn.active) {
        //     this.useBtn.y = -this.panel.height / 2 //- this.useBtn.height / 2
        // }
    }

    /**物品使用 */
    useFunc() {
        if (this.baseConfig.use_type == 0) {
            // type=0时,为跳转
            let forward: number[] = this.baseConfig.get
            if (forward && forward.length > 0) {
                JumpUtils.openView(forward[0])
            }
        } else if (this.itemInfo.itemNum == 1) {
            // 单个使用
            let goodInfo: icmsg.GoodsInfo = new icmsg.GoodsInfo()
            goodInfo.num = 1
            goodInfo.typeId = this.itemInfo.itemId
            let msg = new icmsg.ItemDisintReq()
            msg.items = [goodInfo];
            NetManager.send(msg)
        } else if (this.baseConfig.use_type == 1) {
            // 批量使用
            var itemInfo = this.itemInfo
            let info: SelectGiftInfo = {
                index: 0,
                itemId: itemInfo.itemId,
                num: itemInfo.itemNum,
                mainId: itemInfo.itemId,
                giftType: -1
            }
            gdk.panel.open(PanelId.SelectGiftGet, (node: cc.Node) => {
                let comp = node.getComponent(SelectGiftGetCtrl)
                comp.initRewardInfo(info)
            })
        }
        this.close()
    }

    /**物品跳转 */
    jumpFunc() {
        // 跳转到召唤合成界面
        // if (this.baseConfig.use_type == 5) {
        //     let idx = this.baseConfig.color - 1;
        //     let cfg = ConfigManager.getItemByField(HeroCfg, 'chip_id', this.baseConfig.id)
        //     cfg && gdk.panel.setArgs(PanelId.SynthesisPanel, cfg.id);
        //     JumpUtils.openCompose()
        // }
        if (this.baseConfig.use_type == 5) {
            let itemData = this.itemInfo;
            let itemCfg = ConfigManager.getItemById(ItemCfg, itemData.itemId)
            let comCfg = ConfigManager.getItemById(Item_composeCfg, itemData.itemId)
            if (comCfg) {
                if (itemCfg.random_hero_chip && itemCfg.random_hero_chip.length >= 2) {
                    gdk.panel.open(PanelId.ItemComposite, (node: cc.Node) => {
                        let comp = node.getComponent(ItemCompositeViewCtrl)
                        comp.initRewardInfo(itemData.itemId)
                    })
                }
                else {
                    GlobalUtil.openItemTips(itemData, false, false, gdk.Tool.getResIdByNode(this.node))
                }
            }
        }
        this.close();
    }

    /**装备分享 */
    shareBtnFunc() {
        ChatUtils.sendShareItem(this.itemInfo)
        this.close()
    }

}
