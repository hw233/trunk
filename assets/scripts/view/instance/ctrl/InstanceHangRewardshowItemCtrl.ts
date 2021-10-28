import UiListItem from '../../../common/widgets/UiListItem';
import { InstanceEventId } from '../enum/InstanceEnumDef';

/** 
  * @Description: 挂机奖励界面宝箱Item
  * @Author: yaozu.hu
  * @Date: 2019-12-18 17:12:24 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-01-03 11:15:56
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/InstanceHangRewardshowItemCtrl")
export default class InstanceHangRewardshowItemCtrl extends UiListItem {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    onEnable() {
        gdk.e.on(InstanceEventId.HANGREWARD_OPEN_BOX, this.openBox, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
        this.spine.node.opacity = 0
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
    }

    updateView() {
        if (this.data.state == 1) {
            let time1 = this.data.index > 9 ? this.data.index % 5 * 0.1 : this.data.index * 0.1;
            this.scheduleOnce(() => {
                if (!cc.isValid(this.node)) return;
                if (!this.node) return;
                this.spine.node.opacity = 255;
                this.spine.setAnimation(0, "stand", false)
            }, time1);

            if (this.data.index == this.data.maxNum - 1) {
                this.scheduleOnce(() => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node) return;
                    //发送打开箱子的操作
                    gdk.e.emit(InstanceEventId.HANGREWARD_OPEN_BOX)
                }, time1 + 0.5);
            }

        } else {
            this.spine.node.opacity = 255;
            this.spine.setAnimation(0, "stand3", false)
        }
    }

    //打开箱子操作
    openBox(e: gdk.Event) {
        this.spine.node.opacity = 255;
        if (this.data.state == 1) {
            this.spine.setAnimation(0, "stand2", false)
        }
    }
}
