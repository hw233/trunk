import BGlobalUtil from '../../../common/utils/BGlobalUtil';
import BUiListItem from '../../../common/widgets/BUiListItem';
import { NoticeItemType } from './NoticeViewCtrl';
/** 
 * @Description: 
 * @Author: luoyong 
 * @Date: 2020-07-01 14:37:53 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-07-07 17:43:03
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/login/NoticeTabItemCtrl")
export default class NoticeTabItemCtrl extends BUiListItem {

    @property(cc.Node)
    selectIcon: cc.Node = null;

    @property(cc.Node)
    stateIcon: cc.Node = null;

    @property(cc.Label)
    tabLab: cc.Label = null;

    _itemInfo: NoticeItemType

    updateView() {
        this._itemInfo = this.data
        this.tabLab.string = `${this._itemInfo.t.replace("\\n", "\n")}`
        this.tabLab.node.y = -48
        if (this._itemInfo.s == 0) {
            this.stateIcon.active = false
        } else {
            this.stateIcon.active = true
            BGlobalUtil.setSpriteIcon(this.node, this.stateIcon, `view/login/texture/login/noticeTab_state_${this._itemInfo.s}`)
            if (this._itemInfo.t.indexOf("\\n") != -1) {
                this.tabLab.node.y = -63
            }
        }
    }

    _itemSelect() {
        if (this.ifSelect) {
            this.selectIcon.active = true
            this.tabLab.node.color = new cc.Color().fromHEX('#FFED4D');
            this.tabLab.node.getComponent(cc.LabelOutline).enabled = true;
        } else {
            this.selectIcon.active = false
            this.tabLab.node.color = new cc.Color().fromHEX('#BF9973');
            this.tabLab.node.getComponent(cc.LabelOutline).enabled = false;
        }

    }
}