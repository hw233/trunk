import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianModel from '../../model/GuardianModel';
import GuardianUtils from './GuardianUtils';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { AskInfoCacheType, AskInfoType } from '../../../../common/widgets/AskPanel';
import { AttrType, EquipAttrTYPE } from '../../../../common/utils/EquipUtils';
import { BagItem } from '../../../../common/models/BagModel';
import { Global_powerCfg, Guardian_starCfg, GuardianCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
/** 
 * @Description:守护者列表
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-28 16:00:38
 */

export type GuardianItemInfo = {
    bagItem: BagItem,
    selected: boolean,
    power?: number,
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianListCtrl")
export default class GuardianListCtrl extends gdk.BasePanel {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Node)
    attrNodes: cc.Node[] = [];

    @property(cc.Node)
    skillIcon: cc.Node = null;

    @property(cc.Label)
    skillName: cc.Label = null;

    @property(cc.RichText)
    skillDesc: cc.RichText = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    onNode: cc.Node = null;

    @property(cc.Node)
    offNode: cc.Node = null;

    list: ListView;
    _isSelect: boolean = false
    _curGuardianId: number = 0

    get guardianModel(): GuardianModel {
        return ModelManager.get(GuardianModel)
    }

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel)
    }

    onEnable() {
        this._curGuardianId = this.args[0]
        this._updateViewInfo()
    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 4,
                gap_x: 30,
                gap_y: 15,
                async: true,
                direction: ListViewDir.Vertical,
            })
            this.list.onClick.on(this._selectItem, this);
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

        if (this.guardianModel.curHeroId > 0) {
            let heroInfo = HeroUtils.getHeroInfoByHeroId(this.guardianModel.curHeroId)
            if (heroInfo.guardian) {
                for (let i = 0; i < this.list.datas.length; i++) {
                    let info = (this.list.datas[i] as GuardianItemInfo)
                    if (heroInfo.guardian && heroInfo.guardian.id == info.bagItem.series) {
                        this._selectItem(info, i)
                        this.list.scroll_to(i)
                        break
                    }
                }
            } else {
                this.onNode.active = false
                this.offNode.active = true
            }
        }
    }

    /**排序方法 */
    sortFunc(a: GuardianItemInfo, b: GuardianItemInfo) {
        if (a.power == b.power) {
            return b.bagItem.itemId - a.bagItem.itemId
        }
        return b.power - a.power
    }

    _selectItem(itemInfo: GuardianItemInfo, index: number) {
        let heroInfo = GuardianUtils.getGuardianHeroInfo(itemInfo.bagItem.series)
        if (heroInfo) {
            if (heroInfo.guardian && (heroInfo.guardian.id != this._curGuardianId && (this.guardianModel.curHeroId > 0 && heroInfo.heroId != this.guardianModel.curHeroId))) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP7"))
                return
            }
        }
        for (let i = 0; i < this.list.datas.length; i++) {
            if (i == index) {
                (this.list.datas[i] as GuardianItemInfo).selected = !(this.list.datas[i] as GuardianItemInfo).selected
                this._isSelect = (this.list.datas[i] as GuardianItemInfo).selected
            } else {
                (this.list.datas[i] as GuardianItemInfo).selected = false
            }
        }
        this.list.refresh_items()

        if (this._isSelect) {
            this.onNode.active = true
            this.offNode.active = false
            this._updateSelectInfo(itemInfo.bagItem)
        } else {
            this.onNode.active = false
            this.offNode.active = true
        }
    }

    _updateSelectInfo(item: BagItem) {
        let extInfo = item.extInfo as icmsg.Guardian
        this._curGuardianId = extInfo.id
        this.lvLab.string = '.' + extInfo.level
        this.slotItem.updateItemInfo(item.itemId)
        this.slotItem.updateStar(extInfo.star)
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
        this.powerLab.string = `战力:${power}`;

        let starCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", cfg.id, { star: extInfo.star })
        let skillCfg = GlobalUtil.getSkillLvCfg(cfg.skill_show, starCfg.skill_lv);
        this.skillName.string = `${skillCfg.name}`
        this.skillDesc.string = "";
        this.skillDesc.string = `${skillCfg.des}`;
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(skillCfg.skill_id))
    }


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

    onSelectFunc() {
        let heroId = this.guardianModel.curHeroId
        if (this._isSelect) {
            let guardian = this.heroModel.curHeroInfo.guardian
            if (guardian && guardian.id == this._curGuardianId) {
                gdk.panel.hide(PanelId.GuardianList)
                return
            }
            if (guardian && GuardianUtils.getTargetEquipTotalPower(guardian) > 0) {
                let info: AskInfoType = {
                    title: "",
                    sureCb: () => {
                        this._reqPuton()
                    },
                    descText: gdk.i18n.t("i18n:GUARDIAN_TIP16"),
                    thisArg: this,
                    isShowTip: true,
                    tipSaveCache: AskInfoCacheType.guardian_change_tip,
                }
                GlobalUtil.openAskPanel(info)
            } else {
                this._reqPuton()
            }

        } else {
            if (this.heroModel.curHeroInfo.guardian && this.heroModel.curHeroInfo.guardian.id > 0) {
                let msg = new icmsg.GuardianTakeOffReq()
                msg.heroId = heroId
                NetManager.send(msg, (data: icmsg.GuardianTakeOffRsp) => {
                    HeroUtils.updateHeroInfo(heroId, data.hero)
                    if (this.heroModel.curHeroInfo && this.heroModel.curHeroInfo.heroId == data.hero.heroId) {
                        this.heroModel.curHeroInfo = data.hero
                    }
                    gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP9"))
                    gdk.panel.hide(PanelId.GuardianList)
                })
            }
        }
    }

    _reqPuton() {
        let heroId = this.guardianModel.curHeroId
        let msg = new icmsg.GuardianPutOnReq()
        msg.heroId = heroId
        msg.guardianId = this._curGuardianId
        NetManager.send(msg, (data: icmsg.GuardianPutOnRsp) => {
            HeroUtils.updateHeroInfo(heroId, data.hero)
            if (this.heroModel.curHeroInfo && this.heroModel.curHeroInfo.heroId == data.hero.heroId) {
                this.heroModel.curHeroInfo = data.hero
            }
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP8"))
            gdk.panel.hide(PanelId.GuardianList)
        })
    }
}