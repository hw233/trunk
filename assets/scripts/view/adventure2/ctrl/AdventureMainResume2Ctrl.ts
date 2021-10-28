import AdventureMainView2Ctrl from './AdventureMainView2Ctrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import PveGeneralModel from '../../pve/model/PveGeneralModel';
import StringUtils from '../../../common/utils/StringUtils';
import { Adventure_consumptionCfg, Adventure2_consumptionCfg, Adventure2_globalCfg } from '../../../a/config';
import { AskInfoType } from '../../../common/widgets/AskPanel';

/**
 * @Description: 探险事件--泉水回复
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-02 14:29:26
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdventureMainResume2Ctrl")
export default class AdventureMainResume2Ctrl extends gdk.BasePanel {

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

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }
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
        let blood = ConfigManager.getItemById(Adventure2_globalCfg, "commander_HP").value[0]
        let hpTxt = "";
        hpTxt = '0'.repeat(blood);
        this.hpLab.string = hpTxt
        this.desLab.string = gdk.i18n.t("i18n:NEW_ADVENTURE_TIP6")
    }

    @gdk.binding("adventureModel.consumption")
    updateCostLab() {
        let cfgs = ConfigManager.getItems(Adventure2_consumptionCfg)
        let useTime = this.adventureModel.normal_consumption
        let nextTime = useTime + 1
        if (nextTime > cfgs.length) {
            nextTime = cfgs.length
        }
        this._costCfg = ConfigManager.getItemById(Adventure2_consumptionCfg, nextTime)
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
        let cfgs = ConfigManager.getItems(Adventure2_consumptionCfg)
        if (this.adventureModel.normal_consumption >= cfgs.length) {
            gdk.gui.showMessage(`${gdk.i18n.t("i18n:ADVENTURE_TIP6")}`)
            return
        }

        if (this._costCfg.consumption && this._costCfg.consumption.length > 0) {
            if (!GlobalUtil.checkMoneyEnough(this._costCfg.consumption[1], this._costCfg.consumption[0], this, [PanelId.AdventureMainView2])) {
                return
            }
        }

        let blood = ConfigManager.getItemById(Adventure2_globalCfg, "commander_HP").value[0]
        if (this.adventureModel.normal_blood >= blood) {
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
        let msg = new icmsg.Adventure2ConsumptionReq()
        msg.difficulty = this.adventureModel.difficulty;
        this.adventureModel.showLastPlateIndex = this.adventureModel.normal_plateIndex;
        NetManager.send(msg, (data: icmsg.Adventure2ConsumptionRsp) => {

            gdk.panel.hide(PanelId.AdventureMainResume2)

            this.adventureModel.showEffect = true;


            this.adventureModel.isDie = true
            this.adventureModel.normal_blood = data.difficultyState.blood
            this.adventureModel.difficulty = data.difficultyState.difficulty
            this.adventureModel.normal_layerId = data.difficultyState.layerId
            this.adventureModel.normal_plateIndex = data.difficultyState.plateIndex
            this.adventureModel.normal_plateFinish = data.difficultyState.plateFinish
            this.adventureModel.normal_consumption = data.difficultyState.consumption
            this.adventureModel.normal_entryList = data.difficultyState.entryList
            this.adventureModel.fightTimes = data.difficultyState.clearTimes
            this.adventureModel.normal_lastPlate = data.difficultyState.lastPlate
            this.adventureModel.normal_historyPlate = data.difficultyState.historyPlate;
            this.adventureModel.normal_stageId = data.difficultyState.stageId

            this.adventureModel.normal_lastEntryList = data.difficultyState.lastEntryList;
            this.adventureModel.normal_lastPlates = data.difficultyState.lastPlates;
            this.adventureModel.normal_allPlates = data.difficultyState.allPlates;
            //this.adventureModel.normal_blood = data.blood
            //this.adventureModel.normal_consumption = data.consumption
            gdk.gui.showMessage(`${gdk.i18n.t("i18n:ADVENTURE_TIP9")}`)
            let curView = gdk.gui.getCurrentView()
            let ctrl = curView.getComponent(AdventureMainView2Ctrl)

            ctrl.refreshPoints()
        })
    }
}