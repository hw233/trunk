import AdventureUtils from '../../view/adventure/utils/AdventureUtils';
import BagUtils from '../utils/BagUtils';
import ButtonSoundId from '../../configs/ids/ButtonSoundId';
import GlobalUtil from '../utils/GlobalUtil';
import PanelId from '../../configs/ids/PanelId';
import UiSlotItem from './UiSlotItem';
import VipEffectViewCtrl from '../../view/store/ctrl/recharge/VipEffectViewCtrl';
import { BagType } from '../models/BagModel';
import { MoneyType } from '../../view/store/ctrl/StoreViewCtrl';

/**
 * 红点组件
 * @Author: sthoo.huang
 * @Date: 2019-06-26 19:59:16
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-17 21:57:14
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/RewardItemFlyCtrl")
export default class RewardItemFlyCtrl extends cc.Component {

    @property(cc.Prefab)
    uiSoltItem: cc.Prefab = null

    @property(cc.Prefab)
    diamondPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    goldPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    vipExpPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    vipEffectPrefab: cc.Prefab = null;

    /**
    * 随机范围(random1~random2之间)
    */
    random1: number = -200
    random2: number = 200
    createTime: number = 0.1
    speed: number = 1000
    specialFly: any = {};// id-worldPos

    onEnable() {

    }

    onDisable() {
        gdk.e.targetOff(this);
    }

    flyAction(datas, specialFly = {}) {
        this.specialFly = specialFly;
        let content = gdk.gui.layers.guideLayer
        let goldId = 0
        let diamondId = 0
        let vipExpId = 0
        let num = 0
        let keys = Object.keys(this.specialFly);
        let keyIds = keys.map(key => { return parseInt(key); });
        if (datas && datas.length > 0) {
            for (let i = 0; i < datas.length; i++) {
                let itemId = datas[i].typeId
                num = datas[i].num
                let typeId: number;
                typeId = itemId.toString().length >= 8 ? parseInt(itemId.toString().slice(0, 6)) : itemId;
                if (BagUtils.getItemTypeById(typeId) != BagType.MONEY && keyIds.indexOf(typeId) == -1) {
                    this.itemFly(content, itemId, datas)
                } else if (keyIds.indexOf(typeId) !== -1) {
                    this.specialItemFly(content, itemId, this.specialFly[itemId])
                }
                else {
                    if (typeId == MoneyType.Gold) {
                        goldId = typeId
                    } else if (typeId == MoneyType.Diamond) {
                        diamondId = typeId
                    } else if (typeId == MoneyType.VipExp) {
                        vipExpId = typeId
                    }
                }
            }
        }
        if (goldId > 0) {
            this.moneyFly(content, goldId)
        }
        if (diamondId > 0) {
            this.moneyFly(content, diamondId)
        }

        if (vipExpId > 0) {
            if (this.vipExpPrefab) {
                this.moneyFly(content, vipExpId)
                let vipEffect = cc.instantiate(this.vipEffectPrefab)
                vipEffect.name = "vipEffect"
                let ctrl = vipEffect.getComponent(VipEffectViewCtrl)
                gdk.gui.layers.guideLayer.addChild(vipEffect)
                ctrl.playEffect(() => {
                    let node = gdk.gui.layers.guideLayer.getChildByName("vipEffect")
                    if (node) {
                        gdk.gui.layers.guideLayer.removeChild(node)
                    }
                })
            }
        }
    }

    specialItemFly(content, itemId, worldPos) {
        let typeId: number;
        typeId = itemId.toString().length >= 8 ? parseInt(itemId.toString().slice(0, 6)) : itemId;
        let star = itemId.toString().length >= 8 ? parseInt(itemId.toString().slice(6)) : 0;
        let item = cc.instantiate(this.uiSoltItem)
        item.scale = 0.9
        let ctrl = item.getComponent(UiSlotItem)
        ctrl.updateItemInfo(typeId)
        if (star !== 0) {
            ctrl.starNum = star;
            // ctrl.updateStar(star);
        }
        item.parent = content

        let rannumx = Math.floor(Math.random() * (this.random2 - this.random1 + 1) + this.random1)
        let rannumy = Math.floor(Math.random() * (this.random2 - this.random1 + 1) / 1.5 + this.random1 / 1.5)
        item.runAction(cc.moveBy(this.createTime, rannumx, rannumy))

        gdk.Timer.once(this.createTime * 1000, this, () => {
            item.stopAllActions()
            let finshend = cc.callFunc(function () {
                item.destroy()
            }, this);
            let pos = item.getPosition()
            let endPos = content.convertToNodeSpaceAR(worldPos)
            let playTime = pos.sub(endPos).mag() / this.speed
            item.runAction(cc.sequence(cc.spawn(cc.moveTo(playTime, endPos.x, endPos.y), cc.scaleTo(playTime, 0.4)), finshend))
        });

        if (itemId == 100084) {
            gdk.Timer.once(500, this, () => {
                AdventureUtils.setGuideStep(210015)
            })
        }
    }

    itemFly(content, itemId, datas) {
        let typeId: number;
        typeId = itemId.toString().length >= 8 ? parseInt(itemId.toString().slice(0, 6)) : itemId;
        let star = itemId.toString().length >= 8 ? parseInt(itemId.toString().slice(6)) : 0;
        let item = cc.instantiate(this.uiSoltItem)
        item.scale = 0.9
        let ctrl = item.getComponent(UiSlotItem)
        ctrl.updateItemInfo(typeId)
        if (star !== 0) {
            ctrl.starNum = star;
            // ctrl.updateStar(star);
        }
        item.parent = content
        let rannumx = Math.floor(Math.random() * (this.random2 - this.random1 + 1) + this.random1)
        let rannumy = Math.floor(Math.random() * (this.random2 - this.random1 + 1) / 1.5 + this.random1 / 1.5)
        if (datas.length > 1) {
            item.runAction(cc.moveBy(this.createTime, rannumx, rannumy))
        }
        gdk.Timer.once(this.createTime * 1000, this, () => {
            item.stopAllActions()
            let finshend = cc.callFunc(function () {
                item.destroy()
            }, this);
            let pos = item.getPosition()
            let dsz = cc.view.getVisibleSize();
            let endPos = cc.v2(150, -dsz.height / 2 + 50)
            let playTime = pos.sub(endPos).mag() / this.speed
            item.runAction(cc.sequence(cc.spawn(cc.moveTo(playTime, endPos.x, endPos.y), cc.scaleTo(playTime, 0.4)), finshend))
        });
    }

    moneyFly(content, itemId) {
        let createNum = 15
        let posX = 0
        if (GlobalUtil.isSoundOn) {
            gdk.sound.stop()
            gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.income);
        }
        for (let i = 0; i < createNum; i++) {
            let item: cc.Node = null
            if (itemId == MoneyType.Gold) {
                item = cc.instantiate(this.goldPrefab)
                posX = 150
            } else if (itemId == MoneyType.Diamond) {
                item = cc.instantiate(this.diamondPrefab)
                posX = 0
            } else if (itemId == MoneyType.VipExp) {
                item = cc.instantiate(this.vipExpPrefab)
                posX = 0
            }
            if (item) {
                item.parent = content
                let rannumx = Math.floor(Math.random() * (this.random2 - this.random1 + 1) + this.random1)
                let rannumy = Math.floor(Math.random() * (this.random2 - this.random1 + 1) / 1.5 + this.random1 / 1.5)
                item.runAction(cc.moveBy(this.createTime, rannumx, rannumy))
                let finshend = cc.callFunc(function () {
                    item.destroy()
                }, this);

                gdk.Timer.once(this.createTime * 1000, this, () => {
                    item.stopAllActions()
                    let pos = item.getPosition()
                    let dsz = cc.view.getVisibleSize();
                    let endPos = cc.v2(posX, dsz.height / 2)
                    let playTime = pos.sub(endPos).mag() / this.speed
                    item.runAction(cc.sequence(cc.moveTo(playTime, endPos.x, endPos.y), finshend))
                });
            }
        }
    }

}