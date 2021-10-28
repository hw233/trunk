import ActUtil from '../util/ActUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import SiegeModel from '../../guild/ctrl/siege/SiegeModel';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/SiegeBtnCtrl")
export default class SiegeBtnCtrl extends cc.Component {

    @property(cc.Node)
    redPoint: cc.Node = null;

    @property(cc.ProgressBar)
    hpBar: cc.ProgressBar = null;

    @property(cc.Label)
    hpLab: cc.Label = null;

    get siegeModel() { return ModelManager.get(SiegeModel); }
    get roleModel() { return ModelManager.get(RoleModel); }

    onEnable() {

    }


    @gdk.binding("siegeModel.enterTimes")
    @gdk.binding("siegeModel.buyTimes")
    updateBtnState() {
        if (!this.node.active) {
            return
        }
        this.redPoint.active = this.siegeModel.canFightNum > 0
    }

    @gdk.binding("siegeModel.weekBlood")
    updateHP() {
        let hp = this.siegeModel.gateTotalHP - (this.siegeModel.curBossTotalHP * this.siegeModel.bossHpCheckDay - this.siegeModel.weekBlood)
        hp = hp >= 0 ? hp : 0
        this.hpBar.progress = hp / this.siegeModel.gateTotalHP
        this.hpLab.string = `x${hp}`
    }

    openFunc() {
        gdk.panel.open(PanelId.GuildMain)
    }


}