import ConfigManager from '../../../common/managers/ConfigManager';
import { Pieces_talentCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-19 16:55:38 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/pieces/PiecesTalentViewCtrl")
export default class PiecesTalentInfoViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.RichText)
    desc: cc.RichText = null;

    onEnable() {
        let id = this.args[0];
        let cfg = ConfigManager.getItemById(Pieces_talentCfg, id);
        this.nameLab.string = cfg.name;
        this.desc.string = cfg.desc;
    }
}
