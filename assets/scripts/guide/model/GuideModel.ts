import ConfigManager from '../../common/managers/ConfigManager';
import GlobalUtil from '../../common/utils/GlobalUtil';
import GuideViewCtrl from '../ctrl/GuideViewCtrl';
import { GuideCfg } from '../../a/config';

/** 
  * @Description: 指引数据信息
  * @Author: weiliang.huang  
  * @Date: 2019-06-03 16:54:23 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-09-21 16:39:17
*/
export type GuideItemType = {
    /**指引id */
    id: number,
    /**指引配置 */
    cfg: GuideCfg,
    /**绑定节点 */
    node?: cc.Node,
    /**按钮函数指针 */
    target?: any,
}

export type GuideBtnType = {
    0?: cc.Node,
    1?: any,
}

export default class GuideModel {

    guideCtrl: GuideViewCtrl

    doneIds: { [group: number]: boolean } = {}   // 记录已完成的指引id
    bindBtns: { [id: number]: cc.Node } = {} // 记录正在绑定的按钮id列表
    waitActives: GuideCfg[] = [] // 待激活引导

    taskId: number = 0  // 记录上次领奖的任务id
    curGuide: GuideCfg = null
    // isGetReward: boolean = false // 是否获取奖励，用于按顺序播放效果--获取物品-升级-功能开启
    // isFightEnd: boolean = false // 是否处于战斗结算界面 用于按顺序播放效果--结算关闭-升级-功能开启
    // lvUpData: number[] = [] // 旧等级，新等级

    /** 引导配置 */
    _guideCfgs: { [id: number]: GuideCfg };
    get guideCfgs() {
        if (!this._guideCfgs) {
            if (CC_DEBUG) {
                let v = GlobalUtil.getUrlValue('ignoredgg');    // 全称：ignore_done_guide_group
                if (v) {
                    v.split(',').forEach(id => delete this.doneIds[id]);
                }
            }
            let cfgs = this._guideCfgs = {};
            let acfgs = this._activeCfgs = {};
            let items = ConfigManager.getItems(GuideCfg);
            items.forEach(cfg => {
                cfgs[cfg.id] = cfg;
                // 为条件创建索引
                if (!cfg.activeCondition) return;
                if (!this.doneIds[cfg.group]) {
                    // 已经完成的引导不需要处理
                    let keys = cfg.activeCondition.split('|');
                    keys.forEach(key => {
                        if (!acfgs[key]) {
                            acfgs[key] = [];
                        }
                        acfgs[key].push(cfg);
                    });
                }
            });
            for (let key in acfgs) {
                let arr: GuideCfg[] = acfgs[key];
                if (!arr || !arr.length) continue;
                GlobalUtil.sortArray(arr, (a, b) => {
                    return a.turn - b.turn;
                });
            }
        }
        return this._guideCfgs;
    }

    /** 激活条件引导配置 */
    _activeCfgs: { [condition: string]: GuideCfg[] };
    get activeCfgs() {
        !this._activeCfgs && this.guideCfgs;
        return this._activeCfgs;
    }
}