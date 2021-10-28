import PveSceneInitAction from '../scene/PveSceneInitAction';

/**
 * PVE场景初始化
 * @Author: sthoo.huang
 * @Date: 2019-03-18 18:37:54
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-12-20 16:39:03
 */

@gdk.fsm.action("PveReadyInitAction", "Pve/Ready")
export default class PveReadyInitAction extends PveSceneInitAction {

    // 创建指挥官
    createGeneral(): Promise<unknown> { return; }

    // 创建被保护对象
    createProteges() { }

    // 创建主线挂机宝箱
    createHangInfo() { }

    // 预加载资源
    preloadRes() { }
}