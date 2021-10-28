import ConfigManager from '../../../common/managers/ConfigManager';
import GetHeroSkillItemCtrl from './GetHeroSkillItemCtrl';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroDetailViewCtrl from './HeroDetailViewCtrl';
import HeroGetCommentItemCtrl from './HeroGetCommentItemCtrl';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import LotteryModel from '../model/LotteryModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import {
    CommentsCfg,
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg,
    Item_equipCfg,
    ItemCfg,
    Peak_globalCfg,
    SkillCfg
    } from '../../../a/config';

/**
 * @Description: 获得单个新英雄的展示窗口
 * @Author: weiliang.huang
 * @Date: 2019-05-30 10:00:51
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-12 14:13:44
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroGetCtrl")
export default class HeroGetCtrl extends gdk.BasePanel {

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

    // @property(cc.Node)
    // uniqueSkillNode: cc.Node = null;

    // @property(cc.Node)
    // content: cc.Node = null;

    @property(cc.Node)
    skill1: cc.Node = null;

    @property(cc.Node)
    skill2: cc.Node = null;

    @property(cc.Node)
    skill1Bg: cc.Node = null;

    @property(cc.Node)
    skill2Bg: cc.Node = null;

    @property(cc.Label)
    starLabel: cc.Label = null;

    @property(cc.Prefab)
    heroSkillPrefab: cc.Prefab = null;

    @property(cc.ToggleContainer)
    skillTypeContainer: cc.ToggleContainer = null;

    @property(cc.Node)
    rewardItem: cc.Node = null;

    // @property(cc.Node)
    // careerNode: cc.Node = null;

    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.Node)
    commentNode: cc.Node = null;

    @property(cc.Prefab)
    commentItem: cc.Prefab = null;

    @property(cc.Node)
    btnShare: cc.Node = null;

    @property(cc.Label)
    commentLab: cc.Label = null;

    // onLoad () {}
    heroCfg: HeroCfg = null

    isLotteryShow = false //设置是否抽卡显示 界面还是
    effectAni: cc.Animation = null
    callFunc: Function = null
    curType: number = 2;  // 1-卡牌 2-塔防
    curLine: number = 0; //职业路线 
    careers: number[] = [];
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
        this._clearCommentNode()
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

    /**
     * 展示英雄spine
     */
    showHero(id: number, num: number, isNew: boolean) {
        // this.title.setAnimation(0, "UI_gxhd", false)
        let typeId: number = id;
        typeId = id.toString().length >= 8 ? parseInt(id.toString().slice(0, 6)) : id;
        let heroCfg = ConfigManager.getItemById(HeroCfg, typeId)
        let starNum = 0
        starNum = id.toString().length >= 8 ? parseInt(id.toString().slice(6)) : heroCfg.star_min;
        if (heroCfg) {
            GlobalUtil.setSpriteIcon(this.node, this.groupIcon, GlobalUtil.getGroupIcon(heroCfg.group[0], false));
            if (isNew) {
                this.newFlag.active = true
            }
            // this._initStar()
            this.heroCfg = heroCfg
            if (this.heroCfg.defaultColor >= 3 && HeroUtils.getHeroSpeech(this.heroCfg.id)) {
                if (GlobalUtil.isSoundOn) {
                    gdk.sound.play(gdk.Tool.getResIdByNode(this.node), HeroUtils.getHeroSpeech(this.heroCfg.id))
                }
            }
            this.spine.node.active = true
            this.heroName.string = heroCfg.name
            this.careers = [...ModelManager.get(HeroModel).careerInfos[this.heroCfg.id]];
            this.careers.sort((a, b) => {
                return a - b;
            });
            // let bg1 = this.careerNode.getChildByName('bg1')
            // let bg2 = this.careerNode.getChildByName('bg2')
            // let icon1 = cc.find('layout/icon1', this.careerNode);
            // let icon2 = cc.find('layout/icon2', this.careerNode);

            // let func = (icon: cc.Node, careerType: number, isGray: boolean = false) => {
            //     let nameArr = ["yx_chengse", "yx_chengse", "yx_lanse", "yx_lvse"]
            //     let path = `common/texture/soldier/${nameArr[careerType - 1]}`;
            //     GlobalUtil.setSpriteIcon(this.node, icon, path);
            //     GlobalUtil.setGrayState(icon, isGray ? 1 : 0)
            // }

            // if (this.careers.length >= 2) {
            //     this.careerNode.getComponent(cc.Button).interactable = true;
            //     bg1.active = true;
            //     bg2.active = false;
            //     icon1.active = true;
            //     icon2.active = true;
            //     func(icon1, ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.careers[0]).career_type);
            //     func(icon2, ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.careers[1]).career_type, true);
            // }
            // else {
            //     this.careerNode.getComponent(cc.Button).interactable = false;
            //     bg1.active = false;
            //     bg2.active = true;
            //     icon1.active = true;
            //     icon2.active = false;
            //     func(icon1, ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.careers[0]).career_type);
            // }
            // this.heroDesc.string = heroCfg.desc
            this._updateStar(starNum)
            // this._updateSkill(typeId, this.curType, this.careers[this.curLine]);
            this._updateSkillNode(typeId)
            HeroUtils.setSpineData(this.node, this.spine, heroCfg.skin)
            if (isNew) {
                return;
            }
            return;
        }

        this.skillNode.active = false;
        let itemCfg = ConfigManager.getItemById(ItemCfg, typeId)
        if (itemCfg) {
            this.spine.node.active = false
            this.rewardItem.active = true
            this.heroName.string = itemCfg.name
            let uiSlot = this.rewardItem.getComponent(UiSlotItem)
            uiSlot.updateItemInfo(typeId, num)
            return
        }

        let equipCfg = ConfigManager.getItemById(Item_equipCfg, typeId)
        if (equipCfg) {
            this.spine.node.active = false
            this.rewardItem.active = true
            this.heroName.string = equipCfg.name
            let uiSlot = this.rewardItem.getComponent(UiSlotItem)
            this._updateStar(equipCfg.star)
            uiSlot.updateItemInfo(typeId)
            return
        }
    }

    // onCareerBtnClick() {
    //     let bg1 = this.careerNode.getChildByName('bg1')
    //     let label = bg1.getChildByName('lab')
    //     let icon1 = cc.find('layout/icon1', this.careerNode);
    //     let icon2 = cc.find('layout/icon2', this.careerNode);
    //     this.curLine = this.curLine == 0 ? 1 : 0;
    //     GlobalUtil.setGrayState(icon1, this.curLine == 0 ? 0 : 1);
    //     GlobalUtil.setGrayState(icon2, this.curLine == 0 ? 1 : 0);
    //     bg1.scaleX = this.curLine == 0 ? 1 : -1;
    //     label.scaleX = bg1.scaleX;
    //     this._updateSkill(this.heroCfg.id, this.curType, this.careers[this.curLine]);
    // }

    // onSkillTypeBtnClick(e: cc.Event) {
    //     this.curType = this.curType == 1 ? 2 : 1;
    //     this._updateSkill(this.heroCfg.id, this.curType, this.careers[this.curLine]);
    // }

    // _onTouchEnd(e: cc.Event.EventTouch) {
    //     let startX = e.getStartLocation().x;
    //     let endX = e.getLocationX();
    //     if (Math.abs(startX - endX) >= 50) {
    //         this.curType = this.curType == 1 ? 2 : 1;
    //         this._updateSkill(this.heroCfg.id, this.curType, this.careers[this.curLine]);
    //     }
    // }

    _updateStar(starNum) {
        // this.starLabel.string = '';
        // while (starNum > 0) {
        //     this.starLabel.string += `1`;
        //     starNum -= 1;
        // }
        this.starLabel.string = starNum >= 6 ? '1'.repeat(starNum - 5) : '0'.repeat(starNum);
    }

    /**更新技能显示 */
    _updateSkillNode(id: number) {
        let model = ModelManager.get(HeroModel)
        let list = model.heroInfos
        let info: icmsg.HeroInfo = null
        for (let i = 0; i < list.length; i++) {
            if (list[i].itemId == id) {
                info = list[i].extInfo as icmsg.HeroInfo
            }
        }
        //判断是否是巅峰之战英雄
        let isPeak = gdk.panel.isOpenOrOpening(PanelId.PeakView)
        this.btnShare.active = !isPeak
        this.commentLab.node.parent.active = !isPeak;

        if (!info && !isPeak) {
            this.skillNode.active = false;
            return
        }
        let starNum = 3
        if (!info && isPeak) {
            starNum = ConfigManager.getItemByField(Peak_globalCfg, 'key', 'star_level').value[0];
        } else {
            starNum = info.star;
        }

        this.skillNode.active = true;
        let heroCfg = ConfigManager.getItemById(HeroCfg, id);
        this.innateSkillNode.getComponent(GetHeroSkillItemCtrl).updateSkillInfo(heroCfg.gift_tower_id, 1);

        this.skill1Bg.active = true
        this.skill2Bg.active = false
        this.skill1.active = true
        this.skill2.active = false

        let starCfg = ConfigManager.getItemById(Hero_starCfg, starNum)
        if (this.careers.length == 1) {
            this.skill1.active = true
            this.skill2.active = false
            this._updateSkill(this.skill1, this.careers[0])
        } else {
            this.skill1.active = true
            this.skill2.active = true
            this._updateSkill(this.skill1, this.careers[0])
            this._updateSkill(this.skill2, this.careers[1])
        }
        if (starCfg.color >= 4) {
            this.skill1Bg.active = false
            this.skill2Bg.active = true
        }

        if (info && !isPeak) {
            this._updateCommentNode(info)
        }

    }


    _updateSkill(skillNode: cc.Node, career: number) {
        let skills: number[] = [];
        ConfigManager.getItems(Hero_careerCfg, function (cfg: Hero_careerCfg) {
            if (cfg.career_id == career) {
                if (cfg.ul_skill && cfg.ul_skill.length > 0) {
                    cfg.ul_skill.forEach((id) => {
                        if (skills.indexOf(id) == -1) skills.push(id);
                    })
                }
            }
            return false;
        });
        let content = skillNode.getChildByName("content")
        let careerIcon = skillNode.getChildByName("bg").getChildByName("careerIcon")
        let nameLab = skillNode.getChildByName("bg").getChildByName("nameLab").getComponent(cc.Label)
        content.removeAllChildren();
        let idx = 0;
        let delay = 0.1;
        skills.forEach((id) => {
            let skillCfg = ConfigManager.getItemByField(SkillCfg, 'skill_id', id);
            if (skillCfg && skillCfg.show != 1 && skillCfg.show != 2) {
                if (skillCfg.type !== 501) {
                    //普通卡牌 or 塔防技能
                    idx += 1;
                    let item = cc.instantiate(this.heroSkillPrefab);
                    item.parent = content;
                    item.getComponent(GetHeroSkillItemCtrl).updateSkillInfo(id, 3, idx * delay + 0.1);
                }
            }
        });
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", career)
        let nameArr = ["yx_chengse", "yx_chengse", "yx_lanse", "yx_lvse"]
        let path = `common/texture/soldier/${nameArr[careerCfg.career_type - 1]}`;
        GlobalUtil.setSpriteIcon(skillNode, careerIcon, path);
        nameLab.string = `${careerCfg.name}`
    }

    // /**
    //  * 更新技能表
    //  * @param id heroTypeId
    //  * @param type 1-卡牌 2-塔防
    //  */
    // _updateSkill(id: number, type: number, career: number) {
    //     let heroInfo = HeroUtils.getHeroInfoById(id);
    //     if (!heroInfo) {
    //         this.skillNode.active = false;
    //         return;
    //     }
    //     this.skillNode.active = true;
    //     this.skillTypeLabel.string = type == 1 ? '卡牌技能' : '塔防技能';
    //     let toggle = type == 1 ? this.skillTypeContainer.toggleItems[0] : this.skillTypeContainer.toggleItems[1];
    //     toggle.check();
    //     let heroCfg = ConfigManager.getItemById(HeroCfg, id);
    //     let skills: number[] = [];
    //     ConfigManager.getItems(Hero_careerCfg, function (cfg: Hero_careerCfg) {
    //         if (cfg.career_id == career) {
    //             if (cfg.ul_skill && cfg.ul_skill.length > 0) {
    //                 cfg.ul_skill.forEach((id) => {
    //                     if (skills.indexOf(id) == -1) skills.push(id);
    //                 })
    //             }
    //         }
    //         return false;
    //     });
    //     let giftOrTowerCardId = type == 1 ? heroCfg.gift_card_id : heroCfg.gift_tower_id;
    //     this.innateSkillNode.getComponent(GetHeroSkillItemCtrl).updateSkillInfo(giftOrTowerCardId, 1);

    //     if (this.careers.length == 1) {
    //         this.skill2.active = false

    //     }



    //     this.content.removeAllChildren();
    //     let idx = 0;
    //     let delay = 0.1;
    //     skills.forEach((id) => {
    //         let skillCfg = type == 1 ? ConfigManager.getItemByField(Cardskill_skillCfg, 'skill_id', id) : ConfigManager.getItemByField(SkillCfg, 'skill_id', id);
    //         if (skillCfg && skillCfg.show != 1 && skillCfg.show != 2) {
    //             if (skillCfg.type !== 501) {
    //                 //普通卡牌 or 塔防技能
    //                 idx += 1;
    //                 let item = cc.instantiate(this.heroSkillPrefab);
    //                 item.parent = this.content;
    //                 item.getComponent(GetHeroSkillItemCtrl).updateSkillInfo(id, 3, idx * delay + 0.1);
    //             }
    //         }
    //     });
    // }


    openDetailFunc() {
        if (!this.heroCfg) return
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl)
            comp.initHeroInfo(this.heroCfg)
        })
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
            let typeId = id.toString().length >= 8 ? parseInt(id.toString().slice(0, 6)) : id;
            if (showIds.indexOf(typeId) == -1) {
                showIds.push(typeId)
                let isNew = HeroUtils.getHeroListByTypeId(typeId).length <= 1;
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
        typeId = id.toString().length >= 8 ? parseInt(id.toString().slice(0, 6)) : id;

        let heroCfg = ConfigManager.getItemById(HeroCfg, typeId)

        if (heroCfg && this.effectAni) {
            this.unShowHeroList.push({
                id: id,
                isNew: isNew
            });
            return;
        }
        // this.lookBtn.active = false
        // this.mask.active = true
        this.effectAni = this.node.getComponent(cc.Animation)
        if (heroCfg) {
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
        gdk.panel.hide(PanelId.HeroReward)
    }


    onCommentClick() {
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, "color", this.heroCfg.defaultColor)
        gdk.panel.setArgs(PanelId.SubHeroCommentPanel, this.heroCfg.id, starCfg.star)
        gdk.panel.open(PanelId.SubHeroCommentPanel)
    }

    onShareClick() {
        let heroModel = ModelManager.get(HeroModel)
        let list = heroModel.heroInfos
        let info = null
        for (let i = 0; i < list.length; i++) {
            if (list[i].itemId == this.heroCfg.id) {
                info = list[i].extInfo
            }
        }

        if (info) {
            let btns = [12, 13]
            GlobalUtil.openBtnMenu(this.btnShare, btns, {
                id: 0,
                level: 1,
                extInfo: info
            })
        }
    }

    /**评论更新，飘字 */
    _updateCommentNode(info: icmsg.HeroInfo) {
        let msg = new icmsg.CommentNumReq()
        msg.heroId = info.typeId
        NetManager.send(msg, (rsp: icmsg.CommentNumRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.commentLab.string = `${gdk.i18n.t("i18n:LOTTERY_TIP31")}${rsp.commentNum}`
        }, this)
        let commmentCfgs = ConfigManager.getItemsByField(CommentsCfg, "hero_id", info.typeId)
        if (commmentCfgs.length == 0) {
            return
        }
        let datas = []
        for (let i = 0; i < commmentCfgs.length; i++) {
            let content = commmentCfgs[i].content
            datas.push(content)
        }
        this._clearCommentNode()
        for (let i = 0; i < datas.length; i++) {
            let item = cc.instantiate(this.commentItem)
            let ctrl = item.getComponent(HeroGetCommentItemCtrl)
            let starCfg = ConfigManager.getItemById(Hero_starCfg, info.star)
            if (starCfg.color >= 4) {
                ctrl.lab.node.color = cc.color("#D2AD2C")
                ctrl.lab.node.getComponent(cc.LabelOutline).color = cc.color("#2D1B0B")
            }
            ctrl.updateDes(datas[i])
            this.commentNode.addChild(item)
            item.x = 360
            item.y = (this.commentNode.height / datas.length) * i + Math.random() * (this.commentNode.height / datas.length)
            item.runAction(cc.sequence(cc.moveTo(i * 0.5 + 3 + 4 * Math.random(), cc.v2(-360 - item.width, item.y)), cc.callFunc(() => {
                item.removeFromParent()
            })))
        }
    }

    _clearCommentNode() {
        let items = this.commentNode.children
        items.forEach(element => {
            element.stopAllActions()
        });
        this.commentNode.removeAllChildren()
    }
}
