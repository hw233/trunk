import ConfigManager from '../../../common/managers/ConfigManager';
import DiamondFlyCtrl from '../../../common/widgets/DiamondFlyCtrl';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import PveGeneralModel from '../../pve/model/PveGeneralModel';
import StringUtils from '../../../common/utils/StringUtils';
import { Adventure_globalCfg } from '../../../a/config';



const { ccclass, property, menu } = cc._decorator;
/**
 * @Description: 指挥官
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-18 15:28:12
 */
@ccclass
@menu("qszc/view/adventure2/AdventureGeneral2Ctrl")
export default class AdventureGeneral2Ctrl extends cc.Component {

    @property(sp.Skeleton)
    playerSpine: sp.Skeleton = null

    @property(cc.Label)
    hpLab: cc.Label = null;

    @property(sp.Skeleton)
    reviveSpine: sp.Skeleton = null

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    onEnable() {
        let spineName = ModelManager.get(PveGeneralModel).skin;
        let url = StringUtils.format("spine/hero/{0}/1/{0}", spineName);
        this.playerSpine.node.scale = ConfigManager.getItemById(Adventure_globalCfg, "commander_scale").value[0] / 100
        let blood = this.adventureModel.copyType == 0 ? this.adventureModel.normal_blood : 1;
        if (blood == 0) {
            GlobalUtil.setSpineData(this.node, this.playerSpine, url, true, "die_s", false, true);
        } else {
            GlobalUtil.setSpineData(this.node, this.playerSpine, url, true, "stand_s", true, true);
        }
        this.updateHp()

        gdk.Timer.once(500, this, this.flyScoreFunc)
    }

    onDisable() {
        gdk.Timer.clearAll(this)
    }

    @gdk.binding("adventureModel.normal_blood")
    updateHp() {
        let hpTxt = "";
        let blood = this.adventureModel.copyType == 0 ? this.adventureModel.normal_blood : 1;
        hpTxt = '0'.repeat(blood);
        this.hpLab.string = hpTxt
        if (blood > 0) {
            if (this.adventureModel.isDie) {
                this.adventureModel.isDie = false
                this.reviveSpine.node.active = true
                this.reviveSpine.setAnimation(0, "hit", false)
                this.reviveSpine.setCompleteListener(() => {
                    this.reviveSpine.node.active = false
                    this.playerSpine.setAnimation(0, "stand_s", true)
                })
            } else {
                this.playerSpine.setAnimation(0, "stand_s", true)
            }
        }
    }

    dieClick() {
        let blood = this.adventureModel.copyType == 0 ? this.adventureModel.normal_blood : 1;
        if (blood == 0) {
            gdk.panel.open(PanelId.AdventureGeneralDieTip2)
        }
    }

    flyScoreFunc() {
        // if (this.adventureModel.isFlyScore) {
        //     this.adventureModel.isFlyScore = false
        //     let ctrl = this.node.getComponent(DiamondFlyCtrl)
        //     let dsz = cc.view.getVisibleSize();
        //     let endPos = cc.v2(300, -dsz.height / 2 + 50)
        //     ctrl.flyAction(endPos)
        //     gdk.Timer.once(1000, this, () => {
        //         AdventureUtils.setGuideStep(210013)
        //     })
        // }

        if (this.adventureModel.isFlyPassScore) {
            this.adventureModel.isFlyPassScore = false
            let ctrl = this.playerSpine.node.getComponent(DiamondFlyCtrl)
            let dsz = cc.view.getVisibleSize();
            let endPos = cc.v2(270, dsz.height / 2 - 250)
            ctrl.flyAction(endPos)
        }
    }
}