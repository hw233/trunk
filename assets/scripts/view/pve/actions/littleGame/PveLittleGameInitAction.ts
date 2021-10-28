

/**
 * PVE场景资源加载动作
 * @Author: sthoo.huang
 * @Date: 2019-03-18 18:29:01
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-08 11:00:52
 */

import { Little_gameCfg } from "../../../../a/config";
import ConfigManager from "../../../../common/managers/ConfigManager";
import GlobalUtil from "../../../../common/utils/GlobalUtil";
import MathUtil from "../../../../common/utils/MathUtil";
import GuideBind from "../../../../guide/ctrl/GuideBind";
import PveLittleGameBuildTowerCtrl from "../../ctrl/littleGame/PveLittleGameBuildTowerCtrl";
import PveLittleGameEnemyCtrl from "../../ctrl/littleGame/PveLittleGameEnemyCtrl";
import PveLittleGameGeneralCtrl from "../../ctrl/littleGame/PveLittleGameGeneralCtrl";
import PveLittleGameViewCtrl from "../../ctrl/PveLittleGameViewCtrl";
import PveFsmEventId from "../../enum/PveFsmEventId";
import PveSceneState from "../../enum/PveSceneState";
import PveLittleGameModel from "../../model/PveLittleGameModel";
import PvePool from "../../utils/PvePool";



@gdk.fsm.action("PveLittleGameInitAction", "Pve/LittleGame")
export default class PveLittleGameInitAction extends gdk.fsm.FsmStateAction {

    model: PveLittleGameModel;
    ctrl: PveLittleGameViewCtrl;
    tasks: Function[] = [];

    waitTab = '__PveLittleGameInitAction__';

    onEnter() {
        this.ctrl = this.node.getComponent(PveLittleGameViewCtrl);
        this.model = this.ctrl.model;

        this.model.state = PveSceneState.Ready;

        this.model.timeScale = 1.0;
        this.model.tiled.reset();

        // 创建任务
        this.tasks.push(this.parseMap);
        this.tasks.push(this.createGeneral);
        //this.tasks.push(this.createSpawns);
        //this.tasks.push(this.createProteges);
        this.tasks.push(this.createTowers);
        this.tasks.push(this.createEnemys);
        this.tasks.push(this.scrollRight);
        this.tasks.push(this.onFinish);

        // 执行任务队列
        this.next();
    }

    onExit() {
        this.tasks.length = 0;
        // this.ctrl.root.y = -gdk.gui.guiLayer.y;

        //NetManager.targetOff(this)
        gdk.gui.hideWaiting(this.waitTab);
        gdk.Timer.clearAll(this);
        this.ctrl = null;
        this.model = null;
    }

    next() {
        if (!cc.isValid(this.node)) return;
        if (!this.model) return;
        if (!this.ctrl) return;
        if (!this.tasks.length) return;
        let task = this.tasks.shift();
        let ret = task.call(this);
        if (ret instanceof Promise) {
            // 异步函数
            ret.then(
                () => {
                    // 成功
                    gdk.Timer.callLater(this, this.next);
                },
                () => {
                    // 出现异常
                    this.tryAgain();
                },
            );
        } else {
            // 同步函数
            gdk.Timer.callLater(this, this.next);
        }
    }

    // 初始化失败重试
    tryAgain() {
        CC_DEBUG && cc.error("场景初始化失败");
        this.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
    }

    /** 转换坐标点 */
    _getPoint(size: cc.Size, pt: any, offsetY: number = 0): cc.Vec2 {
        return cc.v2(
            Math.round(pt.x + pt.width / 2),
            Math.round(size.height - pt.y + pt.height / 2) + offsetY,
        );
    }

