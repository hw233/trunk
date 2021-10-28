import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import InstanceModel from '../model/InstanceModel';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import {
    HeroCfg,
    Justice_bonusCfg,
    Justice_bossCfg,
    Justice_frameCfg,
    Justice_mercenaryCfg,
    Justice_skillCfg,
    SoldierCfg
    } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/DetailViewHeroSlotCtrl")
export default class DetailViewHeroSlotCtrl extends cc.Component {

    @property(cc.Node)
    lock: cc.Node = null;
    @property(cc.Node)
    add: cc.Node = null;
    @property(cc.Sprite)
    heroIconBg: cc.Sprite = null;
    @property(cc.Sprite)
    heroIcon: cc.Sprite = null;
    @property(cc.Node)
    frameBg: cc.Node = null;
    @property(sp.Skeleton)
    upEffect: sp.Skeleton = null;
    @property(sp.Skeleton)
    emissionSpine: sp.Skeleton = null;
    //------------------------7.8版点杀副本修改------------------------
    // @property(cc.Node)
    // upLv: cc.Node = null;
    // @property(cc.Label)
    // heroLv: cc.Label = null;
    // @property(cc.Node)
    // desc: cc.Node = null;
    // @property(cc.Label)
    // fightNum: cc.Label = null;
    // @property(cc.Node)
    // fightBg: cc.Node = null;
    // @property(cc.Prefab)
    // upTip: cc.Prefab = null;

    index: number;
    isOpen: boolean = false;
    heroData: icmsg.JusticeSlot;

    //slotCfg: Justice_slotCfg;
    frameCfg: Justice_frameCfg;
    changeHero: boolean = false;
    changeFrame: boolean = false;
    //changeSlot: boolean = false;
    attackTime: number = 0;
    hurtFun: Function = null;
    thisArg: any = null;
    model: InstanceModel;
    heroPower: number = 0;
    intervalTime: number = 0;
    soldierType: number = 1;
    moveStr: string = '';
    hurt: number = 0;
    soundStr: string = '';
    emissionStr: string = '';
    heroId: number = 0;
    slotLv: number = 0;
    frameLv: number = 0;
    //showSpine: boolean = true;
    soldierTime = 0;
    soldierIntervalTime = 5;

    oldFightNum: number = 0;

    showUpEffect: boolean = false;

    isFirst: boolean = true;
    update(dt: number) {

        if (this.isOpen && this.heroId > 0) {

            if (this.attackTime <= 0) {
                this.attackTime = this.intervalTime / 1000;
                if (this.hurtFun && typeof (this.hurtFun) === 'function' && this.thisArg) {
                    this.hurtFun.call(this.thisArg, this.index, this.hurt, this.moveStr, this.soldierType, this.frameLv, true, this.soundStr, this.emissionStr);

                }
            }
            this.attackTime -= dt;
        }

    }

