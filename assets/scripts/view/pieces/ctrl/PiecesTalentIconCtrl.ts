import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import PiecesModel from '../../../common/models/PiecesModel';
import PiecesUtils from '../utils/PiecesUtils';
import { Pieces_talentCfg } from '../../../a/config';
import { PiecesEventId } from '../enum/PiecesEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-19 14:27:41 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/pieces/PiecesTalentViewCtrl")
export default class PiecesTalentIconCtrl extends cc.Component {
  @property(cc.Node)
  iconBg: cc.Node = null;

  @property(cc.Node)
  icon: cc.Node = null;

  @property(cc.Node)
  lockBg: cc.Node = null;

  @property(cc.Node)
  lock: cc.Node = null;

  @property(cc.Node)
  costNode: cc.Node = null;

  @property(cc.Node)
  addBtn: cc.Node = null;

  get model(): PiecesModel { return ModelManager.get(PiecesModel); }

  id: number;
  updateView(id: number) {
    this.id = id;
    let c = ConfigManager.getItemById(Pieces_talentCfg, id);
    let unlock = this.model.talentMap[id] == 1;
    GlobalUtil.setAllNodeGray(this.iconBg, unlock ? 0 : 1);
    GlobalUtil.setSpriteIcon(this.node, this.icon, `view/pieces/texture/static/talent/${c.icon}`);
    cc.find('lab', this.costNode).getComponent(cc.Label).string = c.consumption + '';
    cc.find('lab', this.costNode).color = cc.color().fromHEX(this.model.talentPoint >= c.consumption || unlock ? '#BADB15' : '#FF0000')
    this.costNode.active = unlock || (!unlock && PiecesUtils.getTalentUnlockState(c.id));
    this.lock.active = !unlock;
    this.lockBg.active = !unlock;
    this.addBtn.active = !unlock && PiecesUtils.getTalentUnlockState(c.id);
    if (!this.addBtn.active) {
      this.addBtn.targetOff(this);
    }
    else {
      let id = c.id;
      this.addBtn.on('click', () => {
        this.onActiveBtnClick(id);
      }, this);
    }
  }

  onActiveBtnClick(id: number) {
    gdk.e.emit(PiecesEventId.PIECES_TALENT_CLICK_TO_ACTIVE, id);
  }

  onIconClick() {
    gdk.panel.setArgs(PanelId.PiecesTalentInfoView, this.id);
    gdk.panel.open(PanelId.PiecesTalentInfoView);
  }
}
