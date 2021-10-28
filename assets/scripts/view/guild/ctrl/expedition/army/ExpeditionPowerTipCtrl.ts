import NumberChangeCtrl from '../../../../../common/widgets/NumberChangeCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-18 10:26:45 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/army/ExpeditionPowerTipCtrl")
export default class ExpeditionPowerTipCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    powerSpine: sp.Skeleton = null;

    @property(sp.Skeleton)
    powerSpine2: sp.Skeleton = null;

    // @property(cc.Node)
    // plus: cc.Node = null;

    // @property(ScrollNumberCtrl)
    // num: ScrollNumberCtrl = null;

    @property(cc.Label)
    oldPowerNum: cc.Label = null;

    @property(NumberChangeCtrl)
    num: NumberChangeCtrl = null;

    @property(cc.Node)
    arrow: cc.Node = null;

    @property({ tooltip: "显示时间（单位：秒）" })
    showTime: number = 1.5;

    onEnable() {
        // this.plus.active = false;
        this.node.getChildByName('layout').active = false;
        this.powerSpine.node.active = false;
        this.powerSpine2.node.active = false;
    }

    onDisable() {
        gdk.DelayCall.cancel(this.close, this);
        gdk.Timer.clearAll(this)
    }

    update() {
        let args = this.args;
        if (args[0] && args[0].length == 2) {
            this.updateTip(args[0][0], args[0][1] || 0);
        }
    }

    updateTip(nv: number, ov: number = 0) {
        // this.plus.active = true;
        this.node.getChildByName('layout').active = true;
        this.oldPowerNum.string = nv + '';
        this.num.value = 0;
        this.num.scrollTo(Math.abs(nv - ov));
        // // 箭头
        // let arrow: cc.Node = this.arrow;
        // let isup: boolean = nv > ov;
        // arrow.getChildByName('up').active = isup;
        // arrow.getChildByName('down').active = !isup;
        // arrow.x = num.node.x + num.width + 20;
        // 动作
        this.powerSpine.node.active = true;
        this.powerSpine.setAnimation(0, "stand2", false);

        this.powerSpine2.node.active = true;
        this.powerSpine2.setAnimation(0, "stand", false);
        // 自动隐藏
        gdk.DelayCall.addCall(this.close, this, this.showTime);
        gdk.Timer.once(this.showTime * 1000 - 300, this, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.node.getChildByName('layout').active = false;
        });
        gdk.NodeTool.show(this.node);
    }

    close(buttonIndex: number = -1) {
        gdk.DelayCall.cancel(this.close, this);
        super.close(buttonIndex);
    }
}
