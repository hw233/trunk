import {
    CommonCfg,
    Costume_compositeCfg, HeroCfg, Hero_awakeCfg,
    Hero_careerCfg, Pieces_heroCfg, SkillCfg, Skill_buffCfg, Tech_stoneCfg, UniqueCfg
} from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import { CopyType } from '../../../../common/models/CopyModel';
import CostumeUtils from '../../../../common/utils/CostumeUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import PanelId from '../../../../configs/ids/PanelId';
import NewAdventureModel from '../../../adventure2/model/NewAdventureModel';
import BYModel from '../../../bingying/model/BYModel';
import SkillInfoPanelCtrl from '../../../role/ctrl2/main/skill/SkillInfoPanelCtrl';
import { PveSkillType } from '../../const/PveSkill';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import PveSceneState from '../../enum/PveSceneState';
import { PveBaseFightModel } from '../../model/PveBaseFightModel';
import PveBuffModel from '../../model/PveBuffModel';
import PveHeroModel from '../../model/PveHeroModel';
import PveSceneModel from '../../model/PveSceneModel';
import PveTool from '../../utils/PveTool';
import PveCalledCtrl from '../fight/PveCalledCtrl';
import PveSceneCtrl from '../PveSceneCtrl';
import PveHeroCallItemCtrl from '../view/PveHeroCallItemCtrl';
import PveHeroTipsCtrl from './PveHeroTipsCtrl';
/**
 * Hero战斗详情界面控制器
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-25 10:49:14
 */
const { ccclass, property, menu } = cc._decorator;

// ID字段值相等时
function hasId(v: any): boolean {
    return v.id == this.id;
}

@ccclass
@menu("qszc/scene/pve/view/PveHeroFightInfoCtrl")
export default class PveHeroFightInfoCtrl extends gdk.BasePanel {


    //-----------英雄信息-----------
    @property(cc.Sprite)
    heroIcon: cc.Sprite = null;
    @property(cc.Sprite)
    heroIconBg: cc.Sprite = null;
    @property(cc.Label)
    heroLv: cc.Label = null;
    @property(cc.Label)
    heroName: cc.Label = null;
    @property(cc.Node)
    heroBuffLayout: cc.Node = null;
    @property(cc.Node)
    heroSkillLayout: cc.Node = null;
    @property(cc.Node)
    heroAwakeSkillNode: cc.Node = null;
    @property(cc.Node)
    heroAwakeSkillIcon: cc.Node = null;

    // @property(cc.Label)
    // heroAtk: cc.Label = null;
    // @property(cc.Label)
    // heroAtk_add: cc.Label = null;
    // @property(cc.Label)
    // heroSpeed: cc.Label = null;
    // @property(cc.Label)
    // heroSpeed_add: cc.Label = null;
    // @property(cc.Label)
    // heroCare: cc.Label = null;
    // @property(cc.Label)
    // heroCare_add: cc.Label = null;
    @property(cc.Prefab)
    heroSkillItem: cc.Prefab = null;
    @property(cc.Prefab)
    heroBuffItem: cc.Prefab = null;
    @property(cc.Prefab)
    heroCallItem: cc.Prefab = null;
    @property(cc.Label)
    starLabel: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;
    @property(cc.Sprite)
    group: cc.Sprite = null;
    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    hpSp: cc.Node = null;
    @property(cc.Label)
    hpLb: cc.Label = null;

    @property(cc.Node)
    heroInfoDes: cc.Node = null;
    //-----------召唤物------------
    @property(cc.Node)
    callLayout: cc.Node = null;

    //------------Tips-------------
    @property(cc.Node)
    buffDescNode: cc.Node = null;
    @property(cc.RichText)
    buffDesc: cc.RichText = null;

    @property(cc.Node)
    callTipsNode: cc.Node = null;
    @property(cc.Label)
    callName: cc.Label = null;
    @property(cc.Label)
    callHp: cc.Label = null;
    @property(cc.Label)
    callAtk: cc.Label = null;
    @property(cc.Label)
    callDef: cc.Label = null;
    @property(cc.Label)
    callSpeed: cc.Label = null;
    @property(cc.Label)
    callhateNum: cc.Label = null;
    @property(cc.Node)
    labsNode: cc.Node = null;
    @property(cc.Prefab)
    heroTipsPrfb: cc.Prefab = null;
    @property(cc.Node)
    tipsNode: cc.Node = null;
    @property(cc.Label)
    hateNum: cc.Label = null;

    @property(cc.Node)
    heroEquitSKillBtn: cc.Node = null;

    //特殊技能

    //符文
    @property(cc.Node)
    runeSkill: cc.Node = null;
    //神装
    @property(cc.Node)
    costumeSkill: cc.Node = null;
    //守护者
    @property(cc.Node)
    guardianSkill: cc.Node = null;
    //能源石
    @property(cc.Node)
    nysSkill: cc.Node = null;
    //兵甲
    @property(cc.Node)
    soldierSkinSkill: cc.Node = null;
    //专属装备
    @property(cc.Node)
    uniqueEquipSkill: cc.Node = null;



    heroTipsNode: cc.Node = null;

    sceneModel: PveSceneModel;
    heroModel: PveHeroModel;
    quality: number = 0
    showSoldierBlood: boolean = false;

