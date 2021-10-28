import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianModel from '../../model/GuardianModel';
import GuardianUtils from './GuardianUtils';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { AskInfoCacheType } from '../../../../common/widgets/AskPanel';
import { AttrType } from '../../../../common/utils/EquipUtils';
import {
    Guardian_globalCfg,
    Guardian_starCfg,
    GuardianCfg,
    SkillCfg
    } from '../../../../a/config';

/** 
 * @Description:守护者列表
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-30 19:26:13
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianStarUpCtrl")
export default class GuardianStarUpCtrl extends gdk.BasePanel {

    @property(cc.Label)
    curLv: cc.Label = null;

    @property(cc.Label)
    curAtk: cc.Label = null;

    @property(cc.Label)
    curHp: cc.Label = null;

    @property(cc.Label)
    curDef: cc.Label = null;

    @property(cc.Label)
    nextLv: cc.Label = null;

    @property(cc.Label)
    nextAtk: cc.Label = null;

    @property(cc.Label)
    nextHp: cc.Label = null;

    @property(cc.Label)
    nextDef: cc.Label = null;

    @property(cc.Node)
    skillIcon: cc.Node = null;

    @property(cc.Label)
    skillName: cc.Label = null;

    @property(cc.RichText)
    skillDesc: cc.RichText = null;

    @property(UiSlotItem)
    slotItem1: UiSlotItem = null;

    @property(UiSlotItem)
    slotItem2: UiSlotItem = null;

    _gInfo: icmsg.Guardian
    _gCfg: GuardianCfg
    _curStarCfg: Guardian_starCfg
    _nextStarCfg: Guardian_starCfg

    _enough1: boolean = false // 本体
    _enough2: boolean = false  // 守护晶石

    get guardianModel(): GuardianModel {
        return ModelManager.get(GuardianModel)
    }

    onEnable() {
        this._updateViewInfo()
    }

    onDisable() {
        this.guardianModel.selectIds = []
    }

    _updateViewInfo() {
        let bagItem = GuardianUtils.getGuardianData(this.guardianModel.curGuardianId)
        this._gInfo = bagItem.extInfo as icmsg.Guardian
        this._gCfg = ConfigManager.getItemById(GuardianCfg, this._gInfo.type)
        this._curStarCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", this._gCfg.id, { star: this._gInfo.star })
        this._nextStarCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", this._gCfg.id, { star: this._gInfo.star + 1 })
        if (!this._nextStarCfg) {
            this._nextStarCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", this._gCfg.id, { star: this._gInfo.star })
        }

        let curAttrInfos: AttrType[] = GuardianUtils.getGuardianAttrs(this._gInfo.id)
        let nextAttrInfos = GuardianUtils.getGuardianAttrs(this._gInfo.id, true)
        this.curLv.string = `${this._curStarCfg.guardian_lv}`
        this.curAtk.string = `${curAttrInfos[0].initValue + curAttrInfos[0].value}`
        this.curHp.string = `${curAttrInfos[1].initValue + curAttrInfos[1].value}`
        this.curDef.string = `${curAttrInfos[2].initValue + curAttrInfos[2].value}`

        this.nextLv.string = `${this._nextStarCfg.guardian_lv}`
        this.nextAtk.string = `${nextAttrInfos[0].initValue + nextAttrInfos[0].value}`
        this.nextHp.string = `${nextAttrInfos[1].initValue + nextAttrInfos[1].value}`
        this.nextDef.string = `${nextAttrInfos[2].initValue + nextAttrInfos[2].value}`

        let skillCfg: SkillCfg = GlobalUtil.getSkillLvCfg(this._gCfg.skill_show, this._nextStarCfg.skill_lv)//ConfigManager.getItemByField(SkillCfg, "skill_id", cfg.skill_show)
        this.skillName.string = `${skillCfg.name}`
        this.skillDesc.string = "";
        this.skillDesc.string = `${skillCfg.des}`;
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(skillCfg.skill_id))

        this.updateMaterials()

        let ctrl2 = this.slotItem2.node.getComponent(UiSlotItem)
        let itemId = this._nextStarCfg.cost_star[1][0]
        let needNum = this._nextStarCfg.cost_star[1][1]
        ctrl2.updateItemInfo(itemId)
        let itemName = this.slotItem2.node.getChildByName("itemName").getComponent(cc.Label)
        let proBar = cc.find("bg/proBar", this.slotItem2.node).getComponent(cc.ProgressBar)
        let proLab = cc.find("bg/proLab", this.slotItem2.node).getComponent(cc.Label)
        let itemCfg = BagUtils.getConfigById(itemId)
        itemName.string = `${itemCfg.name}`
        let ownNum = BagUtils.getItemNumById(itemId)
        proBar.progress = ownNum / needNum
        proLab.string = `${ownNum}/${needNum}`

        this._enough2 = ownNum >= needNum
    }

    onStarUpFunc() {
        if (this.guardianModel.selectIds.length == 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP12"))
            return
        }

        if (this._gInfo.star >= this._gCfg.star_max) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP13"))
            return
        }

        if (!this._enough1 || !this._enough2) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP12"))
            return
        }

        let guardianId = this.guardianModel.curGuardianId
        let cb = () => {
            let heroInfo = GuardianUtils.getGuardianHeroInfo(guardianId)
            let msg = new icmsg.GuardianStarUpReq()
            msg.heroId = heroInfo ? heroInfo.heroId : 0
            msg.guardianId = guardianId
            msg.stuffIds = this.guardianModel.selectIds
            NetManager.send(msg, (data: icmsg.GuardianStarUpRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                if (data.heroInfo) {
                    //英雄数据
                    HeroUtils.updateHeroInfo(data.heroInfo.heroId, data.heroInfo)
                    //守护者数据
                    GuardianUtils.updateGuardian(data.heroInfo.guardian.id, data.heroInfo.guardian)
                }
                if (data.guardian) {
                    //守护者数据
                    GuardianUtils.updateGuardian(data.guardian.id, data.guardian)
                }
                this.guardianModel.selectIds = []
                GlobalUtil.openRewadrView(data.list)

                gdk.panel.hide(PanelId.GuardianStarUp)
                gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP17"))
            }, this)
        }
        let guardianInfo = <icmsg.Guardian>GuardianUtils.getGuardianData(guardianId).extInfo;
        let limit = ConfigManager.getItemByField(Guardian_globalCfg, 'key', 'limit').value;
        if (guardianInfo.star + 1 > limit[0] || guardianInfo.level > limit[1]) {
            GlobalUtil.openAskPanel({
                descText: `${limit[0]}星或${limit[1]}级以上的守护者不可进行回退,是否继续升星?`,
                sureCb: cb,
                isShowTip: true,
                tipSaveCache: AskInfoCacheType.guardian_star_up,
            })
        } else {
            cb();
        }
    }

    @gdk.binding("guardianModel.selectIds")
    updateMaterials() {
        let ctrl1 = this.slotItem1.node.getComponent(UiSlotItem)
        let itemName = this.slotItem1.node.getChildByName("itemName").getComponent(cc.Label)
        let proBar = cc.find("bg/proBar", this.slotItem1.node).getComponent(cc.ProgressBar)
        let proLab = cc.find("bg/proLab", this.slotItem1.node).getComponent(cc.Label)
        let add = this.slotItem1.node.getChildByName("add")
        let itemId = this._nextStarCfg.cost_star[0][0]
        let needNum = this._nextStarCfg.cost_star[0][1]
        let itemCfg = BagUtils.getConfigById(itemId)
        ctrl1.updateItemInfo(this._nextStarCfg.cost_star[0][0])
        itemName.string = `${itemCfg.name}`
        let ids = this.guardianModel.selectIds
        if (ids.length == 0) {
            add.active = true
            proBar.progress = 0
            proLab.string = `${0}/${needNum}`
            return
        }
        add.active = false
        let ownNum = this.guardianModel.selectIds.length
        proBar.progress = ownNum / needNum
        proLab.string = `${ownNum}/${needNum}`

        this._enough1 = ownNum >= needNum
    }


    onSelectFunc() {
        let itemId = this._nextStarCfg.cost_star[0][0]
        let needNum = this._nextStarCfg.cost_star[0][1]
        gdk.panel.setArgs(PanelId.GuardianMaterialsSelectView, itemId, needNum)
        gdk.panel.open(PanelId.GuardianMaterialsSelectView)
    }
}