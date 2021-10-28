
/** 
 * @Description: 皇家竞技场View
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-17 17:36:51
 */

import { Royal_divisionCfg } from "../../../a/config";
import ModelManager from "../../../common/managers/ModelManager";
import RoyalModel from "../../../common/models/RoyalModel";
import GlobalUtil from "../../../common/utils/GlobalUtil";


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaViewDivisionItemCtrl")
export default class RoyalArenaViewDivisionItemCtrl extends cc.Component {

    @property(cc.Node)
    curDivisionNode: cc.Node = null;
    @property(cc.Sprite)
    divisionIcon: cc.Sprite = null;
    @property(cc.Label)
    divisionName: cc.Label = null;
    @property(cc.Label)
    scoreLb: cc.Label = null;
    @property(cc.Label)
    scoorelb2: cc.Label = null;
    @property(cc.Node)
    lockNode: cc.Node = null;

    @property(cc.Node)
    bgNode: cc.Node = null;


    cfgData: Royal_divisionCfg
    info: { isNext: boolean, curScore: number, lock: boolean }
    get royalModel() { return ModelManager.get(RoyalModel); }
    updataView(cfg: Royal_divisionCfg, data: { isNext: boolean, curScore: number, lock: boolean }) {
        this.info = data;
        this.cfgData = cfg;
        GlobalUtil.setSpriteIcon(this.node, this.divisionIcon, 'view/act/texture/peak/' + cfg.icon)
        this.divisionName.string = cfg.name;
        if (data.isNext) {
            this.lockNode.active = true;
            this.scoreLb.string = cfg.point + '解锁'
            this.scoorelb2.string = `还差(${cfg.point - data.curScore})`
        } else {
            this.lockNode.active = false;
        }
        let isCur = this.royalModel.division == cfg.division;
        this.curDivisionNode.active = isCur;
        let bgPath = 'view/royalArena/texture/view/' + (isCur ? 'hjjjc_dizhuo01' : 'hjjjc_dizhuo02');
        GlobalUtil.setSpriteIcon(this.node, this.bgNode, bgPath)
        let state: 0 | 1 = 0;
        if (data.lock) {
            state = 1;
        }
        GlobalUtil.setAllNodeGray(this.node, state);
    }


}
