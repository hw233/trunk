import ConfigManager from '../../../common/managers/ConfigManager';
import PveTool from '../utils/PveTool';
import { Pve_spawnCfg } from '../../../a/config';

/**
 * PVE出生点数据模型
 * @Author: sthoo.huang
 * @Date: 2019-03-19 15:17:29
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-05-08 17:30:23
 */

export default class PveSpawnModel {

    config: Pve_spawnCfg;
    road: Array<cc.Vec2>; // 对应的行走路线
    pos: cc.Vec2; // 坐标

    /** Spawn ID */
    _id: string;
    get id() {
        return this._id;
    }

    set id(v: string) {
        this._id = v;
        let sid: number = 1;    // 默认使用第一个
        let a: any[] = v.split('_');
        if (a.length > 1) {
            sid = a.pop();
        }
        this.config = ConfigManager.getItemById(Pve_spawnCfg, sid);
    }

    // 索引键值，对应刷怪出生点
    get key() {
        return parseInt(this._id.split("_")[0]);
    }

    // 对应路线的索引键值
    get index() {
        return parseInt(this._id.split('_').shift());
    }

    get skin() {
        if (this.config && this.config.skin != '') {
            return PveTool.getSkinUrl(this.config.skin);
        }
        return null;
    }
}