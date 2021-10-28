import RewardItem from '../../../../common/widgets/RewardItem';
import { Item_drop_groupCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-14 17:59:55 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/GeneWeightItemCtrl')
export default class GeneWeightItemCtrl extends cc.Component {

  @property(cc.Prefab)
  rewardItem: cc.Prefab = null;
  @property(cc.Label)
  weightNum: cc.Label = null;

  updateView(cfg: Item_drop_groupCfg, odds: number) {
    let icon = cc.instantiate(this.rewardItem);
    let ctrl = icon.getComponent(RewardItem);
    icon.name = 'reward';
    icon.parent = this.node.getChildByName('icon');
    ctrl.setData(null, 0, {
      index: 0,
      typeId: cfg.item_id,
      num: cfg.item_num || 0,
      delayShow: false,
      effect: false,
      showCommonEffect: false,
      cxEffect: false,
      up: false,
      isGet: false,
    });
    ctrl.updateView();
    ctrl.lv.node.active = false;
    this.weightNum.string = (odds / 100).toFixed(2) + '%';
  }

  onDisable() {
    let icon = this.node.getChildByName('icon');
    icon && icon.destroyAllChildren();
  }
}
