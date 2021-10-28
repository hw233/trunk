import BagUtils from '../../../common/utils/BagUtils';
import ButtonSoundId from '../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import LotteryModel, { LotteryType } from '../model/LotteryModel';
import ModelManager from '../../../common/managers/ModelManager';
import MusicId from '../../../configs/ids/MusicId';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import {
    GeneCfg,
    GlobalCfg,
    ItemCfg,
    LuckydrawCfg
    } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { LotteryEventId } from '../enum/LotteryEventId';
import { StoreMenuType } from '../../store/ctrl/StoreViewCtrl';

/**
 * 抽卡效果
 * @Author: luoyong
 * @Date: 2019-09-16 11:10:27
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-12 19:44:57
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/LotteryEffectCtrl")
export default class LotteryEffectCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    lotteryEffectReItem: cc.Prefab = null

    @property(cc.Node)
    clickMask: cc.Node = null

    @property(cc.Button)
    btnAgain: cc.Button = null

    @property(cc.Button)
    btnClose: cc.Button = null

    @property(cc.Node)
    costIcon: cc.Node = null

    @property(cc.Label)
    costLab: cc.Label = null

    @property(cc.Node)
    costLayout: cc.Node = null

    @property(sp.Skeleton)
    spineAni: sp.Skeleton = null;

    goodList: icmsg.GoodsInfo[] = []

    list: ListView = null

    column: number = 4;

    isClick: boolean = false

    luckydrawCfg: LuckydrawCfg | GeneCfg;

    timeCount = 0

    get roleModel(): RoleModel {
        return ModelManager.get(RoleModel);
    }

    get lotteryModel(): LotteryModel {
        return ModelManager.get(LotteryModel)
    }

    onLoad() {

    }

    onEnable() {
        this.registerTouchListener()
        this.schedule(() => {
            this.timeCount += 1
        }, 1)

        if (GlobalUtil.isSoundOn) {
            gdk.sound.stop()
            gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.animation)
        }

        if (this.lotteryModel.isSkipAni && (!this.lotteryModel.lotteryType || this.lotteryModel.lotteryType == LotteryType.normal)) {
            this._onTouchEnded(null);
        }
    }

    registerTouchListener() {
        this.clickMask.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this)
    }

    unregisterTouchListener() {
        this.clickMask.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this)
    }

    _onTouchEnded(event: cc.Event.EventTouch) {
        let aniName = this.spineAni.animation;
        if (aniName && aniName == 'stand') {
            let ani = this.node.getComponent(cc.Animation)
            ani.stop("zh_sys");
            this.spineAni.setCompleteListener(null);
            this.spineAni.setAnimation(0, 'stand2', true);
            if (this.lotteryModel.lotteryType && this.lotteryModel.lotteryType == LotteryType.gene) {
                let cfg = ConfigManager.getItemById(GeneCfg, this.lotteryModel.curGenePoolId);
                this.showReward(this.lotteryModel.geneResultGoods, true, cfg);
            }
            else {
                this.showReward(this.lotteryModel.resultGoods, true);
            }
            gdk.e.emit(LotteryEventId.RSP_LUCKY_DRAW);
            if (GlobalUtil.isSoundOn) {
                gdk.sound.stop()
                gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.animation_2)
            }
        }
    }

    skipAni() {
        let ani = this.node.getComponent(cc.Animation)
        ani.stop("zh_sys");
        this.spineAni.setCompleteListener(null);
        this.spineAni.setAnimation(0, 'stand2', true);
        this.showReward(this.lotteryModel.resultGoods, true);
        gdk.e.emit(LotteryEventId.RSP_LUCKY_DRAW);
        if (GlobalUtil.isSoundOn) {
            gdk.sound.stop()
            gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.animation_2)
        }
    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
        this.unscheduleAllCallbacks()
        this.isClick = false
        this.lotteryModel.isCommonClick = false
        gdk.Timer.clearAll(this)
        gdk.e.targetOff(this);
    }

    _initListView() {
        if (this.list) {
            this.list.destroy()
        }

        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.lotteryEffectReItem,
            cb_host: this,
            async: true,
            column: this.column,
            gap_x: -40,
            gap_y: -100,
            direction: ListViewDir.Vertical,
        })
    }

    showReward(list, immediately: boolean = false, cfg?: any) {
        this.unregisterTouchListener()
        this.btnAgain.node.active = false
        this.btnClose.node.active = false
        // this.costLayout.active = false
        //循环动画
        // let ani2 = this.node.getComponent(cc.Animation)
        // ani2.play("zh_sys", 7.5)
        // this.schedule(() => {
        //     ani2.play("zh_sys", 7.5)
        // }, 0.6)

        this.goodList = list
        if (this.goodList.length < 5) {
            this.column = this.goodList.length
        }
        let row = Math.ceil(this.goodList.length / this.column)

        // 计算scrollview的宽高
        let svWidth = this.column * 140
        let svHeight = row * 180
        svHeight = Math.min(svHeight, 600)

        this.scrollView.node.setContentSize(cc.size(svWidth, svHeight))
        this.scrollView.node.x = -svWidth / 2
        this.scrollView.node.y = svHeight / 2

        //单抽 带一个 额外奖励(时空精粹)
        if (this.goodList.length <= 2) {
            this.scrollView.node.x -= 20
        }
        if (cfg && cfg instanceof GeneCfg) {
            this.luckydrawCfg = cfg;
            this.costLab.string = `${this.luckydrawCfg.item[1]}`
            GlobalUtil.setSpriteIcon(this.node, this.costLayout.getChildByName('ck_anniuzi02'), `view/lottery/texture/common/ck_anniuzi01`)
            GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getIconById(this.luckydrawCfg.item[0]));
        }
        else {
            let id = this.lotteryModel.lastLuckydrawCfgId
            this.luckydrawCfg = ConfigManager.getItemById(LuckydrawCfg, id)
            this.costLab.string = `${this.luckydrawCfg.item_num}`
            GlobalUtil.setSpriteIcon(this.node, this.costLayout.getChildByName('ck_anniuzi02'), `view/lottery/texture/common/ck_anniuzi0${this.luckydrawCfg.num == 1 ? 1 : 2}`)
            GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getIconById(this.luckydrawCfg.item_id));
        }
        // let hasNum = BagUtils.getItemNumById(this.luckydrawCfg.item_id)
        // let iconId: number = this.luckydrawCfg.preitem_id ? parseInt(this.luckydrawCfg.preitem_id) : 0;
        // if (this.luckydrawCfg.preitem_id && BagUtils.getItemNumById(parseInt(this.luckydrawCfg.preitem_id)) >= 1) {
        //     iconId = parseInt(this.luckydrawCfg.preitem_id);
        // }
        // GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getIconById(iconId))
        // this.btnAgainLab.string = `再抽${this.luckydrawCfg.item_num}次`s
        if (!immediately) {
            gdk.e.on(LotteryEventId.SHOW_ITEM_END, this._onShowItemEnd, this);
        }
        this._initListView();
        this.list.set_data(this._getEffectItemList(this.goodList, immediately));
        if (immediately) {
            this._onShowItemEnd();
        }
    }

    _getEffectItemList(list: Array<icmsg.GoodsInfo>, immediately) {
        let newList = []
        let isShowHero = false

        list.forEach((element, index) => {
            let typeId: number = element.typeId;
            typeId = element.typeId.toString().length >= 8 ? parseInt(element.typeId.toString().slice(0, 6)) : element.typeId;
            let cfg = BagUtils.getConfigById(typeId)
            if (cfg && cfg.defaultColor >= 3 && (this.lotteryModel.lotteryType == LotteryType.gene || (this.lotteryModel.lotteryType == LotteryType.normal && !this.lotteryModel.isSkipAni))) {
                isShowHero = true
            } else {
                isShowHero = false
            }
            //伪造一个数据，排版好看
            if (list.length >= 10 && index == 8) {
                newList.push({ index: index, typeId: 0, num: 0, isShowHero: false, immediately: immediately });
            }

            index = index >= 8 ? index + 1 : index;
            newList.push({
                index: index,
                typeId: element.typeId,
                num: element.num,
                isShowHero: isShowHero,
                immediately: immediately
            });
        });
        return newList
    }

    btnAgainFunc() {
        if (this.luckydrawCfg) {
            //关闭音乐
            if (GlobalUtil.isMusicOn) {
                let music = this.node.getComponent(gdk.Music);
                music && music.setMusic("");
            }
            this.timeCount = 0
            if (this.luckydrawCfg instanceof GeneCfg) {
                let costNum = BagUtils.getItemNumById(this.luckydrawCfg.item[0]) || 0;
                if (costNum < this.luckydrawCfg.item[1]) {
                    let name = BagUtils.getConfigById(this.luckydrawCfg.item[0]).name;
                    if (this.luckydrawCfg.type == 1) {
                        GlobalUtil.openAskPanel({
                            descText: `${StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP1"), name)}`,
                            sureCb: () => {
                                gdk.panel.setArgs(PanelId.Store, [StoreMenuType.Gold]);
                                gdk.panel.open(PanelId.Store);
                                this.close();
                            }
                        })
                    }
                    else {
                        gdk.gui.showMessage(`${name}${gdk.i18n.t("i18n:LOTTERY_TIP2")}`);
                    }
                    return;
                }

                let req = new icmsg.GeneDrawReq();
                req.geneId = this.luckydrawCfg.id;
                NetManager.send(req);
            }
            else {
                let num = BagUtils.getItemNumById(this.luckydrawCfg.item_id)
                let num2 = BagUtils.getItemNumById(parseInt(this.luckydrawCfg.preitem_id)) | 0;
                let itemCfg = ConfigManager.getItemById(ItemCfg, this.luckydrawCfg.item_id)
                let preItemCfg = ConfigManager.getItemById(ItemCfg, this.luckydrawCfg.preitem_id)
                if (preItemCfg && this.luckydrawCfg.preitem_id && parseInt(this.luckydrawCfg.preitem_id) >= 0) {
                    if (num2 > 0) {
                        if (num2 < this.luckydrawCfg.item_num && num + num2 >= this.luckydrawCfg.item_num) {
                            GlobalUtil.openAskPanel({
                                descText: `${StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP33"), num2, preItemCfg.name, this.luckydrawCfg.item_num - num2, itemCfg.name)}`,
                                sureCb: () => {
                                    gdk.e.emit(LotteryEventId.REQ_LUCKY_DRAW, this.luckydrawCfg.id)
                                },
                            })
                            return
                        }
                    }
                }

                if (num + num2 < this.luckydrawCfg.item_num) {
                    let cost = this.luckydrawCfg.cost
                    let needCost = (this.luckydrawCfg.item_num - num - num2) * cost
                    if (needCost > 0) {
                        if (this.roleModel.gems >= needCost) {
                            // GlobalUtil.openAskPanel({
                            //     descText: StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP34"), itemCfg.name, needCost, itemCfg.name),
                            //     sureCb: () => {
                            //         gdk.e.emit(LotteryEventId.REQ_LUCKY_DRAW, this.luckydrawCfg.id)
                            //     },
                            //     isShowTip: true,
                            //     tipSaveCache: AskInfoCacheType.lottery_diamon_tip,
                            // })
                            // return
                            let transV = ConfigManager.getItemByField(GlobalCfg, 'key', 'proportion').value;
                            GlobalUtil.openAskPanel({
                                descText: `是否使用<color=#00ff00>${needCost}</c>钻石(拥有:<color=#00ff00>${this.roleModel.gems}</c>)<br/>购买<color=#00ff00>${needCost / transV[0] * transV[1]}英雄经验</c>(同时附赠<color=#00ff00>${this.luckydrawCfg.item_num - num - num2}</c>次召唤)`,
                                sureCb: () => {
                                    gdk.e.emit(LotteryEventId.REQ_LUCKY_DRAW, this.luckydrawCfg.id)
                                },
                            })
                            return
                        } else {
                            // return gdk.gui.showMessage(itemCfg.name + "及钻石数量不足")
                            //钻石不足判断
                            if (!GlobalUtil.checkMoneyEnough(cost * this.luckydrawCfg.item_num, 2, this, [PanelId.Lottery])) {
                                return
                            }
                        }
                    }
                    return gdk.gui.showMessage(itemCfg.name + gdk.i18n.t("i18n:LOTTERY_TIP2"))
                }
                gdk.e.emit(LotteryEventId.REQ_LUCKY_DRAW, this.luckydrawCfg.id)
            }
        }
    }

    btnCloseFunc() {
        this.close()
    }


    reSetEffect() {
        this.unscheduleAllCallbacks()
        this.isClick = false
        this.lotteryModel.isCommonClick = false
        gdk.Timer.clearAll(this)
        this.spineAni.setCompleteListener(null);
        this.registerTouchListener()
        this.list.set_data([])
        this.btnAgain.node.active = false
        this.btnClose.node.active = false
        // this.costLayout.active = false

        if (GlobalUtil.isSoundOn) {
            gdk.sound.stop()
            gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.animation)
        }
    }

    _onShowItemEnd() {
        let aniName = this.spineAni.animation;
        if (aniName && aniName == 'stand') return;
        gdk.e.off(LotteryEventId.SHOW_ITEM_END, this._onShowItemEnd);
        this.unregisterTouchListener()

        this.btnAgain.node.active = true
        this.btnClose.node.active = true
        // this.costLayout.active = true

        //播放背景音乐
        gdk.Timer.once(1000, this, () => {
            if (GlobalUtil.isMusicOn) {
                let music = this.node.getComponent(gdk.Music);
                music && music.setMusic(MusicId.CARD_BG);
            }
        })
    }
}