    fillSlot(index: number, isOpen: boolean, heroData?: icmsg.JusticeSlot, hurtFun?: Function, thisArg?: any, refreshFrame: boolean = true) {

        this.model = ModelManager.get(InstanceModel);
        this.index = index;
        this.isOpen = isOpen;
        this.hurtFun = hurtFun;
        this.thisArg = thisArg;

        //获取边框等级
        let temFrameLv = 1;



        if (heroData == null) {
            this.changeFrame = true;
            this.changeHero = true;
        } else {

            let res = this.getHeroCurHurtAndFrameLv(heroData);
            this.hurt = res.hurt;

            this.changeHero = this.heroId != heroData.heroId;
            this.changeFrame = (this.frameLv != res.frameLv) || this.changeHero;
            this.heroId = heroData.heroId;
            this.frameLv = res.frameLv;
            temFrameLv = res.frameLv;
        }

        if (isOpen) {
            this.lock.active = false;
            if (!heroData || heroData.heroId == 0) {
                this.heroIcon.node.active = false;
                this.add.active = true;
                this.frameCfg = ConfigManager.getItemById(Justice_frameCfg, 1);
                this.heroIconBg.node.active = false;
            } else {
                this.heroIcon.node.active = true;
                this.add.active = false;
                this.heroIconBg.node.active = true;
                // TODO 根据 heroId 创建英雄
                let bagItem = HeroUtils.getHeroInfoBySeries(heroData.heroId)
                let cfg = ConfigManager.getItemById(HeroCfg, bagItem.itemId)
                let heroInfo = <icmsg.HeroInfo>bagItem.extInfo;
                this.heroPower = heroData.heroPower
                this.soldierType = ConfigManager.getItemById(SoldierCfg, heroInfo.soldierId).type;

                //1级显示
                if (this.changeFrame) {
                    this.frameCfg = ConfigManager.getItemById(Justice_frameCfg, temFrameLv);
                    if (refreshFrame) {
                        let icon = `view/instance/texture/part/` + this.frameCfg['frame_' + this.soldierType];
                        GlobalUtil.setSpriteIcon(this.node, this.heroIconBg, icon)
                    }
                    if (this.changeFrame && !this.isFirst) {
                        this.upEffect.node.active = true;
                        let t = this.upEffect.setAnimation(0, "animation", false)
                        if (t) {
                            this.upEffect.setCompleteListener((trackEntry, loopCount) => {
                                let name = trackEntry.animation ? trackEntry.animation.name : '';
                                if (name === "animation") {
                                    //this.upEffect.setAnimation(0, "node", true)
                                    this.upEffect.node.active = false;
                                }
                            })
                        }
                    }
                }
                if (this.changeHero) {
                    let icon = `icon/hero/${cfg.icon}_s`//GlobalUtil.getIconById(item.itemId, BagType.HERO)
                    GlobalUtil.setSpriteIcon(this.node, this.heroIcon, icon)
                }
                this.soldierTime = 1;
                this.intervalTime = this.frameCfg['interval_' + this.soldierType];
                this.moveStr = this.frameCfg['ballistic_' + this.soldierType];
                this.soundStr = this.frameCfg['sound_' + this.soldierType];
                this.emissionStr = this.frameCfg['emission_' + this.soldierType];

            }
        } else {
            this.heroIcon.node.active = false;
            this.add.active = false;
            this.lock.active = true;
            this.heroIconBg.node.active = false;
        }
        this.isFirst = false;
    }

