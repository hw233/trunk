import ConfigManager from '../../../../common/managers/ConfigManager';
import { VipCfg } from '../../../../a/config';

/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-09-16 16:15:40
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/recharge/VipDescItemCtrl")
export default class VipDescItemCtrl extends cc.Component {

    @property(cc.RichText)
    descLab: cc.RichText = null;

    @property(cc.Node)
    newIcon: cc.Node = null;

    /**state 0 显示充值信息 1 显示常规表述 */
    updateViewInfo(desc: string, isShowNew: boolean = false) {
        this.descLab.string = desc
        this.newIcon.active = isShowNew
    }
}