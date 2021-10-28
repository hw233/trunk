import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Carnival_topupCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-12 10:21:09 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/crossRecharge/CrossRechargeRewardItemCtrl")
export default class CrossRechargeRewardItemCtrl extends UiListItem {
  @property(cc.Node)
  rankLabNode: cc.Node = null;

  @property(cc.Node)
  rankSprite: cc.Node = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  slotItemPrefab: cc.Prefab = null;

  @property(cc.Node)
  curPosFlag: cc.Node = null;

  rankSpriteName: string[] = [
    'common/texture/main/gh_gxbhuizhang01',
    'common/texture/main/gh_gxbhuizhang02',
    'common/texture/main/gh_gxbhuizhang03',
  ];
  isCurPos: boolean;
  cfg: Carnival_topupCfg;
  updateView() {
    [this.isCurPos, this.cfg] = [this.data.isCurPos, this.data.cfg];
    if (this.cfg.id <= 3) {
      this.rankLabNode.active = false;
      this.rankSprite.active = true;
      let path = this.rankSpriteName[this.curIndex];
      GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
    }
    else {
      this.rankLabNode.active = true;
      this.rankSprite.active = false;
      this.rankLabNode.getChildByName('rank').getComponent(cc.Label).string = `${this.cfg.interval[0]}~${this.cfg.interval[1]}`;
    }
    this.content.removeAllChildren();
    this.cfg.rewards.forEach(reward => {
      let slot = cc.instantiate(this.slotItemPrefab);
      slot.parent = this.content;
      let ctrl = slot.getComponent(UiSlotItem);
      ctrl.updateItemInfo(reward[0], reward[1]);
      ctrl.itemInfo = {
        series: null,
        itemId: reward[0],
        itemNum: reward[1],
        type: BagUtils.getItemTypeById(reward[0]),
        extInfo: null
      }
    });

    gdk.Timer.callLater(this, () => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      if (this.cfg.rewards.length <= 4) {
        this.scrollView.node.width = this.content.width;
        this.content.setPosition(0, 0);
        this.scrollView.enabled = false;
      }
      else {
        this.scrollView.enabled = true;
        this.scrollView.node.width = 523;
        this.scrollView.scrollToLeft();
      }
    });
    this.curPosFlag.active = this.isCurPos;
  }
}
