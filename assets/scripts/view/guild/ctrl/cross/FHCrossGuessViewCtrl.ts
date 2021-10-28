import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import FHCrossGuessItemCtrl from './FHCrossGuessItemCtrl';
import FootHoldModel from '../footHold/FootHoldModel';
import FootHoldUtils from '../footHold/FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import ServerModel from '../../../../common/models/ServerModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { BagEvent } from '../../../bag/enum/BagEvent';
import { Foothold_globalCfg, Foothold_quizCfg, TipsCfg } from '../../../../a/config';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-11 14:42:41
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cross/FHCrossGuessViewCtrl")
export default class FHCrossGuessViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Node)
    moneyIcon: cc.Node = null;

    @property(cc.Label)
    moneyLab: cc.Label = null;

    @property(cc.Node)
    guessNode: cc.Node = null;

    @property(cc.Node)
    guessItem: cc.Node = null;

    @property(cc.Node)
    guessIcon: cc.Node = null;

    @property(cc.RichText)
    guessDesLab: cc.RichText = null;

    @property(cc.Label)
    tipLab: cc.Label = null;

    @property(cc.Node)
    btnGet: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    btns: cc.Node[] = [];

    @property(cc.Node)
    giftGetState: cc.Node = null;

    @property(cc.Node)
    giftRedPoint: cc.Node = null;

    _selectDay = 0
    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    _guessData: any = {}//day---{id:xx,point:xx}

    onEnable() {
        NetManager.on(icmsg.FootholdGuessQueryRsp.MsgType, this._onFootholdGuessQueryRsp, this)
        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateGuessScore, this)
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateGuessScore, this)
        gdk.e.on(RedPointEvent.RED_POINT_STATUS_UPDATE, this._updateTabs, this)

        let curRound = FootHoldUtils.getCurGuessRound()
        if (curRound > FootHoldUtils.getGuessTabDatas().length) {
            curRound = FootHoldUtils.getGuessTabDatas().length
        }
        this.selectTab(null, curRound)
        if (curRound >= 5) {
            this.scrollView.setContentPosition(cc.v2(-(curRound - 3) * 140, 0))
        }
        this._updateGuessScore()
    }

    onDisable() {
        NetManager.targetOff(this)
        this._clearEndTimer()
        gdk.e.targetOff(this)
    }

    _onFootholdGuessQueryRsp(data: icmsg.FootholdGuessQueryRsp) {
        this.footHoldModel.guessType = data.guessType
        this.footHoldModel.guessVotedId = data.votedId
        this.footHoldModel.guessVotedPoints = data.votedPoints
        this.footHoldModel.guessWinnerId = data.winnerId
        this.footHoldModel.guessGuilds = data.guilds
        this._guessData[this._selectDay] = { id: data.votedId, points: data.votedPoints }
        this._updateViewInfo()
    }

    _updateViewInfo() {
        this.guessNode.removeAllChildren()
        let datas = this.footHoldModel.guessGuilds
        for (let i = 0; i < datas.length; i++) {
            let item = cc.instantiate(this.guessItem)
            item.active = true
            this.guessNode.addChild(item)
            let ctrl = item.getComponent(FHCrossGuessItemCtrl)
            ctrl.updateViewInfo(datas[i], this._selectDay)
        }
        //更新内容
        let quizCfg = ConfigManager.getItemById(Foothold_quizCfg, this.footHoldModel.guessType)
        GlobalUtil.setSpriteIcon(this.node, this.guessIcon, `view/guild/texture/bg/footHold/crossGuessIcon/${quizCfg.icon}`)
        let str = quizCfg.desc
        if (quizCfg.number == 2) {
            for (let i = 0; i < quizCfg.number; i++) {
                str = str.replace("%s", `<color=${FootHoldUtils.getFHGuildColorStr(datas[i].id)}>${datas[i].name}</c>`)
            }
        }
        this.guessDesLab.string = StringUtils.setRichtOutLine(`${StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP58"), this._selectDay)}${str}`, "#753300", 2)

        this._createEndTime()
        this._updateBtnState()
        this._updateTabs()

        this.tipLab.string = ``
        if (this.footHoldModel.guessWinnerId == 1) {
            //本轮没有结果
            let tipCfg = ConfigManager.getItemById(TipsCfg, 92)
            this.tipLab.string = `${tipCfg.desc21}`
        }
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    _updateBtnState() {
        this.btnGet.active = false
        if (!FootHoldUtils.isGuessEnd() && this._selectDay == FootHoldUtils.getCurGuessRound()) {
            this.btnGet.active = false
        } else {
            let hasReward = Boolean(this.footHoldModel.guessRewarded & Math.pow(2, this._selectDay))
            if (this.footHoldModel.guessVotedPoints > 0 && (this.footHoldModel.guessVotedId == this.footHoldModel.guessWinnerId || this.footHoldModel.guessWinnerId == 1)) {
                this.btnGet.active = true
                GlobalUtil.setGrayState(this.btnGet, 0)
                if (hasReward) {
                    GlobalUtil.setGrayState(this.btnGet, 1)
                }
            } else {
                this.btnGet.active = false
            }
        }
        let isGiftGet = Boolean(this.footHoldModel.guessRewarded & Math.pow(2, this._selectDay + 15))
        this.giftGetState.active = isGiftGet
        this.giftRedPoint.active = !Boolean(this.footHoldModel.guessRewarded & Math.pow(2, this._selectDay + 15))
    }

    _updateTabs() {
        for (let i = 0; i < this.btns.length; i++) {
            this.btns[i].active = false
        }
        let curRound = FootHoldUtils.getCurGuessRound()
        let tabs = FootHoldUtils.getGuessTabDatas()

        for (let i = 0; i < tabs.length; i++) {
            this.btns[i].active = true
            let s_lab = cc.find("select/lab", this.btns[i]).getComponent(cc.Label)
            let n_lab = cc.find("normal/lab", this.btns[i]).getComponent(cc.Label)
            let str = gdk.i18n.t("i18n:FOOTHOLD_TIP59")//'可竞猜'
            if (tabs[i] > curRound) {
                str = gdk.i18n.t("i18n:FOOTHOLD_TIP60")//"未开始"
            } else if (tabs[i] < curRound) {
                if (tabs[i] + 1 == curRound) {
                    //上一轮的按钮
                    let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
                    let zeroTime = TimerUtils.getZerohour(curTime)
                    let cfgTime = ConfigManager.getItemById(Foothold_globalCfg, "quiz_time").value[1]
                    let rewardEndTime = zeroTime + cfgTime * 3600 + 86400
                    if (rewardEndTime - curTime > 0) {
                        str = gdk.i18n.t("i18n:FOOTHOLD_TIP90")//"进行中"
                    }
                } else {
                    str = gdk.i18n.t("i18n:FOOTHOLD_TIP61")//"已结束"
                }
            } else {
                if (!FootHoldUtils.isGuessStart()) {
                    str = gdk.i18n.t("i18n:FOOTHOLD_TIP60")//"未开始"
                } else {
                    if (FootHoldUtils.isGuessEnd()) {
                        str = gdk.i18n.t("i18n:FOOTHOLD_TIP61")//"已结束"
                    }
                }
            }
            s_lab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP62"), tabs[i], str)//`第${tabs[i]}轮\n${str}`
            n_lab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP62"), tabs[i], str)//`第${tabs[i]}轮\n${str}`


            //红点状态
            let redPoint = this.btns[i].getChildByName("redPoint")
            redPoint.active = false
            let hasRed = Boolean(this.footHoldModel.guessRedPoints & Math.pow(2, tabs[i]))
            let hasGet = Boolean(this.footHoldModel.guessRewarded & Math.pow(2, tabs[i]))
            if (hasRed && i + 1 <= curRound) {
                if (!hasGet) {
                    redPoint.active = true
                }
            }

            let dailyHasRed = Boolean(this.footHoldModel.guessRedPoints & Math.pow(2, tabs[i] + 15))
            let dailyHasGet = Boolean(this.footHoldModel.guessRewarded & Math.pow(2, tabs[i] + 15))
            if (dailyHasRed && i + 1 <= curRound) {
                if (!dailyHasGet) {
                    redPoint.active = true
                }
            }
            if (curRound == i + 1) {
                if (FootHoldUtils.isGuessStart() && !FootHoldUtils.isGuessEnd()
                    && (this._guessData[curRound] && this._guessData[curRound].id == 0 && this._guessData[curRound].points == 0)) {
                    redPoint.active = true
                }
            }
        }
    }

    selectTab(e, utype) {
        utype = parseInt(utype)
        let curRound = FootHoldUtils.getCurGuessRound()
        if (utype > curRound) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP63"))
            return
        }
        this._selectDay = utype
        for (let i = 0; i < this.btns.length; i++) {
            let node = this.btns[i]
            let btn = node.getComponent(cc.Button)
            btn.interactable = utype != i + 1
            let select = node.getChildByName("select")
            let normal = node.getChildByName("normal")
            select.active = utype == i + 1
            normal.active = utype != i + 1
        }

        let msg = new icmsg.FootholdGuessQueryReq()
        msg.day = this._selectDay
        NetManager.send(msg)
    }

    onGetFunc() {
        let msg = new icmsg.FootholdGuessRewardReq()
        msg.type = 2
        msg.day = this._selectDay
        NetManager.send(msg, (data: icmsg.FootholdGuessRewardRsp) => {
            this.footHoldModel.guessRewarded += Math.pow(2, this._selectDay)
            this._updateBtnState()
            this._updateTabs()
            GlobalUtil.openRewadrView(data.list)
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
        }, this)
    }

    onDailyGetFunc() {
        let msg = new icmsg.FootholdGuessRewardReq()
        msg.type = 1
        msg.day = this._selectDay
        NetManager.send(msg, (data: icmsg.FootholdGuessRewardRsp) => {
            this.footHoldModel.guessRewarded += Math.pow(2, this._selectDay + 15)
            this._updateBtnState()
            this._updateTabs()
            GlobalUtil.openRewadrView(data.list)
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
        }, this)
    }

    onSupportFunc() {
        gdk.panel.setArgs(PanelId.FHGuessSupport, this._selectDay)
        gdk.panel.open(PanelId.FHGuessSupport)
    }

    _createEndTime() {
        this._updateEndTime()
        this._clearEndTimer()
        this.schedule(this._updateEndTime, 1)
    }

    _updateEndTime() {
        let curRound = FootHoldUtils.getCurGuessRound()
        if (this._selectDay + 1 < curRound) {
            this.timeLab.node.color = cc.color("#e5ad78")
            this.timeLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP64")
            this._clearEndTimer()
            return
        }

        if (!FootHoldUtils.isGuessStart()) {
            this.timeLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP60")
            return
        }
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let zeroTime = TimerUtils.getZerohour(curTime)
        let cfgTime = ConfigManager.getItemById(Foothold_globalCfg, "quiz_time").value[1]
        let guessEndTime = zeroTime + cfgTime * 3600 - (this._selectDay + 1 == curRound ? 86400 : 0)
        let resultEndTime = zeroTime + cfgTime * 3600 + (this._selectDay == curRound ? 86400 : 0)
        if (resultEndTime - curTime < 0) {
            this._clearEndTimer()
            this.timeLab.node.color = cc.color("#e5ad78")
            this.timeLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP64")
        } else if (resultEndTime - curTime == 0) {
            //到点更新 前一轮状态
            this.footHoldModel.guessRedPoints += Math.pow(2, curRound)
            gdk.Timer.callLater(this, () => {
                let msg = new icmsg.FootholdGuessQueryReq()
                msg.day = curRound
                NetManager.send(msg)
            })
        } else {
            if (guessEndTime - curTime > 0) {
                this.timeLab.node.color = cc.color("#41F1E9")
                this.timeLab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP65"), TimerUtils.format4(Math.floor(guessEndTime - curTime)))//`${TimerUtils.format4(Math.floor(endTime - curTime))}后结束`
            } else {
                this.timeLab.node.color = cc.color("#00ff00")
                this.timeLab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP89"), TimerUtils.format4(Math.floor(resultEndTime - curTime)))//`${TimerUtils.format4(Math.floor(endTime - curTime))}后结束`
            }

        }
    }

    _clearEndTimer() {
        this.unschedule(this._updateEndTime)
    }

    _updateGuessScore() {
        let itemId = ConfigManager.getItemById(Foothold_globalCfg, "quiz_rewards").value[0]
        GlobalUtil.setSpriteIcon(this.node, this.moneyIcon, GlobalUtil.getIconById(itemId))
        this.moneyLab.string = `${BagUtils.getItemNumById(itemId)}`
    }
}