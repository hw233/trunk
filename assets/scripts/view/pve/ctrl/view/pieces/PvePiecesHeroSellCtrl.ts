import ConfigManager from '../../../../../common/managers/ConfigManager';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PiecesModel from '../../../../../common/models/PiecesModel';
import { Pieces_heroCfg, Pieces_silverCfg } from '../../../../../a/config';
import { PiecesEventId } from '../../../../pieces/enum/PiecesEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-20 17:38:34 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesHeroSellCtrl")
export default class PvePiecesHeroSellCtrl extends cc.Component {
  @property(cc.Node)
  iconNode: cc.Node = null;

  @property(sp.Skeleton)
  sellSpine: sp.Skeleton = null;

  @property(cc.Label)
  numLab: cc.Label = null;

  updateView(id: number) {
    let info = ModelManager.get(PiecesModel).heroMap[id];
    let cfg = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', info.typeId);
    let c = ConfigManager.getItemByField(Pieces_silverCfg, 'color', cfg.color, { star: info.star });
    this.numLab.string = c.silver + '';
    this.iconNode.active = true;
    this.sellSpine.setCompleteListener(null);
    this.sellSpine.node.active = false;
  }

  sellHero(id: number, waitAni: boolean = true, cb?: Function) {
    let req = new icmsg.PiecesSellHeroReq();
    req.id = id;
    NetManager.send(req, (resp: icmsg.PiecesSellHeroRsp) => {
      this.iconNode.active = false;
      this.sellSpine.setCompleteListener(() => {
        this.sellSpine.setCompleteListener(null);
        this.sellSpine.node.active = false;
        if (waitAni) {
          cb && cb();
        }
        else {
          gdk.e.emit(PiecesEventId.PIECES_PVP_HIDE_HERO_SELL_ICON);
        }
      });
      if (!waitAni) {
        cb && cb();
      }
      this.sellSpine.node.active = true;
      this.sellSpine.setAnimation(0, 'stand', true);
    }, this);
  }
}
