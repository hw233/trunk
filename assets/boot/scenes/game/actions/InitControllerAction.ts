import BGameUtils from '../../../common/utils/BGameUtils';

/**
 * 初始化控制器
 * @Author: sthoo.huang
 * @Date: 2019-03-28 19:46:19
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-06-16 17:45:55
 */
const { property } = cc._decorator;

@gdk.fsm.action("InitControllerAction", "Game")
export default class InitControllerAction extends gdk.fsm.FsmStateAction {

    @property({ tooltip: "添加或移除控制器" })
    isAdd: boolean = true;

    onEnter() {
        if (BGameUtils.initGameController) {
            BGameUtils.initGameController(this, this.isAdd);
        }
        this.finish();
    }
}