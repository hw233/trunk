import ActUtil from '../util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import { MainInterface_sortCfg, SystemCfg } from '../../../a/config';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/ActivityPageItemCtrl")
export default class ActivityPageItemCtrl extends cc.Component {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    select: cc.Node = null;

    redPointCb: Function;
    cfg: MainInterface_sortCfg;
    args: any;
    updateView(cfg: MainInterface_sortCfg, cb: Function, args) {
        this.cfg = cfg;
        this.redPointCb = cb;
        this.args = args;
        let sysCfg = ConfigManager.getItemById(SystemCfg, this.cfg.systemid)
        let url = this.cfg.resource[this.cfg.resource.length - 1];
        //探险礼包特殊处理
        if (sysCfg && sysCfg.activity && this.cfg.systemid != 2917) {
            let actCfg = ActUtil.getCfgByActId(sysCfg.activity);
            url = this.cfg.resource[actCfg.reward_type - 1] || this.cfg.resource[this.cfg.resource.length - 1];
        }
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/act/texture/common/${url}`);
    }

    updateRedpoint() {
        if (this.redPointCb) {
            return this.args ? this.redPointCb(this.args) : this.redPointCb();
        }
        return false;
    }
}
