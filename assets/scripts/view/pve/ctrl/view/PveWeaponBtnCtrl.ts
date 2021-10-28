import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import PveEventId from '../../enum/PveEventId';
import PveGeneralCtrl from '../fight/PveGeneralCtrl';
import PvePool from '../../utils/PvePool';
import PveSceneCtrl from '../PveSceneCtrl';
import PveSceneModel from '../../model/PveSceneModel';
import PveSceneState from '../../enum/PveSceneState';
import PveSkillModel from '../../model/PveSkillModel';
import PveTool from '../../utils/PveTool';
import SkillInfoPanelCtrl from '../../../role/ctrl2/main/skill/SkillInfoPanelCtrl';
import StringUtils from '../../../../common/utils/StringUtils';
import { General_weaponCfg, SkillCfg } from '../../../../a/config';

/**
 * Pve技能栏控制组件类
 * @Author: yaozu.hu
 * @Date: 2020-10-13 10:28:57
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-27 16:57:40
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/PveWeaponBtnCtrl")
export default class PveWeaponBtnCtrl extends cc.Component {

    @property(PveSceneCtrl)
    sceneCtrl: PveSceneCtrl = null;

    // @property(cc.Node)
    // weapon: cc.Node = null;

    @property(cc.Label)
    cdTime: cc.Label = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;
    @property(cc.Sprite)
    proSp: cc.Sprite = null;

    @property(cc.Sprite)
    skillName: cc.Sprite = null;

    sceneModel: PveSceneModel;
    isPause: boolean = false;

    useSkillCd: number = 40;

    curTime: number = 0;
    general: PveGeneralCtrl;
    useSkill: boolean = false;
    canUseSkill: boolean = false;
    // genModel: GeneralModel = ModelManager.get(GeneralModel);
    reduceCd: boolean = false;

    tesu_Id: number = 1003;
    tween: cc.Tween;

    get curUseWeapon() {
        if (!this.general) {
            return -1;
        }
        return this.general.model.info.weaponId;
    }

    onEnable() {
        gdk.e.on(PveEventId.PVE_REDUCE_GENERALWEAPON_SKILLCD, this.reduceSKillCd, this)
        this.sceneModel = this.sceneCtrl.model;
        //
        this.sceneModel.generals.forEach(gene => {
            if (gene.node.name == 'general_1') {
                this.general = gene;
            }
        })
        //let genModel = ModelManager.get(GeneralModel)
        let cfg = ConfigManager.getItemByField(General_weaponCfg, 'artifactid', this.curUseWeapon);
        if (!cfg) {
            cc.log('-----------------------当前使用的神器id有问题：' + this.curUseWeapon)
        } else if (cc.js.isString(cfg.skill) || cfg.skill == 0) {
            this.node.active = false;
            return;
        }
        let skillCfg = ConfigManager.getItemByField(SkillCfg, 'skill_id', cfg.skill)
        this.useSkillCd = skillCfg.cd
        this.cdTime.node.active = !this.useSkill
        this.cdTime.string = Math.max(0, Math.ceil(this.useSkillCd - this.curTime)) + '';
        let path = StringUtils.format("spine/weapon/{0}/0.5/{0}", cfg.skillEffect);
        GlobalUtil.setSpineData(this.node, this.spine, path, true, 'stand', true)
        if (this.sceneCtrl.model.realTime < 0.1) {
            this.resetInitData();
        }
        this.skillName.node.active = false;
        let skillNamePath = 'view/pve/texture/ui/sq_' + cfg.skill;
        GlobalUtil.setSpriteIcon(this.node, this.skillName, skillNamePath);

    }
    update(dt: number) {
        if (!this.sceneModel) return;
        if (!this.general) return;
        if (!this.isPause && !this.useSkill && this.curTime < this.useSkillCd) {
            this.curTime += dt * this.sceneModel.timeScale;
            this.curTime = Math.min(this.curTime, this.useSkillCd)
            this.cdTime.string = Math.max(0, Math.ceil(this.useSkillCd - this.curTime)) + ''
            this.proSp.fillRange = - (0.5) * (this.curTime / this.useSkillCd)
            if (this.curTime >= this.useSkillCd) {
                let skill = this.general.model.skills[0]
                let target = PveTool.searchTarget({
                    fight: this.general,
                    targetType: skill.prop.target_type,
                    pos: this.general.node.getPos(),
                    range: skill.prop.range,
                });
                if (!target) {
                    this.canUseSkill = false;
                } else {
                    this.canUseSkill = true;
                }
            }
        }
        if (!this.useSkill && this.canUseSkill && this.curTime >= this.useSkillCd) {
            this.canUseSkill = false;
            this.useSkill = true;
            this.cdTime.node.active = !this.useSkill;
            if (this.curUseWeapon == this.tesu_Id) {
                let t = this.spine.setAnimation(0, 'atk', false);
                if (t) {
                    this.spine.setCompleteListener((trackEntry, loopCount) => {
                        let name = trackEntry.animation ? trackEntry.animation.name : '';
                        if (name === "atk") {
                            this.skillEnd();
                            //this.spine.node.active = false;
                        }
                    })
                    this.spine.setEventListener((entry: any, event: any) => {
                        let eventName: string = event.data.name;
                        if (eventName == 'atk') {
                            // 攻击事件
                            //修改指挥官位置
                            let root = this.spine.findBone('root');
                            let objective = this.spine.findBone('S_shenqi03_jiedian');
                            let temPos = this.spine.node.convertToWorldSpaceAR(cc.v2(objective.x * root.scaleX, objective.y * root.scaleY))
                            this.general.model.orignalPos = this.general.node.parent.convertToNodeSpaceAR(temPos);
                            this.general.node.setPosition(this.general.model.orignalPos);
                            //this.general.node.position = this.general.node.parent.convertToNodeSpaceAR(temPos);
                            this.weaponUseSkill()//this.onDamage(spine, index);
                        }
                    })
                }
                //this.weaponUseSkill()
            } else {
                let t = this.spine.setAnimation(0, 'atk', false);
                if (t) {
                    this.spine.setCompleteListener((trackEntry, loopCount) => {
                        let name = trackEntry.animation ? trackEntry.animation.name : '';
                        if (name === "atk") {

                            //this.spine.node.active = false;
                            //this.weaponUseSkill()
                        }
                    })
                    this.spine.setEventListener((entry: any, event: any) => {
                        let eventName: string = event.data.name;
                        if (eventName == 'atk') {
                            // 攻击事件
                            this.weaponUseSkill()//this.onDamage(spine, index);
                        }
                    })
                }
            }
            //显示技能名称
            this.skillName.node.active = true;
            this.skillName.node.setPosition(-220, -70);
            this.tween = cc.tween(this.skillName.node)
                .to(0.25, { position: cc.v2(-37, -70) })
                .delay(1.5)
                .to(0.5, { position: cc.v2(-220, -70) })
                .call(() => {
                    this.skillName.node.active = false;
                })
                .start();
        } else if (!this.useSkill && !this.canUseSkill && this.curTime >= this.useSkillCd) {
            let skill = this.general.model.skills[0]
            let target = PveTool.searchTarget({
                fight: this.general,
                targetType: skill.prop.target_type,
                pos: this.general.node.getPos(),
                range: skill.prop.range,
            });
            if (!target) {
                this.canUseSkill = false;
            } else {
                this.canUseSkill = true;
            }
        }
    }
    onDisable() {
        //this.general = null;
        //this.sceneModel = null;
        gdk.e.targetOff(this);
    }

    onDestroy() {
        this.general = null;
        this.sceneModel = null;
        this.tween = null;
        this.spine.setEventListener(null);
        this.spine.setCompleteListener(null);
    }

    @gdk.binding('sceneModel.state')
    _setState(v: PveSceneState) {
        switch (v) {
            case PveSceneState.Loading:
            case PveSceneState.Reset:
                this.resetInitData()
                this.spine.setAnimation(0, 'stand', true);
            case PveSceneState.Pause:
                this.isPause = true;
            case PveSceneState.Fight:
                this.isPause = false;
                break;
        }
    }

    onWeaponClick() {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            let comp = node.getComponent(SkillInfoPanelCtrl)
            let weaponCfg = ConfigManager.getItemById(General_weaponCfg, this.curUseWeapon);
            comp.showSkillInfo(weaponCfg.skill);
        })
    }

    weaponUseSkill() {
        let skill = this.general.model.skills[0]

        //使用技能
        let target = PveTool.searchTarget({
            fight: this.general,
            targetType: skill.prop.target_type,
            pos: this.general.node.getPos(),
            range: skill.prop.range,
        });
        let res = this.curUseWeapon == this.tesu_Id
        if (!target && !res) {
            //cc.log('-------------神器技能没有找到目标');
            this.skillEnd();
            return;
        }
        this.curTime = 0;
        let model: PveSkillModel = PvePool.get(PveSkillModel);
        model.option.onComplete = !res ? this.skillEnd : null;;
        model.option.thisArg = !res ? this : null;
        model.config = skill.prop;
        model.attacker = this.general;
        model.addTarget(target);
        PveTool.useSkill(model, this.sceneModel);
        this.general.model.useSkill(this.general.model.skills[0])
    }

    skillEnd() {
        this.useSkill = false;
        //this.weapon.scale = 1;
        if (!this.reduceCd) {
            this.curTime = 0;
        } else {
            this.reduceCd = false;
        }
        this.cdTime.node.active = !this.useSkill;
        this.spine.node.active = true;
        this.spine.setAnimation(0, 'stand', true);
        this.spine.setEventListener(null);
        this.spine.setCompleteListener(null);
    }

    reduceSKillCd(event) {
        if (this.useSkill && !this.reduceCd) {
            this.reduceCd = true;
        }
        this.curTime = this.curTime < event.data ? event.data : this.curTime;
    }

    resetInitData() {
        this.curTime = 0;
        this.useSkill = false;
        this.canUseSkill = false;
        this.isPause = false;
        //this.weapon.scale = 1;
        this.spine.node.active = true;
        this.cdTime.node.active = !this.useSkill;
        this.cdTime.string = ''
    }

}
