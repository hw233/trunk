
/** 
 * @Description: 神器界面
 * @Author: weiliang.huang  
 * @Date: 2019-05-14 11:29:36 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-08-19 15:48:45
 */
const { ccclass, property, menu } = cc._decorator;

const _PreNames = ["GAttPanel", "GWeaponPanel"]

@ccclass
@menu("qszc/view/general/GeneralViewCtrl")
export default class GeneralViewCtrl extends gdk.BasePanel {

    // @property(cc.Node)
    // downMask: cc.Node = null;

    // @property(cc.Label)
    // nameLab: cc.Label = null

    // @property(cc.Label)
    // fightLab: cc.Label = null

    // @property(cc.Label)
    // lvLab: cc.Label = null

    // @property(cc.Label)
    // proLab: cc.Label = null

    // @property(cc.ProgressBar)
    // expPro: cc.ProgressBar = null

    // @property(cc.Button)
    // selectBtns: Array<cc.Button> = [];

    // downPanels: Array<cc.Node> = [];
    // panelIndex: number = 0;

    // get model(): GeneralModel { return ModelManager.get(GeneralModel); }
    // get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    // onLoad() {
    //     this.title = 'i18n:GENERAL_TITLE'
    //     gdk.e.on(GeneralEventId.RSP_CHANGE_WEAPON, this._updateUpInfo, this)
    // }

    // start() {
    //     this.selectFunc(null, 0)
    // }

    // onDestroy() {
    //     gdk.e.targetOff(this)
    //     // GlobalUtil.updateMainDockState(0)
    // }

    // // update (dt) {}
    // _createPanel(index) {
    //     let preName = _PreNames[index]
    //     let path = `view/general/prefab/${preName}`
    //     let resId = gdk.Tool.getResIdByNode(this.node)
    //     gdk.rm.loadRes(resId, path, cc.Prefab, (prefab: cc.Prefab) => {
    //         let panel = cc.instantiate(prefab)
    //         panel.parent = this.downMask
    //         panel.setPosition(cc.v2(0, -25))

    //         panel.active = index == this.panelIndex

    //         this.downPanels[index] = panel
    //     })
    // }

    // /**面板选择显示 */
    // selectFunc(e, utype) {
    //     utype = parseInt(utype)
    //     if (this.downPanels[this.panelIndex]) {
    //         this.downPanels[this.panelIndex].active = false
    //     }
    //     this.panelIndex = utype
    //     if (!this.downPanels[utype]) {
    //         this._createPanel(utype)
    //     } else {
    //         this.downPanels[utype].active = true
    //     }

    //     for (let idx = 0; idx < this.selectBtns.length; idx++) {
    //         const element = this.selectBtns[idx];
    //         element.interactable = idx != this.panelIndex
    //         let lab = element.node.getChildByName("Label")
    //         let color = "#aca294"
    //         if (idx == utype) {
    //             color = "#ffeb91"
    //         }
    //         lab.color = cc.color(color)
    //     }
    //     // if (utype == 0) {
    //     //     GlobalUtil.updateMainDockState(0)
    //     // } else {
    //     //     GlobalUtil.updateMainDockState(1)
    //     // }
    // }

    // /**更新上侧面板 */
    // @gdk.binding("model.generalInfo")
    // _updateUpInfo() {
    //     if (!this.model.generalInfo) {
    //         return
    //     }
    //     let cfg = ConfigManager.getItemById(General_weaponCfg, this.model.generalInfo.weaponId)
    //     this.nameLab.string = cfg.name
    // }

    // /**更换武器 */
    // changeBtnFunc(e, utype) {
    //     utype = parseInt(utype)
    //     let wpList = this.model.wpList

    //     let msg = new GeneralChangeWeaponReq()
    //     msg.weaponId = wpList[utype].gweaponId
    //     NetManager.send(msg)
    // }

    // /**更新等级,经验信息 */
    // @gdk.binding("roleModel.exp")
    // @gdk.binding("roleModel.level")
    // _updateLevel() {
    //     let roleModel = this.roleModel
    //     let maxLv = ConfigManager.getItems(GeneralCfg).length
    //     this.lvLab.string = `${roleModel.level}`;
    //     let data = ConfigManager.getItemById(GeneralCfg, roleModel.level);
    //     let maxExp = data ? data.exp : 0
    //     if (roleModel.level >= maxLv) {
    //         this.proLab.string = "0%"
    //         this.expPro.progress = 0
    //     } else {
    //         let p = roleModel.exp / maxExp;
    //         p = Math.min(p, 1)
    //         this.expPro.progress = p;
    //         this.proLab.string = `${Math.floor(p * 100)}%`;
    //     }
    // }

    // /**更新战力 */
    // @gdk.binding("roleModel.power")
    // _updateFight() {
    //     this.fightLab.string = `${this.roleModel.power}`;
    // }
}
