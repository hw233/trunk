import ConfigManager from '../../../../common/managers/ConfigManager';
import HeroUtils from '../../../../common/utils/HeroUtils';
import NetManager from '../../../../common/managers/NetManager';
import PveFightLoadResAction from '../base/PveFightLoadResAction';
import PveHeroCtrl from '../../ctrl/fight/PveHeroCtrl';
import PveHeroModel from '../../model/PveHeroModel';
import PvePool from '../../utils/PvePool';
import PveSceneState from '../../enum/PveSceneState';
import PveTool from '../../utils/PveTool';
import { Copy_assistCfg } from '../../../../a/config';
import { HeroMap } from '../../model/PveSceneModel';
import { PveHeroDir } from '../../const/PveDir';

/**
 * Pve Hero资源加载动作
 * @Author: sthoo.huang
 * @Date: 2019-03-18 18:19:06
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-28 13:53:06
 */

@gdk.fsm.action("PveHeroLoadResAction", "Pve/Hero")
export default class PveHeroLoadResAction extends PveFightLoadResAction {

    model: PveHeroModel;
    ctrl: PveHeroCtrl;

    loadRes() {
        // 获取英雄详细属性
        let model = this.model;
        if (model.item.series > 800000) {
            // 新奖杯模式的英雄
            let heroMap = this.sceneModel.heroMap;
            model.info = heroMap[model.item.series];
            if (model.info) {
                this.loadHeroRes();
            }
        } else if (model.item.series > 700000) {
            // 赏金的英雄
            let heroMap = this.sceneModel.heroMap;
            model.info = heroMap[model.item.series];
            if (model.info) {
                // 数据已经存在，则不需要重复请求
                this.loadHeroRes();
            } else {
                // 数据还没准备好, 向服务器请求雇佣的英雄详细数据
                let smsg = new icmsg.BountyFightQueryReq();
                smsg.missionId = this.sceneModel.bountyMission.missionId;
                smsg.heroTypeIds = [model.config.id];
                smsg.general = false;
                NetManager.send(smsg, (rmsg: icmsg.BountyFightQueryRsp) => {
                    let info = rmsg.heroList[0] as icmsg.FightHero;
                    let index = 700000 + info.heroType % 300000;
                    heroMap[info.heroId] = info;
                    if (!cc.isValid(this.node)) return;
                    if (!this.model || this.model.item.series != index) return;
                    this.model.info = info;
                    this.loadHeroRes();
                }, this);
            }
        } else if (model.item.series > 600000) {
            // 雇佣的英雄
            let heroMap = this.sceneModel.heroMap;
            model.info = heroMap[model.item.series];
            if (model.info) {
                // 数据已经存在，则不需要重复请求
                this.loadHeroRes();
            } else {
                // 数据还没准备好, 向服务器请求雇佣的英雄详细数据
                let smsg = new icmsg.MercenaryFightReq();
                smsg.index = model.item.series % 600000;
                smsg.isTd = true;
                NetManager.send(smsg, (rmsg: icmsg.MercenaryFightRsp) => {
                    let index = rmsg.index + 600000;
                    heroMap[index] = rmsg.hero;
                    if (!cc.isValid(this.node)) return;
                    if (!this.model || this.model.item.series != index) return;
                    this.model.info = rmsg.hero;
                    this.loadHeroRes();
                }, this);
            }
        } else {
            // 正常的英雄
            let heroMap: HeroMap = this.sceneModel.heroMap;
            model.info = heroMap[model.heroId];
            if (model.info) {
                // 数据已经存在，则不需要重复请求
                this.loadHeroRes();
            } else {
                // 数据还没准备好, 向服务器请求英雄详细数据
                HeroUtils.getFightHeroInfo(model.heroId, true, (heroList) => {
                    let info = heroList[0] as icmsg.FightHero;
                    heroMap[info.heroId] = info;
                    if (!cc.isValid(this.node)) return;
                    if (!this.model || this.model.heroId != info.heroId) return;
                    this.model.info = info;
                    this.loadHeroRes();
                });
            }
        }
    }

    private get delayFrames(): number {
        let n = this.ctrl.tower.id;
        if (this.ctrl.sceneModel.isMirror) {
            n *= 2;
        }
        return n % 20;
    }

    loadHeroRes() {
        switch (this.sceneModel.state) {
            case PveSceneState.Fight:
            case PveSceneState.Pause:
                this.loadHeroResLater();
                break;

            default:
                gdk.Timer.frameOnce(this.delayFrames, this, this.loadHeroResLater);
                break;
        }
    }
    loadHeroResLater() {
        if (!this.active) return;
        if (!this.model) return;
        if (this.sceneModel.showHeroEffect) {
            // 显示出现特效
            let ctrl = this.sceneModel.ctrl;
            let heroId: number = this.model.heroId;
            let cfgs = ConfigManager.getItems(Copy_assistCfg, { 'stage_id': this.sceneModel.id });
            let assist = cfgs && cfgs.some(cfg => cfg.hero_id == heroId);
            let skin = assist ? 'E_com_assist_chusheng' : 'E_com_chusheng';
            PveTool.createSpine(
                ctrl.spineNodePrefab,
                ctrl.effect,
                `spine/common/${skin}/${skin}`,
                `hit`,
                false,
                Math.max(1, this.sceneModel.timeScale),
                (spine: sp.Skeleton, resId: string, res: sp.SkeletonData) => {
                    if (!cc.isValid(spine.node)) return;
                    // 清理并回收spine节点
                    PveTool.clearSpine(spine);
                    PvePool.put(spine.node);
                    // 完成动作
                    if (this.active) {
                        gdk.Timer.clear(this, this.superLoadRes);
                        this.superLoadRes();
                    }
                },
                () => {
                    if (!this.model || this.model.heroId != heroId) return false;
                    return true;
                },
                this.ctrl.tower.node.getPos(),
                false,
                false,
            );
            gdk.Timer.once(400, this, this.superLoadRes);
            // 显示攻击范围
            this.ctrl.tower.showAtkDis();
        } else {
            // 不显示出现特效，则直接加载
            this.superLoadRes();
        }
    }

    setAnimation() {
        let c: PveHeroCtrl = this.ctrl as PveHeroCtrl;
        let d: string = c.tower.name.charAt(0);
        this.model.dir = d == 'r' ? PveHeroDir.RIGHT : PveHeroDir.LEFT;
        super.setAnimation();
    }

    superLoadRes() {
        switch (this.sceneModel.state) {
            case PveSceneState.Fight:
            case PveSceneState.Pause:
                this.superLoadResLater();
                break;

            default:
                gdk.Timer.frameOnce(this.delayFrames, this, this.superLoadResLater);
                break;
        }
    }
    superLoadResLater() {
        if (!this.active) return;
        if (!this.model) return;
        super.loadRes();
    }

    onExit() {
        super.onExit();
        gdk.Timer.clear(this, this.superLoadRes);
        gdk.Timer.clear(this, this.loadHeroResLater);
        gdk.Timer.clear(this, this.superLoadResLater);
        NetManager.targetOff(this);
    }
}