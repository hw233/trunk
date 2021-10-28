import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import ResonatingModel from '../../../../resonating/model/ResonatingModel';
import StarUpdateMaterialsItemCtrl from './StarUpdateMaterialsItemCtrl';
import StoreModel from '../../../../store/model/StoreModel';
import StringUtils from '../../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import {
    Global_powerCfg,
    GlobalCfg,
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg,
    SkillCfg
    } from '../../../../../a/config';
import { StarUpEventId } from '../../../enum/StarUpEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-24 20:50:32 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/star/StarUpdateViewCtrl")
export default class StarUpdateViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    targetHeroName: cc.Label = null;

    @property(cc.Label)
    targetHeroStar: cc.Label = null;
    @property(cc.Label)
    targetMaxHeroStar: cc.Label = null;
    @property(cc.Node)
    targetMaxHeroStarNode: cc.Node = null;

    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null;

    @property(cc.Node)
    talentNode: cc.Node = null;

    @property(cc.Node)
    oldAttrs: cc.Node = null;

    @property(cc.Node)
    newAttrs: cc.Node = null;

    @property(cc.Button)
    starUpBtn: cc.Button = null;

    @property([cc.Node])
    materialsItmes: cc.Node[] = [];

    @property([cc.Node])
    extraMaterItems: cc.Node[] = [];

    heroInfo: icmsg.HeroInfo;
    heroCfg: HeroCfg;
    onEnable() {
        this.heroInfo = ModelManager.get(HeroModel).curHeroInfo;
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        this.targetHeroName.string = this.heroCfg.name;
        this.targetHeroName.node.color = BagUtils.getColor(this.heroInfo.color);
        this.targetHeroName.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(this.heroInfo.color);

        if (this.heroInfo.star >= 12) {
            this.targetHeroStar.node.active = false;
            this.targetMaxHeroStarNode.active = true;
            this.targetMaxHeroStar.string = (this.heroInfo.star - 11) + ''
        } else {
            this.targetHeroStar.node.active = true;
            this.targetMaxHeroStarNode.active = false;
            if (this.heroInfo.star > 5) {
                this.targetHeroStar.string = '2'.repeat(this.heroInfo.star - 5);
            }
            else {
                this.targetHeroStar.string = '1'.repeat(this.heroInfo.star);
            }
        }

        let url = StringUtils.format("spine/hero/{0}/0.5/{0}", HeroUtils.getHeroSkin(this.heroInfo.typeId, this.heroInfo.star));
        GlobalUtil.setSpineData(this.node, this.heroSpine, url, true, "stand", true, false); //spine
        // this.heroSpine.paused = true;
        //天赋
        let skillCfgs = ConfigManager.getItemsByField(SkillCfg, 'skill_id', this.heroCfg.gift_tower_id);
        skillCfgs.sort((a, b) => { return a.level - b.level; });
        let starCfg = ConfigManager.getItemById(Hero_starCfg, this.heroInfo.star);
        let starGrow = this.heroCfg.group[0] == 6 ? starCfg.add_grow_mystery : starCfg.add_grow;
        let giftLv = this.heroCfg.group[0] == 6 ? 1 : starCfg.gift_lv;
        let skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", this.heroCfg.gift_tower_id, { level: giftLv })
        if (!skillCfg) {
            skillCfg = skillCfgs[skillCfgs.length - 1];
        }
        let nextStarCfg = ConfigManager.getItemById(Hero_starCfg, this.heroInfo.star + 1);
        let nextGrow = this.heroCfg.group[0] == 6 ? nextStarCfg.add_grow_mystery : nextStarCfg.add_grow;
        let nextGiftLv = this.heroCfg.group[0] == 6 ? 1 : nextStarCfg.gift_lv;
        let nextSkillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", this.heroCfg.gift_tower_id, { level: nextGiftLv }) || skillCfg;

        GlobalUtil.setSpriteIcon(this.node, this.talentNode.getChildByName('icon'), GlobalUtil.getSkillIcon(this.heroCfg.gift_tower_id));
        this.talentNode.getChildByName('lv').getComponent(cc.Label).string = 'Lv' + (skillCfg.level - skillCfgs[0].level + 1);
        let arrow = this.talentNode.getChildByName('upArrow');
        if (nextSkillCfg.level > skillCfg.level) {
            arrow.active = true;
        }
        else {
            arrow.active = false;
        }
        //attr
        let careerCfg = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
            if (cfg.career_id == this.heroInfo.careerId && cfg.career_lv == this.heroInfo.careerLv) return true;
        });
        let attrNames = ['atk_w', 'hp_w', 'def_w'];
        let growStrs = ['grow_atk', 'grow_hp', 'grow_def'];
        //let changes = [];
        let oldAttr = []
        let newAttr = []
        for (let i = 0; i < 3; i++) {
            let oldValue = this.heroCfg[attrNames[i]] * starCfg.add + careerCfg[growStrs[i]] * starGrow * (this.heroInfo.level - 1) + careerCfg[attrNames[i]] * starGrow;
            let nextValue = this.heroCfg[attrNames[i]] * nextStarCfg.add + careerCfg[growStrs[i]] * nextGrow * (this.heroInfo.level - 1) + careerCfg[attrNames[i]] * nextGrow;
            this.oldAttrs.getChildByName(attrNames[i]).getComponent(cc.Label).string = Math.floor(oldValue) + '';
            this.newAttrs.getChildByName(attrNames[i]).getComponent(cc.Label).string = Math.floor(nextValue) + '';
            oldAttr.push(Math.floor(oldValue))
            newAttr.push(Math.floor(nextValue))
            //changes.push(Math.floor(nextValue) - Math.floor(oldValue));
        }

        let temAttrs = ['hit_w', 'dodge_w']
        let temGrows = ['grow_hit', 'grow_dodge']
        for (let i = 0; i < 2; i++) {
            let oldValue = this.heroCfg[temAttrs[i]] * starCfg.add + careerCfg[temGrows[i]] * starGrow * (this.heroInfo.level - 1) + careerCfg[temAttrs[i]] * starGrow;
            let nextValue = this.heroCfg[temAttrs[i]] * nextStarCfg.add + careerCfg[temGrows[i]] * nextGrow * (this.heroInfo.level - 1) + careerCfg[temAttrs[i]] * nextGrow;
            oldAttr.push(Math.floor(oldValue))
            newAttr.push(Math.floor(nextValue))
        }
        //power
        let atkRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'atk').value;
        let defRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'def').value;
        let hpRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'hp').value;
        let hitRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'hit').value;
        let dodgeRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'dodge').value;
        //let changePower = changes[0] * atkRatio + changes[1] * hpRatio + changes[2] * defRatio;
        let oldPower = oldAttr[0] * atkRatio + oldAttr[1] * hpRatio + oldAttr[2] * defRatio + oldAttr[3] * hitRatio + oldAttr[4] * dodgeRatio;
        let newPower = newAttr[0] * atkRatio + newAttr[1] * hpRatio + newAttr[2] * defRatio + newAttr[3] * hitRatio + newAttr[4] * dodgeRatio;
        this.oldAttrs.getChildByName('power').getComponent(cc.Label).string = Math.floor(oldPower) + ''//this.heroInfo.power + '';
        this.newAttrs.getChildByName('power').getComponent(cc.Label).string = Math.floor(newPower) + ''//this.heroInfo.power + Math.floor(changePower) + '';
        //star
        let oldStar = this.heroInfo.star > 5 ? '1'.repeat(this.heroInfo.star - 5) : '0'.repeat(this.heroInfo.star);
        let newStar = this.heroInfo.star + 1 > 5 ? '1'.repeat(this.heroInfo.star + 1 - 5) : '0'.repeat(this.heroInfo.star + 1);
        let oldStarLb = this.oldAttrs.getChildByName('star').getComponent(cc.Label)
        let newStarLb = this.newAttrs.getChildByName('star').getComponent(cc.Label)
        let oldMaxStarNode = this.oldAttrs.getChildByName('maxstar')
        let oldMaxStarLb = cc.find('maxstar/maxStarLb', this.oldAttrs).getComponent(cc.Label);
        let newMaxStarNode = this.newAttrs.getChildByName('maxstar')
        let newMaxStarLb = cc.find('maxstar/maxStarLb', this.newAttrs).getComponent(cc.Label);
        if (this.heroInfo.star >= 12) {
            oldMaxStarNode.active = true;
            oldStarLb.node.active = false;
            oldMaxStarLb.string = this.heroInfo.star - 11 + ''
        } else {
            oldMaxStarNode.active = false;
            oldStarLb.node.active = true;
            oldStarLb.string = oldStar;
        }
        if (this.heroInfo.star + 1 >= 12) {
            newMaxStarNode.active = true;
            newStarLb.node.active = false;
            newMaxStarLb.string = (this.heroInfo.star + 1) - 11 + ''
        } else {
            newMaxStarNode.active = false;
            newStarLb.node.active = true;
            newStarLb.string = newStar;
        }

        //lv
        this.oldAttrs.getChildByName('lv').getComponent(cc.Label).string = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
            if (cfg.career_id == this.heroInfo.careerId && cfg.career_lv == starCfg.career_lv) return true;
        }).hero_lv + '';
        this.newAttrs.getChildByName('lv').getComponent(cc.Label).string = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
            if (cfg.career_id == this.heroInfo.careerId && cfg.career_lv == nextStarCfg.career_lv) return true;
        }).hero_lv + '';

        let selectMap = {};
        selectMap[-1] = [this.heroInfo.heroId];
        gdk.e.emit(StarUpEventId.STAR_UPDATE_MATERIALS_HERO_SELECT, [selectMap]);
        this.materialsItmes.forEach((item, idx) => {
            let info: number[] = starCfg[`cost_${idx + 1}`];
            if (info && info.length == 3) {
                item.active = true;
                let ctrl = item.getComponent(StarUpdateMaterialsItemCtrl);
                ctrl.updateView({
                    targetHeroId: this.heroInfo.heroId,
                    materials: {
                        type: info[0], //0-任意 1-同id 2-同阵营
                        star: info[1],
                        num: info[2]
                    },
                    idx: idx // 材料idx
                })
            }
            else {
                item.active = false;
            }
        });

        //extra materialsitems
        let cost = starCfg.cost_4;
        this.extraMaterItems.forEach((n, idx) => {
            let info = cost[idx];
            n.active = !!info;
            if (n.active) {
                let ctrl = n.getComponent(UiSlotItem);
                ctrl.updateItemInfo(info[0]);
                ctrl.itemInfo = {
                    series: null,
                    itemId: info[0],
                    itemNum: info[1],
                    type: BagUtils.getItemTypeById(info[0]),
                    extInfo: null
                };
                let num = cc.find('barBg/numLab', n).getComponent(cc.Label);
                let has = BagUtils.getItemNumById(info[0]);
                num.string = `${GlobalUtil.numberToStr(has, true)}/${GlobalUtil.numberToStr(info[1], true)}`;
                num.node.color = cc.color().fromHEX(has >= info[1] ? '#FFFFFF' : '#FF0000');
                cc.find('lab', n).getComponent(cc.Label).string = BagUtils.getConfigById(info[0]).name;
            }
        });
    }

    onDisable() {
    }

    onStarUpBtnClick() {
        let items = this.materialsItmes;
        let heroList: any = {};
        for (let i = 0; i < items.length; i++) {
            if (items[i].active) {
                let ctrl = items[i].getComponent(StarUpdateMaterialsItemCtrl);
                if (!ctrl.checkConditions()) {
                    GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP41"))
                    return;
                }
                else {
                    heroList[i + 1] = [];
                    ctrl.selectHeroList.forEach(id => {
                        if (id.toString().length > 6) {
                            heroList[i + 1].push(-parseInt(id.toString().slice(0, 6))); //替代材料 ,后端要求传入负值 -id
                        }
                        else {
                            heroList[i + 1].push(id);
                        }
                    });
                }
            }
        }
        let starCfg = ConfigManager.getItemById(Hero_starCfg, this.heroInfo.star);
        if (starCfg.cost_4) {
            for (let i = 0; i < starCfg.cost_4.length; i++) {
                if (BagUtils.getItemNumById(starCfg.cost_4[i][0]) < starCfg.cost_4[i][1]) {
                    gdk.gui.showMessage(`${BagUtils.getConfigById(starCfg.cost_4[i][0]).name}不足`);
                    return;
                }
            }
        }


        if (HeroUtils.upStarLimit(this.heroInfo.star + 1)) {
            return;
        }

        let req = new icmsg.HeroStarupReq();
        req.heroId = this.heroInfo.heroId;
        req.materials1 = heroList[1] || [];
        req.materials2 = heroList[2] || [];
        req.materials3 = heroList[3] || [];
        NetManager.send(req, (resp: icmsg.HeroStarupRsp) => {
            ModelManager.get(HeroModel).curHeroInfo.star = resp.heroStar;
            gdk.panel.open(PanelId.StarUpdateSuccess2);

            let limit_heroid = ConfigManager.getItemById(GlobalCfg, "limit_heroid").value[0]
            let limit_star = ConfigManager.getItemById(GlobalCfg, "limit_star").value[0]
            if (limit_heroid == this.heroInfo.typeId && resp.heroStar == limit_star) {
                gdk.e.on("popup#StarUpdateSuccess2#close", this._hideStarUpdateSuccess2, this);
            }

            if (resp.recoups.length >= 1) {
                GlobalUtil.openRewadrView(resp.recoups);
            }
            let resonatingModel = ModelManager.get(ResonatingModel)
            let temState = resonatingModel.getHeroInUpList(this.heroInfo.heroId)
            if (temState) {
                let msg2 = new icmsg.HeroSoldierInfoReq()
                msg2.heroId = this.heroInfo.heroId
                msg2.soldierId = this.heroInfo.soldierId
                NetManager.send(msg2)
            }
            // this.close();
            gdk.panel.hide(PanelId.StarUpdateView)
        });
    }


    _hideStarUpdateSuccess2() {
        let msg = new icmsg.StorePushListReq()
        NetManager.send(msg, (data: icmsg.StorePushListRsp) => {
            ModelManager.get(StoreModel).starGiftDatas = data.list
            gdk.panel.open(PanelId.MainLineGiftView)
        })
        gdk.e.off("popup#StarUpdateSuccess2#close", this._hideStarUpdateSuccess2, this);

    }
}
