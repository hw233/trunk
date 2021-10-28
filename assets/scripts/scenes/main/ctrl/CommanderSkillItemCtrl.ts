import CommanderSkillTipCtrl from '../../../view/role/ctrl2/main/skill/CommanderSkillTipCtrl';
import GeneralModel from '../../../common/models/GeneralModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import SkillInfoPanelCtrl from '../../../view/role/ctrl2/main/skill/SkillInfoPanelCtrl';

/**
 * @Description: 指挥官技能
 * @Author: luoyong
 * @Date: 2019-03-28 17:21:18
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:03:55
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/CommanderSkillItemCtrl")
export default class CommanderSkillItemCtrl extends cc.Component {

    @property(cc.Node)
    skillIcon: cc.Node = null;

    @property(cc.Node)
    lvNodes: cc.Node[] = [];

    _skillId: number = 0

    //图标资源
    _skillRes = {
        99030: [{ bg: 1, icon: 1 }, { bg: 2, icon: 3 }, { bg: 2, icon: 5 }, { bg: 3, icon: 7 }, { bg: 3, icon: 9 }],
        99050: [{ bg: 1, icon: 2 }, { bg: 2, icon: 4 }, { bg: 2, icon: 6 }, { bg: 3, icon: 8 }, { bg: 3, icon: 1 }],
        99060: [{ bg: 1, icon: 2 }, { bg: 2, icon: 3 }, { bg: 2, icon: 4 }, { bg: 3, icon: 5 }, { bg: 3, icon: 6 }],
    }

    _pos = {
        99030: -100,
        99050: -220,
        99060: -340
    }


    get model(): RoleModel {
        return ModelManager.get(RoleModel);
    }

    onEnable() {
        this.skillIcon.on(cc.Node.EventType.TOUCH_END, this._skillIconClick, this)
    }

    updateInfo(skillId) {
        this._skillId = skillId
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(skillId))

        let skillLv = 0
        let generalModel = ModelManager.get(GeneralModel)
        let skills = generalModel.generalInfo.skills
        for (let i = 0; i < skills.length; i++) {
            if (skills[i].skillId == skillId) {
                skillLv = skills[i].skillLv
                break
            }
        }

        let resList = this._skillRes[this._skillId]
        for (let j = 0; j < this.lvNodes.length; j++) {
            let ele = this.lvNodes[j]
            let off = ele.getChildByName("off")
            let proBar = off.getComponent(cc.ProgressBar)
            let lvLab = ele.getChildByName("lvLab").getComponent(cc.Label)
            let content = ele.getChildByName("content")
            let bg = content.getChildByName("bg")
            let icon = content.getChildByName("icon")
            let spine = content.getChildByName("spine").getComponent(sp.Skeleton)
            GlobalUtil.setSpriteIcon(this.node, bg, `view/main/texture/mainSet/wjxx_fuwen0${resList[j].bg}`)
            GlobalUtil.setSpriteIcon(this.node, icon, `view/main/texture/mainSet/wjxx_tuan0${resList[j].icon}`)
            GlobalUtil.setAllNodeGray(content, 1)
            lvLab.string = `L${j + 2}`

            if (this.model.activeSkill && this.model.activeSkill.skillId == this._skillId) {
                if (j + 2 == this.model.activeSkill.skillLv) {
                    let ani = ele.getComponent(cc.Animation)
                    ani.play("skillProBarAni")
                    ani.on('finished', () => {
                        spine.setAnimation(0, "stand2", false)
                        spine.setCompleteListener(() => {
                            GlobalUtil.setAllNodeGray(content, 0)
                            this.model.activeSkill = null
                            if (this._skillId != 90030 && j + 2 != 2) {
                                gdk.panel.open(PanelId.CommanderSkillTip, (node: cc.Node) => {
                                    node.y = this._pos[this._skillId]
                                    let comp = node.getComponent(CommanderSkillTipCtrl);
                                    comp.showSkillInfo(this._skillId, j + 2);
                                });
                            }
                        })
                    })
                } else if (j + 2 < this.model.activeSkill.skillLv) {
                    proBar.progress = 1
                    GlobalUtil.setAllNodeGray(content, 0)
                }
            } else {
                if (j + 2 <= skillLv) {
                    proBar.progress = 1
                    GlobalUtil.setAllNodeGray(content, 0)
                }
            }

            content.on(cc.Node.EventType.TOUCH_END, () => {
                gdk.panel.open(PanelId.CommanderSkillTip, (node: cc.Node) => {
                    node.y = this._pos[this._skillId]
                    let comp = node.getComponent(CommanderSkillTipCtrl);
                    comp.showSkillInfo(this._skillId, j + 2, j + 2 > skillLv);
                });
            }, this)
        }
    }

    onDestroy() {
        gdk.e.targetOff(this)
    }

    _skillIconClick() {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            node.y = this._pos[this._skillId]
            let comp = node.getComponent(SkillInfoPanelCtrl);
            comp.showSkillInfo(this._skillId);
        });
    }


}
