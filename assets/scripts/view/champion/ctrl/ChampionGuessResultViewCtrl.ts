import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagType } from '../../../common/models/BagModel';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-26 13:53:29 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionGuessResultViewCtrl")
export default class ChampionGuessResultViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  winNode: cc.Node = null;

  @property(cc.Node)
  loseNode: cc.Node = null;

  rmsg: icmsg.ChampionGuessFightResultRsp;
  onEnable() {
    this.rmsg = this.args[0];
    if (this.rmsg.score > 0) {
      this.winNode.active = true;
      this.loseNode.active = false;
      let c = this.winNode.getChildByName('UiSlotItem').getComponent(UiSlotItem);
      c.updateItemInfo(24, this.rmsg.score);
      c.itemInfo = {
        series: null,
        itemId: 24,
        itemNum: BagUtils.getItemNumById(24),
        type: BagType.MONEY,
        extInfo: null
      };
    }
    else {
      this.loseNode.active = true;
      this.winNode.active = false;
      GlobalUtil.setSpriteIcon(this.node, cc.find('layout/icon', this.loseNode), GlobalUtil.getIconById(24));
      cc.find('layout/num', this.loseNode).getComponent(cc.Label).string = `${GlobalUtil.numberToStr2(this.rmsg.score, true)}`;
    }
  }

  onDisable() {
  }
}
