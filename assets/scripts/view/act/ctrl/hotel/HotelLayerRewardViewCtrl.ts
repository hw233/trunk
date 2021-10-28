import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import MathUtil from '../../../../common/utils/MathUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Hotel_mapCfg } from '../../../../a/config';
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-12 16:20:52
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/hotel/HotelLayerRewardViewCtrl")
export default class HotelLayerRewardViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    leftLab: cc.Label = null;

    @property(cc.RichText)
    tipLab2: cc.RichText = null;

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    soltPrefab: cc.Prefab = null;

    _layer: number = 0

    get actType() {
        return ActUtil.getActRewardType(125)
    }

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    onEnable() {
        this._layer = this.args[0]
        this._updateViewInfo()
    }

    _updateViewInfo() {
        let cfg = ConfigManager.getItemByField(Hotel_mapCfg, "type", this.actType, { layer: this._layer })
        let itemId = cfg.reward[0][0]
        let num = cfg.reward[0][1]
        this.slotItem.updateItemInfo(itemId, num)
        this.slotItem.itemInfo = {
            series: 0,
            itemId: itemId,
            itemNum: 1,
            type: BagUtils.getItemTypeById(itemId),
            extInfo: null
        }

        let cleanNum = 0
        let layerInfo = this.actModel.hotelLayers[this._layer]
        if (layerInfo) {
            cleanNum = layerInfo.num
        }
        let leftNum = cfg.number - cleanNum
        this.leftLab.string = `(剩余${leftNum}份)`
        this.tipLab2.string = `本层打扫进度达到<color=#00ff00>${Math.floor((cfg.progress - 1) / cfg.number * 100)}%</c>时必定<color=#00ff00>解锁且打扫</c>下一层`
        let cfgs = ConfigManager.getItems(Hotel_mapCfg, { type: this.actType })
        this.tipLab2.node.active = this._layer < cfgs.length

        for (let i = 0; i < leftNum; i++) {
            let item = cc.instantiate(this.soltPrefab)
            item.scale = 0.4
            let ctrl = item.getComponent(UiSlotItem)
            ctrl.updateItemInfo(itemId, num)
            ctrl.itemInfo = {
                series: 0,
                itemId: itemId,
                itemNum: 1,
                type: BagUtils.getItemTypeById(itemId),
                extInfo: null
            }
            item.parent = this.content
            item.x = MathUtil.rnd(-230, 230)
            item.y = MathUtil.rnd(-10, 10)
        }
    }

}