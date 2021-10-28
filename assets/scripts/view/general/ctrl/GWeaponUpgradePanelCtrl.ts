import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GeneralModel from '../../../common/models/GeneralModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import {
    General_skinCfg,
    General_weapon_levelCfg,
    General_weapon_progressCfg,
    General_weaponCfg
    } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/general/GWeaponUpgradePanelCtrl")
export default class GWeaponUpgradePanelCtrl extends gdk.BasePanel {
    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    bufLab: cc.Label = null;

    // @property(cc.Node)
    // weaponIcon: cc.Node = null;

    @property(sp.Skeleton)
    weaponSpine: sp.Skeleton = null;

    @property(cc.Button)
    leftBtn: cc.Button = null;

    @property(cc.Button)
    rightBtn: cc.Button = null;

    @property(cc.RichText)
    curRefineLab: cc.RichText = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    upgradeNode: cc.Node = null;

    @property(cc.Node)
    refineNode: cc.Node = null;

    get generalModel(): GeneralModel { return ModelManager.get(GeneralModel); }
    curSelect: number;
    switchLock: boolean = false;
    curLvCfg: General_weapon_levelCfg;
    onEnable() {
        let arg = this.args[0];
        if (!arg && arg !== 0) arg = 0;
        this.uiTabMenu.setSelectIdx(arg, true);
        this.curLvCfg = ConfigManager.getItemById(General_weapon_levelCfg, this.generalModel.waponLvCfgId);
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateCostNode, this);
        NetManager.on(icmsg.RoleUpdateRsp.MsgType, this._updateCostNode, this);
    }

    onDisable() {
        // this.weaponIcon.stopAllActions();
        NetManager.targetOff(this);
    }

    onWeaponInfoClick() {
        gdk.panel.open(PanelId.GWeaponInfoView);
    }

    onUpgradeBtnClick() {
        let nextCfg = ConfigManager.getItemById(General_weapon_levelCfg, this.generalModel.waponLvCfgId + 1);
        if (!nextCfg) return;
        for (let i = 0; i < nextCfg.cost.length; i++) {
            let cost = nextCfg.cost[i];
            if (BagUtils.getItemNumById(cost[0]) < cost[1]) {
                gdk.gui.showMessage(`${BagUtils.getConfigById(cost[0]).name}${gdk.i18n.t('i18n:RELIC_TIP11')}`);
                return;
            }
        }

        let req = new icmsg.GeneralWeaponLevelUpgradeReq();
        req.isQuickUpgrade = false;
        NetManager.send(req, (resp: icmsg.GeneralWeaponLevelUpgradeRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            let curCfg = ConfigManager.getItemById(General_weapon_levelCfg, resp.curId);
            let oldCfg = ConfigManager.getItemById(General_weapon_levelCfg, resp.curId - 1);
            if (curCfg.lv !== this.curLvCfg.lv) {
                // gdk.panel.open()
                gdk.panel.setArgs(PanelId.GWeaponUpgradeSucView, 0);
                gdk.panel.open(PanelId.GWeaponUpgradeSucView);
                this.curLvCfg = curCfg;
                return;
            }
            if (curCfg.atk_g - oldCfg.atk_g > 0) {
                gdk.gui.showMessage(`${gdk.i18n.t('i18n:ROLE_TIP36')}:+${curCfg.atk_g - oldCfg.atk_g}`);
            }
            if (curCfg.def_g - oldCfg.def_g > 0) {
                gdk.gui.showMessage(`${gdk.i18n.t('i18n:ROLE_TIP37')}:+${curCfg.def_g - oldCfg.def_g}`);
            }
            if (curCfg.hp_g - oldCfg.hp_g > 0) {
                gdk.gui.showMessage(`${gdk.i18n.t('i18n:ROLE_TIP34')}:+${curCfg.hp_g - oldCfg.hp_g}`);
            }
        }, this);
    }

    onOneKeyBtnClick() {
        let nextCfgId = this.generalModel.waponLvCfgId + 1;
        let finalLv = this.generalModel.weaponLv;
        let totalCost = {};
        let cfgs = ConfigManager.getItems(General_weapon_levelCfg, (cfg: General_weapon_levelCfg) => {
            if (cfg.id >= nextCfgId) return true;
        });
        let tipsStr = '';
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i];
            let temp = JSON.parse(JSON.stringify(totalCost));
            for (let i = 0; i < cfg.cost.length; i++) {
                if (!temp[cfg.cost[i][0]]) temp[cfg.cost[i][0]] = 0;
                temp[cfg.cost[i][0]] += cfg.cost[i][1];
            }
            let flag = true;
            for (let key in temp) {
                if (BagUtils.getItemNumById(parseInt(key)) < temp[key]) {
                    flag = false;
                    if (Object.keys(totalCost).length <= 0) {
                        tipsStr = `${BagUtils.getConfigById(parseInt(key)).name}${gdk.i18n.t('i18n:RELIC_TIP11')}`;
                    }
                    break;
                }
            }
            if (flag) {
                totalCost = temp;
                finalLv = cfg.lv;
            }
            else {
                break;
            }
        }

        if (Object.keys(totalCost).length <= 0) {
            gdk.gui.showMessage(tipsStr);
        }
        else {
            let str = '';
            for (let key in totalCost) {
                str += `、${totalCost[key]}${BagUtils.getConfigById(parseInt(key)).name}`;
            }
            GlobalUtil.openAskPanel({
                descText: StringUtils.format(gdk.i18n.t('i18n:GENERAL_WEAPON_TIP3'), str.slice(1), finalLv),
                sureCb: () => {
                    let req = new icmsg.GeneralWeaponLevelUpgradeReq();
                    req.isQuickUpgrade = true;
                    NetManager.send(req, (resp: icmsg.GeneralWeaponLevelUpgradeRsp) => {
                        if (!cc.isValid(this.node)) return;
                        if (!this.node.activeInHierarchy) return;
                        let curCfg = ConfigManager.getItemById(General_weapon_levelCfg, resp.curId);
                        let oldCfg = ConfigManager.getItemById(General_weapon_levelCfg, resp.curId - 1);
                        if (curCfg.lv !== this.curLvCfg.lv) {
                            gdk.panel.setArgs(PanelId.GWeaponUpgradeSucView, 0);
                            gdk.panel.open(PanelId.GWeaponUpgradeSucView);
                            this.curLvCfg = curCfg;
                            return;
                        }
                        if (curCfg.atk_g - oldCfg.atk_g > 0) {
                            gdk.gui.showMessage(`${gdk.i18n.t('i18n:ROLE_TIP36')}:+${curCfg.atk_g - oldCfg.atk_g}`);
                        }
                        if (curCfg.def_g - oldCfg.def_g > 0) {
                            gdk.gui.showMessage(`${gdk.i18n.t('i18n:ROLE_TIP37')}:+${curCfg.def_g - oldCfg.def_g}`);
                        }
                        if (curCfg.hp_g - oldCfg.hp_g > 0) {
                            gdk.gui.showMessage(`${gdk.i18n.t('i18n:ROLE_TIP34')}:+${curCfg.hp_g - oldCfg.hp_g}`);
                        }
                    }, this);
                }
            })
        }
    }

    onRefineBtnClick() {
        let nextCfg = ConfigManager.getItemByField(General_weapon_progressCfg, 'lv', this.generalModel.weaponRefineLv + 1);
        if (!nextCfg) return;
        for (let i = 0; i < nextCfg.consumption.length; i++) {
            let cost = nextCfg.consumption[i];
            if (BagUtils.getItemNumById(cost[0]) < cost[1]) {
                gdk.gui.showMessage(`${BagUtils.getConfigById(cost[0]).name}${gdk.i18n.t('i18n:RELIC_TIP11')}`);
                return;
            }
        }

        let req = new icmsg.GeneralWeaponProgressUpgradeReq();
        NetManager.send(req, (resp: icmsg.GeneralWeaponProgressUpgradeRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            gdk.panel.setArgs(PanelId.GWeaponUpgradeSucView, 1);
            gdk.panel.open(PanelId.GWeaponUpgradeSucView);
        }, this);
    }

    onWeaponListBtnClick() {
        gdk.panel.open(PanelId.GeneralWeapon);
    }

    onSwithcBtnClick(e, type) {
        this.switchLock = true;
        let d = type == 'left' ? -1 : 1;
        let list = this.generalModel.weaponList.slice(1);
        let idx = list.indexOf(this.generalModel.curUseWeapon);
        let newIdx = idx + d;
        if (newIdx > list.length - 1) newIdx = 0;
        if (newIdx < 0) newIdx = list.length - 1;
        let req = new icmsg.GeneralChangeWeaponReq();
        req.weaponId = list[newIdx];
        NetManager.send(req, (resp: icmsg.GeneralChangeWeaponRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.switchLock = false;
        }, this);
    }

    onTabMenuSelect(e, type) {
        if (!e) return;
        this.curSelect = parseInt(type);
        this.upgradeNode.active = this.curSelect == 0;
        this.refineNode.active = this.curSelect == 1;
        this._updateUpgradeNode();
        this._updateRefineNode();
    }

    @gdk.binding("generalModel.waponLvCfgId")
    @gdk.binding("generalModel.weaponLv")
    _updateUpgradeNode() {
        if (!this.upgradeNode.active) return;
        let totalExp: number = 0;
        let curExp: number = 0;
        let curCfg = ConfigManager.getItemById(General_weapon_levelCfg, this.generalModel.waponLvCfgId);
        let nextCfg = ConfigManager.getItemById(General_weapon_levelCfg, this.generalModel.waponLvCfgId + 1);
        let lvCfgs = ConfigManager.getItemsByField(General_weapon_levelCfg, 'lv', Math.max(1, this.generalModel.weaponLv));
        for (let i = 0; i < lvCfgs.length; i++) {
            totalExp += lvCfgs[i].id == 0 ? 0 : lvCfgs[i].exp;
            if (lvCfgs[i].times <= curCfg.times) {
                curExp += lvCfgs[i].id == 0 ? 0 : lvCfgs[i].exp;
            }
        }

        let atkLab = cc.find('atkVLab', this.upgradeNode).getComponent(cc.Label);
        let defLab = cc.find('defVLab', this.upgradeNode).getComponent(cc.Label);
        let hpLab = cc.find('hpVLab', this.upgradeNode).getComponent(cc.Label);
        let bar = cc.find('progress/bar', this.upgradeNode);
        let proNum = cc.find('progress/num', this.upgradeNode).getComponent(cc.Label);
        let topLv = cc.find('topLv', this.upgradeNode);
        let oneKeyBtn = cc.find('oneKeyBtn', this.upgradeNode);
        let upgradeBtn = cc.find('upgradeBtn', this.upgradeNode);
        atkLab.string = '+' + curCfg.atk_g;
        defLab.string = '+' + curCfg.def_g;
        hpLab.string = '+' + curCfg.hp_g;
        bar.width = Math.min(621, curExp / totalExp * 621);
        proNum.string = `${curExp}/${totalExp}`;
        if (nextCfg) {
            oneKeyBtn.active = upgradeBtn.active = true;
            topLv.active = false;
        }
        else {
            oneKeyBtn.active = upgradeBtn.active = false;
            topLv.active = true;
        }
        this._updateRefineAtrs();
        this._updateCostNode();
        let weaponCfg = ConfigManager.getItemByField(General_weaponCfg, 'artifactid', this.generalModel.curUseWeapon);
        this.nameLab.string = weaponCfg.name + `+${this.generalModel.weaponLv}【${gdk.i18n.t('i18n:GENERAL_WEAPON_TIP4')}+${this.generalModel.weaponRefineLv}】`;
    }

    @gdk.binding("generalModel.weaponRefineLv")
    _updateRefineNode() {
        if (!this.refineNode.active) return;
        let valueNode = cc.find('layout', this.refineNode);
        let refineBtn = cc.find('refineBtn', this.refineNode);
        let topLv = cc.find('topLv', this.refineNode);
        let curCfg = ConfigManager.getItemByField(General_weapon_progressCfg, 'lv', this.generalModel.weaponRefineLv);
        let nextCfg = ConfigManager.getItemByField(General_weapon_progressCfg, 'lv', this.generalModel.weaponRefineLv + 1);
        refineBtn.active = !!nextCfg
        topLv.active = !refineBtn.active;
        valueNode.children.forEach((n, idx) => {
            if (idx == 0) {
                cc.find('lv', n).getComponent(cc.Label).string = (curCfg ? curCfg.lv : 0) + '';
                cc.find('add', n).getComponent(cc.Label).string = (curCfg ? Math.floor(curCfg.dmg_add / 100) : 0) + '%';
                cc.find('res', n).getComponent(cc.Label).string = (curCfg ? Math.floor(curCfg.dmg_res / 100) : 0) + '%';
            }
            else if (idx == 1) {
                n.active = !!nextCfg;
            }
            else {
                n.active = !!nextCfg;
                if (n.active) {
                    cc.find('lv', n).getComponent(cc.Label).string = nextCfg.lv + '';
                    cc.find('add', n).getComponent(cc.Label).string = Math.floor(nextCfg.dmg_add / 100) + '%';
                    cc.find('res', n).getComponent(cc.Label).string = Math.floor(nextCfg.dmg_res / 100) + '%';
                }
            }
        });
        this._updateRefineAtrs();
        this._updateCostNode();
        let weaponCfg = ConfigManager.getItemByField(General_weaponCfg, 'artifactid', this.generalModel.curUseWeapon);
        this.nameLab.string = weaponCfg.name + `+${this.generalModel.weaponLv}【${gdk.i18n.t('i18n:GENERAL_WEAPON_TIP4')}+${this.generalModel.weaponRefineLv}】`;
    }

    @gdk.binding("generalModel.curUseWeapon")
    _updateCurWeapon() {
        let weaponCfg = ConfigManager.getItemByField(General_weaponCfg, 'artifactid', this.generalModel.curUseWeapon);
        this.bufLab.string = weaponCfg.tip;
        this.nameLab.string = weaponCfg.name + `+${this.generalModel.weaponLv}【${gdk.i18n.t('i18n:GENERAL_WEAPON_TIP4')}+${this.generalModel.weaponRefineLv}】`;
        let color = weaponCfg.quality;
        this.nameLab.node.color = BagUtils.getColor(color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(color);
        let url = StringUtils.format('spine/weapon/{0}/1/{0}', ConfigManager.getItemById(General_skinCfg, weaponCfg.resources).road);
        GlobalUtil.setSpineData(this.node, this.weaponSpine, url, false, 'stand', true);
        // let url = `view/general/texture/weapon/${ConfigManager.getItemById(General_skinCfg, weaponCfg.resources).road}`;
        // GlobalUtil.setSpriteIcon(this.node, this.weaponIcon, url);
        // this.weaponIcon.stopAllActions();
        // this.weaponIcon.setPosition(30, 274);
        // this.weaponIcon.runAction(cc.repeatForever(
        //     cc.sequence(
        //         cc.moveBy(1, 0, -20),
        //         cc.moveBy(1, 0, 20)
        //     )
        // ));
    }

    _updateRefineAtrs() {
        let curCfg = ConfigManager.getItemByField(General_weapon_progressCfg, 'lv', this.generalModel.weaponRefineLv);
        let lv = curCfg ? curCfg.lv : 0;
        let add = curCfg ? Math.floor(curCfg.dmg_add / 100) : 0;
        let res = curCfg ? Math.floor(curCfg.dmg_res / 100) : 0;
        this.curRefineLab.string = StringUtils.format(gdk.i18n.t('i18n:GENERAL_WEAPON_TIP5'), lv, add, res);
        let cfgs = ConfigManager.getItems(General_weapon_progressCfg, (cfg: General_weapon_progressCfg) => {
            if (cfg.skill && cfg.skill.length > 0) return true;
        })
        let colors = ['#717171', '#DDCFA9'];
        this.content.children.forEach((n, idx) => {
            n.active = !!cfgs[idx];
            if (n.active) {
                let skillCfg = GlobalUtil.getSkillCfg(cfgs[idx].skill[0]);
                n.getComponent(cc.Label).string = `${gdk.i18n.t('i18n:GENERAL_WEAPON_TIP4')}${cfgs[idx].lv}${gdk.i18n.t('i18n:GENERAL_WEAPON_TIP6')}:` + skillCfg.des;
                n.color = this.generalModel.weaponRefineLv >= cfgs[idx].lv ? cc.color().fromHEX(colors[1]) : cc.color().fromHEX(colors[0]);
            }
        });
    }

    _updateCostNode() {
        if (this.curSelect == 0) {
            //升级
            let costNode = cc.find('cost', this.upgradeNode);
            let nextCfg = ConfigManager.getItemById(General_weapon_levelCfg, this.generalModel.waponLvCfgId + 1);
            if (!nextCfg) {
                costNode.active = false;
            }
            else {
                costNode.active = true;
                let info = nextCfg.cost;
                costNode.children.forEach((n, idx) => {
                    let icon = cc.find('layout/icon', n);
                    let num = cc.find('layout/num', n).getComponent(cc.Label);
                    GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getIconById(info[idx][0]));
                    num.string = `${GlobalUtil.numberToStr2(BagUtils.getItemNumById(info[idx][0]), true)}/${GlobalUtil.numberToStr2(info[idx][1], true)}`;
                    num.node.color = cc.color().fromHEX(BagUtils.getItemNumById(info[idx][0]) >= info[idx][1] ? '#E7D8AC' : '#FF0000');
                });
            }
        }
        else {
            //精炼
            let costNode = cc.find('cost', this.refineNode);
            let nextCfg = ConfigManager.getItemByField(General_weapon_progressCfg, 'lv', this.generalModel.weaponRefineLv + 1);
            if (!nextCfg) {
                costNode.active = false;
            }
            else {
                costNode.active = true;
                let info = nextCfg.consumption;
                [cc.find('layout1', costNode), cc.find('layout2', costNode)].forEach((n, idx) => {
                    let icon = cc.find('icon', n);
                    let num = cc.find('num', n).getComponent(cc.Label);
                    GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getIconById(info[idx][0]));
                    num.string = `${GlobalUtil.numberToStr2(BagUtils.getItemNumById(info[idx][0]), true)}/${GlobalUtil.numberToStr2(info[idx][1], true)}`;
                    num.node.color = cc.color().fromHEX(BagUtils.getItemNumById(info[idx][0]) >= info[idx][1] ? '#E7D8AC' : '#FF0000');
                });
            }
        }
    }
}
