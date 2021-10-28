import PveProtegeCtrl from '../ctrl/fight/PveProtegeCtrl';
import PveSceneCtrl from '../ctrl/PveSceneCtrl';
import PveSceneModel from '../model/PveSceneModel';

/** 
 * Pve血条组件
 * @Author: sthoo.huang  
 * @Date: 2019-05-24 09:18:34 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-10-20 20:46:31
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/core/PveCupStageHpBarCtrl")
export default class PveCupStageHpBarCtrl extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    @property({ type: cc.Node, tooltip: "血条" })
    bar: cc.Node = null;
    @property({ type: cc.Label, tooltip: "血量" })
    hpVal: cc.Label = null;

    @property(cc.Integer)
    totalLength: number = 158;

    tween: cc.Tween;
    timeScale: number;

    //shiedValue: number;
    model: PveSceneModel;
    onEnable() {
        let panel = gdk.gui.getCurrentView().getComponent(PveSceneCtrl);
        this.model = panel.model;
        let proteges: Array<PveProtegeCtrl> = this.model.proteges;
        let target: PveProtegeCtrl = proteges[0];
        if (target) {
            let model = target.model;
            this.bar.width = model.hp / model.config.hp;
        }
    }

    onDisable() {

        this.tween && this.tween.stop();
        this.tween = null;
    }

    set progress(v: number) {
        v = parseFloat(v.toFixed(2));
        if (v == this.progress) {
            // 不需要任何变化
            return;
        }
        let ow = this.barVal.width;
        let nw = this.totalLength * v;
        if (ow > nw) {
            if (!this.barBg.active) {
                this.barBg.active = true;
                this.barBg.width = ow;
            }
            this.barBg.opacity = 255;
        } else if (this.barBg.active) {
            this.barBg.active = false;
            this.barBg.opacity = 255;
        }
        this.barVal.width = nw;
        if (this.barVal2) {
            this.barVal2.width = nw;
        }
        this.tween && this.tween.stop();
        this.tween = null;
        if (ow > nw) {
            this.tween = cc.tween(this.barBg)
                .delay(0.05)
                .to(0.25, { width: nw, opacity: 0 })
                .call(() => {
                    this.barBg.active = false;
                    this.barBg.opacity = 255;
                    this.tween = null;
                })
                .start();
        }
    }




}