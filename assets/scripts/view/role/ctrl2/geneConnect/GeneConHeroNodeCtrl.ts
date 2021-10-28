import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import { Hero_starCfg } from '../../../../a/config';
import { HeroCfg } from '../../../../../boot/configs/bconfig';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-16 13:40:16 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-20 16:57:34
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/geneConnect/GeneConHeroNodeCtrl")
export default class GeneConHeroNodeCtrl extends cc.Component {
  @property(cc.Node)
  groupIcon: cc.Node = null;

  @property(cc.Label)
  nameLab: cc.Label = null;

  @property(cc.Label)
  starLab: cc.Label = null;

  @property(cc.Node)
  maxStarNode: cc.Node = null;

  @property(cc.Label)
  maxStarLb: cc.Label = null;

  // @property(cc.Node)
  // unkonwHero: cc.Node = null;

  @property(sp.Skeleton)
  heroSpine: sp.Skeleton = null;

  updateView(heroId: number = 0) {
    if (!heroId) {
      this.nameLab.string = '';
      this.nameLab.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX('#000000');
      this.groupIcon.active = false;
      this.heroSpine.node.active = false;
      // this.unkonwHero.active = true;
      this.starLab.string = '';
      this.maxStarNode.active = false;
    } else {
      let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
      let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
      this.nameLab.string = heroCfg.name;
      let quality = ConfigManager.getItemById(Hero_starCfg, heroInfo.star).color;
      this.nameLab.node.color = BagUtils.getColor(quality);
      this.nameLab.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(quality);
      let starNum = heroInfo.star;
      if (starNum >= 12 && this.maxStarNode) {
        this.starLab.node.active = false;
        this.maxStarNode.active = true;
        this.maxStarLb.string = (starNum - 11) + ''
      } else {
        this.starLab.node.active = true;
        this.maxStarNode ? this.maxStarNode.active = false : 0;
        this.starLab.string = starNum > 5 ? '1'.repeat(starNum - 5) : '0'.repeat(starNum);
      }
      // this.unkonwHero.active = false;
      this.heroSpine.node.active = true;
      HeroUtils.setSpineData(this.node, this.heroSpine, HeroUtils.getHeroSkin(heroInfo.typeId, heroInfo.star), false, false);
      this.groupIcon.active = true;
      GlobalUtil.setSpriteIcon(this.node, this.groupIcon, GlobalUtil.getGroupIcon(heroCfg.group[0], false));
    }
  }
}
