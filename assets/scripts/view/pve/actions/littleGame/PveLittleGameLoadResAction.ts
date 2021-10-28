

/**
 * PVE场景资源加载动作
 * @Author: sthoo.huang
 * @Date: 2019-03-18 18:29:01
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-08 11:00:52
 */

import { Little_game_globalCfg } from "../../../../a/config";
import ConfigManager from "../../../../common/managers/ConfigManager";
import GlobalUtil from "../../../../common/utils/GlobalUtil";
import PveRes from "../../const/PveRes";
import PveLittleGameViewCtrl from "../../ctrl/PveLittleGameViewCtrl";
import PveSceneState from "../../enum/PveSceneState";
import PveLittleGameModel from "../../model/PveLittleGameModel";

@gdk.fsm.action("PveLittleGameLoadResAction", "Pve/LittleGame")
export default class PveLittleGameLoadResAction extends gdk.fsm.FsmStateAction {

    model: PveLittleGameModel;
    ctrl: PveLittleGameViewCtrl;

    dataLoaded = false;
    imageLoaded = false;

    onEnter() {
        this.ctrl = this.node.getComponent(PveLittleGameViewCtrl);
        this.model = this.ctrl.model;

        this.model.state = PveSceneState.Loading;
        this.dataLoaded = false;
        this.imageLoaded = false;
        if (this.initStage()) {
            // 只有初始完成功才继续加载
            this.loadScene();
        }
    }

    onExit() {
        this.ctrl = null;
        this.model = null;
        gdk.e.targetOff(this);
    }

    // 初始化关卡信息，可在子类中overwrite
    initStage(): boolean {
        return true;
    }

    // 加载场景资源
    loadScene() {

        // 加载背景图
        this.imageLoaded = !this.model.stageConfig.map_id;
        this.ctrl.map.destroyAllChildren();
        this.ctrl.map.scale = 1.0;
        let bgurl = this.imageLoaded ? null : PveRes.PVE_MAP_RES + this.model.stageConfig.map_id;
        GlobalUtil.setSpriteIcon(this.node, this.ctrl.map, bgurl, () => {
            if (!this.active) return;
            if (!this.ctrl) return;
            let ctrl = this.ctrl;
            let content = ctrl.content;
            if (content) {
                let map = ctrl.map;
                let root = content.parent;
                if (map.width < 760) {
                    map.scale = 760 / map.width;
                }
                content.width = map.width * map.scale + map.x * 2;
                content.setPosition(-content.width * root.anchorX, 0);
                ctrl.setScrollViewEnabled(true);
            }
            this.imageLoaded = true;
            this.checkFinish();
        }, this);

        // 加载tmx地图数据
        let resId = gdk.Tool.getResIdByNode(this.node);
        let road = this.model.stageConfig.line;
        let url = PveRes.PVE_ROAD_RES + road;
        gdk.rm.loadRes(resId, url, cc.TiledMapAsset, (tmxAsset: cc.TiledMapAsset) => {
            if (!this.active) return;
            if (!this.model || this.model.stageConfig.line != road) return;
            // 创建瓦片图
            this.model.tmxAsset = tmxAsset;
            this.dataLoaded = true;
            this.checkFinish();
        });
    }

    checkFinish() {
        if (!this.dataLoaded) return;
        if (!this.imageLoaded) return;
        // 播放背景音乐
        if (GlobalUtil.isMusicOn) {
            let musicName = ConfigManager.getItemByField(Little_game_globalCfg, 'key', 'music').value[0]
            let music = this.node.getComponent(gdk.Music);
            music && music.setMusic(musicName);
        }
        this.finish();
    }
}
