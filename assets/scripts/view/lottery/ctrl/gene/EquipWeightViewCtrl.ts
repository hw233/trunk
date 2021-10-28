import ConfigManager from '../../../../common/managers/ConfigManager';
import { Unique_lotteryCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-09-13 18:18:47 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-13 15:26:24
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/EquipWeightViewCtrl')
export default class EquipWeightViewCtrl extends gdk.BasePanel {
    @property([cc.Node])
    weightNodes: cc.Node[] = [];

    onEnable() {
        let cfg = ConfigManager.getItemById(Unique_lotteryCfg, 1);
        let weights = [cfg.des[0], cfg.des[1], cfg.des[2], cfg.des[3]];
        this.weightNodes.forEach((n, idx) => {
            n.getChildByName('weightLabel').getComponent(cc.Label).string = `${weights[idx]}%`;
        });
    }
}
