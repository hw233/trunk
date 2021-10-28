import AdventureModel from '../model/AdventureModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import PveGeneralModel from '../../pve/model/PveGeneralModel';
import StringUtils from '../../../common/utils/StringUtils';
import { Adventure_consumptionCfg, Adventure_globalCfg } from '../../../a/config';
import { AskInfoType } from '../../../common/widgets/AskPanel';
/**
 * @Description: 探险事件--泉水回复
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 12:06:15
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdventureMainResumeCtrl")
export default class AdventureMainResumeCtrl extends gdk.BasePanel {

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Node)
    tipNode: cc.Node = null;

    @property(cc.Label)
    hpLab: cc.Label = null;

    @property(cc.Label)
    desLab: cc.Label = null;

    @property(sp.Skeleton)
    playerSpine: sp.Skeleton = null

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }
    _costCfg: Adventure_consumptionCfg

    onEnable() {
        let spineName = ModelManager.get(PveGeneralModel).skin;
        let url = StringUtils.format("spine/hero/{0}/1/{0}", spineName);
        this.playerSpine.node.scale = 0.4
        GlobalUtil.setSpineData(this.node, this.playerSpine, url, true, "stand_s", true, true);
        this.updateHp()
        this.updateCostLab()
    }

    onDisable() {

    }


    @gdk.binding("adventureModel.blood")
    updateHp() {
        let blood = ConfigManager.getItemById(Adventure_globalCfg, "commander_HP").value[0]
        let hpTxt = "";
        hpTxt = '0'.repeat(blood);
        this.hpLab.string = hpTxt
        this.desLab.string = StringUtils.format(gdk.i18n.t("i18n:ADVENTURE_TIP5"), blood)
    }

    @gdk.binding("adventureModel.consumption")
    updateCostLab() {
        let cfgs = ConfigManager.getItems(Adventure_consumptionCfg)
        let useTime = this.adventureModel.consumption
        let nextTime = useTime + 1
        if (nextTime > cfgs.length) {
            nextTime = cfgs.length
        }
        this._costCfg = ConfigManager.getItemById(Adventure_consumptionCfg, nextTime)
        if (this._costCfg.consumption && this._costCfg.consumption.length > 0) {
            this.costNode.active = true
            this.tipNode.active = false
            let icon = this.costNode.getChildByName("icon")
            let costLab = this.costNode.getChildByName("costLab").getComponent(cc.Label)
            GlobalUtil.setSpriteIcon(this.costNode, icon, GlobalUtil.getSmallMoneyIcon(this._costCfg.consumption[0]))
            costLab.string = `${this._costCfg.consumption[1]}`
            if (useTime >= cfgs.length) {
                this.costNode.active = false
                this.tipNode.active = true
                this.tipNode.getComponent(cc.Label).string = `${gdk.i18n.t("i18n:ADVENTURE_TIP6")}`
            }
        } else {
            this.costNode.active = false
            this.tipNode.active = true
        }
    }

    useFunc() {
        let cfgs = ConfigManager.getItems(Adventure_consumptionCfg)
        if (this.adventureModel.consumption >= cfgs.length) {
            gdk.gui.showMessage(`${gdk.i18n.t("i18n:ADVENTURE_TIP6")}`)
            return
        }

        if (this._costCfg.consumption && this._costCfg.consumption.length > 0) {
            if (!GlobalUtil.checkMoneyEnough(this._costCfg.consumption[1], this._costCfg.consumption[0], this, [PanelId.AdventureMainView])) {
                return
            }
        }

        let blood = ConfigManager.getItemById(Adventure_globalCfg, "commander_HP").value[0]
        if (this.adventureModel.blood >= blood) {
            let info: AskInfoType = {
                title: `${gdk.i18n.t("i18n:ADVENTURE_TIP8")}`,
                sureCb: () => {
                    this._reqFunc()
                },
                descText: `${gdk.i18n.t("i18n:ADVENTURE_TIP7")}`,
                thisArg: this,
            }
            GlobalUtil.openAskPanel(info)
        } else {
            this._reqFunc()
        }
    }

    _reqFunc() {
        let msg = new icmsg.AdventureConsumptionReq()
        NetManager.send(msg, (data: icmsg.AdventureConsumptionRsp) => {
            gdk.panel.hide(PanelId.AdventureMainResume)
            this.adventureModel.isDie = true
            this.adventureModel.blood = data.blood
            this.adventureModel.consumption = data.consumption
            gdk.gui.showMessage(`${gdk.i18n.t("i18n:ADVENTURE_TIP9")}`)
        })
    }
}