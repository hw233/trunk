import ButtonSoundId from '../../../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import StarItemCtrl from '../../../../../common/widgets/StarItemCtrl';
import { BagItem } from '../../../../../common/models/BagModel';
import { Hero_careerCfg, HeroCfg } from '../../../../../a/config';
import { RoleEventId } from '../../../enum/RoleEventId';


const typeKeys = ["atk_w", "def_w", "hp_w", "hit_w", "dodge_w"]


const attrKeys = ["ul_hp_w", "ul_atk_w", "ul_def_w", "ul_hit_w", "ul_dodge_w", "ul_crit_w", "ul_atk_r", "ul_hp_r", "ul_def_r"]

/*
//转职提示窗口
 * @Author: luoyong 
 * @Date: 2020-02-27 10:32:43 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-15 11:02:53
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/career/CareerAdvanceTipCtrl2")
export default class CareerAdvanceTipCtrl2 extends cc.Component {

    @property(cc.Node)
    careerIcon: cc.Node = null

    @property(cc.Node)
    lvNode: cc.Node = null

    @property(StarItemCtrl)
    careerLvNode: Array<StarItemCtrl> = []

    @property(cc.Label)
    careerLv: cc.Label = null

    @property(cc.Node)
    title: cc.Node = null

    @property(cc.Node)
    downBg: cc.Node = null

    @property(cc.Node)
    valueNode: cc.Node[] = []

    @property(sp.Skeleton)
    spine: sp.Skeleton = null

    @property(cc.Node)
    attrNode: cc.Node = null

    @property(sp.Skeleton)
    spineStar: sp.Skeleton = null;

    @property(cc.Node)
    skillNode: cc.Node = null

    @property(cc.Node)
    soldierNode: cc.Node = null

    @property(cc.Node)
    skillTitle: cc.Node = null

    @property(cc.RichText)
    skillDesc: cc.RichText = null

    @property(cc.Node)
    skillNameLayout: cc.Node = null

    @property(cc.Node)
    skillType: cc.Node = null

    @property(cc.Label)
    skillName: cc.Label = null

    @property(cc.Node)
    skillIconBg: cc.Node = null

    @property(sp.Skeleton)
    skillEffect: sp.Skeleton = null

    @property(cc.Node)
    skillIcon: cc.Node = null

    @property(cc.Node)
    superIcon: cc.Node = null

    @property(cc.Node)
    soldierTitle: cc.Node = null

    @property(sp.Skeleton)
    soldierSpine: sp.Skeleton = null

    @property(sp.Skeleton)
    soldierEffect: sp.Skeleton = null

    @property(cc.Label)
    soldierName: cc.Label = null

    @property(cc.RichText)
    soldierDesc: cc.RichText = null

    @property(cc.Node)
    masterNode: cc.Node = null

    @property(cc.Node)
    masterTitle: cc.Node = null

    @property(cc.Label)
    masterDesc: cc.Label = null

    @property(cc.Node)
    masterCareerIconBg: cc.Node = null

    @property(cc.Node)
    masterCareerIcon: cc.Node = null

    @property(sp.Skeleton)
    masterSpine: sp.Skeleton = null

    @property(cc.Node)
    masteAttrNode: cc.Node = null

    @property(cc.Node)
    attr: cc.Node = null

    @property(cc.Node)
    maskNode: cc.Node = null

    heroData: BagItem = null
    careerId: number = 0
    level: number = 0
    upCfg: Hero_careerCfg = null
    curCfg: Hero_careerCfg = null
    heroCfg: HeroCfg = null

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel)
    }

    attrKeysText = [
        gdk.i18n.t("i18n:ROLE_TIP25"),
        gdk.i18n.t("i18n:ROLE_TIP26"),
        gdk.i18n.t("i18n:ROLE_TIP27"),
        gdk.i18n.t("i18n:ROLE_TIP28"),
        gdk.i18n.t("i18n:ROLE_TIP29"),
        gdk.i18n.t("i18n:ROLE_TIP30"),
        gdk.i18n.t("i18n:ROLE_TIP31"),
        gdk.i18n.t("i18n:ROLE_TIP32"),
        gdk.i18n.t("i18n:ROLE_TIP33"),
    ]

    onLoad() {

    }

    onEnable() {
        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.advance);
        // JumpUtils.showGuideMask()
        this.maskNode.active = true

        this.heroData = HeroUtils.getHeroInfoBySeries(this.heroModel.heroCareerUpData.heroId)
        this.careerId = this.heroModel.heroCareerUpData.careerId
        this.level = this.heroModel.heroCareerUpData.careerLv

        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroData.itemId)

        this.upCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.careerId, { career_lv: this.level - 1 })
        let preCareerId = HeroUtils.getJobPreId(this.careerId)
        if (preCareerId != 0 && this.level == 0) {
            let maxLv = HeroUtils.getJobMaxLv(this.careerId)
            this.upCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", preCareerId, { career_lv: maxLv })
        }
        // if (this.heroModel.heroCareerBeforeTranData) {
        //     let lastCareerId = this.heroModel.heroCareerBeforeTranData.careerId
        //     let lastCareerLv = this.heroModel.heroCareerBeforeTranData.careerLv
        //     this.upCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", lastCareerId, { career_lv: lastCareerLv })
        // }
        this.curCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.careerId, { career_lv: this.level })
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, GlobalUtil.getCareerIcon(this.careerId))

        // let rankNameArr = ["初级", "中级", "高级"];
        // this.careerLv.string = `${rankNameArr[this.curCfg.rank]}+${this.curCfg.career_lv + 1}`

        this._updateStarNum(true)
        this._updateAttrValue()
        this.attrNode.active = false
        this.soldierNode.active = false
        this.skillNode.active = false
        this.masterNode.active = false
        this.spine.setAnimation(0, "stand", false)
        this.scheduleOnce(() => {
            this.spineStar.node.active = true
            this.spineStar.setAnimation(0, "stand3", false)
            this.scheduleOnce(() => {
                this._updateStarNum()
            }, 0.5)
            this.spineStar.setCompleteListener(() => {

                this.attrNode.active = true
                let ani = this.attrNode.getComponent(cc.Animation)
                ani.play()
                ani.on("finished", () => {
                    // if (!((this.curCfg.gain_soldier > 0 && this.curCfg.gain_soldier != this.heroCfg.soldier_id[0])
                    //     || (this.curCfg.ul_skill && this.curCfg.ul_skill.length > 0)
                    //     || this.level >= HeroUtils.getJobMaxLv(this.careerId))) {
                    //     this.maskNode.active = false
                    // }
                }, this)
            })
        }, 2)

        //展示技能 士兵获得效果
        this.scheduleOnce(() => {
            let record = this.heroModel.heroCareerUpRecord
            let skillIndex = record["skill"] ? record["skill"] : 0;

            let maxLv = HeroUtils.getJobMaxLv(this.careerId)
            if (this.level >= maxLv) {
                this._updateMasterNode()
                return
            }


            // if (!record["soldier"] && this.curCfg.gain_soldier > 0) {
            //     if (this.curCfg.gain_soldier != this.heroCfg.soldier_id[0]) {
            //         record["soldier"] = 1;
            //         this._updateSoldierNode()
            //         return
            //     }
            // }
            let ids = this._getShowSkillIds()
            if (skillIndex < ids.length) {
                this._updateSkillNode(skillIndex);
                record["skill"] = ++skillIndex;
                return
            }
        }, 4.5)
    }

    //星星
    _updateStarNum(isPre: boolean = false) {
        let eachCount = this.careerLvNode.length
        let curLv = HeroUtils.getHeroJobLv(this.heroModel.heroCareerUpData.heroId, this.careerId) + 1
        let maxLv = HeroUtils.getJobMaxLv(this.careerId) + 1
        if (isPre) {
            curLv = curLv - 1
        }
        let maxNum = Math.max(1, maxLv)
        let starNum = curLv
        for (let index = 0; index < eachCount; index++) {
            let scr = this.careerLvNode[index]
            scr.node.active = index < maxNum;
            let state = starNum > index ? 1 : 0;
            scr.updateState(state)
        }
        this.lvNode.getComponent(cc.Layout).updateLayout()
        //星星位置定位
        if (isPre) {
            let lv = HeroUtils.getHeroJobLv(this.heroModel.heroCareerUpData.heroId, this.careerId) + 1
            this.spineStar.node.active = false
            let index = lv - 1
            this.spineStar.node.x = this.careerLvNode[index].node.x
        }
    }

    //属性
    _updateAttrValue() {
        for (let index = 0; index < this.valueNode.length; index++) {
            let attNode: cc.Node = this.valueNode[index]
            let curLab = attNode.getChildByName("curValue").getComponent(cc.Label)
            let nextLab = attNode.getChildByName("nextValue").getComponent(cc.Label)
            let tkey = typeKeys[index]
            curLab.string = this.upCfg[tkey] ? this.upCfg[tkey] : 0
            nextLab.string = this.curCfg[tkey] ? this.curCfg[tkey] : 0
            // if (index == 0) {
            //     let uplvCfg = ConfigManager.getItemByField(Hero_lvCfg, "rank", this.curCfg.rank, { clv: this.curCfg.career_lv })
            //     let curlvCfg = ConfigManager.getItemByField(Hero_lvCfg, "rank", this.curCfg.rank, { clv: this.curCfg.career_lv + 1 })
            //     curLab.string = `${uplvCfg.id}`
            //     if (curlvCfg) {
            //         nextLab.string = `${curlvCfg.id}`
            //     } else {
            //         let showLvCfg = ConfigManager.getItemByField(Hero_lvCfg, "rank", this.curCfg.rank + 1, { clv: 1 })
            //         if (showLvCfg) {
            //             nextLab.string = `${showLvCfg.id}`
            //         } else {
            //             nextLab.string = `${ConfigManager.getItems(Hero_lvCfg).length}`
            //         }
            //     }
            // } else {
            //     let tkey = typeKeys[index]
            //     curLab.string = this.upCfg[tkey] ? this.upCfg[tkey] : 0
            //     nextLab.string = this.curCfg[tkey] ? this.curCfg[tkey] : 0
            // }
        }
    }

    //技能相关信息
    _updateSkillNode(skillIndex: number) {
        this.maskNode.active = true
        this.soldierNode.active = false
        this.masterNode.active = false
        this.skillNode.active = true


        this.skillEffect.setAnimation(0, "stand", true)
        let ids = this._getShowSkillIds()
        let skillId = ids[skillIndex];
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(skillId))
        let skillCfg = GlobalUtil.getSkillCfg(skillId)
        this.skillName.string = skillCfg ? skillCfg.name : ""
        this.skillDesc.string = skillCfg ? skillCfg.des : "";
        //超绝图标显示
        this.superIcon.active = skillCfg ? skillCfg.type == 501 : false;
        let taPath = "view/role/texture/career2/juese_ta"
        let kaPath = "view/role/texture/career2/juese_ka"
        GlobalUtil.setSpriteIcon(this.node, this.skillType, HeroUtils.isCardSkill(skillId) ? kaPath : taPath)

        let ani = this.skillNode.getComponent(cc.Animation)
        ani.play()
        ani.on("finished", () => {
            this.maskNode.active = false
        }, this)

        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.popup);
    }

    /**士兵相关 */
    _updateSoldierNode() {
        this.maskNode.active = true
        this.skillNode.active = false
        this.masterNode.active = false
        this.soldierNode.active = true

        this.soldierEffect.setAnimation(0, "animation", true)

        // let cfg = ConfigManager.getItemById(SoldierCfg, this.curCfg.gain_soldier)
        // this.soldierName.string = cfg.name
        // this.soldierDesc.string = cfg.desc;
        // GlobalUtil.setUiSoldierSpineData(this.node, this.soldierSpine, cfg.skin)

        let ani = this.soldierNode.getComponent(cc.Animation)
        ani.play()
        ani.on("finished", () => {
            this.maskNode.active = false
        }, this)

        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.popup);
    }

    /**精通相关 */
    _updateMasterNode() {

        this.maskNode.active = true
        this.soldierNode.active = false
        this.skillNode.active = false
        this.masterNode.active = true

        this.masterSpine.setAnimation(0, "stand", true)
        GlobalUtil.setSpriteIcon(this.node, this.masterCareerIcon, GlobalUtil.getCareerIcon(this.careerId))

        for (let index = 0; index < attrKeys.length; index++) {
            let attNode: cc.Node = this.masteAttrNode.children[index]
            let value = this.curCfg[attrKeys[index]]
            if (value && value > 0) {
                if (!attNode) {
                    attNode = cc.instantiate(this.attr)
                    attNode.active = true
                    attNode.parent = this.masteAttrNode
                }
                let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
                let curLab = attNode.getChildByName("curLab").getComponent(cc.Label)
                typeLab.string = `${this.attrKeysText[index]}`
                if (attrKeys[index].indexOf("_r") != -1) {
                    curLab.string = `+${value / 100}%`
                } else {
                    curLab.string = `+${value}`
                }
            } else {
                if (attNode) {
                    attNode.active = false
                }
            }
        }
        let ani = this.masterNode.getComponent(cc.Animation)
        ani.play()
        ani.on("finished", () => {
            this.maskNode.active = false
        }, this)

        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.popup);
    }


    //点击关闭 技能，有多的技能继续显示
    closeSkillNode() {
        this.skillNode.active = false
        let record = this.heroModel.heroCareerUpRecord
        let skillIndex = record["skill"] ? record["skill"] : 0;
        let ids = this._getShowSkillIds()
        if (skillIndex < ids.length) {
            this._updateSkillNode(skillIndex);
            record["skill"] = ++skillIndex;
        } else {
            gdk.panel.hide(PanelId.CareerAdvanceTipCtrl2)
        }
    }

    _getShowSkillIds() {
        let ids = []
        if (this.curCfg.ul_skill && this.curCfg.ul_skill.length > 0) {
            for (let i = 0; i < this.curCfg.ul_skill.length; i++) {
                let skillCfg = GlobalUtil.getSkillCfg(this.curCfg.ul_skill[i])
                if (skillCfg && skillCfg && skillCfg.show && skillCfg.show == 1) {
                    continue
                }
                ids.push(this.curCfg.ul_skill[i])
            }
        }
        return ids
    }

    //点击关闭士兵 有技能继续显示技能
    closeSoldierNode() {
        this.soldierNode.active = false
        this.closeSkillNode()
    }

    //点击关闭精通
    closeMasterNode() {
        this.masterNode.active = false
        this.closeSkillNode()
    }

    onDisable() {
        gdk.e.emit(RoleEventId.UPDATE_HERO_POWER)
        gdk.e.targetOff(this);
        this.unscheduleAllCallbacks()
        this.heroModel.heroCareerUpRecord = {};//最后一个清空记录
        this.heroModel.heroCareerBeforeTranData = null//清掉记录
    }
}