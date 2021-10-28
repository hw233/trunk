import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import UiListItem from '../../../common/widgets/UiListItem';
import { HeadItemInfo } from './HeadChangeViewCtrl';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/HeadChangeItemCtrl")
export default class HeadChangeItemCtrl extends UiListItem {

    @property(cc.Node)
    head: cc.Node = null

    @property(cc.Node)
    frame: cc.Node = null

    @property(cc.Node)
    selectNode: cc.Node = null

    @property(cc.Node)
    useNode: cc.Node = null

    @property(cc.Node)
    lockIcon: cc.Node = null

    get roleModel(): RoleModel {
        return ModelManager.get(RoleModel)
    }

    _headItemInfo: HeadItemInfo

    updateView() {
        this._headItemInfo = this.data

        this.useNode.active = false
        this.selectNode.active = this._headItemInfo.isSelect
        this.lockIcon.active = !this._headItemInfo.isActive
        this.frame.opacity = 255

        if (this._headItemInfo.type == 0) {
            GlobalUtil.setSpriteIcon(this.node, this.frame, "view/main/texture/headchange/main_touxiang01")
            this.head.active = true
            GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this._headItemInfo.id))

            if (this._headItemInfo.id == this.roleModel.head) {
                this.useNode.active = true
            }
        } else if (this._headItemInfo.type == 1) {
            this.head.active = false
            GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this._headItemInfo.id))
            if (this._headItemInfo.id == this.roleModel.frame) {
                this.useNode.active = true
            }
            this.frame.opacity = this._headItemInfo.isActive ? 255 : 100
        }
    }
}