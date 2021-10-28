import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import RoleSkillTipsCtrl from '../../role/ctrl2/common/RoleSkillTipsCtrl';
import { SkillCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroSkillItemCtrl")
export default class HeroSkillItemCtrl extends cc.Component {

    @property(cc.Label)
    unlockTips: cc.Label = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    unclockImg: cc.Node = null

    @property(cc.Label)
    skillName: cc.Label = null;

    skillInfo: SkillCfg = null;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this._itemClick, this)
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this._itemClick, this)
    }

    updateSkillInfo(skillId) {
        if (!skillId) {
            return
        }
        this.skillInfo = null
        let skillInfo: SkillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", skillId, null)
        this.skillInfo = skillInfo
        // this.skillName.string = this.skillInfo.name
        GlobalUtil.setSpriteIcon(this.node, this.icon, 'icon/skill/' + this.skillInfo.icon)
    }

    updateSize(w: number = 0, h: number = 0) {
        if (w > 0) {
            this.node.width = w
            this.icon.width = w - 2
        }
        if (h > 0) {
            this.node.height = h
            this.icon.height = h - 2
        }
    }

    _itemClick() {
        gdk.panel.open("RoleSkillTips", (node: cc.Node) => {
            let comp = node.getComponent(RoleSkillTipsCtrl)
            if (this.skillInfo) {
                comp.showSkillInfo(this.skillInfo.skill_id)
            }
        })
    }

}