    refreshTime: number = 0.5;
    heroCalls: PveCalledCtrl[] = [];
    heroBuffs: any[] = [];
    selectCall: PveCalledCtrl = null;
    colorList = [cc.color("#85ED83"), cc.color("#FF1D1D")]


    attLabs: Array<cc.Label> = [];      // 白字属性lab数组
    extLabs: Array<cc.Label> = [];      // 绿字属性lab数组
    stageLabs: Array<cc.Sprite> = [];    // 评级lab数组

    _awakeSkill: number = 0;
    onLoad() {
        //this.refreshSoldierInfo();
    }

    onEnable() {
        let data = this.args;
        let view = gdk.gui.getCurrentView();
        let panel = view.getComponent(PveSceneCtrl);
        this.sceneModel = panel ? panel.model : null;
        if (this.checkState()) return;
        if (data) {
            this.heroModel = data[0];
        }
        this.buffDescNode.active = false;
        this.callTipsNode.active = false;
        this.runeSkill.active = false;
        this.costumeSkill.active = false;
        this.guardianSkill.active = false;
        this.nysSkill.active = false;
        this.soldierSkinSkill.active = false;
        this.uniqueEquipSkill.active = false;

        this.initHeroInfo();
        this.refreshBuff();

        // this.heroInfoDes.on(cc.Node.EventType.TOUCH_START, () => {
        //     this.openHeroDesc(false);
        // }, this)
        // this.heroInfoDes.on(cc.Node.EventType.TOUCH_CANCEL, () => {
        //     this.openHeroDesc(true);
        // }, this)
        // this.heroInfoDes.on(cc.Node.EventType.TOUCH_END, () => {
        //     this.openHeroDesc(true);
        // }, this)
        //this.heroEquitSKillBtn.active = this.isShowHeroEquitSkillBtn()
        //显示特殊技能图标
        this.isShowHeroEquitSkillBtn()
    }

    onDisable() {
        if (this.heroModel) {
            this.heroModel.ctrl.tower.showAtkDisLater(0);
        }
        if (this.heroBuffLayout.childrenCount > 0) {
            this.heroBuffLayout.children.forEach(node => {
                node.targetOff(this);
            })
            this.heroBuffLayout.destroyAllChildren();
        }
        if (this.callLayout.childrenCount > 0) {
            this.callLayout.children.forEach(node => {
                node.targetOff(this);
            })
            this.callLayout.destroyAllChildren();
        }
    }

    checkState() {
        if (!this.sceneModel) {
            this.close(-1);
            return true;
        }
        switch (this.sceneModel.state) {
            case PveSceneState.Entering:
            case PveSceneState.Exiting:
            case PveSceneState.NextLevel:
            case PveSceneState.Fight:
            case PveSceneState.Pause:
            case PveSceneState.Ready:
                return false;

            default:
                this.close(-1);
        }
        return true;
    }

    update(dt: number) {
        if (this.checkState()) return;
        if (this.refreshTime <= 0) {
            //刷新英雄属性
            this.refreshHeroInfo();
            this.refreshBuff();
            this.refreshCallList();
            //刷新召唤物属性
            if (this.selectCall) {
                if (!this.selectCall.isAlive) {
                    this.showCallInfo(null);
                } else {
                    this.refreshSelectCallInfo();
                }
            }
            if (this.heroModel.soldierType == 4) {
                //刷新拦截数量
                let data = this.refreshHateNum(this.heroModel);
                this.hateNum.string = StringUtils.format(gdk.i18n.t("i18n:PVE_HERO_INFO_TIP1"), data[0], data[1])//'拦截: ' + data[0] + '/' + data[1];
            }
            this.refreshTime = 0.6;
        } else {
            this.refreshTime -= dt;
        }
    }

