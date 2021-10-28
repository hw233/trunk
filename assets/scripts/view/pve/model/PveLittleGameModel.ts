
import { Little_gameCfg, Pve_mainCfg } from "../../../a/config";
import ConfigManager from "../../../common/managers/ConfigManager";
import PveLittleGameBuildTowerCtrl from "../ctrl/littleGame/PveLittleGameBuildTowerCtrl";
import PveLitleGameEnemyCtrl from "../ctrl/littleGame/PveLittleGameEnemyCtrl";
import PveLittleGameGeneralCtrl from "../ctrl/littleGame/PveLittleGameGeneralCtrl";
import PveLittleGameViewCtrl from "../ctrl/PveLittleGameViewCtrl";
import PveSceneState from "../enum/PveSceneState";
import { PveRoadInfo } from "./PveSceneModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PveLittleGameModel extends cc.Component {

    ctrl: PveLittleGameViewCtrl;
    node: cc.Node;
    stageConfig: Little_gameCfg; // 关卡静态配置
    config: Pve_mainCfg;    //静态配置 

    tmxAsset: cc.TiledMapAsset;
    tiled: PveRoadInfo = new PveRoadInfo(); // 场景配置数据
    state: PveSceneState = PveSceneState.Loading;
    towers: PveLittleGameBuildTowerCtrl[] = [];  // 英雄塔座列表
    enemies: PveLitleGameEnemyCtrl[] = []; // 怪物
    generals: PveLittleGameGeneralCtrl[] = [];    // 指挥官列表
    timeScale: number = 1.0;


    enterGeneralHp: number = 0;
    generalHp: number = 0;

    //指挥官的目标点下标
    generalTargetPosIndex: number = 0;
    generalMoveState: boolean = false;
    curEnemy: PveLitleGameEnemyCtrl = null;

    /** 关卡序列号 */
    _id: number;
    get id() {
        return this._id;
    }

    set id(v: number) {
        this._id = v;
        this.stageConfig = ConfigManager.getItemByField(Little_gameCfg, 'type', v)//CopyUtil.getStageConfig(v);

        // 普通
        //this.ctrl.title = `第${v}关`//this.stageConfig.name;

        // 重置数值
        this.initEnemies();
    }

    /** 场景缩放值 */
    get scale(): number {
        let v = 0.67//this.stageConfig.scale;
        // if (!cc.js.isNumber(v)) {
        //     v = 1;
        // } else {
        //     v = Math.max(0.1, v);
        // }
        return v;
    }
    // 初始化刷怪列表
    private initEnemies() {

    }
}
