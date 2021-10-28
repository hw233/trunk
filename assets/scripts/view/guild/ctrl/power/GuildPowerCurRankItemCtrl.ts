import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import UiListItem from '../../../../common/widgets/UiListItem';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-24 14:36:10
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/power/GuildPowerCurRankItemCtrl")
export default class GuildPowerCurRankItemCtrl extends UiListItem {

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Label)
    guildNameLab: cc.Label = null;

    @property(cc.Label)
    numLab: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;


    _info: icmsg.GuildGatherRank

    updateView() {
        this._info = this.data
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this._info.guildIcon))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(this._info.guildFrame))
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(this._info.guildBottom))

        this.guildNameLab.string = this._info.guildName
        this.numLab.string = `${this._info.numberCount}`
        this.powerLab.string = `${this._info.totalPower}`
    }

}