    // 解析tiledMap数据
    parseMap() {

        // 解析地图文件
        let file = this.model.tmxAsset;
        let texValues = file.textures;
        let texKeys = file.textureNames;
        let textures = {};
        for (let i = 0; i < texValues.length; ++i) {
            textures[texKeys[i]] = true; // texValues[i];
        }

        // let imageLayerTextures = {};
        // texValues = file.imageLayerTextures;
        // texKeys = file.imageLayerTextureNames;
        // for (let i = 0; i < texValues.length; ++i) {
        //     imageLayerTextures[texKeys[i]] = texValues[i];
        // }

        let tsxFileNames = file['tsxFileNames'];
        let tsxFiles = file['tsxFiles'];
        let tsxMap = {};
        for (let i = 0; i < tsxFileNames.length; ++i) {
            if (tsxFileNames[i].length > 0) {
                tsxMap[tsxFileNames[i]] = tsxFiles[i].text;
            }
        }

        let TMXMapInfo: any = cc['TMXMapInfo'];
        let tmxXmlStr = file['tmxXmlStr'].replace(/<imagelayer(([\s\S])*?)<\/imagelayer>/g, '');
        let mapInfo = new TMXMapInfo(tmxXmlStr, tsxMap, textures, {});
        let getObjectGroup = function (name: string) {
            for (let i = 0; i < mapInfo._objectGroups.length; i++) {
                let item = mapInfo._objectGroups[i];
                if (item.name == name) {
                    return item;
                }
            }
            return {};
        }

        // 设计坐标
        let offsetY: number = 0;
        let ms: cc.Size = mapInfo._mapSize;
        let ts: cc.Size = mapInfo._tileSize;
        let size: cc.Size = cc.size(ms.width * ts.width, ms.height * ts.height);

        // 初始化对象对择器
        //this.model.fightSelector.initlize(size.width, size.height);

        // 解析路线
        let roads = this.model.tiled.roads = {};
        let lines = getObjectGroup("roads")._objects;
        for (let i = 0; i < lines.length; i++) {
            let mline: cc.Vec2[] = [];
            let line = lines[i];
            let name: string = line.name;
            let polylinePoints: any[] = line.polylinePoints;
            for (let j = 0, n = polylinePoints.length; j < n; j++) {
                let pt = polylinePoints[j];
                mline[j] = cc.v2(
                    Math.round(pt.x + line.x),
                    Math.round(size.height - (pt.y + line.y)),
                );
            }
            // 生成紧密的路径点
            let step = 10;
            let from = mline.shift();
            let road = [from.clone()];
            while (mline.length) {
                let to = mline.shift();
                while (true) {
                    let dis = MathUtil.distance(from, to);
                    let dx = (to.x - from.x) / dis * step;
                    let dy = (to.y - from.y) / dis * step;
                    if (Math.abs(to.x - from.x) > Math.ceil(Math.abs(dx)) ||
                        Math.abs(to.y - from.y) > Math.ceil(Math.abs(dy))) {
                        // 增加
                        from.x += dx;
                        from.y += dy;
                        road.push(from.clone());
                    } else {
                        // 到达
                        from = to;
                        road.push(from.clone());
                        break;
                    }
                }
            }
            // // 画路径点
            // let g = this.ctrl.floor.getComponent(cc.Graphics);
            // if (!g) {
            //     g = this.ctrl.floor.addComponent(cc.Graphics);
            //     g.fillColor = cc.color(0xff0000);
            //     road.forEach(p => {
            //         g.circle(p.x, p.y, 2);
            //         g.fill();
            //     });
            // }
            roads[name] = road;
        }

        // 怪物出生点坐标
        let spawns = this.model.tiled.spawns = {};
        let spawnPoints = getObjectGroup("spawns")._objects;
        for (let i = 0; i < spawnPoints.length; i++) {
            let pt = spawnPoints[i];
            let name = pt.name;
            let pos = this._getPoint(size, pt, offsetY);
            spawns[name] = pos;
            // 处理road，根据路径设置起点坐标
            let id = name.split('_').shift();
            let road = roads[id];
            if (!road) {
                cc.error('缺少路径：', id);
                roads[id] = [];
            } else {
                if (MathUtil.distance(road[0], pos) > MathUtil.distance(road[road.length - 1], pos)) {
                    // 离最后一点的距离更近，则反转数组
                    roads[id] = road.reverse();
                }
            }
        }

        // 传送门坐标
        let gates = this.model.tiled.gates = {};
        let gateGroup = getObjectGroup("gates");
        if (gateGroup) {
            let arr = gateGroup._objects;
            if (arr) {
                for (let i = 0; i < arr.length; i++) {
                    let pt = arr[i];
                    let name = pt.name;
                    gates[name] = this._getPoint(size, pt, offsetY);
                }
            }
        }

        // 防御塔位坐标点
        let towers = this.model.tiled.towers = {};
        let towerPoints = getObjectGroup("towers")._objects;
        for (let i = 0; i < towerPoints.length; i++) {
            let pt = towerPoints[i];
            let name = pt.name;
            towers[name] = this._getPoint(size, pt, offsetY);
        }

        // 被保护对象的坐标
        let proteges = this.model.tiled.proteges = [];
        let protegePoints = getObjectGroup("protege")._objects;
        for (let i = 0; i < protegePoints.length; i++) {
            let pt = protegePoints[i];
            proteges[i] = this._getPoint(size, pt, offsetY);
        }

        // 指挥官坐标
        let generalPoints = getObjectGroup("general")._objects;
        for (let i = 0; i < generalPoints.length; i++) {
            let pt = generalPoints[i];
            this.model.tiled.general = {
                name: pt.name,
                pos: this._getPoint(size, pt, offsetY),
            }
            break;
        }

        // // 挂机宝箱坐标
        // let hang = tmx.getObjectGroup("hang");
        // this.model.tiled.hang = null;
        // if (hang) {
        //     let hangPoints = hang.getObjects();
        //     for (let i = 0; i < hangPoints.length; i++) {
        //         let pt = hangPoints[i];
        //         this.model.tiled.hang = this._getPoint(size, pt, offsetY);
        //         break;
        //     }
        // }
    }


