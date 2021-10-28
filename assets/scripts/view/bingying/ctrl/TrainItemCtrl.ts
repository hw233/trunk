import BYModel from '../model/BYModel';
import ModelManager from '../../../common/managers/ModelManager';
/** 
 * @Description: 训练营科技子项
 * @Author: weiliang.huang  
 * @Date: 2019-05-08 14:30:23 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:54:55
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/TrainItemCtrl")
export default class TrainItemCtrl extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Node)
    lock: cc.Node = null

    @property(cc.Sprite)
    icon: cc.Sprite = null

    @property(cc.Label)
    trainName: cc.Label = null

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Node)
    up: cc.Node = null

    @property(cc.Node)
    left: cc.Node = null

    @property(cc.Node)
    right: cc.Node = null

    @property(cc.Node)
    upLeft: cc.Node = null

    @property(cc.Node)
    upRight: cc.Node = null

    @property(cc.Node)
    upLeftCross: cc.Node = null

    @property(cc.Node)
    maxIcon: cc.Node = null

    @property(cc.Node)
    soldierBg: cc.Node = null;

    @property(cc.Node)
    nameBg: cc.Node = null;

    @property(cc.Node)
    classIcon: cc.Node = null;

    @property(sp.Skeleton)
    soldierSpine: sp.Skeleton = null;

    sId: number = 0  // 科技id
    techInfo: icmsg.BarrackTech = null    // 科技信息

    get model(): BYModel { return ModelManager.get(BYModel); }

    // onLoad() {
    //     this.node.on(cc.Node.EventType.TOUCH_END, this._onItemClick, this);
    // }

    // onDisable() {
    //     this.icon.spriteFrame = null;
    //     PveTool.clearSpine(this.soldierSpine)
    // }

    // onDestroy() {
    //     this.node.off(cc.Node.EventType.TOUCH_END, this._onItemClick, this);
    // }

    // /**更新item信息显示 */
    // updateView(sId: number = 0) {
    //     this.sId = sId
    //     let byTechInfos = this.model.byTechInfos
    //     let info = byTechInfos[sId]
    //     let ifOpen = true
    //     let level = 0
    //     if (info) {
    //         ifOpen = true
    //         level = info.level
    //     } else {
    //         ifOpen = BYUtils.getLockState(sId)
    //     }

    //     this.lvLab.string = `LV${level}/${BYUtils.getScienceMaxLv(sId)}`
    //     this.lvLab.node.active = ifOpen
    //     this.techInfo = info

    //     this.lock.active = !ifOpen
    //     this.nameBg.height = ifOpen ? 50 : 30

    //     this.maxIcon.active = false;
    //     if (level >= BYUtils.getScienceMaxLv(sId)) {
    //         this.maxIcon.active = true;
    //         this.lvLab.node.active = false
    //     }

    //     let scienceLv = ConfigManager.getItemByField(Barracks_science_lvCfg, "science_id", sId, { science_lv: 1 })
    //     let practiceCfg = ConfigManager.getItemByField(Barracks_scienceCfg, "science_id", sId, null)
    //     this.trainName.string = `${practiceCfg.name}`
    //     this.trainName.node.color = cc.color("#FFC171")
    //     let outLine = this.trainName.node.getComponent(cc.LabelOutline)
    //     outLine.enabled = false
    //     let pIds = practiceCfg.practice_lv.toString().split("")
    //     this.classIcon.active = false
    //     if (scienceLv.soldier_id != 0) {
    //         this.bg.active = false
    //         this.soldierBg.active = true
    //         let soldierCfg = ConfigManager.getItemById(SoldierCfg, scienceLv.soldier_id)
    //         GlobalUtil.setUiSoldierSpineData(this.node, this.soldierSpine, soldierCfg.skin, true)
    //         this.soldierSpine.node.active = true
    //         this.soldierSpine.node.scaleX = this.soldierSpine.node.scaleY = 0.6

    //         this.trainName.node.color = cc.color(GlobalUtil.getSoldierNameColor(soldierCfg.color, false))
    //         outLine.enabled = true
    //         outLine.color = cc.color(GlobalUtil.getSoldierNameColor(soldierCfg.color, true))
    //         this.classIcon.active = true
    //         GlobalUtil.setSpriteIcon(this.node, this.classIcon, GlobalUtil.getSoldierClassIconById(soldierCfg.class))

    //         if (ifOpen) {
    //             PveTool.setSpineShader(this.soldierSpine, "")
    //         } else {
    //             this.lock.active = false
    //             PveTool.setSpineShader(this.soldierSpine, "spine_gray")
    //         }
    //     } else {
    //         let path = BYUtils.getTechIcon(sId)
    //         this.bg.active = true
    //         GlobalUtil.setSpriteIcon(this.node, this.icon, path)
    //         this.soldierBg.active = false;
    //         this.soldierSpine.node.active = false

    //         GlobalUtil.setGrayState(this.bg, ifOpen ? 0 : 1)
    //         GlobalUtil.setGrayState(this.icon, ifOpen ? 0 : 1)
    //     }

    //     this._updateArrow()
    // }

    // _updateArrow() {
    //     let cfg = ConfigManager.getItemById(Barracks_scienceCfg, this.sId)
    //     let preCfg1 = ConfigManager.getItemById(Barracks_scienceCfg, cfg.science_pre1)
    //     let preCfg2 = ConfigManager.getItemById(Barracks_scienceCfg, cfg.science_pre2)

    //     this.up.active = false
    //     this.left.active = false
    //     this.right.active = false
    //     this.upLeft.active = false
    //     this.upRight.active = false
    //     this.upLeftCross.active = false

    //     this._checkArrow(cfg, preCfg1);
    //     this._checkArrow(cfg, preCfg2);
    // }

    // _checkArrow(cfg: Barracks_scienceCfg, preCfg: Barracks_scienceCfg) {
    //     let ifOpen = BYUtils.getLockState(cfg.science_id)
    //     if (preCfg && cfg.science_place[0] == preCfg.science_place[0] && cfg.science_place[1] > preCfg.science_place[1]) {
    //         this.up.active = true
    //         this.up.getChildByName("light").active = ifOpen

    //         this.up.getChildByName("dark").height = (cfg.science_place[1] - preCfg.science_place[1]) * 174
    //         this.up.getChildByName("light").height = (cfg.science_place[1] - preCfg.science_place[1]) * 174
    //     }

    //     if (preCfg && cfg.science_place[1] == preCfg.science_place[1] && cfg.science_place[0] > preCfg.science_place[0]) {
    //         this.left.active = true
    //         this.left.getChildByName("light").active = ifOpen

    //         this.left.getChildByName("dark").height = (cfg.science_place[0] - preCfg.science_place[0]) * 174
    //         this.left.getChildByName("light").height = (cfg.science_place[0] - preCfg.science_place[0]) * 174
    //     }

    //     if (preCfg && cfg.science_place[1] == preCfg.science_place[1] && cfg.science_place[0] < preCfg.science_place[0]) {
    //         this.right.active = true
    //         this.right.getChildByName("light").active = ifOpen

    //         this.right.getChildByName("dark").height = (preCfg.science_place[0] - cfg.science_place[0]) * 174
    //         this.right.getChildByName("light").height = (preCfg.science_place[0] - cfg.science_place[0]) * 174
    //     }

    //     if (preCfg && cfg.science_place[0] > preCfg.science_place[0] && cfg.science_place[1] > preCfg.science_place[1]) {

    //         let hasUpIcon = false
    //         let showUpLeft = true
    //         let list = ConfigManager.getItemsByField(Barracks_scienceCfg, "practice_lv", cfg.practice_lv)
    //         for (let i = 0; i < list.length; i++) {
    //             if (list[i].science_place[0] == cfg.science_place[0] && list[i].science_place[1] == cfg.science_place[1] - 1) {
    //                 hasUpIcon = true
    //             }

    //             if (list[i].science_place[0] == cfg.science_place[0] - 1 && list[i].science_place[1] == cfg.science_place[1]) {
    //                 showUpLeft = false
    //             }
    //         }



    //         //上一级
    //         if (hasUpIcon || showUpLeft) {
    //             this.upLeft.active = true
    //             this.upLeft.getChildByName("light").active = ifOpen
    //             this.upLeft.getChildByName("dark").width = (cfg.science_place[0] - preCfg.science_place[0]) * 220 + 5
    //             this.upLeft.getChildByName("light").width = (cfg.science_place[0] - preCfg.science_place[0]) * 220 + 5

    //             this.upLeft.getChildByName("end").getChildByName("light").active = ifOpen;
    //             this.upLeft.getChildByName("end").getChildByName("dark").x = -(cfg.science_place[0] - preCfg.science_place[0]) * 220
    //             this.upLeft.getChildByName("end").getChildByName("light").x = -(cfg.science_place[0] - preCfg.science_place[0]) * 220 + 4

    //             let value = cfg.science_place[1] - preCfg.science_place[1]
    //             if (value > 1) {
    //                 this.upLeft.getChildByName("end").getChildByName("dark").width = (cfg.science_place[1] - preCfg.science_place[1]) * 115
    //                 this.upLeft.getChildByName("end").getChildByName("light").width = (cfg.science_place[1] - preCfg.science_place[1]) * 115 - 2
    //             }

    //             let cfgs = ConfigManager.getItemsByField(Barracks_scienceCfg, "practice_lv", cfg.practice_lv)
    //             for (let i = 0; i < cfgs.length; i++) {
    //                 if ((cfgs[i].science_place[0] == 1 && cfgs[i].science_place[1] == cfg.science_place[1] && cfgs[i].science_pre1 == cfg.science_pre1 && cfgs[i].science_id != cfg.science_id)
    //                     || (cfgs[i].science_place[0] == 2 && cfgs[i].science_place[1] == cfg.science_place[1] && cfgs[i].science_pre1 == cfg.science_pre1 && cfgs[i].science_id != cfg.science_id)) {
    //                     //
    //                     this.upLeft.getChildByName("end").active = false
    //                     break
    //                 }
    //             }

    //         } else {
    //             //跨级
    //             this.upLeftCross.active = true
    //             this.upLeftCross.zIndex = 0
    //             this.upLeftCross.getChildByName("light").active = ifOpen
    //             this.upLeftCross.getChildByName("dark").width = (cfg.science_place[0] - preCfg.science_place[0]) * 220 + 5
    //             this.upLeftCross.getChildByName("light").width = (cfg.science_place[0] - preCfg.science_place[0]) * 220 + 5

    //             let value = cfg.science_place[1] - preCfg.science_place[1]
    //             // let height = value == 1 ? 36 : 115 * value
    //             if (value > 1) {
    //                 this.upLeftCross.getChildByName("dark").height = 115 * value
    //                 this.upLeftCross.getChildByName("light").height = 115 * value
    //             }

    //         }

    //     }

    //     if (preCfg && cfg.science_place[0] < preCfg.science_place[0] && cfg.science_place[1] > preCfg.science_place[1]) {
    //         this.upRight.active = true
    //         this.upRight.getChildByName("light").active = ifOpen
    //         this.upRight.getChildByName("dark").width = (preCfg.science_place[0] - cfg.science_place[0]) * 220
    //         this.upRight.getChildByName("light").width = (preCfg.science_place[0] - cfg.science_place[0]) * 220 - 5

    //         this.upRight.getChildByName("end").getChildByName("light").active = ifOpen;
    //         this.upRight.getChildByName("end").getChildByName("dark").x = (preCfg.science_place[0] - cfg.science_place[0]) * 220 - 7
    //         this.upRight.getChildByName("end").getChildByName("light").x = (preCfg.science_place[0] - cfg.science_place[0]) * 220 - 10;

    //         let value = (cfg.science_place[1] - preCfg.science_place[1]) //== 1 //? 50 : 115

    //         if (value > 1) {
    //             this.upRight.getChildByName("end").getChildByName("dark").width = (cfg.science_place[1] - preCfg.science_place[1]) * 115
    //             this.upRight.getChildByName("end").getChildByName("light").width = (cfg.science_place[1] - preCfg.science_place[1]) * 115
    //         }

    //     }
    // }

    // _onItemClick() {
    //     let level = 0
    //     if (this.techInfo) {
    //         level = this.techInfo.level
    //     }
    //     gdk.panel.open(PanelId.TechTrain, (node: cc.Node) => {
    //         let comp = node.getComponent(TechTrainCtrl)
    //         comp.initPanelData(this.sId, level)
    //     })
    // }

    // /**
    //  * 红点逻辑函数
    //  */
    // redPointHandle(): boolean {
    //     return RedPointUtils.is_can_barracks_practice_by(this.sId);
    // }

}
