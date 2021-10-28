import GuardianUtils from '../GuardianUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { AttrType } from '../../../../../common/utils/EquipUtils';
import { Guardian_equip_starCfg, Guardian_equipCfg } from '../../../../../a/config';

const { ccclass, property, menu } = cc._decorator;
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-20 17:52:38
 */

@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipBreakSuccessCtrl")
export default class GuardianEquipBreakSuccessCtrl extends gdk.BasePanel {

    @property(cc.Node)
    curNode: cc.Node = null

    @property(cc.Node)
    nextNode: cc.Node = null

    @property(cc.Label)
    curLv: cc.Label = null

    @property(cc.Label)
    nextLv: cc.Label = null

    @property(cc.Node)
    attPanel1: cc.Node = null

    @property(cc.Node)
    attPanel2: cc.Node = null

    @property(cc.Node)
    attNode: cc.Node = null

    _equipCfg: Guardian_equipCfg
    _starCfg: Guardian_equip_starCfg
    _extInfo: icmsg.GuardianEquip

    onEnable() {
        let args = this.args
        this._equipCfg = args[0]
        this._starCfg = args[1]
        this._extInfo = args[2]
        this.updateViewInfo()
    }

    updateViewInfo() {
        let curSlot = this.curNode.getChildByName("slotItem").getComponent(UiSlotItem)
        curSlot.updateItemInfo(this._equipCfg.id)
        let curStar = this.curNode.getChildByName("star").getComponent(cc.Label)
        curStar.string = "1".repeat(this._starCfg.star - 1)
        this.curLv.string = `${this._starCfg.limit - 10}`

        curSlot.updateStar(this._starCfg.star - 1)
        curSlot.starNum = this._starCfg.star - 1
        curSlot.node.getChildByName("lv").getComponent(cc.Label).string = '.' + (this._extInfo.level) + ''

        let nextSlot = this.nextNode.getChildByName("slotItem").getComponent(UiSlotItem)
        nextSlot.updateItemInfo(this._equipCfg.id)
        let nextStar = this.nextNode.getChildByName("star").getComponent(cc.Label)
        nextStar.string = "1".repeat(this._starCfg.star)
        this.nextLv.string = `${this._starCfg.limit}`

        nextSlot.updateStar(this._starCfg.star)
        nextSlot.starNum = this._starCfg.star
        nextSlot.node.getChildByName("lv").getComponent(cc.Label).string = '.' + (this._extInfo.level) + ''

        this._updateBreakAddAttr()
    }


    _updateBreakAddAttr() {
        for (let index = 0; index < this.attPanel1.childrenCount; index++) {
            const attNode = this.attPanel1.children[index];
            attNode.active = false
        }

        let preExtInfo = new icmsg.GuardianEquip()
        preExtInfo.id = this._extInfo.id
        preExtInfo.level = this._extInfo.level
        preExtInfo.star = this._extInfo.star - 1
        preExtInfo.type = this._extInfo.type

        let attrArr = GuardianUtils.getTargetEquipBreakAddAttr(preExtInfo)
        for (let index = 0; index < attrArr.length; index++) {
            const info: AttrType = attrArr[index];
            let attNode: cc.Node = this.attPanel1[index]
            if (!attNode) {
                attNode = cc.instantiate(this.attNode)
                attNode.parent = this.attPanel1
            }
            this._updateOneAtt(attNode, info)
        }

        let nextAttrArr = GuardianUtils.getTargetEquipBreakAddAttr(this._extInfo)
        for (let index = 0; index < this.attPanel2.childrenCount; index++) {
            const attNode = this.attPanel2.children[index];
            attNode.active = false
        }
        for (let index = 0; index < nextAttrArr.length; index++) {
            const info: AttrType = nextAttrArr[index];
            let attNode: cc.Node = this.attPanel2[index]
            if (!attNode) {
                attNode = cc.instantiate(this.attNode)
                attNode.parent = this.attPanel2
            }
            this._updateOneAtt(attNode, info)
        }
    }

    _updateOneAtt(attNode: cc.Node, info: AttrType) {
        let value = info.initValue
        if (value == 0) {
            attNode.active = false
            return
        }
        attNode.active = true
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        typeLab.string = info.name
        numLab.string = `+${value}`
    }

}