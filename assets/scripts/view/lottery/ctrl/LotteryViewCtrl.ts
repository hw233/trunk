import ActUtil from '../../act/util/ActUtil';
import BagUtils from '../../../common/utils/BagUtils';
import ButtonSoundId from '../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import LotteryModel from '../model/LotteryModel';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import UIScrollSelect from './UIScrollSelect';
import { BagEvent } from '../../bag/enum/BagEvent';
import {
    GlobalCfg,
    HeroCfg,
    ItemCfg,
    LuckydrawCfg,
    SystemCfg
    } from '../../../a/config';
import { LotteryCostId } from '../enum/LotteryCostId';
import { LotteryEventId } from '../enum/LotteryEventId';
import { RoleEventId } from '../../role/enum/RoleEventId';

/**
  * @Author: jiangping
  * @Description:
  * @Date: 2020-04-09 11:06:47
  */

/** 
 * 抽卡界面
 * @Author:  weiliang.huang    
 * @Date: 2019-06-25 09:27:03 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-09-14 17:17:40
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/LotteryViewCtrl")
export default class LotteryViewCtrl extends gdk.BasePanel {
    // @property(cc.Label)
    // numLab1: cc.Label = null //金耀 140001

    @property(cc.Label)
    numLab2: cc.Label = null //赤金 140013

    @property(cc.Label)
    numLab3: cc.Label = null; //紫金 140011

    @property(cc.Label)
    numLab4: cc.Label = null; //友谊点  7

    @property(cc.Node)
    xsNode: cc.Node = null//限时 精选

    @property(cc.Node)
    jcNode: cc.Node = null//基础

    @property(cc.Node)
    tjNode: cc.Node = null//特级(灵力者/潜力者/魅力者)

    @property(cc.Node)
    yqNode: cc.Node = null//友情

    @property(cc.Node)
    gjNode: cc.Node = null//高级

    // @property(cc.Animation)
    // ptNodeAnimation: cc.Animation = null;

    @property(cc.Node)
    lotteryTypeIcon: cc.Node = null

    @property(cc.Node)
    costIcon1: cc.Node = null

    @property(cc.Node)
    costIcon2: cc.Node = null

    @property(cc.Label)
    lotteryTimeLab: cc.Label = null

    @property(cc.Sprite)
    lotteryTimeTipsSprite: cc.Sprite = null;

    @property(cc.Node)
    btn1: cc.Node = null

    @property(cc.Node)
    btn2: cc.Node = null

    @property(sp.Skeleton)
    hero1: sp.Skeleton = null

    @property(cc.ToggleContainer)
    lotteryIdxToggleContainer: cc.ToggleContainer = null;

    @property(cc.ToggleContainer)
    lotteryTypeToggleContainer: cc.ToggleContainer = null;

    @property(cc.Prefab)
    lotteryTypePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    idxTogglePrefab: cc.Prefab = null;

    @property(cc.Node)
    convertBtn: cc.Node = null; //兑换按钮

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.Node)
    creditNode: cc.Node = null;

    @property(cc.Node)
    skipAniFlag: cc.Node = null;

    cfgList: any[] = []
    curSelect: number = 2  //1-限定英雄召唤1 2-限定英雄召唤2 3-限定英雄召唤3 4-高级召唤 5-装备召唤 6-普通召唤
    curCfg: LuckydrawCfg
    lotteryTimeStamp: number;
    isConvertShow: boolean = false;


    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get lotteryModel(): LotteryModel { return ModelManager.get(LotteryModel); }

    onLoad() {
        this.title = 'i18n:LOTTERY_TITLE'
        this._initCfg();
        this.convertBtn.active = this.isConvertShow;
        this.lotteryIdxToggleContainer.toggleItems.forEach(item => {
            item.interactable = false;
        });
    }

    onDisable() {
        this.isConvertShow = false;
        // this.ptNodeAnimation && this.ptNodeAnimation.stop('equip.summon');
        gdk.Timer.clearAll(this);
        gdk.e.targetOff(this);
    }

    onEnable() {
        gdk.e.on(LotteryEventId.RSP_LUCKY_DRAW, this._updateLotteryTime, this);
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateItemNums, this)
        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateItemNums, this)
        gdk.e.on(BagEvent.REMOVE_ITEM, this._updateItemNums, this)
        gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._updateItemNums, this);

        this.skipAniFlag.active = this.lotteryModel.isSkipAni;
        this._updateGuide();
        this._updateItemNums();
        this._updateLotteryTime();
    }

    onSkipAniBtnClick() {
        let m = this.lotteryModel;
        m.isSkipAni = !m.isSkipAni;
        this.skipAniFlag.active = m.isSkipAni;
    }

    onUIScrollSelect(event: any) {
        let toggle = event.target;
        let index = event.index;
        if (!toggle.parent) return;
        let containerName = toggle.parent.name;
        if (containerName != 'typeNode') return;
        let toggleName = toggle.name;
        let idx = toggleName.charAt(toggleName.length - 1);
        let ctrl = this.lotteryTypeToggleContainer.node.getComponent(UIScrollSelect);
        if (parseInt(idx) - 1 != index) {
            if (event.direction < 0) ctrl.scrollToRight();
            else ctrl.scrollToLeft();
            toggle.getComponent(cc.Toggle).check();
        }
    }

    onArrBtnClick(e: cc.Event) {
        let name = e.currentTarget.name;
        let toggle;
        let ctrl = this.lotteryTypeToggleContainer.node.getComponent(UIScrollSelect);
        switch (name) {
            case 'leftArrow':
                ctrl.scrollToLeft();
                break;
            case 'rightArrow':
                ctrl.scrollToRight();
                break;
            default:
                break;
        }
        toggle = this.lotteryTypeToggleContainer.node.getChildByName(`typeToggle${ctrl.curIdx + 1}`)
        toggle && toggle.active && toggle.getComponent(cc.Toggle).check();
    }

    onToggleContainerClick(toggle: cc.Toggle) {
        let containerName = toggle['_toggleContainer'].node.name;
        if (!containerName) return;
        let toggleName = toggle.node.name;
        let idx = toggleName.charAt(toggleName.length - 1);
        this.curSelect = parseInt(idx);
        let emitToggle;
        switch (containerName) {
            case 'typeNode':
                emitToggle = this.lotteryIdxToggleContainer.node.getChildByName(`idxToggle${parseInt(idx)}`).getComponent(cc.Toggle);
                this.updateSelectView();
                break;
            default:
                break;
        }
        emitToggle && emitToggle.check();
        //卡池切换音效
        gdk.sound.isOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.pool)
    }

    goToFriend() {
        if (!JumpUtils.ifSysOpen(2300, true)) {
            return
        }
        gdk.panel.open(PanelId.Friend);
    }

    updateRedPoint() {
        // let itemNum = BagUtils.getItemNumById(this.curCfg.item_id) + this.curCfg.preitem_id ? (BagUtils.getItemNumById(parseInt(this.curCfg.preitem_id)) | 0) : 0;

        // // call 10 times btn
        // let ctrl = this.btn2.getComponent(RedPointCtrl);
        // let b = RedPointUtils.is_can_lottery(10) && itemNum >= 10;
        // ctrl.isShow = b;

        // // call 1 times btn
        // let ctrl2 = this.btn1.getComponent(RedPointCtrl);
        // let b2 = RedPointUtils.is_can_lottery(1) && itemNum >= 1;
        // ctrl2.isShow = b2 && this.curCfg.type != 0;

        let obj = GlobalUtil.getLocal('lotteryRedpoint', true) || {};
        // type node
        this.lotteryTypeToggleContainer.toggleItems.forEach(item => {
            let idx = item.node.name.slice(item.node.name.length - 1);
            let cfg: LuckydrawCfg = this.cfgList[parseInt(idx) - 1].cfg;
            let redPoint = item.node.getChildByName('RedPoint');
            if (!obj[cfg.item_id]) {
                obj[cfg.item_id] = { num: BagUtils.getItemNumById(cfg.item_id) || 0, isCheck: this.curSelect == parseInt(idx) };
            }
            if (this.curSelect == parseInt(idx)) {
                obj[cfg.item_id].isCheck = true;
                gdk.e.emit(LotteryEventId.UPDATE_LOTTERY_ITEM_CHECK);
            }
            let info = obj[cfg.item_id];
            if (info.num >= (cfg.item_num / cfg.num) && !info.isCheck) {
                redPoint.active = true;
            }
            else {
                redPoint.active = false;
            }
            GlobalUtil.setLocal('lotteryRedpoint', obj, true);
        });

        // return b;
    }

    _initCfg() {
        this.cfgList = [];
        let items = ConfigManager.getItems(LuckydrawCfg);
        for (let index = 0; index < items.length; index++) {
            const cfg = items[index];
            let sysId = cfg.system;
            // let actId = cfg.activity;
            // let addAct = !actId || (ActUtil.ifActOpen(cfg.activity));
            if (cfg.paper && cfg.paper > 0 && ((sysId != 0 && JumpUtils.ifSysOpen(sysId)) || cfg.act_type == 0)) {
                if (cfg.act_type == 2 && !this.isConvertShow) this.isConvertShow = true;
                this.cfgList.push({ index: cfg.order - 1, cfg: cfg, isSelect: false });
            }
        }
        GlobalUtil.sortArray(this.cfgList, (a, b) => {
            return b.cfg.order - a.cfg.order
        })
        this._initTypeToggle();
    }

    _initTypeToggle() {
        this.lotteryIdxToggleContainer.node.removeAllChildren();
        this.cfgList.forEach((cfg, idx) => {
            let toggle = cc.instantiate(this.lotteryTypePrefab);
            toggle.parent = this.lotteryTypeToggleContainer.node;
            GlobalUtil.setSpriteIcon(this.node, toggle.getChildByName('paper'), `view/lottery/texture/paper/ck_xuanzhedi0${cfg.cfg.paper}` + `${cfg.cfg.act_type == 2 ? '_jx' : ''}`);
            toggle.name = `typeToggle${idx + 1}`;
            let idxToggle = cc.instantiate(this.idxTogglePrefab);
            idxToggle.name = `idxToggle${idx + 1}`;
            idxToggle.parent = this.lotteryIdxToggleContainer.node;
            idxToggle.active = true;
        });
        this.lotteryIdxToggleContainer.toggleItems[0].check();
    }

    _updateGuide() {
        GuideUtil.bindGuideNode(500, this.btn1)
        GuideUtil.bindGuideNode(501, this.btn2)
        // 打开对应的页卡
        let selec: number = null;
        let args = this.args
        let id: number;
        if (args && args.length > 0) {
            if (args[0] instanceof Array) id = args[0][0];
            else id = args[0];
        }
        else if (this.lotteryModel.curSelectId) {
            id = this.lotteryModel.curSelectId;
        }
        if (id) {
            for (let i = 0; i < this.cfgList.length; i++) {
                if (this.cfgList[i]['cfg'].id == id) {
                    selec = i + 1;
                    break;
                }
            }
        }
        // this._clickItem(null, selec)
        !selec && (selec = 1);
        let toggle = this.lotteryTypeToggleContainer.node.getChildByName(`typeToggle${selec}`).getComponent(cc.Toggle);
        if (toggle) {
            toggle.check();
            this.onToggleContainerClick(toggle);
        }
        let ctrl = this.lotteryTypeToggleContainer.node.getComponent(UIScrollSelect);
        ctrl.scrollTo(selec - 1, false);
    }

    selectPage(idx: number) {
        let selec = 0;
        for (let i = 0; i < this.cfgList.length; i++) {
            if (this.cfgList[i]['cfg'].id == idx) {
                selec = i + 1;
                break;
            }
        }
        let toggle = this.lotteryTypeToggleContainer.node.getChildByName(`typeToggle${selec}`);
        if (toggle) {
            gdk.Timer.callLater(this, () => {
                toggle.getComponent(cc.Toggle).check();
                let ctrl = this.lotteryTypeToggleContainer.node.getComponent(UIScrollSelect);
                ctrl.scrollTo(selec - 1, false);
            });
        }
    }

    @gdk.binding("lotteryModel.credit")
    _updateCreditNode() {
        let costCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'luckydraw_exchange');
        this.creditNode.getChildByName('num').getComponent(cc.Label).string = `${GlobalUtil.numberToStr(this.lotteryModel.credit, true)}/${GlobalUtil.numberToStr(costCfg.value[0], true)}`;
        this.creditNode.getChildByName('progress').getComponent(cc.Sprite).fillRange = this.lotteryModel.credit / costCfg.value[0];
        let icon = this.creditNode.getChildByName('icon');
        icon.stopAllActions();
        icon.angle = 0;
        if (this.lotteryModel.credit >= costCfg.value[0]) {
            icon.runAction(cc.repeatForever(cc.sequence(
                cc.rotateBy(.05, 10),
                cc.rotateBy(.05, -10),
                cc.rotateBy(.05, -10),
                cc.rotateBy(.05, 10)
            )))
        }
        else {
            icon.stopAllActions();
        }
        gdk.e.emit(LotteryEventId.UPDATE_LOTTERY_CREDIT_CHANGE);
    }

    _updateLotteryTime() {
        if (this.curCfg) {
            let num = this.lotteryModel.drawNums[Math.floor(this.curCfg.id / 100) - 1] || 0;
            let leftTime = 0;
            if (Math.floor(this.curCfg.id / 100) == 1) {
                if (num >= 10) {
                    leftTime = this.curCfg.guaranteed - ((num - 10) % this.curCfg.guaranteed);
                }
                else {
                    leftTime = 10 - (num % 10);
                }
            }
            else {
                leftTime = this.curCfg.guaranteed - (num % this.curCfg.guaranteed);
            }
            this.lotteryTimeLab.string = `${leftTime}`
            cc.find('layout/lotteryTimeLab', this.xsNode).getComponent(cc.Label).string = `${leftTime}`;
            //tips
            this.progressNode.active = false;
            // if (this.curCfg.type == 1) {
            //     if (HeroUtils.getGoldHeroList().length >= 1) {
            //         this.progressNode.active = false;
            //     }
            //     else {
            //         this.progressNode.active = true;
            //         let bar = this.progressNode.getChildByName('bar');
            //         let label = this.progressNode.getChildByName('progressLabel');
            //         bar.width = Math.min(174, 174 * num / 50);
            //         label.getComponent(cc.Label).string = `${num}/50`;
            //     }
            // }
        }

        this.lotteryTimeStamp = 0
    }

    _updateItemNums() {
        // let num1 = BagUtils.getItemNumById(LotteryCostId.costId1) || 0;
        let num2 = BagUtils.getItemNumById(LotteryCostId.costId2) || 0;
        let num3 = BagUtils.getItemNumById(LotteryCostId.costId3) || 0;
        let num4 = BagUtils.getItemNumById(LotteryCostId.costId4) || 0;
        if (this.numLab2 && this.numLab3 && this.numLab4) {
            // this.numLab1.string = `${num1}`
            this.numLab2.string = `${num2}`
            this.numLab3.string = `${num3}`
            this.numLab4.string = `${num4}`
        }
        this.updateRedPoint();
    }

    updateSelectView() {
        gdk.Timer.clearAll(this);
        this.curCfg = this.cfgList[this.curSelect - 1]["cfg"]
        // let id = this.curCfg.activity > 0 ? this.curCfg.id : 102; //非限时奖池,均记录为高级召唤
        this.lotteryModel.curSelectId = null;

        let iconId: number = this.curCfg.item_id;
        if (this.curCfg.preitem_id && BagUtils.getItemNumById(parseInt(this.curCfg.preitem_id)) >= 1) {
            iconId = parseInt(this.curCfg.preitem_id);
        }
        GlobalUtil.setSpriteIcon(this.node, this.costIcon1, GlobalUtil.getIconById(iconId))
        this.costIcon1.getChildByName('label').getComponent(cc.Label).string = this.curCfg.item_num / 10 > 1 ? `${this.curCfg.item_num / 10}` : '';
        GlobalUtil.setSpriteIcon(this.node, this.costIcon2, GlobalUtil.getIconById(iconId))
        this.costIcon2.getChildByName('label').getComponent(cc.Label).string = this.curCfg.item_num + '';
        this.btn2.active = this.curCfg.num >= 10;
        let num = this.lotteryModel.drawNums[Math.floor(this.curCfg.id / 100) - 1] || 0;
        let leftTime = 0;
        if (Math.floor(this.curCfg.id / 100) == 1) {
            if (num >= 10) {
                leftTime = this.curCfg.guaranteed - ((num - 10) % this.curCfg.guaranteed);
            }
            else {
                leftTime = 10 - (num % 10);
            }
        }
        else {
            leftTime = this.curCfg.guaranteed - (num % this.curCfg.guaranteed);
        }
        this.lotteryTimeLab.string = `${leftTime}`

        this.tjNode.active = [1, 2, 3].indexOf(this.curCfg.order) != -1
        this.yqNode.active = this.curCfg.order == 4
        this.jcNode.active = this.curCfg.order == 5
        this.gjNode.active = this.curCfg.order == 6
        this.xsNode.active = [1, 2].indexOf(this.curCfg.act_type) != -1
        this.lotteryTypeIcon.active = [1, 2, 3, 4, 5, 6].indexOf(this.curCfg.order) != -1;
        // this.ptNodeAnimation.stop('equip_summon');
        // if (this.curCfg.type == 1) {
        //     if (HeroUtils.getGoldHeroList().length >= 1) {
        //         this.progressNode.active = false;
        //     }
        //     else {
        //         this.progressNode.active = true;
        //         let bar = this.progressNode.getChildByName('bar');
        //         let label = this.progressNode.getChildByName('progressLabel');
        //         bar.width = Math.min(174, 174 * num / 50);
        //         label.getComponent(cc.Label).string = `${num}/50`;
        //     }
        // }
        // else {
        // }
        this.progressNode.active = false

        if ([1, 2].indexOf(this.curCfg.act_type) != -1) {
            let upTips = this.xsNode.getChildByName('upTips');
            let upTitle = this.xsNode.getChildByName('upTitle');
            let lotteryTimeLabel = cc.find('layout/lotteryTimeLab', this.xsNode).getComponent(cc.Label);
            let heroSpine = cc.find('hero1', this.xsNode).getComponent(sp.Skeleton);
            let heroName = this.xsNode.getChildByName('heroName').getComponent(cc.Label);
            let heroNameBg = this.xsNode.getChildByName('ck_jinsexingxi04');
            let limitTimeLabel = this.xsNode.getChildByName('timeLab').getComponent(cc.Label);
            let summonSpine = this.xsNode.getChildByName('summonSpine').getComponent(sp.Skeleton);
            let bg = this.xsNode.getChildByName('bg');
            //--------精选类型-------//
            let jxUpTips = upTips.getChildByName('jxUpTips');
            let jxFlag = this.xsNode.getChildByName('jxFlag');
            let jxTipsLabel = this.xsNode.getChildByName('jxTipsLabel');
            jxUpTips.active = this.curCfg.act_type == 2;
            jxFlag.active = this.curCfg.act_type == 2;
            jxTipsLabel.active = this.curCfg.act_type == 2;

            //-------复用部分------//
            GlobalUtil.setSpriteIcon(this.node, bg, `view/lottery/texture/common/${this.curCfg.act_type == 1 ? 'ck_jinsetaizi' : 'ck_jingxuantaizi'}`);
            let heroCfg1 = ConfigManager.getItemById(HeroCfg, this.curCfg.hero[Math.floor(Math.random() * this.curCfg.hero.length)])
            GlobalUtil.setSpriteIcon(this.node, upTips, `view/lottery/texture/common/ck_upTips${this.curCfg.paper >= 10 ? this.curCfg.paper : `0${this.curCfg.paper}`}`);
            GlobalUtil.setSpriteIcon(this.node, upTitle, `view/lottery/texture/common/${this.curCfg.title}`);
            lotteryTimeLabel.string = `${leftTime}`;
            heroName.string = heroCfg1.name;
            GlobalUtil.setSpriteIcon(this.node, heroNameBg, `view/lottery/texture/common/ck_jinsexingxi${this.curCfg.act_type == 1 ? '04' : '19'}`);
            heroNameBg.height = 92 + heroCfg1.name.length * 25;
            if (this.curCfg.act_type == 1) {
                summonSpine.setAnimation(0, 'stand', true);
            }
            summonSpine.node.active = this.curCfg.act_type == 1;
            HeroUtils.setSpineData(this.node, heroSpine, heroCfg1.skin, true, false);
            gdk.Timer.loop(5000, this, () => {
                let heroCfg1 = ConfigManager.getItemById(HeroCfg, this.curCfg.hero[Math.floor(Math.random() * this.curCfg.hero.length)]);
                HeroUtils.setSpineData(this.node, heroSpine, heroCfg1.skin, true, false)
                heroName.getComponent(cc.Label).string = heroCfg1.name;
                heroNameBg.height = 92 + heroCfg1.name.length * 25;
            });
            let time = ActUtil.getActEndTime(ConfigManager.getItemById(SystemCfg, this.curCfg.system).activity);
            if (!time) {
                limitTimeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            }
            else {
                let date = new Date(time - 5000); //time为零点,减去5s 返回前一天
                limitTimeLabel.string = `${StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP35"), date.getFullYear(), date.getMonth() + 1, date.getDate())}`;
            }

            this.updateRedPoint();
            return;
        }

        GlobalUtil.setSpriteIcon(this.node, this.lotteryTypeIcon, `view/lottery/texture/text/zh_title${this.curCfg.paper}`);
        GlobalUtil.setSpriteIcon(this.node, this.lotteryTimeTipsSprite, `view/lottery/texture/text/zh_tips${this.curCfg.paper}`);
        this.lotteryTimeLab.node.active = false;
        if ([1, 2, 3, 4, 6].indexOf(this.curCfg.order) !== -1) {
            let node = [, this.tjNode, this.tjNode, this.tjNode, this.yqNode, , this.gjNode][this.curCfg.order];
            let heroSpine = cc.find('hero1', node).getComponent(sp.Skeleton);
            let heroCfg1 = ConfigManager.getItemById(HeroCfg, this.curCfg.hero[Math.floor(Math.random() * this.curCfg.hero.length)])
            this.lotteryTypeIcon.getChildByName('ck_guangxiao').active = false;
            HeroUtils.setSpineData(this.node, heroSpine, heroCfg1.skin, true, false);
            gdk.Timer.loop(5000, this, () => {
                let heroCfg1 = ConfigManager.getItemById(HeroCfg, this.curCfg.hero[Math.floor(Math.random() * this.curCfg.hero.length)]);
                HeroUtils.setSpineData(this.node, heroSpine, heroCfg1.skin, true, false)
            });
        }
        this.updateRedPoint();
    }

    /**单次召唤 */
    callFunc1() {
        if (!JumpUtils.ifSysOpen(this.curCfg.system, true)) {
            return;
        }
        let now = Date.now();
        if (now - this.lotteryTimeStamp < 0) {
            // 限制抽卡按钮点击频率
            return;
        }
        this.lotteryTimeStamp = now + 500;

        let num = BagUtils.getItemNumById(this.curCfg.item_id)
        let num2 = this.curCfg.preitem_id ? BagUtils.getItemNumById(parseInt(this.curCfg.preitem_id)) | 0 : 0;
        if (num + num2 < 1) {
            // gdk.panel.setArgs(PanelId.Lottery, [this.curSelect - 1]);
            let cfg = ConfigManager.getItemById(LuckydrawCfg, this.curCfg.num >= 10 ? this.curCfg.id - 1 : this.curCfg.id)
            let cost = cfg.cost
            let itemCfg = ConfigManager.getItemById(ItemCfg, this.curCfg.item_id)
            if (cost && cost > 0) {
                if (this.roleModel.gems >= cost) {
                    // GlobalUtil.openAskPanel({
                    //     descText: StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP34"), itemCfg.name, cost, itemCfg.name),
                    //     sureCb: () => {
                    //         let id = this.curCfg.id; //抽奖时,记录当前抽奖卡池
                    //         this.lotteryModel.curSelectId = id;
                    //         gdk.e.emit(LotteryEventId.REQ_LUCKY_DRAW, this.curCfg.num >= 10 ? this.curCfg.id - 1 : this.curCfg.id)
                    //     },
                    //     isShowTip: true,
                    //     tipSaveCache: AskInfoCacheType.lottery_diamon_tip,
                    // })
                    // return
                    let transV = ConfigManager.getItemByField(GlobalCfg, 'key', 'proportion').value;
                    GlobalUtil.openAskPanel({
                        descText: `是否使用<color=#00ff00>${cost}</c>钻石(拥有:<color=#00ff00>${this.roleModel.gems}</c>)<br/>购买<color=#00ff00>${cost / transV[0] * transV[1]}英雄经验</c>(同时附赠<color=#00ff00>${1}</c>次召唤)`,
                        sureCb: () => {
                            let id = this.curCfg.id; //抽奖时,记录当前抽奖卡池
                            this.lotteryModel.curSelectId = id;
                            gdk.e.emit(LotteryEventId.REQ_LUCKY_DRAW, this.curCfg.num >= 10 ? this.curCfg.id - 1 : this.curCfg.id)
                        },
                    })
                    return
                } else {
                    //return gdk.gui.showMessage(itemCfg.name + "及钻石数量不足")
                    //钻石不足判断
                    if (!GlobalUtil.checkMoneyEnough(cost, 2, null, [PanelId.Lottery])) {
                        return
                    }
                }
            }
            return GlobalUtil.showMessageAndSound(itemCfg.name + gdk.i18n.t("i18n:LOTTERY_TIP2"))
        }
        //处于引导抽出指定卡片
        let guideCfg = GuideUtil.getCurGuide();
        if (guideCfg && guideCfg.bindBtnId == 500) {
            let id = this.curCfg.id; //抽奖时,记录当前抽奖卡池
            this.lotteryModel.curSelectId = id;
            gdk.e.emit(LotteryEventId.REQ_LUCKY_DRAW, 100)
            return;
        }
        let id = this.curCfg.id; //抽奖时,记录当前抽奖卡池
        this.lotteryModel.curSelectId = id;
        gdk.e.emit(LotteryEventId.REQ_LUCKY_DRAW, this.curCfg.num >= 10 ? this.curCfg.id - 1 : this.curCfg.id)
    }

    /**10连抽 */
    callFunc2() {
        if (!JumpUtils.ifSysOpen(this.curCfg.system, true)) {
            return;
        }
        let now = Date.now();
        if (now - this.lotteryTimeStamp < 0) {
            // 限制抽卡按钮点击频率
            return;
        }
        this.lotteryTimeStamp = now + 500;

        let num = BagUtils.getItemNumById(this.curCfg.item_id)
        let num2 = this.curCfg.preitem_id ? BagUtils.getItemNumById(parseInt(this.curCfg.preitem_id)) | 0 : 0;
        let itemCfg = ConfigManager.getItemById(ItemCfg, this.curCfg.item_id)
        let preItemCfg = ConfigManager.getItemById(ItemCfg, this.curCfg.preitem_id)
        if (this.curCfg.preitem_id && this.curCfg.preitem_id && parseInt(this.curCfg.preitem_id) == 140011) {
            if (num2 > 0) {
                if (num2 < this.curCfg.item_num && num + num2 >= this.curCfg.item_num) {
                    GlobalUtil.openAskPanel({
                        descText: `${StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP33"), num2, preItemCfg.name, this.curCfg.item_num - num2, itemCfg.name)}`,
                        sureCb: () => {
                            let id = this.curCfg.id; //抽奖时,记录当前抽奖卡池
                            this.lotteryModel.curSelectId = id;
                            gdk.e.emit(LotteryEventId.REQ_LUCKY_DRAW, this.curCfg.id)
                        },
                    })
                    return
                }
            }
        }

        if (num + num2 < this.curCfg.item_num) {
            // gdk.panel.setArgs(PanelId.Lottery, [this.curSelect - 1]);
            let cost = this.curCfg.cost
            if (cost && cost > 0) {
                let needCost = (this.curCfg.item_num - num - num2) * cost
                if (needCost > 0) {
                    if (this.roleModel.gems >= needCost) {
                        // GlobalUtil.openAskPanel({
                        //     descText: StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP34"), itemCfg.name, needCost, itemCfg.name),
                        //     sureCb: () => {
                        //         let id = this.curCfg.id; //抽奖时,记录当前抽奖卡池
                        //         this.lotteryModel.curSelectId = id;
                        //         gdk.e.emit(LotteryEventId.REQ_LUCKY_DRAW, this.curCfg.id)
                        //     },
                        //     isShowTip: true,
                        //     tipSaveCache: AskInfoCacheType.lottery_diamon_tip,
                        // })
                        // return
                        let transV = ConfigManager.getItemByField(GlobalCfg, 'key', 'proportion').value;
                        GlobalUtil.openAskPanel({
                            descText: `是否使用<color=#00ff00>${needCost}</c>钻石(拥有:<color=#00ff00>${this.roleModel.gems}</c>)<br/>购买<color=#00ff00>${needCost / transV[0] * transV[1]}英雄经验</c>(同时附赠<color=#00ff00>${this.curCfg.item_num - num - num2}</c>次召唤)`,
                            sureCb: () => {
                                let id = this.curCfg.id; //抽奖时,记录当前抽奖卡池
                                this.lotteryModel.curSelectId = id;
                                gdk.e.emit(LotteryEventId.REQ_LUCKY_DRAW, this.curCfg.id)
                            },
                        })
                        return
                    } else {
                        // return gdk.gui.showMessage(itemCfg.name + "及钻石数量不足")
                        //钻石不足判断
                        if (!GlobalUtil.checkMoneyEnough(cost * this.curCfg.item_num, 2, null, [PanelId.Lottery])) {
                            return
                        }
                    }
                }
            } else {
                return GlobalUtil.showMessageAndSound(itemCfg.name + gdk.i18n.t("i18n:LOTTERY_TIP2"))
            }
        }
        let id = this.curCfg.id; //抽奖时,记录当前抽奖卡池
        this.lotteryModel.curSelectId = id;
        gdk.e.emit(LotteryEventId.REQ_LUCKY_DRAW, this.curCfg.id)
    }

    /**详情按钮 */
    // detailFunc() {
    //     GlobalUtil.openTipsPanel({
    //         title: "内容说明",
    //         desc: this.curCfg.des2
    //     })
    // }

    /**倍率 */
    lottertWeightFunc() {
        gdk.panel.setArgs(PanelId.LotteryWeight, [this.curCfg]);
        gdk.panel.open(PanelId.LotteryWeight);
    }

    /**兑换 */
    convertFunc() {
        // let drawId: number[] = [];
        // let cfgs = ConfigManager.getItems(Luckydraw_exchangeCfg, (cfg: Luckydraw_exchangeCfg) => {
        //     if (drawId.indexOf(cfg.draw_id) == -1) {
        //         let luckydrawCfg = ConfigManager.getItemById(LuckydrawCfg, cfg.draw_id);
        //         if (ActUtil.ifActOpen(ConfigManager.getItemById(SystemCfg, luckydrawCfg.system).activity)) {
        //             drawId.push(luckydrawCfg.id);
        //             return true;
        //         }
        //     }
        //     else {
        //         return true;
        //     }
        // });
        // if (!cfgs || cfgs.length <= 0) {
        //     this.convertBtn.active = false;
        //     gdk.gui.showMessage('活动已过期');
        //     this.close();
        //     return
        // }
        // gdk.panel.setArgs(PanelId.HeroConvert, cfgs);
        // gdk.panel.open(PanelId.HeroConvert);
    }

    /**图鉴 */
    heroBookFunc() {
        // gdk.panel.setArgs(PanelId.Lottery, [this.curSelect - 1]);
        JumpUtils.openPanel({
            panelId: PanelId.HeroBook,
            currId: this.node,
        });
    }

    /**装备图鉴 */
    equipBookFunc() {
        JumpUtils.openPanel({
            panelId: PanelId.EquipBook,
            currId: this.node
        })
    }

    /**重置 */
    heroResetFunc() {
        if (!JumpUtils.ifSysOpen(2804, true)) {
            return
        }
        JumpUtils.openPanel({
            panelId: PanelId.HeroResetView,
            currId: this.node,
        });
    }

    /**合成 */
    composeFunc() {
        // gdk.panel.setArgs(PanelId.Lottery, [this.curSelect - 1]);
        JumpUtils.openPanel({
            panelId: PanelId.HeroComposeView,
            currId: this.node,
        });
    }

    creditFunc() {
        if (!JumpUtils.ifSysOpen(2819, true)) {
            return
        }
        gdk.panel.open(PanelId.LotteryCredit)
    }
}
