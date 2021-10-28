/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-12 13:36:15 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubInstanceDoomsdayViewCtrl")
export default class SubInsSweepViewCtrl extends gdk.BasePanel {
    @property(cc.RichText)
    askLab: cc.RichText = null;

    @property(cc.RichText)
    vipTipsLab: cc.RichText = null;

    sureCb: Function;
    updateView(askLab: string, extraLab: string, sureCb?: Function) {
        this.askLab.string = askLab;
        this.vipTipsLab.string = extraLab ? extraLab : '';
        this.vipTipsLab.node.active = extraLab && extraLab.length > 0;
        this.sureCb = sureCb;
    }

    onCancelBtnClick() {
        this.close();
    }

    onConfirmBtnClick() {
        this.sureCb && this.sureCb();
        this.close();
    }
}
