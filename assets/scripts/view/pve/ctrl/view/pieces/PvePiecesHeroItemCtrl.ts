import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { Hero_careerCfg, Pieces_heroCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-01 10:33:38 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesHeroItemCtrl")
export default class PvePiecesHeroItemCtrl extends UiListItem {
  @property(cc.Node)
  groupIcon: cc.Node = null;

  @property(cc.Node)
  careerIcon: cc.Node = null;

  @property(cc.Node)
  bg: cc.Node = null;

  @property(cc.Node)
  heroIcon: cc.Node = null;

  @property(cc.Label)
  starLab: cc.Label = null;

  @property(cc.Node)
  maxStarNode: cc.Node = null;

  @property(cc.Label)
  maxStarLab: cc.Label = null;

  @property(cc.Node)
  upFlag: cc.Node = null;

  info: icmsg.PiecesHero;
  updateView() {
    this.info = this.data;
    let cfg = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', this.info.typeId);
    let icon = HeroUtils.getHeroHeadIcon(this.info.typeId, this.info.star, false)
    GlobalUtil.setSpriteIcon(this.node, this.heroIcon, icon);
    GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${cfg.group[0]}`);
    GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${ConfigManager.getItemByField(Hero_careerCfg, 'hero_id', this.info.typeId, { career_id: this.info.line }).career_type}`);
    GlobalUtil.setSpriteIcon(this.node, this.bg, `common/texture/role/select/quality_bg_0${cfg.color}`);
    this.upFlag.active = this.info.pos < 100;
    if (this.upFlag.active) {
      GlobalUtil.setSpriteIcon(this.node, this.upFlag, 'view/role/texture/select/yx_zhanxiaozi');
    }
    this._updateStar();
  }

  /**更新星星数量 */
  _updateStar() {
    let starNum = this.info.star;
    if (starNum >= 12) {
      this.starLab.node.active = false;
      this.maxStarNode.active = true;
      this.maxStarLab.string = (starNum - 11) + ''
    } else {
      this.starLab.node.active = true;
      this.maxStarNode.active = false;
      let starTxt = "";
      if (starNum > 5) {
        starTxt = '1'.repeat(starNum - 5);
      }
      else {
        starTxt = '0'.repeat(starNum);
      }
      this.starLab.string = starTxt;
    }
  }
}
