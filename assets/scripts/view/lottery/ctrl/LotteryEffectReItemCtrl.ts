import BagUtils from '../../../common/utils/BagUtils';
import ButtonSoundId from '../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroGetCtrl from './HeroGetCtrl';
import HeroUtils from '../../../common/utils/HeroUtils';
import LotteryModel from '../model/LotteryModel';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagType } from '../../../common/models/BagModel';
import {
    Hero_starCfg,
    HeroCfg,
    Item_equipCfg,
    ItemCfg
    } from '../../../a/config';
import { ItemSubType } from '../../decompose/ctrl/DecomposeViewCtrl';
import { LotteryEventId } from '../enum/LotteryEventId';

/**
 * @Description: 恭喜获得道具子项
 * @Author: luoyong
 * @Date: 2019-09-16 11:31:21
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 13:33:56
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/LotteryEffectReItemCtrl")
export default class LotteryEffectReItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    itemShowNode: cc.Node = null
    @property(cc.Node)
    pzgjinNode: cc.Node = null
    @property(cc.Node)
    pzgziNode: cc.Node = null
    @property(cc.Node)
    newIcon: cc.Node = null
    @property(sp.Skeleton)
    chipSpine: sp.Skeleton = null;

    showAni: cc.Animation
    jinAni: cc.Animation
    ziAni: cc.Animation

    chipId: number = 0;
    chipNum: number = 0;

    isFlip: boolean = false;

    get lotteryModel(): LotteryModel {
        return ModelManager.get(LotteryModel)
    }

    start() {
    }

    onEnable() {
        gdk.e.on(LotteryEventId.SHOW_NEXT_ITEM, this._onShowNextItem, this);
    }

    onDestroy() {
        gdk.e.targetOff(this);
        this.unscheduleAllCallbacks();
    }

    onDisable() {
    }

    /**
     * data结构 index:xxxx, typeId: xxx, num: xxx, isShowHero:xxx
     */
    updateView() {
        this.node.active = this.isFlip; //全部隐藏
        let starNum = 0
        let typeId: number = this.data.typeId;
        starNum = this.data.typeId.toString().length >= 8 ? parseInt(this.data.typeId.toString().slice(6)) : 0;
        typeId = this.data.typeId.toString().length >= 8 ? parseInt(this.data.typeId.toString().slice(0, 6)) : this.data.typeId;
        if (BagUtils.getItemTypeById(typeId) == BagType.HERO) {
            this.newIcon.active = HeroUtils.getHeroListByTypeId(typeId).length <= 1;
            starNum = starNum > 0 ? starNum : ConfigManager.getItemById(HeroCfg, this.data.typeId).star_min
        } else {
            this.newIcon.active = false
            if (BagUtils.getItemTypeById(typeId) == BagType.EQUIP) {
                starNum = ConfigManager.getItemById(Item_equipCfg, typeId).star
            }
            else if (BagUtils.getItemTypeById(typeId) == BagType.ITEM) {
                starNum = 0;
            }
        }

        // if (this.data.typeId < 300000 && this.chipId == 0 && this.data.typeId != 140012) {
        //     this.chipId = this.data.typeId;
        //     this.chipNum = this.data.num;
        //     let heroCfg = ConfigManager.getItemByField(HeroCfg, "chip_id", this.chipId);
        //     if (heroCfg) {
        //         this.data.typeId = heroCfg.id;
        //         starNum = heroCfg.star_min
        //     }
        //     this.data.num = 1;
        // }

        let itemType = BagUtils.getItemTypeById(typeId)
        let info = null;
        let itemNum = 1;
        //装备详情显示
        if (itemType == BagType.EQUIP) {
            info = new icmsg.EquipInfo()
            info.typeId = this.data.id
            info.heroId = 0
            info.equipId = 1
            info.level = 1
        }
        if (itemType == BagType.ITEM) {
            itemNum = this.data.num;
        }

        this.slot.starNum = starNum;
        this.slot.group = itemType == BagType.HERO ? ConfigManager.getItemById(HeroCfg, typeId).group[0] : 0;
        this.slot.updateItemInfo(typeId, this.data.num)
        this.slot.onClick.on(() => {
            let typeId: number = this.data.typeId;
            typeId = this.data.typeId.toString().length >= 8 ? parseInt(this.data.typeId.toString().slice(0, 6)) : this.data.typeId;
            if (itemType == BagType.HERO) {
                let isNew = HeroUtils.getHeroListByTypeId(typeId).length <= 1;
                gdk.panel.open(PanelId.HeroReward, (node: cc.Node) => {
                    let comp = node.getComponent(HeroGetCtrl)
                    comp.showLotteryEffectHero(this.data.typeId, isNew);
                })
            }
            else {
                let itemInfo = {
                    series: null,
                    itemId: typeId,
                    itemNum: itemNum,
                    type: itemType,
                    extInfo: null,
                }
                GlobalUtil.openItemTips(itemInfo, false, false);
            }
        })
        this.showAni = this.itemShowNode.getComponent(cc.Animation)
        this.jinAni = this.pzgjinNode.getComponent(cc.Animation)
        this.ziAni = this.pzgziNode.getComponent(cc.Animation)

        this.chipSpine.node.active = true;
        this.itemShowNode.active = true
        if (this.data.immediately) {
            this.showItem();
        }
        else {
            if (this.data.index == this.list.items.length - 1) {
                gdk.e.emit(LotteryEventId.SHOW_NEXT_ITEM, [0]);
            }
        }
    }

    showItem() {
        if (!this.node) return
        if (this.data.index == 8) {
            this.node.active = false;
            gdk.e.emit(LotteryEventId.SHOW_NEXT_ITEM, [this.data.index + 1]);
            return;
        }
        this.node.active = true;
        //播放出现动画
        // this.showAni.on('finished', this.showItemPz, this);
        this.showAni.play();

        this.pzgjinNode.active = false;
        this.pzgziNode.active = false;

        let typeId: number = this.data.typeId;
        typeId = this.data.typeId.toString().length >= 8 ? parseInt(this.data.typeId.toString().slice(0, 6)) : this.data.typeId;

        let type = BagUtils.getItemTypeById(typeId)
        if (type == BagType.HERO || type == BagType.EQUIP) {
            let itemConfig = <any>BagUtils.getConfigById(typeId)
            if (itemConfig && GlobalUtil.isSoundOn) {
                if (itemConfig.color == 3 || itemConfig.color == 4) {
                    gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.result)
                } else {
                    gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.common)
                }
            }
        }

        gdk.Timer.once(500, this, this.showItemPz);
        // this.showItemPz();
    }

    //设置品质动画
    showItemPz() {
        // this.showAni && this.showAni.off('finished', this.showItemPz, this);
        if (!this.itemShowNode) return;
        this.itemShowNode.active = false
        //播放品质特效
        let typeId: number = this.data.typeId;
        typeId = this.data.typeId.toString().length >= 8 ? parseInt(this.data.typeId.toString().slice(0, 6)) : this.data.typeId;
        let itemConfig = <any>BagUtils.getConfigById(typeId)
        let color = itemConfig.defaultColor;
        if (this.data.typeId.toString().length >= 8) {
            let star = parseInt(this.data.typeId.toString().slice(6));
            color = ConfigManager.getItemById(Hero_starCfg, star).color;
        }
        //碎片不要播放品质特效，本身就有特效了
        if (itemConfig instanceof ItemCfg && itemConfig.style && itemConfig.style == 1) {

        }
        else if (itemConfig) {
            let subType = Math.floor(this.data.typeId / 10000);
            if (itemConfig.use_type != 6 && subType != ItemSubType.HEROCHIP) {
                if (color == 3) {
                    this.pzgziNode.active = true;
                    this.ziAni.play();
                } else if (color == 4) {
                    this.pzgjinNode.active = true;
                    this.jinAni.play();
                }
            } else {
                if (color == 3) {
                    this.chipSpine.node.active = true;
                    this.chipSpine.setAnimation(0, "stand2", true)
                } else if (color == 4) {
                    this.chipSpine.node.active = true;
                    this.chipSpine.setAnimation(0, "stand", true)
                }
            }
        }

        if (this.data.isShowHero && BagUtils.getItemTypeById(typeId) == BagType.HERO) {
            this.showHeroInfo();
        }
        else {
            if (this.list && this.list.items) {
                if (this.list.items.length > 2) {
                    if (this.data.index == this.list.items.length - 1) {
                        gdk.e.emit(LotteryEventId.SHOW_ITEM_END);
                    }
                    else {
                        !this.data.immediately && gdk.e.emit(LotteryEventId.SHOW_NEXT_ITEM, [this.data.index + 1]);
                    }
                }
                else {
                    gdk.e.emit(LotteryEventId.SHOW_ITEM_END);
                }
            }
        }
    }

    showHeroInfo() {
        if (this.data && this.data.isShowHero) {
            let self = this;
            let panel = gdk.panel.get(PanelId.HeroReward);
            let typeId: number = this.data.typeId;
            typeId = this.data.typeId.toString().length >= 8 ? parseInt(this.data.typeId.toString().slice(0, 6)) : this.data.typeId;
            let isNew = HeroUtils.getHeroListByTypeId(typeId).length <= 1;
            if (panel) {
                let comp = panel.getComponent(HeroGetCtrl)
                comp.showLotteryEffectHero(this.data.typeId, isNew);
            }
            else {
                gdk.panel.open(PanelId.HeroReward, (node: cc.Node) => {
                    let comp = node.getComponent(HeroGetCtrl)
                    comp.showLotteryEffectHero(this.data.typeId, isNew);
                    let hideTrigger = gdk.NodeTool.onStartHide(node);
                    let unShowHeroListLen = comp.unShowHeroList.length;
                    hideTrigger.on(() => {
                        hideTrigger.targetOff(self);
                        gdk.Timer.once(20, this, () => {
                            if (!this.data.immediately) {
                                if (this.list.items.length >= 2) {
                                    gdk.e.emit(LotteryEventId.SHOW_NEXT_ITEM, [this.data.index + 1]);
                                    if (this.data.index == this.list.items.length - 1) {
                                        gdk.e.emit(LotteryEventId.SHOW_ITEM_END);
                                    }
                                }
                                else {
                                    gdk.e.emit(LotteryEventId.SHOW_ITEM_END);
                                }
                            }
                            else {
                                if (unShowHeroListLen <= 0) gdk.e.emit(LotteryEventId.SHOW_ITEM_END);
                            }
                        })
                    });
                })
            }
        }
    }

    _onShowNextItem(e) {
        if (this.data.index == e.data[0]) {
            !this.data.immediately && this.showItem();
        }
    }
}
