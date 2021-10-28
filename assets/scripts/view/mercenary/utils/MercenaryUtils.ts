import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import MercenaryModel from '../model/MercenaryModel';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import { Copysurvival_stageCfg, WorkerCfg } from '../../../a/config';

/**
 * @Description: 装备工具类
 * @Author: weiliang.huang
 * @Date: 2019-04-10 10:17:20
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-11-10 10:48:02
 */
export default class MercenaryUtils {

    static get model(): MercenaryModel {
        return ModelManager.get(MercenaryModel)
    }

    static get roleModel(): RoleModel {
        return ModelManager.get(RoleModel)
    }

    static get copyModel(): CopyModel {
        return ModelManager.get(CopyModel)
    }

    /**可设置 雇佣英雄数量 */
    static get setHeroLength() {
        let workerCfg = ConfigManager.getItemById(WorkerCfg, 1)
        let lvDatas = [workerCfg.open_lv1, workerCfg.open_lv2, workerCfg.open_lv3]
        let count = 0
        for (let i = 0; i < lvDatas.length; i++) {
            if (this.roleModel.level >= lvDatas[i]) {
                count++
            }
        }
        return count
    }


    /**已设置 英雄数量 */
    static get hiredHeroLength() {
        let count = 0
        let list = this.model.lentHeroList
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].heroId > 0) {
                count++
            }
        }
        return count
    }

    /**可租用英雄的数量 */
    static get canBorrowHeroNum() {
        let maxSort = 0
        let stageCfg = ConfigManager.getItemById(Copysurvival_stageCfg, this.copyModel.survivalStateMsg.stageId)
        // if (stageCfg) {
        //     maxSort = stageCfg.sort
        // }
        // let workerCfg = ConfigManager.getItemById(WorkerCfg, 1)
        // let sortDatas = [workerCfg.open_sort1, workerCfg.open_sort2, workerCfg.open_sort3, workerCfg.open_sort4]
        let count = 0
        // for (let i = 0; i < sortDatas.length; i++) {
        //     // if (maxSort >= sortDatas[i]) {
        //     //     count++
        //     // }
        //     //解锁条件改为指挥官等级
        //     if (this.roleModel.level >= sortDatas[i]) {
        //         count++
        //     }
        // }
        if (stageCfg) {
            count = stageCfg.num_worker
        }
        return count
    }

    /**已租用的英雄数量 */
    static get hasBorrowHeroNum() {
        let count = 0
        let list = this.model.borrowedListHero
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].brief) {
                count++
            }
        }
        return count
    }


    static checkHeroIsSystem(index) {
        let list = this.model.borrowedListHero
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].index == index && list[i].playerId == 0) {
                return true
            }
        }
        return false
    }

}