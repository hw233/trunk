import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import InstanceModel, { InstanceMercenaryData } from '../model/InstanceModel';
import MercenarySkillViewCtrl from './MercenarySkillViewCtrl';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import {
    HeroCfg,
    Justice_bonusCfg,
    Justice_bossCfg,
    Justice_generalCfg,
    Justice_mercenaryCfg,
    Justice_skillCfg,
    SoldierCfg
    } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/MercenaryItemCtrl")
export default class MercenaryItemCtrl extends UiListItem {

    @property(cc.Node)
    generalIconNode: cc.Node = null;
    @property(cc.Sprite)
    generalIcon: cc.Sprite = null;
    @property(cc.Node)
    mercenaryIconNode: cc.Node = null;
    @property(cc.Sprite)
    mercenaryIcon: cc.Sprite = null;
    @property(cc.Label)
    nameLb: cc.Label = null;
    @property(cc.Label)
    levelLb: cc.Label = null;
    @property(cc.Label)
    fightLb: cc.Label = null;
    @property(cc.Node)
    jifenNode: cc.Node = null;
    @property(cc.Label)
    jifenLb: cc.Label = null;
    @property(cc.Label)
    desLb: cc.Label = null;
    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Prefab)
    skillItem: cc.Prefab = null;
    @property(cc.Node)
    moreNode: cc.Node = null;
    @property(cc.Node)
    UpBtnNode: cc.Node = null;
    @property(cc.Button)
    UpBtn: cc.Button = null;
    @property(cc.Sprite)
    jindu: cc.Sprite = null;

    @property(cc.Node)
    skillDesNode: cc.Node = null;
    @property(cc.Label)
    skillDes: cc.Label = null;
    @property(cc.Node)
    longClickTip: cc.Node = null;

    @property(cc.Node)
    spineNode: cc.Node = null;
    @property(cc.Prefab)
    upEffect: cc.Prefab = null;

    info: InstanceMercenaryData = null;
    model: InstanceModel;
    curSkillId: number[] = [];
    curMercenaryCfg: Justice_mercenaryCfg;
    roleModel: RoleModel;
    lockState: boolean = false;
    newSKillDes: string = '';

    isHold: boolean = false;
    holdClickTime: number = 0;
    isLongClick: boolean = false;
    longClickTime: number = 0;

    canCreateEffect: boolean = true;
    createTime: number = 0;
    onEnable() {
        this.isHold = false;
        this.isLongClick = false;
        this.holdClickTime = 0;
        this.longClickTime = 0;
        this.skillDesNode.active = false;
        this.longClickTip.active = false;
        this.canCreateEffect = true;
        this.UpBtnNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.UpBtnNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.UpBtnNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

    }

    onDisable() {
        this.isHold = false;
        this.isLongClick = false;
        this.holdClickTime = 0;
        this.longClickTime = 0;
        this.UpBtnNode.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.UpBtnNode.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.UpBtnNode.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this, true);
        gdk.Timer.clearAll(this);
    }

    onTouchStart(event) {

        (this.data.scroll as cc.ScrollView).enabled = false;
        let state = GlobalUtil.getGrayState(this.UpBtnNode)
        if (state == 1) {
            return;
        }

        this.isHold = true;
        this.isLongClick = false;
        this.holdClickTime = 0;
        this.longClickTime = 0;
        this.longClickTip.active = true;
        this.longClickTip.opacity = 255;
        gdk.Timer.once(600, this, () => {
            //this.longClickTip.active = false;
            this.longClickTip.runAction(cc.fadeOut(0.2))
        })
    }

    onTouchEnd(event) {
        (this.data.scroll as cc.ScrollView).enabled = true;
        let state = GlobalUtil.getGrayState(this.UpBtnNode)
        if (state == 1) {
            return;
        }
        if (this.isHold && !this.isLongClick) {
            let state = GlobalUtil.getGrayState(this.UpBtnNode)
            state == 0 ? this.UpBtnClick() : 0;
        }
        this.isHold = false;
        this.isLongClick = false;
        this.holdClickTime = 0;
        this.longClickTime = 0;
        //this.longClickTip.active = false;
    }

    onTouchCancel(event) {
        (this.data.scroll as cc.ScrollView).enabled = true;
        let state = GlobalUtil.getGrayState(this.UpBtnNode)
        if (state == 1) {
            return;
        }
        this.isHold = false;
        this.isLongClick = false;
        this.holdClickTime = 0;
        this.longClickTime = 0;
        //this.longClickTip.active = false;
    }

    update(dt: number) {
        //升级按钮长按

        if (!this.canCreateEffect) {
            this.createTime += dt;
            if (this.createTime >= 0.2) {
                this.canCreateEffect = true;
                this.createTime = 0;
            }
        }
        if (this.isHold && !this.isLongClick) {
            this.holdClickTime += dt;
            if (this.holdClickTime > 1) {
                this.isLongClick = true;
                //this.longClickTip.active = false;
                //cc.log('------------按钮进入长按状态-----------------')
            }
        }
        if (this.isLongClick) {
            //发送
            if (this.longClickTime <= 0) {
                this.UpBtnClick();
                this.longClickTime = 0.1;
            } else {
                this.longClickTime -= dt;
            }

        }
    }

    updateView() {

        this.model = ModelManager.get(InstanceModel);
        let curScore = this.model.dunGeonBossJusticeState.score
        if (this.info && this.info.type == this.data.type && this.info.level == this.data.level) {

            let lastCfg = ConfigManager.getItemByField(Justice_mercenaryCfg, 'type', this.info.type, { 'lv': this.info.level + 1 })
            if (lastCfg) {
                let grayState: 0 | 1 = curScore >= lastCfg.exp ? 0 : 1;
                this.UpBtn.interactable = curScore >= lastCfg.exp
                GlobalUtil.setGrayState(this.UpBtnNode, grayState);
            }
            if (!this.lockState) {
                if (lastCfg && this.curMercenaryCfg) {
                    let temDamage1 = this._getAddFight(lastCfg.damage)
                    let temDamage2 = this._getAddFight(this.curMercenaryCfg.damage)
                    let showFight = temDamage1 - temDamage2
                    this.desLb.string = "升级+" + GlobalUtil.numberToStr2(showFight, true);
                }
                return;
            } else {
                if (this.data.type != 0) {
                    let lockBoss = ConfigManager.getItemByField(Justice_bossCfg, 'mercenary', this.info.type);
                    if (lockBoss && lockBoss.id >= this.model.dunGeonBossJusticeState.boss.id) {
                        this.UpBtn.interactable = false;
                        GlobalUtil.setGrayState(this.UpBtnNode, 1);
                        return;
                    }
                }
            }
        } else if (this.info && this.info.type != this.data.type) {
            this.curSkillId.length = 0;
        }

        //升级处理
        if (this.info && this.info.type == this.data.type && this.info.level < this.data.level) {
            if (this.canCreateEffect) {
                let effect = cc.instantiate(this.upEffect);
                //let ctrl = effect.getComponent(MercenaryUpEffectCtrl)
                effect.setParent(this.spineNode);
                this.canCreateEffect = false;
                this.createTime = 0;
            }
        }

        this.lockState = false;
        this.info = this.data;
        this.moreNode.active = false;
        this.skillNode.removeAllChildren();
        let lockBoss = ConfigManager.getItemByField(Justice_bossCfg, 'mercenary', this.info.type);
        this.roleModel = ModelManager.get(RoleModel);
        this.newSKillDes = '';
        if (this.info.type == 0) {
            this.lockState = true;
            this.mercenaryIconNode.active = false;
            this.generalIconNode.active = true;
            this.skillNode.active = false;
            //设置名称
            this.nameLb.string = this.roleModel.name
            //设置积分
            let curCfg = ConfigManager.getItemById(Justice_generalCfg, this.info.level)
            let lastCfg = ConfigManager.getItemById(Justice_generalCfg, this.info.level + 1)
            if (lastCfg) {
                let generalCfg = ConfigManager.getItemByField(Justice_bonusCfg, 'lv', this.roleModel.level);
                if (!generalCfg) {
                    generalCfg = ConfigManager.getItems(Justice_bonusCfg).reverse().shift();
                }
                //获取所有雇佣兵加的指挥官伤害系数
                let skillLv = this.getGeneralAdddamageSKillLv();
                let addSkillCfg = ConfigManager.getItemByField(Justice_skillCfg, 'id', 6, { 'lv': skillLv })
                let skillAdd = 0;
                if (addSkillCfg) {
                    skillAdd = addSkillCfg.effect_code;
                } else if (skillLv > 0) {
                    let temData = ConfigManager.getItemsByField(Justice_skillCfg, 'id', 6)
                    skillAdd = temData[temData.length - 1].effect_code;
                }
                let add = (lastCfg.output - curCfg.output) * (1 + generalCfg.general / 10000 + skillAdd / 10000)

                this.desLb.string = "升级+" + GlobalUtil.numberToStr2(Math.floor(add), true);
                this.jifenNode.active = true;
                this.jifenLb.string = GlobalUtil.numberToStr2(Math.floor(lastCfg.exp), true)
                let grayState: 0 | 1 = curScore >= lastCfg.exp ? 0 : 1;
                this.UpBtn.interactable = curScore >= lastCfg.exp
                GlobalUtil.setGrayState(this.UpBtnNode, grayState);
                if (curScore < lastCfg.exp) {
                    this.isLongClick = false;
                    this.isHold = false;
                }

            } else {
                this.desLb.string = "MAX"
                this.jifenNode.active = false;
                this.jifenLb.string = ''
                this.UpBtn.interactable = false
                GlobalUtil.setGrayState(this.UpBtnNode, 1);
            }

            //设置战力
            this.fightLb.string = '' + GlobalUtil.numberToStr2(this.model.dunGeonBossJusticeState.generalDps, true);

            //设置头像
            let path = `icon/hero/${this.roleModel.head > 0 ? this.roleModel.head : 300000}_s`;
            GlobalUtil.setSpriteIcon(this.node, this.generalIcon, path);

        } else {
            this.mercenaryIconNode.active = true;
            this.generalIconNode.active = false;
            this.skillNode.active = true;

            this.curMercenaryCfg = ConfigManager.getItemByField(Justice_mercenaryCfg, 'type', this.info.type, { 'lv': this.info.level })
            if (!this.curMercenaryCfg) {
                let tem = ConfigManager.getItemsByField(Justice_mercenaryCfg, 'type', this.info.type)
                this.curMercenaryCfg = tem[tem.length - 1];
                this.info.level = this.curMercenaryCfg.lv;
            }
            this.nameLb.string = this.curMercenaryCfg ? this.curMercenaryCfg.name : '雇佣' + this.info.type
            let lastCfg = ConfigManager.getItemByField(Justice_mercenaryCfg, 'type', this.info.type, { 'lv': this.info.level + 1 })
            let skillCfgs: Justice_mercenaryCfg[] = ConfigManager.getItems(Justice_mercenaryCfg, (item: Justice_mercenaryCfg) => {
                if (item.type == this.info.type && item.lv <= this.info.level && cc.js.isNumber(item.skillid) && item.skillid > 0) {
                    return true;
                }
                return false;
            })
            let upSkillId = 0;
            if (this.curSkillId.length < skillCfgs.length) {
                upSkillId = skillCfgs[skillCfgs.length - 1].skillid;
            }
            this.curSkillId.length = 0;
            if (skillCfgs.length > 0) {
                skillCfgs.forEach(cfg => {
                    this.curSkillId.push(cfg.skillid);
                })
            }

            if (lastCfg) {
                if (cc.js.isNumber(lastCfg.skillid) && lastCfg.skillid > 0) {
                    let temData = ConfigManager.getItems(Justice_mercenaryCfg, (itemCfg: Justice_mercenaryCfg) => {
                        if (itemCfg.type == this.info.type && itemCfg.lv <= lastCfg.lv && cc.js.isNumber(itemCfg.skillid) && itemCfg.skillid == lastCfg.skillid) {
                            return true;
                        }
                        return false;
                    })
                    let skillCfg = ConfigManager.getItemByField(Justice_skillCfg, 'id', lastCfg.skillid, { 'level': temData.length });
                    if (!skillCfg) {
                        let tem = ConfigManager.getItemsByField(Justice_skillCfg, 'id', lastCfg.skillid);
                        skillCfg = tem[tem.length - 1]
                    }

                    this.desLb.string = "解锁新技能\n" + skillCfg.name
                    this.newSKillDes = skillCfg.des;
                } else {
                    let temDamage1 = this._getAddFight(lastCfg.damage)
                    let temDamage2 = this._getAddFight(this.curMercenaryCfg.damage)
                    let showFight = temDamage1 - temDamage2
                    this.desLb.string = "升级+" + GlobalUtil.numberToStr2(showFight, true);
                }
                this.jifenNode.active = true;
                this.jifenLb.string = GlobalUtil.numberToStr2(Math.floor(lastCfg.exp), true)

                if (lockBoss && lockBoss.id >= this.model.dunGeonBossJusticeState.boss.id) {
                    this.UpBtn.interactable = false;
                    GlobalUtil.setGrayState(this.UpBtnNode, 1);
                    this.desLb.string = '击杀' + lockBoss.id + '怪物解锁';
                    this.lockState = true;
                    this.jifenNode.active = false;
                    this.jifenLb.string = ''
                } else {
                    let grayState: 0 | 1 = curScore >= lastCfg.exp ? 0 : 1;
                    this.UpBtn.interactable = curScore >= lastCfg.exp
                    GlobalUtil.setGrayState(this.UpBtnNode, grayState);
                    if (curScore < lastCfg.exp) {
                        this.isLongClick = false;
                        this.isHold = false;
                    }
                }


            } else {

                this.desLb.string = "MAX"
                this.jifenNode.active = false;
                this.jifenLb.string = ''
                this.UpBtn.interactable = false
                GlobalUtil.setGrayState(this.UpBtnNode, 1);
                this.jindu.fillRange = 1
                this.isLongClick = false;
                this.isHold = false;
            }

            let lastSkillCfg = ConfigManager.getItem(Justice_mercenaryCfg, (item: Justice_mercenaryCfg) => {
                if (item.type == this.info.type && item.lv > this.info.level && cc.js.isNumber(item.skillid) && item.skillid > 0) {
                    return true;
                }
                return false;
            })
            if (lastSkillCfg) {
                this.jindu.fillRange = this.info.level / lastSkillCfg.lv
                skillCfgs.push(lastSkillCfg);
            } else {
                this.jindu.fillRange = 1;
            }
            this.moreNode.active = skillCfgs.length > 6
            //刷新技能图标
            if (skillCfgs.length > 6) {
                skillCfgs = skillCfgs.slice(skillCfgs.length - 6)
            }

            skillCfgs.forEach(cfg => {
                let skillItem = cc.instantiate(this.skillItem);
                let icon = skillItem.getChildByName('icon').getComponent(cc.Sprite);
                let mask = skillItem.getChildByName('mask');
                let level = skillItem.getChildByName('level').getComponent(cc.Label);
                let upSprite = skillItem.getChildByName('upEffect').getChildByName('upSprite').getComponent(cc.Sprite);

                let temData = ConfigManager.getItems(Justice_mercenaryCfg, (itemCfg: Justice_mercenaryCfg) => {
                    if (itemCfg.type == cfg.type && itemCfg.lv <= cfg.lv && cc.js.isNumber(itemCfg.skillid) && itemCfg.skillid == cfg.skillid) {
                        return true;
                    }
                    return false;
                })
                let skillCfg = ConfigManager.getItemByField(Justice_skillCfg, 'id', cfg.skillid, { 'level': temData.length });
                if (!skillCfg) {
                    let tem = ConfigManager.getItemsByField(Justice_skillCfg, 'id', cfg.skillid)
                    skillCfg = tem[tem.length - 1];
                }
                //skillCfglet skillCfg = ConfigManager.getItemById(Justice_skillCfg, cfg.skillid);

                let path = `icon/skill/${skillCfg.icon}`;
                GlobalUtil.setSpriteIcon(this.node, icon, path);
                mask.active = this.info.level < cfg.lv
                upSprite.node.parent.active = false;
                level.node.active = this.info.level < cfg.lv
                level.string = 'Lv' + cfg.lv
                skillItem.setParent(this.skillNode);

                // if (upSkillId > 0 && cfg.skillid == upSkillId) {
                //     upSprite.node.parent.active = true;
                //     let tween1: cc.Tween = new cc.Tween();
                //     tween1.target(upSprite)
                //         .to(0.1, { fillRange: 1 })
                //         .delay(0.2)
                //         .call(() => {
                //             tween1 = null;
                //             upSprite.fillRange = 0;
                //             upSprite.node.parent.active = false;
                //         })
                //         .start();
                // }
            })

            //设置战力
            let showFight = this._getAddFight(this.curMercenaryCfg.damage)
            this.fightLb.string = '+' + GlobalUtil.numberToStr2(showFight, true);

            //设置头像
            let path = `icon/soldier/${this.curMercenaryCfg.icon}_s`;
            GlobalUtil.setSpriteIcon(this.node, this.mercenaryIcon, path);

        }

        this.levelLb.string = 'Lv' + this.info.level

    }

    //升级按钮点击事件
    UpBtnClick() {
        let state = GlobalUtil.getGrayState(this.UpBtnNode)
        if (state == 1) {
            return;
        }
        if (this.info.type == 0) {
            //判断是否达到当前boss的最大等级
            let temCfg = ConfigManager.getItemById(Justice_bossCfg, this.model.dunGeonBossJusticeState.boss.id)
            if (temCfg) {
                if (this.info.level < temCfg.general_lv) {
                    //发送升级指挥官请求
                    NetManager.send(new icmsg.JusticeGeneralLvupReq());
                } else {
                    //提示下一个
                    let temCfg = ConfigManager.getItem(Justice_bossCfg, (item: Justice_bossCfg) => {
                        if (item.general_lv > this.info.level) {
                            return true;
                        }
                        return false;
                    })
                    if (temCfg) {
                        let desc = gdk.i18n.t("i18n:INSTANCE_HERO_UPGENERAL_TIP2");
                        let text = StringUtils.replace(desc, "@number", temCfg.id + '');
                        gdk.gui.showMessage(text)
                    }
                }
            }
        } else {
            //发送升级雇佣兵请求
            let msg: icmsg.JusticeMercenaryLvupReq = new icmsg.JusticeMercenaryLvupReq();
            msg.type = this.info.type
            NetManager.send(msg);
            //如果是解锁新技能飘新技能的描述
            if (this.newSKillDes != '' && !this.isLongClick) {
                //gdk.gui.showMessage(this.newSKillDes)
                this.skillDes.string = this.newSKillDes
                this.skillDesNode.active = true;
                gdk.Timer.once(2000, this, () => {
                    this.skillDesNode.active = false;
                })
            }
        }
    }

    _listItemClick() {
        if (this.info.type > 0) {
            gdk.panel.open(PanelId.MercenaryView, (node: cc.Node) => {
                let ctrl = node.getComponent(MercenarySkillViewCtrl)
                ctrl.updateData(this.info.type, this.info.level);
            })

        }
    }

    //获取当前增加的战力
    _getAddFight(damage: number): number {

        let add = 0
        let skillData: any = {};
        let temSkillLv: any = {};
        if (this.curSkillId.length > 0) {
            for (let i = 0; i < this.curSkillId.length; i++) {
                let type = this.curSkillId[i]
                //let cfg = ConfigManager.getItemByField(Justice_skillCfg, 'index', this.curSkillId[i]);
                if (type <= 4) {
                    if (temSkillLv[type + '']) {
                        temSkillLv[type + ''] += 1;
                    } else {
                        temSkillLv[type + ''] = 1;
                    }
                }
            }
        }
        for (let i = 1; i <= 4; i++) {
            if (temSkillLv[i + '']) {
                let cfg = ConfigManager.getItemByField(Justice_skillCfg, 'id', i, { 'level': temSkillLv[i + ''] });
                if (!cfg) {
                    let tem = ConfigManager.getItemsByField(Justice_skillCfg, 'id', i);
                    cfg = tem[tem.length - 1]
                }
                skillData[i] = cfg.effect_code;
            }
        }

        let generalCfg = ConfigManager.getItemByField(Justice_bonusCfg, 'lv', this.roleModel.level);
        if (!generalCfg) {
            let tem = ConfigManager.getItems(Justice_bonusCfg)
            generalCfg = tem[tem.length - 1]
        }
        //获取所有上阵英雄
        if (this.model.dunGeonBossJusticeState.slots.length > 0) {
            let solts = this.model.dunGeonBossJusticeState.slots
            for (let i = 0; i < solts.length; i++) {
                if (solts[i].heroId > 0) {
                    let bagItem = HeroUtils.getHeroInfoBySeries(solts[i].heroId)
                    let cfg = ConfigManager.getItemById(HeroCfg, bagItem.itemId)
                    let heroInfo = <icmsg.HeroInfo>bagItem.extInfo;
                    let heroPower = solts[i].heroPower
                    let soldierType = ConfigManager.getItemById(SoldierCfg, heroInfo.soldierId).type;
                    let frameType = '2';
                    switch (soldierType) {
                        case 1:
                            frameType = '4'
                            break
                        case 3:
                            frameType = '3'
                            break
                        case 4:
                            frameType = '2'
                            break

                    }

                    let frameDamage = skillData[frameType] ? skillData[frameType] / 10000 : 0;
                    let addheroDamage = skillData['1'] ? skillData['1'] / 10000 : 0;

                    //英雄伤害=英雄战力*外部指挥官等级加成*各个雇佣兵的伤害加成*边框等级
                    //heroFight=heroPower * (1 +(generalCfg.general/10000)+ (damage / 10000) + addheroDamage) * (1 + frameDamage)
                    let heroFight = heroPower * ((damage / 10000) + addheroDamage) * (1 + frameDamage)
                    add += Math.floor(heroFight)

                }
            }
        }

        return add;
    }

    //获取指挥官伤害加成技能的等级
    getGeneralAdddamageSKillLv() {
        let level = 0;
        //获取雇佣兵数据
        let mercenaryData = this.model.dunGeonBossJusticeState.mercenaries;
        let allSKillData: any = {};
        if (mercenaryData.length > 0) {
            for (let i = 0; i < mercenaryData.length; i++) {
                if (mercenaryData[i] > 0) {
                    let mercenaryCfg = ConfigManager.getItemByField(Justice_mercenaryCfg, 'type', i + 1, { 'lv': mercenaryData[i] })
                    if (mercenaryCfg) {
                        let skillCfgs: Justice_mercenaryCfg[] = ConfigManager.getItems(Justice_mercenaryCfg, (item: Justice_mercenaryCfg) => {
                            if (item.type == i + 1 && item.lv <= mercenaryData[i] && cc.js.isNumber(item.skillid) && item.skillid == 6) {
                                return true;
                            }
                            return false;
                        })
                        level += skillCfgs.length;
                    }
                }
            }

        }
        return level;
    }
}
