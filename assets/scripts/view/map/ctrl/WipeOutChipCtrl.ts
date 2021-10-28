import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Item_composeCfg, ItemCfg } from '../../../a/config';

/**
 * 扫荡后 显示碎片合成效果 组件 
 * @Author: yaozu.hu
 * @Date: 2020-04-22 11:00:32
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 12:20:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/map/WipeOutChipCtrl")
export default class WipeOutChipCtrl extends cc.Component {

    @property(cc.Prefab)
    itemPreb: cc.Prefab = null;

    @property(cc.Node)
    chipNode: cc.Node = null;

    @property(UiSlotItem)
    chipItem: UiSlotItem = null;

    @property(cc.Label)
    chipNum: cc.Label = null;

    @property(cc.Label)
    chipName: cc.Label = null;

    @property(cc.Label)
    getNum: cc.Label = null;

    @property(cc.Node)
    composeNode: cc.Node = null;

    @property(UiSlotItem)
    composeItem: UiSlotItem = null;

    @property(cc.Label)
    composeName: cc.Label = null;

    @property(cc.Label)
    ownNum: cc.Label = null;

    @property(cc.Node)
    enoughTip: cc.Node = null;

    @property(cc.Node)
    needNumNode: cc.Node = null;

    _chipItemCfg: ItemCfg
    _chipCfg: Item_composeCfg
    _itemCfg: ItemCfg
    _getNum: number = 0
    _composeNum: number = 0
    _showTarget: boolean = false//是否显示目标扫荡道具的信息

    onEnable() {
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._onItemUpdateRsp, this)
    }


    _onItemUpdateRsp() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;

        this.chipItem.updateItemInfo(this._chipCfg.id)
        this.chipName.string = this._chipItemCfg.name
        this.chipName.node.color = BagUtils.getColor(this._chipItemCfg.color)
        this.chipNum.string = `${this._chipCfg.amount}`
        this.getNum.string = `${this._getNum}`

        this.chipItem.itemInfo = {
            series: this._chipCfg.id,
            itemId: this._chipCfg.id,
            itemNum: 1,
            type: BagUtils.getItemTypeById(this._chipCfg.id),
            extInfo: null
        }

        this.composeItem.updateItemInfo(this._itemCfg.id)
        this.composeName.string = this._itemCfg.name
        this.composeName.node.color = BagUtils.getColor(this._itemCfg.color)
        this.ownNum.string = `${BagUtils.getItemNumById(this._itemCfg.id)}`

        this.composeItem.itemInfo = {
            series: this._itemCfg.id,
            itemId: this._itemCfg.id,
            itemNum: 1,
            type: BagUtils.getItemTypeById(this._itemCfg.id),
            extInfo: null
        }

        if (this._showTarget) {
            let copyModel = ModelManager.get(CopyModel)
            let myItemNum = BagUtils.getItemNumById(copyModel.needItem.itemId)
            if (myItemNum >= copyModel.needItem.itemNum) {
                this.enoughTip.active = true
                this.needNumNode.active = false
            } else {
                this.enoughTip.active = false
                this.needNumNode.active = true
                let needNumLab = this.needNumNode.getChildByName("needNum").getComponent(cc.Label)
                let num = copyModel.needItem.itemNum - myItemNum;
                needNumLab.string = `${num}`
            }
        }

        if (this._composeNum > 0) {
            gdk.Timer.once(500, this, () => {
                this.composeNode.active = true
                this.flyChip(this._chipCfg.id, this._chipCfg.amount)
            })
        }
    }

    /**
     * 
     * @param itemId 物品id 碎片
     * @param num    获得数量
     */
    updateView(itemId, num, showTarget: boolean = false) {

        this.composeNode.active = false
        this._getNum = num
        this._showTarget = showTarget

        this._chipItemCfg = ConfigManager.getItemById(ItemCfg, itemId)
        this._chipCfg = ConfigManager.getItemById(Item_composeCfg, itemId)
        this._itemCfg = ConfigManager.getItemById(ItemCfg, this._chipCfg.target)
        let bagNum = BagUtils.getItemNumById(itemId)//已经是最新的数量了
        this._composeNum = Math.floor((bagNum) / this._chipCfg.amount)

        if (this._composeNum > 0) {
            let msg = new icmsg.ItemComposeReq()
            msg.stuffId = this._chipCfg.id
            msg.num = this._composeNum
            NetManager.send(msg)
        } else {
            this.chipItem.updateItemInfo(this._chipCfg.id)
            this.chipName.string = this._chipItemCfg.name
            this.chipName.node.color = BagUtils.getColor(this._chipItemCfg.color)
            this.chipNum.string = `${this._chipCfg.amount}`
            this.getNum.string = `${this._getNum}`

            this.chipItem.itemInfo = {
                series: this._chipCfg.id,
                itemId: this._chipCfg.id,
                itemNum: 1,
                type: BagUtils.getItemTypeById(this._chipCfg.id),
                extInfo: null
            }
        }
    }

    flyChip(chipId, num) {
        let self = this
        let startPos = this.node.convertToNodeSpaceAR(this.chipNode.convertToWorldSpaceAR(this.chipItem.node.position))
        let endPos = this.node.convertToNodeSpaceAR(this.composeNode.convertToWorldSpaceAR(this.composeItem.node.position))
        for (let i = 0; i < num - 1; i++) {
            let icon = cc.instantiate(this.itemPreb)
            icon.x = this.chipItem.node.x
            icon.y = this.chipItem.node.y
            let ctrl = icon.getComponent(UiSlotItem)
            ctrl.updateItemInfo(chipId)
            icon.parent = this.node
            let finshend = cc.callFunc(function () {
                icon.destroy()
            }, self);
            icon.runAction(cc.sequence(cc.moveTo(0.02 * i, startPos.x, startPos.y),
                cc.spawn(cc.moveTo(0.02 * i, endPos.x, endPos.y),
                    cc.scaleTo(0.01 * i, 0.5, 0.5)), finshend))
        }
    }

    onDisable() {
        gdk.Timer.clearAll(this)
        NetManager.targetOff(this)
    }

}