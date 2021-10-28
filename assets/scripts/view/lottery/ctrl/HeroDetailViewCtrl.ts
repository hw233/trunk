import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GroupItemCtrl from '../../role/ctrl2/main/camp/GroupItemCtrl';
import HeroDetailSkillCtrl from './HeroDetailSkillCtrl';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils, { StageKeys } from '../../../common/utils/HeroUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { HBItemType } from './HBViewCtrl';
import {
    Hero_careerCfg,
    Hero_lvCfg,
    Hero_starCfg,
    HeroCfg,
    UniqueCfg
    } from '../../../a/config';

/**
 * @Description: 查看图鉴英雄信息
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-17 11:12:03
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroDetailViewCtrl")
export default class HeroDetailViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(sp.Skeleton)
    mysticBgSpine: sp.Skeleton = null;

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
    geneConnectNode: cc.Node = null;

    @property(cc.Node)
    awakeSwitchBtn: cc.Node = null;

    @property(cc.Node)
    panelParent: cc.Node = null;

    @property(cc.Node)
    uniqueEquipBtn: cc.Node = null;

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
    bgPath = ["yx_bg04", "yx_bg04", "yx_bg05", "yx_bg"]
    _heroCfg: HeroCfg
    attLabs: Array<cc.Label> = [];      // 白字属性lab数组
    //extLabs: Array<cc.Label> = [];      // 绿字属性lab数组
    stageLabs: Array<cc.Sprite> = [];    // 评级lab数组
    hbInfo: HBItemType;
    mysticState: number = 0; //神秘者 0-normal 1-满领悟状态
    mysticLinkId: number = 0; //神秘者 链接英雄id
    _awakePreview: boolean = false; //觉醒预览
    onEnable() {

        // 属性文本
        let labsNode = this.labsNode;
        for (let index = 0; index < 6; index++) {
            let stageLab = labsNode.getChildByName(`stageLab${index + 1}`);
            let attLab = labsNode.getChildByName(`attLab${index + 1}`);
            this.stageLabs[index] = stageLab.getComponent(cc.Sprite);
            this.attLabs[index] = attLab.getComponent(cc.Label);
        }

    }

    onDestroy() {
        gdk.e.targetOff(this)
    }

    checkArgs() {
        // 打开新的子界面
        let panelId = gdk.PanelId.getValue(this._panelNames[0]);
        if (panelId) {
            gdk.panel.open(
                panelId,
                (node: cc.Node) => {
                    if (panelId.__id__ == PanelId.HeroDetailSkill.__id__) {
                        let ctrl = node.getComponent(HeroDetailSkillCtrl)
                        ctrl._awakePreview = this._awakePreview;
                        ctrl.mysticState = this.mysticState;
                        ctrl.mysticLinkId = this.mysticLinkId;
                        ctrl.updateView(this._heroCfg, this.hbInfo)
                    }
                },
                this,
                {
                    parent: this.panelParent
                },
            );
        }
    }

    initHeroInfo(cfg: HeroCfg, info?: HBItemType) {
        this._heroCfg = cfg
        if (info) {
            this.hbInfo = info;
        }
        if (this._heroCfg.group[0] !== 6) {
            this.mysticState = 0;
            this.mysticLinkId = 0;
        }
        this.checkArgs()
        this._updateUpInfo()
        // let realCareerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_pre", cfg.career_id)
        let careerIds = ModelManager.get(HeroModel).careerInfos[this._heroCfg.id];
        this._updateAttr(info ? careerIds[info.careerLineIdx] : careerIds[0])
        this._updateGroupInfo()
        this._updateGeneConnect();
        this._updateSwitchBtn();
        this._updateMysticState();
        this._updateUniqueEquipState()
    }

    _updateUpInfo() {
        this.heroNameLab.string = this._heroCfg.name;
        let star = this.mysticLinkId ? HeroUtils.getHeroInfoByHeroId(this.mysticLinkId).star : (this._awakePreview ? this._heroCfg.star_max : this._heroCfg.star_min);
        let color = ConfigManager.getItemById(Hero_starCfg, star).color;
        this.heroNameLab.node.color = cc.color(GlobalUtil.getHeroNameColor(color))
        let laboutline = this.heroNameLab.getComponent(cc.LabelOutline)
        laboutline.color = cc.color(GlobalUtil.getHeroNameColor(color, true))
        // HeroUtils.setSpineData(this.node, this.spine, this._heroCfg.skin, false, false);

        let bgPath = ["yx_bg04", "yx_bg05", "yx_bg"]
        let idx = 0;
        if (star >= 5) idx = 2;
        else if (star > 3) idx = 1;
        else idx = 0;
        GlobalUtil.setSpriteIcon(this.node, this.bg, `view/role/texture/bg/${bgPath[idx]}`)
        this._updateStar(this._heroCfg);
    }

    _updateSwitchBtn() {
        this.awakeSwitchBtn.active = this._heroCfg.group[0] == 6 || (ModelManager.get(RoleModel).maxHeroStar >= 9 && this._heroCfg.awake == 1);
        if (this.awakeSwitchBtn.active) {
            let state1 = this.awakeSwitchBtn.getChildByName('state1');
            let state2 = this.awakeSwitchBtn.getChildByName('state2');
            let lab = this.awakeSwitchBtn.getChildByName('lab');
            if (this._heroCfg.group[0] == 6) {
                state1.active = this.mysticState == 1;
                state2.active = this.mysticState == 0;
                lab.getComponent(cc.Label).string = '终极状态';
            } else {
                state1.active = this._awakePreview;
                state2.active = !this._awakePreview;
                lab.getComponent(cc.Label).string = '觉醒预览';
            }
        }
    }

    /**更新星星 */
    _updateStar(cfg: HeroCfg) {
        let star = this.mysticLinkId ? HeroUtils.getHeroInfoByHeroId(this.mysticLinkId).star : (this._awakePreview ? this._heroCfg.star_max : this._heroCfg.star_min);
        if (star >= 12 && this.maxStarNode) {
            this.starLabel.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (star - 11) + ''
        } else {
            this.starLabel.node.active = true;
            this.maxStarNode ? this.maxStarNode.active = false : 0;
            this.starLabel.string = star > 5 ? '2'.repeat(star - 5) : '1'.repeat(star);
        }
    }

    @gdk.binding("model.bookSelectCareerId")
    _updateAttr(careerId) {
        let cfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, null)
        if (!cfg || !this._heroCfg) {
            return
        }
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
        // let nextIds = HeroUtils.getJobBackId(careerId)
        // if (nextIds && nextIds.length > 0) {
        //     careerId = nextIds[0]
        // }
        let careerLv: number = 0;
        let star: number = 0;
        let lv: number = 0;
        if (this._heroCfg.group[0] == 6 && this.mysticLinkId > 0) {
            let info = HeroUtils.getHeroInfoByHeroId(this.mysticLinkId);
            careerLv = info.careerLv;
            star = info.star;
            lv = info.level;
        }
        else {
            let cfgs = ConfigManager.getItemsByField(Hero_careerCfg, 'career_id', careerId);
            cfgs.sort((a, b) => { return b.career_lv - a.career_lv; });
            careerLv = cfgs[0].career_lv;
            star = (this._awakePreview ? this._heroCfg.star_max : this._heroCfg.star_min);
            lv = 0;
        }
        let careerCfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, { career_lv: careerLv })
        let maxLv = ConfigManager.getItems(Hero_lvCfg).length
        let curLv = this._heroCfg.group[0] == 6 && this.mysticLinkId ? HeroUtils.getHeroInfoByHeroId(this.mysticLinkId).level : maxLv;
        let attName = ["hp_w", "atk_w", "def_w", "hit_w", "dodge_w"]
        let growName = ["grow_hp", "grow_atk", "grow_def", "grow_hit", "grow_dodge"]
        let hbAttrBase: HBAttrBase = {
            hp_w: 0,
            atk_w: 0,
            def_w: 0,
            hit_w: 0,
            dodge_w: 0
        }
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, "star", star)
        let grow = this._heroCfg.group[0] == 6 ? starCfg.add_grow_mystery : starCfg.add_grow;
        for (let index = 0; index < attName.length; index++) {
            let baseV = this._heroCfg[attName[index]]
            // let growV = HeroUtils.getGrowInfoById(growName[index], careerCfg[growName[index]]).grow;
            hbAttrBase[attName[index]] += baseV * starCfg.add + ((curLv - 1) * careerCfg[growName[index]] + careerCfg[attName[index]]) * grow //升级升星属性
            // hbAttrBase[attName[index]] += careerCfg[attName[index]]//职业最后一阶属性
            // //精通
            // hbAttrBase[attName[index]] += careerCfg[ulAttName[index]]
            // hbAttrR[ulAttR[index]] += careerCfg[ulAttR[index]] ? careerCfg[ulAttR[index]] : 0
        }

        // for (let index = 0; index < attName.length; index++) {
        //     hbAttrBase[attName[index]] = Math.floor(hbAttrBase[attName[index]] * (10000 + hbAttrR[ulAttR[index]]) / 10000)
        // }

        // 0 生命 1 攻速 2 攻击 3防御
        this.attLabs[0].string = `${Math.floor(hbAttrBase.hp_w)}`
        this.attLabs[1].string = `${Math.floor(careerCfg.atk_order)}`
        this.attLabs[2].string = `${Math.floor(hbAttrBase.atk_w)}`
        this.attLabs[3].string = `${Math.floor(hbAttrBase.def_w)}`

        this.fightLab.string = `${GlobalUtil.getPowerValue(hbAttrBase)}`

        cc.find('attrPanel/hPanel/maxLv', this.node).active = !lv;
        let lvLab = cc.find('attrPanel/hPanel/lvLab', this.node).getComponent(cc.Label);
        lvLab.node.active = lv > 0;
        lvLab.string = `${lv}`;
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

    /**神秘者英雄 基因连接 */
    _updateGeneConnect() {
        if (!this._heroCfg || !this.mysticLinkId) {
            this.geneConnectNode.active = false;
            return;
        }
        this.geneConnectNode.active = this._heroCfg.group[0] == 6;
        if (this.geneConnectNode.active) {
            let connectHeroInfo = HeroUtils.getHeroInfoByHeroId(this.mysticLinkId);
            GlobalUtil.setSpriteIcon(this.node, cc.find('linkLine', this.geneConnectNode), `view/role/texture/geneConnect/smz_lianjie${!connectHeroInfo ? 1 : 2}`);
            cc.find('curHero/linkBg', this.geneConnectNode).active = !!connectHeroInfo;
            cc.find('connectHero/linkBg', this.geneConnectNode).active = !!connectHeroInfo;
            //mystic slot
            let mysticSlot = cc.find('curHero/UiSlotItem', this.geneConnectNode);
            let mysticSlotCtrl = mysticSlot.getComponent(UiSlotItem);
            mysticSlotCtrl.updateItemInfo(this._heroCfg.id);
            mysticSlotCtrl.updateStar(connectHeroInfo.star);
            mysticSlotCtrl.updateCareer(ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this._heroCfg.career_id).career_type);
            mysticSlotCtrl.lvLab.active = true;
            mysticSlotCtrl.lvLab.getComponent(cc.Label).string = `.${connectHeroInfo.level}`;
            mysticSlotCtrl.lvLab.color = cc.color().fromHEX(!!connectHeroInfo ? '#43FDFF' : '#FFFFFF');
            //connect slot
            let connectHeroSlot = cc.find('connectHero/UiSlotItem', this.geneConnectNode);
            connectHeroSlot.active = !!connectHeroInfo;
            if (connectHeroSlot.active) {
                let slotCtrl = connectHeroSlot.getComponent(UiSlotItem);
                slotCtrl.updateItemInfo(connectHeroInfo.typeId);
                slotCtrl.updateStar(connectHeroInfo.star);
                slotCtrl.updateCareer(ConfigManager.getItemByField(Hero_careerCfg, 'career_id', connectHeroInfo.careerId).career_type);
                slotCtrl.lvLab.active = true;
                slotCtrl.lvLab.getComponent(cc.Label).string = `.${connectHeroInfo.level}`;
            }
        }
    }

    /**上一个英雄 */
    leftFunc() {
        this._changHero(-1);
    }

    /**下一个英雄 */
    rightFunc() {
        this._changHero(1);
    }

    /**
    * 点击英雄播放idle动作
    */
    _isClickHero = false;
    playHeroIdleAni() {
        if (this.spine && this.spine.skeletonData) {
            if (!this._isClickHero) {
                this._isClickHero = true
                // 播放声音
                this._playHeroSound();
                // 英雄动画
                this.spine.setAnimation(0, "idle", false);
                this.spine.setCompleteListener(() => {
                    if (!cc.isValid(this.node)) return;
                    this._isClickHero = false;
                    this.spine.setCompleteListener(null);
                    this.spine.setAnimation(0, "stand", true);
                });
            }
        }
    }

    // 英雄音效
    _speech: string;
    _playHeroSound() {
        if (!GlobalUtil.isSoundOn) return;
        gdk.sound.stop();
        let resId = gdk.Tool.getResIdByNode(this.node);
        let speech = HeroUtils.getHeroSpeech(this._heroCfg.id);
        if (speech) {
            gdk.sound.play(resId, speech, true);
        }

        if (speech != this._speech) {
            // 销毁上一个音效资源
            if (this._speech) {
                let url = `${gdk.sound.prefix}${this._speech}`;
                gdk.rm.releaseRes(resId, url, cc.AudioClip);
            }
            this._speech = speech;
        }
    }

    /**左右切换当前选择英雄 */
    _changHero(dir: number) {
        let items = this.model.bookHeroList;
        let len = items.length;
        if (len == 0) {
            return;
        }
        let heroIdx = -1;
        let curr = this._heroCfg
        curr && items.some((item, i) => {
            let cfg = item.cfg
            if (cfg
                && cfg.id == curr.id
                && (!this.hbInfo || (item.careerLineIdx == this.hbInfo.careerLineIdx))) {//&& item.careerLineIdx == this.hbInfo.careerLineIdx
                heroIdx = i;
                return true;
            }
            return false;
        });
        let nextIdx = heroIdx + dir;
        if (nextIdx < 0) {
            nextIdx = len - 1;
        } else if (nextIdx >= len) {
            nextIdx = 0;
        }
        if (heroIdx == nextIdx) {
            return;
        }
        this._awakePreview = false;
        this.initHeroInfo(items[nextIdx].cfg, items[nextIdx])

        let panel = gdk.panel.get(PanelId.HeroDetailSkill)
        if (panel) {
            let ctrl = panel.getComponent(HeroDetailSkillCtrl)
            ctrl._awakePreview = this._awakePreview;
            ctrl.updateView(items[nextIdx].cfg, items[nextIdx])
        }
    }

    openCommentFunc() {
        let cfg = ConfigManager.getItemById(HeroCfg, this._heroCfg.id)
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, "color", cfg.defaultColor)
        gdk.panel.setArgs(PanelId.SubHeroCommentPanel, this._heroCfg.id, starCfg.star)
        gdk.panel.open(PanelId.SubHeroCommentPanel)
    }

    getWayFunc() {
        let cfg = ConfigManager.getItemById(HeroCfg, this._heroCfg.id);
        if (!cfg.new_get || cfg.new_get.length <= 0) {
            gdk.gui.showMessage('暂无获取途径');
        }
        else {
            GlobalUtil.openGainWayTips(this._heroCfg.id);
        }
    }

    onAwakeSwitchBtnClick() {
        if (this._heroCfg.group[0] == 6) {
            this.mysticState = 1 - this.mysticState;
            this.awakeSwitchBtn.getChildByName('state1').active = this.mysticState == 1;
            this.awakeSwitchBtn.getChildByName('state2').active = this.mysticState == 0;
            this._updateMysticState();
        } else {
            this._awakePreview = !this._awakePreview;
            this.awakeSwitchBtn.getChildByName('state1').active = this._awakePreview;
            this.awakeSwitchBtn.getChildByName('state2').active = !this._awakePreview;
            let node = gdk.panel.get(PanelId.HeroDetailSkill);
            let ctrl = node.getComponent(HeroDetailSkillCtrl);
            ctrl.onSwitchAwakeState(this._awakePreview);
            this._updateAwakeState();
        }
    }

    _updateMysticState() {
        HeroUtils.setSpineData(this.node, this.spine, this._heroCfg.skin + `${this._heroCfg.group[0] == 6 && this.mysticState == 1 ? '_jx' : ''}`, false, false);
        if (this._heroCfg.group[0] !== 6) {
            this.mysticBgSpine.node.active = false;
            return;
        }
        //bg
        this.mysticBgSpine.node.active = this.mysticState == 1;

        //skill
        let node = gdk.panel.get(PanelId.HeroDetailSkill);
        if (node) {
            let ctrl = node.getComponent(HeroDetailSkillCtrl)
            ctrl.mysticState = this.mysticState;
            ctrl.mysticLinkId = this.mysticLinkId;
            ctrl.updateView(this._heroCfg, this.hbInfo)
        }
    }

    _updateAwakeState() {
        HeroUtils.setSpineData(this.node, this.spine, this._heroCfg.skin + `${this._awakePreview ? '_jx' : ''}`, false, false);
        this._updateUpInfo()

        let curCareerId = this.model.bookSelectCareerId;
        if (!curCareerId) {
            let careerIds = ModelManager.get(HeroModel).careerInfos[this._heroCfg.id];
            curCareerId = this.hbInfo ? careerIds[this.hbInfo.careerLineIdx] : careerIds[0];
        }
        this._updateAttr(curCareerId)
        this._updateAttr(this.model.bookSelectCareerId);
    }

    _updateUniqueEquipState() {
        if (!JumpUtils.ifSysOpen(2956)) {
            this.uniqueEquipBtn.active = false
            return
        }
        this.uniqueEquipBtn.active = false
        let uniqueCfg = ConfigManager.getItemByField(UniqueCfg, "hero_id", this._heroCfg.id)
        if (uniqueCfg) {
            this.uniqueEquipBtn.active = true
        }
    }

    onUniqueEquipClick() {
        let uniqueCfg = ConfigManager.getItemByField(UniqueCfg, "hero_id", this._heroCfg.id)
        if (uniqueCfg) {
            let uniqueEquip = new icmsg.UniqueEquip()
            uniqueEquip.id = -1
            uniqueEquip.itemId = uniqueCfg.id
            uniqueEquip.star = uniqueCfg.star_max
            gdk.panel.setArgs(PanelId.UniqueEquipTip, uniqueEquip, this.model.bookSelectCareerId)
            gdk.panel.open(PanelId.UniqueEquipTip)

        }
    }
}

export type HBAttrBase = {
    hp_w: number,
    atk_w: number,
    def_w: number,
    hit_w: number,
    dodge_w: number
}

export type HBAttrR = {
    ul_hp_r: number,
    ul_atk_r: number,
    ul_def_r: number,
    ul_hit_r: number,
    ul_dodge_r: number
}
