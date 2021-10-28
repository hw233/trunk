import { Royal_groupCfg, Royal_sceneCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import CopyModel, { CopyType } from '../../../../common/models/CopyModel';
import RoyalModel from '../../../../common/models/RoyalModel';
import GuideUtil from '../../../../common/utils/GuideUtil';
import PanelId from '../../../../configs/ids/PanelId';
import RandomSkillViewCtrl from '../../../royalArena/ctrl/fight/RandomSkillViewCtrl';
import PveRoadMoveEffectCtrl from '../../ctrl/base/PveRoadMoveEffectCtrl';
import PvePool from '../../utils/PvePool';
import PveSceneBaseAction from '../base/PveSceneBaseAction';



/**
 * PVE场景初始化
 * @Author: sthoo.huang
 * @Date: 2019-03-18 18:37:54
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-29 11:36:27
 */
@gdk.fsm.action("PveSceneRoadShowAction", "Pve/Scene")
export default class PveSceneRoadShowAction extends PveSceneBaseAction {



    //streak_args = ["icon/tuowei_001", 0.5, 1, 64]
    //roadName: string[] = []

    createEffectTime: number = 2;

    roadData: any = {}

    moveNode: cc.Node[] = [];

    //英雄觉醒参数
    needCheck: boolean = false;
    //openHeroAwake: boolean = false;
    guideGroupId: number = 0;

    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }

    onEnter() {
        super.onEnter();
        this.moveNode = []
        let spawns = this.model.tiled.spawns;
        let gates = this.model.tiled.gates;
        let roads = this.model.tiled.roads;
        this.needCheck = false;

        //皇家竞技场显示随机技能
        if (!this.model.isDefender && this.model.stageConfig.copy_id == CopyType.NONE && !this.model.isMirror) {
            let show = this.model.arenaSyncData.fightType == 'ROYAL' || this.model.arenaSyncData.fightType == 'ROYAL_TEST'
            if (show) {
                let rmodel = ModelManager.get(RoyalModel)
                if (rmodel.addSkillId <= 0) {
                    let cb = (cfg: Royal_groupCfg) => {
                        rmodel.addSkillId = cfg.buff_id//cfg.buff_id;
                    }
                    gdk.panel.open(PanelId.RandomSkillView, (node) => {
                        let c = node.getComponent(RandomSkillViewCtrl);
                        let cfg = ConfigManager.getItemByField(Royal_sceneCfg, 'stage_id', this.model.stageConfig.id);
                        //let cfg = ConfigManager.getItemByField(Royal_sceneCfg, 'stage_id', 1001);
                        c.play(cfg, cb);
                    });
                }
            }
        }

        //创建线路移动特效
        for (let key in spawns) {
            let tem = key.split('_')
            let id = tem.shift();
            if (tem[0] == "4") {
                continue;
            }
            let keyNum = parseInt(id) % 10
            if (this.roadData[keyNum + '']) {
                this.roadData[keyNum + ''].push(id)
            } else {
                this.roadData[keyNum + ''] = [id]
            }
            gdk.Timer.once(3000 * (this.roadData[keyNum + ''].length - 1), this, () => {
                if (roads[id]) {
                    let road: cc.Vec2[] = roads[id].concat();
                    if (this.ctrl) {
                        for (let j = 0; j < 3; j++) {
                            let temRoad = road.concat()
                            let node: cc.Node = PvePool.get(this.ctrl.roadMovePrefab);
                            let ctrl: PveRoadMoveEffectCtrl = node.getComponent(PveRoadMoveEffectCtrl);
                            node.setParent(this.model.ctrl.hurt)
                            let gateList: cc.Vec2[] = [];

                            for (let gkey in gates) {
                                //let pt: cc.Vec2 = gates[key];
                                let args: any[] = gkey.split('_');
                                if (args[0] == id && roads[args[4]]) {
                                    gateList = roads[args[4]].concat();
                                }
                            }
                            ctrl.initData(key, temRoad, j * 0.2, gateList, this.roadMoveFinish, this);
                            this.moveNode.push(node);
                        }
                    }
                }
            })
        }
        //super.onEnter();

        // 英雄觉醒副本
        if (this.model.stageConfig.copy_id == CopyType.HeroAwakening) {
            this.needCheck = true;
            this.guideGroupId = this.model.stageConfig.guide_id;
        }
    }

    update(dt: number) {
        //super.update(dt);
        if (this.needCheck) {
            if (GuideUtil.getCurGuide() == null && !this.copyModel.openHeroAwake) {
                this.copyModel.openHeroAwake = true;
                gdk.panel.setArgs(PanelId.PveHeroAwakeningView, this.model.stageConfig)
                gdk.panel.open(PanelId.PveHeroAwakeningView);
            }
        }
    }

    onExit() {
        super.onExit();
        this.roadData = {}
        gdk.Timer.clearAll(this);
        if (this.moveNode.length > 0) {
            this.moveNode.forEach(node => {
                PvePool.put(node);
            })
            this.moveNode.length = 0;
        }
    }

    roadMoveFinish(roadNode: cc.Node, roadName: string) {
        //cc.log('---------------roadMoveFinish-------------' + roadName)
        PvePool.put(roadNode);
        let index = this.moveNode.indexOf(roadNode);
        if (index > -1) {
            this.moveNode.splice(index, 1);
        }
    }
}
