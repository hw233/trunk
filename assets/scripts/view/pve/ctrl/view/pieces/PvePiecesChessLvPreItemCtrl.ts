import PiecesUtils from '../../../../pieces/utils/PiecesUtils';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { Pieces_discCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-06 10:17:43 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesChessLvPreItemCtrl")
export default class PvePiecesChessLvPreItemCtrl extends UiListItem {
    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    qualityNode: cc.Node = null;

    updateView() {
        let cfg: Pieces_discCfg = this.data;
        this.lvLab.string = `Lv${cfg.level}`;
        let weightList = [
            PiecesUtils.getRefreshWeight(1, cfg.level),
            PiecesUtils.getRefreshWeight(2, cfg.level),
            PiecesUtils.getRefreshWeight(3, cfg.level),
            PiecesUtils.getRefreshWeight(4, cfg.level),
        ]
        let total = weightList[0] + weightList[1] + weightList[2] + weightList[3];
        let temps = [];
        this.qualityNode.children.forEach((w, idx) => {
            w.active = true;
            let temp = (weightList[idx] / total * 100).toFixed(2);
            temps.push(temp);
            w.getChildByName('num').getComponent(cc.Label).string = `${temp}%`;
        });
        this.qualityNode.children[0].getChildByName('num').getComponent(cc.Label).string = `${(100 - temps[1] - temps[2] - temps[3]).toFixed(2)}%`;
    }
}
