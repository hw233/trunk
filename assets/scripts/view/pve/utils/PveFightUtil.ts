import { MonsterCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import MathUtil from '../../../common/utils/MathUtil';
import { PveCalledAIType } from '../const/PveCalled';
import { PveFightCtrl } from '../core/PveFightCtrl';
import { PveCampType } from '../core/PveFightModel';
import PveEventId from '../enum/PveEventId';
import PveEnemyModel from '../model/PveEnemyModel';
import PveSceneModel from '../model/PveSceneModel';
import { PveBSEventArgs } from './PveBSExprUtils';
import PveRoadUtil from './PveRoadUtil';

/**
 * Pve战斗对象相关的工具方法
 * @Author: sthoo.huang
 * @Date: 2019-06-20 13:43:14
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-06-10 11:47:24
 */

export interface PveCallerArgs {
    call_id: number,
    owner: PveFightCtrl,
    pos: cc.Vec2,
    index?: number,
    total?: number,
    hp?: number,
    config?: any,
    args?: PveBSEventArgs,
    ai?: PveCalledAIType,
}

class PveFightUtil {

    /**
     * 在指定的坐标动态创建怪物，路径根据roadIndex和pos动态生成
     * @param attacker 
     * @param num 
     * @param id 
     * @param pos 
     * @param roadIndex 
     * @param wait 
     * @param wait_delay 
     * @param time 
     * @param born_animation 
     * @param radius 
     */
    createEnemyBy(
        attacker: PveFightCtrl,
        num: number,
        id: number,
        pos: cc.Vec2,
        roadIndex?: number,
        wait?: number,
        wait_delay?: number,
        time?: number,
        born_animation?: string,
        radius?: number
    ) {
        let m = attacker.model;
        let sceneModel = attacker.sceneModel;
        if (!cc.js.isNumber(roadIndex) || roadIndex <= 0) {
            if (m instanceof PveEnemyModel) {
                // owner为怪物，则继承原路径
                roadIndex = m.roadIndex;
            } else {
                // owner为非怪物，则寻找一处离目标点最近的路径
                let dis = Number.MAX_VALUE;
                let cur = pos || attacker.getPos();
                let arr = sceneModel.tiled.roads;
                for (let key in arr) {
                    let r = arr[key];
                    for (let i = 0, n = r.length; i < n; i++) {
                        let t = MathUtil.distance(cur, r[i])
                        if (dis > t) {
                            dis = t;
                            roadIndex = parseInt(key);
                        }
                    }
                }
            }
        }
        let roads = sceneModel.tiled.roads[roadIndex];
        for (let i = 0; i < num; i++) {
            let r = roads;
            if (m.camp != PveCampType.Enemy) {
                r = r.slice().reverse();
            }
            if (pos) {
                r = PveRoadUtil.getShortestRoadBy(pos, r)
                r.unshift(pos);
            } else if (r === roads) {
                r = r.slice();
            }
            this.createEnemy(
                sceneModel,
                id,
                pos,
                r,
                roadIndex,
                i, num, wait, wait_delay, time, born_animation, radius, attacker,
            );
        }
        // 排除不可计数的怪物
        if (m.camp == PveCampType.Enemy) {
            let enemyCfg = ConfigManager.getItemById(MonsterCfg, id);
            if (enemyCfg && enemyCfg.type != 4) {
                sceneModel.createdEnemy += num;
            }
        }
    }

    /**
     * 创建一个怪物
     * @param id 
     * @param pos 
     * @param road 
     * @param roadIndex 
     * @param index 
     * @param total 
     * @param wait 
     * @param wait_delay 
     * @param time 
     * @param born_animation 
     * @param radius 
     * @param owner
     */
    createEnemy(
        model: PveSceneModel,
        id: number,
        pos: cc.Vec2,
        road: cc.Vec2[],
        roadIndex: number,
        index?: number,
        total?: number,
        wait?: number,
        wait_delay?: number,
        time?: number,
        born_animation?: string,
        radius?: number,
        owner?: PveFightCtrl,
    ) {
        this.emit(PveEventId.PVE_CREATE_ENEMY, model, [
            id, pos, road,
            roadIndex, index, total,
            wait, wait_delay, time,
            born_animation, radius,
            owner,
        ]);
    }

    /**
     * 创建召唤物
     * @param id 
     * @param time 
     * @param owner 
     * @param pos
     * @param i
     * @param num
     */
    createCaller(model: PveSceneModel, id: number, time: number, args: PveCallerArgs) {
        this.emit(PveEventId.PVE_CREATE_CALLER, model, [id, time, args]);
    }

    /**
     * 创建陷阱
     * @param id 
     * @param time 
     * @param pos 
     * @param owner 
     */
    createTrap(model: PveSceneModel, id: number, time: number, pos: cc.Vec2, owner: PveFightCtrl, range?: number) {
        this.emit(PveEventId.PVE_CREATE_TRAP, model, [id, time, pos, owner, range]);
    }

    /**
     * 创建传送门
     * @param flag
     * @param id 
     * @param time 
     * @param pos 
     * @param owner 
     * @param args 
     */
    createGate(model: PveSceneModel, flag: string, id: number, time: number, pos: cc.Vec2, owner: PveFightCtrl, args: any[]) {
        this.emit(PveEventId.PVE_CREATE_GATE, model, [flag, id, time, pos, owner, args]);
    }

    /**
     * 广播全局事件
     * @param eventType 
     * @param model 
     * @param data 
     */
    private emit(eventType: string, model: PveSceneModel, data?: any) {
        let name = `${eventType}#${model.isMirror ? 'mirror' : 'main'}`;
        gdk.e.emit(name, data);
    }
}

export default gdk.Tool.getSingleton(PveFightUtil);