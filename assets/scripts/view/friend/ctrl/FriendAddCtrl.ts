/** 
 * @Description: 添加好友界面
 * @Author: weiliang.huang  
 * @Date: 2019-03-27 13:38:59 
 * @Last Modified by: weiliang.huang
 * @Last Modified time: 2019-03-27 13:45:57
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/friend/FriendAddCtrl")
export default class FriendAddCtrl extends gdk.BasePanel {

    @property(cc.EditBox)
    inputBox: cc.EditBox = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    /**添加好友按钮函数 */
    addFunc() {
        let id = this.inputBox.string
        console.log("添加好友:", id)
    }
}
