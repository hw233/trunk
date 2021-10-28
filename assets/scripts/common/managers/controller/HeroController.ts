import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ConfigManager from '../ConfigManager';
import CopyModel, { HangItemInfo } from '../../models/CopyModel';
import EquipModel from '../../models/EquipModel';
import EquipUtils from '../../utils/EquipUtils';
import GlobalUtil from '../../utils/GlobalUtil';
import GuideUtil from '../../utils/GuideUtil';
import HeroModel from '../../models/HeroModel';
import HeroUtils from '../../utils/HeroUtils';
import JumpUtils from '../../utils/JumpUtils';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../models/RoleModel';
import SoldierModel from '../../models/SoldierModel';
import { BagItem } from '../../models/BagModel';
import { Copy_stageCfg, Hero_careerCfg, HeroCfg } from '../../../a/config';
import { RoleEventId } from '../../../view/role/enum/RoleEventId';

/**
 * @Description: 装备数据管理器
 * @Author: weiliang.huang
 * @Date: 2019-04-10 10:07:00
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-27 15:20:13
 */

export default class HeroController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return []
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.HeroListRsp.MsgType, this._onHeroListReq],
            [icmsg.HeroInfoRsp.MsgType, this.onHeroInfoRsq],
            [icmsg.HeroUpdateRsp.MsgType, this._onHeroUpdateRsp],
            // [icmsg.HeroComposeStatusRsp.MsgType, this._onHeroComposeStatusRsp],
            [icmsg.HeroDetailRsp.MsgType, this._onHeroDetailRsp],
            [icmsg.HeroEquipUpdateRsp.MsgType, this._onHeroEquipUpdateRsp],
            [icmsg.HeroLevelupRsp.MsgType, this._onHeroLevelupRsp],
            [icmsg.HeroAttrRsp.MsgType, this._onHeroAttrRsp],
            [icmsg.HeroCareerUpRsp.MsgType, this._onHeroCareerUpRsp],
            [icmsg.HeroCareerTransRsp.MsgType, this._onHeroCareerTransRsp],
            [icmsg.HeroStarupRsp.MsgType, this._onHeroStarupRsp],
            [icmsg.HeroSoldierActiveRsp.MsgType, this._onHeroSoldierActiveRsp],
            [icmsg.HeroPowerUpdateRsp.MsgType, this._onHeroPowerUpdateRsp],
            [icmsg.HeroStatusLockRsp.MsgType, this._onHeroStatusLockRsp],
            // [icmsg.HeroComposeRedDotSwitchRsp.MsgType, this._onHeroComposeRedPointSwitchRsp],
            // [icmsg.HeroEssenceBuyTimesRsp.MsgType, this._onHeroEssenceBuyTimesRsp],
            // [icmsg.HeroEssenceConvertRsp.MsgType, this._onHeroEssenceConvertRsp],
            // [icmsg.GeneralChangeWeaponRsp.MsgType, this._onGeneralChangeWeaponRsp],
            [icmsg.BattleArrayQueryRsp.MsgType, this._onBattleArrayQueryRsp],
            [icmsg.SoldierSkinOnRsp.MsgType, this._onSoldierSkinOnRsp],
            [icmsg.HeroMaxStarUpRsp.MsgType, this._onHeroMaxStarUpRsp],
            [icmsg.HeroAwakeStateRsp.MsgType, this._onHeroAwakeStateRsp],
            [icmsg.HeroAwakeMissonUpdateRsp.MsgType, this._onHeroAwakeMissonUpdateRsp],
            [icmsg.HeroMysticLinkRsp.MsgType, this._onHeroMysticLinkRsp],
            [icmsg.HeroMysticUnLinkRsp.MsgType, this._onHeroMysticUnLinkRsp],
            [icmsg.HeroMysticSkillUpRsp.MsgType, this._onHeroMysticSkillUpRsp],
        ];
    }

    heroModel: HeroModel = null
    equipModel: EquipModel = null
    soldierModel: SoldierModel = null;

    onStart() {
        this.heroModel = ModelManager.get(HeroModel)
        this.equipModel = ModelManager.get(EquipModel)
        this.soldierModel = ModelManager.get(SoldierModel)
        this.heroModel.idItems = {}
        this.heroModel.heroInfos = []
        HeroUtils.initJobRelatedInfo()
        HeroUtils.initHeroCareerInfo()
    }

    onEnd() {
        this.heroModel = null;
        this.equipModel = null;
        this.soldierModel = null;
        HeroUtils.clear();
    }

    /**服务器返回英雄数据 */
    _onHeroListReq(data: icmsg.HeroListRsp) {
        this.heroModel.idItems = {}
        this.heroModel.heroInfos = []
        let list = data.list
        let len = list.length
        let heroIds = []

        for (let index = 0; index < len; index++) {
            const element: icmsg.HeroInfo = list[index];
            HeroUtils.updateHeroInfo(element.heroId, element, len == index + 1)

            let heroCfg = ConfigManager.getItemById(HeroCfg, element.typeId)
            if (element.star >= 11 && heroCfg.awake) {
                heroIds.push(element.heroId)
            }
        }
        GlobalUtil.sortArray(this.heroModel.heroInfos, (a, b) => {
            return a.series - b.series
        })
        this.heroModel.fightHeroIdxTower = {};
        this.heroModel.fightHeroIdx = {};


        //请求可以觉醒的英雄数据
        if (heroIds.length > 0) {
            let msg = new icmsg.HeroAwakeStateReq()
            msg.heroIds = heroIds
            NetManager.send(msg)
        }
    }

    /**更新部分英雄数据 */
    onHeroInfoRsq(data: icmsg.HeroInfoRsp) {
        let list = data.list
        let len = list.length
        for (let index = 0; index < len; index++) {
            const element: icmsg.HeroInfo = list[index];
            HeroUtils.updateHeroInfo(element.heroId, element, len == index + 1)
        }
        GlobalUtil.sortArray(this.heroModel.heroInfos, (a, b) => {
            return a.series - b.series
        })
    }
    /**
     * 更新英雄数据
     */
    _onHeroUpdateRsp(data: icmsg.HeroUpdateRsp) {
        let list = data.updateList
        let len = list.length
        let delList = data.deleteList
        let len2 = delList.length
        for (let index = 0; index < len; index++) {
            const e = list[index];
            HeroUtils.removeFightHeroInfo(e.heroId);
            HeroUtils.updateHeroInfo(e.heroId, e, len == index + 1)
        }
        for (let index = 0; index < len2; index++) {
            const id = delList[index];
            HeroUtils.removeFightHeroInfo(id);
            HeroUtils.removeHeroById(id, len2 == index + 1)
        }
    }

    /**获取英雄信息 */
    _onHeroDetailRsp(data: icmsg.HeroDetailRsp) {
        let heroAttrs = this.heroModel.heroAttrs
        let heroDeatils = this.heroModel.heroDeatils
        let heroId = data.heroId
        heroAttrs[heroId] = data.detail.attr
        heroDeatils[heroId] = data.detail
        // let careers = data.detail.careers
        // for (let index = 0; index < careers.length; index++) {
        //     const e = careers[index];
        //     HeroUtils.updateHeroJobLv(heroId, e.careerId, e.careerLv)
        // }
        HeroUtils.removeFightHeroInfo(heroId)
        gdk.e.emit(RoleEventId.UPDATE_HERO_ATTR, heroId)
    }

    /**英雄装备更新
     */
    _onHeroEquipUpdateRsp(data: icmsg.HeroEquipUpdateRsp) {
        let heroId = data.heroId
        let list = data.equips
        let heroIdItems = this.heroModel.idItems
        let curHero: BagItem = heroIdItems[heroId]
        if (!curHero) {
            return
        }
        // let extInfo = <HeroInfo>curHero.extInfo
        // let oldEquips = extInfo.slots
        // extInfo.equips = list
        // for (let index = 0; index < list.length; index++) {
        //     let curEId = list[index];
        //     let oldEid = oldEquips[index] ? oldEquips[index].equipId : 0
        //     if (curEId != oldEid) {
        //         EquipUtils.updateEquipState(oldEid, 0)
        //         EquipUtils.updateEquipState(curEId, heroId)
        //     }
        // }
        //CC_DEBUG && cc.error("装备大改，待调整。。。")
        if (curHero.series == data.heroId) {
            let extInfo = <icmsg.HeroInfo>curHero.extInfo
            let bodyEquips = extInfo.slots
            for (let i = 0; i < data.equips.length; i++) {
                if (bodyEquips[i]) {
                    let oldEid = bodyEquips[i].equipId
                    if (bodyEquips[i].equipId != data.equips[i]) {
                        bodyEquips[i].equipId = data.equips[i]
                        EquipUtils.updateEquipState(oldEid, 0)
                        EquipUtils.updateEquipState(data.equips[i], heroId)
                    }
                } else {
                    let solt = new icmsg.HeroEquipSlot()
                    solt.equipId = data.equips[i]
                    solt.rubies = []
                    extInfo.slots[i] = solt
                    EquipUtils.updateEquipState(data.equips[i], heroId)
                }
            }
        }
        gdk.e.emit(RoleEventId.UPDATE_HERO_LIST)
    }

    /**英雄经验值返回 */
    _onHeroLevelupRsp(data: icmsg.HeroLevelupRsp) {
        let heroId = data.heroId
        let heroLv = data.heroLv
        let heroIdItems = this.heroModel.idItems
        let item: BagItem = heroIdItems[heroId]
        if (item) {
            let heroInfo = <icmsg.HeroInfo>item.extInfo
            if (heroLv != heroInfo.level) {

                let heroNumByLv = this.heroModel.heroNumByLv;
                if (heroInfo.level in heroNumByLv) {
                    heroNumByLv[heroInfo.level]--;
                }
                if (heroLv in heroNumByLv) {
                    heroNumByLv[heroLv]++;
                } else {
                    heroNumByLv[heroLv] = 1;
                }
                GuideUtil.activeGuide("hero#lvup")
                gdk.e.emit(RoleEventId.UPDATE_HERO_LIST)
                // //英雄升级重新请求士兵信息
                // let soldiers = this.soldierModel.heroSoldiers
                // let type: SoldierType = soldiers[data.heroId]
                // if (type) {
                //     let soldierId = type.selectId ? type.selectId : type.curId
                //     let msg = new HeroSoldierInfoReq()
                //     msg.heroId = data.heroId
                //     msg.soldierId = soldierId
                //     NetManager.send(msg)
                // }
            }
            heroInfo.level = heroLv

            //更新神秘者
            if (heroInfo.mysticLink > 0) {
                let mysticHeroInfo = HeroUtils.getHeroInfoByHeroId(heroInfo.mysticLink);
                if (mysticHeroInfo) {
                    mysticHeroInfo.level = heroInfo.level;
                    HeroUtils.removeFightHeroInfo(mysticHeroInfo.heroId);
                    HeroUtils.updateHeroInfo(mysticHeroInfo.heroId, mysticHeroInfo, true);
                }
            }

            gdk.e.emit(RoleEventId.UPDATE_ONE_HERO, heroId)
            gdk.e.emit(RoleEventId.SHOW_HERO_UP_EFFECT)

            // let node = gdk.panel.get(PanelId.MasteryUp)
            // if (node) {
            //     let msg = new HeroMasteryInfoReq
            //     msg.heroId = data.heroId
            //     NetManager.send(msg)
            // }
        }
    }

    /**英雄属性更新 */
    _onHeroAttrRsp(data: icmsg.HeroAttrRsp) {
        let heroIdItems = this.heroModel.idItems;
        let heroId = data.heroId;
        let item: BagItem = heroIdItems[heroId];
        if (item) {
            let heroInfo = <icmsg.HeroInfo>item.extInfo;
            let curHero = this.heroModel.curHeroInfo;
            if (curHero && heroInfo.heroId == curHero.heroId) {
                JumpUtils.updatePowerTip(heroInfo.power, data.power);
            }
            else if (gdk.panel.isOpenOrOpening(PanelId.RuneMainPanel) && !gdk.panel.isOpenOrOpening(PanelId.RuneClearPanel)) {
                JumpUtils.updatePowerTip(heroInfo.power, data.power);
            } else if (gdk.panel.isOpenOrOpening(PanelId.GuardianEquipPanel)) {
                JumpUtils.updatePowerTip(heroInfo.power, data.power);
            }
            // else if (gdk.panel.isOpenOrOpening(PanelId.GeneralWeaponUpgradePanel)) {
            //     JumpUtils.updatePowerTip(heroInfo.power, data.power);
            // }
            heroInfo.power = data.power;
        }
        let heroAttrs = this.heroModel.heroAttrs;
        let heroDeatil = this.heroModel.heroDeatils[heroId];
        if (heroDeatil) {
            heroDeatil.attr = data.attr;
            heroAttrs[heroId] = data.attr;
        }
        HeroUtils.removeFightHeroInfo(heroId);
        gdk.e.emit(RoleEventId.UPDATE_HERO_ATTR, heroId);
    }

    /**职业升阶回调 */
    _onHeroCareerUpRsp(data: icmsg.HeroCareerUpRsp) {
        let heroAttrs = this.heroModel.heroAttrs
        let heroDeatils = this.heroModel.heroDeatils

        //战力信息
        let heroInfo = HeroUtils.getHeroInfoByHeroId(data.heroId);
        let curHero = this.heroModel.curHeroInfo;
        if (curHero && heroInfo.heroId == curHero.heroId) {
            JumpUtils.updatePowerTip(heroInfo.power, data.detail.power);
        }
        heroInfo.power = data.detail.power;
        // heroInfo.careers = data.detail.careers
        heroInfo.careerLv = data.careerLv

        let oldAttr = heroAttrs[data.heroId];
        heroAttrs[data.heroId] = data.detail.attr;
        heroDeatils[data.heroId] = data.detail;
        //激活的士兵id
        let baseSoldierId = [101, 201, 301, 401]
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId)
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", data.careerId, { career_lv: data.careerLv })
        // if (careerCfg && careerCfg.gain_soldier && careerCfg.gain_soldier > 0 && baseSoldierId.indexOf(careerCfg.gain_soldier) == -1) {
        //     HeroUtils.addHeroActiveSoldiers(data.heroId, [careerCfg.gain_soldier])
        // }

        // if (careerCfg && careerCfg.ul_soldier && careerCfg.ul_soldier.length > 0) {
        //     HeroUtils.addHeroActiveSoldiers(data.heroId, careerCfg.ul_soldier)
        // }

        //激活技能
        if (careerCfg && careerCfg.ul_skill && careerCfg.ul_skill.length > 0) {
            HeroUtils.addHeroActiveSkills(data.heroId, careerCfg.ul_skill);
        }

        //该职业是否已精通
        // let maxLv = HeroUtils.getJobMaxLv(careerCfg.career_id)
        // if (careerCfg.career_lv >= maxLv) {
        //     HeroUtils.addHeroMasterCareer(data.heroId, careerCfg.career_id)
        // }

        HeroUtils.removeFightHeroInfo(data.heroId);
        HeroUtils.updateHeroJobLv(data.heroId, data.careerId, data.careerLv)
        gdk.e.emit(RoleEventId.UPDATE_HERO_ATTR, data.heroId)
        this.heroModel.heroCareerUpData = {
            heroId: data.heroId,
            careerId: data.careerId,
            careerLv: data.careerLv
        }

        //进阶后清空挂机界面挂机材料的相关信息
        let info: HangItemInfo = GlobalUtil.getCookie("hangItem_Flag")
        if (info && info.itemId > 0 && info.heroId == data.heroId) {
            GlobalUtil.setCookie("hangItem_Flag", null)
            let copyModel = ModelManager.get(CopyModel)
            let newStageCfg = ConfigManager.getItemById(Copy_stageCfg, copyModel.latelyStageId);
            if (newStageCfg) {
                //设置挂机最新关卡
                NetManager.send(new icmsg.DungeonHangChooseReq({ stageId: newStageCfg.pre_condition }));
            }
        }

        //刷新英雄的超绝技能信息
        // HeroUtils.updateHeroSuperSkill(data.heroId, data.detail.skills)
        gdk.e.emit(RoleEventId.SHOW_JOB_RESULT_EFFECT, false)
        gdk.e.emit(RoleEventId.UPDATE_ONE_HERO, data.heroId)
        GuideUtil.activeGuide('career#lvup')
    }

    /**
     * 转职回调
     * @param data
     */
    _onHeroCareerTransRsp(data: icmsg.HeroCareerTransRsp) {
        let idItems = this.heroModel.idItems
        let heroAttrs = this.heroModel.heroAttrs
        let heroDeatils = this.heroModel.heroDeatils;
        //战力信息
        let heroInfo = HeroUtils.getHeroInfoByHeroId(data.heroId);
        let curHero = this.heroModel.curHeroInfo;
        if (curHero && heroInfo.heroId == curHero.heroId) {
            JumpUtils.updatePowerTip(heroInfo.power, data.detail.power);
        }
        heroInfo.power = data.detail.power;

        if (idItems[data.heroId]) {
            let item = idItems[data.heroId]
            let heroInfo = <icmsg.HeroInfo>item.extInfo
            heroInfo.careerId = data.careerId
        }
        heroAttrs[data.heroId] = data.detail.attr
        heroDeatils[data.heroId] = data.detail

        //激活的士兵id
        // let baseSoldierId = [101, 201, 301, 401]
        // let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", data.careerId, { career_lv: 0 })

        // if (isNew) {
        //     if (careerCfg && careerCfg.ul_soldier && careerCfg.ul_soldier.length > 0) {
        //         let list = []
        //         for (let i = 0; i < careerCfg.ul_soldier.length; i++) {
        //             if (data.detail.soldierIds.indexOf(careerCfg.ul_soldier[i]) != -1) {
        //                 list.push(careerCfg.ul_soldier[i])
        //             }
        //         }
        //         HeroUtils.addHeroActiveSoldiers(data.heroId, list)
        //     }
        // }

        // if (careerCfg && careerCfg.gain_soldier && careerCfg.gain_soldier > 0 && baseSoldierId.indexOf(careerCfg.gain_soldier) == -1) {
        //     HeroUtils.addHeroActiveSoldiers(data.heroId, [careerCfg.gain_soldier])
        // }

        // let careers = data.detail.careers
        // let careerLv: number = 0;
        // //刷新英雄的超绝技能信息
        // HeroUtils.updateHeroSuperSkill(data.heroId, data.detail.skills)
        // for (let index = 0; index < careers.length; index++) {
        //     const element = careers[index];
        //     if (element.careerId == data.careerId) {
        //         careerLv = element.careerLv;
        //     }
        //     HeroUtils.updateHeroJobLv(data.heroId, element.careerId, element.careerLv)
        // }
        HeroUtils.removeFightHeroInfo(data.heroId);

        gdk.e.emit(RoleEventId.UPDATE_HERO_ATTR, data.heroId)
        gdk.e.emit(RoleEventId.UPDATE_ONE_HERO, data.heroId)
        // gdk.panel.open(PanelId.ChangeJobResult, (node: cc.Node) => {
        //     node.getComponent(ChangeJobResult).setInfo(data.heroId, data.careerId, oldCareerId, oldAttr, isNew);
        // });
        GuideUtil.activeGuide('career#trans#rsp')
    }

    // 升星回调
    _onHeroStarupRsp(data: icmsg.HeroStarupRsp) {
        let idItems = this.heroModel.idItems

        let heroItem = idItems[data.heroId]
        let heroInfo = <icmsg.HeroInfo>heroItem.extInfo
        heroInfo.star = data.heroStar
        this.heroModel.idItems[data.heroId] = heroItem

        //更新神秘者
        if (heroInfo.mysticLink > 0) {
            let mysticHeroInfo = HeroUtils.getHeroInfoByHeroId(heroInfo.mysticLink);
            if (mysticHeroInfo) {
                mysticHeroInfo.star = heroInfo.star;
                HeroUtils.removeFightHeroInfo(mysticHeroInfo.heroId);
                HeroUtils.updateHeroInfo(mysticHeroInfo.heroId, mysticHeroInfo, true);
            }
        }

        // 弹出属性提示展示框
        // gdk.panel.setArgs(PanelId.UpStarTips, heroInfo, true)
        // gdk.panel.open(PanelId.UpStarTips)

        HeroUtils.removeFightHeroInfo(data.heroId);
        gdk.e.emit(RoleEventId.UPDATE_HERO_ATTR, data.heroId)
        gdk.e.emit(RoleEventId.UPDATE_ONE_HERO, data.heroId)

        GuideUtil.activeGuide('starup#' + data.heroStar + '#rsp')
    }

    /**兵营相关操作激活士兵  */
    _onHeroSoldierActiveRsp(data: icmsg.HeroSoldierActiveRsp) {
        // let ids = data.heroIds
        // let soldierId = data.soldierId
        // let heroDeatils = this.heroModel.heroDeatils
        // for (let i = 0; i < ids.length; i++) {
        //     let detail = heroDeatils[ids[i]]
        //     if (detail && detail.soldierIds.indexOf(soldierId) == -1) {
        //         detail.soldierIds.push(soldierId)
        //         this.heroModel.heroDeatils[ids[i]] = detail
        //     }
        //     HeroUtils.addHeroActiveSoldiers(ids[i], [soldierId])
        // }
        gdk.e.emit(RoleEventId.UPDATE_HERO_LIST)
    }

    /**更新英雄战斗力，如兵营科技升级士兵战斗力改变 */
    _onHeroPowerUpdateRsp(data: icmsg.HeroPowerUpdateRsp) {
        let heroIdItems = this.heroModel.idItems;
        let heroId = data.heroId;
        let item: BagItem = heroIdItems[heroId]
        if (item) {
            let heroInfo = <icmsg.HeroInfo>item.extInfo;
            let curHero = this.heroModel.curHeroInfo;
            if (curHero && heroInfo.heroId == curHero.heroId) {
                JumpUtils.updatePowerTip(heroInfo.power, data.power);
            }
            heroInfo.power = data.power;
        }
        HeroUtils.removeFightHeroInfo(heroId);
    }



    /**英雄锁定设置返回 */
    _onHeroStatusLockRsp(data: icmsg.HeroStatusLockRsp) {
        let heroIdItems = this.heroModel.idItems;
        let heroId = data.heroId;
        let item: BagItem = heroIdItems[heroId]
        if (item) {
            let heroInfo = <icmsg.HeroInfo>item.extInfo;
            heroInfo.status = heroInfo.status & 0xfe | data.switchFlag
            gdk.e.emit(RoleEventId.UPDATE_ONE_HERO)
        }
    }

    /**
     * 英雄碎片合成状态
     * @param data 
     */
    // _onHeroComposeStatusRsp(data: HeroComposeStatusRsp) {
    //     if (!this.heroModel.heroComposeStatus) this.heroModel.heroComposeStatus = {};
    //     if (!this.heroModel.heroComposeRedPointFlag) this.heroModel.heroComposeRedPointFlag = {};
    //     data.list.forEach((item) => {
    //         let str = item.status.toString(2);
    //         while (str.length < 8) {
    //             str = '0' + str;
    //         }
    //         this.heroModel.heroComposeStatus[item.heroId] = str;
    //         this.heroModel.heroComposeRedPointFlag[item.heroId] = item.redDotSwitch;
    //     });
    // }

    /**
     * 英雄碎片合成  红点开关
     * @param resp 
     */
    // _onHeroComposeRedPointSwitchRsp(resp: HeroComposeRedDotSwitchRsp) {
    //     if (!this.heroModel.heroComposeRedPointFlag) this.heroModel.heroComposeRedPointFlag = {};
    //     this.heroModel.heroComposeRedPointFlag[resp.heroTypeId] = resp.switch;
    //     gdk.e.emit(LotteryEventId.COMPOSE_RED_POINT_FLAG_CHANGE, resp.heroTypeId);
    // }

    /**
     * 时空精粹  英雄兑换次数
     * @param resp 
     */
    // _onHeroEssenceBuyTimesRsp(resp: HeroEssenceBuyTimesRsp) {
    //     if (!this.heroModel.heroConvertInfo) this.heroModel.heroConvertInfo = {};
    //     resp.heroTimes.forEach(info => {
    //         this.heroModel.heroConvertInfo[info.id] = info.buyTimes;
    //     });
    // }

    /**时空精粹 英雄兑换返回 */
    // _onHeroEssenceConvertRsp(resp: HeroEssenceConvertRsp) {
    //     if (!this.heroModel.heroConvertInfo) this.heroModel.heroConvertInfo = {};
    //     if (!this.heroModel.heroConvertInfo[resp.id]) this.heroModel.heroConvertInfo[resp.id] = 0;
    //     this.heroModel.heroConvertInfo[resp.id] += 1;
    // }

    // /**切换神器 */
    // _onGeneralChangeWeaponRsp(resp: GeneralChangeWeaponRsp) {
    //     let heroAttrs = this.heroModel.heroAttrs;
    //     let heroDeatils = this.heroModel.heroDeatils;
    //     this.heroModel.heroInfos.forEach(h => {

    //         // 英雄信息
    //         let info = h.extInfo as HeroInfo;
    //         let heroId = info.heroId;
    //         info.power += resp.diffAttr.heroPower + resp.diffAttr.soldierPower;

    //         // 英雄详细属性
    //         let heroDetail = heroDeatils[heroId];
    //         if (heroDetail) {
    //             heroDetail.attr.atkG += resp.diffAttr.heroAtk;
    //             heroDetail.attr.defG += resp.diffAttr.heroDef;
    //             heroDetail.attr.hpG += resp.diffAttr.heroHp;
    //             heroDetail.power = info.power;

    //             // 士兵详细属性
    //             let heroSoldiers = this.soldierModel.heroSoldiers[info.heroId];
    //             if (heroSoldiers) {
    //                 for (let soldierId in heroSoldiers.items) {
    //                     let heroSoldier = heroSoldiers.items[soldierId];
    //                     heroSoldier.atkG += resp.diffAttr.soldierAtk;
    //                     heroSoldier.defG += resp.diffAttr.soldierDef;
    //                     heroSoldier.hpG += resp.diffAttr.soldierHp;
    //                 }
    //             }

    //             // 更新缓存的数据
    //             heroAttrs[heroId] = heroDetail.attr;
    //         }

    //         // 移除战斗属性缓存
    //         HeroUtils.removeFightHeroInfo(info.heroId);
    //     });

    //     // 更新战力提示
    //     let roleModel = ModelManager.get(RoleModel);
    //     let oldPower = roleModel.power;
    //     roleModel.power = resp.newPower;
    //     JumpUtils.updatePowerTip(oldPower, resp.newPower);

    //     // 更新英雄列表
    //     gdk.e.emit(RoleEventId.UPDATE_HERO_LIST);
    // }

    //获取上阵英雄id
    _onBattleArrayQueryRsp(rsp: icmsg.BattleArrayQueryRsp) {

        rsp.heroes.forEach(heroData => {
            this.heroModel.refreshCurHeroList(heroData.type - 1, heroData.heroIds);
        })
    }

    /**兵团精甲穿戴卸载 */
    _onSoldierSkinOnRsp(rsp: icmsg.SoldierSkinOnRsp) {
        rsp.heroes.forEach(data => {
            let heroIdItems = this.heroModel.idItems;
            let heroId = data.heroId;
            let item: BagItem = heroIdItems[heroId]
            if (item) {
                let heroInfo = <icmsg.HeroInfo>item.extInfo;
                heroInfo.soldierSkin = data.skinId;
            }
        })
    }

    /**英雄 历史最高英雄星级 */
    _onHeroMaxStarUpRsp(resp: icmsg.HeroMaxStarUpRsp) {
        ModelManager.get(RoleModel).maxHeroStar = resp.maxHeroStar;
        ModelManager.get(CopyModel).guardianOpen = resp.guardianCopyOpen;
    }

    /**英雄觉醒状态信息  */
    _onHeroAwakeStateRsp(data: icmsg.HeroAwakeStateRsp) {
        let list = data.heros
        list.forEach(element => {
            this.heroModel.heroAwakeStates[element.heroId] = element
        });
        gdk.e.emit(RoleEventId.UPDATE_ONE_HERO)
    }

    /**主动推送英雄 觉醒数据 */
    _onHeroAwakeMissonUpdateRsp(data: icmsg.HeroAwakeMissonUpdateRsp) {
        this.heroModel.heroAwakeStates[data.hero.heroId] = data.hero
        gdk.e.emit(RoleEventId.UPDATE_ONE_HERO)
    }

    /**神秘者 链接 */
    _onHeroMysticLinkRsp(resp: icmsg.HeroMysticLinkRsp) {
        let mysticHeroInfo = HeroUtils.getHeroInfoByHeroId(resp.mystic);
        let connectHeroInfo = HeroUtils.getHeroInfoByHeroId(resp.heroId);
        //connect
        connectHeroInfo.mysticLink = mysticHeroInfo.heroId;
        HeroUtils.removeFightHeroInfo(connectHeroInfo.heroId);
        HeroUtils.updateHeroInfo(connectHeroInfo.heroId, connectHeroInfo, false);
        //mystic
        mysticHeroInfo.level = connectHeroInfo.level;
        mysticHeroInfo.star = connectHeroInfo.star;
        mysticHeroInfo.careerLv = connectHeroInfo.careerLv;
        mysticHeroInfo.power = resp.af.power;
        mysticHeroInfo.mysticLink = connectHeroInfo.heroId;
        HeroUtils.removeFightHeroInfo(mysticHeroInfo.heroId);
        HeroUtils.updateHeroInfo(mysticHeroInfo.heroId, mysticHeroInfo, true);
    }

    /**神秘者 解除链接 */
    _onHeroMysticUnLinkRsp(resp: icmsg.HeroMysticUnLinkRsp) {
        let mysticHeroInfo = HeroUtils.getHeroInfoByHeroId(resp.mystic);
        let connectHeroInfo = HeroUtils.getHeroInfoByHeroId(resp.heroId);
        //connect
        connectHeroInfo.mysticLink = 0;
        HeroUtils.removeFightHeroInfo(connectHeroInfo.heroId);
        HeroUtils.updateHeroInfo(connectHeroInfo.heroId, connectHeroInfo, false);
        //mystic
        // mysticHeroInfo.level = resp.af.level;
        // mysticHeroInfo.star = resp.af.star;
        // mysticHeroInfo.careerLv = 1;
        // mysticHeroInfo.power = resp.af.power;
        // mysticHeroInfo.mysticLink = 0;
        mysticHeroInfo = resp.info;
        HeroUtils.removeFightHeroInfo(mysticHeroInfo.heroId);
        HeroUtils.updateHeroInfo(mysticHeroInfo.heroId, mysticHeroInfo, true);
    }

    /**神秘者 技能升级 */
    _onHeroMysticSkillUpRsp(resp: icmsg.HeroMysticSkillUpRsp) {
        let heroInfo = HeroUtils.getHeroInfoByHeroId(resp.mystic);
        heroInfo.mysticSkills = resp.mysticSkills;
        HeroUtils.removeFightHeroInfo(heroInfo.heroId);
        HeroUtils.updateHeroInfo(heroInfo.heroId, heroInfo, true);
    }
}