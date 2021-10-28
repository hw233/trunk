import ConfigManager from '../../../../common/managers/ConfigManager';
import FHProduceItem2Ctrl from './FHProduceItem2Ctrl';
import FootHoldModel, { FhPointInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { Foothold_pointCfg } from '../../../../a/config';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-19 17:52:44
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHPVPBattlePreViewCtrl")
export default class FHPVPBattlePreViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Node)
    pointIcon: cc.Node = null

    @property(cc.Node)
    produceItems: cc.Node[] = []

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        this._updataPreView()
    }

    _updataPreView() {
        let info = this.footHoldModel.pointDetailInfo
        let fhPointInfo: FhPointInfo = this.footHoldModel.warPoints[`${info.pos.x}-${info.pos.y}`]

        let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_type", this.footHoldModel.curMapData.mapType, { point_type: fhPointInfo.type, world_level: this.footHoldModel.worldLevelIndex })
        let path = `view/guild/texture/icon/${pointCfg.resources}`
        GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
        this.lvLab.string = `${fhPointInfo.type} ${gdk.i18n.t("i18n:FOOTHOLD_TIP3")}`

        let msg = new icmsg.FootholdListOutputReq()
        msg.warId = this.footHoldModel.curMapData.warId
        msg.pos = info.pos
        NetManager.send(msg, (data: icmsg.FootholdListOutputRsp) => {
            let goods = FootHoldUtils.getResultReward(data.list[0].exp, data.list[0].items)
            for (let i = 0; i < this.produceItems.length; i++) {
                this.produceItems[i].active = false
                if (goods[i]) {
                    this.produceItems[i].active = true
                    let ctrl = this.produceItems[i].getComponent(FHProduceItem2Ctrl)
                    ctrl.updateViewInfo(goods[i].typeId, goods[i].num)
                }
            }
        }, this)
    }
}