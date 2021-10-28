import AdventureHeroDetailSkill2Ctrl from './AdventureHeroDetailSkill2Ctrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GroupItemCtrl from '../../role/ctrl2/main/camp/GroupItemCtrl';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils, { StageKeys } from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import { HBItemType } from '../../lottery/ctrl/HBViewCtrl';
import { Hero_careerCfg, Hero_starCfg, HeroCfg } from '../../../a/config';


/**
 * @Description: 查看图鉴英雄信息
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-22 11:33:06
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdventureHeroDetailView2Ctrl")
export default class AdventureHeroDetailView2Ctrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    heroNameLab: cc.Label = null;

    @property(cc.Label)
    starLabel: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    labsNode: cc.Node = null;

    @property(cc.Sprite)
    solIcon: cc.Sprite = null;

    @property(cc.Label)
    fightLab: cc.Label = null;

    @property(cc.Node)
    groupLayout: cc.Node = null // 存放阵营图标的

    @property(cc.Prefab)
    groupItem: cc.Prefab = null;

    @property(cc.Node)
    panelParent: cc.Node = null;

    @property({ type: cc.String })
    _panelNames: string[] = [];

    @property({ type: gdk.PanelId, tooltip: "子界面，如果没可选值，请先配置gdk.PanelId" })
    get panels() {
        let ret = [];
        for (let i = 0; i < this._panelNames.length; i++) {
            ret[i] = gdk.PanelId[this._panelNames[i]] || 0;
        }
        return ret;
    }
    set panels(value) {
        this._panelNames = [];
        for (let i = 0; i < value.length; i++) {
            this._panelNames[i] = gdk.PanelId[value[i]];
        }
    }

    panelIndex: number = -1;    // 当前打开的界面索引
    get model() { return ModelManager.get(HeroModel); }
    get adModel() { return ModelManager.get(NewAdventureModel); }
    //get peakModel() { return ModelManager.get(PeakModel); }
    bgPath = ["yx_bg04", "yx_bg04", "yx_bg05", "yx_bg"]
    _heroCfg: HeroCfg
    attLabs: Array<cc.Label> = [];      // 白字属性lab数组
    //extLabs: Array<cc.Label> = [];      // 绿字属性lab数组
    stageLabs: Array<cc.Sprite> = [];    // 评级lab数组
    hbInfo: HBItemType;

    curType: number = 1;//1自己英雄详情 2其他人英雄详情 3转换池英雄详情
    careerType: number = 1;
    series: number;
    onEnable() {

        let args = gdk.panel.getArgs(PanelId.AdvHeroDetailView2)
        if (args) {
            this.curType = args[0];
        }
        // 属性文本
        let labsNode = this.labsNode;
        for (let index = 0; index < 6; index++) {
            let stageLab = labsNode.getChildByName(`stageLab${index + 1}`);
            let attLab = labsNode.getChildByName(`attLab${index + 1}`);
            this.stageLabs[index] = stageLab.getComponent(cc.Sprite);
            this.attLabs[index] = attLab.getComponent(cc.Label);
        }
        gdk.e.on(ActivityEventId.ACTIVITY_PEAK_CHANGE_CAREER_UPDATE, this._refreshHeroCareer, this)
    }

    onDestroy() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this)
    }

    checkArgs() {
        // 打开新的子界面
        let panelId = gdk.PanelId.getValue(this._panelNames[0]);
        if (panelId) {
            gdk.panel.open(
                panelId,
                (node: cc.Node) => {
                    if (panelId.__id__ == PanelId.AdvHeroDetailSkill2.__id__) {
                        let ctrl = node.getComponent(AdventureHeroDetailSkill2Ctrl)
                        ctrl.updateView(this.series, this._heroCfg, this.curType, this.hbInfo)
                    }
                },
                this,
                {
                    parent: this.panelParent
                },
            );
        }
    }

    initHeroInfo(series: number, heroId: number, starNum: number, careerType: number, careerId?: number) {
        this.careerType = careerType
        this.series = series
        this._heroCfg = ConfigManager.getItemById(HeroCfg, heroId);
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'hero_id', heroId, { 'career_type': careerType })
        if (careerId) {
            careerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'hero_id', heroId, { 'career_id': careerId })
        }
        let info: HBItemType = {
            cfg: this._heroCfg,
            geted: false,
            careerLineIdx: careerCfg.line
        }

        this.hbInfo = info
        // if (info) {
        //     this.hbInfo = info;
        // }
        this.checkArgs()
        this._updateUpInfo(starNum)
        // let realCareerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_pre", cfg.career_id)
        //let careerIds = ModelManager.get(HeroModel).careerInfos[this._heroCfg.id];
        this._updateAttr(careerId)//(info ? careerIds[info.careerLineIdx] : careerIds[0])
        this._updateGroupInfo()
    }

    _refreshHeroCareer() {
        //initHeroInfo
        //刷新数据;
        this.adModel.normal_giveHeros.forEach(data => {
            if (data.heroId == this.series) {
                this._updateAttr(data.careerId)
                // data.careerId = rsp.careerId;
                // let temCfg = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', rsp.careerId)
                // data.soldierId = temCfg.career_type * 100 + 1
            }
        })
    }

    _updateUpInfo(star: number) {
        this.heroNameLab.string = this._heroCfg.name;
        let color = ConfigManager.getItemById(Hero_starCfg, star).color;
        this.heroNameLab.node.color = cc.color(GlobalUtil.getHeroNameColor(color))
        let laboutline = this.heroNameLab.getComponent(cc.LabelOutline)
        laboutline.color = cc.color(GlobalUtil.getHeroNameColor(color, true))
        HeroUtils.setSpineData(this.node, this.spine, this._heroCfg.skin, true, false);

        let bgPath = ["yx_bg04", "yx_bg05", "yx_bg"]
        let idx = 0;
        if (this._heroCfg.star_min >= 5) idx = 2;
        else if (this._heroCfg.star_min > 3) idx = 1;
        else idx = 0;
        GlobalUtil.setSpriteIcon(this.node, this.bg, `view/role/texture/bg/${bgPath[idx]}`)
        this._updateStar(star);
    }

    /**更新星星 */
    _updateStar(star: number) {
        //let starTxt = "";
        let starNum = star
        //starTxt = star > 5 ? '2'.repeat(star - 5) : '1'.repeat(star);
        //this.starLabel.string = starTxt;
        if (starNum >= 12 && this.maxStarNode) {
            this.starLabel.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (starNum - 11) + ''
        } else {
            this.starLabel.node.active = true;
            this.maxStarNode ? this.maxStarNode.active = false : 0;
            let starTxt = "";
            if (starNum > 5) {
                starTxt = '1'.repeat(starNum - 5);
            }
            else {
                starTxt = '0'.repeat(starNum);
            }
            this.starLabel.string = starTxt;
        }

    }

    //@gdk.binding("peakModel.bookSelectCareerId")
    _updateAttr(careerId) {
        let cfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, null)
        if (!cfg || !this._heroCfg) {
            return
        }
        this.careerType = cfg.career_type
        // 更新英雄属性等级
        let attIconName = ["hp", "speed", "atk", "def", "hit", "dodge"];
        for (let index = 0; index < this.stageLabs.length; index++) {
            const lab = this.stageLabs[index];
            let key = StageKeys[index];
            let val = cfg[key];
            let tInfo = HeroUtils.getGrowInfoById(key, val);
            let show = tInfo ? tInfo.show : "A";
            let name = attIconName[index];
            if (index <= 3) {
                GlobalUtil.setSpriteIcon(this.node, lab, `view/role/texture/common2/yx_${name}_${show}`);
            }
        }

        let nameArr = ["yx_chengse", "yx_chengse", "yx_lanse", "yx_lvse"]
        GlobalUtil.setSpriteIcon(this.node, this.solIcon, `common/texture/soldier/${nameArr[cfg.career_type - 1]}`);
        this._getHeroAttr(careerId)
    }

    _getHeroAttr(careerId) {

        let cfgs = ConfigManager.getItemsByField(Hero_careerCfg, 'career_id', careerId);
        cfgs.sort((a, b) => { return b.career_lv - a.career_lv; });
        let careerCfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, { career_lv: cfgs[1].career_lv })
        // let maxLv = this.peakModel.levelNum//ConfigManager.getItems(Hero_lvCfg).length
        // let attName = ["hp_w", "atk_w", "def_w", "hit_w", "dodge_w"]
        // let growName = ["grow_hp", "grow_atk", "grow_def", "grow_hit", "grow_dodge"]
        // let hbAttrBase: HBAttrBase = {
        //     hp_w: 0,
        //     atk_w: 0,
        //     def_w: 0,
        //     hit_w: 0,
        //     dodge_w: 0
        // }
        // let starCfg = ConfigManager.getItemByField(Hero_starCfg, "star", this.peakModel.starNum)

        // for (let index = 0; index < attName.length; index++) {
        //     let baseV = this._heroCfg[attName[index]]
        //     hbAttrBase[attName[index]] += baseV * starCfg.add + (maxLv - 1) * careerCfg[growName[index]] * starCfg.add_grow //升级升星属性
        //     hbAttrBase[attName[index]] += careerCfg[attName[index]]//职业最后一阶属性

        // }
        let msg = new icmsg.Adventure2HeroImageReq()
        //msg.careerType = this.careerType;
        msg.heroId = this.series;
        //msg.careerId = careerId;
        NetManager.send(msg, (rsp: icmsg.Adventure2HeroImageRsp) => {
            //刷新数据
            // 0 生命 1 攻速 2 攻击 3防御
            this.attLabs[0].string = rsp.hero.hpW + ''//`${Math.floor(hbAttrBase.hp_w)}`
            this.attLabs[1].string = `${Math.floor(careerCfg.atk_order)}`
            this.attLabs[2].string = rsp.hero.atkW + ''//`${Math.floor(hbAttrBase.atk_w)}`
            this.attLabs[3].string = rsp.hero.defW + ''//`${Math.floor(hbAttrBase.def_w)}`

            this.fightLab.string = rsp.hero.power + ''//`${GlobalUtil.getPowerValue(hbAttrBase)}`
        }, this)

    }

    /**更新阵营图标 */
    _updateGroupInfo() {
        if (this._heroCfg) {
            let hero = this._heroCfg
            if (hero.group && hero.group.length > 0) {
                this.groupLayout.removeAllChildren()
                for (let index = 0; index < hero.group.length; index++) {
                    let item = cc.instantiate(this.groupItem)
                    item.active = false
                    this.groupLayout.addChild(item)
                }
                for (let i = 0; i < hero.group.length; i++) {
                    let item = this.groupLayout.children[i]
                    item.active = true;
                    let ctrl = item.getComponent(GroupItemCtrl)
                    ctrl.setGruopDate(hero.group[i], hero.id)
                }
            }
        }
    }

    /**上一个英雄 */
    // leftFunc() {
    //     this._changHero(-1);
    // }

    // /**下一个英雄 */
    // rightFunc() {
    //     this._changHero(1);
    // }


    /**左右切换当前选择英雄 */
    // _changHero(dir: number) {
    //     if (this.curType != 1) return;

    //     let items = this.peakModel.peakStateInfo.heroes.concat();
    //     let len = items.length;
    //     if (len == 0) {
    //         return;
    //     }
    //     let heroIdx = -1;
    //     let curr = this._heroCfg
    //     curr && items.some((item, i) => {
    //         // let cfg = item.cfg
    //         // if (cfg
    //         //     && cfg.id == curr.id
    //         //     && (!this.hbInfo || (item.careerLineIdx == this.hbInfo.careerLineIdx))) {//&& item.careerLineIdx == this.hbInfo.careerLineIdx
    //         //     heroIdx = i;
    //         //     return true;
    //         // }
    //         if (item.typeId == curr.id) {
    //             heroIdx = i;
    //             return true;
    //         }
    //         return false;
    //     });
    //     let nextIdx = heroIdx + dir;
    //     if (nextIdx < 0) {
    //         nextIdx = len - 1;
    //     } else if (nextIdx >= len) {
    //         nextIdx = 0;
    //     }
    //     if (heroIdx == nextIdx) {
    //         return;
    //     }
    //     this.initHeroInfo(items[nextIdx].typeId, items[nextIdx].careerType, items[nextIdx].careerId)

    //     let panel = gdk.panel.get(PanelId.HeroDetailSkill)
    //     if (panel) {
    //         let ctrl = panel.getComponent(HeroDetailSkillCtrl)
    //         let cfg = ConfigManager.getItemById(HeroCfg, items[nextIdx].typeId)
    //         let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'hero_id', items[nextIdx].typeId, { 'career_type': items[nextIdx].careerType })
    //         let info: HBItemType = {
    //             cfg: this._heroCfg,
    //             geted: false,
    //             careerLineIdx: careerCfg.line
    //         }
    //         ctrl.updateView(cfg, info)
    //     }
    // }

    // openCommentFunc() {
    //     let cfg = ConfigManager.getItemById(HeroCfg, this._heroCfg.id)
    //     let starCfg = ConfigManager.getItemByField(Hero_starCfg, "color", cfg.defaultColor)
    //     gdk.panel.setArgs(PanelId.SubHeroCommentPanel, this._heroCfg.id, starCfg.star)
    //     gdk.panel.open(PanelId.SubHeroCommentPanel)
    // }
}

// export type HBAttrBase = {
//     hp_w: number,
//     atk_w: number,
//     def_w: number,
//     hit_w: number,
//     dodge_w: number
// }

// export type HBAttrR = {
//     ul_hp_r: number,
//     ul_atk_r: number,
//     ul_def_r: number,
//     ul_hit_r: number,
//     ul_dodge_r: number
// }