    // 创建英雄塔基座
    createTowers() {
        if (!cc.isValid(this.node)) return;
        let max: number;
        max = 100;
        let towers = this.model.tiled.towers;
        for (let key in towers) {
            let id = parseInt(key.substr(5));
            if (id > max) {
                // 不创建超出数量限制的塔位
                continue;
            }
            let pt = towers[key];
            let node: cc.Node = PvePool.get(this.ctrl.towerPrefab);
            node.zIndex = Math.floor(-pt.y);
            node.active = true;
            node.name = key + '_build_tower';
            let ctrl = node.getComponent(PveLittleGameBuildTowerCtrl);
            ctrl.sm = this.model;
            node.setPosition(pt);
            node.parent = this.ctrl.floor;
            this.model.towers.push(ctrl);
            ctrl.id = id;

            //创建怪物
            let node1: cc.Node = cc.instantiate(this.ctrl.enemyPrefab)//PvePool.get(this.ctrl.enemyPrefab);
            node1.zIndex = Math.floor(-pt.y);
            node1.name = key + '_enemy';
            let ctrl1 = node1.getComponent(PveLittleGameEnemyCtrl);
            let cfg = ConfigManager.getItemByField(Little_gameCfg, 'point', id, { 'type': this.model.id })
            ctrl1.cfg = cfg
            ctrl1.type = cfg.skin[0]
            ctrl1.sceneModel = this.model;
            ctrl1.towerNode = node;
            node1.setPosition(pt);
            node1.parent = this.ctrl.thing;
            ctrl1.getRoadPosIndex();
            this.model.enemies.push(ctrl1);

            if (id == 1) {
                let btnCtrl = node1.getComponent(GuideBind)
                if (!btnCtrl) {
                    btnCtrl = node1.addComponent(GuideBind)
                }
                btnCtrl.guideIds = [22008]
                btnCtrl.bindBtn()
            }

            // ctrl.sceneCtrl = this.ctrl;
            // node.zIndex = Math.floor(-pt.y);
            // node.name = key + '_build_tower';
            // node.setPosition(pt);
            // node.parent = this.ctrl.floor;
            // this.model.towers.push(ctrl);
        }

        // // 生存训练特殊处理
        // let stage = this.model.stageConfig
        // if (stage && stage.copy_id == CopyType.Survival && copyCfg.num < 6) {
        //     for (let i = this.model.towers.length - 1; i >= 0; i--) {
        //         let ctrl = this.model.towers[i];
        //         if (ctrl.id == 5) {
        //             this.model.towers.splice(i, 1);
        //             PvePool.put(ctrl.node);
        //         }
        //     }
        // }

        // 对塔座进行排序
        GlobalUtil.sortArray(this.model.towers, (a, b) => {
            return a.id - b.id;
        });
    }
    // 创建怪物
    createEnemys() {
        // if (!cc.isValid(this.node)) return;
        // let max: number;
        // max = 100;
        // let towers = this.model.tiled.towers;
        // for (let key in towers) {
        //     let id = parseInt(key.substr(5));
        //     if (id > max) {
        //         // 不创建超出数量限制的塔位
        //         continue;
        //     }
        //     let pt = towers[key];
        //     let node: cc.Node = cc.instantiate(this.ctrl.enemyPrefab)//PvePool.get(this.ctrl.enemyPrefab);
        //     node.zIndex = Math.floor(-pt.y);
        //     node.name = key + '_enemy';
        //     let ctrl = node.getComponent(PveLittleGameEnemyCtrl);
        //     let cfg = ConfigManager.getItemByField(Little_gameCfg, 'point', id, { 'type': this.model.id })
        //     ctrl.cfg = cfg
        //     ctrl.type = cfg.skin[0]
        //     ctrl.sceneModel = this.model;
        //     node.setPosition(pt);
        //     node.parent = this.ctrl.thing;
        //     ctrl.getRoadPosIndex();
        //     this.model.enemies.push(ctrl);
        //     //ctrl.id = id;

        // }
    }

