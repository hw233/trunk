
/** 
 * @Description: 指挥官-神器-升级面板
 * @Author: weiliang.huang  
 * @Date: 2019-05-14 17:43:51 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-08-19 13:52:06
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/general/GWLvPanelCtrl")
export default class GWLvPanelCtrl extends cc.Component {

    // @property(cc.Node)
    // content: cc.Node = null

    // @property(cc.Node)
    // upPanel: cc.Node = null

    // @property(cc.Node)
    // fullTips: cc.Node = null

    // @property(cc.Node)
    // maxTips: cc.Node = null

    // @property(UiProgress)
    // expPro: UiProgress = null

    // @property(cc.Label)
    // lvLab: cc.Label = null

    // @property(cc.Label)
    // expLab: cc.Label = null

    // @property(cc.Label)
    // nameLab: cc.Label = null

    // @property(cc.Node)
    // labs: cc.Node = null

    // get model(): GeneralModel { return ModelManager.get(GeneralModel); }
    // get player(): RoleModel { return ModelManager.get(RoleModel); }

    // ifInit: boolean = false
    // curIdx: number = -1       // 当次长按道具下标
    // curNum: number = -1      // 当次长按最大可发数量
    // matCtrls: UiSlotItem[] = [] // 材料项控件组
    // matItems: ItemCfg[] = []    // 升级材料
    // matIndex: Object = {}   // 材料id对应的下标
    // curWeapon: GweaponInfo = null
    // curLabs: cc.Label[] = []
    // addLabs: cc.Label[] = []
    // maxLv: number = 10;

    // onLoad() {
    //     let list = ConfigManager.getItems(General_weapon_lvCfg)
    //     this.maxLv = list.length
    //     this.initMaterials()
    //     gdk.e.on(GeneralEventId.UPDATE_GENERAL_WEAPON, this._updateWeaponInfo, this)
    //     gdk.e.on(GeneralEventId.RSP_CHANGE_WEAPON, () => {
    //         this._clearTimer()
    //         this._updateBase()
    //         this._updateWeaponInfo()
    //     }, this)
    //     gdk.e.on(BagEvent.UPDATE_ONE_ITEM, (e: gdk.Event) => {
    //         let item: BagItem = e.data
    //         let idx = this.matIndex[item.itemId]
    //         if (idx) {
    //             this._updateItemNum(idx - 1)
    //         }
    //     }, this)
    //     for (let index = 0; index < 7; index++) {
    //         this.curLabs[index] = this.labs.getChildByName(`attLab${index + 1}`).getComponent(cc.Label)
    //         this.addLabs[index] = this.labs.getChildByName(`extLab${index + 1}`).getComponent(cc.Label)
    //     }

    // }

    // start() {

    // }

    // onEnable() {
    //     // this._updateWeaponInfo()
    //     GuideUtil.bindGuideNode(700, this.content.children[0])
    //     this._updateBase()
    // }

    // onDisable() {
    //     GuideUtil.bindGuideNode(700)
    //     this._clearTimer()
    // }

    // onDestroy() {
    //     gdk.e.targetOff(this)
    // }

    // /**初始化材料面板 */
    // initMaterials() {
    //     if (this.ifInit) {
    //         return
    //     }
    //     this.ifInit = true
    //     let items = ConfigManager.getItemsByField(ItemCfg, "func_id", "add_gweapon_exp")
    //     this.matItems = items
    //     for (let index = 0; index < items.length; index++) {
    //         let node = this.content.children[index]
    //         if (!node) {
    //             node = cc.instantiate(this.content.children[0])
    //             node.parent = this.content
    //         }
    //         const ele: ItemCfg = items[index];
    //         this.matIndex[ele.id] = index + 1
    //         let exp = ele.func_args[0]

    //         let scr: UiSlotItem = node.getComponent(UiSlotItem)
    //         scr.updateItemInfo(ele.id)
    //         scr.updateItemName(`+${exp}`)
    //         this.matCtrls[index] = scr
    //         this._updateItemNum(index)
    //         node.on(cc.Node.EventType.TOUCH_START, () => {
    //             this._itemTouchStart(index)
    //         }, this)
    //         node.on(cc.Node.EventType.TOUCH_END, () => {
    //             this._itemTouchEnd(index)
    //         }, this)

    //         node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
    //             this._itemTouchEnd(index)
    //         }, this)
    //     }
    // }

    // _updateItemNum(index: number = 0) {
    //     // 收到数据变化时,重新对curNum复制
    //     if (index == this.curIdx) {
    //         this.curNum = index
    //     }
    //     let ctrl = this.matCtrls[index]
    //     if (ctrl) {
    //         let item = this.matItems[index]
    //         let num = BagUtils.getItemNumById(item.id)
    //         let color = CommonNumColor.green
    //         if (num == 0) {
    //             color = CommonNumColor.red
    //         }
    //         ctrl.updateNumLab(`${num}`, 1.1, color)
    //     }
    // }

    // _itemTouchStart(idx) {
    //     if (this._canUpExp(idx) > 0) {
    //         return
    //     }
    //     let item = this.matItems[idx]
    //     this.curNum = BagUtils.getItemNumById(item.id)
    //     this.curIdx = idx
    //     this.schedule(() => {
    //         this._addExpFunc(idx)
    //     }, 0.5, cc.macro.REPEAT_FOREVER, 1)
    //     this._addExpFunc(idx)
    // }

    // _itemTouchEnd(idx) {
    //     this._clearTimer()
    // }

    // _addExpFunc(idx) {
    //     if (this.curNum <= 0) {
    //         this._clearTimer()
    //         gdk.gui.showMessage(ErrorManager.get("ERR_STUFF_NOT_ENOUGH"))
    //         return
    //     }

    //     if (this._canUpExp(idx) > 0) {
    //         return
    //     }

    //     let item = this.matItems[idx]
    //     this.curNum--

    //     let msg = new GweaponStrengthReq()
    //     msg.itemList = [item.id]
    //     NetManager.send(msg)
    // }

    // _clearTimer() {
    //     this.curNum = -1
    //     this.curIdx = -1
    //     this.unscheduleAllCallbacks()
    // }

    // _updateBase() {
    //     let cfg = ConfigManager.getItemById(General_weaponCfg, this.model.generalInfo.weaponId)
    //     this.nameLab.string = cfg.name
    // }

    // @gdk.binding("model.wpList")
    // _updateWeaponInfo() {
    //     if (!this.node.active) {
    //         return
    //     }
    //     let general = this.model.generalInfo
    //     let weapon = this.model.wpList[0]
    //     let curCfg = ConfigManager.getItemById(General_weapon_lvCfg, general.weaponLv)
    //     let nextCfg = ConfigManager.getItemById(General_weapon_lvCfg, general.weaponLv + 1)
    //     if (!nextCfg) {
    //         this.maxTips.active = true
    //         this.fullTips.active = true
    //         this.upPanel.active = false
    //         this.expLab.string = "0/0"
    //         this.expPro.progress = 0
    //     } else {
    //         this.maxTips.active = false
    //         this.fullTips.active = false
    //         this.upPanel.active = true
    //         this.expLab.string = `${general.weaponExp}/${curCfg.exp}`
    //         this.expPro.progress = general.weaponExp / curCfg.exp
    //     }
    //     this.lvLab.string = `Lv.${general.weaponLv}`
    //     let keys = ["atk_w", "hit_w", "crit_w", "hurt_w", "def_pene", "speed", "atk_speed"]
    //     for (let index = 0; index < keys.length; index++) {
    //         let _key = keys[index]
    //         let curLab = this.curLabs[index];
    //         let addLab = this.addLabs[index];
    //         let curVal = curCfg[_key]
    //         curLab.string = `${curVal}`
    //         if (nextCfg) {
    //             let nextVal = nextCfg[_key]
    //             let dVal = nextVal - curVal
    //             addLab.string = `+${dVal}`
    //         }
    //     }
    //     this.curWeapon = weapon
    // }

    // _canUpExp(idx) {
    //     let general = this.model.generalInfo
    //     // 英雄等级无法超过玩家等级
    //     if (general.weaponLv >= this.player.level) {
    //         gdk.gui.showMessage(gdk.i18n.t("i18n:LIMIT_WEAPON_LEVEL"))
    //         this._clearTimer()
    //         return 1
    //     }

    //     // 判断数量是否足够
    //     let item = this.matItems[idx]
    //     let num = BagUtils.getItemNumById(item.id)
    //     if (num <= 0) {
    //         this._clearTimer()
    //         gdk.gui.showMessage(ErrorManager.get("ERR_STUFF_NOT_ENOUGH"))
    //         return 2
    //     }
    //     // 判断经验是否溢出
    //     // 如果当前等级加上变化等级大于玩家等级
    //     // 或者大于等于最大等级则为溢出
    //     let addExp = item.func_args[0]
    //     let addLv = this._calExpUpLevel(general.weaponLv, general.weaponExp, addExp)
    //     let resLv = general.weaponLv + addLv
    //     if (resLv > this.player.level || resLv >= this.maxLv) {
    //         let info: AskInfoType = {
    //             title: "强化提示",
    //             sureCb: () => {
    //                 this._sureAdd(idx)
    //             },
    //             descText: gdk.i18n.t("i18n:OVER_LEVEL_TIPS"),
    //             thisArg: this,
    //         }
    //         GlobalUtil.openAskPanel(info)
    //         this._clearTimer()
    //         return 4
    //     }
    //     return 0
    // }

    // _sureAdd(idx) {
    //     let item = this.matItems[idx]
    //     let msg = new GweaponStrengthReq()
    //     msg.itemList = [item.id]
    //     NetManager.send(msg)
    // }

    // /**
    //  * 根据当前经验和增加的经验算出可以升多少级
    //  * @param curLv 英雄当前等级
    //  * @param curExp 当前经验
    //  * @param addExp 增加的经验值
    //  */
    // _calExpUpLevel(curLv, curExp, addExp) {
    //     let expInfo = ConfigManager.getItemById(General_weapon_lvCfg, curLv)
    //     if (addExp < expInfo.exp) {
    //         return 0
    //     } else {
    //         let num = this._calExpUpLevel(curLv + 1, curExp, addExp - expInfo.exp)
    //         return num + 1
    //     }
    // }

    // /**一键强化函数 */
    // strengthBtnFunc() {
    //     let list = []
    //     let curLv = this.model.generalInfo.weaponLv
    //     let curExp = this.model.generalInfo.weaponExp
    //     let addExp = 0
    //     let ifOver = true   // 是否超过最高等级
    //     for (let index = 0; index < this.matItems.length; index++) {
    //         const item = this.matItems[index];
    //         addExp += item.func_args[0]
    //         let itemId = item.id
    //         let num = BagUtils.getItemNumById(itemId)
    //         for (let i = 0; i < num; i++) {
    //             let addLv = this._calExpUpLevel(curLv, curExp, addExp)
    //             let resLv = curLv + addLv
    //             list.push(itemId)
    //             if (resLv > this.player.level || resLv >= this.maxLv) {
    //                 ifOver = true
    //                 break
    //             }
    //         }
    //         if (ifOver) {
    //             break
    //         }
    //     }

    //     if (list.length == 0) {
    //         gdk.gui.showMessage(ErrorManager.get("ERR_STUFF_NOT_ENOUGH"))
    //         return
    //     }
    //     if (ifOver) {
    //         let info: AskInfoType = {
    //             title: "强化提示",
    //             sureCb: () => {
    //                 let msg = new GweaponStrengthReq()
    //                 msg.itemList = list
    //                 NetManager.send(msg)
    //             },
    //             descText: gdk.i18n.t("i18n:OVER_LEVEL_TIPS"),
    //             thisArg: this,
    //         }
    //         GlobalUtil.openAskPanel(info)
    //         this._clearTimer()
    //         return
    //     }
    //     let msg = new GweaponStrengthReq()
    //     msg.itemList = list
    //     NetManager.send(msg)
    // }
}
