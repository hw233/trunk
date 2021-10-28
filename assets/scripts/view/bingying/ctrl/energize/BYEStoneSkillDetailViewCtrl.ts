import GlobalUtil from '../../../../common/utils/GlobalUtil';
import { Tech_stoneCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-09-01 10:39:01 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-01 11:08:52
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/energize/BYEStoneSkillDetailViewCtrl")
export default class BYEStoneSkillDetailViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    skillNode: cc.Node = null;

    cfg: Tech_stoneCfg;
    onEnable() {
        this.cfg = this.args[0];
        this.updateView(this.cfg);
    }

    updateView(cfg: Tech_stoneCfg) {
        //skillNode
        let skillIcon = cc.find('skill/icon', this.skillNode);
        let skillName = cc.find('skill/name', this.skillNode).getComponent(cc.Label);
        let skillDesc = cc.find('skillDesc/desc', this.skillNode).getComponent(cc.RichText);
        GlobalUtil.setSpriteIcon(this.node, skillIcon, `common/texture/bingying/stone/${cfg.type}`);
        let skillCfg = GlobalUtil.getSkillCfg(cfg.unique[0]);
        skillName.string = skillCfg.name + ':';
        // skillName.node.color = new cc.Color().fromHEX(BagUtils.getColorInfo(this.cfg.color).color);
        // skillDesc.maxWidth = Math.max(150, 380 - skillName.node.width);
        skillDesc.string = skillCfg.des;
    }
}
