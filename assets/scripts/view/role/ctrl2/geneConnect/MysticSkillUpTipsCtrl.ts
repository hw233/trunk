import GlobalUtil from '../../../../common/utils/GlobalUtil';
import { SkillCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-17 14:19:23 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-17 18:09:59
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/geneConnect/MysticSkillUpTipsCtrl")
export default class MysticSkillUpTipsCtrl extends gdk.BasePanel {
  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Node)
  skillItem: cc.Node = null;

  curSkilllvs: number[] = [];
  newSkillLvs: number[] = [];
  cfgs: SkillCfg[][] = [];
  onEnable() {
    [this.curSkilllvs, this.newSkillLvs, this.cfgs] = this.args[0];
    this.content.removeAllChildren();
    for (let i = 0; i < 4; i++) {
      if (this.newSkillLvs[i] > this.curSkilllvs[i]) {
        let cfg = this.cfgs[i][0];
        let item = cc.instantiate(this.skillItem);
        item.parent = this.content;
        item.active = true;
        GlobalUtil.setSpriteIcon(this.node, cc.find('icon', item), GlobalUtil.getSkillIcon(cfg.skill_id));
        cc.find('name', item).getComponent(cc.Label).string = cfg.name;
        cc.find('layout/oldLv', item).getComponent(cc.Label).string = `Lv.${this.curSkilllvs[i]}`;
        cc.find('layout/newLv', item).getComponent(cc.Label).string = `Lv.${this.newSkillLvs[i]}`;
      }
    }
  }

  onDisable() {
  }
}
