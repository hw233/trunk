import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import RoleSkillTipsCtrl from '../../../role/ctrl2/common/RoleSkillTipsCtrl';
import SkillInfoPanelCtrl from '../../../role/ctrl2/main/skill/SkillInfoPanelCtrl';
import { SkillCfg } from '../../../../a/config';

/** 
 * 技能图标项
 * @Author: sthoo.huang  
 * @Date: 2019-11-14 10:28:04 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-07 17:55:32
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionSkillItemCtrl")
export default class ExpeditionSkillItemCtrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null;

    skillCfg: SkillCfg

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this._itemClick, this);
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this._itemClick, this);
    }

    updateInfo(skillId) {
        this.skillCfg = GlobalUtil.getSkillCfg(skillId)
        // 更新技能图标
        GlobalUtil.setSpriteIcon(this.node, this.icon, 'icon/skill/' + this.skillCfg.icon);
    }

    _itemClick() {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            let comp = node.getComponent(SkillInfoPanelCtrl);
            comp.showSkillInfo(this.skillCfg.skill_id);
        });
    }
}