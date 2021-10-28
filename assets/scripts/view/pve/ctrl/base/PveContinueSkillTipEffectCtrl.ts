import PveSceneModel from '../../model/PveSceneModel';

/**
 * 塔防持续技能施法条
 * @Author: yaozu.hu
 * @Date: 2020-03-23 16:39:09
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-04-29 15:03:00
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/other/PveContinueSkillTipEffectCtrl")
export default class PveContinueSkillTipEffectCtrl extends cc.Component {

    // @property(cc.Node)
    // bg: cc.Node = null;

    @property(cc.Slider)
    slider: cc.Slider = null

    @property({ type: cc.Node, tooltip: "时间条" })
    bar: cc.Node = null;

    @property(cc.Integer)
    totalLength: number = 100;

    continueTime: number = 1;
    sceneModel: PveSceneModel;
    allTime: number = 1;

    onEnable() {
        this.allTime = this.continueTime;
        // if (this.bg) {
        //     this.bg.width = this.totalLength + 2;
        //     this.bg.x = -this.totalLength / 2 - 1;
        // }
        this.bar.x = -this.totalLength / 2;
        this.bar.width = 0;
        this.bar.scaleX = 1.0;
        this.slider.progress = 0;
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        if (this.continueTime <= 0) return;
        this.continueTime -= dt;
        let tem = Math.min(1, (1 - (this.continueTime / this.allTime)));
        this.bar.width = this.totalLength * tem;
        this.slider.progress = tem
    }

    onDisable() {
        this.sceneModel = null;
    }
}
