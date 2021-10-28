import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from '../footHold/FootHoldModel';
import FootHoldUtils from '../footHold/FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MilitaryRankUtils from './MilitaryRankUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import StringUtils from '../../../../common/utils/StringUtils';
import { MRPrivilegeType } from './MilitaryRankViewCtrl';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-02-20 16:26:52
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/militaryRank/MilitaryRankGetEngergyCtrl")
export default class MilitaryRankGetEngergyCtrl extends gdk.BasePanel {

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Label)
    MRNameLab: cc.Label = null

    @property(cc.RichText)
    tipLab1: cc.RichText = null

    @property(cc.RichText)
    tipLab2: cc.RichText = null


    get footholdModel() { return ModelManager.get(FootHoldModel); }

    onEnable() {
        this._updateViewInfo()
    }


    _updateViewInfo() {
        let lv = ModelManager.get(FootHoldModel).militaryRankLv
        this.MRNameLab.string = `${MilitaryRankUtils.getName(lv)}`
        GlobalUtil.setSpriteIcon(this.node, this.icon, MilitaryRankUtils.getIcon(lv))
        let freeEnergyNum = MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p2, this.footholdModel.militaryRankLv)
        this.tipLab1.string = StringUtils.format(gdk.i18n.t("i18n:MILITARY_TIP1"), MilitaryRankUtils.getName(lv), freeEnergyNum)//`提升至${MilitaryRankUtils.getName(lv)}每日可领取<color=#00ff00>${freeEnergyNum}</c>点体力`
        this.tipLab2.string = StringUtils.format(gdk.i18n.t("i18n:MILITARY_TIP2"), freeEnergyNum - this.footholdModel.freeEnergy)//`今日剩余<color=#00ff00>${freeEnergyNum - this.footholdModel.freeEnergy}</c>点体力`
        if (this.footholdModel.freeEnergy >= freeEnergyNum) {
            this.close()
        }
    }


    onGetFunc() {
        if (this.footholdModel.energy >= FootHoldUtils.getInitEnergyValue()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:MILITARY_TIP3"))
            return
        }
        let msg = new icmsg.FootholdFreeEnergyReq()
        msg.isAll = false
        NetManager.send(msg, (data: icmsg.FootholdFreeEnergyRsp) => {
            this.footholdModel.freeEnergy = data.freeEnergy
            this.footholdModel.energy = data.energy
            this._updateViewInfo()
            gdk.gui.showMessage(gdk.i18n.t("i18n:MILITARY_TIP4"))
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
        }, this)
    }

    onOneKeyGetFunc() {
        let msg = new icmsg.FootholdFreeEnergyReq()
        msg.isAll = true
        NetManager.send(msg, (data: icmsg.FootholdFreeEnergyRsp) => {
            this.footholdModel.freeEnergy = data.freeEnergy
            this.footholdModel.energy = data.energy
            this._updateViewInfo()
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
        }, this)
    }
}