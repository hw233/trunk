import ConfigManager from '../managers/ConfigManager';
import { BarracksCfg, GlobalCfg, ItemCfg } from '../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/CommonInfoTipCtrl")
export default class CommonInfoTipCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.RichText)
    tips: cc.RichText = null

    target: cc.Node = null

    showTip(target: cc.Node = null, itemId, desc = '') {
        let txt = ""
        let cfg = ConfigManager.getItemById(ItemCfg, itemId)
        if (cfg) {
            this.target = target
            this.tips.string = cfg.des
            this._updatePos()
        } else {
            this.target = target
            this.tips.string = desc
            this._updatePos()
        }
    }
    _updatePos() {
        if (!this.target) {
            this.bg.setPosition(cc.v2(0, 0))
            return
        }

        // 算出target在node节点下的坐标
        let wPos = this.target.parent.convertToWorldSpaceAR(this.target.position)
        let inPos = this.node.convertToNodeSpaceAR(wPos)

        let ry = this.bg.height / 2
        this.bg.setPosition(cc.v2(inPos.x + 50, inPos.y))

    }
}