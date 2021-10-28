import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../../../role/ctrl2/main/skill/SkillInfoPanelCtrl';
import { SkillCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-22 14:29:55 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/boss/GuildBossSkillsItemCtrl")
export default class GuildBossSkillsItemCtrl extends cc.Component {
    @property(cc.Node)
    icon: cc.Node = null;

    skillInfo: SkillCfg = null;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this._itemClick, this)
    }

    onDestroy() {
        this.node.stopAllActions();
        this.node.off(cc.Node.EventType.TOUCH_END, this._itemClick, this)
    }

    /**
     * 更新技能
     * @param skillId 
     * @param type 1-天赋 2-超绝 3-普通 
     */
    updateSkillInfo(skillId: number) {
        if (!skillId) {
            return
        }

        this.skillInfo = null
        let skillInfo: SkillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", skillId, null)
        this.skillInfo = skillInfo
        // this.skillName.string = this.skillInfo.name
        GlobalUtil.setSpriteIcon(this.node, this.icon, 'icon/skill/' + this.skillInfo.icon)
    }

    _itemClick() {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            node.setPosition(0, -280);
            let comp = node.getComponent(SkillInfoPanelCtrl)
            if (this.skillInfo) {
                comp.showSkillInfo(this.skillInfo.skill_id)
            }
        })
    }
}
