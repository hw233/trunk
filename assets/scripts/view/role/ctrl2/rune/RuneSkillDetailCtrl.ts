import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import { RuneCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-10 10:38:44 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneSkillDetailCtrl")
export default class RuneSkillDetailCtrl extends gdk.BasePanel {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    type: cc.Label = null;

    @property(cc.RichText)
    skillDesc: cc.RichText = null;

    @property(cc.RichText)
    extraDesc: cc.RichText = null;

    cfg: RuneCfg;
    onEnable() {
        this.cfg = this.args[0];
        this._updateView();
    }

    onDisable() {
        this.cfg = null;
    }

    _updateView() {
        let skillCfg = GlobalUtil.getSkillLvCfg(this.cfg.skill, this.cfg.skill_level);
        GlobalUtil.setSpriteIcon(this.node, this.bg, `common/texture/role/rune/zd_jinengkuang${this.cfg.color}`);
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getSkillIcon(this.cfg.skill));
        this.nameLab.string = skillCfg.name + ' ' + `Lv${skillCfg.level}`;
        let colorInfo = BagUtils.getColorInfo(this.cfg.color);
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);
        this.type.string = `${gdk.i18n.t('i18n:RUNE_TIP12')}:${this.cfg.skill_type == 1 ? gdk.i18n.t('i18n:RUNE_TIP13') : gdk.i18n.t('i18n:RUNE_TIP14')}`;
        this.skillDesc.string = skillCfg.des;
        this.extraDesc.string = this.cfg.note;
    }
}
