import BagUtils from '../../../common/utils/BagUtils';
import BYAttrItemCtrl from './BYAttrItemCtrl';
import BYGetSoldierEffectCtrl from './BYGetSoldierEffectCtrl';
import BYItemCtrl from './BYItemCtrl';
import BYModel from '../model/BYModel';
import BYUtils from '../utils/BYUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil, { CommonNumColor } from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import SoldierModel from '../../../common/models/SoldierModel';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { AttrType } from '../../../common/utils/EquipUtils';
import { BagEvent } from '../../bag/enum/BagEvent';
import { BagType } from '../../../common/models/BagModel';
import { BarracksCfg, GlobalCfg, SoldierCfg } from '../../../a/config';
import { BYEventId } from '../enum/BYEventId';

/** 
 * @Description: 兵营窗口
 * @Author: weiliang.huang  
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-14 16:56:19
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYViewCtrl")
export default class BYViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    tabBtns: cc.Node[] = []

    @property(cc.Node)
    items: cc.Node[] = []

    @property(cc.Node)
    attrItems: cc.Node[] = []

    @property(cc.Node)
    costNode: cc.Node = null

    @property(cc.Node)
    costItems: cc.Node[] = []

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Node)
    soldierNode: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    classIcon: cc.Node = null;

    @property(cc.Label)
    soldierName: cc.Label = null;

    @property(cc.Label)
    soldierLvLab: cc.Label = null

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null

    @property(cc.Node)
    btnUpgrade: cc.Node = null;

    @property(cc.Node)
    maxTip: cc.Node = null;

    @property(cc.Node)
    skinBtn: cc.Node = null;

    _curType: number = 0
    _typeCfgs = []
    _curTypeLv = 0
    _b_cfg: BarracksCfg = null
    _showSoldierId: number = 0
    _isNoEnough: boolean = false

    get byModel(): BYModel { return ModelManager.get(BYModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }

    _typeArr = [gdk.i18n.t("i18n:BINGYING_TIP1"), "", gdk.i18n.t("i18n:BINGYING_TIP3"), gdk.i18n.t("i18n:BINGYING_TIP4")]

    onEnable() {
        let args = this.args
        if (args && args.length > 0) {
            this.selectByType(true, args[0] - 1)
        } else {
            this.selectByType(true, 0)
        }
        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateMaterials, this)
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateMaterials, this)
        gdk.e.on(BagEvent.REMOVE_ITEM, this._updateMaterials, this)
    }

    onDisable() {
        gdk.Timer.clearAll(this)
        gdk.e.targetOff(this)
    }

    selectByType(e, type) {
        if (!e) return;
        this._curType = parseInt(type) + 1
        for (let i = 0; i < this.tabBtns.length; i++) {
            let node = this.tabBtns[i]
            // let btn = node.getComponent(cc.Button)
            // if (!btn) continue
            // btn.interactable = (this._curType - 1 != i)
            let select = node.getChildByName("select")
            let normal = node.getChildByName("normal")
            select.active = (type == i)
            normal.active = !(type == i)
        }
        this._updateViewInfo()
    }

    _updateViewInfo() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabledInHierarchy) return;
        this._curTypeLv = this.byModel.byLevelsData[this._curType - 1]
        this._b_cfg = ConfigManager.getItemByField(BarracksCfg, "type", this._curType, { barracks_lv: this._curTypeLv })
        let rounds = this._b_cfg.rounds
        this.lvLab.string = `${this._typeArr[this._curType - 1]}${gdk.i18n.t("i18n:BINGYING_TIP7")}LV.${rounds}`;
        this._typeCfgs = ConfigManager.getItemsByField(BarracksCfg, "type", this._curType)
        if (this._curTypeLv % 6 == 0 && this._curTypeLv != this._typeCfgs.length - 1) {
            rounds += 1
        }

        let allLv = 0;
        this.byModel.byLevelsData.forEach((lv, index) => {
            let cfg = ConfigManager.getItemByField(BarracksCfg, 'type', index + 1, { 'barracks_lv': lv })
            if (cfg) {
                allLv += cfg.rounds;
            }
        })
        let openLv = ConfigManager.getItemByField(GlobalCfg, 'key', 'army_open').value[0]
        this.skinBtn.active = allLv >= openLv
        let cfgs = ConfigManager.getItems(BarracksCfg, { type: this._curType, rounds: rounds })
        for (let i = 0; i < cfgs.length; i++) {
            let node = this.items[i]
            if (node) {
                let ctrl = node.getComponent(BYItemCtrl)
                ctrl.updateViewInfo(cfgs[i])
            }
        }

        if (this._curTypeLv >= this._typeCfgs.length - 1) {
            this.costNode.active = false
            this.btnUpgrade.active = false
            this.maxTip.active = true
        } else {
            this.costNode.active = true
            this.btnUpgrade.active = true
            this.maxTip.active = false
            this._updateMaterials()

        }
        this._updateBtnState()
        this._updateSoldierInfo()
        this._updateAttrInfo()
    }

    _updateMaterials() {
        let costs = this._b_cfg.consumption
        let count = 0
        for (let i = 0; i < this.costItems.length; i++) {
            if (costs[i]) {
                this.costItems[i].active = true
                let ctrl = this.costItems[i].getComponent(UiSlotItem)
                ctrl.updateItemInfo(costs[i][0])
                let ownNum = BagUtils.getItemNumById(costs[i][0])
                gdk.Timer.callLater(this, () => {
                    ctrl.updateNumLab(`${ownNum}/${costs[i][1]}`)
                })
                ctrl.UiNumLab.node.color = CommonNumColor.white
                if (ownNum < costs[i][1]) {
                    ctrl.UiNumLab.node.color = CommonNumColor.red
                    count++
                }
                ctrl.itemInfo = {
                    series: costs[i][0],
                    itemId: costs[i][0],
                    itemNum: 1,
                    type: BagType.ITEM,
                    extInfo: null,
                }
            } else {
                this.costItems[i].active = false
            }
        }
        this._isNoEnough = false
        if (count > 0) {
            this._isNoEnough = true
        }
    }

    _updateSoldierInfo() {
        let s_cfgs: BarracksCfg[] = []
        for (let i = 0; i < this._typeCfgs.length; i++) {
            if (this._typeCfgs[i].soldier_id && this._typeCfgs[i].soldier_id > 0) {
                s_cfgs.push(this._typeCfgs[i])
            }
        }
        let show_cfg: BarracksCfg = null
        let showIndex = 0
        for (let i = 0; i < s_cfgs.length; i++) {
            if (s_cfgs[i].barracks_lv > this._curTypeLv) {
                show_cfg = s_cfgs[i]
                showIndex = i
                break
            }
        }

        if (this._curTypeLv == this._typeCfgs.length - 1) {
            show_cfg = s_cfgs[s_cfgs.length - 1]
        }

        if (!show_cfg) {
            show_cfg = s_cfgs[s_cfgs.length - 1]
        }

        if (show_cfg) {
            this.soldierNode.active = true
            let cfg = ConfigManager.getItemById(SoldierCfg, show_cfg.soldier_id);
            this._showSoldierId = show_cfg.soldier_id

            this.soldierName.string = `${cfg.name}`
            this.soldierName.node.color = cc.color(GlobalUtil.getSoldierNameColor(cfg.color, false))
            let outLine = this.soldierName.node.getComponent(cc.LabelOutline)
            outLine.color = cc.color(GlobalUtil.getSoldierNameColor(cfg.color, true))

            GlobalUtil.setSpriteIcon(this.node, this.classIcon, GlobalUtil.getSoldierClassIconById(cfg.class))

            GlobalUtil.setUiSoldierSpineData(this.node, this.spine, cfg.skin, true)
            this.spine.node.scale = show_cfg.scale

            this.soldierLvLab.node.active = true
            this.soldierLvLab.string = `${this._typeArr[this._curType - 1]}${gdk.i18n.t("i18n:BINGYING_TIP7")}LV.${show_cfg.rounds + 1}`


            let showLv = 0
            let totalLv = 0
            if (showIndex > 0) {
                let preCfg = s_cfgs[showIndex - 1]
                showLv = this._curTypeLv - preCfg.barracks_lv
                totalLv = show_cfg.barracks_lv - preCfg.barracks_lv
            } else {
                showLv = this._curTypeLv
                totalLv = show_cfg.barracks_lv
            }
            this.proBar.node.active = true
            this.proBar.progress = showLv / totalLv
        } else {
            this.soldierNode.active = false
            this.proBar.node.active = false
        }

        if (this._curTypeLv == this._typeCfgs.length - 1) {
            this.soldierLvLab.node.active = false
        }
    }

    _updateAttrInfo() {
        let obj = BYUtils.getTotalAttr(this._curType, this._curTypeLv)
        let attrDatas = []
        let keys = []
        for (let key in obj) {
            attrDatas.push(obj[key])
            keys.push(key)
        }

        for (let i = 0; i < attrDatas.length; i++) {
            let node = this.attrItems[i]
            if (node) {
                let info: AttrType = attrDatas[i]
                info.keyName = keys[i]
                let ctrl = node.getComponent(BYAttrItemCtrl)
                ctrl.updateViewInfo(this._curType, info)
            }
        }
    }

    _updateBtnState() {
        let costs = this._b_cfg.consumption
        let isGray = false
        for (let i = 0; i < costs.length; i++) {
            let ownNum = GlobalUtil.getMoneyNum(costs[i][0])
            if (ownNum < costs[i][1]) {
                isGray = true
                break
            }
        }
        let on = this.btnUpgrade.getChildByName("on")
        let off = this.btnUpgrade.getChildByName("off")
        if (isGray) {
            GlobalUtil.setGrayState(this.btnUpgrade, 1)
            on.active = false
            off.active = true
        } else {
            GlobalUtil.setGrayState(this.btnUpgrade, 0)
            on.active = true
            off.active = false
        }
    }

    upgradeFunc() {
        if (this._isNoEnough) {

            let costs = this._b_cfg.consumption
            for (let i = 0; i < costs.length; i++) {
                let ownNum = BagUtils.getItemNumById(costs[i][0])
                if (ownNum < costs[i][1]) {
                    GlobalUtil.openGainWayTips(costs[i][0])
                    return
                }
            }
        }

        let self = this
        let msg = new icmsg.BarrackLevelupReq()
        msg.type = this._curType
        NetManager.send(msg, (data: icmsg.BarrackLevelupRsp) => {
            this.byModel.byLevelsData[data.type - 1] = data.level
            gdk.Timer.callLater(this, () => {
                self._updateViewInfo()

                let index = data.level % 6
                if (index == 0) {
                    index = 6
                }
                for (let i = 0; i < this.items.length; i++) {
                    let node = this.items[i]
                    let ctrl = node.getComponent(BYItemCtrl)
                    if (index - 1 == i) {
                        ctrl.playerUpgradeEffect()
                    }
                }
            })
            JumpUtils.updatePowerTip(this.roleModel.power, this.roleModel.power + data.diff);
            gdk.e.emit(BYEventId.UPDATE_BY_INFO)

            let model = ModelManager.get(HeroModel)
            model.fightHeroIdxTower = {};
            model.fightHeroIdx = {};

            //激活士兵
            let b_cfg = ConfigManager.getItemByField(BarracksCfg, "type", this._curType, { barracks_lv: data.level })
            if (b_cfg && b_cfg.soldier_id && b_cfg.soldier_id > 0) {
                let heros = this.heroModel.PveUpHeroList
                for (let i = 0; i < heros.length; i++) {
                    if (heros[i] > 0) {
                        HeroUtils.addHeroActiveSoldiers(heros[i], [b_cfg.soldier_id])
                    }
                }
                //获得士兵效果
                gdk.panel.open(PanelId.BYGetSoldierEffect, (node: cc.Node) => {
                    let ctrl = node.getComponent(BYGetSoldierEffectCtrl)
                    ctrl.showSoldierGetEffect(b_cfg.soldier_id)
                })
            }

            //更新士兵的属性
            let sModel = ModelManager.get(SoldierModel)
            let heroSoldiers = sModel.heroSoldiers
            for (let key in heroSoldiers) {
                let soldierType = heroSoldiers[key]
                if (b_cfg) {
                    if (b_cfg.hp_g) {
                        for (let id in soldierType.items) {
                            soldierType.items[id].hpG += b_cfg.hp_g
                        }
                    }
                    if (b_cfg.atk_g) {
                        for (let id in soldierType.items) {
                            soldierType.items[id].atkG += b_cfg.atk_g
                        }
                    }
                    if (b_cfg.def_g) {
                        for (let id in soldierType.items) {
                            soldierType.items[id].defG += b_cfg.def_g
                        }
                    }
                }
            }
        })
    }

    openTechSoldierFunc() {
        if (this._showSoldierId > 0) {
            gdk.panel.setArgs(PanelId.TechSoldier, this._showSoldierId)
            gdk.panel.open(PanelId.TechSoldier)
        }
    }

    openBookFunc() {
        gdk.panel.setArgs(PanelId.BYBookView, this._curType, this._showSoldierId)
        gdk.panel.open(PanelId.BYBookView)
    }

    openSkinFunc() {
        //gdk.panel.setArgs(PanelId.BYBookView, this._curType, this._showSoldierId)
        gdk.panel.open(PanelId.BYarmyView)
    }
}
