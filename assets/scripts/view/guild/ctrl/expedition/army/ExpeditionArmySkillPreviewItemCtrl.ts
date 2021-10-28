import ExpeditionUtils from '../ExpeditionUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { Expedition_buffCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-16 16:18:42 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/army/ExpeditionArmySkillPreviewItemCtrl")
export default class ExpeditionArmySkillPreviewItemCtrl extends UiListItem {
  @property(cc.Node)
  skillBg: cc.Node = null;

  @property(cc.Node)
  skillIcon: cc.Node = null;

  @property(cc.Label)
  nameLab: cc.Label = null;

  @property(cc.RichText)
  desc: cc.RichText = null;

  @property(cc.Label)
  lockTips: cc.Label = null;

  updateView() {
    let cfg: Expedition_buffCfg = this.data;
    let skillCfg = GlobalUtil.getSkillCfg(cfg.buff_id);
    GlobalUtil.setSpriteIcon(this.node, this.skillBg, `common/texture/role/rune/zd_jinengkuang${cfg.buff_color}`);
    GlobalUtil.setSpriteIcon(this.node, this.skillIcon, `icon/skill/${cfg.buff_icon}`);
    this.nameLab.string = skillCfg.name;
    this.desc.string = skillCfg.des;
    let curLv = ExpeditionUtils.getTotalStrengthenLvByCareer(cfg.professional_type);
    this.lockTips.node.active = curLv < cfg.strengthen_level;
    if (this.lockTips.node.active) {
      this.lockTips.string = `Lv${cfg.strengthen_level}解锁`;
    }
  }
}
