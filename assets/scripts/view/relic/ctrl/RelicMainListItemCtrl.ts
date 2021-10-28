import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Relic_pointCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-28 14:36:58 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicMainListItemCtrl")
export default class RelicMainListItemCtrl extends cc.Component {
  @property(cc.Node)
  icon: cc.Node = null;

  @property(cc.Node)
  iconBg: cc.Node = null;

  @property(cc.Label)
  infoLab: cc.Label = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  slotPrefab: cc.Prefab = null;

  iconBgUrl: string[] = ['anquangqu', 'pkqu', 'jinsequ']
  updateView(info: { pointType: number, totalNum: number, curUseNum: number, mapType: number, maxShow: number }) {
    let cfg = ConfigManager.getItemById(Relic_pointCfg, info.pointType);
    GlobalUtil.setSpriteIcon(this.node, this.icon, `view/guild/texture/icon/${cfg.skin}`);
    GlobalUtil.setSpriteIcon(this.node, this.iconBg, `view/relic/texture/zzyj_${this.iconBgUrl[info.mapType - 1]}kuang`)
    //color #01FFFC #FFDF6F outline #0D2D62 #491110
    this.infoLab.string = `${cfg.des}(${info.totalNum - info.curUseNum}/${info.totalNum})`;
    this.infoLab.node.color = cc.color().fromHEX(info.mapType == 1 ? '#01FFFC' : '#FFDF6F');
    this.infoLab.node.getComponent(cc.LabelOutline).color = cc.color().fromHEX(info.mapType == 1 ? '#0D2D62' : '#491110')
    // let maxLen =
    this.content.removeAllChildren();
    cfg.drop_show.forEach((reward, idx) => {
      if (idx < info.maxShow) {
        let slot = cc.instantiate(this.slotPrefab);
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
      }
    });
    // if (info.maxShow >= 3) {
    //   this.scrollView.enabled = true;
    //   this.scrollView.node.width = 340;
    //   // this.scrollView.scrollToTopLeft();
    // }
    // else {
    this.scrollView.enabled = false;
    this.scrollView.node.width = this.content.width;
    // }
  }
}
