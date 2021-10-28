/** 
 * Pve中BOSS来袭提示窗口
 * @Author: sthoo.huang
 * @Date: 2020-06-06 10:25:14
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-06-29 17:04:16
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveBossCommingEffectCtrl")
export default class PveBossCommingEffectCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    onEnable() {
        this.spine.setAnimation(0, 'stand', false);
        this.spine.setCompleteListener(() => {
            if (!cc.isValid(this.node)) return;
            if (!this.enabled) return;
            this.spine.setCompleteListener(null);
            this.close();
        });
    }
}