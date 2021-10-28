import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import StringUtils from '../../../../../common/utils/StringUtils';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { Foothold_teachingCfg } from '../../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-17 15:58:54
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/teaching/FootHoldTeachingItem2Ctrl")
export default class FootHoldTeachingItem2Ctrl extends UiListItem {

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.RichText)
    descLab: cc.RichText = null

    onEnable() {

    }

    updateView() {
        let info = this.data
        this.descLab.string = `${StringUtils.setRichtOutLine(info[0], "#2e130c", 2)}`
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/guild/texture/teach/${info[1]}`)
    }
}