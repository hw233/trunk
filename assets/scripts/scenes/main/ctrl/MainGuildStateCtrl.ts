import FootHoldModel from '../../../view/guild/ctrl/footHold/FootHoldModel';
import FootHoldUtils from '../../../view/guild/ctrl/footHold/FootHoldUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainGuildStateCtrl")
export default class MainGuildStateCtrl extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    state1: cc.Node = null

    @property(cc.Node)
    state2: cc.Node = null

    @property(cc.Node)
    state3: cc.Node = null

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null

    @property(cc.Label)
    proLab: cc.Label = null

    @property(cc.Label)
    scoreLab: cc.Label = null

    @property(cc.Node)
    rank1: cc.Node = null

    @property(cc.Label)
    rank2: cc.Label = null

    get roleModel() { return ModelManager.get(RoleModel); }
    get footHoldModel() { return ModelManager.get(FootHoldModel); }

    onEnable() {
        NetManager.on(icmsg.FootholdRedPointsRsp.MsgType, this._refreshView, this)
        this._refreshView()
    }

    onDisable() {
        NetManager.off(icmsg.FootholdRedPointsRsp.MsgType, this._refreshView, this)
    }

    _refreshView() {
        if (this.roleModel.guildId > 0) {
            if (!FootHoldUtils.isGuildWarCanEnter()) {
                this.content.active = false
                return
            }
            if (this.footHoldModel.globalMapData) {
                this.content.active = true
                if (FootHoldUtils.isCrossWar) {
                    this.state1.active = false
                    this.state2.active = false
                    this.state3.active = true
                } else {
                    this.state1.active = false
                    this.state2.active = true
                    this.state3.active = false
                    let msg = new icmsg.FootholdMapRankingReq()
                    msg.warId = this.footHoldModel.globalMapData.warId
                    NetManager.send(msg, (data: icmsg.FootholdMapRankingRsp) => {
                        if (this.footHoldModel.fhTotalScore != 0) {
                            this.scoreLab.string = `${this.footHoldModel.fhTotalScore}`
                        } else {
                            this.scoreLab.string = `${data.score}`
                        }
                        if (data.rank <= 3) {
                            this.rank2.node.active = false
                            if (data.rank != 0) {
                                this.rank1.active = true
                                GlobalUtil.setSpriteIcon(this.node, this.rank1, FootHoldUtils.getTop3RankIconPath(data.rank))
                            } else {
                                this.rank1.active = false
                            }
                        } else {
                            this.rank1.active = false
                            this.rank2.node.active = true
                            this.rank2.string = `${data.rank}`
                        }
                    })
                }
                return
            }

            if (this.footHoldModel.guildMapData) {
                this.content.active = true
                this.state1.active = true
                this.state2.active = false
                this.state3.active = false
                let msg = new icmsg.FootholdMapProgressReq()
                msg.warId = this.footHoldModel.guildMapData.warId
                NetManager.send(msg, (data: icmsg.FootholdMapProgressRsp) => {
                    this.proBar.progress = data.clearNum / data.totalNum
                    this.proLab.string = `${(data.clearNum / data.totalNum * 100).toFixed(1)}%`
                })
            }
        } else {
            this.content.active = false
        }
    }
}