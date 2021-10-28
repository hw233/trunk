import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import { Expedition_buffCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-16 16:19:02 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/army/ExpeditionArmySkillInfoCtrl")
export default class ExpeditionArmySkillInfoCtrl extends gdk.BasePanel {
  @property(cc.Node)
  skillBg: cc.Node = null;

  @property(cc.Node)
  skillIcon: cc.Node = null;

  @property(cc.Label)
  nameLab: cc.Label = null;

  @property(cc.RichText)
  desc: cc.RichText = null;

  onEnable() {
    let cfg: Expedition_buffCfg = this.args[0];
    let skillCfg = GlobalUtil.getSkillCfg(cfg.buff_id);
    GlobalUtil.setSpriteIcon(this.node, this.skillBg, `common/texture/role/rune/zd_jinengkuang${cfg.buff_color}`);
    GlobalUtil.setSpriteIcon(this.node, this.skillIcon, `icon/skill/${cfg.buff_icon}`);
    this.nameLab.string = skillCfg.name;
    this.desc.string = skillCfg.des;

    this.node.setScale(.7);
    this.node.runAction(cc.sequence(
      cc.scaleTo(.2, 1.05, 1.05),
      cc.scaleTo(.15, 1, 1)
    ));
  }

  onDisable() {
    this.node.stopAllActions();
  }
}
