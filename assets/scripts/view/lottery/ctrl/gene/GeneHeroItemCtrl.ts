import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { HeroCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-14 14:26:49 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/GeneHeroItemCtrl')
export default class GeneHeroItemCtrl extends UiListItem {
  @property(cc.Node)
  group: cc.Node = null;

  @property(cc.Node)
  career: cc.Node = null;

  @property(cc.Label)
  lv: cc.Label = null;

  @property(cc.Label)
  star: cc.Label = null;
  @property(cc.Node)
  maxStarNode: cc.Node = null;
  @property(cc.Label)
  maxStarLb: cc.Label = null;

  @property(cc.Node)
  quality: cc.Node = null;

  @property(cc.Node)
  hero: cc.Node = null;

  @property(cc.Node)
  select: cc.Node = null;

  info: icmsg.HeroInfo;
  updateView() {
    this.info = this.data;
    let cfg = ConfigManager.getItemById(HeroCfg, this.info.typeId);
    GlobalUtil.setSpriteIcon(this.node, this.group, GlobalUtil.getGroupIcon(cfg.group[0], false));
    let type = Math.floor(this.info.soldierId / 100);
    GlobalUtil.setSpriteIcon(this.node, this.career, `common/texture/role/select/career_${type}`);
    GlobalUtil.setSpriteIcon(this.node, this.quality, `common/texture/role/select/quality_bg_0${this.info.color}`);

    let starNum = this.info.star;
    if (starNum >= 12 && this.maxStarNode) {
      this.star.node.active = false;
      this.maxStarNode.active = true;
      this.maxStarLb.string = (starNum - 11) + ''
    } else {
      this.star.node.active = true;
      this.maxStarNode ? this.maxStarNode.active = false : 0;
      this.star.string = this.info.star > 5 ? '1'.repeat(this.info.star - 5) : '0'.repeat(this.info.star);
    }

    this.lv.string = this.info.level + '';
    let icon = HeroUtils.getHeroHeadIcon(this.info.typeId, this.info.star, false)
    GlobalUtil.setSpriteIcon(this.node, this.hero, icon);
    GlobalUtil.setAllNodeGray(this.node, HeroUtils.heroLockCheck(this.info, false) ? 1 : 0);
    this.onSelect();
  }

  onSelect() {
    this.select.active = this.list['selectId'] == this.info.heroId;
  }
}