    initHeroInfo() {
        this.heroName.string = this.heroModel.config.name;
        let icon = HeroUtils.getHeroHeadIcon(this.heroModel.config.id, this.heroModel.info ? this.heroModel.info.heroStar : 0, false)
        GlobalUtil.setSpriteIcon(this.node, this.heroIcon, icon)
        this._updateQuality();
        let type = this.heroModel.soldierType
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        GlobalUtil.setSpriteIcon(this.node, this.group, `common/texture/role/select/group_${this.heroModel.config.group[0]}`);
        this.hpLb.string = this.heroModel.hp + '/' + this.heroModel.hpMax;
        this.hpSp.width = Math.floor(this.heroModel.hp / this.heroModel.hpMax * 396)
        this.hateNum.node.active = type == 4;
        //------------更新技能------------



        let id = 0
        if (this.heroModel.item.series > 600000) {
            // 雇佣兵
            let extInfo = this.heroModel.item.extInfo as icmsg.HeroInfo;
            id = extInfo.careerId
        } else {
            id = HeroUtils.getHeroCareerById(this.heroModel.id);
        }
        if (this.sceneModel.stageConfig.copy_id == CopyType.NONE && this.sceneModel.arenaSyncData.fightType == 'PEAK') {
            id = this.heroModel.info.careerId
        }
        if (this.sceneModel.stageConfig.copy_id == CopyType.NewAdventure && ModelManager.get(NewAdventureModel).copyType == 0) {
            id = this.heroModel.info.careerId
        }
        let temHeroCfg = this.heroModel.config as HeroCfg;
        let careerId = id ? id : temHeroCfg.career_id;
        let skills = [];


        // && (this.sceneModel.arenaSyncData.fightType == 'ARENA' ||
        // this.sceneModel.arenaSyncData.fightType == 'ARENATEAM' ||
        // this.sceneModel.arenaSyncData.fightType == 'ARENAHONOR_GUESS')

        if (this.sceneModel.stageConfig.copy_id == CopyType.NONE) {
            skills = HeroUtils.getCareerLineSkills(careerId, 0);
        } else {
            if (this.heroModel.item.series > 800000) {
                this.heroModel.skills.forEach(data => {
                    let info = {
                        skillId: data.id
                    }
                    skills.push(info);
                })
            } else {
                skills = HeroUtils.getCareerLineSkills(careerId, 0);
            }
        }

        //skills = HeroUtils.getCareerLineSkills(careerId, 0);

        //-------------------------觉醒技能-------------------
        //设置技能
        this.heroAwakeSkillNode.active = false
        this._awakeSkill = 0;
        //9星之前隐藏觉醒技能图标
        if (temHeroCfg.awake && this.heroModel.info.heroStar >= 9) {
            let awakeCfgs = ConfigManager.getItems(Hero_awakeCfg, { "hero_id": temHeroCfg.id })
            let maxAwakeCfg = awakeCfgs[awakeCfgs.length - 1]
            this.heroAwakeSkillNode.active = true
            GlobalUtil.setSpriteIcon(this.node, this.heroAwakeSkillIcon, GlobalUtil.getSkillIcon(maxAwakeCfg.ul_awake_skill[0]))
            this._awakeSkill = maxAwakeCfg.ul_awake_skill[0];
            let state: 0 | 1 = this.heroModel.info.heroStar >= temHeroCfg.star_max ? 0 : 1;
            GlobalUtil.setAllNodeGray(this.heroAwakeSkillIcon.parent, state)
        }

        //----------------------------------------------------


        let skillList1 = [];
        let skillList2 = [];
        let heroCfg = this.heroModel.config as HeroCfg;
        let giftLv = 1;
        this.heroModel.info.skills.some(skill => {
            if (skill.skillId == heroCfg.gift_tower_id || skill.skillId == heroCfg.gift_tower_id + 10000) {
                giftLv = skill.skillLv;
                return true;
            }
            return false;
        });
        let giftSkill = PveTool.getSkillCfg(heroCfg.gift_tower_id, giftLv);
        if (giftSkill && (this.heroModel.item.series < 800000 || this.sceneModel.stageConfig.copy_id == CopyType.NONE)) {
            skillList2.push(giftSkill);
        }
        skills.forEach(skill => {
            let skillLv = 1;
            this.heroModel.skillIds.some(s => {
                if (s.skillId == skill.skillId || s.skillId == skill + 10000) {
                    skillLv = s.skillLv;
                    return true;
                }
                return false;
            });
            let cfg = PveTool.getSkillCfg(skill.skillId, skillLv);
            if (cfg) {
                //dmg_type 11 超绝 9 天赋
                if (PveSkillType.isSuper(cfg.type) || cfg.dmg_type == 11 || cfg.dmg_type == 9) {
                    let have = false;
                    skillList2.forEach(cfg => {
                        if (cfg.skill_id == cfg.skill_id) {
                            have = true;
                        }
                    })
                    if (!have) {
                        skillList2.push(cfg);
                    }
                } else if (cfg.icon && cfg.show < 1) {
                    if (skillList1.indexOf(cfg) < 0) {
                        skillList1.push(cfg);
                    }
                }
            }
        })

        skillList1.sort((s1, s2) => {
            return s1.skill_id - s2.skill_id
        })

        //去除重复技能
        let temSkill = skillList2.concat(skillList1);
        let temShowSkill = [];
        let temShowSkillId = [];
        temSkill.forEach(cfg => {
            if (temShowSkillId.indexOf(cfg.skill_id) < 0) {
                temShowSkillId.push(cfg.skill_id)
                temShowSkill.push(cfg);
            }
        })

        if (this.heroModel.info) {
            this.heroModel.info.skills.forEach(skill => {
                if (skill.skillLv > 1) {
                    let idx = temShowSkillId.indexOf(skill.skillId);
                    if (idx !== -1) {
                        temShowSkill[idx] = PveTool.getSkillCfg(skill.skillId, skill.skillLv);
                    }
                }
            })
        }

        this.addSkillItem(this.heroSkillLayout, temShowSkill);
        //this.addSkillItem(this.heroSkillLayout2, skillList2);

        this.heroLv.string = (this.heroModel.item.extInfo as icmsg.HeroInfo).level + ''
        if (this.sceneModel && this.sceneModel.arenaSyncData && this.sceneModel.arenaSyncData.fightType == 'PIECES_CHESS') {
            this.heroLv.string = '';
        }
        //设置星星数量
        let starNum = (this.heroModel.item.extInfo as icmsg.HeroInfo).star;
        //this.starLayout.destroyAllChildren();
        if (starNum > 0) {
            if (starNum >= 12) {
                this.starLabel.node.active = false;
                this.maxStarNode.active = true;
                this.maxStarLb.string = (starNum - 11) + ''
            } else {
                this.starLabel.node.active = true;
                this.maxStarNode.active = false;
                let starTxt = "";
                if (starNum > 5) {
                    starTxt = '1'.repeat(starNum - 5);
                }
                else {
                    starTxt = '0'.repeat(starNum);
                }
                this.starLabel.string = starTxt;
            }


        } else {
            this.starLabel.node.active = false;
            this.maxStarNode.active = false;
        }

        let labsNode = this.labsNode;
        for (let index = 0; index < 4; index++) {
            let stageLab = labsNode.getChildByName(`stageLab${index + 1}`);
            let layoutNode = labsNode.getChildByName(`layout${index + 1}`);
            let attLab = layoutNode.getChildByName(`attLab${index + 1}`);
            let extLab = layoutNode.getChildByName(`extLab${index + 1}`);
            this.stageLabs[index] = stageLab.getComponent(cc.Sprite);
            this.attLabs[index] = attLab.getComponent(cc.Label);
            this.extLabs[index] = extLab.getComponent(cc.Label);
        }

        let cfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, null)
        // 更新英雄属性等级
        let attIconName = ["atk", "def", "hp", "speed"];
        let stageKeys = [
            "grow_atk", // 攻击
            "grow_def", // 防御
            "grow_hp",  // 生命
            "atk_speed",// 出手顺序
        ]
        for (let index = 0; index < this.stageLabs.length; index++) {
            const lab = this.stageLabs[index];
            let key = stageKeys[index];
            let val = cfg[key];
            let tInfo = HeroUtils.getGrowInfoById(key, val);
            let show = tInfo ? tInfo.show : "A";
            let name = attIconName[index];
            if (index <= 3) {
                GlobalUtil.setSpriteIcon(this.node, lab, `view/role/texture/common2/yx_${name}_${show}`);
            }
        }

