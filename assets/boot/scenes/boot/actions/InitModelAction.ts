import BModelManager from '../../../common/managers/BModelManager';
import BServerModel from '../../../common/models/BServerModel';

/**
 * 重新初始化数据模型
 * @Author: sthoo.huang
 * @Date: 2019-07-26 15:41:33
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-20 01:31:40
 */


@gdk.fsm.action("InitModelAction", "Boot")
export default class InitModelAction extends gdk.fsm.FsmStateAction {

    onEnter() {
        BModelManager.clearAll([
            BServerModel,
        ]);
        this.finish();
    }

    // onExit() {
    // }
    // onDestroy() {
    // }
    // update(dt: number) {
    // }
}