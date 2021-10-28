/** 
 * 弹窗显示 由小变大效果组件
 * @Author: sthoo.huang  
 * @Date: 2019-11-26 11:26:15 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-10-15 13:53:04
 */
const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
@menu("qszc/common/widgets/PopViewShowScaleCtrl")
export default class PopViewShowScaleCtrl extends cc.Component {

    onEnable() {
        this.node.setScale(.7);
        this.node.runAction(cc.sequence(
            cc.scaleTo(.2, 1.05, 1.05),
            cc.scaleTo(.15, 1, 1)
        ));
    }

    onDisable() {
        this.node.stopAllActions();
    }
}