        //---------------属性显示---------
        this.refreshHeroInfo()
        this.refreshBuff()
        this.refreshCallList()
    }

    addSkillItem(skillLayout: cc.Node, skills: SkillCfg[]) {
        skillLayout.destroyAllChildren();
        if (skills.length > 0) {
            let starNum = (this.heroModel.item.extInfo as icmsg.HeroInfo).star;
            skills.forEach(skillCfg => {
                let node = cc.instantiate(this.heroSkillItem);
                let icon = node.getChildByName('skillIcon').getComponent(cc.Sprite);
                let chaojue = node.getChildByName('chaojue');
                let tianfu = node.getChildByName('tianfu');
                chaojue.active = skillCfg.dmg_type == 11 || PveSkillType.isSuper(skillCfg.type)
                tianfu.active = skillCfg.dmg_type == 9
                let islock = true;
                // if (this.heroModel.skills) {
                //     this.heroModel.skills.forEach(skill => {
                //         if (skill.config.skill_id == skillCfg.skill_id) {
                //             islock = false;
                //             return;
                //         }
                //     })
                // }
                if (this.heroModel.info) {
                    this.heroModel.info.skills.forEach(skill => {
                        if (skill.skillId == skillCfg.skill_id) {
                            islock = false;
                            return;
                        }
                    })
                }
                if (islock && starNum < 12) {
                    GlobalUtil.setGrayState(icon, 1);
                } else {
                    GlobalUtil.setGrayState(icon, 0);
                }
                node.on(cc.Node.EventType.TOUCH_END, () => {
                    this.showSkill(skillCfg.skill_id, skillCfg.level)
                }, this)
                node.parent = skillLayout;
                let path = GlobalUtil.getSkillIcon(skillCfg.skill_id)
                GlobalUtil.setSpriteIcon(this.node, icon, path)
            })
        }
    }

    //打开技能详情界面
    openAwakeSkillInfoView() {
        if (this._awakeSkill > 0) {
            gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
                let comp = node.getComponent(SkillInfoPanelCtrl);
                comp.showSkillInfo(this._awakeSkill);
                node.setPosition(cc.v2(this.node.x - 40, this.node.y + 270))
            });
        }
    }

    /**
     * 获取英雄、士兵身上的buff
     */
    getHeroBuffData(): any[] {
        let model = this.heroModel;
        let b: PveBuffModel[] = [];
        // 自己的BUFF
        let t = model.buffs;
        t && t.length && b.push(...t);
        // 小兵的BUFF
        for (let i = 0, n = model.soldiers.length; i < n; i++) {
            let soldier = model.soldiers[i];
            if (soldier && soldier.model) {
                t = soldier.model.buffs;
                t && t.length && b.push(...t);
            }
        }
        // 收集
        let a: any[] = model.ctrl.buffs.datas;
        for (let i = 0, n = b.length; i < n; i++) {
            let item = b[i];
            if (item.config.icon) {
                if (!a.some(hasId.bind(item))) {
                    a.push({
                        id: item.id,
                        addTime: item.addTime,
                        config: item.config,
                        stack: item.stacking,
                    });
                } else {
                    //刷新buff层数
                    a.forEach(data => {
                        if (data.id == item.id) {
                            data.stack = item.stacking;
                            return;
                        }
                    })
                }
            }
        }
        // 删除失效的
        for (let i = a.length - 1; i >= 0; i--) {
            if (!b.some(hasId.bind(a[i]))) {
                a.splice(i, 1);
            }
        }
        return a;
    }

    //判断buff是否需要刷新
    needRefreshBuff(data: any[]): boolean {
        if (data.length != this.heroBuffs.length) {
            return true
        } else {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if ((data[i].id != this.heroBuffs[i].id || data[i].stack != this.heroBuffs[i].stack)) {
                        return true
                    }
                }
            } else {
                if (this.heroBuffLayout.childrenCount > 0) {
                    this.heroBuffLayout.children.forEach(node => {
                        node.targetOff(this);
                    })
                    this.heroBuffLayout.destroyAllChildren();
                }
            }
        }
        return false;
    }
    //@gdk.binding('heroModel.ctrl.buffs.datas')
    refreshBuff() {
        if (!this.heroModel || !this.heroModel.ctrl || !this.heroModel.ctrl.buffs) {
            return;
        }
        let a: any[] = this.getHeroBuffData();
        if (!this.needRefreshBuff(a)) {
            return;
        }
        this.heroBuffs = [];
        a.forEach(data => {
            this.heroBuffs.push(
                {
                    id: data.id,
                    addTime: data.addTime,
                    config: data.config,
                    stack: data.stack,
                }
            )
        })
        //this.heroBuffs = a.concat();
        this.heroBuffLayout.children.forEach(node => {
            node.targetOff(this);
        })
        this.heroBuffLayout.destroyAllChildren();
        if (a) {
            a.forEach(buffData => {

                let node = cc.instantiate(this.heroBuffItem);
                let icon = node.getComponent(cc.Sprite);
                let num = node.getChildByName('num').getComponent(cc.Label);
                let path: string = ConfigManager.getItemById(CommonCfg, 'BUFF_ICON').value + buffData.config.icon;
                GlobalUtil.setSpriteIcon(this.node, icon, path)
                if (buffData.stack > 1) {
                    num.string = buffData.stack + ''
                    num.node.active = true;
                } else {
                    num.node.active = false;;
                }
                node.parent = this.heroBuffLayout;
                node.on(cc.Node.EventType.TOUCH_START, () => {
                    this.showBuff(buffData.config)
                }, this)
                node.on(cc.Node.EventType.TOUCH_END, () => {
                    this.showBuff(buffData.config, true)
                }, this)
                node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
                    this.showBuff(buffData.config, true)
                }, this)

            })
        }
    }

    //判断召唤物列表是否需要更新
    needRefreshCallList(data: PveCalledCtrl[]): boolean {
        if (data.length != this.heroCalls.length) {
            return true
        } else {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (!this.heroCalls[i] || !this.heroCalls[i].model) return true;
                    if (data[i].model.fightId != this.heroCalls[i].model.fightId) {
                        return true
                    }
                }
            } else {
                if (this.callLayout.childrenCount > 0) {
                    this.callLayout.children.forEach(node => {
                        node.targetOff(this);
                    })
                    this.callLayout.destroyAllChildren();
                }
            }
        }
        return false;
    }

    /**刷新召唤物列表 */
    refreshCallList() {
        if (!this.heroModel) {
            return;
        }
        let datas: PveCalledCtrl[] = PveTool.getCallList(this.sceneModel, this.heroModel);
        if (!this.needRefreshCallList(datas)) {
            return;
        }

        this.heroCalls = datas;
        this.callLayout.children.forEach(node => {
            node.targetOff(this);
        })
        this.callLayout.destroyAllChildren();

        if (datas) {
            datas.forEach(callData => {

                let node = cc.instantiate(this.heroCallItem);
                let ctrl: PveHeroCallItemCtrl = node.getComponent(PveHeroCallItemCtrl);
                if (ctrl) {
                    ctrl.setCallCtrl(callData)
                }
                node.parent = this.callLayout;
                node.on(cc.Node.EventType.TOUCH_START, () => {
                    this.showCallInfo(callData)
                }, this)
                node.on(cc.Node.EventType.TOUCH_END, () => {
                    this.showCallInfo(null)
                }, this)
                node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
                    this.showCallInfo(null)
                }, this)

            })
        }

    }
    /**刷新选中的召唤物信息 */
    refreshSelectCallInfo() {
        let model = this.selectCall.model;
        let prop = model.prop;
        this.callName.string = model.config.name;
        this.callHp.string = StringUtils.format(gdk.i18n.t("i18n:PVE_HERO_INFO_TIP2"), Math.floor(model.hp), Math.floor(model.hpMax))//'生命 ' + Math.floor(model.hp) + '/' + Math.floor(model.hpMax)
        this.callAtk.string = StringUtils.format(gdk.i18n.t("i18n:PVE_HERO_INFO_TIP3"), Math.floor(prop.atk))//'攻击 ' + Math.floor(prop.atk);
        this.callDef.string = StringUtils.format(gdk.i18n.t("i18n:PVE_HERO_INFO_TIP4"), Math.floor(prop.def))//'防御 ' + Math.floor(prop.def);
        this.callSpeed.string = StringUtils.format(gdk.i18n.t("i18n:PVE_HERO_INFO_TIP5"), Math.floor(prop.atk_speed))//'速度 ' + Math.floor(prop.atk_speed);

        let data = this.refreshHateNum(model);
        this.callhateNum.string = StringUtils.format(gdk.i18n.t("i18n:PVE_HERO_INFO_TIP1"), data[0], data[1])//'拦截 ' + data[0] + '/' + data[1];
    }

    /**更新品质显示 */
    _updateQuality() {
        let cfg = this.heroModel.config;
        if (!cfg) {
            this.heroIconBg.node.active = false
        } else {
            let color = (<icmsg.HeroInfo>this.heroModel.item.extInfo).color;
            if (this.sceneModel.arenaSyncData && this.sceneModel.arenaSyncData.fightType == 'PIECES_CHESS') {
                color = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', cfg.id).color;
            }
            if (this.quality != color) {
                // this.heroIconBg.node.active = true
                // let path1 = `common/texture/sub_itembg0${cfg.color}`
                // GlobalUtil.setSpriteIcon(this.node, this.heroIconBg, path1)
                // this.quality = cfg.color
                this.heroIconBg.node.active = true
                // this.titleBg.node.active = true

                // // 背景品质
                let path1 = `common/texture/role/select/quality_bg_0${color}`
                // // 标题品质
                // let path2 = `common/texture/sub_roltxtbg0${cfg.color}`
                GlobalUtil.setSpriteIcon(this.node, this.heroIconBg, path1)
                // GlobalUtil.setSpriteIcon(this.node, this.titleBg, path2)

                this.quality = color
            }
        }
    }

    //显示召唤物详情
    showCallInfo(data: PveCalledCtrl) {
        if (data && data.isAlive) {
            this.selectCall = data;
            this.callTipsNode.active = true;
            this.refreshSelectCallInfo();
        } else {
            this.selectCall = null;
            this.callTipsNode.active = false;
        }
    }

    //显示buff描述
    showBuff(buffCfg: Skill_buffCfg, isClose: boolean = false) {
        if (isClose) {
            this.buffDescNode.active = false;
            return;
        } else {
            this.buffDescNode.active = true;
        }
        this.buffDesc.string = buffCfg.des;
    }

    //----------打开技能详情页面------------
    showSkill(skillId: number, lv?: number) {
        gdk.panel.setArgs(PanelId.SkillInfoPanel, cc.v2(this.node.x - 40, this.node.y + 270))
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            let comp = node.getComponent(SkillInfoPanelCtrl)
            comp.showSkillInfo(skillId, lv)
            //node.setPosition(cc.v2(this.node.x - 40, this.node.y + 270))
        })
    }

    refreshHeroInfo() {
        //攻击
        this.attLabs[0].string = this.heroModel.baseProp.atk + ''
        let addAtk = Math.floor(this.heroModel.prop.atk - this.heroModel.baseProp.atk)
        if (addAtk > 0) {
            this.extLabs[0].string = "+" + addAtk;
            this.extLabs[0].node.color = this.colorList[0];
        } else {
            this.extLabs[0].string = "" + addAtk;
            this.extLabs[0].node.color = this.colorList[1];
        }
        this.extLabs[0].node.active = addAtk != 0;

        //防御
        this.attLabs[1].string = this.heroModel.baseProp.def + ''
        let addDef = Math.floor(this.heroModel.prop.def - this.heroModel.baseProp.def)
        if (addDef > 0) {
            this.extLabs[1].string = "+" + addDef;
            this.extLabs[1].node.color = this.colorList[0];
        } else {
            this.extLabs[1].string = "" + addDef;
            this.extLabs[1].node.color = this.colorList[1];
        }
        this.extLabs[1].node.active = addDef != 0;

        //生命
        this.attLabs[2].string = this.heroModel.baseProp.hp + ''
        let addHpMax = Math.floor(this.heroModel.hpMax - this.heroModel.baseProp.hp)
        if (addHpMax > 0) {
            this.extLabs[2].string = "+" + addHpMax;
            this.extLabs[2].node.color = this.colorList[0];
        } else {
            this.extLabs[2].string = "" + addHpMax;
            this.extLabs[2].node.color = this.colorList[1];
        }
        this.extLabs[2].node.active = addHpMax != 0;

        //速度
        this.attLabs[3].string = '100'//this.heroModel.baseProp.atk_speed + ''
        let addSpeed = this.heroModel.getProp('atk_speed_r');//Math.floor(this.heroModel.prop.atk_speed - this.heroModel.baseProp.atk_speed)
        if (addSpeed > 0) {
            this.extLabs[3].string = "+" + Math.floor(addSpeed / 100);
            this.extLabs[3].node.color = this.colorList[0];
        } else {
            addSpeed = Math.max(-100, addSpeed / 100)
            this.extLabs[3].string = "" + Math.floor(addSpeed);
            this.extLabs[3].node.color = this.colorList[1];
        }
        this.extLabs[3].node.active = addSpeed != 0;

    }

    openHeroDesc() {

        gdk.panel.open(PanelId.PveHeroDetailFightInfo, (node: cc.Node) => {
            let ctrl = node.getComponent(PveHeroTipsCtrl);
            ctrl.setPveHeroModel(this.heroModel);
        })

    }



    //显示英雄其他加成技能
    openHeroAllSkillDesc() {

        // gdk.panel.open(PanelId.PveHeroEquitSkillInfoTip, (node: cc.Node) => {
        //     let ctrl = node.getComponent(PveHeroEquitSkillInfoTipCtrl);
        //     let data = null;
        //     let tem = HeroUtils.getHeroInfoByHeroId(this.heroModel.item.series)
        //     if (tem && tem.typeId == this.heroModel.item.itemId) {
        //         data = tem
        //     }
        //     ctrl.setHeroData(data);
        //     node.setPosition(cc.v2(this.node.x, this.node.y + 300))
        // })

    }

    // // 隐藏相关联的界面
    // close(buttonIndex: number = -1) {
    //     [
    //         PanelId.PveSceneEquipListPanel,
    //         PanelId.PveSceneHeroDetailPanel,
    //     ].forEach(o => {
    //         let node = gdk.panel.get(o);
    //         if (node) {
    //             let ctrl = node.getComponent(gdk.BasePanel);
    //             ctrl && ctrl.close();
    //         }
    //     });
    //     if (this.heroModel) {
    //         this.heroModel.ctrl.tower.showAtkDisLater(0);
    //     }
    //     super.close(buttonIndex);
    // }

    @gdk.binding('heroModel.hp')
    _setHp(v: number, ov: number, nv: number) {
        this.hpLb.string = this.heroModel.hp + '/' + this.heroModel.hpMax
        this.hpSp.width = Math.floor(this.heroModel.hp / this.heroModel.hpMax * 396)
    }


    refreshHateNum(model: PveBaseFightModel): number[] {
        let res = []
        let hate_num = model.getProp('hate_num');
        let c = 0;

        if (hate_num > 0) {
            let s = this.sceneModel;
            let arr = [s.enemies, s.specialEnemies, s.calleds];
            // 查询列表中满足要求的数量
            for (let j = 0; j < arr.length; j++) {
                let a: PveFightCtrl[] = arr[j];
                for (let i = 0, n = a.length; i < n; i++) {
                    let t = a[i];
                    if (t && t.isAlive) {
                        if (t.model.camp != model.camp &&
                            t.model.targetId == model.fightId) {
                            // 不同阵营的对象的目标为attacker时，则仇恨值加一
                            c++;
                            if (c >= hate_num) {
                                c = hate_num
                                break;
                            }
                        }
                    }
                }
            }
        }
        res = [hate_num - c, hate_num];
        return res;
    }

    grayTypes: number[] = []

    isShowHeroEquitSkillBtn() {
        let res = false
        //let data: icmsg.HeroInfo = null;
        let data = this.heroModel.item.extInfo as icmsg.HeroInfo////HeroUtils.getHeroInfoByHeroId(this.heroModel.item.series)
        // if (tem && tem.typeId == this.heroModel.item.itemId) {
        //     data = tem
        // }
        // if (!data) {
        //     return false
        // }
        this.grayTypes = []
        //符文
        if (data.runes.length > 0) {
            this.runeSkill.active = true;
            GlobalUtil.setGrayState(this.runeSkill, 0)
        } else if (data.star >= 6) {
            this.runeSkill.active = true;
            GlobalUtil.setGrayState(this.runeSkill, 1)
            this.grayTypes.push(0);
        }
        //神装
        if (data.costumeIds.length > 0) {
            let suitNum = 0//是否有多套装
            let suitMap = CostumeUtils.getCostumeSuitInfo(data.costumeIds)
            let suitActiveType = []
            for (let key in suitMap) {
                if (suitMap[key].length >= 2) {
                    suitNum++
                    suitActiveType.push(parseInt(key))
                }
            }
            for (let key in suitMap) {
                let colors = suitMap[key]
                //颜色从小到大
                GlobalUtil.sortArray(colors, (a: number, b: number) => {
                    return a - b
                })
                let suitCfgs: Costume_compositeCfg[] = []
                if (colors.length >= 2) {
                    let type = parseInt(key)
                    let color1Num = CostumeUtils.getSuitColorNum(colors, 1, true)
                    let color2Num = CostumeUtils.getSuitColorNum(colors, 2, true)
                    let color3Num = CostumeUtils.getSuitColorNum(colors, 3, true)
                    let color4Num = CostumeUtils.getSuitColorNum(colors, 4, true)
                    let colorNums = [{ color: 1, num: color1Num }, { color: 2, num: color2Num }, { color: 3, num: color3Num }, { color: 4, num: color4Num }]
                    GlobalUtil.sortArray(colorNums, (a: any, b: any) => {
                        if (a.num == b.num) {
                            return b.color - a.color
                        }
                        return a.num - b.num
                    })

                    let colorMax = this._getColorMax(colorNums, 4)
                    let colorMin = this._getColorMax(colorNums, 2)
                    let numMax = CostumeUtils.getSuitColorNum(colors, colorMax, true)
                    let numMin = CostumeUtils.getSuitColorNum(colors, colorMin, true)

                    let suitCfgMax = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMax, num: numMax })
                    let suitCfgMin = null//
                    if (colorMin != colorMax || suitNum > 1) {
                        suitCfgMin = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMin, num: numMin })
                    }
                    if (suitCfgMin && colorMin != colorMax) {
                        if (suitCfgMax.num != suitCfgMin.num) {
                            suitCfgs.push(suitCfgMin)
                        } else {
                            if (colorMin > colorMax) {
                                suitCfgMax = suitCfgMin
                            }
                        }
                    }
                    suitCfgs.push(suitCfgMax)

                    if (suitNum == 1 && suitCfgs.length == 1 && suitCfgs[0].num > 2) {
                        let suitCfg2 = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMax, num: 2 })
                        let suitCfg4 = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMax, num: 4 })

                        if (suitCfg2.num != suitCfgs[0].num) {
                            suitCfgs.push(suitCfg2)
                        }

                        if (suitCfg4.num != suitCfgs[0].num) {
                            suitCfgs.push(suitCfg4)
                        }
                    }

                    GlobalUtil.sortArray(suitCfgs, (a, b) => {
                        return a.num - b.num
                    })

                    if (suitCfgs.length > 0) {
                        //return true;
                        this.costumeSkill.active = true;
                        GlobalUtil.setGrayState(this.costumeSkill, 0)
                    }

                }

            }
        }
        if (!this.costumeSkill.active && data.star >= 7) {
            this.costumeSkill.active = true;
            GlobalUtil.setGrayState(this.costumeSkill, 1)
            this.grayTypes.push(1);
        }
        //守护者
        if (data.guardian && data.guardian.id > 0) {
            //return true;
            this.guardianSkill.active = true;
            GlobalUtil.setGrayState(this.guardianSkill, 0)
        } else if (data.star >= 10) {
            this.guardianSkill.active = true;
            GlobalUtil.setGrayState(this.guardianSkill, 1)
            this.grayTypes.push(2);
        }

        //能源石
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', data.careerId)
        let stoneInSlot = ModelManager.get(BYModel).energStoneInSlot
        stoneInSlot.forEach(s => {
            let cfg = ConfigManager.getItemById(Tech_stoneCfg, s.itemId);
            if (cfg.career_type == careerCfg.career_type) {
                this.nysSkill.active = true;
                GlobalUtil.setGrayState(this.nysSkill, 0)
            }
        });

        if (!this.nysSkill.active && JumpUtils.ifSysOpen(2931)) {
            this.nysSkill.active = true;
            GlobalUtil.setGrayState(this.nysSkill, 1)
            this.grayTypes.push(3);
        }

        //精甲
        if (data.soldierSkin > 0) {
            //return true
            this.soldierSkinSkill.active = true
            GlobalUtil.setGrayState(this.soldierSkinSkill, 0)
        } else if (JumpUtils.ifSysOpen(1101)) {
            this.soldierSkinSkill.active = true;
            GlobalUtil.setGrayState(this.soldierSkinSkill, 1)
            this.grayTypes.push(4);
        }

        //专属装备
        if (data.uniqueEquip && data.uniqueEquip.id > 0) {
            let uniqueEquipCfg = ConfigManager.getItemById(UniqueCfg, data.uniqueEquip.itemId)
            if (uniqueEquipCfg.unique && uniqueEquipCfg.unique.length > 0) {
                this.uniqueEquipSkill.active = data.typeId == uniqueEquipCfg.unique[0]
            } else {
                this.uniqueEquipSkill.active = true;
            }

        }
        if (!this.uniqueEquipSkill.active && data.star >= 7) {
            this.uniqueEquipSkill.active = true;
            GlobalUtil.setGrayState(this.uniqueEquipSkill, 1)
            this.grayTypes.push(5);
        }
    }


    openEquitSkillInfo(e, data) {
        let type = parseInt(data);

        let lock = false
        if (this.grayTypes.indexOf(type) >= 0) {
            //let titleStrs: string[] = ["符文技能", "神装技能", "守护者技能", "能源石技能", "兵甲技能", "专属装备技能"]
            lock = true;
        }

        if (type < 5) {
            //let temData = null;
            // let tem = HeroUtils.getHeroInfoByHeroId(this.heroModel.item.series)
            // if (tem && tem.typeId == this.heroModel.item.itemId) {
            //     temData = tem
            // }
            let temData = this.heroModel.item.extInfo as icmsg.HeroInfo;
            gdk.panel.setArgs(PanelId.PveHeroEquitSkillInfoTip2, type, temData, lock)
            gdk.panel.open(PanelId.PveHeroEquitSkillInfoTip2, (node: cc.Node) => {
                node.setPosition(cc.v2(this.node.x, this.node.y + 350))
            })
        } else {
            //打开专属装备技能界面
            // let temData = null;
            // let tem = HeroUtils.getHeroInfoByHeroId(this.heroModel.item.series)
            // if (tem && tem.typeId == this.heroModel.item.itemId) {
            //     temData = tem
            // }
            let temData = this.heroModel.item.extInfo as icmsg.HeroInfo;
            gdk.panel.setArgs(PanelId.PveHeroEquitSkillInfoTip3, temData, lock)
            gdk.panel.open(PanelId.PveHeroEquitSkillInfoTip3, (node: cc.Node) => {
                node.setPosition(cc.v2(this.node.x, this.node.y + 350))
            })
        }


    }


    _getColorMax(colorNums, num) {
        for (let i = 0; i < colorNums.length; i++) {
            if (colorNums[i].num >= num) {
                return colorNums[i].color
            }
        }
        return 1
    }

}
