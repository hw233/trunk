/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-22 22:19:44 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/SuperVipCopyViewCtrl")
export default class SuperVipCopyViewCtrl extends gdk.BasePanel {
    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    onEnable() {
        this.editBox.string = 2850736376 + '';
    }

    onEditingEnd() {
        this.editBox.string = 2850736376 + '';
    }
}
