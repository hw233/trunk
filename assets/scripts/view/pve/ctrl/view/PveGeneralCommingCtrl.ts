import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveEventId from '../../enum/PveEventId';
import PveGeneralModel from '../../model/PveGeneralModel';
import PveSceneCtrl from '../PveSceneCtrl';
import PveSkillDockCtrl from '../skill/PveSkillDockCtrl';
import StringUtils from '../../../../common/utils/StringUtils';
import { SkillCfg, TipsCfg } from '../../../../a/config';

/** 
 * Pve中指挥官技能解锁界面
 * @Author: yaozu.hu
 * @Date: 2020-11-03 21:03:13
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-11-10 18:05:53
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveGeneralCommingCtrl")
export default class PveGeneralCommingCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    bgSpine: sp.Skeleton = null;
    @property(sp.Skeleton)
    fgSpine: sp.Skeleton = null;

    @property(cc.Label)
    nameLb: cc.Label = null;

    @property(cc.RichText)
    desLb: cc.RichText = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Sprite)
    skillIcon: cc.Sprite = null;
    @property(cc.RichText)
    skillName: cc.RichText = null;

    timeScale: number;
    skillId: number;


    onEnable() {
        let args = gdk.panel.getArgs(PanelId.PveGeneralComming)
        this.skillId = args[0];
        this.timeScale = args[1];
        let skillcfg = ConfigManager.getItemByField(SkillCfg, 'skill_id', this.skillId);
        let path = 'icon/skill/' + skillcfg.icon;
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, path);
        let tipsData = { '99030': 57, '99050': 58, '99060': 59 }
        let tips = ConfigManager.getItemByField(TipsCfg, 'id', tipsData[this.skillId + '']);
        this.skillName.string = tips.desc21;
        this.desLb.string = tips.title22;
        this.nameLb.string = skillcfg.name;

        this.bgSpine.node.active = true;
        this.fgSpine.node.active = true;

        this.desLb.node.opacity = 0;
        let action1: cc.Action = this.getShowActon()
        let action2: cc.Action = this.getShowActon()
        let action3: cc.Action = this.getShowActon()
        this.desLb.node.runAction(action2);
        this.spine.node.scale = 0.7;
        let model = ModelManager.get(PveGeneralModel);
        let skin = model.skin;
        let url: string = StringUtils.format("spine/hero/{0}/1/{0}", skin);
        GlobalUtil.setSpineData(
            this.node,
            this.spine,
            url,
            false,
            'stand_s',
            false,
            false,
            (spine: sp.Skeleton) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                spine.paused = true;
            }
        );

        this.bgSpine.setAnimation(0, 'stand4', false);
        this.fgSpine.setAnimation(0, 'stand3', false);
        this.bgSpine.setCompleteListener(() => {
            if (!cc.isValid(this.node)) return;
            if (!this.enabled) return;
            this.bgSpine.setCompleteListener(null);
            this.moveSkillIcon();
        });

        gdk.Timer.once(220, this, () => {
            let p = gdk.gui.getCurrentView();
            let c = p.getComponent(PveSceneCtrl);
            if (c) {
                c.quake(5, 20)
            }
        })

    }

    onDisable() {

        this.desLb.node.stopAllActions();
        this.timeScale = 0;
        this.desLb.string = '';
        this.nameLb.string = '';
        GlobalUtil.setSpineData(this.node, this.spine, null);
        gdk.Timer.clearAll(this)

    }

    moveSkillIcon() {
        this.bgSpine.node.active = false;
        this.fgSpine.node.active = false;
        let p = gdk.gui.getCurrentView();
        let c = p.getComponent(PveSceneCtrl);
        if (!c) {
            this.close();
            return;
        }
        let sm = c.model;
        let skillDock = cc.find('UI/PveSkillDock', c.node)
        if (skillDock) {
            let ctrl = skillDock.getComponent(PveSkillDockCtrl);
            let pos1 = this.skillNode.convertToWorldSpaceAR(cc.v2(0, 0));

            let temNode: cc.Node = cc.instantiate(this.skillNode);
            let tem = temNode.getChildByName('skillName');
            let parent = new cc.Node();
            let pos3 = ctrl.list.node.convertToWorldSpaceAR(cc.v2(0, 0));
            let pos4 = this.node.convertToNodeSpaceAR(pos3)
            parent.setParent(this.node)
            parent.setPosition(pos4);
            let pos2 = parent.convertToNodeSpaceAR(pos1);
            tem.active = false;
            temNode.angle = 0;
            temNode.scale = 1;
            temNode.setParent(parent);
            temNode.setPosition(pos2);
            let endPos = this.skillId == 99050 ? cc.v2(72, 0) : cc.v2(135, 0);
            let tween = new cc.Tween()
            temNode.active = true;

            tween.target(temNode)
                .to(1 / this.timeScale, { position: endPos })
                .call(() => {
                    temNode.destroy();
                    parent.destroy();
                    this.close()
                    gdk.e.emit(PveEventId.PVE_GENERAL_UNLOCK_SKILL);
                })
                .start();

        } else {
            this.close()
        }
    }

    getShowActon(): cc.Action {
        let action = new cc.Action()
        action = cc.speed(
            cc.sequence(
                cc.delayTime(0.5),
                cc.fadeIn(0.3),
                cc.delayTime(1.2),
                cc.fadeOut(0.3)
            ),
            1
        )
        return action;
    }
}
