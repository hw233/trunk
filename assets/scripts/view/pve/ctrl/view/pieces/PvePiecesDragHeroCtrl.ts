import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import StringUtils from '../../../../../common/utils/StringUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-20 13:53:29 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesDragHero")
export default class PvePiecesDragHeroCtrl extends cc.Component {
  @property(sp.Skeleton)
  hero: sp.Skeleton = null;

  updateView(id: number) {
    let url = StringUtils.format("spine/hero/{0}/0.5/{0}", HeroUtils.getHeroSkin(id));
    GlobalUtil.setSpineData(this.node, this.hero, url, false, "stand", true, false);
  }
}
