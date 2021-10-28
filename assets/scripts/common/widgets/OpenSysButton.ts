import ConfigManager from '../managers/ConfigManager';
import JumpUtils from '../utils/JumpUtils';
import { SystemCfg } from '../../a/config';

/** 
 * 打开系统功能按钮
 * @Author: sthoo.huang  
 * @Date: 2019-10-26 16:50:10 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-09-03 14:43:08
 */const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/OpenSysButton")
export default class OpenSysButton extends gdk.SoundButton {

    @property({ tooltip: "system表中定义的功能id" })
    sysId: number = 0;

    @property({ tooltip: "如果功能没开启时是否显示提示" })
    showTips: boolean = true;

    onEnable() {
        let cfg = ConfigManager.getItemById(SystemCfg, this.sysId);
        if (cfg) {
            gdk.Timer.callLater(this, () => {
                if (!cc.isValid(this.node)) return;
                let p = this.node.getPos();
                p = this.node.parent.convertToWorldSpaceAR(p);
                cfg.pos = p;
            })
        }
    }

    onClick() {
        super.onClick();
        JumpUtils.openView(this.sysId, this.showTips);
    }
}