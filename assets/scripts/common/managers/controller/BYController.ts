import { SoldierCfg, TechCfg, Tech_stoneCfg } from '../../../a/config';
import { BYEventId } from '../../../view/bingying/enum/BYEventId';
import BYModel from '../../../view/bingying/model/BYModel';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import HeroModel from '../../models/HeroModel';
import SoldierModel from '../../models/SoldierModel';
import { RedPointEvent } from '../../utils/RedPointUtils';
import ConfigManager from '../ConfigManager';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';

/**
 * @Description: 兵营控制器
 * @Author: weiliang.huang
 * @Date: 2019-05-06 11:52:00
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-23 17:05:56
 */
export default class BYController extends BaseController {

    model: BYModel = null

    get gdkEvents(): GdkEventArray[] {
        return [];
    }

    get netEvents(): NetEventArray[] {
        return [
            // [icmsg.BarrackListRsp.MsgType, this._onBarrackListRsp],
            // [icmsg.BarrackTechUpRsp.MsgType, this._onBarrackTechUpRsp],
            // [icmsg.BarrackUnlockRsp.MsgType, this._onBarrackUnlockRsp],
            // [icmsg.BarrackSoldiersRsp.MsgType, this._onBarrackSoldiersRsp],
            [icmsg.BarrackLevelsRsp.MsgType, this._onBarrackLevelsRsp],
            [icmsg.SoldierSkinStateRsp.MsgType, this._onSoldierSkinStateRsp],
            [icmsg.EnergizeStateRsp.MsgType, this._onEnergizeStateRsp],
            [icmsg.EnergizeDrawRsp.MsgType, this._onEnergizeDrawRsp],
            [icmsg.EnergizeGetRsp.MsgType, this._onEnergizeGetRsp],
            [icmsg.SoldierTechResearchListRsp.MsgType, this._onSoldierTechResearchListRsp],
            [icmsg.SoldierTechResearchAwardRsp.MsgType, this._onSoldierTechResearchAwardRsp],
            [icmsg.SoldierTechDoResearchRsp.MsgType, this._onSoldierTechDoResearchRsp],
            [icmsg.SoldierTechListRsp.MsgType, this._onSoldierTechListRsp],
            [icmsg.SoldierTechLevelUpRsp.MsgType, this._onSoldierTechLevelUpRsp],
            [icmsg.SoldierTechEquipStoneRsp.MsgType, this._onSoldierTechEquipStoneRsp],
        ];
    }

    onStart() {
        this.model = ModelManager.get(BYModel)
    }

    onEnd() {
        this.model = null
    }

    _onBarrackLevelsRsp(data: icmsg.BarrackLevelsRsp) {
        this.model.byLevelsData = data.levels
        gdk.e.emit(BYEventId.UPDATE_BY_INFO)
    }

    _onSoldierSkinStateRsp(data: icmsg.SoldierSkinStateRsp) {
        this.model.byarmyState = data;
    }
    // byTechUpReq(e: gdk.Event) {
    //     let msg = new BarrackTechUpReq()
    //     msg.id = e.data
    //     NetManager.send(msg)
    // }

    // bySoldiersReq() {
    //     let msg = new BarrackSoldiersReq()
    //     NetManager.send(msg)
    // }
    // _onBarrackListRsp(data: BarrackListRsp) {
    //     let byInfos = {}
    //     let byTechInfos = {}
    //     let infos = data.infos
    //     let techs = data.techs
    //     for (let index = 0; index < infos.length; index++) {
    //         const data = infos[index];
    //         byInfos[data.id] = data
    //     }
    //     for (let index = 0; index < techs.length; index++) {
    //         const data = techs[index];
    //         byTechInfos[data.id] = data
    //     }
    //     this.model.byInfos = byInfos
    //     this.model.byTechInfos = byTechInfos
    // }

    // _onBarrackTechUpRsp(data: BarrackTechUpRsp) {
    //     let byInfos = this.model.byInfos
    //     let byTechInfos = this.model.byTechInfos
    //     byInfos[data.info.id] = data.info
    //     byTechInfos[data.tech.id] = data.tech
    //     gdk.e.emit(BYEventId.UPDATE_BY_INFO)

    //     gdk.gui.showMessage("升级成功");
    //     JumpUtils.updatePowerTip(data.oldPower, data.newPower);
    // }

    // _onBarrackUnlockRsp(data: BarrackUnlockRsp) {
    //     let byInfos = this.model.byInfos
    //     let byTechInfos = this.model.byTechInfos
    //     let info = new BarrackInfo()
    //     info.id = data.id
    //     info.exp = 0
    //     info.level = 1
    //     byInfos[info.id] = info

    //     // 开启的科技id
    //     let openId = data.id * 100 + 1
    //     let tech = new BarrackTech()
    //     tech.id = openId
    //     tech.level = 0
    //     byTechInfos[tech.id] = tech

    //     gdk.e.emit(BYEventId.UPDATE_BY_UNLOCK)
    // }

    // _onBarrackSoldiersRsp(data: BarrackSoldiersRsp) {
    //     let soldiers = this.model.soldiers
    //     for (let index = 0; index < data.list.length; index++) {
    //         const id = data.list[index];
    //         soldiers[id] = id
    //     }
    //     gdk.e.emit(BYEventId.UPDATE_BY_SOLDIERS)
    // }

