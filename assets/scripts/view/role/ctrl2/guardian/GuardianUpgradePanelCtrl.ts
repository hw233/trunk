import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianModel from '../../model/GuardianModel';
import GuardianUtils from './GuardianUtils';
import GuardianViewCtrl from './GuardianViewCtrl';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import UpgradeCostItemCtrl2 from '../main/career/UpgradeCostItemCtrl2';
import { AskInfoCacheType } from '../../../../common/widgets/AskPanel';
import { AttrType, EquipAttrTYPE } from '../../../../common/utils/EquipUtils';
import { BagEvent } from '../../../bag/enum/BagEvent';
import { BagItem } from '../../../../common/models/BagModel';
import {
    Global_powerCfg,
    Guardian_globalCfg,
    Guardian_lvCfg,
    Guardian_starCfg,
    GuardianCfg
    } from '../../../../a/config';
import { GuardianItemInfo } from './GuardianListCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../enum/RoleEventId';
/** 
 * @Description:守护者升级界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-30 19:26:33
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianUpgradePanelCtrl")
export default class GuardianUpgradePanelCtrl extends gdk.BasePanel {

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    starLabel: cc.Label = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    attrNodes: cc.Node[] = [];

    @property(cc.Node)
    skillIcon: cc.Node = null;

    @property(cc.Label)
    skillName: cc.Label = null;

    @property(cc.RichText)
    skillDesc: cc.RichText = null;

    @property(cc.Label)
    curLv: cc.Label = null;

    @property(cc.Label)
    limitLv: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Node)
    costLayout: cc.Node = null;

    @property(cc.Node)
    upgradeCostItems: cc.Node[] = []

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    topNode: cc.Node = null;

    @property(cc.Node)
    maxTip: cc.Node = null;

    @property(cc.Node)
    btnGet: cc.Node = null;

    @property(cc.Node)
    itemIcon: cc.Node = null;

    @property(cc.Label)
    itemNum: cc.Label = null;

    @property(cc.Node)
    starUpRedpoint: cc.Node = null;

    @property(cc.Node)
    lvUpRedpoint: cc.Node = null;


    list: ListView = null

    _itemId = 140020

    _bagItem: BagItem
    _cfg: GuardianCfg
    _starCfg: Guardian_starCfg
    _extInfo: icmsg.Guardian
    _isSelect: boolean = false

    get guardianModel(): GuardianModel {
        return ModelManager.get(GuardianModel)
    }

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel)
    }

    onEnable() {
        gdk.e.on(RoleEventId.GUARDIAN_REMOVE, this._updateViewInfo, this);
        gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._updateViewInfo, this)
        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateViewInfo, this)
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateViewInfo, this)

        GlobalUtil.setSpriteIcon(this.node, this.itemIcon, GlobalUtil.getIconById(this._itemId))

        this._updateViewInfo()
    }

    onDisable() {
        gdk.e.targetOff(this)
        // this.guardianModel.curHeroId = 0
        // this.guardianModel.curGuardianId = 0
    }

    /**
    * 点击播放idle动作
    */
    _isClickHero = false;
    playHeroIdleAni() {
        if (this.spine && this.spine.skeletonData) {
            if (!this._isClickHero) {
                this._isClickHero = true
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

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.itemPrefab,
            cb_host: this,
            column: 5,
            gap_x: 15,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this)
    }

    _selectItem(itemInfo: GuardianItemInfo, index: number) {
        for (let i = 0; i < this.list.datas.length; i++) {
            if (i == index) {
                (this.list.datas[i] as GuardianItemInfo).selected = true//!(this.list.datas[i] as GuardianItemInfo).selected
                this._isSelect = (this.list.datas[i] as GuardianItemInfo).selected
            } else {
                (this.list.datas[i] as GuardianItemInfo).selected = false
            }
        }
        this.list.refresh_items()

        if (this._isSelect) {
            this.topNode.active = true
            this._updateSelectInfo(itemInfo.bagItem)
        } else {
            this.topNode.active = false
        }
    }

    _updateViewInfo() {
        this._initListView()
        let guardianItems = this.guardianModel.guardianItems
        let inHeros = []
        let freeItems = []
        guardianItems.forEach(element => {
            let extInfo = element.extInfo as icmsg.Guardian
            let info: GuardianItemInfo = {
                bagItem: element,
                selected: false,
                power: GuardianUtils.getGuardianPower(element.itemId, extInfo.level, extInfo.star),
            }
            let heroInfo = GuardianUtils.getGuardianHeroInfo(element.series)
            if (heroInfo) {
                inHeros.push(info)
            } else {
                freeItems.push(info)
            }
        });
        GlobalUtil.sortArray(inHeros, this.sortFunc)
        GlobalUtil.sortArray(freeItems, this.sortFunc)

        let datas = inHeros.concat(freeItems)
        this.list.set_data(datas, false)

        if (this.guardianModel.curGuardianId > 0) {
            for (let i = 0; i < this.list.datas.length; i++) {
                let info = (this.list.datas[i] as GuardianItemInfo)
                if (this.guardianModel.curGuardianId == info.bagItem.series) {
                    this._selectItem(info, i)
                    this.list.scroll_to(i)
                    break
                }
            }
        } else {
            this.topNode.active = false
            if (this.list.datas.length > 0) {
                this._selectItem(this.list.datas[0], 0)
            } else {
                this.btnGet.active = true
            }
        }

        this._updateBagItem()
    }

    /**排序方法 */
    sortFunc(a: GuardianItemInfo, b: GuardianItemInfo) {
        if (a.power == b.power) {
            return b.bagItem.itemId - a.bagItem.itemId
        }
        return b.power - a.power
    }

    _updateSelectInfo(item: BagItem) {
        this._extInfo = item.extInfo as icmsg.Guardian
        this.guardianModel.curGuardianId = this._extInfo.id
        this._cfg = ConfigManager.getItemById(GuardianCfg, item.itemId)
        this._starCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", this._cfg.id, { star: this._extInfo.star })
        this.nameLab.string = `${this._cfg.name}`
        this.nameLab.node.color = cc.color(GlobalUtil.getHeroNameColor(this._cfg.color))
        let laboutline = this.nameLab.getComponent(cc.LabelOutline)
        laboutline.color = cc.color(GlobalUtil.getHeroNameColor(this._cfg.color, true))
        //星级
        this.starLabel.string = this._extInfo.star > 5 ? '2'.repeat(this._extInfo.star - 5) : '1'.repeat(this._extInfo.star);
        //模型
        HeroUtils.setSpineData(this.node, this.spine, this._cfg.skin, true, false);
        //  属性战力等级技能
        let attrInfos = GuardianUtils.getGuardianAttrs(item.series)
        let power = 0;
        for (let i = 0; i < this.attrNodes.length; i++) {
            this._updateOneAttr(this.attrNodes[i], attrInfos[i])
            let attrInfo = attrInfos[i] as AttrType
            let ratio = ConfigManager.getItemByField(Global_powerCfg, 'key', attrInfo.keyName.replace("_w", "")).value;
            power += Math.floor(ratio * (attrInfo.value + attrInfo.initValue));
        }
        let cfg = ConfigManager.getItemById(GuardianCfg, item.itemId)
        this.nameLab.string = `${cfg.name}`
        this.powerLab.string = `${power}`;
        this.curLv.string = `${this._extInfo.level}`
        this.limitLv.string = `/${this._starCfg.guardian_lv}`

        let starCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", cfg.id, { star: this._extInfo.star })
        let skillCfg = GlobalUtil.getSkillLvCfg(cfg.skill_show, starCfg.skill_lv);
        this.skillName.string = `${skillCfg.name}`
        this.skillDesc.string = "";
        this.skillDesc.string = `${skillCfg.des}`;
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(skillCfg.skill_id))

        this.starUpRedpoint.active = false
        this.lvUpRedpoint.active = false
        let heroInfo = GuardianUtils.getGuardianHeroInfo(this._extInfo.id)
        if (heroInfo) {
            this.starUpRedpoint.active = RedPointUtils.is_hero_guardian_can_starup(heroInfo)
            this.lvUpRedpoint.active = RedPointUtils.is_hero_guardian_can_upgrade(heroInfo)
        }

        this._updateCost()
    }

    //更新单条属性数据
    _updateOneAttr(attNode: cc.Node, attrInfo: AttrType) {
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        typeLab.string = attrInfo.name
        let value = `${attrInfo.initValue + attrInfo.value}`
        if (attrInfo.type == EquipAttrTYPE.R) {
            value = `${Number((attrInfo.initValue + attrInfo.value) / 100).toFixed(1)}%`
        }
        numLab.string = `+${value}`
    }

    /**更新升级消耗 */
    _updateCost() {
        let nextLv = this._extInfo.level + 1
        if (this._extInfo.level >= this._starCfg.guardian_lv) {
            this.costLayout.active = false
            this.maxTip.active = true
        } else {
            this.costLayout.active = true
            this.maxTip.active = false
            let lvCfg = ConfigManager.getItemByField(Guardian_lvCfg, "id", nextLv)
            let costItems = lvCfg[`cost_color${this._cfg.color}`]
            for (let i = 0; i < this.upgradeCostItems.length; i++) {
                if (costItems[i]) {
                    this.upgradeCostItems[i].active = true
                    let ctrl = this.upgradeCostItems[i].getComponent(UpgradeCostItemCtrl2)
                    ctrl.updateItemInfo(costItems[i][0], costItems[i][1])
                } else {
                    this.upgradeCostItems[i].active = false
                }
            }
        }
    }

    onUpgradeFunc() {
        if (!this._checkCostEnough()) {
            return
        }
        let cb = () => {
            let heroInfo = GuardianUtils.getGuardianHeroInfo(this._extInfo.id)
            let msg = new icmsg.GuardianLevelUpReq()
            msg.heroId = heroInfo ? heroInfo.heroId : 0
            msg.guardianId = this._extInfo.id
            NetManager.send(msg, (data: icmsg.GuardianLevelUpRsp) => {
                if (data.heroInfo) {
                    //英雄数据
                    HeroUtils.updateHeroInfo(data.heroInfo.heroId, data.heroInfo)
                    //守护者数据
                    GuardianUtils.updateGuardian(data.heroInfo.guardian.id, data.heroInfo.guardian)
                    this._updateSelectInfo(GuardianUtils.getGuardianData(data.heroInfo.guardian.id))
                }
                if (data.guardian) {
                    //守护者数据
                    GuardianUtils.updateGuardian(data.guardian.id, data.guardian)
                    this._updateSelectInfo(GuardianUtils.getGuardianData(data.guardian.id))
                }

                this._updateViewInfo()
            })
        }

        let guardianInfo = <icmsg.Guardian>GuardianUtils.getGuardianData(this._extInfo.id).extInfo;
        let limit = ConfigManager.getItemByField(Guardian_globalCfg, 'key', 'limit').value;
        if (guardianInfo.star > limit[0] || guardianInfo.level + 1 > limit[1]) {
            GlobalUtil.openAskPanel({
                descText: `${limit[0]}星或${limit[1]}级以上的守护者不可进行回退,是否继续升级?`,
                sureCb: cb,
                isShowTip: true,
                tipSaveCache: AskInfoCacheType.guardian_lv_up,
            })
        } else {
            cb();
        }
    }

    _checkCostEnough() {
        let nextLv = this._extInfo.level + 1
        if (this._extInfo.level >= this._starCfg.guardian_lv) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP14"))
            return false
        } else {
            let lvCfg = ConfigManager.getItemByField(Guardian_lvCfg, "id", nextLv)
            let costItems = lvCfg[`cost_color${this._cfg.color}`]
            for (let i = 0; i < costItems.length; i++) {
                if (costItems[i]) {
                    let id = costItems[i][0]
                    let num = costItems[i][1]
                    let cfg = BagUtils.getConfigById(id)
                    if (num > BagUtils.getItemNumById(id)) {
                        gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:GUARDIAN_TIP15"), cfg.name))//`${cfg.name}不足`
                        return false
                    }
                }
            }
        }
        return true
    }

    onStarUpFunc() {
        if (this._extInfo.star >= this._cfg.star_max) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP13"))
            return
        }
        gdk.panel.open(PanelId.GuardianStarUp)
    }

    onGetFunc() {
        gdk.panel.open(PanelId.GuardianView, () => {
            let mainView = gdk.panel.get(PanelId.GuardianView)
            if (mainView) {
                let ctrl = mainView.getComponent(GuardianViewCtrl)
                ctrl.tabMenu.setSelectIdx(1, true);
            }
        })
    }

    onDiamondClick() {
        JumpUtils.openPanel({
            panelId: PanelId.Recharge,
            panelArgs: { args: [3] },
            currId: PanelId.GuardianView,
        });
    }

    onItemClick() {
        if (!JumpUtils.ifSysOpen(718, true)) {
            return
        }
        JumpUtils.openInstancePanel([23])
    }

    _updateBagItem() {
        this.itemNum.string = `${BagUtils.getItemNumById(this._itemId)}`
    }
}
