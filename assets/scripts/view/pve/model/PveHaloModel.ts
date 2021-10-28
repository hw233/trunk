import ConfigManager from '../../../common/managers/ConfigManager';
import { Skill_haloCfg } from '../../../a/config';

/** 
 * Pve场景光环数据模型
 * @Author: sthoo.huang  
 * @Date: 2019-05-10 15:09:41 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-10-30 13:39:44
 */
export default class PveHaloModel {

    _id: number;
    config: Skill_haloCfg;  // 静态配置
    remain: number;   // 剩余时间

    get id() {
        return this._id;
    }

    set id(v: number) {
        this._id = v;
        this.config = ConfigManager.getItemById(Skill_haloCfg, v);
        if (CC_DEBUG && !this.config) {
            cc.error(`找不到光环 (id: ${v}) 的配置`);
            return;
        }
        this.remain = Number.MAX_VALUE;
    }

    unuse() {
        this._id = 0;
        this.config = null;
        this.remain = 0;
    }
}