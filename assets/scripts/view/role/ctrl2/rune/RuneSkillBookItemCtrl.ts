import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import { RuneCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-10 10:38:08 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneSkillBookItemCtrl")
export default class RuneSkillBookItemCtrl extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    quality: cc.Node = null;

    cfg: RuneCfg;
    updateView(cfg: RuneCfg) {
        this.cfg = cfg;
        GlobalUtil.setSpriteIcon(this.node, this.bg, `common/texture/role/rune/zd_jinengkuang${this.cfg.color}`);
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getSkillIcon(this.cfg.skill));
        this.nameLab.string = GlobalUtil.getSkillLvCfg(this.cfg.skill, this.cfg.skill_level).name;
        let colorInfo = BagUtils.getColorInfo(this.cfg.color);
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);
        if (this.cfg.isShow) {
            this.quality.active = true;
            GlobalUtil.setSpriteIcon(this.node, this.quality, `view/role/texture/rune/yx_jinengbiaoqian0${this.cfg.color}`);
            this.quality.getChildByName('label').getComponent(cc.Label).string = this.cfg.isShow;
        }
        else {
            this.quality.active = false;
        }
    }

    onClick() {
        let worldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        gdk.panel.setArgs(PanelId.RuneSkillDetail, this.cfg);
        gdk.panel.open(PanelId.RuneSkillDetail, (node: cc.Node) => {
            node.setPosition(node.parent.convertToNodeSpaceAR(worldPos));
            if (node.x + node.getChildByName('zb_dikuan').width >= cc.view.getVisibleSize().width / 2) {
                node.x = cc.view.getVisibleSize().width / 2 - node.getChildByName('zb_dikuan').width;
            }
        })
    }
}
