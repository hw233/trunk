import BYModel from '../model/BYModel';
import BYUtils from '../utils/BYUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import { BarracksCfg } from '../../../a/config';
/** 
  * @Description: 
  * @Author: weiliang.huang  
  * @Date: 2019-05-08 14:31:02 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-10-30 16:59:40
*/


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYItemCtrl")
export default class BYItemCtrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Node)
    tipNode: cc.Node = null

    @property(cc.RichText)
    tipLab: cc.RichText = null //#31201A

    @property(cc.Label)
    roundLab: cc.Label = null

    @property(sp.Skeleton)
    spine1: sp.Skeleton = null

    @property(sp.Skeleton)
    spine2: sp.Skeleton = null

    get byModel(): BYModel { return ModelManager.get(BYModel); }

    _cfg: BarracksCfg
    _curLv: number = 0

    onEnable() {
    }


    /**
     * 
     * @param cfg 
     */
    updateViewInfo(cfg: BarracksCfg) {
        this._cfg = cfg
        // let index = cfg.barracks_lv % 6
        // if (index == 0) {
        //     index = 6
        // }
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/bingying/texture/new/by_${cfg.type}_${BYUtils.getKeyName(cfg)}`)
        this.roundLab.string = `${cfg.rounds}`

        this._curLv = this.byModel.byLevelsData[cfg.type - 1]

        this.tipNode.active = false
        this.spine1.node.active = false
        this.spine2.node.active = false
        if (cfg.barracks_lv > this._curLv) {
            GlobalUtil.setGrayState(this.icon, 1)
            if (cfg.barracks_lv == this._curLv + 1) {
                this.spine1.node.active = true
                this.spine1.setAnimation(0, "stand", true)
                this.tipNode.active = true
                this.tipLab.string = BYUtils.getBarracksDesc(cfg.type, cfg.barracks_lv)
            }
        } else {
            GlobalUtil.setGrayState(this.icon, 0)
        }
    }

    playerUpgradeEffect() {
        this.spine2.node.active = true
        this.spine2.setAnimation(0, "stand", false)
    }
}