    //计算当前英雄的伤害和边框等级
    getHeroCurHurtAndFrameLv(heroData: icmsg.JusticeSlot): { hurt: number, frameLv: number } {
        //
        let res = {
            hurt: 0,
            frameLv: 1
        }
        if (heroData.heroId == 0) {
            return res;
        }
        let damage = 0;
        let addheroDamage = 0;
        let frameDamage = 1;

        let bagItem = HeroUtils.getHeroInfoBySeries(heroData.heroId)
        let heroInfo = <icmsg.HeroInfo>bagItem.extInfo;
        let soldierType = ConfigManager.getItemById(SoldierCfg, heroInfo.soldierId).type;

        //获取雇佣兵数据
        let mercenaryData = this.model.dunGeonBossJusticeState.mercenaries;
        let allSKillData: any = {};
        if (mercenaryData.length > 0) {
            for (let i = 0; i < mercenaryData.length; i++) {
                if (mercenaryData[i] > 0) {
                    let mercenaryCfg = ConfigManager.getItemByField(Justice_mercenaryCfg, 'type', i + 1, { 'lv': mercenaryData[i] })
                    if (mercenaryCfg) {
                        damage += mercenaryCfg.damage;
                        let skillCfgs: Justice_mercenaryCfg[] = ConfigManager.getItems(Justice_mercenaryCfg, (item: Justice_mercenaryCfg) => {
                            if (item.type == i + 1 && item.lv <= mercenaryData[i] && cc.js.isNumber(item.skillid) && item.skillid > 0) {
                                return true;
                            }
                            return false;
                        })
                        let skillData: any = {};
                        let temSkillLv: any = {};
                        if (skillCfgs.length > 0) {
                            for (let i = 0; i < skillCfgs.length; i++) {
                                if (temSkillLv[skillCfgs[i].skillid + '']) {
                                    temSkillLv[skillCfgs[i].skillid + ''] += 1;
                                } else {
                                    temSkillLv[skillCfgs[i].skillid + ''] = 1;
                                }
                                //let cfg = ConfigManager.getItemByField(Justice_skillCfg, 'index', skillCfgs[i].skillid);
                                // if (skillCfgs[i].skillid <= 4) {
                                //     if (cfg.id == 1) {
                                //         skillData[cfg.id + ''] = cfg.effect_code;
                                //     } else {
                                //         skillData[cfg.id + ''] = cfg.level;
                                //     }
                                // }
                            }
                            for (let k = 1; k <= 4; k++) {
                                if (temSkillLv[k + '']) {
                                    // if (k == 1) {
                                    //     let cfg = ConfigManager.getItemByField(Justice_skillCfg, 'id', k, { 'level': temSkillLv[k + ''] });
                                    //     skillData[k + ''] = cfg.effect_code;
                                    // } else {
                                    //     skillData[k + ''] = temSkillLv[k + '']
                                    // }
                                    skillData[k + ''] = temSkillLv[k + '']
                                }
                            }
                        }
                        for (let j = 1; j <= 4; j++) {
                            if (skillData[j + '']) {
                                if (allSKillData[j + '']) {
                                    allSKillData[j + ''] += skillData[j + '']
                                } else {
                                    allSKillData[j + ''] = skillData[j + '']
                                }
                            }
                        }
                    }
                }
            }
            if (allSKillData['1']) {
                let cfg = ConfigManager.getItemByField(Justice_skillCfg, 'id', 1, { 'level': allSKillData['1'] });
                if (cfg) {
                    addheroDamage = cfg.effect_code;
                } else {
                    let tem = ConfigManager.getItemsByField(Justice_skillCfg, 'id', 1);
                    cfg = tem[tem.length - 1];
                    addheroDamage = cfg.effect_code;
                }
                addheroDamage = cfg.effect_code;
            }

            //addheroDamage = allSKillData['1'] ? allSKillData['1'] : 0;
            let frameType = 2;
            switch (soldierType) {
                case 1:
                    frameType = 4
                    break
                case 3:
                    frameType = 3
                    break
                case 4:
                    frameType = 2
                    break
            }

            res.frameLv = 1;
            if (allSKillData['' + frameType]) {
                res.frameLv = allSKillData['' + frameType] + 1
            }

        }

        let frameCfg = ConfigManager.getItemByField(Justice_frameCfg, 'lv', res.frameLv);
        if (frameCfg) {
            frameDamage = 1 + frameCfg['damage_' + this.soldierType] / 10000
        } else {
            let tem = ConfigManager.getItems(Justice_frameCfg)
            frameCfg = tem[tem.length - 1]
            frameDamage = 1 + frameCfg['damage_' + this.soldierType] / 10000
            res.frameLv = frameCfg.lv;
        }

        //计算英雄伤害
        //let frameDamage = skillData[frameType] ? skillData[frameType] / 10000 : 0;
        //let addheroDamage = skillData['1'] ? skillData['1'] / 10000 : 0;
        let roleModel = ModelManager.get(RoleModel);
        let generalCfg = ConfigManager.getItemByField(Justice_bonusCfg, 'lv', roleModel.level);
        if (!generalCfg) {
            let tem = ConfigManager.getItems(Justice_bonusCfg)
            generalCfg = tem[tem.length - 1]
        }

        let timeNum = frameCfg['interval_' + this.soldierType] / 1000
        //英雄伤害=英雄战力*外部指挥官等级加成*各个雇佣兵的伤害加成*边框等级
        let heroFight = heroData.heroPower * (1 + (generalCfg.hero / 10000) + (damage / 10000) + addheroDamage / 10000) * frameDamage * timeNum
        res.hurt = Math.floor(heroFight);
        return res;
    }


    showTips = false;
    lockClick() {
        if (this.showTips) return;
        this.showTips = true;
        gdk.Timer.once(1000, this, () => { this.showTips = false })
        let cfg = ConfigManager.getItemByField(Justice_bossCfg, 'slot', this.index + 1);
        let str = `击杀第${cfg.id}关Boss解锁`;
        gdk.gui.showMessage(str);
    }

    refreshFrameShow() {
        let icon = `view/instance/texture/part/` + this.frameCfg['frame_' + this.soldierType];
        GlobalUtil.setSpriteIcon(this.node, this.heroIconBg, icon)
    }

    onDestroy() {
        gdk.Timer.clearAll(this);
        gdk.pool.clear('Instace_Detail2_fightUp');
    }

}
