import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Global_powerCfg, Rune_clearCfg, RuneCfg } from '../../../../a/config';
import { RoleEventId } from '../../enum/RoleEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-30 17:10:48 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneInfoViewCtrl")
export default class RuneInfoViewCtrl extends gdk.BasePanel {
    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Node)
    qualityBg: cc.Node = null;

    @property(cc.Label)
    runeName: cc.Label = null;

    @property(cc.Label)
    lv2Lab: cc.Label = null;

    @property(cc.Label)
    power: cc.Label = null;

    @property(cc.Node)
    skillNode: cc.Node = null;

    @property(cc.Node)
    mixSkillNode: cc.Node = null;

    @property(cc.RichText)
    clearDesc: cc.RichText = null;

    @property(cc.Node)
    attrNode: cc.Node = null;

    @property(cc.RichText)
    desc: cc.RichText = null;

    @property(cc.Node)
    dressBtn: cc.Node = null;

    @property(cc.Node)
    replaceBtn: cc.Node = null;

    @property(cc.Node)
    unloadBtn: cc.Node = null;

    @property(cc.Node)
    decomposeBtn: cc.Node = null;

    @property(cc.Node)
    makeBtn: cc.Node = null;

    // @property(cc.Node)
    // composeBtn: cc.Node = null;

    // @property(cc.Node)
    // strengthenBtn: cc.Node = null;


    cfg: RuneCfg;
    pos: number;
    heroId: number;
    isMix: boolean;
    clearLv: number;
    runeId: number;
    onEnable() {
        let id;
        [id, this.pos, this.heroId] = this.args[0];
        this.runeId = id;
        this.isMix = id.toString().length == 8;
        if (this.isMix) {
            this.clearLv = parseInt(id.toString().slice(6));
            id = parseInt(id.toString().slice(0, 6));
        }
        this.cfg = ConfigManager.getItemById(RuneCfg, id);
        this.unloadBtn.active = false;
        this.replaceBtn.active = false;
        this.dressBtn.active = false;
        this.decomposeBtn.active = false;
        this.makeBtn.active = false;
        let num = 0;

        if (this.heroId && !!HeroUtils.getHeroInfoByHeroId(this.heroId)) {
            this.makeBtn.active = true;
            num += 1;
        }

        if ([0, 1].indexOf(this.pos) !== -1 &&
            !gdk.panel.isOpenOrOpening(PanelId.RuneStrengthenPanel) &&
            !gdk.panel.isOpenOrOpening(PanelId.LookHeroEquip)) {
            this.makeBtn.getChildByName('RedPoint').active = RedPointUtils.single_rune_strengthen(id);
        }

        if (gdk.panel.isOpenOrOpening(PanelId.SubEquipPanel2)) {
            this.replaceBtn.active = true;
            this.unloadBtn.active = true;
            this.replaceBtn.getChildByName('RedPoint').active = RedPointUtils.is_can_rune_up(ModelManager.get(HeroModel).curHeroInfo, this.pos);
            num += 1;
        }

        if (gdk.panel.isOpenOrOpening(PanelId.Bag) &&
            !gdk.panel.isOpenOrOpening(PanelId.ItemTips) &&
            !gdk.panel.isOpenOrOpening(PanelId.SelectGiftGet)) {
            this.decomposeBtn.active = true;
            this.dressBtn.active = !this.heroId;
            num += 1;
        }

        if (gdk.panel.isOpenOrOpening(PanelId.RuneSelectNew)) {
            if (this.heroId == ModelManager.get(HeroModel).curHeroInfo.heroId) {
                this.unloadBtn.active = true
            } else {
                this.unloadBtn.active = false
            }
        }
        cc.find('sub_tips/btnNode', this.node).height = num >= 1 ? 45 : 0;
        this.updateView();
    }

    onDisable() {
    }

    updateView() {
        this.slot.updateItemInfo(this.cfg.rune_id);
        this.runeName.string = this.cfg.name;
        this.clearDesc.node.active = this.isMix;
        let clearCfg: Rune_clearCfg;
        if (this.isMix) {
            clearCfg = ConfigManager.getItemByField(Rune_clearCfg, 'clear_lv', this.clearLv, { type: 1 });
            this.runeName.string += `+${this.clearLv}`;
            this.clearDesc.string = StringUtils.format(gdk.i18n.t('i18n:RUNE_TIP24'), this.clearLv, clearCfg.add);
        }
        this.lv.string = '.' + this.cfg.level + '';
        this.lv2Lab.string = `${gdk.i18n.t("i18n:RUNE_TIP5")}：L${this.cfg.level}`;
        let colorInfo = BagUtils.getColorInfo(this.cfg.color);
        this.runeName.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.runeName.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);
        let attStr = ['atk', 'hp', 'def', 'hit', 'dodge'];
        let extraPower = 0;
        attStr.forEach(str => {
            let ratio = ConfigManager.getItemByField(Global_powerCfg, 'key', str).value;
            let value = this.cfg[`hero_${str}`] + (clearCfg ? this.cfg[`hero_${str}`] * clearCfg.add / 100 : 0);
            extraPower += Math.floor(ratio * value);
        });
        this.power.string = this.cfg.power + extraPower + '';
        let str = ['baise', 'lvse', 'lanse', 'zise', 'huangse', 'hongse'];
        GlobalUtil.setSpriteIcon(this.node, this.qualityBg, `view/role/texture/bg/zb_${str[this.cfg.color]}`);
        //skillNode
        [this.skillNode, this.mixSkillNode].forEach((n, idx) => {
            if (idx == 0 || this.isMix) {
                n.active = true;
                let skillBg = cc.find('skill/skillBg', n);
                let skillIcon = cc.find('icon', skillBg);
                let skillName = cc.find('skillDesc/name', n).getComponent(cc.Label);
                let skillDesc = cc.find('skillDesc/desc', n).getComponent(cc.RichText);
                GlobalUtil.setSpriteIcon(this.node, skillBg, `common/texture/role/rune/zd_jinengkuang${this.cfg.color}`);
                GlobalUtil.setSpriteIcon(this.node, skillIcon, GlobalUtil.getSkillIcon(idx == 0 ? this.cfg.skill : this.cfg.mix_skill));
                let skillCfg = GlobalUtil.getSkillLvCfg(idx == 0 ? this.cfg.skill : this.cfg.mix_skill, idx == 0 ? this.cfg.skill_level : this.cfg.mix_skill_level);
                skillName.string = skillCfg.name;
                skillName.node.color = new cc.Color().fromHEX(BagUtils.getColorInfo(this.cfg.color).color);
                skillDesc.string = skillCfg.des;
            }
            else {
                n.active = false;
            }
        });

        this.desc.string = this.cfg.note;
        if (!this.cfg.note || this.cfg.note.length == 0) {
            this.desc.node.active = false
        }
        else {
            this.desc.node.active = true;
        }
        //attrNode
        let infos = [this.cfg.hero_atk, this.cfg.hero_hp, this.cfg.hero_def, this.cfg.hero_hit, this.cfg.hero_dodge];
        this.attrNode.children.forEach((node, idx) => {
            let info = infos[idx];
            if (!info) {
                node.active = false;
            }
            else {
                node.active = true;
                let curLab = node.getChildByName('old').getComponent(cc.Label);
                let addLab = node.getChildByName('add').getComponent(cc.Label);
                // let lowCfg = ConfigManager.getItemByField(RuneCfg, 'type', this.cfg.type, { level: 1 });
                // let lowInfos = [lowCfg.hero_atk, lowCfg.hero_hp, lowCfg.hero_def, lowCfg.hero_hit, lowCfg.hero_dodge];
                // curLab.string = (lowInfos[idx] || 0) + '';
                curLab.string = info + '';
                // if (this.cfg.level == 1) {
                //     addLab.node.active = false;
                // }
                if (!this.clearLv) {
                    addLab.node.active = false;
                }
                else {
                    clearCfg = ConfigManager.getItemByField(Rune_clearCfg, 'clear_lv', this.clearLv, { type: 1 });
                    addLab.node.active = true;
                    addLab.string = `+${Math.floor(info * (clearCfg.add / 100))}`;
                    // if (lowCfg.level == this.cfg.level) {
                    //     addLab.node.active = false;
                    // }
                    // else {
                    //     let old = lowInfos[idx] || 0;
                    //     addLab.string = `+${info - old}`;
                    //     addLab.node.active = true;
                    // }
                }
            }
        });
    }

    /**强化 */
    // onStrengthenBtnClick() {
    //     if (!JumpUtils.ifSysOpen(2855, true)) return;
    //     let id = this.cfg.rune_id;
    //     this.close();
    //     let origNode = gdk.gui.getCurrentView();
    //     // let roleNode = gdk.panel.get(PanelId.RoleView2);
    //     JumpUtils.openPanel({
    //         panelId: PanelId.EquipView2,
    //         panelArgs: { args: 2 },
    //         callback: (node: cc.Node) => {
    //             let ctrl = node.getComponent(EquipViewCtrl2);
    //             ctrl._onPanelShow = (node: cc.Node) => {
    //                 if (!node) return;
    //                 let runeMergeCtrl = node.getComponent(RuneStrengthenPanelCtrl);
    //                 let runeInfo = new icmsg.RuneInfo();
    //                 runeInfo.id = id;
    //                 runeInfo.heroId = this.heroId;
    //                 runeMergeCtrl.selectById(runeInfo);
    //                 ctrl._onPanelShow = null;
    //             };
    //         },
    //         currId: origNode ? origNode : null
    //     })
    // }

    /**穿戴 */
    onDressBtnClick() {
        this.close();
        // if (gdk.panel.isOpenOrOpening(PanelId.Reward)) {
        //     gdk.panel.hide(PanelId.Reward);
        // }
        // if (gdk.panel.isOpenOrOpening(PanelId.HeroResetCheck)) {
        //     gdk.panel.hide(PanelId.HeroResetCheck);
        // }
        gdk.panel.open(PanelId.Role2);
    }

    onSkillPreviewBtnClick() {
        gdk.panel.setArgs(PanelId.RuneSkillBookView, this.cfg.color - 1);
        gdk.panel.open(PanelId.RuneSkillBookView);
    }

    onMakeBtnClick() {
        if (!JumpUtils.ifSysOpen(2879, true)) return;
        gdk.gui.removeAllPopup();
        if (gdk.panel.isOpenOrOpening(PanelId.Reward)) {
            gdk.panel.hide(PanelId.Reward);
        }
        if (gdk.panel.isOpenOrOpening(PanelId.RuneSelectNew)) {
            gdk.panel.hide(PanelId.RuneSelectNew);
        }
        gdk.panel.setArgs(PanelId.EquipView2, 1);
        gdk.panel.open(PanelId.EquipView2);
    }

    // onComposeBtnClick() {
    //     if (!JumpUtils.ifSysOpen(2855, true)) return;
    //     this.close();
    //     if (gdk.panel.isOpenOrOpening(PanelId.EquipView2)) {
    //         return;
    //     }
    //     if (gdk.panel.isOpenOrOpening(PanelId.Reward)) {
    //         gdk.panel.hide(PanelId.Reward);
    //     }
    //     if (gdk.panel.isOpenOrOpening(PanelId.HeroResetCheck)) {
    //         gdk.panel.hide(PanelId.HeroResetCheck);
    //     }
    //     let cfgs = ConfigManager.getItems(RuneCfg, (cfg: RuneCfg) => {
    //         if (cfg.color == this.cfg.color + 1 && cfg.type == this.cfg.type) {
    //             return true;
    //         }
    //     });
    //     let id = cfgs[0] ? cfgs[0].rune_id : this.cfg.rune_id;

    //     let origNode = gdk.gui.getCurrentView();
    //     // let roleNode = gdk.panel.get(PanelId.RoleView2);
    //     JumpUtils.openPanel({
    //         panelId: PanelId.EquipView2,
    //         panelArgs: { args: 1 },
    //         callback: (node: cc.Node) => {
    //             let ctrl = node.getComponent(EquipViewCtrl2);
    //             ctrl._onPanelShow = (node: cc.Node) => {
    //                 if (!node) return;
    //                 let runeMergeCtrl = node.getComponent(RuneMergePanelCtrl);
    //                 runeMergeCtrl.selectById(id);
    //                 ctrl._onPanelShow = null;
    //             };
    //         },
    //         currId: origNode ? origNode : null
    //     })
    // }

    onReplaceBtnClick() {
        this.close();
        if (gdk.panel.isOpenOrOpening(PanelId.RuneSelectNew)) {
            //直接替换
            let cb = () => {
                let req = new icmsg.RuneOnReq();
                req.heroId = curHeroInfo.heroId;
                req.index = this.pos;
                req.runeId = this.runeId;
                NetManager.send(req, (resp: icmsg.RuneOnRsp) => {
                    HeroUtils.getHeroInfoByHeroId(curHeroInfo.heroId).runes = resp.runes;
                    gdk.e.emit(RoleEventId.RUNE_ON, curHeroInfo.heroId);
                });
            }

            let curHeroInfo = ModelManager.get(HeroModel).curHeroInfo;
            if (this.heroId) {
                let oldHeroInfo = HeroUtils.getHeroInfoByHeroId(this.heroId);
                let p = oldHeroInfo.runes.indexOf(this.runeId);
                let req = new icmsg.RuneOnReq();
                req.heroId = this.heroId;
                req.index = p;
                req.runeId = 0;
                NetManager.send(req, (resp: icmsg.RuneOnRsp) => {
                    oldHeroInfo.runes = resp.runes;
                    gdk.e.emit(RoleEventId.RUNE_OFF, oldHeroInfo.heroId);
                    cb();
                });
            }
            else {
                cb();
            }

        } else {
            gdk.panel.setArgs(PanelId.RuneSelectNew, this.pos);
            gdk.panel.open(PanelId.RuneSelectNew);
        }
        // gdk.panel.setArgs(PanelId.RuneSelect, [this.cfg, this.pos]);
        // gdk.panel.open(PanelId.RuneSelect);
    }

    onUnloadBtnClick() {
        let heroInfo = ModelManager.get(HeroModel).curHeroInfo;
        let req = new icmsg.RuneOnReq();
        req.heroId = heroInfo.heroId;
        req.index = this.pos;
        req.runeId = 0;
        NetManager.send(req, (resp: icmsg.RuneOnRsp) => {
            this.close();
            heroInfo.runes = resp.runes;
            gdk.e.emit(RoleEventId.RUNE_OFF, heroInfo.heroId);
        });
    }

    onDecomposetBtnClick() {
        // if (gdk.panel.isOpenOrOpening(PanelId.Reward)) {
        //     gdk.panel.hide(PanelId.Reward);
        // }
        // if (gdk.panel.isOpenOrOpening(PanelId.HeroResetCheck)) {
        //     gdk.panel.hide(PanelId.HeroResetCheck);
        // }
        let rewardStr: string = '';
        this.cfg.disint_item.forEach(item => {
            let cfg = BagUtils.getConfigById(item[0]);
            let str = gdk.i18n.t('i18n:ACT_EGG_TIP5');
            rewardStr += `${item[1]}${str}${cfg.name}、`;
        });
        rewardStr = rewardStr.slice(0, rewardStr.length - 1);

        let num = BagUtils.getItemNumById(this.cfg.rune_id);
        if (num > 1) {
            this.close();
            gdk.panel.setArgs(PanelId.RuneBagDecompose, [this.cfg.rune_id, num, this.heroId]);
            gdk.panel.open(PanelId.RuneBagDecompose);
        }
        else {
            let runeInfo = new icmsg.RuneInfo();
            runeInfo.id = parseInt(`${this.cfg.rune_id}${this.isMix ? (this.clearLv >= 10 ? this.clearLv : `0${this.clearLv}`) : ''}`);
            runeInfo.num = 1;
            GlobalUtil.openAskPanel({
                descText: StringUtils.format(gdk.i18n.t("i18n:RUNE_TIP6"), rewardStr),
                sureCb: () => {
                    let req = new icmsg.RuneDisintReq()
                    // req.runes = [this.cfg.id];
                    req.heroId = this.heroId ? this.heroId : 0;
                    req.runes = [runeInfo];
                    NetManager.send(req, (resp: icmsg.RuneDisintRsp) => {
                        if (cc.isValid(this.node)) {
                            this.close();
                        }
                        GlobalUtil.openRewadrView(resp.goodsList);
                    });
                }
            })
        }
    }
}
