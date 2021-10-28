import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import PanelId from '../../../../configs/ids/PanelId';
import { Score_recourseCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-25 21:03:18
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysZyItem2Ctrl")
export default class ScoreSysZyItem2Ctrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Label)
    descLab: cc.Label = null;

    @property(cc.Node)
    btnOpen: cc.Node = null;

    @property(cc.Node)
    suggesetIcon: cc.Node = null;

    _isOpen = false

    _recourseCfg: Score_recourseCfg

    onEnable() {

    }

    updateViewInfo(cfg: Score_recourseCfg) {
        this._recourseCfg = cfg
        this.titleLab.string = cfg.name
        this.descLab.string = cfg.desc
        this.suggesetIcon.active = !!cfg.title
        GlobalUtil.setSpriteIcon(this.node, this.icon, `icon/item/${cfg.icon}`)
    }

    goFunc() {
        let isShow = JumpUtils.openView(this._recourseCfg.forward, true)
        if (isShow) {
            gdk.panel.hide(PanelId.ScoreSytemView)
        }
    }
}