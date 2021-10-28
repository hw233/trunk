
/** 
 * @Description: 指挥官-神器-升星面板
 * @Author: weiliang.huang  
 * @Date: 2019-05-14 17:44:08 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-08-19 15:48:45
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/general/GWStarPanelCtrl")
export default class GWStarPanelCtrl extends cc.Component {

    // @property(UiSlotItem)
    // curSlot: UiSlotItem = null

    // @property(UiSlotItem)
    // nextSlot: UiSlotItem = null

    // @property(cc.Node)
    // arrowBg: cc.Node = null

    // @property(cc.Sprite)
    // icons: cc.Sprite[] = []

    // @property(cc.Label)
    // lvLabs: cc.Label[] = []

    // @property(UiSlotItem)
    // downSlot: UiSlotItem = null

    // @property(cc.Node)
    // upPanel: cc.Node = null

    // @property(cc.Node)
    // fullTips: cc.Node = null

    // get model(): GeneralModel { return ModelManager.get(GeneralModel); }

    // curWeapon: GweaponInfo = null
    // costId: number = 0; // 升级材料id
    // costNum: number = 0; // 升级材料需要数量

    // onLoad() {
    //     gdk.e.on(GeneralEventId.UPDATE_GENERAL_WEAPON, this._updateWeaponInfo, this)
    //     gdk.e.on(GeneralEventId.RSP_CHANGE_WEAPON, this._updateWeaponInfo, this)

    //     gdk.e.on(BagEvent.UPDATE_ONE_ITEM, (e: gdk.Event) => {
    //         let item: BagItem = e.data
    //         if (item.itemId == this.costId) {
    //             this._updateItemNum()
    //         }
    //     }, this)
    // }

    // start() {

    // }

    // onEnable() {
    //     // this._updateWeaponInfo()
    // }

    // onDestroy() {
    //     gdk.e.targetOff(this)
    // }

    // @gdk.binding("model.wpList")
    // _updateWeaponInfo() {
    //     let weapon = this.model.wpList[0]
    //     let cfg = ConfigManager.getItemByField(General_weapon_starCfg, "star", weapon.star, null)
    //     let cost = cfg.cost
    //     this.costId = cost[0]
    //     this.costNum = cost[1]
    //     this.curSlot.updateStar(weapon.star)
    //     if (this.costId) {
    //         this.upPanel.active = true
    //         this.fullTips.active = false
    //         this.arrowBg.active = true
    //         this.nextSlot.node.active = true
    //         this.curSlot.node.x = -this.nextSlot.node.x
    //         this.downSlot.updateItemInfo(this.costId)
    //         this.nextSlot.updateStar(weapon.star + 1)
    //         this._updateItemNum()
    //         let item: BagItem = {
    //             series: this.costId,
    //             itemId: this.costId,
    //             itemNum: 1,
    //             type: BagType.ITEM,
    //             extInfo: null
    //         }
    //         this.downSlot.itemInfo = item
    //     } else {
    //         this.upPanel.active = false
    //         this.fullTips.active = true
    //         this.arrowBg.active = false
    //         this.nextSlot.node.active = false
    //         this.curSlot.node.x = 0
    //         this.downSlot.updateItemInfo(0)
    //     }
    //     this._updateSkillInfo()
    // }

    // _updateItemNum() {
    //     let hasNum = BagUtils.getItemNumById(this.costId)
    //     let color = CommonNumColor.green
    //     if (hasNum < this.costNum) {
    //         color = CommonNumColor.red
    //     }
    //     let text = `${hasNum}/${this.costNum}`
    //     this.downSlot.updateNumLab(text, 1, color)
    // }

    // _updateSkillInfo() {
    //     let weapon = this.model.wpList[0]
    //     if (!this.curWeapon || this.curWeapon.gweaponId != weapon.gweaponId) {
    //         let cfg = ConfigManager.getItemById(General_weaponCfg, weapon.gweaponId)
    //         let iconKeys = ["skill_big", "skill_atk", "skill_1", "skill_2", "skill_3"]
    //         for (let index = 0; index < iconKeys.length; index++) {
    //             const _key = iconKeys[index];
    //             this._updateIconBySkill(this.icons[index], cfg[_key])
    //         }
    //     }
    //     for (let index = 0; index < 4; index++) {
    //         let lv = weapon.skillLv[index + 1];
    //         let lab = this.lvLabs[index]
    //         lab.string = `${lv}`
    //     }
    //     this.curWeapon = weapon
    // }

    // _updateIconBySkill(icon: cc.Sprite, skillId: number) {
    //     let resId = gdk.Tool.getResIdByNode(this.node)

    //     let path = GlobalUtil.getSkillIcon(skillId)
    //     gdk.rm.loadRes(resId, path, cc.SpriteFrame, (sp: cc.SpriteFrame) => {
    //         if (cc.isValid(this.node)) {
    //             icon.spriteFrame = sp
    //         }
    //     })
    // }

    // starUpFunc() {
    //     let hasNum = BagUtils.getItemNumById(this.costId)
    //     if (hasNum < this.costNum) {
    //         gdk.gui.showMessage(ErrorManager.get("ERR_STUFF_NOT_ENOUGH"))
    //         return
    //     }
    //     let msg = new GweaponUpgradeStarReq()
    //     msg.gweaponId = this.curWeapon.gweaponId
    //     NetManager.send(msg)
    // }
}
