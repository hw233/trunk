import ConfigManager from '../managers/ConfigManager';
import JumpUtils from '../utils/JumpUtils';
import RedPointCtrl from './RedPointCtrl';
import { SystemCfg } from '../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/ShowHideSysBtnCtrl")
export default class ShowHIdeSysBtnCtrl extends cc.Component {

    @property({ tooltip: "system表中定义的功能id" })
    sysId: number = 0;

    isopen = false;
    time = 1.5;
    onLoad() {
        let cfg = ConfigManager.getItemById(SystemCfg, this.sysId)
        if (!cfg) {
            return false
        } else {
            if (JumpUtils.ifSysOpen(this.sysId, false)) {
                this.node.active = true;
                // this.node.children.forEach(child => {
                //     child.active = true;
                // })
                this.isopen = true;
            } else {
                // this.node.children.forEach(child => {
                //     child.active = false;
                // })
                this.node.active = false
                this.isopen = false;
                let red = this.node.getComponent(RedPointCtrl)
                if (red) {
                    red.enabled = false;
                }
                let btn = this.node.getComponent(cc.Button)
                if (btn) {
                    btn.interactable = false;
                }
            }
        }
    }

    update(dt: number) {
        if (!this.isopen) {
            this.time -= dt;
            if (this.time <= 0) {
                if (JumpUtils.ifSysOpen(this.sysId, false)) {
                    this.node.active = true;
                    // this.node.children.forEach(child => {
                    //     child.active = true;
                    // })
                    let red = this.node.getComponent(RedPointCtrl)
                    if (red) {
                        red.enabled = true;
                    }
                    let btn = this.node.getComponent(cc.Button)
                    if (btn) {
                        btn.interactable = true;
                    }
                }
                this.time = 1.5;
            }
        }
    }

}
