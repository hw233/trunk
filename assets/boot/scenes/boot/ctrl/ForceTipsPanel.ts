
/** 
  * @Description: 2个按钮的提示面板
  * @Author: weiliang.huang  
  * @Date: 2019-04-19 10:57:57 
 * @Last Modified by: chengyou.lin
 * @Last Modified time: 2020-02-25 10:35:59
*/

export interface ForceTipsData {
    sureText?: string,
    thisArg?: any,
    title?: any,
    sureCb?: Function,
    descText?: string,
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/ForceTipsPanel")
export default class ForceTipsPanel extends gdk.BasePanel {

    @property(cc.RichText)
    descLab: cc.RichText = null

    @property(cc.Label)
    sureLab: cc.Label = null
    sureCb: Function = null
    thisArg: any = null
    onLoad() {
        this.node.zIndex = 999999;
    }

    update() {
        let scene = cc.director.getScene();
        if (scene != this.node.parent) {
            let size = cc.director.getWinSize();
            this.node.x = size.width / 2;
            this.node.y = size.height / 2;
            let scene = cc.director.getScene();
            this.node.removeFromParent(false);
            scene.addChild(this.node);
        }
    }

    updatePanelInfo(info: ForceTipsData) {
        this.sureCb = info.sureCb
        this.thisArg = info.thisArg
        if (info.sureText) {
            this.sureLab.string = info.sureText
        }
        if (info.title) {
            this.title = info.title
        }
        if (info.descText) {
            this.descLab.string = info.descText
        }
    }

    sureFunc() {
        if (this.sureCb) {
            this.sureCb.call(this.thisArg)
        }
        this.close()
    }
}