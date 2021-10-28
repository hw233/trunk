import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../main/skill/SkillInfoPanelCtrl';
import { SkillCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-17 14:21:36 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-17 21:00:58
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/geneConnect/MysticSkillItemCtrl")
export default class MysticSkillItemCtrl extends cc.Component {
  @property(cc.Node)
  bg: cc.Node = null;

  @property(cc.Node)
  skillBg: cc.Node = null;

  @property(cc.Node)
  icon: cc.Node = null;

  @property(cc.Label)
  nameLab: cc.Label = null;

  @property(cc.Label)
  curLvLab: cc.Label = null;

  @property(cc.Node)
  arrow: cc.Node = null;

  @property(cc.Label)
  nextLvLab: cc.Label = null;

  @property(cc.Node)
  selectFlag: cc.Node = null;

  skillCfgs: SkillCfg[] = [];
  curLv: number;
  updateView(cfgs: SkillCfg[], curLv: number) {
    this.skillCfgs = cfgs;
    this.curLv = curLv;
    GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getSkillIcon(this.skillCfgs[0].skill_id));
    this.nameLab.string = this.skillCfgs[0].name;
    this.curLvLab.string = `Lv.${curLv}`;
    this.changeBg(1);
    this.showSelectFlag(false);
    this.showNextLv(false);
  }

  onSkillIconClick() {
    gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
      let ctrl = node.getComponent(SkillInfoPanelCtrl);
      ctrl.showSkillInfo(this.skillCfgs[0].skill_id, this.curLv);
    });
  }

  /**背景 0-高亮 1-黯淡 */
  changeBg(v: number) {
    if (this.isMaxLv()) {
      v = 1;
    }
    GlobalUtil.setSpriteIcon(this.node, this.bg, `view/role/texture/geneConnect/${v == 0 ? 'jyzh_shangdianbg' : 'smz_xinxibghui'}`);
    let color = v == 0 ? '#FFC343' : '#CCB47F';
    this.nameLab.node.color = this.curLvLab.node.color = cc.color().fromHEX(color);
  }

  /**选择框 */
  showSelectFlag(b: boolean) {
    if (this.isMaxLv()) {
      this.selectFlag.active = false;
      return;
    }
    this.selectFlag.active = b;
  }

  /**显示下一级 */
  showNextLv(b: boolean) {
    if (this.isMaxLv()) {
      this.arrow.active = false;
      this.nextLvLab.node.active = true;
      this.nextLvLab.string = '(已满级)';
      return;
    }

    this.arrow.active = b;
    this.nextLvLab.node.active = b;
    this.nextLvLab.string = `Lv.${this.curLv + 1}`;
  }

  /**是否满级 */
  isMaxLv(): boolean {
    return this.curLv == this.skillCfgs[this.skillCfgs.length - 1].level;
  }
}
