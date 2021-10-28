import BYModel from '../../model/BYModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import { Tech_energizeCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-19 11:15:56 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/energize/BYEnergizeViewCtrl")
export default class BYEnergizePreViewCtrl extends gdk.BasePanel {
    @property([cc.RichText])
    desc: cc.RichText[] = [];

    onEnable() {
        let m = ModelManager.get(BYModel);
        let round = m.energizeRound;
        let curCfg = ConfigManager.getItemById(Tech_energizeCfg, round);
        let nextCfg = ConfigManager.getItemById(Tech_energizeCfg, round + 1);
        let nNextCfg = ConfigManager.getItemById(Tech_energizeCfg, round + 2);
        this.desc[0].string = curCfg ? curCfg.desc : '';
        this.desc[1].string = nextCfg ? nextCfg.desc : '';
        this.desc[2].string = nNextCfg ? nNextCfg.desc : '';
    }
}
