import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import ExpeditionModel from '../ExpeditionModel';
import ExpeditionUtils from '../ExpeditionUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../../common/utils/RedPointUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import UiTabMenuCtrl from '../../../../../common/widgets/UiTabMenuCtrl';
import { Expedition_buffCfg, Expedition_strengthenCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-16 16:17:40 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/army/ExpeditionStrengthenViewCtrl")
export default class ExpeditionStrengthenViewCtrl extends gdk.BasePanel {
    @property(UiTabMenuCtrl)
    attrTypeUiTabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    attrLabs: cc.Node = null;

    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    totalLvInfos: cc.Node = null;

    @property(cc.Node)
    strengthenInfo: cc.Node = null;

    @property(cc.Node)
    materialsItem: cc.Node = null;

    @property(UiTabMenuCtrl)
    careerUiTabMenu: UiTabMenuCtrl = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    get eModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    careerUrl: string[] = ['view/guild/texture/expedition/army/tdyz_qiangbing', 'view/guild/texture/expedition/army/tdyz_paobing', 'view/guild/texture/expedition/army/tdyz_shouwei'];
    buffAttrs: string[] = ['atk', 'def', 'hp', 'dmg_add', 'dmg_res', 'attribute'];
    buffNames: string[] = ['攻击 %s', '防御 %s', '生命 %s', '增伤 %s', '免伤 %s', '全属性伤害 %s<br/>全抗性 %s1'];
    curSelectBuffType: number;
    curSelectCareer: number;
    onEnable() {
        this.careerUiTabMenu.setSelectIdx(0, true);
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateRedpoint();
            this._updateStrengthenInfo();
        }, this);
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    @gdk.binding("eModel.expedtitionAllPower")
    _updatePower() {
        this.powerLab.string = this.eModel.expedtitionAllPower + '';
    }

    onArmySkillBtnClick() {
        gdk.panel.setArgs(PanelId.ExpeditionArmySkillPreviewView, this.curSelectCareer);
        gdk.panel.open(PanelId.ExpeditionArmySkillPreviewView);
    }

    onStrengthenBtnClick() {
        let curArmyTotalLv = this.eModel.armyLv;
        let lv = this.eModel.armyStrengthenStateMap[this.curSelectCareer][this.curSelectBuffType - 1];
        let nextLvCfg = ConfigManager.getItem(Expedition_strengthenCfg, (cfg: Expedition_strengthenCfg) => {
            if (cfg.professional_type == this.curSelectCareer && cfg.type == this.curSelectBuffType && cfg.level == lv + 1) {
                return true;
            }
        });
        if (nextLvCfg.limit > curArmyTotalLv) {
            gdk.gui.showMessage(`部队${nextLvCfg.limit}级解锁`);
            return;
        }
        for (let i = 0; i < nextLvCfg.consumption.length; i++) {
            if (BagUtils.getItemNumById(nextLvCfg.consumption[i][0]) < nextLvCfg.consumption[i][1]) {
                gdk.gui.showMessage(`${BagUtils.getConfigById(nextLvCfg.consumption[i][0]).name}不足`);
                return;
            }
        }

        let req = new icmsg.ExpeditionArmyStrengthenReq();
        req.professionalType = this.curSelectCareer;
        req.buffType = this.curSelectBuffType;
        NetManager.send(req, (resp: icmsg.ExpeditionArmyStrengthenRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateTotalLvInfo();
            this._updateBuffTypeLabs();
            this._updateStrengthenInfo();
            let totalLv = ExpeditionUtils.getTotalStrengthenLvByCareer(resp.professionalType);
            let cfg = ConfigManager.getItem(Expedition_buffCfg, (c: Expedition_buffCfg) => {
                if (c.professional_type == resp.professionalType && c.strengthen_level == totalLv) {
                    return true;
                }
            });
            if (cfg.buff_id) {
                gdk.panel.setArgs(PanelId.ExpeditionArmySkillInfo, cfg);
                gdk.panel.open(PanelId.ExpeditionArmySkillInfo);
            }
            let buffNode = this.attrTypeUiTabMenu.node.children[this.curSelectBuffType - 1];
            if (buffNode) {
                let spine = buffNode.getChildByName('actSpine').getComponent(sp.Skeleton);
                spine.node.active = true;
                spine.setCompleteListener(() => {
                    spine.setCompleteListener(null);
                    spine.node.active = false;
                });
                spine.setAnimation(0, 'stand', true);
            }
        }, this);
    }

    /**职业 */
    onCareerUiTabMenuSelect(e, type) {
        if (!e) return;
        if (this.curSelectCareer - 1 == parseInt(type)) return;
        this.curSelectCareer = parseInt(type) + 1;
        this.curSelectBuffType = null;
        this._updateTotalLvInfo();
        this._updateBuffTypeLabs();
        this.attrTypeUiTabMenu.setSelectIdx(0, true);
        this._updateRedpoint();
    }

    /**强化类型 */
    onBuffTypeUiTabMenuSelect(e, type) {
        if (!e) return;
        if (this.curSelectBuffType - 1 == parseInt(type)) return;
        this.curSelectBuffType = parseInt(type) + 1;
        this._updateStrengthenInfo();
    }

    _updateTotalLvInfo() {
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, this.careerUrl[this.curSelectCareer - 1]);
        let curLv = ExpeditionUtils.getTotalStrengthenLvByCareer(this.curSelectCareer);
        let nextSkillLvCfg = ExpeditionUtils.getNextUnLockStrengthenLvCfg(this.curSelectCareer);
        cc.find('curLv', this.totalLvInfos).getComponent(cc.Label).string = `强化总进度:Lv${curLv}`;
        let unlockSkillNode = cc.find('unLockSkillNode', this.totalLvInfos);
        unlockSkillNode.active = !!nextSkillLvCfg;
        if (nextSkillLvCfg) {
            cc.find('lvLab', unlockSkillNode).getComponent(cc.Label).string = `Lv${nextSkillLvCfg.strengthen_level}解锁:`;
            GlobalUtil.setSpriteIcon(this.node, cc.find('bg', unlockSkillNode), `common/texture/role/rune/zd_jinengkuang${nextSkillLvCfg.buff_color}`);
            GlobalUtil.setSpriteIcon(this.node, cc.find('bg/100302', unlockSkillNode), `icon/skill/${nextSkillLvCfg.buff_icon}`);
            cc.find('skillLab', unlockSkillNode).getComponent(cc.Label).string = GlobalUtil.getSkillCfg(nextSkillLvCfg.buff_id).name;
        }
        //progress
        let maxLv = nextSkillLvCfg ? nextSkillLvCfg.strengthen_level : curLv;
        cc.find('progress/num', this.totalLvInfos).getComponent(cc.Label).string = `Lv${curLv}/Lv${maxLv}`;
        cc.find('progress/bar', this.totalLvInfos).width = Math.max(0, 167 * (curLv / maxLv));
    }

    _updateBuffTypeLabs() {
        this.attrTypeUiTabMenu.node.children.forEach(n => {
            let spine = n.getChildByName('actSpine').getComponent(sp.Skeleton);
            spine.setCompleteListener(null);
            spine.node.active = false;
        })
        let LvInfos = this.eModel.armyStrengthenStateMap[this.curSelectCareer];
        this.attrLabs.children.forEach((n, idx) => {
            cc.find('lv', n).getComponent(cc.Label).string = LvInfos[idx] + '';
            let cfg = ConfigManager.getItem(Expedition_strengthenCfg, (cfg: Expedition_strengthenCfg) => {
                if (cfg.professional_type == this.curSelectCareer && cfg.type == idx + 1 && cfg.level == LvInfos[idx]) {
                    return true;
                }
            });
            cc.find('desc', n).getComponent(cc.RichText).string = `<color=#F7D6A3><outline color=#31201A width=2>${this.buffNames[idx].replace('%s', `<color=#00ff00>+${Math.floor(cfg[this.buffAttrs[idx]] / 100)}%</c>`).replace('%s1', `<color=#00ff00>+${Math.floor(cfg[this.buffAttrs[idx]] / 100)}%</c>`)}</c></outline></c>`;
        });
    }

    _updateStrengthenInfo() {
        let lv = this.eModel.armyStrengthenStateMap[this.curSelectCareer][this.curSelectBuffType - 1];
        let oldLvCfg = ConfigManager.getItem(Expedition_strengthenCfg, (cfg: Expedition_strengthenCfg) => {
            if (cfg.professional_type == this.curSelectCareer && cfg.type == this.curSelectBuffType && cfg.level == lv) {
                return true;
            }
        });
        let nextLvCfg = ConfigManager.getItem(Expedition_strengthenCfg, (cfg: Expedition_strengthenCfg) => {
            if (cfg.professional_type == this.curSelectCareer && cfg.type == this.curSelectBuffType && cfg.level == lv + 1) {
                return true;
            }
        });
        let curArmyTotalLv = this.eModel.armyLv;
        cc.find('layout/bg_jianto03', this.strengthenInfo).active = !!nextLvCfg;
        let oldInfo = cc.find('layout/old', this.strengthenInfo);
        let newInfo = cc.find('layout/new', this.strengthenInfo);
        let materialsContent = cc.find('materialsContent', this.strengthenInfo);
        let strengthenBtn = cc.find('strengthenBtn', this.strengthenInfo);
        newInfo.active = !!nextLvCfg;
        materialsContent.active = !!nextLvCfg;
        strengthenBtn.active = !!nextLvCfg;
        //#FFF7DE
        cc.find('maxLvTip', this.strengthenInfo).active = !nextLvCfg;
        cc.find('oldLv', oldInfo).getComponent(cc.Label).string = `Lv.${oldLvCfg.level}`;
        cc.find('oldV', oldInfo).getComponent(cc.RichText).string = `<color=#FFF7DE>${this.buffNames[this.curSelectBuffType - 1].replace('%s', `<color=#ffb400>+${Math.floor(oldLvCfg[this.buffAttrs[this.curSelectBuffType - 1]] / 100)}%</c>`).replace('%s1', `<color=#ffb400>+${Math.floor(oldLvCfg[this.buffAttrs[this.curSelectBuffType - 1]] / 100)}%</c>`)}</c>`
        if (nextLvCfg) {
            cc.find('newLv', newInfo).getComponent(cc.Label).string = `Lv.${nextLvCfg.level}`;
            cc.find('newV', newInfo).getComponent(cc.RichText).string = `<color=#FFF7DE>${this.buffNames[this.curSelectBuffType - 1].replace('%s', `<color=#ffb400>+${Math.floor(nextLvCfg[this.buffAttrs[this.curSelectBuffType - 1]] / 100)}%</c>`).replace('%s1', `<color=#ffb400>+${Math.floor(nextLvCfg[this.buffAttrs[this.curSelectBuffType - 1]] / 100)}%</c>`)}</c>`;
            materialsContent.removeAllChildren();
            nextLvCfg.consumption.forEach(r => {
                let item = cc.instantiate(this.materialsItem);
                item.parent = materialsContent;
                item.active = true;
                let ctrl = item.getComponent(UiSlotItem);
                ctrl.updateItemInfo(r[0]);
                let hasNum = BagUtils.getItemNumById(r[0]);
                ctrl.itemInfo = {
                    series: null,
                    itemId: r[0],
                    itemNum: hasNum,
                    type: BagUtils.getItemTypeById(r[0]),
                    extInfo: null
                };
                let lab = item.getChildByName('hasNumLab').getComponent(cc.Label);
                lab.string = `${hasNum}/${r[1]}`;
                lab.node.color = cc.color(hasNum >= r[1] ? '#F7D6A3' : '#FF0000');
            });
            strengthenBtn.getChildByName('lab').getComponent(cc.Label).string = nextLvCfg.limit <= curArmyTotalLv ? '强化' : `部队${nextLvCfg.limit}级解锁`;
            strengthenBtn.getComponent(cc.Button).interactable = nextLvCfg.limit <= curArmyTotalLv;
        }
    }

    _updateRedpoint() {
        //页签红点
        this.careerUiTabMenu.node.children.forEach((n, idx) => {
            n.getChildByName('RedPoint').active = RedPointUtils.has_expedition_army_strengthen_by_type(idx + 1, 1)
                || RedPointUtils.has_expedition_army_strengthen_by_type(idx + 1, 2)
                || RedPointUtils.has_expedition_army_strengthen_by_type(idx + 1, 3)
                || RedPointUtils.has_expedition_army_strengthen_by_type(idx + 1, 4)
                || RedPointUtils.has_expedition_army_strengthen_by_type(idx + 1, 5)
                || RedPointUtils.has_expedition_army_strengthen_by_type(idx + 1, 6)
        });

        //属性红点
        if (!this.curSelectCareer) return;
        this.attrTypeUiTabMenu.node.children.forEach((n, idx) => {
            n.getChildByName('RedPoint').active = RedPointUtils.has_expedition_army_strengthen_by_type(this.curSelectCareer, idx + 1);
        })
    }
}
