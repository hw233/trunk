import HeroModel from '../../../../../common/models/HeroModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import PvePiecesChangeCareerItemCtrl from './PvePiecesChangeCareerItemCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-01 10:35:32 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesChangeCareerViewCtrl")
export default class PvePiecesChangeCareerViewCtrl extends gdk.BasePanel {

  @property(cc.Node)
  careerNodes: cc.Node[] = []

  get heroModel() { return ModelManager.get(HeroModel); }

  onEnable() {
    let curHeroInfo: icmsg.PiecesHero = this.args[0];
    let careers = this.heroModel.careerInfos[curHeroInfo.typeId]
    for (let i = 0; i < this.careerNodes.length; i++) {
      let node = this.careerNodes[i]
      let ctrl = node.getComponent(PvePiecesChangeCareerItemCtrl)
      ctrl.updateViewInfo(curHeroInfo, careers[i], i)
    }

  }
}
