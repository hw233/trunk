import BYModel from '../model/BYModel';
import MainSceneModel from '../../../scenes/main/model/MainSceneModel';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import TrainItemCtrl from './TrainItemCtrl';
import UiProgress from '../../../common/widgets/UiProgress';

/** 
 * @Description: 兵营-训练营
 * @Author: weiliang.huang  
 * @Date: 2019-05-07 09:34:24 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:54:23
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYTrainView")
export default class BYTrainView extends gdk.BasePanel {

    @property(cc.Button)
    selectBtns: Array<cc.Button> = [];

    @property(cc.Node)
    content: cc.Node = null

    @property(UiProgress)
    expPro: UiProgress = null

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Label)
    expLab: cc.Label = null

    @property(cc.Prefab)
    trainItem: cc.Prefab = null

    @property(cc.Sprite)
    byIcon: cc.Sprite = null

    panelIndex: number = 0
    curType: number = 0  // 当前兵营类型
    trainCtrls: TrainItemCtrl[] = []
    //curList: Barracks_scienceCfg[] = []
    openState: boolean[] = []
    needLv: number[] = []

    nameStr: string = "";
    get model(): BYModel { return ModelManager.get(BYModel); }
    get mainModel(): MainSceneModel { return ModelManager.get(MainSceneModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    // onEnable() {
    //     gdk.e.on(BYEventId.UPDATE_BY_INFO, this._updateTechInfos, this)
    //     if (this.model.bySelectType != 0) {
    //         this.initBYType(this.model.bySelectType)
    //     }
    //     this.title = 'i18n:BYTRAIN_TITLE'

    //     // 有记录从兵营跳转过来的信息 关闭后重新打开该界面
    //     if (this.model.byTechRecord) {
    //         gdk.panel.open(PanelId.TechTrain, (node: cc.Node) => {
    //             let comp = node.getComponent(TechTrainCtrl);
    //             let id = this.model.byTechRecord.sid;
    //             let level = this.model.byTechRecord.level;
    //             comp.initPanelData(id, level);
    //             this.model.byTechRecord = null;
    //         });
    //         return;
    //     }
    // }

    // onDisable() {
    //     gdk.e.targetOff(this)
    //     this.nameStr = "";
    // }

    // onDestroy() {
    //     this.model.byTechRecord = null
    // }

    // /**更新按钮选项卡状态 */
    // _updateBtnState() {
    //     for (let index = 0; index < this.selectBtns.length; index++) {
    //         const node = this.selectBtns[index].node;
    //         let sId = (this.curType * 100 + index + 1) * 100 + 1
    //         let hasId = BYUtils.getLockState(sId)

    //         let practice_lv = (this.curType * 100 + index + 1)
    //         let cfg = ConfigManager.getItem(Barracks_practiceCfg, { practice_lv: practice_lv })
    //         if (!cfg) {
    //             node.active = false
    //             return
    //         }
    //         let byInfos = this.model.byInfos
    //         let ifOpen = byInfos[cfg.barracks_id].level >= cfg.needlv && hasId

    //         let lock = node.getChildByName("lock")
    //         lock.active = !ifOpen
    //         this.openState[index] = ifOpen
    //         this.needLv[index] = cfg.needlv
    //     }
    // }

    // initBYType(utype: number) {
    //     this.model.bySelectType = utype
    //     this.curType = utype
    //     let cfg = ConfigManager.getItemByField(BarracksCfg, "type", utype, null)
    //     let path = `view/bingying/texture/byTypeIcon_${cfg.skin}`
    //     GlobalUtil.setSpriteIcon(this.node, this.byIcon, path)
    //     this.nameStr = cfg.name;
    //     this._updateBtnState()
    //     this.selectFunc(null, this.model.byTabBtnSelectIndex)
    // }

    // /**操作面板选择 */
    // selectFunc(e, utype) {
    //     utype = parseInt(utype)
    //     this.model.byTabBtnSelectIndex = utype
    //     // 第一项默认开启, 这里不做判断
    //     if (utype > 0 && !this.openState[utype]) {
    //         let tips = this.nameStr + '训练营达到Lv.' + this.needLv[utype] + '解锁'
    //         gdk.gui.showMessage(tips)
    //         return
    //     }
    //     this.panelIndex = utype
    //     for (let idx = 0; idx < this.selectBtns.length; idx++) {
    //         const element = this.selectBtns[idx];
    //         element.interactable = idx != utype
    //         let select = element.node.getChildByName("select")
    //         select.active = idx == utype
    //     }

    //     this._initPanelItems()
    //     this._updateTechInfos()
    // }

    // _initPanelItems() {
    //     this.trainCtrls.length = 0;
    //     let curPractice = this.curType * 100 + this.panelIndex + 1;
    //     let list = ConfigManager.getItemsByField(Barracks_scienceCfg, "practice_lv", curPractice);
    //     GlobalUtil.sortArray(list, (a: Barracks_scienceCfg, b: Barracks_scienceCfg) => {
    //         return a.science_id - b.science_id;
    //     });
    //     this.content.children.forEach(node => {
    //         node.active = false;
    //     });
    //     list.forEach((cfg, index) => {
    //         let node = this.content.children[index]
    //         if (!node) {
    //             node = cc.instantiate(this.trainItem)
    //             node.parent = this.content
    //         }
    //         node.zIndex = - index
    //         let place = cfg.science_place
    //         let px = place[0]
    //         let py = place[1]
    //         let nx = -220 + 220 * (px - 1)
    //         let ny = -190 * (py - 1) - node.width * node.anchorY
    //         node.setPosition(cc.v2(nx, ny))
    //         node.active = true
    //         let comp = node.getComponent(TrainItemCtrl)
    //         comp.updateView(cfg.science_id)
    //         this.trainCtrls[index] = comp
    //     });
    //     this.curList = list;
    // }

    // _updateTechInfos() {
    //     for (let index = 0; index < this.trainCtrls.length; index++) {
    //         const ctrl = this.trainCtrls[index];
    //         ctrl.updateView(this.curList[index].science_id)
    //     }
    //     this._updateBYInfo()
    //     this._updateBtnState()
    // }

    // _updateBYInfo() {
    //     let byInfos = this.model.byInfos

    //     let curType = this.curType
    //     let curInfo: BarrackInfo = byInfos[curType]
    //     if (!curInfo) {
    //         return
    //     }

    //     let expCfg = ConfigManager.getItemByField(Barracks_lvCfg, "barracks_id", curType, { lv: curInfo.level + 1 })
    //     let maxExp = expCfg ? expCfg.exp : 0
    //     if (maxExp == 0) {
    //         this.lvLab.string = "LV.Max"
    //         this.expLab.string = "0/0"
    //         this.expPro.progress = 0
    //     } else {
    //         this.lvLab.string = `LV.${curInfo.level}`
    //         this.expLab.string = `${curInfo.exp}/${maxExp}`
    //         this.expPro.progress = curInfo.exp / maxExp
    //     }
    // }

    // /**
    //  * 红点逻辑
    //  */
    // redPointHandle(utype: any) {
    //     utype = parseInt(utype)
    //     // 第一项默认开启, 这里不做判断
    //     if (utype > 0 && !this.openState[utype]) {
    //         return false;
    //     }
    //     return RedPointUtils.is_can_barracks_practice(this.curType, utype);
    // }
}
