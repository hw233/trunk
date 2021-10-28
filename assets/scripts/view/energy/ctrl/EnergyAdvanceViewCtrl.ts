import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import EnergyModel from '../model/EnergyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import StringUtils from '../../../common/utils/StringUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { EnergyEventId } from '../enum/EnergyEventId';
import { Energystation_advancedCfg, Energystation_upgradeCfg, Hero_starCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-27 10:52:19 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/energy/EnergyAdvanceViewCtrl")
export default class EnergyAdvanceViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    progress: cc.Node = null;

    @property(cc.Node)
    proTopView: cc.Node = null;

    @property(cc.Label)
    proNum: cc.Label = null;

    @property(cc.Node)
    nextAttrNode: cc.Node = null;

    @property(cc.Label)
    Lv: cc.Label = null;

    @property(cc.Node)
    lvProgressNode: cc.Node = null;

    @property(cc.Node)
    curPercentValueNode: cc.Node = null;

    @property(cc.Node)
    heroMaterialNode: cc.Node = null;

    @property(cc.Node)
    otherMaterialNode: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    advenceBtn: cc.Node = null;

    @property(cc.Node)
    topLvTips: cc.Node = null;

    get EnergyModel(): EnergyModel { return ModelManager.get(EnergyModel); }
    curStationType: number;
    heroMaterialIds: number[] = [];
    maxTime: number;
    proTween: cc.Tween;
    onEnable() {
        this.curStationType = this.args[0];
        this._updateView();
        gdk.e.on(EnergyEventId.ENERGY_HERO_MATERIALS_SELECT, this._onHeroMaterialsSelect, this);
    }

    onDisable() {
        if (this.proTween) {
            this.proTween.stop();
            this.proTween = null;
        }
        gdk.e.targetOff(this);
    }

    onAdvenceBtnClick() {
        let info = this.EnergyModel.energyStationInfo[this.curStationType];
        let curAdvanceCfg = ConfigManager.getItemById(Energystation_advancedCfg, info.advanceId);
        let nextAdvanceCfg = ConfigManager.getItemByField(Energystation_advancedCfg, 'index', curAdvanceCfg.index + 1, { type: curAdvanceCfg.type });
        if (nextAdvanceCfg.limit) {
            let curUpgradeCfg = ConfigManager.getItemById(Energystation_upgradeCfg, info.upgradeId);
            if (curUpgradeCfg.level < nextAdvanceCfg.limit) {
                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:ENERGY_STATION_TIP1'), nextAdvanceCfg.limit))
                return;
            }
        }

        if (nextAdvanceCfg.hero_consumption) {
            if (this.heroMaterialIds.length !== nextAdvanceCfg.hero_consumption[2]) {
                gdk.gui.showMessage(gdk.i18n.t('i18n:ENERGY_STATION_TIP2'));
                return
            }
        }

        for (let i = 0; i < nextAdvanceCfg.consumption.length; i++) {
            let c = nextAdvanceCfg.consumption[i];
            if (BagUtils.getItemNumById(c[0]) < c[1]) {
                gdk.gui.showMessage(`${BagUtils.getConfigById(c[0]).name}${gdk.i18n.t('i18n:RELIC_TIP11')}`);
                return;
            }
        }

        let req = new icmsg.EnergyStationAdvanceReq();
        req.advanceId = nextAdvanceCfg.id;
        req.staffHeroIds = this.heroMaterialIds;
        NetManager.send(req, (resp: icmsg.EnergyStationAdvanceRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            let cb = () => {
                if (ConfigManager.getItemById(Energystation_advancedCfg, resp.info.advanceId).level == 0) {
                    gdk.panel.setArgs(PanelId.EnergySuccView, [2, this.curStationType]);
                    gdk.panel.open(PanelId.EnergySuccView);
                }
                else {
                    let attrNames = ['hero_atk_r', 'hero_hp_r', 'hero_def_r'];
                    let s = [gdk.i18n.t('i18n:ROLE_TIP36'), gdk.i18n.t('i18n:ROLE_TIP34'), gdk.i18n.t('i18n:ROLE_TIP37')];
                    for (let i = 0; i < attrNames.length; i++) {
                        let d = Math.floor(nextAdvanceCfg[attrNames[i]]) - Math.floor(curAdvanceCfg[attrNames[i]]);
                        if (d > 0) {
                            gdk.gui.showMessage(`${s[i]}:+${d}%`);
                        }
                    }
                }
                this._updateView();
            }
            //进度动画
            let cfgs = ConfigManager.getItems(Energystation_advancedCfg, (cfg: Energystation_advancedCfg) => {
                if (this.curStationType == cfg.type && nextAdvanceCfg.class == cfg.class) {
                    return true;
                }
            });
            this._playProgressAni(nextAdvanceCfg.level, cfgs.length - 1, true, cb);
        }, this);
    }

    /**英雄材料消耗 */
    onHeroMaterialAddBtnClick() {
        let info = this.EnergyModel.energyStationInfo[this.curStationType];
        let curAdvanceCfg = ConfigManager.getItemById(Energystation_advancedCfg, info.advanceId);
        let nextAdvanceCfg = ConfigManager.getItemByField(Energystation_advancedCfg, 'index', curAdvanceCfg.index + 1, { type: curAdvanceCfg.type });
        gdk.panel.setArgs(PanelId.EnergyMaterialsView, [nextAdvanceCfg.hero_consumption, [...this.heroMaterialIds]]);
        gdk.panel.open(PanelId.EnergyMaterialsView);
    }

    onAdvancePreBtnClick() {
        gdk.panel.setArgs(PanelId.EnergyAdvancePreView, this.curStationType);
        gdk.panel.open(PanelId.EnergyAdvancePreView);
    }

    _updateView() {
        this.heroMaterialIds = [];
        this._updateContent();
        this._updateCost();
        this._initProgress();
    }

    _updateContent() {
        let info = this.EnergyModel.energyStationInfo[this.curStationType];
        let advanceCfg = ConfigManager.getItemById(Energystation_advancedCfg, info.advanceId);
        this.Lv.string = `Lv.${advanceCfg.class}`;
        let cfgs = ConfigManager.getItems(Energystation_advancedCfg, (cfg: Energystation_advancedCfg) => {
            if (this.curStationType == cfg.type && advanceCfg.class == cfg.class) {
                return true;
            }
        });
        this.lvProgressNode.getChildByName('bar').width = Math.max(0, advanceCfg.level / (cfgs.length - 1) * 452);
        this.lvProgressNode.getChildByName('num').getComponent(cc.Label).string = `${Math.floor(advanceCfg.level / (cfgs.length - 1) * 100)}%`;
        let attrNames = ['hero_atk_r', 'hero_hp_r', 'hero_def_r'];
        this.curPercentValueNode.children.forEach((n, idx) => {
            let num = advanceCfg[attrNames[idx]];
            n.getChildByName('num').getComponent(cc.Label).string = `+${Math.floor(num)}%`
        });
    }

    _updateCost() {
        this._updateHeroMaterialNode();
        let info = this.EnergyModel.energyStationInfo[this.curStationType];
        let curAdvanceCfg = ConfigManager.getItemById(Energystation_advancedCfg, info.advanceId);
        let nextAdvanceCfg = ConfigManager.getItemByField(Energystation_advancedCfg, 'index', curAdvanceCfg.index + 1, { type: curAdvanceCfg.type });
        this.otherMaterialNode.removeAllChildren();
        if (nextAdvanceCfg && nextAdvanceCfg.consumption && nextAdvanceCfg.consumption.length > 0) {
            nextAdvanceCfg.consumption.forEach(r => {
                let slot = cc.instantiate(this.slotPrefab);
                let ctrl = slot.getComponent(UiSlotItem);
                slot.parent = this.otherMaterialNode;
                let hasNum = BagUtils.getItemNumById(r[0]);
                ctrl.updateItemInfo(r[0], hasNum);
                ctrl.itemInfo = {
                    series: null,
                    itemId: r[0],
                    itemNum: hasNum,
                    type: BagUtils.getItemTypeById(r[0]),
                    extInfo: null
                };
                let color = hasNum >= r[1] ? '#FFFFFF' : '#FF0000'
                ctrl.updateNumLab(`${GlobalUtil.numberToStr(hasNum, true, true)}/${GlobalUtil.numberToStr(r[1], true, true)}`, null, cc.color().fromHEX(color));
            });
        }
        this.advenceBtn.active = !!nextAdvanceCfg;
        this.topLvTips.active = !nextAdvanceCfg;
    }

    _updateHeroMaterialNode() {
        let info = this.EnergyModel.energyStationInfo[this.curStationType];
        let curAdvanceCfg = ConfigManager.getItemById(Energystation_advancedCfg, info.advanceId);
        let nextAdvanceCfg = ConfigManager.getItemByField(Energystation_advancedCfg, 'index', curAdvanceCfg.index + 1, { type: curAdvanceCfg.type });
        this.heroMaterialNode.active = !!nextAdvanceCfg && nextAdvanceCfg.hero_consumption;
        if (this.heroMaterialNode.active) {
            GlobalUtil.setSpriteIcon(this.node, this.heroMaterialNode.getChildByName('group'), GlobalUtil.getGroupIcon(nextAdvanceCfg.hero_consumption[0], false));
            this.heroMaterialNode.getChildByName('starLabel').active = nextAdvanceCfg.hero_consumption[1] !== 0;
            if (nextAdvanceCfg.hero_consumption[1] !== 0) {
                this.heroMaterialNode.getChildByName('starLabel').getComponent(cc.Label).string = nextAdvanceCfg.hero_consumption[1] > 5 ? '1'.repeat(nextAdvanceCfg.hero_consumption[1] - 5) : '0'.repeat(nextAdvanceCfg.hero_consumption[1]);
            }
            let color = ConfigManager.getItemById(Hero_starCfg, nextAdvanceCfg.hero_consumption[1]).color;
            GlobalUtil.setSpriteIcon(this.node, this.heroMaterialNode.getChildByName('frame'), `common/texture/sub_itembg0${color}`);
            this.heroMaterialNode.getChildByName('num').getComponent(cc.Label).string = `${this.heroMaterialIds.length}/${nextAdvanceCfg.hero_consumption[2]}`
            this.heroMaterialNode.getChildByName('num').color = cc.color().fromHEX(this.heroMaterialIds.length == nextAdvanceCfg.hero_consumption[2] ? '#FFFFFF' : '#FF0000');
            this.heroMaterialNode.getChildByName('icon').active = this.heroMaterialIds.length == nextAdvanceCfg.hero_consumption[2];
            this.heroMaterialNode.getChildByName('mask').active = this.heroMaterialIds.length !== nextAdvanceCfg.hero_consumption[2];
            this.heroMaterialNode.getChildByName('RedPoint').active = RedPointUtils.is_energy_can_advance(this.curStationType) && this.heroMaterialIds.length !== nextAdvanceCfg.hero_consumption[2];
        }
    }

    _playProgressAni(cur, max, withAni: boolean = true, cb?: Function) {
        this.maxTime = max;
        if (this.CurPercent !== cur && withAni) {
            if (this.proTween) {
                this.proTween.stop();
                this.proTween = null;
            }
            this.proTween = cc.tween().target(this)
                .to(.5, { CurPercent: cur })
                .call(() => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    this.proTween = null;
                    cb && cb();
                })
                .start()
        }
        else {
            this.CurPercent = cur;
        }
    }

    _initProgress() {
        let info = this.EnergyModel.energyStationInfo[this.curStationType];
        let curAdvanceCfg = ConfigManager.getItemById(Energystation_advancedCfg, info.advanceId);
        let cfgs = ConfigManager.getItems(Energystation_advancedCfg, (cfg: Energystation_advancedCfg) => {
            if (cfg.type == curAdvanceCfg.type && cfg.class == curAdvanceCfg.class) {
                return true;
            }
        });
        this._playProgressAni(curAdvanceCfg.level, cfgs.length - 1);
        this._updateNextAttrTips();
    }

    _updateNextAttrTips() {
        let info = this.EnergyModel.energyStationInfo[this.curStationType];
        let curAdvanceCfg = ConfigManager.getItemById(Energystation_advancedCfg, info.advanceId);
        let nextAdvanceCfg = ConfigManager.getItemByField(Energystation_advancedCfg, 'index', curAdvanceCfg.index + 1, { type: curAdvanceCfg.type });
        let attrNames = ['hero_atk_r', 'hero_hp_r', 'hero_def_r'];
        this.nextAttrNode.children.forEach((n, idx) => {
            n.active = false;
            if (nextAdvanceCfg) {
                let d = Math.floor(nextAdvanceCfg[attrNames[idx]]) - Math.floor(curAdvanceCfg[attrNames[idx]]);
                if (d > 0) {
                    n.active = true;
                    n.getChildByName('value').getComponent(cc.Label).string = `+${d}%`;
                }
            }
        });
        let arrow = cc.find('mask/content/arrowNode', this.node);
        arrow.active = !!nextAdvanceCfg;
        if (arrow.active) {
            let cfgs = ConfigManager.getItems(Energystation_advancedCfg, (cfg: Energystation_advancedCfg) => {
                if (cfg.type == curAdvanceCfg.type && cfg.class == curAdvanceCfg.class) {
                    return true;
                }
            });
            arrow.y = 20 + nextAdvanceCfg.level / (cfgs.length - 1) * 300;
        }
    }

    _curPercent: number = 0;
    get CurPercent(): number { return this._curPercent; }
    set CurPercent(v: number) {
        this._curPercent = v;
        let maxH = 319;
        this.progress.height = Math.min(maxH, Math.floor(maxH / this.maxTime * v));
        this.proTopView.y = this.progress.height + 13;
        this.proTopView.active = v >= 0 && this.progress.height >= 45;
        this.proNum.string = `${Math.floor(v / this.maxTime * 100)}/`;
        if (this.progress.height == maxH) {
            this.proNum.string = `100/`;
        }
    }

    _onHeroMaterialsSelect(e) {
        this.heroMaterialIds = [...e.data];
        this._updateHeroMaterialNode();
    }
}
