import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroDetailViewCtrl from '../../../../lottery/ctrl/HeroDetailViewCtrl';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import StarUpdateMaterialsItemCtrl from './StarUpdateMaterialsItemCtrl';
import StarUpHeroSelectItemCtrl from './StarUpHeroSelectItemCtrl';
import StringUtils from '../../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../../../common/models/BagModel';
import {
    Global_powerCfg,
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg,
    SkillCfg
    } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { RoleEventId } from '../../../enum/RoleEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-26 15:26:09 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/star/HeroComposePanel")
export default class HeroComposePanel extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    targetHeroInfoNode: cc.Node = null;

    @property(cc.Label)
    targetMaxHeroStar: cc.Label = null;
    @property(cc.Node)
    targetMaxHeroStarNode: cc.Node = null;

    @property(cc.Node)
    talent: cc.Node = null;

    @property(cc.Node)
    oldAttrs: cc.Node = null;

    @property(cc.Node)
    newAttrs: cc.Node = null;

    @property(cc.Node)
    materialsNode: cc.Node = null;

    @property([cc.Node])
    extraMaterItems: cc.Node[] = [];

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    ItemPrefab: cc.Prefab = null;

    @property(cc.Button)
    careerBtns: cc.Button[] = []

    @property(cc.Button)
    groupBtns: cc.Button[] = []

    @property(cc.Node)
    contentCareer: cc.Node = null

    @property(cc.Node)
    btnUp: cc.Node = null

    list: ListView = null
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowCareer: boolean = false
    curSelectedIdx: number; //当前选择Idx
    curHeroId: number; //当前英雄id
    get model(): HeroModel { return ModelManager.get(HeroModel); }

    onLoad() {
        this.contentCareer.active = false;
        this.btnUp.active = false;
        this.targetHeroInfoNode.active = false;
        this.talent.active = false;
        this.oldAttrs.active = false;
        this.newAttrs.active = false;
        // this.careerBtns.forEach(n => n.node.active = false);
        this.materialsNode.children.forEach(n => n.active = false);
        GlobalUtil.setSpriteIcon(this.node, this.bg, null);
        GlobalUtil.setSpriteIcon(this.node, cc.find('layout/icon', this.targetHeroInfoNode), null);
        GlobalUtil.setSpineData(this.node, this.targetHeroInfoNode.getChildByName('spine').getComponent(sp.Skeleton), null);
        GlobalUtil.setSpriteIcon(this.node, this.talent.getChildByName('icon'), null);
    }

    onEnable() {
        gdk.e.on(RoleEventId.REMOVE_ONE_HERO, this._updateDataLater, this);
        gdk.e.on(RoleEventId.UPDATE_ONE_HERO, this._updateDataLater, this);
        NetManager.on(icmsg.RoleUpdateRsp.MsgType, this._updateExtraMaterItems, this);
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateExtraMaterItems, this);
        this._initListView();
        this.selectGroupFunc(null, 0);
        this.selectCareerFunc(null, 0);
        this.updateContentState();
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.e.targetOff(this);
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    showCareerContent() {
        this.isShowCareer = true
        this.updateContentState()
    }

    hideCareerContent() {
        this.isShowCareer = false
        this.updateContentState()
    }

    updateContentState() {
        if (this.isShowCareer) {
            this.contentCareer.active = true
            this.btnUp.active = false
        } else {
            this.contentCareer.active = false
            this.btnUp.active = true
        }
    }

    /**选择页签, 筛选职业*/
    selectCareerFunc(e, utype) {
        this.selectCareer = parseInt(utype)
        for (let idx = 0; idx < this.careerBtns.length; idx++) {
            const element = this.careerBtns[idx];
            element.interactable = idx != this.selectCareer
            let select = element.node.getChildByName("select")
            select.active = idx == this.selectCareer
        }
        this._updateDataLater()
    }

    /**选择页签, 筛选阵营*/
    selectGroupFunc(e, utype) {
        this.selectGroup = parseInt(utype)
        for (let idx = 0; idx < this.groupBtns.length; idx++) {
            const element = this.groupBtns[idx];
            let nodeName = element.name
            let group = parseInt(nodeName.substring('group'.length));
            element.interactable = group != this.selectGroup
            let select = element.node.getChildByName("select")
            select.active = group == this.selectGroup
        }
        this._updateDataLater()
    }

    onStarUpBtnClick() {
        let heroInfo: icmsg.HeroInfo;
        let targertHeroId: number;
        let items = this.materialsNode.children;
        let heroList: any = {};
        for (let i = 0; i < items.length; i++) {
            if (items[i].active) {
                let ctrl = items[i].getComponent(StarUpdateMaterialsItemCtrl);
                if (!ctrl.checkConditions()) {
                    gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP41"));
                    return;
                }
                else {
                    if (i == 0) {
                        targertHeroId = ctrl.selectHeroList[0];
                        heroInfo = HeroUtils.getHeroInfoByHeroId(targertHeroId);
                    }
                    else {
                        // heroList[i] = ctrl.selectHeroList;
                        heroList[i] = [];
                        ctrl.selectHeroList.forEach(id => {
                            if (id.toString().length > 6) {
                                heroList[i].push(-parseInt(id.toString().slice(0, 6))); //替代材料 ,后端要求传入负值 -id
                            }
                            else {
                                heroList[i].push(id);
                            }
                        });
                    }
                }
            }
        }

        let starCfg = ConfigManager.getItemById(Hero_starCfg, heroInfo.star);
        if (starCfg.cost_4) {
            for (let i = 0; i < starCfg.cost_4.length; i++) {
                if (BagUtils.getItemNumById(starCfg.cost_4[i][0]) < starCfg.cost_4[i][1]) {
                    gdk.gui.showMessage(`${BagUtils.getConfigById(starCfg.cost_4[i][0]).name}不足`);
                    return;
                }
            }
        }

        if (HeroUtils.upStarLimit(heroInfo.star + 1)) {
            return;
        }

        let req = new icmsg.HeroStarupReq();
        req.heroId = targertHeroId;
        req.materials1 = heroList[1] || [];
        req.materials2 = heroList[2] || [];
        req.materials3 = heroList[3] || [];
        NetManager.send(req, (resp: icmsg.HeroStarupRsp) => {
            heroInfo.star = resp.heroStar;
            gdk.panel.setArgs(PanelId.StarUpdateSuccess2, heroInfo);
            gdk.panel.open(PanelId.StarUpdateSuccess2);
            if (resp.recoups.length >= 1) {
                GlobalUtil.openRewadrView(resp.recoups);
            }
        });
    }

    showHeroTip() {
        let heroCfg = ConfigManager.getItemById(HeroCfg, this.list.datas[this.curSelectedIdx].heroInfo.typeId);
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl)
            comp.initHeroInfo(heroCfg)
        })
    }

    _updateBg() {
        let curHero = HeroUtils.getHeroInfoByHeroId(this.curHeroId);
        let star;
        if (curHero) {
            star = curHero.star + 1;
        }
        else {
            star = parseInt(this.curHeroId.toString().slice(6)) + 1;
        }
        let bgPath = ["yx_bg04", "yx_bg05", "yx_bg"]
        let idx = 0;
        if (star >= 5) idx = 2;
        else if (star > 3) idx = 1;
        else idx = 0;
        GlobalUtil.setSpriteIcon(this.node, this.bg, `view/role/texture/bg/${bgPath[idx]}`)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.ItemPrefab,
            cb_host: this,
            column: 4,
            gap_x: 40,
            gap_y: 25,
            async: true,
            resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this);
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let cache: { [type_star: string]: number[] } = {};
        let tempList: icmsg.HeroInfo[] = [];
        let fakeInfos = this._addFakeHeroList();
        tempList = tempList.concat(fakeInfos);
        tempList.sort((a, b) => {
            if (a.star == b.star) {
                let cfgA = ConfigManager.getItemById(HeroCfg, a.typeId);
                let cfgB = ConfigManager.getItemById(HeroCfg, b.typeId);
                let hasNumA: number, needNumA: number, hasNumB: number, needNumB: number;
                //A
                let pname = a.typeId + '_' + a.star;
                if (!cache[pname]) {
                    cache[pname] = HeroUtils.getProgressOfUpStar(a.typeId, a.star);
                }
                hasNumA = cache[pname][0];
                needNumA = cache[pname][1];
                //B
                pname = b.typeId + '_' + b.star;
                if (!cache[pname]) {
                    cache[pname] = HeroUtils.getProgressOfUpStar(b.typeId, b.star);
                }
                hasNumB = cache[pname][0];
                needNumB = cache[pname][1];
                if (hasNumA / needNumA == hasNumB / needNumB) {
                    if (cfgA.group[0] == cfgB.group[0]) {
                        return a.typeId - b.typeId;
                    }
                    else {
                        return cfgA.group[0] - cfgB.group[0];
                    }
                }
                else {
                    return hasNumB / needNumB - hasNumA / needNumA;
                }
            }
            else {
                return a.star - b.star;
            }
        });

        let upStarList: icmsg.HeroInfo[] = [];
        let others: icmsg.HeroInfo[] = [];

        tempList.forEach(info => {
            let hasNum: number, needNum: number;
            let pname = info.typeId + '_' + info.star;
            if (!cache[pname]) {
                cache[pname] = HeroUtils.getProgressOfUpStar(info.typeId, info.star);
            }
            hasNum = cache[pname][0];
            needNum = cache[pname][1];
            if (hasNum >= needNum) {
                upStarList.push(info);
            }
            else {
                others.push(info);
            }
        });
        let finalList = [...upStarList, ...others];

        let datas = [];
        let defaultIdx = 0;
        finalList.forEach((l, idx) => {
            let obj = {
                heroInfo: l,
                selected: this.curHeroId && this.curHeroId == l.heroId,
                pageType: 2,
                itemType: BagType.HERO,
                itemId: null
            };
            datas.push(obj);
            // if (obj.selected) {
            //     defaultIdx = idx;
            // }
        });
        this.list.clear_items();
        this.list.set_data(datas);
        gdk.Timer.callLater(this, () => {
            if (cc.isValid(this.node)) {
                this.content.height += 10;
                this.list.select_item(defaultIdx);
                this.list.scroll_to(defaultIdx);
            }
        })
    }

    _addFakeHeroList() {
        let cfgs = ConfigManager.getItems(HeroCfg, (cfg: HeroCfg) => {
            if (cfg.show == 1 && cfg.compose_show && cfg.compose_show.length >= 1) {
                if (this.selectGroup == 0 || cfg.group[0] == this.selectGroup) {
                    let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", cfg.career_id)
                    if (this.selectCareer == 0 || careerCfg.career_type == this.selectCareer) {
                        return true;
                    }
                }
            }
        });

        let infos: icmsg.HeroInfo[] = [];
        cfgs.forEach(cfg => {
            cfg.compose_show.forEach(star => {
                let temp = HeroUtils.getHeroListByTypeId(cfg.id);
                let list: icmsg.HeroInfo[] = [];
                let b = false;
                temp.forEach(info => {
                    if (info.star == star && !b) {
                        b = true;
                        infos.push(info);
                        list.push(info);
                    }
                });
                if (list.length == 0) {
                    let careerLv = ConfigManager.getItemById(Hero_starCfg, star).career_lv;
                    let careerCfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", cfg.career_id, { career_lv: careerLv })
                    let heroInfo = new icmsg.HeroInfo();
                    heroInfo.heroId = parseInt(`${cfg.id}${star}`);
                    heroInfo.typeId = cfg.id;
                    heroInfo.careerId = cfg.career_id;
                    heroInfo.soldierId = cfg.soldier_id[0];
                    heroInfo.star = star;
                    heroInfo.level = careerCfg.hero_lv;
                    heroInfo.slots = null;
                    heroInfo.power = HeroUtils.getPowerByStarAndCareer(cfg.id, cfg.career_id, star);
                    heroInfo.careerLv = ConfigManager.getItemsByField(Hero_careerCfg, 'career_id', cfg.career_id)[0].career_lv;
                    heroInfo.status = null;
                    infos.push(heroInfo);
                }
            });
        });
        return infos;
    }

    _selectItem(data: BagItem, index) {
        // let id = this.list.datas[index].heroInfo.heroId;
        if (!this.curSelectedIdx || this.curSelectedIdx !== index) {
            //TODO
            this.list['curHeroId'] = this.list.datas[index].heroInfo.heroId;
            let item = this.list.items[index].node;
            if (item) {
                let ctrl = item.getComponent(StarUpHeroSelectItemCtrl);
                ctrl.check();
                let preItem = this.list.items[this.curSelectedIdx];
                if (preItem && preItem.node) {
                    let preCtrl = preItem.node.getComponent(StarUpHeroSelectItemCtrl);
                    preCtrl.check();
                }
            }


            this.curSelectedIdx = index;
            this.curHeroId = this.list.datas[index].heroInfo.heroId;
            cc.js.clear(ModelManager.get(HeroModel).selectHeroMap);
            this._updateHeroInfo();
            this._updateBg()
        }
    }

    _updateHeroInfo() {
        let targetHeroName = cc.find('layout/targetHeroName', this.targetHeroInfoNode).getComponent(cc.Label);
        let targetHeroStar = this.targetHeroInfoNode.getChildByName('targetHeroStar').getComponent(cc.Label);
        let heroSpine = this.targetHeroInfoNode.getChildByName('spine').getComponent(sp.Skeleton);
        let group = cc.find('layout/icon', this.targetHeroInfoNode);

        let heroInfo = HeroUtils.getHeroInfoByHeroId(this.list.datas[this.curSelectedIdx].heroInfo.heroId);
        if (!heroInfo) heroInfo = this.list.datas[this.curSelectedIdx].heroInfo;
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
        targetHeroName.string = heroCfg.name;
        targetHeroName.node.color = BagUtils.getColor(heroInfo.color);
        targetHeroName.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(heroInfo.color);

        if (heroInfo.star + 1 >= 12) {
            targetHeroStar.node.active = false;
            this.targetMaxHeroStarNode.active = true;
            this.targetMaxHeroStar.string = (heroInfo.star + 1 - 11) + ''
        } else {
            targetHeroStar.node.active = true;
            this.targetMaxHeroStarNode.active = false;
            if (heroInfo.star + 1 > 5) {
                targetHeroStar.string = '2'.repeat(heroInfo.star + 1 - 5);
            }
            else {
                targetHeroStar.string = '1'.repeat(heroInfo.star + 1);
            }
        }
        //阵营
        GlobalUtil.setSpriteIcon(this.node, group, `common/texture/role/select/group_${heroCfg.group[0]}`);
        //spine
        let url = StringUtils.format("spine/hero/{0}/1/{0}", HeroUtils.getHeroSkin(heroInfo.typeId, heroInfo.star));
        GlobalUtil.setSpineData(this.node, heroSpine, url, true, "stand", true, false);
        //天赋
        let skillCfgs = ConfigManager.getItemsByField(SkillCfg, 'skill_id', heroCfg.gift_tower_id);
        skillCfgs.sort((a, b) => { return a.level - b.level; });
        let starCfg = ConfigManager.getItemById(Hero_starCfg, heroInfo.star);
        let starGrow = heroCfg.group[0] == 6 ? starCfg.add_grow_mystery : starCfg.add_grow;
        let giftLv = heroCfg.group[0] == 6 ? 1 : starCfg.gift_lv;
        let skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", heroCfg.gift_tower_id, { level: giftLv })
        if (!skillCfg) {
            skillCfg = skillCfgs[skillCfgs.length - 1];
        }
        let nextStarCfg = ConfigManager.getItemById(Hero_starCfg, heroInfo.star + 1);
        let nextGrow = heroCfg.group[0] == 6 ? nextStarCfg.add_grow_mystery : nextStarCfg.add_grow;
        let nextGiftLv = heroCfg.group[0] == 6 ? 1 : nextStarCfg.gift_lv;
        let nextSkillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", heroCfg.gift_tower_id, { level: nextGiftLv }) || skillCfg;

        GlobalUtil.setSpriteIcon(this.node, this.talent.getChildByName('icon'), GlobalUtil.getSkillIcon(heroCfg.gift_tower_id));
        this.talent.getChildByName('lv').getComponent(cc.Label).string = 'Lv' + (skillCfg.level - skillCfgs[0].level + 1);
        let arrow = this.talent.getChildByName('upArrow');
        if (nextSkillCfg.level > skillCfg.level) {
            arrow.active = true;
        }
        else {
            arrow.active = false;
        }
        //attr
        let careerCfg = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
            if (cfg.career_id == heroInfo.careerId && cfg.career_lv == heroInfo.careerLv) return true;
        });
        let attrNames = ['atk_w', 'hp_w', 'def_w'];
        let growStrs = ['grow_atk', 'grow_hp', 'grow_def'];
        let changes = [];
        for (let i = 0; i < 3; i++) {
            let oldValue = heroCfg[attrNames[i]] * starCfg.add + careerCfg[growStrs[i]] * starGrow * (heroInfo.level - 1) + careerCfg[attrNames[i]];
            let nextValue = heroCfg[attrNames[i]] * nextStarCfg.add + careerCfg[growStrs[i]] * nextGrow * (heroInfo.level - 1) + careerCfg[attrNames[i]];
            this.oldAttrs.getChildByName(attrNames[i]).getComponent(cc.Label).string = Math.floor(oldValue) + '';
            this.newAttrs.getChildByName(attrNames[i]).getComponent(cc.Label).string = Math.floor(nextValue) + '';
            changes.push(Math.floor(nextValue) - Math.floor(oldValue));
        }
        //power
        let atkRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'atk').value;
        let defRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'def').value;
        let hpRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'hp').value;
        let changePower = changes[0] * atkRatio + changes[1] * hpRatio + changes[2] * defRatio;
        this.oldAttrs.getChildByName('power').getComponent(cc.Label).string = heroInfo.power + '';
        this.newAttrs.getChildByName('power').getComponent(cc.Label).string = heroInfo.power + Math.floor(changePower) + '';
        //star
        let oldStar = heroInfo.star > 5 ? '1'.repeat(heroInfo.star - 5) : '0'.repeat(heroInfo.star);
        let newStar = heroInfo.star + 1 > 5 ? '1'.repeat(heroInfo.star + 1 - 5) : '0'.repeat(heroInfo.star + 1);
        let oldStarLb = this.oldAttrs.getChildByName('star').getComponent(cc.Label)
        let newStarLb = this.newAttrs.getChildByName('star').getComponent(cc.Label)
        let oldMaxStarNode = this.oldAttrs.getChildByName('maxstar')
        let oldMaxStarLb = cc.find('maxstar/maxStarLb', this.oldAttrs).getComponent(cc.Label);
        let newMaxStarNode = this.newAttrs.getChildByName('maxstar')
        let newMaxStarLb = cc.find('maxstar/maxStarLb', this.newAttrs).getComponent(cc.Label);
        if (heroInfo.star >= 12) {
            oldMaxStarNode.active = true;
            oldStarLb.node.active = false;
            oldMaxStarLb.string = heroInfo.star - 11 + ''
        } else {
            oldMaxStarNode.active = false;
            oldStarLb.node.active = true;
            oldStarLb.string = oldStar;
        }
        if (heroInfo.star + 1 >= 12) {
            newMaxStarNode.active = true;
            newStarLb.node.active = false;
            newMaxStarLb.string = (heroInfo.star + 1) - 11 + ''
        } else {
            newMaxStarNode.active = false;
            newStarLb.node.active = true;
            newStarLb.string = newStar;
        }



        //lv
        this.oldAttrs.getChildByName('lv').getComponent(cc.Label).string = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
            if (cfg.career_id == heroInfo.careerId && cfg.career_lv == starCfg.career_lv) return true;
        }).hero_lv + '';
        this.newAttrs.getChildByName('lv').getComponent(cc.Label).string = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
            if (cfg.career_id == heroInfo.careerId && cfg.career_lv == nextStarCfg.career_lv) return true;
        }).hero_lv + '';

        this.materialsNode.children.forEach((item, idx) => {
            // if (idx != 0) {
            let ctrl = item.getComponent(StarUpdateMaterialsItemCtrl);
            ctrl && ctrl.clear();
            // }
        })
        this.materialsNode.children.forEach((item, idx) => {
            if (idx == 0) {
                let info: number[] = [3, heroInfo.star, 1];
                let ctrl = item.getComponent(StarUpdateMaterialsItemCtrl);
                ctrl.updateView({
                    targetHeroId: heroInfo.heroId,
                    materials: {
                        type: info[0], //0-任意 1-同id 2-同阵营 3-本体
                        star: info[1],
                        num: info[2]
                    },
                    idx: -1 //材料id,主体-1
                })
                item.active = true;
            }
            else {
                //材料1-3
                let info: number[] = starCfg[`cost_${idx - 1 + 1}`];
                if (info && info.length == 3) {
                    item.active = true;
                    let ctrl = item.getComponent(StarUpdateMaterialsItemCtrl);
                    ctrl.updateView({
                        targetHeroId: heroInfo.heroId,
                        materials: {
                            type: info[0], //0-任意 1-同id 2-同阵营
                            star: info[1],
                            num: info[2]
                        },
                        idx: idx - 1 // 材料idx
                    })
                }
                else {
                    item.active = false;
                }
            }
        });

        this.targetHeroInfoNode.active = true;
        this.talent.active = true;
        this.oldAttrs.active = true;
        this.newAttrs.active = true;

        //extra materials
        this._updateExtraMaterItems();
    }

    _updateExtraMaterItems() {
        //extra materials
        let heroInfo = HeroUtils.getHeroInfoByHeroId(this.curHeroId);
        if (!heroInfo) {
            this.extraMaterItems.forEach(n => { n.active = false; });
            return;
        }
        let starCfg = ConfigManager.getItemById(Hero_starCfg, heroInfo.star);
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
}

