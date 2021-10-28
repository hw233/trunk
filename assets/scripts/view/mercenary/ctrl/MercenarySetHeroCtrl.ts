import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import MercenaryModel from '../model/MercenaryModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import {
    Hero_careerCfg,
    HeroCfg,
    Worker_workCfg,
    WorkerCfg
    } from '../../../a/config';
import { MercenaryEventId } from '../enum/MercenaryEventId';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2020-07-10 11:42:28
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 21:26:59
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/mercenary/MercenarySetHeroCtrl")
export default class MercenarySetHeroCtrl extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Node)
    lockNode: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Node)
    activeNode: cc.Node = null

    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null

    @property(cc.Label)
    timeLab: cc.Label = null

    @property(cc.Label)
    goldLab: cc.Label = null

    _lentInfo: icmsg.MercenaryLentHero

    get roleModel() { return ModelManager.get(RoleModel); }
    get mercenaryModel() { return ModelManager.get(MercenaryModel); }

    updateState(lentInfo: icmsg.MercenaryLentHero) {
        this._lentInfo = lentInfo
        let lv = this.getOpenLv(this._lentInfo.index)
        //未解锁状态
        if (this.roleModel.level < lv) {
            this.activeNode.active = false
            this.lockNode.active = true
            this.lvLab.string = `${lv}`
            GlobalUtil.setGrayState(this.bg, 1)
            return
        }
        GlobalUtil.setGrayState(this.bg, 0)
        //已解锁状态
        if (this._lentInfo && this._lentInfo.heroId > 0) {
            this.lockNode.active = false
            this.activeNode.active = true
            let heroInfo = HeroUtils.getHeroInfoByHeroId(this._lentInfo.heroId)
            let url = StringUtils.format("spine/hero/{0}/0.5/{0}", HeroUtils.getHeroSkin(heroInfo.typeId, heroInfo.star));
            GlobalUtil.setSpineData(this.node, this.heroSpine, url, true, "stand", true, true);
            this.upodateGain()
        } else {
            this.lockNode.active = false
            this.activeNode.active = false
        }
    }

    /*更新收益*/
    upodateGain() {
        let heroItem = HeroUtils.getHeroItemByHeroId(this._lentInfo.heroId)
        let heroInfo = heroItem.extInfo as icmsg.HeroInfo
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", heroInfo.careerId, { career_lv: GlobalUtil.getHeroCareerLv(heroInfo) })
        let cfg = ConfigManager.getItemByField(Worker_workCfg, "career_lv", careerCfg.career_lv)
        if (!cfg) {
            CC_DEBUG && cc.error("配置表Worker_workCfg 缺少 对应的等阶" + careerCfg.career_lv)
            cfg = ConfigManager.getItemByField(Worker_workCfg, "career_lv", 1)
        }

        let hangTime = this._lentInfo.settlteTime - this._lentInfo.gainTime
        if (hangTime >= cfg.limit * 60) {
            hangTime = cfg.limit * 60
        }
        this.timeLab.string = `${Math.floor(hangTime / 3600)}`
        this.goldLab.string = `${this._lentInfo.settlteGold}`
    }

    /*开启等级*/
    getOpenLv(index) {
        let workerCfg = ConfigManager.getItemById(WorkerCfg, 1)
        let lv = workerCfg["open_lv" + index]
        return lv
    }

    clickFunc() {
        if (this.activeNode.active && this._lentInfo && this._lentInfo.heroId > 0) {
            let msg = new icmsg.MercenaryLendOffReq()
            msg.index = this._lentInfo.index
            NetManager.send(msg, (data: icmsg.MercenaryLendOffRsp) => {
                let list = this.mercenaryModel.lentHeroList
                for (let i = 0; i < list.length; i++) {
                    if (list[i] && list[i].index == data.index) {
                        list[i].heroId = 0
                    }
                }
                this.mercenaryModel.lentHeroList = list
                GlobalUtil.openRewadrView(data.gain)
                gdk.e.emit(MercenaryEventId.MERCENARY_SET_REFRESH_HERO)
            })
        }
    }

}