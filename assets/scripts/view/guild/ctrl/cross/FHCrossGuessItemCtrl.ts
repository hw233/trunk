import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from '../footHold/FootHoldModel';
import FootHoldUtils from '../footHold/FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import { Foothold_globalCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-05 17:25:09
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cross/FHCrossGuessItemCtrl")
export default class FHCrossGuessItemCtrl extends cc.Component {

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
    priceLab: cc.Label = null;

    @property(cc.Node)
    winIcon: cc.Node = null;

    @property(cc.Node)
    btnGuess: cc.Node = null;

    @property(cc.Node)
    hasGuess: cc.Node = null;

    @property(cc.Node)
    moneyIcon: cc.Node = null;

    @property(cc.Label)
    guessMoneyLab: cc.Label = null;

    _info: icmsg.FootholdGuessGuild
    _selectDay: number = 0

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }


    onEnable() {

    }

    updateViewInfo(info: icmsg.FootholdGuessGuild, selectDay) {
        this._info = info
        this._selectDay = selectDay
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(info.bottom))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(info.frame))
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(info.icon))
        this.guildNameLab.node.color = cc.color(FootHoldUtils.getFHGuildColorStr(info.id))
        this.guildNameLab.string = `${info.name}`

        this.scoreLab.string = `${info.score}`

        let quiz_ratio = ConfigManager.getItemById(Foothold_globalCfg, "quiz_ratio").value
        let price = quiz_ratio[1] - Math.floor(info.votes / FootHoldUtils.getTotalVotes() * quiz_ratio[2])
        // if (this.roleModel.guildId == info.id) {
        //     price += quiz_ratio[0]
        // }
        this.priceLab.string = `${(price / 100).toFixed(2)}`

        this.btnGuess.active = false
        this.hasGuess.active = false
        this.winIcon.active = false
        //已经竞猜了
        if (this.footHoldModel.guessVotedId > 0) {
            if (this.footHoldModel.guessVotedId == info.id) {
                this.hasGuess.active = true
                let itemId = ConfigManager.getItemById(Foothold_globalCfg, "quiz_rewards").value[0]
                GlobalUtil.setSpriteIcon(this.node, this.moneyIcon, GlobalUtil.getIconById(itemId))
                this.guessMoneyLab.string = `${this.footHoldModel.guessVotedPoints}`
            }
        } else {
            if (!FootHoldUtils.isGuessEnd() && selectDay == FootHoldUtils.getCurGuessRound()) {
                this.btnGuess.active = true
            }
        }

        if (this.footHoldModel.guessWinnerId > 1 && this.footHoldModel.guessWinnerId == info.id) {
            this.winIcon.active = true
        }
    }

    onGuessFunc() {
        gdk.panel.setArgs(PanelId.FHGuessCheckView, this._info, this._selectDay)
        gdk.panel.open(PanelId.FHGuessCheckView)
    }
}