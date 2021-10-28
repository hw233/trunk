import ConfigManager from '../../../../common/managers/ConfigManager';
import FHProduceItem2Ctrl from './FHProduceItem2Ctrl';
import FootHoldModel, { FhPointInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import { Foothold_pointCfg } from '../../../../a/config';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-19 17:52:07
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHOccupyViewCtrl")
export default class FHOccupyViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Node)
    pointIcon: cc.Node = null

    @property(cc.Node)
    produceItems: cc.Node[] = []

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    _pointInfo: FhPointInfo

    onEnable() {
        let args = this.args
        if (args && args.length > 0) {
            this._pointInfo = args[0]
            this.updateViewInfo()
        }
    }

    updateViewInfo() {
        let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_type", this.footHoldModel.curMapData.mapType, { point_type: this._pointInfo.type, world_level: this.footHoldModel.worldLevelIndex })
        let path = `view/guild/texture/icon/${pointCfg.resources}`
        GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
        this.lvLab.string = `${this._pointInfo.type}${gdk.i18n.t("i18n:FOOTHOLD_TIP3")}`
        let goods: icmsg.GoodsInfo[] = []
        let good = new icmsg.GoodsInfo()
        good.typeId = FootHoldUtils.BaseExpId
        good.num = pointCfg.base_exp
        goods.push(good)
        for (let j = 0; j < pointCfg.output_reward.length; j++) {
            let good = new icmsg.GoodsInfo()
            good.typeId = pointCfg.output_reward[j][0]
            good.num = pointCfg.output_reward[j][1]
            goods.push(good)
        }
        for (let i = 0; i < this.produceItems.length; i++) {
            this.produceItems[i].active = false
            if (goods[i]) {
                this.produceItems[i].active = true
                let ctrl = this.produceItems[i].getComponent(FHProduceItem2Ctrl)
                ctrl.updateViewInfo(goods[i].typeId, goods[i].num)
            }
        }
    }

    occupyFunc() {
        //同公会无归属的直接占领
        let msg = new icmsg.FootholdCatchUpReq()
        msg.warId = this.footHoldModel.curMapData.warId
        msg.pos = this._pointInfo.fhPoint.pos
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP14"))
            gdk.panel.hide(PanelId.FHOccupyView)
        }, this)
    }
}