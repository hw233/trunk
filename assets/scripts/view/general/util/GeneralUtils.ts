import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import TaskModel from '../../task/model/TaskModel';
import { General_skinCfg, General_weaponCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-20 11:32:59 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralUtils {

    /**
     * 神器id 获取对应指挥官模型
     * @param id 
     */
    static getSkinByWeaponId(id: number) {
        let i = ConfigManager.getItemById(General_weaponCfg, id).resources;
        let r = ConfigManager.getItemById(General_skinCfg, i).road;
        if (ModelManager.get(RoleModel).gender == 1) {
            // 性别为女
            r += 'nv';
        }
        return r;
    }

    /**是否显示神器图标(获得全部神器 隐藏图标) */
    static weaponActIconShowFunc() {
        let weaponCfg = ConfigManager.getItemByField(General_weaponCfg, 'chapter', ModelManager.get(TaskModel).weaponChapter);
        return !!weaponCfg;
    }
}
