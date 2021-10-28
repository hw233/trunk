import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import { Pieces_talentCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-19 16:46:03 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/pieces/PiecesRankRewardViewCtrl")
export default class PiecesTalentActiveViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    descLab: cc.Label = null;

    onEnable() {
        let id = this.args[0];
        let cfg = ConfigManager.getItemById(Pieces_talentCfg, id);
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/pieces/texture/static/talent/${cfg.icon}`);
        this.nameLab.string = cfg.name;
        this.descLab.string = cfg.desc;
    }
}
