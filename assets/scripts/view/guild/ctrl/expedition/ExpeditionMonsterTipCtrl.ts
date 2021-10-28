import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionModel from './ExpeditionModel';
import ExpeditionSkillItemCtrl from './ExpeditionSkillItemCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import { Expedition_stageCfg, MonsterCfg } from '../../../../a/config';

/**
 * 怪物tip
 * @Author: luoyong
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-21 15:54:37
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/expedition/ExpeditionMonsterTipCtrl")
export default class ExpeditionMonsterTipCtrl extends gdk.BasePanel {

    @property(cc.Label)
    enemyName: cc.Label = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    boss: cc.Node = null;
    @property(cc.Node)
    jingyin: cc.Node = null;

    @property(cc.RichText)
    desc: cc.RichText = null;

    @property(cc.Label)
    hp: cc.Label = null;

    @property(cc.Label)
    atk: cc.Label = null;

    @property(cc.Label)
    def: cc.Label = null;

    @property(cc.Label)
    hit: cc.Label = null;

    @property(cc.Label)
    speed: cc.Label = null;

    @property(cc.Label)
    dodge: cc.Label = null;

    @property(cc.Label)
    fire_res: cc.Label = null;

    @property(cc.Label)
    elec_res: cc.Label = null;

    @property(cc.Label)
    redi_res: cc.Label = null;

    @property(cc.Label)
    cold_res: cc.Label = null;

    @property(cc.Label)
    punc_res: cc.Label = null;

    @property(cc.Node)
    titleNode: cc.Node = null;

    @property(cc.Node)
    blood: cc.Node = null;

    @property(cc.Node)
    skillContent: cc.Node = null;

    @property(cc.Node)
    skillItem: cc.Node = null;

    bloodW: number = 228;
    _monsterCfg: MonsterCfg
    colorList = [cc.color("#85ED83"), cc.color("#FF1D1D")]

    get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    onEnable() {
        let data = gdk.panel.getArgs(PanelId.ExpeditionMonsterTip)
        this._monsterCfg = data[0]
        this.initEnemyInfo();
    }

    onDisable() {

    }

    initEnemyInfo() {

        this.enemyName.string = this._monsterCfg.name;
        this.setEnemyType(this._monsterCfg.color)
        this.desc.string = `${this._monsterCfg.desc}`
        //设置怪物属性
        this.refreshEnemyInfo();
        // this.initSkill()

        //设置怪物模型
        let url: string = StringUtils.format("spine/monster/{0}/{0}", this._monsterCfg.skin);
        GlobalUtil.setSpineData(this.spine.node, this.spine, url, true, 'stand_s', true);
        this.spine.node.scale = this._monsterCfg.size + 0.4;//1;
        this.spine.node.opacity = 255;

        //设置怪物特性
        if (cc.js.isString(this._monsterCfg.type)) {
            this.titleNode.active = false;
        } else {
            let i = 1;
            this.titleNode.active = true;
            this.titleNode.children.forEach(children => {
                if (cc.js.isNumber(this._monsterCfg.type)) {
                    if (Number(this._monsterCfg.type) == i) {
                        children.active = true;
                    } else {
                        children.active = false;
                    }
                } else {
                    if (this._monsterCfg.type.indexOf(i) >= 0) {
                        children.active = true;
                    } else {
                        children.active = false;
                    }
                    i++;
                }
            })
        }
    }

    setEnemyType(type: any) {
        //color 1小怪 11精英 12Boss 13特定小怪
        if (cc.js.isNumber(this._monsterCfg.color)) {
            if (this._monsterCfg.color == 12) {
                this.boss.active = true;
                this.jingyin.active = false;
            } else if (this._monsterCfg.color == 11) {
                this.boss.active = false;
                this.jingyin.active = true;
            } else {
                this.boss.active = false;
                this.jingyin.active = false;
            }
        } else {
            this.boss.active = false;
            this.jingyin.active = false;
        }
    }

    //技能显示
    initSkill() {
        for (let i = 0; i < this._monsterCfg.skills.length; i++) {
            let skill: cc.Node = this.skillContent[i]
            if (!skill) {
                skill = cc.instantiate(this.skillItem)
                skill.active = true
                skill.parent = this.skillContent
                let ctrl = skill.getComponent(ExpeditionSkillItemCtrl)
                ctrl.updateInfo(this._monsterCfg.skills[i])
            }
        }
    }

    refreshEnemyInfo() {
        let pointInfo = this.expeditionModel.curPointInfo
        let expStage = ConfigManager.getItemById(Expedition_stageCfg, pointInfo.cfg.stage_id1)

        this.hp.string = Math.floor(this._monsterCfg.hp * expStage.power / 6) + '/' + Math.floor(this._monsterCfg.hp * expStage.power / 6);
        this.blood.width = this.bloodW;

        let base_atk = Math.floor(this._monsterCfg.atk * expStage.power / 6)
        this.atk.string = base_atk + ''

        let base_def = Math.floor(this._monsterCfg.def * expStage.power / 6)
        this.def.string = base_def + ''

        let base_hit = this._monsterCfg.hit ? Math.floor(this._monsterCfg.hit * expStage.power / 6) : 0;
        this.hit.string = base_hit > 0 ? base_hit + '' : '0';

        let base_speed = Math.floor(this._monsterCfg.speed)
        this.speed.string = base_speed + ''

        this.fire_res.string = '0';
        this.elec_res.string = '0';
        this.redi_res.string = '0';
        this.cold_res.string = '0';
        this.punc_res.string = '0';

        let base_dodge = this._monsterCfg.dodge ? Math.floor(this._monsterCfg.dodge * expStage.power / 6) : 0;
        if (base_dodge > 0) {
            this.dodge.node.parent.active = true
            this.dodge.string = `${base_dodge}`
        }
    }
}
