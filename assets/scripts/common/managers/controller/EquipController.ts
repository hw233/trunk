import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import EquipModel from '../../models/EquipModel';
import EquipUtils from '../../utils/EquipUtils';
import GlobalUtil from '../../utils/GlobalUtil';
import ModelManager from '../ModelManager';

/**
 * @Description: 装备数据管理器
 * @Author: weiliang.huang
 * @Date: 2019-04-10 10:07:00
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-08 12:01:04
 */

export default class EquipController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return []
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.EquipListRsp.MsgType, this._onEquipListReq],
            [icmsg.EquipUpdateRsp.MsgType, this._onEquipUpdateRsp],
            [icmsg.EquipDisintRsp.MsgType, this._onEquipDisintRsp],
            [icmsg.UniqueEquipListRsp.MsgType, this._onUniqueEquipListRsp],
            [icmsg.UniqueEquipUpdateRsp.MsgType, this._onUniqueEquipUpdateRsp],
        ];
    }

    model: EquipModel = null

    onStart() {
        this.model = ModelManager.get(EquipModel)
        this.model.idItems = {}
        this.model.equipItems = []
    }

    onEnd() {

    }

    /**服务器返回装备数据 */
    _onEquipListReq(data: icmsg.EquipListRsp) {
        this.model.idItems = {}
        this.model.equipItems = []
        let list = data.list
        let len = list.length
        for (let index = 0; index < len; index++) {
            const element: icmsg.EquipInfo = list[index];
            EquipUtils.updateEquipInfo(element.equipId, element, len == index + 1)
        }
        GlobalUtil.sortArray(this.model.equipItems, (a, b) => {
            return a.series - b.series
        })
    }

    /**
     * 更新装备物品数据
     * @param item
     */
    _onEquipUpdateRsp(data: icmsg.EquipUpdateRsp) {
        // 添加或更新装备
        let list = data.list
        let len = list.length
        for (let index = 0; index < len; index++) {
            const element = list[index];
            if (element.equipNum == 0) {
                EquipUtils.removeEquipById(element.equipId);
            } else {
                EquipUtils.updateEquipInfo(element.equipId, element, len == index + 1)
            }
        }
        // 移除装备
        let delList = data.deleteList
        let len2 = delList.length
        for (let index = 0; index < len2; index++) {
            const itemId = delList[index];
            // 清除红点标记
            // RedPointUtils.update_bag_item(BagType.EQUIP, itemId, false)
            // EquipUtils.removeEquipById(itemId, len2 == index + 1)
            EquipUtils.removeEquipById(itemId);
        }
    }

    /**分解装备回调 */
    _onEquipDisintRsp(data: icmsg.EquipDisintRsp) {
        // BagUtils.receiveGoodInfo(data.list)
    }


    /**专属装备数据列表 */
    _onUniqueEquipListRsp(data: icmsg.UniqueEquipListRsp) {
        this.model.uniqueIdItems = {}
        this.model.uniqueEquipItems = []
        let list = data.equips
        let len = list.length
        for (let index = 0; index < len; index++) {
            const element: icmsg.UniqueEquip = list[index];
            EquipUtils.updateUniqueEquipInfo(element.id, element, len == index + 1)
        }
        GlobalUtil.sortArray(this.model.equipItems, (a, b) => {
            return a.series - b.series
        })
    }

    /**专属装备更新移除 */
    _onUniqueEquipUpdateRsp(data: icmsg.UniqueEquipUpdateRsp) {
        // 添加或更新装备
        let list = data.list
        let len = list.length
        for (let index = 0; index < len; index++) {
            const element = list[index];
            EquipUtils.updateUniqueEquipInfo(element.id, element, len == index + 1)
        }
        // 移除装备
        let delList = data.deleteList
        let len2 = delList.length
        for (let index = 0; index < len2; index++) {
            const itemId = delList[index];
            EquipUtils.removeUniqueEquipById(itemId);
        }
    }
}