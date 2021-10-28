import BYModel from '../model/BYModel';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import UiSlotItem from '../../../common/widgets/UiSlotItem';

/**
 * @Description: 科技升级界面
 * @Author: weiliang.huang
 * @Date: 2019-05-07 09:34:37
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:54:47
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/TechTrainCtrl")
export default class TechTrainCtrl extends gdk.BasePanel {

    @property(cc.Node)
    upgradeNode: cc.Node = null  // 材料容器
    @property(UiSlotItem)
    mSlots: UiSlotItem[] = []

    @property(cc.Node)
    maxTips: cc.Node = null  // 等级最大提示

    @property(cc.Node)
    lockTips: cc.Node = null  // 未解锁提示

    @property(cc.Label)
    lockLabs: cc.Label[] = []

    @property(cc.Node)
    scienceNode: cc.Node = null  // 科技节点

    @property(cc.Node)
    soldierNode: cc.Node = null  // 士兵节点

    @property(cc.Node)
    arrow: cc.Node = null

    @property(cc.Node)
    leftLay: cc.Node = null

    @property(cc.Node)
    rightLay: cc.Node = null

    @property(cc.RichText)
    curDesc: cc.RichText = null

    @property(cc.RichText)
    nextDesc: cc.RichText = null

    @property(cc.Label)
    money: cc.Label = null;


    @property(cc.RichText)
    leftDes1: cc.RichText = null

    @property(cc.RichText)
    leftDes2: cc.RichText = null

    @property(cc.RichText)
    rightDes1: cc.RichText = null

    @property(cc.RichText)
    rightDes2: cc.RichText = null

    @property(cc.Node)
    leftFlag: cc.Node = null

    @property(cc.Node)
    rightFlag: cc.Node = null

    techId: number = 0   // 科技id
    techLv: number = 0   // 科技等级
    //curCfg: Barracks_science_lvCfg = null
    //nextCfg: Barracks_science_lvCfg = null
    itemNeed: any[] = []  // 材料需要数量
    itemKey: any = {} // 突破,附加材料id-index表
    soldierId: number = 0    // 解锁士兵id

    get model(): BYModel {
        return ModelManager.get(BYModel);
    }

    get roleModel(): RoleModel {
        return ModelManager.get(RoleModel);
    }

    // onLoad() {
    //     gdk.e.on(BagEvent.UPDATE_ONE_ITEM, (e: gdk.Event) => {
    //         let item: BagItem = e.data
    //         let idx = this.itemKey[item.itemId]
    //         if (idx) {
    //             this._updateMaterNum(idx)
    //         }
    //     }, this)
    //     gdk.e.on(BYEventId.UPDATE_BY_INFO, (e: gdk.Event) => {
    //         let info = this.model.byTechInfos[this.techId]
    //         let level = info ? info.level : 0
    //         this.initPanelData(this.techId, level)
    //     }, this)
    //     // 监听背包更新事件
    //     gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateMaterials, this)
    //     gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateMaterials, this)
    //     gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._updateMaterials, this)
    //     gdk.e.on(BagEvent.REMOVE_ITEM, this._updateMaterials, this)
    // }

    // onDestroy() {
    //     gdk.e.targetOff(this)
    // }

    // initPanelData(id: number, level: number) {
    //     this.techId = id
    //     this.techLv = level
    //     let curCfg = ConfigManager.getItemByField(Barracks_science_lvCfg, "science_id", id, { science_lv: level })
    //     let nextCfg = ConfigManager.getItemByField(Barracks_science_lvCfg, "science_id", id, { science_lv: level + 1 })
    //     if (!curCfg && !nextCfg) {
    //         return
    //     }
    //     if (this.techLv == 0 && !curCfg) {
    //         this.curCfg = nextCfg
    //     } else {
    //         this.curCfg = curCfg
    //     }

    //     if (this.curCfg.soldier_id != 0) {

    //         this.scienceNode.active = false
    //         this.soldierNode.active = true

    //         this.leftDes1.node.parent.parent.active = true
    //         this.leftDes2.node.parent.parent.active = true

    //         this.rightDes1.node.parent.parent.active = true
    //         this.rightDes2.node.parent.parent.active = true

    //         //更新士兵
    //         let spine = this.soldierNode.getChildByName("spine").getComponent(sp.Skeleton)

    //         let layout = this.soldierNode.getChildByName("layout")
    //         let nameLv = layout.getChildByName("nameLvLab").getComponent(cc.Label)
    //         let outLine = layout.getChildByName("nameLvLab").getComponent(cc.LabelOutline)
    //         outLine.enabled = true
    //         let classIcon = layout.getChildByName("classIcon")
    //         let cfg = ConfigManager.getItemById(SoldierCfg, this.curCfg.soldier_id);
    //         GlobalUtil.setUiSoldierSpineData(this.node, spine, cfg.skin, true)
    //         spine.node.scaleX = spine.node.scaleY = 0.78
    //         nameLv.string = nextCfg ? `${cfg.name} LV${this.techLv}` : `${cfg.name} LV.Max`

    //         nameLv.node.color = cc.color(GlobalUtil.getSoldierNameColor(cfg.color, false))
    //         outLine.color = cc.color(GlobalUtil.getSoldierNameColor(cfg.color, true))
    //         GlobalUtil.setSpriteIcon(this.node, classIcon, GlobalUtil.getSoldierClassIconById(cfg.class))

    //     } else {
    //         this.scienceNode.active = true
    //         this.soldierNode.active = false

    //         this.leftDes1.node.parent.parent.active = false
    //         this.leftDes2.node.parent.parent.active = false

    //         this.rightDes1.node.parent.parent.active = false
    //         this.rightDes2.node.parent.parent.active = false

    //         //更新科技
    //         let icon = this.scienceNode.getChildByName("scienceIcon")
    //         let nameLv = this.scienceNode.getChildByName("nameLvLab").getComponent(cc.Label)
    //         let cfg = ConfigManager.getItemById(Barracks_scienceCfg, this.techId)
    //         nameLv.string = nextCfg ? `${cfg.name} LV${this.techLv}` : `${cfg.name} LV.Max`
    //         let path = BYUtils.getTechIcon(this.curCfg.science_id)
    //         GlobalUtil.setSpriteIcon(this.node, icon, path)
    //     }

    //     this.nextCfg = nextCfg
    //     let solId = 0
    //     if (level == 0) {
    //         solId = nextCfg.soldier_id
    //     } else {
    //         solId = curCfg.soldier_id
    //     }
    //     this.leftLay.active = !!this.curCfg
    //     this.rightLay.active = !!this.nextCfg
    //     if (!this.curCfg) {
    //         this.rightLay.x = -100
    //         this.arrow.active = false
    //     } else if (!this.nextCfg) {
    //         this.leftLay.x = -100
    //         this.arrow.active = false
    //     } else {
    //         this.arrow.active = true
    //         this.leftLay.x = -264
    //         this.rightLay.x = 54
    //     }

    //     this.leftFlag.active = false
    //     this.rightFlag.active = false
    //     if (solId > 0) {
    //         this.soldierId = solId
    //         this.leftFlag.active = true
    //         this.rightFlag.active = true
    //     }

    //     this._showAttPanel()

    //     let ifOpen = BYUtils.getLockState(id)
    //     if (ifOpen) {
    //         this._updateMaterials()
    //     } else {
    //         this._showLockPanel()
    //     }
    // }

    // // 显示描述信息
    // _showAttPanel() {

    //     if (this.curCfg) {
    //         this.curDesc.string = StringUtils.setRichtOutLine(this._getAttDesc(this.curCfg, this.techLv), "#7e3f0b", 2)
    //         if (this.soldierId > 0) {
    //             if (this.techLv == 0) {
    //                 // this.curDesc.node.active = false
    //                 // this.leftDes1.node.parent.parent.active = false
    //                 // this.leftDes2.node.parent.parent.active = false
    //                 this.leftLay.active = false
    //                 this.rightLay.x = -100
    //                 this.arrow.active = false

    //             } else {
    //                 this.curDesc.node.active = false
    //                 this.leftDes1.string = "\n" + SoldierUtils.getSkillInfo(this.soldierId, 0, this.techLv).desc;
    //                 this.leftDes2.string = "\n" + SoldierUtils.getSkillInfo(this.soldierId, 1, this.techLv).desc;
    //             }

    //         }

    //     }
    //     if (this.nextCfg) {
    //         this.nextDesc.string = StringUtils.setRichtOutLine(this._getAttDesc(this.nextCfg, this.techLv + 1), "#7e3f0b", 2)

    //         if (this.soldierId > 0) {
    //             this.nextDesc.node.active = false
    //             this.rightDes1.string = "\n" + SoldierUtils.getSkillInfo(this.soldierId, 0, this.techLv + 1).desc;
    //             this.rightDes2.string = "\n" + SoldierUtils.getSkillInfo(this.soldierId, 1, this.techLv + 1).desc;
    //         }
    //     }
    // }

    // _getAttDesc(cfg: Barracks_science_lvCfg, level: number = 1) {
    //     if (!cfg) {
    //         return ""
    //     }
    //     let keys = ["atk_g", "hp_g", "def_g", "atk_r", "hp_r", "def_r", "atk_speed_r", "dmg_add", "dmg_res"]
    //     let str = cfg.science_desc
    //     if (level == 0) {
    //         str = str.replace("Lv.1", "Lv.0")
    //     }
    //     let count = 0
    //     for (let index = 0; index < keys.length; index++) {
    //         const _key = keys[index];
    //         let value = cfg[_key]
    //         if (level == 0) {
    //             value = 0;
    //         }
    //         if (cfg[_key] == 0 && level == 0) {
    //             count++
    //         }

    //         if (value != null) {
    //             if (_key.indexOf("_r") >= 0) {
    //                 value = `${Math.floor(value / 100)}%`
    //             }
    //             str = str.replace(`{${_key}}`, value)
    //         }

    //         //等级为0 时 参数全部为0，描述读去另外的配置
    //         if (count == keys.length) {
    //             let sCfg = ConfigManager.getItemById(Barracks_scienceCfg, cfg.science_id)
    //             if (sCfg) {
    //                 str = sCfg.science_desc
    //             }
    //         }
    //     }
    //     return str
    // }

    // /**显示士兵面板信息 */
    // _showSoldierPanel() {
    //     let id = this.soldierId
    //     if (this.curCfg) {
    //         this.curDesc.string = BYUtils.getSoldierDesc(this.curCfg, id, this.techLv)
    //     }
    //     if (this.nextCfg) {
    //         this.nextDesc.string = BYUtils.getSoldierDesc(this.nextCfg, id, this.techLv + 1)
    //     }
    // }


    // /**更新材料显示 */
    // _updateMaterials() {
    //     let cfg = this.nextCfg;
    //     if (!this.nextCfg) {
    //         this.maxTips.active = true
    //         this.upgradeNode.active = false
    //         cfg = this.curCfg;
    //     } else {
    //         this.maxTips.active = false
    //         this.upgradeNode.active = true
    //     }
    //     if (cfg) {
    //         for (let index = 0; index < 3; index++) {
    //             const _key = `item_${index + 1}`
    //             const _key2 = `count_${index + 1}`
    //             if (cfg[_key]) {
    //                 let id = cfg[_key]
    //                 let need = cfg[_key2]
    //                 this.itemNeed[index] = [id, need]
    //                 this.itemKey[id] = index
    //                 this.mSlots[index].updateItemInfo(id)
    //                 let type = BagUtils.getItemTypeById(id)
    //                 let item: BagItem = {
    //                     series: id,
    //                     itemId: id,
    //                     itemNum: 1,
    //                     type: type,
    //                     extInfo: null
    //                 }
    //                 this.mSlots[index].itemInfo = item
    //                 this.mSlots[index].showGainWay = true
    //                 this._updateMaterNum(index)
    //                 this.mSlots[index].node.active = true
    //                 //材料点击返回事件
    //                 this.mSlots[index].onClick.on(() => {
    //                     this.model.byTechRecord = { sid: this.techId, level: this.techLv }
    //                 }, this)
    //             } else {
    //                 this.mSlots[index].node.active = false
    //             }
    //         }

    //         if (cfg['item_4']) {
    //             let id = cfg['item_4']
    //             let num = cfg['count_4'];
    //             this.itemNeed[3] = [id, num]
    //             this.money.string = num + '';
    //             let hasNum = this.roleModel[AttTypeName[id]]
    //             let color = cc.color("#f1b77f")
    //             if (hasNum < num) {
    //                 color = CommonNumColor.red
    //             }
    //             this.money.node.color = color;
    //         }

    //     }
    // }

    // _updateMaterNum(index) {
    //     if (!this.mSlots[index]) {
    //         return
    //     }
    //     let data = this.itemNeed[index]
    //     let itemId = data[0]
    //     let needNum = data[1]
    //     let hasNum = BagUtils.getItemNumById(itemId)
    //     let type = BagUtils.getItemTypeById(itemId)
    //     if (type == BagType.MONEY) {
    //         hasNum = this.roleModel[AttTypeName[itemId]]
    //     }
    //     let color = CommonNumColor.green
    //     if (hasNum < needNum) {
    //         color = CommonNumColor.red
    //     }

    //     gdk.Timer.callLater(this, () => {
    //         this.mSlots[index].updateNumLab(`${hasNum}/${needNum}`, 1, color)
    //     })
    // }

    // /**显示加锁面板 */
    // _showLockPanel() {
    //     this.upgradeNode.active = false
    //     this.maxTips.active = false
    //     this.lockTips.active = true
    //     let list = BYUtils.getScienceRequire(this.techId)
    //     for (let index = 0; index < 4; index++) {
    //         const lab = this.lockLabs[index];
    //         let data = list[index]
    //         lab.node.active = !!data
    //         if (data) {
    //             let desc = data.desc
    //             let state = data.state
    //             let color = null
    //             if (state) {
    //                 color = CommonNumColor.green
    //                 desc = `${desc}` + "(已达成)"
    //             } else {
    //                 color = CommonNumColor.red
    //                 desc = `${desc}` + "(未达成)"
    //             }
    //             lab.string = desc
    //             lab.node.color = color
    //         }
    //     }
    // }

    // /**升级按钮函数 */
    // upBtnFunc() {
    //     for (let index = 0; index < 4; index++) {
    //         const data = this.itemNeed[index];
    //         if (data) {
    //             let itemId = data[0]
    //             let needNum = data[1]
    //             let hasNum = BagUtils.getItemNumById(itemId)
    //             let type = BagUtils.getItemTypeById(itemId)
    //             if (type == BagType.MONEY) {
    //                 //货币判断
    //                 if (!GlobalUtil.checkMoneyEnough(needNum, itemId, this, [PanelId.BYTrain])) {
    //                     return
    //                 }
    //             }
    //             if (hasNum < needNum) {
    //                 gdk.gui.showMessage(ErrorManager.get("ERR_STUFF_NOT_ENOUGH"))
    //                 return
    //             }
    //         }
    //     }
    //     let msg = new BarrackTechUpReq();
    //     msg.id = this.techId;
    //     NetManager.send(msg);
    // }

    // /**适应英雄界面 */
    // openHeroFunc() {
    //     if (this.soldierId > 0) {
    //         gdk.panel.setArgs(PanelId.TechHero, this.soldierId)
    //         gdk.panel.open(PanelId.TechHero)
    //     }
    // }

    // /**适应英雄界面 */
    // openTechSoldierFunc() {
    //     if (this.soldierId > 0) {
    //         gdk.panel.setArgs(PanelId.TechSoldier, this.soldierId)
    //         gdk.panel.open(PanelId.TechSoldier)
    //     }
    // }
}
