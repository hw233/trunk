/**
 * 控制提示消息背景
 * @Author: luoyong
 * @Date: 2019-08-29 18:15:54
 * @Last Modified by: luoyong
 * @Last Modified time: 2019-08-29 18:39:21
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/MessageUIBgCtrl")
export default class MessageUIBgCtrl extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.RichText)
    richText: cc.RichText = null;

    onLoad() {
        this._updateView()
    }

    onEnable() {
        this._updateView()
    }

    _updateView() {
        gdk.Timer.callLater(this, () => {
            this.bg.width = this.richText.node.width + 70
        })
    }

}