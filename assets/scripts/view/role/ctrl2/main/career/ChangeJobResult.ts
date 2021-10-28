import ButtonSoundId from '../../../../../configs/ids/ButtonSoundId';
import ChangeJobSkillItemCtrl from './ChangeJobSkillItemCtrl';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../skill/SkillInfoPanelCtrl';
import { Hero_careerCfg, Hero_growCfg, HeroCfg } from '../../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass()
export default class ChangeJobResult extends cc.Component {

    // @property(sp.Skeleton)
    // titleSpine: sp.Skeleton = null;

    // @property(cc.Node)
    // careerIcon: cc.Node = null;

    // @property(cc.Node)
    // attrNodes: cc.Node[] = [];

    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(sp.Skeleton)
    startSpine: sp.Skeleton = null;

    @property(sp.Skeleton)
    bgEffect: sp.Skeleton = null;

    @property(cc.Node)
    heroNode: cc.Node = null;

    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null;

    @property(cc.Label)
    heroName: cc.Label = null;

    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Label)
    careerLv: cc.Label = null;

    @property(sp.Skeleton)
    careerEffect: sp.Skeleton = null;

    @property(cc.Node)
    proNode: cc.Node = null;

    @property(cc.Node)
    attrNodes: cc.Node[] = [];

    @property(cc.Node)
    skillNode: cc.Node = null;

    @property(cc.Prefab)
    skillItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    skillMoveNode: cc.Node = null;

    @property(cc.Node)
    ligth1: cc.Node = null;

    @property(cc.Node)
    ligth2: cc.Node = null;

    step: number = 0;
    isNew: boolean;
    heroId: number;
    careerCfg: Hero_careerCfg;
    oldCareerId: number
    heroCfg: HeroCfg
    oldAttr: icmsg.HeroAttr
    isCardSkill = true
    _startTouchX = 0
    skillItems: cc.Node[] = []
    _isCanMove = true
    onDestroy() {
        this.skillMoveNode.off(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.skillMoveNode.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.skillMoveNode.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
        gdk.Timer.clearAll(this)
        this.step = 0
    }

    onEnable() {

    }

    _onTouchBegin(event: cc.Event.EventTouch) {
        this._startTouchX = event.getLocation().x
    }

    _onTouchEnd(event: cc.Event.EventTouch) {
        if (!this._isCanMove) {
            return
        }
        var endX = event.getLocation().x
        if (endX - this._startTouchX > 50) {
            this.isCardSkill = !this.isCardSkill
            this.onMove(true)
        } else if (endX - this._startTouchX < -50) {
            this.isCardSkill = !this.isCardSkill
            this.onMove(false)
        }
    }

    onMove(bool: boolean) {
        this._isCanMove = false
        for (let i = 0; i < this.skillItems.length; i++) {
            let node = this.skillItems[i]
            let ctrl = node.getComponent(ChangeJobSkillItemCtrl)
            let ids = this._getShowSkills(this.careerCfg.career_id, this.isCardSkill)
            let id = ids[i]
            if (id) {
                node.active = true
                ctrl.initSkill(id)
            }
        }
        let layer = this.skillNode.getChildByName("layer")
        layer.opacity = 0
        layer.x = bool ? -600 : 300
        let time = bool ? 0.3 : 0.5
        let action = cc.sequence(
            cc.spawn(cc.fadeIn(time), cc.moveTo(time, cc.v2(-300, -235))),
            cc.callFunc(() => {
                this._isCanMove = true
            })
        )
        layer.runAction(action)

        this.ligth1.active = !this.isCardSkill
        this.ligth2.active = this.isCardSkill
    }

    setInfo(heroId: number, careerId: number, oldCareerId: number, oldAttr: icmsg.HeroAttr, isNew: boolean) {
        this.heroId = heroId;
        this.oldCareerId = oldCareerId
        this.oldAttr = oldAttr
        let heroBagItem = HeroUtils.getHeroInfoBySeries(heroId)
        this.heroCfg = ConfigManager.getItemById(HeroCfg, heroBagItem.itemId)
        this.careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId);

        this.bgNode.getComponent(cc.Button).enabled = false;
        this.startEffect();
    }

    closeFunc() {
        if (this.step == 1) {
            this.bgNode.getComponent(cc.Button).enabled = false;
            this.step = 0
            let hideAttrAni = this.proNode.getComponent(cc.Animation)
            hideAttrAni.play("changeCareerAttrHide")
            this.skillNode.active = true
            let skillAni = this.skillNode.getComponent(cc.Animation)
            skillAni.play("changeCareerSkill")
            skillAni.on('finished', () => {
                this.showSkillEffect()
                gdk.Timer.once(3000, this, () => {
                    this.step = 2
                    this.bgNode.getComponent(cc.Button).enabled = true
                    this.skillMoveNode.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
                    this.skillMoveNode.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
                    this.skillMoveNode.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
                })
            })
        } else if (this.step == 2) {
            gdk.panel.hide(PanelId.ChangeJobResult)
        }
    }

    startEffect() {
        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.risingStar);
        this.heroNode.opacity = 0
        this.skillNode.active = false
        this.startSpine.setCompleteListener(() => {
            this.startSpine.node.active = false;
            if (!cc.isValid(this.node)) return;
            this.bgEffect.setAnimation(0, "stand3", false);
            this.showHeroEffect();
        });
        this.startSpine.setAnimation(0, "stand5", false);
        HeroUtils.setSpineData(this.node, this.heroSpine, this.heroCfg.skin, true, false);
        this.heroName.string = this.heroCfg.name
        GlobalUtil.setSpriteIcon(this.heroNode, this.careerIcon, GlobalUtil.getCareerIcon(this.oldCareerId))
        // let rankNameArr = ["初级", "中级", "高级"];
        // let oldCareerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.oldCareerId);
        // this.careerLv.string = `${rankNameArr[oldCareerCfg.rank]}+${HeroUtils.getHeroJobLv(this.heroId, this.oldCareerId) + 1}`
    }

    showHeroEffect() {
        this._updateHeroAttr()
        let showAction = cc.spawn(cc.fadeIn(1),
            cc.callFunc(() => {
                let ani = this.careerIcon.getComponent(cc.Animation)
                this.careerEffect.setCompleteListener(() => {
                    this.careerEffect.node.active = false;
                });
                //图标晃动
                ani.play("changeCareerShake")
                this.careerEffect.setAnimation(0, "stand6", false);
                let self = this
                gdk.Timer.once(1300, this, () => {
                    ani.stop("changeCareerShake")
                    GlobalUtil.setSpriteIcon(this.heroNode, this.careerIcon, GlobalUtil.getCareerIcon(this.careerCfg.career_id))
                    // let rankNameArr = ["初级", "中级", "高级"];
                    // this.careerLv.string = `${rankNameArr[this.careerCfg.rank]}+${HeroUtils.getHeroJobLv(this.heroId, this.careerCfg.career_id) + 1}`
                    ani.play("changeCareerShow")
                    ani.on('finished', () => {
                        let attrAni = self.proNode.getComponent(cc.Animation)
                        attrAni.play("changeCareerAttr")
                        attrAni.on('finished', this._updateStep, this)
                    }, this);
                })
            }))
        this.heroNode.runAction(showAction)
    }

    _updateStep() {
        this.bgNode.getComponent(cc.Button).enabled = true;
        //属性展示完
        let ids = HeroUtils.getJobBackId(this.heroCfg.career_id)
        //多线路 要显示技能展示效果
        if (ids.length > 1) {
            this.step = 1
        } else {
            this.step = 2
        }
        let attrAni = this.proNode.getComponent(cc.Animation)
        attrAni.off('finished', this._updateStep, this)
    }


    showSkillEffect() {
        let layer = this.skillNode.getChildByName("layer")
        let oldIds = this._getShowSkills(this.oldCareerId, false)
        let newIds = this._getShowSkills(this.careerCfg.career_id, false)
        for (let i = 0; i < 5; i++) {
            let node = cc.instantiate(this.skillItemPrefab)
            this.skillItems.push(node)
            node.parent = layer
        }

        for (let index = 0; index < this.skillItems.length; index++) {
            let id = oldIds[index]
            let node = this.skillItems[index]
            let ctrl = node.getComponent(ChangeJobSkillItemCtrl)
            if (id) {
                ctrl.initSkill(id)
            } else {
                node.active = false
            }
            gdk.Timer.once(index * 400, this, () => {
                let effect = node.getChildByName("effect").getComponent(sp.Skeleton)
                effect.setAnimation(0, "stand", false)
                effect.setCompleteListener(() => {
                    if (index == this.skillItems.length - 1 && newIds[index]) {
                        let skillcfg = GlobalUtil.getSkillCfg(newIds[index])
                        let isSuper = skillcfg ? skillcfg.type == 501 : false
                        ctrl.bg.active = true
                        ctrl.icon.active = true
                        ctrl.superNode.active = isSuper
                    }
                })
            })
            gdk.Timer.once((index + 1) * 400, this, () => {
                if (newIds[index]) {
                    node.active = true
                    let newId = newIds[index]
                    ctrl.initSkill(newId)

                    //最后一个处理
                    if (index == this.skillItems.length - 1) {
                        ctrl.bg.active = false
                        ctrl.icon.active = false
                        ctrl.superNode.active = false
                    }

                } else {
                    node.active = false
                }
            })
        }
    }

    _getShowSkills(careerId, isCardSkill = false) {
        let lineIds = []
        let cfgs = this._getCareerLineSkills(careerId)
        for (let index = 0; index < cfgs.length; index++) {
            const cfg = cfgs[index]
            let ul_skill = cfg.ul_skill
            if (ul_skill && ul_skill.length > 0) {
                lineIds = [...lineIds, ...ul_skill]
            }
        }
        //要显示的技能
        let ids = []
        for (let i = 0; i < lineIds.length; i++) {
            let skillCfg = GlobalUtil.getSkillCfg(lineIds[i])
            if (skillCfg.show != 1 && ids.indexOf(lineIds[i]) == -1) {
                if (isCardSkill) {
                    if (HeroUtils.isCardSkill(lineIds[i])) {
                        ids.push(lineIds[i])
                    }
                } else {
                    if (!HeroUtils.isCardSkill(lineIds[i])) {
                        ids.push(lineIds[i])
                    }
                }
            }
        }
        ids.sort((a, b) => {
            return a - b
        })
        return ids
    }


    _getCareerLineSkills(careerId: number) {
        let type = Math.floor(careerId / 100);
        let cfgs: Hero_careerCfg[] = [];
        ConfigManager.getItems(Hero_careerCfg, function (cfg: Hero_careerCfg) {
            if (Math.floor(cfg.career_id / 100) == type) {
                if (cfg.ul_skill.length > 0) {
                    cfgs.push(cfg);
                }
            }
            return false;
        })
        return cfgs;
    }

    _skillIconClick(id) {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            node.y = -200
            let comp = node.getComponent(SkillInfoPanelCtrl)
            comp.showSkillInfo(id)
        })
    }


    _updateHeroAttr() {
        let oldCareerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.oldCareerId);
        // 更新英雄属性等级
        let keys = ["grow_atk", "grow_def", "grow_hp", "atk_speed"];
        let attIconName = ["atk", "def", "hp", "speed"];
        let heroModel = ModelManager.get(HeroModel);
        let newAttr = heroModel.heroAttrs[this.heroId];
        let oldAttrVals = [this.oldAttr.atkW, this.oldAttr.defW, this.oldAttr.hpW, oldCareerCfg.atk_order];
        let newAttrVals = [newAttr.atkW, newAttr.defW, newAttr.hpW, this.careerCfg.atk_order];

        for (let i = 0; i < this.attrNodes.length; i++) {
            const attrNode = this.attrNodes[i];
            let oldIcon = attrNode.getChildByName("old").getChildByName("icon")
            let oldLab = attrNode.getChildByName("old").getChildByName("lab").getComponent(cc.Label)
            let newIcon = attrNode.getChildByName("new").getChildByName("icon")
            let newLab = attrNode.getChildByName("new").getChildByName("lab").getComponent(cc.Label)
            let state = attrNode.getChildByName("new").getChildByName("state")

            let oldGrowCfg = ConfigManager.getItemById(Hero_growCfg, oldCareerCfg[keys[i]]);
            let newGrowCfg = ConfigManager.getItemById(Hero_growCfg, this.careerCfg[keys[i]]);

            let oldshow = oldGrowCfg ? oldGrowCfg.show : "A";
            let newshow = newGrowCfg ? newGrowCfg.show : "A";
            GlobalUtil.setSpriteIcon(attrNode, oldIcon, `view/role/texture/common2/yx_${attIconName[i]}_${oldshow}`);
            GlobalUtil.setSpriteIcon(attrNode, newIcon, `view/role/texture/common2/yx_${attIconName[i]}_${newshow}`);

            oldLab.string = `${oldAttrVals[i]}`
            newLab.string = `${newAttrVals[i]}`

            if (newAttrVals[i] == oldAttrVals[i]) {
                state.active = false
            } else {
                state.active = true
                let path = newAttrVals[i] > oldAttrVals[i] ? "sub_arrow05" : "sub_arrow06"
                GlobalUtil.setSpriteIcon(attrNode, state, `common/texture/${path}`);
            }
        }
    }
}