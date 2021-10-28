import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GroupItemCtrl from '../main/camp/GroupItemCtrl';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils, { StageKeys } from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import {
    GlobalCfg,
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg
    } from '../../../../a/config';

/**
 * 查看英雄详情界面
 * @Author: luoyong
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 21:43:49
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/lookHero/LookHeroViewCtrl")
export default class LookHeroViewCtrl extends gdk.BasePanel {

    @property(cc.ToggleContainer)
    selectBtns: cc.ToggleContainer = null;

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

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    groupLayout: cc.Node = null // 存放阵营图标的

    @property(cc.Prefab)
    groupItem: cc.Prefab = null;

    @property(cc.Node)
    panelParent: cc.Node = null;

    @property(cc.Node)
    attrPanel: cc.Node = null;

    @property(cc.Node)
    btnGuardian: cc.Node = null;

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
    _heroImage: icmsg.HeroImage
    _heroCfg: HeroCfg
    attLabs: Array<cc.Label> = [];      // 白字属性lab数组
    extLabs: Array<cc.Label> = [];      // 绿字属性lab数组
    stageLabs: Array<cc.Sprite> = [];    // 评级lab数组

    onEnable() {
        this.scheduleOnce(this.checkArgs, 0);

        // 属性文本
        let labsNode = this.labsNode;
        for (let index = 0; index < 6; index++) {
            let stageLab = labsNode.getChildByName(`stageLab${index + 1}`);
            let attLab = labsNode.getChildByName(`attLab${index + 1}`);
            let extLab = labsNode.getChildByName(`extLab${index + 1}`);
            this.stageLabs[index] = stageLab.getComponent(cc.Sprite);
            this.attLabs[index] = attLab.getComponent(cc.Label);
            this.extLabs[index] = extLab.getComponent(cc.Label);
        }
    }

    onDisable() {
        gdk.e.targetOff(this);
        gdk.Timer.clearAll(this);
        this.unschedule(this.checkArgs);
        // 关闭打开或打开中的子界面
        for (let i = 0, n = this._panelNames.length; i < n; i++) {
            let panelId = gdk.PanelId.getValue(this._panelNames[i]);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
        }
        this.panelIndex = -1;
        this._onPanelShow = null;
    }

    /**
     * 打开角色面板,额外参数可带一个次级面板数据
     * 1:技能界面 2:装备界面 
     */
    _onPanelShow: (node?: cc.Node) => void;   // 当子界面打开时回调
    checkArgs() {
        let args = this.args;
        let idx = 0;
        if (args && args.length > 0) {
            // 有外部参数
            if (args[0] instanceof Array) {
                args = args[0];
            }
            // 更新当前选中的下层子界面索引
            idx = args[0];
        } else {
            // 没有参数时
            idx = 0;
        }
        let btn = this.selectBtns.toggleItems[idx];
        if (btn) {
            // 调用子界面方法
            if (args && args.length > 1) {
                this._onPanelShow = (node: cc.Node) => {
                    if (cc.isValid(node)) {
                        let arr = node.getComponents(cc.Component);
                        let name = args[1];
                        let params = args.slice(2);
                        for (let i = 0, n = arr.length; i < n; i++) {
                            let ctrl = arr[i];
                            let func: Function = ctrl[name];
                            if (typeof func === 'function') {
                                func.call(ctrl, ...params);
                            }
                        }
                    }
                    this._onPanelShow = null;
                };
            }
            // 打开指定的子界面
            btn.checkEvents.forEach(h => {
                h.emit([null]);
            });
        }
    }

    /**面板选择显示 */
    selectFunc(e: any, utype: any) {
        (cc.js.isString(utype)) && (utype = parseInt(utype));
        (utype < 0) && (utype = 0);
        // 打开子界面索引变更
        if (this.panelIndex == utype) {
            return;
        }

        if (utype == 3) {
            // 评论界面特殊处理
            gdk.panel.setArgs(PanelId.SubHeroCommentPanel, this._heroImage.typeId, this._heroImage.star)
            let panelId = gdk.PanelId.getValue(this._panelNames[utype]);
            if (panelId) {
                gdk.panel.open(panelId, (node: cc.Node) => {
                    // 关闭事件
                    let onHide = gdk.NodeTool.onHide(node);
                    onHide.on(() => {
                        onHide.targetOff(this);
                        if (cc.isValid(this.node)) {
                            this._updateSelectBtns();
                        }
                    }, this);
                    // 如果有回调函数需要执行
                    this._onPanelShow && this._onPanelShow(node);
                }, this);
            }
        } else {
            // 关闭上一个子界面
            if (this.panelIndex > -1) {
                let panelId = gdk.PanelId.getValue(this._panelNames[this.panelIndex]);
                if (panelId) {
                    gdk.panel.hide(panelId);
                }
                this.panelIndex = -1;
            }

            // 打开新的子界面
            let panelId = gdk.PanelId.getValue(this._panelNames[utype]);
            if (panelId) {
                gdk.panel.open(
                    panelId,
                    this._onPanelShow,
                    this,
                    {
                        parent: this.panelParent
                    },
                );
            }
            this.panelIndex = utype;
            this.attrPanel.active = utype != 2
            this._updateSelectBtns()
        }
    }

    _updateSelectBtns() {
        gdk.Timer.once(100, this, this._updateSelectBtnsLater);
    }

    _updateSelectBtnsLater() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabledInHierarchy) return;
        let toggleItems = this.selectBtns.toggleItems;
        for (let i = 0, n = toggleItems.length; i < n; i++) {
            let toggle = toggleItems[i];
            // 按钮状态
            let selected = i == this.panelIndex;
            if (toggle.checkMark) {
                toggle.checkMark.node.active = selected;
            }
            toggle['_N$isChecked'] = selected;
            toggle.interactable = !selected;
        }
    }

    updateHeroInfo() {
        this._heroImage = this.model.heroImage
        this._heroCfg = ConfigManager.getItemById(HeroCfg, this._heroImage.typeId);

        this._updateUpInfo()
        this._updateAttr()
        this._updateGroupInfo()
        this._updateGuardian()
    }

    _updateUpInfo() {
        this.heroNameLab.string = this._heroCfg.name;
        let color = ConfigManager.getItemById(Hero_starCfg, this._heroImage.star).color;
        this.heroNameLab.node.color = cc.color(GlobalUtil.getHeroNameColor(color))
        let laboutline = this.heroNameLab.getComponent(cc.LabelOutline)
        laboutline.color = cc.color(GlobalUtil.getHeroNameColor(color, true))

        let url = HeroUtils.getHeroSkin(this._heroImage.typeId, this._heroImage.star)
        HeroUtils.setSpineData(this.node, this.spine, url, true, false);
        let bgPath = ["yx_bg04", "yx_bg05", "yx_bg"]
        let idx = 0;
        if (this._heroImage.star >= 5) idx = 2;
        else if (this._heroImage.star > 3) idx = 1;
        else idx = 0;
        GlobalUtil.setSpriteIcon(this.node, this.bg, `view/role/texture/bg/${bgPath[idx]}`)
        this._updateStar();
    }

    /**更新星星 */
    _updateStar() {
        let starNum = this._heroImage.star;
        if (starNum >= 12 && this.maxStarNode) {
            this.starLabel.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (starNum - 11) + ''
        } else {
            this.starLabel.node.active = true;
            this.maxStarNode ? this.maxStarNode.active = false : 0;
            this.starLabel.string = starNum > 5 ? '2'.repeat(starNum - 5) : '1'.repeat(starNum);
        }
    }


    _updateAttr() {
        let cfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this._heroImage.careerId, null)
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
        let attName = ["hpW", "atk_order", "atkW", "defW", "hitW", "dodgeW"];
        let extName = ["hpG", "atk_order", "atkG", "defG", "hitG", "dodgeG"];
        for (let index = 0; index < attName.length; index++) {
            const key = attName[index];
            const key2 = extName[index];
            if (key == "atk_order") {
                let hero = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this._heroImage.careerId);
                this.attLabs[index].string = hero.atk_order.toString();
                this.extLabs[index].string = ``;
            } else {
                let val = this._heroImage[key];
                let val2 = this._heroImage[key2];
                this.attLabs[index].string = val;
                if (val2 > 0) {
                    this.extLabs[index].string = `+${val2}`;
                } else {
                    this.extLabs[index].string = "";
                }
            }
        }

        let nameArr = ["yx_chengse", "yx_chengse", "yx_lanse", "yx_lvse"]
        GlobalUtil.setSpriteIcon(this.node, this.solIcon, `common/texture/soldier/${nameArr[cfg.career_type - 1]}`);
        this.lvLab.string = `${this._heroImage.level}`
        this.fightLab.string = `${this._heroImage.power}`
    }

    /**更新阵营图标 */
    _updateGroupInfo() {
        let heroConfig = ConfigManager.getItemById(HeroCfg, this._heroImage.typeId);
        if (heroConfig) {
            let hero = heroConfig
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

    _updateGuardian() {
        let guardian_open = ConfigManager.getItemById(GlobalCfg, "guardian_open").value[0]
        if (this._heroImage.star < guardian_open) {
            this.btnGuardian.active = false
            return
        }
        this.btnGuardian.active = true
        let add = cc.find("bg/add", this.btnGuardian)
        let slot = cc.find("bg/UiSlotItem", this.btnGuardian).getComponent(UiSlotItem)
        if (this._heroImage.guardian && this._heroImage.guardian.id > 0) {
            add.active = false
            slot.node.active = true
            let lv = cc.find("bg/UiSlotItem/lv", this.btnGuardian).getComponent(cc.Label)
            gdk.Timer.callLater(this, () => {
                slot.updateItemInfo(this._heroImage.guardian.type)
                slot.updateStar(this._heroImage.guardian.star)
                lv.string = `.${this._heroImage.guardian.level}`
            })
        } else {
            add.active = true
            slot.node.active = false
        }
    }

    onGuardianClick() {
        if (this._heroImage.guardian) {
            gdk.panel.setArgs(PanelId.GuardianInfoTip, this._heroImage.guardian, true)
            gdk.panel.open(PanelId.GuardianInfoTip,)
        }
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
}
