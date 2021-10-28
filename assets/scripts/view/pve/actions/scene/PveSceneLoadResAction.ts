import ModelManager from '../../../../common/managers/ModelManager';
import CopyUtil from '../../../../common/utils/CopyUtil';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PveRes from '../../const/PveRes';
import PveSceneCtrl from '../../ctrl/PveSceneCtrl';
import PveSceneState from '../../enum/PveSceneState';
import PveSceneModel from '../../model/PveSceneModel';
import PveSceneBaseAction from '../base/PveSceneBaseAction';
import CopyModel, { CopyType } from './../../../../common/models/CopyModel';

/**
 * PVE场景资源加载动作
 * @Author: sthoo.huang
 * @Date: 2019-03-18 18:29:01
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-27 21:02:29
 */

@gdk.fsm.action("PveSceneLoadResAction", "Pve/Scene")
export default class PveSceneLoadResAction extends PveSceneBaseAction {

    dataLoaded = false;
    imageLoaded = false;

    onEnter() {
        super.onEnter();
        this.model.state = PveSceneState.Loading;
        this.dataLoaded = false;
        this.imageLoaded = false;
        if (this.initStage()) {
            // 只有初始完成功才继续加载
            this.loadScene();
        }
    }

    onExit() {
        super.onExit();
        gdk.e.targetOff(this);
    }

    // 初始化关卡信息，可在子类中overwrite
    initStage(): boolean {
        if (this.model.isBounty) {
            // 赏金副本
            this.model.id = this.model.bountyMission.stageId;
        } else if (!this.model.isMirror) {
            // 正常副本
            let stageId = this.model.id;
            if (!stageId || stageId < 0) {
                // 请求最新的关卡
                let copyModel = ModelManager.get(CopyModel)
                let temStageId = copyModel.enterDefenderStageId
                if (temStageId != 0) {
                    stageId = temStageId;
                    copyModel.enterDefenderStageId = 0;
                } else {
                    stageId = CopyUtil.getLatelyEnterableStage();
                }
            }
            this.model.id = stageId;
            // 是否需要打开镜像战斗
            let root = cc.find('Pvp', this.ctrl.node);
            let view = cc.find('PvpGame', this.ctrl.node);
            if (this.model.stageConfig.copy_id == CopyType.NONE) {
                // 非镜像战斗，并且有竞技场数据，打开一个镜像战斗界面
                if (this.model.isDefender) {
                    view.active = true;
                    root.active = true;
                    return true;
                }
                let model = new PveSceneModel();
                if (this.model.arenaSyncData.mirrorModel) {
                    model = this.model.arenaSyncData.mirrorModel
                }
                model.isMirror = true;
                model.seed = this.model.seed;
                model.arenaSyncData = this.model.arenaSyncData;
                model.id = stageId + 1;
                model.arenaSyncData.mirrorModel = model;
                model.timeScale = this.model.timeScale;
                // 创建镜像战斗场景
                let node = view.children[0];
                if (!node) {
                    let prefab = gdk.rm.getResByUrl(this.ctrl.config.prefab, cc.Prefab);
                    node = cc.instantiate(prefab);
                    node.name = 'PveSceneMirror';
                    node.active = false;
                    node.parent = view;
                }
                let ctrl = model.ctrl = node.getComponent(PveSceneCtrl);
                ctrl['_resId'] = this.ctrl.resId;
                ctrl.model = model;
                node.active = true;
                view.active = true;
                root.active = true;

            } else if (root.active) {
                // 销毁镜像战斗场景
                let node = view.children[0];
                if (!node && !this.model.isDefender) {
                    node.active = false;
                }
                view.active = false;
                root.active = false;
            }
        }
        return true;
    }

    // 加载场景资源
    loadScene() {

        // 加载背景图
        this.imageLoaded = !this.model.config.bg;
        this.ctrl.map.destroyAllChildren();
        this.ctrl.map.scale = 1.0;
        let bgurl = this.imageLoaded ? null : PveRes.PVE_MAP_RES + this.model.config.bg;
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
        let road = this.model.config.road;
        let url = PveRes.PVE_ROAD_RES + road;
        gdk.rm.loadRes(resId, url, cc.TiledMapAsset, (tmxAsset: cc.TiledMapAsset) => {
            if (!this.active) return;
            if (!this.model || this.model.config.road != road) return;
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
            let music = this.node.getComponent(gdk.Music);
            music && music.setMusic(this.model.config.music);
        }
        this.finish();
    }
}