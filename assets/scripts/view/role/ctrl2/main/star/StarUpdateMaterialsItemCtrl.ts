import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import MercenaryModel from '../../../../mercenary/model/MercenaryModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import ResonatingModel from '../../../../resonating/model/ResonatingModel';
import { Hero_careerCfg, Hero_starCfg, HeroCfg } from '../../../../../a/config';
import { StarUpEventId } from '../../../enum/StarUpEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-24 20:51:46 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;
// const selectHeroMap: { [id: number]: number[] } = {};  // (材料Idx)idx-number[]  

@ccclass
@menu("qszc/view/role2/main/star/StarUpdateMaterialsItemCtrl")
export default class StarUpdateMaterialsItemCtrl extends cc.Component {
    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.Label)
    star: cc.Label = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    qualityBg: cc.Node = null;

    @property(cc.Node)
    qualityIcon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    addBtn: cc.Node = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }

    info: StartUpMaterialType;

    onLoad() {
        gdk.e.on(StarUpEventId.STAR_UPDATE_MATERIALS_HERO_SELECT, this._onHeroSelect, this);
    }

    onEnable() {
    }

    onDisable() {
        this.clear();
        gdk.e.targetOff(this);
    }

    clear() {
        // cc.js.clear(selectHeroMap);
        this.info = null;
    }

    updateView(info: StartUpMaterialType) {
        this.info = info;
        let herInfo = HeroUtils.getHeroInfoByHeroId(this.info.targetHeroId);
        if (this.info.targetHeroId.toString().length > 6) {
            let str = this.info.targetHeroId.toString()
            let star = parseInt(str.slice(6));
            let typeId = parseInt(str.slice(0, 6));
            let cfg = ConfigManager.getItemById(HeroCfg, typeId);
            let careerLv = ConfigManager.getItemById(Hero_starCfg, star).career_lv;
            let careerCfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", cfg.career_id, { career_lv: careerLv })
            herInfo = new icmsg.HeroInfo();
            herInfo.heroId = parseInt(`${cfg.id}${star}`);
            herInfo.typeId = cfg.id;
            herInfo.careerId = cfg.career_id;
            herInfo.soldierId = cfg.soldier_id[0];
            herInfo.star = star;
            herInfo.level = careerCfg.hero_lv;
            herInfo.slots = null;
            herInfo.power = HeroUtils.getPowerByStarAndCareer(cfg.id, cfg.career_id, star);
            herInfo.careerLv = ConfigManager.getItemsByField(Hero_careerCfg, 'career_id', cfg.career_id)[0].career_lv;
            herInfo.status = null;
        }
        let cfg = ConfigManager.getItemById(HeroCfg, herInfo.typeId);
        //group
        this.groupIcon.active = this.info.materials.type !== 0;
        if (this.groupIcon.active) {
            GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${cfg.group[0]}`);
        }
        //star
        if (this.info.materials.star > 5) {
            this.star.string = '1'.repeat(this.info.materials.star - 5);
        }
        else {
            this.star.string = '0'.repeat(this.info.materials.star);
        }
        //name
        this.nameLab.string = [1, 3].indexOf(this.info.materials.type) !== -1 ? `${cfg.name}` : `${this.info.materials.star}星英雄`;
        //qualityBg
        let startCfg = ConfigManager.getItemById(Hero_starCfg, this.info.materials.star);
        GlobalUtil.setSpriteIcon(this.node, this.qualityBg, `common/texture/role/select/quality_bg_0${startCfg.color}`);
        //qualityIcon
        GlobalUtil.setSpriteIcon(this.node, this.qualityIcon, `view/role/texture/upStar/yx_suijiyingxiong0${startCfg.color}`);
        this._autoFull();
        this._updateAddState();
        this._updateRedPoint();
    }

    onClick() {
        // if (this.info.targetHeroId.toString().length > 6) {
        //     gdk.gui.showMessage('预览英雄,不可升星');
        //     return
        // }
        if (this.info.materials.type == 3) {
            let list: number[] = this.heroModel.selectHeroMap[this.info.idx] || [];
            if (list.length <= 0) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP49"));
            }
            return;
        }
        gdk.panel.setArgs(PanelId.MaterialsSelectView, [this.info, JSON.parse(JSON.stringify(this.heroModel.selectHeroMap))])
        gdk.panel.open(PanelId.MaterialsSelectView);
    }

    checkConditions() {
        let list: number[] = this.heroModel.selectHeroMap[this.info.idx] || [];
        if (list.length >= this.info.materials.num) return true;
        else return false;
    }

    get selectHeroList(): number[] {
        return [...this.heroModel.selectHeroMap[this.info.idx]] || [];
    }

    /**
     * 自动填充本体英雄
     */
    _autoFull() {
        let model = ModelManager.get(HeroModel);
        let crystalModel = ModelManager.get(ResonatingModel);
        let upList = model.curUpHeroList(0);
        let typeId;
        if (this.info.targetHeroId.toString().length > 6) {
            typeId = parseInt(this.info.targetHeroId.toString().slice(0, 6));
        }
        else {
            typeId = HeroUtils.getHeroInfoByHeroId(this.info.targetHeroId).typeId;
        }
        if (this.info.materials.type == 1 || this.info.materials.type == 3) {
            //1-材料 3-升星本体
            let others = [];
            for (let key in this.heroModel.selectHeroMap) {
                if (parseInt(key) !== this.info.idx) {
                    others = others.concat([...this.heroModel.selectHeroMap[key]]);
                }
            };
            if (this.info.materials.type == 1) {
                others = others.concat(upList); //选择材料时剔除 已上阵的英雄列表
                //雇佣兵
                let mercenaryList = []
                let mercenaryModel = ModelManager.get(MercenaryModel)
                let m_list = mercenaryModel.lentHeroList
                for (let i = 0; i < m_list.length; i++) {
                    mercenaryList.push(m_list[i].heroId)
                }
                others = others.concat(mercenaryList);
            }

            let list = HeroUtils.getHeroListByTypeId(typeId);
            list.sort((a, b) => {
                if (this.info.materials.type == 1) {
                    return a.power - b.power; //材料选择最低战力
                }
                else {
                    return b.power - a.power;  //本体选择最高战力
                }
            });
            let needNum = this.info.materials.num;
            for (let i = 0; i < list.length; i++) {
                if (list[i].star == this.info.materials.star) {
                    if (!this.heroModel.selectHeroMap[this.info.idx]) this.heroModel.selectHeroMap[this.info.idx] = [];
                    if (this.heroModel.selectHeroMap[this.info.idx].indexOf(list[i].heroId) == -1 &&
                        others.indexOf(list[i].heroId) == -1 &&
                        (this.info.materials.type !== 1 && !list[i].switchFlag && !crystalModel.getHeroInUpList(list[i].heroId)) //选择材料时,要求未锁定
                    ) {
                        this.heroModel.selectHeroMap[this.info.idx].push(list[i].heroId);
                        needNum -= 1;
                        if (needNum <= 0) {
                            gdk.e.emit(StarUpEventId.STAR_UPDATE_MATERIALS_HERO_SELECT, [JSON.parse(JSON.stringify(this.heroModel.selectHeroMap))]);
                            return;
                        }
                    }
                }
            }
            if (needNum != this.info.materials.num) {
                gdk.e.emit(StarUpEventId.STAR_UPDATE_MATERIALS_HERO_SELECT, [JSON.parse(JSON.stringify(this.heroModel.selectHeroMap))]);
            }
        }
    }

    _updateAddState() {
        if (!this.info) return;
        let typeId;
        if (this.info.targetHeroId.toString().length > 6) {
            typeId = parseInt(this.info.targetHeroId.toString().slice(0, 6));
        }
        else {
            typeId = HeroUtils.getHeroInfoByHeroId(this.info.targetHeroId).typeId;
        }
        let list: number[] = this.heroModel.selectHeroMap[this.info.idx] || [];
        if (list.length >= this.info.materials.num) {
            this.addBtn.active = false;
        }
        else {
            this.addBtn.active = true;
        }
        this.num.string = `${list.length}/${this.info.materials.num}`;
        let cfg = ConfigManager.getItemById(HeroCfg, typeId);
        if (this.info.materials.type == 1 || this.info.materials.type == 3) {
            this.icon.active = true;
            GlobalUtil.setSpriteIcon(this.node, this.icon, cfg.iconPath);
        }
        else {
            this.icon.active = false;
        }
    }

    _updateRedPoint() {
        if (!this.info) return;
        let replaceItemMaps = ModelManager.get(HeroModel).replaceItemIdMaps;
        //获取可用的替换材料id
        let getReplaceItems = (groups, star, maps = replaceItemMaps): number[] => {
            let itemIds: number[] = [];
            groups.forEach(group => {
                let ids = maps[group][star];
                if (ids && ids.length > 0) {
                    ids.forEach(id => {
                        let num = BagUtils.getItemNumById(id) || 0;
                        for (let i = 0; i < num; i++) {
                            let customId = parseInt(`${id}${i}`); // id+idx 同一道具保证id的唯一性  前6位固定为id
                            if (itemIds.indexOf(customId) == -1) {
                                itemIds.push(customId);
                            }
                        }
                    });
                }
            });
            return itemIds;
        };

        let typeId;
        if (this.info.targetHeroId.toString().length > 6) {
            typeId = parseInt(this.info.targetHeroId.toString().slice(0, 6));
        }
        else {
            typeId = HeroUtils.getHeroInfoByHeroId(this.info.targetHeroId).typeId;
        }
        let list: number[] = this.heroModel.selectHeroMap[this.info.idx] || [];
        if (list.length == this.info.materials.num) {
            this.redPoint.active = false;
        }
        else {
            let mercenaryList = []
            let mercenaryModel = ModelManager.get(MercenaryModel)
            let m_list = mercenaryModel.lentHeroList
            for (let i = 0; i < m_list.length; i++) {
                mercenaryList.push(m_list[i].heroId)
            }
            let model = ModelManager.get(HeroModel);
            let crystalModel = ModelManager.get(ResonatingModel);
            let upFightList = [...model.curUpHeroList(0), ...mercenaryList];
            let selectHeroList: number[] = [];
            let recordHeroList: number[] = [];
            for (let key in this.heroModel.selectHeroMap) {
                selectHeroList = selectHeroList.concat([...this.heroModel.selectHeroMap[key]]);
            }
            if (this.info.materials.type == 1 || this.info.materials.type == 3) {
                let list = HeroUtils.getHeroListByTypeId(typeId);
                for (let i = 0; i < list.length; i++) {
                    if (list[i].star == this.info.materials.star
                        && selectHeroList.indexOf(list[i].heroId) == -1
                        && recordHeroList.indexOf(list[i].heroId) == -1
                        && upFightList.indexOf(list[i].heroId) == -1
                        && !list[i].switchFlag
                        && !crystalModel.getHeroInUpList(list[i].heroId)
                        && (this.info.materials.type == 3 || this.info.targetHeroId !== list[i].heroId)) {
                        recordHeroList.push(list[i].heroId);
                    }
                }
                //替代材料
                // if (this.info.materials.type == 1) {
                //     let groups: number[] = [ConfigManager.getItemById(HeroCfg, typeId).group[0]];
                //     let replaceItems = getReplaceItems(groups, this.info.materials.star);
                //     replaceItems.forEach(id => {
                //         if (selectHeroList.indexOf(id) == -1 && recordHeroList.indexOf(id) == -1) {
                //             recordHeroList.push(id);
                //         }
                //     })
                // }
            }
            else if (this.info.materials.type == 2) {
                let cfg = ConfigManager.getItemById(HeroCfg, typeId);
                let list = HeroUtils.getHerosByGroup(cfg.group[0]);
                for (let i = 0; i < list.length; i++) {
                    if (list[i].star == this.info.materials.star
                        && selectHeroList.indexOf(list[i].heroId) == -1
                        && recordHeroList.indexOf(list[i].heroId) == -1
                        && upFightList.indexOf(list[i].heroId) == -1
                        && !list[i].switchFlag
                        && !crystalModel.getHeroInUpList(list[i].heroId)
                        && this.info.targetHeroId !== list[i].heroId) {
                        recordHeroList.push(list[i].heroId);
                    }
                }
                //替代材料
                let groups: number[] = [ConfigManager.getItemById(HeroCfg, typeId).group[0]];
                let replaceItems = getReplaceItems(groups, this.info.materials.star);
                replaceItems.forEach(id => {
                    if (selectHeroList.indexOf(id) == -1 && recordHeroList.indexOf(id) == -1) {
                        recordHeroList.push(id);
                    }
                })
            }
            else {
                let list = HeroUtils.getHerosByGroup(0);
                for (let i = 0; i < list.length; i++) {
                    if (list[i].star == this.info.materials.star
                        && selectHeroList.indexOf(list[i].heroId) == -1
                        && recordHeroList.indexOf(list[i].heroId) == -1
                        && upFightList.indexOf(list[i].heroId) == -1
                        && !list[i].switchFlag
                        && !crystalModel.getHeroInUpList(list[i].heroId)
                        && this.info.targetHeroId !== list[i].heroId) {
                        recordHeroList.push(list[i].heroId);
                    }
                }
                //替代材料
                let groups: number[] = [1, 2, 3, 4, 5];
                let replaceItems = getReplaceItems(groups, this.info.materials.star);
                replaceItems.forEach(id => {
                    if (selectHeroList.indexOf(id) == -1 && recordHeroList.indexOf(id) == -1) {
                        recordHeroList.push(id);
                    }
                })
            }
            if (list.length + recordHeroList.length >= this.info.materials.num) {
                this.redPoint.active = true;
                return;
            }
        }
        this.redPoint.active = false;
    }

    _onHeroSelect(e: any) {
        if (e && e.data) {
            cc.js.clear(this.heroModel.selectHeroMap);
            cc.js.mixin(this.heroModel.selectHeroMap, e.data[0]);
        }
        this._updateAddState();
        this._updateRedPoint();
    }
}

/**升星材料类型 */
export type StartUpMaterialType = {
    targetHeroId: number,
    materials: {
        type: number, //0-任意 1-同id 2-同阵营 3-本体
        star: number,
        num: number
    },
    idx: number // 材料idx
}
