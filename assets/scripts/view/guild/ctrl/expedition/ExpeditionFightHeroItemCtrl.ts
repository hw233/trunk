import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionModel from './ExpeditionModel';
import ExpeditionUtils from './ExpeditionUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import ServerModel from '../../../../common/models/ServerModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { BagItem } from '../../../../common/models/BagModel';
import { Expedition_globalCfg, Expedition_unlockCfg, HeroCfg } from '../../../../a/config';
import { ExpeditionFightHero } from './ExpeditionFightCtrl';

/** 
 * @Description: 
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-28 10:29:58
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionFightHeroItemCtrl")
export default class ExpeditionFightHeroItemCtrl extends UiListItem {

    @property(cc.Node)
    heroNode: cc.Node = null;

    @property(cc.Node)
    selectNode: cc.Node = null

    @property(cc.Node)
    isHeroNode: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    starLab: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;

    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.Sprite)
    colorBg: cc.Sprite = null

    @property(cc.Node)
    redPoint: cc.Node = null

    @property(cc.Node)
    emptyNode: cc.Node = null;

    @property(cc.Node)
    addIcon: cc.Node = null;

    @property(cc.Node)
    lockNode: cc.Node = null;

    @property(cc.Label)
    lockLab: cc.Label = null;

    @property(cc.Node)
    btnAdd: cc.Node = null;

    @property(cc.Label)
    energyLab: cc.Label = null;

    @property(cc.Label)
    energyTime: cc.Label = null;

    @property(cc.Label)
    changeTime: cc.Label = null;

    @property(cc.Node)
    btnChange: cc.Node = null;

    @property(cc.Node)
    useNode: cc.Node = null;

    refreshEnergyTime: number = 0
    refreshChangeTime: number = 0
    addEnergy: number = 0
    maxEnergy: number = 0

    heroInfo: icmsg.HeroInfo = null
    expeditionHero: icmsg.ExpeditionHero = null
    heroCfg: HeroCfg = null
    quality: number = 0

    get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    updateView() {
        let item: BagItem = (this.data.data as ExpeditionFightHero).bagItem
        this.expeditionHero = (this.data.data as ExpeditionFightHero).epHero
        if (item) {

            this.heroNode.active = true
            this.emptyNode.active = false

            this.selectNode.active = this.data.isSelect
            this.isHeroNode.active = this.data.isHero
            this.heroInfo = <icmsg.HeroInfo>item.extInfo
            let level = this.heroInfo.level || 1
            this.lvLab.string = `${level}`

            let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star, false)
            GlobalUtil.setSpriteIcon(this.node, this.icon, icon);

            this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
            GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
            let type = Math.floor((<icmsg.HeroInfo>item.extInfo).soldierId / 100);
            GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
            GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${this.heroInfo.color}`);
            this._updateStar();

            this.energyLab.string = `${this.expeditionHero.energy}`

            let energy = ConfigManager.getItemById(Expedition_globalCfg, "energy").value
            this.refreshEnergyTime = energy[0]
            this.addEnergy = energy[1]

            this.refreshChangeTime = ConfigManager.getItemById(Expedition_globalCfg, "cooling_time").value[0]

            //能量倒计时
            this.maxEnergy = ConfigManager.getItemById(Expedition_globalCfg, "energy_ceiling").value[0]
            if (this.expeditionHero.energy >= this.maxEnergy) {
                this.energyTime.node.parent.active = false
            } else {
                this.energyTime.node.parent.active = true
                this._createEnergyTime()
            }

            //更换倒计时
            this.btnChange.active = false
            this._createChangeTime()

            let userHeros = ExpeditionUtils.getPointUseHeroIds()
            this.useNode.active = userHeros.indexOf(this.heroInfo.heroId) >= 0
            if (this.useNode.active) {
                this._clearEnergyTime()
                this._clearChangeTime()
                this.energyTime.node.parent.active = false
                this.changeTime.node.parent.active = false
            }

        } else {
            this.heroNode.active = false
            this.emptyNode.active = true
            this.addIcon.active = true
            this.lockNode.active = false
            let l_cfg = ConfigManager.getItemById(Expedition_unlockCfg, this.expeditionHero.gridId)
            if (l_cfg.level > this.expeditionModel.armyLv) {
                this.addIcon.active = false
                this.lockNode.active = true
                this.lockLab.string = StringUtils.format(gdk.i18n.t('i18n:EXPEDITION_TIP7'), l_cfg.level)//`${l_cfg.level}级部队解锁`
            }
        }
    }

    _itemSelect() {
        this.selectNode.active = this.data.isSelect;
    }

    /**更新星星数量 */
    _updateStar() {
        let starNum = this.heroInfo.star;
        if (starNum >= 12 && this.maxStarNode) {
            this.starLab.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (starNum - 11) + ''
        } else {
            this.starLab.node.active = true;
            this.maxStarNode ? this.maxStarNode.active = false : 0;
            let starTxt = "";
            if (starNum > 5) {
                starTxt = '1'.repeat(starNum - 5);
            }
            else {
                starTxt = '0'.repeat(starNum);
            }
            this.starLab.string = starTxt;
        }
    }

    openHeroList() {
        let l_cfg = ConfigManager.getItemById(Expedition_unlockCfg, this.expeditionHero.gridId)
        if (l_cfg.level > this.expeditionModel.armyLv) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:EXPEDITION_TIP7'), l_cfg.level))//`${l_cfg.level}级部队解锁`
        } else {
            gdk.panel.setArgs(PanelId.ExpeditionHeroList, this.expeditionHero)
            gdk.panel.open(PanelId.ExpeditionHeroList)
        }
    }

    /** 红点判断逻辑 */
    redPointHandle(): boolean {
        if (!this.heroInfo) return false;
        // this.upFlag.active = RedPointUtils.is_can_job_up_and_can_get_item(this.heroInfo)//RedPointUtils.is_can_job_up_ignore_material(this.heroInfo)
        return false//RedPointUtils.is_can_hero_opration(this.heroInfo);
    }

    openBuyEnergy() {
        if (this.expeditionHero.energy >= this.maxEnergy) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:EXPEDITION_TIP8')))
            return
        }
        gdk.panel.setArgs(PanelId.ExpeditionBuyEnergy, this.expeditionHero.gridId)
        gdk.panel.open(PanelId.ExpeditionBuyEnergy)
    }

    _createEnergyTime() {
        this._updateEnergyTime()
        this._clearEnergyTime()
        this.schedule(this._updateEnergyTime, 1)
    }

    _updateEnergyTime() {
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let lastEnergyTime = this.expeditionHero.energyTime
        let leftTime = curTime - lastEnergyTime
        if (leftTime > 0 && leftTime < this.refreshEnergyTime) {
            this.energyTime.string = TimerUtils.format2(this.refreshEnergyTime - leftTime)
        } else {
            this.expeditionHero.energy += 1
            if (this.expeditionHero.energy >= this.maxEnergy) {
                this.expeditionHero.energy = this.maxEnergy
            }
            this.expeditionHero.energyTime = curTime
            this.energyLab.string = `${this.expeditionHero.energy}`
            if (this.expeditionHero.energy >= this.maxEnergy) {
                this._clearEnergyTime()
                this.energyTime.node.parent.active = false
            } else {
                this._updateEnergyTime()
            }
        }
    }

    _clearEnergyTime() {
        this.unschedule(this._updateEnergyTime)
    }


    _createChangeTime() {
        this._clearChangeTime()
        this._updateChangeTime()
        this.schedule(this._updateChangeTime, 0.5)
    }

    _updateChangeTime() {
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let lastChangeTime = this.expeditionHero.changeTime - 1
        let leftTime = curTime - lastChangeTime
        this.btnChange.active = false
        if (leftTime > 0 && leftTime < this.refreshChangeTime) {
            this.changeTime.node.parent.active = true
            this.changeTime.string = TimerUtils.format2(this.refreshChangeTime - leftTime)
        } else {
            this.changeTime.node.parent.active = false
            this.btnChange.active = true
            this._clearChangeTime()
        }
    }

    _clearChangeTime() {
        this.unschedule(this._updateChangeTime)
    }


}