import AdventureMainView2Ctrl from './AdventureMainView2Ctrl';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Adventure2_adventureCfg, Adventure2_globalCfg, Copy_stageCfg } from '../../../a/config';
/**
 * @Description: 探险事件--关卡挑战
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-25 20:46:32
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdvPlateStagePanel2Ctrl")
export default class AdvPlateStagePanel2Ctrl extends gdk.BasePanel {

    @property(cc.Label)
    stageLab: cc.Label = null

    @property(cc.Label)
    powerLab: cc.Label = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    soltItem: cc.Prefab = null

    @property(cc.Node)
    difficultNode: cc.Node = null

    _advCfg: Adventure2_adventureCfg
    _stageCfg: Copy_stageCfg

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    difficulty: number;
    layerId: number;
    selectIndex: number
    onEnable() {
        this._updateViewInfo()
    }

    onDisable() {

    }

    _updateViewInfo() {
        this.difficulty = this.adventureModel.copyType == 0 ? this.adventureModel.difficulty : 4;
        this.layerId = this.adventureModel.copyType == 0 ? this.adventureModel.normal_layerId : this.adventureModel.endLessState.layerId;
        this.selectIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_selectIndex : this.adventureModel.endless_selectIndex
        if (this.adventureModel.copyType == 0) {
            this._advCfg = ConfigManager.getItemByField(Adventure2_adventureCfg, "difficulty", this.difficulty, { layer_id: this.layerId, plate: this.selectIndex })
        } else {
            this._advCfg = ConfigManager.getItemByField(Adventure2_adventureCfg, "difficulty", this.difficulty, { layer_id: this.layerId, plate: this.selectIndex, line: this.adventureModel.endless_line })
        }
        //this._stageCfg = ConfigManager.getItemById(Copy_stageCfg, this._advCfg.event_id)
        this.stageLab.string = `${this._advCfg.event_show}`
        this.powerLab.string = this.adventureModel.copyType == 0 ? '' : this._advCfg.power + ''//`${this._stageCfg.power}`
        let items = this._advCfg.rewards
        for (let i = 0; i < items.length; i++) {
            let showItem = cc.instantiate(this.soltItem)
            let ctrl = showItem.getComponent(UiSlotItem)
            ctrl.updateItemInfo(items[i][0], items[i][1])
            ctrl.itemInfo = {
                series: null,
                itemId: items[i][0],
                itemNum: items[i][1],
                type: BagUtils.getItemTypeById(items[i][0]),
                extInfo: null,
            }
            this.content.addChild(showItem)
        }

        if (this.difficulty == 4 && items.length == 0) {
            this.difficultNode.active = true
        }
    }

    fightFunc() {
        let blood = this.adventureModel.copyType == 0 ? this.adventureModel.normal_blood : 1;
        if (blood <= 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:ADVENTURE_TIP17"))
            return
        }


        if (this.adventureModel.copyType == 0) {
            if (this.adventureModel.normal_plateIndex == this.selectIndex && this.adventureModel.normal_stageId > 0) {
                gdk.panel.hide(PanelId.AdvPlateStagePanel2)
                gdk.panel.setArgs(PanelId.AdventureSetUpHeroSelector2, [true])
                gdk.panel.open(PanelId.AdventureSetUpHeroSelector2);
                return;
            }
        } else {
            if (this.adventureModel.endless_plateIndex == this.selectIndex && this.adventureModel.endless_stageId > 0) {

                //判断战力
                let temPower = ModelManager.get(RoleModel).power;
                let num = ConfigManager.getItemByField(Adventure2_globalCfg, 'key', 'endless_sweep_power').value[0] / 100;
                //let stageCfg = ConfigManager.getItemByField(Copy_stageCfg, 'id', this.adventureModel.endless_stageId)
                if (temPower >= this._advCfg.power * num) {
                    //显示扫荡界面
                    gdk.panel.open(PanelId.AdventureRaidTip2);
                } else {
                    gdk.panel.setArgs(PanelId.NewAdventureSetUpHeroSelector, [true])
                    gdk.panel.open(PanelId.NewAdventureSetUpHeroSelector);
                }
                gdk.panel.hide(PanelId.AdvPlateStagePanel2)
                return;
            }
        }

        //
        let plateIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_plateIndex : this.adventureModel.endless_plateIndex
        let msg = new icmsg.Adventure2PlateEnterReq()
        msg.difficulty = this.difficulty;
        msg.plateIndex = this.selectIndex;

        NetManager.send(msg, (data: icmsg.Adventure2PlateEnterRsp) => {
            if (this.adventureModel.copyType == 0) {
                this.adventureModel.normal_lastPlate = plateIndex
                this.adventureModel.normal_plateIndex = data.plateIndex
                this.adventureModel.normal_plateFinish = false
                this.adventureModel.normal_stageId = data.stageId
                gdk.panel.setArgs(PanelId.AdventureSetUpHeroSelector2, [true])
                gdk.panel.open(PanelId.AdventureSetUpHeroSelector2);
                gdk.panel.hide(PanelId.AdvPlateStagePanel2)
            } else {
                this.adventureModel.endless_lastPlate = plateIndex
                this.adventureModel.endless_plateIndex = data.plateIndex
                this.adventureModel.endless_plateFinish = false
                this.adventureModel.endless_stageId = data.stageId

                //判断战力
                let temPower = ModelManager.get(RoleModel).power;
                let num = ConfigManager.getItemByField(Adventure2_globalCfg, 'key', 'endless_sweep_power').value[0] / 100
                //let stageCfg = ConfigManager.getItemByField(Copy_stageCfg, 'id', data.stageId)
                if (temPower >= this._advCfg.power * num) {
                    //显示扫荡界面
                    gdk.panel.open(PanelId.AdventureRaidTip2);
                } else {
                    gdk.panel.setArgs(PanelId.NewAdventureSetUpHeroSelector, [true])
                    gdk.panel.open(PanelId.NewAdventureSetUpHeroSelector);
                }
                gdk.panel.hide(PanelId.AdvPlateStagePanel2)
            }

            let curView = gdk.gui.getCurrentView()
            if (this.adventureModel.copyType == 0) {
                let ctrl = curView.getComponent(AdventureMainView2Ctrl)
                ctrl.refreshPoints()
            }
            //  else {
            //     let ctrl = curView.getComponent(NewAdventureMainViewCtrl)
            //     ctrl.refreshPoints()
            // }
        })

    }

    /* 排行*/
    openRank() {
        gdk.panel.open(PanelId.AdventureRankView)
    }
}