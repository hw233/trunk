import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PiecesModel from '../../../common/models/PiecesModel';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Pieces_divisionCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-18 15:50:08 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/pieces/PiecesRankRewardViewCtrl")
export default class PiecesRankRewardItemCtrl extends UiListItem {
  @property(cc.Node)
  rankIcon: cc.Node = null;

  @property(cc.Label)
  rankName: cc.Label = null;

  @property(cc.Label)
  rankScore: cc.Label = null;

  @property(cc.Node)
  getBtn: cc.Node = null;

  @property(cc.Node)
  mask: cc.Node = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  slotPrefab: cc.Prefab = null;

  get model(): PiecesModel { return ModelManager.get(PiecesModel); }

  cfg: Pieces_divisionCfg;
  updateView() {
    this.cfg = this.data;
    GlobalUtil.setSpriteIcon(this.node, this.rankIcon, `common/texture/pieces/${this.cfg.icon}`);
    this.rankName.string = this.cfg.name;
    this.rankScore.string = `(${this.model.score}/${this.cfg.point})`;
    this.content.removeAllChildren();
    this.cfg.rewards.forEach(r => {
      let slot = cc.instantiate(this.slotPrefab);
      slot.parent = this.content;
      let ctrl = slot.getComponent(UiSlotItem);
      ctrl.updateItemInfo(r[0], r[1]);
      ctrl.itemInfo = {
        series: null,
        itemId: r[0],
        itemNum: r[1],
        type: BagUtils.getItemTypeById(r[0]),
        extInfo: null
      }
    });
    this.scrollView.scrollToLeft();
    this.scrollView.enabled = this.cfg.rewards.length > 4;
    this._updateState();
  }

  _updateState() {
    this.getBtn.active = false;
    this.mask.active = false;
    if (this.model.divisionRewardMap[this.cfg.division] == 1) {
      this.mask.active = true;
    }
    else if (this.cfg.point <= this.model.score) {
      this.getBtn.active = true;
    }
  }

  onGetBtnClick() {
    if (this.model.score >= this.cfg.point) {
      let req = new icmsg.PiecesGainDivisionRewardReq();
      req.rank = this.cfg.division;
      NetManager.send(req, (resp: icmsg.PiecesGainDivisionRewardRsp) => {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        GlobalUtil.openRewadrView(resp.list);
        this._updateState();
      }, this);
    }
  }
}