    /**聚能魔方 状态 */
    _onEnergizeStateRsp(resp: icmsg.EnergizeStateRsp) {
        this.model.energizeRound = resp.round;
        this.model.energizeTodayNum = resp.today;
        this.model.energizeDrawProgress = resp.total;
        this.model.energizeDrawMap = {};
        resp.places.forEach(p => {
            if (p.items.typeId !== 0 && p.items.num !== 0) {
                this.model.energizeDrawMap[p.place] = p;
            }
        });
        this.model.energizeDrawMap = this.model.energizeDrawMap;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**聚能魔方 抽奖 */
    _onEnergizeDrawRsp(resp: icmsg.EnergizeDrawRsp) {
        this.model.energizeRound = resp.round;
        this.model.energizeTodayNum = resp.today;
        this.model.energizeDrawProgress = resp.total;
        this.model.energizeDrawMap[resp.place.place] = resp.place;
        this.model.energizeDrawMap = this.model.energizeDrawMap;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**聚能魔方 领取奖励 */
    _onEnergizeGetRsp(resp: icmsg.EnergizeGetRsp) {
        this.model.energizeRound = resp.round;
        this.model.energizeTodayNum = resp.today;
        this.model.energizeDrawProgress = resp.total;
        this.model.energizeDrawMap = {};
    }

    /**士兵科技 研究列表 */
    _onSoldierTechResearchListRsp(resp: icmsg.SoldierTechResearchListRsp) {
        this.model.techResearchMap = {};
        resp.list.forEach(l => {
            if (l.type !== 2) {
                this.model.techResearchMap[l.type] = l;
            }
        })
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**士兵科技 领取奖励 */
    _onSoldierTechResearchAwardRsp(resp: icmsg.SoldierTechResearchAwardRsp) {
        NetManager.send(new icmsg.SoldierTechResearchListReq());
    }

    /**士兵科技 开始研究 */
    _onSoldierTechDoResearchRsp(resp: icmsg.SoldierTechDoResearchRsp) {
        this.model.techResearchMap[resp.research.type] = resp.research;
    }

    /**士兵科技 列表 */
    _onSoldierTechListRsp(resp: icmsg.SoldierTechListRsp) {
        this.model.techMap = {};
        resp.list.forEach(l => {
            if (l.type !== 2) {
                this.model.techMap[l.type] = l;
            }
        })
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**士兵科技 科技升级 */
    _onSoldierTechLevelUpRsp(resp: icmsg.SoldierTechLevelUpRsp) {
        let info = this.model.techMap[resp.soldierTech.type];
        let oldLv = info ? info.lv : 0;
        this.model.techMap[resp.soldierTech.type] = resp.soldierTech;
        if (oldLv < resp.soldierTech.lv) {
            let newCfg = ConfigManager.getItemByField(TechCfg, 'type', resp.soldierTech.type, { lv: resp.soldierTech.lv });
            gdk.e.emit(BYEventId.BY_TECH_LV_UP, { type: resp.soldierTech.type, oldLv: oldLv, newLv: resp.soldierTech.lv });

            //更新士兵属性
            let m = ModelManager.get(SoldierModel);
            for (let key in m.heroSoldiers) {
                let soldierType = m.heroSoldiers[key];
                for (let soldierId in soldierType.items) {
                    let soldierCfg = ConfigManager.getItemById(SoldierCfg, soldierId);
                    let type = resp.soldierTech.type;
                    if (soldierCfg.type == type) {
                        soldierType.items[soldierId].atkG += newCfg.atk_g;
                        soldierType.items[soldierId].defG += newCfg.def_g;
                        soldierType.items[soldierId].hpG += newCfg.hp_g;
                    }
                }
            }
        }
    }

    /**士兵科技 能量石穿戴 卸下 替换 */
    _onSoldierTechEquipStoneRsp(resp: icmsg.SoldierTechEquipStoneRsp) {
        let map = this.model.techMap[resp.soldierTech.type];
        let slots = map ? map.slots : [0, 0, 0, 0];
        let oldItemId;
        let newItemId;
        for (let i = 0; i < slots.length; i++) {
            if (slots[i] !== resp.soldierTech.slots[i]) {
                oldItemId = slots[i];
                newItemId = resp.soldierTech.slots[i];
                break;
            }
        }
        //更新士兵属性
        let m = ModelManager.get(SoldierModel);
        let oldCfg = oldItemId ? ConfigManager.getItemById(Tech_stoneCfg, oldItemId) : null;
        let newCfg = newItemId ? ConfigManager.getItemById(Tech_stoneCfg, newItemId) : null;
        for (let key in m.heroSoldiers) {
            let soldierType = m.heroSoldiers[key];
            for (let soldierId in soldierType.items) {
                let soldierCfg = ConfigManager.getItemById(SoldierCfg, soldierId);
                let type = oldCfg ? oldCfg.career_type : newCfg.career_type;
                if (soldierCfg.type == type) {
                    soldierType.items[soldierId].atkG += (newCfg ? newCfg.atk_g : 0) - (oldCfg ? oldCfg.atk_g : 0);
                    soldierType.items[soldierId].defG += (newCfg ? newCfg.def_g : 0) - (oldCfg ? oldCfg.def_g : 0);
                    soldierType.items[soldierId].hpG += (newCfg ? newCfg.hp_g : 0) - (oldCfg ? oldCfg.hp_g : 0);
                }
            }
        }
        //
        this.model.techMap[resp.soldierTech.type] = resp.soldierTech;

        //清空本地战斗数据缓存
        let model = ModelManager.get(HeroModel)
        model.fightHeroIdxTower = {};
        model.fightHeroIdx = {};
        model.heroAttrs = {};
        let sModel = ModelManager.get(SoldierModel)
        sModel.heroSoldiers = {}
    }
}