import ModelManager from '../../../../common/managers/ModelManager';
import SiegeModel from './SiegeModel';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-02-02 21:09:00
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/siege/SiegeMonsterCtrl")
export default class SiegeMonsterCtrl extends cc.Component {

    @property(cc.ProgressBar)
    hpBar: cc.ProgressBar = null;

    @property(cc.Node)
    redPoint: cc.Node = null;


    @property(cc.Label)
    hpLab: cc.Label = null;

    get siegeModel() { return ModelManager.get(SiegeModel); }

    onEnable() {
        this.updateHP()
    }

    @gdk.binding("siegeModel.todayBlood")
    updateHP() {
        let hp = this.siegeModel.curBossTotalHP - this.siegeModel.todayBlood
        hp = hp >= 0 ? hp : 0
        this.hpBar.progress = hp / this.siegeModel.curBossTotalHP
        this.hpLab.string = `${hp}`
    }

    @gdk.binding("siegeModel.enterTimes")
    @gdk.binding("siegeModel.buyTimes")
    updateBtnState() {
        if (!this.node.active) {
            return
        }
        this.redPoint.active = this.siegeModel.canFightNum > 0
    }
}