    // 创建指挥官
    createGeneral() {
        let node: cc.Node = PvePool.get(this.ctrl.generalPrefab);
        let general: PveLittleGameGeneralCtrl = node.getComponent(PveLittleGameGeneralCtrl);
        general.sceneModel = this.model;
        general.hpLb.string = this.model.generalHp + '';
        general.road = this.model.tiled.roads['1']
        node.name = 'general_0';
        node.setPosition(this.model.tiled.general.pos.x, this.model.tiled.general.pos.y - 50);
        node.parent = this.ctrl.thing;
        this.model.generals = [general]


        // general.model = new PveGeneralModel();
        // general.model.id = info.level;
        // general.model.ctrl = general;
        // general.model.info = info;
        // general.model.orignalPos = this.model.tiled.general.pos;
        // general.sceneModel = this.model;
        // general.node.name = 'general_0';
        // general.node.setPosition(general.model.orignalPos);
        // this.model.addFight(general);
        // this.createWeapon(info);    // 创建神器指挥官
        // this.model.generals = this.model.generals;
    }

    // 需要滚动时，则自动滚动到最右边
    scrollRight() {
        if (!cc.isValid(this.node)) return;
        if (!this.model) return;
        if (!this.ctrl) return;
        if (!this.ctrl.scrollView) return;
        if (!this.ctrl.scrollView.enabled) return;
        return new Promise((resolve, reject) => {
            let scrollView = this.ctrl.scrollView;
            scrollView.stopAutoScroll();
            scrollView.scrollToLeft(0.5, true);
            gdk.Timer.once(550, this, () => {
                scrollView.stopAutoScroll();
                scrollView.scrollToRight(1.0, true);
                gdk.Timer.once(1050, this, () => {
                    scrollView.stopAutoScroll();
                    resolve('OK');
                });
            });
        });
    }

    onFinish() {
        this.model.state = PveSceneState.Fight;
        this.fsm.sendEvent(PveFsmEventId.PVE_SCENE_FIGHT);
        //this.finish()
    }
}
