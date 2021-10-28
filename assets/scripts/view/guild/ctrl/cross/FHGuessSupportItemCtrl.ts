import FootHoldModel from '../footHold/FootHoldModel';
import FootHoldUtils from '../footHold/FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-18 16:08:55
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cross/FHGuessSupportItemCtrl")
export default class FHGuessSupportItemCtrl extends cc.Component {

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    guildNameLab: cc.Label = null;

    @property(cc.Label)
    scoreLab: cc.Label = null;

    @property(cc.Label)
    playerNumLab: cc.Label = null;

    @property(cc.Label)
    votePercentLab: cc.Label = null;

    @property(cc.Node)
    supportIcon: cc.Node = null;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {

    }

    updateViewInfo(info: icmsg.FootholdGuessGuild) {
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(info.bottom))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(info.frame))
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(info.icon))
        this.guildNameLab.string = `${info.name}`
        this.scoreLab.string = `${info.score}`
        this.playerNumLab.string = `${info.votes}`
        this.votePercentLab.string = `${(info.votes * 100 / FootHoldUtils.getTotalVotes()).toFixed(2)}%`

        this.supportIcon.active = false
        if (this.footHoldModel.guessVotedId > 0 && this.footHoldModel.guessVotedId == info.id) {
            this.supportIcon.active = true
        }
    }
}