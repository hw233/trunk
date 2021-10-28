import JumpUtils from '../../../common/utils/JumpUtils';
import PanelId from '../../../configs/ids/PanelId';

/**
 * @Description: 合服狂欢 界面
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-25 11:36:17
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/combine/CombineCarnivalTipCtrl")
export default class CombineCarnivalTipCtrl extends gdk.BasePanel {

    onEnable() {

    }

    onOpenView() {
        gdk.panel.hide(PanelId.CombineCarnivalTip)
        JumpUtils.openCombineMain([1])
    }
}