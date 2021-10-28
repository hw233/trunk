import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import EquipUtils from '../../../../common/utils/EquipUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { Common_strongerCfg, HeroCfg } from '../../../../a/config';


/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 19:49:10
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/upgrade/UpgradeEquipItemCtrl")
export default class UpgradeEquipItemCtrl extends UiListItem {

    @property(cc.Node)
    tip: cc.Node = null;

    @property(cc.Sprite)
    colorBg: cc.Sprite = null;

    @property(cc.Sprite)
    heroIcon: cc.Sprite = null;

    @property(cc.Node)
    equipNodes: Array<cc.Node> = [];

    equipCtrls: Array<UiSlotItem> = [];
    heroCfg: HeroCfg
    heroInfo: icmsg.HeroInfo
    _totalStrenghLv = 0

    onLoad() {

    }

    onEnable() {
        // 点击事件
        for (let index = 0; index < this.equipNodes.length; index++) {
            const element = this.equipNodes[index];
            this.equipCtrls[index] = element.getComponent(UiSlotItem);
            element.on(cc.Node.EventType.TOUCH_END, () => {
                this._equipClick(index);
            }, this);
        }
        this._totalStrenghLv = 0
    }

    onDestroy() {
        for (let index = 0; index < this.equipNodes.length; index++) {
            const element = this.equipNodes[index];
            element.targetOff(this);
        }
    }

    updateView() {
        this.heroInfo = this.data
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId)
        let path = `common/texture/sub_itembg0${this.heroInfo.color}`
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, path)
        let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star)//`icon/hero/${this.heroCfg.icon}_s`
        GlobalUtil.setSpriteIcon(this.node, this.heroIcon, icon)

        for (let index = 0; index < 4; index++) {
            this._updateEquipInfo(index)
        }

        let copyModel = ModelManager.get(CopyModel)
        let stageId = copyModel.latelyStageId
        let strongerCfg = ConfigManager.getItemByField(Common_strongerCfg, "index", stageId)
        this.tip.active = false
        if (strongerCfg && this._totalStrenghLv < strongerCfg.strengthening) {
            this.tip.active = true
        }
    }


    _updateEquipInfo(index) {
        let heroInfo = this.heroInfo;
        let equips = heroInfo.slots//heroInfo.equips

        const id = equips[index].equipId || 0;
        let ctrl = this.equipCtrls[index]
        let add = ctrl.node.getChildByName("add")
        let hasEquips = RedPointUtils.get_free_equipsByCareer(heroInfo, { part: index + 1 });
        add.active = id > 0 ? false : (hasEquips.length > 0);
        let equipData: BagItem = EquipUtils.getEquipData(id)
        let itemId = 0
        if (equipData) {
            itemId = equipData.itemId
        }
        ctrl.updateItemInfo(itemId)
        let magicIcon = ctrl.node.getChildByName("magicIcon")
        magicIcon.active = false
        //融合标志
        let mergeIcon = ctrl.node.getChildByName("mergeIcon")
        mergeIcon.active = false
        let typeIcon = ctrl.node.getChildByName("type_icon")
        typeIcon.active = true
        let redPoint = ctrl.node.getChildByName("redPoint")
        redPoint.active = false
        //强化等级
        let strenghLv = ctrl.node.getChildByName("strengthLv").getComponent(cc.Label)
        strenghLv.string = ``
        // if (equipData) {
        //     let extInfo = <EquipInfo>equipData.extInfo
        //     strenghLv.string = `.${extInfo.level || 1}`
        //     this._totalStrenghLv += (extInfo.level || 1)
        //     if (itemId > 0) {
        //         let cfg = ConfigManager.getItemById(Item_equipCfg, itemId)
        //         let colorCfg = ConfigManager.getItemById(Item_equip_colorCfg, cfg.color)
        //         ctrl.updateStar(colorCfg.star + extInfo.breakStar)
        //         if (extInfo.magicId > 0) {
        //             magicIcon.active = true
        //             GlobalUtil.setSpriteIcon(ctrl.node, magicIcon, GlobalUtil.getMagicIcon(extInfo.magicId))
        //         }
        //         if (extInfo.skills.length > 0) {
        //             mergeIcon.active = true
        //         }
        //         typeIcon.active = false
        //         redPoint.active = RedPointUtils.is_can_strength(equipData) || RedPointUtils.is_can_break_through(equipData)
        //             || RedPointUtils.is_can_mount_jewel(equipData) || RedPointUtils.is_can_equip_change(equipData)
        //     }
        // }

    }

    /**装备点击 */
    _equipClick(index: number) {
        let heroInfo = this.heroInfo
        if (!heroInfo) {
            return
        }

        let equips = heroInfo.slots
        let id = equips[index].equipId
        if (id > 0) {
            let curEquip = EquipUtils.getEquipData(id)
            GlobalUtil.openItemTips(curEquip, true, true)
        }
    }

    oepnRolePanel() {
        gdk.panel.hide(PanelId.UpgradeEquip)
        gdk.panel.hide(PanelId.PveSceneFailPanel)
        // JumpUtils.openRolePanel(["equip", 1, this.heroCfg.id])
        JumpUtils.openEquipPanelById(this.heroCfg.id, [1])
    }

}