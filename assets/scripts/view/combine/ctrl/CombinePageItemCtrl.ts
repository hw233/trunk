import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import { MainInterface_sort_2Cfg, MainInterface_sortCfg, SystemCfg } from '../../../a/config';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/combine/CombinePageItemCtrl")
export default class CombinePageItemCtrl extends cc.Component {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    select: cc.Node = null;

    redPointCb: Function;
    cfg: MainInterface_sort_2Cfg;
    args: any;
    updateView(cfg: MainInterface_sort_2Cfg, cb: Function, args) {
        this.cfg = cfg;
        this.redPointCb = cb;
        this.args = args;
        let actCfg = ActUtil.getCfgByActId(ConfigManager.getItemById(SystemCfg, this.cfg.systemid).activity);
        let url = this.cfg.resource[actCfg.reward_type - 1] || this.cfg.resource[this.cfg.resource.length - 1];
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/act/texture/common/${url}`);
    }

    updateRedpoint() {
        if (this.redPointCb) {
            return this.args ? this.redPointCb(this.args) : this.redPointCb();
        }
        return false;
    }
}
