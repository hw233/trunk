import FootHoldModel from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import { FhScoreRankInfo } from './GlobalFootHoldViewCtrl';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-14 15:40:03
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/footHold/FHScoreRankItemCtrl")
export default class FHScoreRankItemCtrl extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    serverLab: cc.Label = null;

    @property(cc.Label)
    scoreLab: cc.Label = null;

    @property(cc.Label)
    numLab: cc.Label = null;

    @property(cc.Node)
    allianceLab: cc.Node = null;

    _colorList = [cc.color("#FFFD61"), cc.color("#308C64"), cc.color("#CB4039"), cc.color("#E487E8")]
    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    updateViewInfo(info: icmsg.FootholdCoopGuild) {
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(info.guildInfo.bottom))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(info.guildInfo.frame))
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(info.guildInfo.icon))
        this.nameLab.string = `${info.guildInfo.name}`
        this.scoreLab.string = `${info.guildInfo.score}`
        this.numLab.string = `(${info.joinNum}+${info.coopNum})`

        let color = this._colorList[FootHoldUtils.getFHGuildColor(info.guildInfo.id) - 1]
        this.nameLab.node.color = color
        this.scoreLab.node.color = color

        if (FootHoldUtils.isCrossWar) {
            this.serverLab.node.active = true
            this.serverLab.string = `[s${GlobalUtil.getSeverIdByGuildId(info.guildInfo.id)}]`
        }

        if (this.footHoldModel.isGuessMode) {
            if (this.footHoldModel.maxAlliance.indexOf(info.guildInfo.id) != -1) {
                this.allianceLab.active = true
                this.allianceLab.color = cc.color("#3d8bf6")
            } else {
                if (this.footHoldModel.allianceNum == 2) {
                    this.allianceLab.active = true
                    this.allianceLab.color = cc.color("#df4844")
                }
            }
        } else {
            if (this.footHoldModel.myAlliance.length > 2) {
                if (this.footHoldModel.myAlliance.indexOf(info.guildInfo.id) != -1) {
                    this.allianceLab.active = true
                    this.allianceLab.color = cc.color("#3d8bf6")
                }
            }
            if (this.footHoldModel.myAlliance.length == 2) {
                if (this.footHoldModel.myAlliance.indexOf(info.guildInfo.id) != -1) {
                    this.allianceLab.active = true
                    this.allianceLab.color = cc.color("#3d8bf6")
                } else {
                    if (this.footHoldModel.allianceNum == 2) {
                        this.allianceLab.active = true
                        this.allianceLab.color = cc.color("#df4844")
                    }
                }
            }
            if (this.footHoldModel.myAlliance.length == 1) {
                if (this.footHoldModel.maxAlliance.indexOf(info.guildInfo.id) != -1) {
                    this.allianceLab.active = true
                    this.allianceLab.color = cc.color("#df4844")
                }
            }
        }
    }
}