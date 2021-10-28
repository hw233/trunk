import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import NetManager from '../../../common/managers/NetManager';
import RelicUtils from '../utils/RelicUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Relic_pointCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-02-22 10:08:35 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicPointReciveListItemCtrl")
export default class RelicPointReciveListItemCtrl extends UiListItem {
  @property(cc.Label)
  ownerInfoLab: cc.Label = null;

  @property(cc.Node)
  progressNode: cc.Node = null;

  @property(cc.Node)
  icon: cc.Node = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property(cc.Label)
  namebLab: cc.Label = null;

  info: icmsg.RelicTransferNoticeRsp;
  cityCfg: Relic_pointCfg;
  exploreRate: number;
  onDisable() {
    this.unscheduleAllCallbacks();
  }

  updateView() {
    this.info = this.data;
    let mapId = [1001, 1002, 1003][this.info.mapType - 1];
    this.cityCfg = ConfigManager.getItemById(Relic_pointCfg, RelicUtils.getTypeByCityId(mapId, this.info.pointId));
    GlobalUtil.setSpriteIcon(this.node, this.icon, `view/guild/texture/icon/${this.cityCfg.skin}`);
    this.namebLab.string = this.cityCfg.des;
    this.ownerInfoLab.string = `S${GlobalUtil.getSeverIdByPlayerId(this.info.ownerBrief.id)}${gdk.i18n.t('i18n:RELIC_TIP1')} ${this.info.ownerBrief.name}`;
    this.content.removeAllChildren();
    this.cityCfg.drop_show.forEach(reward => {
      let item = cc.instantiate(this.itemPrefab);
      item.parent = this.content;
      let ctrl = item.getComponent(UiSlotItem);
      ctrl.updateItemInfo(reward[0], reward[1]);
      ctrl.itemInfo = {
        series: null,
        itemId: reward[0],
        itemNum: reward[1],
        type: BagUtils.getItemTypeById(reward[0]),
        extInfo: null
      };
    });
    this.exploreRate = Math.min(130, Math.max(70, Math.floor(this.info.ownerBrief.power / this.cityCfg.fight) * 100))
    this._updateTime();
    this.schedule(this._updateTime, 1);
  }

  onAcceptBtnClick() {
    let req = new icmsg.RelicTransferConfirmReq();
    req.ownerId = this.info.ownerBrief.id;
    req.mapType = this.info.mapType;
    req.pointId = this.info.pointId;
    NetManager.send(req);
  }

  _updateTime() {
    let bar = cc.find('progress/bar', this.progressNode);
    let lab = cc.find('label', this.progressNode).getComponent(cc.Label);
    let leftTime = Math.max(0, Math.floor((this.info.endTime * 1000 - GlobalUtil.getServerTime()) * (this.exploreRate / 100)));
    lab.string = TimerUtils.format4(leftTime / 1000);
    bar.width = Math.min(226, leftTime / (this.cityCfg.time * 1000) * 226);
    if (leftTime == 0) {
      //todo
      // gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP21"));
      lab.string = gdk.i18n.t('i18n:RELIC_TIP33');
      this.unscheduleAllCallbacks();
    }
  }
}
