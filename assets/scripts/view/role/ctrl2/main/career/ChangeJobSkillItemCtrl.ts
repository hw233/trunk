import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import PanelId from '../../../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../skill/SkillInfoPanelCtrl';

/*
   //职业进阶
 * @Author: luoyong 
 * @Date: 2020-02-27 10:33:07 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-25 14:43:27
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/career/ChangeJobSkillItemCtrl")
export default class ChangeJobSkillItemCtrl extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Node)
    superNode: cc.Node = null

    @property(sp.Skeleton)
    effect: sp.Skeleton = null

    _skillId: number = 0

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this._skillIconClick, this)
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this._skillIconClick, this)
    }

    initSkill(id) {
        this._skillId = id
        let path = GlobalUtil.getSkillIcon(id)
        let skillcfg = GlobalUtil.getSkillCfg(id)
        let isSuper = skillcfg ? skillcfg.type == 501 : false
        let bgPath = isSuper ? "common/texture/task/jn_yuan01" : "common/texture/career/sub_skillbg";
        GlobalUtil.setSpriteIcon(this.node, this.bg, bgPath);
        this.superNode.active = isSuper
        GlobalUtil.setSpriteIcon(this.node, this.icon, path)
    }

    _skillIconClick() {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            node.y = -200
            let comp = node.getComponent(SkillInfoPanelCtrl)
            comp.showSkillInfo(this._skillId)
        })
    }
}
