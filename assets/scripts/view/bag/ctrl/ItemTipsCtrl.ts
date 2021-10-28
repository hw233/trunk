import BagModel, { BagItem, BagType } from '../../../common/models/BagModel';
import BagUtils from '../../../common/utils/BagUtils';
import ChatUtils from '../../chat/utils/ChatUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import FootHoldModel from '../../guild/ctrl/footHold/FootHoldModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroDetailViewCtrl from '../../lottery/ctrl/HeroDetailViewCtrl';
import ItemCompositeViewCtrl from './ItemCompositeViewCtrl';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import SelectGiftGetCtrl from './SelectGiftGetCtrl';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import {
    Copy_stageCfg,
    Foothold_globalCfg,
    HeadframeCfg,
    Hero_careerCfg,
    HeroCfg,
    Item_composeCfg,
    Item_drop_groupCfg,
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
 * @Last Modified time: 2021-09-16 10:41:40
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/ItemTipsCtrl")
export default class ItemTipsCtrl extends gdk.BasePanel {

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

    @property(cc.Node)
    heroLookBtn: cc.Node = null;

    itemInfo: BagItem = null
    baseConfig: ItemCfg = null

    _heroCfg: HeroCfg;

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
        let militaryItemId = ConfigManager.getItemById(Foothold_globalCfg, "rank_icon").value[0]
        if (itemInfo.type == BagType.ITEM) {
            if (this.baseConfig.id == militaryItemId) {
                this.numLab.string = `${ModelManager.get(FootHoldModel).militaryExp}`
            } else {
                this.numLab.string = `${BagUtils.getItemNumById(itemInfo.itemId)}`
            }
        } else {
            this.numLab.node.parent.active = false
        }

        this.title = config.name;
        this._titleLabel.node.color = BagUtils.getColor(config.color);

        this.descLab.string = GlobalUtil.makeItemDes(itemInfo.itemId);
        if (config instanceof ItemCfg && config.func_id == 'add_head_frame') {
            let frameCfg = ConfigManager.getItemById(HeadframeCfg, config.func_args[0]);
            if (frameCfg && frameCfg.attribute_desc) {
                let str = '<br/>' + gdk.i18n.t("i18n:MAIN_SET_TIP4").replace('{0}', frameCfg.attribute_desc) + '<br/>';
                let types = ['w', 'p']; // 固定值 百分比
                let attrs = ['atk', 'hp', 'def', 'hit', 'dodge', 'crit'];
                let attrNames = [
                    gdk.i18n.t("i18n:ATTR_NAME_ATK"), //攻击
                    gdk.i18n.t("i18n:ATTR_NAME_HP"),    //生命
                    gdk.i18n.t("i18n:ATTR_NAME_DEF"),   //防御
                    gdk.i18n.t("i18n:ATTR_NAME_HIT"),   //命中
                    gdk.i18n.t("i18n:ATTR_NAME_DODGE"), //闪避
                    gdk.i18n.t("i18n:ATTR_NAME_CRIT"),  //暴击
                ];
                attrs.forEach((attr, idx) => {
                    for (let i = 0; i < types.length; i++) {
                        let value = frameCfg[`${attr}_${types[i]}`];
                        let s = `${value}`;
                        if (value) {
                            if (i == 1) {
                                //万分比
                                s = `${value / 100}%`;
                            }
                            str += `<color=#00FF00>${attrNames[idx]}+${s}</c><br/>`;
                            break;
                        }
                    }
                });
                if (str.length > 0) {
                    str = str.slice(0, str.length - '<br/>'.length);
                }

                this.descLab.string += str;
            }
        }

        if (itemInfo.extInfo) {
            // this.shareBtn.active = !noBtn;
            this.shareBtn.active = false;
            if (config.use_type == 1 && !gdk.panel.isOpenOrOpening(PanelId.PveScene)) {
                this.jumpBtn.active = false;
                this.useBtn.active = true;
                this.btnLab.string = config.disint_desc || `${gdk.i18n.t("i18n:BAG_TIP7")}`;
                // this.useBtn.y = -this.panel.height / 2 //- this.useBtn.height / 2
                //跳转到碎片合成界面
            } else if (config.use_type == 5) {
                this.useBtn.active = false;
                if (config.color < 4) {
                    this.jumpBtn.active = true;
                    this.jumpBtnLab.string = config.disint_desc || `${gdk.i18n.t("i18n:BAG_TIP8")}`;
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
        if (config.use_type == 4 || (config.func_id == 'add_drop_items' && config.func_args3 == 1)) {
            let dropCfgs = ConfigManager.getItemsByField(Item_dropCfg, 'drop_id', config.func_args[0]);
            let items = [];
            if (dropCfgs && dropCfgs.length > 0) {
                dropCfgs.forEach(cfg => {
                    if (cfg.item_id && cfg.item_id > 0) {
                        let itemId = cfg.item_id
                        let star = 0
                        if (String(itemId).length > 6) {
                            let type = BagUtils.getItemTypeById(itemId)
                            if (type == BagType.HERO) {
                                itemId = parseInt(cfg.item_id.toString().slice(0, 6))
                                star = parseInt(cfg.item_id.toString().slice(7))
                            }
                        }
                        items.push([itemId, cfg.item_num, star]);
                    }
                })
            }

            //找不到 继续找随机礼包里的
            if (items.length == 0) {
                let dropGroups = []
                dropCfgs.forEach(element => {
                    dropGroups = dropGroups.concat(ConfigManager.getItemsByField(Item_drop_groupCfg, "group_id", element.group_id))
                });
                if (dropGroups && dropGroups.length > 0) {
                    dropGroups.forEach(cfg => {
                        if (cfg.item_id && cfg.item_id > 0) {
                            let itemId = cfg.item_id
                            let star = 0
                            let type = BagUtils.getItemTypeById(itemId)
                            if (type == BagType.GUARDIANEQUIP || type == BagType.HERO) {
                                itemId = parseInt(cfg.item_id.toString().slice(0, 6))
                                star = parseInt(cfg.item_id.toString().slice(7))
                            }
                            items.push([itemId, 1, star]);
                        }
                    })
                }
            }

            if (items.length > 0) {
                this.giftPreviewNode.active = true;
                let scrollView = this.giftPreviewNode;
                let content = this.giftPreviewNode.getChildByName('content');
                content.removeAllChildren();
                items.forEach(item => {
                    let slot = cc.instantiate(this.giftItemPrefab);
                    slot.parent = content;
                    let ctrl = slot.getComponent(UiSlotItem);
                    let itemId = item[0]
                    let itemNum = item[1]
                    let star = item[2]
                    if (BagUtils.getItemTypeById(itemId) == BagType.HERO) {
                        let heroCfg = <HeroCfg>BagUtils.getConfigById(itemId);
                        ctrl.group = heroCfg.group[0];
                        ctrl.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', heroCfg.career_id).career_type;
                        ctrl.isCanPreview = true;
                    } else if (BagUtils.getItemTypeById(itemId) == BagType.GUARDIANEQUIP) {
                        if (itemId.toString().length > 6) {
                            itemId = parseInt(item[0].toString().slice(0, 6))
                            star = parseInt(item[0].toString().slice(7))
                        }
                    }
                    ctrl.updateItemInfo(itemId, itemNum);
                    if (star > 0) {
                        ctrl.updateStar(star)
                        ctrl.starNum = star
                    }
                    ctrl.itemInfo = {
                        series: null,
                        itemId: itemId,
                        itemNum: itemNum,
                        type: BagUtils.getItemTypeById(itemId),
                        extInfo: null
                    }
                    slot.setScale(.7, .7);
                });
                content.getComponent(cc.Layout).updateLayout();
                if (items.length > 4) {
                    scrollView.height = 220;
                }
                else {
                    scrollView.height = content.height;
                }
            }
        }

        this.heroLookBtn.active = false;
        if (config.use_type == 5) {
            let comCfg = ConfigManager.getItemById(Item_composeCfg, itemInfo.itemId);
            if (comCfg && comCfg.target) {
                this._heroCfg = ConfigManager.getItemById(HeroCfg, comCfg.target)
                this.heroLookBtn.active = !!this._heroCfg
            }
        }

    }

    heroLookFunc() {
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl)
            comp.initHeroInfo(this._heroCfg)
        })
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
