import ConfigManager from '../../../../../common/managers/ConfigManager';
import FHGatherReadyFightItemCtrl from './FHGatherReadyFightItemCtrl';
import FootHoldModel, { FhPointInfo } from '../FootHoldModel';
import FootHoldUtils from '../FootHoldUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import MathUtil from '../../../../../common/utils/MathUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import StringUtils from '../../../../../common/utils/StringUtils';
import { AskInfoType } from '../../../../../common/widgets/AskPanel';
import { Foothold_globalCfg } from '../../../../../a/config';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-25 10:49:45
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/gather/FHGatherReadyFightCtrl")
export default class FHGatherReadyFightCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollViewLeft: cc.ScrollView = null;

    @property(cc.Node)
    contentLeft: cc.Node = null;

    @property(cc.ScrollView)
    scrollViewRight: cc.ScrollView = null;

    @property(cc.Node)
    contentRight: cc.Node = null;

    @property([cc.Node])
    teamItems: cc.Node[] = []
    @property([cc.Node])
    enemyItems: cc.Node[] = []
    @property([cc.Node])
    turnBtns: cc.Node[] = []

    teamMates: icmsg.FootholdTeamFighter[] = []
    opponents: icmsg.FootholdTeamFighter[] = []

    _isFightOver: boolean = true //是否主动取消

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        let pos = this.footHoldModel.pointDetailInfo.pos
        let pointInfo: FhPointInfo = this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]

        this.footHoldModel.lastSelectPoint = pointInfo
        this.footHoldModel.fightPoint = pointInfo.fhPoint.pos

        let msg = new icmsg.FootholdGatherFightStartReq()
        msg.typ = this.footHoldModel.gatherFightType
        msg.pos = pos
        NetManager.send(msg, (data: icmsg.FootholdGatherFightStartRsp) => {
            this.teamMates = data.teammates
            this.opponents = data.opponents
            let maxLen = Math.max(this.teamMates.length, this.opponents.length)
            this.contentLeft.height = this.contentRight.height = maxLen > 3 ? 1280 : 740
            this.initTeamPlayerInfo()
            this.initEnemyPlayerInfo()
            this.initTurnBtns()
        }, this)
    }

    close() {
        if (this._isFightOver) {
            this._isFightOver = false
            let fightValue: icmsg.FootholdGatherFightValue = new icmsg.FootholdGatherFightValue()
            let msg = new icmsg.FootholdGatherFightOverReq()
            msg.index = -1
            msg.pos = this.footHoldModel.pointDetailInfo.pos
            msg.typ = this.footHoldModel.gatherFightType
            msg.damage = fightValue
            NetManager.send(msg, () => {
                this.footHoldModel.fightPoint = null
                super.close()
            }, this)
            return
        }
        super.close()
    }

    onScrollViewLeftScroll() {
        this.contentRight.y = this.contentLeft.y
    }

    onScrollViewRightScroll() {
        this.contentLeft.y = this.contentRight.y
    }

    initTurnBtns() {
        for (let i = 0; i < this.turnBtns.length; i++) {
            this.turnBtns[i].active = this.teamMates.length - 1 > i
        }
    }

    initTeamPlayerInfo() {
        this.teamItems.forEach((node, i) => {
            let ctrl = node.getComponent(FHGatherReadyFightItemCtrl);
            if (this.teamMates.length > i) {
                node.active = true;
                ctrl.data = { data: this.teamMates[i] }
                ctrl.updateView()
            } else {
                node.active = false;
            }

        })
    }

    initEnemyPlayerInfo() {
        this.enemyItems.forEach((node, i) => {
            let ctrl = node.getComponent(FHGatherReadyFightItemCtrl);
            if (this.opponents.length > i) {
                node.active = true;
                ctrl.data = { data: this.opponents[i] }
                ctrl.updateView()
            } else {
                node.active = false;
            }
        })
    }

    upDownBtnClick(event: Event, idx: string) {
        let index = parseInt(idx);
        if (index == 0) {
            let tem = this.teamMates[1]
            if (!tem) {
                return
            }
            this.teamMates[1] = this.teamMates[0];
            this.teamMates[0] = tem;
        } else if (index == 1) {
            let tem = this.teamMates[2]
            if (!tem) {
                return
            }
            this.teamMates[2] = this.teamMates[1];
            this.teamMates[1] = tem;
        } else if (index == 2) {
            let tem = this.teamMates[3]
            if (!tem) {
                return
            }
            this.teamMates[3] = this.teamMates[2];
            this.teamMates[2] = tem;
        } else if (index == 3) {
            let tem = this.teamMates[4]
            if (!tem) {
                return
            }
            this.teamMates[4] = this.teamMates[3];
            this.teamMates[3] = tem;
        }
        this.initTeamPlayerInfo()
    }

    onGatherMoreFunc() {
        this.close()
    }


    onFightFunc() {
        let gather_forces = ConfigManager.getItemById(Foothold_globalCfg, "gather_forces").value[0]
        if (this.teamMates.length < gather_forces) {
            let askInfo: AskInfoType = {
                sureCb: () => {
                    this._fightReq()
                },
                descText: StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP115"), gather_forces),//`集结部队不足${gather_forces}人,是否确定集火攻打？`,
                thisArg: this,
            }
            GlobalUtil.openAskPanel(askInfo)
        } else {
            this._fightReq()
        }

    }

    _fightReq() {
        if (this.teamMates.length == 0 || this.opponents.length == 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP116"))
            this.close()
            return
        }
        this.footHoldModel.gatherFightTeamMatesIndex = 0
        this.footHoldModel.gatherFightOpponetnsIndex = 0
        this.footHoldModel.gatherTeamMates = this.teamMates
        this.footHoldModel.gatherOpponents = this.opponents

        let pos = this.footHoldModel.pointDetailInfo.pos
        let pointInfo: FhPointInfo = this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]
        if (this.footHoldModel.gatherFightType == 1) {
            let targetPos = pointInfo.fhPoint.gather.targetPos
            pointInfo = this.footHoldModel.warPoints[`${targetPos.x}-${targetPos.y}`]
        }
        this._isFightOver = false
        let opponentInfo = this.footHoldModel.gatherOpponents[this.footHoldModel.gatherFightOpponetnsIndex]
        let o_player = new icmsg.ArenaPlayer()
        o_player.name = opponentInfo.name
        o_player.head = opponentInfo.head
        o_player.frame = opponentInfo.frame
        let power = 0
        opponentInfo.heroList.forEach(element => {
            power += element.heroPower
        })
        o_player.power = power
        JumpUtils.openPveArenaScene([0, 0, o_player], o_player.name, 'FOOTHOLD_GATHER');
        gdk.panel.hide(PanelId.FHGatherInviteView)
        gdk.panel.hide(PanelId.FHBattleArrayView)
        gdk.panel.hide(PanelId.FHPVPBattleReadyView)
        this.close();
    }

}