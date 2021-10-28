import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import PveEnemyModel from '../../model/PveEnemyModel';
import PveHpBarCtrl from '../../core/PveHpBarCtrl';
import SkillInfoPanelCtrl from '../../../role/ctrl2/main/skill/SkillInfoPanelCtrl';
import { PveSkillType } from '../../const/PveSkill';

/**
 * BOSS固定血条界面
 * @Author: sthoo.huang
 * @Date: 2020-07-04 11:43:36
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-09-07 20:49:53
 */
const { ccclass, property, menu } = cc._decorator;
function hasId(v: any): boolean {
    return v.id == this.id;
}
@ccclass
@menu("qszc/scene/pve/view/PveBossHpBarPopupCtrl")
export default class PveBossHpBarPopupCtrl extends gdk.BasePanel {

    @property({ type: PveHpBarCtrl })
    hpBar: PveHpBarCtrl = null;
    @property(cc.Label)
    hpLb: cc.Label = null;

    @property(cc.Label)
    enemyName: cc.Label = null;
    @property(cc.Sprite)
    headIcon: cc.Sprite = null;

    @property(cc.Node)
    skillLayout: cc.Node = null;
    @property(cc.Prefab)
    skillItem: cc.Prefab = null;

    enemyModel: PveEnemyModel;

    onEnable() {
        let model = this.args[0] as PveEnemyModel;
        this.initEnemyInfo(model);
    }

    onDisable() {
        this.enemyModel = null;
    }

    initEnemyInfo(model: PveEnemyModel) {
        if (!model || !model.config || !model.ctrl.isAlive) {
            this.close();
            return;
        }
        this.enemyModel = model;
        this.hpBar.progress = model.hp / model.hpMax;
        this.hpLb.string = model.hp + '/' + model.hpMax;

        // 更新名字
        this.enemyName.string = model.config.name + ` (${(model.hp / model.hpMax * 100).toFixed(1)}%)`;

        // 更新头像
        let url = 'icon/monster/' + model.config.icon + '_s';
        GlobalUtil.setSpriteIcon(this.node, this.headIcon, url);

        // 更新技能
        let skills = model.skills;
        let skillList1 = [];
        skills.forEach(skill => {
            let cfg = skill.config;
            if (cfg && cfg.icon && cfg.show < 1) {
                skillList1.push(cfg);
            }
        });
        this.skillLayout.destroyAllChildren();
        if (skillList1.length == 0) return;
        skillList1.sort((s1, s2) => {
            return s1.skill_id - s2.skill_id
        });
        skillList1.forEach(cfg => {
            let node = cc.instantiate(this.skillItem);
            let icon = node.getChildByName('skillIcon').getComponent(cc.Sprite);
            let chaojue = node.getChildByName('chaojue');
            let tianfu = node.getChildByName('tianfu');
            chaojue.active = cfg.dmg_type == 11 || PveSkillType.isSuper(cfg.type)
            tianfu.active = cfg.dmg_type == 9
            node.on(cc.Node.EventType.TOUCH_END, () => {
                this.showSkill(cfg.skill_id, cfg.level)
            }, this)
            node.parent = this.skillLayout;
            let path = GlobalUtil.getSkillIcon(cfg.skill_id)
            GlobalUtil.setSpriteIcon(this.node, icon, path)
        });
    }

    // 打开技能详情页面
    showSkill(skillId: number, lv?: number) {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            let comp = node.getComponent(SkillInfoPanelCtrl);
            if (comp) {
                comp.showSkillInfo(skillId, lv);
            }
        });
    }

    // 更新怪物血量
    @gdk.binding('enemyModel.hp')
    refreshBlood(v: number) {
        let model = this.enemyModel;
        if (!model || !model.ctrl || !model.ctrl.isAlive) {
            this.close();
            return;
        }
        gdk.Timer.callLater(this, this._refreshBloodLater, [v, model.hpMax]);
    }

    _refreshBloodLater(v: number, hpMax: number) {
        let np: number = v / hpMax;
        let op: number = this.hpBar.progress;
        if (np > 0 && np <= 1 && op != np) {
            this.hpBar.progress = np;
            this.hpLb.string = v + '/' + hpMax;
        }
        this.enemyName.string = this.enemyModel.config.name + ` (${(v / hpMax * 100).toFixed(1)}%)`
    }
}
