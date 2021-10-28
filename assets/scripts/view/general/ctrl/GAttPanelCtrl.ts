
/** 
 * @Description: 神器-总览界面
 * @Author: weiliang.huang  
 * @Date: 2019-05-14 11:29:43 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-08-19 15:48:57
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/general/GAttPanelCtrl")
export default class GAttPanelCtrl extends cc.Component {

    // @property(cc.Label)
    // attLabs: cc.Label[] = []

    // @property(cc.Sprite)
    // icons: cc.Sprite[] = []

    // @property(cc.Label)
    // lvLabs: cc.Label[] = []

    // @property(cc.Label)
    // nameLab: cc.Label = null

    // curWeapon: GweaponInfo = null

    // get model(): GeneralModel { return ModelManager.get(GeneralModel); }

    // onLoad() {
    //     gdk.e.on(GeneralEventId.RSP_CHANGE_WEAPON, this._updateSkillInfo, this)

    // }

    // onDestroy() {
    //     gdk.e.targetOff(this)
    // }

    // @gdk.binding("model.generalInfo")
    // _updateAttInfo() {
    //     if (!this.model.generalInfo) {
    //         return
    //     }
    //     // console.log("_updateAttInfo", this.model.generalInfo)
    //     let generalInfo = this.model.generalInfo
    //     let cfg = ConfigManager.getItemById(General_weaponCfg, generalInfo.weaponId)
    //     this.nameLab.string = "神器:" + cfg.name
    //     let attr: GeneralAttr = generalInfo.arr
    //     let keyNames = ["atkW", "hitW", "critW", "hurtW", "defPeneW", "speed", "atkSpeedW"]
    //     for (let index = 0; index < keyNames.length; index++) {
    //         let _key = keyNames[index];
    //         let lab = this.attLabs[index]
    //         let value = attr[_key] || 0
    //         lab.string = `${value}`
    //     }
    //     // this._updateSkillInfo()
    // }

    // @gdk.binding("model.wpList")
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
    //     // this.lvLabs[0].string = `${weapon.atkSkill.skillLv}`
    //     for (let index = 0; index < 4; index++) {
    //         let lv = weapon.skillLv[index + 1];
    //         let lab = this.lvLabs[index]
    //         lab.string = `${lv}`
    //     }
    //     this.curWeapon = weapon
    // }

    // _updateIconBySkill(icon: cc.Sprite, skillId: number) {
    //     // console.log("skillId", skillId)
    //     let resId = gdk.Tool.getResIdByNode(this.node)
    //     let path = GlobalUtil.getSkillIcon(skillId)
    //     gdk.rm.loadRes(resId, path, cc.SpriteFrame, (sp: cc.SpriteFrame) => {
    //         if (cc.isValid(this.node)) {
    //             icon.spriteFrame = sp
    //         }
    //     })
    // }
}
