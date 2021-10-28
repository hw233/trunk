import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { FhGuildRankInfo } from './FootHoldModel';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-14 16:14:51
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/footHold/FHTopGuildItemCtrl")
export default class FHTopGuildItemCtrl extends UiListItem {

    @property(cc.Node)
    on: cc.Node = null;

    @property(cc.Node)
    off: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    rank1: cc.Node = null;

    @property(cc.Label)
    rank2: cc.Label = null;

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null;

    @property(cc.Label)
    numLab: cc.Label = null;

    @property(cc.Label)
    precentLab: cc.Label = null;

    @property(cc.Label)
    serverLab: cc.Label = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    _info: FhGuildRankInfo

    updateView() {
        this._info = this.data
        this.on.active = !!this._info
        this.off.active = !this._info
        if (this.on.active) {
            GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(this._info.data.bottom))
            GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(this._info.data.frame))
            GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this._info.data.icon))
            this.nameLab.string = `${this._info.data.name}`
            if (FootHoldUtils.isCrossWar) {
                this.serverLab.string = `[s${GlobalUtil.getSeverIdByGuildId(this._info.data.id)}]`
            } else {
                this.serverLab.string = ''
            }
            if (this._info.index <= 3) {
                this.rank1.active = true
                this.rank2.node.active = false
                GlobalUtil.setSpriteIcon(this.node, this.rank1, FootHoldUtils.getTop3RankIconPath(this._info.index))
            } else {
                this.rank1.active = false
                this.rank2.node.active = true
                this.rank2.string = `${this._info.index}`
            }
            this.proBar.progress = this._info.data.clearNum / FootHoldUtils.getTotalPointsCount()
            this.precentLab.string = `${(this._info.data.clearNum / FootHoldUtils.getTotalPointsCount() * 100).toFixed(1)}%`
            this.numLab.string = `${this._info.data.joinNum}`
        }
    }


}