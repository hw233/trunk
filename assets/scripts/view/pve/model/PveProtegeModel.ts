import ConfigManager from '../../../common/managers/ConfigManager';
import { Pve_protegeCfg } from './../../../a/config';
/**
 * 被保护对象数据模型
 * @Author: sthoo.huang
 * @Description:
 * @Date: 2019-03-21 20:38:38
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-24 10:03:45
 */
export default class PveProtegeModel {

    config: Pve_protegeCfg; // 静态配置
    hp: number; // 当前血量
    hpMax: number; // 最大血量

    /** Protege ID */
    _id: number = 0;
    get id() {
        return this._id;
    }

    set id(v: number) {
        this._id = v;
        this.config = ConfigManager.getItemById(Pve_protegeCfg, this._id);
        this.hp = this.hpMax = Math.max(1, this.config.hp);
    }

    get skin() {
        return this.config.skin;
    }
}