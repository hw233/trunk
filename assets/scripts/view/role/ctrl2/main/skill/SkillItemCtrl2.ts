import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from './SkillInfoPanelCtrl';
import { Hero_careerCfg } from '../../../../../a/config';
import { HeroCfg } from '../../../../../../boot/configs/bconfig';


/**
 * @Description: 角色界面上方面板控制
 * @Author: chengyou.lin
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-24 17:34:40
 */

export class SkillData {
    type: number;//0：塔防，1：对战
    line: number;//0：路线1，1：路线2
    skillId: number;
    skillLv: number;
    careerCfg: Hero_careerCfg;
    skillCfg: any;
    unLock: boolean;
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/skill/RoleSkillItemCtrl2")
export default class RoleSkillItemCtrl2 extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Node)
    lockBg: cc.Node = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Node)
    lockNode: cc.Node = null;
    @property(sp.Skeleton)
    locker: sp.Skeleton = null;

    @property(cc.Label)
    limitLab: cc.Label = null;

    @property(cc.Node)
    lvNode: cc.Node = null;

    @property(cc.Node)
    mysticFrame: cc.Node = null;

    activeSkillIds: number[];

    data: SkillData;
    get model() { return ModelManager.get(HeroModel); }
    get heroInfo() { return this.model.curHeroInfo; }

    updateView(data: SkillData) {
        this.data = data;
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getSkillIcon(data.skillId))
        let unLock = data.unLock;
        let mysticSkillSpine = cc.find('spine', this.node);
        mysticSkillSpine.active = false;
        this.bg.active = unLock;
        this.lvNode.active = false;
        this.mysticFrame && (this.mysticFrame.active = false);
        let careerCfg = data.careerCfg;
        let preCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerCfg.career_id, { career_lv: careerCfg.career_lv - 1 })
        if (preCfg) {
            this.limitLab.string = `${preCfg.hero_lv + 1}${gdk.i18n.t("i18n:HERO_TIP8")}`;
        } else {
            this.limitLab.string = `${careerCfg.hero_lv + 1}${gdk.i18n.t("i18n:HERO_TIP8")}`;
        }
        if (ConfigManager.getItemById(HeroCfg, careerCfg.hero_id).group[0] == 6 && this.mysticFrame) {
            this.mysticFrame.active = true;
        }
        if (!unLock) {
            this.lockNode.active = true;
            this.lockBg.active = true;

            let spine = this.locker;
            spine.node.active = true;
            spine.loop = true;
            spine.setCompleteListener(null);
            spine.animation = "stand";
        } else {
            this.node.stopAllActions();
            let heroId = this.heroInfo.heroId;
            let activeSkillIds = this.model.activeHeroSkillIds[heroId] as number[];
            if (activeSkillIds) {
                let idx = activeSkillIds.indexOf(data.skillId);
                if (idx >= 0) {
                    HeroUtils.deleteHeroActiveSkill(heroId, data.skillId);
                    let aSkillIds = this.activeSkillIds || [];
                    if (aSkillIds.indexOf(data.skillId) < 0) {
                        aSkillIds.push(data.skillId);
                        this.activeSkillIds = aSkillIds;
                    }
                    this.node.stopAllActions();
                    this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(() => {
                        this.showOpenEffect();
                    })));
                    return;
                }
            }
            this.lockNode.active = false;
            this.lockBg.active = false;
            this.locker.node.active = false;
            if (this.data.skillLv) {
                this.lvNode.active = true;
                this.lvNode.getChildByName('lv').getComponent(cc.Label).string = `${this.data.skillLv}`;
                mysticSkillSpine.active = this.data.skillLv >= 5;
            }
        }
    }

    showOpenEffect() {
        this.lockNode.active = true;
        this.lockBg.active = true;
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.delayTime(0.8), cc.callFunc(() => {
            this.lockNode.active = false;
            this.lockBg.active = false;

            let aSkillIds = this.activeSkillIds || [];
            let idx = aSkillIds.indexOf(this.data.skillId)
            if (idx >= 0) {
                aSkillIds.splice(idx, 1);
            }
        })));

        let spine = this.locker;
        spine.node.active = true;
        spine.loop = false;
        spine.setCompleteListener(() => {
            spine.node.active = false;
        })
        spine.animation = "stand2";
    }

    onButtonEvent() {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            let comp = node.getComponent(SkillInfoPanelCtrl);
            if (this.data.skillLv) {
                comp.showSkillInfo(this.data.skillId, this.data.skillLv);
            }
            else {
                comp.showSkillInfo(this.data.skillId);
            }
        });
    }

}
