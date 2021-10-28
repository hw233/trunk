import BGameUtils from '../../../common/utils/BGameUtils';

/**
 * 重新初始化数据模型
 * @Author: sthoo.huang
 * @Date: 2019-07-26 15:41:33
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-06-16 17:46:13
 */

@gdk.fsm.action("InitGameModelAction", "Game")
export default class InitGameModelAction extends gdk.fsm.FsmStateAction {

    onEnter() {
        if (BGameUtils.initGameModel) {
            BGameUtils.initGameModel(this);
        }
        this.finish();
    }
}