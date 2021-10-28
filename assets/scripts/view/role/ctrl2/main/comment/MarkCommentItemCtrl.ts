import { RoleEventId } from '../../../enum/RoleEventId';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/comment/MarkCommentItemCtrl")
export default class MarkCommentItemCtrl extends cc.Component {

    @property(cc.Label)
    lab: cc.Label = null

    _putStr: string = ''

    onEnable() {

    }

    updateDes(str: string) {
        this._putStr = str
        this.lab.string = str
        this.node.width = str.length * this.lab.fontSize + 20
    }

    quickPutFunc() {
        gdk.e.emit(RoleEventId.COMMENT_MARK_PUT_IN, this._putStr)
    }
} 