import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuardianUtils from '../../role/ctrl2/guardian/GuardianUtils';
import HeroUtils from '../../../common/utils/HeroUtils';
import LotteryModel from '../model/LotteryModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../../role/ctrl2/main/skill/SkillInfoPanelCtrl';
import { Global_powerCfg, GuardianCfg, SkillCfg } from '../../../a/config';

/**
 * @Description: 获得单个守护者的展示窗口
 * @Author: yaozu.hu
 * @Date: 2021-04-06 13:53:12
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-07 18:08:55
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/GuardianGetCtrl")
export default class GuardianGetCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null

    // @property(cc.Node)
    // mask: cc.Node = null

    @property(cc.Label)
    heroName: cc.Label = null

    @property(cc.Node)
    newFlag: cc.Node = null

    @property(cc.Node)
    skillNode: cc.Node = null;

    @property(cc.Node)
    innateSkillNode: cc.Node = null;

    @property(cc.Sprite)
    skillIcon: cc.Sprite = null;

    @property(cc.Label)
    starLabel: cc.Label = null;

    @property(cc.Label)
    powerLb: cc.Label = null;
    @property(cc.Label)
    atkLb: cc.Label = null;
    @property(cc.Label)
    hpLb: cc.Label = null;
    @property(cc.Label)
    defLb: cc.Label = null;

    // onLoad () {}
    guardCfg: GuardianCfg = null

    isLotteryShow = false //设置是否抽卡显示 界面还是
    effectAni: cc.Animation = null
    callFunc: Function = null;
    skill_id: number = 0;   //技能ID
    unShowHeroList: { id: number, isNew: boolean }[] = []; //等待展示的英雄列表

    get lotteryModel(): LotteryModel {
        return ModelManager.get(LotteryModel)
    }

    close(buttonIndex?: number) {
        if (this.unShowHeroList.length > 0) {
            let list = this.unShowHeroList.pop();
            if (this.effectAni) {
                this.effectAni.targetOff(this);
                this.effectAni = null;
            }
            this.unscheduleAllCallbacks();
            this.showLotteryEffectHero(list.id, list.isNew);
            return;
        }
        if (this.isLotteryShow) {
            if (this.lotteryModel.showGoodsId.length < this._getShowGoodsLen()) {
                //符合条件没展示完的继续展示
                this.isLotteryShow = true
                if (this.effectAni) {
                    this.effectAni.targetOff(this);
                    this.effectAni = null;
                }
                this.unscheduleAllCallbacks();
                this.showLotteryResult();
                return
            }
        }

        if (this.callFunc) {
            this.callFunc.call(this)
            this.callFunc = null
        }
        this.showEffectEnd();
        super.close(buttonIndex);
    }

    onEnable() {
        // this.skillNode.getChildByName('ck_lansedi').on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    onDisable() {
        // this.skillNode.getChildByName('ck_lansedi').targetOff(this);
        if (this.effectAni) {
            this.effectAni.targetOff(this);
            this.effectAni = null;
        }
        this.unscheduleAllCallbacks();
        NetManager.targetOff(this);
    }

    onDestroy() {
        // if (this.isLotteryShow) {
        //     if (this.lotteryModel.showGoodsId.length < this._getShowGoodsLen()) {
        //         //符合条件没展示完的继续展示
        //         gdk.panel.open(PanelId.HeroReward, (node: cc.Node) => {
        //             let comp = node.getComponent(HeroGetCtrl)
        //             comp.isLotteryShow = true
        //             comp.showLotteryResult()
        //         })
        //     } else {
        //         GlobalUtil.openRewadrView(this.lotteryModel.resultGoods)
        //     }
        // }

        // if (this.callFunc) {
        //     this.callFunc.call(this)
        //     this.callFunc = null
        // }
    }

    onFinished() {
        // this.mask.active = false
        this.effectAni.off('finished', this.onFinished, this);
        this.effectAni.play("UI_hdyx", 2.5)
        this.schedule(() => {
            this.effectAni.play("UI_hdyx", 2.5)
        }, 1)
    }

    skillIconClick() {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            //node.setPosition(0, -280);
            let comp = node.getComponent(SkillInfoPanelCtrl)
            comp.showSkillInfo(this.skill_id)
        })
    }

    /**
     * 展示英雄spine
     */
    showHero(id: number, num: number, isNew: boolean) {
        // this.title.setAnimation(0, "UI_gxhd", false)
        let typeId: number = id;
        typeId = id.toString().length >= 8 ? parseInt(id.toString().slice(0, 6)) : id;
        let guardCfg = ConfigManager.getItemById(GuardianCfg, typeId)
        let starNum = 0
        starNum = id.toString().length >= 8 ? parseInt(id.toString().slice(6)) : guardCfg.star_min;
        if (guardCfg) {

            if (isNew) {
                this.newFlag.active = true
            }
            this.guardCfg = guardCfg
            // if (this.guardCfg.defaultColor >= 3 && HeroUtils.getHeroSpeech(this.heroCfg.id)) {
            //     if (GlobalUtil.isSoundOn) {
            //         gdk.sound.play(gdk.Tool.getResIdByNode(this.node), HeroUtils.getHeroSpeech(this.heroCfg.id))
            //     }
            // }
            this.spine.node.active = true
            this.heroName.string = guardCfg.name

            this._updateStar(starNum)
            this._updateSkillNode(typeId)
            HeroUtils.setSpineData(this.node, this.spine, guardCfg.skin)
            let atkNum = ConfigManager.getItemByField(Global_powerCfg, 'key', 'atk').value;
            let defNum = ConfigManager.getItemByField(Global_powerCfg, 'key', 'def').value;
            let hpNum = ConfigManager.getItemByField(Global_powerCfg, 'key', 'hp').value;

            let powerNum = guardCfg.atk_w * atkNum + guardCfg.def_w * defNum + guardCfg.hp_w * hpNum
            this.powerLb.string = Math.floor(powerNum) + '';
            this.atkLb.string = '+' + guardCfg.atk_w;
            this.defLb.string = '+' + guardCfg.def_w;
            this.hpLb.string = '+' + guardCfg.hp_w;
            if (isNew) {
                return;
            }
            return;
        }

        //this.skillNode.active = false;
        // let itemCfg = ConfigManager.getItemById(ItemCfg, typeId)
        // if (itemCfg) {
        //     this.spine.node.active = false
        //     this.rewardItem.active = true
        //     this.heroName.string = itemCfg.name
        //     let uiSlot = this.rewardItem.getComponent(UiSlotItem)
        //     uiSlot.updateItemInfo(typeId, num)
        //     return
        // }

        // let equipCfg = ConfigManager.getItemById(Item_equipCfg, typeId)
        // if (equipCfg) {
        //     this.spine.node.active = false
        //     this.rewardItem.active = true
        //     this.heroName.string = equipCfg.name
        //     let uiSlot = this.rewardItem.getComponent(UiSlotItem)
        //     this._updateStar(equipCfg.star)
        //     uiSlot.updateItemInfo(typeId)
        //     return
        // }
    }



    _updateStar(starNum) {

        this.starLabel.string = starNum >= 6 ? '1'.repeat(starNum - 5) : '0'.repeat(starNum);
    }

    /**更新技能显示 */
    _updateSkillNode(id: number) {

        this.skillNode.active = true;
        this.skill_id = this.guardCfg.skill_show;
        let skillInfo: SkillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", this.guardCfg.skill_show, null)
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, 'icon/skill/' + skillInfo.icon)
    }


    /**
     * 展示英雄抽奖结果
     */
    showLotteryResult(showLookBtn: boolean = true) {
        // this.lookBtn.active = showLookBtn
        // this.mask.active = true
        this.effectAni = this.node.getComponent(cc.Animation)
        this.effectAni.on('finished', this.onFinished, this);
        this.effectAni.play("UI_hdyx")
        let showIds = this.lotteryModel.showGoodsId
        let showGoodsInfo = this.lotteryModel.showGoodsInfo
        for (let key in showGoodsInfo) {
            let id = parseInt(key)
            let num = showGoodsInfo[id]
            //let typeId = id.toString().length >= 8 ? parseInt(id.toString().slice(0, 6)) : id;
            if (showIds.indexOf(id) == -1) {
                showIds.push(id)
                let isNew = !GuardianUtils.getOwnGuardianByTypeId(id);//HeroUtils.getHeroListByTypeId(typeId).length <= 1;
                this.showHero(id, num, isNew);
                break
            }
        }
    }

    _getShowGoodsLen() {
        return Object.keys(this.lotteryModel.showGoodsInfo).length;
    }

    /**
     * 展示英雄
     */
    showLotteryEffectHero(id: number, isNew: boolean) {
        let typeId: number = id;
        //typeId = id.toString().length >= 8 ? parseInt(id.toString().slice(0, 6)) : id;

        let guardianCfg = ConfigManager.getItemById(GuardianCfg, typeId)

        if (guardianCfg && this.effectAni) {
            this.unShowHeroList.push({
                id: id,
                isNew: isNew
            });
            return;
        }
        // this.lookBtn.active = false
        // this.mask.active = true
        this.effectAni = this.node.getComponent(cc.Animation)
        if (guardianCfg) {
            //英雄展示 取消自动隐藏 等待玩家交互
            this.effectAni.once('finished', () => {
                // this.mask.active = false;
                this.effectAni.play('UI_hdyx', 2.5);
                this.schedule(() => {
                    this.effectAni.play('UI_hdyx', 2.5);
                }, 1);
            }, this);
        }
        else {
            //装备展示 自动隐藏
            this.effectAni.on('finished', this.showEffectEnd, this);
        }
        this.effectAni.play("UI_hdyx")
        this.showHero(id, 1, isNew)
    }

    showEffectEnd() {
        // this.mask.active = false
        if (this.effectAni) {
            this.effectAni.targetOff(this);
            this.effectAni = null;
        }
        this.unscheduleAllCallbacks();
        gdk.panel.hide(PanelId.GuardianReward)
    }

}
