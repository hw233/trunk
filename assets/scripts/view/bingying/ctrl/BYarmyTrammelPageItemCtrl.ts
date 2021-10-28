import BYModel from '../model/BYModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import { Soldier_army_trammelCfg } from '../../../a/config';

/** 
 * @Description: 兵营-兵团精甲穿戴界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-09 17:58:38
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYarmyTrammelPageItemCtrl")
export default class BYarmyTrammelPageItemCtrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    select: cc.Node = null;

    cfg: Soldier_army_trammelCfg;
    get byModel() { return ModelManager.get(BYModel); }
    updateView(cfg: Soldier_army_trammelCfg) {
        this.cfg = cfg;
        // this.redPointCb = cb;
        // this.args = args;
        let url = 'view/bingying/texture/army/by_jibananniu0' + this.cfg.trammel_id
        GlobalUtil.setSpriteIcon(this.node, this.icon, url);
    }

    updateRedpoint() {
        if (this.cfg) {
            for (let i = 0; i < this.cfg.skin_id.length; i++) {
                let skin_id = this.cfg.skin_id[i];
                if (this.byModel.byarmyState.skins.indexOf(skin_id) < 0) {
                    return false;
                }
            }
            if (this.byModel.byarmyState.trammels.indexOf(this.cfg.trammel_id) < 0) {
                return true;
            }
        }

        return false;
    }
    // update (dt) {}
}
