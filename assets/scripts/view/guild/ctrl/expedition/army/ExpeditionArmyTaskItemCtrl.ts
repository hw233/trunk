import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import ExpeditionUtils from '../ExpeditionUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import NetManager from '../../../../../common/managers/NetManager';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { Expedition_globalCfg, Expedition_missionCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-15 10:39:00 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/army/ExprditionArmyTaskItemCtrl")
export default class ExpeditionArmyTaskItemCtrl extends UiListItem {
  @property(cc.Label)
  titleLab: cc.Label = null;

  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Node)
  progressNode: cc.Node = null;

  @property(cc.Node)
  getBtn: cc.Node = null;

  @property(cc.Node)
  mask: cc.Node = null;

  cfg: Expedition_missionCfg;
  updateView() {
    this.cfg = this.data;
    this.titleLab.string = this.cfg.desc;
    let itemId = ConfigManager.getItemByField(Expedition_globalCfg, 'key', 'forces_item').value[0];
    this.slot.updateItemInfo(itemId, this.cfg.exp);
    this.slot.itemInfo = {
      series: null,
      itemId: itemId,
      itemNum: this.cfg.exp,
      type: BagUtils.getItemTypeById(itemId),
      extInfo: null
    };
    //progress
    let [hasNum, maxNum] = ExpeditionUtils.getTaskFinishNum(this.cfg.id);
    cc.find('label', this.progressNode).getComponent(cc.Label).string = `${hasNum}/${maxNum}`;
    cc.find('progress/bar', this.progressNode).width = Math.max(0, 150 * (hasNum / maxNum));
    //state
    this._updateState();
  }

  onGetBtnClick() {
    let req = new icmsg.ExpeditionMissionRewardReq();
    req.missionId = this.cfg.mission_id;
    NetManager.send(req, (resp: icmsg.ExpeditionMissionRewardRsp) => {
      let itemId = ConfigManager.getItemByField(Expedition_globalCfg, 'key', 'forces_item').value[0];
      let g = new icmsg.GoodsInfo();
      g.typeId = itemId;
      g.num = this.cfg.exp;
      resp.list.push(g);
      GlobalUtil.openRewadrView(resp.list);
    }, this);
  }

  _updateState() {
    this.getBtn.active = false;
    this.mask.active = false;
    if (ExpeditionUtils.getTaskAwardState(this.cfg.id)) {
      this.mask.active = true;
      return;
    }
    if (ExpeditionUtils.getTaskState(this.cfg.id)) {
      this.getBtn.active = true;
      return;
    }
  }
}
